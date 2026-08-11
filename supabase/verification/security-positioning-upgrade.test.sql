\set ON_ERROR_STOP on
begin;

insert into public.ideas (
  id, creator_id, category_id, slug, title, summary, description,
  threat_scenario, control_boundary, proof_required, created_at, updated_at
)
values (
  '88888888-8888-4888-8888-888888888801',
  '00000000-0000-4000-8000-000000000101',
  (select id from public.categories where slug = 'technology'),
  'canonical-owner-private-draft',
  'Private Community Workshop',
  'A private draft about neighbors and community activity.',
  'This private canonical-owner draft must retain its exact user-authored wording.',
  'A sufficiently detailed private threat scenario remains attached to this private draft.',
  'A sufficiently detailed private control boundary remains attached to this private draft.',
  'A sufficiently detailed private proof requirement remains attached to this private draft.',
  '2025-01-02 03:04:05+00',
  '2025-01-02 03:04:05+00'
);

insert into public.idea_media (id, idea_id, kind, url, alt_text, sort_order)
values (
  '88888888-8888-4888-8888-888888888802',
  '88888888-8888-4888-8888-888888888801',
  'image',
  'https://example.invalid/private-community-workshop.png',
  'Neighbors at a private community workshop',
  0
);

insert into public.idea_validation_questions (id, idea_id, prompt)
values (
  '88888888-8888-4888-8888-888888888803',
  '88888888-8888-4888-8888-888888888801',
  'Which private community workshop format should the author evaluate?'
);

insert into public.idea_validation_options (id, question_id, value, label, sort_order)
values (
  '88888888-8888-4888-8888-888888888804',
  '88888888-8888-4888-8888-888888888803',
  'neighbor-session',
  'A neighbor-led community session',
  0
);

create temporary table private_positioning_fixture_before as
select updated_at
from public.ideas
where id = '88888888-8888-4888-8888-888888888801';

\ir ../migrations/20260811174500_reframe_as_security_validation_lab.sql

do $$
begin
  if (
    select concat_ws(' | ', title, summary, description)
    from public.ideas
    where id = '88888888-8888-4888-8888-888888888801'
  ) is distinct from 'Private Community Workshop | A private draft about neighbors and community activity. | This private canonical-owner draft must retain its exact user-authored wording.' then
    raise exception 'positioning migration changed non-seed private brief copy';
  end if;

  if (
    select ideas.updated_at
    from public.ideas as ideas
    where ideas.id = '88888888-8888-4888-8888-888888888801'
  ) is distinct from (select updated_at from private_positioning_fixture_before) then
    raise exception 'positioning migration changed a non-seed private brief timestamp';
  end if;

  if (
    select alt_text
    from public.idea_media
    where id = '88888888-8888-4888-8888-888888888802'
  ) is distinct from 'Neighbors at a private community workshop' then
    raise exception 'positioning migration changed non-seed private media copy';
  end if;

  if (
    select label
    from public.idea_validation_options
    where id = '88888888-8888-4888-8888-888888888804'
  ) is distinct from 'A neighbor-led community session' then
    raise exception 'positioning migration changed a non-seed private validation option';
  end if;

  if (
    select count(*)
    from public.ideas
    where id between '00000000-0000-4000-8000-000000000201'::uuid
      and '00000000-0000-4000-8000-000000000227'::uuid
      and creator_id = '00000000-0000-4000-8000-000000000101'
  ) <> 27 then
    raise exception 'positioning migration did not retain all 27 deterministic seed IDs';
  end if;

  if exists (
    select 1
    from public.ideas
    where id between '00000000-0000-4000-8000-000000000201'::uuid
      and '00000000-0000-4000-8000-000000000227'::uuid
      and description ~* '\mresources would fund\M'
  ) then
    raise exception 'positioning migration retained deterministic funding language';
  end if;
end
$$;

update public.ideas
set slug = 'manifest-mismatch-fixture'
where id = '00000000-0000-4000-8000-000000000227';

do $$
begin
  perform private.assert_ideascape_positioning_seed_manifest();
  raise exception 'manifest validation failed open';
exception
  when check_violation then null;
end
$$;

rollback;
