import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/main';

// Define types
interface SalesCategory {
  id: number;
  name: string;
  value: number;
  color: string;
  description: string;
  image?: string;
  orderCount?: number;
  trend?: number;
}

interface SalesData {
  categories: SalesCategory[];
  total: number;
  trend: number;
}

interface CategorySalesResponse {
  categoryId: number;
  categoryName: string;
  totalSales: number;
  orderCount: number;
  trend: number;
  period: string;
  startDate: string;
  endDate: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  images: string[];
  printerTypeId: number;
  printerType?: {
    id: number;
    name: string;
    printerCount: number;
  };
}

interface CategoriesResponse {
  page: number;
  totalPages: number;
  categories: Category[];
}

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface SalesParams {
  period?: PeriodType;
}

export const useSalesOverview = (token: string, initialParams: SalesParams = { period: 'monthly' }) => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<SalesParams>(initialParams);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First fetch all categories
        const categoriesResponse = await axios.get<CategoriesResponse>(`${API_BASE_URL}/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            page: 1,
            limit: 100 // Fetch more categories to get comprehensive data
          }
        });

        const categories = categoriesResponse.data.categories || [];
        
        const salesPromises = categories.map(async (category) => {
          try {
            const response = await axios.get<CategorySalesResponse>(`${API_BASE_URL}/categories/${category.id}/sales`, {
              params: {
                period: params.period
              },
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            return {
              ...category,
              value: response.data.totalSales,
              orderCount: response.data.orderCount,
              categoryTrend: response.data.trend
            };
          } catch (err) {
            console.error(`Error fetching sales for category ${category.id}:`, err);
            return {
              ...category,
              value: 0,
              orderCount: 0,
              categoryTrend: 0
            };
          }
        });

        const categorySales = await Promise.all(salesPromises);

        // Calculate total sales
        const total = categorySales.reduce((sum, category) => sum + (category.value || 0), 0);
        
        // Calculate overall trend (average of all category trends)
        const validTrends = categorySales
          .filter(cat => cat.categoryTrend !== undefined && !isNaN(cat.categoryTrend))
          .map(cat => cat.categoryTrend || 0);
          
        const trend = validTrends.length > 0
          ? validTrends.reduce((sum, trend) => sum + trend, 0) / validTrends.length
          : 0;

        const sortedCategories = [...categorySales].sort((a, b) => (b.value || 0) - (a.value || 0));
        
        setSalesData({
          categories: sortedCategories.map(category => ({
            id: category.id,
            name: category.name,
            description: category.description,
            value: category.value || 0,
            orderCount: category.orderCount || 0,
            color: getCategoryColor(category.name),
            image: category.images?.[0],
            trend: category.categoryTrend
          })),
          total,
          trend: parseFloat(trend.toFixed(1))
        });

      } catch (err) {
        setError('Failed to load sales overview');
        // Provide fallback data
        setSalesData({
          categories: [],
          total: 0,
          trend: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSalesData();
    }
  }, [token, params.period]);

  const updateParams = (newParams: Partial<SalesParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  return {
    salesData,
    isLoading,
    error,
    params,
    updateParams,
  };
};

// Helper function to assign colors to categories
const getCategoryColor = (name: string): string => {
  const colorMap: Record<string, string> = {
    'Direct Thermal Printers': '#0066cc',
    'Laser Printers': '#4d94ff',
    '3D Printers': '#ff6b6b',
    'Photo Printers': '#33cc99',
    'All-in-One': '#ffbb33',
    'Inkjet Printers': '#ff9966',
    'Label Printers': '#9966ff',
    'Dot Matrix Printers': '#66ccff',
    'Wide Format Printers': '#66ff99',
    'Accessories': '#c0c0c0',
    'Inks & Toners': '#8c8c8c',
    'Paper Products': '#d9b38c'
  };
  
  // Return the mapped color or generate a random color with good contrast
  return colorMap[name] || generateContrastColor();
};

// Helper function to generate random colors with good contrast
const generateContrastColor = (): string => {
  // Generate somewhat muted but still visually distinct colors
  const h = Math.floor(Math.random() * 360); // hue
  const s = 40 + Math.floor(Math.random() * 30); // saturation between 40-70%
  const l = 50 + Math.floor(Math.random() * 10); // lightness between 50-60%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};