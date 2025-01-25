import React from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Contact/ContactUs.module.css';

const ContactUs: React.FC = () => {
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
                <form id="contact-form">
                  <div className="mb-3">
                    <label htmlFor="contact-name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact-name"
                      placeholder="Enter your full name"
                      required
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
                      placeholder="Enter your email"
                      required
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
                      placeholder="Enter the subject"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact-message" className="form-label">
                      Message
                    </label>
                    <textarea
                      className="form-control"
                      id="contact-message"
                      rows={5}
                      placeholder="Enter your message"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-send-fill"></i> Send Message
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
