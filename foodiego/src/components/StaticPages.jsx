import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Zap,
  Phone,
  Mail,
  MapPin,
  Clock,
  Lock,
  FileText,
  Truck,
  RotateCcw,
  XCircle,
  ShieldCheck,
  Store,
  Send,
  CheckCircle2,
  ArrowRight,
  Star
} from "lucide-react";
import "../css/StaticPages.css";

export function StaticPages({ pageType }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formSent, setFormSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  // 1. ABOUT US
  if (pageType === "about") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">OUR CULINARY MISSION</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            About FoodieGo <Zap size={28} color="#ff4757" fill="#ff4757" />
          </h1>
          <p>Delivering lightning-fast gastronomic happiness to doorsteps across the nation</p>
        </div>

        <div className="static-body-card">
          <h2>Our Story & Vision</h2>
          <p>
            Founded with a passion for exceptional food and lightning-fast logistics, <strong>FoodieGo</strong> bridges the gap between premier artisanal kitchens and hungry food connoisseurs. We believe that gourmet meals should arrive in peak condition—hot, crispy, and brimming with fresh aroma.
          </p>

          <div className="stats-row-grid">
            <div className="stat-highlight">
              <h3>50,000+</h3>
              <p>Happy Daily Diners</p>
            </div>
            <div className="stat-highlight">
              <h3>18 Mins</h3>
              <p>Average Express Delivery</p>
            </div>
            <div className="stat-highlight">
              <h3>100%</h3>
              <p>Fresh & Certified Kitchens</p>
            </div>
            <div className="stat-highlight">
              <h3 style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                4.9 <Star size={20} fill="#f59e0b" color="#f59e0b" />
              </h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>

          <h2>The FoodieGo Promise</h2>
          <ul>
            <li><strong>Thermal-Insulated Deliveries:</strong> Every dish travels in food-grade honeycomb boxes maintaining 65°C core temperature.</li>
            <li><strong>Zero Palm Oil & Fresh Dough:</strong> Our restaurant partners use only pure dairy cheese, fresh daily dough, and cold-pressed oils.</li>
            <li><strong>Fair Partner Community:</strong> We empower local chefs and restaurant owners with equitable transparent margins.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 2. CONTACT US
  if (pageType === "contact") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">GET IN TOUCH</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Contact Customer Care <Phone size={28} color="#ff4757" />
          </h1>
          <p>We are available 24 hours a day, 7 days a week to support you</p>
        </div>

        <div className="contact-page-layout">
          <div className="contact-info-column">
            <div className="contact-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={18} color="#ff4757" /> Corporate Headquarters
              </h3>
              <p>FoodieGo Technologies Pvt. Ltd.<br />Sector 62, Electronic City, Noida, Uttar Pradesh, India - 201309</p>
            </div>

            <div className="contact-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={18} color="#ff4757" /> 24/7 Helpline
              </h3>
              <p><a href="tel:+918863033031">+91 8863033031</a> (Toll Free)</p>
            </div>

            <div className="contact-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={18} color="#ff4757" /> Email Enquiries
              </h3>
              <p><a href="mailto:support@foodiego.com">support@foodiego.com</a></p>
            </div>

            <div className="contact-card">
              <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={18} color="#ff4757" /> Operating Hours
              </h3>
              <p>Kitchens & Dispatch: Mon – Sun: 08:00 AM – 11:30 PM</p>
            </div>
          </div>

          <div className="contact-form-column">
            {formSent ? (
              <div className="form-success-box">
                <div className="success-icon" style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
                  <CheckCircle2 size={44} color="#10b981" />
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Our customer operations team will respond to your email within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form-body">
                <h3>Send Us a Direct Message</h3>

                <div className="form-group">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="contact-submit-btn" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  Send Message <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. PRIVACY POLICY
  if (pageType === "privacy") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">LEGAL COMPLIANCE</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Privacy Policy <Lock size={28} color="#ff4757" />
          </h1>
          <p>Last updated: September 2026</p>
        </div>

        <div className="static-body-card">
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your delivery address, phone number, email, and payment token identifiers necessary to fulfill and dispatch food orders.</p>

          <h2>2. Location & GPS Tracking</h2>
          <p>During live order deliveries, rider GPS data and customer location coordinates are securely processed to estimate delivery ETA and optimize routing algorithms.</p>

          <h2>3. Payment Data Security</h2>
          <p>All online payments (UPI, Credit/Debit Cards, Net Banking) are encrypted using 256-bit SSL and processed via PCI-DSS compliant RBI-approved payment gateways. We never store raw CVVs or banking passwords.</p>
        </div>
      </div>
    );
  }

  // 4. TERMS & CONDITIONS
  if (pageType === "terms") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">TERMS OF USE</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Terms & Conditions <FileText size={28} color="#ff4757" />
          </h1>
          <p>Please read these terms before ordering from FoodieGo</p>
        </div>

        <div className="static-body-card">
          <h2>1. Account & Ordering</h2>
          <p>By creating an account or placing an order on FoodieGo, you confirm that you are at least 18 years old and that all delivery details provided are accurate and current.</p>

          <h2>2. Pricing & Taxes</h2>
          <p>All prices displayed are in Indian Rupees (INR) and include applicable restaurant GST and handling fees. Promotional coupons apply per terms stated on the offer.</p>

          <h2>3. Delivery Timeframes</h2>
          <p>While our average delivery is 20-25 minutes, transit times may vary depending on peak meal hours, extreme weather conditions, or traffic regulations.</p>
        </div>
      </div>
    );
  }

  // 5. SHIPPING POLICY
  if (pageType === "shipping") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">DISPATCH & LOGISTICS</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Shipping & Delivery Policy <Truck size={28} color="#ff4757" />
          </h1>
          <p>Fast, temperature-controlled transit engineered for peak flavor</p>
        </div>

        <div className="static-body-card">
          <h2>1. Delivery Zones & Speed</h2>
          <p>We deliver across major metropolitan sectors. Standard delivery takes 20-30 minutes. Priority Express guarantees delivery in 15-20 minutes.</p>

          <h2>2. Free Shipping Eligibility</h2>
          <p>All orders with an item total of <strong>₹300 or above</strong> automatically qualify for <strong>100% FREE Delivery</strong>. Orders below ₹300 incur a standard nominal delivery fee of ₹40.</p>

          <h2>3. Contactless Delivery</h2>
          <p>Customers can select 'Leave at Door' instructions during checkout. Riders will sanitize hands and place the thermal-sealed order safely at your doorstep.</p>
        </div>
      </div>
    );
  }

  // 6. RETURN & REFUND POLICY
  if (pageType === "returns-policy") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">CUSTOMER SATISFACTION</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Return, Replacement & Refund Policy <RotateCcw size={28} color="#ff4757" />
          </h1>
          <p>100% money-back guarantee if you are not delighted with your meal</p>
        </div>

        <div className="static-body-card">
          <h2>1. Return & Replacement Eligibility</h2>
          <p>We offer instant replacements or refunds for food received lukewarm/cold, damaged in transit, with missing toppings, or when an incorrect order is delivered.</p>

          <h2>2. Refund Timeframes</h2>
          <ul>
            <li><strong>FoodieGo Wallet:</strong> Instant credit within 10 minutes.</li>
            <li><strong>UPI & Bank Accounts:</strong> Processed within 1 to 2 business banking days.</li>
            <li><strong>Credit / Debit Cards:</strong> Standard 3 to 5 banking days depending on card issuer.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 7. CANCELLATION POLICY
  if (pageType === "cancellation") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">ORDER CHANGES</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Cancellation Policy <XCircle size={28} color="#ff4757" />
          </h1>
          <p>Guidelines for canceling or modifying active kitchen orders</p>
        </div>

        <div className="static-body-card">
          <h2>1. Cancellation Window</h2>
          <p>Orders can be cancelled free of charge within 60 seconds of order submission before kitchen cooking preparation begins.</p>

          <h2>2. Post-Preparation Cancellations</h2>
          <p>Once fresh culinary preparation has commenced, orders cannot be directly cancelled through the app, but our 24/7 customer care team can assist with exceptions.</p>
        </div>
      </div>
    );
  }

  // 8. WARRANTY & FRESHNESS GUARANTEE
  if (pageType === "warranty") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">QUALITY ASSURANCE</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Freshness & Quality Guarantee <ShieldCheck size={28} color="#ff4757" />
          </h1>
          <p>Our commitment to culinary excellence and kitchen hygiene</p>
        </div>

        <div className="static-body-card">
          <h2>1. 100% Fresh Daily Preparation</h2>
          <p>All pizza dough, burger patties, noodle wok bowls, and desserts are made fresh daily. No pre-cooked or frozen meals are ever dispatched.</p>

          <h2>2. FSSAI & Hygiene Verified</h2>
          <p>All partner culinary hubs strictly adhere to FSSAI hygiene guidelines, mandatory hairnets, sanitized prep surfaces, and temperature screening.</p>
        </div>
      </div>
    );
  }

  // 9. SELLER & RESTAURANT PARTNER INFORMATION
  if (pageType === "seller-info") {
    return (
      <div className="static-page-wrapper">
        <div className="static-hero-banner">
          <span className="static-badge">PARTNER WITH US</span>
          <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            Restaurant Partner Information <Store size={28} color="#ff4757" />
          </h1>
          <p>Grow your culinary brand with FoodieGo's high-speed delivery network</p>
        </div>

        <div className="static-body-card">
          <h2>Why Partner With FoodieGo?</h2>
          <ul>
            <li><strong>Reach 50,000+ Hungry Foodies:</strong> Boost your restaurant's daily orders and online visibility.</li>
            <li><strong>Zero Heavy Commission Fees:</strong> Transparent, competitive commission rates with weekly on-time payouts.</li>
            <li><strong>Dedicated Smart Dispatch:</strong> Our automated AI rider assignment ensures food is collected hot from your counter in under 3 minutes.</li>
          </ul>

          <div className="partner-join-box">
            <h3>Ready to list your restaurant?</h3>
            <p>Send your kitchen profile and menu to <a href="mailto:partners@foodiego.com">partners@foodiego.com</a> or call our onboarding desk at <strong>+91 8863033031</strong>.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default StaticPages;
