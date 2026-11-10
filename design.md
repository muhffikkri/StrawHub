# StrawHub — Design System

**Basis:** AgroTech Precision / AquaCrop UI Component & Design System (v1.0.4 spec), adapted for the StrawHub farmer-first mobile app.
**Platform:** React Native (Expo) · single light organic scheme
**Source of truth for tokens:** `src/constants/theme.ts`

## 1. Design Direction

StrawHub uses an **organic, editorial, earth-tone design language** engineered for agricultural operators. The interface must work outdoors in daylight, one-handed, on low-end phones.

The visual language:

- Deep olive and warm unbleached paper cream — no blinding stark whites.
- High-contrast serif headings paired with modern, legible sensor numbers.
- Tactile pill touchpoints (44px+ targets) for accurate outdoor use.
- Calm, honest earth-tone data representations.

**Core rule:** visual polish must never obscure provenance, uncertainty, or transaction economics. Every financial number shows its costs; every simulated record says so.

## 2. Design Principles

1. **Organic Calm** — deep olive and warm unbleached paper cream replace blinding stark whites.
2. **Field Ergonomics** — 44px+ minimum pill targets for tactile, accurate usage under outdoor daylight.
3. **Editorial Elegance** — high-contrast serif headings pair with modern, legible sensor numbers.
4. **Honest Telemetry** — micro-histograms, arc gauges, and timeline pins simplify complex data.
5. **Data truth before polish** — simulated information is visibly labeled on every screen.
6. **Status is never communicated by color alone** — always paired with a text label.

## 3. Color Palette & Design Tokens

Single **light organic scheme** (no dark mode in v1). Defined in `src/constants/theme.ts` as `Colors`; consumed via `useAppTheme()`. Never hardcode hex values in components.

| Token         | Value     | Purpose                                          |
| ------------- | --------- | ------------------------------------------------ |
| `forest`      | `#2F3E1E` | Primary. Dark hero pill CTA, headers, active chips |
| `forestDark`  | `#233016` | Pressed/hover state of forest                    |
| `moss`        | `#5A7341` | Secondary. Banner alerts, positive badges, highlights |
| `mossHover`   | `#4E6538` | Pressed state of moss                            |
| `leaf`        | `#7F9C57` | Accent. Gauges, toggle switch fill, field boundaries |
| `cream`       | `#F6F4ED` | Main application screen background (canvas)     |
| `creamLight`  | `#FAF8F2` | Elevated light surface                           |
| `creamDark`   | `#EFECE2` | Inset fills, secondary chips                      |
| `soil`        | `#1F2417` | Text primary. Headlines, primary metrics, strong labels |
| `muted`       | `#697060` | Text secondary, captions                         |
| `hint`        | `#9BA193` | Placeholders, timestamps                          |
| `coral`       | `#D97757` | Warning. Evaporation-style warnings, alerts, blockers |
| `coralSoft`   | `#FBF0EC` | Warning fills, demo/simulated-data notices        |
| `sand`        | `#E6E3D8` | Borders, dividers, inactive tracks               |

Semantic mapping for StrawHub states:

| App semantic        | Token            |
| ------------------- | ---------------- |
| Primary action      | `forest`         |
| Positive / verified | `moss`           |
| Accent / progress   | `leaf`           |
| Warning / simulated | `coral` + `coralSoft` |
| Danger / blocker / negative value | `coral` |
| Background          | `cream`          |
| Card surface        | white            |
| Inset / input fill  | `cream`          |
| Border / divider    | `sand`           |

Coral is the only alert tone — used for warnings, simulated-data notices, failed constraints, and negative net values. It must always carry a text label.

## 4. Typography

**Pairing:** Newsreader (editorial serif) × Plus Jakarta Sans (clean modern sans). Loaded via `@expo-google-fonts/newsreader` and `@expo-google-fonts/plus-jakarta-sans`, exposed as `Fonts.serif.*` / `Fonts.sans.*` in `src/constants/theme.ts`.

### Serif scale (Newsreader)

| Role                     | Size | Weight / style     |
| ------------------------ | ---- | ----------------- |
| Display hero             | 40   | 500 / 1.15 line-height |
| Screen headline          | 28   | 500               |
| Card title               | 22   | 500–600           |
| Large metric hero        | 34   | 600, tabular-nums |
| Telemetry / KPI value    | 26   | 600               |
| Editorial italic subtitle | 18  | 400 italic        |

### Sans scale (Plus Jakarta Sans)

| Role             | Size | Weight      |
| ---------------- | ---- | ----------- |
| Body UI          | 14   | 400 / 20 line-height |
| Strong body      | 14   | 600         |
| Caption          | 12   | 400–500     |
| Micro eyebrow    | 11   | 600, uppercase, letter-spaced |

Rules:

- Numbers and metric values render in **serif** with tabular alignment.
- Micro type is never used for financial values, assumptions, or warnings.
- Minimum body size is 14 — farmers read in bright light.

## 5. Spacing, Radius, Elevation

Spacing scale (`Spacing`): `xs 4 · sm 8 · md 12 · lg 16 · xl 20 · xxl 24 · xxxl 32`.

