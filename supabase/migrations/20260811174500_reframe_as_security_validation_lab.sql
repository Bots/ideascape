-- Reposition Ideascape as a security-validation lab while preserving stable
-- internal category and brief slugs used by existing links.

-- Catalog rewrites are permitted only for this exact deterministic manifest.
-- The canonical seed author can also own private drafts, so author ownership
-- alone is never a sufficient migration boundary.
drop table if exists pg_temp.ideascape_positioning_seed_manifest;
create temporary table ideascape_positioning_seed_manifest (
  id uuid primary key,
  slug text unique not null
) on commit drop;

insert into ideascape_positioning_seed_manifest (id, slug)
values
  ('00000000-0000-4000-8000-000000000201', 'clean-air-library'),
  ('00000000-0000-4000-8000-000000000202', 'repair-commons'),
  ('00000000-0000-4000-8000-000000000203', 'neighbor-ride-credits'),
  ('00000000-0000-4000-8000-000000000204', 'after-dark-storefronts'),
  ('00000000-0000-4000-8000-000000000205', 'shade-stop-network'),
  ('00000000-0000-4000-8000-000000000206', 'skill-swap-saturdays'),
  ('00000000-0000-4000-8000-000000000207', 'civic-accessibility-lab'),
  ('00000000-0000-4000-8000-000000000208', 'block-ready-kits'),
  ('00000000-0000-4000-8000-000000000209', 'device-liberation-lab'),
  ('00000000-0000-4000-8000-000000000210', 'file-rescue-cooperative'),
  ('00000000-0000-4000-8000-000000000211', 'cloud-exit-toolkit'),
  ('00000000-0000-4000-8000-000000000212', 'private-ai-workbench'),
  ('00000000-0000-4000-8000-000000000213', 'home-lab-defense-clinic'),
  ('00000000-0000-4000-8000-000000000214', 'community-compute-cooperative'),
  ('00000000-0000-4000-8000-000000000215', 'offline-mesh-field-kit'),
  ('00000000-0000-4000-8000-000000000216', 'open-repair-atlas'),
  ('00000000-0000-4000-8000-000000000217', 'accessible-interface-retrofit-lab'),
  ('00000000-0000-4000-8000-000000000218', 'project-time-capsule'),
  ('00000000-0000-4000-8000-000000000219', 'waste-heat-works'),
  ('00000000-0000-4000-8000-000000000220', 'model-commons-lab'),
  ('00000000-0000-4000-8000-000000000221', 'glass-box-sensor-network'),
  ('00000000-0000-4000-8000-000000000222', 'oral-history-provenance-lab'),
  ('00000000-0000-4000-8000-000000000223', 'neighborhood-incident-relay'),
  ('00000000-0000-4000-8000-000000000224', 'phishing-drill-library'),
  ('00000000-0000-4000-8000-000000000225', 'water-sensor-integrity-watch'),
  ('00000000-0000-4000-8000-000000000226', 'clinic-device-privacy-check'),
  ('00000000-0000-4000-8000-000000000227', 'software-supply-chain-clinic');

