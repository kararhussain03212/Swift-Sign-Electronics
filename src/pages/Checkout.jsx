import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { FiCheckCircle, FiShield, FiCreditCard, FiArrowLeft, FiTruck } from 'react-icons/fi';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useShop();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6 text-green-500">
          <FiCheckCircle className="w-24 h-24" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8">
          Thank you for your purchase. We've sent a confirmation email to you.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          You don't have any items in your cart to checkout.
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
          <FiArrowLeft /> Back to Shopping
        </Link>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100">
          Secure Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Forms */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">1</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">First Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Last Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="Doe" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Email Address</label>
                  <input required type="email" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="john@example.com" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">2</span>
                Shipping Address
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Street Address</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">City</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Zip Code</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100" placeholder="94105" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black">3</span>
                Payment Details
              </h2>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Card Number</label>
                  <div className="relative">
                    <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input required type="text" maxLength="19" className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 font-mono" placeholder="0000 0000 0000 0000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">Expiry Date</label>
                    <input required type="text" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 font-mono" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 dark:text-slate-400">CVC</label>
                    <input required type="text" maxLength="4" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-slate-100 font-mono" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800/80 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Order Summary
            </h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto scrollbar-thin pr-2">
              {cart.map(({ product, quantity }) => {
                const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                return (
                  <div key={product.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex-shrink-0">
                      <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Qty: {quantity}</p>
                    </div>
                    <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                      ${(discountedPrice * quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800 text-sm">
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
                type="submit"
                form="checkout-form"
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-extrabold rounded-xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing Order...</span>
                ) : (
                  <>
                    <FiShield className="w-5 h-5" /> Place Order
                  </>
                )}
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <FiCheckCircle className="text-green-500" /> Secure 256-bit SSL encryption
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
