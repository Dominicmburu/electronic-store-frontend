import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';
import { useWallet } from '../../contexts/walletContext';

const Wallet = () => {
  const { profile } = useContext(UserContext) || {};
  const { wallet, loading, error, topUpWallet, checkTransactionStatus, refreshWallet, withdrawFunds } = useWallet();
  
  const [amount, setAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [withdrawPhone, setWithdrawPhone] = useState<string>("");
  const [topUpLoading, setTopUpLoading] = useState<boolean>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<boolean>(false);
  
  useEffect(() => {
    const savedPhone = localStorage.getItem('mpesaPhoneNumber');
    if (savedPhone) {
      setPhoneNumber(savedPhone);
      setWithdrawPhone(savedPhone);
    }
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      toast.error("Please enter an amount of at least 10");
      return;
    }
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setTopUpLoading(true);
    try {
      // Save phone number for future use
      localStorage.setItem('mpesaPhoneNumber', phoneNumber);
      
      // Initiate top-up
      const transactionId = await topUpWallet(parseFloat(amount), phoneNumber);
      
      if (transactionId) {
        // Start polling for transaction status
        startPollingTransactionStatus(transactionId);
      }
      
      // Clear amount
      setAmount("");
    } catch (error: any) {
      console.error("Error topping up wallet:", error);
      toast.error(error.message || "Failed to process top-up");
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) < 10) {
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
      // Save phone number for future use
      localStorage.setItem('mpesaPhoneNumber', withdrawPhone);
      
      // Initiate withdrawal
      const transactionId = await withdrawFunds(parseFloat(withdrawAmount), withdrawPhone);
      
      if (transactionId) {
        toast.success("Withdrawal request submitted successfully!");
        // Start polling for transaction status
        startPollingTransactionStatus(transactionId);
      }
      
      // Clear amount
      setWithdrawAmount("");
    } catch (error: any) {
      console.error("Error withdrawing from wallet:", error);
      toast.error(error.message || "Failed to process withdrawal");
    } finally {
      setWithdrawLoading(false);
    }
  };
  
  const startPollingTransactionStatus = (transactionId: string) => {
    // Poll every 5 seconds for up to 2 minutes
    let attempts = 0;
    const maxAttempts = 24;
    
    const pollInterval = setInterval(async () => {
      try {
        await checkTransactionStatus(transactionId);
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        clearInterval(pollInterval);
      }
    }, 5000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatTransactionType = (type: string) => {
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
  
  const getTransactionStatusBadge = (status: string) => {
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
        {/* Balance Card */}
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Current Balance</Card.Title>
              <h2 className="text-primary">
                KSh {wallet?.balance?.toLocaleString() || "0"}
              </h2>
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
        
        {/* Transactions Column */}
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
                        min="10"
                        required
                      />
                      <Form.Text className="text-muted">
                        Minimum amount: KSh 10
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="topupPhone">
                      <Form.Label>M-Pesa Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">+254</span>
                        <Form.Control
                          type="text"
                          value={phoneNumber.startsWith('+254') ? phoneNumber.substring(4) : 
                                 phoneNumber.startsWith('254') ? phoneNumber.substring(3) : 
                                 phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="7XXXXXXXX"
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
                
                {/* Withdraw Tab */}
                <div className="tab-pane fade" id="withdraw">
                  <Form onSubmit={handleWithdraw}>
                    <Form.Group className="mb-3" controlId="withdrawAmount">
                      <Form.Label>Amount (KSh)</Form.Label>
                      <Form.Control
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="10"
                        max={wallet?.balance.toString() || "0"}
                        required
                      />
                      <Form.Text className="text-muted">
                        Available balance: KSh {wallet?.balance.toLocaleString() || "0"}
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="withdrawPhone">
                      <Form.Label>M-Pesa Phone Number</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">+254</span>
                        <Form.Control
                          type="text"
                          value={withdrawPhone.startsWith('+254') ? withdrawPhone.substring(4) : 
                                 withdrawPhone.startsWith('254') ? withdrawPhone.substring(3) : 
                                 withdrawPhone.startsWith('0') ? withdrawPhone.substring(1) : withdrawPhone}
                          onChange={(e) => setWithdrawPhone(e.target.value)}
                          placeholder="7XXXXXXXX"
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
                  {wallet.lastTransactions.map((transaction) => (
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
    </>
  );
};

export default Wallet;