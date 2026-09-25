import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /api/foods (Optional: ?category=Burger&search=spicy)
router.get("/", (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM foods WHERE 1=1";
    const params = [];

    if (category && category !== "All" && category.trim() !== "") {
      query += " AND LOWER(category) = LOWER(?)";
      params.push(category.trim());
    }

    if (search && search.trim() !== "") {
      query += " AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)";
      const pattern = `%${search.trim().toLowerCase()}%`;
      params.push(pattern, pattern, pattern);
    }

    query += " ORDER BY id ASC";
    const foods = db.prepare(query).all(...params);

    return res.json({ success: true, count: foods.length, foods });
  } catch (error) {
    console.error("Error fetching foods:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch foods." });
  }
});

// GET /api/foods/:id
router.get("/:id", (req, res) => {
  try {
    const food = db.prepare("SELECT * FROM foods WHERE id = ?").get(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }
    return res.json({ success: true, food });
  } catch (error) {
    console.error("Error fetching food:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch food item." });
  }
});

// POST /api/foods (Add new food item)
router.post("/", (req, res) => {
  try {
    const { name, price, rating, image, category, description, is_available } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price, and category are required." });
    }

    const formattedPrice = price.startsWith("₹") ? price : `₹${price}`;
    const stockStatus = is_available !== undefined ? (is_available ? 1 : 0) : 1;

    const result = db.prepare(
      "INSERT INTO foods (name, price, rating, image, category, description, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(name, formattedPrice, rating || "⭐ 4.8", image || "classic Cheeseburger.png", category, description || "", stockStatus);

    const newFood = db.prepare("SELECT * FROM foods WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: "Food item created successfully.", food: newFood });
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ success: false, message: "Failed to create food item." });
  }
});

// PUT /api/foods/:id (Update food item)
router.put("/:id", (req, res) => {
  try {
    const { name, price, rating, image, category, description, is_available } = req.body;
    const foodId = req.params.id;

    const existing = db.prepare("SELECT * FROM foods WHERE id = ?").get(foodId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    const formattedPrice = price ? (price.startsWith("₹") ? price : `₹${price}`) : existing.price;
    const stock = is_available !== undefined ? (is_available ? 1 : 0) : existing.is_available;

    db.prepare(`
      UPDATE foods 
      SET name = COALESCE(?, name),
          price = ?,
          rating = COALESCE(?, rating),
          image = COALESCE(?, image),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          is_available = ?
      WHERE id = ?
    `).run(
      name || existing.name,
      formattedPrice,
      rating || existing.rating,
      image || existing.image,
      category || existing.category,
      description !== undefined ? description : existing.description,
      stock,
      foodId
    );

    const updated = db.prepare("SELECT * FROM foods WHERE id = ?").get(foodId);
    return res.json({ success: true, message: "Food item updated successfully.", food: updated });
  } catch (error) {
    console.error("Error updating food:", error);
    return res.status(500).json({ success: false, message: "Failed to update food item." });
  }
});

// PATCH /api/foods/:id/availability (Toggle stock status)
router.patch("/:id/availability", (req, res) => {
  try {
    const foodId = req.params.id;
    const existing = db.prepare("SELECT * FROM foods WHERE id = ?").get(foodId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    const newStock = existing.is_available ? 0 : 1;
    db.prepare("UPDATE foods SET is_available = ? WHERE id = ?").run(newStock, foodId);

    return res.json({
      success: true,
      message: `Item is now ${newStock ? 'In Stock' : 'Out of Stock'}.`,
      is_available: newStock
    });
  } catch (error) {
    console.error("Error toggling food availability:", error);
    return res.status(500).json({ success: false, message: "Failed to toggle item availability." });
  }
});

// DELETE /api/foods/:id
router.delete("/:id", (req, res) => {
  try {
    const foodId = req.params.id;
    const existing = db.prepare("SELECT * FROM foods WHERE id = ?").get(foodId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    db.prepare("DELETE FROM foods WHERE id = ?").run(foodId);
    return res.json({ success: true, message: `Food item '${existing.name}' deleted successfully.` });
  } catch (error) {
    console.error("Error deleting food:", error);
    return res.status(500).json({ success: false, message: "Failed to delete food item." });
  }
});

export default router;

