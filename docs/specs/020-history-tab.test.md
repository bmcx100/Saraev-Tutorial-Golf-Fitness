# Test Plan: Spec 020 — History Tab

## Setup
- Starting URL: http://localhost:8081
- Preconditions: User logged in with speed sticks and gym active. At least 3 speed sessions and 3 strength sessions exist across different dates in the last 30 days. Multiple habit logs exist. Use dev tools data generation to seed test data. Test association for write tests: `a2000000-0000-0000-0000-000000000002`.

## Tests

### Test 1: Tab label and icon changed
**Steps:**
1. Navigate to the app home screen
2. Verify the third tab in the bottom bar is labeled "History" (not "Stats")
3. Verify the tab icon has changed from the bar-chart icon

**Expected:** Tab label reads "History" with a clock/history icon.

### Test 2: Speed Hero Card renders first
**Steps:**
1. Tap the History tab
2. Verify the first content section is the Speed Hero Card
3. Verify a large driver speed number is displayed (matching the stored driver PR)
4. Verify "mph" label appears below the number

**Expected:** Speed Hero Card is the first section with the driver speed prominently displayed.

### Test 3: Speed Hero Card trend badge
**Steps:**
1. With speed sessions showing a positive trend (latest > earliest in 30 days)
2. View the History tab
3. Verify a trend badge shows "↑ X mph this month" in accent color below the mph label

**Expected:** Trend badge reflects the direction of driver speed change over the 30-day window.

### Test 4: Speed Hero Card journey line
**Steps:**
1. With at least 2 speed sessions in the 30-day window
2. View the History tab
3. Verify text appears: "Started at {first mph} → Now at {current mph}"

**Expected:** Journey line shows the user's speed progression from first to latest session.

### Test 5: Speed Hero Card navigation
**Steps:**
1. Tap the Speed Hero Card
2. Verify navigation to /stats-speed
3. Verify the Speed Detail View renders (charts, PRs, etc.)
4. Tap back arrow
5. Verify return to History tab

**Expected:** Tapping the Speed Hero Card navigates to the existing speed detail view.

### Test 6: Speed Hero Card empty state
**Steps:**
1. Clear all speed session data (via dev tools)
2. Navigate to History tab
3. Verify the Speed Hero Card area shows "Complete your first speed session to see your progress"
4. Verify no large number is displayed

**Expected:** Empty state message shows when no speed sessions exist.

### Test 7: This Week Strip renders 7 days
**Steps:**
1. Navigate to History tab
2. Verify a horizontal row of 7 day cards is visible (Mon through Sun)
3. Verify today's card has a distinct border (accent color)
4. Verify day abbreviation labels are correct for the current week

**Expected:** This Week Strip shows all 7 days of the current week with today highlighted.

### Test 8: This Week Strip activity indicators
**Steps:**
1. Ensure today has: all habits completed + a speed session logged
2. Ensure yesterday has: some habits completed + a strength session
3. Navigate to History tab
4. Verify today's card shows: filled green circle + "S" badge
5. Verify yesterday's card shows: filled amber circle + "G" badge
6. Verify a day with no activity shows: empty circle outline only

**Expected:** Each day card shows appropriate activity indicators based on what was logged.

### Test 9: Gym-to-Speed Connection card renders
**Steps:**
1. Ensure user has both speedProtocol and strengthProtocol active
2. Ensure at least 1 strength session exists in 30 days
3. Navigate to History tab
4. Scroll to find the "Strength → Speed" card
5. Verify gym session count is displayed
6. Verify speed-related messaging appears (e.g., "Your driver speed is up X mph" or "Building the power for your next speed PR")

**Expected:** Connection card appears with gym sessions framed through a speed lens.

### Test 10: Gym-to-Speed card hidden when no gym
**Steps:**
1. Ensure user has speedProtocol active but strengthProtocol is null
2. Navigate to History tab
3. Verify no "Strength → Speed" card appears

**Expected:** Connection card only renders when both protocols are active.

