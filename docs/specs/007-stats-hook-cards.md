# Spec 007: Stats Page Redesign — Hook Cards

## What This Feature Does

Redesigns the Stats tab's speed and strength cards into emotionally-driven "hook cards." Each card surfaces a single compelling number — the thing most worth feeling about right now — with conditional logic that chooses between PR celebrations, milestone proximity, and recency prompts. Both cards are tappable, navigating to full-screen detail views (built in specs 008 and 009).

## Current State

The Stats tab (`app/(tabs)/stats.tsx`) renders `SpeedTrendCard` and `StrengthSummaryCard` from separate component files. Both use the `useTrainingHistory` hook (`hooks/use-training-history.ts`) which loads 30 days of speed and strength sessions from AsyncStorage.

`SpeedTrendCard` (`components/speed-trend-card.tsx`) shows the latest driver speed as a hero number, "Best: X mph" subtitle, and a horizontal row of the last 7 session pills. No PR detection, milestone awareness, or recency tracking.

`StrengthSummaryCard` (`components/strength-summary-card.tsx`) shows session count, latest workout day label, and a L/P/L/P rotation indicator with filled/empty dots. No streak tracking or exercise PR detection.

Speed sessions are saved in `app/speed.tsx` at line 292 (`handleSubmit`). Strength sessions are saved in `app/strength.tsx` at line 408 (`handleSubmit`). Neither save flow updates any aggregate stats.

Existing Stats tab sections — header with streak badge, Weekly Mini-Rings, Habit Breakdown, Record Cards — remain unchanged in this spec.

## Changes Required

### 1. Add milestones constants

Add to `constants/speed-protocols.ts`:
- `DRIVER_MILESTONES: number[]` — `[90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140]`

Add to `constants/strength-protocols.ts`:
- `STREAK_MILESTONES: number[]` — `[7, 14, 21, 30, 60, 90]`

### 2. Add aggregate stats types and storage

Add to `utils/storage.ts`:

Types:
```typescript
export interface SpeedStats {
  driverPR: { mph: number; date: string } | null;
  previousDriverPR: { mph: number; date: string } | null;
  lastSessionDate: string | null;
}

export interface StrengthStats {
  exercisePRs: Record<string, { weight: number; reps: number; date: string }>;
  streak: { days: number; lastSessionDate: string };
  bestStreak: number;
  lastPR: { exerciseId: string; exerciseName: string; weight: number; date: string } | null;
}
```

Functions: `loadSpeedStats()`, `saveSpeedStats()`, `loadStrengthStats()`, `saveStrengthStats()`. Keys: `speed-stats`, `strength-stats`.

Add `rebuildStatsAggregates()` — scans all speed and strength sessions from AsyncStorage (using `getAllKeys` to find `speed-session-*` and `strength-session-*` keys), computes the aggregate values, and writes both stats keys. Called from Settings dev tools to seed aggregates for users with existing session data.

### 3. Update speed session save flow

In `app/speed.tsx` `handleSubmit`, after `saveSpeedSession(final)`:
- Load current `SpeedStats` (default to empty if null)
- If `final.maxOut.driver` is non-null AND exceeds current `driverPR.mph` (or no existing PR): shift current PR to `previousDriverPR`, set new `driverPR` with today's date
- Set `lastSessionDate` to today
- Save updated `SpeedStats`

### 4. Update strength session save flow

In `app/strength.tsx` `handleSubmit`, after `saveStrengthSession(session)`:
- Load current `StrengthStats` (default to empty if null)
- **Streak**: Calculate calendar day gap between today and `streak.lastSessionDate`. If gap is 0 (same day re-submit), don't change streak. If gap is 1-2, add the gap to `streak.days`. If gap is 3+, reset `streak.days` to 1. Update `bestStreak` if current exceeds it.
- **Exercise PRs**: For each exercise, find the max weight across completed sets. Compare against `exercisePRs[exerciseId]`. If higher (or no existing PR), update the PR and set `lastPR` with exercise name from `WORKOUT_DAYS`.
- Set `streak.lastSessionDate` to today
- Save updated `StrengthStats`

### 5. Create `useStatsAggregates` hook

New file: `hooks/use-stats-aggregates.ts`

