/**
 * Rule-based buyer matching.
 * Hard constraints are evaluated before ranking; a ranking score can
 * never override a failed constraint. "No viable match" is a valid outcome.
 */

import { calculateEconomics, type EconomicsResult } from './economics';
import type { Buyer, ResidueRecord } from './types';

export type Eligibility = 'eligible' | 'ineligible' | 'needs_information';

export interface MatchBlocker {
  code: string;
  reason: string;
}

export interface MatchCandidate {
  buyer: Buyer;
  eligibility: Eligibility;
  blockers: MatchBlocker[];
  economics: EconomicsResult;
}

/**
 * Hard constraints, in evaluation order:
 * 1. Buyer accepts the residue type.
 * 2. Condition and handling form meet requirements.
 * 3. Quantity fits within buyer volume limits.
 * 4. Availability window overlaps the buyer's requested window.
 * 5. Quote is still valid.
 */
export function evaluateMatch(record: ResidueRecord, buyer: Buyer): MatchCandidate {
  const req = buyer.requirement;
  const blockers: MatchBlocker[] = [];

  if (!req.acceptedResidueTypes.includes(record.residueType)) {
    blockers.push({
      code: 'residue_type',
      reason: 'Buyer does not accept this residue type',
    });
  }

  if (!req.acceptedConditions.includes(record.condition)) {
    blockers.push({
      code: 'condition',
      reason: 'Residue condition does not meet buyer requirements',
    });
  }

  if (!req.acceptedHandlingForms.includes(record.handlingForm)) {
    blockers.push({
      code: 'handling_form',
      reason: 'Handling form does not meet buyer requirements',
    });
  }

  if (record.estimatedQuantityTonnes < req.minimumVolumeTonnes) {
    blockers.push({
      code: 'volume_min',
      reason: `Quantity below buyer minimum of ${req.minimumVolumeTonnes} t`,
    });
  }

  if (record.estimatedQuantityTonnes > req.maximumVolumeTonnes) {
    blockers.push({
      code: 'volume_max',
      reason: `Quantity above buyer maximum of ${req.maximumVolumeTonnes} t`,
    });
  }

  if (record.availableFrom > req.requiredUntil || record.availableUntil < req.requiredFrom) {
    blockers.push({
      code: 'availability_window',
      reason: 'Availability window does not overlap buyer schedule',
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (req.validUntil < today) {
    blockers.push({
      code: 'quote_expired',
      reason: 'Buyer quote has expired',
    });
  }

  const economics = calculateEconomics({
    sellableQuantityTonnes: record.estimatedQuantityTonnes,
    buyer,
  });

  const eligibility: Eligibility =
    blockers.length === 0 ? 'eligible' : 'ineligible';

  return { buyer, eligibility, blockers, economics };
}

export function findMatches(record: ResidueRecord, buyers: Buyer[]): MatchCandidate[] {
  return buyers
    .map((buyer) => evaluateMatch(record, buyer))
    .sort((a, b) => {
      // Eligible candidates first, then by best indicative net proceeds.
      if (a.eligibility !== b.eligibility) {
        return a.eligibility === 'eligible' ? -1 : 1;
      }
      return b.economics.indicativeNetProceeds - a.economics.indicativeNetProceeds;
    });
}
