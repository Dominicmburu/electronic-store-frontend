import React, { useEffect, useState } from 'react';
import styles from '../../styles/HeroSection.module.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={`${styles.heroOverlay} ${styles.animatedOverlay}`}></div>
      <div className="container">
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Discover the Best Printers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            High-quality printers for your home and business needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/shop" className={`${styles.btnShop} ${styles.pulseAnimation}`}>
              <i className="bi bi-shop-window"></i> Shop Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;