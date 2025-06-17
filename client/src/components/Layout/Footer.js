import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>&copy; {new Date().getFullYear()} KenCommerce. All rights reserved.</p>
      <div className="footer-links">
        <a href="mailto:support@kencommerce.com">Contact</a>
        <a href="/privacy">Privacy Policy</a>
      </div>
    </div>
  </footer>
);

export default Footer;