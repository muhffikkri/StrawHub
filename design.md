# AgniDrishti — Design System

## 1. Design Direction

AgniDrishti is a geospatial intelligence and agricultural residue marketplace workspace.

The visual language combines:

- Dark operational dashboard aesthetics.
- Restrained glassmorphism.
- Agricultural green accents.
- Amber risk indicators.
- High-contrast data visualization.
- Compact but readable operational tables.

The interface should feel credible, modern, and useful to a program operator. It must not look like a speculative trading terminal or a generic marketing landing page.

**Core rule:** visual polish must never obscure data provenance, uncertainty, or transaction economics.

## 2. Design Principles

1. Data truth before visual polish.
2. Risk is not guilt.
3. Economics must be transparent.
4. No forced buyer match.
5. Progressive disclosure: summary first, detail on demand.
6. Accessible interactions and readable contrast.
7. Simulated information is visibly labeled.

## 3. Color Tokens

| Token                 | Value                    | Purpose                              |
| --------------------- | ------------------------ | ------------------------------------ |
| `bg.canvas`           | `#080E18`                | Main application background          |
| `bg.sidebar`          | `#090F19`                | Navigation background                |
| `bg.panel`            | `#111B2B`                | Default panel                        |
| `bg.panel.strong`     | `#101A2B`                | High-opacity panel                   |
| `bg.input`            | `#0B1422`                | Inputs and search fields             |
| `border.subtle`       | `rgba(153,174,203,0.13)` | Glass border                         |
| `text.primary`        | `#E8EEF7`                | Main text                            |
| `text.secondary`      | `#A0AEC0`                | Secondary text                       |
| `text.muted`          | `#8493A8`                | Metadata                             |
| `accent.green`        | `#39C79A`                | Primary action and positive progress |
| `accent.green.bright` | `#5DDBAC`                | Highlights                           |
| `risk.elevated`       | `#F6A623`                | Elevated risk                        |
| `risk.moderate`       | `#70A8FF`                | Moderate risk                        |
| `risk.lower`          | `#39C79A`                | Lower risk                           |
| `status.warning`      | `#F3C16C`                | Warning                              |
| `status.danger`       | `#F07878`                | Errors and failed actions            |

Status colors must always be paired with text or an icon. Green must not imply that a record has been verified.

## 4. Typography

- **Headings:** Manrope, with a sans-serif fallback.
- **Body and UI:** DM Sans, with a sans-serif fallback.
- **Page title:** 26–28 px desktop; 23–25 px mobile.
- **Panel title:** 14–16 px.
- **Body:** 12–14 px.
- **Metadata:** 11–12 px where practical.
- **Section eyebrow:** 9–10 px uppercase with restrained letter spacing.
- Use tabular numerals for aligned KPI values when supported.

Avoid using tiny text for essential assumptions, financial values, or data warnings.

## 5. Spacing, Radius, and Elevation

Use a 4 px spacing scale:

- `space-1`: 4 px
- `space-2`: 8 px
- `space-3`: 12 px
- `space-4`: 16 px
- `space-5`: 20 px
- `space-6`: 24 px
- `space-8`: 32 px
- `space-10`: 40 px

Radius:

- Small controls: 6–8 px.
- Cards: 10–12 px.
- Dialogs: 12–16 px.
- Badges: 5–6 px.

Glass surfaces should use a dark translucent background, subtle border, and moderate backdrop blur. Text and controls must remain readable when blur is unavailable.

Use restrained shadows. Avoid excessive glow, neon outlines, and decorative transparency behind dense tables.

## 6. Application Layout

### Desktop

- Fixed sidebar approximately 230–250 px wide.
- Topbar approximately 60–66 px high.
- Main content padding approximately 24–32 px.
- Overview dashboard uses four KPI cards, a primary risk map, contextual risk panel, charts, and recent transactions.
- Primary actions appear consistently near the page title.

### Tablet

- Sidebar becomes a drawer.
- Use two-column layouts only when the available width supports readable content.
- Tables may scroll horizontally.

### Mobile

- Drawer navigation.
- KPI cards in a two-column grid.
- Single-column content.
- Full-width form actions.
- Tables use horizontal scrolling or dedicated compact list rows.
- Map controls and legends must not obscure essential content.

## 7. Navigation

Main navigation order:

1. Overview
2. Risk Intelligence
3. Residue Registry
4. Buyer Matching
5. Transactions
6. Impact & Evidence

Each item has an icon, readable label, and active state.

The topbar includes:

- Current page or breadcrumb.
- A persistent “SIMULATED DATA” indicator in demo mode.
- Optional notification area.
- User or demo profile control.

Navigation labels must be consistent across pages and documentation.

## 8. Core Components

### 8.1 KPI Card

Contains:

- Metric label.
- Primary value and unit.
- Optional contextual description.
- Data provenance badge where applicable.

Do not display growth percentages unless the comparison period and baseline are defined.

### 8.2 Provenance Badge

Use four standardized labels:

- `SIMULATED`: created for the demo.
- `OBSERVED`: collected from a real source but not necessarily verified.
- `DERIVED`: calculated from other data.
- `VERIFIED`: reviewed according to a documented verification process.

Provenance is separate from transaction status and verification status.

