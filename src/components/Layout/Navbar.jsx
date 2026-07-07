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
          {/* Add Button - opens in a new tab */}
          <a 
            href="?view=add-project" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="navbar-action-item navbar-add-btn"
          >
            <svg className="navbar-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="navbar-btn-text"> Add Project</span>
          </a>

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

          {/* Account Dropdown Wrapper */}
          <div 
            className="navbar-dropdown-wrapper"
            onMouseEnter={() => setIsAccountDropdownOpen(true)}
            onMouseLeave={() => setIsAccountDropdownOpen(false)}
            style={{ position: 'relative' }}
          >
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsAccountDropdownOpen(!isAccountDropdownOpen);
              }} 
              className="navbar-action-item"
            >
              <svg className="navbar-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="navbar-btn-text">{currentUser ? currentUser.username : 'Account'}</span>
              <svg style={{ width: '10px', height: '10px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            
            {isAccountDropdownOpen && (
              <div className="navbar-dropdown-menu">
                {!currentUser ? (
                  <>
                    <button 
                      onClick={() => {
                        onTabChange?.('account-login');
                        setIsAccountDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="navbar-dropdown-item"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => {
                        onTabChange?.('account-signup');
                        setIsAccountDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="navbar-dropdown-item"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        onTabChange?.('dashboard');
                        setIsAccountDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="navbar-dropdown-item"
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        onLogout?.();
                        setIsAccountDropdownOpen(false);
                        setIsMenuOpen(false);
                      }}
                      className="navbar-dropdown-item text-red-500"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* User Dashboard action item */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (currentUser) {
                onTabChange?.('dashboard');
              } else {
                onTabChange?.('account-login');
              }
              setIsMenuOpen(false);
            }} 
            className="navbar-action-item"
          >
            <svg className="navbar-action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="navbar-btn-text">Dashboard</span>
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
              className={`navbar-link ${activeTab === 'home' ? 'text-[#84cc16]' : ''}`}
              style={activeTab === 'home' ? { color: '#84cc16' } : {}}
            >
              Home
            </a>
            <a 
              href="#blogs" 
              onClick={(e) => {
                e.preventDefault();
                onTabChange?.('blogs');
                setIsMenuOpen(false);
              }} 
              className={`navbar-link ${activeTab === 'blogs' ? 'text-[#84cc16]' : ''}`}
              style={activeTab === 'blogs' ? { color: '#84cc16' } : {}}
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
              className={`navbar-link ${activeTab === 'products' ? 'text-[#84cc16]' : ''}`}
              style={activeTab === 'products' ? { color: '#84cc16' } : {}}
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
              className={`navbar-link ${activeTab === 'contact' ? 'text-[#84cc16]' : ''}`}
              style={activeTab === 'contact' ? { color: '#84cc16' } : {}}
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
