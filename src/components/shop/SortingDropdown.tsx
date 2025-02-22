import React from 'react';

const SortingDropdown: React.FC<{
  sortOption: string;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ sortOption, onSortChange }) => {
  return (
    <div className="sorting">
      <select
        className="form-select"
        aria-label="Sort products"
        value={sortOption}
        onChange={(e) => {
          onSortChange(e);
        }}
      >
        <option value="default">Default sorting</option>
        <option value="price-low-high">Price - Low to High</option>
        <option value="price-high-low">Price - High to Low</option>
        <option value="latest">Latest Arrivals</option>
      </select>
    </div>
  );
};

export default React.memo(SortingDropdown);
