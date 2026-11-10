# StrawHub — System Specification

**Version:** 0.2
**Status:** Phase 1 implemented; see `ROADMAP.md`
**Platform:** React Native 0.88 / Expo SDK 58, runnable in Expo Go
**Architecture:** Single Expo app, modular domain layer
**Initial data mode:** Simulated fixtures

## 1. Purpose

This specification defines the technical boundaries, domain modules, data structures, business rules, and testing strategy for the StrawHub mobile app.

The initial implementation demonstrates a credible farmer-facing workflow without a backend, real buyer integrations, or payments. Later phases add those without rewriting the app around a new architecture.

## 2. System Boundary

### In scope for the mobile prototype

- Tab navigation: Home, Registry, Matches, Deals.
- Google Sign-In via Firebase Authentication (Expo Go compatible), persisted
  session, demo-profile fallback when Firebase is not configured.
- Firestore real-time sync of owner-scoped collections (`src/lib/firestore.ts`),
  auto-seeded dummy dataset per account.
- Residue registration wizard (3 steps, validated).
- Rule-based buyer matching with blockers.
- Shared economics calculation.
- Transaction state machine with event timeline.
- Impact & evidence screen.
- Provenance labels and methodological limits.
- Runs in Expo Go (SDK 58) on Android and iOS.

### Out of scope for the mobile prototype

- Production identity program (phone OTP, roles, consent flows).
- Real buyer quotations or integrations.
- Payment processing.
- Live truck dispatch or logistics scheduling.
- Satellite risk intelligence (operator surfaces, later phases).
- Verified avoided-emission reporting.
- Push notifications, camera capture, offline write queueing.

## 3. Architecture Principles

1. One Expo app; domain logic stays plain TypeScript with no React Native imports.
2. State is managed centrally (one Context store) so screens cannot disagree.
   Firestore is the source of truth in cloud mode; snapshots hydrate the store.
3. Provenance and verification status travel with every record.
4. Never force an uneconomic buyer match.
5. All financial calculations reproducible through one function.
6. Demo fixtures stay explicitly separate from future production data; every
   cloud record carries `ownerId` and is guarded by `firestore.rules`.
7. Prefer Expo Go–compatible dependencies until a development build is justified
   — Firebase JS SDK plus `expo-auth-session`, never `@react-native-firebase/*`.

## 4. Technology Stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo SDK 58, React Native 0.88, React 19.3 |
| Language | TypeScript (strict) |
| Navigation | expo-router (file-based, typed routes) |
| State | React Context + reducer (`src/store/demo-store.tsx`) |
| Auth | Firebase Authentication + `expo-auth-session` Google provider (`src/store/auth-store.tsx`) |
| Styling | StyleSheet with centralized tokens (`src/constants/theme.ts`) — AgroTech design system (design.md) |
| Typography | Newsreader (serif headings/values) × Plus Jakarta Sans (body/UI) via `@expo-google-fonts` |
| Data | Firestore (cloud mode) or local fixtures (`src/data/fixtures.ts`) in demo mode |
| Local storage | `@react-native-async-storage/async-storage` — session persistence + profile snapshot |
| Formatting | `Intl` via shared helpers (`src/lib/format.ts`) |

Planned (later phases): Jest unit tests for the domain layer, draft persistence,
offline write queueing, i18n, camera via `expo-image-picker`, push notifications,
and production backend endpoints.

## 5. Directory Structure

