import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
  Check
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/OrderTracking.css";

const stages = [
  {
    step: 1,
    title: "Order Confirmed",
    desc: "Your order has been received and verified by the restaurant.",
    time: "2 mins ago"
  },
  {
    step: 2,
    title: "Kitchen Preparing Food",
    desc: "Chef is cooking your fresh and hot meal with premium ingredients.",
    time: "Just now"
  },
  {
    step: 3,
    title: "Partner Picked Up Order",
    desc: "Delivery partner Rahul Sharma has picked up your parcel.",
    time: "In 5 mins"
  },
  {
    step: 4,
    title: "Out for Delivery",
    desc: "Your delivery partner is navigating through traffic towards your home.",
    time: "In 12 mins"
  },
  {
    step: 5,
    title: "Order Delivered",
    desc: "Package delivered safely. Enjoy your hot and delicious food!",
    time: "Completed"
  }
];

function OrderTracking() {
  const { orderId } = useParams();
  const { activeTrackingOrder, showToast } = useContext(CartContext);

  const [progress, setProgress] = useState(25); // 0 - 100
  const [currentStageIndex, setCurrentStageIndex] = useState(1);
  const [isFastDemo, setIsFastDemo] = useState(false);
  const [etaMinutes, setEtaMinutes] = useState(18);

  // Driver Chat Modal
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "driver", text: "Hello! I am on my way to pick up your order from the restaurant.", time: "Just now" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  // Post Delivery Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [driverRating, setDriverRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const order = activeTrackingOrder || {
    id: orderId || "FGO-8921",
    customerName: "Alex Morgan",
    deliveryAddress: "Flat 402, Sunshine Heights, Sector 62, Noida",
    items: [
      { name: "Margherita Pizza (Large)", quantity: 1, price: "₹449" },
      { name: "Peri Peri Masala Fries", quantity: 1, price: "₹169" },
      { name: "Chilled Coca-Cola", quantity: 2, price: "₹99" }
    ],
    total: 717,
    paymentMethod: "UPI (Google Pay)",
    restaurantName: "La Pino'z Pizza"
  };

  // Timer interval for real-time progress simulation
  useEffect(() => {
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
  }, [isFastDemo]);

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
      {/* Top Bar with Demo Toggle */}
      <div className="tracking-top-bar">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            Live Order Tracking <Bike size={24} color="#ff4757" />
          </h1>
          <p>Order #{order.id} • {order.restaurantName || "FoodieGo Kitchen"}</p>
        </div>

        <div className="demo-toggle-wrap">
          <button
            className={`demo-btn ${isFastDemo ? "active" : ""}`}
            onClick={() => {
              setIsFastDemo(!isFastDemo);
              showToast(
                !isFastDemo
                  ? "Fast-Forward Demo Mode ON (Full delivery cycle in 10s)"
                  : "Normal Real-Time Speed ON",
                "info"
              );
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {isFastDemo ? <><Zap size={14} /> Fast Demo ON</> : <><Play size={14} /> Test Fast Demo</>}
          </button>
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
                <span className="marker-label">Restaurant</span>
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
                        <h4>{st.title}</h4>
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

          {/* Order Summary Dropdown/Card */}
          <div className="order-receipt-card">
            <div className="receipt-header">
              <h3>Items in this Order ({order.items?.length || 0})</h3>
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
