import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../css/LocationModal.css";

const popularLocations = [
  {
    tag: "Home",
    emoji: "🏠",
    address: "Flat 402, Sunshine Heights, Sector 62",
    city: "Noida, Uttar Pradesh",
    pincode: "201309"
  },
  {
    tag: "Work",
    emoji: "💼",
    address: "Tower B, Cyber City, DLF Phase 2",
    city: "Gurugram, Haryana",
    pincode: "122002"
  },
  {
    tag: "Bengaluru",
    emoji: "📍",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru, Karnataka",
    pincode: "560038"
  },
  {
    tag: "Mumbai",
    emoji: "📍",
    address: "Linking Road, Bandra West",
    city: "Mumbai, Maharashtra",
    pincode: "400050"
  },
  {
    tag: "Delhi",
    emoji: "📍",
    address: "Inner Circle, Connaught Place",
    city: "New Delhi, Delhi",
    pincode: "110001"
  }
];

function LocationModal({ isOpen, onClose }) {
  const { deliveryLocation, updateDeliveryLocation, showToast } = useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (loc) => {
    updateDeliveryLocation(loc);
    onClose();
  };

  const handleGpsLocate = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const liveLoc = {
        tag: "Current Location",
        emoji: "🎯",
        address: "Sector 18 Market, Metro Station Gate 2",
        city: "Noida, Delhi NCR",
        pincode: "201301"
      };
      updateDeliveryLocation(liveLoc);
      showToast("📍 Geolocation detected successfully!", "success");
      onClose();
    }, 900);
  };

  const filteredLocations = popularLocations.filter(
    (loc) =>
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="location-modal-overlay" onClick={onClose}>
      <div className="location-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="location-modal-header">
          <div>
            <h3>Choose Delivery Location 📍</h3>
            <p>Select your address for accurate delivery time and restaurant offers</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="location-search-input-wrap">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search for area, street, landmark, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <button
          className={`gps-locate-btn ${isLocating ? "locating" : ""}`}
          onClick={handleGpsLocate}
          disabled={isLocating}
        >
          <span className="gps-icon">🎯</span>
          <div className="gps-text">
            <strong>{isLocating ? "Detecting location..." : "Use Current Location"}</strong>
            <small>Using GPS for 15-minute quick delivery</small>
          </div>
        </button>

        <div className="location-section-title">Saved & Popular Addresses</div>

        <div className="saved-locations-list">
          {filteredLocations.map((loc, idx) => {
            const isSelected =
              deliveryLocation.city === loc.city && deliveryLocation.tag === loc.tag;

            return (
              <div
                className={`location-item ${isSelected ? "selected" : ""}`}
                key={idx}
                onClick={() => handleSelect(loc)}
              >
                <span className="loc-emoji">{loc.emoji}</span>
                <div className="loc-info">
                  <div className="loc-tag-row">
                    <strong>{loc.tag}</strong>
                    {isSelected && <span className="current-badge">Delivering here</span>}
                  </div>
                  <p className="loc-address">{loc.address}</p>
                  <span className="loc-city">{loc.city} • {loc.pincode}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LocationModal;
