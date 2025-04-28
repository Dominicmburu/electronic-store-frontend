import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { Form, Button, Card, Row, Col, Table, Badge, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import { useWallet } from '../../contexts/walletContext';
import LoadingSpinner from '../common/AnimatedLoadingSpinner';
import { motion } from 'framer-motion';

interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  status: string;
  reference: string;
  createdAt: string;
  mpesaReceiptId?: string;
}

const Wallet: React.FC = () => {
  const { profile, token } = useContext(UserContext) || {};
  const { wallet, loading, error, topUpWallet, checkTransactionStatus, refreshWallet, withdrawFunds } = useWallet();
  
  const [amount, setAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawPhone, setWithdrawPhone] = useState<string>("");
  const [topUpLoading, setTopUpLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  
  // Payment modal states
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentStatus, setPaymentStatus] = useState<"processing" | "success" | "failed" | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<"topup" | "withdraw" | "">("");
  const [checkingTransactionStatus, setCheckingTransactionStatus] = useState<boolean>(false);
  
  useEffect(() => {
    const savedPhone = profile?.phoneNumber;
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setWithdrawPhone(savedPhone);
    }
  }, [token, profile]);

  // Transaction status polling effect
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | undefined;
    
    if (transactionId && paymentStatus === "processing") {
      setCheckingTransactionStatus(true);
      
      pollingInterval = setInterval(async () => {
        try {
          if (token) {
            const transaction = await checkTransactionStatus(transactionId);
            
            if (transaction) {
              const { status } = transaction;
              
              console.log("Transaction status:", status);
              
              if (status === 'COMPLETED') {
                setPaymentStatus("success");
                setCheckingTransactionStatus(false);
                
                setTimeout(() => {
                  setShowPaymentModal(false);
                  refreshWallet();
                }, 2000);
                
                if (pollingInterval) {
                  clearInterval(pollingInterval);
                }
              } else if (status === 'FAILED') {
                setPaymentStatus("failed");
                setCheckingTransactionStatus(false);
                if (pollingInterval) {
                  clearInterval(pollingInterval);
                }
              }
              // If status is still "PENDING", continue polling
            }
          }
        } catch (error) {
          console.error("Error checking transaction status:", error);
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [transactionId, paymentStatus, token, refreshWallet]);

  const handleTopUp = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 1) {
      toast.error("Please enter an amount of at least 10");
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setTopUpLoading(true);
    try {
      // Show payment modal and set status
      setTransactionType("topup");
      setPaymentStatus("processing");
      setShowPaymentModal(true);
      
      const transactionId = await topUpWallet(parseFloat(amount), phoneNumber);
      
      if (transactionId) {
        setTransactionId(transactionId);
        toast.info("M-Pesa payment initiated. Please check your phone to complete the payment.");
      } else {
        throw new Error("Failed to initiate payment");
      }
      
      setAmount("");
    } catch (error) {
      console.error("Error topping up wallet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process top-up");
      setPaymentStatus("failed");
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleWithdraw = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) < 1) {
      toast.error("Please enter an amount of at least 10");
      return;
    }
    
    if (wallet && parseFloat(withdrawAmount) > wallet.balance) {
      toast.error("Insufficient funds in your wallet");
      return;
    }
    
    if (!withdrawPhone || withdrawPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setWithdrawLoading(true);
    try {
      // Show payment modal and set status
      setTransactionType("withdraw");
      setPaymentStatus("processing");
      setShowPaymentModal(true);
      
      const transactionId = await withdrawFunds(parseFloat(withdrawAmount), withdrawPhone);
      
      if (transactionId) {
        setTransactionId(transactionId);
        toast.info("Withdrawal request submitted. Please check your phone for confirmation.");
      } else {
        throw new Error("Failed to initiate withdrawal");
      }
      
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing from wallet:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process withdrawal");
      setPaymentStatus("failed");
    } finally {
      setWithdrawLoading(false);
    }
  };
  
  // Handle payment modal close
  const handleClosePaymentModal = () => {
    if (paymentStatus === "processing") {
      // Ask for confirmation before closing if payment is in progress
      if (window.confirm("Are you sure you want to cancel this transaction process?")) {
        setShowPaymentModal(false);
        setPaymentStatus(null);
        setTransactionId(null);
        setCheckingTransactionStatus(false);
      }
    } else {
      setShowPaymentModal(false);
      setPaymentStatus(null);
      setTransactionId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatTransactionType = (type: string): string => {
    switch (type) {
      case 'WALLET_TOPUP':
        return 'Top-up';
      case 'WALLET_PAYMENT':
        return 'Payment';
      case 'WALLET_WITHDRAWAL':
        return 'Withdrawal';
      case 'REFUND':
        return 'Refund';
      default:
        return type;
    }
  };
  
  const getTransactionStatusBadge = (status: string): JSX.Element => {
    let variant = '';
    
    switch (status) {
      case 'COMPLETED':
        variant = 'success';
        break;
      case 'PENDING':
        variant = 'warning';
        break;
      case 'FAILED':
        variant = 'danger';
        break;
      default:
        variant = 'secondary';
    }
    
    return <Badge bg={variant}>{status}</Badge>;
  };

  if (loading && !wallet) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h5 className="mt-4">My Wallet</h5>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Current Balance</Card.Title>
              <motion.h2 
                className="text-primary"
                key={wallet?.balance || 0} // Re-render when balance changes
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                KSh {wallet?.balance?.toLocaleString() || "0"}
              </motion.h2>
              <Button 
                variant="outline-primary"
                size="sm"
                className="mt-3"
                onClick={refreshWallet}
                disabled={loading}
              >
                <i className="bi bi-arrow-repeat me-1"></i> Refresh
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="tab" href="#topup">Top Up</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="tab" href="#withdraw">Withdraw</a>
                </li>
              </ul>
            </Card.Header>
            <Card.Body>
              <div className="tab-content">
                {/* Top Up Tab */}
                <div className="tab-pane fade show active" id="topup">
                  <Form onSubmit={handleTopUp}>
                    <Form.Group className="mb-3" controlId="topupAmount">
                      <Form.Label>Amount (KSh)</Form.Label>
                      <Form.Control
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        required
                      />
                      <Form.Text className="text-muted">
                        Minimum amount: KSh 10
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="topupPhone">
                      <Form.Label>M-Pesa Phone Number</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="07XXXXXXXX"
                          required
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Enter the phone number registered with M-Pesa
                      </Form.Text>
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={topUpLoading || loading}
                    >
                      {topUpLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cash-coin me-2"></i> Top Up via M-Pesa
                        </>
                      )}
                    </Button>
                  </Form>
                </div>
                
                <div className="tab-pane fade" id="withdraw">
                  <Form onSubmit={handleWithdraw}>
                    <Form.Group className="mb-3" controlId="withdrawAmount">
                      <Form.Label>Amount (KSh)</Form.Label>
                      <Form.Control
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        max={wallet?.balance?.toString() || "0"}
                        required
                      />
                      <Form.Text className="text-muted">
                        Available balance: KSh {wallet?.balance?.toLocaleString() || "0"}
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="withdrawPhone">
                      <Form.Label>M-Pesa Phone Number</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          value={withdrawPhone}
                          onChange={(e) => setWithdrawPhone(e.target.value)}
                          placeholder="07XXXXXXXX"
                          required
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Enter the phone number registered with M-Pesa to receive funds
                      </Form.Text>
                    </Form.Group>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={withdrawLoading || loading || !wallet || wallet.balance <= 0}
                    >
                      {withdrawLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cash-stack me-2"></i> Withdraw to M-Pesa
                        </>
                      )}
                    </Button>
                  </Form>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        
      {/* Transaction History */}
      <Card className="mt-4">
        <Card.Header>
          <h5 className="mb-0">Transaction History</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {wallet?.lastTransactions && wallet.lastTransactions.length > 0 ? (
            <div className="table-responsive">
              <Table striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {wallet.lastTransactions.map((transaction: Transaction) => (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.createdAt)}</td>
                      <td>{formatTransactionType(transaction.transactionType)}</td>
                      <td className={
                        transaction.transactionType === 'WALLET_PAYMENT' || 
                        transaction.transactionType === 'WALLET_WITHDRAWAL' 
                          ? 'text-danger' 
                          : 'text-success'
                      }>
                        {
                          transaction.transactionType === 'WALLET_PAYMENT' || 
                          transaction.transactionType === 'WALLET_WITHDRAWAL'
                            ? '-' 
                            : '+'
                        } KSh {transaction.amount.toLocaleString()}
                      </td>
                      <td>{getTransactionStatusBadge(transaction.status)}</td>
                      <td>
                        <small className="text-muted">{transaction.reference}</small>
                        {transaction.mpesaReceiptId && (
                          <div><small className="text-primary">{transaction.mpesaReceiptId}</small></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-clock-history" style={{ fontSize: "2rem" }}></i>
              <p className="mt-3">No transaction history yet</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Payment Processing Modal */}
      <Modal
        show={showPaymentModal}
        onHide={handleClosePaymentModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {paymentStatus === "processing" 
              ? `Processing ${transactionType === "topup" ? "Top-up" : "Withdrawal"}`
              : paymentStatus === "success" 
                ? `${transactionType === "topup" ? "Top-up" : "Withdrawal"} Successful` 
                : `${transactionType === "topup" ? "Top-up" : "Withdrawal"} Failed`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentStatus === "processing" && (
            <div className="text-center py-3">
              <LoadingSpinner size="md" />
              <h5 className="mt-3">
                {transactionType === "topup" 
                  ? "Processing Top-up Payment" 
                  : "Processing Withdrawal Request"}
              </h5>
              {transactionType === "topup" ? (
                <>
                  <p className="text-muted">
                    Please check your phone for the M-Pesa prompt and enter your PIN to complete the payment.
                  </p>
                  <p className="mb-2">
                    Phone: <span className="fw-bold">{phoneNumber}</span>
                  </p>
                </>
              ) : (
                <p className="text-muted">
                  Your withdrawal request is being processed. Please wait for a confirmation on your phone.
                </p>
              )}
              {checkingTransactionStatus && (
                <div className="alert alert-info py-2 small">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Checking transaction status... Please wait.
                </div>
              )}
              <p className="mb-0 small">
                Amount: <span className="fw-bold">KSh {
                  transactionType === "topup" 
                    ? parseFloat(amount || "0").toLocaleString()
                    : parseFloat(withdrawAmount || "0").toLocaleString()
                }</span>
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="text-center py-3">
              <div className="text-success mb-3">
                <i className="bi bi-check-circle" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5>
                {transactionType === "topup" 
                  ? "Top-up Successful!" 
                  : "Withdrawal Request Successful!"}
              </h5>
              <p className="text-muted">
                {transactionType === "topup"
                  ? "Your wallet has been topped up successfully."
                  : "Your withdrawal request has been processed successfully."}
              </p>
              
              <div className="alert alert-success py-2 mt-3">
                <i className="bi bi-shield-check me-2"></i>
                Transaction completed
              </div>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="text-center py-3">
              <div className="text-danger mb-3">
                <i className="bi bi-x-circle" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5>
                {transactionType === "topup" 
                  ? "Top-up Failed" 
                  : "Withdrawal Request Failed"}
              </h5>
              <p className="text-muted">There was an issue processing your request. Please try again.</p>
              
              <div className="alert alert-danger py-2 mt-3">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Transaction was not completed
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {paymentStatus === "processing" && (
            <Button 
              variant="secondary" 
              onClick={handleClosePaymentModal}
              disabled={checkingTransactionStatus}
            >
              {checkingTransactionStatus ? "Please wait..." : "Cancel"}
            </Button>
          )}

          {paymentStatus === "success" && (
            <Button variant="primary" onClick={handleClosePaymentModal}>
              Continue
            </Button>
          )}

          {paymentStatus === "failed" && (
            <>
              <Button variant="secondary" onClick={handleClosePaymentModal}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={(e) => {
                  e.preventDefault();
                  handleClosePaymentModal();
                  if (transactionType === "topup") {
                    const formEvent = { preventDefault: () => {} } as React.FormEvent;
                    handleTopUp(formEvent);
                  } else {
                    const formEvent = { preventDefault: () => {} } as React.FormEvent;
                    handleWithdraw(formEvent);
                  }
                }}
              >
                Try Again
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Wallet;