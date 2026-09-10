import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { coupons } from "../data/couponsData";
import "../css/UserAccount.css";

function UserAccount() {
  const { user, isLoggedIn, logout, updateProfile } = useContext(AuthContext);
  const {
    savedAddresses,
    addAddress,
    removeAddress,
    setDefaultAddress,
    returnRequests,
    notifications,
    markAllNotificationsRead,
    addToCart,
    showToast
  } = useContext(CartContext);
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const navigate = useNavigate();

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || "Alex Morgan");
  const [editEmail, setEditEmail] = useState(user?.email || "alex.morgan@foodiego.com");
  const [editPhone, setEditPhone] = useState(user?.phone || "9876543210");
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  // New Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrTag, setNewAddrTag] = useState("Home");
  const [newAddrName, setNewAddrName] = useState(user?.name || "Alex Morgan");
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || "9876543210");
  const [newAddrHouse, setNewAddrHouse] = useState("");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrCity, setNewAddrCity] = useState("Noida");
  const [newAddrState, setNewAddrState] = useState("Uttar Pradesh");
  const [newAddrPin, setNewAddrPin] = useState("201309");

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(350);
  const [addWalletAmount, setAddWalletAmount] = useState("");

  // Orders History
  const [orders, setOrders] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("foodieGoOrders") || "[]");
      if (saved.length > 0) return saved;
      return [
        {
          id: "FGO-8921",
          customerName: "Alex Morgan",
          deliveryAddress: "Flat 402, Sunshine Heights, Sector 62, Noida (Home)",
          paymentMethod: "UPI (Google Pay)",
          total: 598,
          status: "Out for Delivery",
          date: new Date().toISOString(),
          items: [
            { name: "Margherita Pizza (Large)", price: "₹299", quantity: 1 },
            { name: "Peri-Peri Masala Fries", price: "₹149", quantity: 1 },
            { name: "Molten Choco Lava Cake", price: "₹129", quantity: 1 }
          ]
        },
        {
          id: "FGO-7612",
          customerName: "Alex Morgan",
          deliveryAddress: "Tower B, Cyber City, DLF Phase 2, Gurugram (Work)",
          paymentMethod: "Credit Card (Visa •••• 6512)",
          total: 428,
          status: "Delivered",
          date: "2026-09-08T14:30:00.000Z",
          items: [
            { name: "Classic Cheeseburger", price: "₹199", quantity: 1 },
            { name: "Iced Cold Coffee Brew", price: "₹149", quantity: 1 }
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  const totalDeliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered").length;
  const totalSavedWithCoupons = 320;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name: editName, phone: editPhone });
    showToast("Profile information updated successfully! ✓", "success");
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddrHouse || !newAddrStreet || !newAddrPin) {
      showToast("Please fill all required address fields.", "error");
      return;
    }
    addAddress({
      tag: newAddrTag,
      fullName: newAddrName,
      mobile: newAddrPhone,
      houseFlat: newAddrHouse,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPin,
      isDefault: false
    });
    setShowAddressModal(false);
    setNewAddrHouse("");
    setNewAddrStreet("");
  };

  const handleAddMoneyToWallet = (e) => {
    e.preventDefault();
    const num = Number(addWalletAmount);
    if (num > 0) {
      setWalletBalance((prev) => prev + num);
      setAddWalletAmount("");
      showToast(`Added ₹${num} to your FoodieGo Wallet! 🎉`, "success");
    }
  };

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => addToCart(item));
      showToast(`Added ${order.items.length} items to your cart! 🛒`, "success");
      navigate("/cart");
    }
  };

  const menuItems = [
    { id: "overview", label: "Dashboard Overview", icon: "📊" },
    { id: "orders", label: "My Orders & Receipts", icon: "📦", count: orders.length },
    { id: "track", label: "Track Live Orders", icon: "🛵", count: pendingOrders > 0 ? pendingOrders : null },
    { id: "wishlist", label: "Wishlist Favorites", icon: "❤️", count: wishlist.length },
    { id: "addresses", label: "Saved Addresses", icon: "📍", count: savedAddresses.length },
    { id: "payments", label: "Payment & Wallet", icon: "💳" },
    { id: "coupons", label: "Offers & Vouchers", icon: "🎟️" },
    { id: "reviews", label: "My Ratings & Reviews", icon: "⭐" },
    { id: "returns", label: "Returns & Refunds", icon: "🔄", count: returnRequests.length },
    { id: "notifications", label: "Notifications", icon: "🔔", count: notifications.filter((n) => !n.read).length },
    { id: "profile", label: "Profile Settings", icon: "👤" },
    { id: "security", label: "Security & 2FA", icon: "🔒" }
  ];

  return (
    <div className="user-account-page">
      <div className="account-container">
        {/* Left Sidebar Menu */}
        <aside className="account-sidebar">
          {/* User Mini Profile Header */}
          <div className="user-sidebar-header">
            <div className="sidebar-avatar">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="sidebar-user-meta">
              <h3>{user?.name || "Alex Morgan"}</h3>
              <span className="user-tier-badge">⚡ VIP Platinum Foodie</span>
              <small>{user?.email || "alex.morgan@foodiego.com"}</small>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="sidebar-nav-list">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSearchParams({ tab: item.id });
                }}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span className="nav-item-label">{item.label}</span>
                {item.count !== null && item.count !== undefined && item.count > 0 && (
                  <span className="nav-item-count">{item.count}</span>
                )}
              </button>
            ))}

            <button
              className="sidebar-logout-btn"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <span className="nav-item-icon">🚪</span>
              <span>Logout Account</span>
            </button>
          </nav>
        </aside>

        {/* Right Tab Content View */}
        <main className="account-content-main">
          {/* 1. OVERVIEW */}
          {activeTab === "overview" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Account Dashboard 📊</h2>
                <p>Welcome back! Manage your food orders, delivery addresses and wallets.</p>
              </div>

              {/* Metric Cards Grid */}
              <div className="metric-cards-grid">
                <div className="metric-stat-card">
                  <span className="stat-icon">📦</span>
                  <div>
                    <h3>{orders.length}</h3>
                    <small>Total Orders</small>
                  </div>
                </div>

                <div className="metric-stat-card">
                  <span className="stat-icon">🛵</span>
                  <div>
                    <h3 className="orange-stat">{pendingOrders}</h3>
                    <small>Active Deliveries</small>
                  </div>
                </div>

                <div className="metric-stat-card">
                  <span className="stat-icon">✅</span>
                  <div>
                    <h3 className="green-stat">{totalDeliveredOrders}</h3>
                    <small>Completed Meals</small>
                  </div>
                </div>

                <div className="metric-stat-card">
                  <span className="stat-icon">💰</span>
                  <div>
                    <h3 className="purple-stat">₹{totalSavedWithCoupons}</h3>
                    <small>Total Saved</small>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="overview-section-box">
                <div className="sec-head-row">
                  <h3>Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")}>View All →</button>
                </div>

                <div className="recent-orders-overview-list">
                  {orders.slice(0, 2).map((order) => (
                    <div className="order-overview-row" key={order.id}>
                      <div className="o-left">
                        <strong>Order #{order.id}</strong>
                        <small>{order.items?.map((i) => i.name).join(", ")}</small>
                        <span className="o-date">
                          {order.date ? new Date(order.date).toLocaleDateString() : "Recent"}
                        </span>
                      </div>
                      <div className="o-right">
                        <span className="o-total">₹{order.total}</span>
                        <Link to={`/track/${order.id}`} className="o-track-btn">
                          Track Live 🗺️
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="quick-actions-bar">
                <Link to="/shop" className="quick-action-pill">
                  <span>🍕 Order Food</span>
                </Link>
                <Link to="/offers" className="quick-action-pill">
                  <span>🏷️ View Coupons</span>
                </Link>
                <Link to="/help" className="quick-action-pill">
                  <span>💬 24/7 Support</span>
                </Link>
              </div>
            </div>
          )}

          {/* 2. MY ORDERS */}
          {activeTab === "orders" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>My Orders & Receipts ({orders.length}) 📦</h2>
                <p>Detailed receipt breakdown and 1-click reordering</p>
              </div>

              <div className="orders-cards-stack">
                {orders.map((order) => (
                  <div className="detailed-order-card" key={order.id}>
                    <div className="order-card-top">
                      <div>
                        <strong>Order #{order.id}</strong>
                        <span className="order-time-txt">
                          {order.date ? new Date(order.date).toLocaleString() : "Recent"}
                        </span>
                      </div>
                      <span className={`status-pill ${order.status === "Delivered" ? "delivered" : "active"}`}>
                        {order.status || "In Transit"}
                      </span>
                    </div>

                    <div className="order-items-table">
                      {order.items?.map((item, idx) => (
                        <div className="order-item-line" key={idx}>
                          <span>{item.name} × {item.quantity || 1}</span>
                          <strong>{item.price}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer-details">
                      <div>
                        <small>DELIVERY ADDRESS</small>
                        <p>{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <small>TOTAL PAID</small>
                        <strong className="order-grand-total">₹{order.total}</strong>
                      </div>
                      <div className="order-btns-group">
                        <button className="reorder-mini-btn" onClick={() => handleReorder(order)}>
                          🔁 Reorder
                        </button>
                        <Link to={`/track/${order.id}`} className="track-mini-btn">
                          Live Track 🛵
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. TRACK LIVE ORDERS */}
          {activeTab === "track" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Live Order Tracker 🛵</h2>
                <p>Real-time GPS dispatch and courier progression</p>
              </div>

              {orders.filter((o) => o.status !== "Delivered").length === 0 ? (
                <div className="account-empty-state">
                  <div className="empty-icon">🛵</div>
                  <h3>No Active Orders Right Now</h3>
                  <p>All your past cravings have been delivered safely!</p>
                  <Link to="/shop" className="pane-cta-btn">
                    Order a Delicious Meal 🍕
                  </Link>
                </div>
              ) : (
                <div className="active-tracking-cards-list">
                  {orders
                    .filter((o) => o.status !== "Delivered")
                    .map((order) => (
                      <div className="live-track-card" key={order.id}>
                        <div className="live-track-top">
                          <div>
                            <span className="live-pulse-badge">● LIVE DISPATCH</span>
                            <h3>Order #{order.id}</h3>
                          </div>
                          <span className="eta-badge">⚡ ETA: 18 Mins</span>
                        </div>

                        <p className="rider-status-text">
                          Rider <strong>Rahul Sharma</strong> is on his way to {order.deliveryAddress?.split(",")[0]}.
                        </p>

                        <div className="live-progress-bar-wrap">
                          <div className="progress-fill-bar" style={{ width: "65%" }} />
                        </div>

                        <Link to={`/track/${order.id}`} className="open-full-tracker-btn">
                          Open Live Map & Driver Chat →
                        </Link>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* 4. WISHLIST */}
          {activeTab === "wishlist" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>My Favorite Dishes ({wishlist.length}) ❤️</h2>
                <p>Quick access to your most-loved foods</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="account-empty-state">
                  <div className="empty-icon">❤️</div>
                  <h3>Your Wishlist is Empty</h3>
                  <p>Heart your favorite pizzas, burgers, and desserts for quick access!</p>
                  <Link to="/shop" className="pane-cta-btn">
                    Explore Menu
                  </Link>
                </div>
              ) : (
                <div className="account-wishlist-grid">
                  {wishlist.map((item) => (
                    <div className="account-wish-card" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="wish-info">
                        <strong>{item.name}</strong>
                        <span className="wish-price">{item.price}</span>
                      </div>
                      <div className="wish-actions-row">
                        <button
                          className="wish-add-cart-btn"
                          onClick={() => {
                            addToCart(item);
                            removeFromWishlist(item.id);
                          }}
                        >
                          + Add to Cart
                        </button>
                        <button
                          className="wish-delete-btn"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <div>
                  <h2>Saved Delivery Addresses ({savedAddresses.length}) 📍</h2>
                  <p>Manage your home, office, and frequent delivery spots</p>
                </div>
                <button className="add-new-addr-btn" onClick={() => setShowAddressModal(true)}>
                  + Add New Address
                </button>
              </div>

              <div className="addresses-grid">
                {savedAddresses.map((addr) => (
                  <div className="address-box-card" key={addr.id}>
                    <div className="addr-card-top">
                      <span className="addr-tag">
                        {addr.tag === "Home" ? "🏠 Home" : addr.tag === "Work" ? "💼 Work" : "📍 Other"}
                      </span>
                      {addr.isDefault && <span className="default-pill">Default Address</span>}
                    </div>

                    <strong>{addr.fullName}</strong>
                    <p>{addr.houseFlat}, {addr.street}</p>
                    <small>{addr.city}, {addr.state} - {addr.pincode}</small>
                    <small className="addr-phone">📱 Mobile: {addr.mobile}</small>

                    <div className="addr-card-actions">
                      {!addr.isDefault && (
                        <button
                          className="set-default-btn"
                          onClick={() => setDefaultAddress(addr.id)}
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        className="delete-addr-btn"
                        onClick={() => removeAddress(addr.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PAYMENTS & WALLET */}
          {activeTab === "payments" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Payment Methods & FoodieGo Wallet 💳</h2>
                <p>Manage cards, UPI VPAs, and fast 1-click checkout wallet</p>
              </div>

              {/* FoodieGo Wallet Card */}
              <div className="wallet-overview-card">
                <div className="wallet-card-left">
                  <span className="wallet-badge">FOODIEGO WALLET</span>
                  <h2>₹{walletBalance}</h2>
                  <p>Available balance for instant 1-second checkouts</p>
                </div>

                <form className="add-money-form" onSubmit={handleAddMoneyToWallet}>
                  <input
                    type="number"
                    placeholder="Enter amount (e.g. 500)"
                    value={addWalletAmount}
                    onChange={(e) => setAddWalletAmount(e.target.value)}
                  />
                  <button type="submit">+ Add Funds</button>
                </form>
              </div>

              {/* Saved Cards */}
              <div className="saved-cards-section">
                <h3>Saved Cards & UPI IDs</h3>
                <div className="cards-list">
                  <div className="saved-payment-item">
                    <span className="pay-icon">💳</span>
                    <div>
                      <strong>Visa Credit Card •••• 6512</strong>
                      <small>Expires 08/29</small>
                    </div>
                    <span className="verified-tag">✓ Verified</span>
                  </div>

                  <div className="saved-payment-item">
                    <span className="pay-icon">🟣</span>
                    <div>
                      <strong>Google Pay UPI</strong>
                      <small>alex@okaxis</small>
                    </div>
                    <span className="verified-tag">✓ Default UPI</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. COUPONS & OFFERS */}
          {activeTab === "coupons" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Available Offers & Vouchers 🎟️</h2>
                <p>Copy promo codes for instant savings on your next feast</p>
              </div>

              <div className="account-coupons-grid">
                {coupons.map((c) => (
                  <div className="account-coupon-card" key={c.code}>
                    <div className="c-card-top">
                      <span className="c-badge">{c.code}</span>
                      <button
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(c.code);
                          showToast(`Copied code ${c.code}! 📋`, "success");
                        }}
                      >
                        Copy Code
                      </button>
                    </div>
                    <h4>{c.title}</h4>
                    <p>{c.description}</p>
                    <small>Min Order: ₹{c.minOrder || 199}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. MY REVIEWS */}
          {activeTab === "reviews" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>My Ratings & Reviews (2) ⭐</h2>
                <p>Your culinary feedback shared with the community</p>
              </div>

              <div className="account-reviews-list">
                <div className="account-review-item">
                  <div className="rev-dish-header">
                    <strong>🍕 Margherita Pizza (La Pino'z)</strong>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p>"Best cheese pull in town! The dough was crispy and fresh."</p>
                  <small>Reviewed on 2026-09-06 • Verified Purchase</small>
                </div>

                <div className="account-review-item">
                  <div className="rev-dish-header">
                    <strong>🍟 Peri-Peri Masala Fries</strong>
                    <span>⭐⭐⭐⭐⭐</span>
                  </div>
                  <p>"Super spicy and crunchy. Great portion size for sharing."</p>
                  <small>Reviewed on 2026-09-02 • Verified Purchase</small>
                </div>
              </div>
            </div>
          )}

          {/* 9. RETURNS & REFUNDS */}
          {activeTab === "returns" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Returns & Refund Requests 🔄</h2>
                <p>Track return pickups, quality replacements, and refund settlements</p>
              </div>

              <div className="returns-list-stack">
                {returnRequests.map((ret) => (
                  <div className="return-ticket-card" key={ret.id}>
                    <div className="ret-top">
                      <div>
                        <strong>Return #{ret.id}</strong>
                        <small>For Order #{ret.orderId} • {ret.itemName}</small>
                      </div>
                      <span className="ret-status-badge">{ret.status}</span>
                    </div>

                    <div className="ret-body-grid">
                      <div>
                        <small>REASON</small>
                        <p>{ret.reason}</p>
                      </div>
                      <div>
                        <small>PICKUP SLOT</small>
                        <p>{ret.pickupDate}</p>
                      </div>
                      <div>
                        <small>REFUND MODE</small>
                        <p>{ret.refundMethod} (₹{ret.refundAmount || 199})</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <div>
                  <h2>Notifications Center 🔔</h2>
                  <p>Order alerts, delivery milestones, and flash discounts</p>
                </div>
                <button className="mark-read-btn" onClick={markAllNotificationsRead}>
                  Mark All as Read
                </button>
              </div>

              <div className="account-notifications-list">
                {notifications.map((n) => (
                  <div className={`notif-card-row ${!n.read ? "unread" : ""}`} key={n.id}>
                    <div className="n-left">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <small>{n.time}</small>
                    </div>
                    {n.link && (
                      <Link to={n.link} className="n-action-link">
                        View →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. PROFILE SETTINGS */}
          {activeTab === "profile" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Profile Settings 👤</h2>
                <p>Update personal information and contact details</p>
              </div>

              <form className="profile-form-grid" onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Foodie Tier</label>
                  <input type="text" value="VIP Platinum Member (500+ Points)" disabled />
                </div>

                <button type="submit" className="save-profile-btn">
                  Save Changes ✓
                </button>
              </form>
            </div>
          )}

          {/* 12. SECURITY & 2FA */}
          {activeTab === "security" && (
            <div className="tab-view-pane">
              <div className="pane-header-row">
                <h2>Security & Account Protection 🔒</h2>
                <p>Protect your account with Two-Factor Authentication and password controls</p>
              </div>

              <div className="security-section-box">
                <div className="security-toggle-row">
                  <div>
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <p>Receive SMS OTP verification upon new device logins.</p>
                  </div>
                  <button
                    className={`toggle-2fa-btn ${twoFactorAuth ? "active" : ""}`}
                    onClick={() => {
                      setTwoFactorAuth(!twoFactorAuth);
                      showToast(`Two-Factor Authentication ${!twoFactorAuth ? "Enabled" : "Disabled"}`, "info");
                    }}
                  >
                    {twoFactorAuth ? "ENABLED ✓" : "DISABLED"}
                  </button>
                </div>

                <div className="password-change-box">
                  <h4>Change Password</h4>
                  <div className="pass-grid">
                    <input type="password" placeholder="Current Password" />
                    <input type="password" placeholder="New Password" />
                    <input type="password" placeholder="Confirm New Password" />
                  </div>
                  <button
                    className="update-pass-btn"
                    onClick={() => showToast("Password updated successfully!", "success")}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="account-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="account-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddNewAddress} className="modal-addr-form">
              <div className="tag-toggle-row">
                {["Home", "Work", "Other"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag-btn ${newAddrTag === t ? "active" : ""}`}
                    onClick={() => setNewAddrTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Full Name"
                value={newAddrName}
                onChange={(e) => setNewAddrName(e.target.value)}
                required
              />
              <input
                type="tel"
                maxLength={10}
                placeholder="Mobile Number"
                value={newAddrPhone}
                onChange={(e) => setNewAddrPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Flat / House / Building"
                value={newAddrHouse}
                onChange={(e) => setNewAddrHouse(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Street / Area / Sector"
                value={newAddrStreet}
                onChange={(e) => setNewAddrStreet(e.target.value)}
                required
              />
              <div className="modal-two-col">
                <input
                  type="text"
                  placeholder="City"
                  value={newAddrCity}
                  onChange={(e) => setNewAddrCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="PIN Code"
                  maxLength={6}
                  value={newAddrPin}
                  onChange={(e) => setNewAddrPin(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="save-addr-modal-btn">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserAccount;
