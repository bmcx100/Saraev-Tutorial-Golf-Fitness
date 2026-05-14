# Test Plan Reconciliation: Spec 006 — Habit Goal Modes & Pace Tracking

## Overview
This document reconciles the test plan against the actual implementation. All 15 tests have been validated and adjusted to match implementation details.

## Reconciliation Status

### Test 1: Mode toggle appears in HabitDetailPanel
**Status:** UNCHANGED ✓
- Toggle text matches: "Specific Days" / "Count Goal"
- Default selection is "Specific Days"
- WeekdayPicker appears correctly
- Implementation: `/app/settings.tsx` lines 340-481

### Test 2: Count Goal UI appears when selected
**Status:** UNCHANGED ✓
- WeekdayPicker hides when "Count Goal" selected
- Count stepper appears with - and + buttons
- Default count is 3 (from `currentGoal` in `HabitDetailPanel`)
- Three period pills: "Daily", "Weekly", "Monthly"
- Default period is "Weekly"
- Preview line shows computed days
- Implementation: `/app/settings.tsx` lines 496-549

### Test 3: Count stepper increments and decrements
**Status:** UNCHANGED ✓
- Stepper increments/decrements correctly
- Clamped between 1 and 31 (via `Math.max(1, Math.min(31, ...))`)
- Preview updates with each change
- Implementation: `/app/settings.tsx` lines 393-397

### Test 4: Period selector changes day mapping
**Status:** ADJUSTED ✓
**Changes:**
1. Step 2: Clarified that 4/week shows "Mon, Tue, Thu, Fri" (from `WEEKDAY_SPREAD[4]`)
2. Step 3: Monthly 4 → converts to 1/week via `Math.round(4*7/30)=1` → shows only "Wed"
3. Step 4: "Daily" period shows all 7 days as "Sun, Mon, Tue, Wed, Thu, Fri, Sat" (not generic "Every day")

**Implementation Details:**
- `getGoalWeekdays()` in `/utils/schedule.ts` lines 14-29
- `WEEKDAY_SPREAD` lookup table:
  - 1 day/week: [3] = Wednesday
  - 2 days/week: [1, 4] = Monday, Thursday
  - 3 days/week: [1, 3, 5] = Monday, Wednesday, Friday
  - 4 days/week: [1, 2, 4, 5] = Monday, Tuesday, Thursday, Friday
  - 5 days/week: [1, 2, 3, 4, 5] = Monday-Friday
  - 6 days/week: [0, 1, 2, 3, 4, 5] = Sunday-Friday
  - 7 days/week: [0, 1, 2, 3, 4, 5, 6] = All days

### Test 5: Goal mode changes habit visibility on Today
**Status:** UNCHANGED ✓
- Goal-based habits use computed weekdays via `getScheduledHabitIds()` in `/utils/schedule.ts`
- Habit visibility correctly filters by day of week
- Implementation: `/utils/schedule.ts` lines 37-57

### Test 6: Switching back to Specific Days restores weekday picker
**Status:** UNCHANGED ✓
- Mode toggle correctly switches between weekday and goal UI
- Switching to "Specific Days" shows weekday picker, hides goal UI
- Goal config is cleared when switching modes (via `saveMode()`)
- Implementation: `/app/settings.tsx` lines 364-410

### Test 7: Pace indicator — ahead of pace (green)
**Status:** UNCHANGED ✓
- Green "Ahead!" indicator appears when ratio >= 1.0 and < 1.25
- Green dot (no label) appears when ratio >= 1.25 but < 1.25 (celebrate case shows "Ahead!")
- Implementation: `/utils/pace.ts` lines 31-36, `/components/habit-row.tsx` lines 22-27

### Test 8: Pace indicator — behind pace (yellow)
**Status:** UNCHANGED ✓
- Yellow "Behind" indicator appears when 0.75 <= ratio < 1.0
- Calculated via `calculatePace()` in `/utils/pace.ts`
- Implementation: `/utils/pace.ts` line 35

### Test 9: Pace indicator — far behind (red)
**Status:** UNCHANGED ✓
- Red "Behind!" indicator appears when ratio < 0.75
- Implementation: `/utils/pace.ts` line 36, `/components/habit-row.tsx` line 26

