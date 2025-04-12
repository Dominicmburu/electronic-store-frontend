import { useState, useContext, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';
import { toast } from 'react-toastify';
import { fetchSettingsAPI, updateSettingsAPI } from '../../contexts/settingsHelper';

const Settings = () => {
  const [settings, setSettings] = useState<any>({
    newsSubscription: false,
    notificationEmail: false,
    notificationSMS: false,
  });

  const { token } = useContext(UserContext) || {};

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        if (!token) throw new Error("Token not found");
        const response = await fetchSettingsAPI(token);
        setSettings(response);
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch settings.");
      }
    };
    fetchSettings();
  }, [token]);

  const handleUpdateSettings = async () => {
    try {
      const { newsSubscription, notificationEmail, notificationSMS } = settings;
      if (!token) throw new Error("Token not found");
      await updateSettingsAPI(newsSubscription, notificationEmail, notificationSMS, token);
      toast.success("Settings updated successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update settings.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <>
      <h5 className="mt-4">Account Settings</h5>
      <Form>
        <Form.Group controlId="newsletterSubscription" className="mb-3">
          <Form.Label>Newsletter Subscription</Form.Label>
          <Form.Check
            type="checkbox"
            label="Subscribed"
            name="newsSubscription"
            // checked={settings.newsSubscription} 
            onChange={handleChange}
            id="newsletterSubscription"
          />
        </Form.Group>

        <Form.Group controlId="notificationEmail" className="mb-3">
          <Form.Label>Email Notifications</Form.Label>
          <Form.Check
            type="checkbox"
            label="Email Notifications"
            name="notificationEmail"
            // checked={settings.notificationEmail}
            onChange={handleChange}
            id="notificationEmail"
          />
        </Form.Group>

        <Form.Group controlId="notificationSMS" className="mb-3">
          <Form.Label>SMS Notifications</Form.Label>
          <Form.Check
            type="checkbox"
            label="SMS Notifications"
            name="notificationSMS"
            // checked={settings.notificationSMS} 
            onChange={handleChange}
            id="notificationSMS"
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdateSettings}>
          <i className="bi bi-gear-fill"></i> Update Settings
        </Button>
      </Form>
    </>
  );
};

export default Settings;