### Test 11: Gym-to-Speed card navigation
**Steps:**
1. With the connection card visible
2. Tap the "Strength → Speed" card
3. Verify navigation to /stats-strength
4. Tap back
5. Verify return to History tab

**Expected:** Tapping the connection card navigates to the strength detail view.

### Test 12: Monthly Consistency Calendar renders
**Steps:**
1. Navigate to History tab
2. Scroll to the calendar section
3. Verify the current month and year are displayed as a header (e.g., "May 2026")
4. Verify a 7-column grid is rendered with day-of-week headers (S M T W T F S)
5. Verify today's cell has a ring border

**Expected:** Monthly calendar renders with correct month header and grid layout.

### Test 13: Calendar activity levels
**Steps:**
1. Ensure varied activity across the current month: some days with full activity, some partial, some none
2. Navigate to History tab
3. Verify active days show colored cells (darker = more complete)
4. Verify inactive days show gray/border-colored cells
5. Verify the summary text shows "{X} of {Y} days active"

**Expected:** Calendar cells are colored by activity level with an accurate count summary.

### Test 14: Calendar streak display
**Steps:**
1. Ensure a consecutive streak of 5 days with activity ending today
2. Navigate to History tab
3. Verify the calendar summary shows "· 5-day streak" appended to the days active text

**Expected:** Current streak count appears below the calendar when active.

### Test 15: Activity feed — speed session entry
**Steps:**
1. Ensure a speed session was logged today with driver = 112 mph
2. Navigate to History tab
3. Scroll to the "Recent Activity" section
4. Verify a "Today" date header is visible
5. Verify a speed entry shows: bolt icon, "Speed Training" label, "Driver 112 mph"

**Expected:** Speed sessions appear in the activity feed with driver mph.

### Test 16: Activity feed — speed PR badge
**Steps:**
1. Ensure the speed session from Test 15 set the current driver PR
2. Verify a green "PR" badge appears next to the driver speed in the feed entry

**Expected:** PR badge shows inline when the session set a driver PR.

### Test 17: Activity feed — strength session entry
**Steps:**
1. Ensure a strength session (Push day) was logged yesterday with volume = 15,200 lbs
2. Navigate to History tab, scroll to feed
3. Verify a "Yesterday" date header with a strength entry: dumbbell icon, "Push Day" label, "Volume: 15,200 lbs"

**Expected:** Strength sessions appear in the feed with workout day label and volume.

### Test 18: Activity feed — habit-only entry
**Steps:**
1. Ensure a day 3 days ago had 4/6 habits completed but no training session
2. Verify that day's entry shows: checkmark icon, "4/6 habits completed"

**Expected:** Days with only habit completions show a compact habit summary entry.

### Test 19: Activity feed — date grouping
**Steps:**
1. Ensure activity exists today, yesterday, and 5 days ago
2. Scroll through the feed
3. Verify date headers: "Today", "Yesterday", and a full date for the older entry (e.g., "Saturday, May 10")
4. Verify no entries appear for rest days (days between the older entry and yesterday)

**Expected:** Entries are grouped under date headers with rest days omitted.

### Test 20: Records bar at bottom
**Steps:**
1. Navigate to History tab
2. Scroll to the very bottom
3. Verify three stat items: Best Streak (number + "days"), Sessions (number), Challenges (number)

**Expected:** Compact records bar shows at the bottom with streak, session count, and challenge count.

### Test 21: Loading state
**Steps:**
1. Navigate to History tab (or trigger reload)
2. Verify a loading indicator appears briefly while data loads
3. Verify all sections render after loading completes

**Expected:** Loading spinner shows during data fetch, then content renders.

### Test 22: Detail views still accessible
**Steps:**
1. Navigate to History tab
2. Tap Speed Hero Card → verify /stats-speed loads with full analytics
3. Navigate back
4. Tap Gym-to-Speed Connection card → verify /stats-strength loads
5. Navigate back

**Expected:** Existing detail views are fully functional and accessible from the History tab.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
