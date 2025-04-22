import axios from "axios";
import { API_BASE_URL, FRONTEND_MODE } from "./main";
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (FRONTEND_MODE === 'development') {
            console.error('Axios Error:', error);
        }

        if (FRONTEND_MODE === 'production') {
            toast.error('We are currently experiencing technical difficulties. Please try again later.');
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;