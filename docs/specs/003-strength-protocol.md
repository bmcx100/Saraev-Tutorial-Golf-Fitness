# Spec 003: Strength Training Protocol Tracking

## What This Feature Does

Tapping the Strength Training card on the home screen navigates to a dedicated Strength page where users follow their chosen training protocol. First-time visitors see a protocol picker. For the L/P/L/P protocol, the app recommends the next workout in a 4-day rotation (Legs 1 → Pull → Legs 2 → Push), displays the exercises for that day with pre-filled weight/reps from the previous session, and lets users check off completed sets. Completing a session marks the Strength Training habit as done, filling the workout ring. Historical sessions are stored for future stats/trends.

## Current State

The `gym` habit is defined in `constants/habits.ts:39-49` as a binary habit named "Strength Training". Tapping the Strength Training row on the Today screen (`app/(tabs)/index.tsx:42-43`) calls `logHabit('gym')` which toggles a simple checkmark. There is no dedicated strength page, no protocol data model, and no workout session storage.

The speed sticks feature (`app/speed.tsx`, `constants/speed-protocols.ts`) provides an established pattern: protocol picker onboarding, wizard-style input, custom numpad (`components/speed-numpad.tsx`), session storage keyed by date, and habit completion on submit. The strength feature follows this same architectural pattern.

The settings modal (`app/settings.tsx:161-240`) opens a `HabitDetailPanel` when the gear icon on a habit row is tapped. It currently shows a weekday picker for scheduling and a protocol section for speed-sticks. The same pattern applies for `gym`.

Navigation is managed by Expo Router with a `Stack` in `app/_layout.tsx`. New top-level routes are added as files in `app/` and registered in the Stack.

## Changes Required

### 1. Data Model — Strength Protocol Config

Add to `UserProfile` in `contexts/user-context.tsx`:

```typescript
strengthProtocol: 'lplp' | 'bmc-heavy' | null;
```

Default: `null` (no protocol chosen yet). Add to `DEFAULT_PROFILE`.

### 2. Strength Protocol Constants

Create `constants/strength-protocols.ts`:

```typescript
export type WorkoutDay = 'legs1' | 'pull' | 'legs2' | 'push';

export const WORKOUT_ROTATION: WorkoutDay[] = ['legs1', 'pull', 'legs2', 'push'];

export interface ExerciseDef {
  id: string;
  name: string;
  defaultReps: number;
}

export interface WorkoutDayDef {
  key: WorkoutDay;
  label: string;
  subtitle: string;
  exercises: ExerciseDef[];
}

export const WORKOUT_DAYS: WorkoutDayDef[] = [
  {
    key: 'legs1',
    label: 'Legs 1',
    subtitle: 'Quads',
    exercises: [
      { id: 'calf-raises', name: 'Calf Raises', defaultReps: 8 },
      { id: 'tib-raises', name: 'Tib Raises', defaultReps: 8 },
      { id: 'split-squats', name: 'Split Squats', defaultReps: 8 },
      { id: 'squats', name: 'Squats', defaultReps: 8 },
    ],
  },
  {
    key: 'pull',
    label: 'Pull',
    subtitle: 'Back & Biceps',
    exercises: [
      { id: 'shrugs', name: 'Shrugs', defaultReps: 8 },
      { id: 'lat-pulldowns', name: 'Lat Pulldowns', defaultReps: 8 },
      { id: 'bent-over-rows', name: 'Bent Over Rows', defaultReps: 8 },
      { id: 'curls', name: 'Curls', defaultReps: 8 },
    ],
  },
  {
    key: 'legs2',
    label: 'Legs 2',
    subtitle: 'Hamstrings',
    exercises: [
      { id: 'calf-raises', name: 'Calf Raises', defaultReps: 8 },
      { id: 'tib-raises', name: 'Tib Raises', defaultReps: 8 },
      { id: 'nordic-curls', name: 'Nordic Curls', defaultReps: 8 },
      { id: 'back-extensions', name: 'Back Extensions', defaultReps: 8 },
      { id: 'dead-lifts', name: 'Dead Lifts', defaultReps: 8 },
    ],
  },
  {
    key: 'push',
    label: 'Push',
    subtitle: 'Chest, Shoulders & Triceps',
    exercises: [
      { id: 'dips', name: 'Dips', defaultReps: 8 },
      { id: 'bench-press', name: 'Bench Press', defaultReps: 8 },
      { id: 'overhead-press', name: 'Overhead Press', defaultReps: 8 },
      { id: 'front-delt-raises', name: 'Front Delt Raises', defaultReps: 8 },
      { id: 'side-delt-raises', name: 'Side Delt Raises', defaultReps: 8 },
      { id: 'tricep-extensions', name: 'Tricep Extensions', defaultReps: 8 },
    ],
  },
];

export const SETS_PER_EXERCISE = 3;
```

