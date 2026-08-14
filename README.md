# ProofBoundary

ProofBoundary is an authorized security-bounty platform for turning a defined threat and authorization boundary into reproducible proof before trust, access, or deployment authority expands.

**These are security briefs, not deployment approvals.** Visitors can inspect threat scenarios, control boundaries, and proof standards without signing in. Authenticated accounts can privately choose one unchanged review-intent label: “I would use this,” “I would help build it,” “I could test a pilot,” “I have relevant expertise,” or “Keep me updated.” These historical values describe interest, not a security role or authorization.

- [Production](https://ideascape-gamma.vercel.app)
- [Review security briefs](https://ideascape-gamma.vercel.app/ideas)

## Project headquarters

- [Current status and operating links](docs/PROJECT_STATUS.md)
- [Product roadmap](PLAN.md)
- [GitHub Issues](https://github.com/Bots/ideascape/issues)
- [Contributing guide](CONTRIBUTING.md)

## Current product

- Public, unauthenticated security-brief discovery at `/ideas` and detail pages at `/ideas/:slug`
- Twenty-seven deterministic security briefs, seeded through versioned Supabase migrations
- A complete security case on every brief: threat scenario, control boundary, and proof required before expansion
- Three issue-driven Colorado Springs security audits covering plate-reader surveillance, dangerous crossings, and inaccessible transit stops
- URL-persistent text search and security-domain filtering, including a direct software-and-systems view at `/ideas?category=technology`
- Same-domain security-brief recommendations with accessible full-card links back into the catalog
- Fully clickable discovery cards with concise accessible link names and visible keyboard focus
- Public aggregate validation counts without exposing individual operator signals
- Authenticated, reversible review intent using the unchanged labels “I would use this,” “I would help build it,” “I could test a pilot,” “I have relevant expertise,” and “Keep me updated,” with duplicate prevention and eligibility checks
- Focused exercise-readiness questions for six bounded security briefs, with private, reversible respondent answers
- Author-only aggregate response evidence that never includes respondent identities
- A public Project Time Capsule pilot plan with precommitted continue, revise, and archive thresholds
- An author/operator-only readiness dashboard for validation signals, exercise responses, private application totals, capacity, and a threshold-based decision preview
- A private `/admin` operations dashboard for allowlisted administrators, with live aggregate operator, brief, validation, exercise, and application counts plus published security-brief activity
- Email/password, Google, and GitHub OAuth-capable authentication with safe post-auth return paths
- Public security-operator profiles plus owner-only profile updates
- Private security-brief drafts and editing at `/ideas/new` and `/ideas/:id/edit`, including required threat, boundary, and proof fields
- Persistent, system-aware light and dark themes restricted to black, white,
  neutral grays, and `#ff5a1f` bright orange
- Route-level code splitting for non-home pages
- Supabase row-level security and pgTAP coverage for profiles, ideas, media, categories, and interest signals

Review grants no production access, deployment authority, custody, or payment. A brief advances only through explicit permission and evidence gates.

## Demo catalog

Fresh databases contain these published security briefs:

1. [Smoke Readiness Control Drill](https://ideascape-gamma.vercel.app/ideas/clean-air-library)
2. [Authorized Repair Safety Clinic](https://ideascape-gamma.vercel.app/ideas/repair-commons)
3. [Essential Trip Privacy Relay](https://ideascape-gamma.vercel.app/ideas/neighbor-ride-credits)
4. [After-Dark Installation Safety Review](https://ideascape-gamma.vercel.app/ideas/after-dark-storefronts)
5. [Transit Stop Hazard Audit](https://ideascape-gamma.vercel.app/ideas/shade-stop-network)
6. [Repair Procedure Safety Drill](https://ideascape-gamma.vercel.app/ideas/skill-swap-saturdays)
7. [Crossing Safety Evidence Audit](https://ideascape-gamma.vercel.app/ideas/civic-accessibility-lab)
8. [Outage Kit Integrity Drill](https://ideascape-gamma.vercel.app/ideas/block-ready-kits)
9. [Device Liberation Lab](https://ideascape-gamma.vercel.app/ideas/device-liberation-lab)
10. [File Recovery Integrity Clinic](https://ideascape-gamma.vercel.app/ideas/file-rescue-cooperative)
11. [Cloud Exit Toolkit](https://ideascape-gamma.vercel.app/ideas/cloud-exit-toolkit)
12. [Private AI Workbench](https://ideascape-gamma.vercel.app/ideas/private-ai-workbench)
13. [Home Lab Defense Clinic](https://ideascape-gamma.vercel.app/ideas/home-lab-defense-clinic)
14. [Secure Compute Isolation Lab](https://ideascape-gamma.vercel.app/ideas/community-compute-cooperative)
15. [Offline Mesh Field Kit](https://ideascape-gamma.vercel.app/ideas/offline-mesh-field-kit)
16. [Open Repair Atlas](https://ideascape-gamma.vercel.app/ideas/open-repair-atlas)
17. [Accessible Interface Retrofit Lab](https://ideascape-gamma.vercel.app/ideas/accessible-interface-retrofit-lab)
18. [Project Time Capsule](https://ideascape-gamma.vercel.app/ideas/project-time-capsule)
19. [Compute Heat Fail-Safe Lab](https://ideascape-gamma.vercel.app/ideas/waste-heat-works)
20. [Model Evaluation Integrity Lab](https://ideascape-gamma.vercel.app/ideas/model-commons-lab)
21. [Plate Reader Privacy Audit](https://ideascape-gamma.vercel.app/ideas/glass-box-sensor-network)
22. [Oral History Provenance Lab](https://ideascape-gamma.vercel.app/ideas/oral-history-provenance-lab)
23. [Private Incident Triage Relay](https://ideascape-gamma.vercel.app/ideas/neighborhood-incident-relay)
24. [Phishing Drill Library](https://ideascape-gamma.vercel.app/ideas/phishing-drill-library)
25. [Water Sensor Integrity Watch](https://ideascape-gamma.vercel.app/ideas/water-sensor-integrity-watch)
26. [Clinic Device Privacy Check](https://ideascape-gamma.vercel.app/ideas/clinic-device-privacy-check)
27. [Software Supply Chain Clinic](https://ideascape-gamma.vercel.app/ideas/software-supply-chain-clinic)

Each brief uses a stable UUID and slug, locally hosted artwork, and a permission-first security case. Every record names a concrete threat scenario, an authorization, privacy, safety, provenance, or fail-safe control boundary, and measurable proof required before a larger exercise. Focused private-answer review questions turn operator intent into aggregate evidence without exposing identities. Colorado Springs briefs cover plate-reader privacy, crossing safety evidence, and transit-stop hazards through lawful, reproducible security review.

## Stack

- React 19, TypeScript, and Vite
- Tailwind CSS 4 and shadcn/ui
- React Router and TanStack Query
- Supabase Auth, Postgres, row-level security, and RPC functions
- Vitest, Testing Library, Playwright, and pgTAP
- Biome for formatting and linting
- Vercel for the production web application

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- A Docker-compatible runtime for the local Supabase stack

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open the URL printed by Vite. Public discovery requires a Supabase project containing the repository migrations; use the local stack below or supply hosted public client values.

### Environment variables

Browser-visible values belong in the root `.env.local` file:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Values prefixed with `VITE_` are embedded in the browser bundle and must never contain OAuth client secrets, a Supabase service-role key, Stripe secret keys, or any other privileged credential.

### Local Supabase

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:stop
```

The repository remains linked to the existing hosted Supabase project (`icvscetnellunorarhvt`). To restore that CLI link on another workstation:

```bash
npx supabase login
npx supabase link --project-ref icvscetnellunorarhvt
```

Review every migration before running `npx supabase db push` against the linked hosted project.

### Authentication

Email/password authentication is implemented. The UI also supports Google and GitHub OAuth; Google is enabled in the hosted project, while each local or alternative deployment must configure any provider it wants to expose.

For each OAuth provider:

1. Enable the provider under **Supabase Dashboard → Authentication → Sign In / Providers**.
2. Store the provider client ID and secret only in Supabase's provider configuration.
3. Register the Supabase callback with the provider: `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Add the deployed app's `/auth/callback` route to Supabase's trusted redirect URLs. For local development, allow both `http://localhost:5173/auth/callback` and `http://127.0.0.1:5173/auth/callback` when needed.

ProofBoundary validates requested return destinations as safe internal paths before and after OAuth. External, protocol-relative, and backslash-based redirect attempts fall back to `/`.

## Data and privacy model

The database models security domains, author-owned briefs, ordered media, explicit lifecycle states, and private per-account validation signals. Legacy table and column names remain stable compatibility identifiers.

- Published security briefs and their media are publicly readable.
- Draft security briefs and draft media are visible only to their author.
- Validation-signal writes require authentication and are unique per account and brief.
- Accounts can privately set or change review intent, then remove the signal at any time.
- Accounts can read, add, update, or remove only their own validation-signal row.
- Anonymous and authenticated visitors receive counts through aggregate-only database functions; individual signals and review intent are never exposed publicly.
- Active security-review questions and constrained answer choices are public, while each respondent row is private and reversible.
- Security brief authors receive option totals through an author-scoped aggregate function; raw respondent identities are never returned.
- Security brief authors and trusted exercise operators receive aggregate readiness counts and a deterministic threshold preview; applicant and respondent identities are never returned by the dashboard function.
- Draft and cancelled briefs reject validation-signal writes.
- Public operator profiles are readable by everyone, while authenticated accounts can update only their own profile fields.

## Landing-page product story

The landing page presents ProofBoundary as an authorized security-bounty platform. It introduces six security domains, explains the threat-to-evidence flow, offers concrete ways to challenge a bounty, and asks four proof questions before any control advances: what can fail, what authority is excluded, how the control fails safely, and what evidence earns trust.

The current experience accepts no payments and grants no operational authority. Validation intent is a reversible signal, not a vote, approval, or permission grant.

## Quality checks

```bash
npm run check          # typecheck, lint, and frontend unit/component tests
npm run format:check   # verify Biome formatting
npm run build          # typecheck and create the production bundle
npm run test:e2e       # Playwright suite

npm run supabase:reset
npx supabase test db supabase/tests/database --local
npx supabase db lint --local --level warning
psql 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' -v ON_ERROR_STOP=1 -f supabase/verification/security-positioning-upgrade.test.sql
```

Database work is complete only after a clean migration reset, the full pgTAP suite, and warning-level schema lint pass.

## Project structure

```text
src/
├── app/                 # Application providers
├── components/          # Shared application and UI components
├── features/
│   ├── auth/            # Authentication, callback, and safe return routing
│   ├── ideas/           # Discovery, detail, editor, and interest signaling
│   ├── pilots/          # Public pilot plans and private aggregate readiness evidence
│   ├── profiles/        # Public profile pages
│   └── theme/           # Persistent light/dark theme support
├── lib/                 # Environment, Supabase client, and shared utilities
└── test/                # Test setup and shared helpers
public/images/ideas/     # Locally hosted security-brief illustrations
supabase/
├── migrations/          # Ordered schema, policy, RPC, and demo-data changes
├── tests/database/      # pgTAP schema, RLS, aggregate, and seed contracts
└── verification/        # Transactional migration-upgrade and private-data preservation checks
```

See [PLAN.md](./PLAN.md) for the broader product sequence and [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) for the current operating view.
