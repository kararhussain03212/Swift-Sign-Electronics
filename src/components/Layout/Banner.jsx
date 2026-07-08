import React from 'react';

export default function Banner() {
  return (
    <div className="bg-[#0f172a] text-white text-xs md:text-sm font-semibold py-2 px-4 w-full flex justify-center items-center gap-6 md:gap-12 flex-wrap tracking-wide">
      <span>100% Genuine Electronic Components</span>
      <span className="hidden md:inline">Nationwide Fast Delivery</span>
      <span>Tech Support: +92 333 8399480</span>
    </div>
  );
}
