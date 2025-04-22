// services/AuthService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    // Remove from localStorage anyway
    localStorage.removeItem('user');
    throw error;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Add token to all requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = getCurrentUser();
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Handle 401 responses (unauthorized)
  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );
};