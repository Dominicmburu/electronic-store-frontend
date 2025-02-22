import React from 'react';
import styles from '../../styles/TestimonialsSection.module.css';

const TestimonialsSection: React.FC = () => {
  return (
    <section className={`testimonials-section py-5 ${styles.testimonialsSection}`}>
      <div className="container">
        <h2 className="text-center mb-4">What Our Customers Say</h2>
        <div id="testimonialsCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {/* Testimonial 1 */}
            <div className="carousel-item active text-center">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                className="rounded-circle mb-3"
                alt="Customer 1"
                width="100"
                height="100"
              />
              <h5>Jane Doe</h5>
              <p className="mb-0">"Guava Printers offers exceptional customer service and top-quality printers. Highly recommended!"</p>
            </div>
            {/* Testimonial 2 */}
            <div className="carousel-item text-center">
              <img
                src="https://randomuser.me/api/portraits/men/46.jpg"
                className="rounded-circle mb-3"
                alt="Customer 2"
                width="100"
                height="100"
              />
              <h5>John Smith</h5>
              <p className="mb-0">"The fast delivery and reliable printers make Guava Printers my go-to store for all office needs."</p>
            </div>
            {/* Testimonial 3 */}
            <div className="carousel-item text-center">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                className="rounded-circle mb-3"
                alt="Customer 3"
                width="100"
                height="100"
              />
              <h5>Emily Johnson</h5>
              <p className="mb-0">"I love the wide range of printers available. The website is user-friendly and the checkout process is smooth."</p>
            </div>
          </div>
          <button
            className={`carousel-control-prev ${styles.carouselControlPrev}`}
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="prev"
          >
            <span className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`} aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialsCarousel"
            data-bs-slide="next"
          >
            <span className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`} aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
