import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Zap,
  Receipt,
  MapPin,
  Bike,
  Package,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import "../css/OrderSuccess.css";

function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const ordersHistory = JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
    const matched = ordersHistory.find((o) => String(o.id) === String(orderId)) || ordersHistory[0];
    if (matched) {
      setOrder(matched);
    } else {
      setOrder({
        id: orderId || "FGO-8921",
        customerName: "Alex Morgan",
        deliveryAddress: "Flat 402, Sunshine Heights, Sector 62, Noida",
        paymentMethod: "UPI (Google Pay)",
        total: 598,
        items: [
          { name: "Margherita Pizza", quantity: 1, price: "₹299" },
          { name: "Molten Choco Lava Cake", quantity: 1, price: "₹129" },
          { name: "Peri-Peri Masala Fries", quantity: 1, price: "₹149" }
        ],
        date: new Date().toISOString()
      });
    }
  }, [orderId]);

  return (
    <div className="order-success-page">
      <div className="success-container">
        {/* Confetti Animation Icon */}
        <div className="confetti-bubble" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CheckCircle2 size={44} color="#10b981" />
        </div>

        <div className="success-badge-tag" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} /> ORDER PLACED SUCCESSFULLY
        </div>
        <h1>Thank You For Your Order!</h1>
        <p className="order-lead-msg">
          We have received your order. The kitchen has begun preparing your fresh meal!
        </p>

        {/* Order Quick ID Card */}
        <div className="order-meta-card">
          <div className="meta-col">
            <small>ORDER ID</small>
            <strong>#{order?.id || orderId}</strong>
          </div>
          <div className="meta-col">
            <small>ESTIMATED DELIVERY</small>
            <strong className="eta-highlight" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Zap size={14} color="#f59e0b" /> In 20-25 Mins
            </strong>
          </div>
          <div className="meta-col">
            <small>TOTAL PAID</small>
            <strong>₹{order?.total || 598}</strong>
          </div>
          <div className="meta-col">
            <small>PAYMENT</small>
            <span>{order?.paymentMethod || "UPI"}</span>
          </div>
        </div>

        {/* Receipt Breakdown Box */}
        <div className="success-receipt-box">
          <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            Order Details <Receipt size={18} color="#ff4757" />
          </h3>
          <div className="success-items-list">
            {order?.items?.map((item, idx) => (
              <div className="receipt-item-row" key={idx}>
                <span>{item.name} × {item.quantity || 1}</span>
                <strong>{item.price}</strong>
              </div>
            ))}
          </div>

          <div className="receipt-address-row">
            <small>DELIVERING TO:</small>
            <p style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={16} color="#ff4757" /> {order?.deliveryAddress || "Sector 62, Noida"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions-row">
          <Link to={`/track/${order?.id || orderId}`} className="track-order-cta-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Bike size={18} /> Track Live Delivery Map
          </Link>

          <Link to="/orders" className="view-orders-cta-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <Package size={18} /> View Order Receipts
          </Link>

          <Link to="/shop" className="continue-shopping-cta-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
