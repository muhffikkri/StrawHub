# StrawHub — Product Requirements Document

**Version:** 0.1
**Status:** Draft
**Product:** Farmer-first straw marketplace mobile app
**Primary tagline:** Jerami Jadi Rupiah
**Platform:** React Native (Expo) — Android and iOS, runnable in Expo Go
**Initial mode:** Interactive mobile prototype with simulated data

## 1. Product Overview

StrawHub is a mobile application that helps farmers turn surplus crop residue — straw — into income instead of burning it. The app gives a farmer a phone-first workflow: register available residue, see buyer candidates with transparent economics, accept or reject an offer, and follow the transaction through to completion.

The mobile MVP focuses on the farmer, the participant with the least time and the most friction. Operator dashboards, risk intelligence screens, and web tooling are deliberately deferred to later phases (see `ROADMAP.md`).

The prototype demonstrates the farmer's end-to-end journey using explicitly simulated records. It does not claim real buyer commitments, validated fire predictions, or verified avoided emissions.

Core capabilities demonstrated by the MVP:

1. **Residue Registration:** register straw type, estimated quantity, condition, location, and availability window in a mobile-friendly, step-by-step form.
2. **Buyer Matching:** compare registered residue against buyer requirements, indicative prices, and logistics costs.
3. **Economics Transparency:** show gross value, known costs, and indicative net proceeds — separately and explicitly.
4. **Transaction Tracking:** follow an offer through a constrained state machine to completion, with estimated and measured quantities kept distinct.
5. **Impact Summary:** report operational metrics honestly, and keep environmental impact clearly separated and labeled as not estimated until evidence exists.

## 2. Problem Statement

Post-harvest residue can have value as fodder, biomass feedstock, or other uses, but that value does not automatically reach the farmer. Farmers face tight turnaround between harvests, collection and machinery costs, uncertain buyer demand, and logistics constraints.

Desktop-first tools fail this audience: farmers are in the field, often on lower-end Android phones, with limited time and patchy connectivity. The decision to burn or sell is made within days of harvest. A usable alternative must live on the farmer's phone, tolerate offline conditions, and present the economics plainly enough to trust.

**StrawHub's core hypothesis:** when a farmer can register residue in minutes and see a transparent, viable offer, non-burning alternatives become accessible enough to compete with burning.

This hypothesis must be tested with field data and real transactions. It must not be presented as an established result.

## 3. Product Goals

### 3.1 MVP goals (mobile)

- Let a farmer register available residue in under three minutes of active input.
- Present buyer matches with explicit pass/fail reasons, never a forced match.
- Show gross value, known costs, and indicative net proceeds as separate numbers.
- Support the full demo transaction lifecycle on a phone: offer → accept → pickup → weighed → payment → completed.
- Keep estimated and measured quantities distinct everywhere.
- Distinguish simulated, observed, derived, and verified information visibly.
- Work on low-end Android devices and tolerate brief offline periods for read-only screens.
- Establish a modular React Native foundation that can grow into a production app without a rewrite.

### 3.2 Non-goals (MVP)

The prototype will not:

- Estimate straw mass or moisture from a photograph alone.
- Guarantee buyer acceptance, market prices, or transportation availability.
- Execute real payments, dispatch trucks, or contact buyers automatically.
- Include operator dashboards, satellite risk intelligence, or web screens (later phases).
- Include real accounts, authentication, or a backend (later phases).
- Claim that collected straw would otherwise have been burned.
- Claim verified emission reductions without a documented counterfactual and emission factors.
- Support right-to-left languages or tablet layouts in the first pass.

## 4. Target Users

### 4.1 Farmer (primary mobile user)

**Needs**

- Register straw quickly with minimal typing; pick sensible defaults.
- Understand what the straw is worth after costs, in plain language.
- Accept, reject, or ask about an offer without pressure.
- See transaction status without calling anyone.

**Success condition:** the farmer can evaluate a transparent offer on their phone without help.

### 4.2 Buyer / Aggregator (secondary, later phase)

**Needs**

