import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  RefreshCw,
  Phone,
  Mail,
  ShoppingBag,
  CheckCircle2,
  Calendar
} from "lucide-react";

export default function AdminUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "customer" : "admin";
    if (Number(targetUser.id) === Number(currentUser?.id) && newRole !== "admin") {
      showToast("You cannot demote your own active account.", true);
      return;
    }

    try {
      setUpdatingId(targetUser.id);
      const res = await api.patch(`/admin/users/${targetUser.id}/role`, { role: newRole });
      if (res.success) {
        setUsers(prev =>
          prev.map(u => u.id === targetUser.id ? { ...u, role: newRole } : u)
        );
        showToast(`${targetUser.name} is now an ${newRole.toUpperCase()}!`);
      } else {
        showToast(res.message || "Failed to update role", true);
      }
    } catch (err) {
      console.error("Role update error:", err);
      showToast("Error updating user role", true);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#0f172a",
          color: "#fff",
          padding: "0.85rem 1.4rem",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Customer & Account Directory
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
            View registered foodies, track customer lifetime spend, and manage team permissions.
          </p>
        </div>

        <button onClick={fetchUsers} disabled={loading} className="admin-btn admin-btn-secondary">
          <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {/* Search */}
      <div className="admin-table-controls">
        <div className="admin-search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search customers by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
          Showing <strong>{filteredUsers.length}</strong> registered users
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer Details</th>
              <th>Contact Info</th>
              <th>Orders Placed</th>
              <th>Lifetime Spend</th>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                  <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                  <div>Loading user directory...</div>
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div className="admin-avatar" style={{ background: u.role === "admin" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "linear-gradient(135deg, #ff6b00, #f59e0b)" }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{u.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Calendar size={11} /> Joined {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.82rem", color: "#334155", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Mail size={12} color="#64748b" /> {u.email}
                    </div>
                    {u.phone && (
                      <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "2px" }}>
                        <Phone size={12} /> {u.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700 }}>
                      <ShoppingBag size={14} color="#ff6b00" />
                      <span>{u.totalOrders || 0} orders</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: "#10b981", fontSize: "0.95rem" }}>
                      ₹{Number(u.totalSpent || 0).toLocaleString("en-IN")}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.76rem",
                      fontWeight: 800,
                      background: u.role === "admin" ? "rgba(139, 92, 246, 0.12)" : "rgba(16, 185, 129, 0.12)",
                      color: u.role === "admin" ? "#7c3aed" : "#059669",
                      border: u.role === "admin" ? "1px solid #ddd6fe" : "1px solid #a7f3d0",
                      textTransform: "uppercase"
                    }}>
                      {u.role === "admin" ? <ShieldCheck size={13} /> : <Shield size={13} />}
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={updatingId === u.id || Number(u.id) === Number(currentUser?.id)}
                      className="admin-btn admin-btn-secondary"
                      style={{ fontSize: "0.76rem", padding: "0.35rem 0.75rem" }}
                      title={u.role === "admin" ? "Demote to Customer" : "Promote to Admin"}
                    >
                      {u.role === "admin" ? "Demote to Customer" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <Users size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>No users found matching query</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
