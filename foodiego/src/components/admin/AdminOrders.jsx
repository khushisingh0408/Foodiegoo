import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Clock,
  Printer,
  X,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Filter,
  Volume2,
  VolumeX,
  Radio,
  Sparkles
} from "lucide-react";

// Web Audio API synthesized pleasant chime
function playOrderChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    // Tone 1: 587.33 Hz (D5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    gain1.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(audioCtx.currentTime);
    osc1.stop(audioCtx.currentTime + 0.4);

    // Tone 2: 880 Hz (A5) slightly delayed
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.35, audioCtx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(audioCtx.currentTime + 0.12);
    osc2.stop(audioCtx.currentTime + 0.6);
  } catch {
    // Audio autoplay or context policy
  }
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [autoSync, setAutoSync] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastSyncedTime, setLastSyncedTime] = useState(new Date());

  const prevOrdersCountRef = useRef(null);
  const highestOrderIdRef = useRef(0);

  const fetchOrders = useCallback(async (isQuiet = false) => {
    try {
      if (!isQuiet) setLoading(true);
      const query = `?status=${encodeURIComponent(statusFilter)}&search=${encodeURIComponent(searchTerm)}`;
      const res = await api.get(`/admin/orders${query}`);
      if (res.success && res.orders) {
        const fetchedOrders = res.orders;
        
        // Detect new order arrival
        const maxId = fetchedOrders.reduce((max, o) => Math.max(max, Number(o.id) || 0), 0);
        if (highestOrderIdRef.current > 0 && maxId > highestOrderIdRef.current) {
          if (soundEnabled) {
            playOrderChime();
          }
          showToast(`🔔 New Live Order #${maxId} received in database!`, false);
        }

        highestOrderIdRef.current = maxId;
        prevOrdersCountRef.current = fetchedOrders.length;
        setOrders(fetchedOrders);
        setLastSyncedTime(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      if (!isQuiet) setLoading(false);
    }
  }, [statusFilter, searchTerm, soundEnabled]);

  // Initial load on filter change
  useEffect(() => {
    fetchOrders(false);
  }, [statusFilter]);

  // Real-time Database Auto-Sync Polling Interval (every 4 seconds)
  useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(() => {
      fetchOrders(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoSync, fetchOrders]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order #${orderId} marked as '${newStatus}'!`);
      } else {
        showToast(res.message || "Failed to update status", true);
      }
    } catch (err) {
      console.error("Status update error:", err);
      showToast("Network error updating status", true);
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const printInvoice = () => {
    window.print();
  };

  const filterTabs = [
    { label: "All Orders", value: "All" },
    { label: "Order Placed", value: "Order Placed" },
    { label: "Preparing", value: "Preparing" },
    { label: "Out for Delivery", value: "Out for Delivery" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#0f172a",
          color: "#fff",
          padding: "0.85rem 1.4rem",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Controls with Real-time DB Sync Controls */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Live Kitchen & Order Dispatch Hub
            </h2>
            {/* Real-time DB Live Badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              background: autoSync ? "#ecfdf5" : "#f1f5f9",
              border: autoSync ? "1px solid #a7f3d0" : "1px solid #cbd5e1",
              fontSize: "0.76rem",
              fontWeight: 700,
              color: autoSync ? "#059669" : "#64748b"
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: autoSync ? "#10b981" : "#94a3b8",
                boxShadow: autoSync ? "0 0 8px #10b981" : "none",
                display: "inline-block"
              }} />
              <span>{autoSync ? "Real-time DB Active (4s)" : "Auto-Sync Paused"}</span>
            </div>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
            Real-time live orders feed • Synced at {lastSyncedTime.toLocaleTimeString()}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playOrderChime();
            }}
            className="admin-btn admin-btn-secondary"
            style={{ padding: "0.5rem 0.8rem", fontSize: "0.8rem" }}
            title={soundEnabled ? "Mute Order Sound Alerts" : "Enable Order Sound Alerts"}
          >
            {soundEnabled ? <Volume2 size={16} color="#ff6b00" /> : <VolumeX size={16} color="#94a3b8" />}
            <span>{soundEnabled ? "Sound On" : "Muted"}</span>
          </button>

          {/* Auto-Sync Toggle */}
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`admin-btn ${autoSync ? "admin-btn-secondary" : "admin-btn-primary"}`}
            style={{ padding: "0.5rem 0.8rem", fontSize: "0.8rem" }}
          >
            <Radio size={16} className={autoSync ? "spin-animation" : ""} />
            <span>{autoSync ? "Live Polling On" : "Resume Sync"}</span>
          </button>

          {/* Manual Refresh */}
          <button
            onClick={() => fetchOrders(false)}
            disabled={loading}
            className="admin-btn admin-btn-secondary"
            style={{ padding: "0.5rem 0.8rem", fontSize: "0.8rem" }}
          >
            <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="admin-table-controls">
        <form onSubmit={handleSearchSubmit} className="admin-search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ border: "none", background: "none", cursor: "pointer", color: "#ff6b00", fontWeight: 700, fontSize: "0.82rem" }}>
            Search
          </button>
        </form>

        <div className="admin-filter-tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`admin-filter-btn ${statusFilter === tab.value ? "active" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Workflow Action</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                  <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                  <div>Fetching live orders...</div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 800, color: "#ff6b00", whiteSpace: "nowrap" }}>
                    #{order.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{order.customerName}</div>
                    <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Phone size={11} /> {order.customerMobile}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <MapPin size={11} style={{ display: "inline" }} /> {order.deliveryAddress}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "0.84rem", color: "#334155" }}>
                      {order.items && order.items.length > 0 ? (
                        <>
                          <span>{order.items[0].name} (x{order.items[0].quantity})</span>
                          {order.items.length > 1 && (
                            <span style={{ color: "#ff6b00", fontWeight: 700, marginLeft: "4px" }}>
                              +{order.items.length - 1} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span>Custom order</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>
                      {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(order.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                      {order.paymentMethod || "COD"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                    ₹{order.total}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{
                        padding: "0.4rem 0.6rem",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        border: "1px solid #cbd5e1",
                        background:
                          order.status === "Delivered" ? "#ecfdf5" :
                          order.status === "Preparing" ? "#fffbeb" :
                          order.status === "Out for Delivery" ? "#f5f3ff" :
                          order.status === "Cancelled" ? "#fef2f2" : "#eff6ff",
                        color:
                          order.status === "Delivered" ? "#059669" :
                          order.status === "Preparing" ? "#d97706" :
                          order.status === "Out for Delivery" ? "#7c3aed" :
                          order.status === "Cancelled" ? "#dc2626" : "#2563eb",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    {/* One-click Next Step Button */}
                    {order.status === "Order Placed" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "Preparing")}
                        className="admin-btn admin-btn-primary"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}
                      >
                        Start Prep <ChevronRight size={12} />
                      </button>
                    )}
                    {order.status === "Preparing" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "Out for Delivery")}
                        className="admin-btn"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem", background: "#8b5cf6", color: "#fff" }}
                      >
                        Dispatch <ChevronRight size={12} />
                      </button>
                    )}
                    {order.status === "Out for Delivery" && (
                      <button
                        onClick={() => handleStatusChange(order.id, "Delivered")}
                        className="admin-btn"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem", background: "#10b981", color: "#fff" }}
                      >
                        Mark Delivered <CheckCircle2 size={12} />
                      </button>
                    )}
                    {order.status === "Delivered" && (
                      <span style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 700 }}>
                        ✓ Completed
                      </span>
                    )}
                    {order.status === "Cancelled" && (
                      <span style={{ fontSize: "0.78rem", color: "#ef4444", fontWeight: 700 }}>
                        ✗ Cancelled
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="admin-icon-btn"
                      title="View & Print Order Invoice"
                    >
                      <Printer size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <ShoppingBag size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>No orders matching current filter</div>
                  <div style={{ fontSize: "0.82rem", marginTop: "4px" }}>Try selecting another tab or clearing the search box.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice / Receipt Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Official Tax Invoice</div>
              <button className="admin-toggle-btn" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="admin-invoice-box" id="printable-invoice">
              <div className="admin-invoice-header">
                <h3 style={{ fontSize: "1.4rem", fontWeight: 900, color: "#ff6b00", margin: "0 0 4px" }}>
                  FoodieGo Express
                </h3>
                <p style={{ margin: 0, fontSize: "0.78rem", color: "#64748b" }}>
                  Fresh Food Delivery • Order #{selectedOrder.id}
                </p>
                <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
                  Date: {new Date(selectedOrder.date).toLocaleString()}
                </div>
              </div>

              {/* Customer Info */}
              <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.84rem", border: "1px solid #e2e8f0" }}>
                <div><strong>Customer:</strong> {selectedOrder.customerName}</div>
                <div><strong>Mobile:</strong> {selectedOrder.customerMobile}</div>
                <div><strong>Delivery Address:</strong> {selectedOrder.deliveryAddress}</div>
                <div><strong>Payment:</strong> {selectedOrder.paymentMethod}</div>
                <div><strong>Status:</strong> <span style={{ fontWeight: 700, color: "#ff6b00" }}>{selectedOrder.status}</span></div>
              </div>

              {/* Items Table */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#64748b", borderBottom: "1px solid #cbd5e1", paddingBottom: "4px", marginBottom: "8px" }}>
                  Ordered Items
                </div>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="admin-invoice-item">
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{item.price}</strong>
                    </div>
                  ))
                ) : (
                  <div className="admin-invoice-item">
                    <span>Food Items</span>
                    <strong>₹{selectedOrder.total}</strong>
                  </div>
                )}
              </div>

              {/* Total Calculation */}
              <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "0.75rem" }}>
                <div className="admin-invoice-item" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  <span>Delivery Charges</span>
                  <span>FREE</span>
                </div>
                <div className="admin-invoice-item" style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  <span>Taxes & GST (Included)</span>
                  <span>₹0</span>
                </div>
                <div className="admin-invoice-total">
                  <span>Grand Total</span>
                  <span style={{ color: "#ff6b00" }}>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button onClick={() => setSelectedOrder(null)} className="admin-btn admin-btn-secondary">
                Close
              </button>
              <button onClick={printInvoice} className="admin-btn admin-btn-primary">
                <Printer size={16} />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
