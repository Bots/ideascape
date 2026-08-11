# Ideascape Project Headquarters

This page is the public engineering headquarters for Ideascape. GitHub Issues are the source of truth for engineering work; `PLAN.md` describes the broader product sequence.

## Links

- [Production](https://ideascape-gamma.vercel.app)
- [Security briefs](https://ideascape-gamma.vercel.app/ideas)
- [Repository](https://github.com/Bots/ideascape)
- [Open issues](https://github.com/Bots/ideascape/issues)
- [Milestones](https://github.com/Bots/ideascape/milestones)
- [CI](https://github.com/Bots/ideascape/actions/workflows/ci.yml)
- [Supabase project](https://supabase.com/dashboard/project/icvscetnellunorarhvt)
- [Roadmap](../PLAN.md)

## Product mode

Ideascape is in **Security review mode**. Twenty-seven published briefs expose a threat scenario, control boundary, and proof standard before any system can advance. Public aggregate counts show review depth without exposing individual intent. Private signals retain their original labels and meanings: “I would use this,” “I would help build it,” “I could test a pilot,” “I have relevant expertise,” and “Keep me updated.” A signal describes interest, not a security role, and grants no production access, deployment authority, payment, or commitment.

## Current focus

1. Strengthen each security brief through scoped adversarial review rather than popularity.
2. Use focused private-answer questions across six bounded briefs to test authorization, control ownership, and exercise capability through aggregate evidence.
3. Compare Project Time Capsule evidence with precommitted continue, revise, and archive thresholds.
4. Use private operations aggregates to monitor security review depth without opening respondent-level records.
5. Complete the first capped Project Time Capsule exercise intake, then publish measurable rebuild and recovery outcomes without introducing payments or custody.

## Delivered

- React/TypeScript/Vite application foundation, CI, and route-level code splitting
- Responsive light/dark visual system restricted to black, white, neutral grays,
  and `#ff5a1f` bright orange
- Supabase authentication with email, Google, and GitHub-capable OAuth flows
- Safe internal return paths across email authentication, OAuth, and callback failures
- Public profiles with owner-only updates
- Security-brief, domain, media, lifecycle, and private validation-signal schema
- Private security-brief creation and editing with required threat, boundary, and proof fields
- Public discovery and detail routes with twenty-seven deterministic security briefs
- Visible catalog security focuses and detail-page security cases connecting all twenty-seven briefs to a concrete threat scenario, control boundary, and proof requirement
- Three localized Colorado Springs security audits with public-record evidence, permitted field tests, and anti-tampering boundaries
- Five early records refined into bounded, permissioned tests with measurable continue, revise, and stop evidence
- Shareable, URL-persistent discovery search and security-domain filters with useful zero-result recovery
- Same-domain recommendations that connect detail pages to related security briefs and filtered discovery
- Fully clickable, keyboard-focusable discovery cards
- Local SVG security-brief illustrations with meaningful alternative text
- Reversible private validation intent with the unchanged labels “I would use this,” “I would help build it,” “I could test a pilot,” “I have relevant expertise,” and “Keep me updated,” with aggregate-only public counts
- Focused exercise questions across six bounded security briefs with private, reversible answers and author-only aggregate evidence
- Public Project Time Capsule pilot plan with a fixed evidence window, capacity, safety boundaries, and precommitted decision thresholds
- Author/operator-only aggregate readiness dashboard with validation-signal, respondent, suitable-test, application, and remaining-capacity evidence
- Database-authorized `/admin` operations dashboard with live aggregate counts, published security-brief activity, explicit unauthorized and error states, and no respondent, draft, or application-detail access
- Deterministic pending, continue, revise, or archive previews without exposing respondent or applicant identities
- Security-first landing showcase with six attack-surface domains and a ten-stage threat-to-evidence path
- Row-level-security and pgTAP coverage for ownership, privacy, lifecycle, and seed behavior
- Vercel SPA deep-link routing and production deployment

## Environments

| Environment | URL / reference | Purpose |
| --- | --- | --- |
| Production | https://ideascape-gamma.vercel.app | Public security-validation application |
| Supabase | `icvscetnellunorarhvt` | Hosted authentication and Postgres |
| Repository | `Bots/ideascape` | Source, issues, reviews, and CI |
| Local app | Vite-assigned localhost URL | Frontend development |
| Local Supabase | CLI stack | Migration, RLS, RPC, and pgTAP verification |

## Operating rules

- GitHub Issues own engineering scope and priority.
- Obsidian is the personal operating dashboard and decision notebook.
- Every behavior change starts with a focused failing test.
- Database changes require reviewed migrations, explicit RLS, pgTAP tests, and schema lint.
- Privileged credentials never run in browser code.
- Individual validation-signal rows and review intent remain private; public pages receive aggregate counts only.
- Individual validation answers remain private; security brief authors receive option totals without respondent identities.
- Private exercise dashboards expose aggregate counts only to the security brief author or a trusted operator; unauthorized accounts receive no dashboard row.
- Administrator access is enforced by a private database allowlist or trusted operator claim; the admin dashboard receives aggregate RPC results rather than direct table access.
- No product copy may imply that a validation signal authorizes access, data collection, deployment, payment, or an operating program.
- Commit verified milestones incrementally.

## Definition of done

A milestone is done only when implementation, focused tests, full quality gates, documentation, deployment, and production verification are complete. Database work additionally requires a clean migration reset, complete pgTAP success, warning-level schema lint, hosted migration alignment, and a live access check.
