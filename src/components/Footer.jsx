import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        {/* COLUMN 1: Branding */}
        <div className="footer-brand-col">
          <h3 className="footer-col-title">Swift Sign <span style={{color: '#0fafb8'}}>Electronics</span></h3>
          <p style={{fontSize: '14px', lineHeight: '1.6'}}>
            Empowering engineers, scholars, and makers with premium components, customizable final year projects, and diagnostic laboratory tools.
          </p>
        </div>

        {/* COLUMN 2: Quick Links */}
        <div>
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="#">Home Page</a></li>
            <li className="footer-link-item"><a href="#">About Us</a></li>
            <li className="footer-link-item"><a href="#">Contact Us</a></li>
            <li className="footer-link-item"><a href="#">Support & FAQs</a></li>
          </ul>
        </div>

        {/* COLUMN 3: About Us */}
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

        {/* COLUMN 4: Explore */}
        <div>
          <h3 className="footer-col-title">Explore</h3>
          <ul className="footer-links-list">
            <li className="footer-link-item"><a href="#">FYP Projects Portfolio</a></li>
            <li className="footer-link-item"><a href="#">Electronic Components</a></li>
            <li className="footer-link-item"><a href="#">Prototyping Tools</a></li>
            <li className="footer-link-item"><a href="#">Blogs & Tutorials</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-row">
        <p>© {new Date().getFullYear()} Swift Sign Electronics. All rights reserved.</p>
      </div>
    </footer>
  );
}