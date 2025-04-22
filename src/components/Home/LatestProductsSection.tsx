import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/LatestProductsSection.module.css";
import { Link } from "react-router-dom";
import productAPI from "../../api/product";
import { API_BASE_URL } from "../../api/main";

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
        <img src={image} alt={alt} className="card-img-top product-image" loading="lazy" />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{type}</p>
          <div className="mt-auto">
            <div className="product-price mb-2">
              <del id="old-price" className="old-price">{oldPrice}</del>
              <span className="new-price">{newPrice}</span>
            </div>
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
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoizing the `latestProducts` array to optimize performance
  const latestProductsMemo = useMemo(() => latestProducts, [latestProducts]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        // Check for cached data in localStorage
        const cachedData = localStorage.getItem("latestProducts");
        
        // If cached data exists, use it
        if (cachedData) {
          setLatestProducts(JSON.parse(cachedData));
          setIsLoading(false);
        }

        // Fetch fresh data from the API
        const response = await fetch(productAPI.LATEST_PRINTERS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check if the response is OK
        if (!response.ok) {
          if (!cachedData) {
            setNoDataMessage("No latest products found. Please check back later.");
          }
          return;
        }

        const data = await response.json();
        const { latestPrinters } = data;

        const formattedProducts = latestPrinters.map((product: any) => ({
          image: `${API_BASE_URL}/uploads/${product.images[0]}`,
          alt: product.name,
          title: product.name,
          type: product.description,
          oldPrice: `KSh ${product.lastPrice.toLocaleString()}.00`,
          newPrice: `KSh ${product.currentPrice.toLocaleString()}.00`,
          link: `/product-details/${product.id}`,
        }));

        setLatestProducts(formattedProducts);
        setIsLoading(false);
        
        // Cache the fresh data in localStorage for future use
        localStorage.setItem("latestProducts", JSON.stringify(formattedProducts));
      } catch (err) {
        // Fallback in case of an error
        if (!localStorage.getItem("latestProducts")) {
          setNoDataMessage("No latest products found. Please check back later.");
        }
        setIsLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="latest-products-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">Latest Printers</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {isLoading ? (
            // Skeleton loader for the loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                <div className={`card ${styles.latestProductCard} h-100`}>
                  <div className="card-img-top skeleton-image" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title skeleton-text" style={{ width: "80%" }} />
                    <p className="card-text text-muted skeleton-text" style={{ width: "60%" }} />
                    <div className="mt-auto">
                      <div className="product-price mb-2">
                        <div className="skeleton-text" style={{ width: "50%" }} />
                        <div className="skeleton-text" style={{ width: "60%" }} />
                      </div>
                      <div className="skeleton-button" style={{ width: "100px" }} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : latestProductsMemo.length > 0 ? (
            latestProductsMemo.map((product, index) => (
              <LatestProductCard key={index} {...product} />
            ))
          ) : (
            <div className="col-12 text-center">
              <p>{noDataMessage || "No latest products available at the moment."}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestProductsSection;
