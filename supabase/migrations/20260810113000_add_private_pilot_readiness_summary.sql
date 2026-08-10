create function public.get_pilot_readiness_summary(target_pilot_id uuid)
returns table (
  pilot_id uuid,
  meaningful_signal_count bigint,
  participant_response_count bigint,
  project_response_count bigint,
  active_application_count bigint,
  accepted_application_count bigint,
  remaining_capacity bigint,
  recommendation text
)
language sql
stable
security definer
set search_path = ''
as $$
  with authorized_pilot as (
    select
      pilots.id,
      pilots.idea_id,
      pilots.created_at,
      pilots.evidence_window_days,
      pilots.continue_participant_threshold,
      pilots.continue_project_threshold,
      pilots.archive_signal_ceiling,
      pilots.project_capacity
    from public.idea_pilots as pilots
    join public.ideas as ideas
      on ideas.id = pilots.idea_id
    where pilots.id = target_pilot_id
      and (
        ideas.creator_id = (select auth.uid())
        or (select public.is_ideascape_operator())
      )
  ),
  evidence as (
    select
      pilots.id as pilot_id,
      (
        select count(*)
        from public.idea_interests as interests
        where interests.idea_id = pilots.idea_id
          and interests.participation_intent in ('use', 'build', 'pilot', 'expertise')
      )::bigint as meaningful_signal_count,
      (
        select count(*)
        from public.idea_validation_responses as responses
        join public.idea_validation_questions as questions
          on questions.id = responses.question_id
        where questions.idea_id = pilots.idea_id
      )::bigint as participant_response_count,
      (
        select count(*)
        from public.idea_validation_responses as responses
        join public.idea_validation_questions as questions
          on questions.id = responses.question_id
        join public.idea_validation_options as options
          on options.question_id = responses.question_id
          and options.id = responses.option_id
        where questions.idea_id = pilots.idea_id
          and options.value in (
            'open-source-project',
            'coursework-research-tool',
            'creative-software',
            'civic-community-application'
          )
      )::bigint as project_response_count,
      (
        select count(*)
        from public.idea_pilot_applications as applications
        where applications.pilot_id = pilots.id
          and applications.status in ('submitted', 'under_review', 'accepted', 'waitlisted')
      )::bigint as active_application_count,
      (
        select count(*)
        from public.idea_pilot_applications as applications
        where applications.pilot_id = pilots.id
          and applications.status = 'accepted'
      )::bigint as accepted_application_count,
      pilots.created_at,
      pilots.evidence_window_days,
      pilots.continue_participant_threshold,
      pilots.continue_project_threshold,
      pilots.archive_signal_ceiling,
      pilots.project_capacity
    from authorized_pilot as pilots
  )
  select
    evidence.pilot_id,
    evidence.meaningful_signal_count,
    evidence.participant_response_count,
    evidence.project_response_count,
    evidence.active_application_count,
    evidence.accepted_application_count,
    greatest(
      evidence.project_capacity::bigint - evidence.accepted_application_count,
      0::bigint
    ) as remaining_capacity,
    case
      when evidence.participant_response_count >= evidence.continue_participant_threshold
        and evidence.project_response_count >= evidence.continue_project_threshold
        then 'continue'
      when timezone('utc', now()) >= evidence.created_at + make_interval(days => evidence.evidence_window_days)
        and evidence.meaningful_signal_count <= evidence.archive_signal_ceiling
        then 'archive'
      when timezone('utc', now()) >= evidence.created_at + make_interval(days => evidence.evidence_window_days)
        then 'revise'
      else 'pending'
    end as recommendation
  from evidence;
$$;

revoke all on function public.get_pilot_readiness_summary(uuid) from public;
revoke all on function public.get_pilot_readiness_summary(uuid) from anon;
grant execute on function public.get_pilot_readiness_summary(uuid) to authenticated;

comment on function public.get_pilot_readiness_summary(uuid) is
  'Returns aggregate pilot evidence and a threshold-based decision preview only to the concept creator or a trusted operator; no member identities are included.';
