import React from 'react';
import { Transaction } from '../Services/PaymentService';
import { FaUser, FaFileInvoice, FaWallet, FaCreditCard } from 'react-icons/fa';

interface TransactionViewModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const TransactionViewModal: React.FC<TransactionViewModalProps> = ({ transaction, onClose }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Transaction Details</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="transaction-header mb-4">
              <div className="row">
                <div className="col-md-6">
                  <h5><strong>Reference:</strong> {transaction.reference}</h5>
                  <div>
                    <span className={`badge ${getStatusBadgeClass(transaction.status)} mr-2`}>
                      {transaction.status}
                    </span>
                    <span className="badge badge-primary">
                      {transaction.transactionType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 text-md-right">
                  <h3 className="text-primary">KES {transaction.amount.toLocaleString()}</h3>
                  <div className="text-muted">
                    {formatDate(transaction.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <FaUser className="mr-2" /> Customer Information
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">Name:</div>
                      <div className="col-sm-8">{transaction.user.name}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">Email:</div>
                      <div className="col-sm-8">
                        <a href={`mailto:${transaction.user.email}`}>{transaction.user.email}</a>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">Phone:</div>
                      <div className="col-sm-8">
                        <a href={`tel:${transaction.user.phoneNumber}`}>{transaction.user.phoneNumber}</a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {transaction.order && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <div className="d-flex align-items-center">
                        <FaFileInvoice className="mr-2" /> Order Information
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Order Number:</div>
                        <div className="col-sm-8">{transaction.order.orderNumber}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Order Date:</div>
                        <div className="col-sm-8">{formatDate(transaction.order.orderDate)}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Status:</div>
                        <div className="col-sm-8">
                          <span className="badge badge-info">{transaction.order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="col-md-6">
                <div className="card mb-4">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <FaCreditCard className="mr-2" /> Payment Details
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">ID:</div>
                      <div className="col-sm-8">{transaction.id}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">Method:</div>
                      <div className="col-sm-8">{transaction.paymentMethod}</div>
                    </div>
                    {transaction.mpesaReceiptId && (
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">M-Pesa Receipt:</div>
                        <div className="col-sm-8">
                          <span className="badge badge-light">{transaction.mpesaReceiptId}</span>
                        </div>
                      </div>
                    )}
                    <div className="row mb-2">
                      <div className="col-sm-4 text-muted">Date:</div>
                      <div className="col-sm-8">{formatDate(transaction.createdAt)}</div>
                    </div>
                    {transaction.updatedAt !== transaction.createdAt && (
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Last Updated:</div>
                        <div className="col-sm-8">{formatDate(transaction.updatedAt)}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                {transaction.wallet && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <div className="d-flex align-items-center">
                        <FaWallet className="mr-2" /> Wallet Information
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Wallet ID:</div>
                        <div className="col-sm-8">{transaction.wallet.id}</div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-4 text-muted">Current Balance:</div>
                        <div className="col-sm-8">KES {transaction.wallet.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {transaction.metaData && (
                  <div className="card mb-4">
                    <div className="card-header">
                      <div className="d-flex align-items-center">
                        <FaFileInvoice className="mr-2" /> Additional Information
                      </div>
                    </div>
                    <div className="card-body">
                      <pre className="transaction-metadata">
                        {JSON.stringify(transaction.metaData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default TransactionViewModal;