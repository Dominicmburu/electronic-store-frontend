import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/wishlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWishlist(response.data.wishlist || []);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Not authenticated
        setWishlist([]);
      } else {
        setError('Failed to fetch wishlist');
        console.error('Error fetching wishlist:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to add items to wishlist');
        setLoading(false);
        return;
      }

      await axios.post(
        '/api/wishlist/add',
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchWishlist();
      toast.success('Item added to wishlist');
    } catch (err: any) {
      setError('Failed to add to wishlist');
      toast.error(err.response?.data?.message || 'Failed to add to wishlist');
      console.error('Error adding to wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to remove items from wishlist');
        setLoading(false);
        return;
      }

      await axios.delete('/api/wishlist/remove', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          productId,
        },
      });

      await fetchWishlist();
      toast.success('Item removed from wishlist');
    } catch (err: any) {
      setError('Failed to remove from wishlist');
      toast.error(err.response?.data?.message || 'Failed to remove from wishlist');
      console.error('Error removing from wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

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