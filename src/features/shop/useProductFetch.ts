import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Product, ProductsResponse, CategoryResponse } from '../../types/product';
import productAPI from '../../api/product';

export const useProductFetch = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cache, setCache] = useState<{ [key: string]: { products: Product[]; totalPages: number } }>({});

  const fetchProducts = useCallback(async () => {
    setError('');

    const searchParams = new URLSearchParams(location.search);

    const sortOption = searchParams.get('sort') || 'default';
    const searchQuery = searchParams.get('search') || '';
    const selectedCategory = searchParams.get('category') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const productsPerPage = 10;


    let sortParam = getSortParam(sortOption);

    const cacheKey = `${selectedCategory || 'all'}-${sortParam || 'default'}-${searchQuery || 'all'}-${currentPage}`;

    if (cache[cacheKey]) {
      setProducts(cache[cacheKey].products);
      setTotalPages(cache[cacheKey].totalPages);
      return;
    }

    setLoading(true);
    try {
      let url = '';
      if (selectedCategory) {
        url = `${productAPI.CATEGORIES}/${selectedCategory}?search=${encodeURIComponent(searchQuery)}`;
      } else {
        url = productAPI.ALL_PRODUCTS(
          currentPage,
          productsPerPage,
          sortParam,
          searchQuery,
          undefined
        );
      }

      const response = await axios.get<ProductsResponse | CategoryResponse>(url);

      let fetchedProducts: Product[] = [];
      let fetchedTotalPages = 1;

      if (selectedCategory) {
        const categoryResponse = response.data as CategoryResponse;
        fetchedProducts = categoryResponse.category.products;
      } else {
        const productsResponse = response.data as ProductsResponse;
        fetchedProducts = productsResponse.products;
        fetchedTotalPages = productsResponse.totalPages;
      }

      setProducts(fetchedProducts);
      setTotalPages(fetchedTotalPages);
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: { products: fetchedProducts, totalPages: fetchedTotalPages },
      }));
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [location.search, fetchProducts]);

  return { products, totalPages, loading, error };
};

const getSortParam = (sortOption: string) => {
  if (sortOption === 'price-low-high') return 'price-low-high';
  if (sortOption === 'price-high-low') return 'price-high-low';
  if (sortOption === 'latest') return 'latest';
  return '';
};