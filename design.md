# StrawHub — Design System

**Platform:** React Native (Expo) · farmer-first mobile app

## 1. Design Direction

StrawHub is a phone-first tool a farmer uses in the field, right after harvest. The interface must work:

- outdoors in daylight,
- one-handed on a low-end Android phone,
- in minutes, not sessions.

The visual language pairs an agricultural green primary with high-contrast neutrals and warm warning tones for simulated-data notices. It should feel calm, honest, and useful — like a weighing slip and a price board, not a trading terminal.

**Core rule:** visual polish must never obscure provenance, uncertainty, or transaction economics. Every financial number shows its costs; every simulated record says so.

## 2. Design Principles

1. The farmer's time is the scarcest resource; every screen earns its taps.
2. Data truth before polish.
3. Economics must be transparent — no forced matches, no hidden costs.
4. Progressive disclosure: summary first, detail on tap.
5. Status is never communicated by color alone — always paired with a text label.
6. Simulated information is visibly labeled on every screen.
7. Touch targets are thumb-sized; primary actions sit at the bottom.

## 3. Color Tokens

Defined once in `src/constants/theme.ts` (`Colors.light` / `Colors.dark`) and consumed through `useAppTheme()`. Never hardcode hex values in components.

| Token            | Light     | Dark      | Purpose                              |
| ---------------- | --------- | --------- | ------------------------------------ |
| `background`     | `#F4F6F3` | `#0D1311` | Screen background                   |
| `surface`        | `#FFFFFF` | `#151F1B` | Cards, tab bar                       |
| `surfaceMuted`   | `#EDF1EC` | `#1C2823` | Inputs, chips, disabled fills         |
| `text`           | `#17211C` | `#E9EEEA` | Primary text                        |
| `textSecondary`  | `#57645D` | `#9AA79F` | Secondary text, captions            |
| `border`         | 10% text  | 10% text  | Hairline card borders                |
| `accent`         | `#1E7A4F` | `#4CC38A` | Primary action, positive progress    |
| `accentMuted`    | `#E3F1E9` | `#173226` | Accent badge fill                    |
| `warning`        | `#8A5A00` | `#F0C36B` | Simulated-data notices, caution      |
| `warningMuted`   | `#FCF1D8` | `#332A14` | Demo banner fill                     |
| `danger`         | `#B3362B` | `#F0938A` | Failed constraints, negative values  |
| `dangerMuted`    | `#FBE3E0` | `#361C19` | Danger badge fill                    |
| `info`           | `#205A8F` | `#7EB3E8` | In-progress statuses                 |
| `infoMuted`      | `#E2EDF6` | `#142431` | Info badge fill                      |

Dark mode follows the system setting. Warning amber is reserved for simulated-data notices and cautionary states — never decoration.

## 4. Typography

System font stack (no bundled webfonts in the MVP — startup speed on low-end devices wins over brand typography).

| Role      | Size | Weight      |
| --------- | ---- | ----------- |
| Page title | 24   | 700         |
| KPI value  | 19   | 700         |
| Heading / card title | 17 | 700 |
| Body       | 14   | 400–600     |
| Caption    | 12   | 400         |
| Micro (badges, eyebrows) | 10 | 600–700, uppercase, letter-spaced |

Minimum body size is 14 — farmers often read in bright light. Micro type is never used for financial values, assumptions, or warnings.

## 5. Spacing, Radius, Layout

Spacing scale (`Spacing`): `xs 4 · sm 8 · md 12 · lg 16 · xl 24 · xxl 32`.

Radius (`Radius`): chips/badges `sm 6`, cards `lg 14`, pills `999`.

Layout rules:

- Screen padding: `lg 16`.
- Cards gap: `md 12`.
- KPI cards sit in a single row of at most three; two when values are long.
- Max content width on tablets/web: 720 (`MaxContentWidth`).
- Lists live in a `ScrollView`; forms with bottom actions use a fixed footer above a scrolling body.

## 6. Navigation

Bottom tab bar, four destinations, plain-word labels:

1. **Home** — overview, quick actions, active deals.
2. **Registry** — registered residue records.
3. **Matches** — buyer candidates for the selected record.
4. **Deals** (Transactions) — active and finished transactions.

Stack screens above the tabs: **Register Residue** (3-step wizard), **Transaction detail**, **Impact & Evidence**.

Rules:

- Every primary destination is reachable in one tap; every stack screen in two.
- Back is always labeled (“Back”), never icon-only.
- A persistent `SIMULATED DATA` banner appears at the top of every tab screen.

## 7. Core Components

All live in `src/components/ui.tsx` and consume theme tokens only.

### 7.1 Screen

Safe-area wrapper with title, optional subtitle, the demo banner, and a scrolling body. `scroll={false}` for screens managing their own scroll (e.g. forms with fixed footers).

### 7.2 DemoBanner

Persistent amber strip: “SIMULATED DATA — all records, prices and transactions are illustrative and not field-verified.” Present on every tab screen. Never dismissible in the prototype.

### 7.3 Badge / ProvenanceBadge / VerificationBadge / StatusBadge

Pill badges with a muted fill and a 10 pt uppercase bold label.

