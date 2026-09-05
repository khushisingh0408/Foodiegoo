import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/subscribers (Newsletter subscription)
router.post("/subscribe", (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email address is required." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = db.prepare("SELECT id FROM subscribers WHERE email = ?").get(trimmedEmail);

    if (existing) {
      return res.json({ success: true, message: "You are already subscribed! 🎉" });
    }

    db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(trimmedEmail);

    return res.status(201).json({ success: true, message: "Thank you for subscribing! 🎁" });
  } catch (error) {
    console.error("Error subscribing newsletter:", error);
    return res.status(500).json({ success: false, message: "Failed to subscribe." });
  }
});

// POST /api/contact (Contact message)
router.post("/contact", (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required." });
    }

    db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)").run(name.trim(), email.trim(), message.trim());

    return res.status(201).json({ success: true, message: "Your message has been received! We'll reply shortly." });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return res.status(500).json({ success: false, message: "Failed to send message." });
  }
});

export default router;
