import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";
import api from "../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      const res = await api.post("/subscribers/subscribe", { email: email.trim() });
      setSubscribed(true);
      setSubscribeMsg(res.message || "Subscribed! 🎉");
      setEmail("");
      setTimeout(() => {
        setSubscribed(false);
        setSubscribeMsg("");
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      {/* Newsletter Banner */}
      <div className="footer-newsletter-banner">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>🎁 Get 20% Off Your First Order!</h3>
            <p>Subscribe for exclusive deals, secret coupons & delicious updates.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="subscribe-btn">
                {subscribed ? (subscribeMsg || "Subscribed! 🎉") : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="footer-container">
        {/* Brand Column */}
        <div className="footer-section footer-brand">
          <Link to="/" className="footer-logo" onClick={scrollToTop}>
            <span className="logo-emoji">🍔</span>
            <span className="logo-title">FoodieGo</span>
          </Link>
          <p className="brand-desc">
            Your favorite food delivered hot & fresh to your doorstep within minutes. Fast, tasty & reliable!
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="social-icon">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="social-icon">
              📘
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="social-icon">
              🐦
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="social-icon">
              ▶️
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/" onClick={scrollToTop}>🏠 Home</Link>
            </li>
            <li>
              <Link to="/cart" onClick={scrollToTop}>🛒 My Cart</Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={scrollToTop}>❤️ Wishlist</Link>
            </li>
            <li>
              <Link to="/orders" onClick={scrollToTop}>📦 My Orders</Link>
            </li>
            <li>
              <Link to="/login" onClick={scrollToTop}>👤 Account</Link>
            </li>
          </ul>
        </div>

        {/* Top Categories Column */}
        <div className="footer-section">
          <h4 className="footer-title">Top Categories</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/" onClick={scrollToTop}>🍔 Juicy Burgers</Link>
            </li>
            <li>
              <Link to="/" onClick={scrollToTop}>🍕 Cheesy Pizzas</Link>
            </li>
            <li>
              <Link to="/" onClick={scrollToTop}>🍟 Crispy Fries</Link>
            </li>
            <li>
              <Link to="/" onClick={scrollToTop}>🍜 Noodles & Bowls</Link>
            </li>
            <li>
              <Link to="/" onClick={scrollToTop}>🍰 Shakes & Sweets</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-section footer-contact">
          <h4 className="footer-title">Contact & Support</h4>
          <div className="contact-info">
            <p className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Raipur, Chhattisgarh, India</span>
            </p>
            <p className="contact-item">
              <span className="contact-icon">📞</span>
              <a href="tel:+918863033031">+91 8863033031</a>
            </p>
            <p className="contact-item">
              <span className="contact-icon">📧</span>
              <a href="mailto:support@foodiego.com">support@foodiego.com</a>
            </p>
            <p className="contact-item">
              <span className="contact-icon">🕒</span>
              <span>Mon – Sun: 8:00 AM – 11:30 PM</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <strong>FoodieGo</strong>. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span className="separator">•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
            <span className="separator">•</span>
            <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
              Top ⬆
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
