import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET /api/categories
router.get("/", (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories ORDER BY id ASC").all();
    return res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch categories." });
  }
});

export default router;
