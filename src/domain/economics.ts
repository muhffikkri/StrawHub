/**
 * Shared economics calculation.
 * One function is used everywhere so dashboard cards, match cards, and
 * transaction details can never disagree.
 */

import type { Buyer, PriceBasis } from './types';

export interface EconomicsResult {
  sellableQuantityTonnes: number;
  pricePerTonne: number;
  grossValue: number;
  transportCost: number;
  loadingCost: number;
  balingCost: number;
  totalKnownCosts: number;
  indicativeNetProceeds: number;
  missingCostInputs: string[];
  priceBasis: PriceBasis;
  partial: boolean;
}

export interface EconomicsInput {
  sellableQuantityTonnes: number;
  buyer: Buyer;
}

/**
 * grossValue   = sellableQuantityTonnes * acceptedPricePerTonne
 * knownCosts   = transport + loading + baling
 * netProceeds  = grossValue - knownCosts
 *
 * Rules:
 * - Transport is only charged on farm-gate quotes; delivered quotes
 *   already include it (never double-count).
 * - Missing inputs are reported, never zero-filled silently.
 * - Negative net proceeds remain visible to the farmer.
 */
export function calculateEconomics({
  sellableQuantityTonnes,
  buyer,
}: EconomicsInput): EconomicsResult {
  const quantity = Math.max(0, sellableQuantityTonnes);
  const missingCostInputs: string[] = [];

  if (buyer.requirement.priceBasis === 'unknown') {
    missingCostInputs.push('Price basis unknown — costs cannot be split reliably');
  }

  const grossValue = quantity * buyer.requirement.pricePerTonne;

  const transportCost =
    buyer.requirement.priceBasis === 'delivered'
      ? 0 // buyer already includes delivery in the quoted price
      : quantity * buyer.transportCostPerTonne;

  const loadingCost = quantity * buyer.loadingCostPerTonne;
  const balingCost = quantity * buyer.balingCostPerTonne;

  const totalKnownCosts = transportCost + loadingCost + balingCost;
  const indicativeNetProceeds = grossValue - totalKnownCosts;

  return {
    sellableQuantityTonnes: quantity,
    pricePerTonne: buyer.requirement.pricePerTonne,
    grossValue,
    transportCost,
    loadingCost,
    balingCost,
    totalKnownCosts,
    indicativeNetProceeds,
    missingCostInputs,
    priceBasis: buyer.requirement.priceBasis,
    partial: missingCostInputs.length > 0,
  };
}
