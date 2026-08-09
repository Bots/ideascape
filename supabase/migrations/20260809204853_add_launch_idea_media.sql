insert into public.idea_media (
  id,
  idea_id,
  kind,
  url,
  alt_text,
  sort_order
)
values
  (
    '00000000-0000-4000-8000-000000000301',
    (select id from public.ideas where slug = 'clean-air-library'),
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/clean-air-library.svg',
    'Neighbors prepare a warm library room with portable air cleaners.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000302',
    (select id from public.ideas where slug = 'repair-commons'),
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/repair-commons.svg',
    'Neighbors repair a bicycle and household items beside a mobile workshop.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000303',
    (select id from public.ideas where slug = 'neighbor-ride-credits'),
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/neighbor-ride-credits.svg',
    'A community ride connects neighbors along a warm neighborhood street.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000304',
    (select id from public.ideas where slug = 'after-dark-storefronts'),
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/after-dark-storefronts.svg',
    'A storefront glows as an evening gallery while neighbors gather outside.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
