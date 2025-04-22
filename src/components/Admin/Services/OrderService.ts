// services/OrderService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/orders';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress?: string;
  notes?: string;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  totalPages: number;
}

/**
 * Fetch all orders with optional pagination and filters
 */
export const getOrders = async (page = 1, status?: string) => {
  try {
    let url = `${API_URL}?page=${page}`;
    if (status && status !== 'all') {
      url += `&status=${status}`;
    }
    
    const response = await axios.get<OrdersResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get details for a specific order
 */
export const getOrderById = async (orderId: string) => {
  try {
    const response = await axios.get<Order>(`${API_URL}/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update the status of an order
 */
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await axios.put(`${API_URL}/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel/delete an order
 */
export const cancelOrder = async (orderId: string, orderNumber: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${orderId}`, { 
      data: { orderNumber } 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new order (for potential future functionality)
 */
export const createOrder = async (orderData: Partial<Order>) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Export orders as CSV
 */
export const exportOrdersCsv = (orders: Order[]) => {
  const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Payment Method', 'Items'];
  
  const csvContent = 
    headers.join(',') + '\n' + 
    orders.map(order => {
      return [
        order.orderNumber || order.id,
        order.customer?.name || 'N/A',
        order.date,
        order.amount,
        order.status,
        order.paymentMethod,
        order.items?.length || 0
      ].join(',');
    }).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Get a summary of order statistics
 */
export const getOrderStats = (orders: Order[]) => {
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status.toLowerCase() === 'pending').length,
    processingOrders: orders.filter(o => o.status.toLowerCase() === 'processing').length,
    shippedOrders: orders.filter(o => o.status.toLowerCase() === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status.toLowerCase() === 'delivered').length,
    cancelledOrders: orders.filter(o => o.status.toLowerCase() === 'cancelled').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
    averageOrderValue: orders.length > 0 
      ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length 
      : 0
  };
};