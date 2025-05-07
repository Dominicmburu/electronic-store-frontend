// // components/Orders/OrderDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import { DashboardCard } from '../components/Admin/common';
// import { getOrders, getOrderStats, Order } from '../services/OrderService';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// const OrderDashboard: React.FC = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [dateRange, setDateRange] = useState('month'); // week, month, year
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     processingOrders: 0,
//     shippedOrders: 0,
//     deliveredOrders: 0,
//     cancelledOrders: 0,
//     totalRevenue: 0,
//     averageOrderValue: 0
//   });

//   // Chart colors
//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000'];
  
//   useEffect(() => {
//     fetchOrders();
//   }, [dateRange]);

//   const fetchOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await getOrders(1); // Get all orders, in a real app you'd add date filtering
//       let ordersData = Array.isArray(response) ? response : response.orders || [];
      
//       // Filter by date range
//       ordersData = filterOrdersByDateRange(ordersData, dateRange);
      
//       setOrders(ordersData);
//       setStats(getOrderStats(ordersData));
//     } catch (error) {
//       console.error('Error fetching order data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filterOrdersByDateRange = (orders: Order[], range: string) => {
//     const now = new Date();
//     const filterDate = new Date();
    
//     switch (range) {
//       case 'week':
//         filterDate.setDate(now.getDate() - 7);
//         break;
//       case 'month':
//         filterDate.setMonth(now.getMonth() - 1);
//         break;
//       case 'year':
//         filterDate.setFullYear(now.getFullYear() - 1);
//         break;
//       default:
//         filterDate.setMonth(now.getMonth() - 1); // Default to 1 month
//     }
    
//     return orders.filter(order => new Date(order.date) >= filterDate);
//   };

//   // Data for status distribution pie chart
//   const statusData = [
//     { name: 'Pending', value: stats.pendingOrders },
//     { name: 'Processing', value: stats.processingOrders },
//     { name: 'Shipped', value: stats.shippedOrders },
//     { name: 'Delivered', value: stats.deliveredOrders },
//     { name: 'Cancelled', value: stats.cancelledOrders }
//   ];

//   // Data for daily/weekly revenue bar chart
//   const getRevenueChartData = () => {
//     // Group orders by date
//     const ordersByDate = orders.reduce((acc: Record<string, number>, order) => {
//       const date = new Date(order.date).toISOString().split('T')[0];
//       if (!acc[date]) {
//         acc[date] = 0;
//       }
//       acc[date] += order.amount;
//       return acc;
//     }, {});

//     // Convert to array for chart
//     return Object.entries(ordersByDate)
//       .map(([date, amount]) => ({
//         date,
//         revenue: amount
//       }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       .slice(-10); // Last 10 days/entries
//   };

//   return (
//     <div className="order-dashboard">
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <DashboardCard title="Orders by Status" className="h-100">
//             <div className="mb-3">
//               <div className="btn-group">
//                 <button 
//                   className={`btn ${dateRange === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setDateRange('week')}
//                 >
//                   This Week
//                 </button>
//                 <button 
//                   className={`btn ${dateRange === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setDateRange('month')}
//                 >
//                   This Month
//                 </button>
//                 <button 
//                   className={`btn ${dateRange === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
//                   onClick={() => setDateRange('year')}
//                 >
//                   This Year
//                 </button>
//               </div>
//             </div>
            
//             <div className="text-center mb-4">
//               <h4>Total Orders: {stats.totalOrders}</h4>
//               <h5>Total Revenue: KES {stats.totalRevenue.toLocaleString()}</h5>
//               <p>Average Order: KES {stats.averageOrderValue.toLocaleString()}</p>
//             </div>
            
//             <div style={{ width: '100%', height: 300 }}>
//               {isLoading ? (
//                 <div className="text-center py-5">Loading...</div>
//               ) : (
//                 <ResponsiveContainer>
//                   <PieChart>
//                     <Pie
//                       data={statusData}
//                       cx="50%"
//                       cy="50%"
//                       labelLine={true}
//                       label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       outerRadius={80}
//                       fill="#8884d8"
//                       dataKey="value"
//                     >
//                       {statusData.map((index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => [`${value} orders`, 'Quantity']} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </DashboardCard>
//         </div>
        
//         <div className="col-md-6">
//           <DashboardCard title="Revenue Trend" className="h-100">
//             <div style={{ width: '100%', height: 300 }}>
//               {isLoading ? (
//                 <div className="text-center py-5">Loading...</div>
//               ) : (
//                 <ResponsiveContainer>
//                   <BarChart
//                     data={getRevenueChartData()}
//                     margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis 
//                       dataKey="date" 
//                       angle={-45} 
//                       textAnchor="end"
//                       height={70}
//                       tick={{ fontSize: 12 }}
//                     />
//                     <YAxis />
//                     <Tooltip formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Revenue']} />
//                     <Legend />
//                     <Bar dataKey="revenue" name="Revenue" fill="#82ca9d" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </DashboardCard>
//         </div>
//       </div>
      
//       <DashboardCard title="Order Performance Metrics">
//         <div className="row">
//           <div className="col-md-3 mb-4">
//             <div className="card border-left-primary shadow h-100 py-2">
//               <div className="card-body">
//                 <div className="row no-gutters align-items-center">
//                   <div className="col mr-2">
//                     <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
//                       Conversion Rate
//                     </div>
//                     <div className="h5 mb-0 font-weight-bold text-gray-800">
//                       {isLoading ? '...' : '35%'}
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>show_chart</i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-3 mb-4">
//             <div className="card border-left-success shadow h-100 py-2">
//               <div className="card-body">
//                 <div className="row no-gutters align-items-center">
//                   <div className="col mr-2">
//                     <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
//                       Fulfillment Rate
//                     </div>
//                     <div className="h5 mb-0 font-weight-bold text-gray-800">
//                       {isLoading ? '...' : 
//                         `${stats.totalOrders ? 
//                           (stats.deliveredOrders / stats.totalOrders * 100).toFixed(1) : 0}%`}
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>local_shipping</i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-3 mb-4">
//             <div className="card border-left-info shadow h-100 py-2">
//               <div className="card-body">
//                 <div className="row no-gutters align-items-center">
//                   <div className="col mr-2">
//                     <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
//                       Average Processing Time
//                     </div>
//                     <div className="h5 mb-0 font-weight-bold text-gray-800">
//                       {isLoading ? '...' : '1.5 days'}
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>access_time</i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="col-md-3 mb-4">
//             <div className="card border-left-warning shadow h-100 py-2">
//               <div className="card-body">
//                 <div className="row no-gutters align-items-center">
//                   <div className="col mr-2">
//                     <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
//                       Cancellation Rate
//                     </div>
//                     <div className="h5 mb-0 font-weight-bold text-gray-800">
//                       {isLoading ? '...' : 
//                         `${stats.totalOrders ? 
//                           (stats.cancelledOrders / stats.totalOrders * 100).toFixed(1) : 0}%`}
//                     </div>
//                   </div>
//                   <div className="col-auto">
//                     <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>cancel</i>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </DashboardCard>
//     </div>
//   );
// };

// export default OrderDashboard;