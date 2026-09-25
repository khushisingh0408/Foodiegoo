import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  Bike,
  CookingPot,
  CheckCircle2,
  Clock,
  Store,
  Home,
  ShieldCheck,
  Phone,
  MessageSquare,
  MapPin,
  Package,
  Send,
  X,
  Star,
  Play,
  Zap,
  BellOff,
  DoorClosed,
  Heart,
  Sparkles,
  Check,
  RefreshCw,
  Radio,
  Volume2,
  VolumeX,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/OrderTracking.css";

const stages = [
  {
    step: 1,
    statusKey: "Order Placed",
    title: "Order Confirmed",
    desc: "Your order has been received and verified by the kitchen.",
    time: "2 mins ago",
    icon: Store
  },
  {
    step: 2,
    statusKey: "Preparing",
    title: "Kitchen Preparing Food",
    desc: "Chef is cooking your fresh and hot gourmet meal.",
    time: "In Kitchen",
    icon: CookingPot
  },
  {
    step: 3,
    statusKey: "Out for Delivery",
    title: "Partner Picked Up & On the Way",
    desc: "Delivery partner Rahul Sharma is riding towards your destination.",
    time: "On the Way",
    icon: Bike
  },
  {
    step: 4,
    statusKey: "Delivered",
    title: "Order Delivered Safely",
    desc: "Package delivered. Enjoy your hot and fresh food!",
    time: "Completed",
    icon: CheckCircle2
  }
];

// Web Audio synthesizer for milestone notifications
function playTrackingChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch {}
}

