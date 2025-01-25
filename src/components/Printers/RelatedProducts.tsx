// src/components/RelatedProducts.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/RelatedProducts.module.css';

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  oldPrice: number;
  currentPrice: number;
  discount: string;
}

interface RelatedProductsProps {
  relatedProducts: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ relatedProducts }) => {
  return (
    <div className={`related-products mt-5 ${styles.relatedProducts}`}>
      <h4>Related Products</h4>
      <div className="row">
        {relatedProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className={`product-card ${styles.productCard}`}>
              <span className={`badge bg-success ${styles.badgeDiscount}`}>{product.discount}</span>
              <Link to={`/product-details/${product.id}`} className="text-decoration-none text-dark">
                <img src={product.image} alt={product.name} className="mb-3" />
                <h5>{product.name}</h5>
                <p className="price">
                  <span className="old-price">KSh {product.oldPrice.toLocaleString()}.00</span>
                  KSh {product.currentPrice.toLocaleString()}.00
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
