import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/RelatedProducts.module.css';
import axios from 'axios';
import { API_BASE_URL } from '../../api/main';
import productAPI from '../../api/product';

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  lastPrice: number;
  currentPrice: number;
  discount: string;
  category: string;
}

interface RelatedProductsProps {
  currentProductId: number;
  currentCategory: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        const allProducts = response.data.products;

        const sameCategoryProducts = allProducts.filter(
          (p: RelatedProduct) => 
            p.category === String(currentCategory) && 
            p.id !== currentProductId
        );

        const otherCategoryProducts = allProducts.filter(
          (p: RelatedProduct) => 
            p.category !== String(currentCategory) && 
            p.id !== currentProductId
        );

        const combined = [
          ...sameCategoryProducts.slice(0, 5),
          ...otherCategoryProducts.slice(0, Math.max(0, 5 - sameCategoryProducts.length))
        ].slice(0, 5);

        const formattedProducts = combined.map(p => ({
          ...p,
          image: `/assets/${p.images}`,
          discount: p.lastPrice && p.currentPrice 
            ? `${Math.round(((p.lastPrice - p.currentPrice) / p.lastPrice) * 100)}%`
            : '0%'
        }));

        setRelatedProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, currentCategory]);

  if (loading) return <div>Loading related products...</div>;
  if (!relatedProducts.length) return null;

  return (
    <div className={`related-products mt-5 ${styles.relatedProducts}`}>
      <h4>Related Products</h4>
      <div className="row">
        {relatedProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className={`product-card ${styles.productCard}`}>
              <span className={`badge bg-success ${styles.badgeDiscount}`}>
                {product.discount}
              </span>
              <Link to={`${productAPI.PRODUCT_DETAILS}/${product.id}`} className="text-decoration-none text-dark">
                <img src={product.image} alt={product.name} className="mb-3" />
                <h5>{product.name}</h5>
                <p className="price">
                  {product.lastPrice > 0 && (
                    <span className="old-price me-2">
                      KSh {product.lastPrice.toLocaleString()}.00
                    </span>
                  )}
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