import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { UserContext } from "../../contexts/UserContext";

const Profile = ({ onLogout }: { onLogout: () => void }) => {
  const { profile, updateProfile } = useContext(UserContext) || {};
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    // try {
    //   await updateProfile(formData.name, formData.email, formData.phoneNumber, formData.password);
    //   toast.success("Profile updated successfully!");
    // } catch (err: any) {
    //   toast.error(err.message || "Failed to update profile.");
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <>
      <h5 className="mt-4">Profile Information</h5>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="profileName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={true}
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
                disabled={true}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group controlId="profilePhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                name="phone"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mt-3">
            <Form.Group controlId="profilePassword">
              <Form.Label>Change Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="New Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="button-group mt-3">
          <Button variant="primary" disabled={loading}>
            {loading ? (
              "Updating Profile..."
            ) : (
              <>
                <i className="bi bi-pencil-square"></i> Update Profile
              </>
            )}
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
