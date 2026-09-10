import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { coupons } from "../data/couponsData";
import { foods } from "../data/foodsData";
import "../css/Cart.css";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    addToCart,
    itemTotal,
    deliveryFee,
    platformFee,
    gstAndTaxes,
    expressFee,
    giftWrapFee,
    couponDiscount,
    finalTotal,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    driverTip,
    setDriverTip,
    cookingInstructions,
    setCookingInstructions,
    deliverySpeed,
    setDeliverySpeed,
    isGiftWrap,
    setIsGiftWrap,
    giftMessage,
    setGiftMessage,
    deliveryLocation
  } = useContext(CartContext);

  const { addToWishlist } = useContext(WishlistContext);

  const [couponInput, setCouponInput] = useState("");
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = (code) => {
    applyCouponCode(code);
    setCouponInput("");
    setShowCouponsModal(false);
  };

  const handleMoveToWishlist = (food) => {
    addToWishlist(food);
    removeFromCart(food.cartItemId || food.id);
  };

  const freeDeliveryThreshold = 300;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemTotal);
  const freeDeliveryPercent = Math.min(100, Math.round((itemTotal / freeDeliveryThreshold) * 100));

  // Recommended Cross-Sell Add-ons (e.g. Dips, Desserts, Cold drinks)
  const cartIds = cart.map((i) => i.id);
  const recommendedAddons = foods
    .filter((f) => !cartIds.includes(f.id) && (f.category === "Drinks" || f.category === "Dessert" || f.category === "Fries"))
    .slice(0, 4);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart ({cart.length} {cart.length === 1 ? "Item" : "Items"}) 🛒</h1>
        {cart.length > 0 && (
          <button className="clear-cart-text-btn" onClick={clearCart}>
            Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart-view">
          <div className="empty-cart-art">🍽️</div>
          <h2>Your Cart is Empty</h2>
          <p>Good food is always just a few clicks away. Explore our delicious menu now!</p>
          <div className="empty-cart-actions">
            <Link to="/shop" className="browse-menu-btn">
              Explore Full Shop & Menu 🍕
            </Link>
            <Link to="/wishlist" className="view-wishlist-cart-btn">
              View Wishlist Favorites ❤️
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-grid-layout">
          {/* Left Column: Items, Free Shipping, Instructions, Speed, Tip, Gift */}
          <div className="cart-left-col">
            {/* Free Delivery Progress Bar */}
            <div className="free-delivery-card">
              <div className="free-delivery-header">
                {remainingForFreeDelivery === 0 ? (
                  <span className="free-unlocked">🎉 You unlocked <strong>FREE Delivery!</strong></span>
                ) : (
                  <span>
                    Add <strong>₹{remainingForFreeDelivery}</strong> more to get <strong>FREE Delivery</strong>
                  </span>
                )}
                <span className="free-icon">🚚</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items-card">
              <h3 className="card-title">Order Items</h3>
              <div className="items-list">
                {cart.map((food) => {
                  const identifier = food.cartItemId || food.id;
                  const itemPrice = food.unitPrice || Number(String(food.price).replace("₹", ""));
                  const totalLinePrice = itemPrice * (food.quantity || 1);

                  return (
                    <div className="cart-item-row" key={identifier}>
                      <div className="item-thumb-box">
                        <img src={food.image} alt={food.name} />
                      </div>

                      <div className="item-details">
                        <div className="item-name-brand-row">
                          <h4>{food.name}</h4>
                          <span className={`item-diet-dot ${food.isVeg !== false ? "veg" : "non-veg"}`}>
                            {food.isVeg !== false ? "🟢" : "🔴"}
                          </span>
                        </div>
                        <span className="item-unit-price">₹{itemPrice}</span>

                        {food.customOptions && (
                          <div className="custom-options-summary">
                            {food.customOptions.size && (
                              <span>Size: {food.customOptions.size.name}</span>
                            )}
                            {food.customOptions.crust && (
                              <span>Crust: {food.customOptions.crust.name}</span>
                            )}
                            {food.customOptions.addOns?.length > 0 && (
                              <span>Add-ons: {food.customOptions.addOns.map((a) => a.name).join(", ")}</span>
                            )}
                            {food.customOptions.notes && (
                              <span className="user-note">Note: "{food.customOptions.notes}"</span>
                            )}
                          </div>
                        )}

                        {food.stock && food.stock <= 5 && (
                          <span className="cart-stock-warning">⚡ Only {food.stock} left in stock</span>
                        )}

                        {/* Fast Move / Remove Actions */}
                        <div className="item-secondary-actions">
                          <button
                            className="move-wishlist-btn"
                            onClick={() => handleMoveToWishlist(food)}
                          >
                            ❤️ Move to Wishlist
                          </button>
                          <span className="action-sep">•</span>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeFromCart(identifier)}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                      </div>

                      {/* Stepper */}
                      <div className="item-actions">
                        <div className="cart-stepper">
                          <button onClick={() => decreaseQuantity(identifier)}>−</button>
                          <span>{food.quantity}</span>
                          <button onClick={() => increaseQuantity(identifier)}>+</button>
                        </div>
                        <span className="item-line-total">₹{totalLinePrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Add-ons Carousel */}
            {recommendedAddons.length > 0 && (
              <div className="recommended-addons-card">
                <h4>🥤 Frequently Added With Your Order</h4>
                <div className="addons-carousel-row">
                  {recommendedAddons.map((addon) => (
                    <div className="addon-quick-card" key={addon.id}>
                      <img src={addon.image} alt={addon.name} />
                      <div className="addon-meta">
                        <strong>{addon.name}</strong>
                        <span>{addon.price}</span>
                      </div>
                      <button className="addon-add-btn" onClick={() => addToCart(addon)}>
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            <div className="cooking-notes-card">
              <label>🧑‍🍳 Cooking & Delivery Instructions:</label>
              <textarea
                rows={2}
                placeholder="e.g. Leave at door, don't ring the bell, extra spicy sauce, extra napkins..."
                value={cookingInstructions}
                onChange={(e) => setCookingInstructions(e.target.value)}
              />
            </div>

            {/* Delivery Speed Selector */}
            <div className="delivery-speed-card">
              <label className="section-label">⚡ Choose Delivery Speed:</label>
              <div className="speed-options">
                <div
                  className={`speed-card ${deliverySpeed === "standard" ? "selected" : ""}`}
                  onClick={() => setDeliverySpeed("standard")}
                >
                  <input
                    type="radio"
                    name="speed"
                    checked={deliverySpeed === "standard"}
                    onChange={() => setDeliverySpeed("standard")}
                  />
                  <div>
                    <strong>Standard Delivery (25-30 mins)</strong>
                    <small>Standard courier partner assignment</small>
                  </div>
                  <span className="speed-fee">Free</span>
                </div>

                <div
                  className={`speed-card ${deliverySpeed === "express" ? "selected" : ""}`}
                  onClick={() => setDeliverySpeed("express")}
                >
                  <input
                    type="radio"
                    name="speed"
                    checked={deliverySpeed === "express"}
                    onChange={() => setDeliverySpeed("express")}
                  />
                  <div>
                    <strong>⚡ Priority Express (15-20 mins)</strong>
                    <small>Direct priority rider assignment</small>
                  </div>
                  <span className="speed-fee">+₹25</span>
                </div>
              </div>
            </div>

            {/* Gift Wrapping Option */}
            <div className="gift-wrapping-card">
              <label className="gift-checkbox-label">
                <input
                  type="checkbox"
                  checked={isGiftWrap}
                  onChange={(e) => setIsGiftWrap(e.target.checked)}
                />
                <div>
                  <strong>🎁 Add Premium Gift Wrapping (+₹30)</strong>
                  <p>Includes special thermal gift box, ribbon, and personalized card message.</p>
                </div>
              </label>

              {isGiftWrap && (
                <input
                  type="text"
                  placeholder="Enter your personalized gift message..."
                  className="gift-msg-input"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
              )}
            </div>

            {/* Delivery Partner Tip */}
            <div className="driver-tip-card">
              <div className="tip-header">
                <div>
                  <strong>Tip Your Delivery Partner 🛵</strong>
                  <p>100% of your tip goes directly to your rider</p>
                </div>
                {driverTip > 0 && (
                  <button className="clear-tip-btn" onClick={() => setDriverTip(0)}>
                    Clear Tip
                  </button>
                )}
              </div>

              <div className="tip-buttons-row">
                {[10, 20, 30, 50].map((amount) => (
                  <button
                    key={amount}
                    className={`tip-btn ${driverTip === amount ? "active" : ""}`}
                    onClick={() => setDriverTip(driverTip === amount ? 0 : amount)}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Coupons & Bill Breakdown */}
          <div className="cart-right-col">
            {/* Coupon Application Box */}
            <div className="coupon-box-card">
              <h3>🏷️ Coupons & Offers</h3>

              {appliedCoupon ? (
                <div className="applied-coupon-banner">
                  <div>
                    <strong>Code {appliedCoupon.code} Applied! 🎉</strong>
                    <p>{appliedCoupon.title} (-₹{couponDiscount})</p>
                  </div>
                  <button className="remove-coupon-btn" onClick={removeCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-input-wrap">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FOODIE50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button
                    className="apply-btn"
                    onClick={() => handleApplyCoupon(couponInput)}
                    disabled={!couponInput.trim()}
                  >
                    APPLY
                  </button>
                </div>
              )}

              {/* View Available Coupons Link */}
              <button
                className="view-available-coupons-btn"
                onClick={() => setShowCouponsModal(!showCouponsModal)}
              >
                {showCouponsModal ? "Hide Available Coupons ▲" : "View Available Coupons (5) ▼"}
              </button>

              {/* Available Coupons Dropdown */}
              {showCouponsModal && (
                <div className="coupons-list-dropdown">
                  {coupons.map((c) => (
                    <div className="coupon-dropdown-item" key={c.code}>
                      <div className="c-left">
                        <span className="c-code" style={{ borderColor: c.badgeColor }}>
                          {c.code}
                        </span>
                        <strong>{c.title}</strong>
                        <p>{c.description}</p>
                      </div>
                      <button
                        className="c-apply-btn"
                        onClick={() => handleApplyCoupon(c.code)}
                      >
                        APPLY
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bill-summary-card">
              <h3>Bill Summary 🧾</h3>

              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{itemTotal}</span>
              </div>

              <div className="bill-row">
                <span>
                  Delivery Fee {deliveryFee === 0 && <small className="green-txt">(Free above ₹300)</small>}
                </span>
                <span>{deliveryFee === 0 ? <strong className="green-txt">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>

              <div className="bill-row">
                <span>Platform & Handling Fee</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="bill-row">
                <span>GST & Restaurant Taxes (5%)</span>
                <span>₹{gstAndTaxes}</span>
              </div>

              {deliverySpeed === "express" && (
                <div className="bill-row">
                  <span>⚡ Priority Express Delivery</span>
                  <span>₹{expressFee}</span>
                </div>
              )}

              {isGiftWrap && (
                <div className="bill-row">
                  <span>🎁 Gift Wrapping & Card</span>
                  <span>₹{giftWrapFee}</span>
                </div>
              )}

              {driverTip > 0 && (
                <div className="bill-row">
                  <span>Delivery Partner Tip</span>
                  <span>₹{driverTip}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="bill-row discount-row">
                  <span>Coupon Savings ({appliedCoupon?.code})</span>
                  <span className="green-txt">-₹{couponDiscount}</span>
                </div>
              )}

              <div className="bill-divider" />

              <div className="bill-total-row">
                <div>
                  <strong>TO PAY</strong>
                  <small>Inclusive of all taxes</small>
                </div>
                <h2>₹{finalTotal}</h2>
              </div>

              {/* Delivery Address Preview */}
              <div className="cart-delivery-loc-preview">
                <span>📍 Delivering to: <strong>{deliveryLocation?.tag}</strong> ({deliveryLocation?.address?.split(",")[0]})</span>
              </div>

              <button
                className="proceed-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout • ₹{finalTotal} →
              </button>

              <Link to="/shop" className="continue-shopping-link">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;