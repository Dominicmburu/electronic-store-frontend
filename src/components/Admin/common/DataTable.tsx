import React, { useState, useEffect } from 'react';
import styles from '../../styles/components/Table.module.css';

interface Column {
  field: string;
  header: string;
  render?: (item: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  pagination?: boolean;
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  searchable?: boolean;
  searchFields?: string[];
  emptyMessage?: string;
  rowKey?: string;
  onRowClick?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading = false,
  pagination = false,
  paginationState,
  onPaginationChange,
  searchable = false,
  searchFields = [],
  emptyMessage = 'No data available',
  rowKey = 'id',
  onRowClick,
}) => {
  const [displayData, setDisplayData] = useState<any[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(paginationState?.page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(paginationState?.limit || 10);
  const [totalItems, setTotalItems] = useState(paginationState?.total || 0);

  // Update pagination state when props change
  useEffect(() => {
    if (paginationState) {
      setCurrentPage(paginationState.page);
      setItemsPerPage(paginationState.limit);
      setTotalItems(paginationState.total);
    }
  }, [paginationState]);

  // Apply sorting and filtering
  useEffect(() => {
    let result = [...data];

    // Apply search if enabled and value exists
    if (searchable && searchValue.trim() && searchFields.length > 0) {
      const searchTerm = searchValue.toLowerCase().trim();
      result = result.filter(item => {
        return searchFields.some(field => {
          const fieldValue = field.split('.').reduce((obj, path) => {
            return obj ? obj[path] : null;
          }, item);
          
          return fieldValue && String(fieldValue).toLowerCase().includes(searchTerm);
        });
      });
    }

    // Apply sorting if field is set
    if (sortField) {
      result.sort((a, b) => {
        const aValue = sortField.split('.').reduce((obj, path) => {
          return obj ? obj[path] : null;
        }, a);
        
        const bValue = sortField.split('.').reduce((obj, path) => {
          return obj ? obj[path] : null;
        }, b);

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
        if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return sortOrder === 'asc'
          ? (aValue > bValue ? 1 : -1)
          : (aValue > bValue ? -1 : 1);
      });
    }

    // Apply client-side pagination if needed (when server pagination is not used)
    if (pagination && !onPaginationChange) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setTotalItems(result.length);
      result = result.slice(startIndex, endIndex);
    }

    setDisplayData(result);
  }, [data, searchValue, sortField, sortOrder, currentPage, itemsPerPage, searchable, searchFields, pagination, onPaginationChange]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (!onPaginationChange) {
      setCurrentPage(1); // Reset to first page on new search
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (onPaginationChange) {
      onPaginationChange({
        page,
        limit: itemsPerPage,
        total: totalItems,
      });
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page
    
    if (onPaginationChange) {
      onPaginationChange({
        page: 1,
        limit: newLimit,
        total: totalItems,
      });
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 5;
    
    if (totalPages <= 1) return null;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className={styles.pagination}>
        <div className={styles.paginationInfo}>
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
        </div>
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="material-icons">first_page</span>
          </button>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="material-icons">chevron_left</span>
          </button>
          
          {pages.map((page) => (
            <button
              key={page}
              className={`${styles.paginationButton} ${page === currentPage ? styles.active : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="material-icons">chevron_right</span>
          </button>
          <button
            className={styles.paginationButton}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            <span className="material-icons">last_page</span>
          </button>
        </div>
        <div className={styles.itemsPerPage}>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className={styles.itemsPerPageSelect}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className={styles.itemsPerPageLabel}>items per page</span>
        </div>
      </div>
    );
  };

  const renderCell = (item: any, column: Column) => {
    if (column.render) {
      return column.render(item);
    }

    // Handle nested fields with dot notation
    if (column.field.includes('.')) {
      return column.field.split('.').reduce((obj, path) => {
        return obj ? obj[path] : null;
      }, item) || '';
    }

    return item[column.field] || '';
  };

  return (
    <div className={styles.tableContainer}>
      {/* Table header with search */}
      {searchable && (
        <div className={styles.tableHeader}>
          <div className={styles.searchContainer}>
            <span className={`material-icons ${styles.searchIcon}`}>search</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
            />
            {searchValue && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchValue('')}
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(column => (
                <th 
                  key={column.field}
                  className={column.sortable ? styles.sortable : ''}
                  onClick={() => column.sortable && handleSort(column.field)}
                  style={{ width: column.width }}
                >
                  <div className={styles.thContent}>
                    {column.header}
                    {column.sortable && (
                      <span className={styles.sortIcon}>
                        {sortField === column.field ? (
                          <span className="material-icons">
                            {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                          </span>
                        ) : (
                          <span className="material-icons">unfold_more</span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className={styles.loadingCell}>
                  <div className={styles.loadingSpinner}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.emptyCell}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map(item => (
                <tr 
                  key={item[rowKey]} 
                  onClick={() => onRowClick && onRowClick(item)}
                  className={onRowClick ? styles.clickableRow : ''}
                >
                  {columns.map(column => (
                    <td key={`${item[rowKey]}-${column.field}`}>
                      {renderCell(item, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && renderPagination()}
    </div>
  );
};

export default DataTable;