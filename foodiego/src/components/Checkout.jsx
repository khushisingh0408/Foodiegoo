import "../css/Checkout.css";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill delivery details from user profile if available
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.phone && !mobile) setMobile(user.phone);
      if (user.address && !address) setAddress(user.address);
    }
  }, [user]);

  const totalPrice = cart.reduce(
    (total, food) =>
      total + Number(String(food.price).replace("₹", "")) * (food.quantity || 1),
    0
  );

  const handleOrder = async () => {
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      setMessage("Please fill all delivery details.");
      return;
    }

    if (mobile.trim().length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    const orderPayload = {
      customerName: name.trim(),
      customerMobile: mobile.trim(),
      deliveryAddress: address.trim(),
      paymentMethod,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "",
      })),
      total: totalPrice,
    };

    // Send to SQL backend
    const res = await api.post("/orders", orderPayload);

    if (res.success && res.order) {
      // Also save to local storage as fallback/cache
      const existingOrders =
        JSON.parse(localStorage.getItem("foodieGoOrders")) || [];
      localStorage.setItem(
        "foodieGoOrders",
        JSON.stringify([res.order, ...existingOrders])
      );

      clearCart();
      setMessage("Order placed & saved in SQL database! 🎉 Redirecting...");
      setIsSubmitting(false);

      setTimeout(() => {
        navigate("/orders");
      }, 1200);
    } else {
      // Offline fallback
      const fallbackOrder = {
        id: Date.now(),
        items: cart,
        total: totalPrice,
        date: new Date().toLocaleString(),
        status: "Order Placed",
      };

      const existingOrders =
        JSON.parse(localStorage.getItem("foodieGoOrders")) || [];
      localStorage.setItem(
        "foodieGoOrders",
        JSON.stringify([fallbackOrder, ...existingOrders])
      );

      clearCart();
      setMessage("Order placed successfully! 🎉 Redirecting...");
      setIsSubmitting(false);

      setTimeout(() => {
        navigate("/orders");
      }, 1200);
    }
  };

  return (
    <section className="checkout-page">
      <h1>Checkout 🛍️</h1>

      {cart.length === 0 ? (
        <div className="checkout-box" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h2>Your Cart is Empty 😔</h2>
          <p style={{ margin: "15px 0", color: "#666" }}>
            Add some delicious food to your cart before checking out.
          </p>
          <button
            className="place-order-btn"
            style={{ width: "auto", padding: "12px 30px", margin: "0 auto" }}
            onClick={() => navigate("/")}
          >
            Browse Menu 🍔
          </button>
        </div>
      ) : (
        <div className="checkout-box">
          <h2>Order Summary 🛒</h2>

          {cart.map((food) => (
            <div className="checkout-item" key={food.id}>
              <span>
                {food.name} × {food.quantity}
              </span>

              <span>
                ₹{Number(String(food.price).replace("₹", "")) * (food.quantity || 1)}
              </span>
            </div>
          ))}

          <div className="checkout-total">
            <h2>Total: ₹{totalPrice}</h2>
          </div>

          <h2>Delivery Details</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <textarea
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          ></textarea>

          <h2>Payment Method</h2>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="Cash on Delivery">Cash on Delivery 💵</option>
            <option value="UPI">UPI (Google Pay / PhonePe / Paytm) 📱</option>
            <option value="Card">Credit / Debit Card 💳</option>
          </select>

          <button
            className="place-order-btn"
            onClick={handleOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : `Place Order (₹${totalPrice})`}
          </button>

          {message && <p className="order-message">{message}</p>}
        </div>
      )}
    </section>
  );
}

export default Checkout;