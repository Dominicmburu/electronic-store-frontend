import React, { ReactNode } from 'react';
// import './DashboardCard.css';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  children, 
  className = '',
  headerAction
}) => {
  return (
    <div className={`dashboard-card card shadow mb-4 ${className}`}>
      <div className="card-header py-3 d-flex align-items-center justify-content-between">
        <h6 className="m-0 font-weight-bold text-primary">{title}</h6>
        {headerAction && <div className="card-header-action">{headerAction}</div>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;