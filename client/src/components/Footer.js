import React from 'react';

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
              <li>Deals</li>
              <li>Categories</li>
              <li>History</li>
            </ul>
          </div>
          <div>
            <h3>Legal</h3>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
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
