/**
 * Utility functions for consistent number and currency formatting
 * Prevents hydration mismatches by ensuring server/client consistency
 */

/**
 * Formats a number as currency with consistent formatting across server/client
 * @param amount - The number to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = '$'
): string => {
  // Use a consistent format that doesn't depend on locale
  const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${currency}${formatted}`;
};

/**
 * Formats a number with thousands separators consistently
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Formats a percentage with consistent decimal places
 * @param num - The number to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};
