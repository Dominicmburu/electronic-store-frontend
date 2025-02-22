import React from 'react';
import { Product } from '../../types/product';
import ProductCard from '../Printers/ProductCard';

const ProductGrid: React.FC<{ products: Product[] }> = ({ products }) => (
  <div className="product-grid row">
    {products.map((product) => (
      <div key={product.id} className="col-md-4 mb-4">
        <ProductCard product={product} />
      </div>
    ))}
  </div>
);

export default React.memo(ProductGrid);
