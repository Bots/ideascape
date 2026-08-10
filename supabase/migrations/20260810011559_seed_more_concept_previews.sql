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
    '00000000-0000-4000-8000-000000000213',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'home-lab-defense-clinic',
    'Home Lab Defense Clinic',
    'An owner-authorized security clinic for mapping, updating, segmenting, and backing up the small servers and connected devices people run at home.',
    $description$Home servers, network storage, cameras, home-automation hubs, and hobby projects often grow into an accidental production environment without an inventory, update plan, or tested recovery path. Home Lab Defense Clinic would help participants understand and harden the systems they personally operate before a failure or compromise turns into data loss.

Every session would begin with a written scope covering participant-owned systems and explicitly authorized shared equipment. Facilitators would build an asset map, review exposed services, apply vendor-supported updates, separate untrusted devices, improve account recovery, and test backups. The clinic would not scan neighbors, employers, public targets, or third-party accounts; collect unrelated credentials; conceal persistence; or turn findings into intrusion instructions.

A pilot would use a portable isolated router and synthetic vulnerable services before touching a participant environment. Success would mean fewer unnecessary public services, complete inventories, recoverable backups, documented changes, and owners who can explain their own risk boundaries—not a count of vulnerabilities exploited.$description$,
    'published',
    '2026-08-10 01:15:00+00',
    '2026-08-10 01:15:00+00',
    '2026-08-10 01:15:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000214',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'community-compute-cooperative',
    'Community Compute Cooperative',
    'A member-owned pool of efficient GPU and CPU machines for local research, creative tools, model experiments, and other transparent shared workloads.',
    $description$Independent researchers, artists, students, and small civic groups can have legitimate compute needs without enough demand or budget to own dedicated high-end hardware. Community Compute Cooperative would test a collectively governed cluster where members reserve capacity, understand energy use, and help decide which public-interest workloads receive sponsored time.

The platform would isolate jobs, encrypt member storage, expire temporary data, publish capacity and energy accounting, and require an enforceable acceptable-use policy. Operators would review abuse reports and reject credential theft, unauthorized access, malware operations, covert cryptocurrency mining, non-consensual surveillance, and workloads whose provenance cannot be explained. Members would see clear limits rather than promises of private-cloud perfection.

A first rack would combine a few refurbished workstations with reproducible job images and short reservation windows. Success would be measured through completed lawful projects, predictable queue times, energy per job, storage deletion checks, and equitable access—not maximum utilization at any cost.$description$,
    'published',
    '2026-08-10 01:14:00+00',
    '2026-08-10 01:14:00+00',
    '2026-08-10 01:14:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000215',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'community'),
    'offline-mesh-field-kit',
    'Offline Mesh Field Kit',
    'A pocket-sized, open-hardware communication kit for opt-in neighborhood messaging and resource coordination when internet or cellular service is unavailable.',
    $description$Storms, wildfires, overloaded networks, and remote events can leave small groups without a dependable way to exchange short local updates. Offline Mesh Field Kit would package low-power radios, simple message boards, rechargeable power, and plain-language drills into a system communities can test before an outage.

Deployments would use legal spectrum, documented power limits, visible node ownership, opt-in relays, short retention, and authenticated emergency roles. The kit would not intercept unrelated traffic, impersonate public-safety services, hide transmitters, jam other users, or promise private communication without explaining metadata and radio-range limits. Local regulations and accessibility needs would be part of every site plan.

A pilot would run scheduled exercises in one neighborhood using synthetic messages and published coverage maps. Success would mean messages delivered under simulated outages, understandable setup, low battery use, accessible alerts, and a complete teardown checklist—not the size of an unaccountable network.$description$,
    'published',
    '2026-08-10 01:13:00+00',
    '2026-08-10 01:13:00+00',
    '2026-08-10 01:13:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000216',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'environment'),
    'open-repair-atlas',
    'Open Repair Atlas',
    'A community-built map of lawful diagnostics, compatible parts, safety notes, and repair outcomes for household electronics people are authorized to service.',
    $description$Repair knowledge is scattered across forum threads, disappearing videos, mislabeled parts, and model numbers that differ by region. Open Repair Atlas would turn participant-contributed observations into structured device maps showing common failures, test points, compatible components, tool requirements, and honest repair outcomes.

