import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import api from "../services/api";
import "../css/Orders.css";

function Orders() {
  const { addToCart, showToast } = useContext(CartContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState(() => {
    return JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const res = await api.get("/orders");
      if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
        setOrders(res.orders);
        localStorage.setItem("foodieGoOrders", JSON.stringify(res.orders));
      }
      setLoading(false);
    }

    loadOrders();
  }, []);

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        addToCart(item);
      });
      showToast(`Added ${order.items.length} items from Order #${order.id} to cart! 🛒`, "success");
      navigate("/cart");
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>My Orders & Receipts 📦</h1>
          <p>Track ongoing deliveries or re-order your favorite meals</p>
        </div>
        <Link to="/" className="order-more-btn">
          Explore Menu 🍔
        </Link>
      </div>

      {loading && (
        <div className="orders-loading-state">
          <p>Fetching your verified orders from server... ⏳</p>
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <div className="orders-empty-state">
          <div className="empty-orders-art">📦</div>
          <h2>No Orders Placed Yet</h2>
          <p>You haven't placed any orders yet. Discover hot delicious meals from top restaurants!</p>
          <Link to="/" className="start-ordering-btn">
            Order Now 🍕
          </Link>
        </div>
      ) : (
        <div className="orders-cards-list">
          {orders.map((order, idx) => {
            const isLive = order.status !== "Delivered" && idx === 0;

            return (
              <div className={`order-history-card ${isLive ? "live-order-card" : ""}`} key={order.id || idx}>
                {/* Header */}
                <div className="order-card-header">
                  <div className="order-id-group">
                    <div className="rest-icon-box">🏬</div>
                    <div>
                      <h3>Order #{order.id}</h3>
                      <span className="order-date-txt">
                        {order.date ? new Date(order.date).toLocaleString() : "Recent Order"}
                      </span>
                    </div>
                  </div>

                  <div className="status-and-track-btn">
                    <span className={`order-status-badge ${isLive ? "status-live" : "status-delivered"}`}>
                      {isLive ? "🛵 Out for Delivery" : order.status || "Delivered"}
                    </span>

                    <Link to={`/track/${order.id}`} className="track-link-btn">
                      Live Map 🗺️
                    </Link>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="order-card-items-box">
                  <div className="items-title">Items Ordered:</div>
                  <div className="order-items-grid">
                    {order.items?.map((item, i) => (
                      <div className="order-item-pill" key={i}>
                        <span className="item-name-qty">{item.name} × {item.quantity || 1}</span>
                        <span className="item-price-tag">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="order-delivery-meta">
                  <div className="del-info-col">
                    <small>DELIVERY ADDRESS</small>
                    <p>{order.deliveryAddress || "Sector 62, Noida"}</p>
                  </div>
                  <div className="del-info-col">
                    <small>PAYMENT METHOD</small>
                    <p>{order.paymentMethod || "UPI"}</p>
                  </div>
                  <div className="del-info-col">
                    <small>TOTAL PAID</small>
                    <p className="order-total-bold">₹{order.total}</p>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="order-card-footer">
                  <button
                    className="reorder-action-btn"
                    onClick={() => handleReorder(order)}
                  >
                    🔁 Re-Order Meal
                  </button>

                  <Link to={`/track/${order.id}`} className="view-tracking-btn">
                    View Live Tracker →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;