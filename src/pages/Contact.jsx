import React, { useState } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare, 
  FiUser, FiBookmark, FiMessageCircle, FiFacebook, 
  FiInstagram, FiYoutube, FiCheckCircle
} from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: null });

    // Simulate API request
    setTimeout(() => {
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
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12 text-left animate-fade-in">
      
      {/* Hero Title Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest rounded-none border border-blue-100 dark:border-blue-900/30 uppercase">
          + GET IN TOUCH
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
          Contact <span className="text-blue-600 dark:text-blue-400">Swift Sign Electronics</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Questions about our products? Bulk orders? Feedback? We're here for you — always.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Form Column (Span 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-none p-6 md:p-10 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Form Title */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
              <FiMessageSquare className="w-4 h-4 text-blue-500" />
              <span>Send Us A Message</span>
            </div>

            {formStatus.success ? (
              <div className="p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-[#2c633a] dark:text-emerald-400 rounded-none text-center space-y-4 my-8 animate-fade-in">
                <FiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
                    Thank you for contacting Swift Sign Electronics. Our dedicated support team has received your message and will reach out to you shortly.
                  </p>
                </div>
                <button 
                  onClick={() => setFormStatus({ submitting: false, success: false, error: null })}
                  className="inline-block mt-4 text-xs font-black underline text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <FiUser className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Full Name *"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-450 focus:ring-1 focus:ring-blue-500/25 transition-all text-sm"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <FiMail className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Email Address *"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-450 focus:ring-1 focus:ring-blue-500/25 transition-all text-sm"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <FiPhone className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-450 focus:ring-1 focus:ring-blue-500/25 transition-all text-sm"
                    />
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                      <FiBookmark className="w-4.5 h-4.5" />
                    </span>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      placeholder="Subject *"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-450 focus:ring-1 focus:ring-blue-500/25 transition-all text-sm"
                    />
                  </div>

                </div>

                {/* Textarea Message */}
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 dark:text-slate-500">
                    <FiMessageSquare className="w-4.5 h-4.5" />
                  </span>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Your Message *"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-450 focus:ring-1 focus:ring-blue-500/25 transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-none shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 text-white rounded-none p-6 md:p-8 flex flex-col justify-between space-y-8 shadow-xs">
          
          <div className="space-y-6">
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-850 text-slate-300 text-[10px] font-black tracking-widest rounded-none border border-slate-800 uppercase">
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
              <div className="p-4 bg-slate-850/60 dark:bg-slate-950/40 border border-slate-800/50 rounded-none flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMessageCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Whatsapp</span>
                  <strong className="block text-sm font-bold text-white tracking-wide">+92 333 8399480</strong>
                  <a 
                    href="https://wa.me/923338399480"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-750 text-white text-[10px] font-black rounded-none transition-colors mt-2"
                  >
                    <FiMessageCircle className="w-3 h-3" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 bg-slate-850/60 dark:bg-slate-950/40 border border-slate-800/50 rounded-none flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiPhone className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Phone</span>
                  <strong className="block text-sm font-bold text-white tracking-wide">+92 333 8399480</strong>
                </div>
              </div>

              {/* Email */}
              <div className="p-4 bg-slate-850/60 dark:bg-slate-950/40 border border-slate-800/50 rounded-none flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMail className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Email</span>
                  <strong className="block text-xs font-bold text-white tracking-wide break-all">info@swiftsigngeneraltrading.com</strong>
                </div>
              </div>

              {/* Address */}
              <div className="p-4 bg-slate-850/60 dark:bg-slate-950/40 border border-slate-800/50 rounded-none flex items-start gap-4">
                <div className="w-10 h-10 rounded-none bg-blue-600/10 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiMapPin className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-slate-500 tracking-wider uppercase">Address</span>
                  <p className="text-xs text-white leading-relaxed font-semibold">
                    Office 22, 4th Floor, Pakland City Center, I-8 Markaz, Islamabad, Pakistan
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Social Links footer block */}
          <div className="pt-5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Follow Us</span>
            <div className="flex gap-2.5">
              <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors" title="Facebook">
                <FiFacebook className="w-[17px] h-[17px]" />
              </a>
              <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors" title="Instagram">
                <FiInstagram className="w-[17px] h-[17px]" />
              </a>
              <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors" title="YouTube">
                <FiYoutube className="w-[17px] h-[17px]" />
              </a>
              <a href="#" className="w-[37px] h-[37px] rounded-none bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors" title="TikTok">
                <FaTiktok className="w-[17px] h-[17px]" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
