import burgerClassic from "../assets/images/classic Cheeseburger.png";
import pizzaMargherita from "../assets/images/margherita-pizza.png";
import pizzaFarmhouse from "../assets/images/farmhouse pizza.png";
import friesClassic from "../assets/images/french fries.png";
import drinkCola from "../assets/images/soft drink.png";
import dessertCake from "../assets/images/chocolate fudge cake.png";
import noodlesChowmein from "../assets/images/veg chowmein.png";

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

const imageMap = {
  // Filenames
  "margherita-pizza.png": pizzaMargherita,
  "farmhouse pizza.png": pizzaFarmhouse,
  "paneer-tikka-pizza.png": pizzaPaneerTikka,
  "pepperoni-pizza.png": pizzaPepperoni,
  "veggie-supreme-pizza.png": pizzaVeggieSupreme,

  "classic Cheeseburger.png": burgerClassic,
  "crispy-veggie-burger.png": burgerCrispyVeggie,
  "spicy-paneer-burger.png": burgerSpicyPaneer,
  "double-bbq-burger.png": burgerDoubleBBQ,
  "mushroom-swiss-burger.png": burgerMushroomSwiss,

  "french fries.png": friesClassic,
  "peri-peri-fries.png": friesPeriPeri,
  "cheesy-fries.png": friesCheesy,
  "curly-fries.png": friesCurly,
  "truffle-fries.png": friesTruffle,

  "soft drink.png": drinkCola,
  "mint-mojito.png": drinkMojito,
  "cold-coffee.png": drinkColdCoffee,
  "mango-smoothie.png": drinkMangoSmoothie,
  "berry-lemonade.png": drinkBerryLemonade,

  "chocolate fudge cake.png": dessertCake,
  "choco-lava-cake.png": dessertChocoLava,
  "ny-cheesecake.png": dessertCheesecake,
  "red-velvet-pastry.png": dessertRedVelvet,
  "brownie-sundae.png": dessertBrownieSundae,

  "veg chowmein.png": noodlesChowmein,
  "schezwan-noodles.png": noodlesSchezwan,
  "hakka-noodles.png": noodlesHakka,
  "chilli-garlic-noodles.png": noodlesChilliGarlic,
  "singapore-noodles.png": noodlesSingapore,

  // Fallbacks by ID
  1: pizzaMargherita,
  2: pizzaFarmhouse,
  3: pizzaPaneerTikka,
  4: pizzaPepperoni,
  5: pizzaVeggieSupreme,
  6: burgerClassic,
  7: burgerCrispyVeggie,
  8: burgerSpicyPaneer,
  9: burgerDoubleBBQ,
  10: burgerMushroomSwiss,
  11: friesClassic,
  12: friesPeriPeri,
  13: friesCheesy,
  14: friesCurly,
  15: friesTruffle,
  16: drinkCola,
  17: drinkMojito,
  18: drinkColdCoffee,
  19: drinkMangoSmoothie,
  20: drinkBerryLemonade,
  21: dessertCake,
  22: dessertChocoLava,
  23: dessertCheesecake,
  24: dessertRedVelvet,
  25: dessertBrownieSundae,
  26: noodlesChowmein,
  27: noodlesSchezwan,
  28: noodlesHakka,
  29: noodlesChilliGarlic,
  30: noodlesSingapore,
};

export function getFoodImage(imageKey, id) {
  if (imageKey && (imageKey.startsWith("http://") || imageKey.startsWith("https://") || imageKey.startsWith("data:") || imageKey.startsWith("/assets/"))) {
    return imageKey;
  }
  if (imageKey && imageMap[imageKey]) {
    return imageMap[imageKey];
  }
  if (id && imageMap[id]) {
    return imageMap[id];
  }
  return burgerClassic;
}
