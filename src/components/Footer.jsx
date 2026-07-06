import React, { useState } from 'react';
import { FiCpu, FiMail, FiPhone, FiMapPin, FiShield, FiTruck, FiRefreshCw, FiSmile } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube, FaGithub } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setIsSubscribed(false);
      alert("Successfully subscribed to our newsletter! We'll keep you updated on new parts and shipments.");
    }, 1000);
  };

  return (
    <footer className="bg-slate-900 text-slate-400 mt-20 pt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Core Value Badges Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-blue-450 rounded-2xl">
              <FiTruck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Free Delivery</h4>
              <p className="text-xs text-slate-500 mt-0.5">On orders over $150.00</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-orange-450 rounded-2xl">
              <FiShield className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Secure Payments</h4>
              <p className="text-xs text-slate-500 mt-0.5">SSL Encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-emerald-450 rounded-2xl">
              <FiRefreshCw className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Easy Returns</h4>
              <p className="text-xs text-slate-500 mt-0.5">30-day money-back policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-slate-800 text-purple-450 rounded-2xl">
              <FiSmile className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Expert Support</h4>
              <p className="text-xs text-slate-500 mt-0.5">Lifetime technical assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Company Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 text-blue-400">
              <div className="p-2 bg-blue-600 text-white rounded-xl">
                <FiCpu className="w-5 h-5" />
              </div>
              <span className="font-black text-white text-lg tracking-wider uppercase">
                Swift Sign Electronics
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your premier online warehouse for electronic components, high-grade workbench instruments, and STEM robotics hardware. Supplying creators, makers, and engineers since 2012.
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all"><FaFacebook className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-blue-400 hover:text-white rounded-xl transition-all"><FaTwitter className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-blue-800 hover:text-white rounded-xl transition-all"><FaLinkedin className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-red-600 hover:text-white rounded-xl transition-all"><FaYoutube className="w-4 h-4" /></a>
              <a href="#" className="p-2.5 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-all"><FaGithub className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Links column 1 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-black text-white text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-450 hover:underline">Tools & Soldering</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Bench Instruments</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Robotics & Arduino</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">IoT & Sensors</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">PCB Kits</a></li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-black text-white text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-450 hover:underline">Component Datasheets</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Wiring Schematics</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Arduino Libraries</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Tutorials & Blog</a></li>
              <li><a href="#" className="hover:text-blue-450 hover:underline">Developer SDK</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-black text-white text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-slate-500">
              Subscribe to get updates on parts arrivals, weekend flash sales, and developer schematics.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-4 pr-10 py-3 bg-slate-800 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-white placeholder-slate-500"
                />
                <FiMail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              <button
                type="submit"
                disabled={isSubscribed}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                {isSubscribed ? 'Adding...' : 'Subscribe'}
              </button>
            </form>
          </div>

        </div>

        {/* Lower footer copyright info */}
        <div className="pt-8 pb-12 border-t border-slate-800 text-xs flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600">
          <p>© {new Date().getFullYear()} Swift Sign Electronics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Cookie Settings</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