```text
strawhub/
├── app.json
├── assets/
├── src/
│   ├── app/                      # expo-router routes
│   │   ├── _layout.tsx           # AuthProvider + DemoProvider + route guard
│   │   ├── login.tsx             # Google Sign-In / demo profile
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx       # bottom tabs
│   │   │   ├── index.tsx         # Home
│   │   │   ├── registry.tsx      # Residue registry
│   │   │   ├── matches.tsx       # Buyer matching
│   │   │   └── transactions.tsx   # Deals list
│   │   ├── register.tsx          # 3-step registration wizard
│   │   ├── impact.tsx            # Impact & evidence
│   │   └── transaction/[id].tsx  # Transaction detail
│   ├── components/ui.tsx         # themed primitives
│   ├── constants/theme.ts        # design tokens
│   ├── domain/                   # no React Native imports
│   │   ├── types.ts
│   │   ├── economics.ts
│   │   ├── matching.ts
│   │   ├── transactions.ts
│   │   └── impact.ts
│   ├── data/fixtures.ts          # simulated dataset + metadata
│   ├── hooks/use-app-theme.ts
│   ├── lib/
│   │   ├── format.ts
│   │   ├── firebase.ts           # app/auth/firestore bootstrap, env config
│   │   └── firestore.ts          # subscriptions, seeding, owner-scoped writes
│   └── store/
│       ├── auth-store.tsx        # Firebase session + profile persistence
│       └── demo-store.tsx        # local reducer + cloud-aware mutations
├── firestore.rules               # owner-scoped security rules
├── scripts/seed-firestore.mjs    # Admin SDK dummy-data seeder
├── PRD.md
├── design.md
├── ROADMAP.md
├── spec/system-spec.md
└── research/
```

Rule: `domain/` may not import React or React Native. UI components may consume domain types and call domain functions. Business logic must never be duplicated between screens.

## 6. Domain Modules

### 6.1 Residue (`types.ts`, store)

Create residue records with crop type, field area + unit, harvest date, condition, handling form, estimated quantity + method, availability window, verification status, provenance. Estimated and measured quantities stay separate fields.

### 6.2 Economics (`economics.ts`)

One function `calculateEconomics({ sellableQuantityTonnes, buyer })`:

```text
grossValue    = sellableQuantityTonnes × pricePerTonne
transportCost = 0                        when priceBasis = delivered
             = quantity × costPerTonne   otherwise
knownCosts    = transportCost + loadingCost + balingCost
netProceeds   = grossValue − knownCosts
```

- Missing inputs are reported (`missingCostInputs`), never silently zero-filled.
- Delivered quotes never get transport charged twice.
- Negative net proceeds remain visible.

### 6.3 Matching (`matching.ts`)

`evaluateMatch(record, buyer)` applies hard constraints in order: residue type → condition → handling form → volume min/max → availability window → quote validity. Result: `eligible | ineligible` with explicit blockers. `findMatches` sorts eligible candidates by best net proceeds; ranking never overrides a failed constraint.

### 6.4 Transactions (`transactions.ts`)

State machine with `ALLOWED_TRANSITIONS`; `canTransition`, `nextStatuses`, `isTerminal`, `progressStep`. The store rejects invalid transitions silently and records an event (from/to status, actor, timestamp, note) for each accepted one.

### 6.5 Impact (`impact.ts`)

`summarizeOperations(residue, transactions)` aggregates registered/verified/collected/sold tonnes and completion rate. Environmental impact is never derived here — the impact screen renders “Not estimated” until a documented method exists.

## 7. Data Model

Types in `src/domain/types.ts`:

- **ResidueRecord** — `id`, `farmerName`, `zone`, `residueType`, `fieldAreaValue`, `fieldAreaUnit`, `harvestDate`, `condition`, `handlingForm`, `estimatedQuantityTonnes`, `estimateMethod`, `availableFrom`, `availableUntil`, `photoCount`, `verificationStatus`, `provenance`, `createdAt`.
- **Buyer** — `id`, `name`, `buyerType`, `location`, `distanceKm`, cost rates, `requirement`, `verificationStatus`.
- **BuyerRequirement** — accepted types/conditions/forms, volume min/max, required window, `pricePerTonne`, `priceBasis` (`farm_gate | delivered | unknown`), `validUntil`.
- **Transaction** — `id`, `residueRecordId`, `buyerId`, `offerPricePerTonne`, estimated/measured/accepted quantities, `status`, schedule timestamps, `provenance`.
- **TransactionEvent** — append-only audit trail per transaction.

