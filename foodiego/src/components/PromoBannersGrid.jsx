import { Link } from "react-router-dom";
import "../css/PromoBannersGrid.css";
import burgerImg from "../assets/images/classic Cheeseburger.png";
import pizzaImg from "../assets/images/margherita-pizza.png";
import dessertImg from "../assets/images/choco-lava-cake.png";

const promoCards = [
  {
    id: "p1",
    tag: "WEEKEND SPECIAL",
    title: "Double Gourmet Burgers",
    desc: "Buy 1 Get 1 at Flat 50% OFF",
    code: "BURGER50",
    bg: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    image: burgerImg,
    alt: "Gourmet Burgers",
    link: "/shop?category=Burger"
  },
  {
    id: "p2",
    tag: "ITALIAN NIGHT",
    title: "Cheesy Stonefire Pizzas",
    desc: "Free Garlic Bread on orders ₹399+",
    code: "CHEESYFREE",
    bg: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    image: pizzaImg,
    alt: "Stonefire Pizzas",
    link: "/shop?category=Pizza"
  },
  {
    id: "p3",
    tag: "SWEET CRAVINGS",
    title: "Artisanal Lava & Shakes",
    desc: "Flat ₹80 OFF on dessert combos",
    code: "SWEET80",
    bg: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
    image: dessertImg,
    alt: "Artisanal Desserts",
    link: "/shop?category=Dessert"
  }
];

function PromoBannersGrid() {
  return (
    <section className="promo-banners-grid-section">
      <div className="promo-grid-container">
        {promoCards.map((card) => (
          <div className="promo-deal-card" style={{ background: card.bg }} key={card.id}>
            <div className="promo-card-content">
              <span className="promo-tag-badge">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className="promo-bottom-actions">
                <span className="code-pill">CODE: <strong>{card.code}</strong></span>
                <Link to={card.link} className="explore-deal-btn">
                  Explore →
                </Link>
              </div>
            </div>
            <div className="promo-card-art-wrap">
              <img src={card.image} alt={card.alt} className="promo-real-img" loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PromoBannersGrid;
