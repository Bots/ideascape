begin;

select plan(22);

select ok(
  exists (
    select 1
    from public.profiles
    where id = '00000000-0000-4000-8000-000000000101'
      and username = 'ideascape-team'
      and display_name = 'IdeaScape Team'
  ),
  'the deterministic system-owner profile exists'
);

select is(
  (select count(*) from public.ideas where creator_id = '00000000-0000-4000-8000-000000000101'),
  27::bigint,
  'the system owner publishes exactly 27 deterministic security bounties'
);

select is(
  (select count(*) from public.ideas where id between '00000000-0000-4000-8000-000000000201' and '00000000-0000-4000-8000-000000000227'),
  27::bigint,
  'all deterministic bounty UUIDs remain stable'
);

select is(
  (select count(*) from public.ideas where status = 'published' and published_at is not null),
  27::bigint,
  'every deterministic security bounty is published'
);

select is(
  (select count(*) from public.ideas where title like '% Bounty'),
  27::bigint,
  'every listing is named as a bounty'
);

select is(
  (
    select count(*)
    from public.ideas
    where char_length(summary) between 80 and 280
      and summary ilike '%owner-approved test environment%'
  ),
  27::bigint,
  'every bounty summary explains its owner-approved test environment'
);

select is(
  (
    select count(*)
    from public.ideas
    where char_length(description) >= 300
      and description ilike '%permissioned defensive challenge%'
      and description ilike '%no production access%'
  ),
  27::bigint,
  'every bounty description states its permissioned and production boundaries'
);

select is(
  (
    select count(*)
    from public.ideas
    where char_length(threat_scenario) between 40 and 500
      and char_length(control_boundary) between 40 and 500
      and char_length(proof_required) between 40 and 500
  ),
  27::bigint,
  'every bounty has a complete attack, engagement, and proof case'
);

select is(
  (
    select count(*)
    from public.ideas
    where control_boundary ilike '%written permission%'
      and control_boundary ilike '%production%'
      and control_boundary ilike '%stop%'
  ),
  27::bigint,
  'every bounty requires written permission and an explicit stop boundary'
);

select is(
  (
    select count(*)
    from public.ideas
    where proof_required ilike '%minimal reproduction%'
      and proof_required ilike '%independent rerun%'
      and proof_required ilike '%remediation%'
  ),
  27::bigint,
  'every bounty requires reproducible proof and independent verification'
);

select is(
  (
    select count(*)
    from public.ideas
    where concat_ws(' ', title, summary, description, threat_scenario, control_boundary, proof_required)
      ~* '\m(hunters?|hunt|test range|range run)\M'
  ),
  0::bigint,
  'bounty copy avoids competing game and range metaphors'
);

select is(
  (
    select count(*)
    from public.categories
    join public.ideas on ideas.category_id = categories.id
    where categories.slug in ('arts-culture', 'community', 'education', 'environment', 'health', 'technology')
  ),
  27::bigint,
  'all bounties remain attached to the six stable category identifiers'
);

select is(
  (
    select count(distinct categories.slug)
    from public.categories
    join public.ideas on ideas.category_id = categories.id
  ),
  6::bigint,
  'the bounty catalog spans all six security areas'
);

select results_eq(
  $$
    select slug, name
    from public.categories
    order by slug
  $$,
  $$
    values
      ('arts-culture'::text, 'Provenance & Forgery'::text),
      ('community'::text, 'Coordination & Resilience'::text),
      ('education'::text, 'Human Attack Surface'::text),
      ('environment'::text, 'Physical & Sensor Systems'::text),
      ('health'::text, 'Privacy & Safety'::text),
      ('technology'::text, 'Software & Compute'::text)
  $$,
  'stable category slugs render as focused security areas'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
  ),
  27::bigint,
  'every bounty has one deterministic hosted cover image'
);

select is(
  (
    select count(*)
    from public.idea_media
    where kind = 'image'
      and sort_order = 0
      and char_length(trim(coalesce(alt_text, ''))) >= 40
  ),
  27::bigint,
  'every bounty cover preserves a meaningful accessible description'
);

select is(
  (
    select count(*)
    from public.idea_media
    where coalesce(alt_text, '') ~* '\m(hunters?|hunt|test range|range run)\M'
  ),
  0::bigint,
  'media descriptions avoid competing game and range metaphors'
);

select is(
  (
    select title
    from public.ideas
    where slug = 'project-time-capsule'
  ),
  'Time Capsule Disclosure Bounty',
  'the authorized test-run example keeps its stable slug and focused title'
);

select is(
  (
    select title
    from public.ideas
    where slug = 'software-supply-chain-clinic'
  ),
  'Dependency Substitution Bounty',
  'the supply-chain example is a concrete security bounty'
);

select is(
  (
    select count(*)
    from public.idea_validation_questions
    where id between '00000000-0000-4000-8000-000000000601' and '00000000-0000-4000-8000-000000000606'
      and status = 'active'
      and prompt ilike '%authorized test run%'
  ),
  6::bigint,
  'six focused readiness questions ask about authorized test runs'
);

select is(
  (
    select count(*)
    from public.idea_validation_options
    where question_id between '00000000-0000-4000-8000-000000000601' and '00000000-0000-4000-8000-000000000606'
  ),
  24::bigint,
  'the focused readiness questions have four deterministic options each'
);

select is(
  (
    select bio
    from public.profiles
    where id = '00000000-0000-4000-8000-000000000101'
  ),
  'System owner publishing authorized targets, clear rules of engagement, and reproducible proof standards.',
  'the deterministic profile explains the system-owner role'
);

select * from finish();
rollback;
