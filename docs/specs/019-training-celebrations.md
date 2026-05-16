# Spec 019: Training Session Celebrations

## What This Feature Does

Fires contextual celebrations when the user achieves something during training — inline micro-celebrations when a personal record is broken during input, a full-screen session summary highlighting PRs and standout performances on save, a challenge completion moment, and streak milestone acknowledgements. Every session should feel like something happened.

## Current State

**Speed session** (`app/speed.tsx`): 3-step wizard (Normal Stance → Step Drill → Max Out). On save, updates `SpeedStats` aggregate (driver PR, previous driver PR, last session date), logs habit, and routes back. `SpeedStats` only tracks driver PR — no per-field PRs for the other 13 speed fields. No celebration on save beyond habit-level confetti.

**Strength session** (`app/strength.tsx`): Exercise checklist with weight/reps per set. On save, logs habit and routes back. `StrengthStats` tracks per-exercise PRs (`exercisePRs`), streak, and `lastPR`. Stats aggregate update at save time may be incomplete — verify and implement per spec 007 section 4 if missing.

**Speed input** (`components/speed-input-field.tsx`): Numeric field with active/error states and "mph" label. No PR awareness.

**Celebrations today:**
- All habits completed → confetti + haptic + sound (`app/(tabs)/index.tsx`)
- Individual habit completed → medium haptic + success sound
- No PR celebration in speed or strength sessions
- No challenge completion celebration (status changes silently in `contexts/challenge-context.tsx`)
- No streak milestone celebration

**Confetti component** (`components/confetti.tsx`): Full-screen particle burst with optional `message` overlay. Props: `active`, `particleCount`, `duration`, `message`, `onComplete`.

## Changes Required

### 1. Expand SpeedStats with per-field PRs

In `utils/storage.ts`, add to the `SpeedStats` interface:

```typescript
fieldPRs: Record<string, number>;
```

14 keys using dot notation matching SpeedSession structure: `"normalStance.green.dom"`, `"normalStance.green.nonDom"`, `"stepDrill.blue.dom"`, `"maxOut.driver"`, etc. Each stores the all-time best mph for that field.

Add a `SPEED_FIELD_KEYS` constant (in `constants/speed-protocols.ts`) mapping each key to a human-readable label: `{ key: "normalStance.green.dom", label: "Green Normal Dom" }`. 14 entries.

Update `rebuildStatsAggregates()` to populate `fieldPRs` by scanning all historical speed sessions.

### 2. Ensure strength stats update at save time

In `app/strength.tsx` `handleSubmit`, after `saveStrengthSession()`:
- Load current `StrengthStats` (default to empty if null)
- Update streak: calendar day gap from `streak.lastSessionDate` — gap 0 = no change, gap 1-2 = add to streak, gap 3+ = reset to 1
- Update exercise PRs: for each exercise, compare max weight across completed sets against `exercisePRs[exerciseId]`
- Set `lastPR` if any exercise PR is new
- Save updated `StrengthStats`

If this already works correctly, no changes needed. Verify by testing.

### 3. Track all field PRs at speed save time

In `app/speed.tsx` `handleSubmit`, after saving the session and before routing back:
- Load `SpeedStats`
- For each of the 14 session fields, compare value against `fieldPRs[key]`
- If value > stored PR (or no stored PR exists), update `fieldPRs[key]`
- Build a `sessionPRs` array: `{ key: string, label: string, value: number, previousBest: number | null }[]`
- Build a `standouts` array: any field where value is within 3 mph of its field PR but is not itself a new PR
- Continue with existing driver PR / previousDriverPR logic
- Save updated `SpeedStats`

### 4. PR target labels on speed input fields

Modify `components/speed-input-field.tsx`:
- Accept a `prValue?: number` prop
- When `prValue` is set, show a small label below the input: "PR: {prValue}" in `colors.textSecondary`, fontSize 11
- When the input value exceeds `prValue`, change the label to "NEW PR" in `colors.accent` with fontWeight 700

Load `SpeedStats.fieldPRs` in `app/speed.tsx` on mount (via `loadSpeedStats()`) and pass the relevant PR value to each speed input field via the `prValue` prop.

### 5. Inline micro-celebration on PR input

**Speed fields:** When a speed input field's value exceeds its `prValue`:
- Pulse animation on the field: Reanimated `withSequence` — scale 1 → 1.05 → 1 over 200ms, border color flash to `colors.accent`
- Light haptic: `Haptics.impactAsync(ImpactFeedbackStyle.Light)`
- "NEW PR" label appears simultaneously (from section 4)
- Animation triggers once per PR-crossing (not on every keystroke above PR)

**Strength fields:** When a set's weight input exceeds the stored PR weight for that exercise (`strengthStats.exercisePRs[exerciseId].weight`):
- Same brief pulse on the weight input area
- Small "PR" badge appears next to the weight value in accent color
- Light haptic
- Load `StrengthStats` on mount in `app/strength.tsx` for PR comparisons

### 6. Session summary modal — Speed

After saving a speed session, show a `Modal` instead of routing back immediately:

**Max out PR present (driver or green stick):**
- Full-screen dark overlay
- Confetti fires (particle count 60)
- Hero number: the max out PR value (fontSize 64, Outfit ExtraBold)
- Label: "New Driver PR" or "New Green Stick PR" (or both listed)
- Delta: "↑ X mph" in accent color showing improvement over previous best
- Below hero: compact list of any other field PRs from the session ("Blue Dom Normal: 97 mph — NEW PR")
- Below PRs: standout callouts ("Red Step Drill Dom: 88 mph — 2 mph from PR")
- Heavy haptic + celebration sound (`playSound('confetti')`)
- "Continue" button at bottom dismisses modal and calls `router.back()`

