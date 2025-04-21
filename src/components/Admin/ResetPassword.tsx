import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from './Context/adminApi';
import { useNotification } from './Context/NotificationContext';
import styles from '../../styles/Admin/Login.module.css';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Extract token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // In a real app, you'd verify the token with the backend here
      setIsTokenValid(true);
    } else {
      setIsTokenValid(false);
      addNotification('Invalid or missing reset token', 'error');
    }
  }, [location.search, addNotification]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      addNotification('Please enter both password fields', 'warning');
      return;
    }
    
    if (password !== confirmPassword) {
      addNotification('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 8) {
      addNotification('Password must be at least 8 characters long', 'warning');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await authAPI.resetPassword(token, password);
      
      if (result.success) {
        setIsSuccess(true);
        addNotification('Your password has been reset successfully', 'success');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      } else {
        addNotification(result.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      addNotification('An error occurred while resetting your password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isTokenValid === false) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.errorMessage}>
            <div className={styles.errorIcon}>
              <span className="material-icons">error</span>
            </div>
            <h2>Invalid Reset Link</h2>
            <p>The password reset link is invalid or has expired.</p>
            <Link to="/forgot-password" className={styles.returnButton}>
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src="/assets/logo.png" alt="Printers Admin" className={styles.logo} />
          <h1 className={styles.title}>Reset Password</h1>
        </div>
        
        {isSuccess ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>
              <span className="material-icons">check_circle</span>
            </div>
            <h2>Password Reset Successful</h2>
            <p>Your password has been reset successfully.</p>
            <p>Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <p className={styles.instructions}>
              Create a new password for your account.
            </p>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isSubmitting}
                  className={styles.input}
                  required
                  minLength={8}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;