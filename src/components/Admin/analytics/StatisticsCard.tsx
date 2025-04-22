// components/Admin/analytics/StatisticsCard.tsx
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface StatisticsCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  trend?: number;
  trendDirection?: 'up' | 'down';
  formatValue?: (value: number) => string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
  formatValue = (val) => val.toString()
}) => {
  // Determine card border class based on title or other criteria
  const getBorderClass = () => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('revenue') || titleLower.includes('balance')) {
      return 'border-left-success';
    } else if (titleLower.includes('order')) {
      return 'border-left-primary';
    } else if (titleLower.includes('stock') || titleLower.includes('cancel')) {
      return 'border-left-danger';
    } else if (titleLower.includes('user') || titleLower.includes('admin')) {
      return 'border-left-info';
    } else {
      return 'border-left-warning';
    }
  };

  return (
    <div className={`card ${getBorderClass()} shadow h-100 py-2`}>
      <div className="card-body stats-card">
        <div className="row no-gutters align-items-center">
          <div className="col mr-2">
            <div className="title text-uppercase mb-1">
              {title}
            </div>
            <div className="value">
              {formatValue(value)}
            </div>
            {trend !== undefined && (
              <div className={`trend ${trendDirection === 'up' ? 'trend-up' : 'trend-down'}`}>
                {trendDirection === 'up' ? 
                  <FaArrowUp size={12} className="mr-1" /> : 
                  <FaArrowDown size={12} className="mr-1" />
                }
                <span>{trend}%</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="col-auto">
              <div className="icon">
                {icon}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;