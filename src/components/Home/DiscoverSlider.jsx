import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './DiscoverSlider.css';

export default function DiscoverSlider({ projects = [], onProjectSelect }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollAmount = 320;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 15) {
          containerRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <div className="discover-slider-section">
      <h2 className="discover-slider-heading">Discover</h2>
      
      <div className="discover-slider-wrapper">
        <button 
          onClick={() => scroll('left')}
          className="discover-scroll-btn left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="discover-slider-container animate-fade-in" ref={containerRef}>
          {projects.map((proj) => (
            <div 
              key={proj.id} 
              onClick={() => onProjectSelect?.(proj)}
              className="premium-card discover-card"
            >
              <div className="premium-card-info">
                <span className="discover-card-category">{proj.category}</span>
                <h3 className="discover-card-title">{proj.title}</h3>
                <span className="discover-card-metric">Free Guide</span>
              </div>
              <div className="premium-card-image-wrapper">
                <img src={proj.image} alt={proj.title} className="premium-card-image" />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="discover-scroll-btn right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
