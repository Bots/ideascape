begin;

select plan(40);

select has_type('public', 'validation_question_status', 'validation question status enum exists');
select enum_has_labels(
  'public',
  'validation_question_status',
  array['active', 'closed'],
  'validation question states are explicit'
);
select has_table('public', 'idea_validation_questions', 'validation questions table exists');
select columns_are(
  'public',
  'idea_validation_questions',
  array['id', 'idea_id', 'prompt', 'status', 'created_at', 'updated_at'],
  'validation questions expose the expected columns'
);
select has_table('public', 'idea_validation_options', 'validation options table exists');
select columns_are(
  'public',
  'idea_validation_options',
  array['id', 'question_id', 'value', 'label', 'sort_order', 'created_at'],
  'validation options expose the expected columns'
);
select has_table('public', 'idea_validation_responses', 'validation responses table exists');
select columns_are(
  'public',
  'idea_validation_responses',
  array['question_id', 'option_id', 'profile_id', 'created_at', 'updated_at'],
  'validation responses expose the expected columns'
);
select col_is_fk('public', 'idea_validation_questions', 'idea_id', 'questions reference ideas');
select col_is_fk('public', 'idea_validation_options', 'question_id', 'options reference questions');
select col_is_fk('public', 'idea_validation_responses', 'question_id', 'responses reference questions');
select col_is_fk('public', 'idea_validation_responses', 'profile_id', 'responses reference profiles');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_validation_questions'::regclass),
  'validation questions use row-level security'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_validation_options'::regclass),
  'validation options use row-level security'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_validation_responses'::regclass),
  'validation responses use row-level security'
);
select has_function(
  'public',
  'get_idea_validation_question',
  array['uuid'],
  'viewer-scoped validation question function exists'
);
select has_function(
  'public',
  'get_idea_validation_summary',
  array['uuid'],
  'creator-only validation summary function exists'
);
select is(
  has_function_privilege(
    'anon',
    'public.get_idea_validation_summary(uuid)',
    'execute'
  ),
  false,
  'anonymous visitors cannot execute the creator validation summary'
);
select is(
  (
    select prompt
    from public.idea_validation_questions
    where id = '00000000-0000-4000-8000-000000000601'
      and idea_id = '00000000-0000-4000-8000-000000000218'
      and status = 'active'
  ),
  'Is the Time Capsule Disclosure Bounty ready for an authorized test run?',
  'Time Capsule Disclosure has one deterministic active readiness question'
);
select is(
  (
    select array_agg(value order by sort_order)
    from public.idea_validation_options
    where question_id = '00000000-0000-4000-8000-000000000601'
  ),
  array[
    'ready-for-authorized-test',
    'tighten-scope',
    'proof-not-ready',
    'close-bounty'
  ],
  'the readiness question has four deterministic decision options'
);

select results_eq(
  $$
    select id, idea_id, prompt, status::text
    from public.idea_validation_questions
    where id in (
      '00000000-0000-4000-8000-000000000602',
      '00000000-0000-4000-8000-000000000603',
      '00000000-0000-4000-8000-000000000604',
      '00000000-0000-4000-8000-000000000605',
      '00000000-0000-4000-8000-000000000606'
    )
    order by id
  $$,
  $$
    values
      (
        '00000000-0000-4000-8000-000000000602'::uuid,
        '00000000-0000-4000-8000-000000000203'::uuid,
        'Is the Trip Relay Metadata Bounty ready for an authorized test run?'::text,
        'active'::text
      ),
      (
        '00000000-0000-4000-8000-000000000603'::uuid,
        '00000000-0000-4000-8000-000000000206'::uuid,
        'Is the Repair Playbook Injection Bounty ready for an authorized test run?'::text,
        'active'::text
      ),
      (
        '00000000-0000-4000-8000-000000000604'::uuid,
        '00000000-0000-4000-8000-000000000204'::uuid,
        'Is the Night Install Tamper Bounty ready for an authorized test run?'::text,
        'active'::text
      ),
      (
        '00000000-0000-4000-8000-000000000605'::uuid,
        '00000000-0000-4000-8000-000000000208'::uuid,
        'Is the Outage Kit Supply-Chain Bounty ready for an authorized test run?'::text,
        'active'::text
      ),
      (
        '00000000-0000-4000-8000-000000000606'::uuid,
        '00000000-0000-4000-8000-000000000201'::uuid,
        'Is the Smoke Sensor Spoofing Bounty ready for an authorized test run?'::text,
        'active'::text
      )
  $$,
  'five bounded bounties have deterministic active readiness questions'
);

select is(
  (
    select count(*)
    from (
      select question_id
      from public.idea_validation_options
      where question_id in (
        '00000000-0000-4000-8000-000000000602',
        '00000000-0000-4000-8000-000000000603',
        '00000000-0000-4000-8000-000000000604',
        '00000000-0000-4000-8000-000000000605',
        '00000000-0000-4000-8000-000000000606'
      )
      group by question_id
      having count(*) = 4
        and min(sort_order) = 0
        and max(sort_order) = 3
    ) as complete_questions
  ),
  5::bigint,
  'each new readiness question has four deterministic ordered options'
);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  (
    '55555555-5555-4555-8555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'pilot-member@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Pilot Member"}'::jsonb, now(), now()
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'other-pilot-member@example.com', '', now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Other Pilot Member"}'::jsonb, now(), now()
  );

