// src/components/ProductImagesCarousel.tsx

import React from 'react';
import { Carousel } from 'react-bootstrap';
import styles from '../../styles/ProductImagesCarousel.module.css';

interface ProductImagesCarouselProps {
  images: string[];
}

const ProductImagesCarousel: React.FC<ProductImagesCarouselProps> = ({ images }) => {
  return (
    <Carousel className={styles.carousel}>
      {images.map((imgSrc, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={imgSrc}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductImagesCarousel;
