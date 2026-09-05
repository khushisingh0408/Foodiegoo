import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Orders.css";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const res = await api.get("/orders");
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
        localStorage.setItem("foodieGoOrders", JSON.stringify(res.orders));
      }
      setLoading(false);
    }

    loadOrders();
  }, []);

  return (
    <section className="orders-page">
      <h1>My Orders 📦</h1>

      {loading && (
        <div style={{ textAlign: "center", padding: "30px", color: "#666" }}>
          <p>Fetching your order history from database... ⏳</p>
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <div className="orders-empty" style={{ textAlign: "center", padding: "50px 20px" }}>
          <h2>No orders placed yet 😔</h2>
          <p style={{ margin: "15px 0", color: "#666" }}>
            Hungry? Discover our hot and delicious menu items now!
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              background: "#ff6b35",
              color: "white",
              padding: "12px 28px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Order Now 🍕
          </Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <h2>Order #{order.id}</h2>
                <span
                  style={{
                    background: "#e0f2fe",
                    color: "#0369a1",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {order.status || "Order Placed"}
                </span>
              </div>

              <p>
                <strong>Date:</strong> {order.date ? new Date(order.date).toLocaleString() : new Date().toLocaleString()}
              </p>

              {order.customerName && (
                <p>
                  <strong>Customer:</strong> {order.customerName} ({order.customerMobile})
                </p>
              )}

              {order.deliveryAddress && (
                <p>
                  <strong>Delivery To:</strong> {order.deliveryAddress}
                </p>
              )}

              {order.paymentMethod && (
                <p>
                  <strong>Payment:</strong> {order.paymentMethod}
                </p>
              )}

              <div className="order-items">
                <strong>Items Ordered:</strong>
                {order.items && order.items.map((food, idx) => (
                  <div className="order-item-row" key={food.id || idx}>
                    <span>{food.name} × {food.quantity}</span>
                    <span>{food.price}</span>
                  </div>
                ))}
              </div>

              <h3>Total: ₹{order.total}</h3>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;