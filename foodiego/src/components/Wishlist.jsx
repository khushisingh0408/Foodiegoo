import "../css/Wishlist.css";
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } =
    useContext(WishlistContext);

  return (
    <section className="wishlist-page">
      <h1>Your Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <h2>Your Wishlist is Empty 😔</h2>
      ) : (
        <div className="wishlist-container">
          {wishlist.map((food) => (
            <div className="wishlist-item" key={food.id}>
              <img
                src={food.image}
                alt={food.name}
                className="wishlist-image"
              />

              <div className="wishlist-info">
                <h2>{food.name}</h2>
                <p>{food.rating}</p>
                <h3>{food.price}</h3>

                <button
                  className="wishlist-remove"
                  onClick={() => removeFromWishlist(food.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Wishlist;