create or replace function private.assert_ideascape_positioning_seed_manifest()
returns void
language plpgsql
set search_path = ''
as $$
begin
  if (
    select count(*)
    from (
      values
        ('00000000-0000-4000-8000-000000000201'::uuid, 'clean-air-library'::text),
        ('00000000-0000-4000-8000-000000000202'::uuid, 'repair-commons'::text),
        ('00000000-0000-4000-8000-000000000203'::uuid, 'neighbor-ride-credits'::text),
        ('00000000-0000-4000-8000-000000000204'::uuid, 'after-dark-storefronts'::text),
        ('00000000-0000-4000-8000-000000000205'::uuid, 'shade-stop-network'::text),
        ('00000000-0000-4000-8000-000000000206'::uuid, 'skill-swap-saturdays'::text),
        ('00000000-0000-4000-8000-000000000207'::uuid, 'civic-accessibility-lab'::text),
        ('00000000-0000-4000-8000-000000000208'::uuid, 'block-ready-kits'::text),
        ('00000000-0000-4000-8000-000000000209'::uuid, 'device-liberation-lab'::text),
        ('00000000-0000-4000-8000-000000000210'::uuid, 'file-rescue-cooperative'::text),
        ('00000000-0000-4000-8000-000000000211'::uuid, 'cloud-exit-toolkit'::text),
        ('00000000-0000-4000-8000-000000000212'::uuid, 'private-ai-workbench'::text),
        ('00000000-0000-4000-8000-000000000213'::uuid, 'home-lab-defense-clinic'::text),
        ('00000000-0000-4000-8000-000000000214'::uuid, 'community-compute-cooperative'::text),
        ('00000000-0000-4000-8000-000000000215'::uuid, 'offline-mesh-field-kit'::text),
        ('00000000-0000-4000-8000-000000000216'::uuid, 'open-repair-atlas'::text),
        ('00000000-0000-4000-8000-000000000217'::uuid, 'accessible-interface-retrofit-lab'::text),
        ('00000000-0000-4000-8000-000000000218'::uuid, 'project-time-capsule'::text),
        ('00000000-0000-4000-8000-000000000219'::uuid, 'waste-heat-works'::text),
        ('00000000-0000-4000-8000-000000000220'::uuid, 'model-commons-lab'::text),
        ('00000000-0000-4000-8000-000000000221'::uuid, 'glass-box-sensor-network'::text),
        ('00000000-0000-4000-8000-000000000222'::uuid, 'oral-history-provenance-lab'::text),
        ('00000000-0000-4000-8000-000000000223'::uuid, 'neighborhood-incident-relay'::text),
        ('00000000-0000-4000-8000-000000000224'::uuid, 'phishing-drill-library'::text),
        ('00000000-0000-4000-8000-000000000225'::uuid, 'water-sensor-integrity-watch'::text),
        ('00000000-0000-4000-8000-000000000226'::uuid, 'clinic-device-privacy-check'::text),
        ('00000000-0000-4000-8000-000000000227'::uuid, 'software-supply-chain-clinic'::text)
    ) as manifest(id, slug)
    join public.ideas as ideas
      on ideas.id = manifest.id
      and ideas.slug = manifest.slug
      and ideas.creator_id = '00000000-0000-4000-8000-000000000101'
  ) <> 27 then
    raise exception using
      errcode = '23514',
      message = 'security positioning requires all 27 expected deterministic UUID/slug pairs';
  end if;
end;
$$;

revoke execute on function private.assert_ideascape_positioning_seed_manifest() from public;
revoke execute on function private.assert_ideascape_positioning_seed_manifest() from anon;
revoke execute on function private.assert_ideascape_positioning_seed_manifest() from authenticated;

select private.assert_ideascape_positioning_seed_manifest();

alter table public.ideas
  drop constraint if exists ideas_security_case_required;

alter table public.ideas
  add constraint ideas_security_case_required check (
    threat_scenario is not null
    and control_boundary is not null
    and proof_required is not null
  ) not valid;

drop policy if exists "Creators can create ideas" on public.ideas;
create policy "Creators can create ideas"
on public.ideas
for insert
to authenticated
with check (
  (select auth.uid()) = creator_id
  and status = 'draft'
  and published_at is null
  and threat_scenario is not null
  and control_boundary is not null
  and proof_required is not null
);

drop policy if exists "Creators can update their ideas" on public.ideas;
create policy "Creators can update their ideas"
on public.ideas
for update
to authenticated
using (
  (select auth.uid()) = creator_id
  and status = 'draft'
)
with check (
  (select auth.uid()) = creator_id
  and status = 'draft'
  and published_at is null
  and threat_scenario is not null
  and control_boundary is not null
  and proof_required is not null
);

drop policy if exists "Creators can delete their ideas" on public.ideas;
drop policy if exists "Creators can delete private security drafts" on public.ideas;
create policy "Creators can delete private security drafts"
on public.ideas
for delete
to authenticated
using (
  (select auth.uid()) = creator_id
  and status = 'draft'
  and published_at is null
);

drop policy if exists "Creators can manage their idea media" on public.idea_media;
drop policy if exists "Creators can manage private security draft media" on public.idea_media;
create policy "Creators can manage private security draft media"
on public.idea_media
for all
to authenticated
using (
  exists (
    select 1
    from public.ideas
    where ideas.id = idea_media.idea_id
      and (select auth.uid()) = ideas.creator_id
      and ideas.status = 'draft'
      and ideas.published_at is null
  )
)
with check (
  exists (
    select 1
    from public.ideas
    where ideas.id = idea_media.idea_id
      and (select auth.uid()) = ideas.creator_id
      and ideas.status = 'draft'
      and ideas.published_at is null
  )
);

