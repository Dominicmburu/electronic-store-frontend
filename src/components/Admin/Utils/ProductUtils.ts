// utils/ProductUtils.ts

/**
 * Utility functions for product management
 */

import { Product } from '../Services/ProductService';

/**
 * Format price with currency symbol and locale
 * @param price The price to format
 * @param currencySymbol The currency symbol to use (default: KES)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currencySymbol: string = 'KES'): string => {
  return `${currencySymbol} ${price.toLocaleString()}`;
};

/**
 * Calculate discount percentage
 * @param originalPrice The original price
 * @param currentPrice The current (discounted) price
 * @returns Discount percentage as an integer
 */
export const calculateDiscountPercentage = (originalPrice: number, currentPrice: number): number => {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
  
  const discount = originalPrice - currentPrice;
  const percentage = (discount / originalPrice) * 100;
  
  return Math.round(percentage);
};

/**
 * Get status label from product status
 * @param status The product status
 * @returns User-friendly status label
 */
export const getStatusLabel = (status?: string): string => {
  switch (status) {
    case 'active': return 'Active';
    case 'inactive': return 'Inactive';
    case 'out_of_stock': return 'Out of Stock';
    default: return status || 'Unknown';
  }
};

/**
 * Get CSS class for status badge
 * @param status The product status
 * @returns CSS class for the badge
 */
export const getStatusBadgeClass = (status?: string): string => {
  switch (status) {
    case 'active': return 'badge-success';
    case 'inactive': return 'badge-secondary';
    case 'out_of_stock': return 'badge-danger';
    default: return 'badge-secondary';
  }
};

/**
 * Get the image URL based on image path/name
 * @param imageName The image name or path
 * @returns Complete image URL
 */
export const getImageUrl = (imageName: string): string => {
  if (!imageName) return '/assets/placeholder-image.jpg';
  
  return imageName.startsWith('http') 
    ? imageName 
    : `${process.env.REACT_APP_API_URL || ''}/uploads/${imageName}`;
};

/**
 * Determine product status based on stock level
 * @param stock The current stock level
 * @returns Product status
 */
export const determineProductStatus = (stock: number): 'active' | 'out_of_stock' => {
  return stock > 0 ? 'active' : 'out_of_stock';
};

/**
 * Sort products by various criteria
 * @param products Array of products to sort
 * @param sortBy Sort criteria
 * @returns Sorted products array
 */
export const sortProducts = (
  products: Product[], 
  sortBy: 'name' | 'price_asc' | 'price_desc' | 'newest'
): Product[] => {
  const productsCopy = [...products];
  
  switch (sortBy) {
    case 'name':
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'price_asc':
      return productsCopy.sort((a, b) => a.currentPrice - b.currentPrice);
    case 'price_desc':
      return productsCopy.sort((a, b) => b.currentPrice - a.currentPrice);
    case 'newest':
      // Assuming products have a createdAt property
      return productsCopy.sort((a, b) => {
        if (!a.id || !b.id) return 0;
        return b.id - a.id; // Higher ID means newer product
      });
    default:
      return productsCopy;
  }
};

/**
 * Filter products based on search term and category
 * @param products Array of products to filter
 * @param searchTerm Search term for filtering
 * @param categoryId Category ID for filtering
 * @returns Filtered products array
 */
export const filterProducts = (
  products: Product[],
  searchTerm: string = '',
  categoryId?: number
): Product[] => {
  return products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(product.id).includes(searchTerm);
    
    const matchesCategory = !categoryId || product.categoryId === categoryId;
    
    return matchesSearch && matchesCategory;
  });
};