import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../styles/Track/TrackOrder.module.css';
import { UserContext } from '../contexts/UserContext'; 
import { fetchOrderDetails } from '../contexts/orderHelper'; 

const TrackOrder: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(UserContext) || {}; 

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) {
          throw new Error('No token found. Please log in.');
        }

        const data = await fetchOrderDetails(orderNumber!); // Fetch order details
        setOrderDetails(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order details. Please try again.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4">Track Your Order</h2>

        <div className={styles.trackOrderContainer}>
          <form id="track-order-form" className={styles.trackOrderForm}>
            <div className="mb-3">
              <label htmlFor="order-number" className="form-label">
                Order Number
              </label>
              <input
                type="text"
                className="form-control"
                id="order-number"
                placeholder="Enter your order number"
                value={orderNumber}
                readOnly
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search" /> Track Order
            </button>
          </form>

          {orderDetails && (
            <div className={styles.orderStatus} id="order-status">
              <h4>Order Status</h4>

              <div className={styles.orderProgress}>
                {orderDetails.statusHistory.map((status: any) => (
                  <div
                    key={status.id}
                    className={status.status === orderDetails.status ? 'current' : 'pending'}
                  >
                    <span>{status.status}</span>
                    <small>{new Date(status.updatedAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>

              <div className={styles.orderDetails}>
                <h5>Order Details</h5>
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <th>Order Number</th>
                      <td id="detail-order-number">{orderDetails.orderNumber}</td>
                    </tr>
                    <tr>
                      <th>Order Date</th>
                      <td id="detail-order-date">
                        {new Date(orderDetails.orderDate).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr>
                      <th>Customer Name</th>
                      <td id="detail-customer-name">{orderDetails.customerName}</td>
                    </tr>
                    <tr>
                      <th>Shipping Address</th>
                      <td id="detail-shipping-address">{orderDetails.shippingAddress}</td>
                    </tr>
                    <tr>
                      <th>Payment Method</th>
                      <td id="detail-payment-method">{orderDetails.paymentMethod}</td>
                    </tr>
                  </tbody>
                </table>

                <h5>Items Ordered</h5>
                <div className="table-responsive">
                  <table className={`table table-bordered ${styles.orderItemsTable}`}>
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody id="order-items">
                      {orderDetails.items?.map((item: any) => (
                        <tr key={item.id}>
                          <td>{item.product}</td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>KSh {item.price.toFixed(2)}</td>
                          <td>KSh {(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-end">
                  <h5>
                    Total: KSh <span id="order-total">{orderDetails.total?.toFixed(2)}</span>
                  </h5>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;