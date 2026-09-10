import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gift,
  Zap,
  ShieldCheck,
  Lock,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  Layers,
  Tag,
  Sparkles,
  HelpCircle,
  Truck,
  RotateCcw,
  User,
  Store,
  FileText,
  Flame,
  Award
} from "lucide-react";
import "../css/Footer.css";
import api from "../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        const res = await api.post("/subscribers/subscribe", { email: email.trim() });
        setSubscribed(true);
        setSubscribeMsg(res.message || "Subscribed!");
      } catch (err) {
        setSubscribed(true);
        setSubscribeMsg("Subscribed! Check inbox for 20% off");
      }
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
            <h3>
              <Gift size={20} className="inline-icon" color="#ff5200" /> Get 20% Off Your First Order!
            </h3>
            <p>Subscribe for exclusive deals, secret flash sales, and mouthwatering chef updates.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="subscribe-btn">
                {subscribed ? (subscribeMsg || "Subscribed!") : "Subscribe & Save"}
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
            <span className="logo-icon-wrap">
              <Zap size={22} fill="#ff5200" color="#ff5200" />
            </span>
            <span className="logo-title">FoodieGo</span>
          </Link>
          <p className="brand-desc">
            Your premium food delivery and culinary marketplace. Hot, hygienic, and lightning-fast delivery to your doorstep in 30 minutes!
          </p>

          <div className="footer-trust-badge">
            <ShieldCheck size={18} color="#22c55e" />
            <span>100% Secure Checkout & FSSAI Certified Kitchens</span>
          </div>
        </div>

        {/* Explore & Shop */}
        <div className="footer-section">
          <h4 className="footer-title">Explore & Shop</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/shop" onClick={scrollToTop}>
                <Layers size={14} className="inline-icon" /> All Categories & Menu
              </Link>
            </li>
            <li>
              <Link to="/offers" onClick={scrollToTop}>
                <Tag size={14} className="inline-icon" /> Coupons & Offers
              </Link>
            </li>
            <li>
              <Link to="/shop?tag=Flash%20Deal" onClick={scrollToTop}>
                <Zap size={14} className="inline-icon" /> Flash Sale Deals
              </Link>
            </li>
            <li>
              <Link to="/shop?tag=Best%20Seller" onClick={scrollToTop}>
                <Flame size={14} className="inline-icon" /> Bestsellers
              </Link>
            </li>
            <li>
              <Link to="/shop?sort=newest" onClick={scrollToTop}>
                <Sparkles size={14} className="inline-icon" /> New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={scrollToTop}>
                <FileText size={14} className="inline-icon" /> About FoodieGo
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="footer-section">
          <h4 className="footer-title">Customer Care</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/help" onClick={scrollToTop}>
                <HelpCircle size={14} className="inline-icon" /> Help Center & FAQs
              </Link>
            </li>
            <li>
              <Link to="/account/track" onClick={scrollToTop}>
                <Truck size={14} className="inline-icon" /> Live Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/returns" onClick={scrollToTop}>
                <RotateCcw size={14} className="inline-icon" /> Return & Refund Request
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollToTop}>
                <Phone size={14} className="inline-icon" /> Contact Support
              </Link>
            </li>
            <li>
              <Link to="/account" onClick={scrollToTop}>
                <User size={14} className="inline-icon" /> My Account & Profile
              </Link>
            </li>
            <li>
              <Link to="/seller-info" onClick={scrollToTop}>
                <Store size={14} className="inline-icon" /> Partner with FoodieGo
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div className="footer-section">
          <h4 className="footer-title">Policies & Trust</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/shipping-policy" onClick={scrollToTop}>
                <Truck size={14} className="inline-icon" /> Shipping & Delivery Policy
              </Link>
            </li>
            <li>
              <Link to="/returns-policy" onClick={scrollToTop}>
                <ShieldCheck size={14} className="inline-icon" /> Refund & Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/cancellation-policy" onClick={scrollToTop}>
                <Clock size={14} className="inline-icon" /> Cancellation Terms
              </Link>
            </li>
            <li>
              <Link to="/warranty" onClick={scrollToTop}>
                <Award size={14} className="inline-icon" /> Freshness Guarantee
              </Link>
            </li>
            <li>
              <Link to="/privacy" onClick={scrollToTop}>
                <Lock size={14} className="inline-icon" /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" onClick={scrollToTop}>
                <FileText size={14} className="inline-icon" /> Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-section footer-contact">
          <h4 className="footer-title">Headquarters</h4>
          <div className="contact-info">
            <p className="contact-item">
              <MapPin size={16} className="contact-icon" color="#ff5200" />
              <span>VIP Road, Raipur, Chhattisgarh 492001</span>
            </p>
            <p className="contact-item">
              <Phone size={16} className="contact-icon" color="#ff5200" />
              <a href="tel:+918863033031">+91 8863033031</a>
            </p>
            <p className="contact-item">
              <Mail size={16} className="contact-icon" color="#ff5200" />
              <a href="mailto:support@foodiego.com">support@foodiego.com</a>
            </p>
            <p className="contact-item">
              <Clock size={16} className="contact-icon" color="#ff5200" />
              <span>Mon – Sun: 8:00 AM – 11:30 PM IST</span>
            </p>
          </div>

          <div className="payment-gateways-list">
            <span className="pay-pill">UPI</span>
            <span className="pay-pill">GPay</span>
            <span className="pay-pill">PhonePe</span>
            <span className="pay-pill">Paytm</span>
            <span className="pay-pill">VISA</span>
            <span className="pay-pill">Mastercard</span>
            <span className="pay-pill">RuPay</span>
            <span className="pay-pill">COD</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <strong>FoodieGo Technologies Inc.</strong> All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/privacy" onClick={scrollToTop}>Privacy</Link>
            <span className="separator">•</span>
            <Link to="/terms" onClick={scrollToTop}>Terms</Link>
            <span className="separator">•</span>
            <Link to="/shipping-policy" onClick={scrollToTop}>Shipping</Link>
            <span className="separator">•</span>
            <Link to="/help" onClick={scrollToTop}>Help</Link>
            <span className="separator">•</span>
            <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
              <ArrowUp size={12} className="inline-icon" /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
