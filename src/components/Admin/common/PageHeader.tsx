// components/Admin/common/PageHeader.tsx
import React from 'react';
// import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="page-header d-sm-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 className="page-title h3 mb-0 text-gray-800">{title}</h1>
        {subtitle && <p className="page-subtitle mt-2 text-gray-600">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions mt-3 mt-sm-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;