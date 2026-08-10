begin;

select plan(14);

select has_column(
  'public',
  'ideas',
  'threat_scenario',
  'ideas expose an explicit threat scenario'
);
select has_column(
  'public',
  'ideas',
  'control_boundary',
  'ideas expose an explicit control boundary'
);
select has_column(
  'public',
  'ideas',
  'proof_required',
  'ideas expose the proof required before expansion'
);

select col_type_is(
  'public',
  'ideas',
  'threat_scenario',
  'text',
  'threat scenarios are stored as text'
);
select col_type_is(
  'public',
  'ideas',
  'control_boundary',
  'text',
  'control boundaries are stored as text'
);
select col_type_is(
  'public',
  'ideas',
  'proof_required',
  'text',
  'proof requirements are stored as text'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'ideas_threat_scenario_length'
      and conrelid = 'public.ideas'::regclass
  ),
  'threat scenarios have a database-enforced length boundary'
);
select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'ideas_control_boundary_length'
      and conrelid = 'public.ideas'::regclass
  ),
  'control boundaries have a database-enforced length boundary'
);
select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conname = 'ideas_proof_required_length'
      and conrelid = 'public.ideas'::regclass
  ),
  'proof requirements have a database-enforced length boundary'
);

select is(
  (
    select count(*)
    from public.ideas
    where creator_id = '00000000-0000-4000-8000-000000000101'
      and status = 'published'
      and threat_scenario is not null
      and control_boundary is not null
      and proof_required is not null
      and char_length(threat_scenario) between 40 and 500
      and char_length(control_boundary) between 40 and 500
      and char_length(proof_required) between 40 and 500
      and threat_scenario not like '%' || chr(10) || '%'
      and control_boundary not like '%' || chr(10) || '%'
      and proof_required not like '%' || chr(10) || '%'
  ),
  21::bigint,
  'all 21 demo concepts carry concise, complete security cases'
);

select is(
  (
    select count(distinct threat_scenario)
    from public.ideas
    where creator_id = '00000000-0000-4000-8000-000000000101'
      and status = 'published'
  ),
  21::bigint,
  'every demo has a concept-specific threat scenario'
);
select is(
  (
    select count(distinct control_boundary)
    from public.ideas
    where creator_id = '00000000-0000-4000-8000-000000000101'
      and status = 'published'
  ),
  21::bigint,
  'every demo has a concept-specific control boundary'
);
select is(
  (
    select count(distinct proof_required)
    from public.ideas
    where creator_id = '00000000-0000-4000-8000-000000000101'
      and status = 'published'
  ),
  21::bigint,
  'every demo has concept-specific proof requirements'
);

set local role anon;
select is(
  (
    select count(*)
    from public.ideas
    where creator_id = '00000000-0000-4000-8000-000000000101'
      and status = 'published'
      and threat_scenario is not null
      and control_boundary is not null
      and proof_required is not null
  ),
  21::bigint,
  'anonymous visitors can inspect every demo security case'
);
reset role;

select * from finish();
rollback;
