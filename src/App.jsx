import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAppState } from "./hooks/useAppState";
import AppLayout from "./components/Layout/AppLayout";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import CheckoutForm from "./pages/CheckoutForm";
import Blogs from "./pages/Home";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Wishlist from "./pages/Wishlist";
import "./App.css";
import "./styles/responsive-improvements.css";

function App() {
  const appState = useAppState();

  return (
    <AppLayout {...appState}>
      <Routes>
        <Route
          path="/"
          element={
            <Blogs
              currentUser={appState.currentUser}
              selectedBlog={appState.selectedBlog}
              setSelectedBlog={appState.handleSetSelectedBlog}
              wishlistItems={appState.wishlistItems}
              setWishlistItems={appState.setWishlistItems}
              projects={appState.projectsList}
              onTabChange={appState.handleTabChange}
            />
          }
        />
        <Route
          path="/products"
          element={<Products onQuickView={appState.setQuickViewProduct} />}
        />
        <Route
          path="/product/:slug"
          element={
            <ProductDetails onQuickView={appState.setQuickViewProduct} />
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/details" element={<CheckoutForm />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
    </AppLayout>
  );
}

export default App;