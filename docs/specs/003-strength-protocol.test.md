# Test Plan: Spec 003 — Strength Training Protocol Tracking

## Setup
- Starting URL: Expo dev server (mobile or web)
- Preconditions: App installed, user has completed onboarding, Strength Training habit is active in settings
- State: No strength protocol selected (fresh state) unless test specifies otherwise

## Tests

### Test 1: Home screen navigates to strength page
**Steps:**
1. Navigate to the Today screen
2. Verify "Strength Training" habit row is visible
3. Tap the Strength Training row
4. Verify navigation to the strength page (not a toggle)

**Expected:** App navigates to `/strength`. No checkmark toggles on the home screen.

### Test 2: Protocol picker shows on first visit
**Steps:**
1. Ensure `strengthProtocol` is `null` (no protocol selected)
2. Navigate to `/strength`
3. Verify "Choose Your Protocol" title is visible
4. Verify "Legs / Pull / Legs / Push" card is visible and tappable
5. Verify "BMC's Super Heavy Lifting Thingy" card is visible but disabled
6. Verify "Coming Soon" badge on the BMC card

**Expected:** Two protocol cards shown. Only L/P/L/P is selectable.

### Test 3: Selecting L/P/L/P protocol saves and transitions
**Steps:**
1. Navigate to `/strength` with no protocol set
2. Tap the "Legs / Pull / Legs / Push" card
3. Verify the protocol picker disappears
4. Verify the workout tracker appears with day selector chips

**Expected:** Protocol saved as `lplp`. Workout tracker visible with 4 day chips.

### Test 4: Default workout day is Legs 1 on first use
**Steps:**
1. Select L/P/L/P protocol (no previous workouts)
2. Verify the "Legs 1" chip is selected/highlighted
3. Verify subtitle shows "Quads"
4. Verify exercises shown: Calf Raises, Tib Raises, Split Squats, Squats

**Expected:** Legs 1 is recommended and pre-selected. All 4 exercises visible with 3 sets each.

### Test 5: Exercise sets display correctly
**Steps:**
1. Navigate to workout tracker with Legs 1 selected
2. For the first exercise (Calf Raises), verify:
   - 3 set rows visible (labeled 1, 2, 3)
   - Each set has a weight field (showing `--` or null indicator)
   - Each set has a reps field (showing `8`)
   - Each set has an unchecked completion checkbox

**Expected:** 3 sets per exercise. Reps default to 8. Weight is empty on first use.

### Test 6: Numpad activates on field tap
**Steps:**
1. Navigate to workout tracker
2. Tap the weight field for Set 1 of Calf Raises
3. Verify the numpad slides up from the bottom
4. Verify the tapped field is highlighted (active border)
5. Type "135" using numpad digits
6. Verify the field shows "135"

**Expected:** Numpad appears on field tap. Digits entered appear in the active field.

### Test 7: Numpad Tab advances through fields
**Steps:**
1. Navigate to workout tracker, tap weight field for Set 1 of Calf Raises
2. Enter "100"
3. Tap Tab key on numpad
4. Verify focus moves to reps field for Set 1
5. Tap Tab again
6. Verify focus moves to weight field for Set 2

**Expected:** Tab advances focus in order: weight → reps → next set weight → next set reps → next exercise.

### Test 8: Numpad backspace deletes digits
**Steps:**
1. Tap a weight field and enter "135"
2. Tap backspace (⌫) on numpad
3. Verify field shows "13"
4. Tap backspace again
5. Verify field shows "1"
6. Tap backspace again
7. Verify field returns to empty/null state

**Expected:** Backspace removes last digit. Deleting all digits returns to null.

### Test 9: Completion checkbox toggles
**Steps:**
1. Navigate to workout tracker
2. Enter weight and reps for Set 1 of an exercise
3. Tap the completion checkbox for Set 1
4. Verify checkbox shows as checked (filled circle with checkmark)
5. Tap again
6. Verify checkbox unchecks

**Expected:** Checkbox toggles between checked and unchecked states.

### Test 10: Switching workout days via chips
**Steps:**
1. Navigate to workout tracker with Legs 1 selected
2. Tap the "Pull" chip
3. Verify subtitle changes to "Back & Biceps"
4. Verify exercises change to: Shrugs, Lat Pulldowns, Bent Over Rows, Curls
5. Verify all checkboxes are unchecked
6. Tap "Push" chip
7. Verify 6 exercises shown: Dips, Bench Press, Overhead Press, Front Delt Raises, Side Delt Raises, Tricep Extensions

