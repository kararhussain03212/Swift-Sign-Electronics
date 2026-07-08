import React from 'react';

export default function Banner() {
  return (
    <>
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .banner-scroll {
          animation: scrollLeft 50s linear infinite;
        }
      `}</style>
      <div className="bg-[#0f172a] text-white text-xs md:text-sm font-semibold py-2 px-4 w-full overflow-hidden">
        <div className="banner-scroll flex justify-center items-center gap-6 md:gap-12 whitespace-nowrap">
          <span>100% Genuine Electronic Components</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Nationwide Fast Delivery</span>
          <span className="hidden md:inline">•</span>
          <span>Tech Support: +92 333 8399480</span>
          <span className="mx-4">•</span>
          <span>100% Genuine Electronic Components</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Nationwide Fast Delivery</span>
          <span className="hidden md:inline">•</span>
          <span>Tech Support: +92 333 8399480</span>
        </div>
      </div>
    </>
  );
}
