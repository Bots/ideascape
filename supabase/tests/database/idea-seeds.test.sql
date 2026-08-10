begin;

select plan(18);

select ok(
  exists (
    select 1
    from public.profiles
    where id = '00000000-0000-4000-8000-000000000101'
      and username = 'ideascape-team'
      and display_name = 'Ideascape Team'
  ),
  'the Ideascape Team seed profile exists'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'shade-stop-network',
      'skill-swap-saturdays',
      'civic-accessibility-lab',
      'block-ready-kits'
    )
  ),
  4::bigint,
  'four additional concept previews are seeded'
);

select is(
  (
    select count(*)
    from public.ideas
    join public.categories on categories.id = ideas.category_id
    where ideas.slug in (
      'device-liberation-lab',
      'file-rescue-cooperative',
      'cloud-exit-toolkit',
      'private-ai-workbench'
    )
      and categories.slug = 'technology'
      and ideas.status = 'published'
      and ideas.published_at is not null
      and char_length(ideas.summary) between 80 and 280
      and char_length(ideas.description) >= 400
      and position(E'\\n' in ideas.description) = 0
      and position(E'\n' in ideas.description) > 0
      and case ideas.slug
        when 'device-liberation-lab' then ideas.description ilike '%written authorization%'
        when 'file-rescue-cooperative' then ideas.description ilike '%written consent%'
        when 'cloud-exit-toolkit' then ideas.description ilike '%checksum%'
        when 'private-ai-workbench' then ideas.description ilike '%stays on the device%'
        else false
      end
  ),
  4::bigint,
  'four polished permission-first technology concept previews are seeded'
);

select is(
  (
    select count(*)
    from public.ideas
    join public.categories on categories.id = ideas.category_id
    where ideas.slug in (
      'home-lab-defense-clinic',
      'community-compute-cooperative',
      'offline-mesh-field-kit',
      'open-repair-atlas',
      'accessible-interface-retrofit-lab',
      'project-time-capsule'
    )
      and categories.slug = case ideas.slug
        when 'home-lab-defense-clinic' then 'technology'
        when 'community-compute-cooperative' then 'technology'
        when 'offline-mesh-field-kit' then 'community'
        when 'open-repair-atlas' then 'environment'
        when 'accessible-interface-retrofit-lab' then 'health'
        when 'project-time-capsule' then 'education'
      end
      and ideas.status = 'published'
      and ideas.published_at is not null
      and char_length(ideas.summary) between 80 and 280
      and char_length(ideas.description) >= 400
      and position(E'\\n' in ideas.description) = 0
      and position(E'\n' in ideas.description) > 0
      and case ideas.slug
        when 'home-lab-defense-clinic' then ideas.description ilike '%participant-owned systems%'
        when 'community-compute-cooperative' then ideas.description ilike '%acceptable-use policy%'
        when 'offline-mesh-field-kit' then ideas.description ilike '%legal spectrum%'
        when 'open-repair-atlas' then ideas.description ilike '%would not publish leaked%'
        when 'accessible-interface-retrofit-lab' then ideas.description ilike '%participant consent%'
        when 'project-time-capsule' then ideas.description ilike '%license provenance%'
        else false
      end
  ),
  6::bigint,
  'six additional technology-forward concept previews are seeded with explicit safety boundaries'
);

select is(
  (
    select count(*)
    from public.ideas
    join public.categories on categories.id = ideas.category_id
    where ideas.slug in (
      'waste-heat-works',
      'model-commons-lab',
      'glass-box-sensor-network'
    )
      and categories.slug = case ideas.slug
        when 'waste-heat-works' then 'environment'
        when 'model-commons-lab' then 'technology'
        when 'glass-box-sensor-network' then 'community'
      end
      and ideas.status = 'published'
      and ideas.published_at is not null
      and char_length(ideas.summary) between 80 and 280
      and char_length(ideas.description) >= 450
      and position(E'\\n' in ideas.description) = 0
      and position(E'\n' in ideas.description) > 0
      and case ideas.slug
        when 'waste-heat-works' then ideas.description ilike '%licensed engineering review%'
        when 'model-commons-lab' then ideas.description ilike '%participant-approved material%'
        when 'glass-box-sensor-network' then ideas.description ilike '%no cameras or stored audio%'
        else false
      end
  ),
  3::bigint,
  'three bold infrastructure concepts are seeded with measurable pilots and explicit boundaries'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'neighbor-ride-credits',
      'skill-swap-saturdays',
      'after-dark-storefronts',
      'block-ready-kits',
      'clean-air-library'
    )
      and char_length(summary) between 80 and 280
      and char_length(description) >= 450
      and summary not ilike '%fund%'
      and description not ilike '%backers%'
      and description not ilike '%backing would%'
      and description not ilike '%launch budget%'
      and description not ilike '%early resources would%'
      and case slug
        when 'neighbor-ride-credits' then
          description ilike '%licensed accessible transport partner%'
          and description ilike '%maximum of 20%'
        when 'skill-swap-saturdays' then
          description ilike '%twelve successful teach-backs%'
        when 'after-dark-storefronts' then
          description ilike '%two weeks of baseline%'
        when 'block-ready-kits' then
          description ilike '%within 20 minutes%'
        when 'clean-air-library' then
          description ilike '%non-ozone-generating%'
        else false
      end
  ),
  5::bigint,
  'five legacy previews use bounded pilots, measurable thresholds, and exploration-safe language'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'shade-stop-network',
      'skill-swap-saturdays',
      'civic-accessibility-lab',
      'block-ready-kits'
    )
      and status = 'published'
      and published_at is not null
      and char_length(summary) between 80 and 280
      and char_length(description) >= 300
      and position(E'\\n' in description) = 0
      and position(E'\n' in description) > 0
  ),
  4::bigint,
  'additional concept previews contain polished public copy with real paragraphs'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
  ),
  4::bigint,
  'four launch ideas are seeded'
);

