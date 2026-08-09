-- Create a non-login author for curated launch content.
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
values (
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'ideas@ideascape.invalid',
  '',
  timezone('utc', now()),
  '{"provider":"email","providers":[]}'::jsonb,
  '{"full_name":"Ideascape Team"}'::jsonb,
  timezone('utc', now()),
  timezone('utc', now())
)
on conflict (id) do nothing;

update public.profiles
set
  username = 'ideascape-team',
  display_name = 'Ideascape Team',
  bio = 'Curated launch concepts meant to spark practical community collaboration.'
where id = '00000000-0000-4000-8000-000000000101';

insert into public.ideas (
  id,
  creator_id,
  category_id,
  slug,
  title,
  summary,
  description,
  status,
  published_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000201',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'health'),
    'clean-air-library',
    'The Clean Air Library',
    'A neighborhood lending network for portable air cleaners, replacement filters, and ready-to-open cleaner-air rooms during smoke events.',
    'Smoke does not stop at a neighborhood boundary, but access to cleaner indoor air often depends on what each household can afford. The Clean Air Library would maintain a shared fleet of correctly sized portable air cleaners and replacement filters that residents can reserve before and during bad-air days.\n\nThe first pilot would recruit libraries, schools, and faith communities as pickup points and prepare a few larger community rooms to open as cleaner-air spaces. Trained volunteers would handle delivery for people who cannot travel, demonstrate safe setup, and track filter replacement without collecting medical details.\n\nInitial backing would purchase the first units, a season of filters, secure storage, and simple multilingual instructions. Success would mean fast pickup, dependable maintenance, and enough neighborhood hosts that nobody has to cross town just to breathe easier.',
    'published',
    '2026-08-09 20:04:00+00',
    '2026-08-09 20:04:00+00',
    '2026-08-09 20:04:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000202',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'environment'),
    'repair-commons',
    'Repair Commons on Wheels',
    'A mobile tool library and monthly repair clinic that helps neighbors fix household goods while local mentors teach practical skills.',
    'Too many repairable lamps, bikes, small appliances, and pieces of furniture are discarded because the right tool or a few minutes of experienced help are hard to find. Repair Commons on Wheels would bring both to a different neighborhood each month in a compact trailer.\n\nResidents could book a repair bench, borrow common tools, or sit beside volunteer fixers who explain the diagnosis instead of making the repair disappear behind a counter. Teen apprentices and retired tradespeople would be paid small stipends to document repeatable fixes and teach safe tool use. Items that cannot be repaired would be sorted for responsible parts recovery.\n\nThe launch budget would cover a used trailer, durable tools, safety equipment, insurance, and a starter parts cabinet. The pilot would publish what was fixed, what could not be fixed, and which parts were most often missing so future events get better instead of simply getting bigger.',
    'published',
    '2026-08-09 20:03:00+00',
    '2026-08-09 20:03:00+00',
    '2026-08-09 20:03:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000203',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'community'),
    'neighbor-ride-credits',
    'Neighbor Ride Credits',
    'A community-funded pool of reliable rides for medical visits, groceries, and other essential trips that fall between transit options.',
    'Missing one essential trip can become a much larger problem. Neighbor Ride Credits would create a small, locally managed pool of prepaid rides for people who cannot drive and cannot make an existing transit schedule work. Clinics, food pantries, libraries, and community groups could issue credits through a common set of eligibility rules.\n\nThe pilot would combine screened volunteer drivers, accessible local transportation providers, and ordinary taxi or rideshare service rather than betting everything on one operator. A coordinator would match each request to the safest practical option while collecting only the information required to complete the trip. Riders could also request a recurring route for a short course of treatment or a weekly grocery run.\n\nBacking would fund the first ride pool, driver screening, accessibility supplements, and a part-time coordinator. Public reporting would focus on completed trips, wait times, and uncovered requests—not names, diagnoses, or travel histories.',
    'published',
    '2026-08-09 20:02:00+00',
    '2026-08-09 20:02:00+00',
    '2026-08-09 20:02:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000204',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'arts-culture'),
    'after-dark-storefronts',
    'After-Dark Storefronts',
    'Turn vacant shop windows into rotating evening galleries where local artists, students, and neighborhood storytellers can be seen after sunset.',
    'A dark vacant storefront can make an entire block feel closed, even when people still live, work, and create nearby. After-Dark Storefronts would pair willing property owners with local artists to install month-long exhibits that are designed to be viewed safely from the sidewalk in the evening.\n\nEach rotation would reserve space for one established artist, one student group, and one neighborhood history or oral-story project. Small artist fees, shared display hardware, low-energy lighting, and a clear installation agreement would keep participation practical for both creators and owners. Opening walks could bring nearby cafés, musicians, and community groups into the program without turning every exhibit into a sales event.\n\nThe first season would activate three windows for three months. Backers would fund artist stipends, insurance, lighting, printing, and reusable mounting systems. The goal is a repeatable way to make overlooked blocks feel inhabited while giving emerging creators a public audience.',
    'published',
    '2026-08-09 20:01:00+00',
    '2026-08-09 20:01:00+00',
    '2026-08-09 20:01:00+00'
  )
on conflict (id) do update
set
  creator_id = excluded.creator_id,
  category_id = excluded.category_id,
  slug = excluded.slug,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = excluded.updated_at;
