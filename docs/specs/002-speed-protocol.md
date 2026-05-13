# Spec 002: Speed Sticks Protocol Tracking

## What This Feature Does

Tapping the Speed Sticks card on the home screen navigates to a dedicated Speed page where users record MPH swing speeds for their chosen training protocol. First-time visitors see a protocol picker (onboarding wizard). Completing a session marks the Speed Sticks habit as done, filling the golf ring. Historical sessions are stored for future stats/trends.

## Current State

The `speed-sticks` habit is defined in `constants/habits.ts:15-25` as a binary habit. Tapping the Speed Sticks row on the Today screen (`app/(tabs)/index.tsx:130-137`) toggles a simple checkmark via `logHabit('speed-sticks')` in `contexts/habit-context.tsx:80-141`. There is no dedicated speed page, no protocol data model, and no swing speed storage.

The settings modal (`app/settings.tsx:148-211`) opens a `HabitDetailPanel` when the gear icon on a habit row is tapped. It currently shows a weekday picker for scheduling. For speed-sticks, it will also need a protocol selection option.

Navigation is managed by Expo Router with a `Stack` in `app/_layout.tsx`. New top-level routes are added as files in `app/` and registered in the Stack.

## Changes Required

### 1. Data Model — Speed Protocol Config

Add to `UserProfile` in `contexts/user-context.tsx`:

```typescript
speedProtocol: 'superspeed-l1' | 'bmc' | null;
```

Default: `null` (no protocol chosen yet). Add to `DEFAULT_PROFILE`.

### 2. Speed Session Data Model

Create `constants/speed-protocols.ts`:

```typescript
export type StickColor = 'green' | 'blue' | 'red';
export type DrillType = 'normalStance' | 'stepDrill' | 'maxOut';

export interface StickSpeeds {
  dom: number | null;
  nonDom: number | null;
}

export interface MaxOutSpeeds {
  green: number | null;
  driver: number | null;
}

export interface SpeedSession {
  date: string;              // YYYY-MM-DD
  protocol: string;
  normalStance: Record<StickColor, StickSpeeds>;
  stepDrill: Record<StickColor, StickSpeeds>;
  maxOut: MaxOutSpeeds;
  completedAt: string;       // ISO timestamp
}

export const STICK_COLORS: { key: StickColor; label: string; color: string }[] = [
  { key: 'green', label: 'Green', color: '#22C55E' },
  { key: 'blue', label: 'Blue', color: '#3B82F6' },
  { key: 'red', label: 'Red', color: '#EF4444' },
];

export const DRILL_STEPS: { key: DrillType; label: string; instruction: string }[] = [
  { key: 'normalStance', label: 'Normal Stance', instruction: 'Swing each 3×, log your best' },
  { key: 'stepDrill', label: 'Step Drill', instruction: 'Swing each 3×, log your best' },
  { key: 'maxOut', label: 'Max Out', instruction: 'Swing 3×, log your best' },
];
```

### 3. Speed Session Storage

Add to `utils/storage.ts`:

- `speedSessionKey(date: string): string` — returns `speed-session-${date}`
- `loadSpeedSession(date: string): Promise<SpeedSession | null>`
- `saveSpeedSession(session: SpeedSession): Promise<void>` — saves keyed by `session.date`
- `loadSpeedSessionRange(dates: string[]): Promise<SpeedSession[]>` — bulk load for history

### 4. Speed Page — `app/speed.tsx` (new)

Top-level route. Layout:

- **If `profile.speedProtocol` is `null`:** render the protocol picker (onboarding).
- **If protocol is set:** render the speed input wizard.

**Protocol Picker (onboarding):**
- Title: "Choose Your Protocol"
- Two cards: "Super Speed Sticks L1" (selectable) and "BMC's Speedy Sticks of Quickness" (disabled, shows "Coming Soon" badge).
- Selecting Super Speed L1 → calls `updateProfile({ speedProtocol: 'superspeed-l1' })` → transitions to the input wizard.

**Speed Input Wizard (Super Speed L1):**
- 3-step flow: Normal Stance → Step Drill → Max Out.
- Progress indicator at top (3 dots or step labels, active step highlighted).
- Back button in header navigates to previous step (step 1 back → confirm-cancel → home).
- "Next" button at bottom advances to next step. "Submit" on final step.
- All values preserved across step navigation (held in component state).

**Step 1 — Normal Stance / Step 2 — Step Drill:**
- Section header with drill name + instruction ("Swing each 3×, log your best").
- For each stick (Green, Blue, Red): an inline row showing stick color dot + name, then two tappable speed fields labeled "Dom" and "Non-Dom".
- Tapping a field selects it (highlighted border) and activates the custom numpad.
- Tab key on numpad advances focus to the next empty field.
- 6 input fields per step.

**Step 3 — Max Out:**
- Two rows: Green stick and Driver.
- Each row has a single tappable speed field (dom-side only).
- 2 input fields.

**Submit behavior:**
- Validate that all 14 fields are filled. If not, highlight empty fields and show inline message.
- Build a `SpeedSession` object and call `saveSpeedSession()`.
- Call `logHabit('speed-sticks')` to mark the habit complete.
- Navigate back to `/(tabs)` with the checkmark and ring now reflecting completion.

**Cancel/back behavior:**
- If any values have been entered and the user presses back on step 1 or the header close button, show a confirmation alert: "Discard this session? Your entered speeds will be lost."
- Accept → navigate home without saving. Decline → stay on form.

