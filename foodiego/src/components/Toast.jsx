import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../css/Toast.css";

function Toast() {
  const { toast } = useContext(CartContext);

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type || "success"}`}>
      <div className="toast-icon">
        {toast.type === "error" ? "⚠️" : toast.type === "info" ? "💡" : "✅"}
      </div>
      <div className="toast-message">{toast.message}</div>
    </div>
  );
}

export default Toast;
