import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchProducts = async () => {
      setError('');

      const searchParams = new URLSearchParams(location.search);

      const sortOption = searchParams.get('sort') || 'default';
      const searchQuery = searchParams.get('search') || '';
      const selectedCategory = searchParams.get('category') || '';
      const currentPage = parseInt(searchParams.get('page') || '1', 10);
      const productsPerPage = 10;

      console.log('[useProductFetch] sortOption:', sortOption, '| searchQuery:', searchQuery, '| selectedCategory:', selectedCategory, '| currentPage:', currentPage);


      let sortParam: string | undefined;
      if (sortOption === 'price-low-high') sortParam = 'price-low-high';
      else if (sortOption === 'price-high-low') sortParam = 'price-high-low';
      else if (sortOption === 'latest') sortParam = 'latest';

      const cacheKey = `${selectedCategory || 'all'}-${sortParam || 'default'}-${searchQuery || 'all'}-${currentPage}`;

      if (cache[cacheKey]) {
        setProducts(cache[cacheKey].products);
        setTotalPages(cache[cacheKey].totalPages);
        setLoading(false);
      } else {
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
      }
    };

    fetchProducts();
  }, [location.search]);

  return { products, totalPages, loading, error };
};
