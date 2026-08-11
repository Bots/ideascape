begin;

select plan(24);

select has_schema('private', 'private schema exists for non-API authorization data');
select has_table('private', 'ideascape_admins', 'private admin allowlist exists');
select columns_are(
  'private',
  'ideascape_admins',
  array['email', 'created_at'],
  'admin allowlist stores only normalized email and creation time'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'private.ideascape_admins'::regclass),
  'admin allowlist uses row-level security'
);
select is(
  has_schema_privilege('anon', 'private', 'usage'),
  false,
  'anonymous users cannot use the private schema'
);
select is(
  has_schema_privilege('authenticated', 'private', 'usage'),
  false,
  'authenticated users cannot use the private schema directly'
);
select is(
  has_table_privilege(
    'authenticated',
    'private.ideascape_admins',
    'select'
  ),
  false,
  'authenticated users cannot read the admin allowlist'
);
select is(
  (select count(*) from private.ideascape_admins where email = 'botsone@gmail.com'),
  1::bigint,
  'the requested production administrator is allowlisted'
);
select has_function(
  'public',
  'is_ideascape_admin',
  array[]::text[],
  'admin authorization helper exists'
);
select is(
  has_function_privilege('anon', 'public.is_ideascape_admin()', 'execute'),
  false,
  'anonymous users cannot execute the admin authorization helper'
);
select is(
  has_function_privilege('authenticated', 'public.is_ideascape_admin()', 'execute'),
  true,
  'authenticated users can ask for server-authoritative admin access'
);
select has_function(
  'public',
  'get_admin_dashboard_summary',
  array[]::text[],
  'aggregate admin dashboard summary exists'
);
select is(
  has_function_privilege('anon', 'public.get_admin_dashboard_summary()', 'execute'),
  false,
  'anonymous users cannot execute the admin summary'
);
select is(
  has_function_privilege('authenticated', 'public.get_admin_dashboard_summary()', 'execute'),
  true,
  'authenticated admins can execute the admin summary'
);
select has_function(
  'public',
  'get_admin_idea_activity',
  array[]::text[],
  'aggregate published-idea activity function exists'
);
select is(
  has_function_privilege('anon', 'public.get_admin_idea_activity()', 'execute'),
  false,
  'anonymous users cannot execute published-idea activity'
);
select is(
  has_function_privilege('authenticated', 'public.get_admin_idea_activity()', 'execute'),
  true,
  'authenticated admins can execute published-idea activity'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '88888888-8888-4888-8888-888888888888',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'dashboard-admin@example.invalid', '', timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dashboard Admin"}'::jsonb,
    timezone('utc', now()), timezone('utc', now())
  ),
  (
    '99999999-9999-4999-8999-999999999999',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'ordinary@example.invalid', '', timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Ordinary Member"}'::jsonb,
    timezone('utc', now()), timezone('utc', now())
  ),
  (
    'aaaaaaaa-9999-4999-8999-999999999999',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'operator@example.invalid', '', timezone('utc', now()),
    '{"provider":"email","providers":["email"],"ideascape_role":"operator"}'::jsonb,
    '{"full_name":"Trusted Operator"}'::jsonb,
    timezone('utc', now()), timezone('utc', now())
  );

insert into private.ideascape_admins (email)
values ('dashboard-admin@example.invalid');

insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description, status,
  threat_scenario, control_boundary, proof_required
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa90',
  '88888888-8888-4888-8888-888888888888',
  (select id from public.categories order by id limit 1),
  'private-admin-test-draft',
  'Private dashboard fixture',
  'A private draft used to prove the admin dashboard counts drafts without exposing their content.',
  'This draft must contribute to the private aggregate count but must never appear in the published idea activity rows returned by the admin dashboard.',
  'draft',
  'An unauthorized reader could infer private operational details from aggregate dashboard fixtures.',
  'The fixture remains owner-scoped and excluded from all published security brief activity.',
  'The test must prove only aggregate draft counts change and no private content is returned.'
);

insert into public.idea_interests (idea_id, profile_id, participation_intent)
values (
  '00000000-0000-4000-8000-000000000218',
  '99999999-9999-4999-8999-999999999999',
  'pilot'
);

insert into public.idea_validation_responses (question_id, option_id, profile_id)
values (
  '00000000-0000-4000-8000-000000000401',
  '00000000-0000-4000-8000-000000000411',
  '99999999-9999-4999-8999-999999999999'
);

