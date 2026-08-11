insert into public.ideas (
  id,
  creator_id,
  category_id,
  slug,
  title,
  summary,
  description,
  threat_scenario,
  control_boundary,
  proof_required,
  status,
  published_at,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-4000-8000-000000000222',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'arts-culture'),
    'oral-history-provenance-lab',
    'Oral History Provenance Lab',
    'A community archive lab that records consent, source history, edits, and authenticity evidence before local stories are published or reused.',
    $description$Local oral histories can preserve voices that institutions miss, but an audio file is easy to detach from its speaker, edit without disclosure, or reuse outside the permission that made the recording possible. Oral History Provenance Lab would give libraries, neighborhood groups, and artists a practical chain-of-custody kit for consent-led recording and publication.

Each interview would carry a contributor-controlled license, consent receipt, edit history, transcript checksum, source-device record, and plain-language limits on reuse. Raw recordings would stay encrypted and access-scoped. The lab would reject covert recording, voice cloning, biometric voiceprints, scraped training sets, and any publication that cannot preserve a contributor's withdrawal or correction request.

A first pilot would process twelve volunteer-contributed interviews through two independent archive teams. Reviewers would verify the published transcript against the approved recording, reproduce the provenance record, exercise correction and withdrawal paths, and flag every transformation. Success would mean no unexplained edit, no unauthorized reuse, complete provenance for every public artifact, and a deletion or restriction request that works without specialist access.$description$,
    'Edited or synthetic audio could impersonate a contributor, erase material context, or outlive the consent that authorized the original recording.',
    'Contributors control recording and reuse terms; raw files stay encrypted and access-scoped, with no voice cloning, biometric extraction, or hidden training use.',
    'Publish only after independent reviewers reproduce the provenance chain, verify every edit, and complete correction, withdrawal, and deletion drills.',
    'published',
    '2026-08-11 12:10:00+00',
    '2026-08-11 12:10:00+00',
    '2026-08-11 12:10:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000223',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'community'),
    'neighborhood-incident-relay',
    'Neighborhood Incident Relay',
    'A privacy-preserving neighborhood reporting relay that routes safety concerns without publishing names, precise locations, or accusation feeds.',
    $description$Neighborhood groups need a way to surface broken lighting, repeated hazards, harassment patterns, and urgent support needs without turning a public chat into a permanent accusation database. Neighborhood Incident Relay would test a minimal-data intake and referral path designed around the safety of the person reporting and the person described.

Reports would separate service requests from emergencies, collect only the detail needed by a named responder, coarsen public location, and automatically expire raw submissions. No public post would identify a person, home, vehicle, or private account. Trained stewards would use a documented escalation matrix, dual review for sensitive referrals, rate limits, abuse reporting, and a correction path. The relay would never replace emergency services or publish a neighborhood watch list.

A six-week pilot would use synthetic drills plus volunteer-submitted infrastructure reports across two neighborhoods. Independent reviewers would test re-identification risk, false-report handling, access logs, deletion, emergency redirection, and responder handoff. Success would require every drill to reach the right channel, zero public identity exposure, timely correction of seeded errors, and verified expiry of each raw report.$description$,
    'A reporting tool could expose victims, enable retaliation or doxxing, amplify false allegations, or delay a genuine emergency through the wrong workflow.',
    'Public outputs contain no person identifiers or precise private locations; raw reports are access-scoped, dual-reviewed when sensitive, and automatically expired.',
    'Advance only after re-identification, false-report, deletion, emergency-routing, and responder-handoff drills pass with no unresolved identity exposure.',
    'published',
    '2026-08-11 12:09:00+00',
    '2026-08-11 12:09:00+00',
    '2026-08-11 12:09:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000224',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'education'),
    'phishing-drill-library',
    'Phishing Drill Library',
    'An open training library for inert phishing drills that teaches verification habits without collecting real passwords or ranking individual learners.',
    $description$Security training often measures who clicked instead of whether people learned a safer response. It can also become a surveillance program that captures credentials, humiliates staff, or rewards increasingly deceptive messages. Phishing Drill Library would publish transparent, consent-based exercises that practice verification, reporting, and recovery without creating a real compromise path.

