import { useState, useMemo, useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { foods, brandsList } from "../data/foodsData";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import DishModal from "./DishModal";
import "../css/ShopPage.css";

function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialBrand = searchParams.get("brand") || "";
  const initialFilter = searchParams.get("filter") || ""; // new | bestseller | flash | brands

  const {
    addToCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    isPureVegOnly,
    updatePureVegFilter,
    addToCompare
  } = useContext(CartContext);

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedDiet, setSelectedDiet] = useState(isPureVegOnly ? "veg" : "all"); // all | veg | nonveg
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(
    initialFilter === "flash" ? "flash" : initialFilter === "bestseller" ? "bestseller" : initialFilter === "new" ? "new" : "all"
  );
  const [inStockOnly, setInStockOnly] = useState(false);

  // View Mode: grid vs list
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular"); // popular | newest | price-asc | price-desc | rating | discount

  // Mobile Bottom-Sheet Filters Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick View Modal
  const [quickViewFood, setQuickViewFood] = useState(null);

  // Sync state if URL searchParams change
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    const b = searchParams.get("brand") || "";
    const f = searchParams.get("filter") || "";
    if (cat) setSelectedCategory(cat);
    if (b) setSelectedBrand(b);
    if (f === "flash") setSelectedBadge("flash");
    else if (f === "bestseller") setSelectedBadge("bestseller");
    else if (f === "new") setSelectedBadge("new");
  }, [searchParams]);

  const categoriesList = ["All", "Pizza", "Burger", "Fries", "Drinks", "Dessert", "Noodles"];

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = foods.filter((food) => {
      // Global Pure Veg filter or Local Diet filter
      if (isPureVegOnly && !food.isVeg) return false;
      if (selectedDiet === "veg" && !food.isVeg) return false;
      if (selectedDiet === "nonveg" && food.isVeg) return false;

      // Category filter
      if (selectedCategory && selectedCategory !== "All") {
        if (food.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      // Brand filter
      if (selectedBrand) {
        if ((food.brand || food.restaurantName).toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // Max price filter
      const priceNum = Number(String(food.price).replace("₹", ""));
      if (priceNum > maxPrice) return false;

      // Rating filter
      const ratingNum = food.ratingScore || parseFloat(String(food.rating).replace("⭐", "").trim()) || 4.5;
      if (ratingNum < minRating) return false;

      // Discount filter
      const discNum = parseInt(String(food.discountPercent || "0").replace("% OFF", "")) || 0;
      if (discNum < minDiscount) return false;

      // Special offer/badge filter
      if (selectedBadge === "flash" && !food.isFlashSale) return false;
      if (selectedBadge === "bestseller" && !food.isBestSeller) return false;
      if (selectedBadge === "new" && !food.isNewArrival) return false;

      // In-stock only
      if (inStockOnly && (food.stock || 0) <= 0) return false;

      return true;
    });

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(String(a.price).replace("₹", "")) - Number(String(b.price).replace("₹", "")));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(String(b.price).replace("₹", "")) - Number(String(a.price).replace("₹", "")));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.ratingScore || 4.5) - (a.ratingScore || 4.5));
    } else if (sortBy === "discount") {
      result.sort((a, b) => {
        const da = parseInt(String(a.discountPercent || "0").replace("% OFF", "")) || 0;
        const db = parseInt(String(b.discountPercent || "0").replace("% OFF", "")) || 0;
        return db - da;
      });
    } else if (sortBy === "newest") {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return result;
  }, [
    foods,
    selectedCategory,
    selectedBrand,
    selectedDiet,
    isPureVegOnly,
    maxPrice,
    minRating,
    minDiscount,
    selectedBadge,
    inStockOnly,
    sortBy
  ]);

  const resetAllFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedDiet("all");
    setMaxPrice(500);
    setMinRating(0);
    setMinDiscount(0);
    setSelectedBadge("all");
    setInStockOnly(false);
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategory && selectedCategory !== "All" ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedDiet !== "all" ? 1 : 0) +
    (maxPrice < 500 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (selectedBadge !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="shop-page-wrapper">
      {/* Breadcrumb Strip */}
      <div className="shop-breadcrumb-bar">
        <div className="shop-breadcrumb-content">
          <Link to="/">Home</Link>
          <span className="crumb-sep">/</span>
          <Link to="/shop">Shop & Categories</Link>
          {selectedCategory && (
            <>
              <span className="crumb-sep">/</span>
              <span className="crumb-active">{selectedCategory}</span>
            </>
          )}
          {selectedBrand && (
            <>
              <span className="crumb-sep">/</span>
              <span className="crumb-active">{selectedBrand}</span>
            </>
          )}
        </div>
      </div>

      <div className="shop-main-layout">
        {/* Left Desktop Filter Sidebar */}
        <aside className="shop-sidebar-filters desktop-filters">
          <div className="filters-header-row">
            <h3>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</h3>
            {activeFiltersCount > 0 && (
              <button className="reset-filters-btn" onClick={resetAllFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* 1. Category Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Category</h4>
            <div className="filter-options-list">
              {categoriesList.map((cat) => (
                <label key={cat} className="filter-radio-item">
                  <input
                    type="radio"
                    name="shop-cat"
                    checked={cat === "All" ? !selectedCategory : selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat === "All" ? "" : cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Brand Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Culinary Brand</h4>
            <div className="filter-options-list">
              <label className="filter-radio-item">
                <input
                  type="radio"
                  name="shop-brand"
                  checked={!selectedBrand}
                  onChange={() => setSelectedBrand("")}
                />
                <span>All Brands</span>
              </label>
              {brandsList.map((b) => (
                <label key={b.id} className="filter-radio-item">
                  <input
                    type="radio"
                    name="shop-brand"
                    checked={selectedBrand === b.name}
                    onChange={() => setSelectedBrand(b.name)}
                  />
                  <span>{b.logo} {b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 3. Dietary / Veg Mode */}
          <div className="filter-group">
            <h4 className="filter-title">Dietary Preference</h4>
            <div className="filter-pill-buttons">
              <button
                className={`diet-pill-btn ${selectedDiet === "all" ? "active" : ""}`}
                onClick={() => setSelectedDiet("all")}
              >
                All
              </button>
              <button
                className={`diet-pill-btn veg ${selectedDiet === "veg" ? "active" : ""}`}
                onClick={() => setSelectedDiet("veg")}
              >
                🟢 Pure Veg
              </button>
              <button
                className={`diet-pill-btn nonveg ${selectedDiet === "nonveg" ? "active" : ""}`}
                onClick={() => setSelectedDiet("nonveg")}
              >
                🔴 Non-Veg
              </button>
            </div>
          </div>

          {/* 4. Price Range Slider */}
          <div className="filter-group">
            <div className="price-slider-head">
              <h4 className="filter-title">Max Price</h4>
              <span className="price-slider-val">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={60}
              max={500}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="price-range-slider"
            />
            <div className="price-range-labels">
              <span>₹60</span>
              <span>₹500+</span>
            </div>
          </div>

          {/* 5. Rating Filter */}
          <div className="filter-group">
            <h4 className="filter-title">Customer Rating</h4>
            <div className="filter-options-list">
              {[4.8, 4.5, 4.0].map((rate) => (
                <label key={rate} className="filter-radio-item">
                  <input
                    type="radio"
                    name="shop-rating"
                    checked={minRating === rate}
                    onChange={() => setMinRating(minRating === rate ? 0 : rate)}
                  />
                  <span>⭐ {rate} & above</span>
                </label>
              ))}
            </div>
          </div>

          {/* 6. Discount Offers */}
          <div className="filter-group">
            <h4 className="filter-title">Special Offers & Deals</h4>
            <div className="filter-options-list">
              <label className="filter-radio-item">
                <input
                  type="radio"
                  name="shop-badge"
                  checked={selectedBadge === "flash"}
                  onChange={() => setSelectedBadge(selectedBadge === "flash" ? "all" : "flash")}
                />
                <span>⚡ Flash Sale (Up to 50%)</span>
              </label>
              <label className="filter-radio-item">
                <input
                  type="radio"
                  name="shop-badge"
                  checked={selectedBadge === "bestseller"}
                  onChange={() => setSelectedBadge(selectedBadge === "bestseller" ? "all" : "bestseller")}
                />
                <span>🔥 Best Sellers</span>
              </label>
              <label className="filter-radio-item">
                <input
                  type="radio"
                  name="shop-badge"
                  checked={selectedBadge === "new"}
                  onChange={() => setSelectedBadge(selectedBadge === "new" ? "all" : "new")}
                />
                <span>✨ New Arrivals</span>
              </label>
            </div>
          </div>

          {/* 7. Stock Availability */}
          <div className="filter-group">
            <label className="stock-check-item">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock / Instant Delivery Only</span>
            </label>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="shop-products-main">
          {/* Top Control Bar (Sort, Count, View Toggle, Mobile Filter trigger) */}
          <div className="shop-top-control-bar">
            <div className="products-count-label">
              <h2>
                {selectedCategory ? `${selectedCategory} Dishes` : "All Dishes & Meals"}
              </h2>
              <span className="count-badge">{filteredProducts.length} Products Found</span>
            </div>

            <div className="shop-controls-right">
              {/* Mobile Filter Button */}
              <button
                className="mobile-filter-drawer-btn"
                onClick={() => setMobileFilterOpen(true)}
              >
                <span>⚡ Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="sort-dropdown-wrap">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popular">Popular & Relevance</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Highest Customer Rating</option>
                  <option value="discount">Biggest Discount %</option>
                </select>
              </div>

              {/* Grid / List Toggle */}
              <div className="view-mode-toggle desktop-only">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  ▦
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="shop-empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No dishes match your selected filters</h3>
              <p>Try resetting some filters or changing your craving criteria!</p>
              <button className="reset-btn-large" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className={`shop-products-container ${viewMode === "list" ? "list-view" : "grid-view"}`}>
              {filteredProducts.map((food) => {
                const qty = getItemQuantity(food.id);
                const isWishlisted = wishlist.some((w) => w.id === food.id);

                return (
                  <div className={`shop-product-card ${viewMode === "list" ? "card-list-mode" : ""}`} key={food.id}>
                    {/* Top Badges */}
                    <div className="card-top-row">
                      <div className="diet-and-badge">
                        <span className={`diet-icon-dot ${food.isVeg ? "veg" : "nonveg"}`}>
                          {food.isVeg ? "🟢" : "🔴"}
                        </span>
                        {food.badge && <span className="item-badge-tag">{food.badge}</span>}
                        {food.discountPercent && (
                          <span className="item-discount-tag">{food.discountPercent}</span>
                        )}
                      </div>

                      <div className="card-actions-top">
                        <button
                          className={`wishlist-icon-btn ${isWishlisted ? "active" : ""}`}
                          onClick={() => (isWishlisted ? removeFromWishlist(food.id) : addToWishlist(food))}
                          title="Wishlist"
                        >
                          {isWishlisted ? "❤️" : "🤍"}
                        </button>
                        <button
                          className="compare-icon-btn"
                          onClick={() => addToCompare(food)}
                          title="Add to Compare"
                        >
                          ⚖️
                        </button>
                      </div>
                    </div>

                    {/* Image Area */}
                    <div className="shop-card-img-wrap" onClick={() => setQuickViewFood(food)}>
                      <img src={food.image} alt={food.name} loading="lazy" />
                      <button
                        className="quick-view-hover-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQuickViewFood(food);
                        }}
                      >
                        👁️ Quick View
                      </button>
                    </div>

                    {/* Card Body */}
                    <div className="shop-card-info">
                      <span className="card-brand">{food.brand || food.restaurantName}</span>
                      <Link to={`/product/${food.id}`} className="card-title-link">
                        <h4>{food.name}</h4>
                      </Link>

                      <div className="card-rating-strip">
                        <span className="card-star">{food.rating}</span>
                        <span className="card-rating-count">({food.ratingCount || "1k+"})</span>
                        <span className="dot-sep">•</span>
                        <span className="card-prep">⏱️ {food.prepTime || "20 mins"}</span>
                      </div>

                      <p className="card-desc-snippet">{food.description}</p>

                      {/* Card Price and Add Button */}
                      <div className="card-price-action-row">
                        <div className="card-prices">
                          <span className="card-current-price">{food.price}</span>
                          {food.mrp && <del className="card-mrp-price">{food.mrp}</del>}
                        </div>

                        <div className="card-btn-container">
                          {qty === 0 ? (
                            <button
                              className="shop-add-cart-btn"
                              onClick={() => (food.customizable ? setQuickViewFood(food) : addToCart(food))}
                            >
                              + ADD
                            </button>
                          ) : (
                            <div className="shop-qty-stepper">
                              <button onClick={() => decreaseQuantity(food.id)}>−</button>
                              <span>{qty}</span>
                              <button onClick={() => increaseQuantity(food.id)}>+</button>
                            </div>
                          )}
                          {food.customizable && (
                            <small className="custom-hint" onClick={() => setQuickViewFood(food)}>
                              Customisable
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom-Sheet Filters Drawer */}
      {mobileFilterOpen && (
        <div className="mobile-filter-drawer-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-filter-drawer-box" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <h3>Filters & Sorting</h3>
              <button className="drawer-close-btn" onClick={() => setMobileFilterOpen(false)}>
                ✕
              </button>
            </div>

            <div className="mobile-drawer-body">
              {/* Category */}
              <div className="m-filter-section">
                <h4>Category</h4>
                <div className="m-chips-flex">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      className={`m-chip ${cat === "All" ? !selectedCategory : selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet */}
              <div className="m-filter-section">
                <h4>Dietary</h4>
                <div className="m-chips-flex">
                  <button
                    className={`m-chip ${selectedDiet === "all" ? "active" : ""}`}
                    onClick={() => setSelectedDiet("all")}
                  >
                    All
                  </button>
                  <button
                    className={`m-chip veg ${selectedDiet === "veg" ? "active" : ""}`}
                    onClick={() => setSelectedDiet("veg")}
                  >
                    🟢 Veg
                  </button>
                  <button
                    className={`m-chip nonveg ${selectedDiet === "nonveg" ? "active" : ""}`}
                    onClick={() => setSelectedDiet("nonveg")}
                  >
                    🔴 Non-Veg
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="m-filter-section">
                <h4>Max Price: ₹{maxPrice}</h4>
                <input
                  type="range"
                  min={60}
                  max={500}
                  step={20}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="price-range-slider"
                />
              </div>

              {/* Rating */}
              <div className="m-filter-section">
                <h4>Rating</h4>
                <div className="m-chips-flex">
                  {[4.8, 4.5, 4.0].map((rate) => (
                    <button
                      key={rate}
                      className={`m-chip ${minRating === rate ? "active" : ""}`}
                      onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                    >
                      ⭐ {rate}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mobile-drawer-footer">
              <button className="m-reset-btn" onClick={resetAllFilters}>
                Reset
              </button>
              <button className="m-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                Show {filteredProducts.length} Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewFood && (
        <DishModal
          food={quickViewFood}
          isOpen={!!quickViewFood}
          onClose={() => setQuickViewFood(null)}
        />
      )}
    </div>
  );
}

export default ShopPage;
