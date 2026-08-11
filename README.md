# Ideascape

Ideascape is an exploration-mode concept-validation platform for learning which community ideas resonate before anyone opens funding or launches a program.

**These are concept previews, not active fundraisers.** Visitors can browse ideas and see aggregate interest without signing in. Members can privately indicate whether they would use, build, test, advise, or follow a concept, with no payment or commitment.

- [Production](https://ideascape-gamma.vercel.app)
- [Browse concept previews](https://ideascape-gamma.vercel.app/ideas)

## Project headquarters

- [Current status and operating links](docs/PROJECT_STATUS.md)
- [Product roadmap](PLAN.md)
- [GitHub Issues](https://github.com/Bots/ideascape/issues)
- [Contributing guide](CONTRIBUTING.md)

## Current product

- Public, unauthenticated idea discovery at `/ideas` and detail pages at `/ideas/:slug`
- Twenty-seven deterministic demo concepts, seeded through versioned Supabase migrations
- A visible concept-specific security focus on every demo: threat scenario, control boundary, and proof required before expansion
- Three issue-driven Colorado Springs campaigns covering plate-reader surveillance, dangerous crossings, and inaccessible transit stops
- URL-persistent text search and category filtering, including a direct permission-first technology view at `/ideas?category=technology`
- Same-category recommendations on detail pages with accessible full-card links back into the catalog
- Fully clickable discovery cards with concise accessible link names and visible keyboard focus
- Public aggregate interest counts without exposing individual member signals
- Authenticated, reversible participation intent—use, build, pilot, expertise, or updates—with duplicate prevention and eligibility checks
- Focused pilot-readiness questions for six bounded concepts, with private, reversible member answers
- Creator-only aggregate response evidence that never includes member identities
- A public Project Time Capsule pilot plan with precommitted continue, revise, and archive thresholds
- A creator/operator-only readiness dashboard for practical signals, pilot responses, private application totals, capacity, and a threshold-based decision preview
- A private `/admin` operations dashboard for allowlisted administrators, with live aggregate member, idea, interest, validation, pilot, and application counts plus published-concept activity
- Email/password, Google, and GitHub OAuth-capable authentication with safe post-auth return paths
- Public member profiles plus owner-only profile updates
- Private creator drafts and editing at `/ideas/new` and `/ideas/:id/edit`
- Persistent, system-aware light and dark themes restricted to black, white,
  neutral grays, and `#ff5a1f` bright orange
- Route-level code splitting for non-home pages
- Supabase row-level security and pgTAP coverage for profiles, ideas, media, categories, and interest signals

There is intentionally no live fundraising, checkout, custody, or payment collection. Funding research is deferred and is not part of the current landing page, catalog, or pilot-readiness mission.

## Demo catalog

Fresh databases contain these published concept previews:

1. [The Clean Air Library](https://ideascape-gamma.vercel.app/ideas/clean-air-library)
2. [Repair Commons on Wheels](https://ideascape-gamma.vercel.app/ideas/repair-commons)
3. [Neighbor Ride Credits](https://ideascape-gamma.vercel.app/ideas/neighbor-ride-credits)
4. [After-Dark Storefronts](https://ideascape-gamma.vercel.app/ideas/after-dark-storefronts)
5. [Shade Every Mountain Metro Stop](https://ideascape-gamma.vercel.app/ideas/shade-stop-network)
6. [Skill Swap Saturdays](https://ideascape-gamma.vercel.app/ideas/skill-swap-saturdays)
7. [Cross Academy Alive](https://ideascape-gamma.vercel.app/ideas/civic-accessibility-lab)
8. [Block-Ready Kits](https://ideascape-gamma.vercel.app/ideas/block-ready-kits)
9. [Device Liberation Lab](https://ideascape-gamma.vercel.app/ideas/device-liberation-lab)
10. [File Rescue Cooperative](https://ideascape-gamma.vercel.app/ideas/file-rescue-cooperative)
11. [Cloud Exit Toolkit](https://ideascape-gamma.vercel.app/ideas/cloud-exit-toolkit)
12. [Private AI Workbench](https://ideascape-gamma.vercel.app/ideas/private-ai-workbench)
13. [Home Lab Defense Clinic](https://ideascape-gamma.vercel.app/ideas/home-lab-defense-clinic)
14. [Community Compute Cooperative](https://ideascape-gamma.vercel.app/ideas/community-compute-cooperative)
15. [Offline Mesh Field Kit](https://ideascape-gamma.vercel.app/ideas/offline-mesh-field-kit)
16. [Open Repair Atlas](https://ideascape-gamma.vercel.app/ideas/open-repair-atlas)
17. [Accessible Interface Retrofit Lab](https://ideascape-gamma.vercel.app/ideas/accessible-interface-retrofit-lab)
18. [Project Time Capsule](https://ideascape-gamma.vercel.app/ideas/project-time-capsule)
19. [Waste Heat Works](https://ideascape-gamma.vercel.app/ideas/waste-heat-works)
20. [Model Commons Lab](https://ideascape-gamma.vercel.app/ideas/model-commons-lab)
21. [Flock Off Colorado Springs](https://ideascape-gamma.vercel.app/ideas/glass-box-sensor-network)
22. [Oral History Provenance Lab](https://ideascape-gamma.vercel.app/ideas/oral-history-provenance-lab)
23. [Neighborhood Incident Relay](https://ideascape-gamma.vercel.app/ideas/neighborhood-incident-relay)
24. [Phishing Drill Library](https://ideascape-gamma.vercel.app/ideas/phishing-drill-library)
25. [Water Sensor Integrity Watch](https://ideascape-gamma.vercel.app/ideas/water-sensor-integrity-watch)
26. [Clinic Device Privacy Check](https://ideascape-gamma.vercel.app/ideas/clinic-device-privacy-check)
27. [Software Supply Chain Clinic](https://ideascape-gamma.vercel.app/ideas/software-supply-chain-clinic)

Each concept uses a stable UUID and slug, polished multi-paragraph copy, and a locally hosted SVG illustration so local resets and production verification remain reproducible. Every demo uses the same permission-first discipline: it names a concrete threat scenario, an authorization, privacy, safety, provenance, or fail-safe control boundary, and measurable proof required before the concept earns a larger test. The earliest five broad previews define bounded first tests, required permissions, privacy limits, measurable continuation evidence, and explicit stop conditions instead of assuming that backing or an operating program already exists. Those five concepts and Project Time Capsule also ask one focused, private-answer validation question so practical demand, permissions, and pilot capability can be evaluated as aggregate evidence rather than public member activity. Three previously generic previews are now sharp Colorado Springs campaigns: challenge the plate-reader dragnet through public records and lawful organizing, force a dangerous Academy Boulevard crossing into the engineering record, and turn Mountain Metro's own accessibility findings into five concrete stop fixes.

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

The repository is linked to the hosted Ideascape project (`icvscetnellunorarhvt`). To restore that CLI link on another workstation:

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

Ideascape validates requested return destinations as safe internal paths before and after OAuth. External, protocol-relative, and backslash-based redirect attempts fall back to `/`.

## Data and privacy model

The database models categories, creator-owned ideas, ordered media, explicit lifecycle states, and private per-member interest signals.

- Published ideas and their media are publicly readable.
- Draft ideas and draft media are visible only to their creator.
- Interest writes require authentication and are unique per member and idea.
- Members can privately set or change how they would participate, then remove their signal at any time.
- Members can read, add, update, or remove only their own interest row.
- Anonymous and authenticated visitors receive counts through aggregate-only database functions; individual signals and participation intent are never exposed publicly.
- Active validation questions and constrained answer choices are public, while each member's response row is private and reversible.
- Concept creators receive option totals through a creator-scoped aggregate function; raw respondent identities are never returned.
- Concept creators and trusted pilot operators receive aggregate readiness counts and a deterministic threshold preview; applicant and respondent identities are never returned by the dashboard function.
- Draft and cancelled ideas reject interest writes.
- Public profiles are readable by everyone, while authenticated members can update only their own profile fields.

## Landing-page product story

The landing page presents Ideascape as a public workshop for early ideas rather than a transaction product. It introduces all six catalog categories, explains the concept-validation flow, offers concrete ways to participate, and asks four proof questions before any idea expands: whose problem it is, what the smallest useful test is, what must stay protected, and what evidence would change the plan.

The current experience accepts no payments or fundraising. Interest is a reversible signal, not a purchase, vote, or permission grant. Deferred funding research remains isolated in `PLAN.md` and requires a separate consequential product decision before implementation.

## Quality checks

```bash
npm run check          # typecheck, lint, and frontend unit/component tests
npm run format:check   # verify Biome formatting
npm run build          # typecheck and create the production bundle
npm run test:e2e       # Playwright suite

npm run supabase:reset
npx supabase test db supabase/tests/database --local
npx supabase db lint --local --level warning
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
public/images/ideas/     # Locally hosted concept illustrations
supabase/
├── migrations/          # Ordered schema, policy, RPC, and demo-data changes
└── tests/database/      # pgTAP schema, RLS, aggregate, and seed contracts
```

See [PLAN.md](./PLAN.md) for the broader product sequence and [docs/PROJECT_STATUS.md](./docs/PROJECT_STATUS.md) for the current operating view.
