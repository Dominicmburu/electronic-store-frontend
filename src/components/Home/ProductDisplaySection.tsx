import React from 'react';
import styles from '../../styles/ProductDisplaySection.module.css';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  badge: string;
  badgeColor: string;
  image: string;
  alt: string;
  title: string;
  description: string;
  link: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  badge,
  badgeColor,
  image,
  alt,
  description,
  link,
}) => {
  return (
    <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
      <div className={`card ${styles.productCard} d-flex flex-row align-items-center position-relative`}>
        <span
          className={`badge ${badgeColor} position-absolute top-0 start-0 m-2 ${styles.badgeTag}`}
        >
          {badge}
        </span>
        <img src={image} className={styles.productImg} alt={alt} />
        <div className="card-body text-start">
          <p className="card-text mb-2">{description}</p>
          <Link to={link} className={`btn ${styles.btnShopNow}`}>
            <i className="bi bi-arrow-right-circle"></i> Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const ProductDisplaySection: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-center">
          <ProductCard
            badge="Hot Deals"
            badgeColor="bg-danger"
            image="/assets/IMG-20241007-WA0017.jpg"
            alt="Printer Pro X100"
            title="Printer Pro X100"
            description="Exclusive deals on the Printer Pro X100"
            link="/shop"
          />
          <ProductCard
            badge="Discount"
            badgeColor="bg-warning text-dark"
            image="/assets/IMG-20241007-WA0018.jpg"
            alt="Printer Master 2000"
            title="Printer Master 2000"
            description="Save big with Printer Master 2000"
            link="/shop"
          />
          <ProductCard
            badge="Top Quality"
            badgeColor="bg-success"
            image="/assets/IMG-20241007-WA0019.jpg"
            alt="Printer Pro Z300"
            title="Printer Pro Z300"
            description="Premium quality with Printer Pro Z300"
            link="/shop"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductDisplaySection;
