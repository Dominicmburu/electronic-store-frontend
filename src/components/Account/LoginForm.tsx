import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Replace this with actual authentication logic
        if (email === 'user@example.com' && password === 'password') {
            onLogin();
        } else {
            alert('Invalid email or password.');
        }
    };

    return (
        <>
            <h5 className="mt-4">Login to Your Account</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="loginEmail" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="loginPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="primary">
                    <i className="bi bi-box-arrow-in-right"></i> Login
                </Button>
            </Form>
        </>
    );
};

export default Login;
