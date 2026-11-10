# AgniDrishti — System Specification

**Version:** 0.1  
**Status:** Draft for prototype implementation  
**Architecture:** Modular monolith  
**Initial data mode:** Simulated fixtures  
**Target region:** To be selected after data validation

## 1. Purpose

This specification defines the technical boundaries, domain modules, data structures, business rules, transaction workflow, validation, and testing strategy for AgniDrishti.

The initial implementation should demonstrate a credible end-to-end workflow without requiring live satellite ingestion, a production prediction model, real buyer integrations, or real payments.

The architecture should permit these capabilities to be added later without rewriting the application around a microservices architecture.

## 2. System Boundary

### In scope for the prototype

- Dashboard and navigation.
- Simulated risk zones.
- Residue registration.
- Buyer listings and requirements.
- Rule-based matching.
- Indicative economic calculations.
- Transaction state transitions.
- Impact and evidence summaries.
- Provenance labels and methodological limitations.

### Out of scope for the prototype

- Live satellite data ingestion.
- Operational fire prediction.
- Real farmer identity verification.
- Real-time buyer quotations.
- Payment processing.
- Live truck dispatch.
- Production user authentication.
- Verified avoided-emission reporting.

## 3. Architecture Principles

1. Start with a modular monolith.
2. Separate domain rules from UI components.
3. Preserve provenance and verification status throughout the system.
4. Never interpret a hotspot alone as proof of crop-residue burning.
5. Do not force an uneconomic buyer match.
6. Make all financial calculations reproducible.
7. Keep demo fixtures explicitly separate from future production data.
8. Use independent validation before describing a model as predictive or operational.

## 4. Technology Stack

### 4.1 Prototype

- Next.js App Router.
- React and TypeScript.
- CSS or Tailwind CSS.
- Recharts for charts.
- Lucide icons.
- Local JSON fixtures.
- Local component state for interactive demo behavior.

The prototype may use client-side state for demonstration, but state should be managed centrally enough to prevent inconsistent values between the dashboard, registry, and transaction pages.

### 4.2 Future operational foundation

- PostgreSQL for relational data.
- PostGIS for geographic queries and geometries.
- Prisma or Drizzle ORM; choose one consistently.
- Next.js route handlers or server actions.
- Zod or an equivalent schema validation library.
- Private object storage for photographs and transaction evidence.
- Authentication and role-based access control.
- Background jobs for data ingestion when operational needs justify them.

Do not introduce microservices, a message broker, or a separate model-serving platform until a demonstrated requirement justifies the added complexity.

## 5. Recommended Directory Structure

```text
agnidrishti/
├── app/
│   ├── (dashboard)/
│   │   ├── overview/
│   │   ├── risk-intelligence/
│   │   ├── residue/
│   │   ├── marketplace/
│   │   ├── transactions/
│   │   └── impact/
│   ├── farmer/
│   ├── buyer/
│   └── api/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── maps/
│   ├── charts/
│   ├── residue/
│   ├── marketplace/
│   └── transactions/
├── modules/
│   ├── risk/
│   ├── residue/
│   ├── pricing/
│   ├── matching/
│   ├── transactions/
│   └── impact/
├── lib/
│   ├── validation/
│   ├── provenance/
│   ├── errors/
│   └── format/
├── data/
│   └── fixtures/
├── research/
├── PRD.md
├── design.md
└── spec/
    └── system-spec.md
```

Domain modules must not import React presentation components. UI components may consume domain types and call domain services.

## 6. Domain Modules

### 6.1 Risk Intelligence

Responsibilities:

- Maintain risk zones and contextual signals.
- Store risk assessments with horizon, method version, provenance, and uncertainty.
- Track review and follow-up status.
- Present explanatory factors to the operator.

It must not automatically conclude that a hotspot is agricultural burning.

### 6.2 Residue

Responsibilities:

- Create and update residue records.
- Store crop and residue types, harvest dates, condition, estimated volume, and availability.
- Track verification.
- Preserve estimated and measured quantities separately.

### 6.3 Pricing and Economics

Responsibilities:

- Store buyer quotes and their validity.
- Calculate gross value and known costs.
- Produce an indicative net estimate.
- Identify missing cost inputs.
- Compare proceeds against an alternative-use baseline when evidence exists.

### 6.4 Matching

Responsibilities:

- Apply hard eligibility constraints.
- Evaluate material, quantity, timing, and logistics.
- Return eligible, ineligible, or needs-information results.
- Explain why a candidate is or is not suitable.

### 6.5 Transactions

Responsibilities:

