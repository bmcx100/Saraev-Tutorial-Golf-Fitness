# Spec 021: Shared DB — GF Prefix Migration & User Profiles

## What This Feature Does

Renames all 6 existing Supabase tables to use the `gf_` prefix (multi-app namespace convention), adds a new `gf_user_profiles` table so user preferences sync to the cloud like training data already does, and updates the schema doc + shared-db-guard skill to remove legacy/transitional references.

## Current State

**Supabase tables** (all unprefixed in `public` schema):
- `speed_sessions`, `strength_sessions` — session logs (`docs/sql/017-training-schema.sql`)
- `speed_stats`, `strength_stats` — aggregate stats (singleton per user)
- `exercise_defaults`, `training_state` — singletons per user

**Sync layer** references these table names as bare strings in `.from()` calls:
- `lib/supabase-sync.ts` — 6 upsert functions (lines 13, 33, 51, 69, 90, 104)
- `lib/supabase-pull.ts` — 6 select functions (lines 14, 36, 54, 75, 98, 109)

**Database types** map table names in the `Database` type:
- `lib/database.types.ts` — `Tables` object keys (lines 238-273)

**User profile** lives only in AsyncStorage (`user-profile` key):
- `contexts/user-context.tsx` — `UserProfile` interface (line 34), `saveProfile()` writes to AsyncStorage only (line 98)
- `utils/storage.ts` — `loadProfile()` / `saveProfile()` (lines 82-100)
- No Supabase table exists for user preferences. Profile data (activeHabitIds, schedule, protocols, notification prefs) does not survive device switches.

**Schema doc:** `docs/sql/shared-db-schema.md` — has a "to be renamed" section with legacy mapping.

**Skill:** `~/.claude/skills/shared-db-guard/SKILL.md` — has a "Legacy Table Names" section that tolerates unprefixed names.

## Changes Required

### 1. SQL migration — rename tables + create gf_user_profiles

Write `docs/sql/021-gf-prefix-migration.sql`:

```sql
-- Rename existing tables to gf_ prefix
ALTER TABLE public.speed_sessions     RENAME TO gf_speed_sessions;
ALTER TABLE public.strength_sessions  RENAME TO gf_strength_sessions;
ALTER TABLE public.speed_stats        RENAME TO gf_speed_stats;
ALTER TABLE public.strength_stats     RENAME TO gf_strength_stats;
ALTER TABLE public.exercise_defaults  RENAME TO gf_exercise_defaults;
ALTER TABLE public.training_state     RENAME TO gf_training_state;

-- New table: gf_user_profiles
CREATE TABLE public.gf_user_profiles (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_habit_ids     jsonb NOT NULL DEFAULT '[]',
  schedule             jsonb NOT NULL DEFAULT '{}',
  speed_protocol       text,
  strength_protocol    text,
  onboarding_complete  boolean NOT NULL DEFAULT false,
  sound_enabled        boolean NOT NULL DEFAULT true,
  notifications_enabled boolean NOT NULL DEFAULT false,
  notification_morning text NOT NULL DEFAULT '08:00',
  notification_evening text NOT NULL DEFAULT '20:00',
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gf_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gf_user_profiles"
  ON public.gf_user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

RLS policies and indexes on renamed tables carry over automatically with `ALTER TABLE RENAME`.

### 2. Update database types — `lib/database.types.ts`

- Rename all 6 `Tables` keys from unprefixed to `gf_` prefixed (e.g., `speed_sessions` -> `gf_speed_sessions`)
- Rename corresponding Row/Insert/Update type names (e.g., `SpeedSessionRow` -> `GfSpeedSessionRow`). Or keep the type names the same and just change the `Tables` keys — simpler, since the types are only used in pull functions via explicit type annotations.
- Add `gf_user_profiles` entry with Row/Insert/Update types:
  - `GfUserProfileRow`: `user_id`, `active_habit_ids` (string[]), `schedule` (ScheduleConfig), `speed_protocol` (string | null), `strength_protocol` (string | null), `onboarding_complete` (boolean), `sound_enabled` (boolean), `notifications_enabled` (boolean), `notification_morning` (string), `notification_evening` (string), `updated_at` (string)

**Decision: keep existing type names unchanged** (e.g., `SpeedSessionRow` stays `SpeedSessionRow`). Only the `Tables` object keys change. This minimizes churn — the Row types are referenced by name in pull functions.

### 3. Update sync functions — `lib/supabase-sync.ts`

- Change all 6 `.from('table_name')` strings to `.from('gf_table_name')`
- Add `syncUserProfile(userId, profile)` function:
  - Maps `UserProfile` fields to snake_case columns
  - Upserts on `user_id` conflict
  - Fire-and-forget pattern (try/catch, console.warn)

### 4. Update pull functions — `lib/supabase-pull.ts`

- Change all 6 `.from('table_name')` strings to `.from('gf_table_name')`
- Add `pullUserProfile(userId)` function:
  - Returns `UserProfile | null`
  - Maps snake_case columns back to camelCase

### 5. Update initial sync — `lib/supabase-initial-sync.ts`

- Add user profile to the initial sync reconciliation:
  - Pull cloud profile via `pullUserProfile(userId)`
  - Load local profile via `loadProfile()`
  - Merge strategy: if cloud exists and local is default (not onboarded), use cloud. If local is onboarded, keep local and push to cloud. If both onboarded, keep local (most recent action) and push to cloud.
- Import `pullUserProfile` from supabase-pull, `syncUserProfile` from supabase-sync

### 6. Wire profile sync into UserProvider — `contexts/user-context.tsx`

- Import `useAuth` from auth-context
- In `updateProfile`, after `saveProfile(next)`, call `syncUserProfile(user.id, next)` if authenticated
- The provider sits inside AuthProvider in the component tree (`app/_layout.tsx` line: `AuthProvider > UserProvider > ...`), so `useAuth()` is available

### 7. Update SQL reference file — `docs/sql/017-training-schema.sql`

- Update the table names in comments/definitions to reflect the `gf_` prefix so the reference file matches production. Or add a note at the top saying "superseded by 021-gf-prefix-migration.sql".

### 8. Update schema doc — `docs/sql/shared-db-schema.md`

- Remove the "Current Golf Fitness Tables (to be renamed)" section
- Update the table list to show final `gf_` names including `gf_user_profiles`
- Update the visual diagram to include `user_profiles`

### 9. Update shared-db-guard skill — `~/.claude/skills/shared-db-guard/SKILL.md`

- Remove the entire "Legacy Table Names" section (no more transitional period)
- The canonical table names are now `gf_*` everywhere

## Key Implementation Details

- **`ALTER TABLE RENAME` preserves everything:** indexes, constraints, RLS policies, foreign keys all follow the rename automatically. No need to recreate them.
- **`gf_user_profiles` uses individual columns, not a single JSONB blob:** This allows future shared queries (e.g., "how many users have speed protocol enabled") without JSONB extraction. The two complex nested fields (`active_habit_ids` and `schedule`) remain JSONB because their structure is dynamic.
- **Profile sync is fire-and-forget** like all other sync functions. The app works fully offline.
- **No migration of local AsyncStorage keys.** The `user-profile` key stays the same locally. Only the cloud table name changes.
- **The `UserProvider` needs auth context.** Since `AuthProvider` wraps `UserProvider` in the component tree, `useAuth()` is available inside `UserProvider`. No provider reordering needed.

## Acceptance Criteria

- [ ] All 6 existing tables renamed to `gf_*` prefix in SQL migration
- [ ] `gf_user_profiles` table created with RLS and user_id PK
- [ ] All `.from()` calls in supabase-sync.ts use `gf_` prefixed names
- [ ] All `.from()` calls in supabase-pull.ts use `gf_` prefixed names
- [ ] `database.types.ts` Tables keys match new `gf_` prefixed names
- [ ] `syncUserProfile()` function exists and upserts profile to `gf_user_profiles`
- [ ] `pullUserProfile()` function exists and returns `UserProfile | null`
- [ ] `UserProvider.updateProfile()` calls `syncUserProfile()` when authenticated
- [ ] Initial sync includes user profile merge (cloud + local reconciliation)
- [ ] Schema doc has no legacy/transition references
- [ ] Shared-db-guard skill has no legacy table mapping section
- [ ] `npx tsc --noEmit` passes with no type errors
- [ ] App functions normally offline (no regressions from sync changes)

## Files to Touch

- `docs/sql/021-gf-prefix-migration.sql` — new file, SQL migration
- `docs/sql/017-training-schema.sql` — add superseded note at top
- `lib/database.types.ts` — rename Tables keys, add gf_user_profiles types
- `lib/supabase-sync.ts` — rename 6 `.from()` strings, add `syncUserProfile()`
- `lib/supabase-pull.ts` — rename 6 `.from()` strings, add `pullUserProfile()`
- `lib/supabase-initial-sync.ts` — add profile merge to `initialSync()`
- `contexts/user-context.tsx` — import `useAuth`, call `syncUserProfile` on update
- `docs/sql/shared-db-schema.md` — remove legacy section, add `gf_user_profiles`
- `~/.claude/skills/shared-db-guard/SKILL.md` — remove legacy table names section
