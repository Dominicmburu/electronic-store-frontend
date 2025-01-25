import React, { useEffect, useState } from 'react';
import styles from '../../styles/LatestProductsSection.module.css';
import { Link } from 'react-router-dom';
import productAPI from '../../api/product';

interface LatestProductCardProps {
  image: string;
  alt: string;
  title: string;
  type: string;
  oldPrice: string;
  newPrice: string;
  link: string;
}

const LatestProductCard: React.FC<LatestProductCardProps> = ({
  image,
  alt,
  title,
  type,
  oldPrice,
  newPrice,
  link,
}) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className={`card ${styles.latestProductCard} h-100`}>
        <img src={image} alt={alt} className="card-img-top product-image" />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{type}</p>
          <div className="mt-auto">
            <p className="product-price mb-2">
              <del id="old-price" className="old-price">{oldPrice}</del>
              <span className="new-price">{newPrice}</span>
            </p>
            <Link to={link} className="btn btn-primary btn-sm">
              <i className="bi bi-cart-plus"></i> Add to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const LatestProductsSection: React.FC = () => {
  const [latestProducts, setLatestProducts] = useState<LatestProductCardProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(productAPI.LATEST_PRINTERS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch latest products');
        }

        const data = await response.json();
        const { latestPrinters } = data;

        const formattedProducts = latestPrinters.map((product: any) => ({
          image: `/assets/${product.images[0]}`,
          alt: product.name,
          title: product.name,
          type: product.description,
          oldPrice: `KSh ${product.lastPrice.toLocaleString()}.00`,
          newPrice: `KSh ${product.currentPrice.toLocaleString()}.00`,
          link: `/product-details/${product.id}`,
        }));

        setLatestProducts(formattedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchLatestProducts();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section className="latest-products-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">Latest Printers</h2>
        <div className="row g-4">
          {latestProducts.length > 0 ? (
            latestProducts.map((product, index) => (
              <LatestProductCard key={index} {...product} />
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No latest products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestProductsSection;
