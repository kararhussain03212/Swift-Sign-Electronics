import React from 'react';

export default function Banner() {
  return (
    <>
      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .banner-scroll {
          display: flex;
          width: max-content;
          animation: scrollLeft 40s linear infinite;
        }
        
        .banner-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="bg-[#0f172a] text-white text-xs md:text-sm font-semibold py-2 w-full overflow-hidden flex whitespace-nowrap">
        <div className="banner-scroll">
          <div className="flex items-center gap-6 md:gap-12 pr-6 md:pr-12">
            <span>100% Genuine Electronic Components</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Nationwide Fast Delivery</span>
            <span className="hidden md:inline">•</span>
            <span>Tech Support: +92 333 8399480</span>
          </div>
        </div>
      </div>
    </>
  );
}
