import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Lock,
  Check,
  Pencil,
  Home,
  Briefcase,
  MapPin,
  Phone,
  Zap,
  CreditCard,
  Building2,
  Wallet,
  Banknote,
  BarChart3,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Clock,
  Loader2,
  Smartphone,
  CheckCircle2,
  BadgePercent,
  Sparkles
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { initiateRazorpayPayment } from "../services/razorpay";
import "../css/Checkout.css";

function Checkout() {
  const {
    cart,
    clearCart,
    finalTotal,
    itemTotal,
    deliveryFee,
    platformFee,
    gstAndTaxes,
    expressFee,
    giftWrapFee,
    couponDiscount,
    appliedCoupon,
    driverTip,
    cookingInstructions,
    deliverySpeed,
    setDeliverySpeed,
    isGiftWrap,
    giftMessage,
    savedAddresses,
    addAddress,
    startOrderTracking,
    showToast
  } = useContext(CartContext);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Active Checkout Step (1: Address, 2: Delivery, 3: Payment)
  const [currentStep, setCurrentStep] = useState(1);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || "new");
  const [fullName, setFullName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.phone || "");
  const [houseFlat, setHouseFlat] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressTag, setAddressTag] = useState("Home");

  // Payment State: "razorpay" (Online) | "cod" (Cash on Delivery)
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [onlineSubMethod, setOnlineSubMethod] = useState("all"); // all | upi | card | netbanking | wallet

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone) setMobile(user.phone);
    }
  }, [user]);

  const handleContinueFromAddress = () => {
    if (!fullName.trim()) {
      showToast("Please enter your Full Name", "error");
      return;
    }
    if (!mobile.trim() || mobile.trim().length !== 10) {
      showToast("Please enter a valid 10-digit mobile number", "error");
      return;
    }
    if (!houseFlat.trim()) {
      showToast("Please enter Flat / House / Building name", "error");
      return;
    }
    if (!city.trim()) {
      showToast("Please enter your City", "error");
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      showToast("Please enter a valid 6-digit PIN code", "error");
      return;
    }
    setCurrentStep(2);
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setFullName(addr.fullName);
    setMobile(addr.mobile);
    setHouseFlat(addr.houseFlat);
    setStreet(addr.street);
    setCity(addr.city);
    setStateName(addr.state);
    setPincode(addr.pincode);
    setAddressTag(addr.tag);
  };

  // Complete Order Creation Helper
  const finalizeOrder = async (orderPayload) => {
    try {
      const res = await api.post("/orders", orderPayload);
      const orderData = res.order || {
        id: `FGO-${Math.floor(1000 + Math.random() * 9000)}`,
        ...orderPayload,
        status: "Order Placed",
        date: new Date().toISOString()
      };

      // Save order in local history
      const savedOrders = JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
      localStorage.setItem("foodieGoOrders", JSON.stringify([orderData, ...savedOrders]));

      startOrderTracking(orderData);
      clearCart();
      setIsSubmitting(false);

      // Navigate to dedicated Order Success confirmation page
      navigate(`/order-success/${orderData.id}`);
    } catch (err) {
      console.error(err);
      const fallbackId = `FGO-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackOrder = {
        id: fallbackId,
        ...orderPayload,
        status: "Order Placed",
        date: new Date().toISOString()
      };
      const savedOrders = JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
      localStorage.setItem("foodieGoOrders", JSON.stringify([fallbackOrder, ...savedOrders]));
      startOrderTracking(fallbackOrder);
      clearCart();
      setIsSubmitting(false);
      navigate(`/order-success/${fallbackId}`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!fullName.trim() || !mobile.trim() || !houseFlat.trim() || !city.trim() || !pincode.trim()) {
      showToast("Please enter complete delivery address.", "error");
      setCurrentStep(1);
      return;
    }

    if (mobile.trim().length !== 10) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      setCurrentStep(1);
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty.", "warning");
      navigate("/shop");
      return;
    }

    setIsSubmitting(true);

    const fullDeliveryAddress = `${houseFlat}, ${street}, ${city}, ${stateName} - ${pincode} (${addressTag})`;

    const baseOrderPayload = {
      customerName: fullName.trim(),
      customerMobile: mobile.trim(),
      deliveryAddress: fullDeliveryAddress,
      deliverySpeed,
      isGiftWrap,
      giftMessage,
      driverTip,
      cookingInstructions,
      couponCode: appliedCoupon?.code || null,
      total: finalTotal,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name + (item.customOptions ? ` (${item.customOptions.size?.name || 'Custom'})` : ''),
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image,
      }))
    };

    // 1. CASH ON DELIVERY
    if (paymentMethod === "cod") {
      const codOrderPayload = {
        ...baseOrderPayload,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending (COD)",
        razorpayPaymentId: null,
        razorpayOrderId: null
      };
      await finalizeOrder(codOrderPayload);
      return;
    }

    // 2. REAL RAZORPAY GATEWAY PAYMENT
    try {
      await initiateRazorpayPayment({
        amount: finalTotal,
        customerInfo: {
          name: fullName.trim(),
          phone: mobile.trim(),
          email: user?.email || "customer@foodiego.com"
        },
        onSuccess: async (paymentResult) => {
          showToast(`Payment Successful! ID: ${paymentResult.paymentId}`, "success");
          const onlineOrderPayload = {
            ...baseOrderPayload,
            paymentMethod: `Razorpay Online (${paymentResult.method || 'UPI/Card'})`,
            paymentStatus: "Paid",
            razorpayPaymentId: paymentResult.paymentId,
            razorpayOrderId: paymentResult.orderId
          };
          await finalizeOrder(onlineOrderPayload);
        },
        onError: (errMsg) => {
          setIsSubmitting(false);
          showToast(errMsg || "Payment failed or cancelled.", "error");
        },
        onDismiss: () => {
          setIsSubmitting(false);
          showToast("Payment window closed.", "info");
        }
      });
    } catch (err) {
      setIsSubmitting(false);
      showToast(err.message || "Could not launch Razorpay payment.", "error");
    }
  };

  return (
    <div className="checkout-page">
      {/* Checkout Header & Steps Indicator */}
      <div className="checkout-header-area">
        <h1 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          Secure Checkout <Lock size={24} color="#10b981" />
        </h1>
        <div className="checkout-steps-tracker">
          <div
            className={`step-bubble ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}
            onClick={() => setCurrentStep(1)}
          >
            <span className="step-num">{currentStep > 1 ? <Check size={14} /> : "1"}</span>
            <span className="step-text">Delivery Address</span>
          </div>

          <div className={`step-connector ${currentStep >= 2 ? "active" : ""}`} />

          <div
            className={`step-bubble ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}
            onClick={() => setCurrentStep(2)}
          >
            <span className="step-num">{currentStep > 2 ? <Check size={14} /> : "2"}</span>
            <span className="step-text">Delivery Speed</span>
          </div>

          <div className={`step-connector ${currentStep >= 3 ? "active" : ""}`} />

          <div
            className={`step-bubble ${currentStep >= 3 ? "active" : ""}`}
            onClick={() => setCurrentStep(3)}
          >
            <span className="step-num">3</span>
            <span className="step-text">Payment Method</span>
          </div>
        </div>
      </div>

      <div className="checkout-main-grid">
        {/* Left Column: Interactive Steps Form */}
        <div className="checkout-form-column">
          {/* STEP 1: Address */}
          <div className={`checkout-step-card ${currentStep === 1 ? "active-card" : ""}`}>
            <div className="step-card-header" onClick={() => setCurrentStep(1)}>
              <div className="step-badge">1</div>
              <div>
                <h3>1. Select Delivery Address</h3>
                <p className="step-subtitle">Where should we deliver your hot food?</p>
              </div>
              {currentStep !== 1 && (
                <span className="step-edit-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Pencil size={13} /> Edit
                </span>
              )}
            </div>

            {currentStep === 1 && (
              <div className="step-card-body">
                {/* Saved Address Pills */}
                {savedAddresses.length > 0 && (
                  <div className="saved-addresses-grid">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`saved-addr-card ${selectedAddressId === addr.id ? "selected" : ""}`}
                        onClick={() => handleSelectSavedAddress(addr)}
                      >
                        <div className="saved-addr-top">
                          <span className="addr-tag-pill" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            {addr.tag === "Home" ? <><Home size={13} /> Home</> : addr.tag === "Work" ? <><Briefcase size={13} /> Work</> : <><MapPin size={13} /> Other</>}
                          </span>
                          {selectedAddressId === addr.id && (
                            <span className="selected-check" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <Check size={13} /> Selected
                            </span>
                          )}
                        </div>
                        <strong>{addr.fullName}</strong>
                        <p>{addr.houseFlat}, {addr.street}</p>
                        <small>{addr.city}, {addr.state} - {addr.pincode}</small>
                        <small className="addr-phone" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Smartphone size={13} /> {addr.mobile}
                        </small>
                      </div>
                    ))}
                  </div>
                )}

                {/* Address Form */}
                <div className="address-form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number (10 digits) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Flat / House No. / Building Name *</label>
                    <input
                      type="text"
                      placeholder="House / Flat No., Apartment / Building name"
                      value={houseFlat}
                      onChange={(e) => setHouseFlat(e.target.value)}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Street / Area / Sector *</label>
                    <input
                      type="text"
                      placeholder="Street name, Area, Sector, Landmark"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      placeholder="City name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      placeholder="State name"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Save Address As</label>
                    <div className="tag-toggle-row">
                      {["Home", "Work", "Other"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`tag-btn ${addressTag === t ? "active" : ""}`}
                          onClick={() => setAddressTag(t)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          {t === "Home" ? <Home size={14} /> : t === "Work" ? <Briefcase size={14} /> : <MapPin size={14} />} {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  className="step-continue-btn"
                  onClick={handleContinueFromAddress}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  Continue to Delivery Speed <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Delivery Speed */}
          <div className={`checkout-step-card ${currentStep === 2 ? "active-card" : ""}`}>
            <div className="step-card-header" onClick={() => setCurrentStep(2)}>
              <div className="step-badge">2</div>
              <div>
                <h3>2. Choose Delivery Speed & Method</h3>
                <p className="step-subtitle">Selected: {deliverySpeed === "express" ? "Priority Express" : "Standard Delivery"}</p>
              </div>
              {currentStep !== 2 && (
                <span className="step-edit-link" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <Pencil size={13} /> Edit
                </span>
              )}
            </div>

            {currentStep === 2 && (
              <div className="step-card-body">
                <div className="delivery-speed-choices">
                  <div
                    className={`delivery-choice-item ${deliverySpeed === "standard" ? "selected" : ""}`}
                    onClick={() => setDeliverySpeed("standard")}
                  >
                    <input
                      type="radio"
                      name="speed-step"
                      checked={deliverySpeed === "standard"}
                      onChange={() => setDeliverySpeed("standard")}
                    />
                    <div className="speed-choice-text">
                      <strong>Standard Courier Delivery (25-30 mins)</strong>
                      <p>Standard delivery dispatch with contactless thermal packaging.</p>
                    </div>
                    <span className="choice-fee">Free</span>
                  </div>

                  <div
                    className={`delivery-choice-item ${deliverySpeed === "express" ? "selected" : ""}`}
                    onClick={() => setDeliverySpeed("express")}
                  >
                    <input
                      type="radio"
                      name="speed-step"
                      checked={deliverySpeed === "express"}
                      onChange={() => setDeliverySpeed("express")}
                    />
                    <div className="speed-choice-text">
                      <strong style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <Zap size={14} color="#f59e0b" /> Priority Express Rider (15-20 mins)
                      </strong>
                      <p>Dedicated single-drop express rider assigned directly to your kitchen.</p>
                    </div>
                    <span className="choice-fee">+₹25</span>
                  </div>
                </div>

                <button
                  className="step-continue-btn"
                  onClick={() => setCurrentStep(3)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                >
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: Payment */}
          <div className={`checkout-step-card ${currentStep === 3 ? "active-card" : ""}`}>
            <div className="step-card-header" onClick={() => setCurrentStep(3)}>
              <div className="step-badge">3</div>
              <div>
                <h3>3. Select Payment Method</h3>
                <p className="step-subtitle">100% Secure & Encrypted Payment Options</p>
              </div>
            </div>

            {currentStep === 3 && (
              <div className="step-card-body">
                {/* Payment Methods Selection */}
                <div className="payment-gateway-options-grid">
                  {/* Option 1: Razorpay Online Payment Gateway */}
                  <div
                    className={`gateway-option-card ${paymentMethod === "razorpay" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("razorpay")}
                  >
                    <div className="gateway-radio-header">
                      <div className="gateway-radio-wrap">
                        <input
                          type="radio"
                          name="payment-main-choice"
                          checked={paymentMethod === "razorpay"}
                          onChange={() => setPaymentMethod("razorpay")}
                        />
                        <div>
                          <div className="gateway-title-row">
                            <strong>Razorpay Secure Online Gateway</strong>
                            <span className="gateway-rec-badge">Recommended</span>
                          </div>
                          <p className="gateway-desc">
                            Pay instantly with UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, NetBanking, Wallets & QR.
                          </p>
                        </div>
                      </div>
                      <div className="gateway-brand-badge">
                        <ShieldCheck size={18} color="#10b981" />
                        <span>100% Safe</span>
                      </div>
                    </div>

                    {/* Supported Sub-Methods Icons Showcase */}
                    <div className="supported-methods-strip">
                      <div className="method-pill">
                        <Zap size={14} color="#f59e0b" />
                        <span>UPI & QR</span>
                      </div>
                      <div className="method-pill">
                        <Smartphone size={14} color="#3b82f6" />
                        <span>GPay / PhonePe / Paytm</span>
                      </div>
                      <div className="method-pill">
                        <CreditCard size={14} color="#8b5cf6" />
                        <span>Visa / Master / RuPay</span>
                      </div>
                      <div className="method-pill">
                        <Building2 size={14} color="#ec4899" />
                        <span>50+ NetBanking</span>
                      </div>
                      <div className="method-pill">
                        <Wallet size={14} color="#10b981" />
                        <span>Wallets & PayLater</span>
                      </div>
                    </div>

                    {paymentMethod === "razorpay" && (
                      <div className="razorpay-active-notice">
                        <CheckCircle2 size={16} color="#16a34a" />
                        <span>
                          Clicking &quot;Pay via Razorpay&quot; will open the official secure checkout popup.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Cash on Delivery */}
                  <div
                    className={`gateway-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    <div className="gateway-radio-header">
                      <div className="gateway-radio-wrap">
                        <input
                          type="radio"
                          name="payment-main-choice"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                        />
                        <div>
                          <div className="gateway-title-row">
                            <strong>Cash on Delivery (COD)</strong>
                          </div>
                          <p className="gateway-desc">
                            Pay with cash or scan delivery rider&apos;s UPI QR code upon arrival.
                          </p>
                        </div>
                      </div>
                      <div className="gateway-brand-badge cod-badge">
                        <Banknote size={18} color="#10b981" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Seals */}
                <div className="checkout-trust-seals">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Lock size={14} color="#10b981" /> 256-Bit SSL Encryption
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={14} color="#3b82f6" /> 100% Genuine Quality Guarantee
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Zap size={14} color="#f59e0b" /> RBI Approved Razorpay Gateway
                  </span>
                </div>

                {/* Place Order CTA Button */}
                <button
                  className="place-order-big-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {isSubmitting ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Processing Payment... <Loader2 size={16} className="spin-icon" />
                    </span>
                  ) : paymentMethod === "razorpay" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <Lock size={16} /> Pay via Razorpay • ₹{finalTotal} <ArrowRight size={16} />
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Place Cash on Delivery Order • ₹{finalTotal} <Check size={16} />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="checkout-summary-column">
          <div className="order-summary-box">
            <h3>Order Summary ({cart.length} items)</h3>

            {/* Products Mini List */}
            <div className="summary-items-list">
              {cart.map((item, idx) => (
                <div className="summary-item-row" key={idx}>
                  <img src={item.image} alt={item.name} />
                  <div className="summary-item-info">
                    <strong>{item.name}</strong>
                    <small>Qty: {item.quantity || 1}</small>
                  </div>
                  <span className="summary-item-price">
                    ₹{(item.unitPrice || Number(String(item.price).replace("₹", ""))) * (item.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-bill-rows">
              <div className="bill-row">
                <span>Item Subtotal</span>
                <span>₹{itemTotal}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <strong className="green-txt">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="bill-row">
                <span>Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
              <div className="bill-row">
                <span>GST & Taxes</span>
                <span>₹{gstAndTaxes}</span>
              </div>
              {deliverySpeed === "express" && (
                <div className="bill-row">
                  <span>Priority Express Delivery</span>
                  <span>₹{expressFee}</span>
                </div>
              )}
              {isGiftWrap && (
                <div className="bill-row">
                  <span>Gift Wrapping & Card</span>
                  <span>₹{giftWrapFee}</span>
                </div>
              )}
              {driverTip > 0 && (
                <div className="bill-row">
                  <span>Rider Tip</span>
                  <span>₹{driverTip}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="bill-row green-txt">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
            </div>

            <div className="summary-divider" />

            <div className="summary-total-row">
              <div>
                <strong>Total Amount</strong>
                <small>Including all charges</small>
              </div>
              <h2>₹{finalTotal}</h2>
            </div>

            {/* Direct Order CTA Button in Sidebar */}
            <button
              className="place-order-big-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isSubmitting ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  Processing Order... <Loader2 size={16} className="spin-icon" />
                </span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  Confirm & Place Order • ₹{finalTotal} <Zap size={16} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;