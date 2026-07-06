import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { FiArrowLeft, FiTrash2, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useShop();

  const subtotal = getCartTotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          You don't have any items in your cart to review.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold"
        >
          <FiArrowLeft /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
          <FiArrowLeft /> Back to Shopping
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">
          Review Your Cart
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {cart.map(({ product, quantity }) => {
            const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
            return (
              <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-none shadow-sm items-center">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-950 rounded-none overflow-hidden flex-shrink-0">
                  <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{product.name}</h3>
                  <div className="text-slate-500 dark:text-slate-400 text-sm mt-1">Brand: {product.brand}</div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-100 mt-2">
                    ${discountedPrice.toFixed(2)}
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => updateCartQuantity(product.id, Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-slate-700 dark:text-slate-300 w-6 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(product.id, Math.min(product.stock, quantity + 1))}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-1"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-none p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800/80 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Order Summary
            </h2>
            
            {/* Calculations */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-4 flex justify-between text-lg font-black text-slate-900 dark:text-slate-50">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/checkout/details')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
              >
                Proceed to Details <FiCreditCard className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
