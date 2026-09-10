import { useLocation, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { foods } from "../data/foodsData";
import { restaurants } from "../data/restaurantsData";
import { CartContext } from "../context/CartContext";
import DishModal from "./DishModal";
import "../css/SearchResults.css";

function SearchResults() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = (queryParams.get("search") || "").trim().toLowerCase();

  const {
    addToCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    isPureVegOnly,
    updatePureVegFilter
  } = useContext(CartContext);

  const [activeModalFood, setActiveModalFood] = useState(null);
  const [selectedSort, setSelectedSort] = useState("relevance");

  // Matched Restaurants
  const matchedRestaurants = restaurants.filter((r) => {
    if (isPureVegOnly && !r.isVegOnly) return false;
    if (!query) return true;
    return (
      r.name.toLowerCase().includes(query) ||
      r.cuisines.some((c) => c.toLowerCase().includes(query)) ||
      (r.category && r.category.toLowerCase().includes(query))
    );
  });

  // Matched Dishes
  let matchedDishes = foods.filter((food) => {
    if (isPureVegOnly && !food.isVeg) return false;
    if (!query) return true;
    return (
      food.name.toLowerCase().includes(query) ||
      food.category.toLowerCase().includes(query) ||
      (food.restaurantName && food.restaurantName.toLowerCase().includes(query)) ||
      (food.description && food.description.toLowerCase().includes(query))
    );
  });

  // Sort
  if (selectedSort === "price-low") {
    matchedDishes.sort((a, b) => {
      const pa = Number(String(a.price).replace("₹", ""));
      const pb = Number(String(b.price).replace("₹", ""));
      return pa - pb;
    });
  } else if (selectedSort === "price-high") {
    matchedDishes.sort((a, b) => {
      const pa = Number(String(a.price).replace("₹", ""));
      const pb = Number(String(b.price).replace("₹", ""));
      return pb - pa;
    });
  } else if (selectedSort === "rating") {
    matchedDishes.sort((a, b) => {
      const ra = parseFloat(String(a.rating).replace("⭐", "").trim()) || 0;
      const rb = parseFloat(String(b.rating).replace("⭐", "").trim()) || 0;
      return rb - ra;
    });
  }

  const handleAddClick = (food) => {
    if (food.customizable) {
      setActiveModalFood(food);
    } else {
      addToCart(food);
    }
  };

  return (
    <div className="search-results-page">
      <div className="search-results-header">
        <div>
          <h1>Search Results for "{query}" 🔍</h1>
          <p>Showing matching restaurants and dishes in your delivery area</p>
        </div>

        {/* Filter Controls */}
        <div className="search-filter-controls">
          <button
            className={`veg-filter-btn ${isPureVegOnly ? "active" : ""}`}
            onClick={() => updatePureVegFilter(!isPureVegOnly)}
          >
            <span>🟢 Pure Veg</span>
          </button>

          <select
            className="sort-select"
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="rating">Sort: Rating (High to Low)</option>
            <option value="price-low">Sort: Price (Low to High)</option>
            <option value="price-high">Sort: Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Section 1: Matched Restaurants */}
      {matchedRestaurants.length > 0 && (
        <div className="search-section">
          <h2>🏬 Restaurants ({matchedRestaurants.length})</h2>
          <div className="search-restaurants-grid">
            {matchedRestaurants.map((r) => (
              <Link to={`/restaurant/${r.id}`} className="search-rest-card" key={r.id}>
                <img src={r.image} alt={r.name} />
                <div className="search-rest-info">
                  <div className="s-rest-title-row">
                    <h3>{r.name}</h3>
                    <span className="s-rest-rating">★ {r.rating}</span>
                  </div>
                  <p>{r.cuisines.join(", ")}</p>
                  <small>⏱️ {r.deliveryTime} • {r.priceForTwo}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Matched Dishes */}
      <div className="search-section">
        <h2>🍽️ Dishes ({matchedDishes.length})</h2>

        {matchedDishes.length === 0 && matchedRestaurants.length === 0 ? (
          <div className="no-search-results">
            <h3>No results found for "{query}" 😔</h3>
            <p>Try searching for popular items like Pizza, Burger, Noodles, Biryani, or Cake.</p>
            <Link to="/" className="home-link-btn">
              Back to Home 🏠
            </Link>
          </div>
        ) : (
          <div className="search-dishes-grid">
            {matchedDishes.map((dish) => {
              const qty = getItemQuantity(dish.id);
              return (
                <div className="search-dish-card" key={dish.id}>
                  <div className="s-dish-top">
                    <span className="s-dish-diet">{dish.isVeg ? "🟢" : "🔴"}</span>
                    {dish.badge && <span className="s-dish-badge">{dish.badge}</span>}
                  </div>

                  <div className="s-dish-img-wrap">
                    <img src={dish.image} alt={dish.name} />
                  </div>

                  <div className="s-dish-meta">
                    <div className="s-dish-rating">
                      <span>★ {dish.rating.replace("⭐", "").trim()}</span>
                      <small>⏱️ {dish.prepTime || "20 mins"}</small>
                    </div>

                    <h4>{dish.name}</h4>
                    {dish.restaurantName && (
                      <span className="s-dish-rest">🏬 {dish.restaurantName}</span>
                    )}

                    <div className="s-dish-bottom">
                      <strong>{dish.price}</strong>

                      <div className="s-dish-actions">
                        {qty === 0 ? (
                          <button
                            className="s-add-btn"
                            onClick={() => handleAddClick(dish)}
                          >
                            + ADD
                          </button>
                        ) : (
                          <div className="s-qty-stepper">
                            <button onClick={() => decreaseQuantity(dish.id)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => increaseQuantity(dish.id)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dish Modal */}
      {activeModalFood && (
        <DishModal
          food={activeModalFood}
          isOpen={!!activeModalFood}
          onClose={() => setActiveModalFood(null)}
        />
      )}
    </div>
  );
}

export default SearchResults;