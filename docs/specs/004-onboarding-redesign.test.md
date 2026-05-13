# Test Plan: Spec 004 -- Onboarding Redesign

## Setup
- Starting URL: Expo dev server (mobile simulator or web)
- Preconditions: Fresh install (clear AsyncStorage) so onboarding triggers
- Clear storage: Remove `user-profile` and `challenges` keys from AsyncStorage

## Tests

### Test 1: Overview page renders correctly
**Steps:**
1. Launch app with no prior onboarding data
2. Verify title "How SUBPAR Works" is displayed
3. Verify 4 cards visible: "Set Up Your Game Plan", "Take Challenges", "Track Progress", "Stay on Track"
4. Verify each card has an icon and description text
5. Verify "Continue" button is visible at the bottom
6. Verify step indicator shows 3 dots with the first dot active

**Expected:** Overview page renders with all 4 info cards, Continue button, and step indicator

### Test 2: Continue advances to habit selection
**Steps:**
1. On overview page, tap "Continue"
2. Verify title changes to "Build Your Game Plan"
3. Verify subtitle "You can change these anytime in Settings." is displayed
4. Verify "Select All" button is visible
5. Verify habit cards appear in 3 category groups (Golf, Workouts, Lifestyle)
6. Verify step indicator dot 2 is active

**Expected:** Habit selection step renders with all elements and correct step indicator

### Test 3: Select All toggles all habits
**Steps:**
1. On habit selection step, verify no habits are selected initially
2. Tap "Select All"
3. Verify all 8 habit cards show selected state (check-circle icon, accent border)
4. Verify button text changes to "Deselect All"
5. Tap "Deselect All"
6. Verify all habits are deselected (radio-button-unchecked icon, default border)
7. Verify button text changes back to "Select All"

**Expected:** Select All toggles all habits on/off and button text updates accordingly

### Test 4: Next button requires at least one habit
**Steps:**
1. On habit selection step with no habits selected
2. Verify "Next" button is disabled (muted color)
3. Select one habit (e.g., Speed Sticks)
4. Verify "Next" button becomes enabled (accent color)
5. Deselect the habit
6. Verify "Next" button is disabled again

**Expected:** Next is only enabled when at least 1 habit is selected

### Test 5: Challenge selection shows filtered challenges
**Steps:**
1. Select Speed Sticks and Cardio habits (do NOT select gym)
2. Tap "Next"
3. Verify title "Take a Challenge" is shown
4. Verify "Get Long" card is visible (speed-sticks was selected)
5. Verify "Get Strong" card is NOT visible (gym was not selected)
6. Verify "Tighten It Up" card is visible (cardio was selected)
7. Verify step indicator dot 3 is active

**Expected:** Only challenges matching selected habits appear

### Test 6: Challenge selection shows all three when all habits selected
**Steps:**
1. On habit selection, tap "Select All"
2. Tap "Next"
3. Verify all 3 challenge cards are visible: "Get Long", "Get Strong", "Tighten It Up"

**Expected:** All challenges shown when all required habits are selected

### Test 7: Challenge selection is single-select
**Steps:**
1. On challenge selection with multiple cards visible
2. Select "Get Long"
3. Verify Get Long shows filled radio circle
4. Select "Tighten It Up"
5. Verify Get Long is now deselected (outline circle)
6. Verify Tighten It Up shows filled radio circle

**Expected:** Only one challenge can be selected at a time

### Test 8: Start Training completes onboarding
**Steps:**
1. Complete Steps 0 and 1 (select at least speed-sticks)
2. On Step 2, select "Get Long"
3. Tap "Start Training"
4. Verify app navigates to the Today tab
5. Navigate to Challenges tab
6. Verify "Get Long" appears as the active challenge with 0/12 progress

**Expected:** Onboarding completes, challenge starts, user lands on main app

### Test 9: Step 2 skipped when no challenges match
**Steps:**
1. On habit selection, select ONLY lifestyle habits (Meals, H2O, Alcohol)
2. Tap "Next"
3. Verify app navigates directly to the Today tab (Step 2 is skipped)
4. Navigate to Challenges tab
5. Verify no active challenge exists

**Expected:** When no challenges match, onboarding finishes after Step 1

### Test 10: 3-Day Kickoff no longer starts
**Steps:**
1. Complete full onboarding selecting speed-sticks + "Get Long" challenge
2. Navigate to Challenges tab
3. Verify no "3-Day Kickoff" challenge exists in active or completed lists
4. Verify "Get Long" is the only active challenge

**Expected:** 3-Day Kickoff is fully removed, replaced by user-chosen challenge

### Test 11: Tighten It Up tracks both cardio and core
**Steps:**
1. Complete onboarding selecting cardio + core + "Tighten It Up" challenge
2. On Today tab, mark Cardio as complete
3. Navigate to Challenges tab
4. Verify "Tighten It Up" progress shows 1/12
5. Navigate back to Today tab
6. Mark Core as complete
7. Navigate to Challenges tab
8. Verify progress shows 2/12

**Expected:** Both cardio and core completions count toward the Tighten It Up target

### Test 12: Returning user is not shown onboarding
**Steps:**
1. Complete onboarding fully
2. Close and reopen the app
3. Verify app opens directly to the Today tab (not onboarding)

**Expected:** Completed onboarding is persisted and not re-shown

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
