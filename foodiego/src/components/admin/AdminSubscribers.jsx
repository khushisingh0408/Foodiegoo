import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Mail,
  Download,
  Trash2,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Calendar,
  User
} from "lucide-react";

export default function AdminSubscribers() {
  const [activeTab, setActiveTab] = useState("subscribers"); // 'subscribers' | 'contacts'
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "subscribers") {
        const res = await api.get("/admin/subscribers");
        if (res.success && res.subscribers) {
          setSubscribers(res.subscribers);
        }
      } else {
        const res = await api.get("/admin/contacts");
        if (res.success && res.contacts) {
          setContacts(res.contacts);
        }
      }
    } catch (err) {
      console.error("Failed to load subscriber data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm("Remove this email subscriber?")) return;
    try {
      const res = await api.delete(`/admin/subscribers/${id}`);
      if (res.success) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        showToast("Subscriber removed.");
      }
    } catch (err) {
      console.error("Delete subscriber error:", err);
      showToast("Failed to delete subscriber", true);
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Remove this message?")) return;
    try {
      const res = await api.delete(`/admin/contacts/${id}`);
      if (res.success) {
        setContacts(prev => prev.filter(c => c.id !== id));
        showToast("Message removed.");
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      showToast("Failed to delete message", true);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      showToast("No subscribers to export.", true);
      return;
    }
    const headers = "ID,Email,SubscribedDate\n";
    const rows = subscribers.map(s => `${s.id},"${s.email}","${s.created_at}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `foodiego_subscribers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Subscribers list exported as CSV!");
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
            Audience Communications & Support
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
            Manage newsletter subscribers, export audience data, and review incoming contact inquiries.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          {activeTab === "subscribers" && (
            <button onClick={exportCSV} className="admin-btn admin-btn-secondary">
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          )}

          <button onClick={fetchData} disabled={loading} className="admin-btn admin-btn-secondary">
            <RefreshCw size={16} className={loading ? "spin-animation" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-table-controls">
        <div className="admin-filter-tabs">
          <button
            onClick={() => setActiveTab("subscribers")}
            className={`admin-filter-btn ${activeTab === "subscribers" ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Mail size={15} />
            <span>Newsletter Subscribers ({subscribers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`admin-filter-btn ${activeTab === "contacts" ? "active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <MessageSquare size={15} />
            <span>Customer Inquiries ({contacts.length})</span>
          </button>
        </div>
      </div>

      {/* Subscribers Tab Table */}
      {activeTab === "subscribers" && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Subscriber ID</th>
                <th>Email Address</th>
                <th>Subscribed On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                    <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                    <div>Loading subscribers...</div>
                  </td>
                </tr>
              ) : subscribers.length > 0 ? (
                subscribers.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 800, color: "#64748b" }}>#{s.id}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#0f172a" }}>
                        <Mail size={16} color="#ff6b00" />
                        <span>{s.email}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.82rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Calendar size={12} /> {new Date(s.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteSubscriber(s.id)}
                        className="admin-icon-btn"
                        style={{ color: "#ef4444" }}
                        title="Remove Subscriber"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <Mail size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>No subscribers yet</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Contacts Tab Table */}
      {activeTab === "contacts" && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                    <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                    <div>Loading inquiries...</div>
                  </td>
                </tr>
              ) : contacts.length > 0 ? (
                contacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700 }}>
                        <User size={15} color="#3b82f6" />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{c.email}</span>
                    </td>
                    <td>
                      <div style={{ maxWidth: "350px", fontSize: "0.85rem", color: "#334155", lineHeight: 1.4 }}>
                        {c.message}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: "0.82rem", color: "#64748b" }}>
                        {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteContact(c.id)}
                        className="admin-icon-btn"
                        style={{ color: "#ef4444" }}
                        title="Delete Inquiry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                    <MessageSquare size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, fontSize: "1rem" }}>No customer inquiries</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
