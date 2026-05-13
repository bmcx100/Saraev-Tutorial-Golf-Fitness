# Spec 004: Onboarding Redesign

## What This Feature Does

Replaces the single-step habit selection onboarding with a 3-step wizard: an overview page ("How SUBPAR Works"), habit selection ("Build Your Game Plan"), and challenge selection ("Take a Challenge"). The auto-started 3-Day Kickoff challenge is replaced by a user-chosen 30-day challenge.

## Current State

The onboarding flow is a single screen (`app/onboarding.tsx`) that shows habit cards grouped by category (golf, workout, lifestyle). Users select at least one habit and tap "Start Tracking." On submit, the handler at line 29 sets `onboardingComplete: true`, saves `activeHabitIds`, requests notification permissions, and auto-starts a 3-Day Kickoff challenge via `startChallenge('onboarding-3day')`.

The 3-Day Kickoff is created by `createOnboardingTemplate()` in `constants/challenges.ts:46-55` using the user's first selected habit (3 completions in 3 days).

The tab layout (`app/(tabs)/_layout.tsx:15-17`) redirects to `/onboarding` when `isOnboardingComplete` is false.

The challenge system (`contexts/challenge-context.tsx`) only supports single-habit challenges (`habitId: string`). The `startChallenge()` function at line 133 has a special case for `'onboarding-3day'` that calls `createOnboardingTemplate()`.

## Changes Required

### 1. Convert onboarding.tsx to a 3-step wizard

Replace the current single-step screen with a step-based wizard using `useState<number>(0)`.

**Step 0 -- "How SUBPAR Works" (Overview)**
- Title: "How SUBPAR Works"
- 4 dark-surface cards stacked vertically, each with an icon, bold heading, and description:
  1. Icon: `bolt` -- **Set Up Your Game Plan** -- "Choose what to track: speed, strength, cardio, and&nbsp;more"
  2. Icon: `local-fire-department` -- **Take Challenges** -- "Push yourself with monthly goals to build&nbsp;consistency"
  3. Icon: `bar-chart` -- **Track Progress** -- "See your streaks, charts, and training&nbsp;history"
  4. Icon: `notifications-active` -- **Stay on Track** -- "Get reminders that keep your routine dialed&nbsp;in"
- Bottom: full-width "Continue" button
- A subtle step indicator (3 dots) above the button

**Step 1 -- "Build Your Game Plan" (Habit Selection)**
- Title: "Build Your Game Plan"
- Subtitle: "You can change these anytime in&nbsp;Settings."
- "Select All" / "Deselect All" toggle button below subtitle (text-style pressable, accent colored)
- Reuse existing `HabitCard` component and category grouping
- Bottom: "Next" button (disabled until at least 1 habit selected)
- Step indicator shows dot 2 of 3 active

**Step 2 -- "Take a Challenge" (Challenge Selection)**
- Title: "Take a Challenge"
- Subtitle: "Pick one to kick off your first&nbsp;month."
- 3 challenge cards (only show those whose required habits were selected in Step 1):
  1. **Get Long** -- icon: `bolt`, color: `#2D6A4F` -- "Build swing speed: 12 speed stick sessions this&nbsp;month" (requires `speed-sticks`)
  2. **Get Strong** -- icon: `fitness-center`, color: `#E63946` -- "Build strength: 12 gym sessions this&nbsp;month" (requires `gym`)
  3. **Tighten It Up** -- icon: `directions-run`, color: `#F59E0B` -- "Stay sharp: 12 cardio or core sessions this&nbsp;month" (requires `cardio` OR `core`)
- Single-select (radio-style): tapping one deselects any other
- If NO challenges match selected habits, skip Step 2 entirely -- complete onboarding after Step 1 with no challenge
- Bottom: "Start Training" button (disabled until one challenge selected)
- Step indicator shows dot 3 of 3 active

**On completing the final step:**
1. Call `updateProfile({ onboardingComplete: true, activeHabitIds: [...selected], notificationsEnabled: true })`
2. Call `requestPermissions()`
3. Call `startChallenge(selectedChallengeId)` (if a challenge was selected)
4. Call `router.replace('/(tabs)')`

### 2. Add 3 onboarding challenge templates to constants/challenges.ts

Add to the `CHALLENGE_TEMPLATES` array:

