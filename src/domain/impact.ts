/**
 * Operational metric aggregation.
 * These are operational metrics only — environmental impact is never
 * derived here. Collected mass is never equated with diverted mass.
 */

import type { ResidueRecord, Transaction } from './types';
import { isTerminal } from './transactions';

export interface OperationalSummary {
  registeredTonnes: number;
  verifiedTonnes: number;
  collectedTonnes: number;
  soldTonnes: number;
  transactionCount: number;
  completedCount: number;
  completionRate: number | null;
}

export function summarizeOperations(
  residue: ResidueRecord[],
  transactions: Transaction[],
): OperationalSummary {
  const registeredTonnes = residue.reduce(
    (sum, r) => sum + r.estimatedQuantityTonnes,
    0,
  );
  const verifiedTonnes = residue
    .filter((r) => r.verificationStatus === 'verified')
    .reduce((sum, r) => sum + r.estimatedQuantityTonnes, 0);

  const completed = transactions.filter((t) => t.status === 'completed');
  const collectedTonnes = completed.reduce(
    (sum, t) => sum + (t.measuredQuantityTonnes ?? t.estimatedQuantityTonnes),
    0,
  );
  const soldTonnes = completed.reduce(
    (sum, t) => sum + (t.acceptedQuantityTonnes ?? t.measuredQuantityTonnes ?? 0),
    0,
  );

  const transactionCount = transactions.length;
  const completedCount = completed.length;
  const evaluationSet = transactions.filter((t) => isTerminal(t.status));
  const completionRate =
    evaluationSet.length > 0 ? completedCount / evaluationSet.length : null;

  return {
    registeredTonnes,
    verifiedTonnes,
    collectedTonnes,
    soldTonnes,
    transactionCount,
    completedCount,
    completionRate,
  };
}

export function activeDeals(transactions: Transaction[]): Transaction[] {
  return transactions.filter((t) => !isTerminal(t.status));
}
