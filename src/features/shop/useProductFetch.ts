import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Product, ProductsResponse, CategoryResponse } from '../../types/product';
import productAPI from '../../api/product';
import { debounce } from 'lodash';

export const useProductFetch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cache, setCache] = useState<{ [key: string]: { products: Product[], totalPages: number } }>({});

  console.log(filteredProducts)

  useEffect(() => {
    const fetchProducts = async () => {
      setError('');

      const sortOption = searchParams.get('sort') || 'default';
      const searchQuery = searchParams.get('search') || '';
      const selectedCategory = searchParams.get('category') || '';
      const currentPage = parseInt(searchParams.get('page') || '1', 10);
      const productsPerPage = 10;

      let sortParam: string | undefined;
      if (sortOption === 'price-low-high') sortParam = 'price_asc';
      else if (sortOption === 'price-high-low') sortParam = 'price_desc';
      else if (sortOption === 'latest') sortParam = 'createdAt_desc';

      const cacheKey = `${selectedCategory || 'all'}-${sortParam || 'default'}-${currentPage}`;
      
      if (cache[cacheKey]) {
        setProducts(cache[cacheKey].products);
        setTotalPages(cache[cacheKey].totalPages);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          const url = selectedCategory
            ? `${productAPI.CATEGORIES}/${selectedCategory}`
            : productAPI.ALL_PRODUCTS(
                currentPage,
                productsPerPage,
                sortParam,
                searchQuery,
                undefined
              );

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

          // if (sortOption === 'price-low-high') {
          //   fetchedProducts = fetchedProducts.sort((a, b) => a.price - b.price);
          // } else if (sortOption === 'price-high-low') {
          //   fetchedProducts = fetchedProducts.sort((a, b) => b.price - a.price);
          // } else if (sortOption === 'latest') {
          //   fetchedProducts = fetchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          // }

          setProducts(fetchedProducts);
          setTotalPages(fetchedTotalPages);
          setCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: { products: fetchedProducts, totalPages: fetchedTotalPages },
          }));
        } catch (err) {
          console.error('Error fetching products:', err);
          setError('Failed to fetch products. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSearch = useCallback(
    debounce((query: string) => {
      if (query.trim() === '') {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, 300),
    [products]
  );

  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    handleSearch(searchQuery);
  }, [searchParams, products]);

  return { products, totalPages, loading, error, setSearchParams };
  // return { products: filteredProducts.length > 0 || searchParams.get('search') ? filteredProducts : products, totalPages, loading, error, setSearchParams };
};
