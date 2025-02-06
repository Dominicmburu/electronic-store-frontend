import React, { useEffect, useState } from "react";
import styles from "../../styles/FeaturedCategoriesSection.module.css";
import { Link } from "react-router-dom";
import productAPI from "../../api/product";

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
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const cachedData = localStorage.getItem("featuredProducts");
        console.log(cachedData);

        if (cachedData) {
          setFeaturedProducts(JSON.parse(cachedData));
          setIsLoading(false);
        }

        const response = await fetch(productAPI.FEATURED_PRINTERS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (!cachedData) {
            setNoDataMessage(
              "No featured products found. Please check back later."
            );
          }
          return;
        }

        const data = await response.json();
        const featuredPrinters = data.featuredPrinters.slice(0, 10);

        setFeaturedProducts(featuredPrinters);
        setIsLoading(false);
        localStorage.setItem("featuredProducts",JSON.stringify(featuredPrinters)
        );
      } catch (err) {
        if (!localStorage.getItem("featuredProducts")) {
          setNoDataMessage(
            "No featured products found. Please check back later."
          );
        }
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="featured-categories py-5">
      <div className="container">
        <h2 className="text-center mb-4">Featured Printers</h2>
        <div className="row g-4">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div className="col-sm-6 col-md-3 mb-4" key={index}>
                <div
                  className={`card ${styles.categoryCard} h-100 text-center`}
                >
                  <div className="card-img-top skeleton-image" />
                  <div className="card-body">
                    <h5
                      className="card-title skeleton-text"
                      style={{ width: "80%" }}
                    />
                    <p
                      className="card-text skeleton-text"
                      style={{ width: "90%" }}
                    />
                    <div className="skeleton-button" />
                  </div>
                </div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <CategoryCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-12 text-center">
              <p>
                {noDataMessage ||
                  "No featured products available at the moment."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
