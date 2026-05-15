# Spec 017: Supabase Training Schema

## What This Feature Does

Creates the Supabase Postgres tables, types, indexes, and RLS policies needed to store each user's speed and strength training data in the cloud. This is the foundation for cross-device sync, data backup, and future server-side features (leaderboards, coaching dashboards).

## Current State

All training data lives in AsyncStorage with typed wrapper functions in `utils/storage.ts`:

- **Speed sessions** — `speed-session-YYYY-MM-DD` keys storing `SpeedSession` objects (defined in `constants/speed-protocols.ts:14-21`). One session per day. Contains `normalStance` and `stepDrill` drill data (3 stick colors x dom/nonDom) plus `maxOut` speeds (green stick, driver).
- **Strength sessions** — `strength-session-YYYY-MM-DD` keys storing `StrengthSession` objects (defined in `constants/strength-protocols.ts:83-89`). One session per day. Contains `workoutDay` (legs1/pull/legs2/push) and `exercises` array with sets (weight/reps/completed).
- **Speed stats** — `speed-stats` key storing `SpeedStats` aggregate (defined in `utils/storage.ts:170-174`). Driver PR, previous driver PR, last session date.
- **Strength stats** — `strength-stats` key storing `StrengthStats` aggregate (defined in `utils/storage.ts:176-181`). Exercise PRs, streak, best streak, last PR.
- **Exercise defaults** — `strength-exercise-defaults` key storing `Record<string, { weight: number | null; reps: number }[]>`. Carried-over weight/reps per exercise across sessions.
- **Training state** — `strength-last-workout-day` key storing the last completed `WorkoutDay` for rotation tracking.

Supabase client already exists at `lib/supabase.ts` with auth configured (AES-256 encrypted sessions on native, plain AsyncStorage on web). No database tables exist yet beyond auth.

## Changes Required

### 1. Create `speed_sessions` Table

Stores one row per user per training day. Top-level fields are columns; nested drill data is JSONB.

```sql
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

create index speed_sessions_user_date on public.speed_sessions (user_id, session_date desc);
```

**JSONB shape for `normal_stance` / `step_drill`:**
```json
{
  "green": { "dom": 95, "nonDom": 88 },
  "blue":  { "dom": 102, "nonDom": 94 },
  "red":   { "dom": 110, "nonDom": 101 }
}
```

`max_out_green` and `max_out_driver` are top-level `smallint` columns (not inside JSONB) because driver speed is the primary stat queried for PRs, milestones, and future leaderboards.

### 2. Create `strength_sessions` Table

```sql
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
```

**JSONB shape for `exercises`:**
```json
[
  {
    "exerciseId": "squats",
    "sets": [
      { "weight": 135, "reps": 8, "completed": true },
      { "weight": 135, "reps": 8, "completed": true },
      { "weight": 135, "reps": 6, "completed": false }
    ]
  }
]
```

### 3. Create `speed_stats` Table

Write-time aggregate — updated whenever a speed session is saved. One row per user.

```sql
create table public.speed_stats (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  driver_pr_mph         smallint,
  driver_pr_date        date,
  previous_driver_pr_mph smallint,
  previous_driver_pr_date date,
  last_session_date     date,
  updated_at            timestamptz not null default now()
);
```

### 4. Create `strength_stats` Table

Write-time aggregate — updated whenever a strength session is saved. One row per user.

```sql
create table public.strength_stats (
  user_id                  uuid primary key references auth.users(id) on delete cascade,
  exercise_prs             jsonb not null default '{}',
  streak_days              integer not null default 0,
  streak_last_session_date date,
  best_streak              integer not null default 0,
  last_pr                  jsonb,
  updated_at               timestamptz not null default now()
);
```

**JSONB shape for `exercise_prs`:**
```json
{
  "squats": { "weight": 225, "reps": 8, "date": "2026-05-10" },
  "bench-press": { "weight": 185, "reps": 8, "date": "2026-05-08" }
}
```

**JSONB shape for `last_pr`:**
```json
{
  "exerciseId": "squats",
  "exerciseName": "Squats",
  "weight": 225,
  "date": "2026-05-10"
}
```

### 5. Create `exercise_defaults` Table

Stores carried-over weight/reps per exercise. One row per user.

```sql
create table public.exercise_defaults (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  defaults    jsonb not null default '{}',
  updated_at  timestamptz not null default now()
);
```

