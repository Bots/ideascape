create table public.idea_interests (
  idea_id uuid not null references public.ideas (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (idea_id, profile_id)
);

create index idea_interests_profile_id_idx
on public.idea_interests (profile_id);

comment on table public.idea_interests is
  'Private member signals used to measure aggregate interest in public idea concepts.';

alter table public.idea_interests enable row level security;

create policy "Members can read their own idea interests"
on public.idea_interests
for select
to authenticated
using ((select auth.uid()) = profile_id);

create policy "Members can signal their own idea interest"
on public.idea_interests
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.ideas
    where ideas.id = idea_interests.idea_id
      and ideas.status not in ('draft', 'cancelled')
  )
);

create policy "Members can remove their own idea interest"
on public.idea_interests
for delete
to authenticated
using ((select auth.uid()) = profile_id);

revoke all on table public.idea_interests from anon, authenticated;
grant select, insert, delete on table public.idea_interests to authenticated;

create function public.get_idea_interest_summary(target_idea_id uuid)
returns table (
  interest_count bigint,
  viewer_has_interest boolean
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
    ) as viewer_has_interest
  from public.ideas
  where ideas.id = target_idea_id
    and ideas.status not in ('draft', 'cancelled');
$$;

revoke all on function public.get_idea_interest_summary(uuid) from public;
grant execute on function public.get_idea_interest_summary(uuid) to anon, authenticated;

comment on function public.get_idea_interest_summary(uuid) is
  'Returns a public aggregate count and only the current member private interest state.';
