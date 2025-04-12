import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/ProductCard.module.css';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPercentage = Math.round(
    ((product.lastPrice - product.currentPrice) / product.lastPrice) * 100
  );

  return (
    <div className={` h-100 ${styles.productCardd}`}>
      {discountPercentage > 0 && (
        <span className={`${styles.badgeD}`}>
          -{discountPercentage}%
        </span>
      )}
      <Link to={`/product-details/${product.id}`} className="text-decoration-none text-dark">
        <img
          src={`/assets/${product.images[0]}`}
          alt={product.name}
          loading="lazy"
          className={`card-img-top ${styles.productImage}`}
        />
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">
            <span className="text-muted text-decoration-line-through">
              KSh {product.lastPrice.toLocaleString()}.00
            </span>{' '}
            <strong>KSh {product.currentPrice.toLocaleString()}.00</strong>
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;