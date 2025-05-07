import React, { useState, useEffect } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import '../styles/Admin/Reports.css';

interface ReportData {
  sales: {
    daily: { date: string; sales: number }[];
    monthly: { month: string; sales: number }[];
    categories: { category: string; sales: number }[];
    paymentMethods: { method: string; count: number }[];
  };
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'customers'>('sales');
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const today = new Date();
        
        // Generate daily sales data for the last 30 days
        const dailySales = Array(30).fill(null).map((_, index) => {
          const date = new Date();
          date.setDate(today.getDate() - 29 + index);
          return {
            date: date.toISOString().split('T')[0],
            sales: Math.floor(Math.random() * 50000) + 10000
          };
        });
        
        // Generate monthly sales data for the last 12 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlySales = Array(12).fill(null).map((_, index) => {
          const monthIndex = (today.getMonth() - 11 + index + 12) % 12;
          return {
            month: monthNames[monthIndex],
            sales: Math.floor(Math.random() * 500000) + 100000
          };
        });
        
        // Category sales data
        const categorySales = [
          { category: 'Inkjet Printers', sales: 350000 },
          { category: 'Laser Printers', sales: 450000 },
          { category: '3D Printers', sales: 180000 },
          { category: 'Accessories', sales: 220000 },
          { category: 'Inks & Toners', sales: 380000 }
        ];
        
        // Payment methods data
        const paymentMethodsData = [
          { method: 'Credit Card', count: 45 },
          { method: 'PayPal', count: 20 },
          { method: 'Bank Transfer', count: 15 },
          { method: 'Mobile Money', count: 12 },
          { method: 'Cash on Delivery', count: 8 }
        ];
        
        const mockReportData: ReportData = {
          sales: {
            daily: dailySales,
            monthly: monthlySales,
            categories: categorySales,
            paymentMethods: paymentMethodsData
          }
        };
        
        setReportData(mockReportData);
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const handleGenerateReport = () => {
    // In a real app, this would fetch new data based on the selected filters
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = (format: 'pdf' | 'csv' | 'excel') => {
    // In a real app, this would generate and download the report in the selected format
    alert(`Exporting report in ${format.toUpperCase()} format...`);
  };

  // const renderSalesTimeSeriesChart = () => {
  //   if (!reportData) return null;
  
  //   const timeSeriesData = timeRange === 'daily' ? reportData.sales.daily : reportData.sales.monthly;
  //   const labels = timeRange === 'daily' 
  //     ? timeSeriesData.map(item => item.date.substring(5)) // MM-DD format
  //     : timeSeriesData.map(item => item.month); // Use `month` for monthly data
  
  //   const data = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: 'Sales (KES)',
  //         data: timeSeriesData.map(item => item.sales),
  //         borderColor: '#4e73df',
  //         backgroundColor: chartType === 'line' ? 'rgba(78, 115, 223, 0.05)' : 'rgba(78, 115, 223, 0.6)',
  //         pointBackgroundColor: '#4e73df',
  //         pointBorderColor: '#fff',
  //         pointHoverRadius: 5,
  //         pointHoverBackgroundColor: '#4e73df',
  //         pointHoverBorderColor: '#fff',
  //         pointHitRadius: 10,
  //         pointBorderWidth: 2,
  //         fill: chartType === 'line',
  //         tension: 0.3
  //       }
  //     ]
  //   };
  
  //   const options = {
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         display: false
  //       },
  //       tooltip: {
  //         callbacks: {
  //           label: function(context: any) {
  //             return `KES ${context.parsed.y.toLocaleString()}`;
  //           }
  //         }
  //       }
  //     },
  //     scales: {
  //       y: {
  //         ticks: {
  //           callback: function(value: any) {
  //             return `KES ${value.toLocaleString()}`;
  //           }
  //         }
  //       }
  //     }
  //   };
  
  //   return chartType === 'line' 
  //     ? <Line data={data} options={options} height={300} /> 
  //     : <Bar data={data} options={options} height={300} />;
  // };
  

  const renderCategorySalesChart = () => {
    if (!reportData) return null;
    
    const data = {
      labels: reportData.sales.categories.map(item => item.category),
      datasets: [
        {
          data: reportData.sales.categories.map(item => item.sales),
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
          ],
          hoverBackgroundColor: [
            '#2e59d9',
            '#17a673',
            '#2c9faf',
            '#dda20a',
            '#be2617',
          ],
          hoverBorderColor: 'rgba(234, 236, 244, 1)',
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: KES ${value.toLocaleString()}`;
            }
          }
        }
      }
    };

    return <Doughnut data={data} options={options} height={300} />;
  };

  const renderPaymentMethodsChart = () => {
    if (!reportData) return null;
    
    const data = {
      labels: reportData.sales.paymentMethods.map(item => item.method),
      datasets: [
        {
          data: reportData.sales.paymentMethods.map(item => item.count),
          backgroundColor: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
          ],
          hoverBackgroundColor: [
            '#2e59d9',
            '#17a673',
            '#2c9faf',
            '#dda20a',
            '#be2617',
          ],
          hoverBorderColor: 'rgba(234, 236, 244, 1)',
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            padding: 20,
            usePointStyle: true,
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${percentage}%`;
            }
          }
        }
      }
    };

    return <Doughnut data={data} options={options} height={300} />;
  };

  const calculateTotalSales = () => {
    if (!reportData) return 0;
    
    return reportData.sales.daily.reduce((sum, item) => sum + item.sales, 0);
  };

  const calculateAverageDailySales = () => {
    if (!reportData) return 0;
    
    const total = reportData.sales.daily.reduce((sum, item) => sum + item.sales, 0);
    return total / reportData.sales.daily.length;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="reports-container">
      <PageHeader 
        title="Reports" 
        subtitle="Generate and analyze business reports"
        actions={
          <div className="dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" id="exportDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="material-icons mr-1">download</i> Export
            </button>
            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="exportDropdown">
              <button className="dropdown-item" onClick={() => handleExportReport('pdf')}>
                <i className="material-icons mr-2 text-danger">picture_as_pdf</i> Export as PDF
              </button>
              <button className="dropdown-item" onClick={() => handleExportReport('excel')}>
                <i className="material-icons mr-2 text-success">table_chart</i> Export as Excel
              </button>
              <button className="dropdown-item" onClick={() => handleExportReport('csv')}>
                <i className="material-icons mr-2 text-primary">insert_drive_file</i> Export as CSV
              </button>
            </div>
          </div>
        }
      />
      
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Sales (30 Days)
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {calculateTotalSales().toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>attach_money</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Avg. Daily Sales
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {Math.round(calculateAverageDailySales()).toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>trending_up</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Top Selling Category
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {reportData?.sales.categories.sort((a, b) => b.sales - a.sales)[0]?.category || 'N/A'}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>category</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Popular Payment
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {reportData?.sales.paymentMethods.sort((a, b) => b.count - a.count)[0]?.method || 'N/A'}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>payments</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-12">
          <DashboardCard title='Generate Report' className='mb-4'>
            <div className="report-filters mb-4">
              <div className="row align-items-end">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label>Report Type</label>
                  <select 
                    className="form-control"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                  >
                    <option value="sales">Sales Report</option>
                    <option value="inventory">Inventory Report</option>
                    <option value="customers">Customer Report</option>
                  </select>
                </div>
                
                <div className="col-md-4 mb-3 mb-md-0">
                  <label>Time Range</label>
                  <div className="d-flex">
                    <div className="btn-group w-100">
                      <button 
                        className={`btn ${timeRange === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeRange('daily')}
                      >
                        Daily
                      </button>
                      <button 
                        className={`btn ${timeRange === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setTimeRange('monthly')}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <label>Chart Type</label>
                  <div className="d-flex">
                    <div className="btn-group w-100">
                      <button 
                        className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setChartType('line')}
                      >
                        Line
                      </button>
                      <button 
                        className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setChartType('bar')}
                      >
                        Bar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row mt-3">
                <div className="col-md-8">
                  <div className="custom-date-range">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="form-group mb-md-0">
                          <label>Start Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="start"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange({...customDateRange, start: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group mb-md-0">
                          <label>End Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="end"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({...customDateRange, end: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form-group d-flex align-items-end h-100 mb-0">
                          <button 
                            className="btn btn-success btn-block"
                            onClick={handleGenerateReport}
                          >
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8 mb-4">
          <DashboardCard 
            title={`${timeRange === 'daily' ? 'Daily' : 'Monthly'} Sales Overview`}
            headerAction={
              <div className="dropdown no-arrow">
                <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="salesDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="material-icons">more_vert</i>
                </button>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="salesDropdown">
                  <a className="dropdown-item" href="#">
                    <i className="material-icons mr-2 text-gray-400 small">calendar_today</i>
                    This Week
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="material-icons mr-2 text-gray-400 small">calendar_month</i>
                    This Month
                  </a>
                  <a className="dropdown-item" href="#">
                    <i className="material-icons mr-2 text-gray-400 small">calendar_view_year</i>
                    This Year
                  </a>
                </div>
              </div>
            }
          >
            <div className="chart-container">
              {/* {renderSalesTimeSeriesChart()} */}
            </div>
          </DashboardCard>
        </div>
        
        <div className="col-lg-4 mb-4">
          <DashboardCard 
            title="Sales by Category"
            headerAction={
              <div className="dropdown no-arrow">
                <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="categoryDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="material-icons">more_vert</i>
                </button>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="categoryDropdown">
                  <a className="dropdown-item" href="#">View Details</a>
                  <a className="dropdown-item" href="#">Export Data</a>
                </div>
              </div>
            }
          >
            <div className="chart-container">
              {renderCategorySalesChart()}
            </div>
          </DashboardCard>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-4 mb-4">
          <DashboardCard 
            title="Payment Methods"
            headerAction={
              <div className="dropdown no-arrow">
                <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="paymentDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="material-icons">more_vert</i>
                </button>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="paymentDropdown">
                  <a className="dropdown-item" href="#">View Details</a>
                  <a className="dropdown-item" href="#">Export Data</a>
                </div>
              </div>
            }
          >
            <div className="chart-container">
              {renderPaymentMethodsChart()}
            </div>
          </DashboardCard>
        </div>
        
        <div className="col-lg-8 mb-4">
          <DashboardCard title="Sales Summary">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Category</th>
                    <th>Total Sales</th>
                    <th>% of Total</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.sales.categories.map((category, index) => {
                    const totalSales = reportData.sales.categories.reduce((sum, cat) => sum + cat.sales, 0);
                    const percentage = Math.round((category.sales / totalSales) * 100);
                    // Random growth value between -10 and 20
                    const growth = Math.floor(Math.random() * 30) - 10; 
                    
                    return (
                      <tr key={index}>
                        <td>{category.category}</td>
                        <td>KES {category.sales.toLocaleString()}</td>
                        <td>{percentage}%</td>
                        <td>
                          <div className={`d-flex align-items-center ${growth >= 0 ? 'text-success' : 'text-danger'}`}>
                            <i className="material-icons mr-1">{growth >= 0 ? 'arrow_upward' : 'arrow_downward'}</i>
                            <span>{Math.abs(growth)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-light">
                    <th>Total</th>
                    <th>KES {reportData?.sales.categories.reduce((sum, cat) => sum + cat.sales, 0).toLocaleString()}</th>
                    <th>100%</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Reports;