**Non-max-out PRs only:**
- Modal with accent-colored header bar "Session Highlights"
- List each PR as a row: field label, value, delta from previous best
- Below: standout callouts
- Medium haptic + success sound
- "Continue" button dismisses

**No PRs and no standouts:**
- Skip the modal entirely. Route back as current behavior.

### 7. Session summary modal — Strength

After saving a strength session, before routing back:

**Exercise PRs present:**
- Modal with accent-colored header bar "Session Highlights"
- List each exercise PR: name, weight × reps, delta from previous best ("↑ 10 lbs")
- Medium haptic + success sound

**Streak milestone reached** (streak just crossed a `STREAK_MILESTONES` value — 7, 14, 21, 30, 60, 90):
- Append milestone badge to the modal: "{N}-Day Streak!" with accent styling
- If both PR and milestone in same session, show both in the same modal

**Neither PRs nor milestone:**
- Skip modal. Route back normally.

"Continue" button on all modals dismisses and routes back.

### 8. Challenge completion celebration

In `contexts/challenge-context.tsx`:
- Add state: `justCompletedChallenge: Challenge | null`
- When `checkChallengeCompletion()` detects a challenge reaching its target, set `justCompletedChallenge` with the completed challenge
- Expose `justCompletedChallenge` and `clearCompletedChallenge()` from the context

In `app/(tabs)/index.tsx` (Today tab):
- Watch `justCompletedChallenge` via `useChallenges()`
- When set, show full-screen celebration:
  - Confetti with high particle count (80)
  - Challenge name as hero text: "{name} Complete!"
  - Sessions completed count and duration
  - Heavy haptic + celebration sound
  - "Continue" button calls `clearCompletedChallenge()`

### 9. Enhanced all-done celebration

In `app/(tabs)/index.tsx`, when triggering confetti on all habits done:
- Pass message to Confetti component: "All {todayHabits.length} habits done!"
- Confetti component already supports the `message` prop with centered text overlay
- No other changes — existing haptic + sound + confetti are sufficient

## Key Implementation Details

**Standout threshold: within 3 mph of PR.** A value close to but not exceeding the stored PR is noted as a standout in the session summary. This captures the user's "top 10%" intent without requiring historical distribution data. At typical speed ranges (70-140 mph), 3 mph is a meaningful threshold.

**Micro-celebration fires once per PR-crossing.** Track a `prCelebratedRef` per field. When value first exceeds PR, fire the animation and set the ref. If the user backspaces below PR and re-enters above, it can fire again. Don't fire on every keystroke above PR.

**Modal dismissal routes back.** Session summary modals use React Native `Modal` (same pattern as existing discard confirmation modals in speed/strength). "Continue" calls `router.back()` after dismissal.

**No new shared components for summaries.** Build the summary modal inline within `app/speed.tsx` and `app/strength.tsx` using existing `Modal` + styled `View` patterns already in both files.

**Strength PR check is weight-based.** Compare the weight entered against `exercisePRs[exerciseId].weight`. Volume PRs (weight × reps) are not tracked separately — weight is the primary metric the user cares about.

**Challenge completion timing.** `checkChallengeCompletion()` runs when habit logs change. The celebration fires on the Today tab, which is where the user typically is after logging. If they're on a different tab, the celebration shows next time they view Today.

## Acceptance Criteria

- [ ] Each speed input field shows "PR: X" when a stored PR exists for that field
- [ ] Entering a value above the field PR triggers a pulse animation + haptic + "NEW PR" label
- [ ] Micro-celebration fires once per PR-crossing, not on every keystroke
- [ ] Saving a speed session with max out PRs shows full-screen celebration with confetti
- [ ] Saving a speed session with non-max-out PRs shows a summary modal listing PRs
- [ ] Standout performances (within 3 mph of PR) are noted in the speed summary
- [ ] Sessions with no PRs or standouts skip the modal and route back normally
- [ ] Strength weight inputs show PR detection and micro-celebration
- [ ] Saving a strength session with exercise PRs shows a summary modal
- [ ] Streak milestone crossing triggers a celebration in the strength summary modal
- [ ] Challenge completion fires a full-screen celebration on the Today screen
- [ ] All-done confetti includes a count message ("All 6 habits done!")
- [ ] `SpeedStats.fieldPRs` tracks all 14 speed field PRs
- [ ] `rebuildStatsAggregates()` populates `fieldPRs` from historical sessions
- [ ] Existing save flows (habit logging, driver PR tracking) still work correctly

## Files to Touch

- `constants/speed-protocols.ts` — add `SPEED_FIELD_KEYS` constant (key + label mapping)
- `utils/storage.ts` — expand `SpeedStats` with `fieldPRs`, update `rebuildStatsAggregates()`
- `app/speed.tsx` — load field PRs on mount, track all PRs at save time, add session summary modal
- `app/strength.tsx` — verify/add stats update at save time, add PR detection, add session summary modal
- `components/speed-input-field.tsx` — add `prValue` prop, PR label, pulse animation
- `contexts/challenge-context.tsx` — add `justCompletedChallenge` state + `clearCompletedChallenge()`
- `app/(tabs)/index.tsx` — challenge completion celebration, enhanced all-done message
