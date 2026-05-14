# Test Plan: Spec 008 — Speed Sticks Detail View

## Setup
- Starting URL: http://localhost:8081
- Preconditions: App running via `npx expo start --web`. User has completed onboarding with speed protocol active. Spec 007 (hook cards) is implemented. Use Settings dev tools to generate speed session data and rebuild stats.
- For most tests, generate 10-15 speed sessions spread across the last 60 days with varying driver speeds (100-120 range) and stick speeds. Sessions should have both normalStance and stepDrill data filled.

## Tests

### Test 1: Navigation from hook card to detail view
**Steps:**
1. Generate speed session data, rebuild stats
2. Navigate to Stats tab
3. Tap the speed hook card
4. Verify the screen title shows "Speed Stats"
5. Verify the screen is not a placeholder — content sections are visible
6. Tap the back arrow
7. Verify return to Stats tab

**Expected:** Hook card navigates to full detail view, back arrow returns to Stats tab.

### Test 2: Driver speed trend chart renders with data points
**Steps:**
1. Generate 8 speed sessions across 30 days with driver maxOut values (105, 107, 106, 109, 110, 108, 112, 111)
2. Navigate to speed detail view
3. Verify "DRIVER SPEED TREND" section title is visible
4. Verify a line chart is rendered with visible data point dots
5. Verify "90-day history" text appears below the chart

**Expected:** Line chart renders with data points for each session's driver speed.

### Test 3: Milestone reference lines on chart
**Steps:**
1. Generate sessions with driver speeds ranging from 103 to 115
2. Navigate to speed detail view
3. Verify horizontal dashed reference lines appear at 105, 110, and 115 mph
4. Verify reference lines at 90, 95, 100, 120+ are NOT visible (outside data range)

**Expected:** Only milestones within the data's Y range (± 5 mph) appear as reference lines.

### Test 4: Chart empty state
**Steps:**
1. Clear all data, re-setup with speed protocol active but no sessions
2. Navigate to speed detail view
3. Verify "Complete more sessions to see your trend" text is shown
4. Verify no chart is rendered

**Expected:** Empty state when fewer than 2 data points exist.

### Test 5: Per-stick PRs display
**Steps:**
1. Generate sessions where green dom best = 95, green nonDom best = 88, blue dom = 102, blue nonDom = 94, red dom = 108, red nonDom = 100
2. Navigate to speed detail view
3. Verify "STICK PRs" section is visible
4. Verify Green row shows Dom: 95 and Non-Dom: 88 with dates
5. Verify Blue row shows Dom: 102 and Non-Dom: 94 with dates
6. Verify Red row shows Dom: 108 and Non-Dom: 100 with dates
7. Verify color dots match stick colors (green, blue, red)

**Expected:** All 6 stick PRs displayed with correct values and dates.

### Test 6: Dom vs non-dom gap — closing trend
**Steps:**
1. Generate older sessions (60-45 days ago) with large dom-nonDom gaps (e.g., dom=100, nonDom=90 for green)
2. Generate recent sessions (last 30 days) with smaller gaps (e.g., dom=105, nonDom=100 for green)
3. Navigate to speed detail view
4. Verify "DOM vs NON-DOM GAP" section is visible
5. Verify green row shows a closing trend (↓ arrow in green)
6. Verify plain language summary mentions non-dominant gains

**Expected:** Gap analysis shows closing trend when non-dom side is catching up.

### Test 7: Transfer rate — good assessment
**Steps:**
1. Generate first session with driver=100, average sticks=90
2. Generate latest session with driver=110, average sticks=100
3. Navigate to speed detail view
4. Verify "TRANSFER RATE" section shows "Your stick gains are transferring well to your driver."
5. Verify stick gain and driver gain numbers are displayed

**Expected:** Good assessment when driver gain (10) ≥ 70% of stick gain (10).

### Test 8: Transfer rate — lagging assessment
**Steps:**
1. Generate first session with driver=100, average sticks=90
2. Generate latest session with driver=103, average sticks=105
3. Navigate to speed detail view
4. Verify text says "Your driver speed hasn't caught up to your stick progress yet."

**Expected:** Lagging assessment when driver gain (3) < 70% of stick gain (15).

### Test 9: Transfer rate — insufficient data
**Steps:**
1. Generate only 1 speed session
2. Navigate to speed detail view
3. Verify "Need more sessions to calculate transfer rate." text appears

**Expected:** Transfer rate unavailable with fewer than 2 sessions.

### Test 10: Session history log display
**Steps:**
1. Generate 12 speed sessions across 40 days
2. Navigate to speed detail view
3. Verify "SESSION HISTORY" section is visible
4. Verify sessions are listed most recent first
5. Verify each row shows: session number (e.g., #12), date, driver mph, green mph
6. Verify the most recent session appears at the top with the highest number

**Expected:** Session history displays in reverse chronological order with sequential numbering.

### Test 11: Session detail bottom sheet
**Steps:**
1. Generate speed sessions with full data (all 14 fields populated)
2. Navigate to speed detail view
3. Tap any session row in the history log
4. Verify a bottom sheet modal slides up with rounded top corners
5. Verify the modal shows the session date as header
6. Verify Normal Stance section shows green/blue/red dom and nonDom values
7. Verify Step Drill section shows the same layout
8. Verify Max Out section shows Green and Driver values
9. Tap the X button at top-right
10. Verify the modal closes

**Expected:** Bottom sheet shows all 14 fields organized by drill step, closes on X tap.

### Test 12: Bottom sheet closes on overlay tap
**Steps:**
1. Open a session detail bottom sheet (tap any history row)
2. Tap the dark overlay area above the bottom sheet content
3. Verify the modal closes

**Expected:** Tapping outside the content area closes the modal.

### Test 13: Weekly consistency view
**Steps:**
1. Generate sessions: 4 in current week, 3 two weeks ago, 1 three weeks ago, 0 four weeks ago
2. Navigate to speed detail view
3. Verify "WEEKLY CONSISTENCY" section is visible
4. Verify 8 column bars are shown
5. Verify the current week's bar is green/accent colored (4 ≥ 3)
6. Verify the week with 3 sessions is also green
7. Verify the week with 1 session is amber colored
8. Verify empty weeks show gray bars
9. Verify "3+ sessions/week = on track" text appears below

**Expected:** Bar chart accurately reflects per-week session counts with correct color coding.

### Test 14: Protocol progress summary
**Steps:**
1. Generate 15 speed sessions spanning May 1 to May 14
2. Navigate to speed detail view
3. Verify "PROTOCOL PROGRESS" section is visible
4. Verify protocol name "SuperSpeed L1" (or similar) is shown
5. Verify "15" sessions count is displayed
6. Verify date range shows start and end dates
7. Verify driver gain shows the difference between first and latest driver speed

**Expected:** Protocol summary shows accurate session count, date range, and driver gain.

### Test 15: Loading state
**Steps:**
1. Navigate to speed detail view
2. Verify a loading indicator appears briefly while data loads
3. Verify sections appear after loading completes

**Expected:** ActivityIndicator shown while data is fetching.

### Test 16: History log truncation (>20 sessions)
**Steps:**
1. Generate 25 speed sessions
2. Navigate to speed detail view
3. Verify only 20 session rows are shown in the history log
4. Verify text "Showing last 20 of 25 sessions" appears below the list

**Expected:** History log limited to 20 most recent sessions with count indicator.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
