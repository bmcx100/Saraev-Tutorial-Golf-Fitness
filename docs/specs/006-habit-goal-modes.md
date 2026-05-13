# Spec 006: Habit Goal Modes & Pace Tracking

## What This Feature Does

Adds a second scheduling option per habit: instead of picking specific weekdays, users can set a count goal with a period (daily/weekly/monthly). The system calculates which days to show the habit, tracks pace through the period, shows inline pace indicators on habit rows, and fires toasts when the user is crushing it or falling behind.

## Current State

The `HabitDetailPanel` modal in `app/settings.tsx` (line 346) opens when tapping the gear icon on any habit in Settings. It shows a `WeekdayPicker` for day-of-week scheduling. `ScheduleConfig` in `contexts/user-context.tsx` (line 4) stores `habitWeekdays: { [habitId]: number[] }`. `utils/schedule.ts` has `getScheduledHabitIds()` which filters habits by weekday match or includes them daily when no weekdays are set. `components/habit-row.tsx` displays icon + name + completion circle with no pace information. There is no toast system.

## Changes Required

### 1. Data Model — Add Goal Config to ScheduleConfig

In `contexts/user-context.tsx`, extend `ScheduleConfig`:

```typescript
export interface HabitGoalConfig {
  count: number;                           // e.g., 3
  period: 'daily' | 'weekly' | 'monthly'; // goal period
}

export interface ScheduleConfig {
  categoryRotations: { ... };  // unchanged
  habitWeekdays: { ... };      // unchanged, now also holds auto-generated days for goal habits
  habitModes: {
    [habitId: string]: 'weekdays' | 'goal';
  };
  habitGoals: {
    [habitId: string]: HabitGoalConfig;
  };
}
```

Default values: `habitModes: {}`, `habitGoals: {}`. Missing key = `'weekdays'` mode (backward compatible).

When a habit is in `'goal'` mode, `habitWeekdays[habitId]` is auto-populated from the goal (see section 2). When in `'weekdays'` mode, the existing manual weekday picker applies.

### 2. Goal-to-Weekday Mapping — utils/schedule.ts

New exported function `getGoalWeekdays(goal: HabitGoalConfig): number[]`:

- **daily**: return `[0,1,2,3,4,5,6]` (every day)
- **weekly**: use `goal.count` directly as days-per-week, pick from predefined spread
- **monthly**: convert to weekly rate `Math.round(count * 7 / 30)`, clamp 1-7, use same spread

Predefined even-spread mapping (days-per-week to weekday indices):

| Days/week | Weekdays | Labels |
|-----------|----------|--------|
| 1 | [3] | Wed |
| 2 | [1, 4] | Mon, Thu |
| 3 | [1, 3, 5] | Mon, Wed, Fri |
| 4 | [1, 2, 4, 5] | Mon, Tue, Thu, Fri |
| 5 | [1, 2, 3, 4, 5] | Mon-Fri |
| 6 | [0, 1, 2, 3, 4, 5] | Sun-Fri |
| 7 | [0, 1, 2, 3, 4, 5, 6] | Every day |

Update `getScheduledHabitIds()`: no changes needed since it already reads `habitWeekdays`. The key is that saving a goal auto-writes the computed weekdays into `habitWeekdays[habitId]`.

### 3. Pace Calculation — New utils/pace.ts

```typescript
export type PaceStatus = 'celebrate' | 'ahead' | 'on-track' | 'behind' | 'far-behind';

export function calculatePace(
  completions: number,
  goalCount: number,
  goalPeriod: 'daily' | 'weekly' | 'monthly',
  currentDate: Date,
): PaceStatus
```

**Period boundaries:**
- **daily**: single day, expected = goalCount, completions = count today
- **weekly**: Monday (day 1) through Sunday (day 0). Elapsed = daysSinceMonday + 1. Expected = goalCount * elapsed / 7.
- **monthly**: 1st through last day. Elapsed = current day of month. Expected = goalCount * elapsed / daysInMonth.

