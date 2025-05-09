import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../api/main';
import { UserContext } from './UserContext';
import axiosInstance from '../api/axiosInstance';
import handleError from '../api/handleError';

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    images: string[];
  };
}

interface OrderStatus {
  id: number;
  status: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  userId: number;
  orderItems: OrderItem[];
  statusHistory: OrderStatus[];
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  placeOrder: (shippingAddressId: number, paymentMethodId: number) => Promise<Order | null>;
  getOrderDetails: (orderNumber: string) => Promise<Order | null>;
  getUserOrders: () => Promise<void>;
  trackOrder: (orderNumber: string) => Promise<OrderStatus[] | null>;
  cancelOrder: (orderNumber: string) => Promise<boolean>;
  requestRefund: (orderId: number, reason: string) => Promise<boolean>;
  payOrderWithMpesa: (orderId: number, phoneNumber: string) => Promise<string | undefined>;
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);


interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { token } = useContext(UserContext) || {};
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);

  // const navigate = useNavigate();

  const getToken = useCallback(() => {
    if (!token) {
      // handleError('Authentication required');
    }
    return token;
  }, [token]);

  // Data fetching
  const getUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`${API_BASE_URL}/orders/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
      
    } catch (err: any) {
      // handleError(err, 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Initial load
  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);

  // Order actions
  const placeOrder = useCallback(async (
    shippingAddressId: number,
    paymentMethodId: number
  ): Promise<Order | null> => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axiosInstance.post(`${API_BASE_URL}/orders`, {
        shippingAddressId,
        paymentMethodId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newOrder = response.data.order;
      setCurrentOrder(newOrder);
      await getUserOrders();
      toast.success('Order placed successfully');
      return newOrder;
    } catch (err: any) {
      handleError(err, 'Failed to place order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getToken, getUserOrders]);

  const getOrderDetails = useCallback(async (orderNumber: string): Promise<Order | null> => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axiosInstance.get(`${API_BASE_URL}/orders/${orderNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentOrder(response.data.order);
      return response.data.order;
    } catch (err: any) {
      handleError(err, 'Failed to get order details');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const trackOrder = useCallback(async (orderNumber: string): Promise<OrderStatus[] | null> => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axiosInstance.get(`${API_BASE_URL}/orders/${orderNumber}/track`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.statusHistory;
    } catch (err: any) {
      handleError(err, 'Failed to track order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const cancelOrder = useCallback(async (orderNumber: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Optimistic update
      setOrders(prev => prev.filter(order => order.orderNumber !== orderNumber));

      const token = getToken();
      await axiosInstance.delete(`${API_BASE_URL}/orders/${orderNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Order cancelled successfully');
      return true;
    } catch (err: any) {
      await getUserOrders(); // Revert optimistic update
      handleError(err, 'Failed to cancel order');
      return false;
    } finally {
      setLoading(false);
    }
  }, [getToken, getUserOrders]);

  const requestRefund = async (orderId: number, reason: string): Promise<boolean> => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please login to request a refund');
        setLoading(false);
        return false;
      }

      await axiosInstance.post(
        `${API_BASE_URL}/mpesa/refund/request`,
        {
          orderId,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Refund request submitted successfully');
      return true;
    } catch (err: any) {
      handleError(err, 'Failed to request refund');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const payOrderWithMpesa = async (orderId: number, phoneNumber: string): Promise<string | undefined> => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      if (!token) {
        toast.error('Please login to pay for your order');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post(
        `${API_BASE_URL}/mpesa/stk-push`,
        {
          orderId,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Payment initiated. Check your phone to complete the payment.');
      return response.data.data.transactionId; // Return transaction ID for status checking
    } catch (err: any) {
      handleError(err, 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(() => ({
    orders,
    currentOrder,
    loading,
    error,
    placeOrder,
    getOrderDetails,
    getUserOrders,
    trackOrder,
    cancelOrder,
    requestRefund,
    payOrderWithMpesa,
  }), [
    orders,
    currentOrder,
    loading,
    error,
    placeOrder,
    getOrderDetails,
    getUserOrders,
    trackOrder,
    cancelOrder,
    requestRefund,
    payOrderWithMpesa,
  ]);

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};