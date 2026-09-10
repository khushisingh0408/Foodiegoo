import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Zap, Heart, SlidersHorizontal, Eye, Flame, Star, Plus, Minus } from "lucide-react";
import { foods } from "../data/foodsData";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import DishModal from "./DishModal";
import "../css/FlashSaleSection.css";

function FlashSaleSection() {
  const { addToCart, getItemQuantity, increaseQuantity, decreaseQuantity, isPureVegOnly, addToCompare } = useContext(CartContext);
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const [quickViewFood, setQuickViewFood] = useState(null);

  // Live Countdown Timer (HH:MM:SS)
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashItems = foods.filter((f) => {
    if (isPureVegOnly && !f.isVeg) return false;
    return f.isFlashSale;
  }).slice(0, 4);

  const formatDigit = (num) => String(num).padStart(2, "0");

  return (
    <section className="flash-sale-section">
      <div className="flash-sale-header">
        <div className="flash-title-wrap">
          <div className="flash-icon-box">
            <Zap size={22} fill="#ffffff" color="#ffffff" />
          </div>
          <div>
            <div className="flash-badge-tag">LIMITED TIME OFFER</div>
            <h2>Daily Flash Sale — Up to 50% OFF</h2>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="countdown-clock-card">
          <span className="clock-label">Ends in:</span>
          <div className="clock-digits">
            <div className="digit-box">
              <span>{formatDigit(timeLeft.hours)}</span>
              <small>Hours</small>
            </div>
            <span className="colon">:</span>
            <div className="digit-box">
              <span>{formatDigit(timeLeft.minutes)}</span>
              <small>Mins</small>
            </div>
            <span className="colon">:</span>
            <div className="digit-box">
              <span>{formatDigit(timeLeft.seconds)}</span>
              <small>Secs</small>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale Product Grid */}
      <div className="flash-products-grid">
        {flashItems.map((food) => {
          const qty = getItemQuantity(food.id);
          const isWishlisted = wishlist.some((w) => w.id === food.id);
          const stockLeft = food.stock || 4;
          const maxStock = 12;
          const stockPercent = Math.min(100, Math.round((stockLeft / maxStock) * 100));

          return (
            <div className="flash-product-card" key={food.id}>
              {/* Badges Row */}
              <div className="flash-card-badges">
                <span className="flash-discount-badge">{food.discountPercent || "30% OFF"}</span>
                <div className="card-top-right-actions">
                  <button
                    className={`wishlist-heart-btn ${isWishlisted ? "active" : ""}`}
                    onClick={() => (isWishlisted ? removeFromWishlist(food.id) : addToWishlist(food))}
                    aria-label="Wishlist"
                  >
                    <Heart size={15} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#64748b"} />
                  </button>
                  <button
                    className="compare-mini-btn"
                    onClick={() => addToCompare(food)}
                    title="Compare item"
                  >
                    <SlidersHorizontal size={14} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Product Thumbnail */}
              <div className="flash-image-wrapper" onClick={() => setQuickViewFood(food)}>
                <img src={food.image} alt={food.name} loading="lazy" />
                <button
                  className="quick-view-overlay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickViewFood(food);
                  }}
                >
                  <Eye size={12} className="inline-icon" /> Quick View
                </button>
              </div>

              {/* Product Details */}
              <div className="flash-card-body">
                <span className="flash-brand-name">{food.brand || food.restaurantName}</span>
                <Link to={`/product/${food.id}`} className="flash-product-name">
                  <h3>{food.name}</h3>
                </Link>

                <div className="flash-rating-row">
                  <span className="flash-star">
                    <Star size={12} fill="#ca8a04" color="#ca8a04" className="inline-icon" /> {food.ratingScore || 4.8}
                  </span>
                  <span className="flash-reviews">({food.ratingCount || "1.2k"})</span>
                  <span className="flash-diet-dot">
                    <span className={`diet-indicator-dot ${food.isVeg ? "veg" : "non-veg"}`} />
                    {food.isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>

                {/* Stock Warning Progress Bar */}
                <div className="stock-progress-wrap">
                  <div className="stock-text-row">
                    <span className="stock-alert">
                      <Flame size={12} color="#dc2626" className="inline-icon" /> Only {stockLeft} left in stock!
                    </span>
                    <span className="stock-status">Selling Fast</span>
                  </div>
                  <div className="stock-track">
                    <div className="stock-fill" style={{ width: `${stockPercent}%` }} />
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flash-card-footer">
                  <div className="flash-price-group">
                    <span className="flash-selling-price">{food.price}</span>
                    {food.mrp && <del className="flash-mrp">{food.mrp}</del>}
                  </div>

                  {qty === 0 ? (
                    <button
                      className="flash-add-btn"
                      onClick={() => (food.customizable ? setQuickViewFood(food) : addToCart(food))}
                    >
                      <Plus size={14} className="inline-icon" /> ADD
                    </button>
                  ) : (
                    <div className="flash-qty-stepper">
                      <button onClick={() => decreaseQuantity(food.id)}>
                        <Minus size={13} />
                      </button>
                      <span>{qty}</span>
                      <button onClick={() => increaseQuantity(food.id)}>
                        <Plus size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewFood && (
        <DishModal
          food={quickViewFood}
          isOpen={!!quickViewFood}
          onClose={() => setQuickViewFood(null)}
        />
      )}
    </section>
  );
}

export default FlashSaleSection;
