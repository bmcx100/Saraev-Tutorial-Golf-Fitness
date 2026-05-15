# Spec 013: Smart Queue Order + Themed Up Next Hero

## What This Feature Does

The Up Next hero card on the Today screen adapts its visual identity to match the current habit — forest gradient with ball-tracer arcs for Speed Training ("Get Long" feel), a photo-backed barbell card for Strength Training ("Build Strong" feel), and the existing default green for everything else. Additionally, the queue order is learned from the user's actual completion patterns: if someone consistently finishes speed training before strength, speed appears first in the queue regardless of category.

## Current State

The Today screen (`app/(tabs)/index.tsx`) renders an `UpNextHero` component (`components/today/up-next-hero.tsx`) that always uses the same forest-green gradient with ball-tracer arcs, regardless of which habit is up next. The title changes ("Speed Training.", "Strength Training.", "Cardio.") but the visual treatment is identical.

Queue ordering is hardcoded by category: `CATEGORY_ORDER = ['golf', 'workout', 'lifestyle']` (line 61 of `app/(tabs)/index.tsx`). Within each category, habits appear in `HABIT_LIBRARY` definition order. There is no per-user ordering.

Habit logs include a `completedAt` ISO timestamp (`contexts/habit-context.tsx:98`) which records when each habit was completed. This data exists for the past 7 days in `weekLogs` and can be loaded for arbitrary date ranges via `loadLogsForRange()`.

Design reference files exist at `docs/specs/design/design_handoff_today_screen/Subpar V3b - Design System/design_handoff_today_screen/design-files/`:
- `card-getlong-speed.jsx` — Get Long card specs (forest gradient + ball tracer)
- `card-buildstrong.jsx` — Build Strong card specs (photo background + forest tint overlay)
- `components-getlong.jsx` / `components-buildstrong.jsx` — pixel-exact background specs

The buildstrong photo asset (`buildstrong-barbell.png`) is in the design files at `docs/specs/design/.../design-files/assets/buildstrong-barbell.png` but is NOT yet in the app's asset bundle.

## Changes Required

### 1. Copy barbell photo asset into the app

- Copy `docs/specs/design/.../design-files/assets/buildstrong-barbell.png` to `assets/images/buildstrong-barbell.png`
- This is used as the background for the Build Strong hero variant

### 2. Create themed hero card variants

Replace the single `UpNextHero` component with a system that renders different visual treatments based on `habit.id`:

**Speed Training hero (`habit.id === 'speed-training'`):**
- Keep the existing forest gradient (`G3 → G2`) with ball-tracer SVG arcs
- This IS the current design — no visual changes needed
- Title: "Speed Training." with the Get Long visual language
- Pill icon: `BoltIcon` (already used)

**Strength Training hero (`habit.id === 'gym'`):**
- Background: barbell photo with 3-layer overlay stack (from `card-buildstrong.jsx`):
  1. Photo layer: `buildstrong-barbell.png`, `resizeMode: 'cover'`, positioned center 40%
  2. Vertical forest tint: `LinearGradient` vertical — `rgba(10,24,18,0.78)` → `rgba(17,55,31,0.62)` 40% → `rgba(17,55,31,0.48)` 70% → `rgba(17,55,31,0.72)` 100%
  3. Diagonal green wash: `LinearGradient` 135deg — `G3 @ 20%` → `G2 @ 33%`
- No ball-tracer arcs (replaced by the photo)
- Pill icon: `DumbbellIcon`
- Pill text remains "UP NEXT · {minutes} MIN"
- All other elements (title, subtitle, challenge strip, CTA) remain the same

**Default hero (all other habits):**
- Keep the existing forest gradient with ball-tracer SVG arcs
- This covers Driver, Cardio, Core, Meals, H2O, Alcohol
- Pill icon: `BoltIcon` (default)

Implementation approach:
- Add a `variant` prop to `UpNextHero`: `'speed' | 'strength' | 'default'`
- The parent (`app/(tabs)/index.tsx`) computes `variant` from `upNextHabit.id`:
  - `'speed-training'` → `'speed'`
  - `'gym'` → `'strength'`
  - everything else → `'default'`
- Inside `UpNextHero`, the background rendering switches on `variant`:
  - `'speed'` and `'default'` render the existing `LinearGradient` + ball-tracer SVG + topo background
  - `'strength'` renders the photo + overlay stack (no ball-tracer, no topo)
- The pill icon switches: `BoltIcon` for speed/default, `DumbbellIcon` for strength

### 3. Learned queue ordering

Add a utility `utils/queue-order.ts` that analyzes past completion timestamps to determine each user's preferred habit order.

