import React from 'react';
import styles from '../../styles/ProductDisplaySection.module.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../api/main';

interface ProductCardProps {
  badge: string;
  badgeColor: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  link: string;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  badge,
  badgeColor,
  image,
  alt,
  description,
  link,
  index,
}) => {
  return (
    <motion.div 
      className="col-sm-12 col-md-6 col-lg-4 mb-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <div className={`card ${styles.productCard} d-flex flex-row align-items-center position-relative ${styles.hoverShadow}`}>
        <motion.span
          className={`badge ${badgeColor} position-absolute top-0 start-0 m-2 ${styles.badgeTag}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 + (0.1 * index) }}
        >
          {badge}
        </motion.span>
        <div className={styles.imageContainer}>
          <img src={image} className={`${styles.productImg} ${styles.zoomOnHover}`} alt={alt} loading="lazy" />
        </div>
        <div className="card-body text-start">
          <p className="card-text mb-2">{description}</p>
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={link} className={`btn ${styles.btnShopNow}`}>
              <i className={`bi bi-arrow-right-circle ${styles.iconSlideRight}`}></i> Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductDisplaySection: React.FC = () => {
  return (
    <section className="py-5" data-aos="fade-up">
      <div className="container">
        <motion.h2 
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Collections
        </motion.h2>
        <div className="row text-center">
          <ProductCard
            badge="Hot Deals"
            badgeColor="bg-danger"
            image={`${API_BASE_URL}/uploads/IMG-20241007-WA0017.jpg`}
            alt="Printer Pro X100"
            title="Printer Pro X100"
            description="Exclusive deals on the Printer Pro X100"
            link="/shop"
            index={0}
          />
          <ProductCard
            badge="Discount"
            badgeColor="bg-warning text-dark"
            image={`${API_BASE_URL}/uploads/IMG-20241007-WA0018.jpg`}
            alt="Printer Master 2000"
            title="Printer Master 2000"
            description="Save big with Printer Master 2000"
            link="/shop"
            index={1}
          />
          <ProductCard
            badge="Top Quality"
            badgeColor="bg-success"
            image={`${API_BASE_URL}/uploads/IMG-20241007-WA0019.jpg`}
            alt="Printer Pro Z300"
            title="Printer Pro Z300"
            description="Premium quality with Printer Pro Z300"
            link="/shop"
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

export default ProductDisplaySection;