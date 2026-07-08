import React from 'react';

export default function MiniHero({ title, subtitle }) {
  return (
    <div 
      className="relative w-full py-12 px-6 text-center overflow-hidden mb-6"
      style={{
        background: "linear-gradient(135deg, #f7931e 0%, #0042d7 100%)"
      }}
    >
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 pointer-events-none"
        style={{ backgroundImage: "url('/hero5.png')" }}
      />
      {/* Background shapes (same as Blogs hero banner) */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: "-80px",
          top: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          right: "80px",
          top: "30px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: "-30px",
          top: "40%",
          width: "120px",
          height: "40px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.04)",
          transform: "rotate(-20deg)",
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10 text-white flex flex-col items-center justify-center">
        <h1 className="text-xl md:text-2xl font-extrabold uppercase tracking-widest text-[#fef9c3] mb-1">
          {title}
        </h1>
        <p className="text-[10px] md:text-xs text-white/80 font-bold max-w-xl mx-auto tracking-wide">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
