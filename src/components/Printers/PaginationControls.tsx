import React from 'react';
import styles from '../../styles/PaginationControls.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          <button className="page-link">{i}</button>
        </li>
      );
    }

    return pages;
  };

  return (
    <div className={`pagination-controls ${styles.paginationControls}`}>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={handlePrevious}>
          <button className="page-link">Previous</button>
        </li>
        {renderPageNumbers()}
        <li
          className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
        >
          <button className="page-link">Next</button>
        </li>
      </ul>
    </div>
  );
};

export default PaginationControls;
