import { Form, Button } from 'react-bootstrap';

const Settings = () => {
    return (
        <>
            <h5 className="mt-4">Account Settings</h5>
            <Form>
                <Form.Group controlId="newsletterSubscription" className="mb-3">
                    <Form.Label>Newsletter Subscription</Form.Label>
                    <Form.Select defaultValue="subscribed">
                        <option value="subscribed">Subscribed</option>
                        <option value="unsubscribed">Unsubscribed</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="notificationPreferences" className="mb-3">
                    <Form.Label>Notification Preferences</Form.Label>
                    <Form.Select defaultValue="all">
                        <option value="all">All Notifications</option>
                        <option value="email">Email Only</option>
                        <option value="sms">SMS Only</option>
                        <option value="none">No Notifications</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary">
                    <i className="bi bi-gear-fill"></i> Update Settings
                </Button>
            </Form>
        </>
    );
};

export default Settings;