Note: `calf-raises` and `tib-raises` share IDs across Legs 1 and Legs 2 so previous weight/reps carry over between both leg days.

### 3. Strength Session Data Model

Add to `constants/strength-protocols.ts`:

```typescript
export interface ExerciseSet {
  weight: number | null;
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: ExerciseSet[];   // always 3 items
}

export interface StrengthSession {
  date: string;              // YYYY-MM-DD
  protocol: string;          // 'lplp'
  workoutDay: WorkoutDay;
  exercises: ExerciseLog[];
  completedAt: string;       // ISO timestamp
}
```

### 4. Strength Session Storage

Add to `utils/storage.ts`:

- `strengthSessionKey(date: string): string` — returns `strength-session-${date}`
- `loadStrengthSession(date: string): Promise<StrengthSession | null>`
- `saveStrengthSession(session: StrengthSession): Promise<void>` — saves keyed by `session.date`
- `loadLastStrengthWorkoutDay(): Promise<WorkoutDay | null>` — reads `strength-last-workout-day` key
- `saveLastStrengthWorkoutDay(day: WorkoutDay): Promise<void>` — writes `strength-last-workout-day` key
- `loadExerciseDefaults(): Promise<Record<string, { weight: number | null; reps: number }[]>>` — reads `strength-exercise-defaults` key; returns a map of exerciseId → array of 3 set defaults
- `saveExerciseDefaults(defaults: Record<string, { weight: number | null; reps: number }[]>): Promise<void>` — writes `strength-exercise-defaults` key

### 5. Strength Page — `app/strength.tsx` (new)

Top-level route. Layout:

- **If `profile.strengthProtocol` is `null`:** render the protocol picker (onboarding).
- **If protocol is set:** render the workout tracker.

**Protocol Picker (onboarding):**
- Title: "Choose Your Protocol"
- Two cards: "Legs / Pull / Legs / Push" (selectable) and "BMC's Super Heavy Lifting Thingy" (disabled, shows "Coming Soon" badge).
- Selecting L/P/L/P → calls `updateProfile({ strengthProtocol: 'lplp' })` → transitions to the workout tracker.

**Workout Tracker (L/P/L/P):**

*Day selector:*
- Row of 4 chips/tabs: "Legs 1", "Pull", "Legs 2", "Push".
- On load, determine the recommended day: look up the last completed workout day via `loadLastStrengthWorkoutDay()`, advance one step in `WORKOUT_ROTATION`. If no previous → default to `legs1`.
- The recommended chip is pre-selected and has a subtle "Next" indicator (filled background). Other chips are outlined. User can tap any chip to switch.
- Below the chips: subtitle text showing the selected day's focus (e.g., "Quads", "Back & Biceps").

*Exercise list (scrollable):*
- For each exercise in the selected workout day's `exercises` array:
  - Exercise name as a section header.
  - 3 set rows below it, each containing:
    - Set number label (1, 2, 3).
    - Weight field (tappable) with "lbs" suffix. Pre-filled with previous value or `null` on first use.
    - Reps field (tappable) with "reps" suffix. Pre-filled with previous value or `defaultReps` (8) on first use.
    - Completion checkbox (circular, tappable). Checked = filled accent circle with checkmark.

*Numpad interaction:*
- Tapping a weight or reps field sets it as the active numpad target and slides up the `SpeedNumpad` component (reused from speed sticks).
- Tab key on numpad advances focus: weight → reps → next set weight → next set reps → next exercise → etc.
- Tapping anywhere outside a field or the numpad dismisses it.

*Submit behavior:*
- Submit button at bottom, enabled only when ALL sets across ALL exercises are checked as completed.
- On submit:
  1. Build a `StrengthSession` object with `completedAt` timestamp.
  2. Call `saveStrengthSession()`.
  3. Call `saveLastStrengthWorkoutDay()` with the selected day.
  4. Call `saveExerciseDefaults()` — update defaults for each exercise using its set values from this session.
  5. Call `logHabit('gym')` to mark the habit complete.
  6. Navigate back to `/(tabs)`.

*Cancel/back behavior:*
- If any sets have been checked off and the user presses back, show a confirmation alert: "Discard this workout? Your progress will be lost."
- Accept → navigate home without saving. Decline → stay on form.

*Pre-fill behavior:*
- On load, call `loadExerciseDefaults()` to get previous weight/reps for each exercise.
- For each exercise in the selected day: if defaults exist for that exerciseId, pre-fill all 3 sets with the stored values. Otherwise, use `null` weight and `defaultReps` (8) for reps.
- When switching workout days via the chips, re-apply defaults for the new day's exercises. Clear any completion checkboxes.

