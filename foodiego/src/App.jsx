import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Restaurants from "./components/Restaurants";
import PopularFoods from "./components/PopularFoods";
import RestaurantMenu from "./components/RestaurantMenu";
import OrderTracking from "./components/OrderTracking";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Orders from "./components/Orders";
import SearchResults from "./components/SearchResults";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import StickyBottomCart from "./components/StickyBottomCart";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState(""); // rating | fast | bestseller | under199

  return (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <Restaurants />

      <PopularFoods
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        activeFilter={activeFilter}
      />
    </>
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        <Route path="/track/:orderId" element={<OrderTracking />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />

      {/* Global Floating Components */}
      <StickyBottomCart />
      <Toast />
    </>
  );
}

export default App;