import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import "../css/Checkout.css";

const savedAddressOptions = [
  {
    tag: "Home",
    emoji: "🏠",
    name: "Alex Morgan",
    phone: "9876543210",
    address: "Flat 402, Sunshine Heights, Sector 62",
    city: "Noida, Uttar Pradesh",
    pincode: "201309"
  },
  {
    tag: "Work",
    emoji: "💼",
    name: "Alex Morgan",
    phone: "9876543210",
    address: "Tower B, Cyber City, DLF Phase 2",
    city: "Gurugram, Haryana",
    pincode: "122002"
  }
];

function Checkout() {
  const {
    cart,
    clearCart,
    finalTotal,
    itemTotal,
    deliveryFee,
    platformFee,
    gstAndTaxes,
    couponDiscount,
    appliedCoupon,
    driverTip,
    cookingInstructions,
    deliverySpeed,
    deliveryLocation,
    startOrderTracking,
    showToast
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Address State
  const [selectedAddressTag, setSelectedAddressTag] = useState("Home");
  const [name, setName] = useState(user?.name || "Alex Morgan");
  const [mobile, setMobile] = useState(user?.phone || "9876543210");
  const [address, setAddress] = useState(deliveryLocation?.address || "Flat 402, Sunshine Heights, Sector 62, Noida");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi | card | netbanking | cod
  const [upiApp, setUpiApp] = useState("gpay"); // gpay | phonepe | paytm
  const [upiIdInput, setUpiIdInput] = useState("alex@okaxis");

  // Card Simulator State
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8921");
  const [cardHolder, setCardHolder] = useState(user?.name || "ALEX MORGAN");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("•••");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setMobile(user.phone);
    }
  }, [user]);

  const handleSelectSavedAddress = (saved) => {
    setSelectedAddressTag(saved.tag);
    setName(saved.name);
    setMobile(saved.phone);
    setAddress(`${saved.address}, ${saved.city} - ${saved.pincode}`);
  };

  const handlePlaceOrder = async () => {
    if (!name.trim() || !mobile.trim() || !address.trim()) {
      showToast("Please enter complete delivery details.", "error");
      return;
    }

    if (mobile.trim().length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: name.trim(),
      customerMobile: mobile.trim(),
      deliveryAddress: address.trim(),
      paymentMethod:
        paymentMethod === "upi"
          ? `UPI (${upiApp.toUpperCase()})`
          : paymentMethod === "card"
          ? "Credit/Debit Card"
          : paymentMethod === "netbanking"
          ? "Net Banking"
          : "Cash on Delivery",
      items: cart.map((item) => ({
        id: item.id,
        name: item.name + (item.customOptions ? ` (${item.customOptions.size?.name || "Custom"})` : ""),
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "",
      })),
      total: finalTotal,
      cookingInstructions,
      restaurantName: cart[0]?.restaurantName || "FoodieGo Kitchen"
    };

    // Post to SQL Backend API
    const res = await api.post("/orders", orderPayload);

    let createdOrder;
    if (res.success && res.order) {
      createdOrder = { ...res.order, restaurantName: orderPayload.restaurantName };
    } else {
      // Offline fallback order object
      createdOrder = {
        id: `FGO-${Math.floor(1000 + Math.random() * 9000)}`,
        items: orderPayload.items,
        total: finalTotal,
        customerName: name.trim(),
        customerMobile: mobile.trim(),
        deliveryAddress: address.trim(),
        paymentMethod: orderPayload.paymentMethod,
        date: new Date().toISOString(),
        status: "Order Confirmed",
        restaurantName: orderPayload.restaurantName
      };
    }

    // Save to local storage order history
    const existingOrders = JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
    localStorage.setItem("foodieGoOrders", JSON.stringify([createdOrder, ...existingOrders]));

    // Start Live GPS Tracking
    startOrderTracking(createdOrder);
    clearCart();
    setOrderSuccess(true);
    setIsSubmitting(false);

    showToast("🎉 Order confirmed! Redirecting to live tracking map...", "success", 2500);

    setTimeout(() => {
      navigate(`/track/${createdOrder.id}`);
    }, 1200);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Secure Checkout 🛍️</h1>
        <p>Review your delivery address and choose payment method</p>
      </div>

      {cart.length === 0 && !orderSuccess ? (
        <div className="empty-checkout-box">
          <h2>Your Cart is Empty 😔</h2>
          <p>Add some food to your cart before proceeding to checkout.</p>
          <button onClick={() => navigate("/")} className="primary-btn">
            Browse Menu 🍔
          </button>
        </div>
      ) : (
        <div className="checkout-grid">
          {/* Left Column: Delivery Address & Payment Method */}
          <div className="checkout-left-col">
            {/* Step 1: Delivery Address */}
            <div className="checkout-card">
              <div className="card-step-header">
                <span className="step-num">1</span>
                <div>
                  <h3>Delivery Address</h3>
                  <small>Select a saved address or enter a new one</small>
                </div>
              </div>

              {/* Saved Address Pills */}
              <div className="saved-addr-pills">
                {savedAddressOptions.map((opt) => (
                  <div
                    key={opt.tag}
                    className={`addr-pill ${selectedAddressTag === opt.tag ? "selected" : ""}`}
                    onClick={() => handleSelectSavedAddress(opt)}
                  >
                    <span className="addr-emoji">{opt.emoji}</span>
                    <div className="addr-pill-info">
                      <strong>{opt.tag}</strong>
                      <small>{opt.address.slice(0, 24)}...</small>
                    </div>
                  </div>
                ))}
              </div>

              <div className="address-inputs-wrap">
                <div className="input-row-2">
                  <div className="input-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Receiver's name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <label>10-Digit Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Complete Delivery Address & Landmark</label>
                  <textarea
                    rows={2}
                    placeholder="House/Flat number, Building, Street, Area, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Options */}
            <div className="checkout-card">
              <div className="card-step-header">
                <span className="step-num">2</span>
                <div>
                  <h3>Payment Method</h3>
                  <small>100% Safe and Encrypted Payments</small>
                </div>
              </div>

              <div className="payment-options-tabs">
                <button
                  className={`pay-tab ${paymentMethod === "upi" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <span>📱</span> UPI (Instant)
                </button>
                <button
                  className={`pay-tab ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <span>💳</span> Cards
                </button>
                <button
                  className={`pay-tab ${paymentMethod === "netbanking" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  <span>🏦</span> Net Banking
                </button>
                <button
                  className={`pay-tab ${paymentMethod === "cod" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <span>💵</span> Cash on Delivery
                </button>
              </div>

              {/* UPI Tab View */}
              {paymentMethod === "upi" && (
                <div className="payment-tab-content">
                  <div className="upi-apps-row">
                    <button
                      className={`upi-app-btn ${upiApp === "gpay" ? "selected" : ""}`}
                      onClick={() => setUpiApp("gpay")}
                    >
                      <span className="upi-badge">GPay</span> Google Pay
                    </button>
                    <button
                      className={`upi-app-btn ${upiApp === "phonepe" ? "selected" : ""}`}
                      onClick={() => setUpiApp("phonepe")}
                    >
                      <span className="upi-badge phonepe">Pe</span> PhonePe
                    </button>
                    <button
                      className={`upi-app-btn ${upiApp === "paytm" ? "selected" : ""}`}
                      onClick={() => setUpiApp("paytm")}
                    >
                      <span className="upi-badge paytm">Paytm</span> Paytm
                    </button>
                  </div>

                  <div className="upi-id-input-box">
                    <label>Enter UPI ID (VPA):</label>
                    <div className="upi-input-group">
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        placeholder="username@bank"
                      />
                      <span className="verified-badge">✓ Verified</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab View with Interactive Visual Card */}
              {paymentMethod === "card" && (
                <div className="payment-tab-content">
                  {/* Visual Card Preview */}
                  <div className="visual-credit-card">
                    <div className="card-top-chip">
                      <span className="chip-icon">💳</span>
                      <span className="card-brand-logo">VISA</span>
                    </div>
                    <div className="visual-card-number">{cardNumber}</div>
                    <div className="card-bottom-meta">
                      <div>
                        <small>CARD HOLDER</small>
                        <strong>{cardHolder}</strong>
                      </div>
                      <div>
                        <small>EXPIRES</small>
                        <strong>{cardExpiry}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="card-form-grid">
                    <div className="input-field">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </div>
                    <div className="input-field">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      />
                    </div>
                    <div className="input-row-2">
                      <div className="input-field">
                        <label>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          maxLength={5}
                        />
                      </div>
                      <div className="input-field">
                        <label>CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Netbanking Tab */}
              {paymentMethod === "netbanking" && (
                <div className="payment-tab-content">
                  <div className="popular-banks-grid">
                    <label className="bank-card">
                      <input type="radio" name="bank" defaultChecked />
                      <span>HDFC Bank 🏛️</span>
                    </label>
                    <label className="bank-card">
                      <input type="radio" name="bank" />
                      <span>ICICI Bank 🏛️</span>
                    </label>
                    <label className="bank-card">
                      <input type="radio" name="bank" />
                      <span>State Bank of India 🏛️</span>
                    </label>
                    <label className="bank-card">
                      <input type="radio" name="bank" />
                      <span>Axis Bank 🏛️</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Cash On Delivery Tab */}
              {paymentMethod === "cod" && (
                <div className="payment-tab-content cod-box">
                  <div className="cod-icon">💵</div>
                  <h4>Cash on Delivery Selected</h4>
                  <p>Please keep exact change ready of ₹{finalTotal} at the time of delivery.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="checkout-right-col">
            <div className="order-summary-box">
              <h3>Order Summary 🛒</h3>

              <div className="checkout-items-preview">
                {cart.map((food) => (
                  <div className="summary-item-row" key={food.cartItemId || food.id}>
                    <div className="s-name">
                      <span>{food.name}</span>
                      <small>Qty: {food.quantity || 1}</small>
                    </div>
                    <strong>
                      ₹{(food.unitPrice || Number(String(food.price).replace("₹", ""))) * (food.quantity || 1)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="summary-bill-details">
                <div className="s-bill-row">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="s-bill-row">
                  <span>Delivery Partner Fee</span>
                  <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                </div>
                <div className="s-bill-row">
                  <span>Platform Fee & Taxes</span>
                  <span>₹{platformFee + gstAndTaxes}</span>
                </div>

                {deliverySpeed === "express" && (
                  <div className="s-bill-row">
                    <span>⚡ Priority Express</span>
                    <span>₹25</span>
                  </div>
                )}

                {driverTip > 0 && (
                  <div className="s-bill-row">
                    <span>Delivery Partner Tip</span>
                    <span>₹{driverTip}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="s-bill-row green-row">
                    <span>Coupon Savings ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="summary-divider" />

                <div className="summary-final-total">
                  <span>Grand Total</span>
                  <h2>₹{finalTotal}</h2>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                className="place-final-order-btn"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing Secure Order..."
                  : `Pay & Place Order (₹${finalTotal}) 🚀`}
              </button>

              <div className="security-badges">
                <span>🔒 256-Bit SSL Encrypted</span>
                <span>⚡ Live GPS Order Tracking</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;