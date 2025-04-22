import { toast } from 'react-toastify';
import { FetchUserAddressesResponse } from '../types/account';
import { API_BASE_URL } from '../api/main';
import axiosInstance from '../api/axiosInstance';
import handleError from '../api/handleError';

export const fetchUserAddressesAPI = async (token: string): Promise<FetchUserAddressesResponse> => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/addresses`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to fetch addresses, please try again later');
        return { addresses: [] };
    }
};

export const addAddressAPI = async (addressData: any, token: string) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/addresses`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Address added successfully');
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to add address')
        throw new Error('Failed to add address');
    }
};

export const deleteAddressAPI = async (id: number, token: string) => {
    try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/addresses/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Address deleted successfully');
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to delete address');
        throw new Error('Failed to delete address');
    }
};

export const updateAddressAPI = async (id: number, addressData: any, token: string) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/addresses/${id}`, addressData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success('Address updated successfully');
        return response.data;
    } catch (error) {
        handleError(error, 'Failed to update address');
        throw new Error('Failed to update address');
    }
};