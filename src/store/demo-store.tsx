/**
 * Central store — local demo mode and Firestore cloud mode.
 *
 * One shared data source for every screen so the dashboard, registry,
 * matches and transactions can never disagree.
 *
 * - Demo mode (no Firebase session): state lives in the reducer only and
 *   resets on reload.
 * - Cloud mode (signed in with Firebase): every mutation is an optimistic
 *   local dispatch followed by a Firestore write with the same ids; real-time
 *   snapshots then reconcile the state, so Firestore stays the source of truth.
 *
 * IDs are generated in event handlers (never during render) — deterministic
 * sequence numbers locally, timestamp-based ids in cloud mode.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';

import {
  FIXTURE_BUYERS,
  FIXTURE_EVENTS,
  FIXTURE_RESIDUE,
  FIXTURE_TRANSACTIONS,
  DEMO_FARMER,
} from '@/data/fixtures';
import { canTransition } from '@/domain/transactions';
import type {
  Buyer,
  ResidueRecord,
  Transaction,
  TransactionEvent,
  TransactionStatus,
} from '@/domain/types';
import {
  ensureUserWorkspace,
  resetUserData,
  subscribeBuyers,
  subscribeEvents,
  subscribeResidue,
  subscribeTransactions,
  writeEvent,
  writeResidue,
  writeTransaction,
} from '@/lib/firestore';
import { isFirebaseConfigured } from '@/lib/firebase';
import { useAuth } from '@/store/auth-store';

/** Residue payload without the id and bookkeeping the store assigns. */
export type NewResidueInput = Omit<ResidueRecord, 'id' | 'createdAt'>;

export type OfferInput = {
  residueRecordId: string;
  buyerId: string;
  offerPricePerTonne: number;
  estimatedQuantityTonnes: number;
};

interface DemoState {
  residue: ResidueRecord[];
  transactions: Transaction[];
  events: TransactionEvent[];
  buyers: Buyer[];
  nextSeq: number;
}

type DemoAction =
  | { type: 'add_residue'; record: ResidueRecord }
  | { type: 'add_offer'; transaction: Transaction; event: TransactionEvent }
  | { type: 'apply_transition'; transaction: Transaction; event: TransactionEvent }
  | { type: 'apply_measurement'; transaction: Transaction; event: TransactionEvent }
  | { type: 'enter_cloud' }
  | {
      type: 'hydrate';
      residue?: ResidueRecord[];
      transactions?: Transaction[];
      events?: TransactionEvent[];
      buyers?: Buyer[];
    }
  | { type: 'reset' };

const initialState: DemoState = {
  residue: FIXTURE_RESIDUE,
  transactions: FIXTURE_TRANSACTIONS,
  events: FIXTURE_EVENTS,
  buyers: FIXTURE_BUYERS,
  nextSeq: 3, // fixtures occupy ids up to -002
};

function nowIso(): string {
  return new Date().toISOString();
}

function padSeq(seq: number): string {
  return seq.toString().padStart(3, '0');
}

/** Collision-safe id for cloud writes (generated in event handlers only). */
function cloudId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

/* ---------- Pure record builders (shared by local and cloud paths) ---------- */

function buildOffer(
  input: OfferInput,
  transactionId: string,
  eventId: string,
  actorName: string,
  now: string
): { transaction: Transaction; event: TransactionEvent } {
  const transaction: Transaction = {
    id: transactionId,
    residueRecordId: input.residueRecordId,
    buyerId: input.buyerId,
    offerPricePerTonne: input.offerPricePerTonne,
    priceCurrency: 'IDR',
    estimatedQuantityTonnes: input.estimatedQuantityTonnes,
    measuredQuantityTonnes: null,
    acceptedQuantityTonnes: null,
    status: 'offered',
    pickupScheduledAt: null,
    collectedAt: null,
    paymentConfirmedAt: null,
    provenance: 'simulated',
  };
  const event: TransactionEvent = {
    id: eventId,
    transactionId,
    fromStatus: null,
    toStatus: 'offered',
    actor: actorName,
    occurredAt: now,
    note: 'Demo offer created — no real buyer was contacted',
  };
  return { transaction, event };
}