*Re-entry:*
- If a `StrengthSession` exists for today (via `loadStrengthSession(today)`), load it and pre-fill all fields + checkboxes. The user can edit and re-submit (overwrites).

### 6. Home Screen Change — `app/(tabs)/index.tsx`

In `handleLog`, add a check for `habit.id === 'gym'`:
- Instead of calling `logHabit`, call `router.push('/strength')`.
- The strength page handles marking the habit complete on submit.
- If Strength Training is already complete for today, tapping still navigates to `/strength` to view/re-enter.

### 7. Settings Integration — `app/settings.tsx`

In the `HabitDetailPanel`, when `habit.id === 'gym'`:
- Show a "Strength Protocol" section below the schedule section.
- Display current protocol name (e.g., "Legs / Pull / Legs / Push") or "Not set".
- "Change Protocol" button → clears `strengthProtocol` to `null` so the onboarding picker appears on next visit to `/strength`.

### 8. Root Layout — `app/_layout.tsx`

Add the strength route to the Stack:

```tsx
<Stack.Screen name="strength" options={{ headerShown: false, presentation: 'card' }} />
```

## Key Implementation Details

**One session per day:** Each date gets one `StrengthSession`. Re-opening the strength page on a day that already has a session pre-fills the form with saved values (enabling edits). Submitting overwrites the existing session for that date.

**3 sets × N exercises:** Legs 1 and Pull have 4 exercises (12 sets each). Legs 2 has 5 exercises (15 sets). Push has 6 exercises (18 sets). Each set has a weight field, reps field, and completion checkbox.

**Exercise defaults carry over across days:** Since `calf-raises` and `tib-raises` share IDs between Legs 1 and Legs 2, their default weight/reps are shared. Completing Legs 1 with 100lb calf raises means Legs 2 also defaults to 100lb for calf raises.

**Rotation is circular:** The sequence is legs1 → pull → legs2 → push → legs1. The system looks at the single `strength-last-workout-day` key (not date-based scanning) to determine the next recommendation. This key is updated on each submit.

**Numpad reuse:** Import `SpeedNumpad` from `components/speed-numpad.tsx` directly. No changes needed to that component. The Tab key advances through weight/reps fields in document order.

**BMC protocol stub:** Selecting BMC shows a "Coming Soon" card with no action. The protocol picker only allows selecting L/P/L/P for now.

**Habit completion integration:** The strength page imports `useHabits()` and calls `logHabit('gym')` after saving. This marks the habit as complete in the existing system — the ring and checkmark update automatically.

## Acceptance Criteria

- [ ] Tapping Strength Training card on home screen navigates to `/strength` (not a toggle)
- [ ] First visit shows protocol picker with L/P/L/P and BMC (disabled/coming soon)
- [ ] Selecting L/P/L/P saves the choice and shows the workout tracker
- [ ] Workout tracker shows 4 day-selector chips with the recommended day pre-selected
- [ ] Recommended day is based on the last completed workout (advances one step in rotation)
- [ ] Selecting a different chip switches to that day's exercises
- [ ] Each exercise shows 3 sets with weight, reps, and completion checkbox
- [ ] Weight and reps fields are pre-filled from previous session defaults (or 8 reps / null weight on first use)
- [ ] Tapping a weight or reps field activates the numpad — no OS keyboard
- [ ] Numpad Tab key advances focus through fields in order
- [ ] Checking a set's checkbox marks it visually as complete
- [ ] Submit button is enabled only when all sets are checked as completed
- [ ] Submitting saves the session, updates rotation tracking, updates exercise defaults, and marks the habit done
- [ ] Workout ring on home screen reflects Strength Training completion
- [ ] Historical sessions are persisted (one per day, keyed by date)
- [ ] Re-opening strength page on a completed day pre-fills saved values and checkboxes
- [ ] Canceling with progress shows a discard confirmation alert
- [ ] Settings modal for Strength Training shows current protocol + "Change Protocol" option
- [ ] Changing protocol resets to `null`, showing the picker on next strength page visit
- [ ] Switching workout day via chips clears checkboxes and re-applies defaults for new day

## Files to Touch

- `constants/strength-protocols.ts` — **new** — workout days, exercises, `StrengthSession` interface, rotation constants
- `app/strength.tsx` — **new** — strength page with onboarding picker + workout tracker
- `utils/storage.ts` — add strength session, rotation tracking, and exercise defaults storage functions
- `contexts/user-context.tsx` — add `strengthProtocol` field to `UserProfile`
- `app/(tabs)/index.tsx` — route `gym` tap to `/strength` instead of toggling
- `app/settings.tsx` — add protocol section to `HabitDetailPanel` for `gym`
- `app/_layout.tsx` — register `/strength` route in Stack
