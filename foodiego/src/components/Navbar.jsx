import "../css/Navbar.css";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="logo">
        <h2>🍔 FoodieGo</h2>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

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
          <Link to="/" onClick={closeMenu}>
            About
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

      </ul>

      {isLoggedIn ? (
        <button
          className="login-btn"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            setIsLoggedIn(false);
            closeMenu();
          }}
        >
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          className="login-btn"
          onClick={closeMenu}
        >
          Login
        </Link>
      )}

    </nav>
  );
}

export default Navbar;