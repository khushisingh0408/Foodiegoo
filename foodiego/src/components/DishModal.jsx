import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../css/DishModal.css";

function DishModal({ food, isOpen, onClose }) {
  const { addToCart } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState(
    food?.sizes && food.sizes.length > 0 ? food.sizes[0] : null
  );
  const [selectedCrust, setSelectedCrust] = useState(
    food?.crusts && food.crusts.length > 0 ? food.crusts[0] : null
  );
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialNotes, setSpecialNotes] = useState("");

  if (!isOpen || !food) return null;

  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const basePrice = Number(String(food.price).replace("₹", ""));
  const sizeExtra = selectedSize ? selectedSize.price : 0;
  const crustExtra = selectedCrust ? selectedCrust.price : 0;
  const addOnsExtra = selectedAddOns.reduce((sum, item) => sum + item.price, 0);

  const calculatedTotal = basePrice + sizeExtra + crustExtra + addOnsExtra;

  const handleAddToCart = () => {
    const customOptions = {
      size: selectedSize,
      crust: selectedCrust,
      addOns: selectedAddOns,
      notes: specialNotes.trim(),
      extraPrice: sizeExtra + crustExtra + addOnsExtra,
    };

    addToCart(food, customOptions);
    onClose();
  };

  return (
    <div className="dish-modal-overlay" onClick={onClose}>
      <div className="dish-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="dish-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {/* Top Dish Banner */}
        <div className="dish-modal-hero">
          <div className="dish-image-wrapper">
            <img src={food.image} alt={food.name} />
          </div>
          <div className="dish-hero-info">
            <div className="dish-badge-row">
              <span className={`diet-pill ${food.isVeg ? "veg" : "non-veg"}`}>
                {food.isVeg ? "🟢 Pure Veg" : "🔴 Non-Veg"}
              </span>
              {food.badge && <span className="highlight-tag">{food.badge}</span>}
              <span className="rating-pill">{food.rating} ({food.ratingCount || "500+"})</span>
            </div>

            <h2>{food.name}</h2>
            <p className="dish-desc">{food.description}</p>

            <div className="dish-quick-meta">
              <span>⏱️ {food.prepTime || "20 mins"}</span>
              {food.calories && <span>🔥 {food.calories}</span>}
              {food.restaurantName && <span>🏬 {food.restaurantName}</span>}
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="dish-modal-body">
          {/* Step 1: Size Selector */}
          {food.sizes && food.sizes.length > 0 && (
            <div className="custom-section">
              <div className="section-title-wrap">
                <h4>1. Choose Size</h4>
                <span className="required-badge">Required</span>
              </div>
              <div className="options-grid">
                {food.sizes.map((s, idx) => (
                  <label
                    key={idx}
                    className={`option-card ${selectedSize?.name === s.name ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="dish-size"
                      checked={selectedSize?.name === s.name}
                      onChange={() => setSelectedSize(s)}
                    />
                    <div className="option-label">
                      <span>{s.name}</span>
                      <small>{s.price > 0 ? `+₹${s.price}` : "Standard"}</small>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Crust / Base */}
          {food.crusts && food.crusts.length > 0 && (
            <div className="custom-section">
              <div className="section-title-wrap">
                <h4>2. Select Crust / Base</h4>
                <span className="required-badge">Required</span>
              </div>
              <div className="options-grid">
                {food.crusts.map((c, idx) => (
                  <label
                    key={idx}
                    className={`option-card ${selectedCrust?.name === c.name ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="dish-crust"
                      checked={selectedCrust?.name === c.name}
                      onChange={() => setSelectedCrust(c)}
                    />
                    <div className="option-label">
                      <span>{c.name}</span>
                      <small>{c.price > 0 ? `+₹${c.price}` : "Standard"}</small>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Add-ons / Dips / Drinks */}
          {food.addOns && food.addOns.length > 0 && (
            <div className="custom-section">
              <div className="section-title-wrap">
                <h4>3. Add-ons & Dips (Optional)</h4>
                <span className="optional-badge">Optional</span>
              </div>
              <div className="addons-list">
                {food.addOns.map((addon, idx) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <label
                      key={idx}
                      className={`addon-item ${isChecked ? "checked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddOn(addon)}
                      />
                      <span className="addon-name">{addon.name}</span>
                      <span className="addon-price">
                        {addon.price > 0 ? `+₹${addon.price}` : "Free"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Special Cooking Instructions */}
          <div className="custom-section">
            <div className="section-title-wrap">
              <h4>Special Instructions for Chef</h4>
              <span className="optional-badge">Optional</span>
            </div>
            <textarea
              className="instructions-input"
              rows={2}
              placeholder="e.g., Less spicy, no onion garlic, extra crisp..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="dish-modal-footer">
          <div className="total-display">
            <small>Total Payable</small>
            <h3>₹{calculatedTotal}</h3>
          </div>

          <button className="add-item-btn" onClick={handleAddToCart}>
            Add Item to Cart • ₹{calculatedTotal} 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

export default DishModal;
