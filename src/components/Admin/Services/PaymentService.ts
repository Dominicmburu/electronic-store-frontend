import axiosInstance from '../../../api/axiosInstance';
import { API_BASE_URL } from '../../../api/main';

export interface Transaction {
    id: string;
    amount: number;
    customerId: string;
    customerName: string;
    orderId: string;
    method: string;
    status: 'completed' | 'pending' | 'failed' | 'refunded';
    date: string;
    transactionId: string;
    phoneNumber?: string;
    receiptNumber?: string;
    merchantRequestId?: string;
    checkoutRequestId?: string;
    refundReason?: string;
    mpesaReceiptId?: string;  // Added mpesaReceiptId here
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
    // Get all transactions
    async getAllTransactions(token: string): Promise<Transaction[]> {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/mpesa/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.transactions.map((transaction: any) => ({
                ...transaction,
                mpesaReceiptId: transaction.mpesaReceiptId || '', // Make sure mpesaReceiptId is always available
            }));
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    // Get transaction by ID
    async getTransactionById(id: string, token: string): Promise<Transaction> {
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
    async updateTransactionStatus(id: string, status: string, token: string): Promise<Transaction> {
        try {
            const response = await axiosInstance.put(
                `${API_BASE_URL}/mpesa/transaction/${id}/status`,
                { status },
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

    // Get transaction stats
    async getTransactionStats(token: string): Promise<TransactionStats> {
        try {
            const response = await axiosInstance.get(`${API_BASE_URL}/mpesa/transaction/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch {
            // If the endpoint doesn't exist, calculate stats from all transactions
            const transactions = await this.getAllTransactions(token);

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
                    case 'completed':
                        stats.completed += transaction.amount;
                        break;
                    case 'pending':
                        stats.pending += transaction.amount;
                        break;
                    case 'failed':
                        stats.failed += transaction.amount;
                        break;
                    case 'refunded':
                        stats.refunded += transaction.amount;
                        break;
                }
            });

            return stats;
        }
    }

    // Handle MPESA receipt and update transaction details (for when mpesaReceiptId is available)
    async handleMpesaReceipt(transactionId: string, mpesaReceiptId: string, token: string): Promise<Transaction> {
        try {
            // Update transaction with mpesaReceiptId
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
