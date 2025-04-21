import React from 'react';
import styles from '../../styles/components/StatusBadge.module.css';

type StatusColor = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';

interface StatusConfig {
  label: string;
  color: StatusColor;
  icon?: string;
}

interface StatusMap {
  [key: string]: StatusConfig;
}

interface StatusBadgeProps {
  status: string;
  statusMap: StatusMap;
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  statusMap, 
  showIcon = true 
}) => {
  const config = statusMap[status] || {
    label: status,
    color: 'secondary',
  };

  return (
    <div className={`${styles.badge} ${styles[config.color]}`}>
      {showIcon && config.icon && (
        <span className="material-icons">{config.icon}</span>
      )}
      <span className={styles.badgeText}>{config.label}</span>
    </div>
  );
};

export default StatusBadge;