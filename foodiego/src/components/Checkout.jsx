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
  Smartphone
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
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
  const [fullName, setFullName] = useState(user?.name || "Alex Morgan");
  const [mobile, setMobile] = useState(user?.phone || "9876543210");
  const [houseFlat, setHouseFlat] = useState("Flat 402, Sunshine Heights");
  const [street, setStreet] = useState("Sector 62, Electronic City");
  const [city, setCity] = useState("Noida");
  const [stateName, setStateName] = useState("Uttar Pradesh");
  const [pincode, setPincode] = useState("201309");
  const [addressTag, setAddressTag] = useState("Home");

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi | card | netbanking | wallet | cod | emi
  const [upiApp, setUpiApp] = useState("gpay"); // gpay | phonepe | paytm | qrcode
  const [upiIdInput, setUpiIdInput] = useState("alex@okaxis");

  // Card Simulator State
  const [cardNumber, setCardNumber] = useState("4532 8921 7734 6512");
  const [cardHolder, setCardHolder] = useState(user?.name || "ALEX MORGAN");
  const [cardExpiry, setCardExpiry] = useState("08/29");
  const [cardCvv, setCardCvv] = useState("892");

  // Netbanking & Wallet state
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("Paytm");
  const [selectedEmiTenure, setSelectedEmiTenure] = useState("3");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.phone) setMobile(user.phone);
    }
  }, [user]);

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
    const paymentLabel =
      paymentMethod === "upi"
        ? `UPI (${upiApp.toUpperCase()})`
        : paymentMethod === "card"
        ? `Credit/Debit Card (Ending in ${cardNumber.slice(-4)})`
        : paymentMethod === "netbanking"
        ? `Net Banking (${selectedBank})`
        : paymentMethod === "wallet"
        ? `Wallet (${selectedWallet})`
        : paymentMethod === "emi"
        ? `EMI (${selectedEmiTenure} Months)`
        : "Cash on Delivery";

    const orderPayload = {
      customerName: fullName.trim(),
      customerMobile: mobile.trim(),
      deliveryAddress: fullDeliveryAddress,
      paymentMethod: paymentLabel,
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
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number (10 digits) *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Flat / House No. / Building Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Sunshine Heights"
                      value={houseFlat}
                      onChange={(e) => setHouseFlat(e.target.value)}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Street / Area / Sector *</label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 62, Electronic City"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      placeholder="e.g. Noida"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      placeholder="e.g. Uttar Pradesh"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 201309"
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
                  onClick={() => setCurrentStep(2)}
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
                {/* Payment Tabs */}
                <div className="payment-tabs-row">
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Zap size={14} color="#f59e0b" /> UPI / QR
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <CreditCard size={14} color="#3b82f6" /> Card
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "netbanking" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("netbanking")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Building2 size={14} color="#8b5cf6" /> Net Banking
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "wallet" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("wallet")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Wallet size={14} color="#ec4899" /> Wallet
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "cod" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cod")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Banknote size={14} color="#10b981" /> Cash on Delivery
                  </button>
                  <button
                    type="button"
                    className={`payment-tab ${paymentMethod === "emi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("emi")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <BarChart3 size={14} color="#f97316" /> EMI
                  </button>
                </div>

                {/* 1. UPI Payment Panel */}
                {paymentMethod === "upi" && (
                  <div className="payment-panel-content">
                    <label className="panel-label">Choose UPI App or Scan QR:</label>
                    <div className="upi-apps-grid">
                      {[
                        { id: "gpay", name: "Google Pay", icon: <Smartphone size={20} color="#4285F4" /> },
                        { id: "phonepe", name: "PhonePe", icon: <Smartphone size={20} color="#6739B7" /> },
                        { id: "paytm", name: "Paytm UPI", icon: <Smartphone size={20} color="#00BAF2" /> },
                        { id: "qrcode", name: "Scan QR Code", icon: <QrCode size={20} color="#10b981" /> }
                      ].map((app) => (
                        <div
                          key={app.id}
                          className={`upi-app-card ${upiApp === app.id ? "selected" : ""}`}
                          onClick={() => setUpiApp(app.id)}
                        >
                          <span className="app-icon">{app.icon}</span>
                          <strong>{app.name}</strong>
                        </div>
                      ))}
                    </div>

                    {upiApp !== "qrcode" ? (
                      <div className="upi-input-group">
                        <label>Enter UPI ID (VPA):</label>
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                        />
                        <small>A payment request will be sent to your UPI app.</small>
                      </div>
                    ) : (
                      <div className="upi-qr-display-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div className="qr-box-pattern" style={{ padding: "16px", background: "#f8fafc", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <QrCode size={48} color="#0f172a" />
                        </div>
                        <strong>Scan with any UPI app to pay ₹{finalTotal}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Card Payment Panel */}
                {paymentMethod === "card" && (
                  <div className="payment-panel-content">
                    {/* Interactive 3D Card Preview */}
                    <div className="visual-card-preview">
                      <div className="card-chip"><CreditCard size={28} /></div>
                      <div className="card-number-display">{cardNumber || "•••• •••• •••• ••••"}</div>
                      <div className="card-bottom-display">
                        <div>
                          <small>CARD HOLDER</small>
                          <strong>{cardHolder || "YOUR NAME"}</strong>
                        </div>
                        <div>
                          <small>EXPIRES</small>
                          <strong>{cardExpiry || "MM/YY"}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="card-inputs-grid">
                      <div className="form-group span-2">
                        <label>Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 8921 7734 6512"
                        />
                      </div>
                      <div className="form-group span-2">
                        <label>Name on Card</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="ALEX MORGAN"
                        />
                      </div>
                      <div className="form-group">
                        <label>Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="08/29"
                        />
                      </div>
                      <div className="form-group">
                        <label>CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="892"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking */}
                {paymentMethod === "netbanking" && (
                  <div className="payment-panel-content">
                    <label className="panel-label">Select Your Bank:</label>
                    <div className="banks-grid">
                      {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra"].map((bank) => (
                        <div
                          key={bank}
                          className={`bank-card ${selectedBank === bank ? "selected" : ""}`}
                          onClick={() => setSelectedBank(bank)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                          <Building2 size={18} color="#8b5cf6" />
                          <strong>{bank}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Wallet */}
                {paymentMethod === "wallet" && (
                  <div className="payment-panel-content">
                    <label className="panel-label">Choose Mobile Wallet:</label>
                    <div className="banks-grid">
                      {["Paytm Wallet", "Amazon Pay", "Mobikwik", "PhonePe Wallet"].map((w) => (
                        <div
                          key={w}
                          className={`bank-card ${selectedWallet === w ? "selected" : ""}`}
                          onClick={() => setSelectedWallet(w)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                        >
                          <Wallet size={18} color="#ec4899" />
                          <strong>{w}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Cash on Delivery */}
                {paymentMethod === "cod" && (
                  <div className="payment-panel-content cod-box">
                    <div className="cod-icon" style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                      <Banknote size={36} color="#10b981" />
                    </div>
                    <h4>Pay Cash or UPI upon Delivery</h4>
                    <p>
                      Please keep exact cash ready or scan the delivery rider's QR code upon arrival.
                    </p>
                  </div>
                )}

                {/* 6. EMI */}
                {paymentMethod === "emi" && (
                  <div className="payment-panel-content">
                    <label className="panel-label">Select EMI Tenure (Credit Cards):</label>
                    <div className="emi-options-list">
                      {[
                        { months: "3", perMonth: Math.round(finalTotal / 3), bank: "HDFC / ICICI No Cost" },
                        { months: "6", perMonth: Math.round(finalTotal / 6), bank: "Standard Chartered" },
                        { months: "12", perMonth: Math.round(finalTotal / 12), bank: "Axis Bank" }
                      ].map((emi) => (
                        <div
                          key={emi.months}
                          className={`emi-card-item ${selectedEmiTenure === emi.months ? "selected" : ""}`}
                          onClick={() => setSelectedEmiTenure(emi.months)}
                        >
                          <div>
                            <strong>{emi.months} Months Plan</strong>
                            <small>{emi.bank}</small>
                          </div>
                          <span className="emi-rate">₹{emi.perMonth}/mo</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trust Seals */}
                <div className="checkout-trust-seals">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Lock size={14} color="#10b981" /> 256-Bit SSL Encryption
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <ShieldCheck size={14} color="#3b82f6" /> 100% Genuine Quality Guarantee
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Zap size={14} color="#f59e0b" /> RBI Approved Gateway
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
                      Processing Order... <Loader2 size={16} className="spin-icon" />
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      Place Order • ₹{finalTotal} <Zap size={16} />
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;