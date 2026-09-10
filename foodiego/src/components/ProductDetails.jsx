import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { foods } from "../data/foodsData";
import { coupons } from "../data/couponsData";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import DishModal from "./DishModal";
import "../css/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);

  const {
    addToCart,
    getItemQuantity,
    increaseQuantity,
    decreaseQuantity,
    addToCompare,
    addRecentlyViewed,
    recentlyViewed,
    subscribePriceDrop,
    priceDropAlerts,
    showToast
  } = useContext(CartContext);

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  // Active Product Lookup
  const product = foods.find((f) => f.id === productId) || foods[0];

  // Track as recently viewed
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId]);

  // Gallery State
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState("photos"); // photos | video | 360
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [degrees360, setDegrees360] = useState(0);

  // Variant States
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
  );
  const [selectedCrust, setSelectedCrust] = useState(
    product.crusts && product.crusts.length > 0 ? product.crusts[0] : null
  );
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // PIN Code Delivery Checker State
  const [pincodeInput, setPincodeInput] = useState("201309");
  const [pincodeStatus, setPincodeStatus] = useState({
    checked: true,
    available: true,
    message: "Delivery in 20-25 mins to Sector 62, Noida",
    deliveryFeeText: "FREE Delivery Available",
    codAvailable: true,
    returnEligible: true
  });

  // Active Info Tab
  const [activeInfoTab, setActiveInfoTab] = useState("description"); // description | specs | features | warranty | reviews | qa

  // Q&A State
  const [qaList, setQaList] = useState(product.faqs || []);
  const [newQuestion, setNewQuestion] = useState("");
  const [showQaModal, setShowQaModal] = useState(false);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);

  // Bundle Add-on State
  const [includeBundleAddon, setIncludeBundleAddon] = useState(true);

  // Image Zoom Mouse Move
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const isWishlisted = wishlist.some((w) => w.id === product.id);
  const isSubscribedPriceDrop = priceDropAlerts.includes(product.id);

  // Financial Calculations for Variants
  const basePriceNum = Number(String(product.price).replace("₹", ""));
  const sizeExtra = selectedSize ? selectedSize.price : 0;
  const crustExtra = selectedCrust ? selectedCrust.price : 0;
  const addOnsExtra = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const singleUnitCalculated = basePriceNum + sizeExtra + crustExtra + addOnsExtra;
  const totalLinePrice = singleUnitCalculated * quantity;

  // Toggle Add-on
  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleAddToCart = () => {
    const customOptions = {
      size: selectedSize,
      crust: selectedCrust,
      addOns: selectedAddOns,
      extraPrice: sizeExtra + crustExtra + addOnsExtra,
    };
    addToCart(product, customOptions, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincodeInput.length === 6) {
      setPincodeStatus({
        checked: true,
        available: true,
        message: `Express Delivery Available in 20-25 mins (${pincodeInput})`,
        deliveryFeeText: "FREE Delivery on orders ₹300+",
        codAvailable: true,
        returnEligible: true
      });
      showToast(`Pincode ${pincodeInput} is serviceable! ⚡`, "success");
    } else {
      showToast("Please enter a valid 6-digit PIN code.", "error");
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      const newQa = {
        q: newQuestion.trim(),
        a: "Our chef & culinary team will review and answer this shortly!"
      };
      setQaList([newQa, ...qaList]);
      setNewQuestion("");
      setShowQaModal(false);
      showToast("Your question has been submitted!", "success");
    }
  };

  // Frequently Bought Together Bundle Item
  const bundleCompanionId = product.frequentlyBoughtTogether?.[0] || 11;
  const bundleCompanion = foods.find((f) => f.id === bundleCompanionId) || foods[10];
  const bundleCompanionPrice = Number(String(bundleCompanion?.price || "149").replace("₹", ""));
  const bundleCombinedPrice = singleUnitCalculated + (includeBundleAddon ? bundleCompanionPrice : 0);
  const bundleDiscountSavings = includeBundleAddon ? 40 : 0;
  const bundleFinalPayable = bundleCombinedPrice - bundleDiscountSavings;

  const handleAddBundleToCart = () => {
    handleAddToCart();
    if (includeBundleAddon && bundleCompanion) {
      addToCart(bundleCompanion);
    }
    showToast("Combo bundle added to your cart with ₹40 savings! 🎉", "success");
  };

  // Similar Products List
  const similarProducts = foods
    .filter((f) => f.id !== product.id && (f.category === product.category || f.brand === product.brand))
    .slice(0, 4);

  return (
    <div className="product-details-page">
      {/* Breadcrumb Bar */}
      <nav className="pdp-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>/</span>
        <span className="pdp-active-crumb">{product.name}</span>
      </nav>

      {/* Main Top Grid: Gallery on Left + Info & Actions on Right */}
      <div className="pdp-main-grid">
        {/* Left Column: Product Visual Media Gallery */}
        <div className="pdp-gallery-column">
          {/* Media Mode Tabs (Photos / Video / 360°) */}
          <div className="media-mode-tabs">
            <button
              className={`media-tab-btn ${activeMediaTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("photos")}
            >
              📷 Photos ({images.length})
            </button>
            {product.videoUrl && (
              <button
                className={`media-tab-btn ${activeMediaTab === "video" ? "active" : ""}`}
                onClick={() => setActiveMediaTab("video")}
              >
                🎥 Video Clip
              </button>
            )}
            {product.has360 && (
              <button
                className={`media-tab-btn ${activeMediaTab === "360" ? "active" : ""}`}
                onClick={() => setActiveMediaTab("360")}
              >
                🔄 360° View
              </button>
            )}
          </div>

          {/* Main Visual Display */}
          <div className="pdp-main-image-viewport">
            {activeMediaTab === "photos" && (
              <div
                className={`zoom-image-container ${isZoomed ? "zooming" : ""}`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="main-display-img"
                />
                {isZoomed && (
                  <div
                    className="zoom-lens-preview"
                    style={{
                      backgroundImage: `url(${images[selectedImageIndex]})`,
                      backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`
                    }}
                  />
                )}
              </div>
            )}

            {activeMediaTab === "video" && (
              <div className="pdp-video-container">
                <video controls autoPlay muted loop className="pdp-video-player">
                  <source src={product.videoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>
              </div>
            )}

            {activeMediaTab === "360" && (
              <div className="pdp-360-container">
                <div
                  className="pdp-360-interactive-box"
                  style={{ transform: `rotateY(${degrees360}deg)` }}
                >
                  <img src={product.image} alt="360 view" />
                </div>
                <div className="rotate-slider-wrap">
                  <label>Drag to Rotate 360° 🔄</label>
                  <input
                    type="range"
                    min={-180}
                    max={180}
                    value={degrees360}
                    onChange={(e) => setDegrees360(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails Strip */}
          {activeMediaTab === "photos" && images.length > 1 && (
            <div className="pdp-thumbnails-strip">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumb-box ${selectedImageIndex === idx ? "selected" : ""}`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
          )}

          {/* Guarantee Badges Row */}
          <div className="pdp-guarantee-badges">
            <div className="guarantee-badge-item">
              <span className="g-icon">🌿</span>
              <span>100% Fresh Guaranteed</span>
            </div>
            <div className="guarantee-badge-item">
              <span className="g-icon">⚡</span>
              <span>20-Min Delivery</span>
            </div>
            <div className="guarantee-badge-item">
              <span className="g-icon">🛡️</span>
              <span>Contactless Safe Box</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information, Price, Variants, Delivery & Actions */}
        <div className="pdp-info-column">
          {/* Top Brand & Category Row */}
          <div className="pdp-top-brand-row">
            <span className="brand-badge-pill">🏬 {product.brand || product.restaurantName}</span>
            <span className="verified-store-tag">✓ Official Verified Menu</span>
            <span className={`diet-tag ${product.isVeg ? "veg" : "non-veg"}`}>
              {product.isVeg ? "🟢 100% Pure Veg" : "🔴 Non-Veg"}
            </span>
          </div>

          <h1 className="pdp-product-title">{product.name}</h1>

          {/* Rating, Reviews & Wishlist/Share buttons */}
          <div className="pdp-rating-action-bar">
            <div className="pdp-rating-group">
              <span className="star-score">{product.rating}</span>
              <span className="rating-count-txt">({product.reviewsTotal || 1840} Ratings & 350+ Reviews)</span>
            </div>

            <div className="pdp-fast-actions">
              <button
                className={`pdp-action-btn ${isWishlisted ? "active-wish" : ""}`}
                onClick={() => (isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product))}
                title="Wishlist"
              >
                {isWishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
              </button>

              <button
                className="pdp-action-btn"
                onClick={() => setShowShareModal(true)}
                title="Share"
              >
                🔗 Share
              </button>

              <button
                className="pdp-action-btn"
                onClick={() => addToCompare(product)}
                title="Compare"
              >
                ⚖️ Compare
              </button>
            </div>
          </div>

          {/* Price Box */}
          <div className="pdp-price-box">
            <div className="price-row-main">
              <span className="current-selling-price">₹{singleUnitCalculated}</span>
              {product.mrp && <del className="original-mrp-price">{product.mrp}</del>}
              {product.discountPercent && (
                <span className="discount-pill-green">{product.discountPercent}</span>
              )}
            </div>
            <div className="tax-and-emi-row">
              <small className="inclusive-tax-txt">Inclusive of all restaurant taxes</small>
              <span className="emi-tag">💳 No Cost EMI from ₹99/mo on cards</span>
            </div>
          </div>

          {/* Stock Warning Banner */}
          {product.stock && product.stock <= 5 && (
            <div className="limited-stock-banner">
              <span>🔥 Hurry! Only <strong>{product.stock} items left</strong> in stock at your kitchen hub.</span>
            </div>
          )}

          {/* Bank & Coupon Offers Carousel */}
          <div className="pdp-offers-card">
            <h4>🏷️ Available Offers & Coupons</h4>
            <div className="pdp-offers-list">
              <div className="pdp-offer-item">
                <div className="offer-item-left">
                  <span className="offer-code-tag">FOODIE50</span>
                  <p>Flat 50% OFF up to ₹120 on your order</p>
                </div>
                <button
                  className="copy-coupon-btn"
                  onClick={() => {
                    navigator.clipboard.writeText("FOODIE50");
                    showToast("Copied code FOODIE50! 📋", "success");
                  }}
                >
                  Copy
                </button>
              </div>

              <div className="pdp-offer-item">
                <div className="offer-item-left">
                  <span className="offer-code-tag">FREEDEL</span>
                  <p>Zero Delivery Fee on orders above ₹199</p>
                </div>
                <button
                  className="copy-coupon-btn"
                  onClick={() => {
                    navigator.clipboard.writeText("FREEDEL");
                    showToast("Copied code FREEDEL! 📋", "success");
                  }}
                >
                  Copy
                </button>
              </div>

              <div className="pdp-bank-offer-row">
                <span>💳 <strong>Bank Offer:</strong> 10% Instant Discount with HDFC & ICICI Cards</span>
              </div>
            </div>
          </div>

          {/* Variants Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="variant-block">
              <label className="variant-label">
                <strong>1. Select Size / Portion:</strong>
                <span className="selected-variant-name">{selectedSize?.name}</span>
              </label>
              <div className="variant-options-grid">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    className={`variant-choice-btn ${selectedSize?.name === s.name ? "active" : ""}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    <span>{s.name}</span>
                    <small>{s.price > 0 ? `+₹${s.price}` : "Standard"}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.crusts && product.crusts.length > 0 && (
            <div className="variant-block">
              <label className="variant-label">
                <strong>2. Crust / Cooking Style:</strong>
                <span className="selected-variant-name">{selectedCrust?.name}</span>
              </label>
              <div className="variant-options-grid">
                {product.crusts.map((c, idx) => (
                  <button
                    key={idx}
                    className={`variant-choice-btn ${selectedCrust?.name === c.name ? "active" : ""}`}
                    onClick={() => setSelectedCrust(c)}
                  >
                    <span>{c.name}</span>
                    <small>{c.price > 0 ? `+₹${c.price}` : "Standard"}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons Selector */}
          {product.addOns && product.addOns.length > 0 && (
            <div className="variant-block">
              <label className="variant-label">
                <strong>3. Add-ons, Dips & Beverages:</strong>
                <span className="optional-tag">(Optional)</span>
              </label>
              <div className="addons-checkbox-grid">
                {product.addOns.map((addon, idx) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <label key={idx} className={`addon-pill-check ${isChecked ? "checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddOn(addon)}
                      />
                      <span>{addon.name}</span>
                      <strong>+{addon.price > 0 ? `₹${addon.price}` : "Free"}</strong>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* PIN Code Delivery Checker */}
          <div className="pincode-checker-card">
            <h4>🚚 Check Delivery Speed & Availability</h4>
            <form className="pincode-form" onSubmit={handleCheckPincode}>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code..."
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
              />
              <button type="submit">Check PIN</button>
            </form>

            {pincodeStatus.checked && (
              <div className="pincode-results">
                <div className="pincode-status-row">
                  <span className="status-dot-green">●</span>
                  <strong>{pincodeStatus.message}</strong>
                </div>
                <div className="pincode-perks">
                  <span>🛵 {pincodeStatus.deliveryFeeText}</span>
                  <span>💵 Cash on Delivery Available</span>
                  <span>🔄 7-Day Replacement / Instant Refund</span>
                </div>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons Row */}
          <div className="pdp-cta-sticky-box">
            <div className="quantity-selector-wrap">
              <label>Quantity:</label>
              <div className="qty-stepper-box">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>+</button>
              </div>
            </div>

            <div className="cta-buttons-row">
              <button className="add-cart-large-btn" onClick={handleAddToCart}>
                <span>🛒 Add to Cart • ₹{totalLinePrice}</span>
              </button>

              <button className="buy-now-large-btn" onClick={handleBuyNow}>
                <span>⚡ Buy Now</span>
              </button>
            </div>
          </div>

          {/* Price Drop Alert Subscription */}
          <div className="price-drop-subscribe-row">
            <button
              className={`subscribe-price-alert-btn ${isSubscribedPriceDrop ? "subscribed" : ""}`}
              onClick={() => subscribePriceDrop(product)}
            >
              🔔 {isSubscribedPriceDrop ? "Subscribed to Price Drops ✓" : "Notify me if price drops"}
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleCompanion && (
        <section className="pdp-bundle-section">
          <h3>📦 Frequently Bought Together</h3>
          <div className="bundle-card-container">
            <div className="bundle-items-row">
              {/* Item 1 */}
              <div className="bundle-item-card">
                <img src={product.image} alt={product.name} />
                <div>
                  <strong>{product.name}</strong>
                  <span className="b-price">₹{singleUnitCalculated}</span>
                </div>
              </div>

              <span className="bundle-plus-sign">+</span>

              {/* Item 2 */}
              <div className="bundle-item-card">
                <img src={bundleCompanion.image} alt={bundleCompanion.name} />
                <div>
                  <strong>{bundleCompanion.name}</strong>
                  <span className="b-price">₹{bundleCompanionPrice}</span>
                </div>
              </div>
            </div>

            <div className="bundle-buy-action-box">
              <div className="bundle-savings-tag">
                <span>Bundle Savings: <strong>-₹40 OFF</strong></span>
              </div>
              <div className="bundle-total-price">
                <small>Combo Total:</small>
                <strong>₹{bundleFinalPayable}</strong>
                <del>₹{singleUnitCalculated + bundleCompanionPrice}</del>
              </div>
              <button className="add-bundle-btn" onClick={handleAddBundleToCart}>
                Add Both to Cart • ₹{bundleFinalPayable}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Detailed Information Tabs Section */}
      <section className="pdp-detailed-tabs-section">
        <div className="pdp-tabs-nav">
          <button
            className={`pdp-tab ${activeInfoTab === "description" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("description")}
          >
            📖 Description
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("specs")}
          >
            📋 Specifications
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "features" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("features")}
          >
            ✨ Key Features
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "warranty" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("warranty")}
          >
            🛡️ Freshness & Delivery
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("reviews")}
          >
            ⭐ Reviews ({product.reviewsTotal || 1840})
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "qa" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("qa")}
          >
            ❓ Q&A ({qaList.length})
          </button>
        </div>

        <div className="pdp-tab-panel-content">
          {/* 1. Description */}
          {activeInfoTab === "description" && (
            <div className="tab-pane-content">
              <h3>About {product.name}</h3>
              <p className="pdp-long-description">{product.description}</p>
              <div className="chef-notes-callout">
                <strong>👨‍🍳 Chef's Culinary Note:</strong>
                <p>
                  Every order is prepared strictly à la minute using non-GMO grains, real dairy cheese, and authentic natural seasonings.
                </p>
              </div>
            </div>
          )}

          {/* 2. Specifications */}
          {activeInfoTab === "specs" && (
            <div className="tab-pane-content">
              <h3>Nutritional & Product Specifications</h3>
              <table className="specs-table">
                <tbody>
                  <tr>
                    <td>Serving Size</td>
                    <td>{product.specifications?.servingSize || "1-2 Persons"}</td>
                  </tr>
                  <tr>
                    <td>Energy / Calories</td>
                    <td>{product.specifications?.calories || product.calories || "320 kcal"}</td>
                  </tr>
                  <tr>
                    <td>Allergen Information</td>
                    <td>{product.specifications?.allergens || "Dairy, Gluten"}</td>
                  </tr>
                  <tr>
                    <td>Spice Level</td>
                    <td>{product.specifications?.spiceLevel || "Medium"}</td>
                  </tr>
                  <tr>
                    <td>Cuisine Type</td>
                    <td>{product.specifications?.cuisineType || product.category}</td>
                  </tr>
                  <tr>
                    <td>Shelf Life & Storage</td>
                    <td>{product.specifications?.storage || "Consume hot or refrigerate below 4°C"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 3. Features & What's Included */}
          {activeInfoTab === "features" && (
            <div className="tab-pane-content">
              <h3>Key Features & Highlights</h3>
              <ul className="features-bullet-list">
                {product.features?.map((f, idx) => (
                  <li key={idx}>✓ {f}</li>
                )) || (
                  <>
                    <li>✓ 100% Genuine fresh ingredients</li>
                    <li>✓ Prepared in temperature-controlled hygiene stations</li>
                    <li>✓ Zero artificial preservatives or food dyes</li>
                  </>
                )}
              </ul>

              <div className="whats-included-box">
                <h4>📦 What's Included in Your Order:</h4>
                <p>{product.whatsIncluded || `1x Fresh ${product.name}, Premium Cutlery, Condiment Sachets`}</p>
              </div>
            </div>
          )}

          {/* 4. Warranty & Shipping */}
          {activeInfoTab === "warranty" && (
            <div className="tab-pane-content">
              <h3>Freshness Guarantee & Shipping Policy</h3>
              <div className="policy-cards-grid">
                <div className="policy-info-card">
                  <h4>🛡️ Freshness Guarantee</h4>
                  <p>{product.warranty || "100% Taste & Hot Delivery Guarantee or instant replacement."}</p>
                </div>
                <div className="policy-info-card">
                  <h4>🚚 Insulated Thermal Shipping</h4>
                  <p>{product.shippingInfo || "Shipped in food-grade thermal honeycomb boxes to maintain temperature."}</p>
                </div>
                <div className="policy-info-card">
                  <h4>🔄 Return & Refund Policy</h4>
                  <p>{product.returnPolicy || "Instant refund or replacement if received damaged or lukewarm."}</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Customer Reviews & Ratings Breakdown */}
          {activeInfoTab === "reviews" && (
            <div className="tab-pane-content">
              <div className="reviews-summary-dashboard">
                <div className="overall-score-card">
                  <h2>{product.ratingScore || 4.8}</h2>
                  <div className="stars-row">⭐⭐⭐⭐⭐</div>
                  <p>Based on {product.reviewsTotal || 1840} verified customer reviews</p>
                </div>

                {/* Rating Bar Chart */}
                <div className="rating-bars-breakdown">
                  {[
                    { star: 5, pct: product.ratingBreakdown?.[5] || 85 },
                    { star: 4, pct: product.ratingBreakdown?.[4] || 10 },
                    { star: 3, pct: product.ratingBreakdown?.[3] || 3 },
                    { star: 2, pct: product.ratingBreakdown?.[2] || 1 },
                    { star: 1, pct: product.ratingBreakdown?.[1] || 1 }
                  ].map((bar) => (
                    <div className="bar-row" key={bar.star}>
                      <span>{bar.star} ★</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${bar.pct}%` }} />
                      </div>
                      <span className="bar-pct">{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Reviews List */}
              <div className="customer-reviews-thread">
                {product.reviewsList?.map((rev) => (
                  <div className="review-thread-item" key={rev.id}>
                    <div className="rev-head">
                      <img src={rev.avatar} alt={rev.author} className="rev-avatar" />
                      <div>
                        <strong>{rev.author}</strong>
                        <div className="rev-meta">
                          <span>{"⭐".repeat(rev.rating)}</span>
                          {rev.verified && <span className="verified-pill">✓ Verified Purchase</span>}
                          <small>{rev.date}</small>
                        </div>
                      </div>
                    </div>
                    <h4>{rev.title}</h4>
                    <p>{rev.comment}</p>
                    {rev.photos && (
                      <div className="rev-photos-row">
                        {rev.photos.map((p, i) => (
                          <img key={i} src={p} alt="Review photo" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Q&A */}
          {activeInfoTab === "qa" && (
            <div className="tab-pane-content">
              <div className="qa-header-row">
                <h3>Customer Questions & Answers ({qaList.length})</h3>
                <button className="ask-btn" onClick={() => setShowQaModal(true)}>
                  + Ask a Question
                </button>
              </div>

              <div className="qa-items-list">
                {qaList.map((qa, idx) => (
                  <div className="qa-item" key={idx}>
                    <p className="qa-question">
                      <strong>Q:</strong> {qa.q}
                    </p>
                    <p className="qa-answer">
                      <strong>A:</strong> {qa.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Recommendations Carousel: Similar Products */}
      {similarProducts.length > 0 && (
        <section className="pdp-recommendations-section">
          <h2>🍽️ You May Also Like</h2>
          <div className="pdp-recom-grid">
            {similarProducts.map((item) => (
              <div className="recom-card" key={item.id}>
                <Link to={`/product/${item.id}`} className="recom-img-wrap">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="recom-info">
                  <span className="recom-brand">{item.brand || item.restaurantName}</span>
                  <Link to={`/product/${item.id}`}>
                    <h4>{item.name}</h4>
                  </Link>
                  <div className="recom-price-row">
                    <strong>{item.price}</strong>
                    <button className="recom-add-btn" onClick={() => addToCart(item)}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products Strip */}
      {recentlyViewed.length > 1 && (
        <section className="pdp-recently-viewed-section">
          <h3>🕒 Recently Viewed Items</h3>
          <div className="recent-scroll-row">
            {recentlyViewed
              .filter((r) => r.id !== product.id)
              .slice(0, 6)
              .map((item) => (
                <Link to={`/product/${item.id}`} key={item.id} className="recent-item-chip">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.price}</small>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Q&A Modal */}
      {showQaModal && (
        <div className="pdp-modal-overlay" onClick={() => setShowQaModal(false)}>
          <div className="pdp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ask a Question about {product.name}</h3>
              <button onClick={() => setShowQaModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddQuestion} className="qa-modal-form">
              <textarea
                rows={3}
                placeholder="e.g. Can this be prepared with vegan cheese? Is it gluten free?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
              />
              <button type="submit" className="submit-question-btn">
                Submit Question
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="pdp-modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="pdp-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share {product.name} 🔗</h3>
              <button onClick={() => setShowShareModal(false)}>✕</button>
            </div>
            <div className="share-buttons-grid">
              <button
                className="share-social-btn whatsapp"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on FoodieGo: ${window.location.href}`)}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                💬 WhatsApp
              </button>
              <button
                className="share-social-btn twitter"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Craving ${product.name} on FoodieGo!`)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                🐦 Twitter / X
              </button>
              <button
                className="share-social-btn copy"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Product link copied to clipboard! 📋", "success");
                  setShowShareModal(false);
                }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