- Describe required residue types, quality, quantity, and timing.
- Discover suitable supply near them.
- Confirm or reject a proposed transaction.

**Success condition:** the buyer receives relevant supply that meets minimum requirements. A buyer-facing experience is out of MVP scope but the data model must not exclude it.

### 4.3 Program Operator (later phases)

**Needs**

- Monitor registered supply, matches, and transaction status.
- Coordinate outreach and pickup logistics.
- Will consume a web/ops surface built on the same domain model.

**Success condition:** out of MVP scope. The mobile app must record data cleanly enough that an operator view can be added later.

### 4.4 Program Evaluator / Decision Maker

**Needs**

- Understand what the prototype demonstrates and what still requires evidence.
- Inspect data provenance on the device.

**Success condition:** the evaluator can distinguish simulated from real information in every screen.

## 5. Product Modules (Mobile MVP)

### M1. Home / Overview

Display:

- Farmer profile summary (demo profile in prototype).
- Registered residue and its verification status.
- Active transactions needing attention.
- Quick action: register new residue.
- Impact summary entry point.

**Acceptance criteria**

- All simulated values carry a visible demo indicator.
- Every metric has a defined meaning and unit.
- Registered supply is never presented as collected supply.
- Primary actions are reachable with one thumb tap.

### M2. Residue Registry (mobile form)

Register:

- Crop and residue type (from a controlled list).
- Field area with explicit unit.
- Harvest date.
- Condition and handling form.
- Estimated quantity with unit, and how the estimate was made.
- Availability window.
- Optional photograph.
- General location (zone or district pickers — no precise GPS requirement in MVP).

**Acceptance criteria**

- Inputs are grouped into short steps; each step fits one screen.
- Every field has a persistent label and inline errors.
- Estimated quantity is labeled as an estimate, with method visible.
- The form works one-handed; primary button is at the bottom.
- A photograph is never treated as a mass or moisture measurement.
- The form tolerates interrupted input (draft persists across app restarts).

### M3. Buyer Matching

Display candidate buyers for a registered residue:

- Buyer name and use category.
- Accepted residue type, condition, and handling form.
- Volume constraints and availability window.
- Indicative price, price basis, and quote validity.
- Distance and transportation assumption.
- Eligibility result with explicit blockers.

**Acceptance criteria**

- Hard constraint failures appear as explicit blockers with reasons.
- "No viable match" is a valid, explainable outcome.
- Eligible candidates are ranked, but ranking never overrides a failed constraint.
- Matches use a "rule-based fit" label, not an unexplained percentage.

### M4. Economics Calculator

Displayed with every match and in a dedicated breakdown view:

1. Sellable quantity.
2. Indicative gross value.
3. Transportation cost.
4. Loading, baling, and other known costs.
5. Indicative net value.
6. Missing costs and assumptions.

**Acceptance criteria**

- Deductions use explicit negative signs; negative net values remain visible.
- Missing costs are listed, and the result is labeled partial.
- Delivery-inclusive quotes never get transport costs double-counted.
- Currency and units format through shared utilities.

### M5. Transactions

Display:

- Transaction reference, buyer, offered price, and quantity.
- Estimated and measured quantities.
- Pickup schedule.
- Current status and event history.
- Demo payment status.

**Acceptance criteria**

- Only allowed state transitions are offered in the UI.
- Every transition records a timestamp and actor label.
- Demo completion never implies a real payment.
- Rejection, cancellation, and dispute states are representable.
- Status changes are visible from the Home screen.

### M6. Impact & Evidence Summary

Display:

- Residue registered, verified, collected, and sold (as distinct metrics).
- Transaction completion rate.
- Data sources, provenance, and assumptions.
- Environmental impact only when defensible evidence exists.

**Acceptance criteria**

- Collected mass is never equated with mass diverted from burning.
- Avoided emissions show "Not estimated" until a counterfactual method exists.
- Every number can be traced to its provenance label on tap.

## 6. Primary User Journey (Mobile)

