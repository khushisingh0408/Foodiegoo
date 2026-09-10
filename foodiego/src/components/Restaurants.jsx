import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { restaurants as allRestaurants } from "../data/restaurantsData";
import { CartContext } from "../context/CartContext";
import "../css/Restaurants.css";

function Restaurants() {
  const { isPureVegOnly, deliveryLocation } = useContext(CartContext);
  const [selectedCuisine, setSelectedCuisine] = useState("All");

  const cuisinesList = ["All", "Pizzas", "Burgers", "Biryani", "North Indian", "Chinese", "Desserts"];

  const filteredRestaurants = allRestaurants.filter((rest) => {
    if (isPureVegOnly && !rest.isVegOnly) return false;
    if (selectedCuisine === "All") return true;
    return rest.cuisines.some((c) => c.toLowerCase().includes(selectedCuisine.toLowerCase()));
  });

  return (
    <section className="restaurants-section">
      <div className="section-header-wrap">
        <div>
          <h2>Top Restaurant Chains in {deliveryLocation?.city?.split(",")[0] || "Your Area"} 🏬</h2>
          <p>Handpicked top-rated restaurants with lightning fast delivery</p>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="cuisine-filters-scroll">
          {cuisinesList.map((cuisine, idx) => (
            <button
              key={idx}
              className={`cuisine-pill ${selectedCuisine === cuisine ? "active" : ""}`}
              onClick={() => setSelectedCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="no-restaurants">
          <p>No restaurants found matching your active filter 😔</p>
          <button onClick={() => setSelectedCuisine("All")} className="reset-btn">
            View All Restaurants
          </button>
        </div>
      ) : (
        <div className="restaurants-grid">
          {filteredRestaurants.map((rest) => (
            <Link
              to={`/restaurant/${rest.id}`}
              className="restaurant-card"
              key={rest.id}
            >
              <div className="rest-image-box">
                <img src={rest.image} alt={rest.name} loading="lazy" />
                {rest.discount && (
                  <div className="discount-tag">
                    <span>⚡ {rest.discount}</span>
                  </div>
                )}
                {rest.isVegOnly && (
                  <div className="pure-veg-badge">
                    <span>🌱 PURE VEG</span>
                  </div>
                )}
              </div>

              <div className="rest-info-box">
                <div className="rest-title-row">
                  <h3>{rest.name}</h3>
                  <div className="rating-badge">
                    <span>★ {rest.rating}</span>
                  </div>
                </div>

                <div className="rest-meta-row">
                  <span className="delivery-time">⏱️ {rest.deliveryTime}</span>
                  <span className="dot-sep">•</span>
                  <span className="distance">{rest.distance}</span>
                </div>

                <p className="rest-cuisines">{rest.cuisines.join(", ")}</p>
                <div className="rest-bottom-row">
                  <span className="price-for-two">{rest.priceForTwo}</span>
                  <span className="view-menu-txt">Menu →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Restaurants;
