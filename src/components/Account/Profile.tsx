import { Form, Button, Row, Col } from 'react-bootstrap';

const Profile = ({ onLogout }: { onLogout: () => void }) => {
    return (
        <>
            <h5 className="mt-4">Profile Information</h5>
            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="profileName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Full Name" defaultValue="Dominic" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="profileEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="email" placeholder="Email Address" defaultValue="mburudominic381@gmail.com" />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3">
                        <Form.Group controlId="profilePhone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" placeholder="Phone Number" defaultValue="254717794150" />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3">
                        <Form.Group controlId="profilePassword">
                            <Form.Label>Change Password</Form.Label>
                            <Form.Control type="password" placeholder="New Password" />
                        </Form.Group>
                    </Col>
                    <Col md={6} className="mt-3">
                        <Form.Group controlId="profileConfirmPassword">
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm New Password" />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="button-group mt-3">
                    <Button variant="primary">
                        <i className="bi bi-pencil-square"></i> Update Profile
                    </Button>
                    <Button variant="danger" className="ms-2" onClick={onLogout}>
                        <i className="bi bi-box-arrow-left"></i> Logout
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Profile;
