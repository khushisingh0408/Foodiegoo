import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieGoCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const token = localStorage.getItem("foodieGoToken");

  // Save to localStorage helper
  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("foodieGoCart", JSON.stringify(updatedCart));
  };

  // Fetch Cart from Backend SQL Database
  const fetchBackendCart = useCallback(async () => {
    const currentToken = localStorage.getItem("foodieGoToken");
    if (!currentToken) return;

    const res = await api.get("/cart");
    if (res.success && Array.isArray(res.cart)) {
      setCart(res.cart);
      localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
    }
  }, []);

  // Sync / Load on token change
  useEffect(() => {
    const currentToken = localStorage.getItem("foodieGoToken");
    if (currentToken) {
      const localCart = JSON.parse(localStorage.getItem("foodieGoCart") || "[]");
      if (localCart.length > 0) {
        // Sync local items to SQL database
        api.post("/cart/sync", { localCart }).then((res) => {
          if (res.success && res.cart) {
            setCart(res.cart);
            localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
          }
        });
      } else {
        fetchBackendCart();
      }
    }
  }, [token, fetchBackendCart]);

  // Add To Cart
  const addToCart = async (food) => {
    const existingIndex = cart.findIndex((item) => item.id === food.id);
    let updatedCart;

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }];
    }

    saveCartToStorage(updatedCart);

    // Sync with SQL backend if authenticated
    if (localStorage.getItem("foodieGoToken")) {
      const res = await api.post("/cart", {
        foodId: food.id,
        name: food.name,
        price: food.price,
        rating: food.rating,
        image: food.image,
        category: food.category,
        quantity: 1,
      });

      if (res.success && res.cart) {
        setCart(res.cart);
        localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
      }
    }
  };

  // Increase Quantity
  const increaseQuantity = async (id) => {
    const currentItem = cart.find((item) => item.id === id);
    const newQty = (currentItem?.quantity || 1) + 1;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );

    saveCartToStorage(updatedCart);

    if (localStorage.getItem("foodieGoToken")) {
      const res = await api.put(`/cart/${id}`, { quantity: newQty });
      if (res.success && res.cart) {
        setCart(res.cart);
        localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
      }
    }
  };

  // Decrease Quantity
  const decreaseQuantity = async (id) => {
    const currentItem = cart.find((item) => item.id === id);
    const newQty = (currentItem?.quantity || 1) - 1;

    const updatedCart = cart
      .map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
      .filter((item) => item.quantity > 0);

    saveCartToStorage(updatedCart);

    if (localStorage.getItem("foodieGoToken")) {
      const res = await api.put(`/cart/${id}`, { quantity: newQty });
      if (res.success && res.cart) {
        setCart(res.cart);
        localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
      }
    }
  };

  // Remove single item from cart
  const removeFromCart = async (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCartToStorage(updatedCart);

    if (localStorage.getItem("foodieGoToken")) {
      const res = await api.delete(`/cart/${id}`);
      if (res.success && res.cart) {
        setCart(res.cart);
        localStorage.setItem("foodieGoCart", JSON.stringify(res.cart));
      }
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    setCart([]);
    localStorage.removeItem("foodieGoCart");

    if (localStorage.getItem("foodieGoToken")) {
      await api.delete("/cart");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        fetchBackendCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;