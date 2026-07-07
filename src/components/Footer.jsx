import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Branding & Tagline */}
        <div className="footer-brand-col">
          <a href="#" className="footer-logo-title">
            Swift Sign <span className="footer-logo-accent">Electronics</span>
          </a>
          <p className="footer-tagline">
            Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="#">Home Page</a></li>
            <li className="footer-link-item"><a href="#">About Us</a></li>
            <li className="footer-link-item"><a href="#">Contact Us</a></li>
            <li className="footer-link-item"><a href="#">Support & FAQs</a></li>
          </ul>
        </div>

        {/* Explore Links */}
        <div>
          <h3 className="footer-col-title">Explore</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="#">FYP Projects Portfolio</a></li>
            <li className="footer-link-item"><a href="#">Electronic Components</a></li>
            <li className="footer-link-item"><a href="#">Prototyping Tools</a></li>
            <li className="footer-link-item"><a href="#">Blogs & Tutorials</a></li>
          </ul>
        </div>

        {/* Social connections */}
        <div>
          <h3 className="footer-col-title">Connect With Us</h3>
          <div className="footer-social-icons">
            <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="GitHub">
              <svg viewBox="0 0 19 19">
                <use href="/icons.svg#github-icon"></use>
              </svg>
            </a>
            <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Discord">
              <svg viewBox="0 0 20 19">
                <use href="/icons.svg#discord-icon"></use>
              </svg>
            </a>
            <a href="https://x.com/vite_js" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="X (Twitter)">
              <svg viewBox="0 0 19 19">
                <use href="/icons.svg#x-icon"></use>
              </svg>
            </a>
            <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Bluesky">
              <svg viewBox="0 0 16 17">
                <use href="/icons.svg#bluesky-icon"></use>
              </svg>
            </a>
          </div>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            Stay updated with our latest project releases and tutorials.
          </p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-bottom-row">
        <p>© {new Date().getFullYear()} Swift Sign Electronics. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="https://it.swiftsignbm.com/" className="footer-bottom-link" target="_blank" rel="noopener noreferrer">swiftsign</a>
        </div>
      </div>
    </footer>
  );
}
