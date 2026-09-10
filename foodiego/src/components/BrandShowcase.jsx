import { Link } from "react-router-dom";
import { Star, ArrowRight, Award } from "lucide-react";
import "../css/BrandShowcase.css";
import pizzaImg from "../assets/images/margherita-pizza.png";
import burgerImg from "../assets/images/classic Cheeseburger.png";
import waffleCakeImg from "../assets/images/chocolate fudge cake.png";
import noodlesImg from "../assets/images/veg chowmein.png";
import friesImg from "../assets/images/french fries.png";
import coffeeImg from "../assets/images/cold-coffee.png";

const brands = [
  { id: "b1", name: "La Pino'z Pizza", image: pizzaImg, rating: "4.8", count: "5 dishes", category: "Pizza" },
  { id: "b2", name: "Burger King", image: burgerImg, rating: "4.7", count: "5 dishes", category: "Burger" },
  { id: "b3", name: "The Belgian Waffle Co.", image: waffleCakeImg, rating: "4.9", count: "5 dishes", category: "Dessert" },
  { id: "b4", name: "Wow! Momo & Chinese", image: noodlesImg, rating: "4.8", count: "5 dishes", category: "Noodles" },
  { id: "b5", name: "Subway & FastBites", image: friesImg, rating: "4.7", count: "5 dishes", category: "Fries" },
  { id: "b6", name: "Starbucks / Chai Point", image: coffeeImg, rating: "4.9", count: "5 dishes", category: "Drinks" }
];

function BrandShowcase() {
  return (
    <section className="brand-showcase-section">
      <div className="section-head-row">
        <div>
          <div className="brand-badge-pill">
            <Award size={12} className="inline-icon" /> PREMIER HOUSES
          </div>
          <h2>Top Brand Showcase</h2>
          <p>Explore signature cuisines and iconic recipes from premier culinary houses</p>
        </div>
        <Link to="/shop" className="view-all-brands-link">
          All Brands ({brands.length}) <ArrowRight size={14} className="inline-icon" />
        </Link>
      </div>

      <div className="brands-showcase-grid">
        {brands.map((brand) => (
          <Link
            to={`/shop?brand=${encodeURIComponent(brand.name)}`}
            key={brand.id}
            className="brand-card-item"
          >
            <div className="brand-logo-circle">
              <img src={brand.image} alt={brand.name} className="brand-real-img" loading="lazy" />
            </div>
            <div className="brand-details">
              <h4>{brand.name}</h4>
              <span className="brand-category-tag">{brand.category}</span>
              <div className="brand-stats">
                <span className="brand-rating">
                  <Star size={12} fill="#ca8a04" color="#ca8a04" /> {brand.rating}
                </span>
                <span className="brand-count">• {brand.count}</span>
              </div>
            </div>
            <ArrowRight size={16} className="brand-arrow" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BrandShowcase;