1. The farmer opens the app on a phone (Expo Go in the prototype).
2. The Home screen shows registered residue and active transactions.
3. The farmer taps **Register residue** and completes the short form.
4. The app evaluates buyer candidates against the new record.
5. The farmer opens **Matches** and reviews eligibility, blockers, and economics.
6. The farmer opens the calculator breakdown for the strongest candidate.
7. The farmer accepts the demo offer.
8. The app walks the transaction through pickup, weighing, and payment states.
9. Measured weight is recorded separately from the estimate.
10. The Impact summary updates operational metrics and keeps environmental impact labeled as not estimated.

## 7. Prototype Scope and Priorities

### P0 — Required

- Tab navigation: Home, Registry, Matches, Transactions.
- Mobile registration form with validation.
- Rule-based matching with blockers and no-match state.
- Economics calculator with explicit breakdown.
- Transaction list, detail, and state transitions.
- Impact & evidence screen.
- Shared simulated dataset with consistent demo labels.
- Works on a physical Android device in Expo Go.

### P1 — Desirable

- Offline read-only caching of fixtures.
- Draft persistence for the registration form.
- Transaction event timeline.
- Search and filters on lists.
- Empty, error, and no-match states for every list.
- Bahasa Indonesia UI copy alongside English.

### P2 — Future

- Real accounts, backend, and role-based access.
- Buyer-facing experience.
- Operator web dashboard and risk intelligence screens.
- Live buyer quotes and logistics scheduling.
- Photo upload to private storage.
- Payments integration.
- Auditable impact methodology.

## 8. Success Metrics

### Prototype quality

- The end-to-end farmer journey completes on a phone without manual data editing.
- Registration takes under three minutes of active input in a usability pass.
- All six modules are reachable within two taps of the Home screen.
- Calculations are deterministic and explainable.
- Simulated records are identifiable in every screen.

### Future pilot evaluation

- Percentage of registered residue verified in the field.
- Offer acceptance rate.
- Pickup completion rate.
- Difference between estimated and measured quantities.
- Time from registration to match and to pickup.
- Farmer net proceeds relative to the actual local alternative.
- Buyer repeat-purchase rate.
- Independently supported evidence of residue diversion from burning.

Numeric pilot targets must be set after baseline data, sample size, and operational capacity are understood.

## 9. Product Risks and Mitigations

| Risk                                                  | Mitigation                                                       |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| Farmers burn before any match can be arranged         | Fast registration, instant indicative matches from cached buyers |
| Buyer prices are stale or unverified                  | Quote validity, provenance, and confirmation status in every card |
| Logistics make a match uneconomic                     | Explicit cost breakdown and a no-match outcome                  |
| Quantity estimates are inaccurate                     | Store estimates and measurements separately                      |
| Mobile data entry errors corrupt records              | Controlled vocabularies, validation, and unit labels             |
| Impact claims are overstated                           | Not-estimated default, documented method before any claim        |
| Demo data is mistaken for field evidence              | Persistent simulated-data indicators in every screen              |
| Farmer data is exposed                                 | Consent, least-privilege access, and data minimization (later)   |
| Low-end devices run the app poorly                    | Performance budget on entry-level Android hardware               |

## 10. Product Principles

1. The farmer's time is the scarcest resource; every screen earns its taps.
2. Economics must be transparent — no hidden costs, no forced matches.
3. A buyer match is a candidate until terms are confirmed.
4. Estimated is not measured. Registered is not collected. Collected is not diverted.
5. Operational metrics and environmental impact remain distinct.
6. The system must be able to say "unknown," "not enough information," or "no viable match."
7. The prototype demonstrates a credible workflow; it does not pretend to be a live service.

## 11. Open Questions

- Which pilot region and farmer group will be selected after local market research?
- Which residue types and local buyer categories should be prioritized first?
- What is the farmer's realistic alternative-use value in the pilot region?
- Who pays for collection, baling, loading, and transportation in the first transactions?
- Which language mix (Bahasa Indonesia / English / local languages) does the pilot require?
- Which privacy, consent, and retention requirements apply before real farmer data is collected?
- What evidence is required before reporting avoided burning or emissions?
