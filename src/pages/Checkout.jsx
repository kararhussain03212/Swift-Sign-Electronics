import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { FiHeart, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, toggleWishlist } = useShop();

  // Assuming shipping is free for this layout as per screenshot, or we just show subtotal
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1536px] mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-slate-800 text-slate-800">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 text-slate-600">
          You don't have any items in your cart to review.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-none transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-10 bg-white min-h-screen">
      
      {/* Top Stepper */}
      <div className="flex justify-center items-center text-xs md:text-sm font-bold mb-16 mt-4">
        <div className="flex items-center text-blue-600">
          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
          Shopping Cart
        </div>
        <div className="w-16 md:w-32 h-0.5 bg-blue-600 mx-4"></div>
        <div className="flex items-center text-slate-400">
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
          Check Out
        </div>
        <div className="w-16 md:w-32 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>
        <div className="flex items-center text-slate-400">
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
          Confirm the Order
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-400 mb-6">Shopping Cart</h2>
      
      {/* Cart Header */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-4 mb-2">
        <h1 className="text-lg font-bold text-slate-800">
          My Items ({cart.length})
        </h1>
        <span className="text-xs font-bold text-slate-500 ml-4">
          Weight: 0.47kg
        </span>
      </div>

      {/* Items List */}
      <div className="flex flex-col">
        {cart.map(({ product, quantity }) => {
          const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
          return (
            <div key={product.id} className="flex flex-col md:flex-row md:items-center py-6 border-b border-slate-100 group">
              
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-24 h-24 flex-shrink-0 mr-6 bg-white rounded-none p-1 border border-slate-200">
                  <img src={product.thumbnail} alt={product.name} className="w-full h-full object-contain" />
                </div>
              </div>

              <div className="flex-1 mb-4 md:mb-0 md:pr-4">
                <h3 className="text-sm font-bold text-slate-800 mb-1 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-400">SKU: {product.SKU}</p>
              </div>
              
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto">
                <div className="w-24 text-left md:text-right font-bold text-slate-800 md:mr-8 text-sm">
                  ${discountedPrice.toFixed(2)}
                </div>
                
                <div className="flex items-center border border-slate-200 rounded-none md:mr-8 bg-white">
                  <button 
                    onClick={() => updateCartQuantity(product.id, Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <FiMinus className="w-3 h-3" />
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    className="w-10 text-center text-sm font-bold outline-none bg-transparent text-slate-800" 
                  />
                  <button 
                    onClick={() => updateCartQuantity(product.id, Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    <FiPlus className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="w-24 text-right font-black text-slate-800 md:mr-12 text-sm">
                  ${(discountedPrice * quantity).toFixed(2)}
                </div>
                
                <div className="flex flex-row md:flex-col gap-4 md:gap-2 text-xs text-slate-500 text-slate-600">
                  <button 
                    onClick={() => removeFromCart(product.id)} 
                    className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

      {/* Footer / Summary */}
      <div className="mt-16 flex flex-col items-center md:items-end mb-20">
        <div className="text-2xl font-bold text-slate-900 mb-6">
          Total: ${total.toFixed(2)}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/checkout/details')} 
            className="w-full sm:w-auto px-8 py-2.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none transition-colors shadow-md shadow-blue-600/30"
          >
            Proceed to Checkout
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-slate-500">
          or you could 
          <Link 
            to="/" 
            className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-none transition-colors border border-slate-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

    </div>
  );
}