Every scenario would run on an isolated training domain with dummy accounts and no password, token, attachment, or device collection. Participants could opt out, review the lesson immediately, and see exactly what aggregate evidence is retained. Results would never feed disciplinary scoring. Scenarios would cover suspicious links, payment changes, shared-file invitations, support impersonation, QR codes, and safe out-of-band verification.

A first pilot would run eight scenarios with three volunteer organizations and compare baseline responses with a repeat drill four weeks later. The public report would measure reporting speed, verification choice, false-positive burden, accessibility, and retention deletion. Success would mean faster safe reporting, fewer unsafe actions, complete deletion of event-level logs, and no captured secret or participant-level leaderboard.$description$,
    'A training drill could capture real credentials, install harmful content, shame participants, or turn security education into hidden employee surveillance.',
    'Exercises use isolated dummy accounts, collect no passwords or tokens, allow opt-out, retain only declared aggregate measures, and prohibit punitive scoring.',
    'Repeat only after secret-capture tests, accessibility review, deletion audits, and follow-up drills show safer verification and reporting without individual surveillance.',
    'published',
    '2026-08-11 12:08:00+00',
    '2026-08-11 12:08:00+00',
    '2026-08-11 12:08:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000225',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'environment'),
    'water-sensor-integrity-watch',
    'Water Sensor Integrity Watch',
    'A tamper-evident community water-monitoring kit that separates raw readings, calibration evidence, and claims people can safely act on.',
    $description$Low-cost water sensors can make environmental monitoring more accessible, but a broken probe, moved device, stale calibration, or altered spreadsheet can create a false alarm or false reassurance. Water Sensor Integrity Watch would pair each public reading with the evidence needed to understand whether it is current, intact, and suitable for the claim being made.

Each station would sign readings, record calibration and maintenance events, show battery and fault state, and retain a tamper-evident change log. Placement would require permission and safe access. The public interface would distinguish screening data from certified laboratory results, publish uncertainty, and never claim that water is safe to drink. Suspect readings would trigger a documented hold and reference-sample workflow rather than an automated alert cascade.

A first pilot would operate six stations for eight weeks while reviewers seed clock drift, calibration errors, disconnected probes, replayed readings, and edited exports. Results would be compared with scheduled reference samples. Success would mean every seeded integrity failure is detected, public claims remain within the declared evidence level, missing data stays visible, and independent reviewers reproduce the signed record.$description$,
    'Spoofed, replayed, uncalibrated, or selectively edited readings could trigger false alarms or dangerous reassurance about environmental conditions.',
    'Stations use signed readings, visible fault state, permissioned placement, reference samples, and an explicit ban on potability claims from screening sensors.',
    'Expand only after tamper, replay, drift, disconnect, export-edit, and reference-sample tests are independently detected and reproduced.',
    'published',
    '2026-08-11 12:07:00+00',
    '2026-08-11 12:07:00+00',
    '2026-08-11 12:07:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000226',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'health'),
    'clinic-device-privacy-check',
    'Clinic Device Privacy Check',
    'A patient-controlled privacy check for connected health devices that maps telemetry, retention, accounts, and safe offline behavior before deployment.',
    $description$Connected scales, monitors, tablets, and reminder devices can support care while quietly sending health events, routines, account identifiers, or household network details to services nobody in the room has reviewed. Clinic Device Privacy Check would give patients and small care teams a repeatable bench test before a connected device enters daily use.

The check would use synthetic data and a separate test network to document required accounts, destinations, encryption, update policy, export and deletion controls, offline behavior, and manual fallback. A patient would choose the goals and receive the findings in plain language. Reviewers would not change treatment, bypass safety controls, retain credentials, inspect unrelated traffic, or declare a medical device clinically safe.

