/**
 * StrawHub domain types.
 * Domain logic must stay independent of React Native presentation.
 */

export type Provenance = 'simulated' | 'observed' | 'derived' | 'verified';

export type VerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected'
  | 'needs_review';

export type ResidueType = 'wheat_straw' | 'rice_straw' | 'corn_stover';

export type ResidueCondition = 'dry' | 'partly_dry' | 'wet';

export type HandlingForm = 'loose' | 'baled' | 'chopped';

export interface ResidueRecord {
  id: string;
  farmerName: string;
  zone: string;
  residueType: ResidueType;
  fieldAreaValue: number;
  fieldAreaUnit: 'acre' | 'hectare';
  harvestDate: string;
  condition: ResidueCondition;
  handlingForm: HandlingForm;
  estimatedQuantityTonnes: number;
  estimateMethod: string;
  availableFrom: string;
  availableUntil: string;
  photoCount: number;
  verificationStatus: VerificationStatus;
  provenance: Provenance;
  createdAt: string;
}

export type BuyerType =
  | 'local_fodder'
  | 'aggregator'
  | 'biomass_processor'
  | 'industrial_user';

export type PriceBasis = 'farm_gate' | 'delivered' | 'unknown';

export interface BuyerRequirement {
  acceptedResidueTypes: ResidueType[];
  acceptedConditions: ResidueCondition[];
  acceptedHandlingForms: HandlingForm[];
  minimumVolumeTonnes: number;
  maximumVolumeTonnes: number;
  requiredFrom: string;
  requiredUntil: string;
  pricePerTonne: number;
  priceCurrency: 'IDR';
  priceBasis: PriceBasis;
  validUntil: string;
}

export interface Buyer {
  id: string;
  name: string;
  buyerType: BuyerType;
  location: string;
  distanceKm: number;
  transportCostPerTonne: number;
  loadingCostPerTonne: number;
  balingCostPerTonne: number;
  requirement: BuyerRequirement;
  verificationStatus: VerificationStatus;
}

export type TransactionStatus =
  | 'draft'
  | 'offered'
  | 'farmer_accepted'
  | 'pickup_scheduled'
  | 'collected_weighed'
  | 'payment_pending'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'disputed'
  | 'needs_review';

export interface Transaction {
  id: string;
  residueRecordId: string;
  buyerId: string;
  offerPricePerTonne: number;
  priceCurrency: 'IDR';
  estimatedQuantityTonnes: number;
  measuredQuantityTonnes: number | null;
  acceptedQuantityTonnes: number | null;
  status: TransactionStatus;
  pickupScheduledAt: string | null;
  collectedAt: string | null;
  paymentConfirmedAt: string | null;
  provenance: Provenance;
}

export interface TransactionEvent {
  id: string;
  transactionId: string;
  fromStatus: TransactionStatus | null;
  toStatus: TransactionStatus;
  actor: string;
  occurredAt: string;
  note?: string;
}
