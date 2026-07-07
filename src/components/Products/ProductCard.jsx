import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiEye, FiCheck, FiX, FiActivity } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';
import Rating from './Rating';

export default function ProductCard({ product, viewMode = 'grid', onQuickView }) {
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

  // Calculate discounted price
  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  if (viewMode === 'list') {
    return (
      <div
        className="group relative flex flex-col md:flex-row gap-6 p-5 bg-white border border-slate-200 hover:border-blue-500/50 rounded-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Left Side: Product Image & Badges */}
        <div className="relative w-full md:w-56 h-48 rounded-none overflow-hidden bg-slate-50 flex-shrink-0 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-none shadow-md z-10">
              -{product.discount}% OFF
            </span>
          )}
          
          {/* Quick View Button overlay on Image */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none cursor-pointer"
          >
            <span className="flex items-center gap-1.5 bg-white text-slate-800 font-bold px-4 py-2 rounded-none text-sm shadow-lg hover:scale-105 transition-all">
              <FiEye /> Quick View
            </span>
          </button>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-none">
                {product.category}
              </span>
              <span className="text-slate-500 font-medium">
                Brand: <strong className="text-slate-700 font-semibold">{product.brand}</strong>
              </span>
              <span className="text-slate-500 font-medium">|</span>
              <span className="text-slate-500 font-medium">
                SKU: <strong className="text-slate-700 font-semibold">{product.SKU}</strong>
              </span>
            </div>

            {/* Name */}
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <Rating value={product.rating} reviewsCount={product.reviews} />

            {/* Short Description */}
            <p className="text-slate-600 text-sm line-clamp-2 pr-6">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="flex items-center gap-1.5 text-xs pt-1">
              {isOutOfStock ? (
                <span className="flex items-center gap-1 text-red-500 font-bold">
                  <FiX /> Out of Stock
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-none">
                  <FiCheck /> In Stock ({product.stock} left)
                </span>
              )}
            </div>
          </div>

          {/* Pricing and Action row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-200">
            {/* Price section */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-slate-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Button group */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 border rounded-none hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer ${
                  inWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-slate-200 text-slate-500'
                }`}
                title="Add to Wishlist"
              >
                <FiHeart className={`h-4.5 w-4.5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>

              {/* Compare Button */}
              <button
                onClick={() => toggleCompare(product)}
                className={`p-3 border rounded-none hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer ${
                  inCompare
                    ? 'border-orange-500 bg-orange-50 text-orange-500'
                    : 'border-slate-200 text-slate-500'
                }`}
                title="Compare Product"
              >
                <FiActivity className="h-4.5 w-4.5" />
              </button>

              {/* View Details Link */}
              <Link
                to={`/product/${product.slug}`}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-none text-sm font-bold transition-all"
              >
                Details
              </Link>

              {/* Add to Cart Button */}
              <button
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
                className={`flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-none shadow-md transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-102 hover:shadow-lg'
                }`}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div
      className="group relative flex flex-col justify-between bg-white border border-slate-200 hover:border-blue-500/50 rounded-none hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Product Image Panel */}
      <div className="relative w-full h-48 rounded-none overflow-hidden bg-slate-50 flex items-center justify-center p-3">
        <img
          src={product.thumbnail}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        
        {/* Discount & Out of Stock Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-none shadow-md">
              -{product.discount}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-slate-900/85 backdrop-blur-xs text-white text-xs font-bold px-2.5 py-1 rounded-none border border-slate-700">
              SOLD OUT
            </span>
          )}
        </div>

        {/* Category Badge */}
        <span className="absolute top-3.5 right-3.5 bg-blue-50 backdrop-blur-xs text-blue-600 text-xs font-extrabold px-2.5 py-1 rounded-none shadow-xs">
          {product.category}
        </span>

        {/* Action icons hover overlay */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-10">
          {/* Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-2.5 bg-white hover:bg-red-500 hover:text-white rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer ${
              inWishlist ? 'text-red-500 bg-red-50' : 'text-slate-600'
            }`}
            title="Wishlist"
          >
            <FiHeart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Compare */}
          <button
            onClick={() => toggleCompare(product)}
            className={`p-2.5 bg-white hover:bg-orange-500 hover:text-white rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer ${
              inCompare ? 'text-orange-500 bg-orange-50' : 'text-slate-600'
            }`}
            title="Compare"
          >
            <FiActivity className="w-4 h-4" />
          </button>

          {/* Quick View */}
          <button
            onClick={() => onQuickView(product)}
            className="p-2.5 bg-white hover:bg-blue-600 hover:text-white text-slate-600 rounded-none shadow-lg border border-slate-200 transition-all cursor-pointer"
            title="Quick View"
          >
            <FiEye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Brand */}
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {product.brand}
          </span>

          {/* Name */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <Rating value={product.rating} reviewsCount={product.reviews} showText={true} />

          {/* Short Description */}
          <p className="text-slate-600 text-xs line-clamp-2 mt-0.5 leading-tight">
            {product.description}
          </p>

          {/* Stock details */}
          <div className="text-[11px] font-semibold text-slate-500 mt-1">
            {!isOutOfStock ? (
              <span className="text-emerald-600 font-bold">In Stock: {product.stock} items</span>
            ) : (
              <span className="text-red-600 font-bold">Out of stock</span>
            )}
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200">
          {/* Prices */}
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="text-[10px] text-slate-500 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
            <span className="text-base font-black text-slate-800">
              ${discountedPrice.toFixed(2)}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`p-2.5 rounded-none shadow-md cursor-pointer transition-all flex items-center justify-center ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-750 text-white hover:scale-105 hover:shadow-lg'
            }`}
            title="Add to Cart"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
