import { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "../css/MobileBottomNav.css";

function MobileBottomNav() {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const location = useLocation();

  const totalCartItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Hide on checkout or tracking screens if desired, or keep everywhere
  const isMinimalScreen = location.pathname.startsWith("/checkout");
  if (isMinimalScreen) return null;

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => `m-nav-item ${isActive ? "active" : ""}`} end>
        <span className="m-nav-icon">🏠</span>
        <span className="m-nav-label">Home</span>
      </NavLink>

      <NavLink to="/shop" className={({ isActive }) => `m-nav-item ${isActive ? "active" : ""}`}>
        <span className="m-nav-icon">📂</span>
        <span className="m-nav-label">Categories</span>
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => `m-nav-item ${isActive ? "active" : ""}`}>
        <span className="m-nav-icon">🔍</span>
        <span className="m-nav-label">Search</span>
      </NavLink>

      <NavLink to="/wishlist" className={({ isActive }) => `m-nav-item ${isActive ? "active" : ""}`}>
        <div className="m-nav-icon-wrap">
          <span className="m-nav-icon">❤️</span>
          {wishlist.length > 0 && <span className="m-nav-badge">{wishlist.length}</span>}
        </div>
        <span className="m-nav-label">Wishlist</span>
      </NavLink>

      <NavLink to="/account" className={({ isActive }) => `m-nav-item ${isActive ? "active" : ""}`}>
        <span className="m-nav-icon">👤</span>
        <span className="m-nav-label">Account</span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;
