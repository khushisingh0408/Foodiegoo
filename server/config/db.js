import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import { initialCategories, initialFoods } from "../data/initialData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, "../database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "foodiego.db");
const db = new DatabaseSync(dbPath);

// Enable WAL mode & Foreign Keys for performance and integrity
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

export function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Categories Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      emoji TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Foods Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      rating TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Cart Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      food_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      rating TEXT,
      image TEXT NOT NULL,
      category TEXT,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, food_id)
    );
  `);

  // 5. Wishlist Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      food_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      rating TEXT,
      image TEXT NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, food_id)
    );
  `);

  // 6. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      customer_name TEXT NOT NULL,
      customer_mobile TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT DEFAULT 'Order Placed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // 7. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      food_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      image TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
  `);

  // 8. Newsletter Subscribers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Contact Messages Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Coupons Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT DEFAULT 'percent',
      discount_value REAL NOT NULL,
      min_order_amount REAL DEFAULT 0,
      max_discount_amount REAL DEFAULT 500,
      is_active INTEGER DEFAULT 1,
      expiry_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Try adding is_available column to foods if not exists
  try {
    db.exec("ALTER TABLE foods ADD COLUMN is_available INTEGER DEFAULT 1;");
  } catch {
    // Column already exists
  }

  // Try adding payment columns to orders if not exists
  try {
    db.exec("ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'Pending';");
  } catch {}
  try {
    db.exec("ALTER TABLE orders ADD COLUMN razorpay_order_id TEXT;");
  } catch {}
  try {
    db.exec("ALTER TABLE orders ADD COLUMN razorpay_payment_id TEXT;");
  } catch {}

  // Seed Default Categories if empty
  const catCount = db.prepare("SELECT COUNT(*) as count FROM categories").get().count;
  if (catCount === 0) {
    const insertCat = db.prepare("INSERT INTO categories (name, emoji) VALUES (?, ?)");
    for (const cat of initialCategories) {
      insertCat.run(cat.name, cat.emoji);
    }
  }

  // Seed Default Foods if empty
  const foodCount = db.prepare("SELECT COUNT(*) as count FROM foods").get().count;
  if (foodCount === 0) {
    const insertFood = db.prepare(
      "INSERT INTO foods (id, name, price, rating, image, category, description, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
    );
    for (const food of initialFoods) {
      insertFood.run(
        food.id,
        food.name,
        food.price,
        food.rating,
        food.image,
        food.category,
        food.description
      );
    }
  }

  // Seed Default Admin User if not exists
  const adminExists = db.prepare("SELECT id FROM users WHERE email = 'admin@foodiego.com'").get();
  if (!adminExists) {
    const hashedAdminPassword = bcrypt.hashSync("admin123", 10);
    db.prepare(
      "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
      "FoodieGo Admin",
      "admin@foodiego.com",
      hashedAdminPassword,
      "9999999999",
      "FoodieGo Headquarters, Mumbai",
      "admin"
    );
  }

  // Seed Demo Customer User if not exists
  const userExists = db.prepare("SELECT id FROM users WHERE email = 'demo@foodiego.com'").get();
  if (!userExists) {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    db.prepare(
      "INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(
      "Demo Foodie",
      "demo@foodiego.com",
      hashedPassword,
      "9876543210",
      "Raipur, Chhattisgarh",
      "customer"
    );
  }

  // Seed Default Coupons if empty
  const couponCount = db.prepare("SELECT COUNT(*) as count FROM coupons").get().count;
  if (couponCount === 0) {
    const insertCoupon = db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount_amount, is_active, expiry_date)
      VALUES (?, ?, ?, ?, ?, 1, '2026-12-31')
    `);
    insertCoupon.run("FOODIE20", "percent", 20, 299, 150);
    insertCoupon.run("FLAT50", "flat", 50, 199, 50);
    insertCoupon.run("FEAST100", "flat", 100, 499, 100);
    insertCoupon.run("WELCOME30", "percent", 30, 249, 120);
  }

  console.log("✅ SQL Database initialized and verified at:", dbPath);
}

export default db;
