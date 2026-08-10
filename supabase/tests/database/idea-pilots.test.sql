begin;

select plan(17);

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
    'Project Time Capsule pilot',
    'validating',
    'pending'
  )::text,
  'Project Time Capsule has one deterministic validating pilot plan'
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

select * from finish();
rollback;