set local role anon;
select is(
  (
    select count(*)
    from public.get_idea_validation_question('00000000-0000-4000-8000-000000000218')
  ),
  4::bigint,
  'anonymous visitors can read every active readiness-question option'
);
select is(
  (
    select count(*)
    from (
      values
        ('00000000-0000-4000-8000-000000000203'::uuid),
        ('00000000-0000-4000-8000-000000000206'::uuid),
        ('00000000-0000-4000-8000-000000000204'::uuid),
        ('00000000-0000-4000-8000-000000000208'::uuid),
        ('00000000-0000-4000-8000-000000000201'::uuid)
    ) as target_ideas(idea_id)
    cross join lateral public.get_idea_validation_question(target_ideas.idea_id) as question
    where question.viewer_option_id is null
  ),
  20::bigint,
  'anonymous visitors can read every new option without receiving a private choice'
);
select is(
  (
    select count(*)
    from public.get_idea_validation_question('00000000-0000-4000-8000-000000000218')
    where viewer_option_id is not null
  ),
  0::bigint,
  'anonymous visitors never receive a private response choice'
);
select is(
  (
    select count(*)
    from public.idea_validation_questions
    where id = '00000000-0000-4000-8000-000000000601'
  ),
  1::bigint,
  'anonymous visitors can read the active public question'
);
select throws_ok(
  $$ select count(*) from public.idea_validation_responses $$,
  '42501',
  'permission denied for table idea_validation_responses',
  'anonymous visitors cannot read raw validation responses'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
insert into public.idea_validation_responses (question_id, option_id, profile_id)
values (
  '00000000-0000-4000-8000-000000000601',
  '00000000-0000-4000-8000-000000000611',
  '55555555-5555-4555-8555-555555555555'
);
select is(
  (select count(*) from public.idea_validation_responses),
  1::bigint,
  'members can answer an active pilot question for themselves'
);
select is(
  (
    select distinct viewer_option_id
    from public.get_idea_validation_question('00000000-0000-4000-8000-000000000218')
  ),
  '00000000-0000-4000-8000-000000000611'::uuid,
  'the question function returns only the current member choice'
);
update public.idea_validation_responses
set option_id = '00000000-0000-4000-8000-000000000614'
where question_id = '00000000-0000-4000-8000-000000000601'
  and profile_id = '55555555-5555-4555-8555-555555555555';
select is(
  (select count(*) from public.idea_validation_responses),
  1::bigint,
  'changing an answer keeps one response per member and question'
);
select is(
  (
    select option_id
    from public.idea_validation_responses
    where question_id = '00000000-0000-4000-8000-000000000601'
  ),
  '00000000-0000-4000-8000-000000000614'::uuid,
  'members can change their own pilot answer'
);

set local "request.jwt.claim.sub" = '66666666-6666-4666-8666-666666666666';
select is(
  (select count(*) from public.idea_validation_responses),
  0::bigint,
  'members cannot read another member validation response'
);
select is(
  (
    select count(*)
    from public.get_idea_validation_question('00000000-0000-4000-8000-000000000218')
    where viewer_option_id is not null
  ),
  0::bigint,
  'other members never receive someone else pilot choice'
);
update public.idea_validation_responses
set option_id = '00000000-0000-4000-8000-000000000612'
where question_id = '00000000-0000-4000-8000-000000000601'
  and profile_id = '55555555-5555-4555-8555-555555555555';
reset role;
select is(
  (
    select option_id
    from public.idea_validation_responses
    where question_id = '00000000-0000-4000-8000-000000000601'
      and profile_id = '55555555-5555-4555-8555-555555555555'
  ),
  '00000000-0000-4000-8000-000000000614'::uuid,
  'members cannot change another member pilot choice'
);

set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-4000-8000-000000000101';
select is(
  (
    select count(*)
    from public.get_idea_validation_summary('00000000-0000-4000-8000-000000000218')
  ),
  4::bigint,
  'the system owner receives only the current readiness options'
);
select is(
  (
    select sum(response_count)
    from public.get_idea_validation_summary('00000000-0000-4000-8000-000000000218')
  ),
  1::numeric,
  'the creator summary reports aggregate responses without member identities'
);

set local "request.jwt.claim.sub" = '66666666-6666-4666-8666-666666666666';
select is(
  (
    select count(*)
    from public.get_idea_validation_summary('00000000-0000-4000-8000-000000000218')
  ),
  0::bigint,
  'non-creators cannot read private pilot evidence'
);
select throws_ok(
  $$
    insert into public.idea_validation_responses (question_id, option_id, profile_id)
    values (
      '00000000-0000-4000-8000-000000000601',
      '00000000-0000-4000-8000-000000000611',
      '55555555-5555-4555-8555-555555555555'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_validation_responses"',
  'members cannot answer a pilot question for another profile'
);

set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
delete from public.idea_validation_responses
where question_id = '00000000-0000-4000-8000-000000000601'
  and profile_id = '55555555-5555-4555-8555-555555555555';
select is(
  (select count(*) from public.idea_validation_responses),
  0::bigint,
  'members can remove their own pilot answer'
);
reset role;

update public.idea_validation_questions
set status = 'closed'
where id = '00000000-0000-4000-8000-000000000601';
set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
select throws_ok(
  $$
    insert into public.idea_validation_responses (question_id, option_id, profile_id)
    values (
      '00000000-0000-4000-8000-000000000601',
      '00000000-0000-4000-8000-000000000611',
      '55555555-5555-4555-8555-555555555555'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_validation_responses"',
  'closed validation questions reject new responses'
);
reset role;

select * from finish();
rollback;