- Create offers.
- Enforce valid state transitions.
- Record status events.
- Track scheduled pickup, measured weight, accepted quantity, and payment confirmation separately.

### 6.6 Impact and Evidence

Responsibilities:

- Aggregate operational metrics.
- Preserve source and calculation provenance.
- Track methodology versions.
- Avoid environmental claims when evidence is insufficient.

## 7. Logical Data Model

Production tables should use stable IDs and timestamps. Relevant records should also contain provenance and verification fields.

### 7.1 AgriculturalZone

- `id`
- `name`
- `adminRegion`
- `geometry`
- `cropContext`
- `harvestWindowStart`
- `harvestWindowEnd`
- `provenance`
- `verificationStatus`

### 7.2 RiskAssessment

- `id`
- `zoneId`
- `score`
- `riskBand`
- `horizonStart`
- `horizonEnd`
- `methodVersion`
- `featureSummary`
- `uncertainty`
- `provenance`
- `assessmentStatus`
- `createdAt`

The score must not be called a probability unless the underlying method produces a calibrated probability. Every score needs a time horizon and method version.

### 7.3 ResidueRecord

- `id`
- `farmerId` (optional for the demo)
- `zoneId`
- `cropType`
- `residueType`
- `fieldAreaValue`
- `fieldAreaUnit`
- `harvestDate`
- `condition`
- `handlingForm`
- `estimatedQuantityTonnes`
- `measuredQuantityTonnes`
- `availableFrom`
- `availableUntil`
- `photoAssetIds`
- `verificationStatus`
- `provenance`
- `notes`

### 7.4 Buyer

- `id`
- `name`
- `buyerType`
- `location`
- `serviceArea`
- `activeStatus`
- `verificationStatus`
- `protectedContactData`

### 7.5 BuyerRequirement

- `id`
- `buyerId`
- `acceptedResidueTypes`
- `minimumVolumeTonnes`
- `maximumVolumeTonnes`
- `acceptedConditions`
- `acceptedHandlingForms`
- `maximumMoisturePct`
- `priceValue`
- `priceCurrency`
- `priceUnit`
- `priceBasis`
- `validFrom`
- `validUntil`
- `pickupTerms`
- `provenance`
- `verificationStatus`

Price basis must distinguish farm-gate, delivered, ex-works, and unknown. Quotes must not be presented as guaranteed if they have not been confirmed.

### 7.6 LogisticsEstimate

- `id`
- `residueRecordId`
- `buyerId`
- `distanceKm`
- `transportCost`
- `loadingCost`
- `balingCost`
- `otherCosts`
- `calculationVersion`
- `provenance`

### 7.7 MatchCandidate

- `id`
- `residueRecordId`
- `buyerId`
- `eligibilityStatus`
- `blockers`
- `estimatedGrossValue`
- `estimatedTotalKnownCost`
- `estimatedFarmerNet`
- `alternativeUseBaseline`
- `calculationVersion`
- `provenance`

### 7.8 Transaction

- `id`
- `residueRecordId`
- `buyerId`
- `offerPrice`
- `currency`
- `estimatedQuantityTonnes`
- `measuredQuantityTonnes`
- `acceptedQuantityTonnes`
- `paidQuantityTonnes`
- `status`
- `pickupScheduledAt`
- `collectedAt`
- `paymentConfirmedAt`
- `provenance`

### 7.9 TransactionEvent

- `id`
- `transactionId`
- `fromStatus`
- `toStatus`
- `actorId`
- `occurredAt`
- `note`
- `evidenceAssetIds`
- `provenance`

For production, transaction events should be append-only or otherwise auditable.

### 7.10 ImpactEstimate

- `id`
- `transactionId`
- `massCollectedTonnes`
- `massLikelyDivertedTonnes`
- `counterfactualMethod`
- `emissionFactorSource`
- `emissionFactorVersion`
- `estimatedAvoidedEmissions`
- `unit`
- `uncertaintyRange`
- `methodVersion`
- `provenance`
- `status`

## 8. Provenance and Verification

### Provenance values

- `simulated`: created for demonstration.
- `observed`: measured or collected from a real source but not necessarily verified.
- `derived`: calculated from other inputs.
- `verified`: reviewed under a documented verification procedure.

### Verification status

- `unverified`
- `pending`
- `verified`
- `rejected`
- `needs_review`

These concepts are separate. A value can be derived from observed data and still require review. A real observation is not automatically verified.

## 9. Business Rules

### 9.1 Risk assessment

