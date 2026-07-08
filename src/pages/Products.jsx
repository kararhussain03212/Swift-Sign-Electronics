import React, { useState, useMemo } from 'react';
import { FiGrid, FiList, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { products } from '../data/products';
import ProductCard from '../components/Products/ProductCard';
import SearchBar from '../components/Products/SearchBar';
import Pagination from '../components/Products/Pagination';
import QuickViewModal from '../components/Products/QuickViewModal';

const maxPrice = (() => {
  let highestPrice = 0;
  products.forEach(p => {
    if (p.price > highestPrice) highestPrice = p.price;
  });
  return Math.ceil(highestPrice);
})();

export default function Products() {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, maxPrice],
    inStockOnly: false,
    minRating: 0,
    search: ''
  });

  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const itemsPerPage = 16;

  const handleSearchChange = (val) => {
    setFilters(prev => ({ ...prev, search: val }));
    setCurrentPage(1);
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(t => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesTags) {
          return false;
        }
      }

      // Categories filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Brands filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Price filter (apply discount if applicable)
      const finalPrice = product.price * (1 - (product.discount || 0) / 100);
      if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) {
        return false;
      }

      // Availability filter
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'newest':
        return list.sort((a, b) => b.id - a.id);
      case 'price-asc':
        return list.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceA - priceB;
        });
      case 'price-desc':
        return list.sort((a, b) => {
          const priceA = a.price * (1 - (a.discount || 0) / 100);
          const priceB = b.price * (1 - (b.discount || 0) / 100);
          return priceB - priceA;
        });
      case 'best-selling':
        return list.sort((a, b) => b.reviews - a.reviews);
      case 'featured':
      default:
        return list; // standard database order
    }
  }, [filteredProducts, sortOption]);

  // Pagination Math
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedProducts, currentPage]);

  const handleCategoryNavClick = (category) => {
    setFilters(prev => {
      const isAlreadySelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isAlreadySelected ? [] : [category]
      };
    });
    setCurrentPage(1);
  };

  const handleResetAll = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, maxPrice],
      inStockOnly: false,
      minRating: 0,
      search: ''
    });
    setSortOption('featured');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-10 min-h-screen space-y-12">


      {/* Category Pills Quick Navigation */}
      <section className="space-y-4 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 flex-grow margin-0">
            <span>Categories</span>
            <span className="h-1 flex-grow bg-slate-100 dark:bg-slate-850 rounded-none" />
          </h2>
          
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search parts, tools, kits..."
          />
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, categories: [] }));
              setCurrentPage(1);
            }}
            className={`px-6 py-3 rounded-none font-bold text-sm transition-all cursor-pointer border flex items-center gap-2 ${
              filters.categories.length === 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <span>All Products</span>
            {filters.categories.length === 0 && <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>}
          </button>
          {['Tools', 'Instruments', 'Projects'].map((cat) => {
            const isSelected = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => handleCategoryNavClick(cat)}
                className={`px-6 py-3 rounded-none font-bold text-sm transition-all cursor-pointer border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Catalog Section */}
      <div id="products-section" className="flex flex-col gap-8 text-left scroll-mt-24">
        
        {/* Product Catalog Board */}
        <main className="flex-1 space-y-6">
          
          {/* Header Controls (Desktop top-bar) */}
          <div className="hidden lg:flex items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="text-sm font-semibold text-slate-600">
              Showing <span className="text-slate-800 font-extrabold">{sortedProducts.length}</span> components
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-white text-sm font-bold text-slate-700 py-2 pl-3.5 pr-9 rounded-none border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="best-selling">Best Selling</option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" />
                </div>
              </div>

              {/* Grid / List toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-none">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-none transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-none transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Inline Search results bar */}
          {filters.search && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-none text-sm">
              <span className="text-slate-700 font-medium">Search results for:</span>
              <strong className="text-blue-600">"{filters.search}"</strong>
              <button
                onClick={() => handleSearchChange('')}
                className="ml-auto text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Clear
              </button>
            </div>
          )}

          {/* Cards Grid */}
          <div className="relative">
            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-14 border border-dashed border-slate-300 rounded-none bg-slate-50 space-y-4">
                <div className="p-4 bg-orange-50 text-orange-500 rounded-none">
                  <FiAlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800">No components found</h3>
                  <p className="text-slate-600 text-sm max-w-sm">
                    No results match your active filter set. Try broadening your keywords, resetting prices, or editing category checkboxes.
                  </p>
                </div>
                <button
                  onClick={handleResetAll}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-none text-sm shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "flex flex-col gap-5"
                }
              >
                <>
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onQuickView={setQuickViewProduct}
                    />
                  ))}
                </>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </main>
      </div>

      {/* Quick View Modal Container */}
      <>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </>
    </div>
  );
}
