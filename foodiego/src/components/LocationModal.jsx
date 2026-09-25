import { useState, useContext } from "react";
import {
  MapPin,
  Search,
  Crosshair,
  X,
  Home,
  Briefcase,
  Navigation,
  ArrowRight,
  MapPinned
} from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/LocationModal.css";

function LocationModal({ isOpen, onClose }) {
  const { deliveryLocation, updateDeliveryLocation, savedAddresses = [], showToast } =
    useContext(CartContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (loc) => {
    updateDeliveryLocation(loc);
    onClose();
  };

  const handleCustomSearchSelect = (queryText) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    const newLoc = {
      tag: "Delivery Location",
      iconType: "gps",
      address: trimmed,
      city: trimmed.includes(",") ? trimmed.split(",").slice(-1)[0].trim() : trimmed,
      pincode: ""
    };
    updateDeliveryLocation(newLoc);
    setSearchQuery("");
    onClose();
  };

  const handleGpsLocate = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const addressParts = data.address || {};
            const area =
              addressParts.suburb ||
              addressParts.neighbourhood ||
              addressParts.road ||
              addressParts.city_district ||
              "Current Location";
            const city =
              addressParts.city ||
              addressParts.town ||
              addressParts.state_district ||
              addressParts.state ||
              "Detected City";
            const pincode = addressParts.postcode || "";

            const liveLoc = {
              tag: "Current Location",
              iconType: "gps",
              address: area,
              city: city,
              pincode: pincode
            };
            updateDeliveryLocation(liveLoc);
            showToast(`Location detected: ${area}, ${city}`, "success");
            setIsLocating(false);
            onClose();
          } catch {
            const fallbackLoc = {
              tag: "Current Location",
              iconType: "gps",
              address: `GPS Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
              city: "Current Location",
              pincode: ""
            };
            updateDeliveryLocation(fallbackLoc);
            showToast("Location detected via GPS!", "success");
            setIsLocating(false);
            onClose();
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setIsLocating(false);
          const defaultGps = {
            tag: "Current Location",
            iconType: "gps",
            address: "Current Detected Location",
            city: "Your Area",
            pincode: ""
          };
          updateDeliveryLocation(defaultGps);
          showToast("Location set to Current Location", "info");
          onClose();
        },
        { timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      showToast("Geolocation is not supported by your browser", "error");
    }
  };

  const filteredAddresses = (savedAddresses || []).filter((addr) => {
    const full = `${addr.fullName || ""} ${addr.houseFlat || ""} ${addr.street || ""} ${addr.city || ""} ${addr.state || ""} ${addr.pincode || ""} ${addr.tag || ""}`.toLowerCase();
    return full.includes(searchQuery.toLowerCase());
  });

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

        <form
          className="location-search-input-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              handleCustomSearchSelect(searchQuery);
            }
          }}
        >
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search for area, street, landmark, pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </form>

        <button
          className={`gps-locate-btn ${isLocating ? "locating" : ""}`}
          onClick={handleGpsLocate}
          disabled={isLocating}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <span className="gps-icon">
            <Crosshair size={20} color="#ff4757" />
          </span>
          <div className="gps-text">
            <strong>{isLocating ? "Detecting location..." : "Use Current Location"}</strong>
            <small>Using GPS for 15-minute quick delivery</small>
          </div>
        </button>

        {searchQuery.trim() && (
          <div className="search-result-suggestion" style={{ marginBottom: "16px" }}>
            <div className="location-section-title">Search Result</div>
            <div
              className="location-item custom-search-item"
              onClick={() => handleCustomSearchSelect(searchQuery)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderRadius: "12px",
                border: "1.5px solid #ff5200",
                background: "#fffaf7",
                cursor: "pointer"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Navigation size={18} color="#ff5200" />
                <div>
                  <strong style={{ fontSize: "14px", color: "#1e293b", display: "block" }}>
                    Deliver to &quot;{searchQuery.trim()}&quot;
                  </strong>
                  <small style={{ color: "#64748b" }}>Click or press Enter to set as location</small>
                </div>
              </div>
              <ArrowRight size={16} color="#ff5200" />
            </div>
          </div>
        )}

        <div className="location-section-title">
          {savedAddresses.length > 0 ? "Saved Addresses" : "Delivery Address"}
        </div>

        <div className="saved-locations-list">
          {savedAddresses.length > 0 ? (
            filteredAddresses.map((addr) => {
              const addrText = `${addr.houseFlat ? addr.houseFlat + ", " : ""}${addr.street || ""}`;
              const cityText = `${addr.city || ""}${addr.state ? ", " + addr.state : ""}`;
              const isSelected =
                deliveryLocation.address === addrText ||
                (deliveryLocation.tag === addr.tag && deliveryLocation.city === cityText);

              return (
                <div
                  className={`location-item ${isSelected ? "selected" : ""}`}
                  key={addr.id}
                  onClick={() =>
                    handleSelect({
                      tag: addr.tag || "Home",
                      iconType:
                        addr.tag?.toLowerCase() === "work"
                          ? "work"
                          : addr.tag?.toLowerCase() === "home"
                          ? "home"
                          : "pin",
                      address: addrText,
                      city: cityText,
                      pincode: addr.pincode || ""
                    })
                  }
                >
                  <span
                    className="loc-emoji"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {addr.tag?.toLowerCase() === "home" ? (
                      <Home size={18} color="#ff4757" />
                    ) : addr.tag?.toLowerCase() === "work" ? (
                      <Briefcase size={18} color="#3b82f6" />
                    ) : (
                      <MapPin size={18} color="#10b981" />
                    )}
                  </span>
                  <div className="loc-info">
                    <div className="loc-tag-row">
                      <strong>{addr.tag || "Saved Address"}</strong>
                      {isSelected && <span className="current-badge">Delivering here</span>}
                    </div>
                    {addrText && <p className="loc-address">{addrText}</p>}
                    <span className="loc-city">
                      {cityText} {addr.pincode ? `• ${addr.pincode}` : ""}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="empty-saved-addresses"
              style={{
                textAlign: "center",
                padding: "24px 16px",
                background: "#f8fafc",
                borderRadius: "14px",
                border: "1px dashed #cbd5e1"
              }}
            >
              <MapPinned size={32} color="#94a3b8" style={{ margin: "0 auto 8px" }} />
              <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                No saved addresses
              </p>
              <small style={{ color: "#94a3b8", fontSize: "12.5px" }}>
                Use current location or search above to set your delivery destination.
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationModal;

