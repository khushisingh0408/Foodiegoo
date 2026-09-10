import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import "../css/Wishlist.css";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart, showToast } = useContext(CartContext);

  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item);
    });
    showToast(`Moved ${wishlist.length} favorite items to cart! 🛒`, "success");
  };

  return (
    <div className="wishlist-page-container">
      {/* Header */}
      <div className="wishlist-header-bar">
        <div>
          <h1>My Wishlist & Favorites ({wishlist.length}) ❤️</h1>
          <p>Saved culinary items with live price-drop tracking</p>
        </div>
        {wishlist.length > 0 && (
          <button className="move-all-cart-btn" onClick={handleMoveAllToCart}>
            Move All to Cart 🛒
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist-view">
          <div className="empty-wish-icon">❤️</div>
          <h2>Your Wishlist is Currently Empty</h2>
          <p>Explore our trending pizzas, burgers, shakes, and noodle bowls to add your cravings!</p>
          <Link to="/shop" className="browse-dishes-cta">
            Discover Delicious Dishes 🍕
          </Link>
        </div>
      ) : (
        <div className="wishlist-products-grid">
          {wishlist.map((food) => {
            const hasPriceDrop = food.id === 1 || food.id === 3 || food.id === 6; // Simulation for price drop
            return (
              <div className="wishlist-product-card" key={food.id}>
                {/* Top Badges */}
                <div className="wish-card-top-badges">
                  {hasPriceDrop && (
                    <span className="price-drop-alert-badge">
                      📉 Price dropped by ₹40!
                    </span>
                  )}
                  <button
                    className="remove-wish-item-btn"
                    onClick={() => removeFromWishlist(food.id)}
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                {/* Product Image */}
                <Link to={`/product/${food.id}`} className="wish-image-wrap">
                  <img src={food.image} alt={food.name} />
                </Link>

                {/* Body */}
                <div className="wish-card-body">
                  <span className="wish-brand">{food.brand || food.restaurantName || "FoodieGo"}</span>
                  <Link to={`/product/${food.id}`}>
                    <h3 className="wish-name">{food.name}</h3>
                  </Link>

                  <div className="wish-rating-row">
                    <span>{food.rating || "⭐ 4.8"}</span>
                    <span className="stock-in-tag">● In Stock & Ready</span>
                  </div>

                  <div className="wish-price-row">
                    <div className="price-group">
                      <strong className="current-price">{food.price}</strong>
                      {food.mrp && <del className="mrp-price">{food.mrp}</del>}
                    </div>
                    {food.discountPercent && (
                      <span className="disc-pill">{food.discountPercent}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="wish-bottom-actions">
                    <button
                      className="add-to-cart-wish-btn"
                      onClick={() => {
                        addToCart(food);
                        removeFromWishlist(food.id);
                      }}
                    >
                      + Move to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;