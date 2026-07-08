import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* Col 1: Branding */}
        <div className="footer-brand-col">
          <a href="#" className="footer-logo-title">
            Swift Sign <span className="footer-logo-accent">Electronics</span>
          </a>
          <p className="footer-tagline">
            Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="#">Home Page</a></li>
            <li className="footer-link-item"><a href="#">About Us</a></li>
            <li className="footer-link-item"><a href="#">Contact Us</a></li>
            <li className="footer-link-item"><a href="#">Support & FAQs</a></li>
          </ul>
        </div>

        {/* Col 3: About Us (Added) */}
        <div>
          <h3 className="footer-col-title">About Us</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="/terms-and-conditions">Terms & Conditions</a></li>
            <li className="footer-link-item"><a href="/privacy-policy">Privacy Policy</a></li>
            <li className="footer-link-item"><a href="/return-policy">Return Policy</a></li>
            <li className="footer-link-item"><a href="/shipping-policy">Shipping Policy</a></li>
            <li className="footer-link-item"><a href="/certification">Certification</a></li>
          </ul>
        </div>

        {/* Column 4: Explore & Connect */}
<div>
  <h3 className="footer-col-title">Explore</h3>
  <ul className="footer-links-list">
    <li className="footer-link-item"><a href="#">FYP Projects Portfolio</a></li>
    <li className="footer-link-item"><a href="#">Electronic Components</a></li>
    <li className="footer-link-item"><a href="#">Prototyping Tools</a></li>
    <li className="footer-link-item"><a href="#">Blogs & Tutorials</a></li>
  </ul>

  {/* Added Social Icons back here */}
  <h3 className="footer-col-title" style={{ marginTop: '20px' }}>CONNECT</h3>
  <div className="footer-social-icons">
    <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="GitHub">
      <svg viewBox="0 0 19 19"><use href="/icons.svg#github-icon"></use></svg>
    </a>
    <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="Discord">
      <svg viewBox="0 0 20 19"><use href="/icons.svg#discord-icon"></use></svg>
    </a>
    <a href="https://x.com/vite_js" target="_blank" rel="noreferrer" className="footer-social-btn" aria-label="X (Twitter)">
      <svg viewBox="0 0 19 19"><use href="/icons.svg#x-icon"></use></svg>
    </a>
  </div>
</div>
      </div>

      <div className="footer-bottom-row">
        <p>© {new Date().getFullYear()} Swift Sign Electronics. All rights reserved.</p>
        <a href="https://it.swiftsignbm.com/" className="footer-bottom-link" target="_blank" rel="noopener noreferrer">swiftsign</a>
      </div>
    </footer>
  );
}