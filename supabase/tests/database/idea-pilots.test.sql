begin;

select plan(56);

select has_type('public', 'idea_pilot_status', 'pilot lifecycle enum exists');
select enum_has_labels(
  'public',
  'idea_pilot_status',
  array['validating', 'recruiting', 'active', 'completed', 'paused', 'archived'],
  'pilot lifecycle labels are explicit'
);
select has_type('public', 'idea_pilot_decision', 'pilot decision enum exists');
select enum_has_labels(
  'public',
  'idea_pilot_decision',
  array['pending', 'continue', 'revise', 'pause', 'archive'],
  'pilot decision labels are explicit'
);
select has_table('public', 'idea_pilots', 'idea pilots table exists');
select columns_are(
  'public',
  'idea_pilots',
  array[
    'id',
    'idea_id',
    'slug',
    'title',
    'status',
    'decision',
    'evidence_window_days',
    'signal_goal',
    'continue_participant_threshold',
    'continue_project_threshold',
    'interview_goal',
    'archive_signal_ceiling',
    'project_capacity',
    'decision_rationale',
    'decided_at',
    'created_at',
    'updated_at'
  ],
  'idea pilots expose only the intended lifecycle and threshold columns'
);
select col_is_fk('public', 'idea_pilots', 'idea_id', 'pilot idea id references ideas');
select col_is_unique('public', 'idea_pilots', 'idea_id', 'one pilot configuration exists per idea');
select col_is_unique('public', 'idea_pilots', 'slug', 'pilot slugs are unique');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_pilots'::regclass),
  'idea pilots use row-level security'
);
select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'idea_pilots'
      and policyname = 'Published pilot plans are publicly readable'
      and cmd = 'SELECT'
  ),
  'published pilot plans have an explicit public read policy'
);
select is(
  (
    select row(slug, title, status::text, decision::text)::text
    from public.idea_pilots
    where id = '00000000-0000-4000-8000-000000000501'
      and idea_id = '00000000-0000-4000-8000-000000000218'
  ),
  row(
    'project-time-capsule',
    'Time Capsule Disclosure Bounty authorized test run',
    'validating',
    'pending'
  )::text,
  'Time Capsule Disclosure Bounty has one deterministic authorized test run plan'
);
select is(
  (
    select row(
      evidence_window_days,
      signal_goal,
      continue_participant_threshold,
      continue_project_threshold,
      interview_goal,
      archive_signal_ceiling,
      project_capacity
    )::text
    from public.idea_pilots
    where id = '00000000-0000-4000-8000-000000000501'
  ),
  row(30, 15, 5, 3, 5, 2, 3)::text,
  'pilot thresholds encode the public continue, revise, and archive criteria'
);

set local role anon;
select is(
  (select count(*) from public.idea_pilots where slug = 'project-time-capsule'),
  1::bigint,
  'anonymous visitors can read the published pilot plan'
);
select is(
  has_table_privilege('anon', 'public.idea_pilots', 'UPDATE'),
  false,
  'anonymous visitors cannot update pilot lifecycle decisions'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '33333333-3333-4333-8333-333333333333';
select is(
  (select count(*) from public.idea_pilots where slug = 'project-time-capsule'),
  1::bigint,
  'authenticated members can read the published pilot plan'
);
select is(
  has_table_privilege('authenticated', 'public.idea_pilots', 'UPDATE'),
  false,
  'ordinary members cannot update pilot lifecycle decisions'
);
reset role;

select has_type(
  'public',
  'pilot_authorization_basis',
  'pilot authorization basis enum exists'
);
select enum_has_labels(
  'public',
  'pilot_authorization_basis',
  array['owner', 'maintainer', 'written_authorization'],
  'authorization basis labels require a permission-first relationship'
);
select has_type(
  'public',
  'pilot_application_status',
  'pilot application status enum exists'
);
select enum_has_labels(
  'public',
  'pilot_application_status',
  array['submitted', 'under_review', 'accepted', 'waitlisted', 'declined', 'withdrawn'],
  'pilot application lifecycle labels are explicit'
);
select has_table(
  'public',
  'idea_pilot_applications',
  'private pilot applications table exists'
);
select columns_are(
  'public',
  'idea_pilot_applications',
  array[
    'id',
    'pilot_id',
    'applicant_id',
    'project_name',
    'project_summary',
    'repository_url',
    'primary_stack',
    'authorization_basis',
    'status',
    'authorization_confirmed',
    'safety_confirmed',
    'created_at',
    'updated_at'
  ],
  'pilot applications expose only the intended private intake fields'
);
select col_is_fk(
  'public',
  'idea_pilot_applications',
  'pilot_id',
  'applications reference one pilot'
);
select col_is_fk(
  'public',
  'idea_pilot_applications',
  'applicant_id',
  'applications reference one member profile'
);
select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.idea_pilot_applications'::regclass
      and conname = 'idea_pilot_applications_one_per_member'
      and contype = 'u'
  ),
  'each member can submit only one project per pilot'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.idea_pilot_applications'::regclass),
  'pilot applications use row-level security'
);
select has_function(
  'public',
  'is_ideascape_operator',
  array[]::text[],
  'operator authorization helper exists'
);

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '55555555-5555-4555-8555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'pilot-one@example.invalid',
    '',
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'pilot-two@example.invalid',
    '',
    timezone('utc', now()),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'operator@example.invalid',
    '',
    timezone('utc', now()),
    '{"provider":"email","providers":["email"],"ideascape_role":"operator"}'::jsonb,
    '{}'::jsonb,
    timezone('utc', now()),
    timezone('utc', now())
  )
