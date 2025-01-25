// src/components/Footer.tsx

import React from 'react';
import styles from '../styles/Footer.module.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className={`bg-dark text-white py-5 ${styles.footer}`}>
      <div className="container">
        <div className="row">
          {/* Newsletter Subscription */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Subscribe to our Newsletter</h5>
            <form className="input-group">
              <input type="email" className="form-control" placeholder="Enter your email" required />
              <button className="btn btn-outline-light" type="submit">
                Subscribe
              </button>
            </form>
          </div>
          {/* Contact Information */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Contact Us</h5>
            <p>
              Email: <a href="mailto:info@guava-printers.com" className="footer-links">info@guava-printers.com</a>
            </p>
            <p>
              Phone: <a href="tel:+254710599234" className="footer-links">+254710599234</a> |{' '}
              <a href="tel:+254703849399" className="footer-links">+254703849399</a>
            </p>
            <p>Address: 123 Tech Avenue, Nairobi, Kenya</p>
          </div>
          {/* Quick Links */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/shop" className="footer-links">
                  Shop Printers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="footer-links">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/my-account" className="footer-links">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="footer-links">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="footer-links">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          &copy; 2024 Guava Printers Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
