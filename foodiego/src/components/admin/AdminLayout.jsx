import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import "../../css/AdminLayout.css";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  TicketPercent,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Utensils,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);

  // Poll / fetch active orders count for live indicator in real-time
  useEffect(() => {
    async function fetchActiveCount() {
      try {
        const res = await api.get("/admin/stats");
        if (res.success && res.stats) {
          setActiveOrdersCount(res.stats.activeOrders || 0);
        }
      } catch (err) {
        console.warn("Failed to fetch admin active orders count:", err);
      }
    }

    fetchActiveCount();
    const timer = setInterval(fetchActiveCount, 5000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { title: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} />, exact: true },
    { title: "Live Orders", path: "/admin/orders", icon: <ShoppingBag size={20} />, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { title: "Menu / Dishes", path: "/admin/menu", icon: <UtensilsCrossed size={20} /> },
    { title: "Customers", path: "/admin/users", icon: <Users size={20} /> },
    { title: "Coupons & Offers", path: "/admin/coupons", icon: <TicketPercent size={20} /> },
    { title: "Subscribers", path: "/admin/subscribers", icon: <Mail size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const current = navItems.find(item => item.path === location.pathname);
    return current ? current.title : "Admin Management";
  };

  return (
    <div className="admin-container">
      {/* Sidebar Overlay on mobile */}
      {mobileOpen && (
        <div
          className="admin-modal-overlay"
          style={{ zIndex: 9998 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="admin-sidebar-header">
          {!collapsed ? (
            <Link to="/admin" className="admin-brand">
              <div className="admin-brand-icon">
                <Utensils size={22} />
              </div>
              <div className="admin-brand-text">
                Foodie<span>Go</span>
                <span className="admin-brand-badge">Admin</span>
              </div>
            </Link>
          ) : (
            <div className="admin-brand-icon" style={{ margin: "0 auto" }}>
              <Utensils size={20} />
            </div>
          )}

          <button
            className="admin-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
            style={{ display: window.innerWidth < 992 ? "none" : "flex" }}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile close button */}
          <button
            className="admin-toggle-btn"
            onClick={() => setMobileOpen(false)}
            style={{ display: window.innerWidth < 992 ? "flex" : "none" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="admin-sidebar-nav">
          {!collapsed && <div className="admin-nav-section-title">Main Menu</div>}
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.title : ""}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
                {!collapsed && item.badge !== null && item.badge !== undefined && (
                  <span className="admin-nav-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-store-link" title="Open Storefront">
            <ExternalLink size={16} />
            {!collapsed && <span>View Storefront</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="admin-store-link"
            style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)" }}
            title="Logout"
          >
            <LogOut size={16} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="admin-main">
        {/* Header Bar */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: window.innerWidth < 992 ? "flex" : "none" }}
            >
              <Menu size={20} />
            </button>

            <div className="admin-page-title-wrap">
              <h1>{getPageTitle()}</h1>
              <div className="admin-breadcrumbs">
                <span>FoodieGo</span> • <span>Admin Portal</span> • <span style={{ color: "#ff6b00" }}>{getPageTitle()}</span>
              </div>
            </div>
          </div>

          <div className="admin-header-right">
            <div className="admin-live-badge">
              <span className="admin-live-dot"></span>
              <span>Kitchen Live</span>
            </div>

            <div className="admin-profile-pill">
              <div className="admin-avatar">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="admin-profile-info" style={{ display: window.innerWidth < 640 ? "none" : "block" }}>
                <div className="admin-profile-name">{user?.name || "Admin"}</div>
                <div className="admin-profile-role">{user?.role || "Administrator"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Child Views */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
