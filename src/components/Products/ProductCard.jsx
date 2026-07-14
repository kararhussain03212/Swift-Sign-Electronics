import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';
import Rating from './Rating';

export default function ProductCard({ product, viewMode = 'grid', onQuickView = () => {} }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare
  } = useShop();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <div className="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-3 sm:p-5 bg-white border border-slate-200 hover:border-blue-500/50 rounded-none hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
        {/* Image */}
        <div className="relative w-full sm:w-44 md:w-52 h-40 sm:h-44 rounded-none overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-none shadow-md z-10">
              -{product.discount}%
            </span>
          )}
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <span className="flex items-center gap-1 bg-white text-slate-800 font-bold px-3 py-1.5 rounded-none text-xs sm:text-sm shadow-lg">
              <FiEye /> Quick View
            </span>
          </button>
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              <span className="bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded-none">{product.category}</span>
              <span className="text-slate-500 font-medium hidden sm:inline">Brand: <strong>{product.brand}</strong></span>
              <span className="text-slate-500 font-medium hidden md:inline">| SKU: <strong>{product.SKU}</strong></span>
            </div>

            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>

            <Rating value={product.rating} reviewsCount={product.reviews} />

            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 hidden sm:block">{product.description}</p>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs pt-0.5">
              {isOutOfStock ? (
                <span className="flex items-center gap-1 text-red-500 font-bold"><FiX /> Out of Stock</span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-none">
                  <FiCheck /> In Stock ({product.stock} left)
                </span>
              )}
            </div>
          </div>

          {/* Footer: Price + Actions */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-200">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-2xl font-black text-slate-800">${discountedPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <span className="text-xs sm:text-sm text-slate-400 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-2 sm:p-2.5 border rounded-none hover:bg-slate-50 transition-all cursor-pointer ${
                  inWishlist ? 'border-red-500 bg-red-50 text-red-500' : 'border-slate-200 text-slate-500'
                }`}
                title="Wishlist"
              >
                <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => toggleCompare(product)}
                className={`p-2 sm:p-2.5 border rounded-none hover:bg-slate-50 transition-all cursor-pointer ${
                  inCompare ? 'border-orange-500 bg-orange-50 text-orange-500' : 'border-slate-200 text-slate-500'
                }`}
                title="Compare"
              >
                <FiActivity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <Link
                to={`/product/${product.slug}`}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-none text-xs sm:text-sm font-bold transition-all"
              >
                Details
              </Link>
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className={`flex items-center gap-1 px-3 sm:px-5 py-2 sm:py-2.5 font-bold text-xs sm:text-sm rounded-none shadow-md transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <FiShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW (Default) ────────────────────────────────────────────────────
  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200 hover:border-blue-500/50 rounded-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Panel */}
      <div className="relative w-full h-44 xs:h-48 sm:h-52 md:h-56 lg:h-60 shrink-0 overflow-hidden bg-slate-50 flex items-center justify-center p-2">
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-none shadow-md">
              -{product.discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-900/85 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-none">
              SOLD OUT
            </span>
          )}
        </div>

        <span className="absolute top-2 right-2 bg-blue-50 text-blue-600 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-none shadow-xs z-10">
          {product.category}
        </span>

        {/* Action Overlay Icons */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2 bg-white hover:bg-red-500 hover:text-white rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer ${
              inWishlist ? 'text-red-500 bg-red-50' : 'text-slate-600'
            }`}
            title="Wishlist"
          >
            <FiHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => toggleCompare(product)}
            className={`p-2 bg-white hover:bg-orange-500 hover:text-white rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer ${
              inCompare ? 'text-orange-500 bg-orange-50' : 'text-slate-600'
            }`}
            title="Compare"
          >
            <FiActivity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onQuickView(product)}
            className="p-2 bg-white hover:bg-blue-600 hover:text-white text-slate-600 rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer"
            title="Quick View"
          >
            <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-2.5 sm:p-3 md:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-wider truncate">
              {product.brand}
            </span>
            <span className="text-[8px] sm:text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-semibold hidden sm:inline">
              {product.model}
            </span>
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <Rating value={product.rating} reviewsCount={product.reviews} showText={true} />

          <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500 pt-0.5">
            {!isOutOfStock ? (
              <span className="text-emerald-600 font-bold">In Stock: {product.stock}</span>
            ) : (
              <span className="text-red-600 font-bold">Out of stock</span>
            )}
          </div>
        </div>

        {/* Footer Row: Price + Cart */}
        <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-slate-200">
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-[8px] sm:text-[9px] text-slate-400 line-through">${product.price.toFixed(2)}</span>
            )}
            <span className="text-sm sm:text-base font-black text-slate-800">${discountedPrice.toFixed(2)}</span>
          </div>

          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`p-2 sm:p-2.5 rounded-none shadow-md cursor-pointer transition-all flex items-center justify-center flex-shrink-0 ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
