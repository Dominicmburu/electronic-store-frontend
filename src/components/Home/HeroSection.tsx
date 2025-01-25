import React from 'react';
import styles from '../../styles/HeroSection.module.css';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <h1>Discover the Best Printers</h1>
          <p>High-quality printers for your home and business needs.</p>
          <Link to="/shop" className={`${styles.btnShop}`}>
            <i className="bi bi-shop-window"></i> Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