- Risk bands: `lower`, `moderate`, `elevated`, `unknown`.
- Score range: 0–1 only where the scoring method defines that range.
- Store horizon, method version, provenance, and feature summary.
- A hotspot is a thermal observation, not a definitive cause label.
- Missing data produces `unknown` or a clearly qualified result.
- Risk prioritization must not automatically trigger penalties or accusations.

### 9.2 Residue quantity

- Store estimated and measured quantities independently.
- Display estimation method and assumptions.
- Do not treat a photo as a precise mass or moisture measurement.
- Quantity must be positive and include an explicit unit.
- Reject invalid dates, non-finite numbers, and impossible input ranges.

### 9.3 Buyer eligibility

Evaluate hard constraints before ranking:

1. The buyer accepts the residue type.
2. Condition and handling form meet requirements.
3. Quantity satisfies buyer limits or an explicitly supported aggregation rule.
4. Availability dates fit the buyer's requested window.
5. Price and quote validity are sufficiently clear.
6. Logistics information is adequate for a meaningful economic estimate.

Results:

- `eligible`: hard constraints pass.
- `ineligible`: one or more constraints fail.
- `needs_information`: critical information is missing.

A ranking score must never override a failed hard constraint. “No viable match” is a valid outcome.

### 9.4 Economics

Calculate using one shared domain function:

```text
grossValue =
  sellableQuantityTonnes * acceptedPricePerTonne

knownCosts =
  transportCost
  + loadingCost
  + balingCost
  + otherKnownCosts

indicativeNetProceeds =
  grossValue - knownCosts
```

Rules:

- Use sellable quantity, not automatically the initial estimated quantity.
- Explicitly convert all units.
- Do not subtract transportation twice when the quote already includes delivery.
- If costs are missing, label the result as partial and list missing inputs.
- Negative values must remain visible.
- Indicative net proceeds are not necessarily profit.
- Positive proceeds do not automatically mean the farmer is better off than their alternative.

To establish incremental farmer benefit, compare with an evidenced alternative-use baseline where possible.

### 9.5 Transaction state machine

Primary path:

`Draft → Offered → Farmer Accepted → Pickup Scheduled → Collected / Weighed → Payment Pending → Completed`

Alternative states:

- `Rejected`
- `Cancelled`
- `Disputed`
- `Needs Review`

Allowed transitions include:

- Draft → Offered.
- Offered → Farmer Accepted, Rejected, or Cancelled.
- Farmer Accepted → Pickup Scheduled, Cancelled, or Needs Review.
- Pickup Scheduled → Collected / Weighed, Cancelled, or Needs Review.
- Collected / Weighed → Payment Pending or Needs Review.
- Payment Pending → Completed, Disputed, or Needs Review.
- Disputed → Completed, Cancelled, or Needs Review.
- Needs Review → an explicitly authorized resolution.

Each transition should record timestamp, actor, and reason where relevant. The demo must clearly state that status changes do not represent real payment or collection.

### 9.6 Environmental impact

Distinguish:

- Mass registered.
- Mass verified.
- Mass collected.
- Mass accepted by a buyer.
- Mass likely diverted from burning.
- Estimated emissions avoided.

Collected mass is not automatically diverted mass. Diverted mass requires a defensible estimate of what would otherwise have happened.

Avoided emissions require:

- A documented counterfactual.
- Appropriate emission factors and sources.
- Clear system boundaries.
- Method version and uncertainty.
- Review appropriate to the intended claim.

If inputs are insufficient, return `null` or “Not estimated,” not a fabricated value or an unexplained zero.

## 10. API Design

These are proposed production endpoints, not a requirement to build every endpoint in the initial prototype.

### Risk

- `GET /api/risk/zones`
- `GET /api/risk/zones/:zoneId`
- `GET /api/risk/assessments/:assessmentId`

### Residue

- `GET /api/residue`
- `POST /api/residue`
- `GET /api/residue/:residueId`
- `PATCH /api/residue/:residueId`
- `POST /api/residue/:residueId/verify`

### Buyers and matching

- `GET /api/buyers`
- `GET /api/buyers/:buyerId`
- `POST /api/matches/evaluate`
- `GET /api/residue/:residueId/matches`

### Transactions

- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/transactions/:transactionId`
- `POST /api/transactions/:transactionId/events`
- `POST /api/transactions/:transactionId/measurements`

### Impact

- `GET /api/impact/summary`
- `GET /api/impact/estimates/:estimateId`
- `POST /api/impact/estimates`

Production endpoints require schema validation, authorization, and consistent error responses.

Example error response:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input did not pass validation.",
    "details": []
  }
}
```

