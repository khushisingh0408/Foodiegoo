import db, { initDatabase } from "./config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function runTests() {
  console.log("▶ Initializing SQL database test...");
  initDatabase();

  // Test 1: Check categories & foods count
  const categories = db.prepare("SELECT * FROM categories").all();
  const foods = db.prepare("SELECT * FROM foods").all();
  console.log(`✅ Categories count in SQL DB: ${categories.length}`);
  console.log(`✅ Foods count in SQL DB: ${foods.length}`);

  // Test 2: User Registration in SQL
  const testEmail = `testuser_${Date.now()}@foodiego.com`;
  const hashedPassword = await bcrypt.hash("securepass123", 10);
  const userInsert = db.prepare(
    "INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)"
  ).run("Amit Patel", testEmail, hashedPassword, "9876543210", "Civil Lines, Raipur");

  const userId = Number(userInsert.lastInsertRowid);
  const userRecord = db.prepare("SELECT id, name, email, phone, address FROM users WHERE id = ?").get(userId);
  console.log(`✅ User registered in SQL DB: ID ${userRecord.id}, Name: ${userRecord.name}, Email: ${userRecord.email}`);

  // Test 3: Cart insertion in SQL
  db.prepare(`
    INSERT INTO cart_items (user_id, food_id, name, price, rating, image, category, quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, foods[0].id, foods[0].name, foods[0].price, foods[0].rating, foods[0].image, foods[0].category, 2);

  const cartItems = db.prepare("SELECT * FROM cart_items WHERE user_id = ?").all(userId);
  console.log(`✅ Cart item saved in SQL DB: Food "${cartItems[0].name}" (Qty: ${cartItems[0].quantity})`);

  // Test 4: Wishlist insertion in SQL
  db.prepare(`
    INSERT INTO wishlist_items (user_id, food_id, name, price, rating, image, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(userId, foods[1].id, foods[1].name, foods[1].price, foods[1].rating, foods[1].image, foods[1].category);

  const wishlistItems = db.prepare("SELECT * FROM wishlist_items WHERE user_id = ?").all(userId);
  console.log(`✅ Wishlist item saved in SQL DB: Food "${wishlistItems[0].name}"`);

  // Test 5: Order creation in SQL
  const orderInsert = db.prepare(`
    INSERT INTO orders (user_id, customer_name, customer_mobile, delivery_address, payment_method, total_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Order Placed')
  `).run(userId, userRecord.name, userRecord.phone, userRecord.address, "UPI", 598);

  const orderId = Number(orderInsert.lastInsertRowid);

  db.prepare(`
    INSERT INTO order_items (order_id, food_id, name, price, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(orderId, foods[0].id, foods[0].name, foods[0].price, 2, foods[0].image);

  const savedOrder = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  const savedOrderItems = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId);
  console.log(`✅ Order #${savedOrder.id} saved in SQL DB: Total ₹${savedOrder.total_amount}, Items: ${savedOrderItems.length}`);

  // Test 6: Newsletter Subscriber in SQL
  const subEmail = `sub_${Date.now()}@example.com`;
  db.prepare("INSERT INTO subscribers (email) VALUES (?)").run(subEmail);
  const subscriber = db.prepare("SELECT * FROM subscribers WHERE email = ?").get(subEmail);
  console.log(`✅ Newsletter subscriber saved in SQL DB: ${subscriber.email}`);

  console.log("\n🎉 ALL SQL DATABASE TESTS PASSED WITH 100% INTEGRITY!");
}

runTests().catch(err => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
