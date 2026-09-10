import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  TrendingDown,
  X,
  Star,
  UtensilsCrossed,
  Plus
} from "lucide-react";
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
    showToast(`Moved ${wishlist.length} favorite items to cart!`, "success");
  };

  return (
    <div className="wishlist-page-container">
      {/* Header */}
      <div className="wishlist-header-bar">
        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            My Wishlist & Favorites ({wishlist.length}) <Heart size={24} color="#ff4757" fill="#ff4757" />
          </h1>
          <p>Saved culinary items with live price-drop tracking</p>
        </div>
        {wishlist.length > 0 && (
          <button className="move-all-cart-btn" onClick={handleMoveAllToCart} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ShoppingBag size={16} /> Move All to Cart
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist-view">
          <div className="empty-wish-icon" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <Heart size={64} color="#ff4757" />
          </div>
          <h2>Your Wishlist is Currently Empty</h2>
          <p>Explore our trending pizzas, burgers, shakes, and noodle bowls to add your cravings!</p>
          <Link to="/shop" className="browse-dishes-cta" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <UtensilsCrossed size={16} /> Discover Delicious Dishes
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
                    <span className="price-drop-alert-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <TrendingDown size={13} color="#10b981" /> Price dropped by ₹40!
                    </span>
                  )}
                  <button
                    className="remove-wish-item-btn"
                    onClick={() => removeFromWishlist(food.id)}
                    title="Remove from wishlist"
                  >
                    <X size={15} />
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
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                      <Star size={13} fill="#f59e0b" stroke="#f59e0b" /> {food.rating ? String(food.rating).replace("⭐", "").trim() : "4.8"}
                    </span>
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
                      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                    >
                      <Plus size={15} /> Move to Cart
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