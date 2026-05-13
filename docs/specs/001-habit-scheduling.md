# Spec 001: Habit Scheduling

## What This Feature Does

Lets users schedule habits to specific days — either by assigning them to weekdays (Mon–Sun) or by setting up a rotating cycle within a category (e.g., a 4-day workout rotation: L1 / Push / L2 / Push). Habits not scheduled for today are hidden from the Today screen.

## Current State

Habits are defined in `constants/habits.ts` as a static `HABIT_LIBRARY` array with two categories: `golf` and `workout`. Users select which habits are active via `profile.activeHabitIds` in `contexts/user-context.tsx:4-11`. All active habits appear every day — no day-based filtering exists.

`contexts/habit-context.tsx:36-38` computes `activeHabits` by filtering `HABIT_LIBRARY` against `profile.activeHabitIds`. This is what the Today screen renders.

The "all done" check at `contexts/habit-context.tsx:121-124` tests every active habit. With scheduling, it must only check today's scheduled habits.

Settings screen (`app/settings.tsx`) has a "My Sessions" section listing all habits with toggle checkmarks, a "Notifications" section, and a "Preferences" section. Schedule config will be added as a new section.

## Changes Required

### 1. Data Model — Schedule Config

Add to `contexts/user-context.tsx`:

```typescript
interface ScheduleConfig {
  // Category-level rotation: one habit per day, cycling in defined order
  categoryRotations: {
    [category: string]: {
      sequence: string[];   // habit IDs, length = cycle length (repeats allowed)
      startDate: string;    // YYYY-MM-DD — when Day 1 begins
    };
  };
  // Per-habit weekday assignments (for habits NOT in a rotating category)
  habitWeekdays: {
    [habitId: string]: number[];  // 0=Sun, 1=Mon, ..., 6=Sat
  };
}
```

Add `schedule: ScheduleConfig` to `UserProfile` with default `{ categoryRotations: {}, habitWeekdays: {} }`.

### 2. Schedule Resolution Logic

Create `utils/schedule.ts`:

- `getScheduledHabitIds(date: string, activeHabitIds: string[], schedule: ScheduleConfig): string[]`
  - For each active habit:
    - If its category has a rotation: compute `daysSinceStart = daysBetween(startDate, date)`, then `cycleDay = ((daysSinceStart % sequence.length) + sequence.length) % sequence.length`. Include habit if `sequence[cycleDay] === habitId`.
    - Else if `habitWeekdays[habitId]` exists and is non-empty: include if today's weekday (0–6) is in the array.
    - Else: include always (unscheduled = daily).
  - Return the filtered list.

- `getCycleDayIndex(date: string, startDate: string, cycleLength: number): number` — helper used by the grid to highlight "today."

### 3. HabitProvider Changes (`contexts/habit-context.tsx`)

- Import `getScheduledHabitIds` and read `profile.schedule`.
- Derive `todayHabits: Habit[]` from `getScheduledHabitIds(today, ...)`, filtered from `HABIT_LIBRARY`.
- Expose `todayHabits` on the context (alongside existing `activeHabits` which is still needed for settings/stats).
- Change `allDone` calculation (line 121) to use `todayHabits` instead of `activeHabits`.

### 4. Today Screen (`app/(tabs)/index.tsx`)

- Use `todayHabits` for the habit list rendering and fitness rings.
- No other structural changes needed — just swap the data source.

### 5. Stats Tab (`app/(tabs)/stats.tsx`)

- When computing daily completion for past days in the week view, call `getScheduledHabitIds(date, ...)` to determine which habits were scheduled that day.
- A habit not scheduled on a given day is excluded from that day's completion denominator.
- Streak calculation: a day is "complete" when all scheduled habits (not all active) were done.

### 6. Settings UI — Schedule Section (`app/settings.tsx`)

Add a "Schedule" section between "My Sessions" and "Notifications."

**Category rotation row (per category with 2+ active habits):**
- Row showing `[Category Name] — [Daily ▼]` with a toggle/selector to switch to "Rotation."
- When "Rotation" is selected, expand inline to show:
  - **Cycle length** — stepper control (min 2, max = category habit count × 2, default = category habit count).
  - **Start date** — date picker (default: today).
  - **Schedule grid** — the `ScheduleGrid` component (see below).
