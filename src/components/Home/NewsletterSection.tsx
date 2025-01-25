import React from 'react';
import styles from '../../styles/NewsletterSection.module.css';

const NewsletterSection: React.FC = () => {
  return (
    <section className={`newsletter-section ${styles.newsletterSection}`}>
      <div className="container">
        <h2 className="mb-3">Stay Updated!</h2>
        <p className="mb-4">Subscribe to our newsletter to receive the latest updates and exclusive offers on printers.</p>
        <form className="d-flex justify-content-center">
          <input type="email" className="form-control w-50 me-2" placeholder="Enter your email" required />
          <button className="btn btn-primary" type="submit">
            <i className="bi bi-envelope-fill"></i> Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
