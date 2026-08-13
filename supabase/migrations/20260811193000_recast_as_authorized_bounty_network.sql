-- Recast the exact deterministic IdeaScape catalog as an authorized bounty
-- platform. Every test is confined to an authorized environment; stable UUIDs
-- and slugs remain compatibility identifiers.
-- Arbitrary creator-owned records are intentionally outside this migration.

drop table if exists pg_temp.ideascape_bounty_seed_manifest;

create temporary table ideascape_bounty_seed_manifest (
  id uuid primary key,
  slug text unique not null,
  media_id uuid unique not null
) on commit drop;

insert into ideascape_bounty_seed_manifest (id, slug, media_id)
values
    ('00000000-0000-4000-8000-000000000201'::uuid, 'clean-air-library'::text, '00000000-0000-4000-8000-000000000301'::uuid),
    ('00000000-0000-4000-8000-000000000202'::uuid, 'repair-commons'::text, '00000000-0000-4000-8000-000000000302'::uuid),
    ('00000000-0000-4000-8000-000000000203'::uuid, 'neighbor-ride-credits'::text, '00000000-0000-4000-8000-000000000303'::uuid),
    ('00000000-0000-4000-8000-000000000204'::uuid, 'after-dark-storefronts'::text, '00000000-0000-4000-8000-000000000304'::uuid),
    ('00000000-0000-4000-8000-000000000205'::uuid, 'shade-stop-network'::text, '00000000-0000-4000-8000-000000000305'::uuid),
    ('00000000-0000-4000-8000-000000000206'::uuid, 'skill-swap-saturdays'::text, '00000000-0000-4000-8000-000000000306'::uuid),
    ('00000000-0000-4000-8000-000000000207'::uuid, 'civic-accessibility-lab'::text, '00000000-0000-4000-8000-000000000307'::uuid),
    ('00000000-0000-4000-8000-000000000208'::uuid, 'block-ready-kits'::text, '00000000-0000-4000-8000-000000000308'::uuid),
    ('00000000-0000-4000-8000-000000000209'::uuid, 'device-liberation-lab'::text, '00000000-0000-4000-8000-000000000309'::uuid),
    ('00000000-0000-4000-8000-000000000210'::uuid, 'file-rescue-cooperative'::text, '00000000-0000-4000-8000-000000000310'::uuid),
    ('00000000-0000-4000-8000-000000000211'::uuid, 'cloud-exit-toolkit'::text, '00000000-0000-4000-8000-000000000311'::uuid),
    ('00000000-0000-4000-8000-000000000212'::uuid, 'private-ai-workbench'::text, '00000000-0000-4000-8000-000000000312'::uuid),
    ('00000000-0000-4000-8000-000000000213'::uuid, 'home-lab-defense-clinic'::text, '00000000-0000-4000-8000-000000000313'::uuid),
    ('00000000-0000-4000-8000-000000000214'::uuid, 'community-compute-cooperative'::text, '00000000-0000-4000-8000-000000000314'::uuid),
    ('00000000-0000-4000-8000-000000000215'::uuid, 'offline-mesh-field-kit'::text, '00000000-0000-4000-8000-000000000315'::uuid),
    ('00000000-0000-4000-8000-000000000216'::uuid, 'open-repair-atlas'::text, '00000000-0000-4000-8000-000000000316'::uuid),
    ('00000000-0000-4000-8000-000000000217'::uuid, 'accessible-interface-retrofit-lab'::text, '00000000-0000-4000-8000-000000000317'::uuid),
    ('00000000-0000-4000-8000-000000000218'::uuid, 'project-time-capsule'::text, '00000000-0000-4000-8000-000000000318'::uuid),
    ('00000000-0000-4000-8000-000000000219'::uuid, 'waste-heat-works'::text, '00000000-0000-4000-8000-000000000319'::uuid),
    ('00000000-0000-4000-8000-000000000220'::uuid, 'model-commons-lab'::text, '00000000-0000-4000-8000-000000000320'::uuid),
    ('00000000-0000-4000-8000-000000000221'::uuid, 'glass-box-sensor-network'::text, '00000000-0000-4000-8000-000000000321'::uuid),
    ('00000000-0000-4000-8000-000000000222'::uuid, 'oral-history-provenance-lab'::text, '00000000-0000-4000-8000-000000000322'::uuid),
    ('00000000-0000-4000-8000-000000000223'::uuid, 'neighborhood-incident-relay'::text, '00000000-0000-4000-8000-000000000323'::uuid),
    ('00000000-0000-4000-8000-000000000224'::uuid, 'phishing-drill-library'::text, '00000000-0000-4000-8000-000000000324'::uuid),
    ('00000000-0000-4000-8000-000000000225'::uuid, 'water-sensor-integrity-watch'::text, '00000000-0000-4000-8000-000000000325'::uuid),
    ('00000000-0000-4000-8000-000000000226'::uuid, 'clinic-device-privacy-check'::text, '00000000-0000-4000-8000-000000000326'::uuid),
    ('00000000-0000-4000-8000-000000000227'::uuid, 'software-supply-chain-clinic'::text, '00000000-0000-4000-8000-000000000327'::uuid);

