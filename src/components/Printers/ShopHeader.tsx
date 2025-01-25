// src/components/Printers/ShopHeader.tsx
import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../styles/ShopHeader.module.css';
import debounce from 'lodash.debounce';

interface ShopHeaderProps {
  onSearch: (query: string) => void;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Debounce the search to wait for user to stop typing
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 500),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    // Cleanup function
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  return (
    <div className={`container my-4 ${styles.shopHeader}`}>
      <div className="d-flex justify-content-center">
        <form className="d-flex w-100" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search for products..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopHeader;
