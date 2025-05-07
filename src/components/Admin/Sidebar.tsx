import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSidebarContext } from './Context';
import { FaChevronLeft, FaChevronRight, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/Admin/Sidebar.css';
import { API_BASE_URL } from '../../api/main';
import { UserContext } from '../../contexts/UserContext';

const Sidebar: React.FC = () => {
  const { isOpen, toggle } = useSidebarContext();
  const { profile, logout } = useContext(UserContext) || {};
  const navigate = useNavigate();


  const navigation = [
    { name: 'Dashboard', path: '/printers/dashboard', icon: <i className="bi bi-house-door" /> },
    { name: 'Orders', path: '/printers/orders', icon: <i className="bi bi-cart" /> },
    { name: 'Products', path: '/printers/products', icon: <i className="bi bi-box" /> },
    { name: 'Categories', path: '/printers/categories', icon: <i className="bi bi-tags" /> },
    { name: 'Printer Types', path: '/printers/printer-types', icon: <i className="bi bi-printer" /> },
    { name: 'Customers', path: '/printers/customers', icon: <i className="bi bi-person" /> },
    { name: 'Payments', path: '/printers/payments', icon: <i className="bi bi-credit-card" /> },
    { name: 'Reports', path: '/printers/reports', icon: <i className="bi bi-bar-chart" /> },
    { name: 'Profile', path: '/printers/settings', icon: <i className="bi bi-gear" /> },
  ];

  const handleLogout = () => {
    if (logout) {
      logout(); 
      navigate('/my-account');
    }
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header" style={{ paddingRight: isOpen ? '1rem' : '10.5rem' }}>
        <div className="logo-container">
          <img
            src={`${API_BASE_URL}/uploads/logo.png`}
            alt="Printers Admin"
            className="logo"
          />
          {isOpen && <span className="logo-text">PrinterShop</span>}
        </div>
        <button
          onClick={toggle}
          className="toggle-btn"
        >
          <i>
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </i>
        </button>
      </div>

      <div className="user-profile">
        <div className="avatar">
          {profile?.name?.charAt(0) || 'A'}
        </div>
        {isOpen && (
          <div className="user-info">
            <h5 className="user-name">{profile?.name || 'Admin User'}</h5>
            <p className="user-role">Administrator</p>
          </div>
        )}
      </div>

      <div className="sidebar-divider">
        {isOpen ? <span>Main Navigation</span> : <hr />}
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navigation.map((item) => (
            <li key={item.name} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                <i className="material-icons nav-icon">{item.icon}</i>
                {isOpen && <span className="nav-text">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {isOpen && <div className="sidebar-divider mt-auto">
        <span>Account</span>
      </div>}

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;