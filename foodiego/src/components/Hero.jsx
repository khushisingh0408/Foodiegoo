import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flame,
  Truck,
  Copy,
  Search,
  Leaf,
  Star,
  Zap,
  BadgePercent,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import pizzaImg from "../assets/images/margherita-pizza.png";
import burgerImg from "../assets/images/classic Cheeseburger.png";
import friesImg from "../assets/images/french fries.png";
import "../css/Hero.css";

const promoBanners = [
  {
    id: 1,
    badge: "SUPER DEAL",
    badgeIcon: <Flame size={12} color="#ffffff" />,
    title: "Flat 50% OFF up to ₹120",
    subtitle: "On your favorite Pizzas, Burgers & Meals",
    code: "FOODIE50",
    bgColor: "linear-gradient(135deg, #ff5200 0%, #ea580c 100%)",
    image: pizzaImg,
    alt: "Gourmet Pizza"
  },
  {
    id: 2,
    badge: "FREE DELIVERY",
    badgeIcon: <Truck size={12} color="#ffffff" />,
    title: "Zero Delivery Fee on Orders ₹149+",
    subtitle: "Hot & fresh food delivered directly to your doorstep",
    code: "FREEDEL",
    bgColor: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    image: burgerImg,
    alt: "Express Delivery Burger"
  },
  {
    id: 3,
    badge: "WEEKEND FEAST",
    badgeIcon: <Sparkles size={12} color="#ffffff" />,
    title: "Flat ₹100 OFF on Top Brand Combos",
    subtitle: "Burger King, La Pino'z, Wow Momo & more",
    code: "WELCOME100",
    bgColor: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    image: friesImg,
    alt: "Crispy Fries Combo"
  }
];

function Hero({ searchTerm, setSearchTerm, activeFilter, setActiveFilter }) {
  const navigate = useNavigate();
  const { isPureVegOnly, updatePureVegFilter, showToast } = useContext(CartContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide promo banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const value = searchTerm.trim();
    if (value !== "") {
      navigate(`/search?search=${encodeURIComponent(value)}`);
    }
  };

  const banner = promoBanners[currentSlide];

  return (
    <section className="hero-section">
      {/* Dynamic Promotional Banner Carousel */}
      <div
        className="promo-banner-carousel"
        style={{ background: banner.bgColor }}
      >
        <div className="promo-banner-content">
          <span className="promo-badge">
            {banner.badgeIcon} {banner.badge}
          </span>
          <h1>{banner.title}</h1>
          <p>{banner.subtitle}</p>

          <div className="promo-cta-row">
            <div
              className="coupon-tag-pill"
              onClick={() => {
                navigator.clipboard.writeText(banner.code);
                showToast(`Copied code ${banner.code}! Apply at checkout.`, "success");
              }}
              title="Click to copy coupon code"
            >
              <span>USE CODE:</span>
              <strong>{banner.code}</strong>
              <small>
                <Copy size={11} className="inline-icon" /> Copy
              </small>
            </div>

            <button
              className="order-now-btn"
              onClick={() => {
                const el = document.querySelector(".popular-foods");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Order Now <ArrowRight size={14} className="inline-icon" />
            </button>
          </div>
        </div>

        <div className="promo-banner-art">
          <div className="art-img-circle">
            <img src={banner.image} alt={banner.alt} className="hero-banner-real-img" loading="lazy" />
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {promoBanners.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${currentSlide === idx ? "active" : ""}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Quick Search & Filter Pills Bar */}
      <div className="hero-filter-bar">
        <div className="hero-search-inline">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search your favorite food or restaurant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="quick-filter-chips">
          <button
            className={`filter-chip ${isPureVegOnly ? "active-green" : ""}`}
            onClick={() => updatePureVegFilter(!isPureVegOnly)}
          >
            <Leaf size={14} color={isPureVegOnly ? "#15803d" : "#64748b"} />
            <span>Pure Veg</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === "rating" ? "active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === "rating" ? "" : "rating")}
          >
            <Star size={13} fill={activeFilter === "rating" ? "#ffffff" : "#ca8a04"} color={activeFilter === "rating" ? "#ffffff" : "#ca8a04"} />
            <span>Rating 4.8+</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === "fast" ? "active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === "fast" ? "" : "fast")}
          >
            <Zap size={13} color={activeFilter === "fast" ? "#ffffff" : "#ea580c"} />
            <span>Fast (under 20m)</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === "bestseller" ? "active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === "bestseller" ? "" : "bestseller")}
          >
            <Flame size={13} color={activeFilter === "bestseller" ? "#ffffff" : "#dc2626"} />
            <span>Bestsellers</span>
          </button>

          <button
            className={`filter-chip ${activeFilter === "under199" ? "active" : ""}`}
            onClick={() => setActiveFilter(activeFilter === "under199" ? "" : "under199")}
          >
            <BadgePercent size={13} color={activeFilter === "under199" ? "#ffffff" : "#16a34a"} />
            <span>Under ₹199</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;