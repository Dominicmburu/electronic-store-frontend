import axios from 'axios';

// Create an Axios instance with default configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/admin/auth/login', { email, password });
    return response.data;
  },
  logout: async () => {
    localStorage.removeItem('admin_token');
    return { success: true };
  },
  forgotPassword: async (email: string) => {
    const response = await api.post('/admin/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/admin/auth/reset-password', { token, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/admin/auth/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/admin/auth/profile', profileData);
    return response.data;
  },
};

// Products API endpoints
export const productsAPI = {
  getProducts: async (params?: any) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  getProduct: async (id: string) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },
  createProduct: async (productData: any) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },
  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },
  uploadProductImage: async (id: string, formData: FormData) => {
    const response = await api.post(`/admin/products/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Categories API endpoints
export const categoriesAPI = {
  getCategories: async (params?: any) => {
    const response = await api.get('/admin/categories', { params });
    return response.data;
  },
  getCategory: async (id: string) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },
  createCategory: async (categoryData: any) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id: string, categoryData: any) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

// Printer Types API endpoints
export const printerTypesAPI = {
  getPrinterTypes: async (params?: any) => {
    const response = await api.get('/admin/printer-types', { params });
    return response.data;
  },
  getPrinterType: async (id: string) => {
    const response = await api.get(`/admin/printer-types/${id}`);
    return response.data;
  },
  createPrinterType: async (printerTypeData: any) => {
    const response = await api.post('/admin/printer-types', printerTypeData);
    return response.data;
  },
  updatePrinterType: async (id: string, printerTypeData: any) => {
    const response = await api.put(`/admin/printer-types/${id}`, printerTypeData);
    return response.data;
  },
  deletePrinterType: async (id: string) => {
    const response = await api.delete(`/admin/printer-types/${id}`);
    return response.data;
  },
};

// Orders API endpoints
export const ordersAPI = {
  getOrders: async (params?: any) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  getOrder: async (id: string) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },
  deleteOrder: async (id: string) => {
    const response = await api.delete(`/admin/orders/${id}`);
    return response.data;
  },
};

// Customers API endpoints
export const customersAPI = {
  getCustomers: async (params?: any) => {
    const response = await api.get('/admin/customers', { params });
    return response.data;
  },
  getCustomer: async (id: string) => {
    const response = await api.get(`/admin/customers/${id}`);
    return response.data;
  },
  updateCustomer: async (id: string, customerData: any) => {
    const response = await api.put(`/admin/customers/${id}`, customerData);
    return response.data;
  },
  getCustomerOrders: async (id: string, params?: any) => {
    const response = await api.get(`/admin/customers/${id}/orders`, { params });
    return response.data;
  },
};

// Payments API endpoints
export const paymentsAPI = {
  getMpesaTransactions: async (params?: any) => {
    const response = await api.get('/admin/payments/mpesa', { params });
    return response.data;
  },
  getWalletTransactions: async (params?: any) => {
    const response = await api.get('/admin/payments/wallet', { params });
    return response.data;
  },
  getPaymentDetails: async (id: string) => {
    const response = await api.get(`/admin/payments/${id}`);
    return response.data;
  },
};

// Dashboard API endpoints
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
  getRevenueData: async (params?: any) => {
    const response = await api.get('/admin/dashboard/revenue', { params });
    return response.data;
  },
  getSalesOverview: async (params?: any) => {
    const response = await api.get('/admin/dashboard/sales', { params });
    return response.data;
  },
  getRecentOrders: async (limit: number = 5) => {
    const response = await api.get('/admin/dashboard/recent-orders', { params: { limit } });
    return response.data;
  },
};

// Reports API endpoints
export const reportsAPI = {
  getSalesReport: async (params?: any) => {
    const response = await api.get('/admin/reports/sales', { params });
    return response.data;
  },
  getInventoryReport: async (params?: any) => {
    const response = await api.get('/admin/reports/inventory', { params });
    return response.data;
  },
  getPaymentReport: async (params?: any) => {
    const response = await api.get('/admin/reports/payments', { params });
    return response.data;
  },
  exportReport: async (reportType: string, params?: any) => {
    const response = await api.get(`/admin/reports/${reportType}/export`, { 
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;