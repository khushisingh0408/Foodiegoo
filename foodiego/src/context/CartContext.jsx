import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { calculateDiscount } from "../data/couponsData";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("foodieGoCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Coupons, Tipping, and Instructions
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("foodieGoCoupon");
    return saved ? JSON.parse(saved) : null;
  });
  const [driverTip, setDriverTip] = useState(0);
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [deliverySpeed, setDeliverySpeed] = useState("standard"); // standard | express

  // Pure Veg Global Switch
  const [isPureVegOnly, setIsPureVegOnly] = useState(() => {
    return localStorage.getItem("foodieGoVegOnly") === "true";
  });

  // Location State
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    const saved = localStorage.getItem("foodieGoLocation");
    return saved ? JSON.parse(saved) : {
      tag: "Home",
      address: "Flat 402, Sunshine Heights, Sector 62, Noida",
      city: "Noida, Uttar Pradesh",
      pincode: "201309"
    };
  });

  // Active Live Tracking Order
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(() => {
    const saved = localStorage.getItem("foodieGoActiveTrackOrder");
    return saved ? JSON.parse(saved) : null;
  });

  // Global Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, duration);
  };

  const token = localStorage.getItem("foodieGoToken");

  // Save to localStorage helper
  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("foodieGoCart", JSON.stringify(updatedCart));
  };

  const updatePureVegFilter = (value) => {
    setIsPureVegOnly(value);
    localStorage.setItem("foodieGoVegOnly", String(value));
    showToast(value ? "🌱 Pure Veg mode enabled!" : "🍽️ Showing all dishes", "info");
  };

  const updateDeliveryLocation = (loc) => {
    setDeliveryLocation(loc);
    localStorage.setItem("foodieGoLocation", JSON.stringify(loc));
    showToast(`📍 Delivering to ${loc.tag} (${loc.city})`, "success");
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

  // Add To Cart (supports custom options)
  const addToCart = (food, customOptions = null) => {
    const cartItemId = customOptions 
      ? `${food.id}-${customOptions.size?.name || 'def'}-${customOptions.crust?.name || 'def'}-${(customOptions.addOns || []).map(a => a.name).join('_')}`
      : `${food.id}`;

    const itemPriceNum = Number(String(food.price).replace("₹", "")) + (customOptions?.extraPrice || 0);
    const itemPriceStr = `₹${itemPriceNum}`;

    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId || (!item.cartItemId && item.id === food.id && !customOptions));
    let updatedCart;

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...food,
          cartItemId,
          unitPrice: itemPriceNum,
          price: itemPriceStr,
          customOptions,
          quantity: 1,
        },
      ];
    }

    saveCartToStorage(updatedCart);
    showToast(`Added ${food.name} to cart! 🛒`, "success");

    // Sync with SQL backend if authenticated
    if (localStorage.getItem("foodieGoToken")) {
      api.post("/cart", {
        foodId: food.id,
        name: food.name + (customOptions ? ` (${customOptions.size?.name || 'Custom'})` : ''),
        price: itemPriceStr,
        rating: food.rating,
        image: food.image,
        category: food.category,
        quantity: 1,
      });
    }
  };

  // Get total quantity of a food item by base food.id across variants
  const getItemQuantity = (foodId) => {
    return cart
      .filter((item) => item.id === foodId)
      .reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  // Increase Quantity by cartItemId or id
  const increaseQuantity = (identifier) => {
    const updatedCart = cart.map((item) => {
      const match = item.cartItemId === identifier || item.id === identifier;
      return match ? { ...item, quantity: (item.quantity || 1) + 1 } : item;
    });

    saveCartToStorage(updatedCart);
  };

  // Decrease Quantity by cartItemId or id
  const decreaseQuantity = (identifier) => {
    const updatedCart = cart
      .map((item) => {
        const match = item.cartItemId === identifier || item.id === identifier;
        return match ? { ...item, quantity: (item.quantity || 1) - 1 } : item;
      })
      .filter((item) => item.quantity > 0);

    saveCartToStorage(updatedCart);
  };

  // Remove single item from cart
  const removeFromCart = (identifier) => {
    const updatedCart = cart.filter(
      (item) => item.cartItemId !== identifier && item.id !== identifier
    );
    saveCartToStorage(updatedCart);
    showToast("Item removed from cart", "info");
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDriverTip(0);
    setCookingInstructions("");
    localStorage.removeItem("foodieGoCart");
    localStorage.removeItem("foodieGoCoupon");

    if (localStorage.getItem("foodieGoToken")) {
      api.delete("/cart");
    }
  };

  // Apply Coupon Code
  const applyCouponCode = (code) => {
    const itemTotal = cart.reduce((total, item) => {
      const p = item.unitPrice || Number(String(item.price).replace("₹", ""));
      return total + p * (item.quantity || 1);
    }, 0);

    const deliveryFee = itemTotal >= 300 ? 0 : 40;
    const result = calculateDiscount(code, itemTotal, deliveryFee);

    if (result.isValid) {
      setAppliedCoupon({
        code: result.coupon.code,
        discount: result.discount,
        title: result.coupon.title,
        description: result.coupon.description,
      });
      localStorage.setItem("foodieGoCoupon", JSON.stringify(result.coupon));
      showToast(result.message, "success");
      return { success: true, message: result.message };
    } else {
      showToast(result.message || "Invalid coupon code", "error");
      return { success: false, message: result.message };
    }
  };

  // Remove Coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem("foodieGoCoupon");
    showToast("Coupon removed", "info");
  };

  // Financial Calculations
  const itemTotal = cart.reduce((total, item) => {
    const p = item.unitPrice || Number(String(item.price).replace("₹", ""));
    return total + p * (item.quantity || 1);
  }, 0);

  const rawDeliveryFee = itemTotal >= 300 || itemTotal === 0 ? 0 : 40;
  const platformFee = itemTotal > 0 ? 5 : 0;
  const gstAndTaxes = itemTotal > 0 ? Math.round(itemTotal * 0.05) : 0; // 5% GST
  const expressFee = deliverySpeed === "express" ? 25 : 0;

  let couponDiscount = 0;
  if (appliedCoupon && itemTotal > 0) {
    const calc = calculateDiscount(appliedCoupon.code, itemTotal, rawDeliveryFee);
    if (calc.isValid) {
      couponDiscount = calc.discount;
    }
  }

  const finalTotal = Math.max(
    0,
    itemTotal + rawDeliveryFee + platformFee + gstAndTaxes + expressFee + driverTip - couponDiscount
  );

  const startOrderTracking = (order) => {
    setActiveTrackingOrder(order);
    localStorage.setItem("foodieGoActiveTrackOrder", JSON.stringify(order));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        getItemQuantity,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        fetchBackendCart,
        // Bill Calculations
        itemTotal,
        deliveryFee: rawDeliveryFee,
        platformFee,
        gstAndTaxes,
        expressFee,
        couponDiscount,
        finalTotal,
        // Coupons
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        // Tips & Instructions
        driverTip,
        setDriverTip,
        cookingInstructions,
        setCookingInstructions,
        deliverySpeed,
        setDeliverySpeed,
        // Pure Veg & Location
        isPureVegOnly,
        updatePureVegFilter,
        deliveryLocation,
        updateDeliveryLocation,
        // Toast
        toast,
        showToast,
        // Live Tracking
        activeTrackingOrder,
        startOrderTracking,
        setActiveTrackingOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;