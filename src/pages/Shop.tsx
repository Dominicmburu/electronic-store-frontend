import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductGrid from '../components/shop/ProductGrid';
import SortingDropdown from '../components/shop/SortingDropdown';
import { LoadingState, ErrorState, EmptyState } from '../components/shop/ShopStates';
import { useProductFetch } from '../features/shop/useProductFetch';
import { useSearchParamsHandler } from '../features/shop/useSearchParamsHandler';
import PrinterTypesSidebar from '../components/Printers/PrinterTypesSidebar';
import ShopHeader from '../components/Printers/ShopHeader';
import PaginationControls from '../components/Printers/PaginationControls';

const Shop: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { updateSearchParams } = useSearchParamsHandler();
  const { products, totalPages, loading, error } = useProductFetch();

  const sortOption = searchParams.get('sort') || 'default';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // const updateParams = (params: Record<string, string>) => {
  //   updateSearchParams({ ...params, page: '1' });
  // };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSearchParams({ 
      sort: e.target.value, 
      page: '1' 
    });

    // updateParams({ sort: e.target.value });
  };

  const handleSearch = (query: string) => {
    updateSearchParams({ 
      search: query, 
      page: '1' 
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page.toString() });
  };

  return (
    <Layout>
      <ShopHeader onSearch={handleSearch} />
      
      <div className="container my-5">
        <div className="row">
          <PrinterTypesSidebar />
          
          <div className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Printers</h3>
              <SortingDropdown 
                sortOption={sortOption}
                onSortChange={handleSortChange}
              />
            </div>

            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} />
            ) : products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid products={products} />
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