# StrawHub — Development Roadmap

Phased plan from the current mobile prototype to a field-pilotable product.
Each phase has a goal, scope, exit criteria, and explicit out-of-scope items.

**Current status: Phase 1 complete.**

## Phase Overview

| Phase | Name | Goal | Status |
| --- | --- | --- | --- |
| 1 | Mobile prototype | Farmer journey works in Expo Go on simulated data | ✅ Done |
| 2 | Local persistence & offline UX | Data survives restarts; read screens work offline | Planned |
| 3 | Testing & quality | Domain logic covered by unit/integration tests | Planned |
| 4 | Local market research | Replace simulated buyers with verified local demand | Planned |
| 5 | Backend & accounts | Real data model, auth, farmer identity | Planned |
| 6 | Buyer & operator surfaces | Buyer app section; operator web dashboard | Planned |
| 7 | Pilot program | First real transactions in one region | Planned |
| 8 | Impact methodology | Defensible environmental claims | Planned |

---

## Phase 1 — Mobile Prototype ✅

**Goal:** a farmer completes the full journey on a phone in Expo Go.

- Expo SDK 58 / React Native 0.88 project, Expo Go compatible.
- Tabs: Home, Registry, Matches, Deals.
- 3-step residue registration wizard with validation and auto-estimate.
- Rule-based matching with explicit blockers and no-match state.
- Shared economics calculation (gross → costs → indicative net).
- Transaction state machine + event timeline.
- Impact & evidence screen (environmental impact: not estimated).
- Central demo store; single fixture source; provenance labels throughout.

**Exit criteria:** demo flow completes end-to-end on a device without manual data editing.

## Phase 2 — Local Persistence & Offline UX

**Goal:** demo state survives app restarts; read screens tolerate no connectivity.

- Persist store to AsyncStorage (hydrate on launch, save on mutation).
- Draft persistence for the registration wizard across app restarts.
- Reset-demo-data restores fixtures cleanly.
- Handle loading and error states for the persisted store.
- Performance pass on low-end Android (cold start, list rendering).

**Exit criteria:** kill and reopen the app mid-registration; the draft is intact and completed records persist.

**Out of scope:** any network API.

## Phase 3 — Testing & Quality

**Goal:** domain logic changes are safe and verifiable.

- Jest test setup for the domain layer.
- Unit tests: economics (delivered basis, negative nets, missing inputs), matching blockers, no-match, state-machine legality, aggregations.
- Integration test: register → match → offer → weigh → complete; metrics consistent.
- Lint/typecheck gates in CI (GitHub Actions).
- Basic smoke test on Expo Go build.

**Exit criteria:** CI runs typecheck, lint, and the domain test suite on every push.

## Phase 4 — Local Market Research

**Goal:** replace simulated buyers and prices with verified, region-specific demand.

- Relocate the India-focused evidence baseline (`research/`) to an Indonesian pilot region.
- Identify candidate regions from rice/wheat/corn production data.
- Verify at least one buyer pathway per region: feedstock acceptance, quality, volume, price basis, logistics terms.
- Build low/base/high cost scenarios for collection and transport.
- Document all findings in `research/`; mark what remains unverified.
- Update fixtures with researched (but still labeled) figures.

**Exit criteria:** at least one buyer in the fixtures is `observed` with a recorded verification date, and the evidence brief cites region-specific sources.

**Out of scope:** live buyer integrations in the app.

## Phase 5 — Backend & Accounts

**Goal:** real data beyond one device.

- Data model migration: SQLite/PostgreSQL persistence mirroring `src/domain/types.ts`.
- Farmer accounts (phone-number OTP), role-based access (farmer, buyer, operator).
- API with schema validation (Zod-style), consistent errors, audit events.
- Private photo storage with consent flow.
- App moves from Expo Go to development builds (EAS).

**Exit criteria:** a farmer registers on one device and sees their data on another.

## Phase 6 — Buyer & Operator Surfaces

**Goal:** the other two participants get their views on the same domain model.

- Buyer experience: requirement posting, supply discovery, offer confirmation.
- Operator web dashboard: registered supply, transaction monitoring, outreach coordination.
- Risk intelligence screens (satellite-derived) for outreach prioritization — separate from farmer data.
- Notifications (push) for offer status changes.

**Exit criteria:** a buyer confirms a real offer in-app; an operator views the pipeline.

## Phase 7 — Pilot Program

**Goal:** first real transactions in one region.

- Select region and farmer group using Phase 4 evidence.
- Onboard real buyers with confirmed terms.
- Run real transactions end-to-end; measure completion rate, estimate-vs-measured gap, time-to-match, farmer net proceeds vs local alternative.
- Privacy, consent, and retention procedures active before real data collection.
- Decide scale-up / iterate / stop based on results.

**Exit criteria:** documented pilot evaluation with honest metrics (including failures).

## Phase 8 — Impact Methodology

**Goal:** environmental claims become defensible or stay unmade.

- Document counterfactual method for “would otherwise have been burned.”
- Source region-appropriate emission factors; define system boundaries and uncertainty.
- Independent review of the method before any public claim.
- Only then: replace “Not estimated” with labeled estimates.

**Exit criteria:** impact numbers on the Impact screen trace to a documented method version, or remain explicitly not estimated.

---

## Planning Rules

1. Phases are sequential; a phase starts only when the previous one's exit criteria are met.
2. Simulated data stays labeled until Phase 4/7 evidence replaces it — provenance labels are permanent.
3. No phase introduces a second backend, a message broker, or a microservices split without a demonstrated requirement.
4. Farmer-facing scope is never sacrificed for operator features before Phase 7.
5. Environmental impact is claimed only through Phase 8 — never earlier.
