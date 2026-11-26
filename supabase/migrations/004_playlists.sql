-- User-created problem playlists (study sets by source / theme)

create table if not exists public.user_playlists (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null default '',
  problem_ids text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_playlists_user on public.user_playlists(user_id, updated_at desc);

alter table public.user_playlists enable row level security;

create policy "Users read own playlists" on public.user_playlists
  for select using (auth.uid() = user_id);
create policy "Users insert own playlists" on public.user_playlists
  for insert with check (auth.uid() = user_id);
create policy "Users update own playlists" on public.user_playlists
  for update using (auth.uid() = user_id);
create policy "Users delete own playlists" on public.user_playlists
  for delete using (auth.uid() = user_id);

grant select, insert, update, delete on table public.user_playlists to authenticated;
