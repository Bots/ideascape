# Ideascape

Ideascape is a community funding platform where ambitious ideas meet the people ready to help make them real.

This repository contains the initial web application scaffold and local Supabase setup.

## Stack

- React 19, TypeScript, and Vite
- Tailwind CSS 4 and shadcn/ui
- React Router and TanStack Query
- Supabase for authentication, Postgres, storage, and Edge Functions
- Stripe for payment collection
- Vitest, Testing Library, and Playwright
- Biome for formatting and linting

## Getting started

### Prerequisites

- Node.js 22 or newer
- npm
- Docker-compatible runtime for the local Supabase stack

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open the URL printed by Vite.

### Environment variables

Browser-visible values belong in the root `.env.local` file:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

Never prefix a secret with `VITE_`; Vite embeds those values in the browser bundle. Server-side Supabase and Stripe secrets must be set as Edge Function secrets or placed in an ignored `supabase/.env.local` file for local function development.

### Supabase

```bash
npm run supabase:start
npm run supabase:reset
npm run supabase:stop
```

The repository has not been linked to a hosted Supabase project. Link it when a project reference and authenticated CLI session are available:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

## Quality checks

```bash
npm run check       # typecheck, lint, and unit tests
npm run build       # production build
npm run format      # format tracked source and configuration
npm run test:e2e    # Playwright suite (once browser tests are added)
```

## Project structure

```text
src/
├── app/             # Application-level providers and routing
├── components/ui/   # Reusable shadcn/ui primitives
├── lib/             # Environment, API clients, and shared utilities
└── test/            # Test setup and shared helpers
supabase/            # Local Supabase config, migrations, seed, and functions
```

See [PLAN.md](./PLAN.md) for the proposed MVP sequence.
