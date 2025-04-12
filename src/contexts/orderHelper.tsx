import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../api/main';

export const fetchOrderDetails = async (orderNumber: string) => {
  const token = Cookies.get('token');
  if (!token) throw new Error('No token found.');

  const response = await axios.get(
    `${API_BASE_URL}/orders/${orderNumber}/track`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};