A first pilot would examine ten voluntarily supplied device models and repeat three tests with a second reviewer. Success would require a complete data-flow map, verified account deletion or documented limitation, safe offline and update behavior, no retained participant secret, and a patient-understandable decision record that distinguishes privacy evidence from clinical approval.$description$,
    'A connected health device could expose medical events and household routines, retain accounts indefinitely, or fail unsafely when cloud access disappears.',
    'Tests use patient consent, synthetic data, an isolated network, no treatment changes, no safety-control bypass, and no retention of credentials or unrelated traffic.',
    'Use only after independent data-flow, encryption, update, offline, export, account-deletion, secret-retention, and manual-fallback checks are documented.',
    'published',
    '2026-08-11 12:06:00+00',
    '2026-08-11 12:06:00+00',
    '2026-08-11 12:06:00+00'
  ),
  (
    '00000000-0000-4000-8000-000000000227',
    '00000000-0000-4000-8000-000000000101',
    (select id from public.categories where slug = 'technology'),
    'software-supply-chain-clinic',
    'Software Supply Chain Clinic',
    'A reproducible software intake clinic that inventories dependencies, verifies artifacts, and rehearses recovery without touching production secrets.',
    $description$Small teams depend on package registries, build images, release scripts, and inherited repositories they rarely have time to inspect as one system. A compromised dependency, abandoned action, unsigned artifact, or secret-bearing build log can cross that system unnoticed. Software Supply Chain Clinic would turn one application into a bounded, reproducible review.

The clinic would run owner-authorized code in an isolated environment with synthetic configuration and no production credentials or customer data. Reviewers would produce an SBOM, pin and hash dependencies, verify signatures where available, inspect build permissions, identify unsupported components, and document a clean rebuild and rollback. Findings would describe risk and mitigation without publishing weaponized exploit steps or private vulnerability details.

A first pilot would review six open or participant-owned applications and ask a second operator to rebuild each from the recorded manifest. Success would require matching artifact checksums, complete dependency provenance, zero secret leakage, removal or containment of seeded unsafe packages, a working rollback, and a time-bounded owner for every unresolved critical dependency.$description$,
    'A compromised dependency, overprivileged build runner, unsigned release, or leaked secret could turn a routine software update into a trusted distribution path.',
    'Reviews use owner-authorized source, isolated builds, synthetic configuration, no production secrets or customer data, and no publication of weaponized exploit detail.',
    'Advance only after SBOM, provenance, signature, checksum, secret-scan, clean-rebuild, rollback, and seeded-dependency drills pass under a second operator.',
    'published',
    '2026-08-11 12:05:00+00',
    '2026-08-11 12:05:00+00',
    '2026-08-11 12:05:00+00'
  )
on conflict (id) do update
set
  creator_id = excluded.creator_id,
  category_id = excluded.category_id,
  slug = excluded.slug,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  threat_scenario = excluded.threat_scenario,
  control_boundary = excluded.control_boundary,
  proof_required = excluded.proof_required,
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
    '00000000-0000-4000-8000-000000000322',
    '00000000-0000-4000-8000-000000000222',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/oral-history-provenance-lab.svg',
    'A recorded voice passes through consent, edit-history, checksum, and publication checkpoints.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000323',
    '00000000-0000-4000-8000-000000000223',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/neighborhood-incident-relay.svg',
    'A protected neighborhood report moves through private triage to a named responder without exposing a person.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000324',
    '00000000-0000-4000-8000-000000000224',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/phishing-drill-library.svg',
    'An inert training message is verified through a safe reporting path without collecting a password.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000325',
    '00000000-0000-4000-8000-000000000225',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/water-sensor-integrity-watch.svg',
    'A community water sensor signs readings and displays calibration, fault, and reference-sample evidence.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000326',
    '00000000-0000-4000-8000-000000000226',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/clinic-device-privacy-check.svg',
    'A connected health device is checked on an isolated network for telemetry, deletion, and offline behavior.',
    0
  ),
  (
    '00000000-0000-4000-8000-000000000327',
    '00000000-0000-4000-8000-000000000227',
    'image',
    'https://ideascape-gamma.vercel.app/images/ideas/software-supply-chain-clinic.svg',
    'A software artifact moves through dependency inventory, signature, checksum, clean-build, and rollback checks.',
    0
  )
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  kind = excluded.kind,
  url = excluded.url,
  alt_text = excluded.alt_text,
  sort_order = excluded.sort_order;