**Algorithm:**
1. Load habit logs for the past 14 days using `loadLogsForRange()`
2. For each day that has ≥2 completed habits, extract `completedAt` timestamps
3. Build a per-habit "average completion hour" (0–24 float):
   - For each habit, collect all `completedAt` times across the 14-day window
   - Compute the average hour-of-day (e.g., speed at 7.2, gym at 17.5, meals at 12.0)
4. Sort habits by their average completion hour (earliest first)
5. Habits with no completion history fall back to the current category-based order (golf → workout → lifestyle), appended after all habits that have history
6. Return the sorted habit ID array

**Storage:**
- Store the computed order in AsyncStorage at key `queue-order` as `{ order: string[], computedAt: string }`
- Recompute when the user completes a habit (the completedAt data changed) — but debounce: only recompute if the stored `computedAt` is older than 24 hours
- On first launch (no history), fall back to category order

**Integration:**
- In `app/(tabs)/index.tsx`, replace the `orderedHabits` memo (lines 147–153) with a new ordering:
  1. Load the stored `queue-order` (or compute it)
  2. Sort `todayHabits` by the learned order, with unrecognized habits appended at the end in category order
  3. Completed habits move to the bottom of the list (after all incomplete habits), preserving their learned order among themselves

**Hook: `useQueueOrder(todayHabits)`**
- Returns `orderedHabits: Habit[]` — today's habits sorted by learned order, completed items at bottom
- Internally:
  - Reads queue-order from AsyncStorage on mount
  - Accepts `todayHabits` and `getHabitProgress` to separate complete/incomplete
  - Sorts incomplete habits by learned order, then appends completed habits by learned order
  - Triggers a background recompute if `computedAt` is stale (>24h old)

### 4. Trigger recomputation after habit completion

In `app/(tabs)/index.tsx`, after `logHabit()` succeeds, call a non-blocking recompute of the queue order if it's stale. This ensures that as the user builds a pattern over days, the ordering gradually adapts.

## Key Implementation Details

**Photo background in React Native:**
- Use `<ImageBackground>` from `react-native` with `source={require('@/assets/images/buildstrong-barbell.png')}` and `resizeMode="cover"` as the outermost layer
- Layer the two gradient overlays on top using `expo-linear-gradient`'s `<LinearGradient>` with absolute positioning
- The vertical gradient needs 4 color stops — use `locations={[0, 0.4, 0.7, 1]}` with `colors={['rgba(10,24,18,0.78)', 'rgba(17,55,31,0.62)', 'rgba(17,55,31,0.48)', 'rgba(17,55,31,0.72)']}`

**Queue order stability:**
- The queue order should NOT visibly change mid-session as the user completes habits. The recompute runs in the background and takes effect on the next app open or next day.
- The `useQueueOrder` hook should cache the order for the current session and not react to real-time recompute results.

**Completed-at-bottom behavior:**
- When a habit is marked complete, it sinks to the bottom of the queue list (below all incomplete habits)
- The Up Next hero automatically promotes the next incomplete habit
- This is already partially implemented (the `upNextHabit` memo finds the first incomplete habit), but the visual queue list currently shows completed items in their original position. The change is: completed items render after incomplete items.

**Average hour calculation for habits like Meals/H2O:**
- These are logged at different times each day; the average still works
- If a habit is only logged once in 14 days, that single timestamp is the average (low confidence but still a data point)

## Acceptance Criteria

- [ ] When Speed Training is up next, the hero card shows the forest gradient + ball tracer arcs (existing "Get Long" look)
- [ ] When Strength Training is up next, the hero card shows the barbell photo background with forest tint overlay (Build Strong look), no ball tracer
- [ ] When any other habit is up next, the hero card shows the default forest gradient + ball tracer
- [ ] The pill icon on the hero card changes: bolt for speed/default, dumbbell for strength
- [ ] Queue order reflects the user's historical completion pattern (habits completed earlier in the day appear first)
- [ ] A user with no completion history sees the default category order (golf → workout → lifestyle)
- [ ] Completed habits sink to the bottom of the queue list
- [ ] Queue order remains stable during a single session (no mid-session reordering from recomputation)
- [ ] The barbell photo asset loads correctly in the strength hero variant
- [ ] The queue-order recomputation happens automatically in the background, debounced to once per 24h

## Files to Touch

- `assets/images/buildstrong-barbell.png` — new file, copied from design assets
- `components/today/up-next-hero.tsx` — add `variant` prop, render photo background for strength variant
- `app/(tabs)/index.tsx` — compute hero variant from habit ID, use `useQueueOrder` hook for ordering, move completed habits to bottom
- `utils/queue-order.ts` — new file, queue order computation + AsyncStorage persistence
- `hooks/use-queue-order.ts` — new file, hook wrapping queue-order logic for the Today screen
