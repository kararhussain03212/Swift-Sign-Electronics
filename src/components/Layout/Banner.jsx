import React, { useState } from 'react';
import './Banner.css';

export default function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="top-banner">
      <div className="top-banner-text">
       Sale: Enjoy FREE shipping on final year projects and orders over Rs. 5,000! (Excludes heavy tools & machinery)
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="top-banner-close"
        aria-label="Close Announcement"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
