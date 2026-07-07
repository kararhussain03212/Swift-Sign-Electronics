import React, { useState, useRef, useEffect } from 'react';
import { FiMaximize2, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

export default function ProductGallery({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const touchStart = useRef(null);
  const containerRef = useRef(null);

  // Keyboard controls for fullscreen gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Magnifier (Zoom on hover) for desktop
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${images[activeIndex]})`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  // Swipe support for mobile
  const handleTouchStart = (e) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart.current - currentTouch;

    if (diff > 50) {
      handleNext();
      touchStart.current = null;
    } else if (diff < -50) {
      handlePrev();
      touchStart.current = null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Large Product Preview Window */}
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="relative aspect-square w-full rounded-none overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-center cursor-crosshair group"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={images[activeIndex]}
          alt={`Product View ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300 pointer-events-none"
        />

        {/* Hover zoom panel overlay (Desktop only) */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none z-10 bg-no-repeat bg-cover border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 transition-opacity duration-150"
          style={{
            ...zoomStyle,
            backgroundSize: '200%',
          }}
        />

        {/* Action icons */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 p-3 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-xs text-slate-700 dark:text-slate-200 rounded-none shadow-lg hover:scale-105 transition-all opacity-0 group-hover:opacity-100 duration-300 cursor-pointer"
          title="Fullscreen View"
        >
          <FiMaximize2 className="w-5 h-5" />
        </button>

        {/* Next/Prev Navigation overlay (Desktop only) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-xs text-slate-700 dark:text-slate-350 rounded-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-xs text-slate-700 dark:text-slate-350 rounded-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-none">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Multiple Thumbnail Images */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 rounded-none overflow-hidden bg-slate-50 dark:bg-slate-950 flex-shrink-0 border-2 cursor-pointer transition-all ${
                activeIndex === index
                  ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <>
        {isFullscreen && (
          <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            {/* Top Bar controls */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white z-[110]">
              <span className="font-bold text-sm">
                Image {activeIndex + 1} of {images.length}
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-none backdrop-blur-md transition-all cursor-pointer"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Image display */}
            <div className="relative max-w-5xl w-full h-[70vh] flex items-center justify-center">
              <img
                key={activeIndex}
                src={images[activeIndex]}
                alt={`Lightbox view`}
                className="max-h-full max-w-full object-contain rounded-none"
              />

              {/* Lightbox arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 p-4 bg-white/5 hover:bg-white/10 text-white rounded-none backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <FiChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-0 p-4 bg-white/5 hover:bg-white/10 text-white rounded-none backdrop-blur-xs transition-all cursor-pointer"
                  >
                    <FiChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail tray in Fullscreen */}
            <div className="absolute bottom-6 flex gap-2.5 max-w-full overflow-x-auto px-4 z-[110]">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-14 w-14 rounded-none overflow-hidden border-2 cursor-pointer transition-all ${
                    activeIndex === index
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
