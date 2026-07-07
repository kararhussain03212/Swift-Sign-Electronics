import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useShop } from '../../context/ShopContext';

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    clearCart
  } = useShop();

  const subtotal = getCartTotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs animate-fade-in"
          />

          {/* Drawer Panel */}
          <div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full animate-slide-in-right"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-blue-500 w-5 h-5" />
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-none text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-650 rounded-none">
                    <FiShoppingBag className="w-12 h-12" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-700 dark:text-slate-350">Your cart is empty</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-sm">
                      Browse our tools, instruments, and kits to add items.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map(({ product, quantity }) => {
                  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                  return (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3 bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/40 rounded-none"
                    >
                      {/* Image */}
                      <div className="h-20 w-20 rounded-none overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0">
                        <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {product.brand}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Qty controls */}
                          <div className="flex items-center bg-slate-100 dark:bg-slate-850 rounded-none p-0.5">
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity - 1)}
                              className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <FiMinus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(product.id, quantity + 1)}
                              className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                            >
                              <FiPlus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Price details */}
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                              ${(discountedPrice * quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded-none transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer summary */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-slate-400 text-right">
                      Add ${(150 - subtotal).toFixed(2)} more for FREE shipping!
                    </p>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5 flex justify-between text-base font-black text-slate-850 dark:text-slate-100">
                    <span>Order Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-all cursor-pointer"
                  >
                    Clear All
                  </button>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="flex-1 flex justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-none shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer text-center text-sm"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