function applyTransition(
  transaction: Transaction,
  to: TransactionStatus,
  now: string
): Transaction {
  return {
    ...transaction,
    status: to,
    pickupScheduledAt: to === 'pickup_scheduled' ? now : transaction.pickupScheduledAt,
    collectedAt: to === 'collected_weighed' ? now : transaction.collectedAt,
    paymentConfirmedAt: to === 'completed' ? now : transaction.paymentConfirmedAt,
  };
}

function buildTransitionEvent(
  from: Transaction,
  to: Transaction,
  eventId: string,
  actorName: string,
  now: string,
  note?: string
): TransactionEvent {
  return {
    id: eventId,
    transactionId: from.id,
    fromStatus: from.status,
    toStatus: to.status,
    actor: actorName,
    occurredAt: now,
    note,
  };
}

function buildMeasurementEvent(
  transaction: Transaction,
  measuredQuantityTonnes: number,
  eventId: string,
  actorName: string,
  now: string
): TransactionEvent {
  return {
    id: eventId,
    transactionId: transaction.id,
    fromStatus: transaction.status,
    toStatus: transaction.status,
    actor: actorName,
    occurredAt: now,
    note: `Measured weight recorded: ${measuredQuantityTonnes} t (kept separate from estimate)`,
  };
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'add_residue':
      return {
        ...state,
        nextSeq: state.nextSeq + 1,
        residue: [action.record, ...state.residue],
      };

    case 'add_offer':
      return {
        ...state,
        nextSeq: state.nextSeq + 1,
        transactions: [action.transaction, ...state.transactions],
        events: [action.event, ...state.events],
      };

    case 'apply_transition':
    case 'apply_measurement':
      return {
        ...state,
        nextSeq: state.nextSeq + 1,
        transactions: state.transactions.map((t) =>
          t.id === action.transaction.id ? action.transaction : t
        ),
        events: [action.event, ...state.events],
      };

    case 'enter_cloud':
      // Entering cloud mode: drop local fixtures until snapshots arrive.
      return { ...state, residue: [], transactions: [], events: [] };

    case 'hydrate': {
      const residue = action.residue
        ? [...action.residue].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : state.residue;
      const transactions = action.transactions
        ? [...action.transactions].sort((a, b) => b.id.localeCompare(a.id))
        : state.transactions;
      const events = action.events
        ? [...action.events].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        : state.events;
      const buyers = action.buyers ?? state.buyers;
      return { ...state, residue, transactions, events, buyers };
    }

    case 'reset':
      return initialState;

    default:
      return state;
  }
}

interface DemoContextValue extends DemoState {
  /** Firestore is the live source of truth (Firebase session active). */
  cloudMode: boolean;
  addResidue: (input: NewResidueInput) => void;
  createOffer: (input: OfferInput) => void;
  transition: (transactionId: string, to: TransactionStatus, note?: string) => void;
  recordMeasurement: (transactionId: string, measuredQuantityTonnes: number) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();
  const cloudMode = isFirebaseConfigured && !!user && !user.isDemo;
  const actorName = user?.displayName || DEMO_FARMER.name;
  const prevCloudMode = useRef(false);

  // Real-time sync while in cloud mode.
  useEffect(() => {
    if (!cloudMode || !user) return;
    const unsubs = [
      subscribeResidue(user.uid, (residue) => dispatch({ type: 'hydrate', residue })),
      subscribeTransactions(user.uid, (transactions) =>
        dispatch({ type: 'hydrate', transactions })
      ),
      subscribeEvents(user.uid, (events) => dispatch({ type: 'hydrate', events })),
      subscribeBuyers((buyers) => dispatch({ type: 'hydrate', buyers })),
    ];
    return () => unsubs.forEach((u) => u());
  }, [cloudMode, user]);

