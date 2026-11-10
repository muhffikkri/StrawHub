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

**Phase 1 — Mobile prototype**, per `ROADMAP.md`, with **Google Sign-In and
Firestore cloud sync pulled forward** (otherwise Phase 2/5 work). Persistence
beyond auth, tests, local market research, real backend endpoints, buyer/operator
surfaces, and a pilot program remain later phases.

## Modules

1. **Home** — overview KPIs, registered residue, active deals, quick actions.
2. **Registry** — residue records with estimates kept distinct from measurements.
3. **Matches** — rule-based buyer eligibility, explicit blockers, transparent economics.
4. **Deals (Transactions)** — state-machine-constrained lifecycle with event timeline.
5. **Register** — 3-step mobile wizard with validation and a visible auto-estimate.
6. **Impact & Evidence** — operational metrics kept distinct from environmental
   impact (which is explicitly *not estimated*).
7. **Login** — Google Sign-In via Firebase Authentication, with a local demo
   profile fallback when Firebase is not configured.

## Tech stack

- Expo SDK 58 · React Native 0.88 · React 19.3 · TypeScript (strict)
- expo-router (file-based, typed routes) with bottom tabs
- AgroTech design system: Newsreader serif × Plus Jakarta Sans,
  organic earth-tone tokens, pill touchpoints (`design.md`)
- React Context + reducer store — one shared data source for every screen
  (local fixtures in demo mode, Firestore real-time snapshots in cloud mode)
- Firebase JS SDK (Auth + Firestore) — Expo Go compatible, no native build
- `expo-auth-session` Google provider → Firebase credential exchange
- `@react-native-async-storage/async-storage` — session and profile persistence
- StyleSheet with centralized design tokens (`src/constants/theme.ts`)

Domain logic lives in `src/domain/` (economics, matching, transactions, impact) and
**imports no React Native** — it is plain TypeScript, ready for unit tests and future
backend reuse. UI primitives live in `src/components/ui.tsx`. Formatting lives in
`src/lib/format.ts`. Firebase bootstrap and the Firestore data layer live in
`src/lib/firebase.ts` and `src/lib/firestore.ts`.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # optional — see Firebase setup below
npx expo start
```

Then:

- **Expo Go (Android/iOS):** scan the QR code from the terminal with the Expo Go
  app (SDK 58).
- **Android emulator:** press `a`, or run `npm run android`.
- **Web:** press `w`, or run `npm run web`.

Without `.env.local` the app starts in **demo mode**: "Continue with demo profile"
on the login screen and local fixtures as data. No Firebase project is required.

Other scripts:

```bash
npm run lint             # expo lint
npm run seed:firestore   # seed Firestore with the demo dataset (admin SDK)
```

## Firebase setup

1. **Create a Firebase project** at <https://console.firebase.google.com> and add
   a **Web app** (Project settings → Your apps).
2. **Enable Google Sign-In:** Authentication → Sign-in method → Google.
   Copy the **Web client ID** shown under *Web SDK configuration*.
   In Google Cloud Console → Credentials → that OAuth client, add an authorized
   redirect URI for Expo Go:
   `https://auth.expo.io/@<your-expo-username>/strawhub`.
3. **Enable Firestore:** Build → Firestore Database → Create database.
4. **Deploy security rules** (owner-scoped, see `firestore.rules`):
   ```bash
   npx firebase-tools@latest deploy --only firestore:rules
   ```
5. **Fill `.env.local`** from `.env.local.example` with the Web app config and
   `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`.
6. **Restart the dev server** (`npx expo start -c` — env vars are inlined at
   bundle time).
7. **Seed dummy data (optional):** the app seeds each new account automatically
   on first sign-in. To seed ahead of time with the Admin SDK:
   ```bash
   FIREBASE_SERVICE_ACCOUNT=./service-account.json \
     npm run seed:firestore -- --uid <firebase-uid>
   ```

Sessions persist in AsyncStorage: once signed in, an active token bypasses the
login screen on restart. Signing out clears both the Firebase session and the
stored profile.

Collections: `users/{uid}`, `buyers/{id}`, `residueRecords/{id}`,
`transactions/{id}`, `transactionEvents/{id}`. Every record carries `ownerId`
and dates are stored as ISO strings.

## Demo flow

1. **Sign in** with Google or continue with the demo profile.
2. Open **Home** and review your profile, KPIs, and the data source badge
   (`FIRESTORE` when cloud-synced, `LOCAL` in demo mode).
3. Tap **Register residue** and complete the 3-step wizard
   (crop & field → quantity & timing → review).
4. **Matches** opens with the new record selected — review eligible buyers,
   blockers, and the economics breakdown (gross value → deductions → indicative
   net proceeds).
5. Tap **Create demo offer** on an eligible candidate.
6. Open **Deals** → the new transaction, and walk it through the allowed
   transitions: Farmer Accepted → Pickup Scheduled → record measured weight →
   Payment Pending → Completed.
7. Open **Impact & Evidence** and check that operational metrics update while
   environmental impact stays *not estimated*.
8. **Reset demo data** on Home restores the fixtures (re-seeds Firestore when
   signed in with Google).

## Documents

- `PRD.md` — product requirements (farmer-first mobile MVP).
- `design.md` — mobile design system and tokens.
- `spec/system-spec.md` — system specification.
- `ROADMAP.md` — phased development plan (Phase 1 done).
- `research/` — evidence brief and data audit (India baseline, relocation
  planned in Phase 4).

## Scope boundaries

Not implemented, by design: real buyer quotations, payment processing, live
dispatch, satellite risk intelligence, operator dashboards, and verified
avoided-emission reporting. Authentication is a **prototype integration** —
Google Sign-In plus owner-scoped Firestore data — not a production identity
program. See `ROADMAP.md` for when each remaining piece is planned.

## Repository layout

```text
├── app.json               # Expo config (SDK 58)
├── assets/                # icons and splash images
├── firestore.rules        # owner-scoped Firestore security rules
├── scripts/
│   └── seed-firestore.mjs # Admin SDK seed script (dummy dataset)
├── src/
│   ├── app/               # expo-router routes (login, tabs, register, impact, transaction)
│   ├── components/        # themed UI primitives
│   ├── constants/         # design tokens
│   ├── domain/            # business logic, no React Native imports
│   ├── data/              # simulated fixtures + dataset metadata
│   ├── hooks/             # theme helpers
│   ├── lib/               # formatting, Firebase bootstrap, Firestore data layer
│   └── store/             # auth + central demo/cloud store
├── PRD.md · design.md · ROADMAP.md
├── spec/system-spec.md
└── research/
```
