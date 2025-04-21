// pages/orders/Orders.tsx
import React, { useState, useEffect } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import '../styles/Admin/Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: number;
    name: string;
    email: string;
  };
  date: string;
  amount: number;
  status: string;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress?: string;
  notes?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const ordersPerPage = 10;
  
  // Status options for orders
  const statusOptions = [
    'PENDING', 
    'PROCESSING', 
    'SHIPPED', 
    'DELIVERED', 
    'CANCELLED'
  ];

  useEffect(() => {
    fetchOrders();
  }, [currentPage, currentStatus]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let url = `http://127.0.0.1:5000/api/orders?page=${currentPage}`;
      if (currentStatus !== 'all') {
        url += `&status=${currentStatus}`;
      }
      
      const response = await axios.get(url);
      
      // Adjust this according to your API's actual response structure
      if (response.data) {
        setOrders(response.data.orders || response.data);
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      // You might have a separate endpoint for order details, or just use the order from the list
      const orderToView = orders.find(order => order.id === orderId);
      
      if (orderToView) {
        setSelectedOrder(orderToView);
        setShowDetailModal(true);
      } else {
        toast.error('Order details not found');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdateLoading(true);
    try {
      await axios.put(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
        status: newStatus
      });
      
      // Update the order in local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // If we're updating the selected order, update that too
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      await axios.delete(`http://127.0.0.1:5000/api/orders/${orderId}`, {
        data: { orderNumber }
      });
      
      // Remove the order from local state or update its status
      setOrders(prevOrders => 
        prevOrders.filter(order => order.id !== orderId)
      );
      
      // Close the modal if we're cancelling the selected order
      if (selectedOrder && selectedOrder.id === orderId) {
        setShowDetailModal(false);
      }
      
      toast.success('Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const exportOrders = () => {
    // Implement export functionality (CSV/Excel)
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Payment Method', 'Items'];
    const csvContent = 
      headers.join(',') + '\n' + 
      filteredOrders.map(order => {
        return [
          order.orderNumber || order.id,
          order.customer.name,
          order.date,
          order.amount,
          order.status,
          order.paymentMethod,
          order.items.length
        ].join(',');
      }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-primary';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    // Format the date as needed (assuming ISO string format)
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = currentStatus === 'all' || 
                         (order.status && order.status.toLowerCase() === currentStatus.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination info
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="orders-container">
      <PageHeader 
        title="Orders" 
        subtitle="Manage all customer orders"
        actions={
          <div className="d-flex">
            <button className="btn btn-success mr-2" onClick={() => fetchOrders()}>
              <i className="material-icons mr-1">refresh</i> Refresh
            </button>
            <button className="btn btn-primary" onClick={exportOrders}>
              <i className="material-icons mr-1">download</i> Export
            </button>
          </div>
        }
      />
      
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>shopping_cart</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Delivered Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>check_circle</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Pending Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>hourglass_empty</i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <i className="material-icons text-gray-300" style={{ fontSize: '2rem' }}>attach_money</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DashboardCard title="Search and Filter Orders" className="orders-card">
        
        <div className="order-filters mb-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders by ID or customer..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="material-icons">search</i>
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end">
                <div className="btn-group">
                  <button 
                    className={`btn ${currentStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => {
                      setCurrentStatus('all');
                      setCurrentPage(1);
                    }}
                  >
                    All
                  </button>
                  {statusOptions.map(status => (
                    <button 
                      key={status}
                      className={`btn ${currentStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => {
                        setCurrentStatus(status);
                        setCurrentPage(1);
                      }}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {currentOrders.length === 0 ? (
          <div className="text-center py-5">
            <i className="material-icons empty-icon">shopping_cart</i>
            <h4>No orders found</h4>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Items</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td><strong>{order.orderNumber || order.id}</strong></td>
                      <td>{order.customer?.name || 'N/A'}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>KES {order.amount.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.items?.length || 0}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => getOrderDetails(order.id)}
                          >
                            <i className="material-icons">visibility</i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => {
                              // Open status dropdown
                              const currentStatus = order.status;
                              const nextStatus = getNextStatus(currentStatus);
                              if (confirm(`Update order status from ${currentStatus} to ${nextStatus}?`)) {
                                updateOrderStatus(order.id, nextStatus);
                              }
                            }}
                          >
                            <i className="material-icons">update</i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelOrder(order.id, order.orderNumber || order.id)}
                          >
                            <i className="material-icons">delete</i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? 
                    (currentPage + i > totalPages ? totalPages - 4 + i : currentPage - 2 + i) : 
                    i + 1;
                  
                  if (pageNum <= totalPages && pageNum > 0) {
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  }
                  return null;
                })}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </DashboardCard>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details - {selectedOrder.orderNumber || selectedOrder.id}</h5>
                <button type="button" className="close" onClick={() => setShowDetailModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Order Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Order ID:</strong></td>
                          <td>{selectedOrder.orderNumber || selectedOrder.id}</td>
                        </tr>
                        <tr>
                          <td><strong>Date:</strong></td>
                          <td>{formatDate(selectedOrder.date)}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`badge ${getStatusBadgeClass(selectedOrder.status)} mr-2`}>
                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1).toLowerCase()}
                              </span>
                              <div className="dropdown">
                                <button 
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                  type="button" 
                                  id="statusDropdown" 
                                  data-toggle="dropdown" 
                                  aria-haspopup="true" 
                                  aria-expanded="false"
                                  disabled={statusUpdateLoading}
                                >
                                  {statusUpdateLoading ? 'Updating...' : 'Update'}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="statusDropdown">
                                  {statusOptions.map(status => (
                                    <button 
                                      key={status} 
                                      className="dropdown-item" 
                                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                      disabled={selectedOrder.status === status}
                                    >
                                      {status.charAt(0) + status.slice(1).toLowerCase()}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method:</strong></td>
                          <td>{selectedOrder.paymentMethod}</td>
                        </tr>
                        <tr>
                          <td><strong>Total Amount:</strong></td>
                          <td>KES {selectedOrder.amount.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="border-bottom pb-2">Customer Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedOrder.customer?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedOrder.customer?.email || 'N/A'}</td>
                        </tr>
                        {selectedOrder.shippingAddress && (
                          <tr>
                            <td><strong>Shipping Address:</strong></td>
                            <td>{selectedOrder.shippingAddress}</td>
                          </tr>
                        )}
                        {selectedOrder.notes && (
                          <tr>
                            <td><strong>Notes:</strong></td>
                            <td>{selectedOrder.notes}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <h6 className="border-bottom pb-2">Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="thead-light">
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items && selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName || `Product #${item.productId}`}</td>
                          <td>{item.quantity}</td>
                          <td>KES {item.price.toLocaleString()}</td>
                          <td>KES {item.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="table-active">
                        <td colSpan={3} className="text-right"><strong>Total:</strong></td>
                        <td><strong>KES {selectedOrder.amount.toLocaleString()}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => {
                    cancelOrder(selectedOrder.id, selectedOrder.orderNumber || selectedOrder.id);
                    setShowDetailModal(false);
                  }}
                >
                  Cancel Order
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => {
                    // Print order function
                    window.print();
                  }}
                >
                  <i className="material-icons mr-1">print</i> Print
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

// Helper function to determine the next logical status in the order flow
function getNextStatus(currentStatus: string): string {
  const statusFlow: Record<string, string> = {
    'PENDING': 'PROCESSING',
    'PROCESSING': 'SHIPPED',
    'SHIPPED': 'DELIVERED',
    'DELIVERED': 'DELIVERED', // Already at final state
    'CANCELLED': 'PENDING' // If we want to reactivate
  };
  
  return statusFlow[currentStatus.toUpperCase()] || 'PROCESSING';
}

export default Orders;