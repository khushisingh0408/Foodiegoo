export const initialCategories = [
  { id: 1, name: "Burger", emoji: "🍔" },
  { id: 2, name: "Pizza", emoji: "🍕" },
  { id: 3, name: "Fries", emoji: "🍟" },
  { id: 4, name: "Drinks", emoji: "🥤" },
  { id: 5, name: "Dessert", emoji: "🍰" },
  { id: 6, name: "Noodles", emoji: "🍜" },
];

export const initialFoods = [
  // PIZZA
  {
    id: 1,
    name: "Margherita Pizza",
    price: "₹299",
    rating: "⭐ 4.9",
    image: "margherita-pizza.png",
    category: "Pizza",
    description: "Classic cheesy delight with fresh basil and signature tomato sauce."
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: "₹349",
    rating: "⭐ 4.8",
    image: "farmhouse pizza.png",
    category: "Pizza",
    description: "Loaded with crisp capsicum, juicy tomatoes, mushrooms and onions."
  },
  {
    id: 3,
    name: "Paneer Tikka Pizza",
    price: "₹379",
    rating: "⭐ 4.9",
    image: "paneer-tikka-pizza.png",
    category: "Pizza",
    description: "Tandoori marinated paneer cubes with spicy peppers and mozzarella."
  },
  {
    id: 4,
    name: "Pepperoni & Cheese Pizza",
    price: "₹399",
    rating: "⭐ 4.7",
    image: "pepperoni-pizza.png",
    category: "Pizza",
    description: "Savory pepperoni slices baked to perfection with double cheese."
  },
  {
    id: 5,
    name: "Veggie Supreme Pizza",
    price: "₹329",
    rating: "⭐ 4.8",
    image: "veggie-supreme-pizza.png",
    category: "Pizza",
    description: "Golden corn, black olives, jalapenos and fresh bell peppers."
  },

  // BURGER
  {
    id: 6,
    name: "Classic Cheeseburger",
    price: "₹199",
    rating: "⭐ 4.8",
    image: "classic Cheeseburger.png",
    category: "Burger",
    description: "Juicy grilled patty topped with melted cheddar and secret sauce."
  },
  {
    id: 7,
    name: "Crispy Veggie Burger",
    price: "₹149",
    rating: "⭐ 4.7",
    image: "crispy-veggie-burger.png",
    category: "Burger",
    description: "Crispy golden vegetable patty with crunchy lettuce and herb mayo."
  },
  {
    id: 8,
    name: "Spicy Paneer Burger",
    price: "₹219",
    rating: "⭐ 4.9",
    image: "spicy-paneer-burger.png",
    category: "Burger",
    description: "Crispy battered spicy paneer patty with creamy chipotle sauce."
  },
  {
    id: 9,
    name: "Double Patty BBQ Burger",
    price: "₹269",
    rating: "⭐ 4.8",
    image: "double-bbq-burger.png",
    category: "Burger",
    description: "Double loaded patties glazed in smoky hickory BBQ glaze."
  },
  {
    id: 10,
    name: "Mushroom Swiss Burger",
    price: "₹239",
    rating: "⭐ 4.6",
    image: "mushroom-swiss-burger.png",
    category: "Burger",
    description: "Sautéed garlic mushrooms with creamy melted Swiss cheese."
  },

  // FRIES
  {
    id: 11,
    name: "French Fries",
    price: "₹149",
    rating: "⭐ 4.7",
    image: "french fries.png",
    category: "Fries",
    description: "Golden crispy salted potatoes fried to perfection."
  },
  {
    id: 12,
    name: "Peri Peri Masala Fries",
    price: "₹169",
    rating: "⭐ 4.9",
    image: "peri-peri-fries.png",
    category: "Fries",
    description: "Tossed in fiery African peri-peri spices with a zesty punch."
  },
  {
    id: 13,
    name: "Loaded Cheesy Fries",
    price: "₹199",
    rating: "⭐ 4.8",
    image: "cheesy-fries.png",
    category: "Fries",
    description: "Smothered in warm melted cheese sauce and sliced jalapenos."
  },
  {
    id: 14,
    name: "Crispy Curly Fries",
    price: "₹179",
    rating: "⭐ 4.7",
    image: "curly-fries.png",
    category: "Fries",
    description: "Spiraled crunchy seasoned potatoes with herbs and paprika."
  },
  {
    id: 15,
    name: "Truffle Mayo Fries",
    price: "₹219",
    rating: "⭐ 4.9",
    image: "truffle-fries.png",
    category: "Fries",
    description: "Gourmet fries drizzled with fragrant truffle oil and parmesan."
  },

  // DRINKS
  {
    id: 16,
    name: "Soft Drink",
    price: "₹99",
    rating: "⭐ 4.6",
    image: "soft drink.png",
    category: "Drinks",
    description: "Chilled sparkling cola served with refreshing ice cubes."
  },
  {
    id: 17,
    name: "Fresh Mint Mojito",
    price: "₹129",
    rating: "⭐ 4.8",
    image: "mint-mojito.png",
    category: "Drinks",
    description: "Zesty lemon and crushed garden mint stirred in bubbly soda."
  },
  {
    id: 18,
    name: "Cold Coffee with Ice Cream",
    price: "₹159",
    rating: "⭐ 4.9",
    image: "cold-coffee.png",
    category: "Drinks",
    description: "Rich blended espresso frappe topped with vanilla ice cream."
  },
  {
    id: 19,
    name: "Mango Blast Smoothie",
    price: "₹149",
    rating: "⭐ 4.8",
    image: "mango-smoothie.png",
    category: "Drinks",
    description: "Thick, creamy Alphonso mango pulp blended with chilled milk."
  },
  {
    id: 20,
    name: "Iced Berry Lemonade",
    price: "₹139",
    rating: "⭐ 4.7",
    image: "berry-lemonade.png",
    category: "Drinks",
    description: "Sweet strawberry and blueberry infused with tangy lemonade."
  },

  // DESSERT
  {
    id: 21,
    name: "Chocolate Fudge Cake",
    price: "₹179",
    rating: "⭐ 4.8",
    image: "chocolate fudge cake.png",
    category: "Dessert",
    description: "Rich dark chocolate sponge layered with decadent chocolate fudge."
  },
  {
    id: 22,
    name: "Warm Choco Lava Cake",
    price: "₹149",
    rating: "⭐ 4.9",
    image: "choco-lava-cake.png",
    category: "Dessert",
    description: "Gooey chocolate cake with a warm flowing molten center."
  },
  {
    id: 23,
    name: "New York Cheesecake",
    price: "₹219",
    rating: "⭐ 4.9",
    image: "ny-cheesecake.png",
    category: "Dessert",
    description: "Velvety smooth cream cheese filling over a buttery graham crust."
  },
  {
    id: 24,
    name: "Red Velvet Pastry",
    price: "₹159",
    rating: "⭐ 4.7",
    image: "red-velvet-pastry.png",
    category: "Dessert",
    description: "Crimson cocoa sponge layered with luscious cream cheese frosting."
  },
  {
    id: 25,
    name: "Sizzling Brownie Sundae",
    price: "₹199",
    rating: "⭐ 4.9",
    image: "brownie-sundae.png",
    category: "Dessert",
    description: "Walnut brownie served with vanilla ice cream and hot chocolate sauce."
  },

  // NOODLES
  {
    id: 26,
    name: "Veg Chowmein",
    price: "₹169",
    rating: "⭐ 4.7",
    image: "veg chowmein.png",
    category: "Noodles",
    description: "Street-style stir fried noodles with crunchy shredded veggies."
  },
  {
    id: 27,
    name: "Schezwan Spicy Noodles",
    price: "₹189",
    rating: "⭐ 4.8",
    image: "schezwan-noodles.png",
    category: "Noodles",
    description: "Wok-tossed noodles tossed in fiery garlic Schezwan chili paste."
  },
  {
    id: 28,
    name: "Veg Hakka Noodles",
    price: "₹179",
    rating: "⭐ 4.8",
    image: "hakka-noodles.png",
    category: "Noodles",
    description: "Classic Indo-Chinese noodles tossed with spring onions and capsicum."
  },
  {
    id: 29,
    name: "Chilli Garlic Noodles",
    price: "₹199",
    rating: "⭐ 4.9",
    image: "chilli-garlic-noodles.png",
    category: "Noodles",
    description: "Infused with roasted garlic bits and spicy red chili flakes."
  },
  {
    id: 30,
    name: "Singapore Rice Noodles",
    price: "₹209",
    rating: "⭐ 4.7",
    image: "singapore-noodles.png",
    category: "Noodles",
    description: "Thin vermicelli noodles seasoned with mild curry aromatics and vegetables."
  }
];
