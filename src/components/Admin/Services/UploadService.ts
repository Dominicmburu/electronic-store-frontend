// services/UploadService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

class UploadService {
  // Upload multiple files
  async uploadFiles(files: File[], folder: string = 'products'): Promise<string[]> {
    try {
      const formData = new FormData();
      
      // Append all files to form data
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Append folder name to specify where files should be saved
      formData.append('folder', folder);

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.fileUrls || [];
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  // Delete a file
  async deleteFile(filename: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/upload/${filename}`);
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  }
}

export default new UploadService();