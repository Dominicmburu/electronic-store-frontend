// src/pages/ProductDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductImagesCarousel from '../components/Printers/ProductImagesCarousel';
import ProductInfo from '../components/Printers/ProductInfo';
import ProductDescription from '../components/Printers/ProductDescription';
import ProductSpecifications from '../components/Printers/ProductSpecifications';
import CustomerReviews from '../components/Printers/CustomerReviews';
import RelatedProducts from '../components/Printers/RelatedProducts';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  images: string[];
  currentPrice: number;
  oldPrice: number;
  discount: string;
  stock: string;
  description: string;
  specifications: { [key: string]: string };
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  image: string;
  oldPrice: number;
  currentPrice: number;
  discount: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const handleAddToCart = (quantity: number) => {
    // Implement your add to cart logic here, e.g., using Context or Redux
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
            {/* Product Images Carousel */}
            <div className="col-md-6">
              <ProductImagesCarousel images={product.images} />
            </div>

            {/* Product Information */}
            <div className="col-md-6">
              <ProductInfo
                name={product.name}
                currentPrice={product.currentPrice}
                oldPrice={product.oldPrice}
                discount={product.discount}
                stockStatus={product.stock}
                description={product.description}
                onAddToCart={handleAddToCart}
              />
            </div>
          </div>

          {/* Product Description */}
          <ProductDescription fullDescription={product.description} />

          {/* Product Specifications */}
          <ProductSpecifications specifications={product.specifications} />

          {/* Customer Reviews */}
          <CustomerReviews reviews={product.reviews} />

          {/* Related Products */}
          <RelatedProducts relatedProducts={product.relatedProducts} />
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