**JSONB shape for `defaults`:**
```json
{
  "squats": [
    { "weight": 135, "reps": 8 },
    { "weight": 135, "reps": 8 },
    { "weight": 135, "reps": 8 }
  ]
}
```

### 6. Create `training_state` Table

Rotation tracking — which workout day was last completed. One row per user.

```sql
create table public.training_state (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  last_workout_day  text check (last_workout_day in ('legs1', 'pull', 'legs2', 'push')),
  updated_at        timestamptz not null default now()
);
```

### 7. Row Level Security

All six tables follow the same pattern: users can only access their own rows.

```sql
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
```

### 8. TypeScript Types (Generated)

Create `lib/database.types.ts` with TypeScript interfaces matching the Supabase schema. These types will be used by spec 018 (sync logic) and passed to `createClient<Database>()`.

```typescript
export interface Database {
  public: {
    Tables: {
      speed_sessions: { Row: SpeedSessionRow; Insert: SpeedSessionInsert; Update: SpeedSessionUpdate };
      strength_sessions: { Row: StrengthSessionRow; Insert: StrengthSessionInsert; Update: StrengthSessionUpdate };
      speed_stats: { Row: SpeedStatsRow; Insert: SpeedStatsInsert; Update: SpeedStatsUpdate };
      strength_stats: { Row: StrengthStatsRow; Insert: StrengthStatsInsert; Update: StrengthStatsUpdate };
      exercise_defaults: { Row: ExerciseDefaultsRow; Insert: ExerciseDefaultsInsert; Update: ExerciseDefaultsUpdate };
      training_state: { Row: TrainingStateRow; Insert: TrainingStateInsert; Update: TrainingStateUpdate };
    };
  };
}
```

Each `Row` type mirrors the Postgres columns. `Insert` makes `id`, `created_at`, and `updated_at` optional (they have defaults). `Update` makes all fields optional.

### 9. Update Supabase Client

In `lib/supabase.ts`, pass the `Database` generic to `createClient`:

```typescript
import type { Database } from './database.types';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, { ... });
```

## Key Implementation Details

- **Column naming convention:** snake_case for Postgres columns, matching Supabase conventions. The TypeScript types use camelCase and the sync layer (spec 018) handles mapping.
- **`session_date` not `date`:** Avoids collision with the Postgres `date` type keyword in queries. The column stores `date` type (no time component).
- **One session per user per day:** Enforced by unique constraint `(user_id, session_date)`. Matches the current AsyncStorage behavior of one key per date. Upsert (INSERT ... ON CONFLICT UPDATE) will be the write pattern in spec 018.
- **JSONB for nested drill/exercise data:** The nested structures (3 colors x 2 sides, variable exercise lists) don't benefit from full normalization. JSONB keeps the schema simple while still allowing GIN indexing if server-side queries are needed later.
- **Top-level `max_out_driver`:** Extracted from the nested structure as a real column because it's the most-queried value (driver PR, milestones, future leaderboards).
- **Stats as separate tables (not views):** Write-time aggregation matches the current pattern in `utils/storage.ts:204-303`. Stats are updated when sessions are saved, not recomputed on read. This keeps reads fast and avoids scanning all sessions on every Stats tab load.
- **`on delete cascade`:** All tables cascade on user deletion. If a user is deleted from auth.users, all their training data is automatically removed.
- **No Supabase CLI / local migrations:** The project does not use `supabase` CLI. SQL is run directly in the Supabase dashboard SQL editor. The full migration SQL should be consolidated into a single runnable script.

## Acceptance Criteria

- [ ] All six tables exist in the Supabase project with correct column types
- [ ] Unique constraints prevent duplicate sessions per user per day
- [ ] Check constraints enforce valid `workout_day` values
- [ ] RLS is enabled on all tables and policies restrict access to own user_id
- [ ] `lib/database.types.ts` exists with Row/Insert/Update types for all tables
- [ ] `lib/supabase.ts` uses `createClient<Database>()` with the generated types
- [ ] A consolidated SQL migration script exists for reference / re-running

## Files to Touch

- `lib/database.types.ts` — new file, TypeScript types for all six tables
- `lib/supabase.ts` — add `Database` generic to `createClient` call
- `docs/sql/017-training-schema.sql` — new file, consolidated migration SQL for dashboard execution
