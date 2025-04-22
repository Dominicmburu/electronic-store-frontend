// src/features/orders/hooks/useOrdersList.ts
import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from './adminApi';

interface OrderFilters {
  status?: string;
  dateRange?: { start: Date | null; end: Date | null };
  paymentMethod?: string;
  customerId?: string;
}

interface OrdersParams extends OrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useOrdersList = (initialFilters: OrderFilters = {}) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare query parameters
      const queryParams: OrdersParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      
      // Format date range if provided
      if (filters.dateRange?.start && filters.dateRange?.end) {
        queryParams.dateRange = {
          start: filters.dateRange.start,
          end: filters.dateRange.end,
        };
      }
      
      const response = await ordersAPI.getOrders(queryParams);
      
      if (response.success) {
        setOrders(response.orders);
        setPagination(prev => ({
          ...prev,
          total: response.total,
        }));
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching orders');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      if (response.success) {
        // Update the order in the list
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        );
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update order status' 
      };
    }
  };

  return {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    updateFilters,
    setPagination,
    updateOrderStatus,
    refreshOrders: fetchOrders,
  };
};
