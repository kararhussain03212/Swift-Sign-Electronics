import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import './DiscoverSlider.css';

// Pastel backgrounds list to match standard Daily Well-being color cards
const PASTEL_COLORS = [
  '#f0fdf4', // Light green tint
  '#f0f9ff', // Light blue tint
  '#fefce8', // Light yellow tint
  '#faf5ff', // Light purple tint
  '#fff1f2', // Light pink tint
];

const getPastelBg = (id) => {
  const numId = typeof id === 'number' ? id : (id || '').toString().length;
  return PASTEL_COLORS[numId % PASTEL_COLORS.length];
};

export default function DiscoverSlider({ projects = [], onProjectSelect }) {
  const containerRef = useRef(null);

  // Autoplay / self-moving effect
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const timer = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // If we reach near the end, reset scroll back to 0
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollAmount = clientWidth * 0.85;
          containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [projects]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      // Scroll by 85% of visible width for full page flow
      const scrollAmount = clientWidth * 0.85;

      if (direction === 'right') {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!projects || projects.length === 0) return null;

  return (
    <div className="discover-slider-section">
      {/* Header with Title and Control Buttons */}
      <div className="discover-slider-header">
        <h2 className="discover-slider-heading">Discover</h2>
        <div className="discover-slider-controls">
          <span className="discover-view-all" onClick={() => onProjectSelect?.(projects[0])}>
            View All
          </span>
          <button 
            onClick={() => scroll('left')}
            className="discover-header-nav-btn"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="discover-header-nav-btn"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
      
      {/* Slider Wrapper */}
      <div className="discover-slider-wrapper">
        <div className="discover-slider-container" ref={containerRef}>
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => onProjectSelect?.(proj)}
              className="discover-premium-product-card"
            >
              {/* Top Image Panel with dynamic pastel background */}
              <div 
                className="discover-product-image-wrapper"
                style={{ backgroundColor: getPastelBg(proj.id) }}
              >
                <img src={proj.image} alt={proj.title} className="discover-product-image" />
              </div>

              {/* Bottom Info Details */}
              <div className="discover-product-info">
                <div>
                  <span className="discover-product-brand">{proj.category}</span>
                  <h3 className="discover-product-title">{proj.title}</h3>
                </div>
                <div>
                  <div className="discover-product-price">Free Guide</div>
                  <button className="discover-product-action-btn">
                    <BookOpen className="h-4 w-4" /> READ GUIDE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
