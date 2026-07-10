import React, { useState } from 'react';
import { 
 FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, 
 FiUser, FiBookmark, FiMessageCircle, FiFacebook, 
 FiInstagram, FiYoutube, FiCheckCircle
} from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import { submitContact } from '../api/shopApi';

export default function Contact() {
 // Contact Form State
 const [formData, setFormData] = useState({
 name: '',
 email: '',
 phone: '',
 subject: '',
 message: ''
 });

 const [formStatus, setFormStatus] = useState({
 submitting: false,
 success: false,
 error: null
 });

 const handleInputChange = (e) => {
 const { name, value } = e.target;
 setFormData(prev => ({
 ...prev,
 [name]: value
 }));
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setFormStatus({ submitting: true, success: false, error: null });

 try {
 await submitContact(formData);
 setFormStatus({
 submitting: false,
 success: true,
 error: null
 });
 // Clear form
 setFormData({
 name: '',
 email: '',
 phone: '',
 subject: '',
 message: ''
 });
 } catch (err) {
 setFormStatus({
 submitting: false,
 success: false,
 error: err.message || 'Failed to send message. Please try again.'
 });
 }
 };

 return (
 <div className="max-w-6xl mx-auto py-8 space-y-12 text-left animate-fade-in">
 
 {/* Hero Title Section */}
 <div className="text-center space-y-4 max-w-3xl mx-auto">
 <span className="inline-block px-3 py-1 bg-[#0fafb8]/10 text-[#0fafb8] text-[10px] font-black tracking-widest rounded-none border border-[#0fafb8]/30 uppercase">
 + GET IN TOUCH
 </span>
 <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-wide">
 Contact <span className="text-[#0fafb8] ">Swift Sign Electronics</span>
 </h1>
 <p className="text-sm md:text-base text-slate-500 leading-relaxed font-semibold">
 Questions about our products? Bulk orders? Feedback? We're here for you — always.
 </p>
 </div>

 {/* Main Content Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
 
 {/* Left Form Column (Span 7) */}
 <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-none p-6 md:p-10 shadow-xs flex flex-col justify-between">
 <div className="space-y-6">
 
 {/* Form Title */}
 <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-wider">
 <FiMessageSquare className="w-4 h-4 text-[#0fafb8]" />
 <span>Send Us A Message</span>
 </div>

 {formStatus.success ? (
 <div className="p-8 bg-emerald-50 border border-emerald-200 text-[#2c633a] rounded-none text-center space-y-4 my-8 animate-fade-in">
 <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
 <div className="space-y-2">
 <h3 className="text-lg font-black text-slate-800 uppercase tracking-wider">Message Sent Successfully!</h3>
 <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
 Thank you for contacting Swift Sign Electronics. Our dedicated support team has received your message and will reach out to you shortly.
 </p>
 </div>
 <button 
 onClick={() => setFormStatus({ submitting: false, success: false, error: null })}
 className="inline-block mt-4 text-xs font-black underline text-[#0fafb8] hover:underline cursor-pointer"
 >
 Send another message
 </button>
 </div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-5">
 
 {/* Inputs Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
 {/* Full Name */}
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ">
 <FiUser className="w-4.5 h-4.5" />
 </span>
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 required
 placeholder="Full Name *"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8]/25 transition-all text-sm"
 />
 </div>

 {/* Email Address */}
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ">
 <FiMail className="w-4.5 h-4.5" />
 </span>
 <input
 type="email"
 name="email"
 value={formData.email}
 onChange={handleInputChange}
 required
 placeholder="Email Address *"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8]/25 transition-all text-sm"
 />
 </div>

 {/* Phone Number */}
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ">
 <FiPhone className="w-4.5 h-4.5" />
 </span>
 <input
 type="tel"
 name="phone"
 value={formData.phone}
 onChange={handleInputChange}
 placeholder="Phone Number"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8]/25 transition-all text-sm"
 />
 </div>

 {/* Subject */}
 <div className="relative">
 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ">
 <FiBookmark className="w-4.5 h-4.5" />
 </span>
 <input
 type="text"
 name="subject"
 value={formData.subject}
 onChange={handleInputChange}
 required
 placeholder="Subject *"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8]/25 transition-all text-sm"
 />
 </div>

 </div>

 {/* Textarea Message */}
 <div className="relative">
 <span className="absolute left-4 top-4 text-slate-400 ">
 <FiMessageSquare className="w-4.5 h-4.5" />
 </span>
 <textarea
 name="message"
 value={formData.message}
 onChange={handleInputChange}
 required
 rows="6"
 placeholder="Your Message *"
 className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-none text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8]/25 transition-all text-sm resize-none"
 ></textarea>
 </div>

 {/* Submit Button */}
 <button
 type="submit"
 disabled={formStatus.submitting}
 className="w-full py-4 bg-[#0fafb8] hover:bg-[#0a8d95] text-white font-black text-sm uppercase tracking-widest rounded-none shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
 >
 {formStatus.submitting ? (
 <>
 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
 </svg>
 <span>Sending...</span>
 </>
 ) : (
 <>
 <span>Send Message</span>
 <FiSend className="w-3.5 h-3.5" />
 </>
 )}
 </button>

 </form>
 )}

 </div>
 </div>

 {/* Right Information Column (Span 5) */}
 <div className="lg:col-span-5 bg-white border border-slate-200/80 text-slate-900 rounded-none p-6 md:p-8 flex flex-col justify-between space-y-8 shadow-xs">
 
 <div className="space-y-6">
 {/* Availability Badge */}
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black tracking-widest rounded-none border border-slate-200 uppercase">
 <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
 <span>Available Mon - Sat, 9am - 6pm</span>
 </div>

 {/* Header Text */}
 <div className="space-y-2">
 <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide">We'd love to hear from you</h2>
 <p className="text-xs text-slate-400 leading-relaxed font-semibold">
 Reach out through any channel below and our dedicated team will respond promptly.
 </p>
 </div>

 {/* Support Cards Stack */}
 <div className="space-y-4">
 
 {/* Whatsapp */}
 <a href="https://wa.me/923338399480" target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-none flex items-start gap-4 transition-all group">
 <div className="w-10 h-10 rounded-none bg-[#0fafb8]/10 text-[#0fafb8] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#0fafb8]/20 group-hover:text-[#0a8d95] transition-colors">
 <FiMessageCircle className="w-5 h-5" />
 </div>
 <div className="space-y-1">
 <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Whatsapp</span>
 <strong className="block text-sm font-bold text-slate-900 tracking-wide">+92 333 8399480</strong>
 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0fafb8] group-hover:bg-[#0fafb8]/100 text-white text-[10px] font-black rounded-none transition-colors mt-2">
 <FiMessageCircle className="w-3 h-3" />
 <span>Chat on WhatsApp</span>
 </div>
 </div>
 </a>

 {/* Phone */}
 <a href="tel:+923338399480" className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-none flex items-start gap-4 transition-all group">
 <div className="w-10 h-10 rounded-none bg-[#0fafb8]/10 text-[#0fafb8] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#0fafb8]/20 group-hover:text-[#0a8d95] transition-colors">
 <FiPhone className="w-4.5 h-4.5" />
 </div>
 <div className="space-y-1">
 <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Phone</span>
 <strong className="block text-sm font-bold text-slate-900 tracking-wide">+92 333 8399480</strong>
 </div>
 </a>

 {/* Email */}
 <a href="mailto:info@swiftsigngeneraltrading.com" className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-none flex items-start gap-4 transition-all group">
 <div className="w-10 h-10 rounded-none bg-[#0fafb8]/10 text-[#0fafb8] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#0fafb8]/20 group-hover:text-[#0a8d95] transition-colors">
 <FiMail className="w-4.5 h-4.5" />
 </div>
 <div className="space-y-1">
 <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Email</span>
 <strong className="block text-xs font-bold text-slate-900 tracking-wide break-all">info@swiftsigngeneraltrading.com</strong>
 </div>
 </a>

 {/* Address */}
 <a href="https://maps.google.com/?q=Office+22,+4th+Floor,+Pakland+City+Center,+I-8+Markaz,+Islamabad,+Pakistan" target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-none flex items-start gap-4 transition-all group">
 <div className="w-10 h-10 rounded-none bg-[#0fafb8]/10 text-[#0fafb8] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#0fafb8]/20 group-hover:text-[#0a8d95] transition-colors">
 <FiMapPin className="w-4.5 h-4.5" />
 </div>
 <div className="space-y-1">
 <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Address</span>
 <p className="text-xs text-slate-900 leading-relaxed font-semibold">
 Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan
 </p>
 </div>
 </a>

 </div>
 </div>

 {/* Social Links footer block */}
 <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
 <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Follow Us</span>
 <div className="flex gap-2.5">
 <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors" title="Facebook">
 <FiFacebook className="w-[17px] h-[17px]" />
 </a>
 <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors" title="Instagram">
 <FiInstagram className="w-[17px] h-[17px]" />
 </a>
 <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors" title="YouTube">
 <FiYoutube className="w-[17px] h-[17px]" />
 </a>
 <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors" title="TikTok">
 <FaTiktok className="w-[17px] h-[17px]" />
 </a>
 </div>
 </div>

 </div>

 </div>

 </div>
 );
}
