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
    '00000000-0000-4000-8000-000000000209',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'device-liberation-lab',
    'Device Liberation Lab',
    'An authorization-first workshop for jailbreaking, repairing, and installing open firmware on devices people own—without becoming a bypass service.',
    $description$Phones, e-readers, routers, and handheld consoles can remain physically useful long after a vendor stops shipping updates. Device Liberation Lab would help people evaluate whether an owner-controlled device can be safely unlocked, jailbroken, repaired, or moved to maintained open firmware instead of becoming electronic waste.

Every intake would require proof of ownership or written authorization. A facilitator would identify the exact model and firmware, create a recoverable backup where possible, explain warranty and data-loss risks, and favor documented, reversible procedures. The isolated bench would not bypass another person's account, carrier obligations, activation protections, workplace management, or unknown-provenance hardware, and it would never extract third-party credentials.

A first pilot would support a deliberately small device list and publish model-specific compatibility, rollback, and failure notes without publishing participant data. Success would mean more devices receiving supported software, reproducible recovery paths, and fewer unrecoverable mistakes—not the number of protections defeated.$description$,
    'published',
    '2026-08-09 23:53:00+00',
    '2026-08-09 23:53:00+00',
    '2026-08-09 23:53:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000210',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'file-rescue-cooperative',
    'File Rescue Cooperative',
    'A privacy-preserving recovery bench for retrieving personal files from failed drives, dead laptops, damaged cards, and obsolete media.',
    $description$A dead laptop or clicking drive can trap years of photos, source code, recordings, and family documents behind hardware failure or an obsolete format. File Rescue Cooperative would provide a transparent, affordable bench for recovering files from storage media a participant owns or is legally responsible for.

Each job would begin with identity, ownership, and written consent, followed by a plain-language risk estimate. Technicians would prefer read-only imaging, work from copies rather than original media, encrypt temporary recovery storage, record chain of custody, and let the owner choose the destination. Unknown, stolen, or disputed devices would be refused, and account passwords or encryption would never be bypassed without documented authority and a lawful recovery path.

The pilot would focus on common hard drives, SSDs, memory cards, optical discs, and a short list of legacy formats. Resources would fund write blockers, clean storage, adapters, secure wiping, and training. Success would be measured by verified files returned, transparent failures, and temporary copies provably destroyed after handoff.$description$,
    'published',
    '2026-08-09 23:52:00+00',
    '2026-08-09 23:52:00+00',
    '2026-08-09 23:52:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000211',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'cloud-exit-toolkit',
    'Cloud Exit Toolkit',
    'Open-source export tools that help people retrieve, verify, and move their own files out of cloud platforms without losing metadata or folders.',
    $description$Downloading personal data from a cloud service often produces partial archives, confusing formats, duplicate files, and no reliable way to know whether the export is complete. Cloud Exit Toolkit would turn official account exports into organized, portable folders that people can inspect, back up, and import elsewhere.

Connectors would use the provider's documented export or narrowly scoped authorization flow rather than collecting passwords. Each run would preserve timestamps and metadata where formats allow, create a checksum manifest, identify missing or corrupt files, and produce a human-readable migration report. Processing could happen locally or inside a user-controlled encrypted workspace, with credentials removed as soon as the export finishes.

The first release would support a small set of photo, document, and note exports and publish test fixtures for every converter. The project would not scrape accounts, evade access controls, or promise that every proprietary feature can be reproduced. Success would mean people can verify what they recovered before closing an account or moving to a different service.$description$,
    'published',
    '2026-08-09 23:51:00+00',
    '2026-08-09 23:51:00+00',
    '2026-08-09 23:51:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000212',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'private-ai-workbench',
    'Private AI Workbench',
    'Reproducible local-AI workstations for searching, summarizing, and organizing sensitive files without sending them to a hosted model.',
    $description$People want useful AI over journals, contracts, research notes, recordings, and source code, but many collections are too private or regulated to upload to a third-party model. Private AI Workbench would publish a small-computer recipe for local document search and assisted organization where the original material stays on the device.

The workbench would combine a documented local model, file parsers, an encrypted index, source citations, and simple permission boundaries. Network access would be off by default during analysis, imported documents would be treated as untrusted input, and generated answers would link back to the exact local passages used. The design would disclose hardware limits and avoid claiming that local inference makes incorrect output safe.

A pilot would test legal files, personal archives, and software documentation using synthetic or participant-approved material. Resources would fund benchmark hardware, accessibility work, reproducible installers, threat modeling, and plain-language setup guides. Success would be measured by citation accuracy, setup completion, predictable deletion, and zero required document uploads.$description$,
    'published',
    '2026-08-09 23:50:00+00',
    '2026-08-09 23:50:00+00',
    '2026-08-09 23:50:00+00'
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
    '00000000-0000-4000-8000-000000000309',
    '00000000-0000-4000-8000-000000000209',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/device-liberation-lab.svg',
    'Owner-controlled devices, an open padlock, and a terminal share an isolated repair bench.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000310',
    '00000000-0000-4000-8000-000000000210',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/file-rescue-cooperative.svg',
    'A read-only recovery station transfers files from damaged storage into an encrypted folder.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000311',
    '00000000-0000-4000-8000-000000000211',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/cloud-exit-toolkit.svg',
    'Verified files move from a cloud export into a user-controlled archive with checksum receipts.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000312',
    '00000000-0000-4000-8000-000000000212',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/private-ai-workbench.svg',
    'A local AI workstation indexes private documents inside a shielded offline workspace.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
