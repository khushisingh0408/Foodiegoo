import express from "express";
import db from "../config/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes in this file require Admin authentication
router.use(requireAdmin);

// ==========================================
// 1. GET /api/admin/stats (Overview Dashboard Metrics)
// ==========================================
router.get("/stats", (req, res) => {
  try {
    // Total Revenue (excluding cancelled)
    const revenueResult = db.prepare(
      "SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM orders WHERE status != 'Cancelled'"
    ).get();

    // Total Orders Count
    const totalOrdersResult = db.prepare("SELECT COUNT(*) as totalOrders FROM orders").get();

    // Active Live Kitchen Orders (Placed, Preparing, Out for Delivery)
    const activeOrdersResult = db.prepare(
      "SELECT COUNT(*) as activeOrders FROM orders WHERE status IN ('Order Placed', 'Preparing', 'Out for Delivery')"
    ).get();

    // Total Customers Count
    const totalCustomersResult = db.prepare(
      "SELECT COUNT(*) as totalCustomers FROM users WHERE role = 'customer'"
    ).get();

    // Total Food Items Count
    const totalFoodsResult = db.prepare("SELECT COUNT(*) as totalFoods FROM foods").get();

    // Total Subscribers Count
    const totalSubscribersResult = db.prepare("SELECT COUNT(*) as totalSubscribers FROM subscribers").get();

    // Status breakdown
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `).all();

    // Top Selling Items
    const topFoods = db.prepare(`
      SELECT name, SUM(quantity) as totalSold, price, image 
      FROM order_items 
      GROUP BY name 
      ORDER BY totalSold DESC 
      LIMIT 5
    `).all();

    // Recent 6 Orders
    const recentOrders = db.prepare(`
      SELECT id, customer_name as customerName, customer_mobile as customerMobile, 
             total_amount as total, status, created_at as date, payment_method as paymentMethod
      FROM orders 
      ORDER BY id DESC 
      LIMIT 6
    `).all();

    // 7-day revenue trend simulation / aggregation
    const weeklyTrend = [
      { day: "Mon", revenue: 4200, orders: 14 },
      { day: "Tue", revenue: 5600, orders: 18 },
      { day: "Wed", revenue: 4900, orders: 16 },
      { day: "Thu", revenue: 6800, orders: 22 },
      { day: "Fri", revenue: 8900, orders: 29 },
      { day: "Sat", revenue: 12400, orders: 41 },
      { day: "Sun", revenue: 14200, orders: 48 },
    ];

    return res.json({
      success: true,
      stats: {
        totalRevenue: revenueResult.totalRevenue,
        totalOrders: totalOrdersResult.totalOrders,
        activeOrders: activeOrdersResult.activeOrders,
        totalCustomers: totalCustomersResult.totalCustomers,
        totalFoods: totalFoodsResult.totalFoods,
        totalSubscribers: totalSubscribersResult.totalSubscribers,
        statusCounts,
        topFoods,
        recentOrders,
        weeklyTrend
      }
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({ success: false, message: "Failed to load dashboard statistics." });
  }
});

// ==========================================
// 2. Orders Management
// ==========================================

// GET /api/admin/orders (with search and status filter)
router.get("/orders", (req, res) => {
  try {
    const { status, search } = req.query;
    let query = "SELECT * FROM orders WHERE 1=1";
    const params = [];

    if (status && status !== "All") {
      query += " AND status = ?";
      params.push(status);
    }

    if (search && search.trim() !== "") {
      query += " AND (id LIKE ? OR LOWER(customer_name) LIKE ? OR customer_mobile LIKE ?)";
      const pattern = `%${search.trim().toLowerCase()}%`;
      params.push(pattern, pattern, pattern);
    }

    query += " ORDER BY id DESC";
    const orders = db.prepare(query).all(...params);

    const getItemStmt = db.prepare("SELECT food_id as id, name, price, quantity, image FROM order_items WHERE order_id = ?");

    const formattedOrders = orders.map((o) => ({
      id: o.id,
      userId: o.user_id,
      customerName: o.customer_name,
      customerMobile: o.customer_mobile,
      deliveryAddress: o.delivery_address,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status || (o.payment_method?.toLowerCase().includes("cash") ? "Pending (COD)" : "Paid"),
      razorpayOrderId: o.razorpay_order_id,
      razorpayPaymentId: o.razorpay_payment_id,
      total: o.total_amount,
      status: o.status,
      date: o.created_at,
      items: getItemStmt.all(o.id)
    }));

    return res.json({ success: true, count: formattedOrders.length, orders: formattedOrders });
  } catch (error) {
    console.error("Admin orders error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch("/orders/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
    const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.json({ success: true, message: `Order #${orderId} status updated to '${status}'.`, order: updated });
  } catch (error) {
    console.error("Admin order status update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});

// ==========================================
// 3. User & Customer Management
// ==========================================

// GET /api/admin/users
router.get("/users", (req, res) => {
  try {
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.address, u.role, u.created_at as createdAt,
             COUNT(o.id) as totalOrders,
             COALESCE(SUM(o.total_amount), 0) as totalSpent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.id DESC
    `).all();

    return res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Admin users error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch users list." });
  }
});

// PATCH /api/admin/users/:id/role
router.patch("/users/:id/role", (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!role || !["customer", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Valid role ('customer' or 'admin') is required." });
    }

    // Prevent demoting own admin account
    if (Number(userId) === Number(req.user.id) && role !== "admin") {
      return res.status(400).json({ success: false, message: "You cannot revoke your own admin role." });
    }

    db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId);
    return res.json({ success: true, message: `User role updated to '${role}'.` });
  } catch (error) {
    console.error("Admin user role update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update user role." });
  }
});

// ==========================================
// 4. Coupons & Promo Codes
// ==========================================

// GET /api/admin/coupons
router.get("/coupons", (req, res) => {
  try {
    const coupons = db.prepare("SELECT * FROM coupons ORDER BY id DESC").all();
    return res.json({ success: true, coupons });
  } catch (error) {
    console.error("Admin coupons fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch coupons." });
  }
});

// POST /api/admin/coupons
router.post("/coupons", (req, res) => {
  try {
    const { code, discount_type, discount_value, min_order_amount, max_discount_amount, expiry_date } = req.body;

    if (!code || !discount_value) {
      return res.status(400).json({ success: false, message: "Coupon code and discount value are required." });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = db.prepare("SELECT id FROM coupons WHERE code = ?").get(cleanCode);
    if (existing) {
      return res.status(409).json({ success: false, message: "A coupon with this code already exists." });
    }

    const result = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, expiry_date)
      VALUES (?, ?, ?, ?, ?, 1, ?)
    `).run(
      cleanCode,
      discount_type || "percent",
      Number(discount_value) || 10,
      Number(min_order_amount) || 0,
      Number(max_discount_amount) || 500,
      expiry_date || "2026-12-31"
    );

    const newCoupon = db.prepare("SELECT * FROM coupons WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: `Coupon '${cleanCode}' created!`, coupon: newCoupon });
  } catch (error) {
    console.error("Admin coupon creation error:", error);
    return res.status(500).json({ success: false, message: "Failed to create coupon." });
  }
});

// PATCH /api/admin/coupons/:id/toggle
router.patch("/coupons/:id/toggle", (req, res) => {
  try {
    const coupon = db.prepare("SELECT is_active FROM coupons WHERE id = ?").get(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    const newStatus = coupon.is_active ? 0 : 1;
    db.prepare("UPDATE coupons SET is_active = ? WHERE id = ?").run(newStatus, req.params.id);

    return res.json({ success: true, message: `Coupon is now ${newStatus ? 'Active' : 'Disabled'}.`, is_active: newStatus });
  } catch (error) {
    console.error("Admin coupon toggle error:", error);
    return res.status(500).json({ success: false, message: "Failed to toggle coupon." });
  }
});

// DELETE /api/admin/coupons/:id
router.delete("/coupons/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM coupons WHERE id = ?").run(req.params.id);
    return res.json({ success: true, message: "Coupon deleted successfully." });
  } catch (error) {
    console.error("Admin coupon delete error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete coupon." });
  }
});

// ==========================================
// 5. Subscribers & Contacts
// ==========================================

// GET /api/admin/subscribers
router.get("/subscribers", (req, res) => {
  try {
    const subscribers = db.prepare("SELECT * FROM subscribers ORDER BY id DESC").all();
    return res.json({ success: true, subscribers });
  } catch (error) {
    console.error("Admin subscribers fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch subscribers." });
  }
});

// DELETE /api/admin/subscribers/:id
router.delete("/subscribers/:id", (req, res) => {
  try {
    db.prepare("DELETE FROM subscribers WHERE id = ?").run(req.params.id);
    return res.json({ success: true, message: "Subscriber removed." });
  } catch (error) {
    console.error("Admin subscriber delete error:", error);
    return res.status(500).json({ success: false, message: "Failed to remove subscriber." });
  }
});

// GET /api/admin/contacts
router.get("/contacts", (req, res) => {
  try {
    const contacts = db.prepare("SELECT * FROM contacts ORDER BY id DESC").all();
    return res.json({ success: true, contacts });
  } catch (error) {
    console.error("Admin contacts fetch error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch contact inquiries." });
  }
});

export default router;
