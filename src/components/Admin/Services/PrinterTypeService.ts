import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';
import { PrinterType } from './CategoryService';

interface PrinterTypeInput {
  name: string;
}

class PrinterTypeService {
  // Get all printer types
  async getAllPrinterTypes(): Promise<PrinterType[]> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/printer-types`);
      return response.data.printerTypes || response.data;
    } catch (error) {
      console.error('Error fetching printer types:', error);
      throw error;
    }
  }

  // Get printer type by ID
  async getPrinterTypeById(id: number): Promise<PrinterType> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/printer-types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching printer type with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new printer type
  async createPrinterType(printerTypeData: PrinterTypeInput, token: string): Promise<PrinterType> {
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}/printer-types`, printerTypeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating printer type:', error);
      throw error;
    }
  }

  // Update a printer type
  async updatePrinterType(id: number, printerTypeData: PrinterTypeInput, token: string): Promise<PrinterType> {
    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/printer-types/${id}`, printerTypeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating printer type with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a printer type
  async deletePrinterType(id: number, token: string): Promise<void> {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/printer-types/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error(`Error deleting printer type with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new PrinterTypeService();