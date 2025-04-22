import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import Layout from '../../components/Layout';
import { useOrder, Order } from '../../contexts/orderContext';
import LoadingSpinner from '../../components/common/AnimatedLoadingSpinner';

const OrderConfirmation: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { getOrderDetails, loading } = useOrder();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (orderNumber) {
        const orderData = await getOrderDetails(orderNumber);
        if (orderData) {
          setOrder(orderData);
        }
      }
    };
    
    fetchOrder();
  }, [orderNumber, getOrderDetails]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container my-5 text-center">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container my-5">
          <Card className="text-center">
            <Card.Body className="py-5">
              <div className="mb-4 text-danger">
                <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="mb-3">Order Not Found</h4>
              <p className="mb-4">
                We couldn't find the order you're looking for. It may have been cancelled or doesn't exist.
              </p>
              <Button variant="primary" onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
            </Card.Body>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // Calculate order total
  const orderTotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <Layout>
      <div className="container my-5">
        <Card>
          <Card.Header className="bg-success text-white text-center">
            <div className="mb-3">
              <i className="bi bi-check-circle" style={{ fontSize: '3rem' }}></i>
            </div>
            <h3>Order Confirmed!</h3>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="row mb-4">
              <div className="col-md-6">
                <h5>Order Details</h5>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Status:</strong> <span className="badge bg-primary">{order.status}</span></p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              </div>
              <div className="col-md-6">
                <h5>Shipping Information</h5>
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              </div>
            </div>
            
            <h5>Order Summary</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.product.images && item.product.images[0] && (
                            <img
                              src={`/assets/${item.product.images[0]}`}
                              alt={item.product.name}
                              className="img-thumbnail me-2"
                              style={{ maxWidth: '50px' }}
                            />
                          )}
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td className="text-end">KSh {item.price.toLocaleString()}</td>
                      <td className="text-end">KSh {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                    <td className="text-end"><strong>KSh {orderTotal.toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="alert alert-info mt-4">
              <i className="bi bi-info-circle me-2"></i>
              Thank you for your order! You will receive an email confirmation shortly. 
              You can track your order status in the "My Orders" section.
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button variant="outline-secondary" onClick={() => navigate('/orders')}>
              View My Orders
            </Button>
            <Button variant="primary" onClick={() => navigate('/shop')}>
              Continue Shopping
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;