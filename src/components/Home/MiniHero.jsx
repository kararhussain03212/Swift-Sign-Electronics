import React from 'react';

export default function MiniHero({ title, subtitle }) {
  return (
    <div className="relative w-full bg-[#09090b] py-8 px-6 text-center overflow-hidden mb-6">
      {/* Background Image with dimming scale effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: "url('/hero5.png')" }}
      />
      {/* Top Black Shadow front layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[#09090b]/40 pointer-events-none z-0"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 text-white flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-[#84cc16] mb-1">
          {title}
        </h1>
        <p className="text-[10px] md:text-xs text-gray-300 font-bold max-w-xl mx-auto tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
