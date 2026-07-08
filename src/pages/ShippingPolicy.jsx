import React, { useEffect } from "react";
import { Truck, Cpu } from "lucide-react";

export default function ShippingPolicy() {
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
            <Truck className="w-3.5 h-3.5" />
            <span>Courier Logistics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            Shipping & <span className="text-[#0fafb8]">Delivery Policy</span>
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
              We provide nationwide shipping across Pakistan for all standard components, prototyping supplies, and diagnostic lab equipment.
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                1. Order Processing Time
              </h3>
              <p>
                All standard component orders placed before 3:00 PM (GMT+5) are processed and handed over to our courier partners (TCS, Leopards Courier, or M&P Express) on the same business day. Orders placed after 3:00 PM, on Sundays, or on national holidays will be processed on the next business day.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                2. Delivery Timelines
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Islamabad / Rawalpindi:</strong> 1 to 2 business days.</li>
                <li><strong>Major Cities (Lahore, Karachi, Peshawar, Multan, Faisalabad):</strong> 2 to 3 business days.</li>
                <li><strong>Rest of Pakistan / Remote Regions:</strong> 3 to 5 business days.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                3. Shipping Charges
              </h3>
              <p>
                We charge a flat domestic shipping fee of <strong>Rs. 250</strong> per order. However, standard component and accessory orders totaling <strong>Rs. 5,000</strong> or more qualify for <strong>Free Standard Shipping</strong> nationwide.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <Cpu className="w-4.5 h-4.5 text-[#0fafb8]" />
                <span>4. Custom Fabrication Shipping</span>
              </h3>
              <p>
                For customized PCBs, special diagnostic instruments, and final year projects, delivery timelines are determined by assembly difficulty and will be communicated to the client at the time of proposal sign-off. These units are packaged with anti-shock bubble layers to prevent physical damage during transit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
