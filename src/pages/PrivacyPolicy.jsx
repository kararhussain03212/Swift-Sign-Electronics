import React, { useEffect } from "react";
import { Shield, Lock, Cpu } from "lucide-react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-16 animate-fade-in text-left">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white relative py-12 px-6 overflow-hidden border-b-4 border-[#0fafb8]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0fafb8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0fafb8]/20 text-[#0fafb8] border border-[#0fafb8]/40 text-[10px] font-black uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" />
            <span>Operational Integrity</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            Privacy <span className="text-[#0fafb8]">Policy</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Last updated: July 8, 2026
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-10">
        <div className="bg-white border border-slate-200 p-6 md:p-10 shadow-xs">
          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-medium">
            <p>
              Swift Sign Electronics (operated by Swift Sign General Trading) respects your privacy and is dedicated to protecting your personal information. This Privacy Policy details how we collect, use, and safe-keep your data when you visit our website or make a purchase from our store.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Lock className="w-4.5 h-4.5 text-[#0fafb8]" />
                <span>1. Information We Collect</span>
              </h3>
              <p>
                We collect information to provide better services to all our users. The types of personal information we collect include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Identity and Contact Data:</strong> Includes name, billing address, delivery address, email address, and telephone numbers.
                </li>
                <li>
                  <strong>Transaction Data:</strong> Details about payments to and from you, and other details of products and services you have purchased from us.
                </li>
                <li>
                  <strong>Technical & Custom Data:</strong> If you order custom design fabrications or academic final year prototypes, we collect your design specifications, schematics (PDF/CAD), firmware source code files, and related guidelines.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Cpu className="w-4.5 h-4.5 text-[#0fafb8]" />
                <span>2. Design File Confidentiality (NDA)</span>
              </h3>
              <p>
                We understand the sensitivity of electronic project layouts, industrial PCB designs, and custom firmware code. All design assets submitted to our portal are treated under a strict non-disclosure standard:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Submitted engineering files are accessed solely by authorized assembly engineers.</li>
                <li>We never share, sell, or distribute your circuit schematics or custom code bases.</li>
                <li>Design files are automatically archived and removed from our active fabrication queues thirty (30) days after order dispatch.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                3. Data Security
              </h3>
              <p>
                We have implemented security protocols to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. All payment processing information is handled securely using encrypted SSL technology.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                4. Cookies
              </h3>
              <p>
                Our website utilizes standard browser cookies to help manage session states (keeping track of items in your cart, dashboard logins, and search history). You can choose to disable cookies in your browser settings, though doing so may limit your ability to place orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
