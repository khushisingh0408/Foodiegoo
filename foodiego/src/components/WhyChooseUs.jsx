import "../css/WhyChooseUs.css";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    title: "20-Minute Express Delivery",
    desc: "Smart rider dispatch algorithms deliver your hot meal faster than anyone else."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>
    ),
    title: "100% Fresh & FSSAI Certified",
    desc: "Prepared in certified hygienic kitchens using fresh daily sourced ingredients."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
        <path d="m7.5 4.27 9 5.15"></path>
        <polyline points="3.29 7 12 12 20.71 7"></polyline>
        <line x1="12" y1="22" x2="12" y2="12"></line>
        <circle cx="18" cy="18" r="3"></circle>
        <path d="m21.5 21.5-1.5-1.5"></path>
      </svg>
    ),
    title: "Thermal-Lock Packaging",
    desc: "Triple-layer insulated packaging ensures food remains piping hot at 65°C."
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    title: "Best Price & Discount Guarantee",
    desc: "Enjoy daily flash sales, bank discounts, and up to 50% off on your cravings."
  }
];

function WhyChooseUs() {
  return (
    <section className="why-choose-us-section">
      <div className="why-header">
        <div className="why-badge-pill">OUR COMMITMENT</div>
        <h2>Why Food Lovers Choose FoodieGo</h2>
        <p>Engineered for speed, hygiene, and unmatched gastronomic delight</p>
      </div>

      <div className="why-grid">
        {features.map((item, idx) => (
          <div className="why-card" key={idx}>
            <div className="why-icon-circle">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
