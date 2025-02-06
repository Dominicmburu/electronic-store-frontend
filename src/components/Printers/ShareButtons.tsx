import React from 'react';
import styles from '../../styles/ShareButtons.module.css';

const ShareButtons: React.FC = () => {
  return (
    <div className={`mt-4 ${styles.shareButtons}`}>
      <h5>Share:</h5>
      <a href="#" className="text-primary me-2" aria-label="Facebook">
        <i className="fab fa-facebook-f fs-4"></i>
      </a>
      <a href="#" className="text-info me-2" aria-label="Twitter">
        <i className="fab fa-twitter fs-4"></i>
      </a>
      <a href="#" className="text-danger me-2" aria-label="Instagram">
        <i className="fab fa-instagram fs-4"></i>
      </a>
      <a href="#" className="text-secondary" aria-label="LinkedIn">
        <i className="fab fa-linkedin fs-4"></i>
      </a>
    </div>
  );
};

export default ShareButtons;
