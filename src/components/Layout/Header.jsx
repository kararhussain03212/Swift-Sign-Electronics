import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiShoppingCart, FiHeart, FiCpu, FiMenu, FiX, FiActivity, FiSearch } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';
import CartDrawer from '../Cart/CartDrawer';

export default function Header({ onSearchChange, searchValue }) {
  const navigate = useNavigate();
  const {
    cart,
    wishlist,
    compareList,
    darkMode,
    toggleTheme
  } = useShop();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const compareCount = compareList.length;

  const handleWishlistClick = () => {
    if (wishlist.length === 0) {
      alert("Your wishlist is empty!");
      return;
    }
    const listNames = wishlist.map(p => `• ${p.name} ($${p.price})`).join('\n');
    alert(`Your Wishlist Items:\n\n${listNames}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 select-none group flex-shrink-0">
            <div className="p-2.5 bg-blue-600 text-white rounded-none group-hover:scale-105 transition-all shadow-md shadow-blue-500/20">
              <FiCpu className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight uppercase tracking-wider">
                Swift Sign
              </span>
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none">
                Electronics
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-650 dark:text-slate-350">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <div className="relative group/cat">
              <button className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-none shadow-xl py-2.5 opacity-0 pointer-events-none group-hover/cat:opacity-100 group-hover/cat:pointer-events-auto transition-all duration-200 translate-y-2 group-hover/cat:translate-y-0">
                <Link to="/" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-blue-500 text-slate-700 dark:text-slate-300">
                  Tools
                </Link>
                <Link to="/" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-blue-500 text-slate-700 dark:text-slate-300">
                  Instruments
                </Link>
                <Link to="/" className="block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-blue-500 text-slate-700 dark:text-slate-300">
                  Projects
                </Link>
              </div>
            </div>
            <a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About Lab
            </a>
            <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search bar inside header (Desktop) */}
          {onSearchChange && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs xl:max-w-md w-full">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-4 pr-10 py-2 text-sm bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500/25 dark:focus:ring-blue-400/25 text-slate-800 dark:text-slate-200"
              />
              <FiSearch className="absolute right-3.5 text-slate-400 pointer-events-none" />
            </form>
          )}

          {/* Actions & Utilities */}
          <div className="flex items-center gap-1.5 md:gap-3.5">


            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-400 hover:text-blue-500 rounded-none transition-all cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={handleWishlistClick}
              className="relative p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-400 hover:text-red-500 rounded-none transition-all cursor-pointer"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-660 dark:text-slate-400 hover:text-blue-500 rounded-none transition-all cursor-pointer"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle (Hamburger) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-none transition-all cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-4">
            {onSearchChange && (
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search components..."
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-100/60 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200"
                />
                <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450" />
              </form>
            )}
            <nav className="flex flex-col gap-3 font-bold text-slate-700 dark:text-slate-300">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                Home
              </Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                Tools
              </Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                Instruments
              </Link>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                Projects
              </Link>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5 border-b border-slate-100 dark:border-slate-800/50">
                About Lab
              </a>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-500 py-1.5">
                Contact Us
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Slider */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
