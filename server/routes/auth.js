import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "foodiego_secret_jwt_key_2026_super_secure";

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(trimmedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = db.prepare(
      "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)"
    ).run(name.trim(), trimmedEmail, hashedPassword, phone || null, address || null);

    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: trimmedEmail,
      phone: phone || "",
      address: address || "",
      role: "customer"
    };

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

    return res.status(201).json({
      success: true,
      message: "Account created successfully! 🎉",
      user,
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(trimmedEmail);

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role
    };

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30d" });

    return res.json({
      success: true,
      message: "Login successful! 🎉",
      user: userProfile,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Internal server error during login." });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  return res.json({ success: true, user: req.user });
});

// PUT /api/auth/profile
router.put("/profile", authenticateToken, (req, res) => {
  try {
    const { name, phone, address } = req.body;
    db.prepare("UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?")
      .run(name || null, phone || null, address || null, req.user.id);

    const updatedUser = db.prepare("SELECT id, name, email, phone, address, role FROM users WHERE id = ?").get(req.user.id);

    return res.json({ success: true, message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
});

export default router;
