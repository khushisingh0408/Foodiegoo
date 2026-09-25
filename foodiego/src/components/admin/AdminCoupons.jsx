import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  TicketPercent,
  PlusCircle,
  Trash2,
  RefreshCw,
  X,
  CheckCircle2,
  Tag,
  Clock,
  Calendar
} from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percent",
    discount_value: "",
    min_order_amount: "199",
    max_discount_amount: "150",
    expiry_date: "2026-12-31"
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/coupons");
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleToggleCoupon = async (coupon) => {
    try {
      const res = await api.patch(`/admin/coupons/${coupon.id}/toggle`);
      if (res.success) {
        setCoupons(prev =>
          prev.map(c => c.id === coupon.id ? { ...c, is_active: res.is_active } : c)
        );
        showToast(res.message);
      }
    } catch (err) {
      console.error("Toggle error:", err);
      showToast("Failed to toggle coupon status", true);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await api.delete(`/admin/coupons/${id}`);
      if (res.success) {
        setCoupons(prev => prev.filter(c => c.id !== id));
        showToast("Coupon deleted.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("Failed to delete coupon", true);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.discount_value) {
      showToast("Please provide coupon code and discount value", true);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        code: formData.code.trim().toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_amount: Number(formData.min_order_amount) || 0,
        max_discount_amount: Number(formData.max_discount_amount) || 500,
        expiry_date: formData.expiry_date
      };

      const res = await api.post("/admin/coupons", payload);
      if (res.success && res.coupon) {
        setCoupons(prev => [res.coupon, ...prev]);
        showToast(`Coupon '${payload.code}' created successfully!`);
        setModalOpen(false);
        setFormData({
          code: "",
          discount_type: "percent",
          discount_value: "",
          min_order_amount: "199",
          max_discount_amount: "150",
          expiry_date: "2026-12-31"
        });
      } else {
        showToast(res.message || "Failed to create coupon", true);
      }
    } catch (err) {
      console.error("Create coupon error:", err);
      showToast("Error creating coupon", true);
    } finally {
      setSaving(false);
    }
  };

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

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Coupons & Promotional Discounts
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
            Generate promo codes for campaigns, set minimum basket value, and configure expiry dates.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="admin-btn admin-btn-primary">
          <PlusCircle size={18} />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Min Order</th>
              <th>Max Cap</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                  <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                  <div>Loading coupon codes...</div>
                </td>
              </tr>
            ) : coupons.length > 0 ? (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Tag size={16} color="#ff6b00" />
                      <span style={{ fontWeight: 800, color: "#0f172a", letterSpacing: "0.5px", background: "#fff7ed", border: "1px dashed #fdba74", padding: "4px 10px", borderRadius: "6px" }}>
                        {c.code}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: "#059669" }}>
                      {c.discount_type === "percent" ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT OFF`}
                    </span>
                  </td>
                  <td>₹{c.min_order_amount}</td>
                  <td>{c.discount_type === "percent" ? `₹${c.max_discount_amount}` : "N/A"}</td>
                  <td>
                    <div style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Calendar size={12} /> {c.expiry_date || "No Expiry"}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={c.is_active === 1}
                          onChange={() => handleToggleCoupon(c)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: c.is_active === 1 ? "#10b981" : "#ef4444" }}>
                        {c.is_active === 1 ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="admin-icon-btn"
                      style={{ color: "#ef4444" }}
                      title="Delete Coupon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <TicketPercent size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>No active coupons found</div>
                  <div style={{ fontSize: "0.82rem", marginTop: "4px" }}>Click 'Create New Coupon' to launch a discount deal.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "520px" }}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">Create Promo Code</div>
              <button className="admin-toggle-btn" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group full-width">
                  <label>Coupon Code (All Caps) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FOODIE50"
                    style={{ textTransform: "uppercase", fontWeight: 700 }}
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  >
                    <option value="percent">Percentage (% OFF)</option>
                    <option value="flat">Flat Amount (₹ OFF)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    required
                    placeholder={formData.discount_type === "percent" ? "e.g. 20 (for 20%)" : "e.g. 50 (for ₹50)"}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Min. Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 199"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full-width">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? "Generating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
