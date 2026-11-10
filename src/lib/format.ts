/**
 * Shared formatting utilities.
 * Currency, dates, and units must format through these helpers — never
 * hardcoded inside components.
 */

export function formatCurrencyIDR(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatQuantity(tonnes: number): string {
  return `${tonnes.toFixed(1)} t`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatSignedCurrency(value: number): string {
  const sign = value < 0 ? '−' : '+';
  return `${sign} ${formatCurrencyIDR(Math.abs(value))}`;
}
