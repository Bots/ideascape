create type public.pilot_authorization_basis as enum (
  'owner',
  'maintainer',
  'written_authorization'
);

create type public.pilot_application_status as enum (
  'submitted',
  'under_review',
  'accepted',
  'waitlisted',
  'declined',
  'withdrawn'
);

create function public.is_ideascape_operator()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    (select auth.jwt()) -> 'app_metadata' ->> 'ideascape_role' = 'operator',
    false
  );
$$;

revoke all on function public.is_ideascape_operator() from public;
revoke all on function public.is_ideascape_operator() from anon;
grant execute on function public.is_ideascape_operator() to authenticated;

create table public.idea_pilot_applications (
  id uuid primary key default gen_random_uuid(),
  pilot_id uuid not null references public.idea_pilots (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  project_name text not null,
  project_summary text not null,
  repository_url text,
  primary_stack text not null,
  authorization_basis public.pilot_authorization_basis not null,
  status public.pilot_application_status not null default 'submitted',
  authorization_confirmed boolean not null,
  safety_confirmed boolean not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint idea_pilot_applications_one_per_member
    unique (pilot_id, applicant_id),
  constraint idea_pilot_applications_project_name_length
    check (char_length(project_name) between 3 and 120),
  constraint idea_pilot_applications_summary_length
    check (char_length(project_summary) between 30 and 1500),
  constraint idea_pilot_applications_stack_length
    check (char_length(primary_stack) between 2 and 120),
  constraint idea_pilot_applications_repository_url
    check (
      repository_url is null
      or (
        char_length(repository_url) between 12 and 2000
        and repository_url ~ '^https://[^[:space:]]+$'
      )
    ),
  constraint idea_pilot_applications_confirmations
    check (authorization_confirmed and safety_confirmed)
);

create index idea_pilot_applications_status_idx
  on public.idea_pilot_applications (pilot_id, status, created_at);

create index idea_pilot_applications_applicant_idx
  on public.idea_pilot_applications (applicant_id, updated_at desc);

create function public.enforce_pilot_application_identity()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id <> old.id
    or new.pilot_id <> old.pilot_id
    or new.applicant_id <> old.applicant_id
    or new.created_at <> old.created_at
  then
    raise exception using
      errcode = '42501',
      message = 'Pilot application identity fields are immutable.';
  end if;

  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger enforce_pilot_application_identity
before update on public.idea_pilot_applications
for each row execute function public.enforce_pilot_application_identity();

alter table public.idea_pilot_applications enable row level security;

create policy "Members and operators can read private pilot applications"
on public.idea_pilot_applications
for select
to authenticated
using (
  applicant_id = (select auth.uid())
  or (select public.is_ideascape_operator())
);

create policy "Members can apply to recruiting pilots"
on public.idea_pilot_applications
for insert
to authenticated
with check (
  applicant_id = (select auth.uid())
  and status = 'submitted'
  and authorization_confirmed
  and safety_confirmed
  and exists (
    select 1
    from public.idea_pilots
    where idea_pilots.id = idea_pilot_applications.pilot_id
      and idea_pilots.status = 'recruiting'
  )
);

create policy "Members can revise or withdraw submitted applications"
on public.idea_pilot_applications
for update
to authenticated
using (
  applicant_id = (select auth.uid())
  and status in ('submitted', 'withdrawn')
)
with check (
  applicant_id = (select auth.uid())
  and status in ('submitted', 'withdrawn')
  and authorization_confirmed
  and safety_confirmed
);

create policy "Operators can review pilot applications"
on public.idea_pilot_applications
for update
to authenticated
using ((select public.is_ideascape_operator()))
with check ((select public.is_ideascape_operator()));

revoke all on table public.idea_pilot_applications from anon, authenticated;
grant select, insert, update on table public.idea_pilot_applications to authenticated;

comment on table public.idea_pilot_applications is
  'Private, permission-first applications for a capped pilot. Visible only to the applicant and trusted operators.';

comment on column public.idea_pilot_applications.repository_url is
  'Optional HTTPS project reference. Applicants must never include embedded credentials or secrets.';

comment on column public.idea_pilot_applications.safety_confirmed is
  'Confirms the proposed archive excludes secrets, live credentials, private production data, and unauthorized proprietary source.';