do $$
begin
  if (
    select count(*)
    from ideascape_bounty_seed_manifest as manifest
    join public.ideas as ideas
      on ideas.id = manifest.id
      and ideas.slug = manifest.slug
      and ideas.creator_id = '00000000-0000-4000-8000-000000000101'
  ) <> 27 then
    raise exception using
      errcode = '23514',
      message = 'authorized bounty positioning requires all 27 expected bounty UUID/slug pairs';
  end if;
end;
$$;

update public.categories as categories
set
  name = mapped.name,
  description = mapped.description
from (
  values
    ('arts-culture'::text, 'Provenance & Forgery'::text, 'Authorized bounties for source integrity, consent, authenticity, and controlled reuse.'::text),
    ('community'::text, 'Coordination & Resilience'::text, 'Authorized bounties for private reporting, bounded authority, fallback, and incident recovery.'::text),
    ('education'::text, 'Human Attack Surface'::text, 'Contained social-engineering and procedure bounties without credential capture or hidden surveillance.'::text),
    ('environment'::text, 'Physical & Sensor Systems'::text, 'Owner-approved bounties for sensors, utilities, repair systems, and fail-safe physical controls.'::text),
    ('health'::text, 'Privacy & Safety'::text, 'Permissioned privacy and safety bounties for devices, accessibility, and sensitive data flows.'::text),
    ('technology'::text, 'Software & Compute'::text, 'Authorized bounties for supply chains, devices, recovery, compute isolation, and model operations.'::text)
) as mapped(slug, name, description)
where categories.slug = mapped.slug
  and (categories.name, categories.description)
    is distinct from (mapped.name, mapped.description);

