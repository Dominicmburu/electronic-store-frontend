// import React, { useState } from 'react';
// import { PageHeader, DataTable, StatusBadge } from './common';
// import { formatDate } from '../../utils/dateUtils';
// import styles from '../../styles/pages/MpesaTransactions.module.css';

// const MpesaTransactions: React.FC = () => {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//   });
  
//   React.useEffect(() => {
//     // Fetch M-Pesa transactions
//     const fetchTransactions = async () => {
//       try {
//         const response = await fetch(`/api/admin/payments/mpesa?page=${pagination.page}&limit=${pagination.limit}`);
//         const data = await response.json();
        
//         if (data.success) {
//           setTransactions(data.transactions);
//           setPagination({
//             ...pagination,
//             total: data.total,
//           });
//         } else {
//           console.error('Error fetching M-Pesa transactions:', data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching M-Pesa transactions:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTransactions();
//   }, [pagination.page, pagination.limit]);
  
//   const columns = [
//     { field: 'transactionId', header: 'Transaction ID' },
//     { field: 'phoneNumber', header: 'Phone Number' },
//     { field: 'amount', header: 'Amount', render: (transaction: any) => (
//       <span>KES {transaction.amount.toLocaleString()}</span>
//     ), sortable: true },
//     { field: 'date', header: 'Date', render: (transaction: any) => (
//       <span>{formatDate(transaction.createdAt)}</span>
//     ), sortable: true },
//     { field: 'orderId', header: 'Order ID', render: (transaction: any) => (
//       transaction.orderId ? (
//         <a href={`/orders/${transaction.orderId}`} className={styles.orderLink}>
//           {transaction.orderId}
//         </a>
//       ) : (
//         <span>N/A</span>
//       )
//     )},
//     { field: 'status', header: 'Status', render: (transaction: any) => (
//       <StatusBadge 
//         status={transaction.status} 
//         statusMap={{
//           completed: { label: 'Completed', color: 'success' },
//           pending: { label: 'Pending', color: 'warning' },
//           failed: { label: 'Failed', color: 'danger' },
//         }} 
//       />
//     )},
//     { field: 'actions', header: 'Actions', render: (transaction: any) => (
//       <div className={styles.actionButtons}>
//         <button className={styles.viewButton}>
//           <span className="material-icons">receipt_long</span>
//         </button>
//       </div>
//     )},
//   ];
  
//   return (
//     <div className={styles.transactionsContainer}>
//       <PageHeader 
//         title="M-Pesa Transactions" 
//         subtitle="View and manage M-Pesa payment transactions" 
//       />
      
//       <DataTable 
//         columns={columns} 
//         data={transactions} 
//         isLoading={isLoading} 
//         pagination={true}
//         paginationState={pagination}
//         onPaginationChange={setPagination}
//         searchable={true}
//         searchFields={['transactionId', 'phoneNumber', 'orderId']}
//       />
//     </div>
//   );
// };

// export default MpesaTransactions;