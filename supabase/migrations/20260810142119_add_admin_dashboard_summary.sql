create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create table private.ideascape_admins (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  constraint ideascape_admins_normalized_email
    check (
      email = lower(email)
      and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      and char_length(email) <= 320
    )
);

alter table private.ideascape_admins enable row level security;

revoke all on table private.ideascape_admins from public;
revoke all on table private.ideascape_admins from anon;
revoke all on table private.ideascape_admins from authenticated;

insert into private.ideascape_admins (email)
values ('botsone@gmail.com')
on conflict (email) do nothing;

create function public.is_ideascape_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and (
      coalesce(
        (select auth.jwt()) -> 'app_metadata' ->> 'ideascape_role' = 'operator',
        false
      )
      or exists (
        select 1
        from private.ideascape_admins as admins
        where admins.email = lower(
          coalesce((select auth.jwt()) ->> 'email', '')
        )
      )
    );
$$;

revoke all on function public.is_ideascape_admin() from public;
revoke all on function public.is_ideascape_admin() from anon;
grant execute on function public.is_ideascape_admin() to authenticated;

comment on function public.is_ideascape_admin() is
  'Returns whether the authenticated caller is a trusted operator or appears in the private normalized-email admin allowlist.';

create function public.get_admin_dashboard_summary()
returns table (
  member_count bigint,
  idea_count bigint,
  published_idea_count bigint,
  draft_idea_count bigint,
  interest_signal_count bigint,
  meaningful_signal_count bigint,
  validation_response_count bigint,
  pilot_count bigint,
  open_application_count bigint,
  accepted_application_count bigint,
  generated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select count(*) from public.profiles)::bigint as member_count,
    (select count(*) from public.ideas)::bigint as idea_count,
    (
      select count(*)
      from public.ideas
      where status = 'published'
    )::bigint as published_idea_count,
    (
      select count(*)
      from public.ideas
      where status = 'draft'
    )::bigint as draft_idea_count,
    (select count(*) from public.idea_interests)::bigint
      as interest_signal_count,
    (
      select count(*)
      from public.idea_interests
      where participation_intent in ('use', 'build', 'pilot', 'expertise')
    )::bigint as meaningful_signal_count,
    (select count(*) from public.idea_validation_responses)::bigint
      as validation_response_count,
    (select count(*) from public.idea_pilots)::bigint as pilot_count,
    (
      select count(*)
      from public.idea_pilot_applications
      where status in ('submitted', 'under_review', 'waitlisted')
    )::bigint as open_application_count,
    (
      select count(*)
      from public.idea_pilot_applications
      where status = 'accepted'
    )::bigint as accepted_application_count,
    timezone('utc', now()) as generated_at
  where public.is_ideascape_admin();
$$;

revoke all on function public.get_admin_dashboard_summary() from public;
revoke all on function public.get_admin_dashboard_summary() from anon;
grant execute on function public.get_admin_dashboard_summary() to authenticated;

comment on function public.get_admin_dashboard_summary() is
  'Returns aggregate-only operational counts to authenticated Ideascape admins; no member identities, response histories, draft content, or application details are included.';

create function public.get_admin_idea_activity()
returns table (
  idea_id uuid,
  slug text,
  title text,
  category_name text,
  interest_signal_count bigint,
  validation_response_count bigint,
  pilot_application_count bigint,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ideas.id as idea_id,
    ideas.slug,
    ideas.title,
    categories.name as category_name,
    (
      select count(*)
      from public.idea_interests as interests
      where interests.idea_id = ideas.id
    )::bigint as interest_signal_count,
    (
      select count(*)
      from public.idea_validation_responses as responses
      join public.idea_validation_questions as questions
        on questions.id = responses.question_id
      where questions.idea_id = ideas.id
    )::bigint as validation_response_count,
    (
      select count(*)
      from public.idea_pilot_applications as applications
      join public.idea_pilots as pilots
        on pilots.id = applications.pilot_id
      where pilots.idea_id = ideas.id
    )::bigint as pilot_application_count,
    ideas.updated_at
  from public.ideas as ideas
  left join public.categories as categories
    on categories.id = ideas.category_id
  where public.is_ideascape_admin()
    and ideas.status = 'published'
  order by
    (
      (select count(*) from public.idea_interests as interests where interests.idea_id = ideas.id)
      +
      (
        select count(*)
        from public.idea_validation_responses as responses
        join public.idea_validation_questions as questions
          on questions.id = responses.question_id
        where questions.idea_id = ideas.id
      )
      +
      (
        select count(*)
        from public.idea_pilot_applications as applications
        join public.idea_pilots as pilots
          on pilots.id = applications.pilot_id
        where pilots.idea_id = ideas.id
      )
    ) desc,
    ideas.updated_at desc,
    ideas.title
  limit 12;
$$;

revoke all on function public.get_admin_idea_activity() from public;
revoke all on function public.get_admin_idea_activity() from anon;
grant execute on function public.get_admin_idea_activity() to authenticated;

comment on function public.get_admin_idea_activity() is
  'Returns aggregate activity for published concepts to authenticated Ideascape admins; private drafts and member-level rows are excluded.';
