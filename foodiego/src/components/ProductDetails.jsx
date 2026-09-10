import { useState, useEffect, useContext, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Camera,
  Video,
  RotateCw,
  Leaf,
  Zap,
  ShieldCheck,
  Store,
  CheckCircle2,
  Star,
  Heart,
  Share2,
  SlidersHorizontal,
  CreditCard,
  Flame,
  Tag,
  Copy,
  Truck,
  Banknote,
  RotateCcw,
  ShoppingBag,
  Bell,
  Package,
  Plus,
  Minus,
  BookOpen,
  FileText,
  Sparkles,
  HelpCircle,
  Clock,
  UtensilsCrossed,
  MessageSquare,
  X
} from "lucide-react";
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
    deliveryFeeText: "FREE Delivery on this item",
    message: "Delivery available in 18-25 mins"
  });

  // Tab State: description | specs | features | warranty | reviews | qa
  const [activeInfoTab, setActiveInfoTab] = useState("description");

  // Q&A State
  const [qaList, setQaList] = useState(product.faqs || [
    { q: "Is this prepared fresh on order?", a: "Yes, 100% prepared fresh à la minute by our master chefs upon receiving your order." },
    { q: "Can I get extra sauce or dips?", a: "Yes, you can customize and add extra dips in the Add-ons section above." }
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [showQaModal, setShowQaModal] = useState(false);

  // Share Modal
  const [showShareModal, setShowShareModal] = useState(false);

  // Calculate live single unit price based on variant selections
  const basePriceNum = Number(String(product.price).replace("₹", "")) || 199;
  const sizeSurcharge = selectedSize ? selectedSize.price : 0;
  const crustSurcharge = selectedCrust ? selectedCrust.price : 0;
  const addOnsSurcharge = selectedAddOns.reduce((sum, item) => sum + (item.price || 0), 0);
  const singleUnitCalculated = basePriceNum + sizeSurcharge + crustSurcharge + addOnsSurcharge;
  const totalLinePrice = singleUnitCalculated * quantity;

  // Toggle add-ons
  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Zoom preview position calculations
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Check PIN Code handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincodeInput.trim().length === 6) {
      setPincodeStatus({
        checked: true,
        available: true,
        deliveryFeeText: "FREE Delivery on this item",
        message: `Express Delivery available in Sector ${pincodeInput.slice(-2)} (15-20 Mins)`
      });
      showToast(`Deliverable to PIN ${pincodeInput}!`, "success");
    } else {
      setPincodeStatus({
        checked: true,
        available: false,
        deliveryFeeText: "Standard Delivery (₹30)",
        message: "Please enter a valid 6-digit PIN code"
      });
    }
  };

  // Add customized item to cart
  const handleAddToCart = () => {
    const customizedItem = {
      ...product,
      price: `₹${singleUnitCalculated}`,
      customizedPrice: singleUnitCalculated,
      selectedSize: selectedSize?.name,
      selectedCrust: selectedCrust?.name,
      selectedAddOns: selectedAddOns.map((a) => a.name),
      quantity: quantity
    };

    addToCart(customizedItem);
    showToast(`Added ${quantity}x ${product.name} to your cart!`, "success");
  };

  // Buy Now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Handle Q&A submit
  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQaList([
        { q: newQuestion, a: "Thank you for asking! Our culinary team will review and reply within 1 hour." },
        ...qaList
      ]);
      setNewQuestion("");
      setShowQaModal(false);
      showToast("Question submitted successfully!", "success");
    }
  };

  // Frequently Bought Together Bundle Calculation
  const companionId = product.frequentlyBoughtTogether ? product.frequentlyBoughtTogether[0] : null;
  const bundleCompanion = foods.find((f) => f.id === companionId) || (product.id !== 11 ? foods.find((f) => f.id === 11) : foods.find((f) => f.id === 16));
  const bundleCompanionPrice = bundleCompanion ? Number(String(bundleCompanion.price).replace("₹", "")) : 99;
  const bundleDiscount = 40;
  const bundleFinalPayable = singleUnitCalculated + bundleCompanionPrice - bundleDiscount;

  const handleAddBundleToCart = () => {
    handleAddToCart();
    if (bundleCompanion) {
      addToCart(bundleCompanion);
    }
    showToast("Added entire Combo Bundle to cart with ₹40 savings!", "success");
  };

  // Wishlist state
  const isWishlisted = wishlist.some((w) => w.id === product.id);

  // Price Drop subscription state
  const isSubscribedPriceDrop = priceDropAlerts.some((id) => id === product.id);

  // Recommendations: Similar Products
  const similarProducts = product.similarProductIds
    ? foods.filter((f) => product.similarProductIds.includes(f.id))
    : foods.filter((f) => f.category === product.category && f.id !== product.id).slice(0, 4);

  return (
    <div className="product-details-page">
      {/* Breadcrumbs */}
      <div className="pdp-breadcrumbs">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      {/* Main Grid: Gallery on Left, Specs & Buy Box on Right */}
      <div className="pdp-main-grid">
        {/* Left Column: Multi-Image Gallery, Video, 360 View */}
        <div className="pdp-gallery-column">
          {/* Media Mode Tabs */}
          <div className="pdp-media-mode-tabs">
            <button
              className={`media-tab-btn ${activeMediaTab === "photos" ? "active" : ""}`}
              onClick={() => setActiveMediaTab("photos")}
            >
              <Camera size={13} className="inline-icon" /> Photos ({images.length})
            </button>
            {product.videoUrl && (
              <button
                className={`media-tab-btn ${activeMediaTab === "video" ? "active" : ""}`}
                onClick={() => setActiveMediaTab("video")}
              >
                <Video size={13} className="inline-icon" /> Video Clip
              </button>
            )}
            {product.has360 && (
              <button
                className={`media-tab-btn ${activeMediaTab === "360" ? "active" : ""}`}
                onClick={() => setActiveMediaTab("360")}
              >
                <RotateCw size={13} className="inline-icon" /> 360° View
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
                  <label>
                    <RotateCw size={12} className="inline-icon" /> Drag to Rotate 360°
                  </label>
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
              <Leaf size={16} className="g-icon" color="#16a34a" />
              <span>100% Fresh Guaranteed</span>
            </div>
            <div className="guarantee-badge-item">
              <Zap size={16} className="g-icon" color="#ea580c" />
              <span>20-Min Delivery</span>
            </div>
            <div className="guarantee-badge-item">
              <ShieldCheck size={16} className="g-icon" color="#2563eb" />
              <span>Contactless Safe Box</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Information, Price, Variants, Delivery & Actions */}
        <div className="pdp-info-column">
          {/* Top Brand & Category Row */}
          <div className="pdp-top-brand-row">
            <span className="brand-badge-pill">
              <Store size={12} className="inline-icon" /> {product.brand || product.restaurantName}
            </span>
            <span className="verified-store-tag">
              <CheckCircle2 size={12} className="inline-icon" /> Official Verified Menu
            </span>
            <span className={`diet-tag ${product.isVeg ? "veg" : "non-veg"}`}>
              <span className={`diet-indicator-dot ${product.isVeg ? "veg" : "non-veg"}`} />
              {product.isVeg ? "100% Pure Veg" : "Non-Veg"}
            </span>
          </div>

          <h1 className="pdp-product-title">{product.name}</h1>

          {/* Rating, Reviews & Wishlist/Share buttons */}
          <div className="pdp-rating-action-bar">
            <div className="pdp-rating-group">
              <span className="star-score">
                <Star size={13} fill="#ca8a04" color="#ca8a04" className="inline-icon" /> {product.ratingScore || 4.8}
              </span>
              <span className="rating-count-txt">({product.reviewsTotal || 1840} Ratings & 350+ Reviews)</span>
            </div>

            <div className="pdp-fast-actions">
              <button
                className={`pdp-action-btn ${isWishlisted ? "active-wish" : ""}`}
                onClick={() => (isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product))}
                title="Wishlist"
              >
                <Heart size={14} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "#64748b"} className="inline-icon" />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>

              <button
                className="pdp-action-btn"
                onClick={() => setShowShareModal(true)}
                title="Share"
              >
                <Share2 size={14} className="inline-icon" /> Share
              </button>

              <button
                className="pdp-action-btn"
                onClick={() => addToCompare(product)}
                title="Compare"
              >
                <SlidersHorizontal size={14} className="inline-icon" /> Compare
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
              <span className="emi-tag">
                <CreditCard size={12} className="inline-icon" /> No Cost EMI from ₹99/mo on cards
              </span>
            </div>
          </div>

          {/* Stock Warning Banner */}
          {product.stock && product.stock <= 5 && (
            <div className="limited-stock-banner">
              <Flame size={14} color="#dc2626" className="inline-icon" />
              <span>Hurry! Only <strong>{product.stock} items left</strong> in stock at your kitchen hub.</span>
            </div>
          )}

          {/* Bank & Coupon Offers Carousel */}
          <div className="pdp-offers-card">
            <h4>
              <Tag size={14} className="inline-icon" color="#ff5200" /> Available Offers & Coupons
            </h4>
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
                    showToast("Copied code FOODIE50!", "success");
                  }}
                >
                  <Copy size={11} className="inline-icon" /> Copy
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
                    showToast("Copied code FREEDEL!", "success");
                  }}
                >
                  <Copy size={11} className="inline-icon" /> Copy
                </button>
              </div>

              <div className="pdp-bank-offer-row">
                <CreditCard size={13} className="inline-icon" />
                <span><strong>Bank Offer:</strong> 10% Instant Discount with HDFC & ICICI Cards</span>
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
            <h4>
              <Truck size={15} className="inline-icon" color="#ff5200" /> Check Delivery Speed & Availability
            </h4>
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
                  <span>
                    <Truck size={12} className="inline-icon" /> {pincodeStatus.deliveryFeeText}
                  </span>
                  <span>
                    <Banknote size={12} className="inline-icon" /> Cash on Delivery Available
                  </span>
                  <span>
                    <RotateCcw size={12} className="inline-icon" /> 7-Day Replacement / Instant Refund
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons Row */}
          <div className="pdp-cta-sticky-box">
            <div className="quantity-selector-wrap">
              <label>Quantity:</label>
              <div className="qty-stepper-box">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <Minus size={13} />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <div className="cta-buttons-row">
              <button className="add-cart-large-btn" onClick={handleAddToCart}>
                <ShoppingBag size={18} className="inline-icon" />
                <span>Add to Cart • ₹{totalLinePrice}</span>
              </button>

              <button className="buy-now-large-btn" onClick={handleBuyNow}>
                <Zap size={18} className="inline-icon" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Price Drop Alert Subscription */}
          <div className="price-drop-subscribe-row">
            <button
              className={`subscribe-price-alert-btn ${isSubscribedPriceDrop ? "subscribed" : ""}`}
              onClick={() => subscribePriceDrop(product)}
            >
              <Bell size={13} className="inline-icon" />
              {isSubscribedPriceDrop ? "Subscribed to Price Drops" : "Notify me if price drops"}
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleCompanion && (
        <section className="pdp-bundle-section">
          <h3>
            <Package size={18} className="inline-icon" color="#ff5200" /> Frequently Bought Together
          </h3>
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
            <BookOpen size={13} className="inline-icon" /> Description
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "specs" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("specs")}
          >
            <FileText size={13} className="inline-icon" /> Specifications
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "features" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("features")}
          >
            <Sparkles size={13} className="inline-icon" /> Key Features
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "warranty" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("warranty")}
          >
            <ShieldCheck size={13} className="inline-icon" /> Freshness & Delivery
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("reviews")}
          >
            <Star size={13} className="inline-icon" /> Reviews ({product.reviewsTotal || 1840})
          </button>
          <button
            className={`pdp-tab ${activeInfoTab === "qa" ? "active" : ""}`}
            onClick={() => setActiveInfoTab("qa")}
          >
            <HelpCircle size={13} className="inline-icon" /> Q&A ({qaList.length})
          </button>
        </div>

        <div className="pdp-tab-panel-content">
          {/* 1. Description */}
          {activeInfoTab === "description" && (
            <div className="tab-pane-content">
              <h3>About {product.name}</h3>
              <p className="pdp-long-description">{product.description}</p>
              <div className="chef-notes-callout">
                <strong>Chef's Culinary Note:</strong>
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
                  <li key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CheckCircle2 size={15} color="#10b981" /> {f}
                  </li>
                )) || (
                  <>
                    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={15} color="#10b981" /> 100% Genuine fresh ingredients
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={15} color="#10b981" /> Prepared in temperature-controlled hygiene stations
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle2 size={15} color="#10b981" /> Zero artificial preservatives or food dyes
                    </li>
                  </>
                )}
              </ul>

              <div className="whats-included-box">
                <h4>What's Included in Your Order:</h4>
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
                  <h4>Freshness Guarantee</h4>
                  <p>{product.warranty || "100% Taste & Hot Delivery Guarantee or instant replacement."}</p>
                </div>
                <div className="policy-info-card">
                  <h4>Insulated Thermal Shipping</h4>
                  <p>{product.shippingInfo || "Shipped in food-grade thermal honeycomb boxes to maintain temperature."}</p>
                </div>
                <div className="policy-info-card">
                  <h4>Return & Refund Policy</h4>
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
                  <div className="stars-row">
                    <Star size={16} fill="#ca8a04" color="#ca8a04" />
                    <Star size={16} fill="#ca8a04" color="#ca8a04" />
                    <Star size={16} fill="#ca8a04" color="#ca8a04" />
                    <Star size={16} fill="#ca8a04" color="#ca8a04" />
                    <Star size={16} fill="#ca8a04" color="#ca8a04" />
                  </div>
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
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        {bar.star} <Star size={12} fill="#ca8a04" color="#ca8a04" />
                      </span>
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
                          <span className="rev-stars">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} size={11} fill="#ca8a04" color="#ca8a04" />
                            ))}
                          </span>
                          {rev.verified && (
                            <span className="verified-pill" style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              <CheckCircle2 size={11} color="#10b981" /> Verified Purchase
                            </span>
                          )}
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
                  <Plus size={13} className="inline-icon" /> Ask a Question
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
          <h2>
            <UtensilsCrossed size={18} className="inline-icon" color="#ff5200" /> You May Also Like
          </h2>
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
                      <Plus size={12} className="inline-icon" /> Add
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
          <h3>
            <Clock size={16} className="inline-icon" /> Recently Viewed Items
          </h3>
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
              <button onClick={() => setShowQaModal(false)}>
                <X size={16} />
              </button>
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
              <h3>
                <Share2 size={16} className="inline-icon" /> Share {product.name}
              </h3>
              <button onClick={() => setShowShareModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="share-buttons-grid">
              <button
                className="share-social-btn whatsapp"
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} on FoodieGo: ${window.location.href}`)}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                <MessageSquare size={14} className="inline-icon" /> WhatsApp
              </button>
              <button
                className="share-social-btn twitter"
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Craving ${product.name} on FoodieGo!`)}&url=${encodeURIComponent(window.location.href)}`, "_blank");
                  setShowShareModal(false);
                }}
              >
                <Share2 size={14} className="inline-icon" /> Twitter / X
              </button>
              <button
                className="share-social-btn copy"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast("Product link copied to clipboard!", "success");
                  setShowShareModal(false);
                }}
              >
                <Copy size={14} className="inline-icon" /> Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
