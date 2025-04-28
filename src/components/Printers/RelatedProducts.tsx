import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../api/main';
import '../../styles/RelatedProducts.css'; 

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  lastPrice: number;
  currentPrice: number;
  discount: string;
  category: string;
  images: string[];
}

interface RelatedProductsProps {
  currentProductId: number;
  currentCategory: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(relatedProducts);
  

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
          image: p.images && p.images.length > 0 ? `${API_BASE_URL}/uploads/${p.images[0]}` : '',
          discount: p.lastPrice && p.currentPrice 
            ? `${Math.round(((p.lastPrice - p.currentPrice) / p.lastPrice) * 100)}%`
            : '0%'
        }));

        setRelatedProducts(formattedProducts);
      } catch (error) {
        // console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, currentCategory]);

  if (loading) {
    return (
      <div className="related-products-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading related products...</p>
      </div>
    );
  }
  
  if (!relatedProducts.length) return null;

  return (
    <div className="related-products-container">
      <h4 className="related-products-title">Related Products</h4>
      <div className="related-products-grid">
        {relatedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product-details/${product.id}`} className="product-link">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/150';
                  }} 
                />
                {Number(product.discount.replace('%', '')) > 0 && (
                  <span className="discount-badge">
                    {product.discount} OFF
                  </span>
                )}
              </div>
              <div className="product-details">
                <h5 className="product-name">{product.name}</h5>
                <div className="product-price">
                  {product.lastPrice > 0 && product.lastPrice !== product.currentPrice && (
                    <span className="old-price-related">
                      KSh {product.lastPrice.toLocaleString()}.00
                    </span>
                  )}
                  <span className="current-price-related">
                    KSh {product.currentPrice.toLocaleString()}.00
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;