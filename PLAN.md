# Ideascape MVP Plan

## Product goal

Help creators validate and fund promising ideas through transparent campaigns, community feedback, and milestone-based progress.

## Phase 1 — Foundation

- [x] Establish the React, TypeScript, Tailwind, and shadcn/ui scaffold
- [x] Add routing, server-state, validation, and testing foundations
- [x] Initialize local Supabase configuration
- [x] Define safe public and server-side environment boundaries
- [ ] Link the hosted Supabase project
- [x] Add CI for checks and production builds

## Phase 2 — Identity and ideas

- [ ] Add email and OAuth authentication
- [ ] Create public profiles
- [ ] Model ideas, categories, media, and lifecycle states
- [ ] Build idea creation and editing
- [ ] Build discovery and idea detail pages
- [ ] Add row-level security policies and policy tests

## Phase 3 — Community and funding

- [ ] Add follows, reactions, comments, and updates
- [ ] Define campaign goals, tiers, deadlines, and milestones
- [ ] Integrate Stripe Connect and Checkout through Supabase Edge Functions
- [ ] Record payment state from verified Stripe webhooks
- [ ] Add creator and backer dashboards

## Phase 4 — Trust and launch

- [ ] Add reporting, moderation, and audit trails
- [ ] Add accessibility and cross-browser end-to-end tests
- [ ] Add observability, backups, rate limits, and abuse controls
- [ ] Complete legal review for payments, refunds, privacy, and platform terms
- [ ] Run a small invite-only pilot before public launch

## Architecture rules

1. The browser receives only publishable Supabase and Stripe keys.
2. Privileged operations run in Supabase Edge Functions or trusted infrastructure.
3. Stripe webhook events are verified and processed idempotently.
4. Every exposed Supabase table has explicit row-level security policies.
5. Database changes are represented as reviewed migrations.
6. Funding language and flows remain subject to payments and legal review.
