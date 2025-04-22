import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, DataTable, StatusBadge } from './common';
import { OrderFilters } from '../../components/orders';
import { useOrdersList } from '../../features/orders/hooks/useOrdersList';
import { formatDate } from '../../utils/dateUtils';
import styles from '../../styles/pages/Orders.module.css';

const Orders: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: { start: null, end: null },
    paymentMethod: '',
  });
  
  const { orders, isLoading, pagination, setPagination } = useOrdersList(filters);
  
  const columns = [
    { field: 'id', header: 'Order ID' },
    { field: 'customer', header: 'Customer', render: (order: any) => (
      <div className={styles.customerInfo}>
        <span>{order.customer?.name || 'Guest'}</span>
        <small>{order.customer?.email || 'N/A'}</small>
      </div>
    )},
    { field: 'date', header: 'Date', render: (order: any) => (
      <span>{formatDate(order.createdAt)}</span>
    ), sortable: true },
    { field: 'total', header: 'Total', render: (order: any) => (
      <span>KES {order.total.toLocaleString()}</span>
    ), sortable: true },
    { field: 'paymentMethod', header: 'Payment Method', render: (order: any) => (
      <span className={styles.paymentMethod}>
        <span className={`material-icons ${styles.paymentIcon}`}>
          {order.paymentMethod === 'mpesa' ? 'smartphone' : 'account_balance_wallet'}
        </span>
        {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Wallet'}
      </span>
    )},
    { field: 'status', header: 'Status', render: (order: any) => (
      <StatusBadge 
        status={order.status} 
        statusMap={{
          pending: { label: 'Pending', color: 'warning' },
          processing: { label: 'Processing', color: 'info' },
          shipped: { label: 'Shipped', color: 'primary' },
          delivered: { label: 'Delivered', color: 'success' },
          cancelled: { label: 'Cancelled', color: 'danger' },
        }} 
      />
    )},
    { field: 'actions', header: 'Actions', render: (order: any) => (
      <div className={styles.actionButtons}>
        <Link to={`/orders/${order.id}`} className={styles.viewButton}>
          <span className="material-icons">visibility</span>
        </Link>
      </div>
    )},
  ];
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };
  
  return (
    <div className={styles.ordersContainer}>
      <PageHeader 
        title="Orders" 
        subtitle="Manage customer orders" 
      />
      
      <OrderFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <DataTable 
        columns={columns} 
        data={orders || []} 
        isLoading={isLoading} 
        pagination={true}
        paginationState={pagination}
        onPaginationChange={setPagination}
        searchable={true}
        searchFields={['id', 'customer.name', 'customer.email']}
      />
    </div>
  );
};

export default Orders;