with bounty_catalog (
  id,
  slug,
  title,
  summary,
  description,
  threat_scenario,
  control_boundary,
  proof_required
) as (
  values
    ('00000000-0000-4000-8000-000000000201', 'clean-air-library', 'Smoke Sensor Spoofing Bounty', 'Find how air-quality alerts could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Smoke Sensor Spoofing Bounty is a permissioned defensive challenge focused on air-quality alerts. The sponsor provides a sponsor-owned sensor emulator and synthetic telemetry feed. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could accept forged readings and suppress a real smoke warning. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a sponsor-owned sensor emulator and synthetic telemetry feed. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of signed readings, anomaly alarms, and fail-safe alert behavior. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000202', 'repair-commons', 'Repair Station Privilege Bounty', 'Find how shared repair-station accounts could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Repair Station Privilege Bounty is a permissioned defensive challenge focused on shared repair-station accounts. The sponsor provides disposable repair tickets and isolated test accounts. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could cross operator boundaries and expose another person''s repair records. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to disposable repair tickets and isolated test accounts. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of tenant isolation, least-privilege roles, and complete access logs. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000203', 'neighbor-ride-credits', 'Trip Relay Metadata Bounty', 'Find how essential-trip requests could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Trip Relay Metadata Bounty is a permissioned defensive challenge focused on essential-trip requests. The sponsor provides synthetic trip records and sponsor-controlled relay accounts. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could leak route, schedule, or rider identity metadata through normal relay use. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic trip records and sponsor-controlled relay accounts. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of data minimization, unlinkability checks, and deletion verification. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000204', 'after-dark-storefronts', 'Night Install Tamper Bounty', 'Find how after-hours safety installations could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Night Install Tamper Bounty is a permissioned defensive challenge focused on after-hours safety installations. The sponsor provides bench-mounted demo hardware and signed sample work orders. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could accept a tampered device or forged maintenance record as trusted. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to bench-mounted demo hardware and signed sample work orders. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of tamper detection, provenance checks, and safe rejection paths. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000205', 'shade-stop-network', 'Transit Sensor Blind-Spot Bounty', 'Find how transit-stop hazard sensors could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Transit Sensor Blind-Spot Bounty is a permissioned defensive challenge focused on transit-stop hazard sensors. The sponsor provides a simulated stop, synthetic weather events, and emulated sensors. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could hide a dangerous condition by replaying or suppressing field telemetry. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a simulated stop, synthetic weather events, and emulated sensors. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of freshness checks, missing-data alarms, and manual fallback behavior. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000206', 'skill-swap-saturdays', 'Repair Playbook Injection Bounty', 'Find how shared repair procedures could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Repair Playbook Injection Bounty is a permissioned defensive challenge focused on shared repair procedures. The sponsor provides a disposable documentation workspace with synthetic procedures. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could insert an unsafe step or untrusted link into a published repair playbook. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a disposable documentation workspace with synthetic procedures. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of review gates, signed revisions, rollback, and clear provenance. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000207', 'civic-accessibility-lab', 'Crossing Signal Failure Bounty', 'Find how accessible crossing interfaces could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Crossing Signal Failure Bounty is a permissioned defensive challenge focused on accessible crossing interfaces. The sponsor provides a software-only crossing simulator and synthetic accessibility profiles. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could create a visual, audio, or timing regression that strands a user. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a software-only crossing simulator and synthetic accessibility profiles. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of keyboard, screen-reader, timing, contrast, and fail-safe regression evidence. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000208', 'block-ready-kits', 'Outage Kit Supply-Chain Bounty', 'Find how emergency kit inventories could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Outage Kit Supply-Chain Bounty is a permissioned defensive challenge focused on emergency kit inventories. The sponsor provides sample manifests, mock labels, and non-operational kit contents. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could substitute an expired or counterfeit component without triggering review. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to sample manifests, mock labels, and non-operational kit contents. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of signed inventory history, expiry validation, and quarantine behavior. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000209', 'device-liberation-lab', 'Device Unlock Boundary Bounty', 'Find how owner-authorized device recovery could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Device Unlock Boundary Bounty is a permissioned defensive challenge focused on owner-authorized device recovery. The sponsor provides factory-reset lab devices supplied by the sponsor. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could let a recovery workflow bypass proof of ownership or retain private data. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to factory-reset lab devices supplied by the sponsor. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of ownership checks, auditable consent, data erasure, and reversible recovery. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000210', 'file-rescue-cooperative', 'File Recovery Integrity Bounty', 'Find how file-recovery results could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'File Recovery Integrity Bounty is a permissioned defensive challenge focused on file-recovery results. The sponsor provides synthetic disk images containing seeded corruption and canary files. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could restore corrupted, substituted, or cross-customer files as trustworthy. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic disk images containing seeded corruption and canary files. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of hash verification, tenant isolation, provenance, and clean-room retesting. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000211', 'cloud-exit-toolkit', 'Cloud Exit Data-Loss Bounty', 'Find how cloud export and deletion workflows could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Cloud Exit Data-Loss Bounty is a permissioned defensive challenge focused on cloud export and deletion workflows. The sponsor provides synthetic tenant data in sponsor-owned staging accounts. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could silently omit records or leave recoverable copies after an exit. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic tenant data in sponsor-owned staging accounts. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of record reconciliation, portable exports, deletion verification, and rollback evidence. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000212', 'private-ai-workbench', 'Local AI Data-Leak Bounty', 'Find how local model workspaces could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Local AI Data-Leak Bounty is a permissioned defensive challenge focused on local model workspaces. The sponsor provides synthetic documents inside an isolated local-AI test image. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could leak prompts, files, or embeddings across projects or network boundaries. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic documents inside an isolated local-AI test image. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of egress denial, workspace isolation, artifact scrubbing, and repeatable leak tests. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000213', 'home-lab-defense-clinic', 'Home Lab Exposure Bounty', 'Find how self-hosted lab services could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Home Lab Exposure Bounty is a permissioned defensive challenge focused on self-hosted lab services. The sponsor provides an intentionally vulnerable sponsor-owned lab replica. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could expose an unintended service, secret, or administration panel. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to an intentionally vulnerable sponsor-owned lab replica. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of service inventory, secret rotation, network segmentation, and verified closure. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000214', 'community-compute-cooperative', 'Shared Compute Escape Bounty', 'Find how shared compute jobs could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Shared Compute Escape Bounty is a permissioned defensive challenge focused on shared compute jobs. The sponsor provides ephemeral sponsor-owned workers running synthetic workloads. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could escape one workload boundary or read another operator''s artifacts. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to ephemeral sponsor-owned workers running synthetic workloads. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of job isolation, storage separation, quota enforcement, and teardown verification. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000215', 'offline-mesh-field-kit', 'Mesh Relay Spoofing Bounty', 'Find how offline mesh messages could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Mesh Relay Spoofing Bounty is a permissioned defensive challenge focused on offline mesh messages. The sponsor provides a closed radio test bench with synthetic messages and no public transmission. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could inject a forged relay identity or replay stale emergency traffic. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a closed radio test bench with synthetic messages and no public transmission. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of message authenticity, replay resistance, revocation, and offline recovery. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000216', 'open-repair-atlas', 'Repair Atlas Poisoning Bounty', 'Find how repair-location records could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Repair Atlas Poisoning Bounty is a permissioned defensive challenge focused on repair-location records. The sponsor provides a staging atlas populated with synthetic locations and accounts. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could poison trusted listings with malicious instructions or false service claims. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a staging atlas populated with synthetic locations and accounts. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of source reputation, moderation evidence, rollback, and poisoned-record detection. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000217', 'accessible-interface-retrofit-lab', 'Accessible UI Regression Bounty', 'Find how critical interface accessibility could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Accessible UI Regression Bounty is a permissioned defensive challenge focused on critical interface accessibility. The sponsor provides a sponsor-owned component gallery and scripted test journeys. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could ship an interaction that blocks keyboard, switch, low-vision, or screen-reader users. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a sponsor-owned component gallery and scripted test journeys. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of automated checks plus assistive-technology evidence and a verified fix. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000218', 'project-time-capsule', 'Time Capsule Disclosure Bounty', 'Find how archived software projects could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Time Capsule Disclosure Bounty is a permissioned defensive challenge focused on archived software projects. The sponsor provides synthetic repositories and owner-approved public test projects. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could expose secrets, private history, or unlicensed material during preservation. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic repositories and owner-approved public test projects. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of secret scanning, license inventory, reproducible rebuilds, and clean export review. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000219', 'waste-heat-works', 'Heat Controller Fail-Safe Bounty', 'Find how compute heat-control logic could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Heat Controller Fail-Safe Bounty is a permissioned defensive challenge focused on compute heat-control logic. The sponsor provides a simulation with emulated heaters, pumps, and fault injection. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could drive unsafe temperature behavior when telemetry is stale or a controller fails. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a simulation with emulated heaters, pumps, and fault injection. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of hard safety limits, stale-data shutdown, independent alarms, and recovery tests. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000220', 'model-commons-lab', 'Model Eval Poisoning Bounty', 'Find how model evaluation results could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Model Eval Poisoning Bounty is a permissioned defensive challenge focused on model evaluation results. The sponsor provides versioned synthetic datasets and sponsor-provided model outputs. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could bias a benchmark through contaminated data, hidden leakage, or mutable scoring. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to versioned synthetic datasets and sponsor-provided model outputs. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of dataset provenance, immutable scoring, leakage checks, and independent reruns. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000221', 'glass-box-sensor-network', 'Plate Reader Privacy Bounty', 'Find how plate-reader records could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Plate Reader Privacy Bounty is a permissioned defensive challenge focused on plate-reader records. The sponsor provides synthetic plate events in an isolated audit replica. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could permit overbroad search, retention, or sharing of sensitive location data. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic plate events in an isolated audit replica. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of purpose limits, access controls, deletion tests, and aggregate-only reporting. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000222', 'oral-history-provenance-lab', 'Oral History Provenance Bounty', 'Find how oral-history media and consent could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Oral History Provenance Bounty is a permissioned defensive challenge focused on oral-history media and consent. The sponsor provides synthetic interviews and owner-approved public-domain samples. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could detach a recording from consent terms or substitute an altered source. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic interviews and owner-approved public-domain samples. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of consent linkage, edit provenance, revocation handling, and authenticity checks. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000223', 'neighborhood-incident-relay', 'Incident Relay Impersonation Bounty', 'Find how private incident reports could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Incident Relay Impersonation Bounty is a permissioned defensive challenge focused on private incident reports. The sponsor provides synthetic reports and isolated sponsor-controlled relay accounts. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could impersonate a trusted relay or expose a reporter through routing metadata. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to synthetic reports and isolated sponsor-controlled relay accounts. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of authenticated routing, metadata minimization, abuse controls, and recovery drills. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000224', 'phishing-drill-library', 'Phishing Drill Containment Bounty', 'Find how defensive phishing exercises could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Phishing Drill Containment Bounty is a permissioned defensive challenge focused on defensive phishing exercises. The sponsor provides a closed mail sandbox with fake identities and non-working credentials. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could capture real credentials, shame participants, or escape the approved simulation. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a closed mail sandbox with fake identities and non-working credentials. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of no credential collection, scope enforcement, safe reporting, and teardown evidence. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000225', 'water-sensor-integrity-watch', 'Water Sensor Spoofing Bounty', 'Find how water-safety telemetry could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Water Sensor Spoofing Bounty is a permissioned defensive challenge focused on water-safety telemetry. The sponsor provides a sponsor-owned sensor emulator and synthetic water events. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could forge a safe reading or suppress an alert during a simulated hazard. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to a sponsor-owned sensor emulator and synthetic water events. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of signed telemetry, anomaly detection, fail-safe alerts, and manual confirmation. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000226', 'clinic-device-privacy-check', 'Clinic Device Privacy Bounty', 'Find how clinic device data flows could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Clinic Device Privacy Bounty is a permissioned defensive challenge focused on clinic device data flows. The sponsor provides demo devices and entirely synthetic patient records. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could expose patient-like data through logs, exports, pairing, or maintenance access. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to demo devices and entirely synthetic patient records. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of data-flow inventory, access controls, log scrubbing, deletion, and retest evidence. An independent rerun must reproduce the failure and confirm the remediation before closure.'),
    ('00000000-0000-4000-8000-000000000227', 'software-supply-chain-clinic', 'Dependency Substitution Bounty', 'Find how software build dependencies could fail under adversarial pressure, then prove the repair inside an owner-approved test environment.', 'Dependency Substitution Bounty is a permissioned defensive challenge focused on software build dependencies. The sponsor provides an isolated build environment with synthetic packages and disposable signing keys. Authorized reviewers reproduce a bounded failure, document impact without collecting real-world private data, and verify a practical fix. No production access, destructive testing, deployment authority, custody, or payout is granted by Ideascape.', 'A malicious or compromised actor could replace a trusted package or artifact without detection in the build path. The result could undermine safety, privacy, availability, or trust while appearing normal to an operator.', 'Testing is limited to an isolated build environment with synthetic packages and disposable signing keys. Reviewers need written permission, must follow the published rules of engagement, may not touch production or third-party assets, and must stop on unexpected data or impact.', 'Submit a minimal reproduction against the supplied fixture, timestamped observations, impact boundaries, and evidence of pinning, signatures, provenance attestations, clean rebuilds, and incident rollback. An independent rerun must reproduce the failure and confirm the remediation before closure.')
)
update public.ideas as ideas
set
  title = bounty_catalog.title,
  summary = bounty_catalog.summary,
  description = bounty_catalog.description,
  threat_scenario = bounty_catalog.threat_scenario,
  control_boundary = bounty_catalog.control_boundary,
  proof_required = bounty_catalog.proof_required
from bounty_catalog,
  ideascape_bounty_seed_manifest as manifest
where ideas.id = bounty_catalog.id::uuid
  and ideas.slug = bounty_catalog.slug
  and ideas.id = manifest.id
  and ideas.slug = manifest.slug
  and (
    ideas.title,
    ideas.summary,
    ideas.description,
    ideas.threat_scenario,
    ideas.control_boundary,
    ideas.proof_required
  ) is distinct from (
    bounty_catalog.title,
    bounty_catalog.summary,
    bounty_catalog.description,
    bounty_catalog.threat_scenario,
    bounty_catalog.control_boundary,
    bounty_catalog.proof_required
  );

-- Close every superseded active question on the six deterministic examples
-- without rewriting prompts, options, or private responses. This handles both
-- the known historical seeds and unexpected drift while keeping old answers
-- attached to their original meaning.
update public.idea_validation_questions
set status = 'closed'
where idea_id in (
  '00000000-0000-4000-8000-000000000218',
  '00000000-0000-4000-8000-000000000203',
  '00000000-0000-4000-8000-000000000206',
  '00000000-0000-4000-8000-000000000204',
  '00000000-0000-4000-8000-000000000208',
  '00000000-0000-4000-8000-000000000201'
)
  and id not between '00000000-0000-4000-8000-000000000601'
    and '00000000-0000-4000-8000-000000000606'
  and status = 'active';

insert into public.idea_validation_questions (
  id,
  idea_id,
  prompt,
  status,
  created_at,
  updated_at
)
values
  ('00000000-0000-4000-8000-000000000601', '00000000-0000-4000-8000-000000000218', 'Is the Time Capsule Disclosure Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00'),
  ('00000000-0000-4000-8000-000000000602', '00000000-0000-4000-8000-000000000203', 'Is the Trip Relay Metadata Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00'),
  ('00000000-0000-4000-8000-000000000603', '00000000-0000-4000-8000-000000000206', 'Is the Repair Playbook Injection Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00'),
  ('00000000-0000-4000-8000-000000000604', '00000000-0000-4000-8000-000000000204', 'Is the Night Install Tamper Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00'),
  ('00000000-0000-4000-8000-000000000605', '00000000-0000-4000-8000-000000000208', 'Is the Outage Kit Supply-Chain Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00'),
  ('00000000-0000-4000-8000-000000000606', '00000000-0000-4000-8000-000000000201', 'Is the Smoke Sensor Spoofing Bounty ready for an authorized test run?', 'active', '2026-08-11 19:30:00+00', '2026-08-11 19:30:00+00')
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
select
  format('00000000-0000-4000-8000-%s', lpad((610 + ((question_number - 1) * 4) + option_number)::text, 12, '0'))::uuid,
  format('00000000-0000-4000-8000-%s', lpad((600 + question_number)::text, 12, '0'))::uuid,
  option_value,
  option_label,
  option_number - 1,
  '2026-08-11 19:30:00+00'::timestamptz
from generate_series(1, 6) as question_number
cross join (
  values
    (1, 'ready-for-authorized-test'::text, 'Ready for an authorized test run under the published rules of engagement'::text),
    (2, 'tighten-scope'::text, 'Needs a tighter target or stronger safeguards'::text),
    (3, 'proof-not-ready'::text, 'Proof standard is not reproducible yet'::text),
    (4, 'close-bounty'::text, 'Close this bounty without an authorized test run'::text)
) as answer(option_number, option_value, option_label)
on conflict (id) do update
set
  question_id = excluded.question_id,
  value = excluded.value,
  label = excluded.label,
  sort_order = excluded.sort_order;

-- Creator evidence is current-state evidence. Historical questions and their
-- private responses stay preserved, but are not combined with an active
-- readiness question whose answer choices have a different meaning.
create or replace function public.get_idea_validation_summary(target_idea_id uuid)
returns table (
  question_id uuid,
  prompt text,
  option_id uuid,
  option_value text,
  option_label text,
  response_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    questions.id as question_id,
    questions.prompt,
    options.id as option_id,
    options.value as option_value,
    options.label as option_label,
    count(responses.profile_id)::bigint as response_count
  from public.idea_validation_questions as questions
  join public.ideas as ideas
    on ideas.id = questions.idea_id
  join public.idea_validation_options as options
    on options.question_id = questions.id
  left join public.idea_validation_responses as responses
    on responses.question_id = questions.id
    and responses.option_id = options.id
  where questions.idea_id = target_idea_id
    and questions.status = 'active'
    and ideas.creator_id = (select auth.uid())
  group by questions.id, questions.prompt, options.id, options.value, options.label, options.sort_order
  order by options.sort_order;
$$;

update public.idea_pilots
set title = 'Time Capsule Disclosure Bounty authorized test run'
where id = '00000000-0000-4000-8000-000000000501'
  and idea_id = '00000000-0000-4000-8000-000000000218'
  and slug = 'project-time-capsule'
  and title = 'Project Time Capsule pilot';

-- The seed operator bio is mutable profile data. Rebrand it only if it still
-- equals the exact prior deterministic value; preserve any human edit.
update public.profiles
set bio = 'System owner publishing authorized targets, clear rules of engagement, and reproducible proof standards.'
where id = '00000000-0000-4000-8000-000000000101'
  and username in ('ideascape-team', 'ideascape-lab')
  and bio = 'Security operator publishing permission-first threat models, bounded controls, and reproducible proof standards.';

-- Normalize the deterministic system-owner brand only while it retains the
-- exact legacy seed value. Human-edited display names remain untouched.
update public.profiles
set display_name = 'IdeaScape Team'
where id = '00000000-0000-4000-8000-000000000101'
  and username in ('ideascape-team', 'ideascape-lab')
  and display_name = 'Ideascape Team';
