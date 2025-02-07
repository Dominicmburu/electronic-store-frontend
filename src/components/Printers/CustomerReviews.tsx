import React from 'react';
import styles from '../../styles/CustomerReviews.module.css';

// interface Review {
//   name: string;
//   date: string;
//   rating: number;
//   content: string;
// }

interface CustomerReviewsProps {
  reviews: {
    user: {
      name: string;
    };
    createdAt: string;
    rating: number;
    content: string;
  }[];
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews }) => {
  return (
    <div className={`customer-reviews mt-5 ${styles.customerReviews}`}>
      <h4>Customer Reviews</h4>
      {reviews.length > 0 ? (
        reviews.map((review, index) => {
          const formattedDate = new Date(review.createdAt).toLocaleDateString();
          return (
            <div key={index} className={`review mb-4 ${styles.review}`}>
              <h5>
                {review.user.name} <small className={`text-muted ${styles.custDate}`}>- {formattedDate}</small>
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
              <p>{review.content}</p>
            </div>
          );
        })
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default CustomerReviews;
