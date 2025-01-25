import React, { useEffect, useState } from 'react';
import styles from '../../styles/FeaturedCategoriesSection.module.css';
import { Link } from 'react-router-dom';
import productAPI from '../../api/product';

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  currentPrice: number;
}

const CategoryCard: React.FC<{ product: Product }> = ({ product }) => {
  const { name, description, images } = product;

  return (
    <div className="col-sm-6 col-md-3 mb-4">
      <div className={`card ${styles.categoryCard} h-100 text-center`}>
        <img src={`/assets/${images[0]}`} className="card-img-top" alt={name} />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <Link to="/shop" className="btn btn-outline-primary btn-sm">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedCategoriesSection: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
          const response = await fetch(productAPI.FEATURED_PRINTERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }

        const data = await response.json();
        const { featuredPrinters } = data;

        setFeaturedProducts(featuredPrinters.slice(0, 10));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="featured-categories py-5">
      <div className="container">
        <h2 className="text-center mb-4">Featured Printers</h2>
        <div className="row g-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <CategoryCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