**Expected:** Switching days shows correct exercises. Checkboxes reset. Exercise counts: Legs 1 = 4, Pull = 4, Legs 2 = 5, Push = 6.

### Test 11: Submit requires all sets completed
**Steps:**
1. Navigate to workout tracker
2. Verify Submit button is disabled (or not visible)
3. Fill in weight/reps and check off some but not all sets
4. Verify Submit remains disabled
5. Check off ALL remaining sets (fill weight/reps for each)
6. Verify Submit becomes enabled

**Expected:** Submit only activates when every set across every exercise is checked as completed.

### Test 12: Successful submission saves and marks habit
**Steps:**
1. Navigate to workout tracker with all sets filled and checked
2. Tap Submit
3. Verify navigation back to the Today screen
4. Verify Strength Training habit shows as completed (checkmark)
5. Verify workout ring reflects the completion

**Expected:** Session saved. Habit marked done. Ring updates.

### Test 13: Rotation advances after submission
**Steps:**
1. Complete a Legs 1 workout and submit
2. Navigate back to `/strength`
3. Verify "Pull" chip is now pre-selected (recommended)
4. Complete Pull workout and submit
5. Navigate back to `/strength`
6. Verify "Legs 2" chip is now pre-selected
7. Complete Legs 2, re-open → verify "Push" recommended
8. Complete Push, re-open → verify "Legs 1" recommended (cycle restarts)

**Expected:** Rotation advances: legs1 → pull → legs2 → push → legs1.

### Test 14: Exercise defaults carry over from previous session
**Steps:**
1. Complete a Legs 1 workout with Calf Raises at 100 lbs, 10 reps
2. Submit the session
3. Navigate to `/strength` and select Legs 1 again
4. Verify Calf Raises shows 100 lbs and 10 reps pre-filled for all 3 sets
5. Switch to Legs 2
6. Verify Calf Raises on Legs 2 also shows 100 lbs and 10 reps (shared exercise ID)

**Expected:** Previous weight/reps carry over as defaults. Shared exercise IDs share defaults across workout days.

### Test 15: Re-entry on completed day loads saved session
**Steps:**
1. Complete a workout and submit
2. Tap the Strength Training card again (same day)
3. Verify the strength page loads with all saved values and checkboxes pre-filled

**Expected:** Existing session loaded. All fields and checkboxes reflect the saved state.

### Test 16: Cancel with progress shows confirmation
**Steps:**
1. Navigate to workout tracker
2. Check off at least one set
3. Press the back button
4. Verify alert: "Discard this workout? Your progress will be lost."
5. Tap "Cancel" (decline)
6. Verify stays on workout tracker with progress intact
7. Press back again, tap "Discard" (accept)
8. Verify navigation to home screen

**Expected:** Discard confirmation shown when progress exists. Cancel keeps user on page. Discard navigates home.

### Test 17: Cancel without progress navigates directly
**Steps:**
1. Navigate to workout tracker
2. Do not check any sets or enter any data
3. Press the back button
4. Verify direct navigation to home screen (no confirmation)

**Expected:** No confirmation when no progress has been made.

### Test 18: Settings shows strength protocol
**Steps:**
1. Select L/P/L/P protocol
2. Navigate to Settings
3. Tap the gear icon on the Strength Training row
4. Verify "Strength Protocol" section is visible
5. Verify it shows "Legs / Pull / Legs / Push"

**Expected:** Current protocol displayed in the habit detail panel.

### Test 19: Change protocol in settings resets to picker
**Steps:**
1. Open Strength Training detail in Settings
2. Tap "Change Protocol"
3. Navigate to `/strength`
4. Verify the protocol picker appears (not the workout tracker)

**Expected:** Protocol reset to `null`. Picker shown on next visit.

### Test 20: Legs 2 shows correct 5 exercises
**Steps:**
1. Navigate to workout tracker
2. Select Legs 2 chip
3. Verify exactly 5 exercises: Calf Raises, Tib Raises, Nordic Curls, Back Extensions, Dead Lifts
4. Verify 15 total sets (5 × 3)

**Expected:** Legs 2 has 5 exercises with correct names and 3 sets each.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
