import { Zap, ShieldCheck, PackageCheck, BadgePercent } from "lucide-react";
import "../css/WhyChooseUs.css";

const features = [
  {
    icon: <Zap size={28} />,
    title: "20-Minute Express Delivery",
    desc: "Smart rider dispatch algorithms deliver your hot meal faster than anyone else."
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "100% Fresh & FSSAI Certified",
    desc: "Prepared in certified hygienic kitchens using fresh daily sourced ingredients."
  },
  {
    icon: <PackageCheck size={28} />,
    title: "Thermal-Lock Packaging",
    desc: "Triple-layer insulated packaging ensures food remains piping hot at 65°C."
  },
  {
    icon: <BadgePercent size={28} />,
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
