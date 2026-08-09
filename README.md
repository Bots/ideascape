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

The repository is linked to the hosted `ideascape` Supabase project (`icvscetnellunorarhvt`). To restore the CLI link on another workstation:

```bash
npx supabase login
npx supabase link --project-ref icvscetnellunorarhvt
```

### Authentication

Email/password authentication is implemented and enabled. The application also includes provider-ready GitHub and Google OAuth buttons, but each hosted provider must be configured before it can be used:

1. Open the Supabase Dashboard and select the Ideascape project.
2. Go to **Authentication → Sign In / Providers**.
3. Enable GitHub or Google and provide that provider's client ID and secret.
4. Register the Supabase provider callback with the OAuth provider:
   `https://icvscetnellunorarhvt.supabase.co/auth/v1/callback`
5. In Supabase authentication URL configuration, allow each deployed application origin and its `/auth/callback` URL. For local development, allow `http://localhost:5173/auth/callback` and `http://127.0.0.1:5173/auth/callback`.

Provider client secrets belong only in Supabase's provider configuration. Never add them to Vite environment variables or commit them to this repository.

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
