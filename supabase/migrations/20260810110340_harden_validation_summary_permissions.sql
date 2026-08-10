-- Supabase-hosted projects may grant newly created functions directly to
-- API roles through default privileges. Keep the aggregate evidence function
-- strictly creator-scoped at both the permission and row-filter layers.
revoke execute on function public.get_idea_validation_summary(uuid) from public;
revoke execute on function public.get_idea_validation_summary(uuid) from anon;
grant execute on function public.get_idea_validation_summary(uuid) to authenticated;