update public.categories as categories
set
  name = mapped.name,
  description = mapped.description
from (
  values
    (
      'arts-culture'::text,
      'Provenance & Authenticity'::text,
      'Security reviews for source integrity, consent, authenticity, and controlled reuse.'::text
    ),
    (
      'community'::text,
      'Resilience & Response'::text,
      'Threat-aware response systems with private reporting, bounded authority, and tested fallback paths.'::text
    ),
    (
      'education'::text,
      'Human Risk'::text,
      'Security training and adversarial procedure validation without credential capture, shame, or hidden surveillance.'::text
    ),
    (
      'environment'::text,
      'Infrastructure Integrity'::text,
      'Integrity, safety, and fail-safe controls for sensors, utilities, repair, and physical infrastructure.'::text
    ),
    (
      'health'::text,
      'Privacy & Safety'::text,
      'Privacy-preserving controls for health devices, accessibility, and environmental safety.'::text
    ),
    (
      'technology'::text,
      'Software & Systems'::text,
      'Security controls for software supply chains, devices, data recovery, compute, and model operations.'::text
    )
) as mapped(slug, name, description)
where categories.slug = mapped.slug
  and (categories.name, categories.description)
    is distinct from (mapped.name, mapped.description);

update public.ideas as ideas
set title = mapped.title
from (
  values
    ('after-dark-storefronts'::text, 'After-Dark Installation Safety Review'::text),
    ('block-ready-kits'::text, 'Outage Kit Integrity Drill'::text),
    ('civic-accessibility-lab'::text, 'Crossing Safety Evidence Audit'::text),
    ('glass-box-sensor-network'::text, 'Plate Reader Privacy Audit'::text),
    ('neighbor-ride-credits'::text, 'Essential Trip Privacy Relay'::text),
    ('neighborhood-incident-relay'::text, 'Private Incident Triage Relay'::text),
    ('skill-swap-saturdays'::text, 'Repair Procedure Safety Drill'::text),
    ('repair-commons'::text, 'Authorized Repair Safety Clinic'::text),
    ('shade-stop-network'::text, 'Transit Stop Hazard Audit'::text),
    ('waste-heat-works'::text, 'Compute Heat Fail-Safe Lab'::text),
    ('clean-air-library'::text, 'Smoke Readiness Control Drill'::text),
    ('community-compute-cooperative'::text, 'Secure Compute Isolation Lab'::text),
    ('file-rescue-cooperative'::text, 'File Recovery Integrity Clinic'::text),
    ('model-commons-lab'::text, 'Model Evaluation Integrity Lab'::text)
) as mapped(slug, title),
  ideascape_positioning_seed_manifest as manifest
where manifest.slug = mapped.slug
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and ideas.title is distinct from mapped.title;

update public.ideas as ideas
set
  title = regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(title, '\mcommunities\M', 'organizations', 'gi'),
        '\mcommunity\M', 'shared', 'gi'
      ),
      '\mneighborhood\M', 'local', 'gi'
    ),
    '\mneighbors?\M', 'participants', 'gi'
  ),
  summary = regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(summary, '\mcommunities\M', 'organizations', 'gi'),
        '\mcommunity\M', 'shared', 'gi'
      ),
      '\mneighborhood\M', 'local', 'gi'
    ),
    '\mneighbors?\M', 'participants', 'gi'
  ),
  description = regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(description, '\mcommunities\M', 'organizations', 'gi'),
        '\mcommunity\M', 'shared', 'gi'
      ),
      '\mneighborhood\M', 'local', 'gi'
    ),
    '\mneighbors?\M', 'participants', 'gi'
  )
from ideascape_positioning_seed_manifest as manifest
where ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and concat_ws(' ', ideas.title, ideas.summary, ideas.description)
    ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M';

