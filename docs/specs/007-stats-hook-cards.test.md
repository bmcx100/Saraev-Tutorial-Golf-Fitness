# Test Plan: Spec 007 — Stats Page Redesign — Hook Cards

## Setup
- Starting URL: http://localhost:8081
- Preconditions: App running via `npx expo start --web`. User has completed onboarding (has active habits). Both speed and strength protocols are active.
- Use Settings dev tools to generate test data and rebuild stats as needed.

## Tests

### Test 1: Speed hook card — default mode (has PR, no special conditions)
**Steps:**
1. Use Settings dev tools to generate a speed session with driver maxOut = 108, dated 1 day ago
2. Use Settings "Rebuild Stats" to populate aggregates
3. Navigate to Stats tab
4. Verify the speed card shows section title "SPEED STICKS"
5. Verify the speed card shows "108" as the large hero number
6. Verify "mph" label appears below the number
7. Verify "Personal Record" text appears below the mph label
8. Verify a chevron-right icon is visible on the card

**Expected:** Speed card displays the PR in default mode with "Personal Record" label.

### Test 2: Speed hook card — new PR mode
**Steps:**
1. Use Settings dev tools to generate two speed sessions: one from 5 days ago with driver = 105, one from today with driver = 108
2. Rebuild stats
3. Navigate to Stats tab
4. Verify a green "NEW PR" badge appears above the hero number
5. Verify the hero number shows "108"
6. Verify "↑ 3 mph" text appears below the mph label in accent color

**Expected:** Speed card shows PR celebration with delta from previous PR.

### Test 3: Speed hook card — near milestone mode
**Steps:**
1. Generate a speed session with driver = 119, dated 1 day ago (no previous PR to trigger newPR mode)
2. Rebuild stats (ensure no previousDriverPR exists to avoid newPR priority)
3. Navigate to Stats tab
4. Verify the hero number shows "119"
5. Verify text below shows "1 mph from 120"

**Expected:** Card shows milestone proximity when within 2 mph of a milestone.

### Test 4: Speed hook card — stale mode
**Steps:**
1. Generate a single speed session with driver = 110, dated 5 days ago
2. Rebuild stats
3. Navigate to Stats tab
4. Verify the hero number shows "110"
5. Verify text below shows "Last session: 5 days ago"

**Expected:** Card shows staleness prompt when last session was 4+ days ago.

### Test 5: Speed hook card — empty state
**Steps:**
1. Clear all data via Settings dev tools
2. Re-complete onboarding with speed protocol active
3. Navigate to Stats tab
4. Verify the speed card area shows "Complete a speed session to get started"
5. Verify no hero number is displayed

**Expected:** Empty state message when no speed sessions exist.

### Test 6: Speed hook card — navigation
**Steps:**
1. Ensure speed data exists (any mode)
2. Navigate to Stats tab
3. Tap the speed hook card
4. Verify navigation to a new screen with title "Speed Stats"
5. Verify "Coming soon" placeholder text is visible
6. Tap the back arrow
7. Verify return to Stats tab

**Expected:** Tapping card navigates to /stats-speed detail stub and back works.

### Test 7: Strength hook card — active streak mode
**Steps:**
1. Generate strength sessions on 3 consecutive days (2 days ago, 1 day ago, today) with different workout days
2. Rebuild stats
3. Navigate to Stats tab
4. Verify the strength card shows section title "STRENGTH"
5. Verify the hero number shows "3" (3-day streak)
6. Verify "day streak" label appears below the number

**Expected:** Strength card shows active streak when 3+ consecutive training days.

### Test 8: Strength hook card — new PR mode
**Steps:**
1. Generate two strength sessions: one from 3 days ago with squat weight 200, one from today with squat weight 225
2. Rebuild stats
3. Navigate to Stats tab
4. Verify a "NEW PR" badge appears
5. Verify the exercise name is displayed (e.g., "Squats")
6. Verify "225" appears as the hero number with "lbs" unit

**Expected:** Strength card prioritizes today's PR over streak display.

### Test 9: Strength hook card — streak near milestone
**Steps:**
1. Generate strength sessions creating a 12-day streak (sessions on days 12, 10, 8, 6, 4, 2 days ago, keeping gaps ≤ 2)
2. Rebuild stats
3. Navigate to Stats tab
4. Verify hero number shows "12"
5. Verify text below shows "2 days to 14-day streak" in accent color

**Expected:** Card shows milestone proximity when streak is within 2 days of a milestone.

### Test 10: Strength hook card — empty state
**Steps:**
1. Clear all data
2. Re-complete onboarding with strength protocol active
3. Navigate to Stats tab
4. Verify strength card area shows "Complete a strength workout to get started"

**Expected:** Empty state when no strength sessions exist.

### Test 11: Strength hook card — navigation
**Steps:**
1. Ensure strength data exists
2. Navigate to Stats tab
3. Tap the strength hook card
4. Verify navigation to a screen with title "Strength Stats"
5. Verify "Coming soon" placeholder text
6. Tap back arrow
7. Verify return to Stats tab

**Expected:** Tapping card navigates to /stats-strength and back works.

### Test 12: Existing Stats sections unchanged
**Steps:**
1. Generate habit completion data for the week
2. Navigate to Stats tab
3. Verify Weekly Mini-Rings section still renders with day circles
4. Verify "This Week" habit breakdown section shows per-habit completion rates
5. Verify "Records" section shows Best Streak, Total Logs, and Challenges cards

**Expected:** All existing Stats tab sections render correctly alongside new hook cards.

### Test 13: Speed aggregate updates on session save
**Steps:**
1. Clear all data, re-setup protocols
2. Navigate to speed training, complete a full session with driver = 112
3. Submit the session
4. Navigate to Stats tab
5. Verify speed card shows "112" as the hero number

**Expected:** Saving a speed session updates the aggregate stats immediately visible on Stats tab.

### Test 14: Strength aggregate updates on session save
**Steps:**
1. Clear all data, re-setup protocols
2. Navigate to strength training, complete a full workout
3. Submit the workout
4. Navigate to Stats tab
5. Verify strength card shows workout data (default mode with last session info)

**Expected:** Saving a strength session updates the aggregate stats immediately.

### Test 15: Cards hidden when protocol not active
**Steps:**
1. Navigate to Settings
2. Change speed protocol to none (if option exists) or clear speed protocol
3. Navigate to Stats tab
4. Verify no speed hook card is rendered
5. Verify strength hook card still renders if strength protocol is active

**Expected:** Cards only appear when corresponding protocol is active in user profile.

### Test 16: Rebuild Stats button in Settings
**Steps:**
1. Generate several speed and strength sessions via dev tools
2. Open Settings, scroll to dev tools section
3. Tap "Rebuild Stats" button
4. Navigate to Stats tab
5. Verify speed card shows correct PR from generated sessions
6. Verify strength card shows correct streak/PR data

**Expected:** Rebuild Stats correctly populates aggregates from all historical session data.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
