import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="py-1 shadow-sm d-none d-sm-block" style={{ backgroundColor: '#2196F3' }}>
      <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center">
        
        <div className="d-flex flex-column flex-sm-row mb-3 mb-sm-0 align-items-center">
          <div className="d-flex align-items-center me-4 mb-2 mb-sm-0">
            <FaPhoneAlt className="me-2" style={{ color: '#ffffff' }} />
            <span className="fw-bold" style={{ color: '#ffffff' }}>+254710599234 | +254 703849399</span>
          </div>
          <div className="d-flex align-items-center">
            <FaEnvelope className="me-2" style={{ color: '#ffffff' }} /> 
            <span className="fw-bold" style={{ color: '#ffffff' }}>info@guavaprinters.com</span>
          </div>
        </div>

        <div className="d-flex flex-sm-row align-items-center">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-3 mb-2 mb-sm-0 hover-icon"
            style={{ color: '#ffffff' }}
          >
            <FaFacebook className="fs-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="me-3 mb-2 mb-sm-0 hover-icon"
            style={{ color: '#ffffff' }} 
          >
            <FaTwitter className="fs-4" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover-icon"
            style={{ color: '#ffffff' }} 
          >
            <FaInstagram className="fs-4" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;