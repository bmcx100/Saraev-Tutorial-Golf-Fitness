# Test Plan: Spec 016 — Build Strong Hero Card (BS6-XL)

## Setup

- Starting URL: http://localhost:8081 (Expo dev server)
- Preconditions:
  - User is logged in
  - "gym" habit is active in the user profile
  - "gym" is the next incomplete habit in today's queue (so it triggers the strength hero variant)
  - Dev date override may be used to control challenge day number
- Platform: Expo Web (primary), iOS simulator (visual verification)

## Tests

### Test 1: Card Renders with Correct Structure

**Steps:**
1. Navigate to the Today screen (root `/`)
2. Verify the Build Strong hero card is visible at the top of the content area
3. Verify the card has a barbell photo background with forest-tinted gradient overlay
4. Verify the card contains: active pill, plan caption, title "Build Strong.", streak readout, three stat tiles, progress bar, progress meta row, and two CTA buttons

**Expected:** Card renders with all 6 content sections visible in the correct vertical order. Card has rounded corners and a forest-tinted drop shadow.

### Test 2: Active Status Pill Shows Correct Day/Session

**Steps:**
1. Navigate to the Today screen
2. Locate the citron pill in the top-left of the Build Strong card
3. Verify the pill contains a dumbbell icon and text in format "DAY N · SESSION N"
4. Verify the plan caption in the top-right shows "Day N / N · N-week plan"

**Expected:** Pill shows the current day and session count derived from challenge state. Plan caption shows day progress and plan duration.

### Test 3: Title and Streak Readout

**Steps:**
1. Navigate to the Today screen
2. Verify the title reads "Build Strong." (including the period)
3. Verify the streak readout on the right shows a number followed by "d" and "STREAK" label below
4. Verify the streak number is citron-colored (#cfde50)

**Expected:** Title is large (52pt equivalent), cream-colored, with legibility text-shadow. Streak number is citron with a glow effect. "STREAK" label is in monospace font.

### Test 4: Stat Tiles Display Correctly

**Steps:**
1. Navigate to the Today screen
2. Locate the three stat tiles below the title row
3. Verify tile 1 shows "TOP LIFT" label and a value in "NNN lb" format (large citron text)
4. Verify tile 2 shows "VOLUME / WK" label and a value in "N.Nk lb" format (normal cream text)
5. Verify tile 3 shows "Δ WEEK" label and a value in "+NN lb" format (accent citron text)

**Expected:** Three tiles are evenly spaced, each with glass-style background (dark semi-transparent). Labels are uppercase, small. Values follow the big/normal/accent hierarchy from the design spec.

### Test 5: Stat Tiles Handle Null Data

**Steps:**
1. Clear all strength session data (via Settings dev tools)
2. Navigate to the Today screen
3. Verify stat tiles show graceful fallback when no data exists (e.g., "—" or "0 lb")

**Expected:** No crashes. Tiles render with placeholder values when strength data is null.

### Test 6: Progress Bar Segments

**Steps:**
1. Navigate to the Today screen with a challenge that has some sessions completed
2. Count the progress bar segments — should be exactly 12
3. Verify filled segments (count = sessions completed) are citron-colored with a glow shadow
4. Verify empty segments are semi-transparent white
5. Verify all segments are the same width (flex: 1)

**Expected:** 12 segments visible, filled count matches sessions completed, citron glow on filled only.

### Test 7: Progress Meta Row

**Steps:**
1. Navigate to the Today screen
2. Locate the meta row below the progress bar
3. Verify left text shows "{session}/{totalSessions} sessions" with the session count in citron
4. Verify center text shows "{N} days left"
5. Verify right text shows "↑ On track" in citron

**Expected:** Three text items spread across the row. Session count highlighted in citron, rest in muted cream.

### Test 8: Primary CTA Tap

**Steps:**
1. Navigate to the Today screen
2. Locate the primary citron button reading "Start session N →"
3. Verify the button has a citron background with visible glow/shadow
4. Tap the primary CTA button
5. Verify navigation to the strength training screen (`/strength`)

**Expected:** Tapping the primary CTA navigates to the strength screen. Button has distinctive citron glow shadow.

### Test 9: Secondary CTA Tap

**Steps:**
1. Navigate to the Today screen
2. Locate the "Plan" button to the right of the primary CTA
3. Verify it has a glass-style background (dark, semi-transparent)
4. Tap the "Plan" button
5. Verify navigation to `/stats-strength`

**Expected:** Tapping "Plan" navigates to the strength stats/detail screen.

### Test 10: Card Body Tap

**Steps:**
1. Navigate to the Today screen
2. Tap the card body area (not on a CTA button)
3. Verify navigation to `/stats-strength`

**Expected:** Card body tap triggers `onTap` handler, navigating to strength detail.

### Test 11: Empty State (Day 1, Session 0)

**Steps:**
1. Set up a fresh challenge with 0 sessions completed
2. Navigate to the Today screen
3. Verify pill shows "START · DAY 1"
4. Verify streak shows "0d"
5. Verify progress bar has 0 filled segments
6. Verify meta left shows "0/12 sessions"
7. Verify status text (meta right) is omitted or shows nothing
8. Verify primary CTA reads "Start session 1 →"

**Expected:** All elements reflect the fresh-start state correctly. No crashes with zero data.

### Test 12: Card Replaces UpNextHero for Strength

**Steps:**
1. Ensure gym habit is the next incomplete habit
2. Navigate to the Today screen
3. Verify the Build Strong hero card (BS6-XL) is rendered, NOT the old UpNextHero strength variant
4. Complete the gym habit so the next habit is speed-training
5. Verify the UpNextHero (speed variant) now renders instead

**Expected:** The Today screen conditionally renders BuildStrongHero when gym is up next, and UpNextHero for other habits.

### Test 13: Accessibility Labels

**Steps:**
1. Navigate to the Today screen
2. Inspect the Build Strong card's accessibility tree (via Expo Web accessibility inspector or React DevTools)
3. Verify the card body has an `accessibilityLabel` describing the program state
4. Verify decorative elements (pill, "STREAK", tile labels) are hidden from accessibility

**Expected:** Screen reader announces the card with a descriptive label. Decorative text does not create redundant announcements.

### Test 14: Tap Target Sizes

**Steps:**
1. Navigate to the Today screen
2. Inspect the primary CTA's rendered height — should be ≥ 44pt
3. Inspect the secondary CTA's rendered height — should be ≥ 44pt
4. If streak readout is tappable, verify its tappable area is ≥ 44×44pt

**Expected:** All interactive elements meet the 44pt minimum tap target.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
