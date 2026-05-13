# Test Plan: Spec 001 — Habit Scheduling

## Setup
- App running via `npx expo start --web` at http://localhost:8081
- User has completed onboarding with all 6 habits active
- No schedule configured (default state — all habits show daily)

## Tests

### Test 1: Default behavior — all habits show daily
**Steps:**
1. Open the app to the Today tab
2. Verify all 6 habits are listed (Speed Sticks, Driver, Push, Pull, Leg Day One, Leg Day Two)
3. Verify fitness rings render for all 6 habits

**Expected:** Without any schedule configured, all active habits appear every day (backward compatible).

---

### Test 2: Weekday picker appears in settings
**Steps:**
1. Navigate to Settings
2. Scroll to the "Schedule" section
3. Verify golf habits (Speed Sticks, Driver) show weekday picker buttons (S M T W T F S)
4. Verify all 7 day buttons are in unselected/default state

**Expected:** Each non-rotating habit has a weekday picker row. Default = all unselected = daily.

---

### Test 3: Assign habit to specific weekdays
**Steps:**
1. In Settings > Schedule, find "Speed Sticks" weekday picker
2. Tap "M" (Monday) and "W" (Wednesday) and "F" (Friday) buttons
3. Verify those 3 buttons show selected state (accent fill)
4. Navigate back to Today tab
5. If today is Mon/Wed/Fri: verify Speed Sticks appears in the habit list
6. If today is NOT Mon/Wed/Fri: verify Speed Sticks is hidden from the habit list

**Expected:** Habit only appears on its assigned weekdays. Other habits unaffected.

---

### Test 4: Weekday selection persists after app reload
**Steps:**
1. Configure Speed Sticks to Mon/Wed/Fri (per Test 3)
2. Close and reopen the app (or refresh on web)
3. Navigate to Settings > Schedule
4. Verify Speed Sticks still shows M, W, F selected

**Expected:** Schedule config survives app restart via AsyncStorage.

---

### Test 5: Category rotation toggle
**Steps:**
1. Navigate to Settings > Schedule
2. Find the "Workout" category row
3. Tap to switch from "Daily" to "Rotation"
4. Verify a cycle length stepper appears (default value = 4, matching 4 workout habits)
5. Verify a start date picker appears (default = today)
6. Verify a schedule grid appears with columns Day 1–4 and rows for Push, Pull, Leg Day One, Leg Day Two

**Expected:** Switching to Rotation mode reveals the configuration UI with sensible defaults.

---

### Test 6: Grid pre-fill and one-per-column constraint
**Steps:**
1. Set Workout to Rotation mode (per Test 5)
2. Verify the grid is pre-filled: each habit assigned to one day in library order
3. Tap a different habit's cell in Day 1 column
4. Verify the previously selected habit in Day 1 is deselected
5. Verify the newly tapped habit is now selected for Day 1

**Expected:** Grid enforces exactly one habit per day-column. Tapping auto-deselects the prior selection in that column.

---

### Test 7: Habit can repeat in rotation
**Steps:**
1. In the Workout rotation grid (4-day cycle), configure:
   - Day 1: Leg Day One
   - Day 2: Push
   - Day 3: Leg Day Two
   - Day 4: Push
2. Verify Push shows selected (filled circle) in both Day 2 and Day 4 columns
3. Verify Pull shows no selection in any column

**Expected:** A habit can appear on multiple days. Some habits can be excluded from the rotation entirely.

---

### Test 8: Rotation determines Today's habits
**Steps:**
1. Configure Workout rotation with start date = today, sequence: L1 / Push / L2 / Push
2. Navigate to Today tab
3. Verify only one workout habit appears (the one matching today = Day 1 = Leg Day One)
4. Verify golf habits still appear (not part of rotation)

**Expected:** Only the habit scheduled for today's cycle day shows. Other category habits are hidden.

---

### Test 9: Cycle day advances correctly
**Steps:**
1. Configure a 4-day rotation starting yesterday
2. Navigate to Today tab
3. Verify the Day 2 habit from the sequence is showing (since today is day 2 relative to yesterday's start)

**Expected:** Cycle day is calculated from the start date. Today = Day 2 when start date = yesterday.

---

### Test 10: "All done" only checks scheduled habits
**Steps:**
1. Configure a rotation so only Leg Day One is scheduled today
2. Configure Speed Sticks for today's weekday only
3. On Today tab, complete Leg Day One and Speed Sticks
4. Verify "all done" celebration triggers (confetti/haptic/sound)
5. Verify Pull, Push, etc. do NOT need to be completed

**Expected:** Confetti fires when all *scheduled* habits are done, not all *active* habits.

---

### Test 11: Fitness rings match scheduled habits
**Steps:**
1. Configure rotation so only 1 workout habit shows today
2. Configure golf habits as daily
3. Navigate to Today tab
4. Count the fitness rings displayed

**Expected:** Rings render only for today's scheduled habits (e.g., 3 rings if 2 golf + 1 workout scheduled).

---

### Test 12: Stats tab respects scheduling
**Steps:**
1. Configure a rotation and log habits for several days
2. Navigate to Stats tab
3. Check the weekly mini-rings for a past day
4. Verify the completion percentage only counts habits that were scheduled for that day

**Expected:** A habit not scheduled on Tuesday doesn't count as "missed" on Tuesday's stats.

---

### Test 13: Streak accounts for scheduling
**Steps:**
1. Configure rotation (4-day cycle)
2. Complete all scheduled habits for 3 consecutive days
3. Navigate to Stats tab
4. Verify streak shows 3

**Expected:** Streak counts consecutive days where all *scheduled* habits were completed, not all active.

---

### Test 14: Cycle length stepper changes grid columns
**Steps:**
1. In Workout rotation config, change cycle length from 4 to 6
2. Verify grid now shows 6 columns (Day 1–6)
3. Verify columns 5 and 6 start empty (no habit selected)
4. Change cycle length from 6 to 3
5. Verify grid shows 3 columns, sequence truncated to first 3 entries

**Expected:** Grid dynamically adjusts to cycle length. Increasing adds empty days, decreasing truncates.

---

### Test 15: Grid highlights current cycle day
**Steps:**
1. Set up a 4-day rotation with start date = today
2. Look at the grid in Settings
3. Verify Day 1 column has a subtle highlight/accent background

**Expected:** The "today" column is visually distinguished from other columns.

---

### Test 16: Switching rotation back to daily
**Steps:**
1. Set Workout to Rotation mode with a configured sequence
2. Switch Workout back to "Daily"
3. Navigate to Today tab
4. Verify all 4 workout habits appear (no rotation filtering)

**Expected:** Disabling rotation restores daily behavior for that category. Rotation config can be discarded.

---

### Test 17: Grid scrolls for long cycles
**Steps:**
1. Set cycle length to 7 or higher
2. Verify the grid is horizontally scrollable
3. Scroll to see all day columns

**Expected:** Grid scrolls smoothly when columns exceed visible width.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
