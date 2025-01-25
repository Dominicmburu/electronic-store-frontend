// src/components/ProductDescription.tsx

import React from 'react';
import styles from '../../styles/ProductDescription.module.css';

interface ProductDescriptionProps {
  fullDescription: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ fullDescription }) => {
  return (
    <div className={styles.productDescription}>
      <h4>Description</h4>
      <p>{fullDescription}</p>
    </div>
  );
};

export default ProductDescription;
