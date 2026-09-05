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
    image: pizzaMargherita,
    category: "Pizza",
    description: "Classic cheesy delight with fresh basil and signature tomato sauce.",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: "₹349",
    rating: "⭐ 4.8",
    image: pizzaFarmhouse,
    category: "Pizza",
    description: "Loaded with crisp capsicum, juicy tomatoes, mushrooms and onions.",
  },
  {
    id: 3,
    name: "Paneer Tikka Pizza",
    price: "₹379",
    rating: "⭐ 4.9",
    image: pizzaPaneerTikka,
    category: "Pizza",
    description: "Tandoori marinated paneer cubes with spicy peppers and mozzarella.",
  },
  {
    id: 4,
    name: "Pepperoni & Cheese Pizza",
    price: "₹399",
    rating: "⭐ 4.7",
    image: pizzaPepperoni,
    category: "Pizza",
    description: "Savory pepperoni slices baked to perfection with double cheese.",
  },
  {
    id: 5,
    name: "Veggie Supreme Pizza",
    price: "₹329",
    rating: "⭐ 4.8",
    image: pizzaVeggieSupreme,
    category: "Pizza",
    description: "Golden corn, black olives, jalapenos and fresh bell peppers.",
  },

  // ===================== BURGER (5 Items) =====================
  {
    id: 6,
    name: "Classic Cheeseburger",
    price: "₹199",
    rating: "⭐ 4.8",
    image: burgerClassic,
    category: "Burger",
    description: "Juicy grilled patty topped with melted cheddar and secret sauce.",
  },
  {
    id: 7,
    name: "Crispy Veggie Burger",
    price: "₹149",
    rating: "⭐ 4.7",
    image: burgerCrispyVeggie,
    category: "Burger",
    description: "Crispy golden vegetable patty with crunchy lettuce and herb mayo.",
  },
  {
    id: 8,
    name: "Spicy Paneer Burger",
    price: "₹219",
    rating: "⭐ 4.9",
    image: burgerSpicyPaneer,
    category: "Burger",
    description: "Crispy battered spicy paneer patty with creamy chipotle sauce.",
  },
  {
    id: 9,
    name: "Double Patty BBQ Burger",
    price: "₹269",
    rating: "⭐ 4.8",
    image: burgerDoubleBBQ,
    category: "Burger",
    description: "Double loaded patties glazed in smoky hickory BBQ glaze.",
  },
  {
    id: 10,
    name: "Mushroom Swiss Burger",
    price: "₹239",
    rating: "⭐ 4.6",
    image: burgerMushroomSwiss,
    category: "Burger",
    description: "Sautéed garlic mushrooms with creamy melted Swiss cheese.",
  },

  // ===================== FRIES (5 Items) =====================
  {
    id: 11,
    name: "French Fries",
    price: "₹149",
    rating: "⭐ 4.7",
    image: friesClassic,
    category: "Fries",
    description: "Golden crispy salted potatoes fried to perfection.",
  },
  {
    id: 12,
    name: "Peri Peri Masala Fries",
    price: "₹169",
    rating: "⭐ 4.9",
    image: friesPeriPeri,
    category: "Fries",
    description: "Tossed in fiery African peri-peri spices with a zesty punch.",
  },
  {
    id: 13,
    name: "Loaded Cheesy Fries",
    price: "₹199",
    rating: "⭐ 4.8",
    image: friesCheesy,
    category: "Fries",
    description: "Smothered in warm melted cheese sauce and sliced jalapenos.",
  },
  {
    id: 14,
    name: "Crispy Curly Fries",
    price: "₹179",
    rating: "⭐ 4.7",
    image: friesCurly,
    category: "Fries",
    description: "Spiraled crunchy seasoned potatoes with herbs and paprika.",
  },
  {
    id: 15,
    name: "Truffle Mayo Fries",
    price: "₹219",
    rating: "⭐ 4.9",
    image: friesTruffle,
    category: "Fries",
    description: "Gourmet fries drizzled with fragrant truffle oil and parmesan.",
  },

  // ===================== DRINKS (5 Items) =====================
  {
    id: 16,
    name: "Soft Drink",
    price: "₹99",
    rating: "⭐ 4.6",
    image: drinkCola,
    category: "Drinks",
    description: "Chilled sparkling cola served with refreshing ice cubes.",
  },
  {
    id: 17,
    name: "Fresh Mint Mojito",
    price: "₹129",
    rating: "⭐ 4.8",
    image: drinkMojito,
    category: "Drinks",
    description: "Zesty lemon and crushed garden mint stirred in bubbly soda.",
  },
  {
    id: 18,
    name: "Cold Coffee with Ice Cream",
    price: "₹159",
    rating: "⭐ 4.9",
    image: drinkColdCoffee,
    category: "Drinks",
    description: "Rich blended espresso frappe topped with vanilla ice cream.",
  },
  {
    id: 19,
    name: "Mango Blast Smoothie",
    price: "₹149",
    rating: "⭐ 4.8",
    image: drinkMangoSmoothie,
    category: "Drinks",
    description: "Thick, creamy Alphonso mango pulp blended with chilled milk.",
  },
  {
    id: 20,
    name: "Iced Berry Lemonade",
    price: "₹139",
    rating: "⭐ 4.7",
    image: drinkBerryLemonade,
    category: "Drinks",
    description: "Sweet strawberry and blueberry infused with tangy lemonade.",
  },

  // ===================== DESSERT (5 Items) =====================
  {
    id: 21,
    name: "Chocolate Fudge Cake",
    price: "₹179",
    rating: "⭐ 4.8",
    image: dessertCake,
    category: "Dessert",
    description: "Rich dark chocolate sponge layered with decadent chocolate fudge.",
  },
  {
    id: 22,
    name: "Warm Choco Lava Cake",
    price: "₹149",
    rating: "⭐ 4.9",
    image: dessertChocoLava,
    category: "Dessert",
    description: "Gooey chocolate cake with a warm flowing molten center.",
  },
  {
    id: 23,
    name: "New York Cheesecake",
    price: "₹219",
    rating: "⭐ 4.9",
    image: dessertCheesecake,
    category: "Dessert",
    description: "Velvety smooth cream cheese filling over a buttery graham crust.",
  },
  {
    id: 24,
    name: "Red Velvet Pastry",
    price: "₹159",
    rating: "⭐ 4.7",
    image: dessertRedVelvet,
    category: "Dessert",
    description: "Crimson cocoa sponge layered with luscious cream cheese frosting.",
  },
  {
    id: 25,
    name: "Sizzling Brownie Sundae",
    price: "₹199",
    rating: "⭐ 4.9",
    image: dessertBrownieSundae,
    category: "Dessert",
    description: "Walnut brownie served with vanilla ice cream and hot chocolate sauce.",
  },

  // ===================== NOODLES (5 Items) =====================
  {
    id: 26,
    name: "Veg Chowmein",
    price: "₹169",
    rating: "⭐ 4.7",
    image: noodlesChowmein,
    category: "Noodles",
    description: "Street-style stir fried noodles with crunchy shredded veggies.",
  },
  {
    id: 27,
    name: "Schezwan Spicy Noodles",
    price: "₹189",
    rating: "⭐ 4.8",
    image: noodlesSchezwan,
    category: "Noodles",
    description: "Wok-tossed noodles tossed in fiery garlic Schezwan chili paste.",
  },
  {
    id: 28,
    name: "Veg Hakka Noodles",
    price: "₹179",
    rating: "⭐ 4.8",
    image: noodlesHakka,
    category: "Noodles",
    description: "Classic Indo-Chinese noodles tossed with spring onions and capsicum.",
  },
  {
    id: 29,
    name: "Chilli Garlic Noodles",
    price: "₹199",
    rating: "⭐ 4.9",
    image: noodlesChilliGarlic,
    category: "Noodles",
    description: "Infused with roasted garlic bits and spicy red chili flakes.",
  },
  {
    id: 30,
    name: "Singapore Rice Noodles",
    price: "₹209",
    rating: "⭐ 4.7",
    image: noodlesSingapore,
    category: "Noodles",
    description: "Thin vermicelli noodles seasoned with mild curry aromatics and vegetables.",
  },
];
