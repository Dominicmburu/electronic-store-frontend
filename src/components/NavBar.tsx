import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaStoreAlt,
  FaPhoneAlt,
  FaUser,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";

import styles from "../styles/NavBar.module.css";
import { useCart } from "../contexts/cartContext";
import { API_BASE_URL } from "../api/main";

const NavBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();

  const cartItemCount = cart && cart.items ? cart.items.length : 0;  // Safely access cart items

  const handleCloseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
    setIsNavbarOpen(false);
  };

  const handleToggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  // Check if link is active
  const isActive = (path: string): string =>
    location.pathname === path ? "active" : "";

  // Build a className for the close button that shows/hides based on isNavbarOpen
  const closeBtnClass = `${styles.closeBtn} ${
    isNavbarOpen ? styles.showCloseBtn : ""
  }`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white" style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <p>Jaytech printers</p>
          <img
            src={`${API_BASE_URL}/uploads/logo.png`}
            alt="JayTeach"
            className="d-inline-block align-middle"
          />
        </Link>

        {/* Cart icon in mobile view */}
        <div className="d-flex align-items-center ms-auto d-lg-none position-relative">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart className="me-2" />
            {cartItemCount > 0 && (
              <span
                className={`bg-danger position-absolute ${styles.cartIconBadge1}`}
              >
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Toggle button for the navbar */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          onClick={handleToggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible nav items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Close button in mobile view */}
          <button className={closeBtnClass} onClick={handleCloseNavbar}>
            <FaTimes />
          </button>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${isActive("/")}`}
                onClick={handleCloseNavbar}
              >
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/shop"
                className={`nav-link ${isActive("/shop")}`}
                onClick={handleCloseNavbar}
              >
                <FaShoppingCart className="me-2" /> Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/store-locations"
                className={`nav-link ${isActive("/store-locations")}`}
                onClick={handleCloseNavbar}
              >
                <FaStoreAlt className="me-2" /> Store Locations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/contact-us"
                className={`nav-link ${isActive("/contact-us")}`}
                onClick={handleCloseNavbar}
              >
                <FaPhoneAlt className="me-2" /> Contact Us
              </Link>
            </li>

            {/* Cart link for desktop only */}
            <li className="nav-item d-none d-lg-block position-relative">
              <Link
                to="/cart"
                className={`nav-link ${isActive("/cart")}`}
                onClick={handleCloseNavbar}
              >
                <FaShoppingCart className="me-2" />
                Cart
                {cartItemCount > 0 && (
                  <span
                    className={`bg-danger position-absolute ${styles.cartIconBadge}`}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/my-account"
                className={`nav-link ${isActive("/my-account")}`}
                onClick={handleCloseNavbar}
              >
                <FaUser className="me-2" /> My Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;