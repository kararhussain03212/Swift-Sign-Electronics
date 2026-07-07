import React, { useState } from 'react';
import { FiX, FiCheck, FiChevronRight, FiGitPullRequest, FiActivity } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useShop();
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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-2xl bg-white backdrop-blur-md border border-slate-200 rounded-none p-4 shadow-2xl flex items-center justify-between text-slate-800 gap-4 animate-fade-in">

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
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div
              className="bg-white w-full max-w-5xl rounded-none overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 md:p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiActivity className="text-blue-600 w-6 h-6" />
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Product Comparison
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-none transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modal Comparison Content */}
              <div className="flex-1 overflow-auto p-5 md:p-6">
                <div className="min-w-[600px] border border-slate-200 rounded-none overflow-hidden">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 border-slate-200">
                        <th className="p-4 font-bold text-slate-500 w-1/5">Product details</th>
                        {compareList.map((product) => {
                          const discPrice = product.price * (1 - (product.discount || 0) / 100);
                          return (
                            <th key={product.id} className="p-4 border-l border-slate-200 border-slate-200 w-1/4">
                              <div className="space-y-2">
                                <div className="h-24 w-full rounded-none overflow-hidden bg-slate-100 bg-slate-50">
                                  <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                </div>
                                <h4 className="font-extrabold text-slate-800 text-slate-800 text-sm line-clamp-2">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-slate-800 text-slate-800">
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
                      <tr className="border-b border-slate-200 border-slate-200 hover:bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 text-slate-700">Brand</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 border-slate-200 text-slate-600 text-slate-600">
                            {product.brand}
                          </td>
                        ))}
                      </tr>

                      {/* Category Row */}
                      <tr className="border-b border-slate-200 border-slate-200 hover:bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 text-slate-700">Category</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 border-slate-200 text-slate-600 text-slate-600">
                            <span className="bg-slate-105 bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold">
                              {product.category}
                            </span>
                          </td>
                        ))}
                      </tr>

                      {/* Stock Row */}
                      <tr className="border-b border-slate-200 border-slate-200 hover:bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 text-slate-700">Availability</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 border-slate-200">
                            {product.stock > 0 ? (
                              <span className="text-emerald-500 font-bold text-xs">In Stock ({product.stock})</span>
                            ) : (
                              <span className="text-red-500 font-bold text-xs">Out of Stock</span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Rating Row */}
                      <tr className="border-b border-slate-200 border-slate-200 hover:bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                        <td className="p-4 font-bold text-slate-700 text-slate-700">Rating</td>
                        {compareList.map((product) => (
                          <td key={product.id} className="p-4 border-l border-slate-200 border-slate-200 text-slate-600 text-slate-600">
                            ★ {product.rating} ({product.reviews} reviews)
                          </td>
                        ))}
                      </tr>

                      {/* Dynamic Spec Rows */}
                      {allSpecKeys.map((key) => (
                        <tr key={key} className="border-b border-slate-200 border-slate-200 last:border-0 hover:bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                          <td className="p-4 font-bold text-slate-705 text-slate-700">{key}</td>
                          {compareList.map((product) => (
                            <td key={product.id} className="p-4 border-l border-slate-200 border-slate-200 text-slate-600 text-slate-600 text-xs">
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
