import "../css/PopularFoods.css";
import burger from "../assets/images/classic Cheeseburger.png";
import pizza from "../assets/images/margherita-pizza.png";
import fries from "../assets/images/french fries.png";
import drink from "../assets/images/soft drink.png";
import dessert from "../assets/images/chocolate fudge cake.png";
import noodles from "../assets/images/veg chowmein.png";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function PopularFoods({ searchTerm, selectedCategory }) {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const foods = [
    {
      id: 1,
      name: "Classic Cheeseburger",
      price: "₹199",
      rating: "⭐ 4.8",
      image: burger,
      category: "Burger",
    },
    {
      id: 2,
      name: "margherita pizza",
      price: "₹299",
      rating: "⭐ 4.9",
      image: pizza,
      category: "Pizza",
    },
    {
      id: 3,
      name: "French Fries",
      price: "₹149",
      rating: "⭐ 4.7",
      image: fries,
      category: "Fries",
    },
    {
      id: 4,
      name: "Soft Drink",
      price: "₹99",
      rating: "⭐ 4.6",
      image: drink,
      category: "Drinks",
    },
    {
      id: 5,
      name: "Chocolate fudge cake",
      price: "₹179",
      rating: "⭐ 4.8",
      image: dessert,
      category: "dessert",
    },
    {
      id: 6,
      name: "Veg Chowmein",
      price: "₹169",
      rating: "⭐ 4.7",
      image: noodles,
      category: "Noodles",
    },
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "" ||
      food.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="popular-foods">
      <h2>🔥 Popular Foods</h2>

      <div className="food-container">
        {filteredFoods.length === 0 ? (
          <h3>No food found 😔</h3>
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

export default PopularFoods;