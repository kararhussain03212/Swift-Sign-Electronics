import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BookOpen, Heart, Eye } from 'lucide-react';
import './DiscoverSlider.css';

export default function DiscoverSlider({ projects = [], onProjectSelect }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const REPETITIONS = 30;
  const infiniteProjects = Array(REPETITIONS)
    .fill(projects)
    .flat()
    .map((p, index) => ({
      ...p,
      uniqueKey: `${p.id}-${index}`
    }));

  useEffect(() => {
    if (containerRef.current && projects.length > 0) {
      const middleSetIndex = Math.floor(REPETITIONS / 2) * projects.length;
      const targetElement = containerRef.current.children[middleSetIndex];
      if (targetElement) {
        containerRef.current.scrollLeft = targetElement.offsetLeft - 16;
      }
    }
  }, [projects]);

  const scroll = (direction) => {
    if (containerRef.current && projects.length > 0) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollAmount = 316;

      if (direction === 'right') {
        if (scrollLeft + clientWidth >= scrollWidth - clientWidth * 2) {
          const middleSetIndex = Math.floor(REPETITIONS / 2) * projects.length;
          const targetElement = containerRef.current.children[middleSetIndex];
          if (targetElement) containerRef.current.scrollLeft = targetElement.offsetLeft - 16;
        }
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (isHovered || projects.length === 0) return;
    const timer = setInterval(() => scroll('right'), 8000); // Slowed down auto-scroll to 8s
    return () => clearInterval(timer);
  }, [isHovered, projects]);

  if (!projects || projects.length === 0) return null;

  return (
    <div 
      className="discover-slider-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="discover-header">
        <h2 className="discover-slider-heading">Discover</h2>
        
        <div className="discover-controls-wrapper">
          <a href="#blogs-section" className="discover-view-all">
            View All
          </a>
          <div className="discover-arrows-wrapper">
            <button 
              onClick={() => scroll('left')}
              className="discover-nav-btn"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="discover-arrow-icon" strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="discover-nav-btn"
              aria-label="Scroll Right"
            >
              <ChevronRight className="discover-arrow-icon" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="discover-slider-wrapper">
        <div className="discover-slider-container animate-fade-in" ref={containerRef}>
          {infiniteProjects.map((proj) => (
            <div 
              key={proj.uniqueKey} 
              onClick={() => onProjectSelect?.(proj)}
              className="discover-card"
            >
              <div className="discover-card-image-wrapper">
                <img src={proj.image} alt={proj.title} className="discover-card-image" />
                <div className="discover-card-actions">
                  <button className="discover-action-btn" aria-label="Add to Wishlist">
                    <Heart className="discover-action-icon" />
                  </button>
                  <button className="discover-action-btn" aria-label="View Details">
                    <Eye className="discover-action-icon" />
                  </button>
                </div>
              </div>
              
              <div className="discover-card-info">
                <span className="discover-card-category">{proj.category}</span>
                <h3 className="discover-card-title">{proj.title}</h3>
                <span className="discover-card-metric">Free Guide</span>
                
                <button type="button" className="discover-card-btn">
                  <BookOpen className="discover-btn-icon" />
                  View Tutorial
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}