```typescript
{
  id: 'get-long',
  name: 'Get Long',
  description: 'Build swing speed: 12 speed stick sessions this month.',
  habitId: 'speed-sticks',
  targetTotal: 12,
  durationDays: 30,
},
{
  id: 'get-strong',
  name: 'Get Strong',
  description: 'Build strength: 12 gym sessions this month.',
  habitId: 'gym',
  targetTotal: 12,
  durationDays: 30,
},
{
  id: 'tighten-it-up',
  name: 'Tighten It Up',
  description: 'Stay sharp: 12 cardio or core sessions this month.',
  habitId: 'cardio',
  habitIds: ['cardio', 'core'],
  targetTotal: 12,
  durationDays: 30,
},
```

### 3. Support multi-habit challenges in the challenge system

**ChallengeTemplate interface** (`constants/challenges.ts`):
- Add optional `habitIds?: string[]` field
- When `habitIds` is present, progress tracks completions of ANY listed habit

**Challenge interface** (`contexts/challenge-context.tsx`):
- Add optional `habitIds?: string[]` field
- Copy from template when starting a challenge

**Progress computation** (`challenge-context.tsx`, lines 82-97):
- If active challenge has `habitIds`, count logs where `habitIds.includes(l.habitId)` instead of `l.habitId === activeChallenge.habitId`

**Available challenges filter** (`challenge-context.tsx`, lines 73-79):
- When a template has `habitIds`, show it if ANY of `habitIds` are in `profile.activeHabitIds`

### 4. Remove the 3-Day Kickoff

- Delete `createOnboardingTemplate()` from `constants/challenges.ts`
- Remove the `onboarding-3day` special case from `startChallenge()` in `challenge-context.tsx` (lines 138-143)
- The onboarding now calls `startChallenge('get-long')`, `startChallenge('get-strong')`, or `startChallenge('tighten-it-up')` directly using standard template lookup

## Key Implementation Details

**Wizard navigation:** A `step` state integer (0, 1, 2). No back button needed -- the overview is quick and habit selection can be reconsidered on the same screen. A 3-dot indicator at the bottom (above the action button) shows current position.

**Select All:** Renders as a text button (not a card). Compares `selected.size` against `HABIT_LIBRARY.length`. Text toggles between "Select All" and "Deselect All."

**Challenge card component:** Similar visual to `HabitCard` but uses radio-circle selection (outline when unselected, filled when selected). Shows icon in a colored circle, challenge name bold, description below.

**Challenge filtering in Step 2:** After Step 1 sets the user's selections, build the available list:
- Get Long: show if `selected.has('speed-sticks')`
- Get Strong: show if `selected.has('gym')`
- Tighten It Up: show if `selected.has('cardio') || selected.has('core')`

If filter results in 0 available challenges, call `handleFinish()` immediately when advancing past Step 1 (skip Step 2).

**Tighten It Up multi-habit:** The `habitIds: ['cardio', 'core']` field means completing either cardio or core in a day adds to the challenge total. The progress loop in `challenge-context.tsx` sums `count` for all matching `habitIds` across all days in the challenge range.

## Acceptance Criteria

- [ ] Onboarding starts with "How SUBPAR Works" overview showing 4 info cards
- [ ] Continue on overview advances to habit selection step
- [ ] Habit selection has a working "Select All" / "Deselect All" toggle
- [ ] "Next" button is disabled until at least 1 habit is selected
- [ ] Challenge selection shows only challenges matching selected habits
- [ ] Challenge selection is single-select (exactly one)
- [ ] If no challenges match selected habits, Step 2 is skipped
- [ ] "Start Training" completes onboarding, saves habits, starts challenge, navigates to tabs
- [ ] 3-Day Kickoff is no longer auto-started or referenced
- [ ] Get Long tracks speed-sticks (12 in 30 days)
- [ ] Get Strong tracks gym (12 in 30 days)
- [ ] Tighten It Up tracks both cardio and core (12 in 30 days)
- [ ] Step indicator dots show current progress through the wizard
- [ ] No widow/orphan words in card descriptions (use `&nbsp;`)

## Files to Touch

- `app/onboarding.tsx` -- rewrite as 3-step wizard with overview, habit selection, challenge selection
- `constants/challenges.ts` -- add 3 templates, add `habitIds` to interface, delete `createOnboardingTemplate()`
- `contexts/challenge-context.tsx` -- support `habitIds[]` in progress and availability, remove onboarding-3day special case
