import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { calculateDiscount } from "../data/couponsData";

export const CartContext = createContext();

const initialAddresses = [
  {
    id: "addr-1",
    tag: "Home",
    isDefault: true,
    fullName: "Alex Morgan",
    mobile: "9876543210",
    houseFlat: "Flat 402, Sunshine Heights",
    street: "Sector 62, Electronic City",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201309"
  },
  {
    id: "addr-2",
    tag: "Work",
    isDefault: false,
    fullName: "Alex Morgan",
    mobile: "9876543210",
    houseFlat: "Tower B, 5th Floor",
    street: "Cyber City, DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002"
  }
];

const initialNotifications = [
  {
    id: "notif-1",
    title: "Flash Sale Live Now!",
    message: "Get up to 50% OFF on Margherita Pizza and Cheesy Burgers. Limited stock available.",
    time: "10m ago",
    category: "offers",
    read: false,
    link: "/shop?filter=flash"
  },
  {
    id: "notif-2",
    title: "Order #FGO-8921 Shipped",
    message: "Your rider Rahul Sharma is on the way to your location with your meal.",
    time: "25m ago",
    category: "orders",
    read: false,
    link: "/track/FGO-8921"
  },
  {
    id: "notif-3",
    title: "Price Drop Alert!",
    message: "Paneer Tikka Pizza dropped by ₹50! Grab yours before the sale ends.",
    time: "2h ago",
    category: "price_drop",
    read: true,
    link: "/product/3"
  },
  {
    id: "notif-4",
    title: "Free Delivery Unlocked!",
    message: "Enjoy Zero Delivery fee on your next 3 orders above ₹199 using code FREEDEL.",
    time: "1d ago",
    category: "offers",
    read: true,
    link: "/offers"
  }
];

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
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

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

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem("foodieGoAddresses");
    return saved ? JSON.parse(saved) : initialAddresses;
  });

  // Active Live Tracking Order
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(() => {
    const saved = localStorage.getItem("foodieGoActiveTrackOrder");
    return saved ? JSON.parse(saved) : null;
  });

  // Compare List (up to 4 products)
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem("foodieGoCompare");
    return saved ? JSON.parse(saved) : [];
  });

  // Recently Viewed Items
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem("foodieGoRecentlyViewed");
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("foodieGoNotifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Price Drop & Back in Stock Subscriptions
  const [priceDropAlerts, setPriceDropAlerts] = useState(() => {
    const saved = localStorage.getItem("foodieGoPriceAlerts");
    return saved ? JSON.parse(saved) : [];
  });
  const [backInStockAlerts, setBackInStockAlerts] = useState(() => {
    const saved = localStorage.getItem("foodieGoStockAlerts");
    return saved ? JSON.parse(saved) : [];
  });

  // Returns and Refunds Store
  const [returnRequests, setReturnRequests] = useState(() => {
    const saved = localStorage.getItem("foodieGoReturns");
    return saved ? JSON.parse(saved) : [
      {
        id: "RET-9042",
        orderId: "FGO-7612",
        itemName: "Schezwan Spicy Noodles",
        reason: "Item was lukewarm on arrival",
        pickupDate: "Tomorrow (10 AM - 1 PM)",
        refundMethod: "FoodieGo Wallet",
        refundAmount: 199,
        status: "Pickup Scheduled",
        date: "2026-09-08"
      }
    ];
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
    showToast(value ? "Pure Veg mode enabled!" : "Showing all dishes", "info");
  };

  const updateDeliveryLocation = (loc) => {
    setDeliveryLocation(loc);
    localStorage.setItem("foodieGoLocation", JSON.stringify(loc));
    showToast(`Delivering to ${loc.tag} (${loc.city || loc.pincode})`, "success");
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

  // Add To Cart (supports custom options and variants)
  const addToCart = (food, customOptions = null, qtyToAdd = 1) => {
    const cartItemId = customOptions 
      ? `${food.id}-${customOptions.size?.name || 'def'}-${customOptions.crust?.name || 'def'}-${(customOptions.addOns || []).map(a => a.name).join('_')}`
      : `${food.id}`;

    const itemPriceNum = Number(String(food.price).replace("₹", "")) + (customOptions?.extraPrice || 0);
    const itemPriceStr = `₹${itemPriceNum}`;

    const existingIndex = cart.findIndex((item) => item.cartItemId === cartItemId || (!item.cartItemId && item.id === food.id && !customOptions));
    let updatedCart;

    if (existingIndex > -1) {
      updatedCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: (item.quantity || 1) + qtyToAdd } : item
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
          quantity: qtyToAdd,
        },
      ];
    }

    saveCartToStorage(updatedCart);
    showToast(`Added ${qtyToAdd > 1 ? `${qtyToAdd}x ` : ''}${food.name} to cart!`, "success");

    // Sync with backend if authenticated
    if (localStorage.getItem("foodieGoToken")) {
      api.post("/cart", {
        foodId: food.id,
        name: food.name + (customOptions ? ` (${customOptions.size?.name || 'Custom'})` : ''),
        price: itemPriceStr,
        rating: food.rating,
        image: food.image,
        category: food.category,
        quantity: qtyToAdd,
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
    setIsGiftWrap(false);
    setGiftMessage("");
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

  // Product Comparison Handlers
  const addToCompare = (product) => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast(`${product.name} is already in comparison!`, "info");
      return;
    }
    if (compareList.length >= 4) {
      showToast("You can compare up to 4 items at a time.", "warning");
      return;
    }
    const updated = [...compareList, product];
    setCompareList(updated);
    localStorage.setItem("foodieGoCompare", JSON.stringify(updated));
    showToast(`Added ${product.name} to comparison`, "success");
  };

  const removeFromCompare = (productId) => {
    const updated = compareList.filter((p) => p.id !== productId);
    setCompareList(updated);
    localStorage.setItem("foodieGoCompare", JSON.stringify(updated));
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("foodieGoCompare");
  };

  // Recently Viewed Tracker
  const addRecentlyViewed = (product) => {
    if (!product || !product.id) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem("foodieGoRecentlyViewed", JSON.stringify(updated));
      return updated;
    });
  };

  // Notifications Operations
  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("foodieGoNotifications", JSON.stringify(updated));
    showToast("All notifications marked as read", "info");
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
      ...notif
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem("foodieGoNotifications", JSON.stringify(updated));
  };

  // Price Drop & Stock Alert Subscriptions
  const subscribePriceDrop = (product) => {
    if (priceDropAlerts.includes(product.id)) {
      showToast(`You are already subscribed to price drops for ${product.name}!`, "info");
      return;
    }
    const updated = [...priceDropAlerts, product.id];
    setPriceDropAlerts(updated);
    localStorage.setItem("foodieGoPriceAlerts", JSON.stringify(updated));
    showToast(`Subscribed! We will notify you when ${product.name} drops in price.`, "success");
  };

  const subscribeBackInStock = (product) => {
    if (backInStockAlerts.includes(product.id)) {
      showToast(`You are already subscribed to back-in-stock alerts for ${product.name}!`, "info");
      return;
    }
    const updated = [...backInStockAlerts, product.id];
    setBackInStockAlerts(updated);
    localStorage.setItem("foodieGoStockAlerts", JSON.stringify(updated));
    showToast(`Alert set! We'll notify you as soon as ${product.name} is restocked.`, "success");
  };

  // Addresses Operations
  const addAddress = (newAddr) => {
    const item = { ...newAddr, id: `addr-${Date.now()}` };
    let updated;
    if (item.isDefault) {
      updated = savedAddresses.map((a) => ({ ...a, isDefault: false }));
      updated.push(item);
    } else {
      updated = [...savedAddresses, item];
    }
    setSavedAddresses(updated);
    localStorage.setItem("foodieGoAddresses", JSON.stringify(updated));
    showToast("Address saved successfully!", "success");
  };

  const removeAddress = (id) => {
    const updated = savedAddresses.filter((a) => a.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem("foodieGoAddresses", JSON.stringify(updated));
    showToast("Address removed", "info");
  };

  const setDefaultAddress = (id) => {
    const updated = savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === id
    }));
    setSavedAddresses(updated);
    localStorage.setItem("foodieGoAddresses", JSON.stringify(updated));
    const target = updated.find((a) => a.id === id);
    if (target) {
      updateDeliveryLocation({
        tag: target.tag,
        address: `${target.houseFlat}, ${target.street}`,
        city: `${target.city}, ${target.state}`,
        pincode: target.pincode
      });
    }
  };

  // Submit Return Request
  const submitReturnRequest = (requestData) => {
    const newReq = {
      id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      status: "Pickup Scheduled",
      ...requestData
    };
    const updated = [newReq, ...returnRequests];
    setReturnRequests(updated);
    localStorage.setItem("foodieGoReturns", JSON.stringify(updated));
    showToast(`Return Request #${newReq.id} submitted successfully!`, "success");
    return newReq;
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
  const giftWrapFee = isGiftWrap ? 30 : 0;

  let couponDiscount = 0;
  if (appliedCoupon && itemTotal > 0) {
    const calc = calculateDiscount(appliedCoupon.code, itemTotal, rawDeliveryFee);
    if (calc.isValid) {
      couponDiscount = calc.discount;
    }
  }

  const finalTotal = Math.max(
    0,
    itemTotal + rawDeliveryFee + platformFee + gstAndTaxes + expressFee + driverTip + giftWrapFee - couponDiscount
  );

  const startOrderTracking = (order) => {
    setActiveTrackingOrder(order);
    localStorage.setItem("foodieGoActiveTrackOrder", JSON.stringify(order));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

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
        giftWrapFee,
        couponDiscount,
        finalTotal,
        // Coupons
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        // Tips & Instructions & Gift Wrap
        driverTip,
        setDriverTip,
        cookingInstructions,
        setCookingInstructions,
        deliverySpeed,
        setDeliverySpeed,
        isGiftWrap,
        setIsGiftWrap,
        giftMessage,
        setGiftMessage,
        // Pure Veg & Location
        isPureVegOnly,
        updatePureVegFilter,
        deliveryLocation,
        updateDeliveryLocation,
        // Saved Addresses
        savedAddresses,
        addAddress,
        removeAddress,
        setDefaultAddress,
        // Toast
        toast,
        showToast,
        // Live Tracking
        activeTrackingOrder,
        startOrderTracking,
        setActiveTrackingOrder,
        // Compare System
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        // Recently Viewed
        recentlyViewed,
        addRecentlyViewed,
        // Notifications
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        addNotification,
        // Subscriptions
        priceDropAlerts,
        subscribePriceDrop,
        backInStockAlerts,
        subscribeBackInStock,
        // Returns
        returnRequests,
        submitReturnRequest
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;