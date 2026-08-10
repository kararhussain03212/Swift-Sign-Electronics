import React, { useState } from 'react';
import { FiX, FiCheck, FiChevronRight, FiGitPullRequest, FiActivity } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useShop();
  const [showModal, setShowModal] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tableRef = React.useRef(null);

  const checkScroll = () => {
    if (tableRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableRef.current;
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [compareList]);

  // Close modal if compare list is emptied
  React.useEffect(() => {
    if (compareList.length === 0) {
      setShowModal(false);
    }
  }, [compareList]);

  if (compareList.length === 0) return null;

  // Gather unique specifications across all compared products
  const allSpecKeys = Array.from(
    new Set(
      compareList.reduce((keys, prod) => {
        return [...keys, ...Object.keys(prod.specifications || {})];
      }, [])
    )
  );

  return (
    <>
      {/* Bottom Sticky Compare Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] sm:w-auto max-w-2xl bg-white backdrop-blur-md border border-slate-200 rounded-lg p-4 shadow-2xl flex items-center justify-between text-slate-800 gap-3 sm:gap-4 animate-fade-in">

        <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-blue-600">
            <FiActivity className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="text-xs md:text-sm font-black whitespace-nowrap">Compare ({compareList.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative h-10 w-10 rounded-none overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 group"
              >
                <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute inset-0 bg-red-500/80 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            disabled={compareList.length < 2}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-none transition-all whitespace-nowrap cursor-pointer ${
              compareList.length < 2
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
            }`}
          >
            Compare Now
          </button>
          <button
            onClick={clearCompare}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            title="Clear and close comparison"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compare Modal */}
      <>
        {showModal && (
          <div
            className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-blue-600 w-5 sm:w-6 h-5 sm:h-6" />
                  <h3 className="text-base sm:text-xl font-bold text-slate-800">
                    Product Comparison
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                >
                  <FiX className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal Comparison Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white relative">
                  {/* Scroll Indicator - Right */}
                  {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none z-20 flex items-center justify-end pr-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L12.17 12z" />
                      </svg>
                    </div>
                  )}

                  <div
                    ref={tableRef}
                    onScroll={checkScroll}
                    className="overflow-x-auto overflow-y-hidden"
                  >
                    <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                        <th className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 bg-gradient-to-r from-slate-50 to-slate-100 z-5 min-w-[120px]">
                          Specifications
                        </th>
                        {compareList.map((product) => {
                          const discPrice = product.price * (1 - (product.discount || 0) / 100);
                          return (
                            <th key={product.id} className="p-3 sm:p-4 border-l border-slate-200 min-w-[200px]">
                              <div className="space-y-2">
                                <div className="h-28 sm:h-32 w-full rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                                  <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <h4 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-tight">
                                  {product.name}
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex items-baseline gap-2">
                                    <span className="font-black text-blue-600 text-sm sm:text-base">
                                      ${discPrice.toFixed(2)}
                                    </span>
                                    {product.discount > 0 && (
                                      <span className="text-xs text-slate-400 line-through">
                                        ${product.price.toFixed(2)}
                                      </span>
                                    )}
                                  </div>
                                  {product.discount > 0 && (
                                    <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                                      -{product.discount}%
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeFromCompare(product.id)}
                                  className="text-xs sm:text-sm font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer w-full text-center pt-2"
                                >
                                  Remove
                                </button>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Brand Row */}
                      <tr className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 bg-white z-4">Brand</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-3 sm:p-4 border-l border-slate-200 text-slate-600">
                            {product.brand}
                          </td>
                        ))}
                      </tr>

                      {/* Category Row */}
                      <tr className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 bg-white z-4">Category</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-3 sm:p-4 border-l border-slate-200 text-slate-600">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Stock Row */}
                      <tr className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 bg-white z-4">Availability</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-3 sm:p-4 border-l border-slate-200">
                            {product.stock > 0 ? (
                              <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">
                                In Stock ({product.stock})
                              </span>
                            ) : (
                              <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Rating Row */}
                      <tr className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
                        <td className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 bg-white z-4">Rating</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-3 sm:p-4 border-l border-slate-200 text-slate-600">
                            <div className="flex items-center gap-1">
                              <span className="text-amber-400 text-sm">★</span>
                              <span className="font-semibold">{product.rating}</span>
                              <span className="text-xs text-slate-500">({product.reviews})</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Dynamic Spec Rows */}
                      {allSpecKeys.map((key, idx) => (
                        <tr key={key} className={`border-b transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50 hover:bg-blue-50/50' : 'hover:bg-blue-50/50'}`}>
                          <td className="p-3 sm:p-4 font-bold text-slate-700 sticky left-0 z-4" style={{ backgroundColor: idx % 2 === 0 ? '#f9fafb' : 'white' }}>
                            {key}
                          </td>
                          {compareList.map((product) => (
                            <td key={product.id} className="p-3 sm:p-4 border-l border-slate-200 text-slate-600">
                              <span className="text-xs sm:text-sm">
                                {product.specifications?.[key] || <span className="text-slate-400">-</span>}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}
