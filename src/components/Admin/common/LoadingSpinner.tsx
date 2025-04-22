import React from 'react';
import styles from '../../../styles/Admin/LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 'medium' 
}) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenContainer}>
        <div className={`${styles.spinner} ${styles[size]}`}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;