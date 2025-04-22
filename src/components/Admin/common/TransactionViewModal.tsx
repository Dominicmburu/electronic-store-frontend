import React, { useState, useEffect } from 'react';
import { Transaction } from '../Services/PaymentService';
import '../../../styles/Admin/TransactionViewModal.css';

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Transaction Details</h5>
            <button type="button" className="close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="transaction-status-banner bg-light-${getStatusClass(transaction.status)} mb-4">
              <div className="d-flex align-items-center">
                <div className="transaction-status-icon bg-${getStatusClass(transaction.status)}">
                  {transaction.status === 'completed' && <i className="material-icons">check</i>}
                  {transaction.status === 'pending' && <i className="material-icons">hourglass_empty</i>}
                  {transaction.status === 'failed' && <i className="material-icons">error</i>}
                  {transaction.status === 'refunded' && <i className="material-icons">reply</i>}
                </div>
                <div className="ml-3">
                  <h6 className="mb-0">Transaction {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</h6>
                  <small className="text-muted">{formatDate(transaction.date)}</small>
                </div>
              </div>
            </div>

            <div className="transaction-info">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Transaction ID</label>
                    <div className="value">{transaction.id}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-group">
                    <label>MPesa Receipt</label>
                    <div className="value">{transaction.receiptNumber || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Amount</label>
                    <div className="value font-weight-bold">KES {transaction.amount.toLocaleString()}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Payment Method</label>
                    <div className="value">{transaction.method}</div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Customer</label>
                    <div className="value">
                      <a href={`/customers/${transaction.customerId}`} className="text-primary">
                        {transaction.customerName}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Phone Number</label>
                    <div className="value">{transaction.phoneNumber || '-'}</div>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Order ID</label>
                    <div className="value">
                      <a href={`/orders/${transaction.orderId}`} className="text-primary">
                        {transaction.orderId}
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-group">
                    <label>Transaction Reference</label>
                    <div className="value">{transaction.transactionId}</div>
                  </div>
                </div>
              </div>

              {transaction.status === 'refunded' && transaction.refundReason && (
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="info-group">
                      <label>Refund Reason</label>
                      <div className="value">{transaction.refundReason}</div>
                    </div>
                  </div>
                </div>
              )}

              {(transaction.merchantRequestId || transaction.checkoutRequestId) && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Merchant Request ID</label>
                      <div className="value small">{transaction.merchantRequestId || '-'}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-group">
                      <label>Checkout Request ID</label>
                      <div className="value small">{transaction.checkoutRequestId || '-'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionViewModal;