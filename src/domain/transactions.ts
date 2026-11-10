/**
 * Transaction state machine.
 * Only allowed transitions are offered by the UI; every transition
 * records a timestamp and actor label.
 */

import type { Transaction, TransactionStatus } from './types';

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  draft: 'Draft',
  offered: 'Offered',
  farmer_accepted: 'Farmer Accepted',
  pickup_scheduled: 'Pickup Scheduled',
  collected_weighed: 'Collected / Weighed',
  payment_pending: 'Payment Pending',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
  needs_review: 'Needs Review',
};

const ALLOWED_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  draft: ['offered'],
  offered: ['farmer_accepted', 'rejected', 'cancelled'],
  farmer_accepted: ['pickup_scheduled', 'cancelled', 'needs_review'],
  pickup_scheduled: ['collected_weighed', 'cancelled', 'needs_review'],
  collected_weighed: ['payment_pending', 'needs_review'],
  payment_pending: ['completed', 'disputed', 'needs_review'],
  disputed: ['completed', 'cancelled', 'needs_review'],
  needs_review: ['farmer_accepted', 'cancelled'],
  completed: [],
  rejected: [],
  cancelled: [],
};

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function nextStatuses(status: TransactionStatus): TransactionStatus[] {
  return ALLOWED_TRANSITIONS[status] ?? [];
}

export function isTerminal(status: TransactionStatus): boolean {
  return nextStatuses(status).length === 0;
}

/**
 * The step a transaction has reached on the primary happy path,
 * used for progress display. Alternative states map onto the closest step.
 */
export function progressStep(status: TransactionStatus): number {
  switch (status) {
    case 'draft':
      return 0;
    case 'offered':
      return 1;
    case 'farmer_accepted':
    case 'rejected':
    case 'cancelled':
      return 2;
    case 'pickup_scheduled':
      return 3;
    case 'collected_weighed':
    case 'disputed':
    case 'needs_review':
      return 4;
    case 'payment_pending':
      return 5;
    case 'completed':
      return 6;
  }
}

export function activeTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => !isTerminal(t.status));
}
