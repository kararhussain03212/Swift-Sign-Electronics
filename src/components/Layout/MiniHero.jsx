import React from 'react';

export default function MiniHero({ title, subtitle }) {
  return (
    <div className="bg-gradient-to-r from-[#0fafb8] to-[#0a8d95] text-white py-12 md:py-16">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-gray-100 text-lg max-w-2xl">{subtitle}</p>
      </div>
    </div>
  );
}
