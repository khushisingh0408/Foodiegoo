import express from "express";
import db from "../config/db.js";
import { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders (Optional Auth: returns orders for user or all if guest query)
router.get("/", optionalAuth, (req, res) => {
  try {
    let ordersQuery = "SELECT * FROM orders";
    const params = [];

    if (req.user) {
      ordersQuery += " WHERE user_id = ? ORDER BY id DESC";
      params.push(req.user.id);
    } else {
      ordersQuery += " ORDER BY id DESC LIMIT 50";
    }

    const orders = db.prepare(ordersQuery).all(...params);

    // Fetch items for each order
    const getItemStmt = db.prepare("SELECT food_id as id, name, price, quantity, image FROM order_items WHERE order_id = ?");

    const fullOrders = orders.map((order) => {
      const items = getItemStmt.all(order.id);
      return {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerMobile: order.customer_mobile,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        total: order.total_amount,
        status: order.status,
        date: order.created_at,
        items
      };
    });

    return res.json({ success: true, count: fullOrders.length, orders: fullOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders." });
  }
});

// GET /api/orders/:id
router.get("/:id", (req, res) => {
  try {
    const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const items = db.prepare("SELECT food_id as id, name, price, quantity, image FROM order_items WHERE order_id = ?").all(order.id);

    return res.json({
      success: true,
      order: {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerMobile: order.customer_mobile,
        deliveryAddress: order.delivery_address,
        paymentMethod: order.payment_method,
        total: order.total_amount,
        status: order.status,
        date: order.created_at,
        items
      }
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch order details." });
  }
});

// POST /api/orders (Create new order)
router.post("/", optionalAuth, (req, res) => {
  try {
    const { customerName, customerMobile, deliveryAddress, paymentMethod, items, total } = req.body;

    if (!customerName || !customerMobile || !deliveryAddress || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Customer name, mobile number, address, and items are required."
      });
    }

    const userId = req.user ? req.user.id : null;
    const payment = paymentMethod || "Cash on Delivery";
    const totalAmount = Number(total) || 0;

    // Insert Order
    const insertOrderStmt = db.prepare(`
      INSERT INTO orders (user_id, customer_name, customer_mobile, delivery_address, payment_method, total_amount, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Order Placed')
    `);

    const result = insertOrderStmt.run(
      userId,
      customerName.trim(),
      customerMobile.trim(),
      deliveryAddress.trim(),
      payment,
      totalAmount
    );

    const orderId = Number(result.lastInsertRowid);

    // Insert Order Items
    const insertItemStmt = db.prepare(`
      INSERT INTO order_items (order_id, food_id, name, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insertItemStmt.run(
        orderId,
        item.id || 0,
        item.name || "Food Item",
        String(item.price || "₹0"),
        item.quantity || 1,
        item.image || ""
      );
    }

    // If user is logged in, clear their cart in the database
    if (userId) {
      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(userId);
    }

    const createdOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
    const orderItems = db.prepare("SELECT food_id as id, name, price, quantity, image FROM order_items WHERE order_id = ?").all(orderId);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully! 🎉",
      order: {
        id: createdOrder.id,
        userId: createdOrder.user_id,
        customerName: createdOrder.customer_name,
        customerMobile: createdOrder.customer_mobile,
        deliveryAddress: createdOrder.delivery_address,
        paymentMethod: createdOrder.payment_method,
        total: createdOrder.total_amount,
        status: createdOrder.status,
        date: createdOrder.created_at,
        items: orderItems
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ success: false, message: "Failed to place order." });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    const updated = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);

    return res.json({ success: true, message: "Order status updated.", order: updated });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});

export default router;
