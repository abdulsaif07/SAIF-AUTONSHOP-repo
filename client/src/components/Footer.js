import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>Autonshop</h2>
          <p>Your AI-powered shopping assistant. We instantly scan multiple retailers to find you the absolute best deals, saving you time and money.</p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/results" style={{textDecoration: 'none', color: 'inherit'}}>Deals</Link></li>
              <li><Link to="/categories" style={{textDecoration: 'none', color: 'inherit'}}>Categories</Link></li>
              <li><Link to="/history" style={{textDecoration: 'none', color: 'inherit'}}>History</Link></li>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy" style={{textDecoration: 'none', color: 'inherit'}}>Privacy Policy</Link></li>
              <li><Link to="/terms" style={{textDecoration: 'none', color: 'inherit'}}>Terms of Service</Link></li>
              <li><Link to="/about" style={{textDecoration: 'none', color: 'inherit'}}>About Us</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Made with 🇮🇳 by BIET Team &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
