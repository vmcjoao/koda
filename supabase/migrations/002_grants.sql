-- Fix: allow Expo anon/authenticated clients to access tables (RLS still applies)
grant usage on schema public to anon, authenticated;

grant select on table public.tag_catalog to anon, authenticated;
grant select on table public.problems to anon, authenticated;
grant select on table public.solution_approaches to anon, authenticated;

grant select, insert, update on table public.user_profiles to authenticated;
grant select, insert, update, delete on table public.user_attempts to authenticated;
grant select, insert, update on table public.user_problem_state to authenticated;

-- Guest mode can still read catalog; writes go through authenticated after sign-in
grant usage, select on all sequences in schema public to authenticated;
