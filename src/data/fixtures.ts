/**
 * Demo data contract.
 * Every dataset must declare its status and scope. All records are
 * illustrative and not field-verified.
 */

import type { Buyer, ResidueRecord, Transaction, TransactionEvent } from '@/domain/types';

export const DATASET_METADATA = {
  mode: 'simulated',
  region: 'Illustrative pilot region',
  asOf: '2026-11-10',
  warning: 'All records are illustrative and not field-verified.',
} as const;

export const DEMO_FARMER = {
  name: 'Demo Farmer',
  zone: 'North Zone',
} as const;

export const FIXTURE_RESIDUE: ResidueRecord[] = [
  {
    id: 'RES-001',
    farmerName: 'Demo Farmer',
    zone: 'North Zone',
    residueType: 'rice_straw',
    fieldAreaValue: 2.5,
    fieldAreaUnit: 'hectare',
    harvestDate: '2026-11-02',
    condition: 'dry',
    handlingForm: 'baled',
    estimatedQuantityTonnes: 12.5,
    estimateMethod: 'Field-area estimate (5 t/ha assumption)',
    availableFrom: '2026-11-05',
    availableUntil: '2026-12-05',
    photoCount: 0,
    verificationStatus: 'pending',
    provenance: 'simulated',
    createdAt: '2026-11-03',
  },
  {
    id: 'RES-002',
    farmerName: 'Demo Farmer',
    zone: 'North Zone',
    residueType: 'corn_stover',
    fieldAreaValue: 1.0,
    fieldAreaUnit: 'hectare',
    harvestDate: '2026-10-20',
    condition: 'partly_dry',
    handlingForm: 'loose',
    estimatedQuantityTonnes: 4.0,
    estimateMethod: 'Field-area estimate (4 t/ha assumption)',
    availableFrom: '2026-10-25',
    availableUntil: '2026-11-25',
    photoCount: 0,
    verificationStatus: 'unverified',
    provenance: 'simulated',
    createdAt: '2026-10-22',
  },
];

export const FIXTURE_BUYERS: Buyer[] = [
  {
    id: 'BUY-001',
    name: 'Harum Pakan Ternak',
    buyerType: 'local_fodder',
    location: 'Sukamaju',
    distanceKm: 8,
    transportCostPerTonne: 60000,
    loadingCostPerTonne: 20000,
    balingCostPerTonne: 0,
    verificationStatus: 'verified',
    requirement: {
      acceptedResidueTypes: ['rice_straw'],
      acceptedConditions: ['dry'],
      acceptedHandlingForms: ['baled', 'loose'],
      minimumVolumeTonnes: 5,
      maximumVolumeTonnes: 30,
      requiredFrom: '2026-10-01',
      requiredUntil: '2027-01-31',
      pricePerTonne: 550000,
      priceCurrency: 'IDR',
      priceBasis: 'farm_gate',
      validUntil: '2027-02-28',
    },
  },
  {
    id: 'BUY-002',
    name: 'Agro Biomassa Nusantara',
    buyerType: 'biomass_processor',
    location: 'Cibinong',
    distanceKm: 42,
    transportCostPerTonne: 150000,
    loadingCostPerTonne: 25000,
    balingCostPerTonne: 90000,
    verificationStatus: 'verified',
    requirement: {
      acceptedResidueTypes: ['rice_straw', 'corn_stover'],
      acceptedConditions: ['dry'],
      acceptedHandlingForms: ['baled'],
      minimumVolumeTonnes: 10,
      maximumVolumeTonnes: 100,
      requiredFrom: '2026-09-15',
      requiredUntil: '2027-03-31',
      pricePerTonne: 700000,
      priceCurrency: 'IDR',
      priceBasis: 'farm_gate',
      validUntil: '2027-04-30',
    },
  },
  {
    id: 'BUY-003',
    name: 'Kandang Sejahtera',
    buyerType: 'local_fodder',
    location: 'Sukamaju',
    distanceKm: 12,
    transportCostPerTonne: 75000,
    loadingCostPerTonne: 20000,
    balingCostPerTonne: 0,
    verificationStatus: 'unverified',
    requirement: {
      acceptedResidueTypes: ['corn_stover', 'wheat_straw'],
      acceptedConditions: ['dry', 'partly_dry'],
      acceptedHandlingForms: ['loose'],
      minimumVolumeTonnes: 2,
      maximumVolumeTonnes: 20,
      requiredFrom: '2026-10-01',
      requiredUntil: '2026-12-31',
      pricePerTonne: 400000,
      priceCurrency: 'IDR',
      priceBasis: 'delivered',
      validUntil: '2026-12-31',
    },
  },
];

export const FIXTURE_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-001',
    residueRecordId: 'RES-001',
    buyerId: 'BUY-001',
    offerPricePerTonne: 550000,
    priceCurrency: 'IDR',
    estimatedQuantityTonnes: 12.5,
    measuredQuantityTonnes: null,
    acceptedQuantityTonnes: null,
    status: 'offered',
    pickupScheduledAt: null,
    collectedAt: null,
    paymentConfirmedAt: null,
    provenance: 'simulated',
  },
];

export const FIXTURE_EVENTS: TransactionEvent[] = [
  {
    id: 'EVT-001',
    transactionId: 'TRX-001',
    fromStatus: null,
    toStatus: 'draft',
    actor: 'Demo Farmer',
    occurredAt: '2026-11-04T09:00:00Z',
    note: 'Offer drafted from match with Harum Pakan Ternak',
  },
  {
    id: 'EVT-002',
    transactionId: 'TRX-001',
    fromStatus: 'draft',
    toStatus: 'offered',
    actor: 'System (demo)',
    occurredAt: '2026-11-04T09:05:00Z',
    note: 'Demo offer sent — no real buyer was contacted',
  },
];
