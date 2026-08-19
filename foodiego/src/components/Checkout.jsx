import "../css/Checkout.css";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const totalPrice = cart.reduce(
    (total, food) =>
      total + Number(food.price.replace("₹", "")) * food.quantity,
    0
  );

  const handleOrder = () => {
    if (!name || !mobile || !address) {
      setMessage("Please fill all delivery details.");
      return;
    }

    if (mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    const newOrder = {
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
      JSON.stringify([...existingOrders, newOrder])
    );
    clearCart();
    setMessage("Order placed successfully! 🎉");

    setTimeout(() => {
      navigate("/");
    }, 1500);
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
                ₹{Number(food.price.replace("₹", "")) * food.quantity}
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
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <textarea
            placeholder="Enter your delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>

          <h2>Payment Method</h2>

          <select>
            <option>Cash on Delivery</option>
            <option>UPI</option>
            <option>Card</option>
          </select>

          <button className="place-order-btn" onClick={handleOrder}>
            Place Order
          </button>

          {message && <p className="order-message">{message}</p>}
        </div>
      )}
    </section>
  );
}

export default Checkout;