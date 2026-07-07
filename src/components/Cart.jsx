import React from 'react';
import MiniHero from './MiniHero';
import { ShoppingBag, Trash2, Heart, ArrowRight } from 'lucide-react';

export default function Cart({ cartItems, onRemoveFromCart, wishlistItems, onMoveToCart, onRemoveFromWishlist }) {
  const subtotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.price.replace(/[^\d.]/g, '')) * (item.quantity || 1)), 0);

  return (
    <div className="w-full bg-white text-gray-800 pb-8 pt-0 font-sans">
      <MiniHero 
        title="Shopping Cart & Wishlist" 
        subtitle="Manage your components, view final year project orders, and check your wishlisted project guides."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-8">
        <h2 className="text-2xl font-extrabold text-black tracking-tight" style={{ margin: 0 }}>
          Your Shopping Cart
        </h2>
        <button 
          onClick={() => window.open('https://swiftsign-electronics.com/shop', '_blank')}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#84cc16] hover:bg-[#f7b500] text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
        >
          Add Product 
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Cart List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm sm:text-base leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-semibold">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                  <div className="text-right sm:text-left">
                    <span className="font-extrabold text-[#84cc16] text-md">{item.price}</span>
                  </div>
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-600">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">Explore our components and final year projects to add gear.</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-black text-lg border-b border-gray-200 pb-3 mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-[#84cc16] font-bold">FREE</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-black">
                <span>Estimated Total</span>
                <span className="text-[#84cc16] font-extrabold">Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button 
            disabled={cartItems.length === 0}
            className="w-full mt-6 py-3 bg-[#84cc16] hover:bg-[#f7b500] text-white text-sm font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-extrabold text-black mb-6 flex items-center gap-2">
          <Heart className="h-6 w-6 text-[#84cc16] fill-[#84cc16]" /> My Wishlist
        </h2>

        {wishlistItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between p-4 gap-4">
                <div className="flex gap-4">
                  <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm leading-snug line-clamp-2">{item.title}</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold mt-1">{item.category}</p>
                    <span className="font-bold text-[#84cc16] text-xs mt-1 block">{item.price || 'Free Guide'}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  {item.price && item.price !== 'Free Guide' ? (
                    <button 
                      onClick={() => onMoveToCart(item)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-[#84cc16] hover:text-white text-gray-700 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="flex-1 text-center py-2 bg-gray-50 text-gray-400 text-[10px] font-bold rounded-lg select-none border border-gray-150">
                      Project Guide Only
                    </span>
                  )}
                  <button 
                    onClick={() => onRemoveFromWishlist(item.id)}
                    className="p-2 border border-gray-200 hover:border-red-200 hover:text-red-500 rounded-lg text-gray-400 transition cursor-pointer"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl max-w-2xl">
            <Heart className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-600">Your wishlist is empty</p>
            <p className="text-xs text-gray-400 mt-1">Tap the heart icons on projects to save them in your wishlist.</p>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
