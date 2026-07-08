import React, { useEffect } from "react";
import { FileText, AlertCircle } from "lucide-react";

export default function TermsAndConditions() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            Terms & <span className="text-[#0fafb8]">Conditions</span>
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
              Welcome to Swift Sign Electronics. These Terms and Conditions govern your use of our e-commerce portal, procurement of electronic hardware components, and commission of custom design prototypes. By accessing our services, you agree to be bound by these terms.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                1. General Conditions
              </h3>
              <p>
                We reserve the right to refuse service to anyone for any reason at any time. You understand that your personal content (excluding bank or credit card information), may be transferred unencrypted over various network paths.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                2. Product Specifications & Pricing
              </h3>
              <p>
                Prices for our products are subject to change without notice, driven by global logistics and raw material supply chains. We make every effort to display the technical attributes and colors of components as accurately as possible, but do not warrant that all descriptions are error-free.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                3. Operational Use & Limitation of Liability
              </h3>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-xs flex gap-3 items-start my-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block mb-1 uppercase tracking-wide">
                    Important Hardware Disclaimer
                  </strong>
                  Electronic components (microcontrollers, MOSFETs, capacitors, etc.) require precise voltage levels and polarized polarity lines. Swift Sign Electronics is not liable for components that burn, explode, or malfunction due to user handling error, wrong connections, short circuits, or insufficient heat management.
                </div>
              </div>
              <p>
                Furthermore, custom assembled development models and final year project prototypes are supplied strictly for educational and testing purposes. Swift Sign Electronics does not take responsibility for their operation in live or high-voltage commercial environments.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                4. Governing Law
              </h3>
              <p>
                These Terms & Conditions and any separate service agreements shall be governed by and construed in accordance with the laws of the Islamic Republic of Pakistan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
