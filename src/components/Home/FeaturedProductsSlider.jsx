import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Heart, Eye, ShoppingCart } from 'lucide-react';
import './FeaturedProductsSlider.css';

export default function FeaturedProductsSlider({ products = [], onBuyNow }) {
  const containerRef = useRef(null);

  // Duplicate the products array many times to simulate an infinite circular carousel.
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

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 304; // Card width + gap

      if (direction === 'right') {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="featured-slider-section" id="featured-products-section">
      <h2 className="featured-slider-heading">Featured Products</h2>
      
      <div className="featured-slider-wrapper">
        {/* Left Navigation Arrow */}
        <button 
          onClick={() => scroll('left')}
          className="featured-scroll-btn left"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Slider Container */}
        <div 
          ref={containerRef} 
          className="featured-slider-container"
        >
          {infiniteProducts.map((prod) => (
            <div 
              key={prod.uniqueKey} 
              onClick={() => onBuyNow?.(prod)}
              className="featured-product-card"
            >
              <div className="featured-prod-image-wrapper">
                <img src={prod.image} alt={prod.name} className="featured-prod-image" />
                <div className="featured-prod-actions">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="featured-prod-action-btn" 
                    aria-label="Add to Wishlist"
                  >
                    <Heart className="featured-prod-action-icon" />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyNow?.(prod);
                    }}
                    className="featured-prod-action-btn" 
                    aria-label="View Details"
                  >
                    <Eye className="featured-prod-action-icon" />
                  </button>
                </div>
              </div>

              <div className="featured-prod-info">
                <span className="featured-prod-category">{prod.category}</span>
                <h3 className="featured-prod-title">{prod.name}</h3>
                
                <span className="featured-prod-price">
                  {prod.price === 'Free Guide' ? 'Free Guide' : prod.price}
                </span>

                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyNow?.(prod);
                  }} 
                  className="featured-prod-btn"
                >
                  <ShoppingCart className="featured-prod-btn-icon" />
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Navigation Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="featured-scroll-btn right"
          aria-label="Scroll Right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}