Radius (`Radius`): `md 16` (inner tiles, inputs) · `lg 24` (cards) · `pill 9999` (buttons, badges, chips, segmented controls).

Shadows (`Shadows`), tinted forest `rgba(47, 62, 30, x)`:

| Token   | Value                                            | Use                    |
| ------- | ------------------------------------------------ | ---------------------- |
| `soft`  | `0 4px 20px -2px rgba(47,62,30,0.05)`            | Subtle raised chips    |
| `card`  | `0 8px 30px -4px rgba(47,62,30,0.07)`            | Telemetry cards        |
| `float` | `0 14px 40px -6px rgba(47,62,30,0.12)`           | Floating dock, hero    |

Android uses `elevation` equivalents. Press feedback is opacity 0.85, never a shadow change.

## 6. Navigation — Docked Pill Bar

Bottom navigation is a **floating pill dock**: white/90 translucent fill, sand hairline border, radius `pill`, horizontal margin 16, bottom margin 12, shadow `soft`.

- Active item: `forest`, bold, with a small forest dot above the label.
- Inactive item: `muted`.
- Plain-word labels: Home · Registry · Matches · Deals. Never icon-only.

Stack screens above the tabs use a header title in serif, white circular back button (44px, cream fill, sand border).

A persistent `SIMULATED DATA` notice appears near the top of every tab screen (see DemoBanner).

## 7. Core Components

All primitives live in `src/components/ui.tsx` and consume tokens only.

### 7.1 Screen

Cream canvas, serif screen headline (28), sans subtitle in muted, the demo notice, scrolling body with `lg 16` padding. Background may carry a subtle dot texture on web; native stays flat cream.

### 7.2 DemoBanner

Coral-soft fill (`coralSoft`), `coral` text, radius `md`:

> `SIMULATED DATA — all records, prices and transactions are illustrative and not field-verified.`

Present on every tab screen. Never dismissible in the prototype.

### 7.3 Badge — pill system

Pill badges (radius `pill`, `xs`–`sm` padding, 11px semibold):

| Variant              | Fill            | Text     | Use                          |
| -------------------- | --------------- | -------- | ---------------------------- |
| Solid forest         | `forest`        | white    | Active plan / primary status  |
| Solid moss + dot     | `moss`          | white    | On-track, positive           |
| Cream inset bordered | `creamDark`     | `soil`   | Neutral facts (area, zone)    |
| Coral soft           | `coralSoft`     | `coral`  | Warnings, simulated, alert   |
| White bordered       | white           | `soil`   | Outlined facts               |
| Leaf tint            | `leaf` @ 20%    | `forest` | Varietal / categorical chips |

StrawHub semantic badges map onto these variants:

- **ProvenanceBadge**: `SIMULATED` → coral soft · `OBSERVED` → cream inset · `DERIVED` → cream inset · `VERIFIED` → solid moss.
- **VerificationBadge**: `Verified` → solid moss · `pending` → cream inset · `rejected`/`needs_review` → coral soft.
- **StatusBadge**: transaction states → info variants per `src/domain/transactions.ts`; terminal failure states → coral.

Provenance and verification are separate concepts; a badge from one family never substitutes for the other.

### 7.4 Card — telemetry archetype

White fill, sand hairline border, radius `lg 24`, shadow `card`, padding `lg 16`–`xl 20`, inner gap `sm 8`.

Optional three-column key-number grid: micro uppercase mono-style label (11, muted) over serif value (22–26) with small sans unit — used for KPI rows and record summaries.

### 7.5 Banner card — moss solid

Moss fill, white text, radius `lg`, shadow `card`, serif title (18) with icon, sans body (12–14, white/90), footer row divided by white/15. Used for positive prompts and "ahead of season" insights. Never used for simulated-data warnings.

### 7.6 KpiCard

White card with micro uppercase label (sans 11, muted), serif value (26, `soil`, tabular-nums), optional caption and badge. Values include units; no growth percentages without a defined baseline.

### 7.7 PrimaryButton — dark hero pill

Radius `pill`, `forest` fill (pressed: `forestDark`), white text (sans 14 medium), vertical padding 14, full-width inside cards and footers. Optional trailing arrow icon that nudges on press. Disabled: `creamDark` fill, `hint` text.

### 7.8 SecondaryButton — cream outlined pill

Radius `pill`, `cream` fill (pressed: sand 60%), sand border, `soil` text, shadow `xs`. Used for alternative flows ("Continue with email"-class actions).

### 7.9 GhostButton

Text-only action (sans 14, 600): `muted` default, `forest` accent variant, `coral` danger variant. Used for inline list actions ("Ignore"-class) and wizard Back.

### 7.10 Circular action buttons

44×44 round buttons: cream fill + sand border + `soil` icon (back, more, search) or `forest` fill + white icon (add, primary). Always carry an accessibility label.

### 7.11 ChoiceChip / segmented filter pill

Selection pills for controlled vocabularies (residue type, units, condition). Container: `cream` fill, sand border, radius `pill`, inner padding `xs`. Active segment: `forest` fill, white text. Inactive: `muted` text. Chips expose `accessibilityState.selected`.

