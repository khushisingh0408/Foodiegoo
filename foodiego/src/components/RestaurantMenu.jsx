import { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { restaurants } from "../data/restaurantsData";
import { foods } from "../data/foodsData";
import { CartContext } from "../context/CartContext";
import DishModal from "./DishModal";
import "../css/RestaurantMenu.css";

function RestaurantMenu() {
  const { id } = useParams();
  const {
    addToCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    isPureVegOnly,
    updatePureVegFilter
  } = useContext(CartContext);

  const [menuSearch, setMenuSearch] = useState("");
  const [activeModalFood, setActiveModalFood] = useState(null);

  const restaurant = restaurants.find((r) => r.id === id) || restaurants[0];

  // Get dishes belonging to this restaurant (or fallback to related category)
  let restaurantDishes = foods.filter(
    (f) => f.restaurantId === restaurant.id || (restaurant.popularDishes && restaurant.popularDishes.includes(f.id))
  );

  // If few dishes, include more from matching category
  if (restaurantDishes.length < 5) {
    const additional = foods.filter(
      (f) => f.category.toLowerCase() === (restaurant.category || "").toLowerCase() && !restaurantDishes.some(rd => rd.id === f.id)
    );
    restaurantDishes = [...restaurantDishes, ...additional];
  }

  // Filter based on search & Pure Veg
  const filteredDishes = restaurantDishes.filter((dish) => {
    if (isPureVegOnly && !dish.isVeg) return false;
    if (!menuSearch.trim()) return true;
    return (
      dish.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(menuSearch.toLowerCase())
    );
  });

  const bestsellers = filteredDishes.filter((d) => d.badge === "BESTSELLER" || d.badge === "MUST TRY");
  const otherDishes = filteredDishes.filter((d) => d.badge !== "BESTSELLER" && d.badge !== "MUST TRY");

  const handleAddClick = (food) => {
    if (food.customizable) {
      setActiveModalFood(food);
    } else {
      addToCart(food);
    }
  };

  return (
    <div className="restaurant-menu-page">
      {/* Back to Home Breadcrumb */}
      <div className="menu-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/">Restaurants</Link>
        <span>/</span>
        <span>{restaurant.name}</span>
      </div>

      {/* Restaurant Header Banner Card */}
      <div className="restaurant-header-card">
        <div className="rest-header-main">
          <div className="rest-title-area">
            <h1>{restaurant.name}</h1>
            <p className="rest-cuisines-sub">{restaurant.cuisines.join(", ")}</p>
            <p className="rest-loc-sub">📍 {restaurant.address}</p>
          </div>

          <div className="rest-rating-box">
            <div className="rating-score">★ {restaurant.rating}</div>
            <div className="rating-total">{restaurant.ratingCount} reviews</div>
          </div>
        </div>

        <div className="rest-header-divider" />

        <div className="rest-quick-stats">
          <div className="stat-pill">
            <span className="stat-icon">⏱️</span>
            <strong>{restaurant.deliveryTime}</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">📍</span>
            <strong>{restaurant.distance}</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-icon">💰</span>
            <strong>{restaurant.priceForTwo}</strong>
          </div>
        </div>

        {restaurant.discount && (
          <div className="rest-deal-banner">
            <span>🏷️ {restaurant.discount} | Use Code: FOODIE50</span>
          </div>
        )}
      </div>

      {/* Menu Filter & Search Bar */}
      <div className="menu-controls-bar">
        <div className="menu-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder={`Search in ${restaurant.name} menu...`}
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
          />
          {menuSearch && (
            <button className="clear-btn" onClick={() => setMenuSearch("")}>
              ✕
            </button>
          )}
        </div>

        <button
          className={`veg-toggle-btn ${isPureVegOnly ? "active" : ""}`}
          onClick={() => updatePureVegFilter(!isPureVegOnly)}
        >
          <span className="veg-dot">🟢</span>
          <span>Pure Veg Only</span>
        </button>
      </div>

      {/* Dishes Sections */}
      <div className="menu-sections-container">
        {/* Section 1: Recommended & Bestsellers */}
        {bestsellers.length > 0 && (
          <div className="menu-section">
            <h2 className="section-title">⭐ Recommended & Bestsellers ({bestsellers.length})</h2>
            <div className="dishes-list">
              {bestsellers.map((dish) => {
                const qty = getItemQuantity(dish.id);
                return (
                  <div className="dish-row-item" key={dish.id}>
                    <div className="dish-row-left">
                      <div className="dish-indicator-row">
                        <span className={`veg-nonveg-icon ${dish.isVeg ? "veg" : "non-veg"}`}>
                          {dish.isVeg ? "🟢" : "🔴"}
                        </span>
                        {dish.badge && <span className="bestseller-tag">{dish.badge}</span>}
                      </div>

                      <h3 className="dish-row-name">{dish.name}</h3>
                      <div className="dish-row-price">{dish.price}</div>
                      <div className="dish-row-rating">
                        <span>★ {dish.rating.replace("⭐", "").trim()}</span>
                        <small>({dish.ratingCount || "100+"})</small>
                      </div>
                      <p className="dish-row-desc">{dish.description}</p>
                    </div>

                    <div className="dish-row-right">
                      <div className="dish-img-wrap">
                        <img src={dish.image} alt={dish.name} />
                        
                        <div className="dish-action-container">
                          {qty === 0 ? (
                            <button
                              className="add-btn-primary"
                              onClick={() => handleAddClick(dish)}
                            >
                              ADD +
                            </button>
                          ) : (
                            <div className="qty-stepper-btn">
                              <button onClick={() => decreaseQuantity(dish.id)}>−</button>
                              <span>{qty}</span>
                              <button onClick={() => increaseQuantity(dish.id)}>+</button>
                            </div>
                          )}

                          {dish.customizable && (
                            <small
                              className="custom-hint"
                              onClick={() => setActiveModalFood(dish)}
                            >
                              Customisable
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: All Other Dishes */}
        <div className="menu-section">
          <h2 className="section-title">🍽️ Main Menu & Specials ({otherDishes.length})</h2>
          <div className="dishes-list">
            {otherDishes.map((dish) => {
              const qty = getItemQuantity(dish.id);
              return (
                <div className="dish-row-item" key={dish.id}>
                  <div className="dish-row-left">
                    <div className="dish-indicator-row">
                      <span className={`veg-nonveg-icon ${dish.isVeg ? "veg" : "non-veg"}`}>
                        {dish.isVeg ? "🟢" : "🔴"}
                      </span>
                      {dish.badge && <span className="bestseller-tag">{dish.badge}</span>}
                    </div>

                    <h3 className="dish-row-name">{dish.name}</h3>
                    <div className="dish-row-price">{dish.price}</div>
                    <div className="dish-row-rating">
                      <span>★ {dish.rating.replace("⭐", "").trim()}</span>
                      <small>({dish.ratingCount || "100+"})</small>
                    </div>
                    <p className="dish-row-desc">{dish.description}</p>
                  </div>

                  <div className="dish-row-right">
                    <div className="dish-img-wrap">
                      <img src={dish.image} alt={dish.name} />
                      
                      <div className="dish-action-container">
                        {qty === 0 ? (
                          <button
                            className="add-btn-primary"
                            onClick={() => handleAddClick(dish)}
                          >
                            ADD +
                          </button>
                        ) : (
                          <div className="qty-stepper-btn">
                            <button onClick={() => decreaseQuantity(dish.id)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => increaseQuantity(dish.id)}>+</button>
                          </div>
                        )}

                        {dish.customizable && (
                          <small
                            className="custom-hint"
                            onClick={() => setActiveModalFood(dish)}
                          >
                            Customisable
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dish Customization Modal */}
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

export default RestaurantMenu;