Loads `SpeedStats` and `StrengthStats` on mount. Returns:
- `speedStats: SpeedStats | null`
- `strengthStats: StrengthStats | null`
- `speedCardMode`: one of `'newPR' | 'nearMilestone' | 'stale' | 'default' | 'empty'`
- `strengthCardMode`: one of `'newPR' | 'streakNearMilestone' | 'activeStreak' | 'default' | 'empty'`
- `loading: boolean`

**Speed card mode** — evaluated in priority order:
1. `newPR`: `driverPR.date === lastSessionDate` AND `lastSessionDate` is within 2 days of today AND `previousDriverPR` exists
2. `nearMilestone`: PR is within 2 mph of the next `DRIVER_MILESTONES` value above it
3. `stale`: `lastSessionDate` is 4+ days ago
4. `default`: has a PR but none of the above apply
5. `empty`: no `driverPR` at all

**Strength card mode** — evaluated in priority order:
1. `newPR`: `lastPR.date === today`
2. `streakNearMilestone`: streak is active (today - `lastSessionDate` ≤ 2 days) AND within 2 days of a `STREAK_MILESTONES` value
3. `activeStreak`: streak is active AND `streak.days >= 3`
4. `default`: has sessions but no active streak ≥ 3
5. `empty`: no `StrengthStats` or no exercise PRs

### 6. Rewrite SpeedTrendCard as SpeedHookCard

Delete `components/speed-trend-card.tsx`. Create `components/speed-hook-card.tsx`:

- `Pressable` card with `router.push('/stats-speed')` on tap
- Section title: "SPEED STICKS" (uppercase, letterSpacing 1)
- Chevron-right icon at top-right corner to indicate tappability
- Center: driver PR number, fontSize 56, fontWeight 800
- Below number: "mph" label in secondary text
- Conditional content below mph label based on `speedCardMode`:
  - `newPR`: A green pill badge above the number reading "NEW PR". Below mph: `"↑ X mph"` in accent color (delta = `driverPR.mph - previousDriverPR.mph`)
  - `nearMilestone`: Below mph: `"X mph from [milestone]"` in accent color
  - `stale`: Below mph: `"Last session: X days ago"` in secondary text
  - `default`: Below mph: `"Personal Record"` in secondary text
  - `empty`: No number. Centered secondary text: `"Complete a speed session to get\u00A0started"`
- Props: `speedStats`, `speedCardMode`, `colors`

### 7. Rewrite StrengthSummaryCard as StrengthHookCard

Delete `components/strength-summary-card.tsx`. Create `components/strength-hook-card.tsx`:

- `Pressable` card with `router.push('/stats-strength')` on tap
- Section title: "STRENGTH" (uppercase, letterSpacing 1)
- Chevron-right icon at top-right
- Conditional content based on `strengthCardMode`:
  - `newPR`: Green pill badge "NEW PR". Large text: exercise name. Hero number: weight in lbs with "lbs" unit label.
  - `streakNearMilestone`: Hero number: `streak.days`. Below: `"X days to [milestone]-day streak"` in accent color.
  - `activeStreak`: Hero number: `streak.days`. Below: `"day streak"` label in secondary text.
  - `default`: Show last session info — workout day label + how many days ago. Or if no lastPR, show most recent session date.
  - `empty`: Centered secondary text: `"Complete a strength workout to get\u00A0started"`
- Props: `strengthStats`, `strengthCardMode`, `colors`

### 8. Add detail view route stubs

Create `app/stats-speed.tsx` — `SafeAreaView` with top bar (back arrow via `router.back()`, title "Speed Stats"), centered placeholder text "Coming soon" in secondary color.

Create `app/stats-strength.tsx` — same pattern, title "Strength Stats".

Register both in `app/_layout.tsx` as Stack.Screen entries with `headerShown: false, presentation: 'card'`.

### 9. Update Stats tab

In `app/(tabs)/stats.tsx`:
- Replace `useTrainingHistory` with `useStatsAggregates`
- Replace `SpeedTrendCard` with `SpeedHookCard`, passing `speedStats` and `speedCardMode`
- Replace `StrengthSummaryCard` with `StrengthHookCard`, passing `strengthStats` and `strengthCardMode`
- Remove unused imports (`DriverSpeedEntry`, `LatestStrengthDay`, old component imports)
- All other sections (Mini-Rings, Habit Breakdown, Record Cards) remain unchanged