function OrderTracking() {
  const { orderId } = useParams();
  const { activeTrackingOrder, showToast } = useContext(CartContext);

  const [dbOrder, setDbOrder] = useState(null);
  const [progress, setProgress] = useState(25); // 0 - 100
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isFastDemo, setIsFastDemo] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(22);
  const [lastLiveSync, setLastLiveSync] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const prevStatusRef = useRef(null);

  // Driver Chat Modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "driver", text: "Hello! I am assigned to your order. Will reach with hot food soon!", time: "Just now" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Post Delivery Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [driverRating, setDriverRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Map status string to index and percentage
  const mapStatusToProgress = useCallback((statusStr) => {
    switch (statusStr) {
      case "Order Placed":
        setCurrentStageIndex(0);
        setProgress(20);
        setEtaMinutes(25);
        break;
      case "Preparing":
        setCurrentStageIndex(1);
        setProgress(50);
        setEtaMinutes(18);
        break;
      case "Out for Delivery":
        setCurrentStageIndex(2);
        setProgress(80);
        setEtaMinutes(8);
        break;
      case "Delivered":
        setCurrentStageIndex(3);
        setProgress(100);
        setEtaMinutes(0);
        setShowRatingModal(true);
        break;
      case "Cancelled":
        setProgress(0);
        setEtaMinutes(0);
        break;
      default:
        setCurrentStageIndex(0);
        setProgress(20);
        setEtaMinutes(25);
    }
  }, []);

  // Fetch real order from SQL Database
  const fetchOrderFromDb = useCallback(async () => {
    if (!orderId) return;
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.success && res.order) {
        setDbOrder(res.order);
        setLastLiveSync(new Date());

        const newStatus = res.order.status;
        if (prevStatusRef.current && prevStatusRef.current !== newStatus) {
          if (soundEnabled) playTrackingChime();
          showToast(`Order status updated to "${newStatus}"!`, "info");
        }
        prevStatusRef.current = newStatus;
        mapStatusToProgress(newStatus);
      }
    } catch (err) {
      console.warn("Could not fetch order from DB:", err);
    }
  }, [orderId, soundEnabled, showToast, mapStatusToProgress]);

  useEffect(() => {
    fetchOrderFromDb();
    // Fast real-time poll every 2.5 seconds for instant admin status updates
    const interval = setInterval(fetchOrderFromDb, 2500);
    return () => clearInterval(interval);
  }, [fetchOrderFromDb]);

  // Direct Live Status Change Handler (Syncs directly with backend SQL database)
  const handleUpdateStatusLive = async (targetStatus) => {
    if (!orderId || isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: targetStatus });
      if (res.success) {
        if (soundEnabled) playTrackingChime();
        mapStatusToProgress(targetStatus);
        setDbOrder((prev) => (prev ? { ...prev, status: targetStatus } : prev));
        showToast(`Order status changed to "${targetStatus}" in database!`, "success");
      }
    } catch (err) {
      // Local fallback
      mapStatusToProgress(targetStatus);
      showToast(`Updated to ${targetStatus}`, "info");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const order = dbOrder || activeTrackingOrder || {
    id: orderId || "FGO-8921",
    customerName: "FoodieGo Customer",
    deliveryAddress: "Selected Delivery Address",
    items: [
      { name: "Margherita Pizza (Large)", quantity: 1, price: "₹449" },
      { name: "Peri Peri Masala Fries", quantity: 1, price: "₹169" },
      { name: "Chilled Coca-Cola", quantity: 2, price: "₹99" }
    ],
    total: 717,
    paymentMethod: "UPI (Google Pay)",
    restaurantName: "La Pino'z Pizza"
  };

  // Timer interval for demo mode simulation if not connected to live DB
  useEffect(() => {
    if (dbOrder) return; // Prioritize real database status

    const intervalTime = isFastDemo ? 1200 : 8000;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowRatingModal(true);
          return 100;
        }
        const next = Math.min(100, prev + (isFastDemo ? 20 : 5));
        
        // Calculate stage
        if (next < 25) setCurrentStageIndex(0);
        else if (next < 50) setCurrentStageIndex(1);
        else if (next < 75) setCurrentStageIndex(2);
        else if (next < 100) setCurrentStageIndex(3);
        else {
          setCurrentStageIndex(4);
          setShowRatingModal(true);
        }

        // ETA calculation
        setEtaMinutes(Math.max(1, Math.round(20 * (1 - next / 100))));
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isFastDemo, dbOrder]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: "Just now" }
    ]);
    setInputMessage("");

    // Simulated driver automated response
    setTimeout(() => {
      let driverReply = "Sure thing! I will take care of that.";
      if (userText.toLowerCase().includes("bell") || userText.toLowerCase().includes("ring")) {
        driverReply = "Understood! I will call you instead of ringing the doorbell.";
      } else if (userText.toLowerCase().includes("where") || userText.toLowerCase().includes("location")) {
        driverReply = "I am at the Sector 62 junction, arriving in about 4-5 minutes!";
      } else if (userText.toLowerCase().includes("door") || userText.toLowerCase().includes("leave")) {
        driverReply = "Got it! Will leave the parcel safely at your doorstep.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "driver", text: driverReply, time: "Just now" }
      ]);
    }, 1200);
  };

  const handleCallDriver = () => {
    showToast("Connecting call to Rahul Sharma (+91 98765-43210)...", "info", 4000);
  };

  const handleRatingSubmit = () => {
    setRatingSubmitted(true);
    showToast("Thank you! Your feedback has been submitted.", "success");
    setTimeout(() => {
      setShowRatingModal(false);
    }, 1200);
  };

  // Bike position calculation on SVG path
  const bikePercent = Math.min(95, Math.max(5, progress));

  return (
    <div className="order-tracking-page">
      {/* Top Bar with Live Sync & Controls */}
      <div className="tracking-top-bar">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Live Order Tracking <Bike size={24} color="#ff4757" />
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginTop: "4px" }}>
            <p style={{ margin: 0 }}>Order #{order.id} • {order.restaurantName || "FoodieGo Kitchen"}</p>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "0.74rem",
              fontWeight: 700,
              background: "#ecfdf5",
              color: "#059669",
              padding: "2px 8px",
              borderRadius: "12px",
              border: "1px solid #a7f3d0"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              Live DB Status: {dbOrder?.status || "In Transit"}
            </span>
            <small style={{ color: "#94a3b8", fontSize: "0.72rem" }}>
              Synced {lastLiveSync.toLocaleTimeString()}
            </small>
          </div>
        </div>

        <div className="tracking-controls-wrap" style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Sound Toggle */}
          <button
            className="demo-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playTrackingChime();
              showToast(soundEnabled ? "Sound muted" : "Live Sound Alerts Enabled!", "info");
            }}
            title={soundEnabled ? "Mute audio alerts" : "Enable sound alerts"}
            style={{ padding: "8px 12px" }}
          >
            {soundEnabled ? <Volume2 size={16} color="#ff5200" /> : <VolumeX size={16} color="#94a3b8" />}
          </button>

          {/* Manual Refresh */}
          <button
            className="demo-btn"
            onClick={() => {
              fetchOrderFromDb();
              showToast("Synced with database!", "success");
            }}
            title="Sync latest live status from database"
            style={{ padding: "8px 12px" }}
          >
            <RefreshCw size={15} />
          </button>

          {/* Fast Demo Toggle */}
          <button
            className={`demo-btn ${isFastDemo ? "active" : ""}`}
            onClick={() => {
              setIsFastDemo(!isFastDemo);
              showToast(
                !isFastDemo
                  ? "Fast-Forward Simulation Mode ON (10s cycle)"
                  : "Normal Real-Time Speed ON",
                "info"
              );
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {isFastDemo ? <><Zap size={14} /> Fast Sim ON</> : <><Play size={14} /> Simulate Fast-Forward</>}
          </button>
        </div>
      </div>

      {/* Live Interactive Status Controller Bar */}
      <div className="tracking-status-controller-bar" style={{
        background: "#ffffff",
        border: "1.5px solid #fed7aa",
        borderRadius: "16px",
        padding: "14px 18px",
        marginBottom: "24px",
        boxShadow: "0 4px 16px rgba(255, 82, 0, 0.06)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
          <strong style={{ fontSize: "0.86rem", color: "#9a3412", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <Radio size={14} color="#ea580c" /> Interactive Status Controller (Live SQL DB Sync)
          </strong>
          <small style={{ color: "#64748b", fontSize: "0.75rem" }}>
            Click any stage to update real-time delivery status in Database
          </small>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
          {[
            { label: "1. Placed", status: "Order Placed", icon: Store },
            { label: "2. Preparing", status: "Preparing", icon: CookingPot },
            { label: "3. Out for Delivery", status: "Out for Delivery", icon: Bike },
            { label: "4. Delivered", status: "Delivered", icon: CheckCircle2 }
          ].map((btn) => {
            const isCurrentActive = (dbOrder?.status || stages[currentStageIndex]?.statusKey) === btn.status;
            const BtnIcon = btn.icon;
            return (
              <button
                key={btn.status}
                disabled={isUpdatingStatus}
                onClick={() => handleUpdateStatusLive(btn.status)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: isCurrentActive ? "2px solid #ff5200" : "1.5px solid #e2e8f0",
                  background: isCurrentActive ? "#ff5200" : "#f8fafc",
                  color: isCurrentActive ? "#ffffff" : "#334155",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
              >
                <BtnIcon size={14} />
                <span>{btn.label}</span>
                {isCurrentActive && <Check size={13} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Map + Right Lifecycle */}
      <div className="tracking-grid">
        {/* Left Column: Live Animated Map & Driver Info */}
        <div className="map-column">
          <div className="map-card">
            {/* Live GPS Radar Map */}
            <div className="gps-map-canvas">
              <div className="map-bg-grid" />
              
              {/* Animated Map SVG Route */}
              <svg className="route-svg" viewBox="0 0 500 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff5200" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                {/* Background Route Path */}
                <path
                  d="M 50 180 Q 180 40 320 160 T 450 60"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Active Animated Progress Route */}
                <path
                  d="M 50 180 Q 180 40 320 160 T 450 60"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="8"
                  strokeDasharray="600"
                  strokeDashoffset={600 - (600 * progress) / 100}
                  strokeLinecap="round"
                  className="animated-route-stroke"
                />
              </svg>

              {/* Restaurant Marker */}
              <div className="map-marker restaurant-marker" style={{ left: "40px", top: "140px" }}>
                <span className="marker-icon"><Store size={18} color="#ff4757" /></span>
                <span className="marker-label">Kitchen</span>
              </div>

              {/* Customer Home Marker */}
              <div className="map-marker home-marker" style={{ right: "30px", top: "35px" }}>
                <span className="marker-icon"><Home size={18} color="#10b981" /></span>
                <span className="marker-label">Your Home</span>
                <div className="pulse-ring" />
              </div>

              {/* Moving Delivery Partner Bike Marker */}
              <div
                className="map-marker bike-marker"
                style={{
                  left: `calc(${bikePercent}% - 22px)`,
                  top: `calc(130px - ${Math.sin((bikePercent / 100) * Math.PI) * 70}px)`
                }}
              >
                <div className="bike-icon-box" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bike size={18} color="#fff" />
                </div>
                <span className="driver-name-tag">Rahul • {etaMinutes}m</span>
              </div>

              {/* Live Floating Status Overlay */}
              <div className="floating-eta-banner">
                <div className="eta-badge">
                  <span className="live-dot" />
                  <span>{progress >= 100 ? "DELIVERED" : `ARRIVING IN ${etaMinutes} MINS`}</span>
                </div>
                <small className="distance-txt">
                  {progress >= 100 ? "0 km • Completed" : `${((100 - progress) * 0.04).toFixed(1)} km away • On time`}
                </small>
              </div>
            </div>

            {/* Delivery Partner Card */}
            <div className="driver-profile-card">
              <div className="driver-avatar-wrap">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Delivery Partner Rahul Sharma"
                />
                <span className="verified-check"><Check size={12} /></span>
              </div>

              <div className="driver-details">
                <div className="driver-name-row">
                  <h4>Rahul Sharma</h4>
                  <span className="driver-rating" style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    <Star size={13} fill="#f59e0b" stroke="#f59e0b" /> 4.9
                  </span>
                </div>
                <p className="driver-sub">Hero Splendor • DL 04 AB 1234</p>
                <div className="driver-safety-badge">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={14} color="#10b981" /> 100% Sanitized & Vaccinated
                  </span>
                </div>
              </div>

              <div className="driver-action-buttons">
                <button
                  className="call-driver-btn"
                  onClick={handleCallDriver}
                  title="Call Delivery Partner"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <Phone size={14} /> Call
                </button>
                <button
                  className="chat-driver-btn"
                  onClick={() => setIsChatOpen(true)}
                  title="Chat with Driver"
                  style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <MessageSquare size={14} /> Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Lifecycle Timeline & Summary */}
        <div className="timeline-column">
          <div className="status-timeline-card">
            <h3>Order Status Progression</h3>

            <div className="timeline-list">
              {stages.map((st, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const StageIcon = st.icon;

                return (
                  <div
                    key={idx}
                    className={`timeline-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="timeline-icon-wrap">
                      {isCompleted ? <Check size={14} /> : idx + 1}
                    </div>

                    <div className="timeline-content">
                      <div className="timeline-title-row">
                        <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <StageIcon size={16} color={isCurrent ? "#ff5200" : isCompleted ? "#10b981" : "#94a3b8"} />
                          {st.title}
                        </h4>
                        <span className="stage-time">{st.time}</span>
                      </div>
                      <p>{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="delivery-address-box">
              <strong style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <MapPin size={15} color="#ff4757" /> Delivery Destination:
              </strong>
              <p>{order.deliveryAddress}</p>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="order-receipt-card">
            <div className="receipt-header">
              <div>
                <h3 style={{ margin: "0 0 2px" }}>Receipt breakdown ({order.items?.length || 0} items)</h3>
                {order.razorpayPaymentId && (
                  <small style={{ color: "#16a34a", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={12} /> Razorpay ID: {order.razorpayPaymentId}
                  </small>
                )}
              </div>
              <span className="payment-pill">{order.paymentMethod || "UPI"}</span>
            </div>

            <div className="receipt-items-list">
              {order.items?.map((item, idx) => (
                <div className="receipt-row" key={idx}>
                  <span>{item.name} × {item.quantity}</span>
                  <strong>{item.price}</strong>
                </div>
              ))}
            </div>

            <div className="receipt-total-row">
              <span>Paid Total:</span>
              <strong>₹{order.total}</strong>
            </div>

            <Link to="/orders" className="view-all-orders-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              View Order History <Package size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Driver Chat Popup Modal */}
      {isChatOpen && (
        <div className="chat-modal-overlay" onClick={() => setIsChatOpen(false)}>
          <div className="chat-box-container" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
              <div className="chat-driver-info">
                <span className="online-dot" />
                <div>
                  <strong>Rahul Sharma (Delivery Partner)</strong>
                  <small>Hero Splendor • DL 04 AB 1234</small>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-messages-area">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender}`}>
                  <div className="bubble-text">{msg.text}</div>
                  <span className="bubble-time">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="quick-suggestions-row">
              <button onClick={() => setInputMessage("Please don't ring the bell, baby is sleeping.")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Don't ring bell <BellOff size={13} />
              </button>
              <button onClick={() => setInputMessage("Please leave the order at the door.")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Leave at door <DoorClosed size={13} />
              </button>
              <button onClick={() => setInputMessage("Where have you reached?")} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Where are you? <MapPin size={13} />
              </button>
            </div>

            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message to Rahul..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={!inputMessage.trim()} style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Send <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Post-Delivery Rating & Review Modal */}
      {showRatingModal && (
        <div className="rating-modal-overlay">
          <div className="rating-modal-box">
            <div className="confetti-emoji" style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "10px 0" }}>
              <Sparkles size={40} color="#ff4757" />
            </div>
            <h2>Order Delivered Successfully!</h2>
            <p>We hope you enjoy your delicious meal from {order.restaurantName || "FoodieGo"}.</p>

            {ratingSubmitted ? (
              <div className="rating-thanks">
                <h3 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  Thank You for your Review! <Heart size={20} color="#ff4757" fill="#ff4757" />
                </h3>
                <p>Your rating helps us keep delivery superfast and food fresh.</p>
              </div>
            ) : (
              <div className="rating-form">
                <div className="rating-group">
                  <label>Rate Delivery Partner (Rahul Sharma):</label>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-icon ${star <= driverRating ? "filled" : ""}`}
                        onClick={() => setDriverRating(star)}
                      >
                        <Star size={24} fill={star <= driverRating ? "#f59e0b" : "none"} stroke="#f59e0b" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rating-group">
                  <label>Rate Food Quality & Taste:</label>
                  <div className="stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star-icon ${star <= foodRating ? "filled" : ""}`}
                        onClick={() => setFoodRating(star)}
                      >
                        <Star size={24} fill={star <= foodRating ? "#f59e0b" : "none"} stroke="#f59e0b" />
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Any compliments or suggestions for the chef? (Optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={2}
                />

                <div className="rating-buttons">
                  <button className="submit-review-btn" onClick={handleRatingSubmit} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    Submit Review <Zap size={15} />
                  </button>
                  <button className="skip-btn" onClick={() => setShowRatingModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
