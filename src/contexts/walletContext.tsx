import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from './UserContext';
import { API_BASE_URL } from '../api/main';

interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  status: string;
  reference: string;
  paymentMethod: string;
  createdAt: string;
  mpesaReceiptId?: string;
  description?: string;
}

interface Wallet {
  balance: number;
  lastTransactions: Transaction[];
}

interface WalletContextType {
  wallet: Wallet | null;
  loading: boolean;
  error: string | null;
  topUpWallet: (amount: number, phoneNumber: string) => Promise<string | undefined>;
  checkTransactionStatus: (transactionId: string) => Promise<Transaction | null>;
  payWithWallet: (orderId: number) => Promise<void>;
  getTransactionDetails: (transactionId: string) => Promise<Transaction | null>;
  refreshWallet: () => Promise<void>;
  withdrawFunds: (amount: number, phoneNumber: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useContext(UserContext) || {};

  const fetchWallet = async () => {
    setLoading(true);
    try {
      if (!token) {
        setWallet(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/mpesa/wallet/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setWallet(response.data.wallet);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 401) {
        // Not authenticated
        setWallet(null);
      } else {
        setError('Failed to fetch wallet');
        // console.error('Error fetching wallet:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [token]);

  const refreshWallet = async () => {
    return fetchWallet();
  };

  const topUpWallet = async (amount: number, phoneNumber: string): Promise<string | undefined> => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login to top up wallet');
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/mpesa/wallet/topup`,
        {
          amount,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Wallet top-up initiated. Check your phone to complete the payment.');
      return response.data.data.transactionId; // Return transaction ID for status checking
    } catch (err: any) {
      setError('Failed to top up wallet');
      toast.error(err.response?.data?.message || 'Failed to top up wallet');
      // console.error('Error topping up wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (transactionId: string): Promise<Transaction | null> => {
    try {
      if (!token) {
        toast.error('Please login to check transaction status');
        return null;  // Return null if the user is not logged in
      }
  
      // Send request to get the status of the transaction
      const response = await axios.get(`${API_BASE_URL}/mpesa/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Extract transaction status
      const transaction = response.data.data.transaction;
      const { status } = transaction;
  
      // Handle different transaction statuses
      if (status === 'COMPLETED') {
        toast.success('Transaction completed successfully');
        await fetchWallet(); // Refresh wallet data if the transaction is completed
      } else if (status === 'FAILED') {
        toast.error('Transaction failed');
      } else if (status === 'PENDING') {
        toast.info('Transaction is still processing');
      } else {
        toast.warning('Transaction status is unknown');
      }
  
      return transaction; // Return the transaction details (which can be processed further if needed)
  
    } catch (err: any) {
      // Handle error (e.g., network issues or API errors)
      console.error('Error checking transaction status:', err);
      toast.error('Failed to check transaction status');
      return null;  // Return null in case of an error
    }
  };
  

  const payWithWallet = async (orderId: number) => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login to pay with wallet');
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE_URL}/mpesa/wallet/pay`,
        {
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Payment successful using wallet balance');
      await fetchWallet();
    } catch (err: any) {
      setError('Failed to pay with wallet');
      toast.error(err.response?.data?.message || 'Failed to pay with wallet');
      // console.error('Error paying with wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionDetails = async (transactionId: string): Promise<Transaction | null> => {
    try {
      if (!token) {
        toast.error('Please login to view transaction details');
        return null;
      }

      const response = await axios.get(`${API_BASE_URL}/mpesa/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data.transaction;
    } catch (err: any) {
      // console.error('Error getting transaction details:', err);
      toast.error('Failed to get transaction details');
      return null;
    }
  };

  const withdrawFunds = async (amount: number, phoneNumber: string): Promise<string> => {
    setLoading(true);
    try {
      if (!token) {
        toast.error('Please login to withdraw funds');
        setLoading(false);
        return '';
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/mpesa/wallet/withdraw`, // Replace with your actual endpoint for withdrawal
        {
          amount,
          phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success('Withdrawal initiated. Check your phone for confirmation.');
      return response.data.data.transactionId; // Return transaction ID for status checking
    } catch (err: any) {
      setError('Failed to withdraw funds');
      toast.error(err.response?.data?.message || 'Failed to withdraw funds');
      // console.error('Error withdrawing funds:', err);
      return ''; // Return an empty string or you can choose to throw the error
    } finally {
      setLoading(false);
    }
  };  

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        error,
        topUpWallet,
        checkTransactionStatus,
        payWithWallet,
        getTransactionDetails,
        refreshWallet,
        withdrawFunds,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};