import React, { useEffect, useState } from 'react';
import PrinterTypesSidebar from '../components/Printers/PrinterTypesSidebar';
import ProductCard from '../components/Printers/ProductCard';
import PaginationControls from '../components/Printers/PaginationControls';
import ShopHeader from '../components/Printers/ShopHeader';
import Layout from '../components/Layout';
import productAPI from '../api/product';
import { Product, ProductsResponse } from '../types/product';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query parameters
  const sortOption = searchParams.get('sort') || 'default';
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const productsPerPage = 10;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const updateSearchParams = (params: { [key: string]: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        newParams.set(key, params[key]);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Map sort options to backend expected values
        let sortParam: string | undefined = undefined;
        if (sortOption === 'price-low-high') {
          sortParam = 'price_asc';
        } else if (sortOption === 'price-high-low') {
          sortParam = 'price_desc';
        } else if (sortOption === 'latest') {
          sortParam = 'createdAt_desc';
        }

        const url = selectedCategory
          ? `http://127.0.0.1:5000/api/categories/${selectedCategory}`
          : productAPI.ALL_PRODUCTS(
            currentPage,
            productsPerPage,
            sortParam,
            searchQuery !== '' ? searchQuery : undefined,
            undefined
          );

          if (selectedCategory) {
            const response = await axios.get(url);
            setProducts(response.data.category.products);
            setTotalPages(1); // Assuming category fetch doesn't support pagination
          } else {
            const response = await axios.get<ProductsResponse>(url);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
          }

        console.log("Fetching products with URL:", url); // Debugging line

        const response = await axios.get<ProductsResponse>(url);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sortOption, searchQuery, selectedCategory, currentPage, productsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    updateSearchParams({ sort: selectedSort, page: '1' }); // Reset to first page on sort change
  };

  // Handle search submission
  const handleSearch = (query: string) => {
    updateSearchParams({ search: query, page: '1' }); // Reset to first page on new search
  };

  return (
    <Layout>
      {/* Pass the search handler to ShopHeader */}
      <ShopHeader onSearch={handleSearch} />

      <div className="container my-5">
        <div className="row">
          {/* Sidebar Section */}
          <PrinterTypesSidebar />

          {/* Products Section */}
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Printers</h3>
              <div className="sorting">
                <select
                  className="form-select"
                  aria-label="Sort products"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Default sorting</option> {/* Enabled default option */}
                  <option value="price-low-high">Price - Low to High</option>
                  <option value="price-high-low">Price - High to Low</option>
                  <option value="latest">Latest Arrivals</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="alert alert-info" role="alert">
                No products found.
              </div>
            ) : (
              <>
                <div className="product-grid row">
                  {products.map((product) => (
                    <div key={product.id} className="col-md-4 mb-4">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
