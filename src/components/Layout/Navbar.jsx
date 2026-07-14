import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Cpu } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DEFAULT_SITE_SETTINGS, DEFAULT_NAV_LINKS } from '../../data/siteContent';
import { resolveUploadUrl } from '../../api/shopApi';

export default function Navbar({ activeTab, onTabChange, cartCount }) {
  const { products, siteSettings, navLinks: apiNavLinks } = useShop();
  const brandName = siteSettings?.brand_name || DEFAULT_SITE_SETTINGS.brand_name;
  const brandSubtitle = siteSettings?.brand_subtitle || DEFAULT_SITE_SETTINGS.brand_subtitle;
  const navLogoUrl = siteSettings?.nav_logo
    ? resolveUploadUrl(siteSettings.nav_logo)
    : DEFAULT_SITE_SETTINGS.nav_logo;
  const navLogoAlt = siteSettings?.nav_logo_alt || DEFAULT_SITE_SETTINGS.nav_logo_alt || brandName;
  const navigate = useNavigate();
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
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.model.toLowerCase().includes(query.toLowerCase())
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = (apiNavLinks?.length ? apiNavLinks : DEFAULT_NAV_LINKS).filter(
    (l) => l.is_active !== 0 && l.is_active !== false
  );

  const handleNavClick = (link) => {
    if (link.link_key) {
      onTabChange?.(link.link_key);
    } else {
      navigate(link.url);
    }
  };

  return (
    <header className="relative bg-white border-b border-gray-100 w-full shadow-md">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center min-h-[60px] sm:min-h-[72px] md:min-h-[84px] py-3 sm:py-4">
          
          {/* Logo Section */}
          <div 
            className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
            onClick={() => onTabChange?.('home')}
          >
            {/* Logo */}
            {navLogoUrl ? (
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden group-hover:border-[#0fafb8]/30 transition-colors">
                <img src={navLogoUrl} alt={navLogoAlt} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-gray-50 flex items-center justify-center p-1 group-hover:border-[#0fafb8]/30 transition-colors">
                <div className="w-full h-full rounded-full border border-dashed border-[#0fafb8] flex items-center justify-center text-[#0fafb8] bg-[#0fafb8]/5">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-sans text-[16px] sm:text-[20px] md:text-[24px] font-extrabold tracking-tight leading-none text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                {brandName}
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-[#0fafb8] tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-0.5 sm:mt-1 truncate">
                {brandSubtitle}
              </span>
            </div>
          </div>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className={`text-[15px] transition-colors ${
                    activeTab === link.link_key
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
          <div className="hidden lg:flex items-center gap-5">
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
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => onTabChange?.('cart')}
              className="icon relative w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                {cartCount || 0}
              </span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="icon text-gray-700 p-1 hover:text-[#0fafb8] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Slide-over Drawer */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Content */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-white shadow-2xl p-6 flex flex-col gap-6 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {navLogoUrl ? (
                <img src={navLogoUrl} alt={navLogoAlt} className="w-8 h-8 object-contain" />
              ) : (
                <Cpu className="w-6 h-6 text-[#0fafb8]" />
              )}
              <span className="font-extrabold text-gray-900 tracking-tight text-lg">{brandName}</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="relative">
            <div className="relative flex items-center w-full h-[44px] bg-gray-50 border border-gray-200 rounded-full overflow-hidden focus-within:border-[#0fafb8] transition-colors">
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleSearchKeyPress}
                className="w-full h-full pl-5 pr-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
              />
              <button onClick={handleSearch} className="absolute right-0 h-full w-[46px] bg-gray-100 border-l border-gray-200 flex items-center justify-center text-gray-500 hover:bg-[#0fafb8] hover:text-white transition-colors cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[250px] overflow-y-auto">
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
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#0fafb8]">${product.price}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  handleNavClick(link);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-sm px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeTab === link.link_key
                  ? 'text-[#0fafb8] bg-[#0fafb8]/5 font-bold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