on conflict (id) do nothing;

set local role anon;
select is(
  has_table_privilege('anon', 'public.idea_pilot_applications', 'SELECT'),
  false,
  'anonymous visitors cannot query private pilot applications'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
select throws_ok(
  $$
    insert into public.idea_pilot_applications (
      pilot_id,
      applicant_id,
      project_name,
      project_summary,
      repository_url,
      primary_stack,
      authorization_basis,
      authorization_confirmed,
      safety_confirmed
    )
    values (
      '00000000-0000-4000-8000-000000000501',
      '55555555-5555-4555-8555-555555555555',
      'Rebuildable field notebook',
      'An owner-maintained open-source notebook application that needs a verified clean-machine rebuild.',
      'https://example.com/member/notebook',
      'TypeScript and PostgreSQL',
      'maintainer',
      true,
      true
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_pilot_applications"',
  'validating pilots reject applications before intake opens'
);
reset role;

update public.idea_pilots
set status = 'recruiting'
where id = '00000000-0000-4000-8000-000000000501';

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
insert into public.idea_pilot_applications (
  id,
  pilot_id,
  applicant_id,
  project_name,
  project_summary,
  repository_url,
  primary_stack,
  authorization_basis,
  authorization_confirmed,
  safety_confirmed
)
values (
  '00000000-0000-4000-8000-000000000511',
  '00000000-0000-4000-8000-000000000501',
  '55555555-5555-4555-8555-555555555555',
  'Rebuildable field notebook',
  'An owner-maintained open-source notebook application that needs a verified clean-machine rebuild.',
  'https://example.com/member/notebook',
  'TypeScript and PostgreSQL',
  'maintainer',
  true,
  true
);
select is(
  (select count(*) from public.idea_pilot_applications),
  1::bigint,
  'a member can submit one authorized project while intake is recruiting'
);
select is(
  (
    select count(*)
    from public.idea_pilot_applications
    where applicant_id = auth.uid()
  ),
  1::bigint,
  'members can read their own pilot application'
);
select throws_ok(
  $$
    insert into public.idea_pilot_applications (
      pilot_id,
      applicant_id,
      project_name,
      project_summary,
      primary_stack,
      authorization_basis,
      authorization_confirmed,
      safety_confirmed
    )
    values (
      '00000000-0000-4000-8000-000000000501',
      '55555555-5555-4555-8555-555555555555',
      'Second project',
      'A second project should not create a duplicate application for this same member and pilot.',
      'Rust',
      'owner',
      true,
      true
    )
  $$,
  '23505',
  'duplicate key value violates unique constraint "idea_pilot_applications_one_per_member"',
  'one member cannot create duplicate pilot applications'
);
update public.idea_pilot_applications
set project_summary = 'An updated owner-maintained open-source notebook prepared for a clean-machine rebuild.'
where id = '00000000-0000-4000-8000-000000000511';
select is(
  (
    select project_summary
    from public.idea_pilot_applications
    where id = '00000000-0000-4000-8000-000000000511'
  ),
  'An updated owner-maintained open-source notebook prepared for a clean-machine rebuild.',
  'members can revise their own submitted application'
);
select throws_ok(
  $$
    update public.idea_pilot_applications
    set status = 'accepted'
    where id = '00000000-0000-4000-8000-000000000511'
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_pilot_applications"',
  'members cannot accept their own application'
);

set local "request.jwt.claim.sub" = '66666666-6666-4666-8666-666666666666';
select is(
  (select count(*) from public.idea_pilot_applications),
  0::bigint,
  'other members cannot read private applications'
);
update public.idea_pilot_applications
set project_name = 'Unauthorized edit'
where id = '00000000-0000-4000-8000-000000000511';
reset role;
select is(
  (
    select project_name
    from public.idea_pilot_applications
    where id = '00000000-0000-4000-8000-000000000511'
  ),
  'Rebuildable field notebook',
  'other members cannot update a private application'
);

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
set local "request.jwt.claims" = '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated","app_metadata":{}}';
select is(
  public.is_ideascape_operator(),
  false,
  'ordinary members do not receive operator access'
);

set local "request.jwt.claim.sub" = '77777777-7777-4777-8777-777777777777';
set local "request.jwt.claims" = '{"sub":"77777777-7777-4777-8777-777777777777","role":"authenticated","app_metadata":{"ideascape_role":"operator"}}';
select is(
  public.is_ideascape_operator(),
  true,
  'trusted app metadata grants operator access'
);
select is(
  (select count(*) from public.idea_pilot_applications),
  1::bigint,
  'operators can read submitted applications without a public data leak'
);
update public.idea_pilot_applications
set status = 'accepted'
where id = '00000000-0000-4000-8000-000000000511';
reset role;
select is(
  (
    select status::text
    from public.idea_pilot_applications
    where id = '00000000-0000-4000-8000-000000000511'
  ),
  'accepted',
  'operators can accept a qualified application'
);

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
set local "request.jwt.claims" = '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated","app_metadata":{}}';
update public.idea_pilot_applications
set project_name = 'Edit after acceptance'
where id = '00000000-0000-4000-8000-000000000511';
reset role;
select is(
  (
    select project_name
    from public.idea_pilot_applications
    where id = '00000000-0000-4000-8000-000000000511'
  ),
  'Rebuildable field notebook',
  'accepted applications are locked against member edits'
);

set local role authenticated;
set local "request.jwt.claim.sub" = '66666666-6666-4666-8666-666666666666';
set local "request.jwt.claims" = '{"sub":"66666666-6666-4666-8666-666666666666","role":"authenticated","app_metadata":{}}';
select throws_ok(
  $$
    insert into public.idea_pilot_applications (
      pilot_id,
      applicant_id,
      project_name,
      project_summary,
      primary_stack,
      authorization_basis,
      authorization_confirmed,
      safety_confirmed
    )
    values (
      '00000000-0000-4000-8000-000000000501',
      '66666666-6666-4666-8666-666666666666',
      'Unconfirmed project',
      'A project that intentionally omits the required safety confirmation for contract testing.',
      'Python',
      'owner',
      true,
      false
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "idea_pilot_applications"',
  'applications require both authorization and safety confirmations'
);
select throws_ok(
  $$
    insert into public.idea_pilot_applications (
      pilot_id,
      applicant_id,
      project_name,
      project_summary,
      repository_url,
      primary_stack,
      authorization_basis,
      authorization_confirmed,
      safety_confirmed
    )
    values (
      '00000000-0000-4000-8000-000000000501',
      '66666666-6666-4666-8666-666666666666',
      'Unsafe link project',
      'A project that intentionally supplies an unsafe repository protocol for contract testing.',
      'javascript:alert(1)',
      'Python',
      'owner',
      true,
      true
    )
  $$,
  '23514',
  'new row for relation "idea_pilot_applications" violates check constraint "idea_pilot_applications_repository_url"',
  'applications reject unsafe repository URL schemes'
);
insert into public.idea_pilot_applications (
  id,
  pilot_id,
  applicant_id,
  project_name,
  project_summary,
  primary_stack,
  authorization_basis,
  authorization_confirmed,
  safety_confirmed
)
values (
  '00000000-0000-4000-8000-000000000512',
  '00000000-0000-4000-8000-000000000501',
  '66666666-6666-4666-8666-666666666666',
  'Community archive tool',
  'An authorized community application prepared without secrets or private production data.',
  'Python and SQLite',
  'written_authorization',
  true,
  true
);
select is(
  (select status::text from public.idea_pilot_applications where id = '00000000-0000-4000-8000-000000000512'),
  'submitted',
  'a second member can submit one qualified project'
);
update public.idea_pilot_applications
set status = 'withdrawn'
where id = '00000000-0000-4000-8000-000000000512';
select is(
  (select status::text from public.idea_pilot_applications where id = '00000000-0000-4000-8000-000000000512'),
  'withdrawn',
  'members can withdraw their own submitted application'
);
select is(
  (select count(*) from public.idea_pilot_applications where applicant_id = auth.uid()),
  1::bigint,
  'withdrawn applications remain privately visible to their owner'
);
reset role;

select has_function(
  'public',
  'get_pilot_readiness_summary',
  array['uuid'],
  'private pilot readiness summary function exists'
);
select is(
  has_function_privilege('anon', 'public.get_pilot_readiness_summary(uuid)', 'EXECUTE'),
  false,
  'anonymous visitors cannot execute the private readiness summary'
);
select is(
  has_function_privilege('authenticated', 'public.get_pilot_readiness_summary(uuid)', 'EXECUTE'),
  true,
  'authenticated reviewers can request an authorization-scoped readiness summary'
);

insert into public.idea_interests (idea_id, profile_id, participation_intent)
values
  ('00000000-0000-4000-8000-000000000218', '55555555-5555-4555-8555-555555555555', 'pilot'),
  ('00000000-0000-4000-8000-000000000218', '66666666-6666-4666-8666-666666666666', 'expertise');

insert into public.idea_validation_responses (question_id, option_id, profile_id)
values
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000411', '55555555-5555-4555-8555-555555555555'),
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000415', '66666666-6666-4666-8666-666666666666');

set local role authenticated;
set local "request.jwt.claim.sub" = '55555555-5555-4555-8555-555555555555';
set local "request.jwt.claims" = '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated","app_metadata":{}}';
select is(
  (select count(*) from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')),
  0::bigint,
  'ordinary members cannot read creator readiness evidence'
);

set local "request.jwt.claim.sub" = '00000000-0000-4000-8000-000000000101';
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated","app_metadata":{}}';
select is(
  (
    select row(
      meaningful_signal_count,
      participant_response_count,
      project_response_count,
      active_application_count,
      accepted_application_count,
      remaining_capacity,
      recommendation
    )::text
    from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')
  ),
  row(2, 2, 1, 1, 1, 2, 'pending')::text,
  'the creator receives aggregate progress without applicant identities'
);

set local "request.jwt.claim.sub" = '77777777-7777-4777-8777-777777777777';
set local "request.jwt.claims" = '{"sub":"77777777-7777-4777-8777-777777777777","role":"authenticated","app_metadata":{"ideascape_role":"operator"}}';
select is(
  (select count(*) from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')),
  1::bigint,
  'trusted operators can review the aggregate dashboard'
);
reset role;

update public.idea_pilots
set created_at = timezone('utc', now()) - interval '31 days'
where id = '00000000-0000-4000-8000-000000000501';

set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-4000-8000-000000000101';
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated","app_metadata":{}}';
select is(
  (select recommendation from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')),
  'archive',
  'expired evidence at the signal ceiling recommends archive'
);
reset role;

insert into public.idea_interests (idea_id, profile_id, participation_intent)
values ('00000000-0000-4000-8000-000000000218', '77777777-7777-4777-8777-777777777777', 'build');
insert into public.idea_validation_responses (question_id, option_id, profile_id)
values ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000412', '77777777-7777-4777-8777-777777777777');

set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-4000-8000-000000000101';
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated","app_metadata":{}}';
select is(
  (select recommendation from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')),
  'revise',
  'expired evidence above the archive ceiling but below continue thresholds recommends revision'
);
reset role;

update public.idea_pilots
set continue_participant_threshold = 3, continue_project_threshold = 2
where id = '00000000-0000-4000-8000-000000000501';

set local role authenticated;
set local "request.jwt.claim.sub" = '00000000-0000-4000-8000-000000000101';
set local "request.jwt.claims" = '{"sub":"00000000-0000-4000-8000-000000000101","role":"authenticated","app_metadata":{}}';
select is(
  (select recommendation from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')),
  'continue',
  'meeting the participant and project thresholds recommends a capped pilot'
);
reset role;

select * from finish();
rollback;
