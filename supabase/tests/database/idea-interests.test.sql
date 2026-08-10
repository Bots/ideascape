begin;

select plan(26);

select has_table('public', 'idea_interests', 'idea interests table exists');
select has_type(
  'public',
  'idea_participation_intent',
  'participation intent enum exists'
);
select columns_are(
  'public',
  'idea_interests',
  array['idea_id', 'profile_id', 'participation_intent', 'created_at'],
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
select has_function(
  'public',
  'get_idea_interest_counts',
  array['uuid[]'],
  'public batch interest count function exists'
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
values
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '33333333-3333-4333-8333-333333333333',
    (select id from public.categories where slug = 'community'),
    'interest-signal-fixture',
    'Interest Signal Fixture',
    'A published idea used to test interest signals.',
    'This deterministic fixture proves public counts and private member signals.',
    'published',
    now()
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '33333333-3333-4333-8333-333333333333',
    (select id from public.categories where slug = 'community'),
    'private-interest-signal-fixture',
    'Private Interest Signal Fixture',
    'A draft idea whose aggregate must remain private.',
    'This deterministic fixture proves draft counts are not exposed.',
    'draft',
    null
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
insert into public.idea_interests (idea_id, profile_id, participation_intent)
values (
  'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  '33333333-3333-4333-8333-333333333333',
  'pilot'
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
select is(
  (
    select viewer_participation_intent
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  'pilot'::text,
  'the summary returns the current member participation intent privately'
);
update public.idea_interests
set participation_intent = 'build'
where idea_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  and profile_id = '33333333-3333-4333-8333-333333333333';
select is(
  (
    select participation_intent::text
    from public.idea_interests
    where idea_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  ),
  'build'::text,
  'members can update their own participation intent'
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
select is(
  (
    select viewer_participation_intent
    from public.get_idea_interest_summary('cccccccc-cccc-4ccc-8ccc-cccccccccccc')
  ),
  null::text,
  'other visitors never receive someone else participation intent'
);
update public.idea_interests
set participation_intent = 'updates'
where idea_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  and profile_id = '33333333-3333-4333-8333-333333333333';
select is(
  (
    select count(*)
    from public.get_idea_interest_counts(
      array[
        'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        '00000000-0000-4000-8000-000000000202'
      ]::uuid[]
    )
  ),
  2::bigint,
  'batch counts return one row per requested published idea'
);
select is(
  (
    select interest_count
    from public.get_idea_interest_counts(
      array['cccccccc-cccc-4ccc-8ccc-cccccccccccc']::uuid[]
    )
  ),
  1::bigint,
  'batch counts include aggregate interest without exposing member rows'
);
select is(
  (
    select interest_count
    from public.get_idea_interest_counts(
      array['00000000-0000-4000-8000-000000000202']::uuid[]
    )
  ),
  0::bigint,
  'batch counts include published ideas with no interest'
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
select is(
  (
    select participation_intent::text
    from public.idea_interests
    where idea_id = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
  ),
  'build'::text,
  'members cannot change another member participation intent'
);
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
