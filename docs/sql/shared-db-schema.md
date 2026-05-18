# Shared Database Schema — Multi-App Architecture

Single Supabase project, shared `auth.users`, app-specific tables namespaced by prefix.

## Layout

```
auth.users (managed by Supabase)
  |
  ├── gf_*  tables  (Golf Fitness app)
  └── xx_*  tables  (Future apps — pick a 2-4 letter prefix)
```

## Naming Convention

Every app-specific table gets a prefix: `{app}_tablename`

| App              | Prefix | Example tables                        |
|------------------|--------|---------------------------------------|
| Golf Fitness     | `gf_`  | `gf_speed_sessions`, `gf_speed_stats` |
| Future App B     | `ab_`  | `ab_workouts`, `ab_settings`          |

The prefix is the boundary. No app touches another app's prefixed tables.

## Shared Tables (no prefix)

Tables that genuinely serve all apps. Currently none beyond `auth.users`, but
candidates for the future:

- `subscriptions` — if billing is unified

Shared tables get no prefix and their own RLS policies.

## Golf Fitness Tables (`gf_` prefix)

| Table                  | Type              | PK / Unique                    |
|------------------------|-------------------|--------------------------------|
| `gf_speed_sessions`    | session log       | `(user_id, session_date)`      |
| `gf_strength_sessions` | session log       | `(user_id, session_date)`      |
| `gf_speed_stats`       | singleton per user| `user_id`                      |
| `gf_strength_stats`    | singleton per user| `user_id`                      |
| `gf_exercise_defaults` | singleton per user| `user_id`                      |
| `gf_training_state`    | singleton per user| `user_id`                      |
| `gf_user_profiles`     | singleton per user| `user_id`                      |

All tables have RLS enabled with the standard user-isolation policy.
Schema defined in `docs/sql/021-gf-prefix-migration.sql`.

## Rules for Adding Tables

1. **Always use your app's prefix** — `gf_` for Golf Fitness
2. **Always add `user_id uuid not null references auth.users(id) on delete cascade`**
3. **Always enable RLS** with the standard user-isolation policy:
   ```sql
   ALTER TABLE public.{table} ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users manage own {table}"
     ON public.{table} FOR ALL
     USING (auth.uid() = user_id)
     WITH CHECK (auth.uid() = user_id);
   ```
4. **Never reference another app's tables** — only reference `auth.users` and
   shared (unprefixed) tables
5. **Never modify another app's tables** — not even "just adding a column"
6. **JSONB for flexible data** — keep the pattern of typed JSONB columns for
   nested structures rather than wide column sprawl

## Adding a New App

1. Pick a unique 2-4 letter prefix (check this doc for existing ones)
2. Register it in the table above
3. Create all tables with that prefix
4. Add RLS policies using the standard pattern
5. Generate TypeScript types with `supabase gen types typescript`
6. In your app code, only `.from('yourprefix_*')` — never touch other prefixes

## Visual

```
┌─────────────────────────────────────────────────┐
│                Supabase Project                 │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │          auth.users (shared)            │    │
│  │  id, email, phone, created_at, ...      │    │
│  └──────────┬──────────────────┬───────────┘    │
│             │                  │                │
│     ┌───────▼─────────┐  ┌────▼─────────┐      │
│     │  gf_* tables    │  │  xx_* tables  │      │
│     │  (Golf Fitness) │  │  (App B)      │      │
│     │                 │  │               │      │
│     │ speed_sessions  │  │ workouts      │      │
│     │ strength_sess   │  │ settings      │      │
│     │ speed_stats     │  │ ...           │      │
│     │ strength_stats  │  │               │      │
│     │ exercise_def    │  │               │      │
│     │ training_state  │  │               │      │
│     │ user_profiles   │  │               │      │
│     └─────────────────┘  └───────────────┘      │
│                                                 │
│  RLS: each app's tables only accessible         │
│  by authenticated user matching user_id         │
└─────────────────────────────────────────────────┘
```
