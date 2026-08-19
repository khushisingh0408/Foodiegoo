import "../css/SearchResults.css";
import burger from "../assets/images/classic Cheeseburger.png";
import pizza from "../assets/images/margherita-pizza.png";
import fries from "../assets/images/french fries.png";
import drink from "../assets/images/soft drink.png";
import dessert from "../assets/images/chocolate fudge cake.png";
import noodles from "../assets/images/veg chowmein.png";
import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const foods = [
    {
      id: 1,
      name: "Burger",
      price: "₹199",
      rating: "⭐ 4.8",
      image: burger,
    },
    {
      id: 2,
      name: "Pizza",
      price: "₹299",
      rating: "⭐ 4.9",
      image: pizza,
    },
    {
      id: 3,
      name: "Fries",
      price: "₹149",
      rating: "⭐ 4.7",
      image: fries,
    },
    {
      id: 4,
      name: "Drink",
      price: "₹99",
      rating: "⭐ 4.6",
      image: drink,
    },
    {
      id: 5,
      name: "Dessert",
      price: "₹179",
      rating: "⭐ 4.8",
      image: dessert,
    },
    {
      id: 6,
      name: "Noodles",
      price: "₹169",
      rating: "⭐ 4.7",
      image: noodles,
    },
  ];

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="search-results-page">
      


      <div className="search-food-container">
        {filteredFoods.length === 0 ? (
          <h2>No food found 😔</h2>
        ) : (
          filteredFoods.map((food) => (
            <div className="food-card" key={food.id}>
              <img
                src={food.image}
                alt={food.name}
                className="food-image"
              />

              <h3>{food.name}</h3>

              <p>{food.rating}</p>

              <h4>{food.price}</h4>

              <button
                className="wishlist-btn"
                onClick={() => addToWishlist(food)}
              >
                ❤️
              </button>

              <button onClick={() => addToCart(food)}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default SearchResults;