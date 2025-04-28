import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';

export interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  description: string | null;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED';
  reference: string;
  paymentMethod: string;
  walletId: number | null;
  userId: number;
  orderId: number | null;
  mpesaReceiptId: string | null;
  createdAt: string;
  updatedAt: string;
  metaData: any;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber: string;
    paymentMethods: Array<{
      type: string;
      details: string;
    }>;
  };
  order: {
    id: number;
    orderNumber: string;
    orderDate: string;
    status: string;
  } | null;
  wallet: {
    id: number;
    balance: number;
  } | null;
}

export interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface RefundRequest {
  orderId: string;
  reason: string;
}

export interface TransactionStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
}

class PaymentService {
  // Get all transactions with pagination
  async getAllTransactions(page: number = 1, limit: number = 10, token?: string): Promise<TransactionResponse> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/mpesa/transactions`, {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  // Get transaction by ID
  async getTransactionById(id: number, token: string): Promise<Transaction> {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/mpesa/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw error;
    }
  }

  // Update transaction status
  async updateTransactionStatus(
    id: number, 
    newStatus: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED', 
    token: string
  ): Promise<Transaction> {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/mpesa/transaction/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for transaction with ID ${id}:`, error);
      throw error;
    }
  }

  // Request refund
  async requestRefund(refundData: RefundRequest, token: string): Promise<any> {
    try {
      const response = await axiosInstance.post(
        `${API_BASE_URL}/mpesa/refund/request`,
        refundData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error requesting refund:', error);
      throw error;
    }
  }

  // Calculate stats from transactions
  calculateStats(transactions: Transaction[]): TransactionStats {
    const stats: TransactionStats = {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      refunded: 0
    };

    transactions.forEach(transaction => {
      stats.total += transaction.amount;

      switch (transaction.status) {
        case 'COMPLETED':
          stats.completed += transaction.amount;
          break;
        case 'PENDING':
          stats.pending += transaction.amount;
          break;
        case 'FAILED':
          stats.failed += transaction.amount;
          break;
        case 'REFUNDED':
          stats.refunded += transaction.amount;
          break;
      }
    });

    return stats;
  }

  // Handle MPESA receipt and update transaction details
  async handleMpesaReceipt(transactionId: number, mpesaReceiptId: string, token: string): Promise<Transaction> {
    try {
      const response = await axiosInstance.put(
        `${API_BASE_URL}/mpesa/transaction/${transactionId}/update-receipt`,
        { mpesaReceiptId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating transaction with M-Pesa receipt:', error);
      throw error;
    }
  }
}

export default new PaymentService();