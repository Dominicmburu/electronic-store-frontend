import React, { useState } from 'react';
import { Tab, Tabs, Form, Button, Alert, Modal } from 'react-bootstrap';
import useUser from '../../hooks/useUser';
import styles from '../../styles/Account/AuthSection.module.css';

const AuthSection: React.FC = () => {
  const { login, register } = useUser();
  const [key, setKey] = useState<string>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('login-email') as HTMLInputElement).value.trim().toLowerCase();
    const password = (form.elements.namedItem('login-password') as HTMLInputElement).value;

    try {
      await login(email, password);
      setSuccess('Login successful!');
      setShow(false); // Close modal upon success
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('register-name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('register-email') as HTMLInputElement).value.trim().toLowerCase();
    const phone = (form.elements.namedItem('register-phone') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('register-password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('register-confirm-password') as HTMLInputElement).value;

    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
      await register(name, email, phone, password);
      setSuccess('Registration successful! You are now logged in.');
      setShow(false); // Close modal upon success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Button to open Auth Modal */}
      <Button variant="primary" onClick={() => setShow(true)} className={styles.authButton}>
        <i className="bi bi-box-arrow-in-right"></i> My Account
      </Button>

      {/* Auth Modal */}
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>My Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="auth-tab"
            activeKey={key}
            onSelect={(k) => setKey(k!)}
            className="mb-3"
            fill
          >
            <Tab eventKey="login" title={<><i className="bi bi-box-arrow-in-right"></i> Login</>}>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="login-email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="login-password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="register" title={<><i className="bi bi-person-plus-fill"></i> Register</>}>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="register-name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your full name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="register-email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="register-phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" placeholder="+254-7XX-XXXXXX" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="register-password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter your password" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="register-confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm your password" required />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100">
                  <i className="bi bi-person-plus-fill"></i> Register
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthSection;
