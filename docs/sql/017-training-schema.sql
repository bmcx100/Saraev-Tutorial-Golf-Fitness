-- ============================================================
-- Spec 017: Supabase Training Schema
-- Run this in the Supabase dashboard SQL editor.
-- ============================================================

-- ── 1. speed_sessions ────────────────────────────────────────

create table public.speed_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  session_date   date not null,
  protocol       text not null,
  normal_stance  jsonb not null default '{}',
  step_drill     jsonb not null default '{}',
  max_out_green  smallint,
  max_out_driver smallint,
  completed_at   timestamptz not null,
  created_at     timestamptz not null default now(),

  constraint speed_sessions_one_per_day unique (user_id, session_date)
);

create index speed_sessions_user_date
  on public.speed_sessions (user_id, session_date desc);

-- ── 2. strength_sessions ─────────────────────────────────────

create table public.strength_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  session_date   date not null,
  protocol       text not null,
  workout_day    text not null
                   check (workout_day in ('legs1', 'pull', 'legs2', 'push')),
  exercises      jsonb not null default '[]',
  completed_at   timestamptz not null,
  created_at     timestamptz not null default now(),

  constraint strength_sessions_one_per_day unique (user_id, session_date)
);

create index strength_sessions_user_date
  on public.strength_sessions (user_id, session_date desc);

-- ── 3. speed_stats ───────────────────────────────────────────

create table public.speed_stats (
  user_id                 uuid primary key references auth.users(id) on delete cascade,
  driver_pr_mph           smallint,
  driver_pr_date          date,
  previous_driver_pr_mph  smallint,
  previous_driver_pr_date date,
  last_session_date       date,
  updated_at              timestamptz not null default now()
);

-- ── 4. strength_stats ────────────────────────────────────────

create table public.strength_stats (
  user_id                  uuid primary key references auth.users(id) on delete cascade,
  exercise_prs             jsonb not null default '{}',
  streak_days              integer not null default 0,
  streak_last_session_date date,
  best_streak              integer not null default 0,
  last_pr                  jsonb,
  updated_at               timestamptz not null default now()
);

-- ── 5. exercise_defaults ─────────────────────────────────────

create table public.exercise_defaults (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  defaults    jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);

-- ── 6. training_state ────────────────────────────────────────

create table public.training_state (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  last_workout_day  text check (last_workout_day in ('legs1', 'pull', 'legs2', 'push')),
  updated_at        timestamptz not null default now()
);

-- ── 7. Row Level Security ────────────────────────────────────

-- speed_sessions
alter table public.speed_sessions enable row level security;
create policy "Users manage own speed sessions"
  on public.speed_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- strength_sessions
alter table public.strength_sessions enable row level security;
create policy "Users manage own strength sessions"
  on public.strength_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- speed_stats
alter table public.speed_stats enable row level security;
create policy "Users manage own speed stats"
  on public.speed_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- strength_stats
alter table public.strength_stats enable row level security;
create policy "Users manage own strength stats"
  on public.strength_stats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- exercise_defaults
alter table public.exercise_defaults enable row level security;
create policy "Users manage own exercise defaults"
  on public.exercise_defaults for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- training_state
alter table public.training_state enable row level security;
create policy "Users manage own training state"
  on public.training_state for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