### 5. Custom Numpad Component — `components/speed-numpad.tsx` (new)

- Fixed to bottom of screen (above safe area).
- 4×3 grid: digits 1-9, empty cell, 0, backspace (⌫).
- Additional "Tab" key (→) in the empty cell to advance focus to the next input field.
- Props: `onDigit(d: string)`, `onDelete()`, `onTab()`, `visible: boolean`.
- Slides up/down with a short animation when `visible` changes.
- Compact height (~200px) to leave room for the form above.

### 6. Speed Input Field Component — `components/speed-input-field.tsx` (new)

- Displays current value or placeholder (`--`).
- Shows "mph" label beside the value.
- `active` state: highlighted border (accent color) when this field has numpad focus.
- Props: `value: number | null`, `active: boolean`, `onPress: () => void`, `label: string`.
- Tapping the field calls `onPress` to set it as the active numpad target.

### 7. Home Screen Change — `app/(tabs)/index.tsx`

In `handleLog` (or a wrapper), check if `habit.id === 'speed-sticks'`:
- Instead of calling `logHabit`, call `router.push('/speed')`.
- The speed page handles marking the habit complete on submit.
- If Speed Sticks is already complete for today (checkmark shown), tapping still navigates to `/speed` to view/re-enter (the session data is loaded from storage).

### 8. Settings Integration — `app/settings.tsx`

In the `HabitDetailPanel`, when `habit.id === 'speed-sticks'`:
- Show a "Speed Protocol" section below the schedule section.
- Display current protocol name (e.g., "Super Speed Sticks L1") or "Not set".
- "Change Protocol" button → clears `speedProtocol` to `null` so the onboarding wizard appears on next visit to `/speed`.

### 9. Root Layout — `app/_layout.tsx`

Add the speed route to the Stack:

```tsx
<Stack.Screen name="speed" options={{ headerShown: false, presentation: 'card' }} />
```

## Key Implementation Details

**Session data per day:** Each date gets one `SpeedSession`. Re-opening the speed page on a day that already has a session pre-fills the form with saved values (enabling edits). Submitting overwrites the existing session for that date.

**14 total inputs:** Normal Stance (6) + Step Drill (6) + Max Out (2). Each is a whole number MPH value, typically 50-180 range. No decimal input needed.

**Numpad focus management:** The speed page maintains an `activeFieldId` string in state (e.g., `'normalStance.green.dom'`). When the numpad emits digits, they update that field. Tab advances `activeFieldId` to the next field in document order, cycling within the current step. Tapping a field directly sets it as active.

**BMC protocol stub:** Selecting BMC shows a "Coming Soon" card with no action. The protocol picker only allows selecting Super Speed L1 for now.

**Habit completion integration:** The speed page imports `useHabits()` and calls `logHabit('speed-sticks')` after saving. This marks the habit as complete in the existing system — the ring and checkmark update automatically.

**Re-entry:** If the user already completed a session today and taps the Speed Sticks card again, the speed page loads the existing session from storage and pre-fills all fields. They can edit and re-submit (overwrites).

## Acceptance Criteria

- [ ] Tapping Speed Sticks card on home screen navigates to `/speed` (not a toggle)
- [ ] First visit shows protocol picker with Super Speed L1 and BMC (disabled/coming soon)
- [ ] Selecting Super Speed L1 saves the choice and shows the input wizard
- [ ] Input wizard has 3 steps: Normal Stance, Step Drill, Max Out
- [ ] Normal Stance and Step Drill each show Green/Blue/Red with Dom + Non-Dom inputs (6 fields each)
- [ ] Max Out shows Green + Driver with a single input each (2 fields)
- [ ] Custom numpad appears at bottom when a field is tapped — no OS keyboard
- [ ] Numpad has digits 0-9, backspace, and tab (advance to next field)
- [ ] Back button navigates between wizard steps, preserving entered values
- [ ] Canceling with data entered shows a discard confirmation alert
- [ ] Submitting a complete session saves to AsyncStorage and marks Speed Sticks habit done
- [ ] Golf ring on home screen reflects Speed Sticks completion
- [ ] Historical sessions are persisted (one per day, keyed by date)
- [ ] Re-opening speed page on a completed day pre-fills saved values
- [ ] Settings modal for Speed Sticks shows current protocol + "Change Protocol" option
- [ ] Changing protocol resets to `null`, showing the picker on next speed page visit
- [ ] All 14 fields must be filled before submit; empty fields are highlighted

## Files to Touch

- `constants/speed-protocols.ts` — **new** — stick colors, drill types, `SpeedSession` interface
- `app/speed.tsx` — **new** — speed page with onboarding picker + input wizard
- `components/speed-numpad.tsx` — **new** — custom numeric keypad with tab key
- `components/speed-input-field.tsx` — **new** — tappable MPH input field
- `utils/storage.ts` — add `loadSpeedSession()`, `saveSpeedSession()`, `loadSpeedSessionRange()`
- `contexts/user-context.tsx` — add `speedProtocol` field to `UserProfile`
- `app/(tabs)/index.tsx` — route speed-sticks tap to `/speed` instead of toggling
- `app/settings.tsx` — add protocol section to `HabitDetailPanel` for speed-sticks
- `app/_layout.tsx` — register `/speed` route in Stack
