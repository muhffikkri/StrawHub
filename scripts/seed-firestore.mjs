#!/usr/bin/env node
/**
 * Seeds Firestore with the StrawHub demo dataset.
 *
 * Usage:
 *   FIREBASE_SERVICE_ACCOUNT=./service-account.json node scripts/seed-firestore.mjs
 *   FIREBASE_SERVICE_ACCOUNT=./service-account.json node scripts/seed-firestore.mjs --uid <firebase-uid>
 *
 * Without --uid it seeds the shared buyers catalog and a demo owner
 * (`demo-farmer-001`). With --uid it also seeds residue records,
 * transactions and events for that user account.
 */

import { readFileSync } from 'node:fs';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const FIXTURE_BUYERS = [
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

function fixtureResidue(farmerName, ownerId) {
  return [
    {
      id: 'RES-001',
      farmerName,
      ownerId,
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
      farmerName,
      ownerId,
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
}

function fixtureTransactions(ownerId) {
  return [
    {
      id: 'TRX-001',
      ownerId,
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
}

function fixtureEvents(actor, ownerId) {
  return [
    {
      id: 'EVT-001',
      ownerId,
      transactionId: 'TRX-001',
      fromStatus: null,
      toStatus: 'draft',
      actor,
      occurredAt: '2026-11-04T09:00:00Z',
      note: 'Offer drafted from match with Harum Pakan Ternak',
    },
    {
      id: 'EVT-002',
      ownerId,
      transactionId: 'TRX-001',
      fromStatus: 'draft',
      toStatus: 'offered',
      actor: 'System (demo)',
      occurredAt: '2026-11-04T09:05:00Z',
      note: 'Demo offer sent — no real buyer was contacted',
    },
  ];
}

function parseArgs(argv) {
  const uidIndex = argv.indexOf('--uid');
  return {
    uid: uidIndex >= 0 ? argv[uidIndex + 1] : 'demo-farmer-001',
    withUserData: uidIndex >= 0,
  };
}

async function main() {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!keyPath) {
    console.error(
      'FIREBASE_SERVICE_ACCOUNT is required (path to a service account JSON file).'
    );
    process.exit(1);
  }

  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  if (getApps().length === 0) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  const db = getFirestore();

  const { uid, withUserData } = parseArgs(process.argv.slice(2));

  const buyersBatch = db.batch();
  FIXTURE_BUYERS.forEach((buyer) =>
    buyersBatch.set(db.collection('buyers').doc(buyer.id), buyer, { merge: true })
  );
  await buyersBatch.commit();
  console.log(`Seeded ${FIXTURE_BUYERS.length} buyers.`);

  if (withUserData) {
    const farmerName = 'Demo Farmer';
    const batch = db.batch();
    fixtureResidue(farmerName, uid).forEach((record) =>
      batch.set(db.collection('residueRecords').doc(record.id), record, { merge: true })
    );
    fixtureTransactions(uid).forEach((transaction) =>
      batch.set(db.collection('transactions').doc(transaction.id), transaction, {
        merge: true,
      })
    );
    fixtureEvents(farmerName, uid).forEach((event) =>
      batch.set(db.collection('transactionEvents').doc(event.id), event, { merge: true })
    );
    await batch.commit();
    console.log(`Seeded residue, transactions and events for uid ${uid}.`);
  } else {
    console.log('Skipped user data (pass --uid <firebase-uid> to seed it).');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
