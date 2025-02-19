import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/ShopHeader.module.css';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

interface ShopHeaderProps {
  onSearch: (query: string) => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);


  const debouncedSearch = useCallback(
    debounce((query: string) => {
      console.log('[ShopHeader] Debounced search triggered with query:', query);
      onSearch(query.trim());
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch.cancel();
    onSearch(searchQuery.trim());
  };

  return (
    <div className={`container my-4 ${styles.shopHeader}`}>
      <div className="d-flex justify-content-center">
        <form className="search-f flex w-100" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search for products..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default ShopHeader;
