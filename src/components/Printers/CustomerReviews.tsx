// src/components/CustomerReviews.tsx

import React from 'react';
import styles from '../../styles/CustomerReviews.module.css';

interface Review {
  name: string;
  date: string;
  rating: number; // e.g., 4.5
  comment: string;
}

interface CustomerReviewsProps {
  reviews: Review[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  return (
    <div className={`customer-reviews mt-5 ${styles.customerReviews}`}>
      <h4>Customer Reviews</h4>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className={`review mb-4 ${styles.review}`}>
            <h5>
              {review.name}{' '}
              <small className="text-muted">- {review.date}</small>
            </h5>
            <div className="star-rating mb-2">
              {Array.from({ length: 5 }, (_, i) => {
                if (i < Math.floor(review.rating)) {
                  return <i key={i} className="fas fa-star text-warning"></i>;
                } else if (i < review.rating) {
                  return <i key={i} className="fas fa-star-half-alt text-warning"></i>;
                } else {
                  return <i key={i} className="far fa-star text-warning"></i>;
                }
              })}
            </div>
            <p>{review.comment}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default CustomerReviews;
