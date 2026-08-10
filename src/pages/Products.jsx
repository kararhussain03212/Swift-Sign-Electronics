import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FiGrid, FiList, FiChevronDown, FiAlertCircle } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/Products/ProductCard';
import SearchBar from '../components/Products/SearchBar';
import Pagination from '../components/Products/Pagination';
import QuickViewModal from '../components/Products/QuickViewModal';

export default function Products() {
  const { products, productCategories } = useShop();
  const navigate = useNavigate();
  const { categorySlug: categorySlugParam } = useParams();
  // Legacy support: old dropdown links / bookmarks may still use ?category=slug
  const [searchParams] = useSearchParams();
  const categorySlug = categorySlugParam || searchParams.get('category') || '';

  const maxPrice = useMemo(() => {
    let highestPrice = 0;
    products.forEach(p => {
      if (p.price > highestPrice) highestPrice = p.price;
    });
    return Math.ceil(highestPrice) || 1000;
  }, [products]);

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

  // On first mount, `products` hasn't loaded yet so `maxPrice` falls back to the
  // default (1000) and gets baked into filters.priceRange[1] at init time. Once
  // products arrive, re-sync the upper bound to the real max — but only while the
  // user hasn't manually narrowed it (tracked via the previous maxPrice value).
  const prevMaxPriceRef = useRef(maxPrice);
  useEffect(() => {
    setFilters(prev => {
      if (prev.priceRange[1] === prevMaxPriceRef.current) {
        prevMaxPriceRef.current = maxPrice;
        return { ...prev, priceRange: [prev.priceRange[0], maxPrice] };
      }
      prevMaxPriceRef.current = maxPrice;
      return prev;
    });
  }, [maxPrice]);

  // Initialize search from sessionStorage if available
  useEffect(() => {
    const searchQuery = sessionStorage.getItem('searchQuery');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
      sessionStorage.removeItem('searchQuery');
      setCurrentPage(1);
    }
  }, []);

  // Sync category filter from the URL (/products/tools path, or legacy ?category=tools) —
  // covers navbar dropdown links and direct/shared URLs. Map slug (cat_key) to display name.
  useEffect(() => {
    if (!categorySlug) {
      setFilters(prev => ({ ...prev, categories: [] }));
      setCurrentPage(1);
      return;
    }
    const matchedCat = productCategories.find(c => c.cat_key === categorySlug);
    setFilters(prev => ({
      ...prev,
      categories: matchedCat ? [matchedCat.name] : [],
    }));
    setCurrentPage(1);
  }, [categorySlug, productCategories]);

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
        const matchesSKU = product.SKU && product.SKU.toLowerCase().includes(query);
        const matchesModel = product.model && product.model.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesTags && !matchesSKU && !matchesModel) {
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
  }, [products, filters]);

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
    navigate('/products');
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 lg:px-8 py-10 min-h-screen space-y-12">


      {/* Category Dropdown Filter */}
      <section className="flex items-center gap-3">
        <label htmlFor="category-select" className="text-sm font-bold text-slate-700 whitespace-nowrap">
          Filter by Category:
        </label>
        <div className="relative flex-1 max-w-xs">
          <select
            id="category-select"
            value={filters.categories.length === 0 ? '' : filters.categories[0]}
            onChange={(e) => {
              if (e.target.value === '') {
                navigate('/products');
              } else {
                const cat = productCategories.find(c => c.name === e.target.value);
                if (cat) {
                  navigate(`/products/${cat.cat_key}`);
                }
              }
            }}
            className="w-full appearance-none bg-white text-slate-700 font-semibold text-sm py-2.5 pl-4 pr-10 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-slate-400 transition-all cursor-pointer"
          >
            <option value="">All Products</option>
            {productCategories.filter(cat => cat.cat_key !== 'all').map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div id="products-section" className="flex flex-col gap-8 text-left scroll-mt-24">

        {/* Product Catalog Board */}
        <main className="flex-1 space-y-6">

          {/* Header Controls - Responsive */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 md:p-4 bg-white border border-slate-200 rounded-none shadow-sm">
            <div className="text-xs md:text-sm font-semibold text-slate-600">
              Showing <span className="text-slate-800 font-extrabold">{sortedProducts.length}</span> components
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 flex-wrap">
              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap">Sort:</span>
                <div className="relative flex-1 sm:flex-auto">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="appearance-none bg-white text-xs md:text-sm font-bold text-slate-700 py-2 pl-3 md:pl-3.5 pr-8 md:pr-9 rounded-none border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="best-selling">Best Selling</option>
                  </select>
                  <FiChevronDown className="absolute right-2.5 md:right-3.5 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none w-4 h-4" />
                </div>
              </div>

              {/* Grid / List toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-none">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 md:p-2 rounded-none transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 md:p-2 rounded-none transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4 md:w-5 md:h-5" />
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
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6"
                    : "flex flex-col gap-4 md:gap-5"
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
