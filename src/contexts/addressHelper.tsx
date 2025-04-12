import axios from 'axios';
import { API_BASE_URL } from '../api/main';
import { FetchUserAddressesResponse } from '../types/account';


export const fetchUserAddressesAPI = async (token: string): Promise<FetchUserAddressesResponse> => {
    const response = await axios.get(`${API_BASE_URL}/addresses`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const addAddressAPI = async (addressData: any, token: string) => {
    const response = await axios.post(`${API_BASE_URL}/addresses`, addressData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteAddressAPI = async (id: number, token: string) => {
    const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateAddressAPI = async (id: number, addressData: any, token: string) => {
    const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, addressData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
