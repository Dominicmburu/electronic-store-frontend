import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/FeaturedCategoriesSection.module.css";
import { Link } from "react-router-dom";
import productAPI from "../../api/product";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../api/main";

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  currentPrice: number;
}

const CategoryCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
  const { name, description, images } = product;

  return (
    <motion.div 
      className="col-sm-6 col-md-3 mb-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className={`card ${styles.categoryCard} h-100 text-center ${styles.cardShadow}`}>
        <div className={styles.imageWrapper}>
          <img
            src={`${API_BASE_URL}/uploads/${images[0]}`}
            className={`card-img-top ${styles.productImage}`}
            alt={name}
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <h5 className={`card-title ${styles.productTitle}`}>{name}</h5>
          <p className={`card-text ${styles.productDescription}`}>{description}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/shop" className={`btn btn-outline-primary btn-sm ${styles.shopNowBtn}`}>
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedCategoriesSection: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const featuredProductsMemo = useMemo(() => featuredProducts, [featuredProducts]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const cachedData = localStorage.getItem("featuredProducts");

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
        const featuredPrinters = data.featuredPrinters.slice(0, 8); // Limit to 8 products

        setFeaturedProducts(featuredPrinters);
        setIsLoading(false);
        
        localStorage.setItem("featuredProducts", JSON.stringify(featuredPrinters));
      } catch (err) {
        setNoDataMessage("No featured products found. Please check back later.");
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className={`featured-categories py-5 ${styles.featuredSection}`} data-aos="fade-up">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-center mb-4 ${styles.sectionTitle}`}>
            <span className={styles.titleHighlight}>Featured</span> Printers
          </h2>
          <p className={`text-center mb-5 ${styles.sectionDescription}`}>
            Discover our selection of high-quality printers for all your needs
          </p>
        </motion.div>
        <div className="row g-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div className="col-sm-6 col-md-3 mb-4" key={index}>
                <div className={`card ${styles.categoryCard} h-100 text-center ${styles.skeletonCard}`}>
                  <div className={`card-img-top skeleton-image ${styles.skeletonImage}`} />
                  <div className="card-body">
                    <h5
                      className={`card-title skeleton-text ${styles.skeletonText}`}
                      style={{ width: "80%" }}
                    />
                    <p className={`card-text skeleton-text ${styles.skeletonText}`} style={{ width: "90%" }} />
                    <div className={`skeleton-button ${styles.skeletonButton}`} />
                  </div>
                </div>
              </div>
            ))
          ) : featuredProductsMemo.length > 0 ? (
            featuredProductsMemo.map((product, index) => (
              <CategoryCard key={product.id} product={product} index={index} />
            ))
          ) : (
            <motion.div 
              className="col-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className={styles.noDataMessage}>{noDataMessage || "No featured products available at the moment."}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;