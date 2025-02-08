import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProductImagesCarousel from "../components/Printers/ProductImagesCarousel";
import ProductInfo from "../components/Printers/ProductInfo";
import ProductDescription from "../components/Printers/ProductDescription";
import ProductSpecifications from "../components/Printers/ProductSpecifications";
import CustomerReviews from "../components/Printers/CustomerReviews";
import RelatedProducts from "../components/Printers/RelatedProducts";
import axios from "axios";
import { API_BASE_URL } from "../api/main";

interface Product {
  id: number;
  name: string;
  images: string[];
  currentPrice: number;
  lastPrice: number;
  discount: string;
  stock: string;
  description: string;
  specifications: { [key: string]: string };
  reviews: Review[];
  relatedProducts: RelatedProduct[];
  categoryId: number;
}

interface Review {
  user: {
    name: string;
  };
  createdAt: string;
  rating: number;
  content: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  lastPrice: number;
  currentPrice: number;
  discount: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);

        const apiProduct = response.data.product;
        const mappedProduct: Product = {
          id: apiProduct.id,
          name: apiProduct.name,
          images: apiProduct.images.map((img: string) => `/assets/${img}`), // Add path prefix
          currentPrice: apiProduct.currentPrice,
          lastPrice: apiProduct.lastPrice,
          discount:
            apiProduct.lastPrice && apiProduct.currentPrice
              ? `${Math.round(
                  ((apiProduct.lastPrice - apiProduct.currentPrice) /
                    apiProduct.lastPrice) *
                    100
                )}%`
              : "0%",
          stock: "In Stock",
          description: apiProduct.description,
          specifications: apiProduct.specifications || {},
          reviews: apiProduct.reviews || [],
          relatedProducts: [],
          categoryId: apiProduct.categoryId,
        };

        setProduct(mappedProduct);
        setError("");
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleAddToCart = (quantity: number) => {
    alert(`Added ${quantity} item(s) to cart.`);
  };

  return (
    <Layout>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center my-5">
          <p className="text-danger">{error}</p>
        </div>
      ) : product ? (
        <div className="container my-5">
          <div className="row">
            <div className="col-md-6">
              <ProductImagesCarousel images={product.images} />
            </div>

            <div className="col-md-6">
              <ProductInfo
                name={product.name || ""}
                currentPrice={product.currentPrice || 0}
                lastPrice={product.lastPrice || 0}
                discount={product.discount || "0"}
                stockStatus={product.stock || ""}
                description={product.description || ""}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          <ProductDescription fullDescription={product.description || ""} />

          <ProductSpecifications
            specifications={product.specifications || []}
          />

          <CustomerReviews reviews={product.reviews || []} />

          <RelatedProducts
            currentProductId={product.id}
            currentCategory={product.categoryId}
          />
        </div>
      ) : (
        <div className="text-center my-5">
          <p>Product not found.</p>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetails;
