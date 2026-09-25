import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  DollarSign,
  ShoppingBag,
  Flame,
  Users,
  UtensilsCrossed,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  TicketPercent,
  RefreshCw,
  Eye
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async (isQuiet = false) => {
    try {
      if (!isQuiet) setRefreshing(true);
      const res = await api.get("/admin/stats");
      if (res.success && res.stats) {
        setStats(res.stats);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      if (!isQuiet) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchStats(false);

    // Auto-polling every 6 seconds for live real-time metrics
    const interval = setInterval(() => {
      fetchStats(true);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0", color: "#ff6b00" }}>
        <RefreshCw size={36} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ fontWeight: 600, color: "#64748b" }}>Loading Executive Dashboard...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    activeOrders = 0,
    totalCustomers = 0,
    totalFoods = 0,
    statusCounts = [],
    topFoods = [],
    recentOrders = [],
    weeklyTrend = []
  } = stats || {};

  const maxWeeklyRev = Math.max(...weeklyTrend.map(d => d.revenue), 1);

  return (
    <div>
      {/* Top Banner with Quick Refresh & Add Action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Executive Performance Overview
            </h2>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "20px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              fontSize: "0.76rem",
              fontWeight: 700,
              color: "#059669"
            }}>
              <span style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
                display: "inline-block"
              }} />
              <span>Real-time Live DB (6s)</span>
            </div>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.88rem", marginTop: "4px" }}>
            Live database sync • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => fetchStats(false)}
            disabled={refreshing}
            className="admin-btn admin-btn-secondary"
            title="Refresh Metrics"
          >
            <RefreshCw size={16} className={refreshing ? "spin-animation" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>

          <Link to="/admin/menu" className="admin-btn admin-btn-primary">
            <PlusCircle size={16} />
            <span>Add New Dish</span>
          </Link>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="admin-stats-grid">
        {/* Total Revenue */}
        <div className="admin-stat-card" style={{ "--accent-color": "#ff6b00", "--icon-bg": "rgba(255, 107, 0, 0.1)", "--icon-color": "#ff6b00" }}>
          <div>
            <div className="admin-stat-title">Gross Revenue</div>
            <div className="admin-stat-value">₹{Number(totalRevenue).toLocaleString("en-IN")}</div>
            <div className="admin-stat-subtext">
              <span className="admin-stat-badge-up">
                <ArrowUpRight size={12} /> +18.4%
              </span>
              <span>vs last month</span>
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-stat-card" style={{ "--accent-color": "#3b82f6", "--icon-bg": "rgba(59, 130, 246, 0.1)", "--icon-color": "#3b82f6" }}>
          <div>
            <div className="admin-stat-title">Total Orders Placed</div>
            <div className="admin-stat-value">{totalOrders}</div>
            <div className="admin-stat-subtext">
              <span className="admin-stat-badge-up" style={{ color: "#3b82f6", background: "#eff6ff" }}>
                <CheckCircle2 size={12} /> All Time
              </span>
              <span>orders fulfilled</span>
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Active Kitchen Orders */}
        <div className="admin-stat-card" style={{ "--accent-color": "#ef4444", "--icon-bg": "rgba(239, 68, 68, 0.1)", "--icon-color": "#ef4444" }}>
          <div>
            <div className="admin-stat-title">Live Kitchen Queue</div>
            <div className="admin-stat-value">{activeOrders}</div>
            <div className="admin-stat-subtext">
              <span className="admin-stat-badge-up" style={{ color: "#ef4444", background: "#fef2f2" }}>
                <Flame size={12} /> Processing Now
              </span>
              <span>needs attention</span>
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <Flame size={24} />
          </div>
        </div>

        {/* Total Customers */}
        <div className="admin-stat-card" style={{ "--accent-color": "#10b981", "--icon-bg": "rgba(16, 185, 129, 0.1)", "--icon-color": "#10b981" }}>
          <div>
            <div className="admin-stat-title">Registered Customers</div>
            <div className="admin-stat-value">{totalCustomers}</div>
            <div className="admin-stat-subtext">
              <span className="admin-stat-badge-up">
                <Users size={12} /> Active
              </span>
              <span>in database</span>
            </div>
          </div>
          <div className="admin-stat-icon-wrap">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Middle Row: Revenue Chart & Order Status Breakdown */}
      <div className="admin-charts-grid">
        {/* Weekly Revenue Trend Bar Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <TrendingUp size={20} color="#ff6b00" />
              <span>Weekly Sales Performance (₹)</span>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>Last 7 Days</span>
          </div>

          <div className="admin-trend-chart">
            {weeklyTrend.map((item, idx) => {
              const heightPercent = Math.max(15, Math.round((item.revenue / maxWeeklyRev) * 100));
              return (
                <div key={idx} className="admin-chart-col">
                  <span className="admin-chart-val">₹{item.revenue}</span>
                  <div className="admin-chart-bar-wrap">
                    <div
                      className="admin-chart-bar"
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.day}: ₹${item.revenue} (${item.orders} orders)`}
                    />
                  </div>
                  <span className="admin-chart-label">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.82rem", color: "#64748b" }}>
            <span>Peak Day: <strong>Sunday (₹14,200)</strong></span>
            <span>Average Order Value: <strong>₹360</strong></span>
          </div>
        </div>

        {/* Order Status Breakdown / Quick Actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Clock size={20} color="#3b82f6" />
              <span>Order Status Distribution</span>
            </div>
            <Link to="/admin/orders" style={{ fontSize: "0.8rem", color: "#ff6b00", fontWeight: 700, textDecoration: "none" }}>
              View All
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", margin: "auto 0" }}>
            {statusCounts.length > 0 ? (
              statusCounts.map((s, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background:
                          s.status === "Delivered" ? "#10b981" :
                          s.status === "Preparing" ? "#f59e0b" :
                          s.status === "Out for Delivery" ? "#8b5cf6" :
                          s.status === "Cancelled" ? "#ef4444" : "#3b82f6"
                      }}
                    />
                    <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "#334155" }}>{s.status}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: "#0f172a" }}>{s.count} orders</span>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", textAlign: "center", padding: "1rem" }}>No orders placed yet</div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <Link to="/admin/orders" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "0.5rem" }}>
              <ShoppingBag size={14} /> Live Orders
            </Link>
            <Link to="/admin/coupons" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "0.5rem" }}>
              <TicketPercent size={14} /> Add Coupon
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Stream & Top Selling Items */}
      <div className="admin-charts-grid">
        {/* Recent Orders Table */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <ShoppingBag size={20} color="#ff6b00" />
              <span>Recent Orders Stream</span>
            </div>
            <Link to="/admin/orders" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>
              <span>View All</span>
            </Link>
          </div>

          <div className="admin-table-container" style={{ border: "none", boxShadow: "none" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: 800, color: "#ff6b00" }}>#{order.id}</td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{order.customerName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{order.customerMobile}</div>
                      </td>
                      <td style={{ fontWeight: 800 }}>₹{order.total}</td>
                      <td>
                        <span className={`status-pill ${
                          order.status === "Delivered" ? "status-delivered" :
                          order.status === "Preparing" ? "status-preparing" :
                          order.status === "Out for Delivery" ? "status-out" :
                          order.status === "Cancelled" ? "status-cancelled" : "status-placed"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/admin/orders" className="admin-icon-btn" title="View Order Details">
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#94a3b8", padding: "2rem" }}>
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Foods */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <UtensilsCrossed size={20} color="#f59e0b" />
              <span>Top-Selling Dishes</span>
            </div>
            <Link to="/admin/menu" style={{ fontSize: "0.8rem", color: "#ff6b00", fontWeight: 700, textDecoration: "none" }}>
              Menu ({totalFoods})
            </Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {topFoods.length > 0 ? (
              topFoods.map((food, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.75rem" }}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#1e293b" }}>{food.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{food.price}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: 800, color: "#10b981", fontSize: "0.9rem" }}>{food.totalSold} sold</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>
                Top foods will show as customers place orders.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