**Ratio:** `completions / expected`

**Thresholds (simple ratio):**
- `expected < 1` → `'on-track'` (too early in the period to judge)
- `ratio >= 1.25` → `'celebrate'`
- `ratio >= 1.0` → `'ahead'`
- `ratio >= 0.75` → `'behind'`
- `ratio < 0.75` → `'far-behind'`

**Helper:** `getCompletionsInPeriod(habitId, goalPeriod, currentDate, logsMap)` — counts how many days within the current period have a completed log for this habit. Uses `loadLogsForRange()` from storage.

### 4. Pace Hook — New hooks/use-pace.ts

```typescript
export function usePace(): {
  paceMap: Map<string, { status: PaceStatus; completions: number; expected: number }>;
  celebrationHabits: string[];   // habit names at 'celebrate'
  warningHabits: string[];       // habit names at 'far-behind'
}
```

- Reads `profile.schedule.habitModes` and `profile.schedule.habitGoals` from `useUser()`
- For each goal-mode habit, loads logs for the current period using `loadLogsForRange()`
- Calculates pace using `calculatePace()`
- Returns the map plus convenience arrays for toast triggers
- Depends on `devDateOverride` for testability
- Memoize and only recalculate when logs, profile, or date change

### 5. HabitDetailPanel — Mode Toggle UI (app/settings.tsx)

Replace the simple weekday picker section with a mode selector:

**Two-segment toggle:** `Specific Days` | `Count Goal`

Reads current mode from `schedule.habitModes[habit.id] ?? 'weekdays'`.

**When "Specific Days" is selected:**
- Show existing `WeekdayPicker` (unchanged)
- Hint: "No days selected = every day"

**When "Count Goal" is selected:**
- **Count stepper**: `-` `[number]` `+` buttons. Range: 1-31. Default: 3.
- **Period selector**: Three pill buttons — `Daily` / `Weekly` / `Monthly`. Default: `weekly`.
- **Preview line**: "Shows on Mon, Wed, Fri" (computed from `getGoalWeekdays`)
- **Pace explainer**: Small text: "We'll track your pace and cheer you on"

**On save (any change):**
- Update `schedule.habitModes[habitId]`
- If goal mode: update `schedule.habitGoals[habitId]` AND auto-write computed days to `schedule.habitWeekdays[habitId]`
- If weekdays mode: remove `habitGoals[habitId]`, keep manual weekdays

### 6. HabitRow — Pace Indicator (components/habit-row.tsx)

New optional prop: `paceStatus?: PaceStatus`

When `paceStatus` is provided and not `'on-track'`, render a small indicator between the habit name/info area and the check circle:

| Status | Dot Color | Label | Text Color |
|--------|-----------|-------|------------|
| celebrate | `#52B788` (accent) | "Ahead!" | `#52B788` |
| ahead | `#52B788` | (no label, just dot) | — |
| on-track | (nothing) | — | — |
| behind | `#F59E0B` (yellow) | "Behind" | `#F59E0B` |
| far-behind | `#E63946` (red) | "Behind!" | `#E63946` |

The indicator is a small 8px colored circle followed by the label text (fontSize 12, fontWeight 600). Positioned in a View with `flexDirection: 'row'`, `alignItems: 'center'`, `gap: 4`.

### 7. Today Screen — Pace Toasts (app/(tabs)/index.tsx)

**On mount** (or when `today` date changes), check pace for all goal-based habits via `usePace()`.

**Toast triggers (once per day per category):**
- If `celebrationHabits.length > 0`: green toast — "You're crushing [first habit name]! Keep it up!" with a star icon
- If `warningHabits.length > 0`: red toast — "[first habit name] needs attention. Time to get after it!" with a warning icon

**Toast dedup:** Store `pace-toast-shown-YYYY-MM-DD` in AsyncStorage. Skip if already shown today.

