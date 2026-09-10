import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  Package,
  Zap,
  TrendingDown,
  Bike,
  ArrowRight
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/NotificationsPage.css";

function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useContext(CartContext);
  const [selectedFilter, setSelectedFilter] = useState("all"); // all | orders | offers | price_drop

  const filteredNotifs = notifications.filter((n) => {
    if (selectedFilter === "all") return true;
    return n.category === selectedFilter;
  });

  return (
    <div className="notifications-page-container">
      <div className="notif-page-header">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Notification Center ({notifications.length}) <Bell size={24} color="#ff4757" />
          </h1>
          <p>Real-time delivery progress, exclusive offers, and price drops</p>
        </div>
        <button className="mark-all-read-btn" onClick={markAllNotificationsRead} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <Check size={14} /> Mark All as Read
        </button>
      </div>

      {/* Filter Chips */}
      <div className="notif-filters-bar">
        <button
          className={`notif-filter-chip ${selectedFilter === "all" ? "active" : ""}`}
          onClick={() => setSelectedFilter("all")}
        >
          All ({notifications.length})
        </button>
        <button
          className={`notif-filter-chip ${selectedFilter === "orders" ? "active" : ""}`}
          onClick={() => setSelectedFilter("orders")}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <Package size={14} /> Orders & Deliveries
        </button>
        <button
          className={`notif-filter-chip ${selectedFilter === "offers" ? "active" : ""}`}
          onClick={() => setSelectedFilter("offers")}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <Zap size={14} /> Offers & Flash Deals
        </button>
        <button
          className={`notif-filter-chip ${selectedFilter === "price_drop" ? "active" : ""}`}
          onClick={() => setSelectedFilter("price_drop")}
          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
        >
          <TrendingDown size={14} /> Price Drop Alerts
        </button>
      </div>

      {/* Notifications List */}
      <div className="notif-feed-list">
        {filteredNotifs.length === 0 ? (
          <div className="empty-notifs-state">
            <div className="empty-bell" style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
              <Bell size={48} color="#94a3b8" />
            </div>
            <h3>No notifications in this category</h3>
            <p>You're all caught up with your latest food orders!</p>
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div className={`notif-feed-item ${!item.read ? "unread" : ""}`} key={item.id}>
              <div className="notif-item-left-icon">
                {item.category === "orders" ? (
                  <Bike size={18} color="#ff4757" />
                ) : item.category === "price_drop" ? (
                  <TrendingDown size={18} color="#10b981" />
                ) : (
                  <Zap size={18} color="#f59e0b" />
                )}
              </div>
              <div className="notif-item-body">
                <div className="notif-title-row">
                  <strong>{item.title}</strong>
                  <span className="notif-timestamp">{item.time}</span>
                </div>
                <p>{item.message}</p>
              </div>
              {item.link && (
                <Link to={item.link} className="notif-action-btn" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  View <ArrowRight size={13} />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;
