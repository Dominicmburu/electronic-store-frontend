// services/UserService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  phoneNumber?: string;
}

export interface UserResponse {
  page: number;
  totalPages: number;
  users: User[];
}

export const getUsers = async (page = 1) => {
  try {
    const response = await axios.get<UserResponse>(`${API_URL}/users?page=${page}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: number) => {
  try {
    const response = await axios.get<User>(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (userData: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAdmin = async (id: number, userData: {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
}) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateAdmin = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activateAdmin = async (id: number) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/active`, {
      isActive: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const activateUser = async (id: number) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}/active`, {
      isActive: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserStatus = async (id: number, isActive: boolean) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}/active`, {
      isActive
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};