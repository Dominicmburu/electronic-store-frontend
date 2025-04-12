import axios from 'axios';
import { API_BASE_URL } from '../api/main';

export const addPaymentMethodAPI = async (type: string, details: string, token: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/payments`,
    { type, details },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deletePaymentMethodAPI = async (id: number, token: string) => {
  const response = await axios.delete(`${API_BASE_URL}/payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { paymentMethodId: id },
  });
  return response.data;
};

export const fetchPaymentMethodsAPI = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.paymentMethods;
};
