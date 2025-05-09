import { API_BASE_URL } from "./main";

const productAPI = {
    FEATURED_PRINTERS: `${API_BASE_URL}/products/featured`,
    LATEST_PRINTERS: `${API_BASE_URL}/products/latest`,
    CATEGORIES: `${API_BASE_URL}/categories`,
    ALL_PRODUCTS: (
        page: number,
        limit: number,
        sortParam?: string,
        searchQuery?: string,
        extra?: string
      ) => {
        let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
        if (sortParam) {
          url += `&sort=${sortParam}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (extra) {
          url += `&${extra}`;
        }
        return url;
      },
      
    // PRODUCT_DETAILS: `${API_BASE_URL}/product-details`,
    CREATE_PRODUCT: `${API_BASE_URL}/products/create`,


    UPDATE_PRODUCT: (id: number | string): string => `${API_BASE_URL}/products/${id}`,
    DELETE_PRODUCT: (id: number | string): string => `${API_BASE_URL}/products/${id}`,

    // PRINTERSTYPE: `${API_BASE_URL}/printers-types`,
};

export default productAPI;
