import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { submitOrder } from '../api/shopApi';
import {
  FiCheckCircle, FiShield, FiUser, FiPhone, FiMail,
  FiMapPin, FiTruck, FiChevronRight, FiTag, FiCheck
} from 'react-icons/fi';

export default function CheckoutForm() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, contactPage } = useShop();
  const whatsappDigits = (contactPage?.whatsapp_number || contactPage?.phone_number || '').replace(/[^\d]/g, '');
  
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const step = 2; // Fixed at step 2 (Delivery) since Payment is removed

  const subtotal = getCartTotal();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15.00;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target);
    const fullName = formData.get('fullName');
    const phoneNumber = formData.get('phoneNumber');
    const email = formData.get('email') || 'N/A';
    const streetAddress = formData.get('streetAddress');
    const notes = formData.get('notes') || 'None';

    let itemsText = '';
    cart.forEach(({ product, quantity }) => {
      const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
      itemsText += `- ${product.name} (Qty: ${quantity}) - Rs. ${(discountedPrice * quantity).toFixed(2)}\n`;
    });

    const totalText = total.toFixed(2);

    const message = `*NEW ORDER - SWIFT SIGN ELECTRONICS*\n\n` +
      `*Customer Details:*\n` +
      `- *Name:* ${fullName}\n` +
      `- *Phone:* ${phoneNumber}\n` +
      `- *Email:* ${email}\n\n` +
      `*Delivery Address:*\n` +
      `- *Street:* ${streetAddress}\n` +
      `- *City:* ${selectedCity}\n` +
      `- *Province:* ${selectedProvince}\n` +
      `- *Postal Code:* ${postalCode}\n\n` +
      `*Order Notes:*\n` +
      `${notes}\n\n` +
      `*Items:*\n` +
      `${itemsText}\n` +
      `*Shipping:* Rs. ${shipping.toFixed(2)}\n` +
      `*Total Amount:* Rs. ${totalText}\n`;

    const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;

    // Persist the order in the backend (admin panel > Orders); WhatsApp remains
    // the customer-facing confirmation, so a failed API call doesn't block it.
    submitOrder({
      customer_name: fullName,
      customer_email: email === 'N/A' ? '' : email,
      customer_phone: phoneNumber,
      address: streetAddress,
      city: selectedCity,
      country: 'Pakistan',
      notes: notes === 'None' ? '' : notes,
      items: cart.map(({ product, quantity }) => ({
        product_id: product.id,
        name: product.name,
        price: product.price * (1 - (product.discount || 0) / 100),
        quantity,
      })),
    }).catch(() => {});

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 1000);
  };

  const locationData = {
  Punjab: { Lahore: "54000", Rawalpindi: "46000", Faisalabad: "38000" },
  Sindh: { Karachi: "74200", Hyderabad: "71000" },
  KPK: { Peshawar: "25000" },
  Balochistan: { Quetta: "87300" }
};
const [selectedProvince, setSelectedProvince] = useState("");
const [selectedCity, setSelectedCity] = useState("");
const [postalCode, setPostalCode] = useState("");


  if (orderComplete) {
    return (
      <div className="w-full max-w-[1536px] mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in space-y-4">
          <div className="flex justify-center text-blue-600">
            <FiCheckCircle className="w-20 h-20" />
          </div>
          <h1 className="text-3xl font-black text-slate-800">
            Order Confirmed!
          </h1>
          <p className="text-base text-slate-700">
            Thank you for your purchase. We've sent a confirmation email to you.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none transition-all shadow-lg shadow-blue-500/30"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-slate-800 text-slate-800">
          Your Cart is Empty
        </h1>
        <p className="text-slate-500 text-slate-600">
          You don't have any items in your cart to checkout.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 min-h-screen animate-fade-in font-sans">
      
      {/* Top Stepper */}
      <div className="flex justify-center items-center text-xs md:text-sm font-bold mb-16 mt-4">
        <Link to="/checkout" className="flex items-center text-blue-600 hover:opacity-80 transition-opacity">
          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
          Shopping Cart
        </Link>
        <div className="w-16 md:w-32 h-0.5 bg-blue-600 mx-4"></div>
        <div className="flex items-center text-blue-600">
          <div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>
          Check Out
        </div>
        <div className="w-16 md:w-32 h-0.5 bg-slate-200 dark:bg-slate-800 mx-4"></div>
        <div className="flex items-center text-slate-400">
          <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 mr-2"></div>
          Confirm the Order
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="bg-white bg-white border border-slate-200 border-slate-200 rounded-none shadow-sm overflow-hidden flex flex-col h-full">
            
            {/* Blue Header */}
            <div className="bg-blue-600 text-white px-8 py-5">
              <div className="flex items-center gap-3">
                <FiMapPin className="w-5 h-5" />
                <div>
                  <h2 className="text-lg font-bold">Delivery Address</h2>
                  <p className="text-blue-100 text-xs">Where should we deliver your order?</p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-8 space-y-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="text" name="fullName" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="e.g. Ali Raza" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="tel" name="phoneNumber" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="+92 3XX XXXXXXX" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address (Optional)</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" name="email" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="ali@example.com" />
                </div>
              </div>

              {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Province <span className="text-red-500">*</span></label>
                  <select required className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-500">
                    <option value="">Select Province</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
                  <select required className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-500">
                    <option value="">Select city first</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Postal Code</label>
                  <input type="text" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="e.g. 54000" />
                </div>
              </div>
*/}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Province */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Province <span className="text-red-500">*</span></label>
    <select 
      required 
      value={selectedProvince}
      onChange={(e) => {
        setSelectedProvince(e.target.value);
        setSelectedCity(""); // Reset city
        setPostalCode("");   // Reset postal code
      }}
      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
    >
      <option value="">Select Province</option>
      {Object.keys(locationData).map(p => <option key={p} value={p}>{p}</option>)}
    </select>
  </div>

  {/* City */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">City <span className="text-red-500">*</span></label>
    <select 
      required 
      value={selectedCity}
      disabled={!selectedProvince}
      onChange={(e) => {
        const city = e.target.value;
        setSelectedCity(city);
        setPostalCode(locationData[selectedProvince][city]); // Auto-fill code
      }}
      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
    >
      <option value="">{selectedProvince ? "Select City" : "Select province first"}</option>
      {selectedProvince && Object.keys(locationData[selectedProvince]).map(c => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  </div>

  {/* Postal Code */}
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Postal Code</label>
    <input 
      type="text" 
      value={postalCode}
      readOnly // User doesn't need to type it
      className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-none text-slate-800 cursor-not-allowed" 
      placeholder="e.g. 54000" 
    />
  </div>
</div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Street Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" name="streetAddress" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="House/Flat No., Street, Area" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Order Notes <span className="text-slate-400 normal-case font-medium">(optional)</span></label>
                <textarea rows="3" name="notes" className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-800 placeholder-slate-400" placeholder="Any special instructions for delivery..."></textarea>
              </div>
            </div>

            {/* Footer with Badges and Button */}
            <div className="p-8 pt-0 mt-auto">
              <div className="flex flex-wrap items-center gap-6 mb-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5"><FiShield className="text-blue-500" /> 100% Secure</div>
                <div className="flex items-center gap-1.5"><FiTruck className="text-blue-500" /> Fast Delivery</div>
                <div className="flex items-center gap-1.5"><FiCheckCircle className="text-blue-500" /> Verified Products</div>
              </div>
              
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-none shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Confirm Order'} 
                {!isProcessing && <FiChevronRight className="w-4 h-4" />}
              </button>
            </div>
            
          </form>
        </div>

        {/* Right Side: Order Summary & Info Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Summary Card */}
          <div className="bg-white rounded-none p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-800">Order Summary</h2>
              <span className="text-blue-500 font-bold text-xs">{cart.length} Item{cart.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map(({ product, quantity }) => {
                const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                return (
                  <div key={product.id} className="flex gap-3">
                    <div className="h-12 w-12 bg-slate-50 rounded-none overflow-hidden border border-slate-200 flex-shrink-0">
                      <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-700 line-clamp-1">{product.name}</h4>
                      <p className="text-[10px] text-slate-500">{product.brand} - Qty {quantity}</p>
                    </div>
                    <div className="text-xs font-bold text-slate-800 whitespace-nowrap">
                      Rs. {(discountedPrice * quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Coupon code" className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-none text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-none transition-colors">
                Apply
              </button>
            </div>

            <div className="space-y-2 border-b border-slate-200 pb-4 mb-4 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal</span>
                <span className="text-slate-700 font-bold">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Shipping</span>
                <span className="text-slate-700 font-bold">Rs. {shipping.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">Add Rs. 350 more for FREE shipping!</p>
            </div>

            <div className="flex justify-between text-base font-bold text-slate-800">
              <span>Total</span>
              <span className="text-blue-500">Rs. {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-600 text-white rounded-none p-6 shadow-sm">
            <h3 className="font-bold mb-4">Why shop with us?</h3>
            <ul className="space-y-3 text-sm font-medium text-blue-50">
              <li className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-white/50 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-2.5 h-2.5" />
                </div>
                Genuine & verified products
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-white/50 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-2.5 h-2.5" />
                </div>
                Fast doorstep delivery
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-white/50 flex items-center justify-center flex-shrink-0">
                  <FiCheck className="w-2.5 h-2.5" />
                </div>
                30-day hassle-free returns
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
