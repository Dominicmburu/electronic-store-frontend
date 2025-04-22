// utils/dateUtils.ts
/**
 * Format a date string or Date object to a readable format
 * @param dateString - Date string or Date object to format
 * @param options - Intl.DateTimeFormatOptions for customizing the format
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string | Date,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-KE', options).format(date);
  };
  
  /**
   * Format a date to show only the date part (no time)
   * @param dateString - Date string or Date object to format
   * @returns Formatted date string (e.g., "Jan 15, 2025")
   */
  export const formatDateOnly = (dateString: string | Date): string => {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  /**
   * Format a date to show only the time part
   * @param dateString - Date string or Date object to format
   * @returns Formatted time string (e.g., "14:30")
   */
  export const formatTimeOnly = (dateString: string | Date): string => {
    return formatDate(dateString, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  /**
   * Get a relative time string (e.g., "2 hours ago", "yesterday")
   * @param dateString - Date string or Date object to format
   * @returns Relative time string
   */
  export const getRelativeTimeString = (dateString: string | Date): string => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
      return diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  // utils/formatUtils.ts
  /**
   * Format a currency value
   * @param amount - Amount to format
   * @param currency - Currency code (default: KES)
   * @returns Formatted currency string
   */
  export const formatCurrency = (
    amount: number,
    currency: string = 'KES'
  ): string => {
    return `${currency} ${amount.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };
  
  /**
   * Format a number with commas as thousands separators
   * @param number - Number to format
   * @returns Formatted number string
   */
  export const formatNumber = (number: number): string => {
    return number.toLocaleString('en-KE');
  };
  
  /**
   * Truncate a string if it exceeds maxLength and add ellipsis
   * @param str - String to truncate
   * @param maxLength - Maximum length before truncating
   * @returns Truncated string
   */
  export const truncateString = (
    str: string,
    maxLength: number = 50
  ): string => {
    if (str.length <= maxLength) return str;
    return `${str.substring(0, maxLength)}...`;
  };
  
  // utils/validationUtils.ts
  /**
   * Validate an email address format
   * @param email - Email to validate
   * @returns Boolean indicating if email is valid
   */
  export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate a phone number format (basic validation)
   * @param phone - Phone number to validate
   * @returns Boolean indicating if phone is valid
   */
  export const isValidPhone = (phone: string): boolean => {
    // This regex matches phone numbers with optional country code
    // Example: +254712345678 or 0712345678
    const phoneRegex = /^(\+\d{1,3})?[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };
  
  /**
   * Check if a password meets minimum requirements
   * @param password - Password to validate
   * @returns Boolean indicating if password is valid
   */
  export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, containing at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };