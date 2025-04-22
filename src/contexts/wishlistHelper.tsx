import { API_BASE_URL } from '../api/main';
import handleError from '../api/handleError';
import axiosInstance from '../api/axiosInstance';

export const addToWishlistAPI = async (productId: number, token: string) => {
  try {
    const response = await axiosInstance.post(
      `${API_BASE_URL}/wishlist`,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to add to wishlist');
    throw new Error('Failed to add to wishlist');
  }
};

export const removeFromWishlistAPI = async (productId: number, token: string) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { productId },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to remove from wishlist');
    throw new Error('Failed to remove from wishlist');
  }
};

export const fetchWishlistAPI = async (token: string) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/wishlist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to fetch wishlist');
    throw new Error('Failed to fetch wishlist');
  }
};
