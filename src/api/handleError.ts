import { FRONTEND_MODE } from "./main";
import { toast } from 'react-toastify';

const handleError = (error: unknown, defaultMessage: string) => {
    const message = (error as any)?.response?.data?.message || defaultMessage;

    if (FRONTEND_MODE === 'development') {
        console.error('Error:', error);  
    }

    if (FRONTEND_MODE === 'production') {
        // toast.error('We are currently experiencing a technical issue. Please try again later.');
    } else {
        toast.error(message);  
    }

    return message; 
};

export default handleError;