begin;

select plan(17);

select has_table('public', 'idea_interests', 'idea interests table exists');
select columns_are(
  'public',
  'idea_interests',
  array['idea_id', 'profile_id', 'created_at'],
  'idea interests expose the expected columns'
);
select col_is_fk(
  'public',
  'idea_interests',
  'idea_id',
  'idea interests reference ideas'
);
select col_is_fk(
  'public',
  'idea_interests',
  'profile_id',
  'idea interests reference profiles'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_interests'::regclass),
  'idea interests use row-level security'
);
select has_function(
  'public',
  'get_idea_interest_summary',
  array['uuid'],
  'public interest summary function exists'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '33333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'interested@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Interested Member"}'::jsonb, now(), now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'other-interest@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Other Interested Member"}'::jsonb, now(), now()
  );

insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description, status, published_at
)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '33333333-3333-4333-8333-333333333333',
  (select id from public.categories where slug = 'community'),
  'interest-signal-fixture',
  'Interest Signal Fixture',
  'A published idea used to test interest signals.',
  'This deterministic fixture proves public counts and private member signals.',
  'published',
  now()
);

set local role anon;
select is(
  (
    select interest_count
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  0::bigint,
  'anonymous visitors can read the public interest count'
);
select is(
  (
    select viewer_has_interest
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  false,
  'anonymous visitors never receive a private interest signal'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '33333333-3333-4333-8333-333333333333';
insert into public.idea_interests (idea_id, profile_id)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '33333333-3333-4333-8333-333333333333'
);
select is(
  (select count(*) from public.idea_interests),
  1::bigint,
  'members can signal their own interest'
);
select is(
  (
    select interest_count
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  1::bigint,
  'the public summary counts member interest'
);
select is(
  (
    select viewer_has_interest
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  true,
  'the summary identifies the current member interest privately'
);

set local "request.jwt.claim.sub" = '44444444-4444-4444-8444-444444444444';
select is(
  (select count(*) from public.idea_interests),
  0::bigint,
  'members cannot read another member interest row'
);
select is(
  (
    select interest_count
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  1::bigint,
  'other visitors still see the aggregate interest count'
);
select is(
  (
    select viewer_has_interest
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  false,
  'other visitors do not inherit someone else interest state'
);
select throws_ok(
  $$
    insert into public.idea_interests (idea_id, profile_id)
    values (
      'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
      '33333333-3333-4333-8333-333333333333'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_interests"',
  'members cannot signal interest for someone else'
);

set local "request.jwt.claim.sub" = '33333333-3333-4333-8333-333333333333';
delete from public.idea_interests
where idea_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  and profile_id = '33333333-3333-4333-8333-333333333333';
select is(
  (select count(*) from public.idea_interests),
  0::bigint,
  'members can remove their own interest'
);
reset role;

set local role anon;
select is(
  (
    select interest_count
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  0::bigint,
  'the aggregate count updates after interest is removed'
);
reset role;

select * from finish();
rollback;
