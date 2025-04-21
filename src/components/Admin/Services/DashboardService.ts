import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';
        

// Function to fetch dashboard data
export const fetchDashboardData = async (token: string): Promise<any> => {
    try {
        // Making parallel API calls
        const [usersResponse, productsResponse, categoriesResponse, printerTypesResponse, ordersResponse, shopsResponse] = await Promise.all([
            axiosInstance.get(`${API_BASE_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
            axiosInstance.get(`${API_BASE_URL}/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
            axiosInstance.get(`${API_BASE_URL}/categories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
            axiosInstance.get(`${API_BASE_URL}/printer-types`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
            axiosInstance.get(`${API_BASE_URL}/orders/get-orders/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
            axiosInstance.get(`${API_BASE_URL}/shops`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }),
        ]);

        // Extract data from responses
        const users = usersResponse.data.users || [];
        const products = productsResponse.data.products || [];
        const categories = categoriesResponse.data.categories || [];
        const printerTypes = printerTypesResponse.data.printerTypes || [];
        const orders = ordersResponse.data.orders || [];
        const shops = shopsResponse.data.shops || [];

        // Return the extracted data
        return {
            users,
            products,
            categories,
            printerTypes,
            orders,
            shops,
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};
