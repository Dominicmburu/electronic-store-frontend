import { API_BASE_URL } from "./main";

const productAPI = {
    FEATURED_PRINTERS: `${API_BASE_URL}/products/featured`,
    LATEST_PRINTERS: `${API_BASE_URL}/products/latest`,
    ALL_PRODUCTS: (page: number, limit: number, _sortParam: string | undefined, _p0: string | undefined, _p1: string | undefined) => `${API_BASE_URL}/products?page=${page}&limit=${limit}`,
    PRODUCT_DETAILS: (id: number | string): string => `${API_BASE_URL}/products/${id}`,
    CREATE_PRODUCT: `${API_BASE_URL}/products/create`,
    UPDATE_PRODUCT: (id: number | string): string => `${API_BASE_URL}/products/${id}`,
    DELETE_PRODUCT: (id: number | string): string => `${API_BASE_URL}/products/${id}`,
};

export default productAPI;