Contributions would cover personally owned or explicitly authorized equipment and cite public manuals, original measurements, or documentation shared with permission. The atlas would not publish leaked firmware, stolen service credentials, copyrighted manuals without a lawful license, or instructions for defeating safety interlocks and account protections. High-voltage, battery, medical, and radio equipment would carry prominent competency and disposal boundaries.

A pilot would document a narrow set of lamps, audio gear, small appliances, and repairable computers. Success would mean reproducible diagnoses, fewer unnecessary part orders, longer device life, safe recycling when repair fails, and corrections that remain traceable to evidence.$description$,
    'published',
    '2026-08-10 01:12:00+00',
    '2026-08-10 01:12:00+00',
    '2026-08-10 01:12:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000217',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'health'),
    'accessible-interface-retrofit-lab',
    'Accessible Interface Retrofit Lab',
    'A consent-led prototyping lab that adapts everyday controls with switches, voice, larger targets, haptics, and local automation tailored to one person.',
    $description$Many appliances, creative tools, kiosks, and smart-home controls assume precise touch, hearing, vision, speech, or sustained movement. Accessible Interface Retrofit Lab would pair disabled participants with designers and technologists to prototype reversible interfaces around the equipment and routines participants choose.

Work would begin with participant consent, paid co-design, a privacy inventory, and a clear definition of what success means to that individual. Prototypes would favor local processing, physical overrides, documented rollback, and replaceable parts. The lab would not make medical claims, record bystanders without consent, upload sensitive voice or movement data by default, or remove manufacturer safety controls.

A pilot would support a small set of adaptive switches, remappable controls, caption and alert bridges, and offline voice triggers. Success would be measured by participant-defined independence, comfort, reliability, reversibility, and continued voluntary use—not by how much automation is installed.$description$,
    'published',
    '2026-08-10 01:11:00+00',
    '2026-08-10 01:11:00+00',
    '2026-08-10 01:11:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000218',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'education'),
    'project-time-capsule',
    'Project Time Capsule',
    'A reproducible archiving toolkit that preserves source, dependencies, build instructions, sample data, and runnable demonstrations for aging software projects.',
    $description$Important student projects, research tools, digital artworks, and community applications can become impossible to run when package registries change, operating systems move on, or the original maintainer disappears. Project Time Capsule would create inspectable bundles that explain what a project needs and preserve enough context to reproduce a safe demonstration later.

Each capsule would record license provenance, dependency hashes, build logs, supported architectures, synthetic fixtures, and the authorization status of included material. Imported binaries would be scanned and opened in an isolated environment. The toolkit would not copy proprietary source without permission, bypass software licensing, preserve private production data, or present an unmaintained environment as safe for general deployment.

A pilot would archive open-source coursework, civic tools, and participant-owned creative software across several language ecosystems. Success would mean clean-room rebuilds, documented failures, useful migration notes, and demonstrations that remain understandable after the original workstation is gone.$description$,
    'published',
    '2026-08-10 01:10:00+00',
    '2026-08-10 01:10:00+00',
    '2026-08-10 01:10:00+00'
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
    '00000000-0000-4000-8000-000000000313',
    '00000000-0000-4000-8000-000000000213',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/home-lab-defense-clinic.svg',
    'An owner-scoped home network map surrounds a shielded router with backup and update checks.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000314',
    '00000000-0000-4000-8000-000000000214',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/community-compute-cooperative.svg',
    'Members share an isolated GPU cluster with transparent job, energy, and storage controls.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000315',
    '00000000-0000-4000-8000-000000000215',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/offline-mesh-field-kit.svg',
    'Three opt-in neighborhood radio nodes exchange authenticated messages over legal spectrum during an outage.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000316',
    '00000000-0000-4000-8000-000000000216',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/open-repair-atlas.svg',
    'A lawful repair map connects device diagnostics, compatible parts, safety notes, and verified outcomes.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000317',
    '00000000-0000-4000-8000-000000000217',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/accessible-interface-retrofit-lab.svg',
    'A co-designed adaptive console combines a large switch, local voice, haptic alerts, and a physical override.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000318',
    '00000000-0000-4000-8000-000000000218',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/project-time-capsule.svg',
    'Source files, locked dependencies, build notes, and checksums enter an isolated reproducible archive capsule.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
