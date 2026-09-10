import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../css/CustomerSupport.css";

const faqData = [
  {
    q: "How fast is FoodieGo delivery?",
    a: "Standard delivery takes between 20-30 minutes. If you choose Priority Express at checkout, our dedicated single-order rider delivers in 15-20 minutes."
  },
  {
    q: "What if my food arrives cold or damaged?",
    a: "We provide a 100% Freshness & Hot Delivery Guarantee. Simply head to your Account > Returns & Refunds or chat with our live agent for an instant replacement or 100% refund into your FoodieGo wallet."
  },
  {
    q: "How do I apply coupon codes?",
    a: "In your cart or checkout page, enter your promo code (e.g. FOODIE50) in the 'Coupons & Offers' box and tap APPLY. Your discount will be calculated instantly."
  },
  {
    q: "Is Cash on Delivery (COD) supported?",
    a: "Yes! We support Cash on Delivery along with UPI (Google Pay, PhonePe, Paytm, QR Scan), Credit/Debit Cards, and Net Banking."
  },
  {
    q: "Can I cancel or modify an active order?",
    a: "Orders can be modified or cancelled within 60 seconds of placing. After kitchen preparation commences, our support team can assist you directly via Live Chat."
  }
];

function CustomerSupport() {
  const { showToast } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Live Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! 👋 Welcome to FoodieGo Priority Support. How can we help you with your order today?", time: "Just now" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      const userMsg = { sender: "user", text: inputMessage.trim(), time: "Just now" };
      setChatMessages((prev) => [...prev, userMsg]);
      const currentQuery = inputMessage.trim();
      setInputMessage("");

      setTimeout(() => {
        let reply = "Thanks for contacting FoodieGo! A support specialist is reviewing your account details right now.";
        if (currentQuery.toLowerCase().includes("refund") || currentQuery.toLowerCase().includes("return")) {
          reply = "Your refund request has been escalated to our instant settlements team. Funds will reflect in your wallet within 10 minutes!";
        } else if (currentQuery.toLowerCase().includes("order") || currentQuery.toLowerCase().includes("late")) {
          reply = "Your rider is moving at top speed and will arrive at your doorstep in under 8 minutes!";
        }
        setChatMessages((prev) => [
          ...prev,
          { sender: "bot", text: reply, time: "Just now" }
        ]);
      }, 1000);
    }
  };

  const filteredFaqs = faqData.filter(
    (f) => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="support-page-container">
      {/* Hero Header */}
      <div className="support-hero">
        <span className="support-badge">24/7 CUSTOMER CARE</span>
        <h1>How Can We Help You Today? 💬</h1>
        <p>Search FAQs, connect with our support agents, or track order inquiries</p>

        <div className="support-search-bar">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search help topics (e.g. delivery speed, refunds, payment, coupons)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Support Topic Cards */}
      <div className="support-topics-grid">
        <div className="topic-card" onClick={() => setIsChatOpen(true)}>
          <span className="topic-icon">🛵</span>
          <h3>Order & Delivery Help</h3>
          <p>Track rider location, report delivery delays, or change drop instructions.</p>
          <span className="topic-action">Chat with Rider Agent →</span>
        </div>

        <div className="topic-card" onClick={() => setIsChatOpen(true)}>
          <span className="topic-icon">🔄</span>
          <h3>Returns & Instant Refunds</h3>
          <p>Report cold food, incorrect items, or request instant wallet credits.</p>
          <span className="topic-action">Open Return Request →</span>
        </div>

        <div className="topic-card" onClick={() => setIsChatOpen(true)}>
          <span className="topic-icon">💳</span>
          <h3>Payment & Coupons</h3>
          <p>Resolve payment debits, promo code issues, and bank cashbacks.</p>
          <span className="topic-action">Get Payment Help →</span>
        </div>

        <div className="topic-card" onClick={() => setIsChatOpen(true)}>
          <span className="topic-icon">🛡️</span>
          <h3>Food Quality & Safety</h3>
          <p>Chef hygiene verification, allergen advice, and kitchen standards.</p>
          <span className="topic-action">Learn Quality Standards →</span>
        </div>
      </div>

      {/* Direct Contact Channels */}
      <div className="contact-channels-strip">
        <div className="channel-box">
          <span className="channel-icon">📞</span>
          <div>
            <strong>Call 24/7 Helpline</strong>
            <a href="tel:+918863033031">+91 8863033031</a>
          </div>
        </div>

        <div className="channel-box">
          <span className="channel-icon">📧</span>
          <div>
            <strong>Email Support</strong>
            <a href="mailto:support@foodiego.com">support@foodiego.com</a>
          </div>
        </div>

        <div className="channel-box highlight" onClick={() => setIsChatOpen(true)}>
          <span className="channel-icon">💬</span>
          <div>
            <strong>Live Support Chat</strong>
            <span>Instant reply in under 30s</span>
          </div>
          <button className="open-chat-pill-btn">Open Chat</button>
        </div>
      </div>

      {/* FAQ Accordions */}
      <section className="faq-accordion-section">
        <h2>Frequently Asked Questions ❓</h2>
        <div className="faq-list">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                className={`faq-item ${isOpen ? "open" : ""}`}
                key={idx}
                onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
              >
                <div className="faq-question-row">
                  <h4>{faq.q}</h4>
                  <span className="faq-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && <p className="faq-answer-txt">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Live Chat Modal Widget */}
      {isChatOpen && (
        <div className="chat-widget-overlay" onClick={() => setIsChatOpen(false)}>
          <div className="chat-widget-box" onClick={(e) => e.stopPropagation()}>
            <div className="chat-widget-header">
              <div className="agent-meta">
                <span className="agent-avatar">👩‍💼</span>
                <div>
                  <strong>FoodieGo Support Assistant</strong>
                  <small>● Online | Typically replies in 20s</small>
                </div>
              </div>
              <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
                ✕
              </button>
            </div>

            <div className="chat-messages-container">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble-row ${msg.sender}`}>
                  <div className="chat-bubble">
                    <p>{msg.text}</p>
                    <small>{msg.time}</small>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-bar">
              <input
                type="text"
                placeholder="Type your message or issue..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                autoFocus
              />
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerSupport;
