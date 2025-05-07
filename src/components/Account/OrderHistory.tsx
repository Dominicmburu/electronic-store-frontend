import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { useOrder, Order } from '../../contexts/orderContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const OrderHistory: React.FC = () => {
    const { cancelOrder, requestRefund, getUserOrders, orders } = useOrder();
    const navigate = useNavigate();

    const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');
    const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
    const [refundReason, setRefundReason] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    // const [setReviewOrderId] = useState<number | null>(null);

    useEffect(() => {
        getUserOrders();
    }, [getUserOrders]);



    // Handle order cancellation
    const handleCancelOrder = async (): Promise<void> => {
        setLoading(true);
        try {
            await cancelOrder(selectedOrderNumber);
            toast.success('Order cancelled successfully');
            setShowCancelModal(false);
            getUserOrders(); // Refresh order list
        } catch (error) {
            toast.error('Failed to cancel order');
        } finally {
            setLoading(false);
        }
    };

    // Handle refund request
    const handleRefundRequest = async (): Promise<void> => {
        if (!refundReason.trim()) {
            toast.error('Please provide a reason for the refund');
            return;
        }

        setLoading(true);
        try {
            if (selectedOrderId !== null) {
                await requestRefund(selectedOrderId, refundReason);
                toast.success('Refund request submitted successfully');
                setShowRefundModal(false);
                setRefundReason('');
                getUserOrders(); // Refresh order list
            }
        } catch (error) {
            toast.error('Failed to request refund');
        } finally {
            setLoading(false);
        }
    };

    // Submit review function (placeholder - to be implemented)
    const handleSubmitReview = async (): Promise<void> => {
        // This would be implemented to submit a review
        toast.success('Review submitted successfully');
        setShowReviewModal(false);
        getUserOrders();
    };

    // Get status badge based on order status
    const getStatusBadge = (status: string): JSX.Element => {
        let variant = 'secondary';
        
        switch (status.toUpperCase()) {
            case 'PENDING':
                variant = 'warning';
                break;
            case 'PROCESSING':
                variant = 'info';
                break;
            case 'SHIPPED':
                variant = 'primary';
                break;
            case 'DELIVERED':
                variant = 'success';
                break;
            case 'CANCELLED':
                variant = 'danger';
                break;
            case 'REFUNDED':
                variant = 'dark';
                break;
            default:
                variant = 'secondary';
        }
        
        return <Badge bg={variant}>{status}</Badge>;
    };

    if (!orders || orders.length === 0) {
        return (
            <>
                <h5 className="mt-4">Order History</h5>
                <div className="text-center py-5 bg-light rounded">
                    <i className="bi bi-receipt" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <p className="mt-3 mb-0">No orders found.</p>
                    <Button 
                        variant="primary" 
                        className="mt-3"
                        onClick={() => navigate('/shop')}
                    >
                        <i className="bi bi-cart-plus me-2"></i>
                        Start Shopping
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <h5 className="mt-4">Order History</h5>
            <div className="table-responsive">
                <Table hover className="align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>#</th>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: Order, index: number) => {
                            // Calculate total amount
                            const totalAmount = order.orderItems.reduce(
                                (sum, item) => sum + (item.price * item.quantity), 
                                0
                            );

                            return (
                                <motion.tr 
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                >
                                    <td>{index + 1}</td>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td>KSh {totalAmount.toLocaleString()}</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <div className="d-flex gap-2 flex-wrap">
                                            {/* View order details button - always visible */}
                                            {/* <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => navigate(`/order/${order.id}`)}
                                            >
                                                <i className="bi bi-eye"></i> Details
                                            </Button> */}

                                            {/* Track order button - not for cancelled/refunded orders */}
                                            {!['CANCELLED', 'REFUNDED'].includes(order.status.toUpperCase()) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => navigate(`/track-order/${order.orderNumber}`)}
                                                >
                                                    <i className="bi bi-geo-alt"></i> Track
                                                </Button>
                                            )}

                                            {/* Cancel button - only for pending/processing orders */}
                                            {['PENDING', 'PROCESSING'].includes(order.status.toUpperCase()) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-danger"
                                                    onClick={() => {
                                                        setSelectedOrderId(order.id);
                                                        setSelectedOrderNumber(order.orderNumber);
                                                        setShowCancelModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle"></i> Cancel
                                                </Button>
                                            )}

                                            {/* Review button - only for delivered orders */}
                                            {order.status.toUpperCase() === 'DELIVERED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-success"
                                                    onClick={() => {
                                                        // setReviewOrderId(order.id);
                                                        setShowReviewModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-star"></i> Review
                                                </Button>
                                            )}

                                            {/* Refund button - only for delivered orders */}
                                            {order.status.toUpperCase() === 'DELIVERED' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-warning"
                                                    onClick={() => {
                                                        setSelectedOrderId(order.id);
                                                        setShowRefundModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-arrow-return-left"></i> Refund
                                                </Button>
                                            )}

                                            {/* Clear/Delete button - only for cancelled/refunded orders */}
                                            {['CANCELLED', 'REFUNDED'].includes(order.status.toUpperCase()) && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-secondary"
                                                    onClick={() => {
                                                        // This would be implemented to remove from history
                                                        toast.info('Order removed from history');
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i> Clear
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {/* Cancel Order Confirmation Modal */}
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-4">Are you sure you want to cancel this order? This action cannot be undone.</p>
                    <div className="alert alert-warning">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        If you've already made a payment, the refund will be processed according to our refund policy.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                        No, Keep Order
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleCancelOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cancelling...</>
                        ) : (
                            <>Yes, Cancel Order</>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Refund Request Modal */}
            <Modal show={showRefundModal} onHide={() => setShowRefundModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Request Refund</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Reason for Refund</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Please provide details about why you're requesting a refund..."
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                    <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        Refunds are processed within 7-14 business days after approval. For printer returns, please ensure the item is in its original condition.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRefundModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleRefundRequest}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
                        ) : (
                            <>Submit Request</>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Review Modal */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Leave a Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <div className="d-flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i 
                                        key={star} 
                                        className="bi bi-star-fill text-warning me-2" 
                                        style={{ fontSize: '2rem', cursor: 'pointer' }}
                                    ></i>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Your Review</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                placeholder="Share your experience with this product..."
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitReview}
                    >
                        Submit Review
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default OrderHistory;