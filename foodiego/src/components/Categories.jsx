import "../css/Categories.css";

function Categories({ selectedCategory, setSelectedCategory }) {
  const categories = [
    { id: 0, name: "All", emoji: "🍽️", label: "All Items" },
    { id: 1, name: "Pizza", emoji: "🍕", label: "Gourmet Pizzas" },
    { id: 2, name: "Burger", emoji: "🍔", label: "Juicy Burgers" },
    { id: 3, name: "Fries", emoji: "🍟", label: "Crispy Fries" },
    { id: 4, name: "Drinks", emoji: "🥤", label: "Cool Drinks" },
    { id: 5, name: "Dessert", emoji: "🍰", label: "Sweet Treats" },
    { id: 6, name: "Noodles", emoji: "🍜", label: "Wok Noodles" },
  ];

  return (
    <section className="categories-section">
      <div className="cat-header-wrap">
        <h2>Inspiration for Your Order ✨</h2>
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
              <div className="category-emoji-bubble">
                <span className="cat-emoji">{item.emoji}</span>
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