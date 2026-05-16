# Spec 020: History Tab

## What This Feature Does

Replaces the Stats tab with a History tab — a reverse-chronological feed of training activity centered on speed progress. Every piece of data connects back to getting faster. The tab shows a speed hero card, weekly activity strip, gym-to-speed connection narrative, monthly consistency calendar, and a scrollable activity feed. Existing detail views (stats-speed, stats-strength) remain accessible as deep dives.

## Current State

The Stats tab (`app/(tabs)/stats.tsx`) currently renders:
- Streak badge (if active, computed from `useHabits()` week logs)
- Weekly mini-rings (7-day habit completion visualization, `components/mini-rings.tsx`)
- Speed hook card (`components/speed-hook-card.tsx`) — driver PR display, tappable → `/stats-speed`
- Strength hook card (`components/strength-hook-card.tsx`) — streak/PR display, tappable → `/stats-strength`
- Habit breakdown (7-day per-habit completion rates)
- Record cards (Best Streak, Total Logs, Challenges Completed)

Data sources: `useHabits()`, `useChallenges()`, `useStatsAggregates()`.

The floating tab bar (`components/ui/floating-tab-bar.tsx`) labels the third tab "Stats" with a chart icon (`chart.bar.fill` / `bar-chart`).

Detail views (`app/stats-speed.tsx`, `app/stats-strength.tsx`) provide deep analytics (trend charts, per-field PRs, consistency, session history). These are unchanged by this spec.

Habit logs stored at `habit-logs-YYYY-MM-DD`. Speed sessions at `speed-session-YYYY-MM-DD`. Strength sessions at `strength-session-YYYY-MM-DD`. All loadable via existing storage helpers.

## Changes Required

### 1. Create `useHistoryData` hook

New file: `hooks/use-history-data.ts`

Loads on mount:
- 30 days of speed sessions via `loadSpeedSessionRange()`
- 30 days of strength sessions via `loadStrengthSessionRange()`
- 30 days of habit logs via `AsyncStorage.multiGet()` on `habit-logs-YYYY-MM-DD` keys
- `SpeedStats` via `loadSpeedStats()`
- `StrengthStats` via `loadStrengthStats()`
- User profile via `useUser()` (for active habits, schedule, protocols)
- Active challenge via `useChallenges()`

Returns:

- `dailyActivity: Map<string, DayActivity>` — merged per-day map where `DayActivity` is:
  ```typescript
  { habitsCompleted: number; habitsTotal: number;
    speedSession?: { driverMph: number | null; greenMph: number | null };
    strengthSession?: { workoutDay: WorkoutDay; volume: number } }
  ```
- `speedStats: SpeedStats | null`
- `strengthStats: StrengthStats | null`
- `driverTrend: { direction: 'up' | 'down' | 'flat'; delta: number }` — latest driver speed vs earliest in 30-day window. `'up'` if delta > 0, `'down'` if < 0, `'flat'` if 0 or insufficient data.
- `speedJourney: { firstMph: number; currentMph: number; gain: number } | null` — earliest vs latest driver speed in 30-day window. Null if fewer than 2 speed sessions.
- `gymSpeedConnection: { gymSessions30d: number; driverDelta: number } | null` — gym session count and driver speed change over same period. Null if no gym sessions.
- `monthDays: { date: string; level: 0 | 1 | 2 | 3 }[]` — every day of the current calendar month. Level 0 = no activity. Level 1 = any habit completed. Level 2 = 50%+ habits completed. Level 3 = all habits completed OR any training session logged.
- `activeDaysCount: number` — days in the current month with level > 0
- `currentStreak: number` — consecutive days with at least 1 activity (from today backward)
- `loading: boolean`

### 2. Rewrite Stats tab as History tab

Replace the contents of `app/(tabs)/stats.tsx` with a `SafeAreaView` + `ScrollView` containing the sections below. Show `ActivityIndicator` while `loading` is true.

#### Section A: Speed Hero Card

Renders when user has `profile.speedProtocol` set. Always first.

- Background: forest gradient (reuse linear gradient pattern — `colors.tint` at 15% opacity over `colors.surface`)
- Hero number: latest driver speed from `speedStats.driverPR.mph` (fontSize 56, Outfit ExtraBold)
- "mph" unit label below in secondary text
- Trend badge below unit:
  - If `driverTrend.direction === 'up'`: "↑ {delta} mph this month" in accent color
  - If `'flat'`: "→ Holding steady" in secondary text
  - If `'down'` or no recent sessions: "Train to get back on track" in secondary text
