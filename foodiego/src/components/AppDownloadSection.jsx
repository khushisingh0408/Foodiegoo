import { useState } from "react";
import { Smartphone, Star, Send, CheckCircle2, Zap, Truck, QrCode } from "lucide-react";
import "../css/AppDownloadSection.css";

function AppDownloadSection() {
  const [phone, setPhone] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  const handleSendLink = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      setLinkSent(true);
      setTimeout(() => {
        setLinkSent(false);
        setPhone("");
      }, 4000);
    }
  };

  return (
    <section className="app-download-section">
      <div className="app-download-card">
        <div className="app-download-content">
          <span className="app-badge">
            <Smartphone size={12} className="inline-icon" /> GET THE FOODIEGO APP
          </span>
          <h2>Order 2x Faster with Live Map & Exclusive Mobile Deals</h2>
          <p>
            Download the FoodieGo app to track your delivery rider in real-time, get instant price-drop alerts, and access app-only coupon vouchers.
          </p>

          <div className="app-rating-strip">
            <div className="app-rate-item">
              <strong>
                <Star size={13} fill="#ca8a04" color="#ca8a04" className="inline-icon" /> 4.9 / 5
              </strong>
              <small>App Store (12k+ Ratings)</small>
            </div>
            <div className="rate-divider" />
            <div className="app-rate-item">
              <strong>
                <Star size={13} fill="#ca8a04" color="#ca8a04" className="inline-icon" /> 4.8 / 5
              </strong>
              <small>Google Play (45k+ Ratings)</small>
            </div>
          </div>

          <form className="app-sms-form" onSubmit={handleSendLink}>
            <div className="sms-input-wrap">
              <span className="country-code">+91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number..."
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                required
              />
              <button type="submit" className="send-link-btn">
                {linkSent ? (
                  <>
                    <CheckCircle2 size={13} className="inline-icon" /> Link Sent!
                  </>
                ) : (
                  <>
                    <Send size={13} className="inline-icon" /> Get App Link
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="store-buttons-row">
            <a href="#ios" onClick={(e) => e.preventDefault()} className="store-btn">
              <span className="store-icon">
                <Smartphone size={20} />
              </span>
              <div>
                <small>Download on the</small>
                <strong>App Store</strong>
              </div>
            </a>
            <a href="#android" onClick={(e) => e.preventDefault()} className="store-btn">
              <span className="store-icon">
                <Smartphone size={20} />
              </span>
              <div>
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </div>
            </a>
          </div>
        </div>

        {/* Mock Phone Preview Art */}
        <div className="app-mockup-art">
          <div className="phone-screen-mock">
            <div className="screen-header">
              <span>
                <Zap size={12} className="inline-icon" /> FoodieGo
              </span>
              <span>18m Delivery</span>
            </div>
            <div className="screen-dish-pill">
              <span>Margherita Pizza</span>
              <strong>₹299</strong>
            </div>
            <div className="screen-tracker-pill">
              <span className="live-dot" />
              <Truck size={12} className="inline-icon" />
              <span>Rider Rahul on the way</span>
            </div>
            <div className="qr-box">
              <QrCode size={36} color="#0f172a" />
              <small>Scan to Download</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AppDownloadSection;
