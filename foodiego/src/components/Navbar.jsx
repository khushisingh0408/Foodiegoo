import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { foods } from "../data/foodsData";
import { restaurants } from "../data/restaurantsData";
import LocationModal from "./LocationModal";
import "../css/Navbar.css";

function Navbar() {
  const {
    cart,
    finalTotal,
    isPureVegOnly,
    updatePureVegFilter,
    deliveryLocation,
    activeTrackingOrder
  } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Search auto-suggestions
  const matchedDishes = foods
    .filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4);

  const matchedRestaurants = restaurants
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 2);

  const trendingTags = ["Margherita Pizza", "Cheeseburger", "Noodles", "Choco Lava", "Fries"];

  return (
    <>
      <header className="navbar-container">
        <nav className="navbar">
          {/* Left: Brand Logo & Location Selector */}
          <div className="nav-left-section">
            <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
              <div className="logo-icon-wrap">⚡</div>
              <div className="logo-text">
                <h2>FoodieGo</h2>
                <span>Lightning Delivery</span>
              </div>
            </Link>

            {/* Delivery Location Selector Pill */}
            <button
              className="location-pill-btn"
              onClick={() => setIsLocationModalOpen(true)}
              title="Click to change delivery address"
            >
              <span className="loc-pin">📍</span>
              <div className="loc-text-wrap">
                <span className="loc-label">{deliveryLocation?.tag || "Deliver to"}</span>
                <span className="loc-name">
                  {deliveryLocation?.address?.split(",")[0] || "Select Area"} ▾
                </span>
              </div>
            </button>
          </div>

          {/* Center: Live Search Bar with Instant Suggestions */}
          <div className="nav-center-search" ref={searchRef}>
            <form className="nav-search-form" onSubmit={handleSearchSubmit}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search for restaurants, dishes, cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="search-suggestions-dropdown">
                {searchQuery.trim() === "" ? (
                  <div className="trending-searches-box">
                    <div className="suggestions-title">🔥 Trending Searches</div>
                    <div className="trending-chips-wrap">
                      {trendingTags.map((tag, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="trending-chip"
                          onClick={() => {
                            setSearchQuery(tag);
                            setIsSearchFocused(false);
                            navigate(`/search?search=${encodeURIComponent(tag)}`);
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="live-search-results-list">
                    {/* Matching Restaurants */}
                    {matchedRestaurants.length > 0 && (
                      <div className="results-group">
                        <span className="group-label">🏬 RESTAURANTS</span>
                        {matchedRestaurants.map((r) => (
                          <div
                            key={r.id}
                            className="suggestion-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigate(`/restaurant/${r.id}`);
                            }}
                          >
                            <img src={r.image} alt={r.name} className="sugg-thumb" />
                            <div className="sugg-meta">
                              <strong>{r.name}</strong>
                              <small>{r.cuisines.join(", ")} • ★ {r.rating}</small>
                            </div>
                            <span className="sugg-tag">Restaurant</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Dishes */}
                    {matchedDishes.length > 0 ? (
                      <div className="results-group">
                        <span className="group-label">🍽️ DISHES</span>
                        {matchedDishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="suggestion-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigate(`/search?search=${encodeURIComponent(dish.name)}`);
                            }}
                          >
                            <img src={dish.image} alt={dish.name} className="sugg-thumb" />
                            <div className="sugg-meta">
                              <strong>{dish.name}</strong>
                              <small>{dish.category} • {dish.price}</small>
                            </div>
                            <span className="sugg-price">{dish.price}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      matchedRestaurants.length === 0 && (
                        <div className="no-sugg-found">
                          <span>No matches found for "{searchQuery}"</span>
                        </div>
                      )
                    )}

                    <div
                      className="view-all-results-row"
                      onClick={() => handleSearchSubmit()}
                    >
                      See all results for "{searchQuery}" →
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions, Pure Veg Switch, Cart, Profile */}
          <div className="nav-right-section">
            {/* Pure Veg Switch */}
            <button
              className={`veg-switch-btn ${isPureVegOnly ? "veg-active" : ""}`}
              onClick={() => updatePureVegFilter(!isPureVegOnly)}
              title="Toggle Pure Veg Only dishes"
            >
              <span className="veg-leaf">🌱</span>
              <span className="veg-txt">VEG ONLY</span>
              <div className="switch-knob-track">
                <div className="switch-knob" />
              </div>
            </button>

            {/* Active Live Order Tracker Banner Button (if any) */}
            {activeTrackingOrder && (
              <Link
                to={`/track/${activeTrackingOrder.id}`}
                className="live-track-nav-btn"
                title="Track Active Order"
              >
                <span className="pulse-dot" />
                <span>Track Order 🛵</span>
              </Link>
            )}

            {/* Wishlist Link */}
            <Link to="/wishlist" className="nav-icon-link" title="Wishlist">
              <span className="nav-icon">❤️</span>
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </Link>

            {/* Cart Pill */}
            <Link to="/cart" className="nav-cart-pill" title="View Cart">
              <div className="cart-pill-icon">🛒</div>
              <div className="cart-pill-text">
                <span className="cart-items-txt">
                  {totalCartItems} {totalCartItems === 1 ? "Item" : "Items"}
                </span>
                <strong className="cart-total-txt">₹{finalTotal}</strong>
              </div>
            </Link>

            {/* User Profile / Login */}
            {isLoggedIn ? (
              <div className="user-profile-menu-wrap">
                <button
                  className="user-profile-pill"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="user-avatar-initial">
                    {user?.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="user-firstname">
                    {user?.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                  <span className="arrow-down">▾</span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="user-dropdown-card"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="dropdown-user-header">
                      <strong>{user?.name || "FoodieGo Member"}</strong>
                      <small>{user?.email || "user@foodiego.com"}</small>
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/orders"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      ❤️ Favorite Dishes
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-loc-row" onClick={() => { setIsLocationModalOpen(true); setMenuOpen(false); }}>
              <span>📍 Deliver to: <strong>{deliveryLocation?.tag}</strong> ({deliveryLocation?.city})</span>
              <span>Change ▾</span>
            </div>

            <div className="mobile-drawer-links">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                🏠 Home & Menu
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                📦 My Orders
              </Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                ❤️ Wishlist ({wishlist.length})
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                🛒 Cart ({totalCartItems} items • ₹{finalTotal})
              </Link>
              {activeTrackingOrder && (
                <Link to={`/track/${activeTrackingOrder.id}`} onClick={() => setMenuOpen(false)} className="track-link-mobile">
                  🛵 Track Active Order
                </Link>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {isLoggedIn ? (
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                >
                  Logout ({user?.name ? user.name.split(" ")[0] : "User"})
                </button>
              ) : (
                <Link to="/login" className="mobile-signin-btn" onClick={() => setMenuOpen(false)}>
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
}

export default Navbar;