select results_eq(
  $$
    select ideas.slug, categories.slug
    from public.ideas
    join public.categories on categories.id = ideas.category_id
    where ideas.slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
    order by ideas.slug
  $$,
  $$
    values
      ('after-dark-storefronts'::text, 'arts-culture'::text),
      ('clean-air-library'::text, 'health'::text),
      ('neighbor-ride-credits'::text, 'community'::text),
      ('repair-commons'::text, 'environment'::text)
  $$,
  'launch ideas span four relevant categories'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
      and status = 'published'
      and published_at is not null
  ),
  4::bigint,
  'all launch ideas are published'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
      and char_length(summary) between 80 and 280
      and char_length(description) >= 300
  ),
  4::bigint,
  'launch ideas contain useful discovery and detail copy'
);

select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
      and position(E'\\n' in description) = 0
      and position(E'\n' in description) > 0
  ),
  4::bigint,
  'launch idea paragraphs use real line breaks'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where ideas.slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts'
    )
      and idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
      and char_length(idea_media.alt_text) >= 20
  ),
  4::bigint,
  'every launch idea has an accessible hosted cover image'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where ideas.slug in (
      'shade-stop-network',
      'skill-swap-saturdays',
      'civic-accessibility-lab',
      'block-ready-kits'
    )
      and idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
      and char_length(idea_media.alt_text) >= 20
  ),
  4::bigint,
  'every additional concept preview has an accessible hosted cover image'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where ideas.slug in (
      'device-liberation-lab',
      'file-rescue-cooperative',
      'cloud-exit-toolkit',
      'private-ai-workbench'
    )
      and idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
      and char_length(idea_media.alt_text) >= 20
  ),
  4::bigint,
  'every technology concept preview has an accessible hosted cover image'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where ideas.slug in (
      'home-lab-defense-clinic',
      'community-compute-cooperative',
      'offline-mesh-field-kit',
      'open-repair-atlas',
      'accessible-interface-retrofit-lab',
      'project-time-capsule'
    )
      and idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
      and char_length(idea_media.alt_text) >= 20
  ),
  6::bigint,
  'every new concept preview has an accessible hosted cover image'
);

select is(
  (
    select count(*)
    from public.idea_media
    join public.ideas on ideas.id = idea_media.idea_id
    where ideas.slug in (
      'waste-heat-works',
      'model-commons-lab',
      'glass-box-sensor-network'
    )
      and idea_media.kind = 'image'
      and idea_media.sort_order = 0
      and idea_media.url like 'https://ideascape-gamma.vercel.app/images/ideas/%.svg'
      and char_length(idea_media.alt_text) >= 20
  ),
  3::bigint,
  'every bold infrastructure concept has an accessible hosted cover image'
);

set local role anon;
select is(
  (
    select count(*)
    from public.ideas
    where slug in (
      'clean-air-library',
      'repair-commons',
      'neighbor-ride-credits',
      'after-dark-storefronts',
      'shade-stop-network',
      'skill-swap-saturdays',
      'civic-accessibility-lab',
      'block-ready-kits',
      'device-liberation-lab',
      'file-rescue-cooperative',
      'cloud-exit-toolkit',
      'private-ai-workbench',
      'home-lab-defense-clinic',
      'community-compute-cooperative',
      'offline-mesh-field-kit',
      'open-repair-atlas',
      'accessible-interface-retrofit-lab',
      'project-time-capsule',
      'waste-heat-works',
      'model-commons-lab',
      'glass-box-sensor-network'
    )
  ),
  21::bigint,
  'anonymous visitors can discover every demo idea'
);
reset role;

select * from finish();
rollback;
