alter table public.ideas
add column threat_scenario text,
add column control_boundary text,
add column proof_required text,
add constraint ideas_threat_scenario_length check (
  threat_scenario is null or char_length(threat_scenario) between 40 and 500
),
add constraint ideas_control_boundary_length check (
  control_boundary is null or char_length(control_boundary) between 40 and 500
),
add constraint ideas_proof_required_length check (
  proof_required is null or char_length(proof_required) between 40 and 500
);

comment on column public.ideas.threat_scenario is
  'Concrete failure path the concept must address before expansion.';
comment on column public.ideas.control_boundary is
  'Permission, privacy, safety, or fail-safe boundary for the concept pilot.';
comment on column public.ideas.proof_required is
  'Measurable evidence required before the concept earns a larger test.';

update public.ideas as ideas
set
  threat_scenario = security_cases.threat_scenario,
  control_boundary = security_cases.control_boundary,
  proof_required = security_cases.proof_required,
  updated_at = '2026-08-10 16:00:00+00'
from (
  values
    (
      'clean-air-library',
      'A poorly matched or maintained purifier could create false confidence while smoke exposure remains unsafe for residents with respiratory risk.',
      'The trial uses room-matched, non-ozone-generating units, documented filter custody, voluntary indoor readings, and no collection of names or medical histories.',
      'Expand only if checkout works within the drill window, indoor PM2.5 falls by the published target at both sites, and every filter is accounted for.'
    ),
    (
      'repair-commons',
      'Unsafe repairs, undocumented parts, or work beyond a mentor''s competence could damage property or expose neighbors to electrical and mechanical hazards.',
      'Owners authorize each repair; mentors stop at mains voltage, batteries, pressure vessels, or structural work unless a qualified professional and approved procedure are present.',
      'Advance only after repair outcomes, repeat failures, tool incidents, and safe-stop referrals are logged across the pilot with no unresolved safety event.'
    ),
    (
      'neighbor-ride-credits',
      'An informal dispatch program could expose trip details, strand riders, or create an unlicensed transport service without reliable accessibility.',
      'The pilot shares only minimum scheduling data with a licensed accessible transport partner, collects no fares, and promises no ride until the partner confirms it.',
      'Continue only if the clinic referral flow closes the target share of essential trips, missed pickups stay below the published limit, and riders confirm accessibility.'
    ),
    (
      'after-dark-storefronts',
      'Lighting and art intended to increase welcome could create glare, surveillance concerns, electrical hazards, or inaccessible sidewalk conditions.',
      'Installations require owner permission, listed equipment, timed shutoff, no cameras or microphones, an unobstructed accessible path, and an immediate takedown contact.',
      'Expand only if baseline-versus-pilot observations show the stated attention and welcome gains without complaints, accessibility failures, or unresolved electrical issues.'
    ),
    (
      'shade-stop-network',
      'Unapproved shade hardware or incomplete measurements could obstruct boarding, sightlines, drainage, or circulation while misrepresenting transit conditions.',
      'Teams collect infrastructure measurements without faces or trip histories; nothing enters the right-of-way without written agency, property, accessibility, and wind-safety approval.',
      'Proceed only after at least 45 complete stop audits, five independently verified priority packets, five acknowledged case numbers, and one permitted corrective design.'
    ),
    (
      'skill-swap-saturdays',
      'A short workshop could spread unsafe or inaccurate repair instructions that participants later apply beyond the demonstrated scope.',
      'Each session uses low-risk tasks, a named safety check, mentor stop authority, accessible instruction, and a one-page guide tested only on the covered device or material.',
      'Repeat only after at least twelve participants perform the skill unassisted, the guide reproduces the result, and every error or near miss is incorporated.'
    ),
    (
      'civic-accessibility-lab',
      'Field observation or an unauthorized demonstration could put participants in traffic, capture identifying data, or create a new inaccessible route.',
      'Observers stay on lawful public paths, record no faces or plates, never direct traffic, and install nothing without city authorization, traffic control, and accessible detours.',
      'Advance only after 100 usable observations, 40 accessibility audits, affected-user agreement on the top failure, and a city-accepted packet with a response or permitted test.'
    ),
    (
      'block-ready-kits',
      'Shared outage equipment may be missing, inaccessible, unsafe to operate, or controlled by people unavailable when power fails.',
      'Named stewards inventory sealed equipment, follow manufacturer limits, avoid backfeeding or improvised wiring, and provide accessible alerts without resident tracking.',
      'Continue only if every item is located, inventoried, and safely deployed within 20 minutes during the drill, with gaps assigned and corrected before a repeat.'
    ),
    (
      'device-liberation-lab',
      'Firmware modification can become unauthorized access, disable safety features, expose data, or permanently brick equipment.',
      'Work requires owner authorization and model-specific recovery steps; the clinic refuses stolen, managed, leased, or third-party devices and never offers credential bypass.',
      'Expand only after test devices can be restored, data is backed up, safety functions remain intact, and outcomes document failures as well as successful installs.'
    ),
    (
      'file-rescue-cooperative',
      'Recovery work can expose intimate files, overwrite the only copy, or retain customer data after the job ends.',
      'The owner gives written consent and scope; technicians use write blockers where appropriate, minimize previews, encrypt working copies, isolate media, and verify deletion at handoff.',
      'Continue only if recovered files pass agreed checksums or spot checks, every device and working copy is reconciled, and no access or retention exception remains unresolved.'
    ),
    (
      'cloud-exit-toolkit',
      'Exports can silently omit files, corrupt metadata, leak credentials, or leave people believing they have a complete backup when they do not.',
      'Tools use least-privilege user tokens, never store account passwords, write to user-controlled storage, redact logs, and make no deletion request against the source service.',
      'Advance only when representative exports reconcile file counts, checksums, folder structure, and metadata against the source, with failures visible and repeatable.'
    ),
    (
      'private-ai-workbench',
      'A local model can still leak sensitive documents through telemetry, network calls, prompt logs, insecure indexes, or an overbroad filesystem scope.',
      'Approved folders stay on the device; model, index, and interface run offline by default with encrypted storage, explicit retention controls, and no hidden analytics.',
      'Expand only after network-denial tests, deletion tests, access-boundary checks, and a representative task benchmark all pass on the documented workstation image.'
    ),
    (
      'home-lab-defense-clinic',
      'Internet-exposed services, stale firmware, flat networks, weak recovery plans, and undocumented admin access can turn a home lab into a pivot point.',
      'The clinic touches participant-owned systems only under written scope, makes backups before changes, uses no persistence, and leaves owners with an access and rollback record.',
      'Continue only when scoped exposures are rechecked, critical updates or mitigations are verified, segmentation works, and a restore drill succeeds without technician-only secrets.'
    ),
    (
      'community-compute-cooperative',
      'Shared accelerators can leak member data, hide abusive workloads, exhaust power, or let one operator control access and billing without accountability.',
      'Jobs run in isolated member workspaces under a published acceptable-use policy, resource quotas, transparent scheduling, minimal logs, and separated operator privileges.',
      'Expand only after isolation, quota, deletion, incident-response, power, and scheduling tests pass under concurrent pilot workloads with auditable aggregate reporting.'
    ),
    (
      'offline-mesh-field-kit',
      'An emergency mesh could expose participant locations, relay abuse, interfere with licensed services, or fail exactly when cellular service is unavailable.',
      'Nodes use legal spectrum, opt-in relays, rotating identifiers, minimal message retention, authenticated administration, and no promise of private or life-safety-critical delivery.',
      'Advance only after an offline field drill verifies range, delivery, battery, relay removal, lost-node revocation, and a documented fallback when messages fail.'
    ),
    (
      'open-repair-atlas',
      'Incorrect diagnostics, counterfeit parts, leaked manuals, or advice for equipment outside a contributor''s authority can create safety and legal harm.',
      'Entries require lawful provenance, device ownership or service authority, hazard labels, source citations, revision history, and exclusion of leaked or access-bypass material.',
      'Expand only when independent maintainers reproduce a sample of repairs, part matches and safety notes survive review, and disputed guidance can be corrected or withdrawn.'
    ),
    (
      'accessible-interface-retrofit-lab',
      'An assistive retrofit can override user intent, create unsafe automation, expose disability information, or leave a person dependent on a fragile prototype.',
      'The participant controls goals and consent; prototypes minimize personal data, preserve manual operation, fail safely, and undergo caregiver or clinician review when the risk requires it.',
      'Continue only after the participant completes agreed tasks across repeated sessions, can disable or reverse the retrofit, and reports no unresolved safety or autonomy failure.'
    ),
    (
      'project-time-capsule',
      'An archive may preserve secrets, unauthorized code, unverifiable dependencies, or a build that works only inside the original maintainer''s environment.',
      'Only owner-authorized material enters; secrets and private production data are excluded, licenses and checksums are recorded, and builds run in an isolated clean environment.',
      'Advance only when an independent person rebuilds the project from the capsule, verifies outputs and provenance, and documents every unresolved dependency or permission gap.'
    ),
    (
      'waste-heat-works',
      'A heat-recovery retrofit could overheat compute equipment, contaminate occupied space, create pressure or condensation hazards, or hide poor energy economics.',
      'The skid remains isolated from production cooling, uses licensed engineering review, monitored temperatures and leaks, automatic bypass, and a fail-back to the original cooling path.',
      'Expand only after measured useful heat, compute temperatures, pump energy, air or water quality, and fail-back behavior meet published limits through the full pilot.'
    ),
    (
      'model-commons-lab',
      'A model comparison can expose sensitive task data, reward benchmark gaming, or imply trustworthiness beyond the specific tests performed.',
      'The rack stays offline, accepts participant-approved task packs, records model and harness versions, separates evaluators from model selection, and publishes known test limits.',
      'Advance only when runs are reproducible across operators, task data is deleted as promised, scoring discrepancies are explained, and no claim exceeds the measured benchmark.'
    ),
    (
      'glass-box-sensor-network',
      'Networked plate readers can create a searchable movement history with weak retention, broad sharing, opaque searches, and no evidence that the intrusion improves safety.',
      'The campaign uses public records and lawful observation only, publishes no private plates or operational blind spots, and permits no tampering, trespass, harassment, or evasion guidance.',
      'Proceed only after at least 90% of the known inventory has source-linked contracts, retention and sharing rules, with a hearing request and independent review sponsor documented.'
    )
) as security_cases(slug, threat_scenario, control_boundary, proof_required)
where ideas.slug = security_cases.slug
  and ideas.creator_id = '00000000-0000-4000-8000-000000000101';
