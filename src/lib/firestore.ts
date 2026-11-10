/**
 * Firestore data layer.
 *
 * Collections (all values stay plain JSON — dates are ISO strings):
 * - users/{uid}                  profile + workspace bookkeeping
 * - buyers/{id}                   global buyer catalog (admin-seeded)
 * - residueRecords/{id}           ResidueRecord + ownerId
 * - transactions/{id}             Transaction + ownerId
 * - transactionEvents/{id}        TransactionEvent + ownerId
 *
 * Reads/writes are owner-scoped; see firestore.rules.
 * Every mutation is an optimistic local dispatch + a Firestore write with
 * the same ids — snapshots then reconcile the local state.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';

import {
  FIXTURE_BUYERS,
  FIXTURE_EVENTS,
  FIXTURE_RESIDUE,
  FIXTURE_TRANSACTIONS,
} from '@/data/fixtures';
import type {
  Buyer,
  ResidueRecord,
  Transaction,
  TransactionEvent,
} from '@/domain/types';
import { firestore } from '@/lib/firebase';

export const COLLECTIONS = {
  users: 'users',
  buyers: 'buyers',
  residue: 'residueRecords',
  transactions: 'transactions',
  events: 'transactionEvents',
} as const;

type Unsubscribe = () => void;

/** Local alias so TypeScript keeps the non-null narrowing inside callbacks. */
function db(): Firestore | null {
  return firestore;
}

/* ---------- Subscriptions (real-time) ---------- */

export function subscribeResidue(
  ownerId: string,
  onData: (residue: ResidueRecord[]) => void
): Unsubscribe {
  const store = db();
  if (!store) return () => {};
  return onSnapshot(
    query(collection(store, COLLECTIONS.residue), where('ownerId', '==', ownerId)),
    (snap) => onData(snap.docs.map((d) => d.data() as ResidueRecord))
  );
}

export function subscribeTransactions(
  ownerId: string,
  onData: (transactions: Transaction[]) => void
): Unsubscribe {
  const store = db();
  if (!store) return () => {};
  return onSnapshot(
    query(collection(store, COLLECTIONS.transactions), where('ownerId', '==', ownerId)),
    (snap) => onData(snap.docs.map((d) => d.data() as Transaction))
  );
}

export function subscribeEvents(
  ownerId: string,
  onData: (events: TransactionEvent[]) => void
): Unsubscribe {
  const store = db();
  if (!store) return () => {};
  return onSnapshot(
    query(collection(store, COLLECTIONS.events), where('ownerId', '==', ownerId)),
    (snap) => onData(snap.docs.map((d) => d.data() as TransactionEvent))
  );
}

export function subscribeBuyers(onData: (buyers: Buyer[]) => void): Unsubscribe {
  const store = db();
  if (!store) return () => {};
  return onSnapshot(collection(store, COLLECTIONS.buyers), (snap) =>
    onData(snap.docs.map((d) => d.data() as Buyer))
  );
}

/* ---------- First-login workspace seeding (dummy data) ---------- */

/**
 * Creates the user profile doc and, on first login (or when `force` is set),
 * seeds the account with the demo dataset so Home has meaningful data.
 * Buyers are global and seeded once per project.
 */
export async function ensureUserWorkspace(
  uid: string,
  profile: { displayName: string; email: string | null; photoURL: string | null },
  options?: { force?: boolean }
): Promise<void> {
  const store = db();
  if (!store) return;
  const userRef = doc(store, COLLECTIONS.users, uid);
  const existing = await getDoc(userRef);
  if (!existing.exists() || options?.force) {
    const batch = writeBatch(store);
    batch.set(userRef, {
      ...profile,
      createdAt: new Date().toISOString(),
      seededWith: 'demo-dataset',
    });
    FIXTURE_RESIDUE.forEach((r) =>
      batch.set(doc(store, COLLECTIONS.residue, r.id), {
        ...r,
        farmerName: profile.displayName,
        ownerId: uid,
      })
    );
    FIXTURE_TRANSACTIONS.forEach((t) =>
      batch.set(doc(store, COLLECTIONS.transactions, t.id), { ...t, ownerId: uid })
    );
    FIXTURE_EVENTS.forEach((e) =>
      batch.set(doc(store, COLLECTIONS.events, e.id), {
        ...e,
        actor: profile.displayName,
        ownerId: uid,
      })
    );
    await batch.commit();
  }

  // Buyers are shared across users — seed once per project.
  const buyersSnap = await getDocs(
    query(collection(store, COLLECTIONS.buyers), limit(1))
  );
  if (buyersSnap.empty) {
    const batch = writeBatch(store);
    FIXTURE_BUYERS.forEach((b) =>
      batch.set(doc(store, COLLECTIONS.buyers, b.id), { ...b })
    );
    await batch.commit();
  }
}

/* ---------- Mutations (write-through, ids must match local optimistic state) ---------- */

export async function writeResidue(
  ownerId: string,
  record: ResidueRecord
): Promise<void> {
  const store = db();
  if (!store) return;
  await setDoc(doc(store, COLLECTIONS.residue, record.id), {
    ...record,
    ownerId,
  });
}

export async function writeTransaction(
  ownerId: string,
  transaction: Transaction
): Promise<void> {
  const store = db();
  if (!store) return;
  await setDoc(doc(store, COLLECTIONS.transactions, transaction.id), {
    ...transaction,
    ownerId,
  });
}

export async function writeEvent(
  ownerId: string,
  event: TransactionEvent
): Promise<void> {
  const store = db();
  if (!store) return;
  await setDoc(doc(store, COLLECTIONS.events, event.id), {
    ...event,
    ownerId,
  });
}

async function deleteTransactionTree(
  transactions: Transaction[],
  events: TransactionEvent[]
): Promise<void> {
  const store = db();
  if (!store) return;
  const batch = writeBatch(store);
  transactions.forEach((t) =>
    batch.delete(doc(store, COLLECTIONS.transactions, t.id))
  );
  events.forEach((e) => batch.delete(doc(store, COLLECTIONS.events, e.id)));
  await batch.commit();
}

/** Deletes every residue record, transaction and event owned by the user. */
export async function resetUserData(
  residue: ResidueRecord[],
  transactions: Transaction[],
  events: TransactionEvent[]
): Promise<void> {
  const store = db();
  if (!store) return;
  await deleteTransactionTree(transactions, events);
  const batch = writeBatch(store);
  residue.forEach((r) => batch.delete(doc(store, COLLECTIONS.residue, r.id)));
  await batch.commit();
}
