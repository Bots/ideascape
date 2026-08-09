create function public.get_idea_interest_counts(target_idea_ids uuid[])
returns table (
  idea_id uuid,
  interest_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    ideas.id as idea_id,
    count(interests.profile_id)::bigint as interest_count
  from public.ideas as ideas
  left join public.idea_interests as interests
    on interests.idea_id = ideas.id
  where ideas.id = any(target_idea_ids)
    and ideas.status = 'published'
  group by ideas.id;
$$;

revoke all on function public.get_idea_interest_counts(uuid[]) from public;
grant execute on function public.get_idea_interest_counts(uuid[]) to anon, authenticated;
