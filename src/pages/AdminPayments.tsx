import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import TransactionService, { Transaction, TransactionStats } from '../components/Admin/Services/PaymentService';
import TransactionViewModal from '../components/Admin/common/TransactionViewModal';
import RefundRequestModal from '../components/Admin/common/RefundRequestModal';
import { UserContext } from '../contexts/UserContext';
import '../styles/Admin/Payments.css';
import { FaSearch, FaDownload, FaMoneyBill, FaCheckCircle, FaHourglassHalf, FaExclamationCircle } from 'react-icons/fa';

const Payments: React.FC = () => {
  const { token } = useContext(UserContext) || {};

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | 'custom'>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [stats, setStats] = useState<TransactionStats>({
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    refunded: 0
  });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const transactionsPerPage = 10;

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, currentPage]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await TransactionService.getAllTransactions(currentPage, transactionsPerPage, token as string);
      setTransactions(response.transactions);

      // Calculate stats from all transactions
      const calculatedStats = TransactionService.calculateStats(response.transactions);
      setStats(calculatedStats);

      setErrorMessage(null);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setErrorMessage('Failed to load transactions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setViewModalOpen(true);
  };

  const handleRefundRequest = (transaction: Transaction) => {
    if (transaction.status !== 'COMPLETED') {
      setErrorMessage('Only completed transactions can be refunded.');
      return;
    }

    setCurrentTransaction(transaction);
    setRefundModalOpen(true);
  };

  const handleStatusUpdate = async (transaction: Transaction, newStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED') => {
    if (!token) {
      setErrorMessage('You must be logged in to update transaction status');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedTransaction = await TransactionService.updateTransactionStatus(
        transaction.id,
        newStatus,
        token
      );

      // Update transactions list
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );

      // Recalculate stats
      const updatedStats = TransactionService.calculateStats([
        ...transactions.filter(t => t.id !== updatedTransaction.id),
        updatedTransaction
      ]);
      setStats(updatedStats);

      setSuccessMessage(`Transaction status updated to ${newStatus}`);

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error updating transaction status:', error);
      setErrorMessage('Failed to update transaction status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefundSubmit = async (reason: string) => {
    if (!token || !currentTransaction) {
      setErrorMessage('You must be logged in to request a refund');
      return;
    }

    try {
      setIsSubmitting(true);
      await TransactionService.requestRefund(
        {
          orderId: currentTransaction.order?.orderNumber || '',
          reason: reason
        },
        token
      );

      // Update transaction status locally - fix the type issue with explicit casting
      const updatedTransaction = {
        ...currentTransaction,
        status: 'REFUNDED' as 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED'
      };

      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.id === currentTransaction.id ? updatedTransaction : t
        )
      );

      // Recalculate stats
      const updatedStats = TransactionService.calculateStats([
        ...transactions.filter(t => t.id !== currentTransaction.id),
        updatedTransaction
      ]);
      setStats(updatedStats);

      setRefundModalOpen(false);
      setSuccessMessage('Refund request submitted successfully');

      // Auto-dismiss success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error requesting refund:', error);
      setErrorMessage('Failed to submit refund request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'badge-success';
      case 'PENDING': return 'badge-warning';
      case 'FAILED': return 'badge-danger';
      case 'REFUNDED': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDateFilterChange = (filter: 'all' | '7days' | '30days' | 'custom') => {
    setDateFilter(filter);
    setCurrentPage(1);

    if (filter === 'custom') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDateRange({
      ...customDateRange,
      [name]: value
    });
    setCurrentPage(1);
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.order?.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.mpesaReceiptId || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = currentStatus === 'all' || transaction.status === currentStatus;

    // Date filter
    let matchesDate = true;
    const transactionDate = new Date(transaction.createdAt);
    const today = new Date();

    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
      matchesDate = transactionDate >= sevenDaysAgo;
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      matchesDate = transactionDate >= thirtyDaysAgo;
    } else if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      // Add one day to end date to include the end date in the range
      endDate.setDate(endDate.getDate() + 1);
      matchesDate = transactionDate >= startDate && transactionDate < endDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination for filtered results
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const filteredTotalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!token) {
    return <div className="alert alert-warning">You must be logged in to view transactions.</div>;
  }

  if (isLoading && transactions.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="payments-container">
      <PageHeader
        title="Payments"
        subtitle="Track and manage all payment transactions"
        actions={
          <div className="d-flex">
            <button className="btn btn-primary">
              <FaDownload className="mr-1" /> Export
            </button>
          </div>
        }
      />

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button type="button" className="close" onClick={() => setErrorMessage(null)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="close" onClick={() => setSuccessMessage(null)}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Payments
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {stats.total.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <FaMoneyBill className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Completed
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {stats.completed.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {stats.pending.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <FaHourglassHalf className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-danger shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-danger text-uppercase mb-1">
                    Failed/Refunded
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {(stats.failed + stats.refunded).toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <FaExclamationCircle className="text-gray-300" style={{ fontSize: '2rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardCard title='Payment Transactions' className="mb-4">
        <div className="payment-filters mb-4">
          <div className="row align-items-center">
            <div className="col-lg-4 mb-3 mb-lg-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-3 mb-lg-0">
              <div className="d-flex align-items-center">
                <label className="mr-2 mb-0">Date:</label>
                <select
                  className="form-control form-control-sm"
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value as any)}
                >
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {showCustomDate && (
                <div className="custom-date-range mt-2">
                  <div className="d-flex">
                    <div className="input-group input-group-sm mr-2">
                      <div className="input-group-prepend">
                        <span className="input-group-text">From</span>
                      </div>
                      <input
                        type="date"
                        className="form-control"
                        name="start"
                        value={customDateRange.start}
                        onChange={handleCustomDateChange}
                      />
                    </div>
                    <div className="input-group input-group-sm">
                      <div className="input-group-prepend">
                        <span className="input-group-text">To</span>
                      </div>
                      <input
                        type="date"
                        className="form-control"
                        name="end"
                        value={customDateRange.end}
                        onChange={handleCustomDateChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-content-lg-end">
                <div className="btn-group">
                  <button
                    className={`btn btn-sm ${currentStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentStatus('all')}
                  >
                    All
                  </button>
                  <button
                    className={`btn btn-sm ${currentStatus === 'COMPLETED' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentStatus('COMPLETED')}
                  >
                    Completed
                  </button>
                  <button
                    className={`btn btn-sm ${currentStatus === 'PENDING' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentStatus('PENDING')}
                  >
                    Pending
                  </button>
                  <button
                    className={`btn btn-sm ${currentStatus === 'FAILED' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentStatus('FAILED')}
                  >
                    Failed
                  </button>
                  <button
                    className={`btn btn-sm ${currentStatus === 'REFUNDED' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentStatus('REFUNDED')}
                  >
                    Refunded
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentTransactions.length === 0 ? (
          <div className="text-center py-5">
            <FaMoneyBill className="empty-icon text-muted" size={64} />
            <h4>No payments found</h4>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>ID</th>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td><strong>{transaction.id}</strong></td>
                      <td>{transaction.reference}</td>
                      <td>
                        {transaction.user.name}
                        <div><small className="text-muted">{transaction.user.phoneNumber}</small></div>
                      </td>
                      <td>{transaction.transactionType.replace('_', ' ')}</td>
                      <td>KES {transaction.amount.toLocaleString()}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>
                        {transaction.mpesaReceiptId || '-'}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleViewTransaction(transaction)}
                            title="View details"
                          >
                            <FaSearch className="fa-fw" />
                          </button>
                          {transaction.status === 'PENDING' && (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusUpdate(transaction, 'COMPLETED')}
                              title="Mark as completed"
                              disabled={isSubmitting}
                            >
                              <FaCheckCircle className="fa-fw" />
                            </button>
                          )}
                          {transaction.status === 'COMPLETED' && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleRefundRequest(transaction)}
                              title="Request refund"
                              disabled={isSubmitting}
                            >
                              <FaMoneyBill className="fa-fw" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                Showing {filteredTransactions.length > 0 ? indexOfFirstTransaction + 1 : 0} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, filteredTotalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ?
                    (currentPage + i > filteredTotalPages ? filteredTotalPages - 4 + i : currentPage - 2 + i) :
                    i + 1;

                  if (pageNum <= filteredTotalPages && pageNum > 0) {
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
                <li className={`page-item ${currentPage === filteredTotalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === filteredTotalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </DashboardCard>

      {/* Transaction View Modal */}
      {viewModalOpen && currentTransaction && (
        <TransactionViewModal
          transaction={currentTransaction}
          onClose={() => setViewModalOpen(false)}
        />
      )}

      {/* Refund Request Modal */}
      {refundModalOpen && currentTransaction && (
        <RefundRequestModal
          transaction={currentTransaction}
          onSubmit={handleRefundSubmit}
          onCancel={() => setRefundModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default Payments;