import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(UserContext) || {}; 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            toast.error('Please fill in both fields.');
            setLoading(false);
            return;
        }

        try {
            if (login) {
                await login(email, password);
                toast.success('Login successful!');
            } else {
                toast.error('Login function is not available.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
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
                    />
                </Form.Group>
                <Form.Group controlId="loginPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? 'Logging in...' : <><i className="bi bi-box-arrow-in-right"></i> Login</>}
                </Button>
            </Form>
        </>
    );
};

export default Login;
