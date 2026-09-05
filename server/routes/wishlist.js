import express from "express";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

// GET /api/wishlist
router.get("/", (req, res) => {
  try {
    const items = db.prepare(`
      SELECT 
        id as wishlist_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category
      FROM wishlist_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, wishlist: items });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch wishlist." });
  }
});

// POST /api/wishlist (Add to wishlist)
router.post("/", (req, res) => {
  try {
    const { foodId, name, price, rating, image, category } = req.body;

    if (!foodId || !name || !price) {
      return res.status(400).json({ success: false, message: "foodId, name, and price are required." });
    }

    const existing = db.prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND food_id = ?").get(req.user.id, foodId);

    if (!existing) {
      db.prepare(`
        INSERT INTO wishlist_items (user_id, food_id, name, price, rating, image, category)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, foodId, name, price, rating || "", image || "", category || "");
    }

    const updatedWishlist = db.prepare(`
      SELECT 
        id as wishlist_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category
      FROM wishlist_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Item added to wishlist.", wishlist: updatedWishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res.status(500).json({ success: false, message: "Failed to add to wishlist." });
  }
});

// DELETE /api/wishlist/:foodId
router.delete("/:foodId", (req, res) => {
  try {
    const foodId = Number(req.params.foodId);
    db.prepare("DELETE FROM wishlist_items WHERE user_id = ? AND food_id = ?").run(req.user.id, foodId);

    const updatedWishlist = db.prepare(`
      SELECT 
        id as wishlist_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category
      FROM wishlist_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Item removed from wishlist.", wishlist: updatedWishlist });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res.status(500).json({ success: false, message: "Failed to remove from wishlist." });
  }
});

// POST /api/wishlist/sync
router.post("/sync", (req, res) => {
  try {
    const { localWishlist } = req.body;
    if (Array.isArray(localWishlist)) {
      for (const item of localWishlist) {
        const existing = db.prepare("SELECT id FROM wishlist_items WHERE user_id = ? AND food_id = ?").get(req.user.id, item.id);
        if (!existing) {
          db.prepare(`
            INSERT INTO wishlist_items (user_id, food_id, name, price, rating, image, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(req.user.id, item.id, item.name, item.price, item.rating || "", item.image || "", item.category || "");
        }
      }
    }

    const updatedWishlist = db.prepare(`
      SELECT 
        id as wishlist_item_id,
        food_id as id,
        name,
        price,
        rating,
        image,
        category
      FROM wishlist_items
      WHERE user_id = ?
      ORDER BY id ASC
    `).all(req.user.id);

    return res.json({ success: true, message: "Wishlist synchronized.", wishlist: updatedWishlist });
  } catch (error) {
    console.error("Error syncing wishlist:", error);
    return res.status(500).json({ success: false, message: "Failed to sync wishlist." });
  }
});

export default router;
