import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import CheckoutForm from './pages/CheckoutForm';
import CompareDrawer from './components/CompareDrawer';
import CartDrawer from './components/CartDrawer';
import { FiGrid, FiHeart, FiShoppingCart, FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

function AppContent() {
  const {
    cart,
    wishlist,
    darkMode,
    toggleTheme
  } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleWishlistClick = () => {
    if (wishlist.length === 0) {
      alert("Your wishlist is empty!");
      return;
    }
    const listNames = wishlist.map(p => `• ${p.name} ($${p.price})`).join('\n');
    alert(`Your Wishlist Items:\n\n${listNames}`);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
        
        {/* Standalone Content Area */}
        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
          <Routes>
            {/* Product Catalog Listing */}
            <Route path="/" element={<Products />} />
            
            {/* Product Details page */}
            <Route path="/product/:slug" element={<ProductDetails />} />

            {/* Checkout pages */}
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/details" element={<CheckoutForm />} />
          </Routes>
        </main>

        {/* Bottom compare widgets */}
        <CompareDrawer />

        {/* Global Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        {/* Floating Utility Menu (Bottom Right Dock) */}
        <div className="fixed bottom-6 right-6 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2.5 flex items-center gap-2.5">
          {/* Catalog Home */}
          <Link
            to="/"
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 rounded-xl transition-all"
            title="View Catalog"
          >
            <FiGrid className="w-5.5 h-5.5" />
          </Link>

          {/* Wishlist count */}
          <button
            onClick={handleWishlistClick}
            className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
            title="Wishlist"
          >
            <FiHeart className="w-5.5 h-5.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 rounded-xl transition-all cursor-pointer"
            title="Cart"
          >
            <FiShoppingCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                {cartCount}
              </span>
            )}
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-500 rounded-xl transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <FiSun className="w-5.5 h-5.5" /> : <FiMoon className="w-5.5 h-5.5" />}
          </button>
        </div>
        
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
