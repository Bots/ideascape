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
    '00000000-0000-4000-8000-000000000205',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'environment'),
    'shade-stop-network',
    'Shade Stop Network',
    'A resident-led program that adds modular shade, seating, and heat-safety information to the bus stops that need relief most.',
    $description$Waiting ten minutes for a bus can become dangerous when a bare concrete stop sits in direct summer sun. Shade Stop Network would map the hottest high-use stops with riders, transit staff, and neighborhood groups, then install lightweight shade structures and comfortable seating where permanent shelters are years away.

Each location would use a modular kit selected for visibility, accessibility, wind safety, and easy repair. Riders could report damage or missing water through a simple code on the shelter, while nearby businesses and community groups could volunteer as seasonal stewards without being responsible for enforcement or security.

The first pilot would equip five stops and compare surface temperature, rider comfort, maintenance requests, and boarding activity before and after installation. Early support would fund engineering review, permits, the first kits, multilingual heat-safety signs, and replacement parts—not a promise of permanent transit infrastructure.$description$,
    'published',
    '2026-08-09 20:00:00+00',
    '2026-08-09 20:00:00+00',
    '2026-08-09 20:00:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000206',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'education'),
    'skill-swap-saturdays',
    'Skill Swap Saturdays',
    'A monthly neighborhood exchange where residents teach one practical skill, learn another, and leave behind reusable local guides.',
    $description$Many useful skills already exist on every block, but neighbors rarely have a low-pressure way to share them. Skill Swap Saturdays would host short, hands-on sessions where residents teach something practical—from bicycle maintenance and budgeting to sewing, seed starting, language practice, or basic computer safety.

Each event would pair forty-minute workshops with an open help table. Teachers would receive a small stipend and a simple template for creating a one-page guide that stays in a public neighborhood library after the session. Organizers would recruit across age groups and provide materials so participation does not depend on bringing specialized tools.

A three-month pilot would test whether people return, whether first-time teachers feel supported, and which skills lead to useful follow-up connections. Initial resources would cover accessible space, teacher stipends, shared supplies, childcare, translation, and printing rather than charging participants.$description$,
    'published',
    '2026-08-09 19:59:00+00',
    '2026-08-09 19:59:00+00',
    '2026-08-09 19:59:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000207',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'civic-accessibility-lab',
    'Civic Accessibility Lab',
    'A paid community testing lab where disabled residents help local organizations find and fix barriers in websites and digital services.',
    $description$A public-facing website can pass an automated scan and still be exhausting or impossible to use with a keyboard, screen reader, magnification, voice control, or cognitive support needs. Civic Accessibility Lab would pay disabled residents to test real local services and explain the barriers that ordinary checklists miss.

Participating libraries, nonprofits, and small public agencies would bring one focused digital journey, such as reserving a room or applying for assistance. A facilitator would prepare safe test accounts, document findings without recording sensitive participant data, and turn observations into prioritized fixes that the organization can understand and verify.

The pilot would run four review sessions and publish only reusable, anonymized lessons. Early resources would fund tester compensation, assistive technology, facilitation, remediation coaching, and follow-up verification. Success would be measured by fixed tasks and improved completion—not by the number of defects reported.$description$,
    'published',
    '2026-08-09 19:58:00+00',
    '2026-08-09 19:58:00+00',
    '2026-08-09 19:58:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000208',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'community'),
    'block-ready-kits',
    'Block-Ready Kits',
    'Shared emergency supply kits and simple neighborhood response plans designed for the first hours before outside help arrives.',
    $description$Emergency checklists often assume every household can buy, store, and maintain the same supplies. Block-Ready Kits would create shared, clearly inventoried caches for apartment buildings and small neighborhood groups, paired with a practical plan for checking on residents during smoke, heat, power loss, or severe weather.

Each kit would be designed with local emergency managers and residents rather than sold as a universal survival box. Supplies could include radios, charging banks, lights, masks, water containers, first-aid basics, and printed contact cards. Named stewards would inspect expiration dates and battery health on a public schedule without collecting medical or immigration information.

The first pilot would place three kits, run a short daylight practice, and document what residents actually used or found confusing. Early resources would cover durable storage, core supplies, accessibility adaptations, translation, and replacements. The project would supplement—not replace—professional emergency response.$description$,
    'published',
    '2026-08-09 19:57:00+00',
    '2026-08-09 19:57:00+00',
    '2026-08-09 19:57:00+00'
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
    '00000000-0000-4000-8000-000000000305',
    '00000000-0000-4000-8000-000000000205',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/shade-stop-network.svg',
    'Neighbors wait beneath a bright modular shade shelter at a sunny bus stop.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000306',
    '00000000-0000-4000-8000-000000000206',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/skill-swap-saturdays.svg',
    'Neighbors share practical skills around a table at a community workshop.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000307',
    '00000000-0000-4000-8000-000000000207',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/civic-accessibility-lab.svg',
    'A disabled tester and facilitator review an accessible civic website.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000308',
    '00000000-0000-4000-8000-000000000208',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/block-ready-kits.svg',
    'Neighbors organize labeled emergency kits beside a shared response map.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
