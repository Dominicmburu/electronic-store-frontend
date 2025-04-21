// components/Admin/Context/useRevenueData.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/main';

// Define types
export interface RevenueItem {
  date: string;
  revenue: number;
  orders: number;
}

export interface RevenueData {
  items: RevenueItem[];
  totalRevenue: number;
  trend: number;
  periodLabel: string;
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface RevenueParams {
  period?: PeriodType;
}

export const useRevenueData = (token: string, initialParams: RevenueParams = { period: 'monthly' }) => {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<RevenueParams>(initialParams);

  useEffect(() => {
    const fetchRevenueData = async () => {
      if (!token) {
        setError('Authentication token is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch revenue data from the API
        const response = await axios.get(`${API_BASE_URL}/orders/analytics/revenue`, {
          params: {
            period: params.period
          },
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.data || !response.data.items || response.data.items.length === 0) {
          const mockData = generateMockRevenueData(params.period || 'monthly');
          setRevenueData(mockData);
        } else {
          setRevenueData(response.data);
        }
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data');
        
        // Create mock data for demonstration purposes
        const mockData = generateMockRevenueData(params.period || 'monthly');
        setRevenueData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueData();
  }, [token, params.period]);

  const updateParams = (newParams: Partial<RevenueParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    revenueData,
    isLoading,
    error,
    params,
    updateParams,
  };
};

// Function to generate mock revenue data for demonstration
function generateMockRevenueData(period: PeriodType): RevenueData {
  const now = new Date();
  const items: RevenueItem[] = [];
  let totalRevenue = 0;
  let periodLabel = '';
  let numPoints = 0;
  
  // Set up parameters based on the period
  switch (period) {
    case 'daily':
      numPoints = 24; // 24 hours
      periodLabel = 'Today';
      for (let i = 0; i < numPoints; i++) {
        const hour = i.toString().padStart(2, '0');
        const revenue = Math.floor(Math.random() * 5000) + 1000;
        const orders = Math.floor(Math.random() * 10) + 1;
        items.push({
          date: `${hour}:00`,
          revenue,
          orders
        });
        totalRevenue += revenue;
      }
      break;
      
    case 'weekly':
      numPoints = 7; // 7 days
      periodLabel = 'This Week';
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i < numPoints; i++) {
        const dayIndex = (now.getDay() - 6 + i + 7) % 7;
        const revenue = Math.floor(Math.random() * 20000) + 5000;
        const orders = Math.floor(Math.random() * 30) + 5;
        items.push({
          date: dayNames[dayIndex],
          revenue,
          orders
        });
        totalRevenue += revenue;
      }
      break;
      
    case 'yearly':
      numPoints = 12; // 12 months
      periodLabel = 'This Year';
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < numPoints; i++) {
        const revenue = Math.floor(Math.random() * 200000) + 50000;
        const orders = Math.floor(Math.random() * 100) + 20;
        items.push({
          date: monthNames[i],
          revenue,
          orders
        });
        totalRevenue += revenue;
      }
      break;
      
    case 'monthly':
    default:
      numPoints = 30; // ~30 days
      periodLabel = 'This Month';
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const dayStr = i.toString().padStart(2, '0');
        const revenue = Math.floor(Math.random() * 10000) + 2000;
        const orders = Math.floor(Math.random() * 20) + 3;
        items.push({
          date: dayStr,
          revenue,
          orders
        });
        totalRevenue += revenue;
      }
      break;
  }
  
  // Calculate a mock trend (-10% to +20%)
  const trend = (Math.random() * 30) - 10;
  
  return {
    items,
    totalRevenue,
    trend: parseFloat(trend.toFixed(1)),
    periodLabel
  };
}

export default useRevenueData;