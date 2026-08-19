import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import PopularFoods from "./components/PopularFoods";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Orders from "./components/Orders";
import SearchResults from "./components/SearchResults";
import Footer from "./components/Footer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Categories
        setSelectedCategory={setSelectedCategory}
      />

      <PopularFoods
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
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
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;