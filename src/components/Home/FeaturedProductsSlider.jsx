import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function FeaturedProductsSlider({ products = [], onBuyNow }) {
  const containerRef = useRef(null);

  // Duplicate the products array many times to simulate an infinite circular carousel.
  // 30 repetitions means the user can scroll left or right hundreds of times without hitting the end.
  const REPETITIONS = 30;
  const infiniteProducts = Array(REPETITIONS)
    .fill(products)
    .flat()
    .map((p, index) => ({
      ...p,
      uniqueKey: `${p.id}-${index}`
    }));

  useEffect(() => {
    // Silently align to the middle set on mount so the user has maximum "runway" in both directions
    if (containerRef.current && products.length > 0) {
      // Find the index of the first product in the middle set
      const middleSetIndex = Math.floor(REPETITIONS / 2) * products.length;
      const targetElement = containerRef.current.children[middleSetIndex];
      
      if (targetElement) {
        // Set scroll position instantly without animation (16px offset accounts for the px-4 padding)
        containerRef.current.scrollLeft = targetElement.offsetLeft - 16;
      }
    }
  }, [products]);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 304; // Exact width of card (280px) + gap (24px)

      if (direction === 'right') {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="discover-slider-section" id="featured-products-section">
      <h2 className="discover-slider-heading">Featured Products</h2>
      
      <div className="discover-slider-wrapper">
        {/* Left Navigation Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="discover-scroll-btn left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Slider Container */}
        <div 
          ref={containerRef} 
          className="discover-slider-container animate-fade-in"
        >
          {infiniteProducts.map((prod) => (
            <div 
              key={prod.uniqueKey} 
              onClick={() => onBuyNow?.()}
              className="premium-card discover-card"
            >
              <div className="premium-card-info">
                <span className="discover-card-category">{prod.category}</span>
                <h3 className="discover-card-title">{prod.name}</h3>
                <span className="discover-card-metric">
                  {prod.price === 'Free Guide' ? 'Free Guide' : `${prod.price} • ${prod.rating} ★`}
                </span>
              </div>
              <div className="premium-card-image-wrapper">
                <img src={prod.image} alt={prod.name} className="premium-card-image" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Arrow */}
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