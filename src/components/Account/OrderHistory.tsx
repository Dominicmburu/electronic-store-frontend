import { useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const { profile } = useContext(UserContext) || {};
    const navigate = useNavigate();

    if (!profile || !profile.orders || profile.orders.length === 0) {
        return (
            <>
                <h5 className="mt-4">Order History</h5>
                <p>No orders found.</p>
            </>
        );
    }

    return (
        <>
            <h5 className="mt-4">Order History</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order Number</th>
                        <th>Date</th>
                        <th>Shipping Address</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {profile.orders.map((order, index) => (
                        <tr key={order.id}>
                            <td>{index + 1}</td>
                            <td>{order.orderNumber}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.shippingAddress}</td>
                            <td>{order.paymentMethod}</td>
                            <td>{order.status}</td>
                            <td>
                                <Button
                                    size="sm"
                                    variant="info"
                                    onClick={() => navigate(`/track-order/${order.orderNumber}`)}
                                >
                                    <i className="bi bi-eye"></i> Track Order
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default OrderHistory;