Never return stack traces or unnecessary personal data to clients.

## 11. Validation and Security

Before production use:

- Validate all numerical ranges and units.
- Restrict string lengths and sanitize rendered user content.
- Validate image type and size; scan uploads where supported.
- Validate geographic coordinates.
- Keep API secrets on the server.
- Implement authentication and role-based authorization.
- Restrict records by ownership and authorized region.
- Obtain appropriate consent for personal information, photographs, and precise location.
- Store sensitive assets privately.
- Define data retention and deletion procedures.
- Log sensitive changes without unnecessarily logging personal data.
- Apply appropriate rate limits, secure headers, and CSRF protection for the chosen authentication pattern.
- Do not expose farmer identity or exact field coordinates publicly without explicit authorization.

## 12. Testing Strategy

### Unit tests

- Unit conversions.
- Gross value and cost calculations.
- Partial and negative net estimates.
- Buyer eligibility constraints.
- No-match behavior.
- Valid and invalid transaction transitions.
- Provenance propagation.
- Impact calculation with missing counterfactuals.

### Integration tests

- Register residue.
- Evaluate buyer candidates.
- Create an offer.
- Accept an offer.
- Schedule pickup.
- Record measured weight.
- Update payment status.
- Complete the demo transaction.
- Confirm metrics reflect the correct status and quantity.

### UI tests

- All six modules load.
- Invalid forms display clear errors.
- Calculator values update consistently.
- Search and filters behave correctly.
- Empty, error, and no-match states are visible.
- Demo labels persist across navigation.

### Future model evaluation

- Use temporal splits that prevent future information leaking into past predictions.
- Test geographic generalization where data allows.
- Report precision, recall, PR-AUC, calibration, and false-positive burden.
- Compare a simple baseline with more complex models.
- Do not use rule-generated labels as independent ground truth.
- Define the target event and prediction horizon before training.

## 13. Non-Functional Requirements

- **Reliability:** identical inputs and method versions produce identical calculations.
- **Usability:** the core demo can be completed without editing files manually.
- **Accessibility:** keyboard navigation, visible focus, semantic labels, and readable contrast.
- **Responsiveness:** desktop, tablet, and mobile layouts.
- **Maintainability:** domain logic is separate from UI and not duplicated across pages.
- **Auditability:** data sources, assumptions, and transaction changes are traceable.
- **Privacy:** personal information is not collected before access and retention rules are established.
- **Localization:** currency, dates, language, and units use shared formatting utilities.
- **Performance:** targets are set after the real data volume and deployment environment are known.

## 14. Demo Data Contract

Every demo dataset must declare its status and scope:

```json
{
  "metadata": {
    "mode": "simulated",
    "region": "Illustrative pilot region",
    "asOf": "2026-10-15",
    "warning": "All records are illustrative and not field-verified."
  }
}
```

Example risk record:

```json
{
  "id": "ZONE-001",
  "name": "Illustrative North Zone",
  "riskScore": 0.83,
  "riskBand": "elevated",
  "provenance": "simulated",
  "methodVersion": "demo-rules-v0"
}
```

The score above is a UI fixture, not a measured probability of burning.

Use one shared data source for all dashboard metrics, tables, and charts. Avoid embedding independent conflicting demo totals inside separate components.

## 15. Implementation Phases

### Phase A — Interactive prototype

- Implement the six main modules.
- Centralize demo fixtures.
- Extract business calculations into domain functions.
- Add validation and consistent simulated-data labels.
- Implement transaction state transitions.
- Test the end-to-end demo flow.

### Phase B — Operational foundation

- Add database migrations.
- Add authentication and role-based access.
- Add audit events and private file storage.
- Add verification and buyer quote workflows.

### Phase C — Data integration

- Integrate suitable satellite, agricultural, and weather datasets.
- Preserve data source, observation time, resolution, and freshness.
- Establish independent event labels and local verification procedures.
- Create repeatable ingestion and quality checks.

### Phase D — Pilot validation

- Evaluate predictions by time and geography.
- Test buyer demand and logistics using real quotes.
- Measure actual farmer proceeds and transaction completion.
- Define a defensible counterfactual for environmental impact.
- Review security, privacy, and effects on participating farmers.

## 16. Open Technical Decisions

- Map rendering library and basemap provider.
- ORM selection.
- Authentication provider and role model.
- Private object storage.
- Source and format of agricultural boundaries.
- Satellite data ingestion schedule.
- Independent labels for crop-residue burning.
- Versioning for risk models and economic calculations.
- Need for background workers after data volume and frequency are known.
