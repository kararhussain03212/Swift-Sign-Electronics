import React, { useState } from 'react';
import { 
  Grid, 
  Volume2, 
  Network, 
  Home, 
  Plane, 
  Microscope, 
  Sun, 
  Cpu, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export const BLOG_CATEGORIES = [
  { icon: Grid, label: "All categories" },
  { icon: Volume2, label: "Audio and sound" },
  { icon: Network, label: "Internet of things" },
  { icon: Home, label: "Installations" },
  { icon: Home, label: "Home automation" },
  { icon: Plane, label: "Flying things" },
  { icon: Microscope, label: "Lab tools" },
  { icon: Sun, label: "Environment monitoring" },
  { icon: Cpu, label: "Robotics" }
];

export default function Categories({ activeCat, onCatSelect }) {
  const [scrollIdx, setScrollIdx] = useState(0);
  const visible = 6;
  
  const handlePrev = () => {
    if (scrollIdx > 0) {
      setScrollIdx(scrollIdx - 1);
    } else {
      setScrollIdx(BLOG_CATEGORIES.length - visible);
    }
  };

  const handleNext = () => {
    if (scrollIdx + visible < BLOG_CATEGORIES.length) {
      setScrollIdx(scrollIdx + 1);
    } else {
      setScrollIdx(0);
    }
  };

  return (
    <div className="mt-8 mb-6 flex items-center justify-between border-b border-gray-200 dark:border-[#2e303a] pb-2 relative">
      <button
        onClick={handlePrev}
        aria-label="Scroll categories left"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-[#2e303a] text-gray-500 dark:text-gray-400 hover:text-black hover:border-black transition cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex flex-1 items-center justify-between mx-4 overflow-hidden">
        {BLOG_CATEGORIES.slice(scrollIdx, scrollIdx + visible).map((cat, i) => {
          const realIdx = scrollIdx + i;
          const isActive = realIdx === activeCat;
          const Icon = cat.icon;
          return (
            <button
              key={cat.label + realIdx}
              onClick={() => onCatSelect?.(realIdx)}
              className="group flex flex-col items-center gap-2 px-3 pb-3 text-center cursor-pointer transition-all relative"
              style={{ minWidth: '100px' }}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${isActive ? "text-black" : "text-gray-400 dark:text-gray-500 group-hover:text-black"}`}
              />
              <span
                className={`text-xs font-bold tracking-tight truncate max-w-full transition-colors ${isActive ? "text-black" : "text-gray-500 dark:text-gray-400 group-hover:text-black"}`}
              >
                {cat.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black rounded-full animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        aria-label="Scroll categories right"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-[#2e303a] text-gray-500 dark:text-gray-400 hover:text-black hover:border-black transition cursor-pointer"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
