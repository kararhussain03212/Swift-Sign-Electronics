import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiX, FiCheck, FiGrid, FiList } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

export default function ProductFilters({
  filters,
  setFilters,
  sortOption,
  setSortOption,
  viewMode,
  setViewMode,
  availableBrands = [],
  availableCategories = [],
  maxPrice = 500,
  totalResults = 0
}) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const active = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: active };
    });
  };

  const handleBrandChange = (brand) => {
    setFilters(prev => {
      const active = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: active };
    });
  };

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFilters(prev => ({ ...prev, priceRange: [0, value] }));
  };

  const handleAvailabilityChange = (status) => {
    setFilters(prev => ({ ...prev, inStockOnly: status }));
  };

  const handleRatingChange = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStockOnly: false,
      minRating: 0,
      search: filters.search // keep search
    });
  };

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.inStockOnly ||
    filters.minRating > 0;

  const renderFilterSections = () => (
    <div className="space-y-6">
      {/* Active Filters Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <FiFilter className="text-blue-500" /> Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Category</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableCategories.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-500 focus:ring-blue-500 h-4 w-4 bg-transparent"
              />
              <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 text-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="rounded border-slate-300 dark:border-slate-700 text-blue-500 focus:ring-blue-500 h-4 w-4 bg-transparent"
              />
              <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm font-semibold text-slate-800 dark:text-slate-300">
          <h4>Max Price</h4>
          <span className="text-blue-500">${filters.priceRange[1].toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={maxPrice}
          step="10"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-none appearance-none cursor-pointer accent-blue-500 focus:outline-none"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>$0.00</span>
          <span>${maxPrice.toFixed(0)}</span>
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Availability</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={!filters.inStockOnly}
              onChange={() => handleAvailabilityChange(false)}
              className="text-blue-500 focus:ring-blue-500 h-4 w-4 bg-transparent"
            />
            <span className="text-slate-600 dark:text-slate-400">All Products</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="availability"
              checked={filters.inStockOnly}
              onChange={() => handleAvailabilityChange(true)}
              className="text-blue-500 focus:ring-blue-500 h-4 w-4 bg-transparent"
            />
            <span className="text-slate-600 dark:text-slate-400">In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2.5">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-300">Minimum Rating</h4>
        <div className="flex flex-col gap-1.5">
          {[4, 3, 2].map((num) => (
            <button
              key={num}
              onClick={() => handleRatingChange(num)}
              className={`flex items-center gap-2 text-sm py-1 px-2 rounded-none transition-all text-left ${
                filters.minRating === num
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <span className="flex items-center text-amber-500">
                {Array.from({ length: num }).map((_, idx) => (
                  <FaStar key={idx} className="w-3.5 h-3.5 fill-current" />
                ))}
                {Array.from({ length: 5 - num }).map((_, idx) => (
                  <FaStar key={idx} className="w-3.5 h-3.5 text-slate-200 dark:text-slate-700 fill-current" />
                ))}
              </span>
              <span>& Up</span>
              {filters.minRating === num && <FiCheck className="ml-auto" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Desktop Filter Sidebar Container */}
      <div className="hidden lg:block w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-none p-6 shadow-sm sticky top-24">
        {renderFilterSections()}
      </div>

      {/* Mobile Sticky Control Bar */}
      <div className="lg:hidden flex items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-none shadow-sm mb-6">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="flex items-center gap-2 py-2 px-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-semibold"
        >
          <FiFilter /> Filters {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-orange-500"></span>}
        </button>

        <div className="flex items-center gap-3">
          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border-none text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Grid/List Toggle */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1 rounded-none">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-none transition-all ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-none transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Mobile Drawer Sheet */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 bg-white dark:bg-slate-900 p-6 shadow-2xl transition-transform duration-300 transform flex flex-col h-full ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <span className="font-bold text-slate-800 dark:text-slate-100">Filter Products</span>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="p-1 rounded-none text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          {renderFilterSections()}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 mt-auto">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {totalResults} items found
          </span>
          <button
            onClick={() => setIsOpenMobile(false)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-none font-bold text-sm shadow-md transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
