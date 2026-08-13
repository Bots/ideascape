begin;

select plan(17);

select is(
  (
    select count(*)
    from public.categories
    join (
      values
        ('arts-culture'::text, 'Provenance & Forgery'::text),
        ('community'::text, 'Coordination & Resilience'::text),
        ('education'::text, 'Human Attack Surface'::text),
        ('environment'::text, 'Physical & Sensor Systems'::text),
        ('health'::text, 'Privacy & Safety'::text),
        ('technology'::text, 'Software & Compute'::text)
    ) as expected(slug, name)
      on expected.slug = categories.slug
      and expected.name = categories.name
  ),
  6::bigint,
  'legacy category identifiers render as six focused security areas'
);

select is(
  (
    select count(*)
    from public.categories
    where description !~* '(authorized|bount|security|threat|risk|control|privacy|integrity|resilien|authentic)'
  ),
  0::bigint,
  'every security-area description states its authorized security purpose'
);

select is(
  (
    select count(*)
    from public.ideas
    where concat_ws(' ', title, summary, description) ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M'
  ),
  0::bigint,
  'published security briefs contain no community-first positioning'
);

select is(
  (
    select count(*)
    from public.ideas
    where concat_ws(' ', title, summary, description)
      ~* '\m(campaigns?|cooperative|commons|members?)\M'
  ),
  0::bigint,
  'published security briefs avoid campaign, cooperative, commons, and member positioning'
);

select is(
  (
    select count(*)
    from public.idea_media
    where coalesce(alt_text, '') ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M'
  ),
  0::bigint,
  'security brief media descriptions contain no community-first positioning'
);

select is(
  (
    select count(*)
    from public.idea_media
    where coalesce(alt_text, '') ~* '\m(campaigns?|cooperative|commons|members?)\M'
  ),
  0::bigint,
  'security brief media descriptions avoid social-platform positioning'
);

select is(
  (
    select count(*)
    from public.profiles
    where coalesce(bio, '') ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M'
  ),
  0::bigint,
  'public operator profiles contain no community-first positioning'
);

select is(
  (
    select count(*)
    from public.idea_validation_options
    where label ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M'
  ),
  0::bigint,
  'validation options use security-first language'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.ideas'::regclass
      and conname = 'ideas_security_case_required'
  ),
  'database requires a complete security case for every new brief'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values (
  '77777777-7777-4777-8777-777777777777',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'security-author@example.invalid', '', now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Security Author"}'::jsonb, now(), now()
);

insert into public.ideas (
  creator_id, category_id, slug, title, summary, description,
  threat_scenario, control_boundary, proof_required, status, published_at
) values (
  '77777777-7777-4777-8777-777777777777',
  (select id from public.categories where slug = 'technology'),
  'published-delete-policy-fixture',
  'Published delete policy fixture',
  'A published security brief used to prove authors cannot erase reviewed evidence.',
  'The fixture verifies that direct authenticated clients cannot delete a published brief.',
  'An author could delete a published security case and erase its reviewed evidence trail.',
  'Published briefs are immutable to author deletion and remain governed by lifecycle policy.',
  'The record must remain queryable after its author attempts deletion through authenticated RLS.',
  'published', now()
);

insert into public.idea_media (idea_id, kind, url, alt_text, sort_order)
values (
  (select id from public.ideas where slug = 'published-delete-policy-fixture'),
  'image',
  'https://example.invalid/published-security-evidence.png',
  'Published security evidence that must remain immutable to the author',
  0
);

set local role authenticated;
set local "request.jwt.claim.sub" = '77777777-7777-4777-8777-777777777777';

select throws_ok(
  $$
    insert into public.ideas (
      creator_id, category_id, slug, title, summary, description
    ) values (
      '77777777-7777-4777-8777-777777777777',
      (select id from public.categories where slug = 'technology'),
      'incomplete-security-brief',
      'Incomplete security brief',
      'This record omits the required security case.',
      'A direct client must not bypass the threat, control, and proof gate.'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "ideas"',
  'direct clients cannot create incomplete security briefs'
);

select lives_ok(
  $$
    insert into public.ideas (
      creator_id, category_id, slug, title, summary, description,
      threat_scenario, control_boundary, proof_required
    ) values (
      '77777777-7777-4777-8777-777777777777',
      (select id from public.categories where slug = 'technology'),
      'complete-security-brief',
      'Complete security brief',
      'A complete private draft with a bounded security case.',
      'The brief documents the threat, control, proof, and stop conditions.',
      'An attacker can exploit a trusted update path and compromise protected systems.',
      'Testing is limited to an isolated authorized environment using synthetic data only.',
      'Independent reviewers must reproduce detection, rollback, and recovery evidence.'
    )
  $$,
  'authenticated authors can create complete private drafts'
);

select throws_ok(
  $$
    insert into public.ideas (
      creator_id, category_id, slug, title, summary, description,
      threat_scenario, control_boundary, proof_required, status, published_at
    ) values (
      '77777777-7777-4777-8777-777777777777',
      (select id from public.categories where slug = 'technology'),
      'direct-published-security-brief',
      'Direct published security brief',
      'A complete record that attempts to bypass review state.',
      'The security case is complete, but an author cannot publish it directly.',
      'An attacker can exploit a trusted update path and compromise protected systems.',
      'Testing is limited to an isolated authorized environment using synthetic data only.',
      'Independent reviewers must reproduce detection, rollback, and recovery evidence.',
      'published', now()
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "ideas"',
  'authors cannot bypass the draft lifecycle through a direct client'
);

select throws_ok(
  $$
    update public.ideas
    set threat_scenario = null
    where slug = 'complete-security-brief'
  $$,
  '42501',
  'new row violates row-level security policy for table "ideas"',
  'authors cannot remove required security fields through a direct client'
);

select throws_ok(
  $$
    update public.ideas
    set status = 'published', published_at = now()
    where slug = 'complete-security-brief'
  $$,
  '42501',
  'new row violates row-level security policy for table "ideas"',
  'authors cannot self-publish through a direct client'
);

delete from public.ideas
where slug = 'published-delete-policy-fixture';

select is(
  (select count(*) from public.ideas where slug = 'published-delete-policy-fixture'),
  1::bigint,
  'authors cannot delete published security briefs through a direct client'
);

update public.idea_media
set alt_text = 'Author-mutated published evidence'
where idea_id = (
  select id from public.ideas where slug = 'published-delete-policy-fixture'
);

select is(
  (
    select alt_text
    from public.idea_media
    where idea_id = (
      select id from public.ideas where slug = 'published-delete-policy-fixture'
    )
  ),
  'Published security evidence that must remain immutable to the author',
  'authors cannot mutate published security brief media through a direct client'
);

reset role;

select is(
  (select status::text from public.ideas where slug = 'complete-security-brief'),
  'draft',
  'the accepted author record remains a private draft'
);

select * from finish();
rollback;
