# Ideascape

Ideascape is an exploration-mode concept-validation platform for learning which community ideas resonate before anyone opens funding or launches a program.

**These are concept previews, not active fundraisers.** Visitors can browse ideas and see aggregate interest without signing in. Members can signal that they would like to see a concept happen, with no payment or commitment.

- [Production](https://ideascape-gamma.vercel.app)
- [Browse concept previews](https://ideascape-gamma.vercel.app/ideas)

## Project headquarters

- [Current status and operating links](docs/PROJECT_STATUS.md)
- [Product roadmap](PLAN.md)
- [GitHub Issues](https://github.com/Bots/ideascape/issues)
- [Contributing guide](CONTRIBUTING.md)

## Current product

- Public, unauthenticated idea discovery at `/ideas` and detail pages at `/ideas/:slug`
- Eight deterministic demo concepts, seeded through versioned Supabase migrations
- Fully clickable discovery cards with concise accessible link names and visible keyboard focus
- Public aggregate interest counts without exposing individual member signals
- Authenticated, reversible interest signaling with duplicate prevention and eligibility checks
- Email/password, Google, and GitHub OAuth-capable authentication with safe post-auth return paths
- Public member profiles plus owner-only profile updates
- Private creator drafts and editing at `/ideas/new` and `/ideas/:id/edit`
- Persistent, system-aware light and dark themes using the warm orange visual system
- Route-level code splitting for non-home pages
- Supabase row-level security and pgTAP coverage for profiles, ideas, media, categories, and interest signals

There is intentionally no live fundraising, checkout, or payment collection. Stripe packages are reserved for possible later experiments, but no payment flow is active in this product.

## Demo catalog

Fresh databases contain these published concept previews:

1. [The Clean Air Library](https://ideascape-gamma.vercel.app/ideas/clean-air-library)
2. [Repair Commons on Wheels](https://ideascape-gamma.vercel.app/ideas/repair-commons)
3. [Neighbor Ride Credits](https://ideascape-gamma.vercel.app/ideas/neighbor-ride-credits)
4. [After-Dark Storefronts](https://ideascape-gamma.vercel.app/ideas/after-dark-storefronts)
5. [Shade Stop Network](https://ideascape-gamma.vercel.app/ideas/shade-stop-network)
6. [Skill Swap Saturdays](https://ideascape-gamma.vercel.app/ideas/skill-swap-saturdays)
7. [Civic Accessibility Lab](https://ideascape-gamma.vercel.app/ideas/civic-accessibility-lab)
8. [Block-Ready Kits](https://ideascape-gamma.vercel.app/ideas/block-ready-kits)

Each concept uses a stable UUID and slug, polished multi-paragraph copy, and a locally hosted SVG illustration so local resets and production verification remain reproducible.

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
- Members can read, add, or remove only their own interest row.
- Anonymous and authenticated visitors receive counts through aggregate-only database functions; individual signals are never exposed publicly.
- Draft and cancelled ideas reject interest writes.
- Public profiles are readable by everyone, while authenticated members can update only their own profile fields.

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
