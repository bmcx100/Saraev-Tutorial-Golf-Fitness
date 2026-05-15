# Spec 018: Training Data Sync

## What This Feature Does

Connects the app's speed and strength training data to Supabase so sessions are backed up to the cloud and available on any device. Uses an offline-first approach: AsyncStorage remains the primary read source for instant loads, while writes go to both AsyncStorage and Supabase. On first login or new device, existing data syncs in both directions.

## Current State

Training data is read/written exclusively through `utils/storage.ts` helper functions. All callers use these functions — no screen directly touches AsyncStorage. The Supabase schema from Spec 017 provides the six cloud tables but nothing writes to them yet.

**Save call sites (write path):**
- `app/speed.tsx` — calls `saveSpeedSession()`, `saveSpeedStats()` on session submit
- `app/strength.tsx` — calls `saveStrengthSession()`, `saveStrengthStats()`, `saveExerciseDefaults()`, `saveLastStrengthWorkoutDay()` on session submit
- `utils/storage.ts:rebuildStatsAggregates()` — calls `saveSpeedStats()`, `saveStrengthStats()` during dev tools rebuild

**Load call sites (read path):**
- `app/speed.tsx` — calls `loadSpeedSession()` to check for existing session on date
- `app/strength.tsx` — calls `loadStrengthSession()`, `loadLastStrengthWorkoutDay()`, `loadExerciseDefaults()` on mount
- `hooks/use-speed-detail.ts` — calls `loadSpeedSessionRange()` for stats/charts
- `hooks/use-strength-detail.ts` — calls `loadStrengthSessionRange()` for stats/charts
- `hooks/use-speed-hook-card.ts` — calls `loadSpeedStats()`
- `hooks/use-strength-hook-card.ts` — calls `loadStrengthStats()`
- `components/today/up-next-hero.tsx` — calls `loadSpeedStats()`, `loadStrengthStats()`

Auth context is available at all levels via `useAuth()` from `contexts/auth-context.tsx`, which provides `session` and `user` (null when logged out).

## Changes Required

### 1. Create `lib/supabase-sync.ts` — Cloud Write Functions

A new module with Supabase write functions that mirror the AsyncStorage save API. Each function takes the same data shape as the AsyncStorage version plus the `user_id`.

```typescript
// Speed session upsert (INSERT ... ON CONFLICT UPDATE)
export async function syncSpeedSession(userId: string, session: SpeedSession): Promise<void>

// Strength session upsert
export async function syncStrengthSession(userId: string, session: StrengthSession): Promise<void>

// Speed stats upsert
export async function syncSpeedStats(userId: string, stats: SpeedStats): Promise<void>

// Strength stats upsert
export async function syncStrengthStats(userId: string, stats: StrengthStats): Promise<void>

// Exercise defaults upsert
export async function syncExerciseDefaults(userId: string, defaults: Record<string, { weight: number | null; reps: number }[]>): Promise<void>

// Training state upsert
export async function syncTrainingState(userId: string, lastWorkoutDay: WorkoutDay): Promise<void>
```

Each function:
- Uses `supabase.from('table').upsert()` with the appropriate conflict column(s)
- Maps camelCase TS fields to snake_case Postgres columns
- Fires and forgets — errors are logged to console but don't block the user. The local AsyncStorage write already succeeded.
- Transforms the data shape (e.g., extracts `maxOut.green` and `maxOut.driver` to top-level columns for `speed_sessions`)

### 2. Create `lib/supabase-pull.ts` — Cloud Read Functions

Functions to pull all training data from Supabase for a given user. Used during initial sync on new device.

```typescript
// Pull all speed sessions for a user
export async function pullSpeedSessions(userId: string): Promise<SpeedSession[]>

// Pull all strength sessions for a user
export async function pullStrengthSessions(userId: string): Promise<StrengthSession[]>

// Pull speed stats
export async function pullSpeedStats(userId: string): Promise<SpeedStats | null>

// Pull strength stats
export async function pullStrengthStats(userId: string): Promise<StrengthStats | null>

// Pull exercise defaults
export async function pullExerciseDefaults(userId: string): Promise<Record<string, { weight: number | null; reps: number }[]> | null>

// Pull training state
export async function pullTrainingState(userId: string): Promise<WorkoutDay | null>
```

Each function:
- Maps snake_case columns back to camelCase TS interfaces
- Returns `null` / empty array when no data exists

### 3. Update `utils/storage.ts` — Dual-Write Save Functions

Modify save functions to also write to Supabase when a user is authenticated. The auth user ID is passed as an optional parameter. When `null`, only AsyncStorage is written (unauthenticated / offline).

**Functions to update:**
- `saveSpeedSession(session, userId?)` — after AsyncStorage write, call `syncSpeedSession` if userId
- `saveStrengthSession(session, userId?)` — after AsyncStorage write, call `syncStrengthSession` if userId
- `saveSpeedStats(stats, userId?)` — after AsyncStorage write, call `syncSpeedStats` if userId
- `saveStrengthStats(stats, userId?)` — after AsyncStorage write, call `syncStrengthStats` if userId
- `saveExerciseDefaults(defaults, userId?)` — after AsyncStorage write, call `syncExerciseDefaults` if userId
- `saveLastStrengthWorkoutDay(day, userId?)` — after AsyncStorage write, call `syncTrainingState` if userId
- `rebuildStatsAggregates(userId?)` — pass userId through to the save calls it makes

