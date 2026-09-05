import "../css/SearchResults.css";
import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { foods as localFoods } from "../data/foodsData";
import { getFoodImage } from "../utils/foodImages";
import api from "../services/api";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const [foodsList, setFoodsList] = useState(localFoods);

  useEffect(() => {
    async function searchFoods() {
      const res = await api.get(`/foods?search=${encodeURIComponent(searchTerm)}`);
      if (res.success && Array.isArray(res.foods)) {
        setFoodsList(res.foods);
      } else {
        const term = searchTerm.toLowerCase();
        setFoodsList(
          localFoods.filter(
            (f) =>
              f.name.toLowerCase().includes(term) ||
              f.category.toLowerCase().includes(term)
          )
        );
      }
    }

    searchFoods();
  }, [searchTerm]);

  return (
    <section className="search-results-page">
      <div className="search-food-container">
        {foodsList.length === 0 ? (
          <h2>No food found matching &quot;{searchTerm}&quot; 😔</h2>
        ) : (
          foodsList.map((food) => {
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

export default SearchResults;