**Priority:** Show celebration toast first (3s), then warning toast (3s) if both exist. Delay 500ms between.

**Toast component** (`components/pace-toast.tsx`):
- Animated slide-down from top (reanimated `withTiming`, translateY from -100 to 0)
- Rounded card with icon + message text
- Green background (#52B788 at 15% opacity) for celebration, red (#E63946 at 15% opacity) for warning
- Auto-dismiss after 3 seconds
- Tap to dismiss early
- Rendered above ScrollView content using absolute positioning

### 8. Pass Pace Data Through — Today Screen Wiring

In `app/(tabs)/index.tsx`:
- Call `usePace()` to get `paceMap`
- For each habit in the category loop, look up `paceMap.get(habit.id)?.status`
- Pass as `paceStatus` prop to `<HabitRow>`

## Key Implementation Details

- **Backward compatibility**: Existing users have no `habitModes` or `habitGoals` keys. Default to `'weekdays'` mode. Add `?? {}` fallbacks in `loadProfile()` if needed.
- **Monthly period length**: Use actual days in current month (`new Date(year, month, 0).getDate()`), not fixed 30.
- **Week start**: Monday (ISO standard). `getDay()` returns 0=Sun, so Monday = 1. Calculate elapsed as `(getDay() + 6) % 7 + 1` (Mon=1, Sun=7).
- **Daily goals**: `goalCount > 1` with `period: 'daily'` is supported but requires the habit to effectively act as a counter for the day. Override the habit's effective `targetCount` in `HabitContext.getHabitProgress()` when goal mode is active with daily period.
- **Log loading range**: For weekly pace, load 7 days. For monthly, load up to 31 days. Use `loadLogsForRange()` which already supports `multiGet()`.
- **Segment control**: Use two `Pressable` buttons in a row with border styling. Active segment gets `accent` background, inactive gets transparent with border.

## Acceptance Criteria

- [ ] Tapping gear on a habit in Settings shows a two-segment toggle: "Specific Days" / "Count Goal"
- [ ] Selecting "Count Goal" reveals count stepper (1-31) and period pills (Daily/Weekly/Monthly)
- [ ] Preview text updates live showing which days the habit will appear
- [ ] Saving a goal auto-generates weekdays and the habit appears only on those days on Today
- [ ] Switching back to "Specific Days" restores manual weekday picker
- [ ] Goal-based habits show colored pace indicator (dot + label) on the Today screen habit row
- [ ] Pace updates correctly: celebrate at 125%+, ahead at 100%+, behind at 75-99%, far-behind at <75%
- [ ] Green celebration toast shows once daily when any habit is at celebrate pace
- [ ] Red warning toast shows once daily when any habit is at far-behind pace
- [ ] Toasts auto-dismiss after 3 seconds and can be tapped to dismiss
- [ ] Existing weekday-scheduled habits are unaffected (backward compatible)
- [ ] Dev date override works correctly with pace calculations

## Files to Touch

- `contexts/user-context.tsx` — Add `HabitGoalConfig`, `habitModes`, `habitGoals` to `ScheduleConfig` + defaults
- `utils/schedule.ts` — Add `getGoalWeekdays()` function
- `utils/pace.ts` — **New file**: `PaceStatus` type, `calculatePace()`, `getCompletionsInPeriod()`
- `hooks/use-pace.ts` — **New file**: `usePace()` hook
- `app/settings.tsx` — Rework `HabitDetailPanel` with mode toggle, count stepper, period pills, preview
- `components/habit-row.tsx` — Add optional `paceStatus` prop + colored indicator
- `components/pace-toast.tsx` — **New file**: animated toast component
- `app/(tabs)/index.tsx` — Wire `usePace()`, pass `paceStatus` to rows, render toasts on mount
- `utils/storage.ts` — Add `loadPaceToastShown()` / `savePaceToastShown()` for daily dedup
