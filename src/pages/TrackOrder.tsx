import React from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Track/TrackOrder.module.css';

const TrackOrder: React.FC = () => {
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
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="order-email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="order-email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-search" /> Track Order
            </button>
          </form>

          <div className={styles.orderStatus} id="order-status" style={{ display: 'none' }}>
            <h4>Order Status</h4>

            <div className={styles.orderProgress}>
              <div className="completed">
                <span>Order Placed</span>
              </div>
              <div className="current">
                <span>Processing</span>
              </div>
              <div className="pending">
                <span>Shipped</span>
              </div>
              <div className="pending">
                <span>Delivered</span>
              </div>
            </div>

            <div className={styles.orderDetails}>
              <h5>Order Details</h5>
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <th>Order Number</th>
                    <td id="detail-order-number">#123456</td>
                  </tr>
                  <tr>
                    <th>Order Date</th>
                    <td id="detail-order-date">October 24, 2024</td>
                  </tr>
                  <tr>
                    <th>Customer Name</th>
                    <td id="detail-customer-name">John Doe</td>
                  </tr>
                  <tr>
                    <th>Shipping Address</th>
                    <td id="detail-shipping-address">123 Main Street, Nairobi, Kenya</td>
                  </tr>
                  <tr>
                    <th>Payment Method</th>
                    <td id="detail-payment-method">Credit Card</td>
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
                    {/* Order items will be inserted here dynamically */}
                  </tbody>
                </table>
              </div>
              <div className="text-end">
                <h5>
                  Total: KSh <span id="order-total">0.00</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