The Supabase write is `await`-ed but wrapped in try/catch — failure logs to console and does not throw. The AsyncStorage write always completes first.

### 4. Update Save Call Sites — Pass User ID

Each screen/hook that calls a save function needs to pass the current user ID.

**`app/speed.tsx`:**
- Get `user` from `useAuth()`
- Pass `user?.id` to `saveSpeedSession()` and `saveSpeedStats()`

**`app/strength.tsx`:**
- Get `user` from `useAuth()`
- Pass `user?.id` to `saveStrengthSession()`, `saveStrengthStats()`, `saveExerciseDefaults()`, `saveLastStrengthWorkoutDay()`

**Settings dev tools (rebuild stats):**
- Pass `user?.id` to `rebuildStatsAggregates()`

### 5. Create `lib/supabase-initial-sync.ts` — First-Login Sync

A function that runs once after a user's first successful authentication to reconcile local and cloud data.

```typescript
export async function initialSync(userId: string): Promise<void>
```

**Sync strategy (last-write-wins per session date):**

1. **Pull** all cloud data for the user
2. **Load** all local data from AsyncStorage (scan `speed-session-*` and `strength-session-*` keys)
3. **Merge** by date: for each date, keep whichever session has the later `completedAt` timestamp. If only one side has data, keep it.
4. **Write merged data** to both AsyncStorage and Supabase (only for dates where the winning side changed)
5. **Merge stats:** rerun `rebuildStatsAggregates()` from the merged session set to ensure consistency
6. **Merge singletons** (exercise defaults, training state): keep the cloud version if it exists and is newer, otherwise push local

**Trigger:** Called from `AuthProvider` when `session` transitions from `null` to non-null (login or app restart with existing session). Uses a flag in AsyncStorage (`sync-completed-{userId}`) to avoid re-running on every app launch. Flag is cleared if user signs out.

### 6. Update `contexts/auth-context.tsx` — Trigger Initial Sync

- After `onAuthStateChange` fires `SIGNED_IN`, check for sync flag
- If no flag, call `initialSync(user.id)` in background (fire-and-forget, non-blocking)
- Set flag after successful sync
- On `SIGNED_OUT`, clear the sync flag for the departing user

## Key Implementation Details

- **Offline-first:** AsyncStorage is always written first and is the source for all reads. Supabase writes are fire-and-forget. If the device is offline, the Supabase write silently fails. Data will be reconciled on next `initialSync` (sign-in).
- **No real-time subscription:** This spec does not add Supabase Realtime listeners. Data flows are write-through only. Multi-device conflict resolution relies on `initialSync` at login time.
- **Fire-and-forget pattern:** All Supabase write calls use `try { await supabase...upsert() } catch (e) { console.warn('Sync failed:', e) }`. The `await` ensures we don't pile up unbounded promises, but failures never propagate to the UI.
- **Upsert, not insert:** All writes use `upsert` with `onConflict` matching the unique constraint columns. This handles both first-write and overwrite cases.
- **Column mapping:** snake_case (Postgres) to camelCase (TypeScript) mapping is centralized in `supabase-sync.ts` and `supabase-pull.ts`. No ORM — just explicit object reshaping.
- **No migration of historical data at build time:** Users who have never logged in have data only in AsyncStorage. The first login triggers `initialSync`, which pushes that data to Supabase. There is no batch migration script.
- **Sync flag key:** `sync-completed-{userId}` in AsyncStorage. This is per-user so switching accounts triggers a fresh sync for each user.

## Acceptance Criteria

- [ ] Speed sessions saved in the app appear in the `speed_sessions` Supabase table within seconds
- [ ] Strength sessions saved in the app appear in the `strength_sessions` Supabase table within seconds
- [ ] Speed and strength stats are upserted to their respective tables on session save
- [ ] Exercise defaults are synced to Supabase on strength session save
- [ ] Last workout day is synced to Supabase on strength session save
- [ ] Saving a session while offline succeeds locally (no error shown to user)
- [ ] Signing in on a new device with no local data pulls sessions from Supabase into AsyncStorage
- [ ] Signing in on a device with existing local data merges local and cloud data (last-write-wins)
- [ ] Stats are consistent after initial sync (rebuildStatsAggregates runs on merged data)
- [ ] Signing out and signing in as a different user triggers a fresh sync for the new user
- [ ] Type-checking passes (`npx tsc --noEmit`)

## Files to Touch

- `lib/supabase-sync.ts` — new file, cloud write functions
- `lib/supabase-pull.ts` — new file, cloud read functions
- `lib/supabase-initial-sync.ts` — new file, first-login merge logic
- `utils/storage.ts` — add optional `userId` param to save functions, call sync functions
- `app/speed.tsx` — pass `user?.id` to save calls
- `app/strength.tsx` — pass `user?.id` to save calls
- `contexts/auth-context.tsx` — trigger initialSync on sign-in, clear flag on sign-out
- `app/settings.tsx` — pass `user?.id` to `rebuildStatsAggregates` in dev tools (if applicable)
