import { useState, useEffect } from "react";
import api from "../../services/api";
import { getFoodImage } from "../../utils/foodImages";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  UtensilsCrossed,
  X,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon
} from "lucide-react";

// Preset image filenames available in FoodieGo assets
const PRESET_IMAGES = [
  { label: "Classic Cheeseburger", value: "classic Cheeseburger.png" },
  { label: "Margherita Pizza", value: "margherita-pizza.png" },
  { label: "Farmhouse Pizza", value: "farmhouse pizza.png" },
  { label: "French Fries", value: "french fries.png" },
  { label: "Peri Peri Fries", value: "peri-peri-fries.png" },
  { label: "Cheesy Fries", value: "cheesy-fries.png" },
  { label: "Veg Chowmein", value: "veg chowmein.png" },
  { label: "Schezwan Noodles", value: "schezwan-noodles.png" },
  { label: "Hakka Noodles", value: "hakka-noodles.png" },
  { label: "Choco Lava Cake", value: "choco-lava-cake.png" },
  { label: "Chocolate Fudge Cake", value: "chocolate fudge cake.png" },
  { label: "Cold Coffee Brew", value: "cold-coffee.png" },
  { label: "Mint Mojito Cooler", value: "mint-mojito.png" },
  { label: "Mango Smoothie", value: "mango-smoothie.png" },
  { label: "Soft Drink / Cola", value: "soft drink.png" },
];

const CATEGORIES = ["Pizza", "Burger", "Beverages", "Dessert", "Noodles", "Fries"];

