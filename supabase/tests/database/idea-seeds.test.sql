begin;

select plan(8);

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

set local role anon;
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
  'anonymous visitors can discover every launch idea'
);
reset role;

select * from finish();
rollback;
