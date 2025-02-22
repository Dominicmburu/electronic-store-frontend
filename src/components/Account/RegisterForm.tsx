import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            toast.error('All fields are required.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            toast.error('Please enter a valid email address.');
            return;
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(formData.phone)) {
            toast.error('Please enter a valid phone number.');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters long.');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }        

        setLoading(true);

        try {
            const response = await axios.post('https://electronic-store-backend.onrender.com/api/auth/register', {
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
            });

            if (response.status === 201) {
                toast.success('Registration successful! You can now log in.');
                navigate('/login');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <h5 className="mt-4">Create a New Account</h5>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="registerName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="registerEmail" className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="registerPhone" className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="registerPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group controlId="registerConfirmPassword" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button type="submit" variant="success" disabled={loading}>
                    {loading ? 'Registering...' : <><i className="bi bi-person-plus-fill"></i> Register</>}
                </Button>
            </Form>
        </>
    );
};

export default Register;