- Journey line: "Started at {first} → Now at {current}" in secondary text (only if `speedJourney` is non-null)
- If `speedStats.driverPR.date` is within 2 days of today: green "NEW PR" pill badge above the hero number
- `Pressable` — taps navigate to `/stats-speed`
- Chevron-right icon at top-right corner
- **Empty state** (no speed sessions): "Complete your first speed session to see your\u00A0progress" centered, with accent-tinted tap target

#### Section B: This Week Strip

Horizontal row of 7 day cards, Monday through Sunday. Today's card highlighted with accent border.

Each card:
- Day abbreviation label (Mon, Tue, etc.) at top
- Below: stacked activity indicators
  - Circle: filled green if all habits done, filled amber if some, outline only if none
  - "S" pill badge (small, accent) if speed session logged that day
  - "G" pill badge (small, accent) if strength session logged that day
- Future days show as empty outlines

Cards are not tappable (activity feed below provides the detail).

#### Section C: Gym-to-Speed Connection Card

Renders only when user has BOTH `speedProtocol` and `strengthProtocol` active AND at least 1 gym session exists in the 30-day window.

- Card with subtle forest-tint background (lighter than hero)
- Bold heading: "Strength → Speed"
- Body line 1: "{gymSessions30d} gym sessions this month"
- Body line 2 (conditional):
  - If `gymSpeedConnection.driverDelta > 0`: "Your driver speed is up {delta} mph" in accent
  - If `driverDelta === 0` and gym sessions > 0: "Building the power for your next speed\u00A0PR"
  - If `driverDelta < 0`: "Keep building — the speed will\u00A0follow"
- If `strengthStats.lastPR` exists: show "{exerciseName} PR: {weight} lbs — fueling your\u00A0swing" in secondary text
- `Pressable` — taps navigate to `/stats-strength`

#### Section D: Monthly Consistency Calendar

- Header: month and year ("May 2026")
- 7-column grid (S M T W T F S), rows for each week of the month
- Each cell sized as a small square (~36px), colored by level:
  - Level 0: `colors.border` background
  - Level 1: `colors.accent` at 20% opacity
  - Level 2: `colors.accent` at 50% opacity
  - Level 3: `colors.accent` at full opacity
- Today's cell: accent ring border to distinguish from filled cells
- Days outside the current month: invisible (empty space preserving grid alignment)
- Below grid: "{activeDaysCount} of {totalDaysInMonth} days active" in secondary text
- If `currentStreak > 0`: append " · {currentStreak}-day streak"

#### Section E: Recent Activity Feed

Section heading: "Recent Activity"

Reverse-chronological list of days from the last 30 days. Only days with activity are shown — rest days are omitted.

Each day with activity gets a date header: "Today", "Yesterday", or "Day, Month Date" (e.g., "Wednesday, May 13"). Entries below each header:

**Speed session entry:**
- Left: BoltIcon (from `components/ui/design-icons.tsx`) in accent color
- "Speed Training" label
- Primary stat: "Driver {mph} mph" — green "PR" badge if this session set the current driver PR
- Secondary stat: "Green {mph} mph" if available

**Strength session entry:**
- Left: DumbbellIcon in accent color
- "{workoutDay} Day" label (e.g., "Push Day")
- Primary stat: "Volume: {volume} lbs"
- Secondary stat: exercise PR if one was set that day — "{exercise} PR: {weight} lbs"

**Habit-only entry** (habits completed but no training session):
- Left: checkmark icon in accent color
- "{completed}/{total} habits completed"

If a day has both speed and strength entries, show both under the same date header (speed first).

Feed limited to 30 days. Below feed: "Showing last 30 days" in secondary text.

#### Section F: Records Bar

Compact horizontal row of 3 stats at the bottom:
- "Best Streak" — `strengthStats.bestStreak` or longest habit streak, whichever is higher
- "Sessions" — total speed + strength sessions in 30-day window
- "Challenges" — completed challenges count from `useChallenges()`

Each stat: large number + small label below. Secondary visual weight — this is context, not the hero content.

### 3. Update tab bar

In `components/ui/floating-tab-bar.tsx`:
- Change the third tab label from "Stats" to "History"
- Change icon from `chart.bar.fill` (iOS) / `bar-chart` (Android) to `clock.fill` / `history`

