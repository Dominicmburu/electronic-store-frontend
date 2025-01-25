import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
// import styles from '../../styles/Cart.module.css';

const Cart: React.FC = () => {
  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4">Shopping Cart</h2>
        <div className="table-responsive">
          <table className="table table-bordered cart-table">
            <thead className="table-light">
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Subtotal</th>
                <th scope="col">Remove</th>
              </tr>
            </thead>
            <tbody id="cart-items">
              {/* Cart items will be inserted here dynamically (or via React state) */}
            </tbody>
          </table>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <Link to="/shop" className="btn btn-secondary">
              <i className="bi bi-arrow-left"></i> Continue Shopping
            </Link>
          </div>
          <div className="col-md-6">
            <div className="cart-summary text-end">
              <h5>Cart Summary</h5>
              <p>
                Subtotal: KSh <span id="cart-subtotal">0.00</span>
              </p>
              <p>
                Tax (18%): KSh <span id="cart-tax">0.00</span>
              </p>
              <hr />
              <p className="total-price">
                Total: KSh <span id="cart-total">0.00</span>
              </p>
              <Link to="/checkout" className="btn btn-primary">
                Proceed to Checkout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
