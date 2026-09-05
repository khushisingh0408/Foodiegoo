import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// GET /api/cart
router.get("/", (req, res) => {
  try {
    const items = db.prepare(`
      SELECT 
        id as cart_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category,
        quantity
      FROM cart_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, cart: items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch cart items." });
  }
});

// POST /api/cart (Add item to cart)
router.post("/", (req, res) => {
  try {
    const { foodId, name, price, rating, image, category, quantity } = req.body;

    if (!foodId || !name || !price) {
      return res.status(400).json({ success: false, message: "foodId, name, and price are required." });
    }

    const qty = quantity && quantity > 0 ? quantity : 1;
    const existing = db.prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND food_id = ?").get(req.user.id, foodId);

    if (existing) {
      db.prepare("UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .run(qty, existing.id);
    } else {
      db.prepare(`
        INSERT INTO cart_items (user_id, food_id, name, price, rating, image, category, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, foodId, name, price, rating || "", image || "", category || "", qty);
    }

    const updatedCart = db.prepare(`
      SELECT 
        id as cart_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category,
        quantity
      FROM cart_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Item added to cart.", cart: updatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Failed to add item to cart." });
  }
});

// PUT /api/cart/:foodId (Set quantity)
router.put("/:foodId", (req, res) => {
  try {
    const foodId = Number(req.params.foodId);
    const { quantity } = req.body;

    if (quantity === undefined || quantity <= 0) {
      db.prepare("DELETE FROM cart_items WHERE user_id = ? AND food_id = ?").run(req.user.id, foodId);
    } else {
      db.prepare("UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND food_id = ?")
        .run(quantity, req.user.id, foodId);
    }

    const updatedCart = db.prepare(`
      SELECT 
        id as cart_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category,
        quantity
      FROM cart_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Cart updated.", cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, message: "Failed to update cart." });
  }
});

// DELETE /api/cart/:foodId (Remove single item)
router.delete("/:foodId", (req, res) => {
  try {
    const foodId = Number(req.params.foodId);
    db.prepare("DELETE FROM cart_items WHERE user_id = ? AND food_id = ?").run(req.user.id, foodId);

    const updatedCart = db.prepare(`
      SELECT 
        id as cart_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category,
        quantity
      FROM cart_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Item removed from cart.", cart: updatedCart });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ success: false, message: "Failed to remove item from cart." });
  }
});

// DELETE /api/cart (Clear whole cart)
router.delete("/", (req, res) => {
  try {
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.id);
    return res.json({ success: true, message: "Cart cleared.", cart: [] });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ success: false, message: "Failed to clear cart." });
  }
});

// POST /api/cart/sync (Merge local cart into SQL DB after login)
router.post("/sync", (req, res) => {
  try {
    const { localCart } = req.body;
    if (Array.isArray(localCart)) {
      for (const item of localCart) {
        const existing = db.prepare("SELECT id, quantity FROM cart_items WHERE user_id = ? AND food_id = ?").get(req.user.id, item.id);
        if (existing) {
          db.prepare("UPDATE cart_items SET quantity = MAX(quantity, ?), updated_at = CURRENT_TIMESTAMP WHERE id = ?")
            .run(item.quantity || 1, existing.id);
        } else {
          db.prepare(`
            INSERT INTO cart_items (user_id, food_id, name, price, rating, image, category, quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(req.user.id, item.id, item.name, item.price, item.rating || "", item.image || "", item.category || "", item.quantity || 1);
        }
      }
    }

    const updatedCart = db.prepare(`
      SELECT 
        id as cart_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category,
        quantity
      FROM cart_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Cart synchronized.", cart: updatedCart });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return res.status(500).json({ success: false, message: "Failed to sync cart." });
  }
});

export default router;