Add the icon mapping in `components/ui/icon-symbol.tsx` for `clock.fill` → `history` (MaterialIcons) if not already mapped.

### 4. Clean up unused components

After rewriting stats.tsx, verify and remove unused files:
- `components/speed-hook-card.tsx` — only imported by stats.tsx
- `components/strength-hook-card.tsx` — only imported by stats.tsx
- `components/mini-rings.tsx` — verify no other imports before removing

Grep for imports of each component across the codebase before deleting. If any are used elsewhere, keep them.

`hooks/use-stats-aggregates.ts` — keep. The new `useHistoryData` hook uses `loadSpeedStats()` and `loadStrengthStats()` directly (same storage functions), but the aggregates hook may still be needed by detail views or the celebrations spec (019).

## Key Implementation Details

**Speed-first ordering.** The Speed Hero Card is always section A when the user has speed sticks active. Even if the most recent session was a gym workout, speed leads. The app's purpose is getting faster — the History tab reflects that.

**Gym-to-speed framing.** The connection card never frames strength as an independent goal. Language always ties gym work back to speed: "fueling your swing," "building power," "the speed will follow." Users are training to get faster, not to be weightlifters.

**30-day data window.** `useHistoryData` loads speed, strength, and habit data for 30 days and merges into `dailyActivity`. One set of AsyncStorage reads at mount. The merged map powers the calendar, feed, week strip, and connection card.

**Calendar level calculation.** Level 3 (full activity) triggers when all habits are done OR any training session was logged. Training days always show as "full" — a speed or gym session is a significant effort regardless of other habits.

**Activity feed is display-only.** Feed entries are not tappable in this spec. The hero cards provide navigation to detail views. A future spec could make feed entries tap to expand or navigate.

**Mini-rings replacement.** The This Week Strip replaces mini-rings with richer per-day information (specific session types, not just category completeness). Mini-rings are removed from the History tab but may be used elsewhere.

**Records bar is minimal.** The bottom records section provides context without competing with the hero content. Small numbers, small labels, quiet styling.

**No new data storage.** This spec reads from existing AsyncStorage keys and aggregates. No new persistence needed. The `useHistoryData` hook is a read-only composition of existing data sources.

## Acceptance Criteria

- [ ] Stats tab is replaced with History tab (new label "History", new icon)
- [ ] Speed Hero Card shows latest driver speed as a large number when speed data exists
- [ ] Speed Hero Card shows trend direction ("↑ X mph this month" / "Holding steady" / "Train to get back on track")
- [ ] Speed Hero Card shows journey line ("Started at X → Now at Y") when 2+ sessions exist
- [ ] Speed Hero Card shows "NEW PR" badge when PR is within 2 days
- [ ] Speed Hero Card navigates to /stats-speed on tap
- [ ] Speed Hero Card is always the first section when speedProtocol is active
- [ ] This Week Strip shows 7 days (Mon-Sun) with activity indicators
- [ ] Each day in the strip shows habit completion status + speed/strength badges
- [ ] Today is highlighted in the week strip
- [ ] Gym-to-Speed Connection card renders only when both protocols are active with gym data
- [ ] Connection card frames strength through speed lens (never standalone strength language)
- [ ] Connection card navigates to /stats-strength on tap
- [ ] Monthly calendar shows current month with 4-level activity heatmap
- [ ] Today has a ring border on the calendar
- [ ] Active days count and streak display below calendar
- [ ] Activity feed lists speed sessions, strength sessions, and habit-only days
- [ ] Speed entries show driver mph with PR badge when applicable
- [ ] Strength entries show workout day and volume
- [ ] Feed entries are grouped under date headers
- [ ] Records bar shows streak, session count, and challenges at the bottom
- [ ] Loading state shows while data is being fetched
- [ ] Empty state shows when no training data exists
- [ ] Existing detail views (stats-speed, stats-strength) continue to work
- [ ] Unused hook card components are cleaned up

## Files to Touch

- `hooks/use-history-data.ts` — new hook for merged 30-day activity data
- `app/(tabs)/stats.tsx` — complete rewrite as History tab
- `components/ui/floating-tab-bar.tsx` — rename tab label, change icon
- `components/ui/icon-symbol.tsx` — add clock/history icon mapping if needed
- `components/speed-hook-card.tsx` — delete after verifying unused
- `components/strength-hook-card.tsx` — delete after verifying unused
- `components/mini-rings.tsx` — delete after verifying unused
