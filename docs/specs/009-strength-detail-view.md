# Spec 009: Strength Detail View

## What This Feature Does

Replaces the "Coming soon" placeholder at `/stats-strength` with a full-screen scrolling detail view for strength training analytics. Shows workout rotation progress, volume trend graph, per-exercise PRs, streak milestones, and a session history log with inline expand. Accessed by tapping the strength hook card on the Stats tab.

## Current State

`app/stats-strength.tsx` exists as a stub screen with a top bar (back arrow + "Strength Stats" title) and centered "Coming soon" text. Created in spec 007 and registered in `app/_layout.tsx` as a Stack.Screen with `headerShown: false, presentation: 'card'`.

Aggregate strength stats are already computed at write-time (spec 007). `StrengthStats` in `utils/storage.ts` stores `exercisePRs` (keyed by exerciseId with weight/reps/date), `streak` (days + lastSessionDate), `bestStreak`, and `lastPR`. Available via `loadStrengthStats()`.

Session history is loadable via `loadStrengthSessionRange(dates)` in `utils/storage.ts`. The existing `useTrainingHistory` hook loads 30 days of both speed and strength sessions — this spec creates a focused hook that loads only strength data.

The `WORKOUT_DAYS` constant in `constants/strength-protocols.ts` defines 4 rotation days (legs1/pull/legs2/push) with exercise lists. `STREAK_MILESTONES` is `[7, 14, 21, 30, 60, 90]`. The `StrengthSession` interface has `date`, `protocol`, `workoutDay`, `exercises` (array of `ExerciseLog`), and `completedAt`.

## Changes Required

### 1. Create `useStrengthDetail` hook

New file: `hooks/use-strength-detail.ts`

Loads on mount:
- 30 days of strength sessions via `loadStrengthSessionRange` (same date range pattern as `useTrainingHistory`)
- `StrengthStats` via `loadStrengthStats`

Computes and returns:
- `sessions: StrengthSession[]` — sorted most-recent-first
- `sessionVolumes: { date: string; volume: number; workoutDay: WorkoutDay }[]` — one entry per session, volume = sum of `(set.weight ?? 0) * set.reps` for completed sets, sorted date-ascending (for chart)
- `currentCycle: { completed: WorkoutDay[]; total: number }` — see cycle logic below
- `strengthStats: StrengthStats | null` — raw aggregate stats for PRs and streaks
- `loading: boolean`

**Cycle logic:** Scan the 30-day sessions chronologically. Each time all 4 unique workout days have been seen since the last cycle boundary, increment `total` and reset tracking. After the scan, `completed` contains the workout days seen in the in-progress cycle (may be 0-3 days). If the same workout day appears multiple times before a full cycle completes, it still only counts once toward cycle completion.

### 2. Replace `app/stats-strength.tsx` stub

Replace the stub with a `ScrollView` containing 5 sections. Keep the existing top bar (back arrow + "Strength Stats" title). All sections use the `useStrengthDetail` hook.

Show a loading spinner (centered `ActivityIndicator`) while `loading` is true. If `sessions` is empty and `strengthStats` is null, show a centered empty state: "Complete a strength workout to see your stats here."

#### Section 1: Workout Frequency

Section heading: "Rotation Progress"

A row of 4 indicators representing the L/P/L/P rotation:
- Each indicator is a rounded rectangle with the day label inside (L1, Pull, L2, Push)
- Completed days in the current cycle: filled with `colors.accent` background, white text
- Remaining days: outlined with `colors.border`, `colors.textSecondary` text
- Below the row: "{total} cycles completed" in secondary text
- If `total` is 0 and `currentCycle.completed` is empty, show "Start your first rotation" instead

#### Section 2: Volume Trend Graph

Section heading: "Session Volume"

**Dependency: requires the chart library introduced in spec 008.** If implementing before 008, use a placeholder identical to the current stub ("Volume chart coming soon").

When the chart library is available:
- Bar chart with `sessionVolumes` data
- X-axis: dates (show month/day labels for readability)
- Y-axis: volume in lbs
- Each bar colored by workout day: use 4 distinct but cohesive colors derived from the theme
- Tap a bar to show a tooltip with exact volume + workout day label
- If fewer than 2 sessions exist, show "Log more sessions to see volume trends" instead of the chart

#### Section 3: Per-Exercise PRs

Section heading: "Personal Records"

Grouped by workout day using `WORKOUT_DAYS` order (Legs 1, Pull, Legs 2, Push). Each group has a subheading with the day label and subtitle (e.g., "Legs 1 — Quads").

