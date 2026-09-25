import pizzaMargherita from "../assets/images/margherita-pizza.png";
import burgerDoubleBBQ from "../assets/images/double-bbq-burger.png";
import friesPeriPeri from "../assets/images/peri-peri-fries.png";
import dessertChocoLava from "../assets/images/choco-lava-cake.png";
import noodlesSchezwan from "../assets/images/schezwan-noodles.png";
import drinkMojito from "../assets/images/mint-mojito.png";
import drinkColdCoffee from "../assets/images/cold-coffee.png";
import dessertCheesecake from "../assets/images/ny-cheesecake.png";

export const foodReels = [
  {
    id: "reel-1",
    dishId: 1,
    title: "1-Meter Cheese Pull Margherita",
    tag: "🔥 VIRAL CRAVING",
    category: "Pizza",
    restaurant: "La Pino'z Pizza",
    price: "₹299",
    rating: "4.9",
    prepTime: "20 mins",
    calories: "280 kcal/slice",
    chefNote: "Stone-baked at 450°C for authentic blistered crust and endless mozzarella stretch.",
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    avatar: pizzaMargherita,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pizza-cheese-pull-out-of-the-oven-41477-large.mp4",
    likes: "14.2k",
    shares: "3.4k",
    comments: [
      { user: "Aarav K.", text: "That cheese stretch is insane!! Ordered immediately 🍕" },
      { user: "Riya M.", text: "Best crust in town hands down!" }
    ],
    hashtags: ["#CheesePull", "#MargheritaMadness", "#StoneBaked", "#FoodieGoViral"]
  },
  {
    id: "reel-2",
    dishId: 9,
    title: "Flame-Grilled Double BBQ Burger",
    tag: "🍔 JUICY SMASH",
    category: "Burger",
    restaurant: "Burger King",
    price: "₹269",
    rating: "4.8",
    prepTime: "15 mins",
    calories: "580 kcal",
    chefNote: "Double charred patties infused with hickory smoke glaze & sharp aged cheddar.",
    thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    avatar: burgerDoubleBBQ,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-burger-served-on-a-table-41481-large.mp4",
    likes: "21.8k",
    shares: "5.1k",
    comments: [
      { user: "Vikram S.", text: "The BBQ sauce drizzle is legendary 🔥" },
      { user: "Ananya D.", text: "Crispy edges and so juicy inside!" }
    ],
    hashtags: ["#BurgerCraze", "#SmashBurger", "#CheesyBite", "#FlameGrilled"]
  },
  {
    id: "reel-3",
    dishId: 12,
    title: "Fiery Peri-Peri Tossed Fries",
    tag: "🍟 SPICY CRUNCH",
    category: "Fries",
    restaurant: "Subway & FastBites",
    price: "₹169",
    rating: "4.9",
    prepTime: "10 mins",
    calories: "320 kcal",
    chefNote: "Crisped in small batches and tossed immediately in African bird's eye chili seasoning.",
    thumbnail: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    avatar: friesPeriPeri,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-french-fries-served-on-a-wooden-board-41480-large.mp4",
    likes: "18.5k",
    shares: "4.2k",
    comments: [
      { user: "Tanmay B.", text: "The peri peri punch is unmatched ❤️" },
      { user: "Sneha P.", text: "Stays super crunchy even after delivery!" }
    ],
    hashtags: ["#PeriPeriFries", "#CrunchZone", "#MidnightSnack"]
  },
  {
    id: "reel-4",
    dishId: 22,
    title: "Molten Dark Choco Lava Flow",
    tag: "🍫 CHOCO HEAVEN",
    category: "Dessert",
    restaurant: "The Belgian Waffle Co.",
    price: "₹149",
    rating: "4.9",
    prepTime: "12 mins",
    calories: "410 kcal",
    chefNote: "Warm Belgian cocoa sponge with a molten flowing ganache center.",
    thumbnail: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    avatar: dessertChocoLava,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chocolate-cake-with-flowing-chocolate-41483-large.mp4",
    likes: "32.4k",
    shares: "9.7k",
    comments: [
      { user: "Meera J.", text: "That warm chocolate fountain made my day 🤤" },
      { user: "Karan T.", text: "Pure bliss with vanilla ice cream!" }
    ],
    hashtags: ["#ChocoLava", "#DessertPorn", "#MoltenMagic", "#SweetTooth"]
  },
  {
    id: "reel-5",
    dishId: 27,
    title: "Fiery Schezwan Dragon Wok",
    tag: "🍜 WOK ON FIRE",
    category: "Noodles",
    restaurant: "Wow! Momo & Chinese",
    price: "₹189",
    rating: "4.8",
    prepTime: "15 mins",
    calories: "450 kcal",
    chefNote: "High flame tossed noodles infused with smoked red chili paste and scallions.",
    thumbnail: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    avatar: noodlesSchezwan,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-noodles-being-tossed-in-a-wok-41485-large.mp4",
    likes: "16.1k",
    shares: "3.8k",
    comments: [
      { user: "Devansh N.", text: "Spicy and full of garlic crunch!" },
      { user: "Pooja R.", text: "Authentic wok aroma, 10/10!" }
    ],
    hashtags: ["#WokLife", "#SchezwanNoodles", "#StreetChinese", "#SpicyEats"]
  },
  {
    id: "reel-6",
    dishId: 17,
    title: "Crushed Ice Mint Mojito Fizz",
    tag: "🍹 REFRESHING SIP",
    category: "Drinks",
    restaurant: "Starbucks / Chai Point",
    price: "₹129",
    rating: "4.8",
    prepTime: "8 mins",
    calories: "120 kcal",
    chefNote: "Muddled fresh garden mint, zesty lime wedges, and chilled sparkling soda.",
    thumbnail: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    avatar: drinkMojito,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-a-fresh-mojito-cocktail-41487-large.mp4",
    likes: "11.3k",
    shares: "2.1k",
    comments: [
      { user: "Harsh G.", text: "Instant summer refresher! Super bubbly." },
      { user: "Kavya S.", text: "Perfect pairing with burgers!" }
    ],
    hashtags: ["#MojitoMagic", "#IceCold", "#RefreshingVibes", "#BubblyDrinks"]
  },
  {
    id: "reel-7",
    dishId: 18,
    title: "Velvet Espresso Cold Coffee Frappe",
    tag: "☕ CREAMY CHILL",
    category: "Drinks",
    restaurant: "Starbucks / Chai Point",
    price: "₹159",
    rating: "4.9",
    prepTime: "8 mins",
    calories: "260 kcal",
    chefNote: "Slow-brewed dark roast espresso whipped with rich cream and vanilla scoop.",
    thumbnail: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    avatar: drinkColdCoffee,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-into-a-glass-with-ice-41489-large.mp4",
    likes: "25.9k",
    shares: "6.3k",
    comments: [
      { user: "Rahul M.", text: "Better than cafe coffee! Thick and rich." },
      { user: "Simran K.", text: "My go-to order every single afternoon." }
    ],
    hashtags: ["#ColdCoffeeLove", "#EspressoFrappe", "#CoffeeLovers", "#CreamyChill"]
  },
  {
    id: "reel-8",
    dishId: 23,
    title: "Classic New York Blueberry Cheesecake",
    tag: "🍰 ARTISANAL SLICE",
    category: "Dessert",
    restaurant: "The Belgian Waffle Co.",
    price: "₹219",
    rating: "4.9",
    prepTime: "10 mins",
    calories: "380 kcal",
    chefNote: "Buttery graham crumb crust with dense Philadelphia cream cheese and wild berry compote.",
    thumbnail: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    avatar: dessertCheesecake,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chocolate-cake-with-flowing-chocolate-41483-large.mp4",
    likes: "19.3k",
    shares: "4.8k",
    comments: [
      { user: "Shreya V.", text: "Melt in mouth texture! Loved the berry tang." },
      { user: "Aditya S.", text: "Authentic NY style. 100% recommended." }
    ],
    hashtags: ["#CheesecakeDelight", "#ArtisanalDesserts", "#SweetIndulgence"]
  }
];
