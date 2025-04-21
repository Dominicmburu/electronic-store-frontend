import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

class ReviewService {
  // Get all reviews for a product
  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/reviews/${productId}`);
      return response.data.reviews || [];
    } catch (error) {
      console.error(`Error fetching reviews for product ${productId}:`, error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId: number, token: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting review ${reviewId}:`, error);
      throw error;
    }
  }
}

export default new ReviewService();