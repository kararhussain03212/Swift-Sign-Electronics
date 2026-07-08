import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShoppingCart } from 'lucide-react';

// Pastel backgrounds list to match standard Daily Well-being color cards
const PASTEL_COLORS = [
  '#f0fdf4', // Light green tint
  '#f0f9ff', // Light blue tint
  '#fefce8', // Light yellow tint
  '#faf5ff', // Light purple tint
  '#fff1f2', // Light pink tint
];

const getPastelBg = (id) => {
  const cleanId = (id || '').toString();
  const charSum = cleanId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PASTEL_COLORS[charSum % PASTEL_COLORS.length];
};

export default function FeaturedProductsSlider({ products = [], onBuyNow }) {
  const containerRef = useRef(null);

  // Duplicate the products array to simulate infinite scroll
  const REPETITIONS = 30;
  const infiniteProducts = Array(REPETITIONS)
    .fill(products)
    .flat()
    .map((p, index) => ({
      ...p,
      uniqueKey: `${p.id}-${index}`
    }));

  useEffect(() => {
    if (containerRef.current && products.length > 0) {
      const middleSetIndex = Math.floor(REPETITIONS / 2) * products.length;
      const targetElement = containerRef.current.children[middleSetIndex];
      
      if (targetElement) {
        containerRef.current.scrollLeft = targetElement.offsetLeft - 16;
      }
    }
  }, [products]);

  // Autoplay / self-moving effect
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const timer = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // If we get near the end, wrap back to center
        if (scrollLeft + clientWidth >= scrollWidth - 100) {
          const middleSetIndex = Math.floor(REPETITIONS / 2) * products.length;
          const targetElement = containerRef.current.children[middleSetIndex];
          if (targetElement) {
            containerRef.current.scrollLeft = targetElement.offsetLeft - 16;
          }
        } else {
          const scrollAmount = clientWidth * 0.85;
          containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);
    
    return () => clearInterval(timer);
  }, [products]);

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

  if (!products || products.length === 0) return null;

  return (
    <div className="discover-slider-section" id="featured-products-section">
      {/* Header with Title and Control Buttons */}
      <div className="discover-slider-header">
        <h2 className="discover-slider-heading">Featured Products</h2>
        <div className="discover-slider-controls">
          <span className="discover-view-all" onClick={() => onBuyNow?.()}>
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
          {infiniteProducts.map((prod) => (
            <div 
              key={prod.uniqueKey} 
              onClick={() => onBuyNow?.()}
              className="discover-premium-product-card"
            >
              {/* Top Image Panel with dynamic pastel background */}
              <div 
                className="discover-product-image-wrapper"
                style={{ backgroundColor: getPastelBg(prod.id) }}
              >
                <img src={prod.image} alt={prod.name} className="discover-product-image" />
              </div>

              {/* Bottom Info Details */}
              <div className="discover-product-info">
                <div>
                  <span className="discover-product-brand">{prod.category}</span>
                  <h3 className="discover-product-title">{prod.name}</h3>
                </div>
                
                {/* Horizontal footer row with struck-through original price and cart icon button */}
                <div className="featured-product-footer-row">
                  <div className="featured-product-price-col">
                    {prod.originalPrice && (
                      <span className="featured-product-original-price">
                        {prod.originalPrice}
                      </span>
                    )}
                    <span className="featured-product-current-price">
                      {prod.price}
                    </span>
                  </div>
                  <button 
                    className="featured-product-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow?.();
                    }}
                  >
                    <ShoppingCart className="h-4 w-4" />
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