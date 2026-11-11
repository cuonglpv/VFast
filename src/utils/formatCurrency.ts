/**
 * Formats a number to USD currency string (e.g. $1,280,000)
 */
export function formatCurrency(amount: number, options?: { compact?: boolean }): string {
  if (options?.compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `$${(amount / 1_000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats percentage
 */
export function formatPercentage(rate: number, decimals: number = 1): string {
  return `${rate.toFixed(decimals)}%`;
}
