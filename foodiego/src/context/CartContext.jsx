import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieGoCart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "foodieGoCart",
      JSON.stringify(updatedCart)
    );
  };

  const addToCart = (food) => {
    const existingItem = cart.find(
      (item) => item.id === food.id
    );

    if (existingItem) {
      const updatedCart = cart.map((item) =>
        item.id === food.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      saveCart(updatedCart);
    } else {
      const updatedCart = [
        ...cart,
        { ...food, quantity: 1 },
      ];

      saveCart(updatedCart);
    }
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("foodieGoCart");
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;