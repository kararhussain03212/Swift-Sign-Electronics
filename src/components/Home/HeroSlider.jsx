import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
  {
    image: '/hero1.png',
    partner: 'Academic Projects',
    titleLine1: 'Build The Next',
    titleHighlight: 'FYP Project',
    titleLine2: 'Node',
    tagline: 'Prototype with Swift Sign Electronics. Launch your academic idea into the real world.',
    btnText: 'Start Building NOW',
    details: [
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Comprehensive design consultation & testing guidance'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        text: 'Customized for engineering makers, students & professional teams'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        text: 'Consultancy enrollment open for July - Dec 2026 batch'
      }
    ]
  },
  {
    image: '/hero2.png',
    partner: 'Microcontrollers & Sensors',
    titleLine1: 'Source Premium',
    titleHighlight: 'Electronic Items',
    titleLine2: 'Direct',
    tagline: 'Equip your hardware setup with OEM-certified chips, sensors, and original modules.',
    btnText: 'Shop Components NOW',
    details: [
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        text: '100% genuine IC parts with active simulator configurations'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: 'Bulk discounts and corporate procurement support programs'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        text: 'Free schematic reviews and reference designs catalog'
      }
    ]
  },
  {
    image: '/hero3.png',
    partner: 'Lab Equipment & Gear',
    titleLine1: 'Equip Your Lab with',
    titleHighlight: 'Diagnostic Tools',
    titleLine2: 'Now',
    tagline: 'Achieve extreme engineering accuracy with professional oscilloscopes, soldering, and measurement gear.',
    btnText: 'Get Tools NOW',
    details: [
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        text: 'High-bandwidth digital probes and real-time diagnostic systems'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        text: '1-year replacement warranty & support assistance included'
      },
      {
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        text: 'Premium package protection with safe global transit options'
      }
    ]
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="hero-slider-container">
      {/* Abstract Background Shapes (same as Blogs hero banner) */}
      <div
        className="pointer-events-none absolute"
        style={{
          right: "-80px",
          top: "-80px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.06)",
          zIndex: 1
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          right: "80px",
          top: "40px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.05)",
          zIndex: 1
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          left: "-30px",
          top: "50%",
          width: "140px",
          height: "45px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.04)",
          transform: "rotate(-20deg)",
          zIndex: 1
        }}
      />

      {/* Slides */}
      {slides.map((slide, idx) => {
        if (idx !== current) return null;
        return (
          <div
            key={idx}
            className="hero-slide active"
          >
            {/* Background Image Layer */}
            <div 
              className="hero-slide-bg-img"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Dark dimming overlay in front of background image */}
            <div className="hero-slide-bg-overlay-dim" />

            {/* Centered content overlay */}
            <div className="hero-slide-content-wrapper">
              <h1 className="hero-main-title">
                {slide.titleLine1} <span className="hero-main-title-highlight">{slide.titleHighlight}</span> {slide.titleLine2}
              </h1>
              
              <p className="hero-tagline">{slide.tagline}</p>
              
              <button className="hero-action-btn">{slide.btnText}</button>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button onClick={handlePrev} className="hero-nav-arrow left" aria-label="Previous Slide">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={handleNext} className="hero-nav-arrow right" aria-label="Next Slide">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="hero-dots-container">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
