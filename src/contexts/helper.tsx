import Cookies from 'js-cookie';
import { API_BASE_URL } from '../api/main';
import axiosInstance from '../api/axiosInstance';
import handleError from '../api/handleError';


export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    handleError(error, 'Failed to login');
    throw new Error('Failed to login');
  }
};

export const fetchUserProfile = async (token: string) => {
  try {
    if (!token) {
      throw new Error('No token found.');
    }

    const response = await axiosInstance.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data.user;
  } catch (error) {
    handleError(error, 'Failed to fetch user profile');
    return null;
  }
};

export const updateUserProfile = async (
  name: string,
  email: string,
  phoneNumber: string,
  password?: string,
  currentPassword?: string
) => {
  try {
    const token = Cookies.get('token');
    if (!token) throw new Error('No token found.');

    const response = await axiosInstance.put(
      `${API_BASE_URL}/users/profile`,
      { name, email, phoneNumber, password, currentPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.user;
  } catch (error) {
    handleError(error, 'Failed to update user profile');
    throw new Error('Failed to update user profile');
  }
};