import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FlashSaleSection from "./components/FlashSaleSection";
import Restaurants from "./components/Restaurants";
import BrandShowcase from "./components/BrandShowcase";
import PromoBannersGrid from "./components/PromoBannersGrid";
import PopularFoods from "./components/PopularFoods";
import CustomerReviews from "./components/CustomerReviews";
import WhyChooseUs from "./components/WhyChooseUs";
import AppDownloadSection from "./components/AppDownloadSection";
import RestaurantMenu from "./components/RestaurantMenu";
import OrderTracking from "./components/OrderTracking";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import UserAccount from "./components/UserAccount";
import ReturnsRefunds from "./components/ReturnsRefunds";
import OffersPage from "./components/OffersPage";
import NotificationsPage from "./components/NotificationsPage";
import CustomerSupport from "./components/CustomerSupport";
import StaticPages from "./components/StaticPages";
import ShopPage from "./components/ShopPage";
import ProductDetails from "./components/ProductDetails";
import Login from "./components/Login";
import SearchResults from "./components/SearchResults";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import StickyBottomCart from "./components/StickyBottomCart";
import MobileBottomNav from "./components/MobileBottomNav";
import SocialProofToast from "./components/SocialProofToast";
import CompareDrawer from "./components/CompareDrawer";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState(""); // rating | fast | bestseller | under199

  return (
    <>
      {/* 1. Hero with Omnisearch & Quick Filters */}
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* 2. Featured Food Categories */}
      <Categories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 3. Limited-Time Flash Sale with Live Countdown */}
      <FlashSaleSection />

      {/* 4. Promotional Deals & BOGO Banners */}
      <PromoBannersGrid />

      {/* 5. Top Partner Restaurants */}
      <Restaurants />

      {/* 6. Popular / Trending Foods Catalog */}
      <PopularFoods
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        activeFilter={activeFilter}
      />

      {/* 7. Official Brand Showcase */}
      <BrandShowcase />

      {/* 8. Customer Testimonials & Social Proof */}
      <CustomerReviews />

      {/* 9. Why Choose FoodieGo Trust Pillars */}
      <WhyChooseUs />

      {/* 10. Mobile App Download Promo */}
      <AppDownloadSection />
    </>
  );
}

// Scroll to top helper on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main View Router */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Shop & Catalog */}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />

          {/* Cart & Checkout Flow */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/track/:orderId" element={<OrderTracking />} />

          {/* User Account & Dashboard */}
          <Route path="/account" element={<UserAccount />} />
          <Route path="/account/:tab" element={<UserAccount />} />
          <Route path="/orders" element={<UserAccount initialTab="orders" />} />
          <Route path="/returns" element={<ReturnsRefunds />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/login" element={<Login />} />

          {/* Support & FAQs */}
          <Route path="/help" element={<CustomerSupport />} />
          <Route path="/faq" element={<CustomerSupport />} />

          {/* Static Legal & Company Pages */}
          <Route path="/about" element={<StaticPages pageType="about" />} />
          <Route path="/contact" element={<StaticPages pageType="contact" />} />
          <Route path="/privacy" element={<StaticPages pageType="privacy" />} />
          <Route path="/terms" element={<StaticPages pageType="terms" />} />
          <Route path="/shipping-policy" element={<StaticPages pageType="shipping" />} />
          <Route path="/returns-policy" element={<StaticPages pageType="returns" />} />
          <Route path="/cancellation-policy" element={<StaticPages pageType="cancellation" />} />
          <Route path="/warranty" element={<StaticPages pageType="warranty" />} />
          <Route path="/seller-info" element={<StaticPages pageType="seller-info" />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Overlays & Floating Smart Shopping Widgets */}
      <MobileBottomNav />
      <SocialProofToast />
      <CompareDrawer />
      <StickyBottomCart />
      <Toast />
    </div>
  );
}

export default App;