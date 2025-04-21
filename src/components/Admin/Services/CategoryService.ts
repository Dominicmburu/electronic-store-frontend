import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';

export interface PrinterType {
  id: number;
  name: string;
  printerCount?: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  images: string[];
  printerTypeId: number;
  printerType?: PrinterType;
}

export interface CategoryInput {
  name: string;
  description: string;
  images: string[];
  printerTypeId: number;
  newImages?: File[];
}

export interface PaginatedCategories {
  page: number;
  totalPages: number;
  categories: Category[];
}

class CategoryService {
  // Get all categories with pagination
  async getCategories(page: number = 1, limit: number = 10): Promise<PaginatedCategories> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/categories`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get category by ID
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new category
  async createCategory(categoryData: CategoryInput, token: string): Promise<Category> {
    try {
      // Handle file uploads if present
      if (categoryData.newImages && categoryData.newImages.length > 0) {
        const formData = new FormData();
        
        // Add all category data to form
        formData.append('name', categoryData.name);
        formData.append('description', categoryData.description);
        formData.append('printerTypeId', categoryData.printerTypeId.toString());
        
        // Add existing images
        if (categoryData.images && categoryData.images.length > 0) {
          formData.append('existingImages', JSON.stringify(categoryData.images));
        }
        
        // Add new image files
        Array.from(categoryData.newImages).forEach((file) => {
          formData.append('images', file);
        });
        
        const response = await axiosInstance.post(`${API_BASE_URL}/categories`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        
        return response.data;
      } else {
        // Standard JSON request without file uploads
        const response = await axiosInstance.post(`${API_BASE_URL}/categories`, categoryData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update a category
  async updateCategory(id: number, categoryData: Partial<CategoryInput>, token: string): Promise<Category> {
    try {
      // Handle file uploads if present
      if (categoryData.newImages && categoryData.newImages.length > 0) {
        const formData = new FormData();
        
        // Add all category data to form
        if (categoryData.name) formData.append('name', categoryData.name);
        if (categoryData.description) formData.append('description', categoryData.description);
        if (categoryData.printerTypeId) formData.append('printerTypeId', categoryData.printerTypeId.toString());
        
        // Add existing images
        if (categoryData.images && categoryData.images.length > 0) {
          formData.append('existingImages', JSON.stringify(categoryData.images));
        }
        
        // Add new image files
        Array.from(categoryData.newImages).forEach((file) => {
          formData.append('images', file);
        });
        
        const response = await axiosInstance.put(`${API_BASE_URL}/categories/${id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });
        
        return response.data;
      } else {
        // Standard JSON request without file uploads
        const response = await axiosInstance.put(`${API_BASE_URL}/categories/${id}`, categoryData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a category
  async deleteCategory(id: number, token: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new CategoryService();