Controlled vocabularies: `ResidueType`, `ResidueCondition`, `HandlingForm`, `TransactionStatus`, `Provenance`, `VerificationStatus`.

### Provenance and verification

- Provenance: `simulated | observed | derived | verified`.
- Verification: `unverified | pending | verified | rejected | needs_review`.

These are separate axes. A derived value can still need review; an observed value is not automatically verified.

### Cloud persistence (prototype)

Firestore collections mirror the domain types; dates are ISO strings and every
document carries `ownerId` (the Firebase Auth uid):

| Collection | Contents |
| --- | --- |
| `users/{uid}` | profile snapshot (`displayName`, `email`, `photoURL`), seed bookkeeping |
| `buyers/{id}` | shared buyer catalog, admin-seeded, read-only to clients |
| `residueRecords/{id}` | ResidueRecord + `ownerId` |
| `transactions/{id}` | Transaction + `ownerId` |
| `transactionEvents/{id}` | TransactionEvent + `ownerId` |

On first sign-in the account is seeded with the demo dataset. Cloud mode treats
Firestore as the source of truth: mutations are optimistic local dispatches plus
a write with identical ids, and `onSnapshot` reconciliation replaces state.
`firestore.rules` restricts reads/writes to documents whose `ownerId` matches
the caller's uid.

## 8. Business Rules

1. Quantity must be positive with an explicit unit; estimates carry a visible method.
2. A photo (future) is never treated as a mass or moisture measurement.
3. Eligibility fails on any hard constraint; “no viable match” is valid and explainable.
4. Price basis distinguishes farm-gate, delivered, and unknown; delivered quotes skip transport costs.
5. Only state-machine-legal transitions are offered in the UI.
6. Measured weight never overwrites the estimate; both remain visible.
7. Demo completion never implies real payment.
8. Collected mass ≠ diverted mass; avoided emissions require a documented counterfactual — render “Not estimated” otherwise.
9. Cloud data is owner-scoped: a user reads and writes only documents whose
   `ownerId` equals their uid; buyers are read-only to clients.

## 9. Demo Data Contract

Every dataset declares its status (`DATASET_METADATA` in `src/data/fixtures.ts`):

```json
{
  "mode": "simulated",
  "region": "Illustrative pilot region",
  "asOf": "2026-11-10",
  "warning": "All records are illustrative and not field-verified."
}
```

One shared fixture source feeds every screen. State is in-memory and resets on reload; persistence is a later phase. New records are marked `provenance: "simulated"`.

## 10. Testing Strategy

Current phase: manual demo flow in Expo Go (see README demo flow).

Planned with the testing phase:

- **Unit (Jest):** economics math (including delivered-basis, negative nets, missing inputs), matching blockers, no-match, state-machine transitions, aggregations.
- **Integration:** register → match → offer → accept → weigh → complete, asserting metric consistency.
- **UI:** tab reachability, wizard validation messages, demo banner presence on every screen.

## 11. Non-Functional Requirements

- **Reliability:** identical inputs produce identical calculations.
- **Usability:** the demo completes without manual data editing; registration under 3 minutes of active input.
- **Performance:** cold start and tab switches remain smooth on entry-level Android hardware in Expo Go.
- **Accessibility:** labeled controls, selected states, 44 pt targets, status never color-only, body text ≥ 14 pt.
- **Maintainability:** domain logic isolated from UI and never duplicated across screens.
- **Localization:** currency, dates, and units format through `src/lib/format.ts`; UI copy extraction is a later phase.

## 12. Open Technical Decisions

- Persistence layer for demo state (AsyncStorage vs. SQLite).
- Test runner setup (Jest vs. Vitest in Expo context).
- i18n framework and Bahasa Indonesia rollout plan.
- Backend and authentication approach for the pilot phase.
- Map rendering (operator screens only) and risk data ingestion.
- Photo capture protocol and private storage.
- Impact methodology (counterfactual + emission factors) before any environmental claim.
