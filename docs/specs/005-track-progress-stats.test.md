# Test Plan: Spec 005 — Track Progress (Stats Tab)

## Setup
- Starting URL: Expo dev server (press `w` for web)
- Preconditions:
  - At least one completed speed session with driver mph values in AsyncStorage
  - At least one completed strength session in AsyncStorage
  - User profile has `speedProtocol` and `strengthProtocol` set (onboarding completed)

## Tests

### Test 1: Speed card appears when speed protocol is active
**Steps:**
1. Navigate to Stats tab
2. Verify a section titled "DRIVER SPEED" exists
3. Verify a large mph number is displayed (not "--")
4. Verify "Best: X mph" text appears below the hero number

**Expected:** Speed trend card is visible with real data from completed sessions.

### Test 2: Speed trend row shows session history
**Steps:**
1. Navigate to Stats tab
2. Locate the "DRIVER SPEED" section
3. Verify there are pill elements showing day labels (e.g., "Mon", "Tue")
4. Verify each pill has an mph value below the day label
5. Verify the highest value uses the accent/tint color

**Expected:** Up to 7 session entries appear as horizontally arranged pills with day + mph.

### Test 3: Strength card appears when strength protocol is active
**Steps:**
1. Navigate to Stats tab
2. Verify a section titled "STRENGTH TRAINING" exists
3. Verify a session count number is displayed with "sessions" label
4. Verify the most recent workout day label appears (e.g., "Pull", "Legs 1")

**Expected:** Strength summary card is visible with real data.

### Test 4: Strength rotation indicators show completed days
**Steps:**
1. Navigate to Stats tab
2. Locate the "STRENGTH TRAINING" section
3. Verify 4 rotation indicators are visible (L/P/L/P)
4. Verify completed days show as filled dots
5. Verify incomplete days show as empty dots

**Expected:** Rotation row reflects which workout days were hit in the last 7 days.

### Test 5: Speed card hidden when no speed protocol
**Steps:**
1. Ensure user profile has `speedProtocol: null` (protocol not selected)
2. Navigate to Stats tab
3. Verify no "DRIVER SPEED" section exists

**Expected:** Speed card does not render when protocol is not active.

### Test 6: Strength card hidden when no strength protocol
**Steps:**
1. Ensure user profile has `strengthProtocol: null`
2. Navigate to Stats tab
3. Verify no "STRENGTH TRAINING" section exists

**Expected:** Strength card does not render when protocol is not active.

### Test 7: Speed card empty state
**Steps:**
1. Ensure user has `speedProtocol` set but zero completed speed sessions
2. Navigate to Stats tab
3. Verify "DRIVER SPEED" section exists
4. Verify the hero number shows "--"
5. Verify empty state message appears mentioning completing a speed session

**Expected:** Card renders in empty state without crashing, with helpful prompt.

### Test 8: Strength card empty state
**Steps:**
1. Ensure user has `strengthProtocol` set but zero completed strength sessions
2. Navigate to Stats tab
3. Verify "STRENGTH TRAINING" section exists
4. Verify session count shows "0"
5. Verify empty state message appears mentioning completing a strength workout

**Expected:** Card renders in empty state without crashing, with helpful prompt.

### Test 9: Cards appear in correct order
**Steps:**
1. Navigate to Stats tab with both protocols active and data present
2. Verify vertical order: Weekly Mini-Rings, then Driver Speed card, then Strength Training card, then Habit Breakdown, then Records

**Expected:** Training cards are inserted between the existing rings and breakdown sections.

### Test 10: Loading state while data fetches
**Steps:**
1. Navigate to Stats tab
2. Observe the area where training cards will appear
3. Verify a loading indicator appears briefly before cards render

**Expected:** ActivityIndicator shows while async data loads, then cards replace it.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
