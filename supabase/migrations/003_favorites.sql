-- Cloud favorites (sync with local AsyncStorage koda.favorites)

create table if not exists public.user_favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null references public.problems(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, problem_id)
);

create index if not exists idx_favorites_user on public.user_favorites(user_id);

alter table public.user_favorites enable row level security;

create policy "Users read own favorites" on public.user_favorites
  for select using (auth.uid() = user_id);
create policy "Users insert own favorites" on public.user_favorites
  for insert with check (auth.uid() = user_id);
create policy "Users delete own favorites" on public.user_favorites
  for delete using (auth.uid() = user_id);

grant select, insert, delete on table public.user_favorites to authenticated;
