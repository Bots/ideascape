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
    '00000000-0000-4000-8000-000000000219',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'environment'),
    'waste-heat-works',
    'Waste Heat Works',
    'A modular recovery skid that turns low-grade exhaust from community compute racks into measured heat for greenhouse benches and hot-water preheating.',
    $description$Small compute rooms reject a steady stream of low-grade heat while nearby greenhouses, workshops, and shared buildings pay to create heat somewhere else. Waste Heat Works would test whether an instrumented, reversible recovery skid can connect those two systems without pretending every server rack is a power plant.

The skid would combine a rear-rack capture hood, variable bypass, heat pump, insulated buffer tank, leak detection, and independent meters for electrical input, air temperature, water temperature, and thermal output. A licensed engineering review would cover electrical, fire, building, cooling, and hydronic requirements before installation. Any fault would return the rack to its original cooling path; the project would not place improvised liquid loops inside participant hardware or claim carbon savings that the meters cannot prove.

A first pilot would pair one 3–8 kW compute rack with a greenhouse seedling bench for eight cold weeks. The public report would compare recovered thermal energy, heat-pump efficiency, avoided heater use, rack inlet temperature, throttling, and bypass hours against a pre-installation baseline. Success would mean recovering at least half of eligible exhaust heat while keeping compute cooling and workload reliability inside their original operating limits.$description$,
    'published',
    '2026-08-10 12:50:00+00',
    '2026-08-10 12:50:00+00',
    '2026-08-10 12:50:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000220',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'model-commons-lab',
    'Model Commons Lab',
    'A portable offline evaluation rack that lets small organizations compare open AI models on reproducible tasks before trusting one with real work.',
    $description$Libraries, schools, clinics, and small civic teams are told that an AI model can summarize documents, answer questions, or automate routine work, but they rarely have a practical way to compare models, hardware, energy use, and failure modes on the tasks they actually understand. Model Commons Lab would bring a reproducible local evaluation rack and a plain-language scorecard to that decision.

Each evaluation would pin model files, runtime versions, prompts, decoding settings, and hardware telemetry. Task packs would use synthetic fixtures, public records, or participant-approved material that has been reviewed for privacy and licensing. Runs would stay offline by default, answers would retain source citations, and reviewers would score unsupported claims, refusals, latency, memory, and energy. The lab would not upload sensitive collections, benchmark covert surveillance, or turn a score into permission for unsupervised high-consequence decisions.

A first pilot would run four open models against thirty document, extraction, accessibility, and question-answering tasks supplied by three participating organizations. A second operator would then reproduce the full run from the published manifest. Success would mean repeatable scores within a declared tolerance, traceable citations, a clear workload-specific tradeoff, and at least one proposed AI use being rejected because the evidence shows it is not ready.$description$,
    'published',
    '2026-08-10 12:49:00+00',
    '2026-08-10 12:49:00+00',
    '2026-08-10 12:49:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000221',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'community'),
    'glass-box-sensor-network',
    'Glass Box Sensor Network',
    'Solar-powered neighborhood sensor pods that display what they measure, publish calibration evidence, and automatically expire raw readings.',
    $description$Environmental sensor projects often ask a neighborhood to trust an invisible box, an unknown data pipeline, and a dashboard controlled somewhere else. Glass Box Sensor Network would make the collection boundary visible at the point of measurement: every pod would show its active sensors, current readings, retention window, calibration status, and data destination on a low-power public display.

The first pod would measure particulate matter, temperature, humidity, and aggregate sound-pressure levels with no cameras or stored audio. It would not collect faces, license plates, device identifiers, precise movement histories, or private-network traffic. Signed firmware, open schematics, tamper evidence, coarse location, documented placement consent, and automatic raw-data expiry would be part of the contract rather than optional policy text.

A six-week pilot would place six pods along one heat- and traffic-exposed corridor, with two periodically co-located beside a reference monitor. The team would publish uptime, calibration drift, missing-data periods, deletion audits, maintenance visits, and a short resident comprehension test. Success would mean at least 95% scheduled uptime, bounded drift after calibration, verified expiry of raw readings, and most nearby residents correctly understanding what the pods can and cannot observe.$description$,
    'published',
    '2026-08-10 12:48:00+00',
    '2026-08-10 12:48:00+00',
    '2026-08-10 12:48:00+00'
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
    '00000000-0000-4000-8000-000000000319',
    '00000000-0000-4000-8000-000000000219',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/waste-heat-works.svg',
    'An instrumented compute rack routes measured exhaust heat through a recovery skid into a greenhouse bench.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000320',
    '00000000-0000-4000-8000-000000000220',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/model-commons-lab.svg',
    'An offline evaluation rack runs the same approved task pack across local AI models and produces a reproducible scorecard.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000321',
    '00000000-0000-4000-8000-000000000221',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/glass-box-sensor-network.svg',
    'Transparent neighborhood sensor pods display active measurements, calibration state, and raw-data expiry in public.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
