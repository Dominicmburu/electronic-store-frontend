import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from './Context/adminApi';
import { useNotification } from './Context/NotificationContext';
import styles from '../../styles/Admin/admin.module.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { addNotification } = useNotification();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      addNotification('Please enter your email address', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await authAPI.forgotPassword(email);
      
      if (result.success) {
        setIsSuccess(true);
        addNotification('Reset password instructions sent to your email', 'success');
      } else {
        addNotification(result.message || 'Failed to send reset instructions', 'error');
      }
    } catch (error) {
      addNotification('An error occurred while processing your request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src="/assets/logo.png" alt="Printers Admin" className={styles.logo} />
          <h1 className={styles.title}>Forgot Password</h1>
        </div>
        
        {isSuccess ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <span className="material-icons">check_circle</span>
            </div>
            <h2>Check your email</h2>
            <p>We've sent a password reset link to {email}</p>
            <p>Please check your email and follow the instructions to reset your password.</p>
            <Link to="/login" className={styles.returnButton}>Return to Login</Link>
          </div>
        ) : (
          <>
            <p className={styles.instructions}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  className={styles.input}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.loginButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>
              
              <div className={styles.returnLogin}>
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;