### 10. Add Rebuild Stats to Settings dev tools

In `app/settings.tsx`, in the existing dev tools section, add a "Rebuild Stats" button that calls `rebuildStatsAggregates()`. This populates aggregate stats from existing session data for users who already have sessions.

## Key Implementation Details

**Aggregate stats are write-time, not read-time.** Speed/strength session saves update aggregate stats atomically. The Stats page only reads pre-computed values from two AsyncStorage keys — no date range scanning. This keeps the Stats tab fast regardless of history depth.

**Streak gap threshold: 2 calendar days.** A strength streak stays active as long as no gap between consecutive sessions exceeds 2 days. A typical Mon/Wed/Fri schedule (1-day gaps) maintains the streak. 3+ day gaps break it. The streak value counts calendar days from start to last session, not the number of sessions.

**Speed PR "newness" window: 2 days.** A PR is "new" only if set on `lastSessionDate` AND that date is within 2 days of today. After 3 days, the card falls through to milestone or default mode.

**No breaking changes to `useTrainingHistory`.** The existing hook stays in the codebase — detail views (specs 008/009) will use it for historical trend visualization. The hook cards use the lighter `useStatsAggregates` hook.

**`rebuildStatsAggregates` handles migration.** Users with existing sessions but no aggregate keys see empty hook cards until their next session save. The Settings "Rebuild Stats" button provides immediate population of aggregates from all historical sessions.

**Old component files are deleted.** `components/speed-trend-card.tsx` and `components/strength-summary-card.tsx` are replaced, not modified. Delete them after creating the new hook card components. Nothing else imports them.

## Acceptance Criteria

- [ ] Speed hook card shows driver PR as a large centered number when data exists
- [ ] Speed card shows "NEW PR" badge + delta when PR was set in latest session (within 2 days)
- [ ] Speed card shows "X mph from [milestone]" when PR is within 2 mph of next milestone
- [ ] Speed card shows "Last session: X days ago" when 4+ days since last session
- [ ] Speed card shows "Personal Record" in default mode
- [ ] Speed card navigates to `/stats-speed` on tap
- [ ] Strength hook card shows streak count when on an active streak (3+ days)
- [ ] Strength card shows "New [exercise] PR" when PR set today
- [ ] Strength card shows milestone proximity when streak is within 2 days of milestone
- [ ] Strength card navigates to `/stats-strength` on tap
- [ ] Speed session save updates `speed-stats` aggregate in AsyncStorage
- [ ] Strength session save updates `strength-stats` aggregate in AsyncStorage
- [ ] Both detail view routes render placeholder screens with back navigation
- [ ] Existing Stats tab sections (Mini-Rings, Breakdown, Records) remain unchanged
- [ ] Both cards show empty states when no session data exists
- [ ] "Rebuild Stats" button in Settings populates aggregates from existing sessions

## Files to Touch

- `constants/speed-protocols.ts` — add `DRIVER_MILESTONES`
- `constants/strength-protocols.ts` — add `STREAK_MILESTONES`
- `utils/storage.ts` — add `SpeedStats`/`StrengthStats` types, CRUD functions, `rebuildStatsAggregates()`
- `app/speed.tsx` — update `handleSubmit` to write speed aggregate stats
- `app/strength.tsx` — update `handleSubmit` to write strength aggregate stats
- `hooks/use-stats-aggregates.ts` — new hook for loading aggregates + deriving card modes
- `components/speed-hook-card.tsx` — new, replaces speed-trend-card.tsx
- `components/strength-hook-card.tsx` — new, replaces strength-summary-card.tsx
- `components/speed-trend-card.tsx` — delete
- `components/strength-summary-card.tsx` — delete
- `app/stats-speed.tsx` — new route stub
- `app/stats-strength.tsx` — new route stub
- `app/_layout.tsx` — register two new routes
- `app/(tabs)/stats.tsx` — swap to new hook + components
- `app/settings.tsx` — add "Rebuild Stats" dev tools button
