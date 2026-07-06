import React, { useState } from 'react';
import { FiX, FiCheck, FiChevronRight, FiGitPullRequest, FiActivity } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';

export default function CompareDrawer() {
  const { compareList, removeFromCompare } = useShop();
  const [showModal, setShowModal] = useState(false);

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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95vw] max-w-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-white gap-4">
        <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-blue-400">
            <FiActivity className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="text-xs md:text-sm font-black whitespace-nowrap">Compare ({compareList.length}/4)</span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((product) => (
              <div
                key={product.id}
                className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0 group"
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

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowModal(true)}
            disabled={compareList.length < 2}
            className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              compareList.length < 2
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
            }`}
          >
            Compare Now
          </button>
        </div>
      </div>

      {/* Compare Modal */}
      <>
        {showModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 md:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-blue-500 w-6 h-6" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100">
                    Product Comparison
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Modal Comparison Content */}
              <div className="flex-1 overflow-auto p-5 md:p-6">
                <div className="min-w-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4 font-bold text-slate-500 w-1/5">Product details</th>
                        {compareList.map((product) => {
                          const discPrice = product.price * (1 - (product.discount || 0) / 100);
                          return (
                            <th key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800 w-1/4">
                              <div className="space-y-2">
                                <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                                  <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm line-clamp-2">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-slate-800 dark:text-slate-100">
                                    ${discPrice.toFixed(2)}
                                  </span>
                                  {product.discount > 0 && (
                                    <span className="text-xs text-slate-400 line-through">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => removeFromCompare(product.id)}
                                  className="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
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
                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-350">Brand</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            {product.brand}
                          </td>
                        ))}
                      </tr>

                      {/* Category Row */}
                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-350">Category</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            <span className="bg-slate-105 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Stock Row */}
                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-350">Availability</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800">
                            {product.stock > 0 ? (
                              <span className="text-emerald-500 font-bold text-xs">In Stock ({product.stock})</span>
                            ) : (
                              <span className="text-red-500 font-bold text-xs">Out of Stock</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Rating Row */}
                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 dark:text-slate-350">Rating</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                            ★ {product.rating} ({product.reviews} reviews)
                          </td>
                        ))}
                      </tr>

                      {/* Dynamic Spec Rows */}
                      {allSpecKeys.map((key) => (
                        <tr key={key} className="border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                          <td className="p-4 font-bold text-slate-705 dark:text-slate-355">{key}</td>
                          {compareList.map((product) => (
                            <td key={product.id} className="p-4 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                              {product.specifications?.[key] || '-'}
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
        )}
      </>
    </>
  );
}
