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
import "./App.css";

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
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/details" element={<CheckoutForm />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
