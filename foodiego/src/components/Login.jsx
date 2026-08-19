import "../css/Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    setMessage("Login successful! 🎉");
    localStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <section className="login-page">
      <div className="login-box">
        <h1>Login 🔐</h1>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

        {message && (
          <p className="login-message">{message}</p>
        )}
      </div>
    </section>
  );
}

export default Login;