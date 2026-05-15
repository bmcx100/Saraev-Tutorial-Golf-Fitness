# Test Plan: Spec 017 — Supabase Training Schema

## Setup
- Supabase dashboard SQL editor access
- A test user authenticated via the app (existing auth from Spec 011/012)
- Supabase service role key for admin verification (checking RLS bypass)

## Tests

### Test 1: Tables exist with correct columns
**Steps:**
1. Open Supabase dashboard > Table Editor
2. Verify `speed_sessions` table exists with columns: id (uuid), user_id (uuid), session_date (date), protocol (text), normal_stance (jsonb), step_drill (jsonb), max_out_green (int2), max_out_driver (int2), completed_at (timestamptz), created_at (timestamptz)
3. Verify `strength_sessions` table exists with columns: id (uuid), user_id (uuid), session_date (date), protocol (text), workout_day (text), exercises (jsonb), completed_at (timestamptz), created_at (timestamptz)
4. Verify `speed_stats` table exists with columns: user_id (uuid PK), driver_pr_mph (int2), driver_pr_date (date), previous_driver_pr_mph (int2), previous_driver_pr_date (date), last_session_date (date), updated_at (timestamptz)
5. Verify `strength_stats` table exists with columns: user_id (uuid PK), exercise_prs (jsonb), streak_days (int4), streak_last_session_date (date), best_streak (int4), last_pr (jsonb), updated_at (timestamptz)
6. Verify `exercise_defaults` table exists with columns: user_id (uuid PK), defaults (jsonb), updated_at (timestamptz)
7. Verify `training_state` table exists with columns: user_id (uuid PK), last_workout_day (text), updated_at (timestamptz)

**Expected:** All six tables exist with the exact column names and types listed above.

### Test 2: Unique constraint on speed_sessions
**Steps:**
1. In SQL editor, insert a speed session for a test user on date '2026-01-01'
2. Attempt to insert a second speed session for the same user on '2026-01-01'
3. Verify the second insert fails with a unique constraint violation

**Expected:** Second insert fails with `duplicate key value violates unique constraint "speed_sessions_one_per_day"`.

### Test 3: Unique constraint on strength_sessions
**Steps:**
1. In SQL editor, insert a strength session for a test user on date '2026-01-01'
2. Attempt to insert a second strength session for the same user on '2026-01-01'
3. Verify the second insert fails with a unique constraint violation

**Expected:** Second insert fails with `duplicate key value violates unique constraint "strength_sessions_one_per_day"`.

### Test 4: Check constraint on workout_day
**Steps:**
1. In SQL editor, attempt to insert a strength session with workout_day = 'invalid'
2. Verify the insert fails with a check constraint violation
3. Insert with workout_day = 'legs1' — verify success
4. Insert with workout_day = 'push' — verify success

**Expected:** Invalid workout_day is rejected; valid values (legs1, pull, legs2, push) are accepted.

### Test 5: Check constraint on training_state
**Steps:**
1. In SQL editor, attempt to upsert training_state with last_workout_day = 'badvalue'
2. Verify it fails
3. Upsert with last_workout_day = 'pull' — verify success

**Expected:** Invalid values rejected; valid WorkoutDay values accepted.

### Test 6: RLS blocks cross-user reads
**Steps:**
1. Sign in as User A in the app
2. Insert a speed session as User A via the Supabase JS client
3. Sign in as User B in the app
4. Query `speed_sessions` via the Supabase JS client as User B
5. Verify User A's session is not returned

**Expected:** User B's query returns zero rows (cannot see User A's data).

### Test 7: RLS blocks cross-user writes
**Steps:**
1. Sign in as User B in the app
2. Attempt to insert a speed session with `user_id` set to User A's ID
3. Verify the insert fails

**Expected:** Insert is rejected by RLS policy (auth.uid() != provided user_id).

### Test 8: Cascade delete removes training data
**Steps:**
1. Create a temporary test user via Supabase Auth
2. Insert a speed session, strength session, speed stats, strength stats, exercise defaults, and training state row for the test user
3. Delete the test user from auth.users (via dashboard or service role)
4. Query all six tables for the deleted user_id

**Expected:** All six tables return zero rows for the deleted user. Cascade delete worked.

### Test 9: JSONB data roundtrip for speed_sessions
**Steps:**
1. Insert a speed session with realistic normal_stance and step_drill JSONB:
   ```json
   {"green":{"dom":95,"nonDom":88},"blue":{"dom":102,"nonDom":94},"red":{"dom":110,"nonDom":101}}
   ```
2. Query the row back
3. Verify the JSONB data matches exactly

**Expected:** JSONB data is stored and retrieved without modification.

### Test 10: JSONB data roundtrip for strength_sessions
**Steps:**
1. Insert a strength session with realistic exercises JSONB:
   ```json
   [{"exerciseId":"squats","sets":[{"weight":135,"reps":8,"completed":true}]}]
   ```
2. Query the row back
3. Verify the exercises JSONB matches exactly

**Expected:** JSONB data is stored and retrieved without modification.

### Test 11: TypeScript types file exists
**Steps:**
1. Verify `lib/database.types.ts` exists
2. Verify it exports a `Database` interface with `public.Tables` containing all six table names
3. Verify each table has `Row`, `Insert`, and `Update` type variants

**Expected:** Types file exists and compiles without errors (`npx tsc --noEmit` passes).

### Test 12: Supabase client uses Database generic
**Steps:**
1. Read `lib/supabase.ts`
2. Verify `createClient<Database>()` is used (not untyped `createClient()`)
3. Verify `Database` is imported from `./database.types`

**Expected:** Client is fully typed with the training schema.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
