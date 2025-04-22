import React, { useState } from 'react';
import { Transaction } from '../Services/TransactionService';
import '../../../styles/Admin/RefundRequestModal.css';

interface RefundRequestModalProps {
  transaction: Transaction;
  onSubmit: (reason: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const RefundRequestModal: React.FC<RefundRequestModalProps> = ({ 
  transaction, 
  onSubmit, 
  onCancel,
  isSubmitting
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for the refund');
      return;
    }
    
    onSubmit(reason);
  };

  const formatAmount = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request Refund</h5>
            <button type="button" className="close" onClick={onCancel} disabled={isSubmitting}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="alert alert-info">
                <div className="d-flex">
                  <i className="material-icons mr-2">info</i>
                  <div>
                    You are requesting a refund for transaction #{transaction.id} of 
                    <strong> {formatAmount(transaction.amount)}</strong>.
                  </div>
                </div>
              </div>
              
              <div className="transaction-summary mb-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item">
                      <label>Customer:</label>
                      <div>{transaction.user.name}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label>Reference:</label>
                      <div>{transaction.reference}</div>
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="info-item">
                      <label>Date:</label>
                      <div>{new Date(transaction.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label>Method:</label>
                      <div>{transaction.paymentMethod}</div>
                    </div>
                  </div>
                </div>
                {transaction.order && (
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <div className="info-item">
                        <label>Order ID:</label>
                        <div>{transaction.order.id}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="info-item">
                        <label>Order Number:</label>
                        <div>{transaction.order.orderNumber}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="refundReason">Reason for Refund <span className="text-danger">*</span></label>
                <textarea
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="refundReason"
                  rows={4}
                  placeholder="Please explain why this transaction needs to be refunded..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) {
                      setError('');
                    }
                  }}
                  disabled={isSubmitting}
                  required
                ></textarea>
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              
              <div className="alert alert-warning mt-3">
                <div className="d-flex">
                  <i className="material-icons mr-2">warning</i>
                  <div>
                    <strong>Important:</strong> Refunds may take 3-7 business days to process 
                    depending on the payment method and bank processing times.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Submit Refund Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RefundRequestModal;