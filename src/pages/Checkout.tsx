import React from "react";
import Layout from "../components/Layout";
import styles from "../styles/Cart/Checkout.module.css";

const Checkout: React.FC = () => {
  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4">Checkout</h2>

        <div className={styles.checkoutContainer}>
          <div className="row">
            <div className="col-lg-6">
              <h4 className={styles.formSectionHeader}>Cart Summary</h4>
              <div className="table-responsive">
                <table
                  className={`table table-bordered ${styles.orderSummary}`}
                >
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody id="checkout-cart-items">
                    {/* Dynamically insert cart items here via React state */}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end mb-3">
                <h5>
                  Total: KSh <span id="checkout-cart-total">0.00</span>
                </h5>
              </div>
            </div>

            <div className="col-lg-6">
              <h4 className={styles.formSectionHeader}>Shipping Information</h4>
              <form id="checkout-form">
                <div className="mb-3">
                  <label htmlFor="shipping-name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipping-name"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shipping-address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipping-address"
                    placeholder="Enter your address"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shipping-city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipping-city"
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shipping-state" className="form-label">
                    State/Province
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipping-state"
                    placeholder="Enter your state or province"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shipping-zip" className="form-label">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shipping-zip"
                    placeholder="Enter your ZIP or postal code"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shipping-phone" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="shipping-phone"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="same-as-shipping"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="same-as-shipping"
                  >
                    Billing address is the same as shipping address
                  </label>
                </div>

                <div id="billing-address-section" style={{ display: "none" }}>
                  <h4 className={styles.formSectionHeader}>
                    Billing Information
                  </h4>
                  <div className="mb-3">
                    <label htmlFor="billing-name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="billing-name"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billing-address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="billing-address"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billing-city" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="billing-city"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billing-state" className="form-label">
                      State/Province
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="billing-state"
                      placeholder="Enter your state or province"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="billing-zip" className="form-label">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="billing-zip"
                      placeholder="Enter your ZIP or postal code"
                    />
                  </div>
                </div>

                <h4 className={styles.formSectionHeader}>Payment Method</h4>
                <div className="mb-3">
                  <label className="form-label">Select Payment Method</label>
                  <select className="form-select" id="payment-method" required>
                    <option value="" disabled selected>
                      Select a payment method
                    </option>
                    <option value="credit-card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div id="credit-card-details" style={{ display: "none" }}>
                  <div className="mb-3">
                    <label htmlFor="card-number" className="form-label">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="card-number"
                      placeholder="Enter your card number"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="card-holder" className="form-label">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="card-holder"
                      placeholder="Enter the name on the card"
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="card-expiry" className="form-label">
                        Expiry Date
                      </label>
                      <input
                        type="month"
                        className="form-control"
                        id="card-expiry"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="card-cvv" className="form-label">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="card-cvv"
                        placeholder="Enter CVV"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div id="paypal-details" style={{ display: "none" }}>
                  <p>Please proceed to PayPal to complete your payment.</p>
                </div>

                <h4 className={styles.formSectionHeader}>Order Review</h4>
                <div className="d-flex justify-content-end mb-3">
                  <h5>
                    Total: KSh <span id="checkout-final-total">0.00</span>
                  </h5>
                </div>

                <button
                  type="submit"
                  className={`btn ${styles.btnConfirmOrder} w-100`}
                >
                  <i className="bi bi-check2-circle"></i> Confirm Order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
