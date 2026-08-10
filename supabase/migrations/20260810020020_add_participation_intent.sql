create type public.idea_participation_intent as enum (
  'use',
  'build',
  'pilot',
  'expertise',
  'updates'
);

alter table public.idea_interests
add column participation_intent public.idea_participation_intent;

comment on column public.idea_interests.participation_intent is
  'Optional private description of how the member would participate in this concept.';

create policy "Members can update their own idea interest"
on public.idea_interests
for update
to authenticated
using ((select auth.uid()) = profile_id)
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.ideas
    where ideas.id = idea_interests.idea_id
      and ideas.status not in ('draft', 'cancelled')
  )
);

grant update on table public.idea_interests to authenticated;

drop function public.get_idea_interest_summary(uuid);

create function public.get_idea_interest_summary(target_idea_id uuid)
returns table (
  interest_count bigint,
  viewer_has_interest boolean,
  viewer_participation_intent text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    (
      select count(*)
      from public.idea_interests
      where idea_interests.idea_id = target_idea_id
    ) as interest_count,
    exists (
      select 1
      from public.idea_interests
      where idea_interests.idea_id = target_idea_id
        and idea_interests.profile_id = (select auth.uid())
    ) as viewer_has_interest,
    (
      select idea_interests.participation_intent::text
      from public.idea_interests
      where idea_interests.idea_id = target_idea_id
        and idea_interests.profile_id = (select auth.uid())
    ) as viewer_participation_intent
  from public.ideas
  where ideas.id = target_idea_id
    and ideas.status not in ('draft', 'cancelled');
$$;

revoke all on function public.get_idea_interest_summary(uuid) from public;
grant execute on function public.get_idea_interest_summary(uuid) to anon, authenticated;

comment on function public.get_idea_interest_summary(uuid) is
  'Returns a public aggregate count plus only the current member private interest state and participation intent.';
