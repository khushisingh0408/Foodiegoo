import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, X, Plus, Clock, Star, ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/CompareDrawer.css";

function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useContext(CartContext);
  const [isOpenModal, setIsOpenModal] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="compare-floating-bar">
        <div className="compare-bar-content">
          <div className="compare-thumbs-row">
            {compareList.map((item) => (
              <div className="compare-thumb-box" key={item.id}>
                <img src={item.image} alt={item.name} />
                <button
                  className="remove-compare-btn"
                  onClick={() => removeFromCompare(item.id)}
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {Array.from({ length: 4 - compareList.length }).map((_, i) => (
              <div className="compare-slot-empty" key={i}>
                <span>+ Slot</span>
              </div>
            ))}
          </div>

          <div className="compare-actions-row">
            <button className="open-compare-btn" onClick={() => setIsOpenModal(true)}>
              <SlidersHorizontal size={14} className="inline-icon" /> Compare ({compareList.length}/4)
            </button>
            <button className="clear-compare-btn" onClick={clearCompare}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Full Comparison Modal */}
      {isOpenModal && (
        <div className="compare-modal-overlay" onClick={() => setIsOpenModal(false)}>
          <div className="compare-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="compare-modal-header">
              <h2>Product Comparison ({compareList.length} Items)</h2>
              <button className="modal-close-btn" onClick={() => setIsOpenModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    {compareList.map((item) => (
                      <th key={item.id} className="item-header-cell">
                        <button
                          className="table-remove-btn"
                          onClick={() => removeFromCompare(item.id)}
                        >
                          <X size={12} className="inline-icon" /> Remove
                        </button>
                        <img src={item.image} alt={item.name} className="compare-table-img" />
                        <Link to={`/product/${item.id}`} onClick={() => setIsOpenModal(false)}>
                          <h4>{item.name}</h4>
                        </Link>
                        <span className="compare-price">{item.price}</span>
                        {item.mrp && <del className="compare-mrp">{item.mrp}</del>}
                        <button
                          className="table-add-btn"
                          onClick={() => addToCart(item)}
                        >
                          <Plus size={13} className="inline-icon" /> Add to Cart
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="row-label">Brand</td>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.brand || item.restaurantName}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Category</td>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.category} ({item.subCategory || "General"})</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Dietary Type</td>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        {item.isVeg ? (
                          <span className="veg-badge-pill">
                            <span className="diet-indicator-dot veg" /> 100% Pure Veg
                          </span>
                        ) : (
                          <span className="nonveg-badge-pill">
                            <span className="diet-indicator-dot non-veg" /> Non-Veg
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Rating</td>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        <strong>
                          <Star size={12} fill="#ca8a04" color="#ca8a04" className="inline-icon" /> {item.ratingScore || 4.8}
                        </strong>{" "}
                        ({item.ratingCount || "1k+"} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Prep / Delivery Time</td>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        <Clock size={12} className="inline-icon" /> {item.prepTime || "20 mins"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Calories & Portion</td>
                    {compareList.map((item) => (
                      <td key={item.id}>
                        {item.calories || "300 kcal"}
                        <small className="block-detail">{item.specifications?.servingSize || "1-2 persons"}</small>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Allergens</td>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.specifications?.allergens || "Dairy, Gluten"}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="row-label">Spice Level</td>
                    {compareList.map((item) => (
                      <td key={item.id}>{item.specifications?.spiceLevel || "Medium"}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompareDrawer;
