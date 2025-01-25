import { Link, useLocation } from "react-router-dom"; 
import { FaHome, FaShoppingCart, FaStoreAlt, FaTruck, FaPhoneAlt, FaUser, FaTimes } from 'react-icons/fa'; 
import { useState } from "react";

const NavBar = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(5); // You can dynamically update this count
  const location = useLocation(); // Get the current route location

  const handleCloseNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
    setIsNavbarOpen(false); // Close the navbar after clicking close
  };

  const handleToggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen); // Toggle the navbar state
  };

  // Helper function to check if the link is active
  const isActive = (path: string): string => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="d-inline-block align-middle"
            style={{ height: "40px" }}
          />
        </a>

        <div className="d-flex align-items-center ms-auto d-lg-none">
          <Link to="/cart" className="cart-icon position-relative">
            <FaShoppingCart className="me-2" />
            {cartItemCount > 0 && (
              <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={isNavbarOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={handleToggleNavbar}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <button 
            className="close-btn" 
            onClick={handleCloseNavbar} 
            style={{ 
              display: isNavbarOpen ? 'block' : 'none',
              position: 'absolute',
              top: '20px',
              right: '20px',
              fontSize: '1.5rem',
              color: 'black',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FaTimes />
          </button>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${isActive('/')}`} onClick={handleCloseNavbar}>
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shop" className={`nav-link ${isActive('/shop')}`} onClick={handleCloseNavbar}>
                <FaShoppingCart className="me-2" /> Shop
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/store-locations" className={`nav-link ${isActive('/store-locations')}`} onClick={handleCloseNavbar}>
                <FaStoreAlt className="me-2" /> Store Locations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/track-order" className={`nav-link ${isActive('/track-order')}`} onClick={handleCloseNavbar}>
                <FaTruck className="me-2" /> Track Order
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact-us" className={`nav-link ${isActive('/contact-us')}`} onClick={handleCloseNavbar}>
                <FaPhoneAlt className="me-2" /> Contact Us
              </Link>
            </li>
            <li className="nav-item d-none d-lg-block">
              <Link to="/cart" className={`nav-link ${isActive('/cart')}`} onClick={handleCloseNavbar}>
                <FaShoppingCart className="me-2" /> Cart
                {cartItemCount > 0 && (
                  <span className="badge bg-danger position-absolute" style={{ top: '0.2rem', right: '8.5rem' }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-account" className={`nav-link ${isActive('/my-account')}`} onClick={handleCloseNavbar}>
                <FaUser className="me-2" /> My Account
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom CSS for active link and color adjustments */}
      <style>{`
        .navbar-light .navbar-nav .nav-link {
          color: black; /* Set the link color to black */
        }

        .navbar-light .navbar-nav .nav-link.active {
          color: #ffcc00; /* Set the active link color to yellowish */
          font-weight: bold; /* Make active links bold */
        }

        .navbar-light {
          background-color: white; /* Set navbar background to white */
        }

        .nav-link:hover {
          color: #ff6347; /* Optional: Set hover color to a reddish tone */
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 70%;
            background-color: white;
            box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            padding-top: 60px;
          }

          .navbar-collapse.collapse.show {
            transform: translateX(0);
          }

          .navbar-toggler-icon {
            font-size: 1.5rem;
          }

          .navbar-nav {
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
          }

          .nav-item {
            margin-bottom: 20px;
          }

          .nav-link {
            font-size: 1.2rem;
            color: black;
            text-align: center;
            transition: color 0.2s;
            padding-bottom: 10px;
          }

          .nav-link:hover {
            color: #ff6347;
          }

          .nav-item:not(:last-child) .nav-link {
            border-bottom: 2px solid #555;
          }

          .cart-icon {
            font-size: 1.8rem;
            color: black;
            margin-left: auto;
            margin-right: 10px;
            padding: 10px;
            position: relative;
          }

          .cart-icon:hover {
            color: #ff6347;
          }
        }

        @media (min-width: 992px) {
          .navbar-nav {
            justify-content: flex-end;
          }

          .d-none.d-lg-block {
            display: block !important;
          }
        }

        .cart-icon .badge {
          font-size: 0.8rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          top: -5px;
          right: -5px;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
