import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react';
import { FaGithub, FaDiscord, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t-4 border-[#0fafb8] text-slate-300 font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0fafb8]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Swift Sign <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0fafb8] to-blue-400">Electronics</span>
              </h2>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home Page', path: '/' },
                { name: 'About Us', path: '#about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Support & FAQs', path: '#faq' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-[#0fafb8] hover:translate-x-1 inline-block transition-all duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / About */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Legal Information</h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Terms & Conditions', path: '/terms-and-conditions' },
                { name: 'Privacy Policy', path: '/privacy-policy' },
                { name: 'Return Policy', path: '/return-policy' },
                { name: 'Shipping Policy', path: '/shipping-policy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-[#0fafb8] hover:translate-x-1 inline-block transition-all duration-200">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">Get in Touch</h3>
            <ul className="flex flex-col gap-5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-base">+92 315 8399446</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-base">info@it.swiftsignbm.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#0fafb8] shrink-0 mt-0.5" size={20} />
                <div className="flex flex-col">
                  <span className="text-slate-300 leading-relaxed">Office 22, 4th Floor, Pakland city center, I-8 Markaz, Islamabad, Pakistan.</span>
                </div>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-10 h-10 bg-slate-900 hover:bg-[#0fafb8] border border-slate-800 hover:border-[#0fafb8] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300">
                <FaGithub size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-900 hover:bg-[#0fafb8] border border-slate-800 hover:border-[#0fafb8] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300">
                <FaDiscord size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-900 hover:bg-[#0fafb8] border border-slate-800 hover:border-[#0fafb8] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-900 hover:bg-[#0fafb8] border border-slate-800 hover:border-[#0fafb8] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-sm relative z-10">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Swift Sign Electronics. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-600 font-medium">Designed by <a href="https://it.swiftsignbm.com/" target="_blank" rel="noopener noreferrer" className="text-[#0fafb8] hover:text-blue-400 font-bold transition-colors">swiftsign</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}