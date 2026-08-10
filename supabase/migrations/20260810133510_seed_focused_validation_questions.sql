insert into public.idea_validation_questions (
  id,
  idea_id,
  prompt,
  status,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000402',
    '00000000-0000-4000-8000-000000000203',
    'Which real signal could you provide for a 30-day essential-trip trial?',
    'active',
    '2026-08-10 13:35:10+00',
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000403',
    '00000000-0000-4000-8000-000000000206',
    'What could you commit to during a three-Saturday repair teach-back?',
    'active',
    '2026-08-10 13:35:10+00',
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000404',
    '00000000-0000-4000-8000-000000000204',
    'Which prerequisite could you provide for a three-window evening test?',
    'active',
    '2026-08-10 13:35:10+00',
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000405',
    '00000000-0000-4000-8000-000000000208',
    'Which role could you realistically take in a one-building outage drill?',
    'active',
    '2026-08-10 13:35:10+00',
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000406',
    '00000000-0000-4000-8000-000000000201',
    'During a smoke alert, what could you reliably support within two hours?',
    'active',
    '2026-08-10 13:35:10+00',
    '2026-08-10 13:35:10+00'
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  prompt = excluded.prompt,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.idea_validation_options (
  id,
  question_id,
  value,
  label,
  sort_order,
  created_at
)
values
  (
    '00000000-0000-4000-8000-000000000421',
    '00000000-0000-4000-8000-000000000402',
    'unresolved-trip',
    'I have an essential trip existing transport cannot reliably cover',
    0,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000422',
    '00000000-0000-4000-8000-000000000402',
    'clinic-referrals',
    'A clinic could identify and refer eligible trips',
    1,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000423',
    '00000000-0000-4000-8000-000000000402',
    'licensed-provider-capacity',
    'A licensed provider could confirm accessible capacity',
    2,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000424',
    '00000000-0000-4000-8000-000000000402',
    'accessibility-safeguarding-review',
    'I could review accessibility or safeguarding boundaries',
    3,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000425',
    '00000000-0000-4000-8000-000000000402',
    'published-results-only',
    'I would only follow the published trial results',
    4,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000431',
    '00000000-0000-4000-8000-000000000403',
    'teach-repair-module',
    'I could teach one bounded repair module',
    0,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000432',
    '00000000-0000-4000-8000-000000000403',
    'attend-and-practice',
    'I would attend, practice, and complete a teach-back',
    1,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000433',
    '00000000-0000-4000-8000-000000000403',
    'accessible-space-tools',
    'I could provide an accessible space or approved tools',
    2,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000434',
    '00000000-0000-4000-8000-000000000403',
    'childcare-or-translation',
    'I could support childcare, translation, or access needs',
    3,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000435',
    '00000000-0000-4000-8000-000000000403',
    'document-tested-guide',
    'I could help document and accessibility-check a tested guide',
    4,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000441',
    '00000000-0000-4000-8000-000000000404',
    'eligible-storefront-window',
    'I can offer an eligible storefront window with written permission',
    0,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000442',
    '00000000-0000-4000-8000-000000000404',
    'display-ready-artwork',
    'I have display-ready artwork for a permissioned installation',
    1,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000443',
    '00000000-0000-4000-8000-000000000404',
    'installation-safety-review',
    'I could review electrical, mounting, or glare safety',
    2,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000444',
    '00000000-0000-4000-8000-000000000404',
    'corridor-observation',
    'I could run anonymous baseline and evening observations',
    3,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000445',
    '00000000-0000-4000-8000-000000000404',
    'local-business-feedback',
    'I represent a nearby business willing to provide structured feedback',
    4,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000451',
    '00000000-0000-4000-8000-000000000405',
    'building-approval',
    'I can represent a building authorized to approve the drill',
    0,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000452',
    '00000000-0000-4000-8000-000000000405',
    'primary-steward',
    'I could serve as a trained primary kit steward',
    1,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000453',
    '00000000-0000-4000-8000-000000000405',
    'backup-steward',
    'I could serve as an independent backup steward',
    2,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000454',
    '00000000-0000-4000-8000-000000000405',
    'accessibility-review',
    'I could review accessible alerts and deployment instructions',
    3,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000455',
    '00000000-0000-4000-8000-000000000405',
    'drill-participant',
    'I would participate in the announced outage drill',
    4,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000461',
    '00000000-0000-4000-8000-000000000406',
    'borrow-room-matched-unit',
    'I would borrow a room-matched unit during a smoke alert',
    0,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000462',
    '00000000-0000-4000-8000-000000000406',
    'host-pickup-site',
    'I could host an accessible neighborhood pickup site',
    1,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000463',
    '00000000-0000-4000-8000-000000000406',
    'deliver-unit',
    'I could deliver and retrieve units within two hours',
    2,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000464',
    '00000000-0000-4000-8000-000000000406',
    'prepare-cleaner-air-room',
    'I could help prepare and measure a cleaner-air room',
    3,
    '2026-08-10 13:35:10+00'
  ),
  (
    '00000000-0000-4000-8000-000000000465',
    '00000000-0000-4000-8000-000000000406',
    'filter-stewardship',
    'I could inspect filters and maintain the custody log',
    4,
    '2026-08-10 13:35:10+00'
  )
on conflict (id) do update
set
  question_id = excluded.question_id,
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order;
