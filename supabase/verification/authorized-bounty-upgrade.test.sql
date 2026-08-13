\set ON_ERROR_STOP on
begin;

-- Simulate mutable data and drift that may exist immediately before upgrade.
insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description,
  threat_scenario, control_boundary, proof_required, created_at, updated_at
)
values (
  '88888888-8888-4888-8888-888888888811',
  '00000000-0000-4000-8000-000000000101',
  (select id from public.categories where slug = 'technology'),
  'private-upgrade-fixture',
  'Private creator draft',
  'A private creator-owned draft that is outside the deterministic seed manifest.',
  'This private creator copy must remain unchanged when the deterministic catalog is recast.',
  'A detailed private threat scenario remains attached to this private creator draft.',
  'A detailed private control boundary remains attached to this private creator draft.',
  'A detailed private proof requirement remains attached to this private creator draft.',
  '2025-01-02 03:04:05+00',
  '2025-01-02 03:04:05+00'
);

insert into public.idea_media (id, idea_id, kind, url, alt_text, sort_order)
values (
  '88888888-8888-4888-8888-888888888812',
  '88888888-8888-4888-8888-888888888811',
  'image',
  'https://example.invalid/private-upgrade-fixture.png',
  'A detailed private creator image description that must remain unchanged.',
  0
);

update public.idea_validation_questions
set status = 'closed'
where id = '00000000-0000-4000-8000-000000000601';

insert into public.idea_validation_questions (
  id, idea_id, prompt, status, created_at, updated_at
)
values (
  '88888888-8888-4888-8888-888888888813',
  '00000000-0000-4000-8000-000000000218',
  'Unexpected active historical question that must be preserved but closed?',
  'active',
  '2025-01-02 03:04:05+00',
  '2025-01-02 03:04:05+00'
);

update public.ideas
set title = 'Project Time Capsule'
where id = '00000000-0000-4000-8000-000000000218';

update public.idea_pilots
set title = 'Project Time Capsule pilot'
where id = '00000000-0000-4000-8000-000000000501';

update public.idea_validation_options
set value = 'ready-in-range'
where id = '00000000-0000-4000-8000-000000000611';

insert into public.idea_validation_responses (question_id, option_id, profile_id)
values
  (
    '00000000-0000-4000-8000-000000000401',
    '00000000-0000-4000-8000-000000000411',
    '00000000-0000-4000-8000-000000000101'
  ),
  (
    '00000000-0000-4000-8000-000000000601',
    '00000000-0000-4000-8000-000000000611',
    '00000000-0000-4000-8000-000000000101'
  );

create temporary table bounty_upgrade_fixture_before as
select
  ideas.updated_at,
  media.alt_text
from public.ideas as ideas
join public.idea_media as media on media.idea_id = ideas.id
where ideas.id = '88888888-8888-4888-8888-888888888811'
  and media.id = '88888888-8888-4888-8888-888888888812';

\ir ../migrations/20260811193000_recast_as_authorized_bounty_network.sql
\ir ../migrations/20260811193000_recast_as_authorized_bounty_network.sql
\ir ../migrations/20260813203034_fix_pilot_readiness_generation_counts.sql
\ir ../migrations/20260813203034_fix_pilot_readiness_generation_counts.sql

do $$
begin
  if (
    select concat_ws(' | ', title, summary, description)
    from public.ideas
    where id = '88888888-8888-4888-8888-888888888811'
  ) is distinct from 'Private creator draft | A private creator-owned draft that is outside the deterministic seed manifest. | This private creator copy must remain unchanged when the deterministic catalog is recast.' then
    raise exception 'authorized bounty migration changed non-seed private copy';
  end if;

  if (
    select ideas.updated_at
    from public.ideas as ideas
    where ideas.id = '88888888-8888-4888-8888-888888888811'
  ) is distinct from (select updated_at from bounty_upgrade_fixture_before) then
    raise exception 'authorized bounty migration changed non-seed private timestamp';
  end if;

  if (
    select alt_text
    from public.idea_media
    where id = '88888888-8888-4888-8888-888888888812'
  ) is distinct from (select alt_text from bounty_upgrade_fixture_before) then
    raise exception 'authorized bounty migration changed non-seed private media copy';
  end if;

  if (
    select title
    from public.ideas
    where id = '00000000-0000-4000-8000-000000000218'
  ) is distinct from 'Time Capsule Disclosure Bounty' then
    raise exception 'authorized bounty migration did not recast the deterministic title';
  end if;

  if (
    select display_name
    from public.profiles
    where id = '00000000-0000-4000-8000-000000000101'
  ) is distinct from 'IdeaScape Team' then
    raise exception 'authorized bounty migration did not normalize the deterministic system-owner brand';
  end if;

  if (
    select title
    from public.idea_pilots
    where id = '00000000-0000-4000-8000-000000000501'
  ) is distinct from 'Time Capsule Disclosure Bounty authorized test run' then
    raise exception 'authorized bounty migration did not recast the test-run title';
  end if;

  if (
    select value
    from public.idea_validation_options
    where id = '00000000-0000-4000-8000-000000000611'
  ) is distinct from 'ready-for-authorized-test' then
    raise exception 'authorized bounty migration did not reconcile the readiness value';
  end if;

  if (
    select status
    from public.idea_validation_questions
    where id = '88888888-8888-4888-8888-888888888813'
  ) is distinct from 'closed'::public.validation_question_status then
    raise exception 'authorized bounty migration left an unexpected historical question active';
  end if;

  if (
    select count(*)
    from public.idea_validation_questions
    where idea_id = '00000000-0000-4000-8000-000000000218'
      and status = 'active'
  ) <> 1 then
    raise exception 'authorized bounty migration did not leave exactly one active readiness question';
  end if;

  if (
    select count(*)
    from public.get_idea_validation_summary('00000000-0000-4000-8000-000000000218')
  ) <> 0 then
    raise exception 'unauthenticated validation summary unexpectedly returned rows';
  end if;

  perform set_config(
    'request.jwt.claim.sub',
    '00000000-0000-4000-8000-000000000101',
    true
  );

  if (
    select row(participant_response_count, project_response_count)::text
    from public.get_pilot_readiness_summary('00000000-0000-4000-8000-000000000501')
  ) is distinct from row(1::bigint, 1::bigint)::text then
    raise exception 'authorized bounty migration mixed historical and active pilot-readiness responses';
  end if;
end
$$;

rollback;
