import "../css/Categories.css";

function Categories({ setSelectedCategory }) {
  const categories = [
    { id: 0, name: "All", emoji: "🍽️" },
    { id: 1, name: "Burger", emoji: "🍔" },
    { id: 2, name: "Pizza", emoji: "🍕" },
    { id: 3, name: "Fries", emoji: "🍟" },
    { id: 4, name: "Drinks", emoji: "🥤" },
    { id: 5, name: "Dessert", emoji: "🍰" },
    { id: 6, name: "Noodles", emoji: "🍜" },
  ];

  return (
    <section className="categories">
      <h2>Browse By Categories</h2>

      <div className="category-container">
        {categories.map((item) => (
          <div
            className="category-card"
            key={item.id}
            onClick={() =>
            setSelectedCategory(item.name === "All" ? "" : item.name)
          }
          >
            <span>{item.emoji}</span>
            <h3>{item.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Categories;