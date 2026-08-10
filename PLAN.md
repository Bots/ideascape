# Ideascape MVP Plan

## Product goal

Help creators validate promising ideas with public concept previews and privacy-preserving interest signals, then introduce transparent, milestone-based funding only after demand, security, governance, and legal assumptions have been tested.

## Current product mode

Ideascape is in **Exploration mode**. Published entries are concept previews, not active fundraisers or operating programs. The live product accepts no funds, connects no wallets, and deploys no smart contracts. Signaling interest involves no payment or commitment.

## Phase 1 — Foundation

- [x] Establish the React, TypeScript, Tailwind, and shadcn/ui scaffold
- [x] Add routing, server-state, validation, and testing foundations
- [x] Initialize local Supabase configuration
- [x] Define safe public and server-side environment boundaries
- [x] Link the hosted Supabase project
- [x] Add CI for checks and production builds

## Phase 2 — Identity, ideas, and validation

- [x] Add email and OAuth authentication
- [x] Create public profiles
- [x] Model ideas, categories, media, and lifecycle states
- [x] Build private idea creation and editing
- [x] Build public discovery and idea-detail pages
- [x] Add shareable text search and category filters to public discovery
- [x] Add row-level-security policies and policy tests
- [x] Add private, reversible member interest signals
- [x] Expose aggregate-only public interest counts
- [x] Preserve safe internal return paths through authentication
- [x] Seed deterministic concept previews and local illustrations
- [x] Expand the catalog with bold, measurable infrastructure concepts and explicit operating boundaries
- [x] Refine broad launch previews into bounded tests with decision-grade evidence
- [x] Replace generic previews with issue-driven Colorado Springs civic campaigns
- [x] Add persistent light and dark themes

## Phase 3 — Validation evidence and campaign design

- [x] Distinguish practical participation intent—use, build, pilot, expertise, or updates—without exposing individual activity
- [x] Add the first focused Project Time Capsule pilot question with private, reversible responses
- [x] Publish Project Time Capsule pilot thresholds and a creator/operator-only aggregate readiness dashboard
- [x] Expand focused validation questions to concepts whose riskiest assumption is clearly defined
- [x] Add a database-authorized, aggregate-only administrator operations dashboard without exposing respondent identities, draft content, or application details
- [ ] Add a private evidence dashboard for views, intent conversion, and concept momentum
- [ ] Define explicit validation thresholds for moving from a concept preview to a proposed campaign
- [ ] Add creator updates and public continue, revise, pause, or archive decisions
- [ ] Defer general comments, social feeds, and broad reactions until moderation needs are defined
- [ ] Define campaign goals, deadlines, milestones, evidence requirements, fees, disputes, cancellation, and refunds
- [ ] Add creator and supporter dashboards without exposing private member activity
- [ ] Define moderation, identity, sanctions, tax, privacy, and consumer-protection requirements

## Deferred — funding research outside the current pilot-readiness mission

No payment, wallet, cryptocurrency, custody, smart-contract, or active fundraising work is planned for the current product phase. Revisit this section only after a separate consequential product decision.

- [ ] Select a chain, asset, governance model, and upgrade policy only after documented evaluation
- [ ] Specify a minimal milestone-escrow state machine with release, dispute, cancellation, and refund paths
- [ ] Prototype contracts on testnet with invariant, fuzz, integration, and adversarial tests
- [ ] Require independent audits, published source, reproducible deployment, verified addresses, and version pinning
- [ ] Separate duties and require hardware-backed keys, least privilege, and multisig for privileged actions
- [ ] Add timelocked changes, capped pilots, emergency pause, recovery, monitoring, and incident runbooks
- [ ] Build human-readable signing that confirms chain, asset, amount, fees, and destination
- [ ] Never request or store wallet seed phrases or private keys
- [ ] Evaluate compliant fiat on-ramps or Stripe-backed rails separately from smart-contract custody
- [ ] Verify off-chain provider events idempotently in trusted infrastructure

## Phase 5 — Trust and limited pilot

- [ ] Add reporting, moderation, and public audit trails
- [ ] Add accessibility and cross-browser end-to-end tests
- [ ] Add observability, backups, rate limits, and abuse controls
- [ ] Complete legal review for custody, payments, refunds, privacy, sanctions, tax, and platform terms
- [ ] Run a capped, invite-only testnet pilot before accepting real value
- [ ] Run a separately approved limited-value pilot only after security and legal gates pass

## Architecture and security rules

1. The browser receives only public configuration. Privileged credentials remain in trusted infrastructure.
2. Ideascape never requests, stores, proxies, logs, or transmits wallet seed phrases or private keys.
3. No single person, browser session, or operator key can release campaign funds or change contract rules.
4. Creator-submitted milestone evidence never triggers automatic release. A separate review quorum and dispute window are required.
5. Every signing flow repeats the verified chain, asset, amount, fees, destination, and intended action in human-readable form.
6. Smart contracts must be minimal, open source, independently audited, reproducibly deployed, verified on-chain, and exercised on testnet before holding value.
7. Privileged changes require multisig approval, least privilege, hardware-backed keys, public notice, and a timelock.
8. Emergency controls must block unsafe new actions while preserving documented release, withdrawal, or refund paths.
9. Smart contracts do not replace identity, moderation, real-world evidence review, dispute handling, or legal responsibility.
10. Every exposed Supabase table has explicit row-level-security policies, and database changes are reviewed migrations.
11. Stripe or other fiat-provider webhooks run only in trusted infrastructure and are verified and processed idempotently.
12. Funding language and flows remain unavailable until security, governance, legal, and pilot gates are satisfied.
