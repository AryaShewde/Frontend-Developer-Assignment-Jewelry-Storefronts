/**
 * Currency and pricing formatting utilities.
 * Conforms to assignment requirement:
 * Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
 */

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const usdFormatterWithCents = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format price as USD currency string.
 * Uses 0 decimals if price is integer, or 2 decimals if cents are present.
 */
export const formatPrice = (amount: number, showCents: boolean = false): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0';
  }
  if (showCents || amount % 1 !== 0) {
    return usdFormatterWithCents.format(amount);
  }
  return usdFormatter.format(amount);
};