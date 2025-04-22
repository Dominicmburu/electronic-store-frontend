import React, { useContext, useEffect, useState } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import RevenueChart from '../components/Admin/analytics/RevenueChart';
import StatisticsCard from '../components/Admin/analytics/StatisticsCard';
import SalesOverview from '../components/Admin/analytics/SalesOverview';
import { useSalesOverview, useRevenueData } from '../components/Admin/Context';
import '../styles/Admin/Dashboard.css';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  FaShoppingCart, FaMoneyBillWave, FaChartLine, FaHourglassHalf,
  FaUsers, FaUserShield, FaBoxes, FaBoxOpen, FaCheck, FaList,
  FaPrint, FaSync, FaDownload, FaPlusCircle, FaTruck,
  FaEllipsisV, FaCalendarDay, FaCalendarWeek, FaCalendarAlt,
  FaImage
} from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';

import { fetchDashboardData } from '../components/Admin/Services/DashboardService';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/main';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalAdmins: number;
  totalProducts: number;
  outOfStockProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalPrinterTypes: number;
  totalShops: number;
  paybillBalance: number;
}

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   isActive: boolean;
// }

interface Product {
  id: number;
  name: string;
  description: string;
  images: string[];
  currentPrice: number;
  lastPrice: number;
  isFeatured: boolean;
  createdAt: string;
  stockQuantity: number;
  category: {
    id: number;
    name: string;
  };
}

// interface Category {
//   id: number;
//   name: string;
//   description: string;
//   images: string[];
//   printerTypeId: number;
//   printerType: {
//     id: number;
//     name: string;
//     printerCount: number;
//   };
// }

// interface PrinterType {
//   id: number;
//   name: string;
//   printerCount: number;
//   categories: Category[];
// }

interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  userId: number;
  orderItems: OrderItem[];
  statusHistory: OrderStatus[];
}

