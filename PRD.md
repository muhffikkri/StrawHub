# AgniDrishti — Product Requirements Document

**Version:** 0.1  
**Status:** Draft  
**Product:** Agricultural Burning Risk Intelligence & Residue Marketplace  
**Primary tagline:** Jerami Jadi Rupiah  
**Initial mode:** Interactive web prototype with simulated data

## 1. Product Overview

AgniDrishti is a platform concept that connects agricultural residue burning risk intelligence with an economic alternative: helping farmers find suitable buyers for surplus straw before it is burned.

The system combines four capabilities:

1. **Risk Intelligence:** prioritize areas for preventive outreach using agricultural context, historical observations, and environmental signals.
2. **Residue Registration:** help farmers or field operators register available straw, including its type, estimated quantity, condition, location, and availability.
3. **Buyer Matching:** compare residue supply against buyer requirements, indicative prices, and logistics costs.
4. **Transaction and Impact Tracking:** follow the process from offer to collection and completion, while reporting operational outcomes separately from estimated environmental impact.

The prototype demonstrates this end-to-end workflow using explicitly simulated records. It does not claim to provide operationally validated fire predictions, real buyer commitments, or verified avoided emissions.

## 2. Problem Statement

Agricultural residue can have alternative uses, including animal feed and biomass applications. However, its potential value does not automatically translate into farmer income.

Farmers may face short turnaround times between harvests, residue removal costs, limited access to machinery, transportation constraints, and uncertainty about buyer demand. Meanwhile, buyers need reliable information about material type, quality, quantity, timing, and delivery costs.

Existing fire monitoring can identify thermal anomalies, but a hotspot alone cannot establish that the event was intentional agricultural residue burning. Detection after a fire starts also does not, by itself, solve the economic constraints that may lead to burning.

**AgniDrishti's core hypothesis:** combining risk prioritization with verified residue supply and economically viable buyer matching can make non-burning alternatives more accessible to farmers.

This hypothesis must be tested through field data and actual transactions. It must not be presented as an established result.

## 3. Product Goals

### 3.1 MVP goals

- Present a clear operational overview of risk areas and residue transactions.
- Let users explore illustrative risk zones and their contributing signals.
- Demonstrate residue registration with transparent quantity assumptions.
- Compare buyer candidates against material and logistical constraints.
- Calculate indicative gross value, known costs, and estimated farmer net value.
- Demonstrate a transaction lifecycle through completion.
- Report registered, verified, collected, and sold residue as distinct metrics.
- Clearly distinguish simulated, observed, derived, and verified information.
- Establish a modular application foundation that can evolve into a production system.

### 3.2 Non-goals

The prototype will not:

- Automatically identify every hotspot as a straw-burning event.
- Accuse farmers or trigger enforcement actions.
- Claim a validated three-to-seven-day prediction capability.
- Estimate straw mass or moisture accurately from a photograph alone.
- Guarantee buyer acceptance, market prices, or transportation availability.
- Execute real payments, dispatch trucks, or contact farmers automatically.
- Claim that all collected straw would otherwise have been burned.
- Claim verified emission reductions without a documented counterfactual and suitable emission factors.

## 4. Target Users

### 4.1 Program Operator / Administrator

**Needs**

- Understand which areas deserve outreach.
- Review risk context and data quality.
- Monitor registered supply and potential buyer matches.
- Coordinate offers, pickup schedules, and transaction status.

**Success condition:** the operator can follow one case from risk review to transaction completion.

### 4.2 Farmer

**Needs**

- Register available straw with minimal effort.
- Understand available utilization options.
- Compare indicative prices and deductions.
- Accept, reject, or request clarification on an offer.

**Success condition:** the farmer can evaluate a transparent offer without being pressured into an uneconomic transaction.

### 4.3 Buyer / Aggregator

**Needs**

- Describe required residue types, quality, quantity, and timing.
- Discover suitable supply.
- Review indicative costs and logistics.
- Confirm or reject a proposed transaction.

**Success condition:** the buyer receives relevant supply opportunities that meet minimum requirements.

### 4.4 Program Evaluator / Decision Maker

**Needs**

- Understand the operational workflow and program performance.
- Inspect the source and quality of the displayed data.
- Distinguish activity metrics from environmental outcomes.

**Success condition:** the evaluator can determine what the prototype demonstrates and what still requires evidence.

## 5. Product Modules

### M1. Overview Dashboard

Display:

- Risk zones requiring review.
- Residue registered and verified.
- Residue collected and sold.
- Indicative supply value.
- Active and completed transactions.
- Recent activity and data-quality notices.

**Acceptance criteria**

- All simulated values carry a visible demo label.
- Each metric has a defined meaning and unit.
- Registered supply is never presented as collected supply.
- Avoided emissions remain unavailable unless a supported method exists.

### M2. Risk Intelligence

Display:

- Illustrative risk zones.
- Risk band and score.
- Assessment horizon.
- Agricultural and environmental context.
- Data provenance and verification status.
- Recommended follow-up action.

**Acceptance criteria**

- A score is accompanied by a method label and uncertainty or limitations.
- A hotspot is not automatically labeled as straw burning.
- Insufficient data produces an unknown status, not a false low-risk classification.
- Risk scores are used for outreach prioritization, not accusations or penalties.

### M3. Residue Registry

Allow users to register:

- Farmer or demo profile.
- General location or zone.
- Crop and residue type.
- Field area and unit.
- Harvest date.
- Residue condition and handling form.
- Estimated quantity and availability window.
- Optional photograph.
- Verification status.

