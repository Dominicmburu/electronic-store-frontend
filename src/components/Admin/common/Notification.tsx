import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/components/Notification.module.css';

interface NotificationProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  message,
  type,
  duration = 5000,
  onClose,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Animation duration
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]} ${isClosing ? styles.closing : ''}`}>
      <div className={styles.iconContainer}>
        <span className="material-icons">{getIcon()}</span>
      </div>
      <div className={styles.messageContainer}>
        <p className={styles.message}>{message}</p>
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        <span className="material-icons">close</span>
      </button>
      {duration > 0 && (
        <div className={styles.progressBar} style={{ animationDuration: `${duration}ms` }} />
      )}
    </div>
  );
};

interface NotificationsContainerProps {
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onClose,
}) => {
  // Create portal for notifications
  return createPortal(
    <div className={styles.notificationsContainer}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
};

export default NotificationsContainer;