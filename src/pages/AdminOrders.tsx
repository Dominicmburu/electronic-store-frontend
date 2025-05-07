import React, { useState, useEffect, useContext } from 'react';
import { PageHeader, DashboardCard, LoadingSpinner } from '../components/Admin/common';
import '../styles/Admin/Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../contexts/UserContext';
import { API_BASE_URL } from '../api/main';
// Import React Icons instead of material icons
import {
  FaShoppingCart,
  FaCheckCircle,
  FaHourglassHalf,
  FaDollarSign,
  FaSearch,
  FaEye,
  FaSync,
  FaTrash,
  FaDownload,
  FaPrint,
} from 'react-icons/fa';
import { Product } from '../types/product';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  userId: number;
  orderDate: string;
  amount: number;
  status: string;
  paymentMethod: string;
  orderItems: OrderItem[];
  shippingAddress?: string;
  notes?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: Product;
}

const Orders: React.FC = () => {
  const { token } = useContext(UserContext) || {};
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<{ id: string, currentStatus: string } | null>(null);
  const [newStatus, setNewStatus] = useState('');
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
      // Simplified URL - we'll filter locally
      const url = `${API_BASE_URL}/orders/get-orders/all`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        // Calculate amount for each order based on items
        const ordersWithCalculatedAmount = (response.data.orders || response.data).map((order: Order) => {
          // Calculate amount from order items if it's missing or zero
          if (!order.amount || order.amount === 0) {
            const calculatedAmount = order.orderItems?.reduce((sum, item) => sum + (item.subtotal || item.price * item.quantity), 0) || 0;
            return { ...order, amount: calculatedAmount };
          }
          return order;
        });

        // Sort orders by date (most recent first)
        const sortedOrders = ordersWithCalculatedAmount.sort((a: { orderDate: string | number | Date; }, b: { orderDate: string | number | Date; }) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });

        setOrders(sortedOrders);
        
        // Calculate total pages based on filtered results
        const filteredCount = getFilteredOrders(sortedOrders, currentStatus, searchTerm).length;
        setTotalPages(Math.ceil(filteredCount / ordersPerPage));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get filtered orders based on search and status
  const getFilteredOrders = (ordersList: Order[], status: string, search: string) => {
    return ordersList.filter(order => {
      const matchesSearch =
        (order.orderNumber && order.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
        (order.id && typeof order.id === 'string' && order.id.toLowerCase().includes(search.toLowerCase())) ||
        (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = status === 'all' ||
        (order.status && order.status.toLowerCase() === status.toLowerCase());

      return matchesSearch && matchesStatus;
    });
  };

  const getOrderDetails = async (orderId: string) => {
    try {
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

  const openStatusUpdateModal = (orderId: string, currentStatus: string) => {
    setSelectedOrderForStatus({ id: orderId, currentStatus });
    setNewStatus(getNextStatus(currentStatus));
    setShowStatusModal(true);
  };

  const updateOrderStatus = async () => {
    if (!selectedOrderForStatus) return;
  
    setStatusUpdateLoading(true);
    try {
      // Use orderNumber for the API endpoint path, not the order ID
      const orderToUpdate = orders.find(o => o.id === selectedOrderForStatus.id);
      
      if (!orderToUpdate || !orderToUpdate.orderNumber) {
        throw new Error("Order number not found");
      }
      
      // Use orderNumber in the URL path instead of ID
      await axios.put(`${API_BASE_URL}/orders/${orderToUpdate.orderNumber}/status`, {
        status: newStatus
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Update the order in local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === selectedOrderForStatus.id ? { ...order, status: newStatus } : order
        )
      );
  
      // If we're updating the selected order, update that too
      if (selectedOrder && selectedOrder.id === selectedOrderForStatus.id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
  
      toast.success(`Order status updated to ${newStatus}`);
      setShowStatusModal(false);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const cancelOrder = async (orderId: string, orderNumber: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
        data: { orderNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(prevOrders =>
        prevOrders.filter(order => order.id !== orderId)
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setShowDetailModal(false);
      }

      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel order');
    }
  };

  const exportOrders = () => {
    // Export functionality (CSV/Excel)
    const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Payment Method', 'Items'];
    const csvContent =
      headers.join(',') + '\n' +
      filteredOrders.map(order => {
        return [
          order.orderNumber || order.id,
          order.customerName,
          order.orderDate,
          order.amount ? order.amount.toLocaleString() : '0',
          order.status,
          order.paymentMethod,
          order.orderItems?.length || 0
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
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get filtered orders based on search term and status filter
  const filteredOrders = getFilteredOrders(orders, currentStatus, searchTerm);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalRevenue = orders.reduce((sum, order) => {
    const orderAmount = order.amount || 0;
    return sum + orderAmount;
  }, 0);

  // Update paginate function to handle pagination properly
  const paginate = (pageNumber: number) => {
    // Ensure page number is within valid range
    const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(validPageNumber);
  };

  // Recalculate total pages when filters change
  useEffect(() => {
    const filteredCount = filteredOrders.length;
    const calculatedTotalPages = Math.max(1, Math.ceil(filteredCount / ordersPerPage));
    setTotalPages(calculatedTotalPages);
    
    // Reset to page 1 if current page is out of bounds
    if (currentPage > calculatedTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredOrders.length, searchTerm, currentStatus]);

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
              <FaSync className="mr-1" /> Refresh
            </button>
            <button className="btn btn-primary" onClick={exportOrders}>
              <FaDownload className="mr-1" /> Export
            </button>
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
                    Total Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaShoppingCart className="text-gray-300" style={{ fontSize: '2rem' }} />
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
                    Delivered Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaCheckCircle className="text-gray-300" style={{ fontSize: '2rem' }} />
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
                    Pending Orders
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {orders.filter(o => o.status?.toLowerCase() === 'pending').length}
                  </div>
                </div>
                <div className="col-auto">
                  <FaHourglassHalf className="text-gray-300" style={{ fontSize: '2rem' }} />
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
                    Total Revenue
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    KES {totalRevenue.toLocaleString()}
                  </div>
                </div>
                <div className="col-auto">
                  <FaDollarSign className="text-gray-300" style={{ fontSize: '2rem' }} />
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
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-md-end flex-wrap">
                <div className="btn-group status-filter">
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
            <FaShoppingCart className="empty-icon mb-3" style={{ fontSize: '3rem', opacity: 0.3 }} />
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
                      <td>{order.customerName || 'N/A'}</td>
                      <td>{formatDate(order.orderDate)}</td>
                      <td>KES {(order.amount || 0).toLocaleString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>{order.paymentMethod || 'N/A'}</td>
                      <td>{order.orderItems?.length || 0}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => getOrderDetails(order.id)}
                            title="View details"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => openStatusUpdateModal(order.id, order.status)}
                            title="Update status"
                          >
                            <FaSync />
                          </button>
                          {/* <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cancelOrder(order.id, order.orderNumber || order.id)}
                            title="Cancel order"
                          >
                            <FaTrash />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap">
                <div className="mb-2 mb-md-0">
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
                  
                  {(() => {
                    let pageNumbers = [];
                    let startPage: number;
                    let endPage: number;
                    
                    if (totalPages <= 5) {
                      // If total pages is 5 or less, show all page numbers
                      startPage = 1;
                      endPage = totalPages;
                    } else {
                      // More than 5 pages, we need to calculate what to show
                      if (currentPage <= 3) {
                        // Near the start
                        startPage = 1;
                        endPage = 5;
                      } else if (currentPage + 2 >= totalPages) {
                        // Near the end
                        startPage = totalPages - 4;
                        endPage = totalPages;
                      } else {
                        // Somewhere in the middle
                        startPage = currentPage - 2;
                        endPage = currentPage + 2;
                      }
                    }
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pageNumbers.push(
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => paginate(i)}
                          >
                            {i}
                          </button>
                        </li>
                      );
                    }
                    
                    return pageNumbers;
                  })()}
                  
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
            )}
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
                          <td>{formatDate(selectedOrder.orderDate)}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className={`badge ${getStatusBadgeClass(selectedOrder.status)} mr-2`}>
                                {selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1).toLowerCase()}
                              </span>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => openStatusUpdateModal(selectedOrder.id, selectedOrder.status)}
                                >
                                  Update Status
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Payment Method:</strong></td>
                          <td>{selectedOrder.paymentMethod || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Total Amount:</strong></td>
                          <td>KES {(selectedOrder.amount || 0).toLocaleString()}</td>
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
                          <td>{selectedOrder.customerName || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedOrder.customerEmail || 'N/A'}</td>
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
                      {selectedOrder.orderItems && selectedOrder.orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>{item.product.name || `Product #${item.productId}`}</td>
                          <td>{item.quantity}</td>
                          <td>KES {(item.price || 0).toLocaleString()}</td>
                          <td>KES {(item.subtotal || (item.price * item.quantity) || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="table-active">
                        <td colSpan={3} className="text-right"><strong>Total:</strong></td>
                        <td><strong>KES {(selectedOrder.amount || 0).toLocaleString()}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger mr-auto"
                  onClick={() => {
                    cancelOrder(selectedOrder.id, selectedOrder.orderNumber || selectedOrder.id);
                    setShowDetailModal(false);
                  }}
                >
                  <FaTrash className="mr-1" /> Cancel Order
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    window.print();
                  }}
                >
                  <FaPrint className="mr-1" /> Print
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

      {/* Status Update Modal */}
      {showStatusModal && selectedOrderForStatus && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Order Status</h5>
                <button type="button" className="close" onClick={() => setShowStatusModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="currentStatus">Current Status</label>
                  <input
                    type="text"
                    className="form-control"
                    id="currentStatus"
                    value={selectedOrderForStatus.currentStatus}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newStatus">New Status</label>
                  <select
                    className="form-control"
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map(status => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={updateOrderStatus}
                  disabled={statusUpdateLoading}
                >
                  {statusUpdateLoading ? 'Updating...' : 'Update Status'}
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

  return statusFlow[currentStatus?.toUpperCase()] || 'PROCESSING';
}

export default Orders;