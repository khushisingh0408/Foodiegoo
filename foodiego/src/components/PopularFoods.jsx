import { useContext, useState, useEffect } from "react";
import "../css/PopularFoods.css";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { foods as localFoods } from "../data/foodsData";
import { getFoodImage } from "../utils/foodImages";
import DishModal from "./DishModal";
import api from "../services/api";

function PopularFoods({ searchTerm, selectedCategory, activeFilter }) {
  const {
    addToCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    isPureVegOnly
  } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const [foodsList, setFoodsList] = useState(localFoods);
  const [loading, setLoading] = useState(true);
  const [activeModalFood, setActiveModalFood] = useState(null);

  useEffect(() => {
    async function loadFoods() {
      const res = await api.get("/foods");
      if (res.success && Array.isArray(res.foods) && res.foods.length > 0) {
        // Merge backend data with rich local metadata (isVeg, sizes, etc.)
        const merged = res.foods.map((serverFood) => {
          const localMatch = localFoods.find((lf) => lf.id === serverFood.id || lf.name === serverFood.name);
          return localMatch ? { ...serverFood, ...localMatch } : serverFood;
        });
        setFoodsList(merged);
      } else {
        setFoodsList(localFoods);
      }
      setLoading(false);
    }

    loadFoods();
  }, []);

  const filteredFoods = foodsList.filter((food) => {
    // Pure Veg Filter
    if (isPureVegOnly && !food.isVeg) return false;

    // Search Query Filter
    const term = (searchTerm || "").toLowerCase().trim();
    const matchesSearch =
      !term ||
      food.name.toLowerCase().includes(term) ||
      (food.category && food.category.toLowerCase().includes(term)) ||
      (food.restaurantName && food.restaurantName.toLowerCase().includes(term)) ||
      (food.description && food.description.toLowerCase().includes(term));

    // Category Filter
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "" ||
      (food.category && food.category.toLowerCase() === selectedCategory.toLowerCase());

    // Quick Hero Filters
    let matchesQuickFilter = true;
    if (activeFilter === "rating") {
      const numRating = parseFloat((food.rating || "").replace("⭐", "").trim()) || 4.5;
      matchesQuickFilter = numRating >= 4.8;
    } else if (activeFilter === "fast") {
      matchesQuickFilter = food.prepTime && (food.prepTime.includes("10") || food.prepTime.includes("15") || food.prepTime.includes("5"));
    } else if (activeFilter === "bestseller") {
      matchesQuickFilter = food.badge === "BESTSELLER" || food.badge === "MUST TRY";
    } else if (activeFilter === "under199") {
      const priceNum = Number(String(food.price).replace("₹", "")) || 200;
      matchesQuickFilter = priceNum <= 199;
    }

    return matchesSearch && matchesCategory && matchesQuickFilter;
  });

  const handleAddClick = (food) => {
    if (food.customizable) {
      setActiveModalFood(food);
    } else {
      addToCart(food);
    }
  };

  const isWishlisted = (foodId) => wishlist.some((item) => item.id === foodId);

  return (
    <section className="popular-foods">
      <div className="section-title-bar">
        <div>
          <h2>🔥 Popular & Trending Dishes</h2>
          <p>Freshly prepared meals delivered straight to you in 20 minutes</p>
        </div>
        <span className="dish-count-tag">{filteredFoods.length} Items</span>
      </div>

      {loading && (
        <div className="loading-dishes-state">
          <p>Loading fresh dishes from kitchen... 🍽️</p>
        </div>
      )}

      <div className="food-container">
        {filteredFoods.length === 0 ? (
          <div className="no-food-state">
            <h3>No food found matching your craving 😔</h3>
            <p>Try clearing filters or search for something else!</p>
          </div>
        ) : (
          filteredFoods.map((food) => {
            const displayImage = getFoodImage(food.image, food.id);
            const foodObj = { ...food, image: displayImage };
            const qty = getItemQuantity(food.id);
            const wishActive = isWishlisted(food.id);

            return (
              <div className="food-card" key={food.id}>
                {/* Top Badge Row */}
                <div className="card-top-badges">
                  <span className={`veg-icon ${food.isVeg ? "veg" : "non-veg"}`}>
                    {food.isVeg ? "🟢" : "🔴"}
                  </span>
                  {food.badge && <span className="dish-badge-pill">{food.badge}</span>}
                  
                  <button
                    className={`wishlist-heart-btn ${wishActive ? "active" : ""}`}
                    onClick={() => {
                      if (wishActive) {
                        removeFromWishlist(food.id);
                      } else {
                        addToWishlist(foodObj);
                      }
                    }}
                    aria-label="Wishlist"
                  >
                    {wishActive ? "❤️" : "🤍"}
                  </button>
                </div>

                {/* Dish Artwork */}
                <div
                  className="food-image-wrapper"
                  onClick={() => food.customizable && setActiveModalFood(foodObj)}
                >
                  <img
                    src={displayImage}
                    alt={food.name}
                    className="food-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>

                {/* Dish Info */}
                <div className="food-card-info">
                  <div className="food-rating-row">
                    <span className="star-rating">{food.rating}</span>
                    <span className="dot-sep">•</span>
                    <span className="prep-time">⏱️ {food.prepTime || "20 mins"}</span>
                  </div>

                  <h3
                    className="food-name"
                    onClick={() => food.customizable && setActiveModalFood(foodObj)}
                  >
                    {food.name}
                  </h3>

                  {food.restaurantName && (
                    <span className="restaurant-tag">🏬 {food.restaurantName}</span>
                  )}

                  <p className="food-card-desc">{food.description}</p>

                  <div className="card-bottom-row">
                    <div className="price-tag">{food.price}</div>

                    {/* Direct Quantity Stepper or Add Button */}
                    <div className="action-button-wrap">
                      {qty === 0 ? (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddClick(foodObj)}
                        >
                          + ADD
                        </button>
                      ) : (
                        <div className="card-qty-stepper">
                          <button onClick={() => decreaseQuantity(food.id)}>−</button>
                          <span>{qty}</span>
                          <button onClick={() => increaseQuantity(food.id)}>+</button>
                        </div>
                      )}

                      {food.customizable && (
                        <small
                          className="customise-label"
                          onClick={() => setActiveModalFood(foodObj)}
                        >
                          Customisable
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dish Customization Modal */}
      {activeModalFood && (
        <DishModal
          food={activeModalFood}
          isOpen={!!activeModalFood}
          onClose={() => setActiveModalFood(null)}
        />
      )}
    </section>
  );
}

export default PopularFoods;