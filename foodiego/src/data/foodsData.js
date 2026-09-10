import burgerClassic from "../assets/images/classic Cheeseburger.png";
import pizzaMargherita from "../assets/images/margherita-pizza.png";
import pizzaFarmhouse from "../assets/images/farmhouse pizza.png";
import friesClassic from "../assets/images/french fries.png";
import drinkCola from "../assets/images/soft drink.png";
import dessertCake from "../assets/images/chocolate fudge cake.png";
import noodlesChowmein from "../assets/images/veg chowmein.png";

// Transparent PNG assets for new food items
import pizzaPaneerTikka from "../assets/images/paneer-tikka-pizza.png";
import pizzaPepperoni from "../assets/images/pepperoni-pizza.png";
import pizzaVeggieSupreme from "../assets/images/veggie-supreme-pizza.png";

import burgerCrispyVeggie from "../assets/images/crispy-veggie-burger.png";
import burgerSpicyPaneer from "../assets/images/spicy-paneer-burger.png";
import burgerDoubleBBQ from "../assets/images/double-bbq-burger.png";
import burgerMushroomSwiss from "../assets/images/mushroom-swiss-burger.png";

import friesPeriPeri from "../assets/images/peri-peri-fries.png";
import friesCheesy from "../assets/images/cheesy-fries.png";
import friesCurly from "../assets/images/curly-fries.png";
import friesTruffle from "../assets/images/truffle-fries.png";

import drinkMojito from "../assets/images/mint-mojito.png";
import drinkColdCoffee from "../assets/images/cold-coffee.png";
import drinkMangoSmoothie from "../assets/images/mango-smoothie.png";
import drinkBerryLemonade from "../assets/images/berry-lemonade.png";

import dessertChocoLava from "../assets/images/choco-lava-cake.png";
import dessertCheesecake from "../assets/images/ny-cheesecake.png";
import dessertRedVelvet from "../assets/images/red-velvet-pastry.png";
import dessertBrownieSundae from "../assets/images/brownie-sundae.png";

import noodlesSchezwan from "../assets/images/schezwan-noodles.png";
import noodlesHakka from "../assets/images/hakka-noodles.png";
import noodlesChilliGarlic from "../assets/images/chilli-garlic-noodles.png";
import noodlesSingapore from "../assets/images/singapore-noodles.png";

