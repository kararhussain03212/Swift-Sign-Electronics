import React, { useState } from 'react';
import { FiX, FiShoppingCart, FiPlus, FiMinus, FiHeart, FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Rating from './Rating';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const isAlreadyInWishlist = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <div
          className="relative bg-white dark:bg-slate-900 rounded-none overflow-hidden shadow-2xl w-full max-w-4xl z-10 flex flex-col md:flex-row border border-slate-200/80 dark:border-slate-800/85"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-750 dark:text-slate-400 dark:hover:text-slate-200 rounded-none transition-all cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Left Panel: Images */}
          <div className="w-full md:w-1/2 p-6 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-850">
            <div className="relative aspect-square w-full rounded-none overflow-hidden bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800">
              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-none shadow-md">
                  -{product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right Panel: Content Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold px-2.5 py-0.5 rounded-none">
                  {product.category}
                </span>
                <span className="text-xs text-slate-450 dark:text-slate-500 font-bold ml-2 uppercase">
                  {product.brand}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 pr-8">
                {product.name}
              </h2>

              <div className="flex items-center gap-4">
                <Rating value={product.rating} reviewsCount={product.reviews} />
                <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                  SKU: {product.SKU}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800 dark:text-slate-150">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-sm text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                {product.description}
              </p>

              {/* Stock info */}
              <div>
                {isOutOfStock ? (
                  <span className="text-red-500 text-xs font-bold">Out of stock</span>
                ) : (
                  <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                    <FiCheck /> In Stock: {product.stock} units left
                  </span>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Qty:</span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-none p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-bold text-slate-700 dark:text-slate-305 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Add to Cart */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-bold text-sm rounded-none shadow-md transition-all cursor-pointer ${
                    isOutOfStock
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                      : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-101 hover:shadow-lg shadow-blue-500/10'
                  }`}
                >
                  <FiShoppingCart /> Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 border rounded-none hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all cursor-pointer ${
                    isAlreadyInWishlist
                      ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-405'
                  }`}
                  title="Wishlist"
                >
                  <FiHeart className={`w-5 h-5 ${isAlreadyInWishlist ? 'fill-current' : ''}`} />
                </button>

                {/* View Details full link */}
                <Link
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-805 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-none text-sm font-bold transition-all text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
