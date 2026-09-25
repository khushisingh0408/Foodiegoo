import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminRoute({ children }) {
  const { user, isLoggedIn, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        gap: "1rem",
        color: "#ff6b00"
      }}>
        <Loader2 size={40} className="spin-animation" style={{ animation: "spin 1s linear infinite" }} />
        <p style={{ fontWeight: 600, color: "#4b5563" }}>Verifying Administrator Credentials...</p>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location, message: "Please sign in as Admin to access the management portal." }} replace />;
  }

  // Logged in but not an admin -> show Access Denied screen
  if (user?.role !== "admin") {
    return (
      <div style={{
        maxWidth: "600px",
        margin: "4rem auto",
        padding: "2.5rem",
        textAlign: "center",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid #fee2e2"
      }}>
        <div style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "#fee2e2",
          color: "#ef4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <ShieldAlert size={38} />
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1f2937", marginBottom: "0.75rem" }}>
          Administrator Access Required
        </h2>
        <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Your current account (<strong>{user?.email}</strong>) does not have administrative privileges to view this portal.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              background: "#ff6b00",
              color: "#ffffff",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(255, 107, 0, 0.25)"
            }}
          >
            Back to Storefront
          </a>
          <a
            href="/login"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: 600,
              textDecoration: "none"
            }}
          >
            Switch to Admin Account
          </a>
        </div>
      </div>
    );
  }

  return children;
}
