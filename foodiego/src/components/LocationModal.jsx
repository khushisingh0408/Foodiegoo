import { useState, useContext } from "react";
import {
  MapPin,
  Search,
  Crosshair,
  X,
  Home,
  Briefcase,
  Building2
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/LocationModal.css";

const popularLocations = [
  {
    tag: "Home",
    iconType: "home",
    address: "Flat 402, Sunshine Heights, Sector 62",
    city: "Noida, Uttar Pradesh",
    pincode: "201309"
  },
  {
    tag: "Work",
    iconType: "work",
    address: "Tower B, Cyber City, DLF Phase 2",
    city: "Gurugram, Haryana",
    pincode: "122002"
  },
  {
    tag: "Bengaluru",
    iconType: "city",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar",
    city: "Bengaluru, Karnataka",
    pincode: "560038"
  },
  {
    tag: "Mumbai",
    iconType: "city",
    address: "Linking Road, Bandra West",
    city: "Mumbai, Maharashtra",
    pincode: "400050"
  },
  {
    tag: "Delhi",
    iconType: "city",
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
        iconType: "gps",
        address: "Sector 18 Market, Metro Station Gate 2",
        city: "Noida, Delhi NCR",
        pincode: "201301"
      };
      updateDeliveryLocation(liveLoc);
      showToast("Geolocation detected successfully!", "success");
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
            <h3 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Choose Delivery Location <MapPin size={18} color="#ff4757" />
            </h3>
            <p>Select your address for accurate delivery time and restaurant offers</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="location-search-input-wrap">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search for area, street, landmark, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <button
          className={`gps-locate-btn ${isLocating ? "locating" : ""}`}
          onClick={handleGpsLocate}
          disabled={isLocating}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <span className="gps-icon"><Crosshair size={20} color="#ff4757" /></span>
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
                <span className="loc-emoji" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {loc.iconType === "home" ? (
                    <Home size={18} color="#ff4757" />
                  ) : loc.iconType === "work" ? (
                    <Briefcase size={18} color="#3b82f6" />
                  ) : (
                    <MapPin size={18} color="#10b981" />
                  )}
                </span>
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
