import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import LoadingSpinner from "../common/AnimatedLoadingSpinner";
// import style from "./PaymentModal.module.css"; // Assuming you have a CSS module for styles

interface PaymentModalProps {
  show: boolean;
  onHide: () => void;
  status: "processing" | "success" | "failed" | null;
  paymentMethod: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  show,
  onHide,
  status,
  paymentMethod,
}) => {
  // Animation states
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showCross, setShowCross] = useState(false);

  useEffect(() => {
    if (status === "success") {
      setShowCheckmark(true);
    } else if (status === "failed") {
      setShowCross(true);
    } else {
      setShowCheckmark(false);
      setShowCross(false);
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case "processing":
        return (
          <div className="text-center py-4">
            <div className="mb-4">
              <LoadingSpinner size="lg" color="primary" />
            </div>
            <h4>Processing Payment</h4>
            <p className="text-muted">
              {paymentMethod === "MPESA"
                ? "Please check your phone and enter your M-Pesa PIN when prompted."
                : "We're processing your payment. Please wait..."}
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center py-4">
            <div className="mb-4">
              <div className={`success-checkmark ${showCheckmark ? "animate" : ""}`}>
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            <h4>Payment Successful!</h4>
            <p className="text-muted">
              Your payment has been processed successfully.
              {paymentMethod === "MPESA"
                ? " You will receive an M-Pesa confirmation message shortly."
                : " Your order will be processed immediately."}
            </p>
          </div>
        );
      case "failed":
        return (
          <div className="text-center py-4">
            <div className="mb-4">
              <div className={`error-cross ${showCross ? "animate" : ""}`}>
                <div className="cross-icon">
                  <span className="icon-line line-left"></span>
                  <span className="icon-line line-right"></span>
                </div>
              </div>
            </div>
            <h4>Payment Failed</h4>
            <p className="text-muted">
              {paymentMethod === "MPESA"
                ? "We couldn't process your M-Pesa payment. Please ensure you have sufficient funds and try again."
                : "We couldn't process your payment. Please try again or use a different payment method."}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={show}
      onHide={status !== "processing" ? onHide : undefined}
      backdrop={status === "processing" ? "static" : true}
      keyboard={status !== "processing"}
      centered
      className="payment-modal"
    >
      <Modal.Header closeButton={status !== "processing"}>
        <Modal.Title>
          {status === "processing"
            ? "Processing Payment"
            : status === "success"
            ? "Payment Successful"
            : "Payment Failed"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{renderContent()}</Modal.Body>
      <Modal.Footer>
        {status !== "processing" && (
          <Button variant="primary" onClick={onHide}>
            {status === "success" ? "Continue" : "Try Again"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentModal;