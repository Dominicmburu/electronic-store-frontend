// src/features/products/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from './adminApi';

interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  printerType?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useProducts = (initialParams: ProductsParams = {}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ProductsParams>(initialParams);
  const [pagination, setPagination] = useState({
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    total: 0,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = {
        ...params,
        page: pagination.page,
        limit: pagination.limit,
      };
      
      const response = await productsAPI.getProducts(queryParams);
      
      if (response.success) {
        setProducts(response.products);
        setPagination(prev => ({
          ...prev,
          total: response.total,
        }));
      } else {
        setError(response.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  }, [params, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParams = (newParams: Partial<ProductsParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await productsAPI.deleteProduct(id);
      if (response.success) {
        // Refresh the products list
        fetchProducts();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete product' 
      };
    }
  };

  return {
    products,
    isLoading,
    error,
    pagination,
    params,
    updateParams,
    setPagination,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};


