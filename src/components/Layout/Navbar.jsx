import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Cpu } from 'lucide-react';
import { products } from '../../data/products';

export default function Navbar({ activeTab, onTabChange, cartCount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleSearchInput = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length >= 1) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onTabChange?.('products');
      sessionStorage.setItem('searchQuery', searchQuery);
      setShowDropdown(false);
      setSearchQuery('');
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleProductClick = (product) => {
    onTabChange?.('products');
    sessionStorage.setItem('selectedProduct', product.id);
    setShowDropdown(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          !searchInputRef.current?.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'blogs', label: 'Blog' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="bg-white border-b border-gray-100 w-full shadow-md">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[90px]">
          
          {/* Logo Section */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => onTabChange?.('home')}
          >
            {/* Tech Icon Logo */}
            <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-gray-50 flex items-center justify-center p-1 group-hover:border-[#0fafb8]/30 transition-colors">
              <div className="w-full h-full rounded-full border border-dashed border-[#0fafb8] flex items-center justify-center text-[#0fafb8] bg-[#0fafb8]/5">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <span 
                className="font-sans text-[24px] font-extrabold tracking-tight leading-none text-gray-900"
              >
                Swift Sign
              </span>
              <span className="text-[10px] font-bold text-[#0fafb8] tracking-[0.25em] uppercase mt-1">
                Electronics
              </span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onTabChange?.(link.id)}
                  className={`text-[15px] transition-colors ${
                    activeTab === link.id 
                    ? 'text-[#0fafb8] font-bold' 
                    : 'text-gray-600 hover:text-[#0fafb8] font-semibold'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Section (Search & Cart) */}
          <div className="hidden md:flex items-center gap-5">
            {/* Search Bar */}
            <div className="relative w-[260px]">
              <div className="relative flex items-center h-[40px] bg-gray-50 border border-gray-200 rounded-full overflow-hidden group focus-within:border-[#0fafb8]/50 focus-within:ring-2 focus-within:ring-[#0fafb8]/10 transition-all">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full h-full pl-4 pr-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-0 h-full w-[46px] bg-gray-100 border-l border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#0fafb8] hover:text-white hover:border-[#0fafb8] transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {showDropdown && searchResults.length > 0 && (
                <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#0fafb8]">${product.price}</p>
                    </button>
                  ))}
                  {searchResults.length > 0 && (
                    <button
                      onClick={handleSearch}
                      className="w-full px-4 py-2 text-center text-sm font-medium text-[#0fafb8] hover:bg-gray-50 border-t border-gray-100 transition-colors"
                    >
                      View all results
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button 
              onClick={() => onTabChange?.('cart')}
              className="relative w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:text-[#0fafb8] hover:border-[#0fafb8]/30 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* Alert Badge */}
              <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount || 0}
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => onTabChange?.('cart')}
              className="relative w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                {cartCount || 0}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 p-1 hover:text-[#0fafb8] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[90px] left-0 w-full bg-white border-b border-gray-100 shadow-xl py-4 px-6 z-50">
          {/* Mobile Search */}
          <div className="relative mb-6">
            <div className="relative flex items-center w-full h-[44px] bg-gray-50 border border-gray-200 rounded-full overflow-hidden focus-within:border-[#0fafb8] transition-colors">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleSearchKeyPress}
                className="w-full h-full pl-5 pr-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
              />
              <button onClick={handleSearch} className="absolute right-0 h-full w-[46px] bg-gray-100 border-l border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#0fafb8] hover:text-white transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      handleProductClick(product);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#0fafb8]">${product.price}</p>
                  </button>
                ))}
                {searchResults.length > 0 && (
                  <button
                    onClick={() => {
                      handleSearch();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-center text-sm font-medium text-[#0fafb8] hover:bg-gray-50 border-t border-gray-100 transition-colors"
                  >
                    View all results
                  </button>
                )}
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange?.(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-[16px] px-4 py-3 rounded-lg transition-colors ${
                  activeTab === link.id 
                  ? 'text-[#0fafb8] bg-[#0fafb8]/10 font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 font-semibold'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
