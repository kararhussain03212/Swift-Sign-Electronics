import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ activeTab, onTabChange, currentUser, onLogout, cartCount }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIndustryClosed, setIsIndustryClosed] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  return (
    <header 
      className="navbar-container cursor-pointer" 
      onClick={(e) => {
        if (!e.target.closest('.navbar-search-wrapper') && !e.target.closest('a') && !e.target.closest('button')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
    >
      {/* Main Top Row */}
      <div className="navbar-main-row">
        {/* Brand/Logo */}
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            onTabChange?.('home');
            setIsMenuOpen(false);
          }} 
          className="navbar-brand"
        >
          <img src="/logo.png" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">
            Swift Sign
            <span className="navbar-title-accent">Electronics</span>
          </span>
        </a>

        {/* Search Bar (always visible) */}
        <div className="navbar-search-wrapper">
          <input
            type="text"
            placeholder="Search products, categories..."
            className="navbar-search-input"
          />
          <button className="navbar-search-button" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Right side utilities */}
        <div className="navbar-actions">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onTabChange?.('cart');
              setIsMenuOpen(false);
            }} 
            className="navbar-action-item relative"
          >
            <svg className="navbar-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </a>
        </div>

        {/* Hamburger Menu Icon */}
        <button 
          className="navbar-hamburger-btn" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#4b5563',
            cursor: 'pointer',
            padding: '8px',
            display: 'none'
          }}
        >
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Navigation Links Row */}
      <div className={`navbar-links-row ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="navbar-links-container">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              setIsIndustryClosed(!isIndustryClosed);
            }} 
            className="navbar-link navbar-industry-link"
          >
            For Industry
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isIndustryClosed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </a>

          {/* Animating nav links container wrapper */}
          <div className={`navbar-nav-links ${isIndustryClosed ? 'slide-left-closed' : 'slide-right-open'}`}>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange?.('home');
                setIsMenuOpen(false);
              }} 
              className={`navbar-link ${activeTab === 'home' ? 'text-[#0042d7]' : ''}`}
              style={activeTab === 'home' ? { color: '#0042d7' } : {}}
            >
              Home
            </a>
            <a 
              href="/blog" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange?.('blogs');
                setIsMenuOpen(false);
              }} 
              className={`navbar-link ${activeTab === 'blogs' ? 'text-[#0042d7]' : ''}`}
              style={activeTab === 'blogs' ? { color: '#0042d7' } : {}}
            >
              Blogs
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange?.('products');
                setIsMenuOpen(false);
              }} 
              className={`navbar-link ${activeTab === 'products' ? 'text-[#0042d7]' : ''}`}
              style={activeTab === 'products' ? { color: '#0042d7' } : {}}
            >
              Products
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange?.('contact');
                setIsMenuOpen(false);
              }} 
              className={`navbar-link ${activeTab === 'contact' ? 'text-[#0042d7]' : ''}`}
              style={activeTab === 'contact' ? { color: '#0042d7' } : {}}
            >
              Contact Us
            </a>
            <a href="#" className="navbar-link">
              Solution
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a href="#" className="navbar-link">
              Support
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
