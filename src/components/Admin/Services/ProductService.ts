import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';

export interface ProductSpecifications {
  [key: string]: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  lastPrice: number;
  currentPrice: number;
  specifications: ProductSpecifications;
  images: string[];
  isFeatured?: boolean;
  categoryId: number;
  category?: string;
  stockQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

class ProductService {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/products`);
      return response.data.products.map((product: any) => ({
        ...product,
        categoryId: product.category?.id || 0,
        category: product.category?.name || 'Uncategorized',
        stockQuantity: product.stockQuantity || 0, 
      }));      
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<Product> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/products/${id}`);
      return {
        ...response.data.product,
        categoryId: response.data.product.category?.id || 0,
        category: response.data.product.category?.name || 'Uncategorized',
        stockQuantity: response.data.product.stockQuantity || 0
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/products/featured`);
      return response.data.featuredPrinters.map((product: any) => ({
        ...product,
        categoryId: product.category?.id || 0,
        category: product.category?.name || 'Uncategorized',
        stockQuantity: product.stockQuantity || 0
      }));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

  // Get latest products
  async getLatestProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/products/latest`);
      return response.data.latestPrinters.map((product: any) => ({
        ...product,
        categoryId: product.category?.id || 0,
        category: product.category?.name || 'Uncategorized',
        stockQuantity: product.stockQuantity || 0
      }));
    } catch (error) {
      console.error('Error fetching latest products:', error);
      throw error;
    }
  }

  // Create a new product
  async createProduct(formData: FormData, token: string): Promise<Product> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.product || response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update a product
  async updateProduct(id: number, formData: FormData, token: string): Promise<Product> {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/products/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.product || response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(id: number, token: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  // Update featured status
  async updateFeaturedStatus(id: number, isFeatured: boolean, token: string): Promise<Product> {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/products/${id}/featured`, 
        { isFeatured }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const updatedProduct = response.data.product || response.data;
      
      return {
        ...updatedProduct,
        categoryId: updatedProduct.category?.id || 0,
        category: updatedProduct.category?.name || 'Uncategorized',
        stockQuantity: updatedProduct.stockQuantity || 0
      };
    } catch (error) {
      console.error(`Error updating featured status for product with ID ${id}:`, error);
      throw error;
    }
  }

  // Get product reviews
  async getProductReviews(productId: number): Promise<any[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/reviews/${productId}`);
      return response.data.reviews || [];
    } catch (error) {
      console.error(`Error fetching reviews for product ID ${productId}:`, error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId: number, token: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting review with ID ${reviewId}:`, error);
      throw error;
    }
  }
}

export default new ProductService();