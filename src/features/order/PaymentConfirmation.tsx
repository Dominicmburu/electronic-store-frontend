// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import Layout from '../components/Layout';
// import { useOrder } from '../../contexts/UserContext';
// import { useWallet } from '../../contexts/WalletContext';
// import { Button, Card, Spinner } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import LoadingSpinner from '../../components/common/AnimatedLoadingSpinner';

// const PaymentConfirmation: React.FC = () => {
//   const { orderNumber, transactionId } = useParams<{ orderNumber: string; transactionId: string }>();
//   const { getOrderDetails, loading: orderLoading } = useOrder();
//   const { checkTransactionStatus, getTransactionDetails, loading: walletLoading } = useWallet();
//   const navigate = useNavigate();

//   const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);
//   const [pollCount, setPollCount] = useState<number>(0);
//   const [transactionStatus, setTransactionStatus] = useState<string>('PENDING');
//   const [checking, setChecking] = useState<boolean>(false);
//   const [order, setOrder] = useState<any>(null);

//   useEffect(() => {
//     // Fetch order details
//     const fetchOrder = async () => {
//       if (orderNumber) {
//         const orderData = await getOrderDetails(orderNumber);
//         if (orderData) {
//           setOrder(orderData);
//         }
//       }
//     };

//     fetchOrder();

//     // Start polling for transaction status
//     if (transactionId) {
//       startPolling();
//     }

//     // Cleanup
//     return () => {
//       if (pollInterval) {
//         clearInterval(pollInterval);
//       }
//     };
//   }, [orderNumber, transactionId]);

//   const startPolling = () => {
//     // Clear any existing interval
//     if (pollInterval) {
//       clearInterval(pollInterval);
//     }

//     // Start a new poll
//     const interval = setInterval(async () => {
//       await checkStatus();
//       setPollCount((prevCount) => {
//         const newCount = prevCount + 1;
//         // Stop polling after 24 attempts (2 minutes)
//         if (newCount >= 24) {
//           if (interval) {
//             clearInterval(interval);
//           }
//         }
//         return newCount;
//       });
//     }, 5000); // Poll every 5 seconds

//     setPollInterval(interval);
//   };

//   const checkStatus = async () => {
//     if (!transactionId) return;
    
//     setChecking(true);
//     try {
//       // Get transaction details
//       const transaction = await getTransactionDetails(transactionId);
      
//       if (transaction) {
//         setTransactionStatus(transaction.status);
        
//         // If completed, navigate to success page
//         if (transaction.status === 'COMPLETED') {
//           if (pollInterval) {
//             clearInterval(pollInterval);
//           }
          
//           toast.success('Payment completed successfully!');
//           navigate(`/order-confirmation/${orderNumber}`);
//         }
        
//         // If failed, show error
//         if (transaction.status === 'FAILED') {
//           if (pollInterval) {
//             clearInterval(pollInterval);
//           }
          
//           toast.error('Payment failed. Please try again.');
//         }
//       }
//     } catch (error) {
//       console.error('Error checking transaction status:', error);
//     } finally {
//       setChecking(false);
//     }
//   };

//   const handleManualCheck = () => {
//     checkStatus();
//   };

//   const handleTryAgain = () => {
//     if (order) {
//       navigate(`/checkout`);
//     }
//   };

//   if (orderLoading) {
//     return (
//       <Layout>
//         <div className="container my-5 text-center">
//           <LoadingSpinner />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="container my-5">
//         <Card className="text-center">
//           <Card.Header>
//             <h3>Payment Processing</h3>
//           </Card.Header>
//           <Card.Body className="py-5">
//             {transactionStatus === 'PENDING' && (
//               <>
//                 <div className="mb-4">
//                   <Spinner animation="border" variant="primary" />
//                 </div>
//                 <h4 className="mb-3">Your M-Pesa payment is being processed</h4>
//                 <p className="mb-3">
//                   Please check your phone and complete the payment by entering your M-Pesa PIN.
//                 </p>
//                 <p className="text-muted mb-4">
//                   This page will automatically update when your payment is confirmed.
//                 </p>
//                 {pollCount >= 24 && (
//                   <div className="alert alert-warning">
//                     It's taking longer than expected. If you've already completed the payment,
//                     please check the status manually.
//                   </div>
//                 )}
//                 <Button 
//                   variant="outline-primary" 
//                   onClick={handleManualCheck}
//                   disabled={checking}
//                 >
//                   {checking ? (
//                     <>
//                       <Spinner animation="border" size="sm" className="me-2" />
//                       Checking...
//                     </>
//                   ) : (
//                     'Check Payment Status'
//                   )}
//                 </Button>
//               </>
//             )}

//             {transactionStatus === 'FAILED' && (
//               <>
//                 <div className="mb-4 text-danger">
//                   <i className="bi bi-x-circle" style={{ fontSize: '3rem' }}></i>
//                 </div>
//                 <h4 className="mb-3">Payment Failed</h4>
//                 <p className="mb-4">
//                   We couldn't process your M-Pesa payment. This could be due to insufficient funds,
//                   wrong PIN, or a network issue.
//                 </p>
//                 <div className="d-flex justify-content-center gap-3">
//                   <Button variant="primary" onClick={handleTryAgain}>
//                     Try Again
//                   </Button>
//                   <Button variant="outline-secondary" onClick={() => navigate('/orders')}>
//                     View Orders
//                   </Button>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//           <Card.Footer className="text-muted">
//             Order #: {orderNumber}
//           </Card.Footer>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default PaymentConfirmation;