// components/Admin/analytics/SalesOverview.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  ChartOptions 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesCategory {
  id: number;
  name: string;
  value: number;
  color: string;
}

interface SalesData {
  categories: SalesCategory[];
  total: number;
  trend: number;
}

interface SalesOverviewProps {
  data: SalesData | null;
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ data }) => {
  if (!data || !data.categories || data.categories.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">No sales data available</p>
      </div>
    );
  }

  const nonZeroCategories = data.categories.filter(cat => cat.value > 0);
  
  // Prepare data for Chart.js
  const chartData = {
    labels: nonZeroCategories.map(cat => cat.name),
    datasets: [
      {
        data: nonZeroCategories.map(cat => cat.value),
        backgroundColor: nonZeroCategories.map(cat => cat.color),
        borderColor: nonZeroCategories.map(cat => cat.color),
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value as number) / data.total * 100).toFixed(1);
            return `${label}: KES ${(value as number).toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="sales-overview-wrapper">
      <div style={{ position: 'relative', height: '240px', marginBottom: '10px' }}>
        <Doughnut data={chartData} options={options} />
        
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            KES {data.total.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Simple table of top categories */}
      <div className="mt-3">
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Category</th>
                <th className="text-right">Amount</th>
                <th className="text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {nonZeroCategories.slice(0, 3).map(cat => (
                <tr key={cat.id}>
                  <td>
                    <span 
                      style={{ 
                        display: 'inline-block', 
                        width: '10px', 
                        height: '10px',
                        backgroundColor: cat.color,
                        marginRight: '5px',
                        borderRadius: '50%'
                      }}
                    ></span>
                    {cat.name}
                  </td>
                  <td className="text-right">KES {cat.value.toLocaleString()}</td>
                  <td className="text-right">
                    {((cat.value / data.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;