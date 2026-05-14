# Test Plan: Spec 009 — Strength Detail View

## Setup

- Starting URL: Expo dev server (`npx expo start --web`)
- Preconditions: User has completed onboarding with strength protocol selected. Strength sessions exist in AsyncStorage (use Settings dev tools "Generate Data" or manually submit sessions via the Strength screen). Aggregate stats have been rebuilt via Settings "Rebuild Stats" button.
- Navigation: Stats tab > tap Strength hook card > arrives at `/stats-strength`

## Tests

### Test 1: Empty state — no strength sessions

**Steps:**
1. Clear all data via Settings dev tools
2. Navigate to Stats tab
3. Tap the Strength hook card (should show empty state)
4. Verify the stats-strength screen loads

**Expected:** Screen shows "Complete a strength workout to see your stats here" centered text. Back arrow is visible and functional. No sections are rendered.

### Test 2: Back navigation

**Steps:**
1. Navigate to `/stats-strength` via the Strength hook card
2. Tap the back arrow in the top bar

**Expected:** Returns to the Stats tab. No errors.

### Test 3: Workout frequency — partial cycle

**Steps:**
1. Submit one strength session (e.g., Legs 1)
2. Navigate to `/stats-strength`
3. Verify the Rotation Progress section

**Expected:** 4 indicators shown (L1, Pull, L2, Push). Only the completed day (L1) is filled/highlighted. Other 3 are outlined. Below shows "0 cycles completed" (one session doesn't complete a cycle).

### Test 4: Workout frequency — complete cycle

**Steps:**
1. Submit 4 strength sessions over separate days: Legs 1, Pull, Legs 2, Push (in order)
2. Navigate to `/stats-strength`
3. Verify the Rotation Progress section

**Expected:** Shows "1 cycles completed" (or "1 cycle completed"). Current cycle indicators are all empty (new cycle hasn't started). If a 5th session is submitted, it should appear as the first completed day of cycle 2.

### Test 5: Volume trend section — placeholder

**Steps:**
1. With at least 2 strength sessions logged
2. Navigate to `/stats-strength`
3. Scroll to the Session Volume section

**Expected:** If spec 008 chart library is not installed, shows placeholder text "Volume chart coming soon". If chart library is available, shows a bar chart with session volumes.

### Test 6: Per-exercise PRs — grouped display

**Steps:**
1. Submit strength sessions covering multiple workout days with varying weights
2. Rebuild stats via Settings
3. Navigate to `/stats-strength`
4. Scroll to Personal Records section

**Expected:** PRs grouped under 4 headings: "Legs 1 — Quads", "Pull — Back & Biceps", "Legs 2 — Hamstrings", "Push — Chest, Shoulders & Triceps". Each exercise shows its best weight, reps, and date.

### Test 7: Per-exercise PRs — deduplication of shared exercises

**Steps:**
1. Submit sessions for both Legs 1 and Legs 2 (both include calf-raises and tib-raises)
2. Navigate to `/stats-strength`
3. Scroll to Personal Records section
4. Check where calf-raises and tib-raises appear

**Expected:** Calf-raises and tib-raises appear only under "Legs 1 — Quads". They do NOT appear again under "Legs 2 — Hamstrings".

### Test 8: Per-exercise PRs — NEW badge

**Steps:**
1. Submit a strength session with a new PR on at least one exercise
2. Navigate to `/stats-strength` immediately after
3. Scroll to Personal Records section

**Expected:** The exercise where the PR was set shows a green "NEW" badge next to the weight. Other exercises with older PRs do not show the badge.

### Test 9: Per-exercise PRs — no PR for an exercise

**Steps:**
1. Verify an exercise exists in WORKOUT_DAYS that has never been completed with weight
2. Navigate to `/stats-strength`
3. Scroll to that exercise's row under Personal Records

**Expected:** Shows "—" in place of weight/reps. No date shown.

### Test 10: Streak display — current and best

**Steps:**
1. Submit strength sessions on consecutive days (e.g., 3 days in a row)
2. Navigate to `/stats-strength`
3. Verify the Streak section

**Expected:** Two stat boxes: "Current" shows the current streak count, "Best" shows the all-time best streak. Both are large numbers.

### Test 11: Streak milestones — visual markers

**Steps:**
1. Generate enough data to achieve at least the 7-day milestone
2. Rebuild stats
3. Navigate to `/stats-strength`
4. Verify milestone markers below the streak stats

**Expected:** 6 milestone markers (7, 14, 21, 30, 60, 90). Achieved milestones are filled/colored. Unachieved milestones are outlined. Order is left-to-right, smallest to largest.

### Test 12: Session history — list display

**Steps:**
1. With multiple sessions logged across different days and workout types
2. Navigate to `/stats-strength`
3. Scroll to Recent Sessions section

**Expected:** Sessions listed most-recent-first. Each row shows: formatted date (e.g., "Wed, May 10"), workout day label (e.g., "Push"), and total volume in lbs.

### Test 13: Session history — inline expand

**Steps:**
1. Navigate to `/stats-strength` with session data
2. Tap a session row in the Recent Sessions list
3. Verify the expanded content

**Expected:** Row expands to show each exercise from that session. Each exercise shows its name followed by set details (e.g., "Set 1: 50 lbs x 8 ✓"). Incomplete sets show as skipped. Expand is animated smoothly on native.

### Test 14: Session history — single expand at a time

**Steps:**
1. Tap a session row to expand it
2. Tap a different session row

**Expected:** The first row collapses. The second row expands. Only one row is expanded at any time.

### Test 15: Scroll and section order

**Steps:**
1. Navigate to `/stats-strength` with data in all sections
2. Scroll through the entire page

**Expected:** Sections appear in order: Rotation Progress, Session Volume, Personal Records, Streak, Recent Sessions. All sections are visible by scrolling. No horizontal overflow or layout issues.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
