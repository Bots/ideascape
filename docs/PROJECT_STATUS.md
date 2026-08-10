# Ideascape Project Headquarters

This page is the public engineering headquarters for Ideascape. GitHub Issues are the source of truth for engineering work; `PLAN.md` describes the broader product sequence.

## Links

- [Production](https://ideascape-gamma.vercel.app)
- [Concept previews](https://ideascape-gamma.vercel.app/ideas)
- [Repository](https://github.com/Bots/ideascape)
- [Open issues](https://github.com/Bots/ideascape/issues)
- [Milestones](https://github.com/Bots/ideascape/milestones)
- [CI](https://github.com/Bots/ideascape/actions/workflows/ci.yml)
- [Supabase project](https://supabase.com/dashboard/project/icvscetnellunorarhvt)
- [Roadmap](../PLAN.md)

## Product mode

Ideascape is in **Exploration mode**. The twenty-one published entries are concept previews, not active fundraisers or operating programs. Public aggregate interest helps test whether people want a place like this before funding is introduced. Members can privately distinguish whether they would use, build, test, advise, or follow a concept. Signaling interest involves no payment or commitment.

## Current focus

1. Learn which concepts produce practical participation intent, not only passive curiosity.
2. Use the Project Time Capsule pilot question and creator-only aggregate evidence to test whether suitable projects and rebuild testers exist.
3. Use the private readiness dashboard to compare aggregate evidence with the published continue, revise, and archive thresholds.
4. Complete the first capped pilot intake UI, then add operating guidance and measurable rebuild outcomes without introducing payments or custody.

## Delivered

- React/TypeScript/Vite application foundation, CI, and route-level code splitting
- Responsive orange visual system with persistent system-aware light and dark themes
- Supabase authentication with email, Google, and GitHub-capable OAuth flows
- Safe internal return paths across email authentication, OAuth, and callback failures
- Public profiles with owner-only updates
- Idea, category, media, lifecycle, and private interest-signal schema
- Private draft creation and editing
- Public idea discovery and detail routes with twenty-one deterministic demo concepts, including thirteen permission-first or technology-forward previews
- Shareable, URL-persistent discovery search and category filters with useful zero-result recovery
- Same-category recommendations that connect detail pages to related concept previews and filtered discovery
- Fully clickable, keyboard-focusable discovery cards
- Local SVG concept illustrations with meaningful alternative text
- Reversible member participation intent—use, build, pilot, expertise, or updates—with aggregate-only public counts
- Focused Project Time Capsule pilot question with private, reversible answers and creator-only aggregate evidence
- Public Project Time Capsule pilot plan with a fixed evidence window, capacity, safety boundaries, and precommitted decision thresholds
- Creator/operator-only aggregate readiness dashboard with practical-signal, participant, suitable-project, application, and remaining-capacity evidence
- Deterministic pending, continue, revise, or archive previews without exposing respondent or applicant identities
- Technology-forward landing showcase plus clear separation between the live validation flow and hypothetical future funding concepts
- Row-level-security and pgTAP coverage for ownership, privacy, lifecycle, and seed behavior
- Vercel SPA deep-link routing and production deployment

## Environments

| Environment | URL / reference | Purpose |
| --- | --- | --- |
| Production | https://ideascape-gamma.vercel.app | Public concept-validation application |
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
- Individual interest rows and participation intent remain private; public pages receive aggregate counts only.
- Individual validation answers remain private; concept creators receive option totals without member identities.
- Private pilot dashboards expose aggregate counts only to the concept creator or a trusted operator; ordinary members receive no dashboard row.
- No product copy may imply payment, commitment, active fundraising, or an operating program while Ideascape remains in exploration mode.
- Commit verified milestones incrementally.

## Definition of done

A milestone is done only when implementation, focused tests, full quality gates, documentation, deployment, and production verification are complete. Database work additionally requires a clean migration reset, complete pgTAP success, warning-level schema lint, hosted migration alignment, and a live access check.
