create type public.idea_pilot_status as enum (
  'validating',
  'recruiting',
  'active',
  'completed',
  'paused',
  'archived'
);

create type public.idea_pilot_decision as enum (
  'pending',
  'continue',
  'revise',
  'pause',
  'archive'
);

create table public.idea_pilots (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null unique references public.ideas (id) on delete cascade,
  slug text not null unique,
  title text not null,
  status public.idea_pilot_status not null default 'validating',
  decision public.idea_pilot_decision not null default 'pending',
  evidence_window_days smallint not null default 30,
  signal_goal smallint not null default 15,
  continue_participant_threshold smallint not null default 5,
  continue_project_threshold smallint not null default 3,
  interview_goal smallint not null default 5,
  archive_signal_ceiling smallint not null default 2,
  project_capacity smallint not null default 3,
  decision_rationale text,
  decided_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint idea_pilots_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 80),
  constraint idea_pilots_title_length
    check (char_length(title) between 3 and 120),
  constraint idea_pilots_evidence_window_range
    check (evidence_window_days between 7 and 180),
  constraint idea_pilots_signal_goal_range
    check (signal_goal between 1 and 1000),
  constraint idea_pilots_participant_threshold_range
    check (continue_participant_threshold between 1 and 100),
  constraint idea_pilots_project_threshold_range
    check (continue_project_threshold between 1 and 100),
  constraint idea_pilots_interview_goal_range
    check (interview_goal between 0 and 100),
  constraint idea_pilots_archive_ceiling_range
    check (archive_signal_ceiling between 0 and 99),
  constraint idea_pilots_capacity_range
    check (project_capacity between 1 and 100),
  constraint idea_pilots_archive_below_signal_goal
    check (archive_signal_ceiling < signal_goal),
  constraint idea_pilots_project_goal_within_capacity
    check (continue_project_threshold <= project_capacity),
  constraint idea_pilots_decision_metadata
    check (
      (decision = 'pending' and decision_rationale is null and decided_at is null)
      or (
        decision <> 'pending'
        and char_length(decision_rationale) between 20 and 2000
        and decided_at is not null
      )
    )
);

create index idea_pilots_status_idx
  on public.idea_pilots (status, created_at desc);

create function public.set_idea_pilot_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger set_idea_pilot_updated_at
before update on public.idea_pilots
for each row execute function public.set_idea_pilot_updated_at();

alter table public.idea_pilots enable row level security;

create policy "Published pilot plans are publicly readable"
on public.idea_pilots
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.ideas
    where ideas.id = idea_pilots.idea_id
      and ideas.status = 'published'
  )
);

revoke all on table public.idea_pilots from anon, authenticated;
grant select on table public.idea_pilots to anon, authenticated;

comment on table public.idea_pilots is
  'Public pilot lifecycle plans and decision thresholds; no participant-level data is stored here.';

comment on column public.idea_pilots.archive_signal_ceiling is
  'Archive when meaningful signals remain at or below this value after deliberate outreach.';

insert into public.idea_pilots (
  id,
  idea_id,
  slug,
  title,
  status,
  decision,
  evidence_window_days,
  signal_goal,
  continue_participant_threshold,
  continue_project_threshold,
  interview_goal,
  archive_signal_ceiling,
  project_capacity,
  created_at,
  updated_at
)
values (
  '00000000-0000-4000-8000-000000000501',
  '00000000-0000-4000-8000-000000000218',
  'project-time-capsule',
  'Project Time Capsule pilot',
  'validating',
  'pending',
  30,
  15,
  5,
  3,
  5,
  2,
  3,
  '2026-08-10 11:11:31+00',
  '2026-08-10 11:11:31+00'
)
on conflict (id) do update
set
  idea_id = excluded.idea_id,
  slug = excluded.slug,
  title = excluded.title,
  status = excluded.status,
  decision = excluded.decision,
  evidence_window_days = excluded.evidence_window_days,
  signal_goal = excluded.signal_goal,
  continue_participant_threshold = excluded.continue_participant_threshold,
  continue_project_threshold = excluded.continue_project_threshold,
  interview_goal = excluded.interview_goal,
  archive_signal_ceiling = excluded.archive_signal_ceiling,
  project_capacity = excluded.project_capacity,
  updated_at = excluded.updated_at;