### 8.3 Risk Badge

- Elevated: amber.
- Moderate: blue.
- Lower: green.
- Unknown: neutral.

Show a text label alongside color. Provide a detail view explaining the score, time horizon, contributing signals, and limitations.

Avoid labels such as “confirmed burning” unless independently verified evidence supports that conclusion.

### 8.4 Risk Map

- Dark basemap or clearly labeled illustrative map.
- Distinct markers for different risk bands.
- Visible legend.
- Marker clustering when necessary.
- Clickable markers that open a zone detail panel.
- Loading, unavailable, and empty states.
- Explicit “Illustrative map — not for navigation” notice for simulated geometry.

Do not use arbitrary decorative markers in a way that suggests precise real-world locations.

### 8.5 Residue Form

Group fields into:

1. Farmer and location.
2. Crop and residue characteristics.
3. Estimated quantity and availability.
4. Optional photo and notes.
5. Estimate summary and confirmation.

Every field has a persistent label. Units are explicit. Errors appear beside the relevant field.

The estimate summary must disclose the formula and assumptions. Photo upload must not imply that mass or moisture has been measured accurately.

### 8.6 Buyer Card

Show:

- Buyer name and use category.
- Material requirements.
- Indicative price and currency.
- Price basis: farm-gate, delivered, or unknown.
- Quantity constraints.
- Distance or logistics estimate.
- Quote validity and verification status.
- Eligibility result and reasons.

Use “Rule-based fit” for a demo match rather than an unexplained percentage score.

### 8.7 Economics Calculator

Display the calculation in this order:

1. Sellable quantity.
2. Indicative gross value.
3. Transportation cost.
4. Loading, baling, and other known costs.
5. Indicative net value.
6. Missing costs and assumptions.

Use explicit negative signs for deductions. Negative net values remain visible.

Avoid the word “profit” unless all relevant costs are known. Prefer “indicative net proceeds” when the estimate is incomplete.

### 8.8 Transaction Status

Supported labels:

- Draft
- Offered
- Farmer Accepted
- Pickup Scheduled
- Collected / Weighed
- Payment Pending
- Completed
- Rejected
- Cancelled
- Disputed
- Needs Review

Each status uses a text label and a visual marker. The transaction detail view includes an event timeline with timestamps and actors when available.

### 8.9 Charts

- Clear axis labels and units.
- Restrained grid lines.
- Tooltips with values and periods.
- Limited number of series.
- Persistent simulated-data label for demo charts.

Charts must not hide important definitions or methodological caveats.

### 8.10 Dialogs, Drawers, and Toasts

- Use dialogs for short, focused actions.
- Use dedicated pages for longer forms.
- Use drawers for contextual zone, buyer, or transaction details.
- Use toast messages for brief confirmations.
- Keep critical errors visible in the relevant form or page.

## 9. Required UI States

Every major module must support:

- Loading.
- Empty.
- Error.
- No results.
- No viable match.
- Needs verification.
- Success.
- Permission denied, when authorization is implemented.

A no-match state should explain why candidates failed and what information or condition could change the result.

## 10. Copywriting and Terminology

Prefer:

- “Estimated available residue” instead of “Available” for unverified supply.
- “Indicative price” instead of “Guaranteed price.”
- “Elevated risk” instead of “Confirmed burning.”
- “Demo transaction” instead of implying a real commercial agreement.
- “Not yet verified” instead of vague confirmation language.
- “Potentially diverted from burning” only when the evidence supports the claim.

Use tonnes, acres, and INR (₹) consistently for the initial India-focused demo. Currency, dates, and units should be formatted through shared utilities rather than hardcoded throughout components.

## 11. Accessibility and Interaction

- All actions must have meaningful labels.
- Keyboard focus must be visible.
- Status must not be communicated by color alone.
- Inputs must have persistent labels and clear errors.
- Icon-only controls require accessible names.
- Dialog focus must be managed.
- Respect reduced-motion preferences.
- Avoid hover-only interactions.
- Ensure sufficient contrast on translucent panels.

## 12. Motion

- Hover and focus feedback: approximately 120–180 ms.
- Drawer and panel transitions: approximately 180–240 ms.
- Avoid decorative animation that distracts from maps or operational decisions.
- Motion must not carry essential information.

## 13. Implementation Rules

- Centralize design tokens.
- Use reusable UI components.
- Keep business calculations out of presentation components.
- Keep risk, residue, matching, transaction, and impact components in domain-specific folders.
- Use a consistent icon library.
- Keep provenance metadata available throughout the UI.
- Do not duplicate business logic between dashboard cards and detail pages.

## 14. Design QA Checklist

- [ ] Simulated data is clearly identified.
- [ ] All financial values include currency and unit.
- [ ] Risk bands have text labels.
- [ ] The map includes a legend and appropriate disclaimer.
- [ ] Net proceeds show known deductions.
- [ ] No unsupported emissions claims appear.
- [ ] Empty, error, loading, and no-match states exist.
- [ ] Mobile tables and forms remain usable.
- [ ] Keyboard focus is visible.
- [ ] Secondary text remains readable.
- [ ] Every primary action produces feedback.
- [ ] No critical interaction depends on hover alone.
