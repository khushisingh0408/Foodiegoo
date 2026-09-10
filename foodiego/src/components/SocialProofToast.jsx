import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/SocialProofToast.css";
import pizzaImg from "../assets/images/margherita-pizza.png";
import lavaImg from "../assets/images/choco-lava-cake.png";
import burgerImg from "../assets/images/classic Cheeseburger.png";
import friesImg from "../assets/images/peri-peri-fries.png";
import noodlesImg from "../assets/images/schezwan-noodles.png";
import coffeeImg from "../assets/images/cold-coffee.png";

const recentBuyerPurchases = [
  { name: "Rahul S.", city: "Delhi", item: "Margherita Pizza (Large)", image: pizzaImg, time: "2 mins ago", link: "/product/1" },
  { name: "Priya M.", city: "Mumbai", item: "Molten Choco Lava Cake", image: lavaImg, time: "4 mins ago", link: "/product/21" },
  { name: "Arjun K.", city: "Bengaluru", item: "Classic Cheeseburger", image: burgerImg, time: "1 min ago", link: "/product/6" },
  { name: "Sneha R.", city: "Hyderabad", item: "Peri-Peri Masala Fries", image: friesImg, time: "Just now", link: "/product/11" },
  { name: "Aditya V.", city: "Noida", item: "Schezwan Spicy Noodles", image: noodlesImg, time: "5 mins ago", link: "/product/26" },
  { name: "Neha D.", city: "Pune", item: "Iced Cold Coffee Brew", image: coffeeImg, time: "3 mins ago", link: "/product/17" }
];

function SocialProofToast() {
  const [currentPurchase, setCurrentPurchase] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCurrentPurchase(recentBuyerPurchases[index % recentBuyerPurchases.length]);
      setVisible(true);
      index++;

      // Hide after 5 seconds
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  if (!visible || !currentPurchase) return null;

  return (
    <div className="social-proof-toast">
      <button className="sp-close-btn" onClick={() => setVisible(false)} aria-label="Close">
        ✕
      </button>
      <div className="sp-icon-box">
        <img src={currentPurchase.image} alt={currentPurchase.item} className="sp-real-food-img" loading="lazy" />
      </div>
      <div className="sp-content">
        <p className="sp-title">
          <strong>{currentPurchase.name}</strong> from {currentPurchase.city}
        </p>
        <Link to={currentPurchase.link} className="sp-item-link" onClick={() => setVisible(false)}>
          Just ordered {currentPurchase.item}
        </Link>
        <div className="sp-time-row">
          <span className="sp-verified-badge">✓ Verified Order</span>
          <span className="sp-time">• {currentPurchase.time}</span>
        </div>
      </div>
    </div>
  );
}

export default SocialProofToast;
