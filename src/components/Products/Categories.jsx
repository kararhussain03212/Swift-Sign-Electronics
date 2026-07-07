import React, { useState, useEffect } from 'react';
import './Categories.css';
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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive dynamic visible categories count
  let visible = 6;
  if (windowWidth < 480) {
    visible = 2;
  } else if (windowWidth < 768) {
    visible = 3;
  } else if (windowWidth < 1024) {
    visible = 4;
  }
  
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

      <div className="flex flex-1 items-center justify-center gap-3 mx-4 overflow-hidden">
        {BLOG_CATEGORIES.slice(scrollIdx, scrollIdx + visible).map((cat, i) => {
          const realIdx = scrollIdx + i;
          const isActive = realIdx === activeCat;
          const Icon = cat.icon;
          return (
            <button
              key={cat.label + realIdx}
              onClick={() => onCatSelect?.(realIdx)}
              className={`category-item-btn ${isActive ? 'active' : ''}`}
            >
              <Icon className="category-icon" />
              <span className="category-label">
                {cat.label}
              </span>
              {isActive && (
                <div className="category-active-line animate-fade-in" />
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
