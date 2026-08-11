import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Cpu, ChevronDown, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { DEFAULT_SITE_SETTINGS, DEFAULT_NAV_LINKS } from '../../data/siteContent';
import { resolveUploadUrl } from '../../api/shopApi';

export default function Navbar({ activeTab, onTabChange, cartCount }) {
  const { products, siteSettings, navLinks: apiNavLinks, productCategories, wishlist } = useShop();
  const wishlistCount = (wishlist || []).length;
  const categories = (productCategories || []).filter(
    (cat) => cat.cat_key !== 'all' && cat.is_active !== 0 && cat.is_active !== false
  );
  const brandName = siteSettings?.brand_name || DEFAULT_SITE_SETTINGS.brand_name;
  const navLogoUrl = siteSettings?.nav_logo
    ? resolveUploadUrl(siteSettings.nav_logo)
    : DEFAULT_SITE_SETTINGS.nav_logo;
  const navLogoAlt = siteSettings?.nav_logo_alt || DEFAULT_SITE_SETTINGS.nav_logo_alt || brandName;
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileExpandedLink, setMobileExpandedLink] = useState(null);
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
        product.model.toLowerCase().includes(query.toLowerCase()) ||
        (product.SKU && product.SKU.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 20);
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
    navigate(`/product/${product.slug}`);
    setIsSearchSidebarOpen(false);
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
            className="flex-shrink-0 flex items-center cursor-pointer group"
            onClick={() => onTabChange?.('home')}
          >
            {/* Logo */}
            {navLogoUrl ? (
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center overflow-hidden transition-colors hover:border-[#0fafb8]">
                <img src={navLogoUrl} alt={navLogoAlt} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 bg-gray-50 flex items-center justify-center p-1 transition-colors hover:border-[#0fafb8]">
                <div className="w-full h-full rounded-full border border-dashed border-[#0fafb8] flex items-center justify-center text-[#0fafb8] bg-[#0fafb8]/5">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isProductsLink = link.link_key === 'products';
                const dropdownItems = isProductsLink
                  ? []
                  : (link.items || []).filter(
                      (item) => item.is_active !== 0 && item.is_active !== false
                    );
                const hasDropdown = dropdownItems.length > 0 || (isProductsLink && categories.length > 0);

                return (
                  <div key={link.id} className="relative group">
                    <button
                      onClick={() => handleNavClick(link)}
                      className={`flex items-center gap-1 text-[15px] transition-colors py-4 ${
                        activeTab === link.link_key
                        ? 'text-[#0fafb8] font-bold'
                        : 'text-gray-600 hover:text-[#0fafb8] font-semibold'
                      }`}
                    >
                      {link.label}
                      {hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {hasDropdown && (
                      <div className="absolute top-[100%] -left-4 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                         <div className="w-56 shadow-xl border border-gray-100 bg-white rounded-xl overflow-hidden py-2 flex flex-col">
                           {dropdownItems.length > 0
                             ? dropdownItems.map((item) => (
                                 <button
                                   key={item.id}
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     navigate(item.url);
                                   }}
                                   className="text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-[#0fafb8]/5 hover:text-[#0fafb8] transition-colors"
                                 >
                                   {item.label}
                                 </button>
                               ))
                             : categories.map((cat) => (
                                 <button
                                   key={cat.id}
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     navigate(`/products/${cat.cat_key}`);
                                   }}
                                   className="text-left px-5 py-2.5 text-sm text-gray-700 hover:bg-[#0fafb8]/5 hover:text-[#0fafb8] transition-colors"
                                 >
                                   {cat.name}
                                 </button>
                               ))}
                         </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Right Section (Search Icon & Cart) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Search Icon Button */}
            <button
              onClick={() => setIsSearchSidebarOpen(true)}
              className="relative flex items-center justify-center text-gray-700 hover:text-[#0fafb8] transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-6 h-6" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate('/wishlist')}
              className="relative flex items-center justify-center text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
              title="View Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => onTabChange?.('cart')}
              className="relative flex items-center justify-center text-gray-700 hover:text-[#0fafb8] transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              {/* Alert Badge */}
              <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount || 0}
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setIsSearchSidebarOpen(true)}
              className="icon relative flex items-center justify-center text-gray-700"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="icon relative flex items-center justify-center text-gray-700"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange?.('cart')}
              className="icon relative flex items-center justify-center text-gray-700"
            >
              <ShoppingCart className="w-5 h-5" />
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

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1">
            {navLinks.map((link) => {
              const isProductsLink = link.link_key === 'products';
              const dropdownItems = isProductsLink
                ? []
                : (link.items || []).filter(
                    (item) => item.is_active !== 0 && item.is_active !== false
                  );
              const hasDropdown = dropdownItems.length > 0 || (isProductsLink && categories.length > 0);
              const isExpanded = mobileExpandedLink === link.id;

              return (
                <div key={link.id}>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        handleNavClick(link);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex-1 text-left text-sm px-4 py-3 rounded-xl transition-all cursor-pointer ${
                        activeTab === link.link_key
                        ? 'text-[#0fafb8] bg-[#0fafb8]/5 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-semibold'
                      }`}
                    >
                      {link.label}
                    </button>
                    {hasDropdown && (
                      <button
                        onClick={() => setMobileExpandedLink(isExpanded ? null : link.id)}
                        className="p-3 text-gray-500 hover:text-[#0fafb8] cursor-pointer"
                        aria-label="Toggle submenu"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasDropdown && isExpanded && (
                    <div className="flex flex-col gap-1 pl-4">
                      {dropdownItems.length > 0
                        ? dropdownItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                navigate(item.url);
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-left text-sm px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
                            >
                              {item.label}
                            </button>
                          ))
                        : categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                navigate(`/products/${cat.cat_key}`);
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-left text-sm px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all cursor-pointer"
                            >
                              {cat.name}
                            </button>
                          ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Search Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSearchSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsSearchSidebarOpen(false)}
        />

        {/* Sidebar Content */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
            isSearchSidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Search Products</h2>
            <button
              onClick={() => setIsSearchSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6 pt-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative flex items-center w-full h-11 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#0fafb8] focus-within:ring-2 focus-within:ring-[#0fafb8]/10 transition-all">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={handleSearchInput}
                onKeyPress={handleSearchKeyPress}
                className="w-full h-full pl-4 pr-12 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-0 h-full w-11 flex items-center justify-center text-gray-500 hover:text-[#0fafb8] transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Results Container */}
          <div className="flex-1 overflow-y-auto">
            {showDropdown && searchResults.length > 0 && (
              <div ref={dropdownRef} className="divide-y divide-gray-100">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      handleProductClick(product);
                      setIsSearchSidebarOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#0fafb8] flex-shrink-0">${product.price}</p>
                  </button>
                ))}
              </div>
            )}

            {/* View All Results Button */}
            {showDropdown && searchResults.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                <button
                  onClick={() => {
                    handleSearch();
                    setIsSearchSidebarOpen(false);
                  }}
                  className="w-full px-4 py-3 text-center text-sm font-bold text-white bg-[#0fafb8] hover:bg-[#0d9ba4] rounded-lg transition-colors"
                >
                  View all results
                </button>
              </div>
            )}

            {/* Empty State */}
            {searchQuery.trim() && searchResults.length === 0 && !showDropdown && (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                  <p className="text-sm text-gray-600">No products found matching</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">"{searchQuery}"</p>
                </div>
              </div>
            )}

            {/* Default State */}
            {!searchQuery.trim() && searchResults.length === 0 && (
              <div className="flex items-center justify-center h-full p-6 text-center">
                <div>
                  <p className="text-sm text-gray-600">Start typing to search</p>
                  <p className="text-xs text-gray-500 mt-2">Find products by name, category, or brand</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
