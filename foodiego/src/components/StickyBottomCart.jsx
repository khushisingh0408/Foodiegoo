import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/StickyBottomCart.css";

function StickyBottomCart() {
  const { cart, finalTotal } = useContext(CartContext);
  const location = useLocation();

  // Don't show on Cart, Checkout, or Order Tracking pages
  if (
    cart.length === 0 ||
    location.pathname === "/cart" ||
    location.pathname === "/checkout" ||
    location.pathname.startsWith("/track")
  ) {
    return null;
  }

  const totalItemsCount = cart.reduce(
    (count, item) => count + (item.quantity || 1),
    0
  );

  return (
    <div className="sticky-bottom-cart-bar">
      <div className="sticky-cart-content">
        <div className="sticky-cart-info">
          <span className="items-count-badge">
            {totalItemsCount} {totalItemsCount === 1 ? "ITEM" : "ITEMS"}
          </span>
          <span className="divider-dot">•</span>
          <span className="sticky-cart-price">₹{finalTotal}</span>
        </div>

        <Link to="/cart" className="view-cart-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <span>View Cart</span>
          <ShoppingBag size={16} />
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default StickyBottomCart;
