import "../css/Navbar.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link" onClick={closeMenu}>
        <div className="logo">
          <h2>🍔 FoodieGo</h2>
        </div>
      </Link>

      <div className="nav-right-container">
        {/* Quick mobile badges for cart & wishlist */}
        <div className="mobile-quick-actions">
          <Link to="/wishlist" className="mobile-icon-btn" onClick={closeMenu} aria-label="Wishlist">
            ❤️ {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="mobile-icon-btn" onClick={closeMenu} aria-label="Cart">
            🛒 {cart.length > 0 && <span className="badge">{cart.length}</span>}
          </Link>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>

        <li>
          <Link to="/" onClick={closeMenu}>
            Menu
          </Link>
        </li>

        <li>
          <Link to="/cart" onClick={closeMenu}>
            Cart 🛒 ({cart.length})
          </Link>
        </li>

        <li>
          <Link to="/wishlist" onClick={closeMenu}>
            Wishlist ❤️ ({wishlist.length})
          </Link>
        </li>

        <li>
          <Link to="/orders" onClick={closeMenu}>
            My Orders 📦
          </Link>
        </li>

        <li className="mobile-login-item">
          {isLoggedIn ? (
            <button
              className="login-btn mobile-full-btn"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Logout ({user?.name ? user.name.split(" ")[0] : "User"})
            </button>
          ) : (
            <Link
              to="/login"
              className="login-btn mobile-full-btn"
              onClick={closeMenu}
            >
              Login
            </Link>
          )}
        </li>
      </ul>

      {/* Desktop Login Button */}
      <div className="desktop-login">
        {isLoggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              to="/login"
              style={{ color: "white", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}
            >
              Hi, {user?.name ? user.name.split(" ")[0] : "User"} 👋
            </Link>
            <button
              className="login-btn"
              onClick={logout}
              style={{ padding: "8px 16px" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;