import React, { useState } from 'react';
import { Transaction } from '../Services/PaymentService';

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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for the refund request');
      return;
    }
    
    onSubmit(reason);
  };

  return (
    <div className="modal fade show" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Request Refund</h5>
            <button 
              type="button" 
              className="close" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <span>&times;</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="refund-details mb-4">
                <h6>Transaction Details</h6>
                <div className="row mb-2">
                  <div className="col-5">Reference:</div>
                  <div className="col-7"><strong>{transaction.reference}</strong></div>
                </div>
                <div className="row mb-2">
                  <div className="col-5">Amount:</div>
                  <div className="col-7"><strong>KES {transaction.amount.toLocaleString()}</strong></div>
                </div>
                <div className="row mb-2">
                  <div className="col-5">Payment Method:</div>
                  <div className="col-7"><strong>{transaction.paymentMethod}</strong></div>
                </div>
                <div className="row mb-2">
                  <div className="col-5">Customer:</div>
                  <div className="col-7"><strong>{transaction.user.name}</strong></div>
                </div>
                {transaction.mpesaReceiptId && (
                  <div className="row mb-2">
                    <div className="col-5">M-Pesa Receipt:</div>
                    <div className="col-7"><strong>{transaction.mpesaReceiptId}</strong></div>
                  </div>
                )}
                {transaction.order && (
                  <div className="row mb-2">
                    <div className="col-5">Order Number:</div>
                    <div className="col-7"><strong>{transaction.order.orderNumber}</strong></div>
                  </div>
                )}
              </div>
              
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              <div className="form-group">
                <label htmlFor="refundReason">Reason for Refund</label>
                <textarea
                  id="refundReason"
                  className="form-control"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Please provide a detailed reason for the refund..."
                  disabled={isSubmitting}
                />
                <small className="form-text text-muted">
                  This information will be used for record keeping and may be shared with the customer.
                </small>
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
                ) : 'Submit Refund Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </div>
  );
};

export default RefundRequestModal;