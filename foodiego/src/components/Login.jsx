import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  UtensilsCrossed,
  Package,
  LogOut,
  Lock,
  Sparkles,
  Zap
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();
  const { login, register, isLoggedIn, user, logout } = useContext(AuthContext);

  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillDemo = () => {
    setEmail("demo@foodiego.com");
    setPassword("password123");
    setIsRegisterMode(false);
    setMessage("Demo credentials filled! Click 'Login' to continue.");
    setIsError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setMessage("Please fill Name, Email, and Password.");
        setIsError(true);
        return;
      }

      setIsSubmitting(true);
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      setIsSubmitting(false);

      if (res.success) {
        setMessage("Account created & saved in SQL database! Redirecting...");
        setIsError(false);
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMessage(res.message || "Registration failed.");
        setIsError(true);
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setMessage("Please enter your email and password.");
        setIsError(true);
        return;
      }

      setIsSubmitting(true);
      const res = await login(email.trim(), password.trim());
      setIsSubmitting(false);

      if (res.success) {
        setMessage("Welcome back! Login successful");
        setIsError(false);
        setTimeout(() => navigate("/"), 1200);
      } else {
        setMessage(res.message || "Invalid email or password.");
        setIsError(true);
      }
    }
  };

  if (isLoggedIn && user) {
    return (
      <section className="login-page">
        <div className="login-box logged-in-box">
          <div className="avatar-circle" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={32} color="#ff4757" />
          </div>
          <h2>Welcome, {user.name}!</h2>
          <p className="user-email" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <Mail size={15} color="#64748b" /> {user.email}
          </p>
          {user.phone && (
            <p className="user-detail" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Phone size={14} color="#64748b" /> {user.phone}
            </p>
          )}
          {user.address && (
            <p className="user-detail" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <MapPin size={14} color="#64748b" /> {user.address}
            </p>
          )}

          <div className="account-actions">
            <button className="primary-btn" onClick={() => navigate("/")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <UtensilsCrossed size={16} /> Explore Menu
            </button>
            <button className="primary-btn orders-btn" onClick={() => navigate("/orders")} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Package size={16} /> My Orders
            </button>
            <button className="logout-btn" onClick={logout} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="login-page">
      <div className="login-box">
        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegisterMode ? "active" : ""}`}
            onClick={() => {
              setIsRegisterMode(false);
              setMessage("");
            }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <Lock size={14} /> Login
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegisterMode ? "active" : ""}`}
            onClick={() => {
              setIsRegisterMode(true);
              setMessage("");
            }}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
          >
            <Sparkles size={14} /> Sign Up
          </button>
        </div>

        <h1>{isRegisterMode ? "Create Account" : "Welcome Back"}</h1>
        <p className="auth-subtitle">
          {isRegisterMode
            ? "Sign up to track orders & save your favorites permanently in SQL DB."
            : "Login with your permanent FoodieGo account."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegisterMode && (
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isRegisterMode}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="e.g. you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegisterMode && (
            <>
              <div className="form-group">
                <label>Mobile Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Delivery Address (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Pandri, Raipur"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isRegisterMode
              ? "Create Account"
              : "Login"}
          </button>

          {!isRegisterMode && (
            <button
              type="button"
              className="demo-btn"
              onClick={fillDemo}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
            >
              <Zap size={14} color="#f59e0b" fill="#f59e0b" /> Fill Demo Account (demo@foodiego.com)
            </button>
          )}
        </form>

        {message && (
          <div className={`auth-alert ${isError ? "error" : "success"}`}>
            {message}
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;