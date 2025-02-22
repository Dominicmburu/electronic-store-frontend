import axios from 'axios';
// import { User } from '../types/account';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../api/main';


export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const fetchUserProfile = async (token: string) => {
  try {
    if (!token) {
      throw new Error('No token found.');
    }


    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (
  name: string,
  email: string,
  phoneNumber: string,
  password?: string
) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found.');
  
  const response = await axios.put(
    `${API_BASE_URL}/users/profile`,
    { name, email, phoneNumber, password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.user;
};
