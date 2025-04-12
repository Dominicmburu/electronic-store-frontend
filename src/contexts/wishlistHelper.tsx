import axios from 'axios';
import { API_BASE_URL } from '../api/main';

export const addToWishlistAPI = async (productId: number, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/wishlist`,
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const removeFromWishlistAPI = async (productId: number, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { productId },
  });
  return response.data;
};

export const fetchWishlistAPI = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