with transformed as (
  select
    ideas.id,
    case ideas.slug
      when 'community-compute-cooperative' then 'An isolated shared-compute lab for authorized research, model evaluation, and creative workloads with explicit access, storage, energy, and abuse controls.'
      when 'glass-box-sensor-network' then 'Audit the networked plate-reader system, verify contracts, retention, access, and sharing rules, then publish evidence for removal or warrant-level controls.'
      else ideas.summary
    end as summary,
    case ideas.slug
      when 'community-compute-cooperative' then regexp_replace(regexp_replace(regexp_replace(regexp_replace(ideas.description, '\mMembers\M', 'Authorized operators', 'g'), '\mmembers\M', 'operators', 'g'), '\mmember\M', 'operator', 'g'), '\mCooperative\M', 'Isolation Lab', 'g')
      when 'file-rescue-cooperative' then regexp_replace(ideas.description, '\mCooperative\M', 'Clinic', 'g')
      when 'glass-box-sensor-network' then regexp_replace(ideas.description, '\mcampaign\M', 'audit', 'gi')
      when 'model-commons-lab' then regexp_replace(ideas.description, '\mCommons\M', 'Evaluation Integrity', 'g')
      when 'repair-commons' then regexp_replace(ideas.description, '\mCommons\M', 'Clinic', 'g')
      else ideas.description
    end as description
  from public.ideas as ideas
  join ideascape_positioning_seed_manifest as manifest
    on ideas.id = manifest.id
    and ideas.slug = manifest.slug
  where ideas.slug in (
      'community-compute-cooperative',
      'file-rescue-cooperative',
      'glass-box-sensor-network',
      'model-commons-lab',
      'repair-commons'
    )
)
update public.ideas as ideas
set
  summary = transformed.summary,
  description = transformed.description
from transformed,
  ideascape_positioning_seed_manifest as manifest
where ideas.id = transformed.id
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and (ideas.summary, ideas.description)
    is distinct from (transformed.summary, transformed.description);

update public.idea_media as idea_media
set alt_text = regexp_replace(
  regexp_replace(
    regexp_replace(
      regexp_replace(idea_media.alt_text, '\mcommunities\M', 'organizations', 'gi'),
      '\mcommunity\M', 'shared', 'gi'
    ),
    '\mneighborhood\M', 'local', 'gi'
  ),
  '\mneighbors?\M', 'participants', 'gi'
)
from public.ideas as ideas,
  ideascape_positioning_seed_manifest as manifest
where idea_media.idea_id = ideas.id
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and idea_media.alt_text is not null
  and idea_media.alt_text ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M';

update public.idea_media as idea_media
set alt_text = regexp_replace(
  regexp_replace(
    regexp_replace(idea_media.alt_text, '\mMembers\M', 'Authorized operators', 'g'),
    '\mmembers\M', 'operators', 'g'
  ),
  '\mmember\M', 'operator', 'g'
)
from public.ideas as ideas,
  ideascape_positioning_seed_manifest as manifest
where idea_media.idea_id = ideas.id
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and ideas.slug = 'community-compute-cooperative'
  and idea_media.alt_text is not null
  and idea_media.alt_text ~ '\m(Members|members|member)\M';

update public.ideas as ideas
set description = regexp_replace(
  ideas.description,
  '\mResources would fund\M',
  'Validation resources cover',
  'g'
)
from ideascape_positioning_seed_manifest as manifest
where ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and ideas.description ~ '\mResources would fund\M';

update public.profiles
set bio = 'Security operator publishing permission-first threat models, bounded controls, and reproducible proof standards.'
where id = '00000000-0000-4000-8000-000000000101'
  and username in ('ideascape-team', 'ideascape-lab')
  and bio is distinct from 'Security operator publishing permission-first threat models, bounded controls, and reproducible proof standards.';

update public.idea_validation_options as options
set label = regexp_replace(
  regexp_replace(
    regexp_replace(
      regexp_replace(options.label, '\mcommunities\M', 'organizations', 'gi'),
      '\mcommunity\M', 'security', 'gi'
    ),
    '\mneighborhood\M', 'local', 'gi'
  ),
  '\mneighbors?\M', 'participants', 'gi'
)
from public.idea_validation_questions as questions,
  public.ideas as ideas,
  ideascape_positioning_seed_manifest as manifest
where options.question_id = questions.id
  and questions.idea_id = ideas.id
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and options.label ~* '\m(communit(y|ies)|neighbors?|neighborhood)\M';