interface OrderStatus {
  id: number;
  status: string;
  orderId: number;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const { token } = useContext(UserContext) || {};

  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalPrinterTypes: 0,
    totalShops: 0,
    paybillBalance: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [productCategoryData, setProductCategoryData] = useState<any[]>([]);
  const [printerTypesData, setPrinterTypesData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000', '#00C5FF', '#8B008B'];

  // Convert time range to period for the sales hook
  const periodMap = {
    'week': 'weekly',
    'month': 'monthly',
    'year': 'yearly'
  } as const;

  const { revenueData, isLoading: revenueLoading } = useRevenueData(token as string, {
    period: periodMap[timeRange] as 'weekly' | 'monthly' | 'yearly'
  });


  const { salesData, isLoading: salesLoading } = useSalesOverview(token as string, {
    period: periodMap[timeRange] as 'weekly' | 'monthly' | 'yearly'
  });


  useEffect(() => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData(token as string);

        const users = data.users || [];
        const products = data.products || [];
        const categories = data.categories || [];
        const printerTypes = data.printerTypes || [];
        const orders = data.orders || [];
        const shops = data.shops || [];

        const totalRevenue = orders.reduce((sum: any, order: { orderItems: any[]; }) => {
          return sum + order.orderItems.reduce((orderSum, item) =>
            orderSum + (item.price * item.quantity), 0);
        }, 0);

        const averageOrderValue = orders.length > 0
          ? totalRevenue / orders.length
          : 0;

        const orderStatusCounts = orders.reduce((acc: { [x: string]: any; }, order: { status: string | number; }) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const totalAdmins = users.filter((user: { role: string; }) => user.role === 'ADMIN').length;
        const outOfStockProducts = products.filter((product: { stockQuantity: number; }) => product.stockQuantity === 0).length;
        const activeProducts = products.filter((product: { stockQuantity: number; }) => product.stockQuantity > 0).length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          averageOrderValue,
          pendingOrders: orderStatusCounts.PENDING || 0,
          processingOrders: orderStatusCounts.PROCESSING || 0,
          shippedOrders: orderStatusCounts.SHIPPED || 0,
          deliveredOrders: orderStatusCounts.DELIVERED || 0,
          cancelledOrders: orderStatusCounts.CANCELLED || 0,
          totalUsers: users.length - totalAdmins, // Exclude admins from user count
          totalAdmins,
          totalProducts: products.length,
          outOfStockProducts,
          activeProducts,
          totalCategories: categories.length,
          totalPrinterTypes: printerTypes.length,
          totalShops: shops.length,
          paybillBalance: 125000, // Mock data for now
        });

        // Product category distribution
        const categoryData = categories.map((category: { name: any; id: any; }) => ({
          name: category.name,
          value: products.filter((p: { categoryId: any; }) => p.categoryId === category.id).length,
        }));
        setProductCategoryData(categoryData);

        // Printer type statistics (using actual printerCount from printerTypes)
        const printerTypeData = printerTypes.map((type: { name: any; printerCount: any; }) => ({
          name: type.name,
          count: type.printerCount,
        }));
        setPrinterTypesData(printerTypeData);

        // Recent orders (sorted by date)
        const sortedOrders = [...orders].sort((a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        setRecentOrders(sortedOrders.slice(0, 5));

        // Top products (sorted by sales)
        const productSales = products.map((product: { id: any; }) => ({
          ...product,
          sales: orders.reduce((sum: any, order: { orderItems: any[]; }) => sum +
            order.orderItems.filter(item => item.productId === product.id)
              .reduce((itemSum: any, item: { quantity: any; }) => itemSum + item.quantity, 0), 0)
        }));
        setTopProducts([...productSales].sort((a, b) => b.sales - a.sales).slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, timeRange]);

  const handleExportReport = () => {
    // Implement report generation/export functionality
    toast.info('Generating report...');

    // Mock implementation - in a real app, you'd generate a PDF or CSV
    setTimeout(() => {
      toast.success('Report generated successfully!');
      // Create a simple CSV
      const headers = ['Metric', 'Value'];
      const data = [
        ['Total Orders', stats.totalOrders],
        ['Total Revenue', `KES ${stats.totalRevenue.toLocaleString()}`],
        ['Average Order Value', `KES ${stats.averageOrderValue.toLocaleString()}`],
        ['Pending Orders', stats.pendingOrders],
        ['Total Users', stats.totalUsers],
        ['Total Products', stats.totalProducts],
        ['Out of Stock Products', stats.outOfStockProducts],
      ];

      const csvContent =
        headers.join(',') + '\n' +
        data.map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const refreshPaybillBalance = () => {
    toast.info('Refreshing balance...');
    // Mock implementation - replace with actual API call
    setTimeout(() => {
      setStats(prev => ({ ...prev, paybillBalance: prev.paybillBalance + 15000 }));
      toast.success('Balance updated successfully!');
    }, 1000);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered':
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  if (isLoading || revenueLoading || salesLoading) {
    return <LoadingSpinner />;
  }

  // Make period changes affect both hooks
  const handlePeriodChange = (newTimeRange: 'week' | 'month' | 'year') => {
    setTimeRange(newTimeRange);
  };

  return (
    <div className="dashboard-container">
      <PageHeader
        title="Dashboard"
        subtitle="Welcome to your printer shop admin dashboard"
        actions={
          <button className="btn btn-primary" onClick={handleExportReport}>
            <FaDownload className="mr-1" /> Generate Report
          </button>
        }
      />

      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Dashboard Overview</h5>
                <div className="btn-group">
                  <button
                    className={`btn ${timeRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePeriodChange('week')}
                  >
                    This Week
                  </button>
                  <button
                    className={`btn ${timeRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePeriodChange('month')}
                  >
                    This Month
                  </button>
                  <button
                    className={`btn ${timeRange === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handlePeriodChange('year')}
                  >
                    This Year
                  </button>
                </div>
              </div>
              <p className="text-muted">
                Key performance indicators for your printer e-commerce business
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<FaShoppingCart />}
            trend={8.5}
            trendDirection="up"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Total Revenue"
            value={stats.totalRevenue}
            formatValue={(val) => `KES ${val.toLocaleString()}`}
            icon={<FaMoneyBillWave />}
            trend={12.3}
            trendDirection="up"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Average Order Value"
            value={stats.averageOrderValue}
            formatValue={(val) => `KES ${val.toLocaleString()}`}
            icon={<FaChartLine />}
            trend={-2.1}
            trendDirection="down"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<FaHourglassHalf />}
            trend={5.2}
            trendDirection="up"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<FaUsers />}
            trend={7.8}
            trendDirection="up"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Total Admins"
            value={stats.totalAdmins}
            icon={<FaUserShield />}
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<FaBoxes />}
            trend={3.2}
            trendDirection="up"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Out of Stock"
            value={stats.outOfStockProducts}
            icon={<FaBoxOpen />}
            trend={10.5}
            trendDirection="up"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Active Products"
            value={stats.activeProducts}
            icon={<FaCheck />}
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Categories"
            value={stats.totalCategories}
            icon={<FaList />}
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatisticsCard
            title="Printer Types"
            value={stats.totalPrinterTypes}
            icon={<FaPrint />}
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Paybill Balance
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {stats.paybillBalance.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={refreshPaybillBalance}
                    title="Refresh Balance"
                  >
                    <FaSync />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">

        <div className="col-xl-8 col-lg-7">
          <DashboardCard
            title="Revenue Overview"
            className="chart-card mb-4"
            headerAction={
              <div className="dropdown">
                <button
                  className="btn btn-link btn-sm"
                  type="button"
                  id="revenueDropdown"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaEllipsisV />
                </button>
                <div
                  className="dropdown-menu dropdown-menu-right shadow"
                  aria-labelledby="revenueDropdown"
                >
                  <button
                    className="dropdown-item"
                    onClick={() => handlePeriodChange('week')}
                  >
                    <FaCalendarDay className="mr-2" />
                    This Week
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handlePeriodChange('month')}
                  >
                    <FaCalendarWeek className="mr-2" />
                    This Month
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => handlePeriodChange('year')}
                  >
                    <FaCalendarAlt className="mr-2" />
                    This Year
                  </button>
                </div>
              </div>
            }
          >
            {revenueData ? (
              <div style={{ width: '100%', height: '300px' }}>
                <RevenueChart data={revenueData?.items} />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <p className="text-muted">No revenue data available</p>
              </div>
            )}
          </DashboardCard>
        </div>

        <div className="col-xl-4 col-lg-5">
          <DashboardCard
            title="Sales Overview"
            className="sales-overview-card mb-4"
            headerAction={
              <div className="dropdown no-arrow">
                <button className="btn btn-link btn-sm dropdown-toggle" type="button" id="salesDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <FaEllipsisV />
                </button>
                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="salesDropdown">
                  <a className="dropdown-item" href="#" onClick={() => handlePeriodChange('week')}>Weekly</a>
                  <a className="dropdown-item" href="#" onClick={() => handlePeriodChange('month')}>Monthly</a>
                  <a className="dropdown-item" href="#" onClick={() => handlePeriodChange('year')}>Yearly</a>
                </div>
              </div>
            }
          >
            {salesData ? (
              <SalesOverview data={salesData} />
            ) : (
              <div className="text-center py-4">No sales data available</div>
            )}
          </DashboardCard>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">

          <DashboardCard title="Category Distribution" className="mb-4">
            <div style={{ width: '100%', height: 300 }}>
              {productCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoryData.map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <p className="text-muted">No category data available</p>
                </div>
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="col-lg-6">
          <DashboardCard title="Printer Types" className="mb-4">
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={printerTypesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Number of Printers" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <DashboardCard title="Recent Orders" className="mb-4">
            <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, index) => {
                      // Calculate total amount from order items
                      const totalAmount = order.orderItems.reduce(
                        (sum: number, item: { price: number; quantity: number; }) => sum + (item.price * item.quantity),
                        0
                      );

                      return (
                        <tr key={order.id || index}>
                          <td>{order.orderNumber}</td>
                          <td>{order.customerName || 'N/A'}</td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td>KES {totalAmount.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">No recent orders</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="text-center mt-3">
                <Link to="/printers/orders" className="btn btn-sm btn-primary">View All Orders</Link>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="col-lg-6">
          <DashboardCard title="Quick Actions" className="mb-4">
            <div className="quick-actions">
              <div className="row">
                <div className="col-md-6 mb-4">                  
                  <Link to="/printers/products" className="quick-action-card">
                    <FaPlusCircle className="quick-action-icon" />
                    <span className="quick-action-text">Add New Product</span>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/printers/orders" className="quick-action-card">
                    <FaTruck className="quick-action-icon" />
                    <span className="quick-action-text">Process Orders</span>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/printers/products" className="quick-action-card">
                    <FaBoxOpen className="quick-action-icon" />
                    <span className="quick-action-text">Update Stock</span>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/printers/reports" onClick={handleExportReport} className="quick-action-card">
                    <FaDownload className="quick-action-icon" />
                    <span className="quick-action-text">Generate Report</span>
                  </Link>
                </div>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <DashboardCard title="Top Products" className="mb-4">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="product-img mr-3">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={`${API_BASE_URL}/uploads/${product.images[0]}`}
                                alt={product.name}
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="no-image" style={{ width: '40px', height: '40px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FaImage />
                              </div>
                            )}
                          </div>
                          <div>
                            <strong>{product.name}</strong>
                            <div className="small text-muted">{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>{product.category.name}</td>
                      <td>KES {product.currentPrice.toLocaleString()}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <span className={`badge ${product.stockQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;