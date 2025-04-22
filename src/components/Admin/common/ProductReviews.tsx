import React, { useState, useEffect, useContext } from 'react';
import ReviewService, { Review } from '../Services/ReviewService';
import { UserContext } from '../../../contexts/UserContext';
import '../../../styles/Admin/ProductReviews.css';

interface ProductReviewsProps {
  productId: number;
  onDeleteSuccess?: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, onDeleteSuccess }) => {
  const { token } = useContext(UserContext) || {};
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await ReviewService.getProductReviews(productId);
      setReviews(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (reviewId: number) => {
    setDeleteReviewId(reviewId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!token || !deleteReviewId) return;
    
    try {
      setIsDeleting(true);
      await ReviewService.deleteReview(deleteReviewId, token);
      
      // Remove the deleted review from the state
      setReviews(reviews.filter(review => review.id !== deleteReviewId));
      setShowDeleteConfirm(false);
      setDeleteReviewId(null);
      
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Failed to delete review. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteReviewId(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="material-icons star-filled">star</i>);
      } else {
        stars.push(<i key={i} className="material-icons star-empty">star_border</i>);
      }
    }
    
    return <div className="star-rating">{stars}</div>;
  };

  if (isLoading) {
    return <div className="text-center py-3"><div className="spinner-border text-primary" role="status"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="product-reviews">
      <h5 className="reviews-title">Customer Reviews ({reviews.length})</h5>
      
      {reviews.length === 0 ? (
        <div className="no-reviews-message">
          <i className="material-icons">rate_review</i>
          <p>No reviews yet for this product.</p>
        </div>
      ) : (
        <div className="review-list">
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div>
                  <h6 className="reviewer-name">{review.userName}</h6>
                  <div className="review-date">{formatDate(review.createdAt)}</div>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteClick(review.id)}
                >
                  <i className="material-icons">delete</i>
                </button>
              </div>
              
              {renderStars(review.rating)}
              
              <div className="review-comment">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={cancelDelete} disabled={isDeleting}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this review?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={cancelDelete}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                      Deleting...
                    </>
                  ) : 'Delete Review'}
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;