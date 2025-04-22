import React, { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Contact/ContactUs.module.css';
import { API_BASE_URL } from '../api/main';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus({ success: true, message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus({ success: false, message: error instanceof Error ? error.message : 'Failed to send message' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container my-5">
        <h2 className="mb-4">Contact Us</h2>

        <div className={styles.contactContainer}>
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-geo-alt-fill"></i> Our Address
                </h5>
                <p>Electronics Store</p>
                <p>123 Main Street, Nairobi, Kenya</p>
                <p>ZIP Code: 00100</p>
              </div>

              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-telephone-fill"></i> Call Us
                </h5>
                <p>+254710599234</p>
                <p>+254703849399</p>
              </div>

              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-envelope-fill"></i> Email Us
                </h5>
                <p>
                  <a href="mailto:info@guavaprinters.com">info@e-store.co.ke</a>
                </p>
              </div>

              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-clock-fill"></i> Operating Hours
                </h5>
                <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                <p>Sat: 10:00 AM - 4:00 PM</p>
                <p>Sun: Closed</p>
              </div>

              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-people-fill"></i> Our Team
                </h5>
                <p>Our dedicated support team is here to assist you with any inquiries or issues you may have.</p>
              </div>

              <div className={styles.contactInfo}>
                <h5>
                  <i className="bi bi-chat-left-text-fill"></i> Live Chat
                </h5>
                <p>Click the chat icon on the bottom right corner to start a live conversation with our support team.</p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className={styles.contactForm}>
                <h5>
                  <i className="bi bi-envelope-plus-fill"></i> Send Us a Message
                </h5>
                {submitStatus && (
                  <div className={`alert alert-${submitStatus.success ? 'success' : 'danger'}`} role="alert">
                    {submitStatus.message}
                  </div>
                )}
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="contact-name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact-name"
                      name="name"
                      placeholder="Enter your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact-email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="contact-email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact-subject" className="form-label">
                      Subject
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact-subject"
                      name="subject"
                      placeholder="Enter the subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact-message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder="Enter your message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send-fill"></i> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-12">
              <h5 className="mb-3">
                <i className="bi bi-geo-alt-fill"></i> Find Us Here
              </h5>
              <div id="contact-map" className={styles.contactMap}></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
