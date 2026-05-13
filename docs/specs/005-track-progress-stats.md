# Spec 005: Track Progress (Stats Tab)

## What This Feature Does

Adds protocol-level training history to the Stats tab so users can see their actual speed (mph) and strength (weight/reps) numbers over time, not just habit completion rings. The primary metric is driver speed trend, with strength session summaries alongside.

## Current State

The Stats tab (`app/(tabs)/stats.tsx`) currently shows:
- Weekly mini-rings (habit completion by category)
- Habit breakdown (completion % per habit for the week)
- Record cards (streak, total logs, challenges completed)

All data comes from `HabitContext` — binary completion only. No actual session data (mph values, weights lifted) is displayed anywhere.

**Speed data** is saved per day to AsyncStorage under `speed-session-YYYY-MM-DD`. Each `SpeedSession` (`constants/speed-protocols.ts:14-21`) contains 14 fields: normalStance/stepDrill for green/blue/red sticks (dom + nonDom), plus maxOut green and driver. `loadSpeedSessionRange()` exists in `utils/storage.ts:109-117` but is never called from any component.

**Strength data** is saved per day under `strength-session-YYYY-MM-DD`. Each `StrengthSession` (`constants/strength-protocols.ts:81-87`) contains the workout day type and an array of `ExerciseLog` entries (each with sets containing weight/reps/completed). There is no `loadStrengthSessionRange()` function — only single-day `loadStrengthSession()` exists.

## Changes Required

### 1. Add `loadStrengthSessionRange()` to storage utils

- Add to `utils/storage.ts`, modeled after `loadSpeedSessionRange()` (lines 109-117)
- Signature: `(dates: string[]) => Promise<StrengthSession[]>`
- Uses `AsyncStorage.multiGet()` with `strength-session-YYYY-MM-DD` keys

### 2. Create a `useTrainingHistory` hook

- New file: `hooks/use-training-history.ts`
- On mount, generates a date range for the last 30 days using `dateRange()` from `utils/storage.ts`
- Calls `loadSpeedSessionRange(dates)` and `loadStrengthSessionRange(dates)` in parallel
- Returns:
  - `speedSessions: SpeedSession[]` — sorted by date ascending
  - `strengthSessions: StrengthSession[]` — sorted by date ascending
  - `loading: boolean`
- Exposes derived values:
  - `driverSpeeds: { date: string; mph: number }[]` — extracted from `maxOut.driver` for each session that has a non-null value
  - `latestDriverSpeed: number | null` — most recent driver mph
  - `bestDriverSpeed: number | null` — all-time max driver mph within the 30-day window
  - `strengthSessionCount: number` — total completed sessions in range
  - `latestStrengthDay: { date: string; workoutDay: WorkoutDay; totalVolume: number } | null` — most recent session with volume (sum of weight x reps across all completed sets)

### 3. Create `SpeedTrendCard` component

- New file: `components/speed-trend-card.tsx`
- A card that shows:
  - Section title: "Driver Speed" (uppercase, matches existing `sectionTitle` style)
  - Large hero number: latest driver speed in mph (or `--` if no sessions)
  - Subtitle: "mph" label below the number
  - Below the hero number: "Best: XXX mph" in secondary text
  - A simple trend row showing the last 7 sessions with driver data as small labeled values (date abbreviation + mph), horizontally scrollable if needed
  - Each value pill: date abbreviation on top (e.g., "Mon"), mph value below, using `colors.surface` background
  - The highest value in the row gets `colors.tint` text color; others get `colors.text`
- If no speed sessions exist, show "Complete a speed session to see your&nbsp;trends here" in secondary text (prevent widow)
- Props: `driverSpeeds`, `latestDriverSpeed`, `bestDriverSpeed`, `colors`

### 4. Create `StrengthSummaryCard` component

- New file: `components/strength-summary-card.tsx`
- A card that shows:
  - Section title: "Strength Training" (uppercase, matches existing style)
  - Two-column layout:
    - Left: session count in the last 30 days as a large number with "sessions" label
    - Right: most recent workout day label (e.g., "Pull") with date
  - Below: a row of 4 small indicators for the L/P/L/P rotation showing which workout days have been hit in the last 7 days (filled dot = done, empty dot = not yet)
- If no strength sessions exist, show "Complete a strength workout to see your&nbsp;progress here" in secondary text
- Props: `strengthSessions`, `strengthSessionCount`, `latestStrengthDay`, `colors`

### 5. Integrate into Stats tab

- In `app/(tabs)/stats.tsx`:
  - Import and call `useTrainingHistory()`
  - Add `SpeedTrendCard` after the Weekly Mini-Rings section and before the Habit Breakdown section
  - Add `StrengthSummaryCard` after the `SpeedTrendCard`
  - Only render each card if the user has the corresponding protocol active (`profile.speedProtocol !== null` for speed, `profile.strengthProtocol !== null` for strength) — check via `useUser()` which is already imported
  - Show a loading indicator (ActivityIndicator) while `loading` is true, in place of both cards

## Key Implementation Details

**No charting library.** The speed trend uses simple styled `View`/`Text` pills in a horizontal `ScrollView`, not a line chart. This avoids adding a dependency and keeps the UI consistent with the rest of the app's card-based design.

**30-day window.** Both protocols load 30 days of history. This is enough data to show meaningful trends without loading too much from AsyncStorage. The `dateRange()` helper in `utils/storage.ts:21-29` generates the date array.

**Volume calculation for strength.** Total volume for a session = sum of `(weight ?? 0) * reps` for all completed sets (`set.completed === true`) across all exercises. This gives a single comparable number per workout.

**Date formatting for trend pills.** Use `DAY_LABELS[new Date(dateStr + 'T00:00:00').getDay()]` to get 3-letter day abbreviations, matching the existing pattern in stats.tsx (line 12).

**Empty states.** Both cards handle the case where the user has the protocol active but hasn't logged any sessions yet. The message uses `&nbsp;` or `{'\u00A0'}` to prevent widows per project convention.

## Acceptance Criteria

- [ ] Stats tab shows a "Driver Speed" card with the latest mph when at least one speed session exists
- [ ] The trend row displays up to the last 7 sessions' driver speeds with day labels
- [ ] The best driver speed is displayed below the hero number
- [ ] Stats tab shows a "Strength Training" card with session count and latest workout day
- [ ] The L/P/L/P rotation indicator shows which days were hit in the last 7 days
- [ ] Speed card only appears when `profile.speedProtocol` is set
- [ ] Strength card only appears when `profile.strengthProtocol` is set
- [ ] Both cards show appropriate empty states when protocol is active but no sessions logged
- [ ] Loading state shows while session data is being fetched
- [ ] `loadStrengthSessionRange()` correctly batch-loads strength sessions
- [ ] Cards use existing theme colors and match the visual style of other Stats tab sections

## Files to Touch

- `utils/storage.ts` — add `loadStrengthSessionRange()`
- `hooks/use-training-history.ts` — new hook for loading + deriving training data
- `components/speed-trend-card.tsx` — new component for driver speed display
- `components/strength-summary-card.tsx` — new component for strength summary
- `app/(tabs)/stats.tsx` — integrate both new cards, add loading state
