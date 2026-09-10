import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { coupons } from "../data/couponsData";
import { CartContext } from "../context/CartContext";
import "../css/OffersPage.css";

function OffersPage() {
  const { showToast } = useContext(CartContext);
  const [activeCategory, setActiveCategory] = useState("all");

  const bankOffers = [
    {
      id: "bank-1",
      bank: "HDFC Bank",
      logo: "🏦",
      offer: "10% Instant Discount up to ₹150 on Credit & Debit Cards",
      code: "HDFC10",
      minOrder: 499
    },
    {
      id: "bank-2",
      bank: "ICICI Bank",
      logo: "💳",
      offer: "Flat ₹100 Cashback on Net Banking transactions",
      code: "ICICI100",
      minOrder: 399
    },
    {
      id: "bank-3",
      bank: "Axis Bank",
      logo: "⚡",
      offer: "Flat 15% OFF on Neo Credit Cards",
      code: "AXISNEO",
      minOrder: 299
    }
  ];

  return (
    <div className="offers-page-container">
      {/* Top Banner */}
      <div className="offers-hero-banner">
        <span className="offers-badge">EXCLUSIVE SAVINGS HUB</span>
        <h1>Today's Hot Deals, Coupons & Bank Offers 🎟️</h1>
        <p>Apply these verified coupon codes at checkout to save big on your cravings</p>
      </div>

      {/* Filter Tabs */}
      <div className="offers-tabs-bar">
        <button
          className={`offers-tab-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          🏷️ All Offers ({coupons.length + bankOffers.length})
        </button>
        <button
          className={`offers-tab-btn ${activeCategory === "coupons" ? "active" : ""}`}
          onClick={() => setActiveCategory("coupons")}
        >
          🍕 Restaurant Coupons ({coupons.length})
        </button>
        <button
          className={`offers-tab-btn ${activeCategory === "bank" ? "active" : ""}`}
          onClick={() => setActiveCategory("bank")}
        >
          💳 Bank & Card Discounts ({bankOffers.length})
        </button>
      </div>

      {/* Coupons Grid */}
      {(activeCategory === "all" || activeCategory === "coupons") && (
        <section className="offers-section-block">
          <h2>FoodieGo Promo Codes</h2>
          <div className="coupons-grid">
            {coupons.map((coupon) => (
              <div className="coupon-ticket-card" key={coupon.code}>
                <div className="ticket-cutout-left" />
                <div className="ticket-cutout-right" />

                <div className="ticket-card-header">
                  <span className="discount-tag" style={{ background: coupon.badgeColor || "#ff5200" }}>
                    {coupon.code}
                  </span>
                  <button
                    className="copy-code-action"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      showToast(`Copied code ${coupon.code}! 📋`, "success");
                    }}
                  >
                    Copy Code
                  </button>
                </div>

                <h3>{coupon.title}</h3>
                <p>{coupon.description}</p>

                <div className="ticket-footer-meta">
                  <span>Min Order: ₹{coupon.minOrder || 199}</span>
                  <span>Expires in: 3 Days</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bank Offers Grid */}
      {(activeCategory === "all" || activeCategory === "bank") && (
        <section className="offers-section-block">
          <h2>Partner Bank & Card Offers</h2>
          <div className="bank-offers-grid">
            {bankOffers.map((b) => (
              <div className="bank-offer-card" key={b.id}>
                <div className="bank-card-head">
                  <span className="bank-icon">{b.logo}</span>
                  <strong>{b.bank}</strong>
                </div>
                <p className="bank-offer-desc">{b.offer}</p>
                <div className="bank-card-foot">
                  <span className="bank-code">USE: <strong>{b.code}</strong></span>
                  <button
                    className="copy-bank-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(b.code);
                      showToast(`Copied code ${b.code}! 📋`, "success");
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default OffersPage;
