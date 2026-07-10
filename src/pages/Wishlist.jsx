import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/Products/ProductCard';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleRemove = (productId) => {
    const product = wishlist.find(p => p.id === productId);
    if (product) {
      toggleWishlist(product);
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen py-16">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <FiHeart className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600 text-lg">
            {wishlist.length === 0
              ? "Your wishlist is empty. Start adding products!"
              : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-6 bg-red-50 rounded-full">
                <FiHeart className="w-12 h-12 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding products to your wishlist by clicking the heart icon on product cards.
            </p>
            <Link
              to="/products"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                {/* Product Card */}
                <ProductCard product={product} />

                {/* Actions */}
                <div className="p-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-all"
                  >
                    <FiShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded transition-all"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
