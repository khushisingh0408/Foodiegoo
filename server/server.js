import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { initDatabase } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import foodRoutes from "./routes/foods.js";
import categoryRoutes from "./routes/categories.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";
import orderRoutes from "./routes/orders.js";
import subscriberRoutes from "./routes/subscribers.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQL Database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "FoodieGo SQL Backend API is active & running! 🚀",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/subscribers", subscriberRoutes);

// 404 Route Handler
app.use("/api/*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found." });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred."
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 FoodieGo SQL Server running on http://localhost:${PORT}`);
  console.log(`📡 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