- Provenance: `SIMULATED` (warning), `OBSERVED` (info), `DERIVED` (neutral), `VERIFIED` (accent).
- Verification: `Not yet verified`, `Verification pending`, `Verified`, `Verification rejected`, `Needs review`.
- Transaction status uses `StatusBadge` with the labels from `src/domain/transactions.ts`.

Provenance and verification are separate concepts; a badge from one family never substitutes for the other.

### 7.4 Card / KpiCard

Cards: `surface` fill, hairline border, radius 14, padding 16, gap 4. Pressable variants dim to 80% opacity — no elevation change.

KpiCard: micro uppercase label, 19 pt value, optional caption and badge. Values include units; no growth percentages without a defined baseline.

### 7.5 LabelValueRow

Two-column label/value row; value is semibold, right-aligned, optionally tinted (danger for deductions, accent for measured quantities). Used for all economics breakdowns and record details.

### 7.6 PrimaryButton / GhostButton

Primary: accent fill, white semibold label, radius 10, vertical padding 12, full-width in cards and footers. Disabled: muted fill, secondary text.

Ghost: transparent, semibold label in `textSecondary` (accent/danger variants for flow actions).

### 7.7 ChoiceChip

Selection pill used for controlled vocabularies (residue type, units, condition, handling form). Active chip: accent fill, white text. Every chip is a labeled button with an accessibility state.

### 7.8 EmptyState

Centered card with a title, one-sentence body, and an optional full-width action. Used for empty lists, no matches, and not-found records.

## 8. Screen Patterns

### 8.1 Economics breakdown

Always the same order, in `LabelValueRow`s:

1. Indicative price (with basis label).
2. Gross value.
3. Deductions with explicit minus signs.
4. Indicative net proceeds (accent when positive, danger when negative).
5. Assumption caption: missing costs, validity, “not a guaranteed price or profit.”

One shared domain function (`src/domain/economics.ts`) computes these; screens only format.

### 8.2 Match card

Buyer name, type/location/distance line, fit badge (`RULE-BASED FIT` / `NOT ELIGIBLE`), blocker list with `✕` markers, economics for eligible candidates, then the primary action. When no candidate is eligible, a `NO VIABLE MATCH` card explains that no-match is a valid outcome.

### 8.3 Registration wizard

Three steps, one screen each: crop & field → quantity & timing → review. Auto-estimate for quantity is offered with its assumption shown; the farmer can override. Errors render in a danger box under the relevant step, never as toasts. Fixed footer: Back/Cancel on the left, Continue/Submit on the right.

### 8.4 Transaction detail

Status badge plus “Demo transaction — no real payment” note, quantity rows (estimate and measurement separate), weighbridge input when appropriate, a reverse-chronological event timeline, and a “move to next status” list offering only state-machine-legal transitions.

## 9. Required UI States

Every list or module must handle:

- Loading (fixtures load synchronously in the prototype — states arrive with real APIs).
- Empty.
- Error (network/API phase).
- No results / no viable match.
- Not yet verified.
- Success.
- Permission denied (post-auth phases).

## 10. Copywriting and Terminology

Prefer:

- “Estimated available residue” — never “available” for unverified supply.
- “Indicative price” / “Indicative net proceeds” — never “guaranteed” or “profit”.
- “Not yet verified” — never vague confirmation.
- “Demo transaction” — never imply a real commercial agreement.
- “Not estimated” for environmental impact — never zero or a fabricated value.

Units and currency format through `src/lib/format.ts` (IDR via `Intl.NumberFormat('id-ID')`, tonnes, ISO dates). Never hardcode formatted values in components.

## 11. Accessibility and Interaction

- Minimum touch target: 44×44 effective.
- Status colors always pair with text labels.
- Inputs have persistent `accessibilityLabel`s; chips expose `accessibilityState.selected`.
- Icon-free navigation: tabs and actions use plain words.
- Contrast: body text ≥ 4.5:1 against its surface in both modes.
- Forms validate on submit; errors appear in place, beside the step they belong to.
- Respect the OS reduced-motion setting (prototype motion is limited to press-state opacity).

## 12. Motion

- Press feedback: opacity 0.8, no duration tuning needed.
- No decorative animation, screen transitions, or parallax in the prototype.
- Motion never carries essential information.

## 13. Implementation Rules

- Design tokens live only in `src/constants/theme.ts`; screens read them via `useAppTheme()`.
- Domain logic never imports React Native; UI components never re-implement business rules.
- One shared economics calculation everywhere.
- Controlled vocabularies (residue types, conditions, forms, statuses) are typed in `src/domain/types.ts`.
- Formatting goes through `src/lib/format.ts`.
- Demo fixtures come from one source (`src/data/fixtures.ts`) so screens cannot disagree.

## 14. Design QA Checklist

- [ ] Simulated data is identified on every screen.
- [ ] Every financial value includes currency and unit.
- [ ] Deductions show explicit minus signs; negative nets stay visible.
- [ ] Blockers and no-match states explain themselves.
- [ ] Estimated and measured quantities are never merged into one number.
- [ ] Status is never color-only.
- [ ] Primary actions are bottom-anchored and thumb-reachable.
- [ ] Body text ≥ 14 pt; financial values never in micro type.
- [ ] Empty and not-found states exist for every list.
- [ ] Every primary action produces visible feedback.
