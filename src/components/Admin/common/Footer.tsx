// components/Admin/Footer/Footer.tsx
import React from 'react';
import '../../../styles/Admin/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="admin-footer">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <div className="footer-copyright">
            <span>&copy; {currentYear} PrinterShop Admin</span>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Use</a>
            <a href="#" className="footer-link">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;