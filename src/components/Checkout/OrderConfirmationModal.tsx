import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface OrderConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  cart: any;
  subtotal: number;
  tax: number;
  total: number;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  show,
  onHide,
  onConfirm,
  isProcessing,
  cart,
  subtotal,
  tax,
  total
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={!isProcessing}
      className="order-confirmation-modal"
    >
      <div className="modal-header-custom">
        <h4 className="modal-title">
          <i className="bi bi-bag-check me-2"></i>
          Confirm Your Order
        </h4>
        {!isProcessing && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onHide}
            aria-label="Close"
          ></button>
        )}
      </div>
      
      <Modal.Body className="p-4">
        <div className="confirmation-content">
          <div className="animated-shopping-cart mb-4 text-center">
            <div className="cart-icon">
              <i className="bi bi-cart3"></i>
              <span className="cart-item-count">{cart?.items.length || 0}</span>
            </div>
          </div>
          
          <p className="confirmation-message">
            You're about to place an order with the following items:
          </p>
          
          <div className="order-items-list">
            {cart?.items.map((item: any) => (
              <div key={item.id} className="order-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="item-details d-flex align-items-center">
                    <div className="item-image me-3">
                      <img 
                        src={`/assets/${item.product.images[0]}`} 
                        alt={item.product.name}
                        className="img-fluid rounded"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="item-name">
                      <span className="item-title">{item.product.name}</span>
                      <span className="item-quantity text-muted ms-2">x{item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-price">
                    KSh {item.subtotal.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary mt-4">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Tax (18%):</span>
              <span>KSh {tax.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between total-row">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-primary">KSh {total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="info-box mt-4">
            <div className="d-flex">
              <div className="info-icon me-3">
                <i className="bi bi-info-circle-fill"></i>
              </div>
              <div className="info-content">
                By clicking "Place Order", your order will be created and you'll proceed to payment selection.
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      
      <div className="modal-footer-custom">
        <Button 
          variant="outline-secondary" 
          onClick={onHide}
          disabled={isProcessing}
          className="btn-cancel"
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={onConfirm}
          disabled={isProcessing}
          className="btn-confirm"
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            <>
              Place Order <i className="bi bi-arrow-right ms-1"></i>
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default OrderConfirmationModal;