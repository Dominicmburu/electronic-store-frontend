import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UserContext } from '../../contexts/UserContext';

const Profile = ({ onLogout }: { onLogout: () => void }) => {
  const { profile, updateProfile } = useContext(UserContext) || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidPhoneNumber = (phone: string) => {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    if (!formData.name.trim()) {
      toast.error('Name is required.');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required.');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber)) {
      toast.error('Invalid phone number.');
      setLoading(false);
      return;
    }

    if (formData.currentPassword.length === 0) {
      toast.error('Current password is required.');
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length === 0) {
      toast.error('Password is required.');
      setLoading(false);
      return;
    }


    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!updateProfile) {
      toast.error('Profile not available.');
      setLoading(false);
      return;
    }

    try {
      updateProfile(formData.name, formData.email, formData.phoneNumber, formData.password, formData.currentPassword)
        .then(() => {
          toast.success('Profile updated successfully!');
        })
        .catch((err: any) => {
          toast.error(err.message || 'Failed to update profile.');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <>
      <h5 className="mt-4">Profile Information</h5>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group controlId="profileName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="profileEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="profilePhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="profileCurrentPassword">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="profilePassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>

          <Col md={6} className="mt-3">
            <Form.Group controlId="profileConfirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="button-group mt-3">
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating Profile...' : <><i className="bi bi-pencil-square"></i> Update Profile</>}
          </Button>
          <Button variant="danger" className="ms-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i> Logout
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Profile;
