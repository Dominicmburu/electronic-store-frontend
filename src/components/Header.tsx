import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="top-header">
      <div className="container">
        <div className="header-content">
          <div className="contact-info">
            <div className="contact-item">
              <FaPhoneAlt className="icon" />
              <span className="info-text">+254 710 599 234 | +254 703 849 399</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="icon" /> 
              <span className="info-text">info@Jaytechprinterimports.com</span>
            </div>
          </div>

          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;