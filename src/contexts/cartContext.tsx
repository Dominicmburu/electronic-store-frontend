import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_BASE_URL, FRONTEND_MODE } from '../api/main';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import axiosInstance from '../api/axiosInstance';
import handleError from '../api/handleError';

interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    currentPrice: number;
    images: string[];
  };
}

interface Cart {
  id: number;
  userId: number;
  totalAmount: number;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const { token } = useContext(UserContext) || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);  

  // Helper functions
  const getToken = useCallback(() => {
    if (!token) throw new Error('Authentication required');
    return token;
  }, [token]);

  const refreshCart = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        setCart(null);
        return;
      }

      const requestUrl = `${API_BASE_URL}/cart`;

      if (FRONTEND_MODE === 'development') {
        console.log('Request URL:', requestUrl);
      }

      const response = await axiosInstance.get<{ cart: Cart }>(requestUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(response.data.cart);
      setError(null);
    } catch (error) {
      if ((error as any)?.response?.status === 401) setCart(null);
      else handleError(error, 'Failed to fetch cart, please try again later');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    refreshCart();
  }, [token, refreshCart]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    if (!isAuthenticated()) {
      toast.info('Please login to add items to your cart');
      navigate('/my-account', { state: { activeTab: 'login' } });
      return;
    }

    try {
      setLoading(true);
      const token = getToken();

      // Optimistic update
      setCart(prev => {
        if (!prev) return null;
        const existingItem = prev.items.find(item => item.productId === productId);
        const newItem = {
          id: Date.now(), // Temporary ID
          productId,
          quantity,
          subtotal: existingItem?.product.currentPrice ?? 0 * quantity,
          product: existingItem?.product ?? {
            id: productId,
            name: 'Loading...',
            currentPrice: 0,
            images: []
          }
        };

        return {
          ...prev,
          items: existingItem
            ? prev.items.map(item =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
            : [...prev.items, newItem],
          totalAmount: prev.totalAmount + (newItem.product.currentPrice * quantity)
        };
      });

      const response = await axiosInstance.post<{ cart: Cart }>(
        `${API_BASE_URL}/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(response.data.cart);
      refreshCart();
      toast.success('Item added to cart');
    } catch (error) {
      await refreshCart(); // Revert on error
      handleError(error, 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  }, [getToken, handleError, refreshCart, navigate, isAuthenticated]);

  const updateCartItem = useCallback(async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true);
      const token = getToken();

      // Optimistic update
      setCart(prev => {
        if (!prev) return null;
        return {
          ...prev,
          items: prev.items.map(item =>
            item.id === cartItemId
              ? { ...item, quantity, subtotal: item.product.currentPrice * quantity }
              : item
          ),
          totalAmount: prev.items.reduce((sum, item) =>
            sum + (item.id === cartItemId
              ? item.product.currentPrice * quantity
              : item.subtotal
            ), 0)
        };
      });

      await axiosInstance.put(
        `${API_BASE_URL}/cart/item`,
        { cartItemId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Cart updated');
    } catch (error) {
      await refreshCart(); // Revert on error
      handleError(error, 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  }, [getToken, handleError, refreshCart]);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    try {
      setLoading(true);
      const token = getToken();

      // Optimistic update
      setCart(prev => {
        if (!prev) return null;
        const removedItem = prev.items.find(item => item.id === cartItemId);
        return {
          ...prev,
          items: prev.items.filter(item => item.id !== cartItemId),
          totalAmount: prev.totalAmount - (removedItem?.subtotal ?? 0)
        };
      });

      await axiosInstance.delete(`${API_BASE_URL}/cart/item`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { cartItemId }
      });

      toast.success('Item removed from cart');
    } catch (error) {
      await refreshCart(); // Revert on error
      handleError(error, 'Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  }, [getToken, handleError, refreshCart]);

  const contextValue = useMemo(() => ({
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart
  }), [cart, loading, error, addToCart, updateCartItem, removeFromCart, refreshCart]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
