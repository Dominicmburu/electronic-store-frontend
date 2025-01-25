const productAPI = {
    FEATURED_PRINTERS: "http://127.0.0.1:5000/api/products/featured",
    LATEST_PRINTERS: "http://127.0.0.1:5000/api/products/latest",
    ALL_PRODUCTS: (page: number, limit: number, _sortParam: string | undefined, _p0: string | undefined, _p1: string | undefined) => `http://127.0.0.1:5000/api/products?page=${page}&limit=${limit}`,
    PRODUCT_DETAILS: (id: number | string): string => `http://127.0.0.1:5000/api/products/${id}`,
    CREATE_PRODUCT: "http://127.0.0.1:5000/api/products/create",
    UPDATE_PRODUCT: (id: number | string): string => `http://127.0.0.1:5000/api/products/${id}`,
    DELETE_PRODUCT: (id: number | string): string => `http://127.0.0.1:5000/api/products/${id}`,
};

export default productAPI;
