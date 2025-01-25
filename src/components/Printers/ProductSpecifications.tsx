// src/components/ProductSpecifications.tsx

import React from 'react';
import { Table } from 'react-bootstrap';
import styles from '../../styles/ProductSpecifications.module.css';

interface ProductSpecificationsProps {
  specifications: { [key: string]: string };
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  return (
    <div className={styles.productSpecifications}>
      <h4>Specifications</h4>
      <Table bordered>
        <tbody>
          {Object.entries(specifications).map(([key, value], index) => (
            <tr key={index}>
              <th>{key}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductSpecifications;
