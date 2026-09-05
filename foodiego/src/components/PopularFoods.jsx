import { useContext, useState, useEffect } from "react";
import "../css/PopularFoods.css";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { foods as localFoods } from "../data/foodsData";
import { getFoodImage } from "../utils/foodImages";
import api from "../services/api";

function PopularFoods({ searchTerm, selectedCategory }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const [foodsList, setFoodsList] = useState(localFoods);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFoods() {
      const res = await api.get("/foods");
      if (res.success && Array.isArray(res.foods) && res.foods.length > 0) {
        setFoodsList(res.foods);
      } else {
        setFoodsList(localFoods);
      }
      setLoading(false);
    }

    loadFoods();
  }, []);

  const filteredFoods = foodsList.filter((food) => {
    const term = (searchTerm || "").toLowerCase().trim();
    const matchesSearch =
      !term ||
      food.name.toLowerCase().includes(term) ||
      food.category.toLowerCase().includes(term) ||
      (food.description && food.description.toLowerCase().includes(term));

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === "" ||
      food.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="popular-foods">
      <h2>🔥 Popular Foods</h2>

      {loading && (
        <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          <p>Loading fresh dishes from database... 🍽️</p>
        </div>
      )}

      <div className="food-container">
        {filteredFoods.length === 0 ? (
          <h3>No food found 😔</h3>
        ) : (
          filteredFoods.map((food) => {
            const displayImage = getFoodImage(food.image, food.id);
            const foodObj = { ...food, image: displayImage };

            return (
              <div className="food-card" key={food.id}>
                <img
                  src={displayImage}
                  alt={food.name}
                  className="food-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
                  }}
                />

                <h3>{food.name}</h3>
                <p>{food.rating}</p>
                <h4>{food.price}</h4>

                <button
                  className="wishlist-btn"
                  onClick={() => addToWishlist(foodObj)}
                  aria-label="Add to wishlist"
                >
                  ❤️
                </button>

                <button onClick={() => addToCart(foodObj)}>
                  Add to Cart
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default PopularFoods;