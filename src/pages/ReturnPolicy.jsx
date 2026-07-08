import React, { useEffect } from "react";
import { RotateCcw, Cpu, Layers } from "lucide-react";

export default function ReturnPolicy() {
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
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Customer Assurances</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            Return & <span className="text-[#0fafb8]">Refund Policy</span>
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
              At Swift Sign Electronics, we stand by the quality of our electronic components and developer accessories. Due to the delicate nature of electronic hardware, please review the rules regarding returns and exchanges below:
            </p>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <Cpu className="w-4.5 h-4.5 text-[#0fafb8]" />
                <span>1. Standard Electronic Components</span>
              </h3>
              <p>
                Bare electronic parts, microchips, sensor breakout boards, and development controllers (such as Arduino, ESP32, and Raspberry Pi) are eligible for return or exchange within <strong>7 days</strong> of delivery.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-500">
                <li>Items must be returned in their original packaging, inside the original anti-static shielded bag.</li>
                <li>Components must show no signs of soldering, pin modifications, heat exposure, or voltage damage.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-2">
                <Layers className="w-4.5 h-4.5 text-[#0fafb8]" />
                <span>2. Custom Assembled Systems & FYP Kits</span>
              </h3>
              <p>
                Any finalized prototypes, custom soldered boards, PCB printing runs, or commissioned Final Year Projects (FYP) are <strong>non-returnable and non-refundable</strong>. These items are built to order using dedicated labor and specialized custom parts.
              </p>
              <p>
                However, we provide a <strong>15-day technical verification support period</strong>: if your custom prototype experiences code or routing issues, our team will provide free engineering diagnostics and hardware re-work.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wide">
                3. Return Shipping Cost
              </h3>
              <p>
                Customers are responsible for paying the shipping costs for returning items. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund, unless the item was proven defective upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
