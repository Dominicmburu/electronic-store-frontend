import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Profile from '../components/Account/Profile';
import OrderHistory from '../components/Account/OrderHistory';
import Addresses from '../components/Account/Addresses';
import PaymentMethods from '../components/Account/PaymentMethods';
import Wishlist from '../components/Account/Wishlist';
import Settings from '../components/Account/AccountSettings';
import Login from '../components/Account/LoginForm';
import Register from '../components/Account/RegisterForm';
import Layout from '../components/Layout';
// import './MyAccount.css';

const MyAccount = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Layout>
      <Container className="my-5">
        <h2 className="mb-4">My Account</h2>
        <div className="account-container">
          {loggedIn ? (
            <Tabs defaultActiveKey="profile" id="account-tabs" className="account-tabs">
              <Tab eventKey="profile" title={<><i className="bi bi-person-fill"></i> Profile</>}>
                <Profile onLogout={handleLogout} />
              </Tab>
              <Tab eventKey="orders" title={<><i className="bi bi-bag-fill"></i> Order History</>}>
                <OrderHistory />
              </Tab>
              <Tab eventKey="addresses" title={<><i className="bi bi-geo-alt-fill"></i> Addresses</>}>
                <Addresses />
              </Tab>
              <Tab eventKey="payment" title={<><i className="bi bi-credit-card-fill"></i> Payment Methods</>}>
                <PaymentMethods />
              </Tab>
              <Tab eventKey="wishlist" title={<><i className="bi bi-heart-fill"></i> Wishlist</>}>
                <Wishlist />
              </Tab>
              <Tab eventKey="settings" title={<><i className="bi bi-gear-fill"></i> Settings</>}>
                <Settings />
              </Tab>
            </Tabs>
          ) : (
            <Tabs defaultActiveKey="login" id="auth-tabs" className="account-tabs">
              <Tab eventKey="login" title={<><i className="bi bi-box-arrow-in-right"></i> Login</>}>
                <Login onLogin={handleLogin} />
              </Tab>
              <Tab eventKey="register" title={<><i className="bi bi-person-plus-fill"></i> Register</>}>
                <Register onLogin={handleLogin} />
              </Tab>
            </Tabs>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default MyAccount;