For each exercise in the group, show a row:
- Exercise name (left)
- PR weight + reps (right), e.g., "135 lbs x 8"
- Date below the weight in secondary text, formatted as "May 10" (month + day)
- If no PR exists for the exercise, show "—" in place of weight/reps

**Deduplication:** Track which exerciseIds have already been rendered. If an exercise appears in multiple workout days (calf-raises, tib-raises appear in both legs1 and legs2), only show it under the first workout day where it appears. Skip it in subsequent groups.

**Recent PR highlight:** If a PR's date matches the most recent session's date, show a small green "NEW" badge next to the weight.

#### Section 4: Streak History

Section heading: "Streak"

Two stat boxes side by side:
- "Current" — `strengthStats.streak.days` (or 0 if no stats), large number
- "Best" — `strengthStats.bestStreak` (or 0), large number

Below: a row of milestone markers for `STREAK_MILESTONES` [7, 14, 21, 30, 60, 90]:
- Each marker is a circle with the number inside
- Achieved milestones (`bestStreak >= milestone`): filled with `colors.accent`, white text
- Unachieved: outlined with `colors.border`, `colors.textSecondary` text
- Smallest milestones on the left, largest on the right

#### Section 5: Session History Log

Section heading: "Recent Sessions"

A list of session rows, most recent first. Each row shows:
- Date (left), formatted as "Wed, May 10"
- Workout day label (right of date), e.g., "Push"
- Total session volume in lbs (right-aligned)

**Inline expand:** Tapping a row toggles its expanded state. When expanded, show below the row:
- Each exercise from the session
- For each exercise: name, then its sets listed as "Set 1: 50 lbs x 8 ✓" or "Set 2: — (skipped)" for incomplete sets
- Use `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` for smooth expand/collapse

Only one session can be expanded at a time — tapping a different row collapses the currently expanded one.

### 3. Verify route registration

`app/stats-strength.tsx` is already registered in `app/_layout.tsx` from spec 007. No changes needed to the layout unless the route was removed — verify and re-add if necessary.

## Key Implementation Details

**Volume calculation:** `(set.weight ?? 0) * set.reps` for each completed set (`set.completed === true`), summed across all exercises in the session. Matches the pattern in `useTrainingHistory`.

**30-day window reuses existing infrastructure.** The `dateRange` and `loadStrengthSessionRange` functions in `utils/storage.ts` handle the date math and multi-get. Same pattern as `useTrainingHistory` but without loading speed sessions.

**Cycle counting is display-only.** The cycle count is computed from the loaded 30-day window, not stored. Cycles that started before the 30-day window may be partially counted — this is acceptable since the frequency view shows recent activity, not lifetime totals.

**PR data comes from aggregates, not session scans.** `StrengthStats.exercisePRs` contains all-time PRs computed at write-time (spec 007). The detail view reads this directly rather than recomputing from the 30-day session window. This means PRs from sessions older than 30 days are still displayed correctly.

**Deduplication order for shared exercises.** `WORKOUT_DAYS` is iterated in definition order: legs1, pull, legs2, push. Calf-raises and tib-raises appear in legs1 first, so they render under the Legs 1 group. They are skipped when legs2 is rendered.

**LayoutAnimation for inline expand** requires no additional library — it's built into React Native. Import from `react-native` directly. Works on iOS and Android. On web, the expand will be instant (no animation) which is acceptable.

## Acceptance Criteria

- [ ] Stats-strength screen shows 5 sections in a scrollable view (rotation, volume, PRs, streak, history)
- [ ] Workout frequency shows which L/P/L/P days are completed in the current cycle
- [ ] Cycle count reflects complete rotations within the 30-day window
- [ ] Volume trend section shows placeholder text if spec 008 chart library is not available
- [ ] Per-exercise PRs are grouped under Legs 1, Pull, Legs 2, Push headings
- [ ] Shared exercises (calf-raises, tib-raises) appear only once, under their first workout day
- [ ] PRs from the most recent session show a "NEW" badge
- [ ] Current streak and best streak display correctly from aggregate stats
- [ ] Milestone markers show achieved vs unachieved milestones
- [ ] Session history lists sessions most-recent-first with date, workout day, and volume
- [ ] Tapping a session row expands it inline to show exercise and set details
- [ ] Only one session is expanded at a time
- [ ] Empty state shows when no strength sessions exist
- [ ] Back arrow navigates back to Stats tab
- [ ] Screen loads within 30-day window using existing storage helpers

## Files to Touch

- `hooks/use-strength-detail.ts` — new hook for strength detail view data
- `app/stats-strength.tsx` — replace stub with full implementation
- `app/_layout.tsx` — verify route registration (likely no changes needed)
