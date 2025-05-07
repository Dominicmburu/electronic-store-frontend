import React, { useState } from 'react';
import { useSidebarContext } from '../Context/SidebarContext';
import '../../../styles/Admin/Header.css';
import { FaBars, FaSearch, FaBell, FaShoppingCart, FaMoneyBillAlt, FaEnvelope, FaUser, FaCog, FaSignOutAlt, FaList } from 'react-icons/fa';

const Header: React.FC = () => {
  const { toggle } = useSidebarContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  return (
    <header className="admin-header shadow-sm">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col">
            <button className="menu-toggle btn btn-link" onClick={toggle}>
              <FaBars />
            </button>
            <div className="d-none d-md-inline-block header-search">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control border-0 bg-light" 
                  placeholder="Search for..."
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex align-items-center">
              {/* Notifications */}
              <div className="dropdown">
                <button className="btn btn-link position-relative" onClick={toggleNotifications}>
                  <FaBell />
                  <span className="notification-badge">3</span>
                </button>
                {showNotifications && (
                  <div className="dropdown-menu dropdown-menu-right show notification-dropdown shadow">
                    <h6 className="dropdown-header">Notifications Center</h6>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                      <div className="mr-3">
                        <div className="icon-circle bg-primary">
                          <FaShoppingCart className="text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">April 12, 2023</div>
                        <span>New order received: #1234</span>
                      </div>
                    </a>
                    <a className="dropdown-item d-flex align-items-center" href="#">
                      <div className="mr-3">
                        <div className="icon-circle bg-success">
                          <FaMoneyBillAlt className="text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">April 11, 2023</div>
                        <span>Payment received: KES 15,000</span>
                      </div>
                    </a>
                    <a className="dropdown-item text-center small text-gray-500" href="#">Show All Notifications</a>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="dropdown mx-3">
                <button className="btn btn-link position-relative">
                  <FaEnvelope />
                  <span className="notification-badge">7</span>
                </button>
              </div>

              {/* User profile */}
              <div className="dropdown">
                <button className="btn btn-link d-flex align-items-center" onClick={toggleUserMenu}>
                  {/* Add the user's avatar or name here if needed */}
                </button>
                {showUserMenu && (
                  <div className="dropdown-menu dropdown-menu-right show shadow user-dropdown">
                    <a className="dropdown-item" href="#">
                      <FaUser className="mr-2 text-gray-400 small" />
                      Profile
                    </a>
                    <a className="dropdown-item" href="#">
                      <FaCog className="mr-2 text-gray-400 small" />
                      Settings
                    </a>
                    <a className="dropdown-item" href="#">
                      <FaList className="mr-2 text-gray-400 small" />
                      Activity Log
                    </a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">
                      <FaSignOutAlt className="mr-2 text-gray-400 small" />
                      Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