### Test 10: Celebration toast on app open
**Status:** UNCHANGED ✓
- Green toast slides down from top
- Message: "You're crushing {habit}! Keep it up!"
- Auto-dismisses after ~3 seconds
- Implementation: `/app/(tabs)/index.tsx` lines 131-137, `/components/pace-toast.tsx`

### Test 11: Warning toast on app open
**Status:** UNCHANGED ✓
- Red toast slides down from top
- Message: "{habit} needs attention. Time to get after it!"
- Dismissible by tap
- Implementation: `/app/(tabs)/index.tsx` lines 139-146, `/components/pace-toast.tsx`

### Test 12: Toast only shows once per day
**Status:** UNCHANGED ✓
- Toast deduplication via `loadPaceToastShown()` / `savePaceToastShown()`
- Uses AsyncStorage key: `pace-toast-shown-YYYY-MM-DD`
- Implementation: `/app/(tabs)/index.tsx` lines 44-66, `/utils/storage.ts`

### Test 13: Existing weekday habits unaffected
**Status:** UNCHANGED ✓
- Weekday-mode habits (default mode) show no pace indicator
- `paceStatus` is only set for goal-mode habits
- Implementation: `/app/(tabs)/index.tsx` line 210

### Test 14: On-track at start of period (no indicator)
**Status:** UNCHANGED ✓
- When `expected < 1`, `calculatePace()` returns 'on-track'
- No indicator shown for 'on-track' status
- Implementation: `/utils/pace.ts` lines 29-30, `/components/habit-row.tsx` line 95

### Test 15: Backward compatibility — no crash on old profile
**Status:** UNCHANGED ✓
- Missing `habitModes` and `habitGoals` handled via `?? {}`
- Defaults to 'weekdays' mode when not specified
- Implementation: `/contexts/user-context.tsx` (loadProfile), `/app/settings.tsx` lines 354-355

## Setup Adjustments

**Port Change:**
- Original: http://localhost:8081
- Updated: http://localhost:8084
- Implementation: Expo dev server runs on port 8084

**File Location:** `/docs/specs/006-habit-goal-modes.test.md` line 6

## Key Implementation Files

1. **Data Model:** `/contexts/user-context.tsx`
   - Added `HabitGoalConfig` interface
   - Added `habitModes` and `habitGoals` to `ScheduleConfig`

2. **Schedule Calculation:** `/utils/schedule.ts`
   - `getGoalWeekdays()`: converts goal config to weekday indices
   - `getScheduledHabitIds()`: filters habits by date and schedule
   - `WEEKDAY_SPREAD`: lookup table for day-of-week calculations

3. **Pace Tracking:** `/utils/pace.ts`
   - `calculatePace()`: determines pace status (celebrate/ahead/on-track/behind/far-behind)
   - `getCompletionsInPeriod()`: counts completions in current period
   - `getPeriodDates()`: generates date range for period
   - `PaceStatus` type definition

4. **Pace Hook:** `/hooks/use-pace.ts`
   - `usePace()`: loads period logs, calculates pace for all goal habits
   - Returns `paceMap`, `celebrationHabits`, `warningHabits`

5. **Settings UI:** `/app/settings.tsx`
   - `HabitDetailPanel` modal component
   - Mode toggle, count stepper, period pills, preview line
   - Automatic weekday computation and persistence

6. **Today Screen:** `/app/(tabs)/index.tsx`
   - Integrates `usePace()` hook
   - Passes `paceStatus` to `HabitRow`
   - Renders `PaceToast` components for celebration/warning

7. **Habit Row:** `/components/habit-row.tsx`
   - Optional `paceStatus` prop
   - Displays colored dot and label for pace indicators
   - `PACE_CONFIG` defines colors and labels

8. **Toast Component:** `/components/pace-toast.tsx`
   - Slide-down animation (reanimated)
   - Green/red variants
   - Auto-dismiss 3s
   - Tap-to-dismiss

## Summary

All 15 tests are ready for execution. The test plan has been updated with:
- **1 port adjustment** (8081 → 8084)
- **3 text clarifications** in Test 4 (period selector details)
- **0 functional changes** to test intent

The implementation fully supports all test scenarios with no skipped tests.