insert into public.idea_pilot_applications (
  id, pilot_id, applicant_id, project_name, project_summary, primary_stack,
  authorization_basis, status, authorization_confirmed, safety_confirmed
)
values (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa91',
  '00000000-0000-4000-8000-000000000501',
  '99999999-9999-4999-8999-999999999999',
  'Admin dashboard fixture',
  'A deterministic authorized fixture used to verify aggregate-only application counts.',
  'TypeScript',
  'owner',
  'submitted',
  true,
  true
);

create temporary table expected_admin_summary as
select
  (select count(*) from public.profiles)::bigint as member_count,
  (select count(*) from public.ideas)::bigint as idea_count,
  (select count(*) from public.ideas where status = 'published')::bigint
    as published_idea_count,
  (select count(*) from public.ideas where status = 'draft')::bigint
    as draft_idea_count,
  (select count(*) from public.idea_interests)::bigint as interest_signal_count,
  (
    select count(*)
    from public.idea_interests
    where participation_intent in ('use', 'build', 'pilot', 'expertise')
  )::bigint as meaningful_signal_count,
  (select count(*) from public.idea_validation_responses)::bigint
    as validation_response_count,
  (select count(*) from public.idea_pilots)::bigint as pilot_count,
  (
    select count(*)
    from public.idea_pilot_applications
    where status in ('submitted', 'under_review', 'waitlisted')
  )::bigint as open_application_count,
  (
    select count(*)
    from public.idea_pilot_applications
    where status = 'accepted'
  )::bigint as accepted_application_count;

grant select on expected_admin_summary to authenticated;

set local role authenticated;
set local "request.jwt.claim.sub" = '99999999-9999-4999-8999-999999999999';
set local "request.jwt.claims" = '{"sub":"99999999-9999-4999-8999-999999999999","email":"ordinary@example.invalid","role":"authenticated","app_metadata":{}}';
select is(public.is_ideascape_admin(), false, 'ordinary authenticated members are not admins');
select is(
  (select count(*) from public.get_admin_dashboard_summary()),
  0::bigint,
  'ordinary authenticated members receive no dashboard summary row'
);
select is(
  (select count(*) from public.get_admin_idea_activity()),
  0::bigint,
  'ordinary authenticated members receive no published-idea activity rows'
);

set local "request.jwt.claim.sub" = '88888888-8888-4888-8888-888888888888';
set local "request.jwt.claims" = '{"sub":"88888888-8888-4888-8888-888888888888","email":"Dashboard-Admin@Example.Invalid","role":"authenticated","app_metadata":{}}';
select is(public.is_ideascape_admin(), true, 'allowlisted admin email matching is case-insensitive');
select ok(
  exists (
    select 1
    from public.get_admin_dashboard_summary() as summary
    cross join expected_admin_summary as expected
    where summary.member_count = expected.member_count
      and summary.idea_count = expected.idea_count
      and summary.published_idea_count = expected.published_idea_count
      and summary.draft_idea_count = expected.draft_idea_count
      and summary.interest_signal_count = expected.interest_signal_count
      and summary.meaningful_signal_count = expected.meaningful_signal_count
      and summary.validation_response_count = expected.validation_response_count
      and summary.pilot_count = expected.pilot_count
      and summary.open_application_count = expected.open_application_count
      and summary.accepted_application_count = expected.accepted_application_count
  ),
  'allowlisted admins receive exact aggregate operational counts'
);
select ok(
  exists (
    select 1
    from public.get_admin_idea_activity() as activity
    where activity.idea_id = '00000000-0000-4000-8000-000000000218'
      and activity.interest_signal_count = 1
      and activity.validation_response_count = 1
      and activity.pilot_application_count = 1
  )
  and not exists (
    select 1
    from public.get_admin_idea_activity() as activity
    where activity.idea_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa90'
  ),
  'admin activity aggregates published concepts while excluding private draft content'
);

set local "request.jwt.claim.sub" = 'aaaaaaaa-9999-4999-8999-999999999999';
set local "request.jwt.claims" = '{"sub":"aaaaaaaa-9999-4999-8999-999999999999","email":"operator@example.invalid","role":"authenticated","app_metadata":{"ideascape_role":"operator"}}';
select is(public.is_ideascape_admin(), true, 'trusted operators retain admin dashboard access');
reset role;

select * from finish();
rollback;
