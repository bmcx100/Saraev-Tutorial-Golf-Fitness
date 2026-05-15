# Test Plan: Spec 018 — Training Data Sync

## Setup
- Starting URL: http://localhost:8081 (Expo web)
- Preconditions: Spec 017 tables exist in Supabase. A test user account exists. Speed and strength protocol onboarding is complete for the test user.
- Test association: Use sandbox test user (a2000000-0000-0000-0000-000000000002)

## Tests

### Test 1: Speed session syncs to Supabase on save
**Steps:**
1. Sign in as test user
2. Navigate to /speed
3. Complete a speed session (fill Normal Stance, Step Drill, Max Out fields)
4. Tap "Save Session"
5. Open Supabase dashboard > Table Editor > speed_sessions
6. Filter by user_id = test user's ID

**Expected:** A row exists for today's date with matching protocol, normal_stance JSONB, step_drill JSONB, max_out_green, and max_out_driver values.

### Test 2: Strength session syncs to Supabase on save
**Steps:**
1. Sign in as test user
2. Navigate to /strength
3. Complete a strength session (fill weight/reps, check sets)
4. Tap "Save Workout"
5. Open Supabase dashboard > Table Editor > strength_sessions
6. Filter by user_id = test user's ID

**Expected:** A row exists for today's date with matching workout_day, exercises JSONB (including set weights, reps, completed flags).

### Test 3: Speed stats update in Supabase after session save
**Steps:**
1. Sign in as test user
2. Save a speed session with max_out_driver = 105
3. Check Supabase speed_stats table for test user

**Expected:** speed_stats row shows driver_pr_mph = 105 (or higher if previous PR exists), driver_pr_date = today, last_session_date = today.

### Test 4: Strength stats update in Supabase after session save
**Steps:**
1. Sign in as test user
2. Save a strength session with a new PR weight on an exercise
3. Check Supabase strength_stats table for test user

**Expected:** strength_stats row shows updated exercise_prs JSONB with the new PR, streak_days incremented, last_pr updated.

### Test 5: Exercise defaults sync to Supabase
**Steps:**
1. Sign in as test user
2. Save a strength session
3. Check Supabase exercise_defaults table for test user

**Expected:** exercise_defaults row exists with defaults JSONB containing the exercise weights/reps from the saved session.

### Test 6: Training state (last workout day) syncs to Supabase
**Steps:**
1. Sign in as test user
2. Save a strength session (e.g., Legs 1)
3. Check Supabase training_state table for test user

**Expected:** training_state row shows last_workout_day = 'legs1'.

### Test 7: Offline save does not show error
**Steps:**
1. Sign in as test user
2. Disable network connectivity (airplane mode or disconnect WiFi)
3. Navigate to /speed and complete a session
4. Tap "Save Session"
5. Verify session is saved locally (re-entering /speed on same date shows saved data)

**Expected:** Session saves successfully to AsyncStorage. No error toast or crash. Supabase write silently fails.

### Test 8: Initial sync pulls cloud data to new device
**Steps:**
1. Sign in as test user on Device A (or fresh browser profile)
2. Save 2 speed sessions and 1 strength session
3. Verify they appear in Supabase
4. Clear all local AsyncStorage (Settings > Dev tools > Clear All Data)
5. Sign out
6. Sign back in as the same user
7. Navigate to /stats-speed

**Expected:** Speed stats show the PR from the synced sessions. The sessions pulled from Supabase are now in local AsyncStorage.

### Test 9: Initial sync merges local and cloud data (last-write-wins)
**Steps:**
1. Save a speed session on date 2026-05-01 locally with max_out_driver = 95
2. Directly insert a speed session in Supabase for the same user on 2026-05-01 with max_out_driver = 100 and a later completed_at timestamp
3. Trigger initial sync by signing out and signing back in
4. Check local AsyncStorage for the 2026-05-01 speed session

**Expected:** Local session is replaced by the cloud version (driver = 100) because the cloud version has a later completed_at.

### Test 10: Sync flag prevents re-running on app restart
**Steps:**
1. Sign in as test user (triggers initial sync)
2. Close and reopen the app (or reload web)
3. Monitor console logs for sync activity

**Expected:** No "initial sync" console messages on the second app load. The sync-completed flag prevents re-running.

### Test 11: Signing out clears sync flag
**Steps:**
1. Sign in as test user
2. Sign out
3. Check AsyncStorage for `sync-completed-{userId}` key

**Expected:** The sync flag for the user is removed on sign-out.

### Test 12: Different user gets fresh sync
**Steps:**
1. Sign in as User A — initial sync runs
2. Sign out
3. Sign in as User B
4. Verify initial sync runs for User B (check console or Supabase activity)

**Expected:** Each user gets their own independent sync cycle. User B's sync does not affect User A's data.

### Test 13: Upsert overwrites existing session
**Steps:**
1. Sign in as test user
2. Save a speed session for today
3. Verify row in Supabase
4. Re-enter /speed, modify values, save again
5. Check Supabase speed_sessions table

**Expected:** Still one row for today (not two). Values updated to the second save.

### Test 14: Type-checking passes
**Steps:**
1. Run `npx tsc --noEmit`

**Expected:** No type errors related to storage functions, sync functions, or Supabase client types.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