export default function AdminMenu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null); // null = Add mode, object = Edit mode
  const [deleteConfirmFood, setDeleteConfirmFood] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Pizza",
    price: "",
    rating: "⭐ 4.8",
    image: "margherita-pizza.png",
    customImage: "",
    description: "",
    is_available: 1
  });

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const query = selectedCategory !== "All" ? `?category=${encodeURIComponent(selectedCategory)}` : "";
      const res = await api.get(`/foods${query}`);
      if (res.success && res.foods) {
        setFoods(res.foods);
      }
    } catch (err) {
      console.error("Failed to load menu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory]);

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingFood(null);
    setFormData({
      name: "",
      category: selectedCategory !== "All" ? selectedCategory : "Pizza",
      price: "",
      rating: "⭐ 4.8",
      image: "margherita-pizza.png",
      customImage: "",
      description: "",
      is_available: 1
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (food) => {
    setEditingFood(food);
    const isPreset = PRESET_IMAGES.some(p => p.value === food.image);
    setFormData({
      name: food.name,
      category: food.category,
      price: food.price.replace("₹", ""),
      rating: food.rating || "⭐ 4.8",
      image: isPreset ? food.image : "custom",
      customImage: isPreset ? "" : food.image,
      description: food.description || "",
      is_available: food.is_available !== undefined ? food.is_available : 1
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast("Please provide dish name and price", true);
      return;
    }

    try {
      setSaving(true);
      const chosenImage = formData.image === "custom" && formData.customImage.trim()
        ? formData.customImage.trim()
        : formData.image;

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: `₹${formData.price.toString().replace("₹", "")}`,
        rating: formData.rating || "⭐ 4.8",
        image: chosenImage || "margherita-pizza.png",
        description: formData.description.trim(),
        is_available: formData.is_available ? 1 : 0
      };

      if (editingFood) {
        // Edit Mode
        const res = await api.put(`/foods/${editingFood.id}`, payload);
        if (res.success) {
          setFoods(prev => prev.map(f => f.id === editingFood.id ? { ...f, ...payload } : f));
          showToast(`'${payload.name}' updated successfully!`);
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to update item", true);
        }
      } else {
        // Add Mode
        const res = await api.post("/foods", payload);
        if (res.success && res.food) {
          setFoods(prev => [res.food, ...prev]);
          showToast(`'${payload.name}' added to Menu!`);
          setModalOpen(false);
        } else {
          showToast(res.message || "Failed to add item", true);
        }
      }
    } catch (err) {
      console.error("Save food error:", err);
      showToast("Error saving food item", true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStock = async (food) => {
    try {
      const res = await api.patch(`/foods/${food.id}/availability`);
      if (res.success) {
        setFoods(prev =>
          prev.map(f => f.id === food.id ? { ...f, is_available: res.is_available } : f)
        );
        showToast(`${food.name} is now ${res.is_available ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      console.error("Stock toggle error:", err);
      showToast("Failed to toggle stock status", true);
    }
  };

  const handleDeleteFood = async () => {
    if (!deleteConfirmFood) return;
    try {
      const res = await api.delete(`/foods/${deleteConfirmFood.id}`);
      if (res.success) {
        setFoods(prev => prev.filter(f => f.id !== deleteConfirmFood.id));
        showToast(`Item removed from menu.`);
        setDeleteConfirmFood(null);
      } else {
        showToast(res.message || "Failed to delete item", true);
      }
    } catch (err) {
      console.error("Delete food error:", err);
      showToast("Error deleting food item", true);
    }
  };

  // Search filter
  const filteredFoods = foods.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "#0f172a",
          color: "#fff",
          padding: "0.85rem 1.4rem",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontWeight: 600,
          fontSize: "0.9rem"
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Menu & Dishes Catalog (CRUD)
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>
            Add new recipes, update dish pricing, adjust stock availability, and manage categories.
          </p>
        </div>

        <button onClick={handleOpenAddModal} className="admin-btn admin-btn-primary">
          <PlusCircle size={18} />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="admin-table-controls">
        <div className="admin-search-box">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search dishes by name or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`admin-filter-btn ${selectedCategory === "All" ? "active" : ""}`}
          >
            All Categories ({foods.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`admin-filter-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Dish</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Stock Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#ff6b00" }}>
                  <RefreshCw size={28} className="spin-animation" style={{ animation: "spin 1s linear infinite", margin: "0 auto 0.5rem" }} />
                  <div>Loading restaurant menu...</div>
                </td>
              </tr>
            ) : filteredFoods.length > 0 ? (
              filteredFoods.map((food) => (
                <tr key={food.id}>
                  <td>
                    <div className="admin-food-item-cell">
                      <div className="admin-food-thumb" style={{ overflow: "hidden", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img
                          src={getFoodImage(food.image, food.id)}
                          alt={food.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <div>
                        <div className="admin-food-title">{food.name}</div>
                        <div className="admin-food-cat">{food.description ? food.description.slice(0, 50) + "..." : "Delicious gourmet dish"}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ background: "#f1f5f9", padding: "3px 10px", borderRadius: "6px", fontWeight: 700, fontSize: "0.8rem", color: "#475569" }}>
                      {food.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                    {food.price}
                  </td>
                  <td>
                    <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.85rem" }}>
                      {food.rating || "⭐ 4.8"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={food.is_available !== 0}
                          onChange={() => handleToggleStock(food)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: food.is_available !== 0 ? "#10b981" : "#ef4444" }}>
                        {food.is_available !== 0 ? "In Stock" : "Sold Out"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => handleOpenEditModal(food)}
                        className="admin-icon-btn"
                        title="Edit Dish Details"
                      >
                        <Edit2 size={15} color="#3b82f6" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmFood(food)}
                        className="admin-icon-btn"
                        title="Delete Dish"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  <UtensilsCrossed size={40} style={{ margin: "0 auto 0.75rem", opacity: 0.5 }} />
                  <div style={{ fontWeight: 600, fontSize: "1rem" }}>No dishes found</div>
                  <div style={{ fontSize: "0.82rem", marginTop: "4px" }}>Try clicking 'Add New Dish' to add items.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dish Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                {editingFood ? `Edit '${editingFood.name}'` : "Add New Dish to Menu"}
              </div>
              <button className="admin-toggle-btn" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-form-grid">
                <div className="admin-form-group full-width">
                  <label>Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Truffle Paneer Supreme Pizza"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 299"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Rating Display</label>
                  <input
                    type="text"
                    placeholder="e.g. ⭐ 4.9"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Dish Image Preset</label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  >
                    {PRESET_IMAGES.map((img) => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                    <option value="custom">Custom Image URL</option>
                  </select>
                </div>

                {formData.image === "custom" && (
                  <div className="admin-form-group full-width">
                    <label>Custom Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.customImage}
                      onChange={(e) => setFormData({ ...formData, customImage: e.target.value })}
                    />
                  </div>
                )}

                <div className="admin-form-group full-width">
                  <label>Description & Ingredients</label>
                  <textarea
                    rows={3}
                    placeholder="Freshly tossed thin crust topped with premium mozzarella, marinara, and fresh herbs."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="admin-form-group full-width" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
                  <input
                    type="checkbox"
                    id="stockCheck"
                    checked={formData.is_available === 1}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked ? 1 : 0 })}
                    style={{ width: "18px", height: "18px" }}
                  />
                  <label htmlFor="stockCheck" style={{ margin: 0, cursor: "pointer" }}>
                    Immediately Available in Kitchen (In Stock)
                  </label>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setModalOpen(false)} className="admin-btn admin-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? "Saving..." : editingFood ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmFood && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmFood(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px", textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#fee2e2", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <AlertTriangle size={32} />
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.5rem" }}>
              Delete '{deleteConfirmFood.name}'?
            </h3>
            <p style={{ color: "#6b7280", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              Are you sure you want to permanently remove this dish from the menu? This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirmFood(null)} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
              <button onClick={handleDeleteFood} className="admin-btn admin-btn-danger">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
