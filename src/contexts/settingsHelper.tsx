import axios from 'axios';
import { API_BASE_URL } from '../api/main';

export const updateSettingsAPI = async (
  newsSubscription: boolean,
  notificationEmail: boolean,
  notificationSMS: boolean,
  token: string
) => {
  const response = await axios.put(
    `${API_BASE_URL}/settings`,
    { newsSubscription, notificationEmail, notificationSMS },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const fetchSettingsAPI = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
