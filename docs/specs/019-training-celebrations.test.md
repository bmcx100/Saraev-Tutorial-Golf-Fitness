# Test Plan: Spec 019 — Training Session Celebrations

## Setup
- Starting URL: http://localhost:8081
- Preconditions: User logged in with speed sticks and gym active. At least 2 speed sessions and 2 strength sessions exist with known values (use dev tools data generation or manual entry). Test association for write tests: `a2000000-0000-0000-0000-000000000002`.
- Note: Haptic feedback and sounds cannot be verified in Playwright (web). Visual and state changes are the primary test targets.

## Tests

### Test 1: Speed input field shows PR label
**Steps:**
1. Ensure at least one speed session exists with known values (e.g., green dom normal = 95 mph)
2. Navigate to /speed
3. Select protocol if prompted
4. On the Normal Stance step, locate the green dom input field
5. Verify a label below the field shows "PR: 95" (or whatever the stored value is)

**Expected:** Each speed input field that has a stored PR shows "PR: X" in secondary text below it.

### Test 2: Speed inline micro-celebration on PR input
**Steps:**
1. With PR for green dom normal at 95 mph
2. Navigate to /speed, reach Normal Stance step
3. Tap the green dom input field
4. Enter "98" via numpad
5. Verify the PR label changes to "NEW PR" in accent color
6. Verify the field has a visual highlight (accent border or glow)

**Expected:** Entering a value above the stored PR triggers "NEW PR" label and visual feedback on the field.

### Test 3: PR label reverts when value drops below PR
**Steps:**
1. Continue from Test 2 with "98" entered
2. Tap backspace to change value to "9"
3. Verify the label reverts to "PR: 95"
4. Enter "8" to make value "98" again
5. Verify "NEW PR" label reappears

**Expected:** PR detection is reactive — label updates based on current value vs stored PR.

### Test 4: Speed session summary — max out PR
**Steps:**
1. Complete a speed session with all fields filled
2. Enter a driver max out value higher than the stored driver PR
3. Tap Save/Submit
4. Verify a full-screen modal appears with the new driver speed as a large hero number
5. Verify the modal shows "New Driver PR" label
6. Verify a delta is shown (e.g., "↑ 3 mph")
7. Verify confetti animation is visible
8. Tap "Continue"
9. Verify navigation returns to the previous screen (Today tab)

**Expected:** Saving with a max out PR triggers a full-screen celebration modal with confetti, hero number, and delta.

### Test 5: Speed session summary — non-max-out PRs only
**Steps:**
1. Complete a speed session where a Normal Stance field is a PR but max out values are NOT PRs
2. Tap Save/Submit
3. Verify a modal appears with "Session Highlights" header
4. Verify the PR field is listed with its label, value, and delta
5. Verify no confetti (lighter celebration)
6. Tap "Continue"
7. Verify navigation returns

**Expected:** Non-max-out PRs show a summary modal without confetti.

### Test 6: Speed session summary — no PRs, skip modal
**Steps:**
1. Complete a speed session where all values are below their stored PRs
2. Tap Save/Submit
3. Verify no summary modal appears
4. Verify immediate navigation back to previous screen

**Expected:** Sessions with no PRs skip the summary modal entirely.

### Test 7: Standout performances in speed summary
**Steps:**
1. With stored PR for blue dom normal at 100 mph
2. Complete a speed session with blue dom normal = 98 (within 3 mph of PR) and at least one other field as a new PR
3. Tap Save/Submit
4. Verify the summary modal appears (triggered by the PR)
5. Verify the blue dom normal entry is listed as a standout (e.g., "98 mph — 2 mph from PR")

**Expected:** Values within 3 mph of their field PR are noted as standouts in the session summary.

### Test 8: Strength inline PR detection
**Steps:**
1. Ensure a strength session has been saved with known exercise PRs (e.g., Squat PR at 225 lbs)
2. Navigate to /strength
3. On the exercise list, find Squat
4. Enter a weight value higher than 225 for a set
5. Verify a "PR" badge appears next to the weight
6. Verify visual feedback (accent styling on the weight input)

**Expected:** Entering a weight above the stored exercise PR triggers inline PR indication.

### Test 9: Strength session summary — exercise PRs
**Steps:**
1. Complete a strength session with at least one exercise weight exceeding its stored PR
2. Tap Save/Submit
3. Verify a modal appears with "Session Highlights" header
4. Verify the exercise PR is listed with name, weight × reps, and delta

**Expected:** Saving with exercise PRs shows a summary modal listing the achievements.

### Test 10: Strength session summary — streak milestone
**Steps:**
1. Set up strength stats with streak at 13 days (1 day from 14-day milestone)
2. Complete and save a strength session
3. Verify the summary modal shows a milestone badge ("14-Day Streak!")
4. If the session also has PRs, verify both PR and milestone appear in the same modal

**Expected:** Crossing a streak milestone triggers a celebration badge in the session summary.

### Test 11: Challenge completion celebration
**Steps:**
1. Start a challenge with targetTotal = 2 (low target for testing)
2. Log enough habits to be 1 completion away from the target
3. Log the final habit completion
4. Verify a full-screen celebration appears on the Today tab
5. Verify confetti is visible
6. Verify the challenge name is displayed (e.g., "Get Long Complete!")
7. Tap "Continue"
8. Verify the celebration dismisses

**Expected:** Completing a challenge triggers a full-screen celebration with confetti on the Today screen.

### Test 12: All-done confetti message
**Steps:**
1. Set up a day with 3 scheduled habits, complete 2 of them
2. Complete the final habit
3. Verify confetti fires (existing behavior)
4. Verify a message overlay appears with the confetti: "All 3 habits done!"

**Expected:** The all-done confetti includes a count message showing how many habits were completed.

### Test 13: SpeedStats.fieldPRs populated by rebuild
**Steps:**
1. Ensure multiple speed sessions exist with various values
2. Navigate to Settings
3. Tap "Rebuild Stats" in dev tools
4. Navigate to /speed
5. Verify PR labels appear on input fields matching the best values from historical sessions

**Expected:** `rebuildStatsAggregates()` correctly computes and stores per-field PRs from all historical speed sessions.

### Test 14: Multiple PRs in one speed session
**Steps:**
1. Complete a speed session where 3+ fields are new PRs including a max out
2. Tap Save
3. Verify the celebration modal shows the max out PR as the hero number
4. Verify the other PRs are listed below the hero section
5. All PRs are accurately labeled with field names and deltas

**Expected:** Multiple PRs in one session are all captured and displayed in the summary.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