### 7.12 Inputs — pill fields

`cream` fill, `sand` border, radius `pill`, vertical padding 10, sans 14 `soil` text, `hint` placeholder. Focus state: `moss` border. Persistent accessibility labels; errors render in a coral box under the relevant step.

### 7.13 Toggle

iOS-style switch, 44×24 track: off `sand`, on `moss`, white knob. (Future settings screens.)

### 7.14 EmptyState

White card, serif title (22), sans body (14, muted), optional full-width PrimaryButton.

## 8. Screen Patterns

### 8.1 Home

Serif greeting headline, compact status cards with serif metrics, one moss prompt banner, quick PrimaryButton action, active-deal cards. KPI row uses the three-column key-number grid.

### 8.2 Economics breakdown

Always the same order, in label/value rows — label sans 14 muted, value serif/sans semibold `soil` right-aligned:

1. Indicative price (with basis label).
2. Gross value.
3. Deductions with explicit minus signs (coral).
4. Indicative net proceeds (moss when positive, coral when negative).
5. Assumption caption: missing costs, validity, "not a guaranteed price or profit."

One shared domain function computes these; screens only format.

### 8.3 Match card

Buyer name (serif 22), type/location/distance line (sans 12 muted), fit badge (`RULE-BASED FIT` leaf tint / `NOT ELIGIBLE` coral soft), blocker list with `✕` markers (coral), economics for eligible candidates, then the primary action. When no candidate is eligible, a `NO VIABLE MATCH` card explains that no-match is a valid outcome.

### 8.4 Registration wizard

Three steps, one screen each: crop & field → quantity & timing → review. Auto-estimate for quantity is offered with its assumption shown; the farmer can override. Fixed footer: Back (ghost) left, Continue/Submit (primary pill) right.

### 8.5 Transaction detail

Status badge plus "Demo transaction — no real payment" note, key-number grid for estimate/measurement (kept separate), pill input for weighbridge reading, reverse-chronological event timeline, and a "move to next status" list offering only state-machine-legal transitions.

### 8.6 Data displays (reference for future charts)

When charts arrive (later phases), follow the sticker sheet vocabulary:

- **Arc gauge** — sand track, moss active arc, rounded caps, serif value centered.
- **Micro histogram** — 6px pill bars, sand default, moss normal, forest peak, coral spike/risk.
- **Tally ticker** — 1px-wide pill ticks in a row; forest done, moss recent, sand/70 pending.
- **Weather row** — cream inset tiles (radius 16) with icon + serif temperature.

Charts must not hide definitions or caveats; simulated-data labels persist.

## 9. Required UI States

Every list or module handles: empty, error, no results / no viable match, not yet verified, success. Loading and permission-denied states arrive with real APIs and auth (later phases).

## 10. Copywriting and Terminology

Prefer:

- "Estimated available residue" — never "available" for unverified supply.
- "Indicative price" / "Indicative net proceeds" — never "guaranteed" or "profit".
- "Not yet verified" — never vague confirmation.
- "Demo transaction" — never imply a real commercial agreement.
- "Not estimated" for environmental impact — never zero or a fabricated value.

Units and currency format through `src/lib/format.ts` (IDR via `Intl.NumberFormat('id-ID')`, tonnes, ISO dates). Never hardcode formatted values.

## 11. Accessibility and Interaction

- Minimum touch target: 44px — enforced by pill paddings.
- Status colors always pair with text labels.
- Inputs have persistent `accessibilityLabel`s; chips expose selected state.
- Icon-only circular buttons carry accessibility labels.
- Body text ≥ 14; financial values never in micro type.
- Contrast: `soil` on `cream` and on white passes 4.5:1; `muted` only for captions.
- Forms validate on submit; errors appear in place, coral, under the step they belong to.

## 12. Motion

- Press feedback: opacity 0.85.
- No decorative animation in the prototype; motion never carries essential information.
- Respect the OS reduced-motion setting.

## 13. Implementation Rules

- Tokens live only in `src/constants/theme.ts`; screens read them via `useAppTheme()`.
- Domain logic never imports React Native; UI components never re-implement business rules.
- One shared economics calculation everywhere.
- Controlled vocabularies are typed in `src/domain/types.ts`.
- Formatting goes through `src/lib/format.ts`.
- Demo fixtures come from one source (`src/data/fixtures.ts`).

## 14. Design QA Checklist

- [ ] Simulated data identified on every screen (coral soft banner).
- [ ] Every financial value includes currency and unit.
- [ ] Deductions show explicit minus signs; negative nets stay visible (coral).
- [ ] Headlines and metric values render in Newsreader serif; body in Plus Jakarta Sans.
- [ ] Buttons are pills with 44px+ targets; active chips are forest.
- [ ] Blockers and no-match states explain themselves.
- [ ] Estimated and measured quantities never merge into one number.
- [ ] Status is never color-only.
- [ ] Empty and not-found states exist for every list.
- [ ] Every primary action produces visible feedback.
