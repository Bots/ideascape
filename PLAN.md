# Ideascape Security Validation Plan

## Product goal

Help operators expose credible threats, bound control authority, and publish reproducible proof before a system earns trust or a larger exercise.

## Current product mode

Ideascape is in **Security review mode**. Published entries are security briefs, not deployment approvals. Review signals remain private and reversible; only aggregates are public. A signal grants no production access, data authority, custody, payment, or commitment.

## Phase 1 — Foundation

- [x] Establish the React, TypeScript, Tailwind, and shadcn/ui scaffold
- [x] Add routing, server-state, validation, and testing foundations
- [x] Initialize local Supabase configuration
- [x] Define safe public and server-side environment boundaries
- [x] Link the hosted Supabase project
- [x] Add CI for checks and production builds

## Phase 2 — Identity, security briefs, and validation

- [x] Add email and OAuth authentication
- [x] Create public profiles
- [x] Model security briefs, domains, media, and lifecycle states
- [x] Build private security-brief creation and editing
- [x] Build public security discovery and detail pages
- [x] Add shareable text search and security-domain filters to public discovery
- [x] Add row-level-security policies and policy tests
- [x] Add private, reversible account validation signals
- [x] Expose aggregate-only public validation counts
- [x] Preserve safe internal return paths through authentication
- [x] Seed deterministic security briefs and local illustrations
- [x] Expand the catalog with measurable infrastructure controls and explicit operating boundaries
- [x] Refine broad launch records into bounded tests with decision-grade evidence
- [x] Replace generic previews with issue-driven Colorado Springs security audits
- [x] Give every brief a threat scenario, control boundary, and proof requirement consistent with the security claim policy
- [x] Require threat, control-boundary, and proof fields in new private drafts
- [x] Add persistent light and dark themes
- [x] Restrict the rendered palette to black, white, neutral grays, and bright orange

## Phase 3 — Validation evidence and adversarial review

- [x] Preserve the original private intent meanings—“I would use this,” “I would help build it,” “I could test a pilot,” “I have relevant expertise,” and “Keep me updated”—without exposing individual activity or treating intent as authorization
- [x] Add the first focused Project Time Capsule pilot question with private, reversible responses
- [x] Publish Project Time Capsule exercise thresholds and an author/operator-only aggregate readiness dashboard
- [x] Expand focused validation questions to security briefs whose riskiest assumption is clearly defined
- [x] Add a database-authorized, aggregate-only administrator operations dashboard without exposing respondent identities, draft content, or application details
- [ ] Add a private evidence dashboard for views, review-intent conversion, and proof momentum
- [ ] Define explicit validation thresholds for moving from a security brief to a bounded exercise
- [ ] Add operator updates and public continue, revise, pause, or archive decisions
- [ ] Defer general comments, social feeds, and broad reactions until moderation needs are defined
- [ ] Add control-test reports and residual-risk decisions without exposing private reviewer activity
- [ ] Define moderation, identity, privacy, disclosure, and coordinated-vulnerability-reporting requirements

## Phase 5 — Security hardening and limited exercises

- [ ] Add reporting, moderation, and public audit trails
- [ ] Add accessibility and cross-browser end-to-end tests
- [ ] Add observability, backups, rate limits, and abuse controls
- [ ] Complete legal and privacy review for authorized testing, disclosure, retention, accessibility, and platform terms
- [ ] Run capped, invite-only exercises with synthetic or explicitly authorized data
- [ ] Publish residual-risk decisions and rollback evidence before expanding any exercise

## Architecture and security rules

1. The browser receives only public configuration. Privileged credentials remain in trusted infrastructure.
2. Every security brief names a concrete threat scenario, a bounded control surface, and reproducible proof requirements.
3. Individual review intent, validation answers, and application details remain private; public routes expose aggregates only.
4. A validation signal grants no access, collection permission, deployment authority, or operational commitment.
5. Exercises use synthetic or explicitly authorized data and document exclusions, stop conditions, and rollback paths.
6. Privileged changes require least privilege, independent review, auditable approval, and documented recovery.
7. Emergency controls must block unsafe new actions while preserving evidence and a tested recovery path.
8. Security controls do not replace identity, moderation, real-world evidence review, disclosure handling, or legal responsibility.
9. Every exposed Supabase table has explicit row-level-security policies, and database changes are reviewed migrations.
10. Expansion requires a recorded residual-risk decision supported by independent evidence.
