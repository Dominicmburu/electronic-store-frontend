import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';
import axiosInstance from '../api/axiosInstance';
import { API_BASE_URL } from '../api/main';
import handleError from '../api/handleError'; // Utility function for centralized error handling

interface WishlistItem {
  userId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    currentPrice: number;
    lastPrice: number;
    images: string[];
  };
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(UserContext) || {};

  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data.wishlist || []);
      setError(null);
    } catch (err: any) {
      handleError(err, 'Failed to fetch wishlist');
      setError('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId: number) => {
    if (!token) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(
        `${API_BASE_URL}/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
      toast.success('Item added to wishlist');
    } catch (err: any) {
      handleError(err, 'Failed to add to wishlist');
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!token) {
      toast.error('Please login to remove items from wishlist');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.delete(`${API_BASE_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });
      await fetchWishlist();
      toast.success('Item removed from wishlist');
    } catch (err: any) {
      handleError(err, 'Failed to remove from wishlist');
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: number) =>
    wishlist.some((item) => item.productId === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