- Pre-fill sequence: distribute category habits in their library order, one per day.

**Weekday assignment (per habit not in a rotating category):**
- Below each non-rotating habit in "My Sessions," show a `WeekdayPicker` — 7 small day buttons.
- All days selected or none selected = daily (same behavior, no filtering).

### 7. Schedule Grid Component — `components/schedule-grid.tsx` (new)

- **Props:** `habits: Habit[]`, `cycleLength: number`, `sequence: string[]`, `onChange: (sequence: string[]) => void`, `todayIndex?: number`
- Renders a grid: columns = Day 1..N, rows = category habits.
- Each cell: tappable circle, filled with habit's `ringColor` when selected, hollow when not.
- **One-per-column constraint**: tapping a cell selects that habit for that day, auto-deselects any other habit in the same column.
- A habit can appear in multiple columns (e.g., Push on Day 2 and Day 4).
- Column headers: "1", "2", "3", etc. with the `todayIndex` column subtly highlighted.
- Horizontally scrollable when cycle > 5 days.

### 8. Weekday Picker Component — `components/weekday-picker.tsx` (new)

- **Props:** `selectedDays: number[]`, `onChange: (days: number[]) => void`
- Row of 7 circular buttons: S M T W T F S (starting Sunday to match JS `getDay()`).
- Selected = `accent` fill. Unselected = `border` outline.
- Compact size (~28px) to fit inline in settings rows.

## Key Implementation Details

**Cycle day math:** `daysBetween = Math.floor((Date.parse(date) - Date.parse(startDate)) / 86_400_000)`. Use double-modulo `((n % len) + len) % len` to handle dates before the start date (they wrap backward through the cycle).

**Migration:** Existing users have no `schedule` field. Default it to `{ categoryRotations: {}, habitWeekdays: {} }` in the profile loading path. `getScheduledHabitIds` treats this as "show all" — fully backward compatible, no data migration needed.

**Sequence allows repeats:** A habit can appear on multiple days in a rotation. The grid permits this by not enforcing one-per-row, only one-per-column.

**Empty columns:** If the user increases cycle length beyond the number of habits, some columns may start empty. The grid should allow an empty day (no habit scheduled = rest day for that category).

## Acceptance Criteria

- [ ] Habits can be assigned to specific weekdays via pill buttons; they only appear on those days
- [ ] Categories can be set to rotation mode with a configurable cycle length and start date
- [ ] Rotation sequence is defined via a tappable grid enforcing one habit per day-column
- [ ] A habit can repeat across multiple days in a cycle
- [ ] Today screen only shows habits scheduled for the current day
- [ ] Fitness rings only render for today's scheduled habits
- [ ] "All done" confetti triggers only when all *scheduled* (not all active) habits are complete
- [ ] Stats weekly view and streak use per-day scheduling for completion calculations
- [ ] Schedule persists across app restarts (stored in UserProfile via AsyncStorage)
- [ ] Existing users with no schedule see all active habits daily (backward compatible)
- [ ] Grid highlights the current cycle day's column
- [ ] Cycle length stepper and start date picker work correctly

## Files to Touch

- `contexts/user-context.tsx` — add `ScheduleConfig` type and `schedule` field to `UserProfile`
- `contexts/habit-context.tsx` — add `todayHabits` to context, update `allDone` logic
- `utils/schedule.ts` — **new** — `getScheduledHabitIds()`, `getCycleDayIndex()`, cycle math
- `utils/storage.ts` — default `schedule` field when loading profiles without one
- `components/schedule-grid.tsx` — **new** — rotation grid component
- `components/weekday-picker.tsx` — **new** — weekday pill buttons
- `app/settings.tsx` — add Schedule section with rotation config + weekday pickers
- `app/(tabs)/index.tsx` — use `todayHabits` instead of `activeHabits`
- `app/(tabs)/stats.tsx` — per-day scheduled habit filtering for completion/streak math
