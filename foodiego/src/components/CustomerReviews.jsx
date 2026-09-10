import { Star, CheckCircle2 } from "lucide-react";
import { customerTestimonials } from "../data/foodsData";
import "../css/CustomerReviews.css";

function CustomerReviews() {
  return (
    <section className="customer-reviews-section">
      <div className="reviews-section-head">
        <span className="reviews-badge">VERIFIED REPUTATION</span>
        <h2>Loved by 50,000+ Happy Foodies</h2>
        <p>Real verified reviews and ratings from our daily food connoisseurs</p>
      </div>

      <div className="testimonials-grid">
        {customerTestimonials.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <div className="test-rating-stars">
              <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" color="currentColor" />
                ))}
              </div>
              <span className="verified-badge-pill" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={13} color="#10b981" /> Verified Order
              </span>
            </div>
            <p className="test-quote">"{t.text}"</p>
            <div className="test-ordered-dish">
              <span>Ordered: </span>
              <strong>{t.foodOrdered}</strong>
            </div>
            <div className="test-user-row">
              <img src={t.avatar} alt={t.name} className="test-avatar" />
              <div>
                <strong>{t.name}</strong>
                <small>{t.city}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CustomerReviews;
