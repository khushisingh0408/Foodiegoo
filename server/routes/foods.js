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
    const { name, price, rating, image, category, description } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "Name, price, and category are required." });
    }

    const formattedPrice = price.startsWith("₹") ? price : `₹${price}`;
    const result = db.prepare(
      "INSERT INTO foods (name, price, rating, image, category, description) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(name, formattedPrice, rating || "⭐ 4.8", image || "classic Cheeseburger.png", category, description || "");

    const newFood = db.prepare("SELECT * FROM foods WHERE id = ?").get(result.lastInsertRowid);
    return res.status(201).json({ success: true, message: "Food item created successfully.", food: newFood });
  } catch (error) {
    console.error("Error adding food:", error);
    return res.status(500).json({ success: false, message: "Failed to create food item." });
  }
});

export default router;
