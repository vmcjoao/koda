-- Koda initial schema
create extension if not exists "pgcrypto";

create table if not exists public.tag_catalog (
  id text primary key,
  kind text not null check (kind in ('paradigm', 'algorithm', 'data_structure', 'complexity', 'twist')),
  label text not null,
  aliases text[] not null default '{}'
);

create table if not exists public.problems (
  id text primary key,
  title text not null,
  source text not null,
  url text,
  difficulty_rating integer not null default 1200,
  statement_md text not null,
  constraints_text text not null,
  sample_io jsonb not null default '[]'::jsonb,
  target_complexity text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.solution_approaches (
  id text primary key,
  problem_id text not null references public.problems(id) on delete cascade,
  approach_name text not null,
  paradigms text[] not null default '{}',
  algorithms text[] not null default '{}',
  data_structures text[] not null default '{}',
  key_insights text[] not null default '{}',
  editorial_summary_md text not null default ''
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  rating_band integer not null default 1200,
  streak integer not null default 0,
  xp integer not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.user_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null references public.problems(id) on delete cascade,
  timestamp timestamptz not null default now(),
  time_spent_sec integer not null default 0,
  selected_paradigms text[] not null default '{}',
  selected_algorithms text[] not null default '{}',
  selected_ds text[] not null default '{}',
  selected_twists text[] not null default '{}',
  guessed_complexity text,
  complexity_bonus boolean not null default false,
  user_twist_notes text,
  pseudocode_draft text,
  score_accuracy integer not null default 0,
  matched_approach_id text references public.solution_approaches(id) on delete set null,
  status text not null default 'drafted'
    check (status in ('drafted', 'needs_review', 'implemented_ac')),
  mistake_types text[] not null default '{}'
);

create table if not exists public.user_problem_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null references public.problems(id) on delete cascade,
  is_solved boolean not null default false,
  attempt_count integer not null default 0,
  next_review_date date,
  best_score integer not null default 0,
  primary key (user_id, problem_id)
);

create index if not exists idx_approaches_problem on public.solution_approaches(problem_id);
create index if not exists idx_attempts_user on public.user_attempts(user_id, timestamp desc);
create index if not exists idx_attempts_status on public.user_attempts(user_id, status);
create index if not exists idx_problem_state_review on public.user_problem_state(user_id, next_review_date);

alter table public.tag_catalog enable row level security;
alter table public.problems enable row level security;
alter table public.solution_approaches enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_attempts enable row level security;
alter table public.user_problem_state enable row level security;

-- Public read for catalog content
create policy "Anyone can read tags" on public.tag_catalog for select using (true);
create policy "Anyone can read problems" on public.problems for select using (true);
create policy "Anyone can read approaches" on public.solution_approaches for select using (true);

-- Profiles: own row only
create policy "Users read own profile" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy "Users insert own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);
create policy "Users update own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

-- Attempts: own rows
create policy "Users read own attempts" on public.user_attempts
  for select using (auth.uid() = user_id);
create policy "Users insert own attempts" on public.user_attempts
  for insert with check (auth.uid() = user_id);
create policy "Users update own attempts" on public.user_attempts
  for update using (auth.uid() = user_id);
create policy "Users delete own attempts" on public.user_attempts
  for delete using (auth.uid() = user_id);

-- Problem state: own rows
create policy "Users read own problem state" on public.user_problem_state
  for select using (auth.uid() = user_id);
create policy "Users upsert own problem state" on public.user_problem_state
  for insert with check (auth.uid() = user_id);
create policy "Users update own problem state" on public.user_problem_state
  for update using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
