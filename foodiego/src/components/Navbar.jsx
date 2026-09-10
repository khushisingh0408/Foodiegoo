import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Zap,
  MapPin,
  Search,
  X,
  Heart,
  ShoppingBag,
  Bell,
  User,
  Clock,
  Flame,
  Sparkles,
  Menu,
  Package,
  Tag,
  ChevronDown,
  LogOut,
  Store,
  HelpCircle,
  BadgePercent,
  Layers,
  UtensilsCrossed,
  Truck,
  Leaf
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";
import { foods, brandsList } from "../data/foodsData";
import { restaurants } from "../data/restaurantsData";
import LocationModal from "./LocationModal";
import "../css/Navbar.css";

const announcementMessages = [
  "FLASH SALE IS LIVE: Use code FOODIE50 for 50% OFF up to ₹120!",
  "FREE DELIVERY on all orders above ₹299 — Hot & fresh to your door",
  "Extra 10% Instant Discount on HDFC & ICICI Credit/Debit Cards",
  "New Gourmet Pasta & Artisanal Desserts Added to Menu!"
];

function Navbar() {
  const {
    cart,
    finalTotal,
    isPureVegOnly,
    updatePureVegFilter,
    deliveryLocation,
    activeTrackingOrder,
    notifications,
    unreadNotificationsCount
  } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Recent Searches in localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("foodieGoRecentSearches") || '["Pizza", "Cheeseburger", "Noodles"]');
    } catch {
      return ["Pizza", "Cheeseburger", "Noodles"];
    }
  });

  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Rotate Top Announcement Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcementMessages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMenuOpen(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSearchSubmit = (searchTermToUse) => {
    const term = (typeof searchTermToUse === "string" ? searchTermToUse : searchQuery).trim();
    if (term) {
      const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem("foodieGoRecentSearches", JSON.stringify(updated));

      setIsSearchFocused(false);
      navigate(`/search?search=${encodeURIComponent(term)}`);
    }
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("foodieGoRecentSearches");
  };

  // Autocomplete matching
  const matchedDishes = foods
    .filter((f) => {
      if (isPureVegOnly && !f.isVeg) return false;
      return f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .slice(0, 4);

  const matchedRestaurants = restaurants
    .filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisines.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .slice(0, 2);

  const matchedBrands = brandsList
    .filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 2);

  const trendingTags = ["Margherita Pizza", "Cheeseburger", "Loaded Fries", "Choco Lava", "Hakka Noodles", "Cold Coffee"];
  const categoryChips = [
    { name: "Pizza" },
    { name: "Burger" },
    { name: "Fries" },
    { name: "Drinks" },
    { name: "Dessert" },
    { name: "Noodles" }
  ];

  return (
    <>
      <header className="navbar-container">
        {/* Top Announcement Bar */}
        {showAnnouncement && (
          <div className="top-announcement-bar">
            <div className="announcement-content-wrap">
              <span className="announcement-badge">PROMO</span>
              <span className="announcement-text">{announcementMessages[announcementIndex]}</span>
            </div>
            <div className="announcement-right-links">
              <Link to="/offers" className="top-link">View Offers</Link>
              <span className="top-sep">|</span>
              <Link to="/help" className="top-link">24/7 Support</Link>
              <button
                className="announcement-close"
                onClick={() => setShowAnnouncement(false)}
                aria-label="Close announcement"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <nav className="navbar">
          {/* Left: Brand Logo & Location */}
          <div className="nav-left-section">
            <Link to="/" className="brand-logo" onClick={() => setMenuOpen(false)}>
              <div className="logo-icon-wrap">
                <Zap size={20} fill="#ffffff" color="#ffffff" />
              </div>
              <div className="logo-text">
                <h2>FoodieGo</h2>
                <span className="desktop-tagline">Lightning Delivery</span>
              </div>
            </Link>

            {/* Delivery Location Selector Pill */}
            <button
              className="location-pill-btn"
              onClick={() => setIsLocationModalOpen(true)}
              title="Click to change delivery address"
            >
              <MapPin size={16} className="loc-pin-icon" color="#ff5200" />
              <div className="loc-text-wrap">
                <span className="loc-label">{deliveryLocation?.tag || "Deliver to"}</span>
                <span className="loc-name">
                  {deliveryLocation?.address?.split(",")[0] || "Select Area"}
                </span>
              </div>
              <ChevronDown size={14} color="#94a3b8" />
            </button>
          </div>

          {/* Center: Live Omnisearch Bar */}
          <div className="nav-center-search" ref={searchRef}>
            <form
              className="nav-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
            >
              <Search size={18} className="search-icon" color="#94a3b8" />
              <input
                type="text"
                placeholder="Search food, restaurants, cuisines, brands..."
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
                  <X size={14} />
                </button>
              )}
              <button type="submit" className="search-action-btn">Search</button>
            </form>

            {/* Instant Search Suggestions Dropdown */}
            {isSearchFocused && (
              <div className="search-suggestions-dropdown">
                {searchQuery.trim() === "" ? (
                  <div className="suggestions-initial-panel">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="recent-searches-box">
                        <div className="sugg-header-row">
                          <span className="suggestions-title">
                            <Clock size={14} className="inline-icon" /> Recent Searches
                          </span>
                          <button
                            type="button"
                            className="clear-recent-btn"
                            onClick={clearRecentSearches}
                          >
                            Clear
                          </button>
                        </div>
                        <div className="trending-chips-wrap">
                          {recentSearches.map((term, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="trending-chip recent"
                              onClick={() => handleSearchSubmit(term)}
                            >
                              <Clock size={12} className="inline-icon" /> {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular / Trending Searches */}
                    <div className="trending-searches-box">
                      <div className="suggestions-title">
                        <Flame size={14} className="inline-icon" color="#ea580c" /> Trending Searches
                      </div>
                      <div className="trending-chips-wrap">
                        {trendingTags.map((tag, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="trending-chip"
                            onClick={() => handleSearchSubmit(tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Categories */}
                    <div className="sugg-categories-box">
                      <div className="suggestions-title">
                        <Layers size={14} className="inline-icon" /> Explore Categories
                      </div>
                      <div className="sugg-cat-grid">
                        {categoryChips.map((c, idx) => (
                          <div
                            key={idx}
                            className="sugg-cat-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigate(`/shop?category=${encodeURIComponent(c.name)}`);
                            }}
                          >
                            <UtensilsCrossed size={14} color="#ff5200" />
                            <span>{c.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="live-search-results-list">
                    {/* Matching Brands */}
                    {matchedBrands.length > 0 && (
                      <div className="results-group">
                        <span className="group-label">
                          <Tag size={12} className="inline-icon" /> BRANDS
                        </span>
                        {matchedBrands.map((b) => (
                          <div
                            key={b.id}
                            className="suggestion-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigate(`/shop?brand=${encodeURIComponent(b.name)}`);
                            }}
                          >
                            <Store size={18} color="#ff5200" />
                            <div className="sugg-meta">
                              <strong>{b.name}</strong>
                              <small>{b.count} in {b.category}</small>
                            </div>
                            <span className="sugg-tag">Brand</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Restaurants */}
                    {matchedRestaurants.length > 0 && (
                      <div className="results-group">
                        <span className="group-label">
                          <Store size={12} className="inline-icon" /> RESTAURANTS
                        </span>
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
                              <small style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                {r.cuisines.join(", ")} • <Star size={11} fill="#f59e0b" color="#f59e0b" /> {r.rating}
                              </small>
                            </div>
                            <span className="sugg-tag">Restaurant</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Dishes */}
                    {matchedDishes.length > 0 ? (
                      <div className="results-group">
                        <span className="group-label">
                          <UtensilsCrossed size={12} className="inline-icon" /> DISHES & PRODUCTS
                        </span>
                        {matchedDishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="suggestion-item"
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigate(`/product/${dish.id}`);
                            }}
                          >
                            <img src={dish.image} alt={dish.name} className="sugg-thumb" />
                            <div className="sugg-meta">
                              <strong>{dish.name}</strong>
                              <small>{dish.category} • {dish.brand || dish.restaurantName}</small>
                            </div>
                            <div className="sugg-price-col">
                              <span className="sugg-price">{dish.price}</span>
                              {dish.mrp && <del className="sugg-mrp">{dish.mrp}</del>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      matchedRestaurants.length === 0 && matchedBrands.length === 0 && (
                        <div className="no-sugg-found">
                          <p>No direct matches found for "<strong>{searchQuery}</strong>"</p>
                          <small>Press Enter to perform a full marketplace search</small>
                        </div>
                      )
                    )}

                    <div
                      className="view-all-results-row"
                      onClick={() => handleSearchSubmit()}
                    >
                      See all search results for "{searchQuery}" →
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions, Veg Switch, Live Track, Notifications, Wishlist, Cart, Profile */}
          <div className="nav-right-section">
            {/* Pure Veg Switch */}
            <button
              className={`veg-switch-btn ${isPureVegOnly ? "veg-active" : ""}`}
              onClick={() => updatePureVegFilter(!isPureVegOnly)}
              title="Toggle Pure Veg Only dishes"
            >
              <Leaf size={14} className="veg-leaf-icon" color={isPureVegOnly ? "#16a34a" : "#64748b"} />
              <span className="veg-txt">VEG ONLY</span>
              <div className="switch-knob-track">
                <div className="switch-knob" />
              </div>
            </button>

            {/* Active Live Order Tracker Banner Button (Desktop) */}
            {activeTrackingOrder && (
              <Link
                to={`/track/${activeTrackingOrder.id}`}
                className="live-track-nav-btn desktop-only"
                title="Track Active Order"
              >
                <span className="pulse-dot" />
                <Truck size={14} className="inline-icon" />
                <span>Track Order</span>
              </Link>
            )}

            {/* Notifications Bell Button with Dropdown */}
            <div className="nav-notif-wrap desktop-only">
              <button
                className="nav-icon-link notif-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={20} className="nav-icon" />
                {unreadNotificationsCount > 0 && (
                  <span className="icon-badge notif-badge">{unreadNotificationsCount}</span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="notif-dropdown-card" onMouseLeave={() => setNotifDropdownOpen(false)}>
                  <div className="notif-dropdown-header">
                    <strong>Notifications ({notifications.length})</strong>
                    <Link to="/notifications" onClick={() => setNotifDropdownOpen(false)}>
                      View All
                    </Link>
                  </div>
                  <div className="notif-dropdown-list">
                    {notifications.slice(0, 3).map((n) => (
                      <Link
                        key={n.id}
                        to={n.link || "/notifications"}
                        className={`notif-item ${!n.read ? "unread" : ""}`}
                        onClick={() => setNotifDropdownOpen(false)}
                      >
                        <div className="notif-item-title">{n.title}</div>
                        <p className="notif-item-msg">{n.message}</p>
                        <small className="notif-item-time">{n.time}</small>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Link (Desktop) */}
            <Link to="/wishlist" className="nav-icon-link desktop-only" title="Wishlist">
              <Heart size={20} className="nav-icon" />
              {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
            </Link>

            {/* Desktop Cart Pill */}
            <Link to="/cart" className="nav-cart-pill desktop-only" title="View Cart">
              <div className="cart-pill-icon">
                <ShoppingBag size={18} />
              </div>
              <div className="cart-pill-text">
                <span className="cart-items-txt">
                  {totalCartItems} {totalCartItems === 1 ? "Item" : "Items"}
                </span>
                <strong className="cart-total-txt">₹{finalTotal}</strong>
              </div>
            </Link>

            {/* Mobile Cart Icon Link */}
            <Link to="/cart" className="mobile-cart-btn" aria-label="Cart">
              <ShoppingBag size={22} className="m-cart-icon" />
              {totalCartItems > 0 && (
                <span className="m-cart-badge">{totalCartItems}</span>
              )}
            </Link>

            {/* Desktop User Profile / Login */}
            {isLoggedIn ? (
              <div className="user-profile-menu-wrap desktop-only">
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
                  <ChevronDown size={14} className="arrow-down" />
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
                      to="/account"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User size={15} className="inline-icon" /> Account Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Package size={15} className="inline-icon" /> My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Heart size={15} className="inline-icon" /> Favorite Dishes
                    </Link>
                    <Link
                      to="/offers"
                      className="dropdown-link"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <BadgePercent size={15} className="inline-icon" /> Coupons & Offers
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      className="dropdown-logout-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={15} className="inline-icon" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-login-btn desktop-only">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Secondary Main Navigation Strip */}
        <div className="navbar-subnav desktop-only">
          <div className="subnav-container">
            <Link to="/shop" className="subnav-link highlight">
              <Layers size={14} />
              <span>All Categories</span>
            </Link>
            <Link to="/shop?filter=new" className="subnav-link">
              <Sparkles size={14} color="#2563eb" />
              <span>New Arrivals</span>
              <span className="subnav-badge new">NEW</span>
            </Link>
            <Link to="/shop?filter=bestseller" className="subnav-link">
              <Flame size={14} color="#ea580c" />
              <span>Best Sellers</span>
            </Link>
            <Link to="/shop?filter=flash" className="subnav-link">
              <Zap size={14} color="#dc2626" />
              <span>Flash Deals</span>
              <span className="subnav-badge hot">HOT</span>
            </Link>
            <Link to="/offers" className="subnav-link">
              <Tag size={14} color="#16a34a" />
              <span>Offers & Coupons</span>
            </Link>
            <Link to="/shop?filter=brands" className="subnav-link">
              <Store size={14} color="#7c3aed" />
              <span>Top Brands</span>
            </Link>
            <Link to="/help" className="subnav-link">
              <HelpCircle size={14} color="#64748b" />
              <span>Customer Support</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Strip */}
        <div className="mobile-search-strip" ref={mobileSearchRef}>
          <form
            className="mobile-search-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
          >
            <Search size={16} className="m-search-icon" color="#94a3b8" />
            <input
              type="text"
              placeholder="Search dishes, restaurants, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="m-clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Mobile Search Suggestions */}
          {isSearchFocused && (
            <div className="mobile-search-suggestions">
              {searchQuery.trim() === "" ? (
                <div className="m-trending-searches">
                  <div className="m-sugg-title">
                    <Flame size={14} className="inline-icon" color="#ea580c" /> Popular Searches
                  </div>
                  <div className="m-chips-wrap">
                    {trendingTags.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="m-trending-chip"
                        onClick={() => handleSearchSubmit(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="m-results-list">
                  {matchedDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="m-sugg-item"
                      onClick={() => {
                        setIsSearchFocused(false);
                        navigate(`/product/${dish.id}`);
                      }}
                    >
                      <img src={dish.image} alt={dish.name} className="m-sugg-thumb" />
                      <div className="m-sugg-info">
                        <strong>{dish.name}</strong>
                        <small>{dish.category} • {dish.price}</small>
                      </div>
                      <span className="m-sugg-price">{dish.price}</span>
                    </div>
                  ))}
                  <div
                    className="m-view-all-row"
                    onClick={() => handleSearchSubmit()}
                  >
                    Search all for "{searchQuery}" →
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="mobile-drawer">
            <div
              className="mobile-loc-row"
              onClick={() => {
                setIsLocationModalOpen(true);
                setMenuOpen(false);
              }}
            >
              <span>
                <MapPin size={14} className="inline-icon" color="#ff5200" /> Deliver to: <strong>{deliveryLocation?.tag}</strong> ({deliveryLocation?.city})
              </span>
              <ChevronDown size={14} />
            </div>

            <div className="mobile-drawer-links">
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <UtensilsCrossed size={16} className="inline-icon" /> Home
              </Link>
              <Link to="/shop" onClick={() => setMenuOpen(false)}>
                <Layers size={16} className="inline-icon" /> Shop / All Categories
              </Link>
              <Link to="/shop?filter=flash" onClick={() => setMenuOpen(false)}>
                <Zap size={16} className="inline-icon" color="#dc2626" /> Flash Sale & Deals
              </Link>
              <Link to="/offers" onClick={() => setMenuOpen(false)}>
                <Tag size={16} className="inline-icon" color="#16a34a" /> Coupons & Offers
              </Link>
              <Link to="/account" onClick={() => setMenuOpen(false)}>
                <User size={16} className="inline-icon" /> My Account & Profile
              </Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                <Package size={16} className="inline-icon" /> My Orders & Receipts
              </Link>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                <Heart size={16} className="inline-icon" color="#ef4444" /> Wishlist Favorites ({wishlist.length})
              </Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}>
                <ShoppingBag size={16} className="inline-icon" color="#ff5200" /> My Cart ({totalCartItems} items • ₹{finalTotal})
              </Link>
              <Link to="/help" onClick={() => setMenuOpen(false)}>
                <HelpCircle size={16} className="inline-icon" /> Help Center & FAQ
              </Link>
              {activeTrackingOrder && (
                <Link
                  to={`/track/${activeTrackingOrder.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="track-link-mobile"
                >
                  <Truck size={16} className="inline-icon" /> Track Active Order #{activeTrackingOrder.id}
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
                  <LogOut size={16} className="inline-icon" /> Logout ({user?.name ? user.name.split(" ")[0] : "User"})
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