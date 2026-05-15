# Test Plan: Spec 013 — Smart Queue Order + Themed Up Next Hero

## Setup
- Starting URL: Launch the Expo app on web (`npx expo start --web`), navigate to the Today tab
- Preconditions:
  - User has completed onboarding with Speed Training, Driver, and Strength Training active
  - An active challenge (Get Long) is running
  - Dev date override available in Settings for simulating multi-day patterns
- Test association: Use dev tools (Settings > data generation) to populate test data

## Tests

### Test 1: Speed Training hero card visual
**Steps:**
1. Ensure Speed Training is the first incomplete habit in the queue
2. Observe the Up Next hero card
3. Verify the card has a dark green gradient background (forest → greenDeep)
4. Verify ball-tracer arc SVG lines are visible in the upper-right area
5. Verify the pill reads "UP NEXT · 12 MIN" with a bolt icon
6. Verify the title reads "Speed Training."

**Expected:** The hero card uses the Get Long visual treatment — forest gradient with ball-tracer arcs, bolt icon in the pill.

### Test 2: Strength Training hero card visual
**Steps:**
1. Complete Speed Training and Driver so that Strength Training is the next incomplete habit
2. Observe the Up Next hero card
3. Verify the card background shows the barbell photo with a dark forest-tinted overlay
4. Verify there are NO ball-tracer arc SVG lines
5. Verify the pill reads "UP NEXT · 22 MIN" with a dumbbell icon
6. Verify the title reads "Strength Training."

**Expected:** The hero card uses the Build Strong visual treatment — photo background with gradient overlay, dumbbell icon, no ball tracers.

### Test 3: Default hero card for other habits
**Steps:**
1. Complete Speed Training, Driver, and Strength Training
2. Ensure Cardio is the next incomplete habit
3. Observe the Up Next hero card
4. Verify the card has the standard forest gradient background with ball-tracer arcs
5. Verify the pill uses the bolt icon
6. Verify the title reads "Cardio."

**Expected:** Non-speed, non-strength habits use the default forest gradient + ball-tracer visual treatment.

### Test 4: Queue order reflects completion history
**Steps:**
1. Using dev tools, generate 14 days of habit data where Strength Training is consistently completed before Speed Training (earlier completedAt timestamps)
2. Navigate to the Today tab
3. Observe the queue list order

**Expected:** Strength Training appears before Speed Training in the queue, overriding the default category order (golf before workout).

### Test 5: No history falls back to category order
**Steps:**
1. Clear all data using Settings > Clear All
2. Complete onboarding with Speed Training, Strength Training, and Cardio selected
3. Navigate to the Today tab
4. Observe the queue list order

**Expected:** Queue order follows the default category grouping: Speed Training (golf) → Strength Training (workout) → Cardio (workout).

### Test 6: Completed habits sink to bottom
**Steps:**
1. Navigate to the Today tab with 3+ habits in the queue
2. Note the queue list order
3. Complete the first habit (tap it or go through the session flow)
4. Return to the Today tab
5. Observe the queue list

**Expected:** The completed habit moves to the bottom of the queue list (below all incomplete habits). The Up Next hero updates to show the next incomplete habit.

### Test 7: Queue order stable during session
**Steps:**
1. Navigate to the Today tab and note the queue order
2. Complete habit #1 (this triggers a background recompute check)
3. Complete habit #2
4. Observe the queue list after each completion

**Expected:** The relative order of incomplete habits does NOT change between completions during the same session. Only completed habits move to the bottom. No sudden reordering.

### Test 8: Hero card transitions as habits complete
**Steps:**
1. Start with Speed Training as up next (Get Long hero)
2. Complete Speed Training (tap "Start now", go through the speed flow)
3. Return to Today tab — Strength Training should now be up next
4. Verify the hero card switched to the Build Strong photo treatment
5. Complete Strength Training
6. Return to Today tab — verify hero shows the next habit with default treatment

**Expected:** The hero card visual variant changes dynamically as different habits become the up-next item.

### Test 9: Challenge progress strip persists across variants
**Steps:**
1. Activate a "Get Long" challenge (targets Speed Training)
2. Verify the challenge progress strip appears on the Speed Training hero
3. Complete Speed Training so Strength Training is up next
4. If Strength Training is NOT part of the challenge, verify the challenge strip is NOT shown on the strength hero
5. If a challenge covers both habits, verify the strip IS shown

**Expected:** The challenge progress strip only appears on the hero card when the current up-next habit is part of the active challenge, regardless of which visual variant is active.

### Test 10: Barbell photo loads correctly
**Steps:**
1. Ensure Strength Training is up next
2. Observe the hero card on both web and iOS/Android simulator
3. Verify the barbell photo is visible through the forest-tinted overlay
4. Verify the overlay gradients create legible contrast for the text

**Expected:** The photo background renders correctly, is not stretched or cropped incorrectly, and text remains readable against the overlay.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
