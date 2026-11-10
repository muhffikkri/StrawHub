# StrawHub

**Jerami Jadi Rupiah** — a farmer-first straw marketplace mobile app.

StrawHub helps farmers turn surplus crop residue into income instead of burning it:
register available straw, see buyer candidates with transparent economics, accept an
offer, and follow the transaction through to completion.

This repository is an **interactive mobile prototype** built with
**React Native 0.88 / Expo SDK 58**, running in **Expo Go** on explicitly
**simulated data**.

> **Disclaimer.** All records, prices, transactions and matches in this prototype
> are illustrative and not field-verified. The prototype does not claim real buyer
> commitments, payments, or verified avoided emissions. Collected mass is not
> automatically mass diverted from burning.

## Status

**Phase 1 — Mobile prototype**, per `ROADMAP.md`. Persistence, tests, local market
research, a backend, buyer/operator surfaces, and a pilot program are later phases.

## Modules

1. **Home** — overview KPIs, registered residue, active deals, quick actions.
2. **Registry** — residue records with estimates kept distinct from measurements.
3. **Matches** — rule-based buyer eligibility, explicit blockers, transparent economics.
4. **Deals (Transactions)** — state-machine-constrained lifecycle with event timeline.
5. **Register** — 3-step mobile wizard with validation and a visible auto-estimate.
6. **Impact & Evidence** — operational metrics kept distinct from environmental
   impact (which is explicitly *not estimated*).

## Tech stack

- Expo SDK 58 · React Native 0.88 · React 19.3 · TypeScript (strict)
- expo-router (file-based, typed routes) with bottom tabs
- AgroTech design system: Newsreader serif × Plus Jakarta Sans,
  organic earth-tone tokens, pill touchpoints (`design.md`)
- React Context + reducer store — one shared data source for every screen
- StyleSheet with centralized design tokens (`src/constants/theme.ts`)
- Local JSON-style fixtures (`src/data/fixtures.ts`)

Domain logic lives in `src/domain/` (economics, matching, transactions, impact) and
**imports no React Native** — it is plain TypeScript, ready for unit tests and future
backend reuse. UI primitives live in `src/components/ui.tsx`. Formatting lives in
`src/lib/format.ts`.

## Getting started

```bash
npm install
npx expo start
```

Then:

- **Expo Go (Android/iOS):** scan the QR code from the terminal with the Expo Go
  app (SDK 58).
- **Android emulator:** press `a`, or run `npm run android`.
- **Web:** press `w`, or run `npm run web`.

Other scripts:

```bash
npm run lint      # expo lint
```

## Demo flow

1. Open **Home** and review the demo profile and KPIs.
2. Tap **Register residue** and complete the 3-step wizard
   (crop & field → quantity & timing → review).
3. **Matches** opens with the new record selected — review eligible buyers,
   blockers, and the economics breakdown (gross value → deductions → indicative
   net proceeds).
4. Tap **Create demo offer** on an eligible candidate.
5. Open **Deals** → the new transaction, and walk it through the allowed
   transitions: Farmer Accepted → Pickup Scheduled → record measured weight →
   Payment Pending → Completed.
6. Open **Impact & Evidence** and check that operational metrics update while
   environmental impact stays *not estimated*.
7. **Reset demo data** on Home restores the fixtures.

## Documents

- `PRD.md` — product requirements (farmer-first mobile MVP).
- `design.md` — mobile design system and tokens.
- `spec/system-spec.md` — system specification.
- `ROADMAP.md` — phased development plan (Phase 1 done).
- `research/` — evidence brief and data audit (India baseline, relocation
  planned in Phase 4).

## Scope boundaries

Not implemented, by design: a backend, accounts and authentication, real buyer
quotations, payment processing, live dispatch, satellite risk intelligence,
operator dashboards, and verified avoided-emission reporting. See `ROADMAP.md`
for when each of these is planned.

## Repository layout

```text
├── app.json               # Expo config (SDK 58)
├── assets/                # icons and splash images
├── src/
│   ├── app/               # expo-router routes (tabs, register, impact, transaction)
│   ├── components/        # themed UI primitives
│   ├── constants/         # design tokens
│   ├── domain/            # business logic, no React Native imports
│   ├── data/              # simulated fixtures + dataset metadata
│   ├── hooks/             # theme helpers
│   ├── lib/               # formatting utilities
│   └── store/             # central demo store
├── PRD.md · design.md · ROADMAP.md
├── spec/system-spec.md
└── research/
```
