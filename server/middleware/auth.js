import jwt from "jsonwebtoken";
import db from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "foodiego_secret_jwt_key_2026_super_secure";

// Mandatory Auth Middleware
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. Authentication token required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare("SELECT id, name, email, phone, address, role FROM users WHERE id = ?").get(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired authentication token." });
  }
}

// Optional Auth Middleware (for guests or logged-in users)
export function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.prepare("SELECT id, name, email, phone, address, role FROM users WHERE id = ?").get(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore token decode errors for optional auth
    }
  }

  next();
}