**Acceptance criteria**

- Required inputs are validated.
- Estimated quantity is distinct from measured weight.
- The source and assumptions behind an estimate are visible.
- A photograph is not treated as a precise mass or moisture measurement.

### M4. Buyer Matching

Display eligible buyer candidates based on:

- Accepted residue type.
- Condition and handling form.
- Minimum and maximum volume.
- Availability window.
- Indicative price and price basis.
- Distance and transportation assumptions.
- Buyer verification and quote validity.

**Acceptance criteria**

- Hard constraint failures are shown as explicit blockers.
- The system can return “No viable match.”
- Gross value, known costs, and indicative net value are displayed separately.
- The system does not double-count transportation already included in a delivered-price quote.

### M5. Transactions

Display:

- Transaction ID.
- Farmer and buyer references.
- Offered price and quantity.
- Estimated and measured quantities.
- Pickup schedule.
- Current status and event history.
- Payment status.

**Acceptance criteria**

- Only allowed state transitions are permitted.
- Each transition records a timestamp and actor in the intended production design.
- Demo completion does not imply a real payment.
- Disputes and cancellations can be represented.

### M6. Impact & Evidence

Display:

- Registered, verified, collected, and sold residue.
- Transaction completion rate.
- Farmer economic estimates.
- Data sources and provenance.
- Calculation assumptions and methodological limitations.
- Environmental impact only when defensible evidence is available.

**Acceptance criteria**

- Collected mass is not automatically equated with mass diverted from burning.
- Environmental impact is labeled provisional or not estimated when appropriate.
- Model performance is not displayed as a result unless a valid experiment has been performed.

## 6. Primary User Journey

1. The operator opens the overview dashboard.
2. The operator inspects an area flagged for preventive outreach.
3. The operator reviews the available signals and confirms that the risk record is illustrative or appropriately verified.
4. A farmer or field operator registers residue.
5. The system evaluates buyer candidates.
6. The operator compares price, transportation, handling costs, and indicative net value.
7. An offer is prepared and accepted in the demo workflow.
8. Pickup is scheduled.
9. The collected quantity is recorded separately from the original estimate.
10. The transaction is completed in the demo.
11. The impact dashboard updates operational metrics and preserves the limitations of any environmental estimate.

## 7. Prototype Scope and Priorities

### P0 — Required

- Overview dashboard.
- Risk Intelligence page.
- Residue registration form.
- Buyer Matching page.
- Economic calculator.
- Transaction list and status transitions.
- Impact & Evidence page.
- Shared simulated dataset and consistent demo labels.
- Responsive navigation and functional primary interactions.

### P1 — Desirable

- Filters and search.
- Detail drawers or modals.
- Transaction event timeline.
- Empty, error, and no-match states.
- Scenario switching for different supply and buyer conditions.

### P2 — Future

- Real satellite ingestion.
- Validated prediction model.
- Production authentication and role-based access.
- Live buyer offers.
- Logistics scheduling and payment integration.
- Auditable impact methodology.

## 8. Success Metrics

### Prototype quality

- All six modules are accessible.
- The end-to-end demo completes without manual data-file editing.
- Calculations are deterministic and explainable.
- UI updates remain consistent after creating a record or changing a transaction.
- Simulated records are clearly identifiable.

### Future pilot evaluation

- Precision, recall, PR-AUC, calibration, and false-positive burden for risk assessments.
- Percentage of registered residue verified.
- Offer acceptance rate.
- Pickup completion rate.
- Difference between estimated and measured quantities.
- Time from registration to buyer match and pickup.
- Farmer net proceeds relative to the actual alternative available.
- Buyer repeat-purchase rate.
- Independently supported evidence of residue diversion from burning.

Numeric pilot targets must be set after baseline data, sample size, and operational capacity are understood.

## 9. Product Risks and Mitigations

| Risk                                                   | Mitigation                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| Hotspots incorrectly attributed to straw burning       | Combine independent agricultural context and local verification |
| Predictions fail outside the training period or region | Temporal and geographic evaluation                              |
| Buyer prices are stale                                 | Quote validity, source, and confirmation status                 |
| Logistics make a match uneconomic                      | Explicit cost breakdown and no-match option                     |
| Quantity estimates are inaccurate                      | Store estimates and actual measurements separately              |
| Impact claims are overstated                           | Document counterfactual, factors, and uncertainty               |
| Demo data is mistaken for field evidence               | Persistent simulated-data indicators                            |
| Farmer data is exposed                                 | Consent, least-privilege access, and data minimization          |

## 10. Product Principles

1. Economic feasibility is as important as risk detection.
2. A risk score is not proof of wrongdoing.
3. A buyer match is a candidate until terms are confirmed.
4. Farmer net estimates must expose missing costs.
5. Operational metrics and environmental impact metrics must remain distinct.
6. The system must be able to say “unknown,” “not enough information,” or “no viable match.”
7. The prototype should demonstrate a credible workflow, not pretend to be a fully operational service.

## 11. Open Questions

- Which pilot district and farmer group will be selected after data validation?
- Which residue types and local buyer categories should be prioritized?
- What independent labels can distinguish crop-residue burning from other thermal events?
- How will quantity and material quality be measured?
- Who pays for collection, baling, loading, and transportation?
- What is the farmer's real alternative-use value?
- Which privacy, consent, and retention requirements apply?
- What evidence is required before reporting avoided burning or emissions?