  // Mode switches: clear fixtures entering cloud mode, restore leaving it.
  useEffect(() => {
    if (cloudMode && !prevCloudMode.current) {
      dispatch({ type: 'enter_cloud' });
    } else if (!cloudMode && prevCloudMode.current) {
      dispatch({ type: 'reset' });
    }
    prevCloudMode.current = cloudMode;
  }, [cloudMode]);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      cloudMode,
      addResidue: (input) => {
        const id = cloudMode ? cloudId('RES') : `RES-${padSeq(state.nextSeq)}`;
        const record: ResidueRecord = {
          ...input,
          farmerName: actorName,
          id,
          createdAt: nowIso().slice(0, 10),
        };
        dispatch({ type: 'add_residue', record });
        if (cloudMode && user) {
          writeResidue(user.uid, record).catch((err: unknown) =>
            console.warn('[strawhub] residue write failed:', err)
          );
        }
      },
      createOffer: (input) => {
        const id = cloudMode ? cloudId('TRX') : `TRX-${padSeq(state.nextSeq)}`;
        const eventId = cloudMode ? cloudId('EVT') : `EVT-${padSeq(state.nextSeq)}`;
        const { transaction, event } = buildOffer(input, id, eventId, actorName, nowIso());
        dispatch({ type: 'add_offer', transaction, event });
        if (cloudMode && user) {
          writeTransaction(user.uid, transaction).catch((err: unknown) =>
            console.warn('[strawhub] transaction write failed:', err)
          );
          writeEvent(user.uid, event).catch((err: unknown) =>
            console.warn('[strawhub] event write failed:', err)
          );
        }
      },
      transition: (transactionId, to, note) => {
        const target = state.transactions.find((t) => t.id === transactionId);
        if (!target || !canTransition(target.status, to)) {
          return; // invalid transitions are silently rejected
        }
        const now = nowIso();
        const transaction = applyTransition(target, to, now);
        const eventId = cloudMode ? cloudId('EVT') : `EVT-${padSeq(state.nextSeq)}`;
        const event = buildTransitionEvent(target, transaction, eventId, actorName, now, note);
        dispatch({ type: 'apply_transition', transaction, event });
        if (cloudMode && user) {
          writeTransaction(user.uid, transaction).catch((err: unknown) =>
            console.warn('[strawhub] transaction write failed:', err)
          );
          writeEvent(user.uid, event).catch((err: unknown) =>
            console.warn('[strawhub] event write failed:', err)
          );
        }
      },
      recordMeasurement: (transactionId, measuredQuantityTonnes) => {
        const target = state.transactions.find((t) => t.id === transactionId);
        if (!target) return;
        const now = nowIso();
        const transaction = { ...target, measuredQuantityTonnes };
        const eventId = cloudMode ? cloudId('EVT') : `EVT-${padSeq(state.nextSeq)}`;
        const event = buildMeasurementEvent(target, measuredQuantityTonnes, eventId, actorName, now);
        dispatch({ type: 'apply_measurement', transaction, event });
        if (cloudMode && user) {
          writeTransaction(user.uid, transaction).catch((err: unknown) =>
            console.warn('[strawhub] transaction write failed:', err)
          );
          writeEvent(user.uid, event).catch((err: unknown) =>
            console.warn('[strawhub] event write failed:', err)
          );
        }
      },
      reset: () => {
        if (cloudMode && user) {
          resetUserData(state.residue, state.transactions, state.events)
            .then(() =>
              ensureUserWorkspace(
                user.uid,
                {
                  displayName: actorName,
                  email: user.email,
                  photoURL: user.photoURL,
                },
                { force: true }
              )
            )
            .catch((err: unknown) =>
              console.warn('[strawhub] cloud reset failed:', err)
            );
        }
        dispatch({ type: 'reset' });
      },
    }),
    [state, cloudMode, user, actorName]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within DemoProvider');
  }
  return context;
}
