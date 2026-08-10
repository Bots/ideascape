update public.ideas
set
  title = 'Shade Every Mountain Metro Stop',
  summary = 'Publish a heat-and-accessibility scorecard for Mountain Metro stops, then make the worst five impossible for city decision-makers to ignore.',
  description = $description$The city’s 2025 Mountain Metro bus-stop self-evaluation reported 984 stops: 116 rated 1 and 178 rated 2, both inaccessible categories. Shade Every Mountain Metro Stop would turn that public record into a rider-built heat and access scorecard instead of accepting another summer of bare poles, broken paths, and concrete waiting areas with nowhere to sit.

A 30-day evidence sprint would inspect 50 stops selected from the published accessibility findings and rider nominations. At three times of day, teams would record shade coverage, surface temperature, boarding-pad dimensions, sidewalk connection, seating, shelter condition, and whether a mobility-device user can reach and deploy the bus ramp. The work would collect infrastructure measurements and voluntary rider comments only—no faces, trip histories, disability diagnoses, or covert tracking. The five worst documented stops would receive a public evidence packet and formal accessibility, maintenance, or capital-improvement request with a response deadline.

Nothing would be attached to a stop, placed in the public right-of-way, or represented as city-approved without written approval from Mountain Metro, traffic engineering, affected property owners, and an accessibility and wind-safety review. Continue evidence would require complete measurements for at least 45 stops, five independently verified priority packets, acknowledged case numbers for all five, and at least one permitted corrective design or scheduled remediation. Missing records would revise the ranking; any proposal that obstructs boarding, sightlines, drainage, or safe circulation would stop.$description$,
  updated_at = '2026-08-10 13:52:32+00'
where id = '00000000-0000-4000-8000-000000000205';

update public.ideas
set
  category_id = (select id from public.categories where slug = 'community'),
  title = 'Cross Academy Alive',
  summary = 'Pick one brutal Academy Boulevard crossing, measure what pedestrians and wheelchair users actually endure, then force a permitted safety demonstration into the public record.',
  description = $description$Crossing Academy Boulevard should not require a sprint, a car, or luck. Cross Academy Alive would take one crossing identified through public crash data and lived experience, document the gap between signal timing and real human movement, and turn that evidence into a specific engineering demand rather than another general promise to improve safety someday.

The first 14-day audit would pair disabled residents, transit riders, parents, and traffic-safety volunteers at one selected intersection. Teams would time 100 crossing attempts from the sidewalk, complete at least 40 accessibility walk audits, record driver-yield behavior and near misses without capturing faces or license plates, and compare the observed route with the city’s published signal, sidewalk, and crash information. The resulting packet would name the exact failure—timing, missing refuge, curb geometry, visibility, or path continuity—and propose one low-cost demonstration plus one durable fix.

No participant would direct traffic, block a lane, enter the roadway outside the legal crossing phase, or install cones, signs, paint, barriers, or sensors. Any temporary demonstration would require written city authorization, an approved traffic-control plan, accessible detours, and announced operating hours. Continue evidence would require 100 usable observations, agreement from at least twenty affected users on the top failure, city acceptance of the evidence packet, and either a permitted demonstration date or a written engineering response. Unsafe field conditions or an inaccessible temporary design would stop the test immediately.$description$,
  updated_at = '2026-08-10 13:52:32+00'
where id = '00000000-0000-4000-8000-000000000207';

update public.ideas
set
  title = 'Flock Off Colorado Springs',
  summary = 'Map the networked plate-reader dragnet, expose its contracts and data-sharing rules, then organize a lawful campaign to remove it or force warrant-level limits.',
  description = $description$A vendor swap does not answer the basic question: should a city build a searchable history of ordinary vehicle movement at all? Flock Off Colorado Springs uses “Flock” as the familiar name for the broader networked automatic license plate reader system. The goal is explicit: make the system’s scope legible, demand a public decision, and pursue camera removal or contract nonrenewal instead of letting surveillance infrastructure become permanent by default.

A 30-day evidence sprint would use Colorado Open Records Act requests, procurement records, policy manuals, retention schedules, data-sharing agreements, and audit reports to build a source-linked inventory of city-contracted plate readers and their governing rules. Volunteers could verify equipment only from lawful public vantage points without touching it, then publish device counts, agency ownership, contract cost, retention promises, outside access, complaint paths, and gaps between policy and proof. The public release would exclude private license plates, officer identities, active investigative records, exact operational blind spots, and any instructions for evading a lawful investigation.

The campaign would allow no physical interference, trespass, lens covering, tampering, harassment, doxxing, or disruption of public safety operations. Continue evidence would require a documented answer for at least 90% of the known inventory, publication of every obtainable contract and retention rule, one hundred verified resident requests for a council hearing, and a sponsor for an independent privacy and effectiveness review. The preferred decision is removal. If officials retain any system, the fallback demand would be a short retention limit, warrant-based non-emergency access, external-sharing restrictions, immutable access logs, annual public audits, and automatic contract sunset rather than an open-ended dragnet.$description$,
  updated_at = '2026-08-10 13:52:32+00'
where id = '00000000-0000-4000-8000-000000000221';

update public.idea_media
set
  alt_text = 'A bare Mountain Metro bus stop is transformed with accessible pavement, seating, and engineered shade.'
where id = '00000000-0000-4000-8000-000000000305';

update public.idea_media
set
  alt_text = 'A wheelchair user times a permitted crossing demonstration on Academy Boulevard while observers record safety evidence.'
where id = '00000000-0000-4000-8000-000000000307';

update public.idea_media
set
  alt_text = 'A networked license plate reader is crossed out above a public records map of Colorado Springs.'
where id = '00000000-0000-4000-8000-000000000321';