export const foods = [
  // ===================== PIZZA (5 Items) =====================
  {
    id: 1,
    name: "Margherita Pizza",
    price: "₹299",
    rating: "⭐ 4.9",
    ratingCount: "1.8k+",
    image: pizzaMargherita,
    category: "Pizza",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "BESTSELLER",
    prepTime: "20-25 mins",
    calories: "280 kcal/slice",
    description: "Classic cheesy delight with fresh basil, San Marzano tomato sauce, and 100% mozzarella cheese.",
    customizable: true,
    sizes: [
      { name: "Regular (7\")", price: 0 },
      { name: "Medium (10\")", price: 150 },
      { name: "Large (12\")", price: 280 }
    ],
    crusts: [
      { name: "Pan Hand Tossed", price: 0 },
      { name: "Thin & Crispy", price: 20 },
      { name: "Cheese Burst 🧀", price: 60 }
    ],
    addOns: [
      { name: "Extra Mozzarella Cheese", price: 45 },
      { name: "Jalapenos & Corn", price: 30 },
      { name: "Peri-Peri Dip", price: 25 },
      { name: "Chilled Coke (250ml)", price: 40 }
    ]
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: "₹349",
    rating: "⭐ 4.8",
    ratingCount: "1.2k+",
    image: pizzaFarmhouse,
    category: "Pizza",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "POPULAR",
    prepTime: "25-30 mins",
    calories: "310 kcal/slice",
    description: "Loaded with crisp capsicum, juicy tomatoes, button mushrooms, red onions, and golden corn.",
    customizable: true,
    sizes: [
      { name: "Regular (7\")", price: 0 },
      { name: "Medium (10\")", price: 160 },
      { name: "Large (12\")", price: 300 }
    ],
    crusts: [
      { name: "Pan Hand Tossed", price: 0 },
      { name: "Thin & Crispy", price: 20 },
      { name: "Cheese Burst 🧀", price: 60 }
    ],
    addOns: [
      { name: "Extra Mozzarella Cheese", price: 45 },
      { name: "Black Olives", price: 35 },
      { name: "Cheesy Garlic Dip", price: 30 }
    ]
  },
  {
    id: 3,
    name: "Paneer Tikka Pizza",
    price: "₹379",
    rating: "⭐ 4.9",
    ratingCount: "2.1k+",
    image: pizzaPaneerTikka,
    category: "Pizza",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "CHEF SPECIAL",
    prepTime: "25-30 mins",
    calories: "340 kcal/slice",
    description: "Tandoori marinated paneer cubes with spicy peppers, red paprika, mint drizzle, and mozzarella.",
    customizable: true,
    sizes: [
      { name: "Regular (7\")", price: 0 },
      { name: "Medium (10\")", price: 170 },
      { name: "Large (12\")", price: 320 }
    ],
    crusts: [
      { name: "Pan Hand Tossed", price: 0 },
      { name: "Thin & Crispy", price: 20 },
      { name: "Cheese Burst 🧀", price: 60 }
    ],
    addOns: [
      { name: "Extra Tandoori Paneer", price: 55 },
      { name: "Extra Cheese", price: 45 },
      { name: "Mint Mayo Dip", price: 25 }
    ]
  },
  {
    id: 4,
    name: "Pepperoni & Cheese Pizza",
    price: "₹399",
    rating: "⭐ 4.7",
    ratingCount: "950+",
    image: pizzaPepperoni,
    category: "Pizza",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: false,
    badge: "MUST TRY",
    prepTime: "25-30 mins",
    calories: "380 kcal/slice",
    description: "Savory authentic pepperoni slices baked to perfection with double cheese and Italian seasoning.",
    customizable: true,
    sizes: [
      { name: "Regular (7\")", price: 0 },
      { name: "Medium (10\")", price: 180 },
      { name: "Large (12\")", price: 340 }
    ],
    crusts: [
      { name: "Pan Hand Tossed", price: 0 },
      { name: "Thin & Crispy", price: 20 },
      { name: "Cheese Burst 🧀", price: 60 }
    ],
    addOns: [
      { name: "Extra Pepperoni Slices", price: 65 },
      { name: "Extra Cheese", price: 45 },
      { name: "Fiery Dip", price: 25 }
    ]
  },
  {
    id: 5,
    name: "Veggie Supreme Pizza",
    price: "₹329",
    rating: "⭐ 4.8",
    ratingCount: "820+",
    image: pizzaVeggieSupreme,
    category: "Pizza",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "HEALTHY PICK",
    prepTime: "20-25 mins",
    calories: "290 kcal/slice",
    description: "Golden corn, Spanish black olives, pickled jalapenos, crisp bell peppers, and fresh herbs.",
    customizable: true,
    sizes: [
      { name: "Regular (7\")", price: 0 },
      { name: "Medium (10\")", price: 150 },
      { name: "Large (12\")", price: 290 }
    ],
    crusts: [
      { name: "Pan Hand Tossed", price: 0 },
      { name: "Thin & Crispy", price: 20 },
      { name: "Cheese Burst 🧀", price: 60 }
    ],
    addOns: [
      { name: "Extra Mozzarella Cheese", price: 45 },
      { name: "Jalapeno Dip", price: 25 }
    ]
  },

  // ===================== BURGER (5 Items) =====================
  {
    id: 6,
    name: "Classic Cheeseburger",
    price: "₹199",
    rating: "⭐ 4.8",
    ratingCount: "3.4k+",
    image: burgerClassic,
    category: "Burger",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: false,
    badge: "BESTSELLER",
    prepTime: "15-20 mins",
    calories: "450 kcal",
    description: "Juicy grilled patty topped with melted cheddar cheese, crunchy gherkins, and secret smoky house sauce.",
    customizable: true,
    sizes: [
      { name: "Single Patty", price: 0 },
      { name: "Double Patty (Heavy)", price: 80 },
      { name: "Triple Patty (Monster)", price: 150 }
    ],
    addOns: [
      { name: "Add Fries & Drink Combo 🍟🥤", price: 89 },
      { name: "Extra Cheese Slice", price: 25 },
      { name: "Caramelized Grilled Onions", price: 20 }
    ]
  },
  {
    id: 7,
    name: "Crispy Veggie Burger",
    price: "₹149",
    rating: "⭐ 4.7",
    ratingCount: "2.9k+",
    image: burgerCrispyVeggie,
    category: "Burger",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "BUDGET BITE",
    prepTime: "15 mins",
    calories: "380 kcal",
    description: "Crispy golden vegetable patty with fresh iceberg lettuce, sliced tomatoes, and herb garlic mayo.",
    customizable: true,
    sizes: [
      { name: "Single Patty", price: 0 },
      { name: "Double Patty", price: 60 }
    ],
    addOns: [
      { name: "Add Fries & Drink Combo 🍟🥤", price: 89 },
      { name: "Extra Cheese Slice", price: 25 },
      { name: "Chipotle Dip", price: 20 }
    ]
  },
  {
    id: 8,
    name: "Spicy Paneer Burger",
    price: "₹219",
    rating: "⭐ 4.9",
    ratingCount: "1.9k+",
    image: burgerSpicyPaneer,
    category: "Burger",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "MUST TRY",
    prepTime: "15-20 mins",
    calories: "490 kcal",
    description: "Crispy battered spicy cottage cheese slab glazed in creamy chipotle sauce and crunchy onions.",
    customizable: true,
    sizes: [
      { name: "Standard", price: 0 },
      { name: "Double Paneer", price: 90 }
    ],
    addOns: [
      { name: "Add Peri-Peri Fries & Coke", price: 99 },
      { name: "Extra Cheese Slice", price: 25 },
      { name: "Jalapenos", price: 20 }
    ]
  },
  {
    id: 9,
    name: "Double Patty BBQ Burger",
    price: "₹269",
    rating: "⭐ 4.8",
    ratingCount: "1.5k+",
    image: burgerDoubleBBQ,
    category: "Burger",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: false,
    badge: "CHEF SPECIAL",
    prepTime: "20 mins",
    calories: "580 kcal",
    description: "Double loaded grilled patties glazed in smoky hickory BBQ glaze with molten cheddar and bacon crunch.",
    customizable: true,
    sizes: [
      { name: "Double Patty", price: 0 },
      { name: "Triple Monster", price: 90 }
    ],
    addOns: [
      { name: "Add Large Fries & Shake 🥤", price: 129 },
      { name: "Extra Cheddar Slice", price: 25 },
      { name: "BBQ Dip Cup", price: 20 }
    ]
  },
  {
    id: 10,
    name: "Mushroom Swiss Burger",
    price: "₹239",
    rating: "⭐ 4.6",
    ratingCount: "740+",
    image: burgerMushroomSwiss,
    category: "Burger",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "GOURMET",
    prepTime: "20 mins",
    calories: "430 kcal",
    description: "Sautéed garlic mushrooms with creamy melted Swiss cheese, caramelized onions, and black truffle mayo.",
    customizable: true,
    sizes: [
      { name: "Regular", price: 0 },
      { name: "Double Loaded", price: 70 }
    ],
    addOns: [
      { name: "Add Fries & Drink Combo 🍟🥤", price: 89 },
      { name: "Truffle Mayo Dip", price: 30 }
    ]
  },

  // ===================== FRIES (5 Items) =====================
  {
    id: 11,
    name: "French Fries (Salted)",
    price: "₹149",
    rating: "⭐ 4.7",
    ratingCount: "2.4k+",
    image: friesClassic,
    category: "Fries",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "CLASSIC",
    prepTime: "10-15 mins",
    calories: "290 kcal",
    description: "Golden crispy salted potatoes fried to perfection, served hot with ketchup sachets.",
    customizable: true,
    sizes: [
      { name: "Medium", price: 0 },
      { name: "Large", price: 40 }
    ],
    addOns: [
      { name: "Cheese Dip", price: 25 },
      { name: "Peri-Peri Seasoning Sachet", price: 15 }
    ]
  },
  {
    id: 12,
    name: "Peri Peri Masala Fries",
    price: "₹169",
    rating: "⭐ 4.9",
    ratingCount: "3.2k+",
    image: friesPeriPeri,
    category: "Fries",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "BESTSELLER",
    prepTime: "10-15 mins",
    calories: "320 kcal",
    description: "Tossed in fiery African peri-peri spices with a zesty punch and tangy sprinkle.",
    customizable: true,
    sizes: [
      { name: "Medium", price: 0 },
      { name: "Large", price: 40 }
    ],
    addOns: [
      { name: "Extra Warm Cheese Dip", price: 30 },
      { name: "Garlic Mayo Dip", price: 25 }
    ]
  },
  {
    id: 13,
    name: "Loaded Cheesy Fries",
    price: "₹199",
    rating: "⭐ 4.8",
    ratingCount: "1.6k+",
    image: friesCheesy,
    category: "Fries",
    restaurantId: "rest-4",
    restaurantName: "Haldiram's",
    isVeg: true,
    badge: "MUST TRY",
    prepTime: "15 mins",
    calories: "410 kcal",
    description: "Smothered in warm melted cheddar cheese sauce, sliced jalapenos, and spring onions.",
    customizable: true,
    sizes: [
      { name: "Regular Box", price: 0 },
      { name: "Mega Box", price: 50 }
    ],
    addOns: [
      { name: "Extra Cheese Pour", price: 35 },
      { name: "Spicy Salsa", price: 25 }
    ]
  },
  {
    id: 14,
    name: "Crispy Curly Fries",
    price: "₹179",
    rating: "⭐ 4.7",
    ratingCount: "980+",
    image: friesCurly,
    category: "Fries",
    restaurantId: "rest-7",
    restaurantName: "Chai Point",
    isVeg: true,
    badge: "POPULAR",
    prepTime: "15 mins",
    calories: "340 kcal",
    description: "Spiraled crunchy seasoned potatoes seasoned with paprika, onion powder, and garden herbs.",
    customizable: false,
    addOns: [
      { name: "Chipotle Dip", price: 25 }
    ]
  },
  {
    id: 15,
    name: "Truffle Mayo Fries",
    price: "₹219",
    rating: "⭐ 4.9",
    ratingCount: "670+",
    image: friesTruffle,
    category: "Fries",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "GOURMET",
    prepTime: "15 mins",
    calories: "360 kcal",
    description: "Gourmet fries drizzled with fragrant Italian white truffle oil, shaved parmesan, and garlic aioli.",
    customizable: false,
    addOns: [
      { name: "Extra Parmesan Shavings", price: 35 }
    ]
  },

  // ===================== DRINKS (5 Items) =====================
  {
    id: 16,
    name: "Soft Drink (Coca-Cola)",
    price: "₹99",
    rating: "⭐ 4.6",
    ratingCount: "4.1k+",
    image: drinkCola,
    category: "Drinks",
    restaurantId: "rest-2",
    restaurantName: "Burger King",
    isVeg: true,
    badge: "REFRESHING",
    prepTime: "5 mins",
    calories: "140 kcal",
    description: "Chilled sparkling cola served with refreshing ice cubes and lemon slice.",
    customizable: true,
    sizes: [
      { name: "Medium (350ml)", price: 0 },
      { name: "Large (500ml)", price: 30 }
    ]
  },
  {
    id: 17,
    name: "Fresh Mint Mojito",
    price: "₹129",
    rating: "⭐ 4.8",
    ratingCount: "1.9k+",
    image: drinkMojito,
    category: "Drinks",
    restaurantId: "rest-7",
    restaurantName: "Chai Point",
    isVeg: true,
    badge: "POPULAR",
    prepTime: "5-10 mins",
    calories: "110 kcal",
    description: "Zesty crushed lemon and fresh garden mint stirred in bubbly soda with cane sweetness.",
    customizable: false
  },
  {
    id: 18,
    name: "Cold Coffee with Ice Cream",
    price: "₹159",
    rating: "⭐ 4.9",
    ratingCount: "3.5k+",
    image: drinkColdCoffee,
    category: "Drinks",
    restaurantId: "rest-6",
    restaurantName: "The Belgian Waffle Co.",
    isVeg: true,
    badge: "BESTSELLER",
    prepTime: "5-10 mins",
    calories: "280 kcal",
    description: "Rich blended Arabica espresso frappe topped with a scoop of vanilla ice cream and chocolate drizzle.",
    customizable: true,
    sizes: [
      { name: "Regular (300ml)", price: 0 },
      { name: "Thick Shake Size (450ml)", price: 40 }
    ],
    addOns: [
      { name: "Extra Vanilla Scoop", price: 35 },
      { name: "Caramel Drizzle", price: 20 }
    ]
  },
  {
    id: 19,
    name: "Mango Blast Smoothie",
    price: "₹149",
    rating: "⭐ 4.8",
    ratingCount: "1.4k+",
    image: drinkMangoSmoothie,
    category: "Drinks",
    restaurantId: "rest-6",
    restaurantName: "The Belgian Waffle Co.",
    isVeg: true,
    badge: "SEASONAL",
    prepTime: "10 mins",
    calories: "220 kcal",
    description: "Thick, creamy Ratnagiri Alphonso mango pulp blended with chilled milk and chia seeds.",
    customizable: false
  },
  {
    id: 20,
    name: "Iced Berry Lemonade",
    price: "₹139",
    rating: "⭐ 4.7",
    ratingCount: "820+",
    image: drinkBerryLemonade,
    category: "Drinks",
    restaurantId: "rest-7",
    restaurantName: "Chai Point",
    isVeg: true,
    badge: "COOLER",
    prepTime: "5 mins",
    calories: "95 kcal",
    description: "Sweet strawberry and blueberry infused with chilled sparkling tangy lemonade.",
    customizable: false
  },

  // ===================== DESSERT (5 Items) =====================
  {
    id: 21,
    name: "Chocolate Fudge Cake",
    price: "₹179",
    rating: "⭐ 4.8",
    ratingCount: "2.8k+",
    image: dessertCake,
    category: "Dessert",
    restaurantId: "rest-6",
    restaurantName: "The Belgian Waffle Co.",
    isVeg: true,
    badge: "BESTSELLER",
    prepTime: "10 mins",
    calories: "380 kcal",
    description: "Rich dark Belgian chocolate sponge layered with decadent hot chocolate fudge sauce.",
    customizable: true,
    addOns: [
      { name: "Add Vanilla Ice Cream Scoop", price: 35 },
      { name: "Extra Hot Chocolate Dip", price: 25 }
    ]
  },
  {
    id: 22,
    name: "Warm Choco Lava Cake",
    price: "₹149",
    rating: "⭐ 4.9",
    ratingCount: "4.2k+",
    image: dessertChocoLava,
    category: "Dessert",
    restaurantId: "rest-1",
    restaurantName: "La Pino'z Pizza",
    isVeg: true,
    badge: "MUST TRY",
    prepTime: "10 mins",
    calories: "340 kcal",
    description: "Gooey warm chocolate cake with a molten flowing chocolate lava center.",
    customizable: false,
    addOns: [
      { name: "Add Vanilla Ice Cream Scoop", price: 35 }
    ]
  },
  {
    id: 23,
    name: "New York Cheesecake",
    price: "₹219",
    rating: "⭐ 4.9",
    ratingCount: "1.6k+",
    image: dessertCheesecake,
    category: "Dessert",
    restaurantId: "rest-6",
    restaurantName: "The Belgian Waffle Co.",
    isVeg: true,
    badge: "GOURMET",
    prepTime: "10 mins",
    calories: "390 kcal",
    description: "Velvety smooth Philadelphia cream cheese filling over a buttery graham cracker crust.",
    customizable: true,
    addOns: [
      { name: "Blueberry Compote Topping", price: 35 },
      { name: "Nutella Drizzle", price: 30 }
    ]
  },
  {
    id: 24,
    name: "Red Velvet Pastry",
    price: "₹159",
    rating: "⭐ 4.7",
    ratingCount: "1.1k+",
    image: dessertRedVelvet,
    category: "Dessert",
    restaurantId: "rest-6",
    restaurantName: "The Belgian Waffle Co.",
    isVeg: true,
    badge: "SWEET DELIGHT",
    prepTime: "10 mins",
    calories: "310 kcal",
    description: "Crimson cocoa sponge layered with luscious cream cheese frosting and white chocolate flakes.",
    customizable: false
  },
  {
    id: 25,
    name: "Sizzling Brownie Sundae",
    price: "₹199",
    rating: "⭐ 4.9",
    ratingCount: "2.3k+",
    image: dessertBrownieSundae,
    category: "Dessert",
    restaurantId: "rest-8",
    restaurantName: "Barbeque Nation Express",
    isVeg: true,
    badge: "CHEF SPECIAL",
    prepTime: "10 mins",
    calories: "450 kcal",
    description: "Fudgy walnut brownie served with vanilla ice cream, hot chocolate sauce, and roasted nuts.",
    customizable: false
  },

  // ===================== NOODLES (5 Items) =====================
  {
    id: 26,
    name: "Veg Chowmein",
    price: "₹169",
    rating: "⭐ 4.7",
    ratingCount: "1.7k+",
    image: noodlesChowmein,
    category: "Noodles",
    restaurantId: "rest-5",
    restaurantName: "Wow! Momo & Chinese",
    isVeg: true,
    badge: "STREET STYLE",
    prepTime: "15-20 mins",
    calories: "320 kcal",
    description: "Desi street-style wok stir fried noodles with crunchy shredded cabbage, carrots, and spring onions.",
    customizable: true,
    sizes: [
      { name: "Half Plate", price: 0 },
      { name: "Full Plate", price: 70 }
    ],
    addOns: [
      { name: "Add Chilli Paneer Dip", price: 45 },
      { name: "Schezwan Sauce Cup", price: 20 }
    ]
  },
  {
    id: 27,
    name: "Schezwan Spicy Noodles",
    price: "₹189",
    rating: "⭐ 4.8",
    ratingCount: "2.1k+",
    image: noodlesSchezwan,
    category: "Noodles",
    restaurantId: "rest-5",
    restaurantName: "Wow! Momo & Chinese",
    isVeg: true,
    badge: "SPICY 🔥",
    prepTime: "15-20 mins",
    calories: "350 kcal",
    description: "Wok-tossed noodles in fiery red chili Schezwan paste, roasted garlic, and bell peppers.",
    customizable: true,
    sizes: [
      { name: "Half Plate", price: 0 },
      { name: "Full Plate", price: 70 }
    ],
    addOns: [
      { name: "Extra Spicy Kick", price: 0 },
      { name: "Add Manchurian Balls (3 pcs)", price: 50 }
    ]
  },
  {
    id: 28,
    name: "Veg Hakka Noodles",
    price: "₹179",
    rating: "⭐ 4.8",
    ratingCount: "2.6k+",
    image: noodlesHakka,
    category: "Noodles",
    restaurantId: "rest-5",
    restaurantName: "Wow! Momo & Chinese",
    isVeg: true,
    badge: "POPULAR",
    prepTime: "15-20 mins",
    calories: "310 kcal",
    description: "Classic Indo-Chinese noodles tossed with crunchy capsicum, French beans, and dark soya aroma.",
    customizable: true,
    sizes: [
      { name: "Half Plate", price: 0 },
      { name: "Full Plate", price: 70 }
    ],
    addOns: [
      { name: "Add Gravy Manchurian", price: 55 }
    ]
  },
  {
    id: 29,
    name: "Chilli Garlic Noodles",
    price: "₹199",
    rating: "⭐ 4.9",
    ratingCount: "1.4k+",
    image: noodlesChilliGarlic,
    category: "Noodles",
    restaurantId: "rest-5",
    restaurantName: "Wow! Momo & Chinese",
    isVeg: true,
    badge: "CHEF SPECIAL",
    prepTime: "15-20 mins",
    calories: "340 kcal",
    description: "Infused with golden roasted garlic bits, spicy red chili flakes, and scallions in sesame oil.",
    customizable: true,
    sizes: [
      { name: "Half Plate", price: 0 },
      { name: "Full Plate", price: 70 }
    ],
    addOns: [
      { name: "Add Spring Rolls (2 pcs)", price: 49 }
    ]
  },
  {
    id: 30,
    name: "Singapore Rice Noodles",
    price: "₹209",
    rating: "⭐ 4.7",
    ratingCount: "780+",
    image: noodlesSingapore,
    category: "Noodles",
    restaurantId: "rest-5",
    restaurantName: "Wow! Momo & Chinese",
    isVeg: true,
    badge: "GOURMET",
    prepTime: "20 mins",
    calories: "360 kcal",
    description: "Thin vermicelli noodles seasoned with mild Madras curry aromatics, sprouts, and bell peppers.",
    customizable: false,
    addOns: [
      { name: "Sweet Chilli Dip", price: 20 }
    ]
  }
];
