/**
 * Format a number as currency
 * 
 * @param value - The number to format
 * @param locale - The locale to use, defaults to browser locale
 * @param currency - The currency to use, defaults to USD
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number, 
  locale = navigator.language, 
  currency = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date string
 * 
 * @param dateString - The date string to format
 * @param locale - The locale to use, defaults to browser locale
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string, 
  locale = navigator.language
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format a date string to a relative time (e.g., "2 days ago")
 * 
 * @param dateString - The date string to format
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  }
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  
  return formatDate(dateString);
};