import { UtensilsCrossed, Sparkles } from "lucide-react";
import "../css/Categories.css";
import pizzaImg from "../assets/images/margherita-pizza.png";
import burgerImg from "../assets/images/classic Cheeseburger.png";
import friesImg from "../assets/images/french fries.png";
import drinksImg from "../assets/images/mint-mojito.png";
import dessertImg from "../assets/images/chocolate fudge cake.png";
import noodlesImg from "../assets/images/veg chowmein.png";

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    {
      id: 0,
      name: "All",
      label: "All Menu",
      isIcon: true
    },
    {
      id: 1,
      name: "Pizza",
      image: pizzaImg,
      label: "Gourmet Pizzas"
    },
    {
      id: 2,
      name: "Burger",
      image: burgerImg,
      label: "Juicy Burgers"
    },
    {
      id: 3,
      name: "Fries",
      image: friesImg,
      label: "Crispy Fries"
    },
    {
      id: 4,
      name: "Drinks",
      image: drinksImg,
      label: "Cool Drinks"
    },
    {
      id: 5,
      name: "Dessert",
      image: dessertImg,
      label: "Sweet Treats"
    },
    {
      id: 6,
      name: "Noodles",
      image: noodlesImg,
      label: "Wok Noodles"
    },
  ];

  return (
    <section className="categories-section">
      <div className="cat-header-wrap">
        <div className="cat-title-badge">
          <Sparkles size={12} className="inline-icon" /> FOOD CATEGORIES
        </div>
        <h2>Inspiration for Your Order</h2>
        <p>Explore top curated dishes by craving</p>
      </div>

      <div className="categories-scroll-container">
        {categories.map((item) => {
          const isSelected =
            (item.name === "All" && (!selectedCategory || selectedCategory === "")) ||
            selectedCategory?.toLowerCase() === item.name.toLowerCase();

          return (
            <div
              className={`category-item-card ${isSelected ? "active-category" : ""}`}
              key={item.id}
              onClick={() => setSelectedCategory(item.name === "All" ? "" : item.name)}
            >
              <div className="category-img-bubble">
                {item.isIcon ? (
                  <div className="cat-all-icon">
                    <UtensilsCrossed size={28} />
                  </div>
                ) : (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cat-real-img"
                    loading="lazy"
                  />
                )}
              </div>
              <h4 className="cat-name">{item.name}</h4>
              <small className="cat-sub">{item.label}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Categories;