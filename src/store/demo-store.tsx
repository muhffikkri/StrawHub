/**
 * Central demo store.
 * One shared data source for every screen so the dashboard, registry,
 * and transactions can never disagree. Demo state is reset on reload;
 * persistence is a later-phase concern (see ROADMAP.md Phase 2).
 *
 * IDs are generated deterministically from a state counter, and screens
 * never call impure functions (Date.now) during render — the reducer
 * records timestamps as facts when a user action is dispatched.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import {
  FIXTURE_BUYERS,
  FIXTURE_EVENTS,
  FIXTURE_RESIDUE,
  FIXTURE_TRANSACTIONS,
} from '@/data/fixtures';
import { canTransition } from '@/domain/transactions';
import type {
  ResidueRecord,
  Transaction,
  TransactionEvent,
  TransactionStatus,
} from '@/domain/types';

/** Residue payload without the id and bookkeeping the store assigns. */
export type NewResidueInput = Omit<ResidueRecord, 'id' | 'createdAt'>;

interface DemoState {
  residue: ResidueRecord[];
  transactions: Transaction[];
  events: TransactionEvent[];
  nextSeq: number;
}

type DemoAction =
  | { type: 'add_residue'; input: NewResidueInput }
  | {
      type: 'create_offer';
      residueRecordId: string;
      buyerId: string;
      offerPricePerTonne: number;
      estimatedQuantityTonnes: number;
    }
  | {
      type: 'transition';
      transactionId: string;
      to: TransactionStatus;
      note?: string;
    }
  | {
      type: 'record_measurement';
      transactionId: string;
      measuredQuantityTonnes: number;
    }
  | { type: 'reset' };

const initialState: DemoState = {
  residue: FIXTURE_RESIDUE,
  transactions: FIXTURE_TRANSACTIONS,
  events: FIXTURE_EVENTS,
  nextSeq: 3, // fixtures occupy ids up to -002
};

function nowIso(): string {
  return new Date().toISOString();
}

function padSeq(seq: number): string {
  return seq.toString().padStart(3, '0');
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'add_residue': {
      const seq = state.nextSeq;
      const record: ResidueRecord = {
        ...action.input,
        id: `RES-${padSeq(seq)}`,
        createdAt: nowIso().slice(0, 10),
      };
      return {
        ...state,
        nextSeq: seq + 1,
        residue: [record, ...state.residue],
      };
    }

    case 'create_offer': {
      const seq = state.nextSeq;
      const transaction: Transaction = {
        id: `TRX-${padSeq(seq)}`,
        residueRecordId: action.residueRecordId,
        buyerId: action.buyerId,
        offerPricePerTonne: action.offerPricePerTonne,
        priceCurrency: 'IDR',
        estimatedQuantityTonnes: action.estimatedQuantityTonnes,
        measuredQuantityTonnes: null,
        acceptedQuantityTonnes: null,
        status: 'offered',
        pickupScheduledAt: null,
        collectedAt: null,
        paymentConfirmedAt: null,
        provenance: 'simulated',
      };
      const event: TransactionEvent = {
        id: `EVT-${padSeq(seq)}`,
        transactionId: transaction.id,
        fromStatus: null,
        toStatus: 'offered',
        actor: 'Demo Farmer',
        occurredAt: nowIso(),
        note: 'Demo offer created — no real buyer was contacted',
      };
      return {
        ...state,
        nextSeq: seq + 1,
        transactions: [transaction, ...state.transactions],
        events: [event, ...state.events],
      };
    }

    case 'transition': {
      const target = state.transactions.find((t) => t.id === action.transactionId);
      if (!target || !canTransition(target.status, action.to)) {
        return state; // invalid transitions are silently rejected
      }
      const seq = state.nextSeq;
      const now = nowIso();
      const event: TransactionEvent = {
        id: `EVT-${padSeq(seq)}`,
        transactionId: action.transactionId,
        fromStatus: target.status,
        toStatus: action.to,
        actor: 'Demo Farmer',
        occurredAt: now,
        note: action.note,
      };
      return {
        ...state,
        nextSeq: seq + 1,
        transactions: state.transactions.map((t) =>
          t.id === action.transactionId
            ? {
                ...t,
                status: action.to,
                pickupScheduledAt:
                  action.to === 'pickup_scheduled' ? now : t.pickupScheduledAt,
                collectedAt:
                  action.to === 'collected_weighed' ? now : t.collectedAt,
                paymentConfirmedAt:
                  action.to === 'completed' ? now : t.paymentConfirmedAt,
              }
            : t,
        ),
        events: [event, ...state.events],
      };
    }

    case 'record_measurement': {
      const target = state.transactions.find((t) => t.id === action.transactionId);
      if (!target) return state;
      const seq = state.nextSeq;
      const event: TransactionEvent = {
        id: `EVT-${padSeq(seq)}`,
        transactionId: action.transactionId,
        fromStatus: target.status,
        toStatus: target.status,
        actor: 'Weighbridge (demo)',
        occurredAt: nowIso(),
        note: `Measured weight recorded: ${action.measuredQuantityTonnes} t (kept separate from estimate)`,
      };
      return {
        ...state,
        nextSeq: seq + 1,
        transactions: state.transactions.map((t) =>
          t.id === action.transactionId
            ? { ...t, measuredQuantityTonnes: action.measuredQuantityTonnes }
            : t,
        ),
        events: [event, ...state.events],
      };
    }

    case 'reset':
      return initialState;

    default:
      return state;
  }
}

interface DemoContextValue extends DemoState {
  buyers: typeof FIXTURE_BUYERS;
  addResidue: (input: NewResidueInput) => void;
  createOffer: (input: {
    residueRecordId: string;
    buyerId: string;
    offerPricePerTonne: number;
    estimatedQuantityTonnes: number;
  }) => void;
  transition: (transactionId: string, to: TransactionStatus, note?: string) => void;
  recordMeasurement: (transactionId: string, measuredQuantityTonnes: number) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      buyers: FIXTURE_BUYERS,
      addResidue: (input) => dispatch({ type: 'add_residue', input }),
      createOffer: (input) => dispatch({ type: 'create_offer', ...input }),
      transition: (transactionId, to, note) =>
        dispatch({ type: 'transition', transactionId, to, note }),
      recordMeasurement: (transactionId, measuredQuantityTonnes) =>
        dispatch({ type: 'record_measurement', transactionId, measuredQuantityTonnes }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [state],
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
