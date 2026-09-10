import { useContext } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { CartContext } from "../context/CartContext";
import "../css/Toast.css";

function Toast() {
  const { toast } = useContext(CartContext);

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type || "success"}`}>
      <div className="toast-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        {toast.type === "error" ? (
          <AlertTriangle size={18} color="#ef4444" />
        ) : toast.type === "info" ? (
          <Info size={18} color="#3b82f6" />
        ) : (
          <CheckCircle2 size={18} color="#10b981" />
        )}
      </div>
      <div className="toast-message">{toast.message}</div>
    </div>
  );
}

export default Toast;
