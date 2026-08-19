import "../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🍔 FoodieGo</h3>
          <p>
            Your favorite food delivered hot & fresh to your doorstep within minutes.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">My Orders</Link>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 New Delhi, India</p>
          <p>📞 +91 98765 43210</p>
          <p>📧 support@foodiego.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} FoodieGo. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
