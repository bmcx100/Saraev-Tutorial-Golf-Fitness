# Test Plan: Spec 006 — Habit Goal Modes & Pace Tracking

## Setup

- Start the Expo dev server with `npx expo start --web`
- Starting URL: http://localhost:8084
- Preconditions: Onboarding complete, at least 3 habits active (e.g., Speed Sticks, Cardio, H2O)
- Use dev date override in Settings for pace testing

## Tests

### Test 1: Mode toggle appears in HabitDetailPanel

**Steps:**
1. Navigate to Settings (tap gear icon on Today screen)
2. Tap the gear icon next to any habit (e.g., Cardio)
3. Verify the modal shows a two-segment toggle with "Specific Days" and "Count Goal"
4. Verify "Specific Days" is selected by default
5. Verify the WeekdayPicker is visible below the toggle

**Expected:** HabitDetailPanel shows mode toggle defaulting to "Specific Days" with the existing weekday picker visible.

### Test 2: Count Goal UI appears when selected

**Steps:**
1. Open HabitDetailPanel for any habit
2. Tap "Count Goal" segment
3. Verify the WeekdayPicker disappears
4. Verify a count stepper appears showing a number (default 3) with - and + buttons
5. Verify three period pills appear: "Daily", "Weekly", "Monthly"
6. Verify "Weekly" is selected by default
7. Verify a preview line appears showing computed days (e.g., "Shows on Mon, Wed, Fri")

**Expected:** Goal configuration UI replaces weekday picker with stepper, period pills, and day preview.

### Test 3: Count stepper increments and decrements

**Steps:**
1. Open HabitDetailPanel and select "Count Goal"
2. Tap the "+" button — verify count increases to 4
3. Tap the "+" button again — verify count increases to 5
4. Verify preview text updates (e.g., "Shows on Mon, Tue, Thu, Fri, Sat" or similar for 5/week)
5. Tap the "-" button — verify count decreases to 4
6. Tap "-" repeatedly until count reaches 1 — verify it stops at 1
7. Tap "+" repeatedly until count reaches 31 — verify it stops at 31

**Expected:** Stepper clamps between 1 and 31, preview updates with each change.

### Test 4: Period selector changes day mapping

**Steps:**
1. Open HabitDetailPanel, select "Count Goal", set count to 4
2. With "Weekly" selected, note the preview days (should show Mon, Tue, Thu, Fri)
3. Tap "Monthly" — verify preview text updates to show only "Wed" (4/month ≈ 1/week, which is Wednesday in the 1-day spread)
4. Tap "Daily" — verify preview shows "Sun, Mon, Tue, Wed, Thu, Fri, Sat" (all 7 days)
5. Tap "Weekly" again — verify preview returns to 4-day spread (Mon, Tue, Thu, Fri)

**Expected:** Period changes recalculate the frequency and update the preview accordingly.

### Test 5: Goal mode changes habit visibility on Today

**Steps:**
1. Open HabitDetailPanel for Cardio
2. Select "Count Goal", set count to 2, period to "Weekly"
3. Close the modal
4. Go back to Today screen
5. Note computed days for 2/week are Mon and Thu
6. Use dev date override to set date to a Monday — verify Cardio appears
7. Set date to a Tuesday — verify Cardio does NOT appear
8. Set date to a Thursday — verify Cardio appears
9. Set date to a Saturday — verify Cardio does NOT appear

**Expected:** Goal-based habit only appears on the computed frequency days.

### Test 6: Switching back to Specific Days restores weekday picker

**Steps:**
1. Open HabitDetailPanel for a habit in goal mode
2. Verify "Count Goal" is selected and goal UI is shown
3. Tap "Specific Days"
4. Verify the WeekdayPicker reappears
5. Verify goal configuration UI (stepper, period pills) is hidden
6. Close modal, go to Today screen
7. Verify the habit now follows weekday-based scheduling (default = every day)

**Expected:** Mode switch clears goal config and returns to manual weekday scheduling.

### Test 7: Pace indicator — ahead of pace (green)

**Steps:**
1. Set Cardio to goal mode: 3x/week
2. Use dev date override to set to Monday
3. Log Cardio on Monday (tap to complete on Today)
4. Set date to Tuesday — Cardio won't show, but that's fine
5. Set date to Wednesday (a goal day) — log Cardio
6. Verify Cardio row shows a green dot with "Ahead!" text (2 completions, expected ~1.3 by Wed)

**Expected:** Green pace indicator appears when user is ahead of calculated expected pace.

### Test 8: Pace indicator — behind pace (yellow)

**Steps:**
1. Set H2O to goal mode: 5x/week
2. Use dev date override to set to Thursday
3. Do NOT log H2O at all for Mon-Thu (0 completions, expected ~2.9 by Thu)
4. Verify H2O row on Thursday shows a yellow "Behind" indicator (0/2.9 < 75%? Actually 0 is far-behind)

**Expected:** Yellow or red pace indicator appears when user has fewer completions than expected.

### Test 9: Pace indicator — far behind (red)

**Steps:**
1. Set a habit to goal mode: 6x/week
2. Use dev date override to set to Friday (day 5 of 7)
3. Ensure 0 completions logged this week
4. Verify the habit row shows a red dot with "Behind!" text

**Expected:** Red indicator with exclamation appears when ratio is below 75%.

### Test 10: Celebration toast on app open

**Steps:**
1. Set Cardio to 2x/week goal
2. Use dev date override — generate streak data so Cardio has 2+ completions by mid-week (>125% pace)
3. Navigate away from Today screen (e.g., to Challenges tab)
4. Navigate back to Today screen
5. Verify a green toast slides down from the top with a message like "You're crushing Cardio! Keep it up!"
6. Verify toast auto-dismisses after ~3 seconds

**Expected:** Celebration toast appears once when user is significantly ahead of pace.

### Test 11: Warning toast on app open

**Steps:**
1. Set a habit to 5x/week goal
2. Use dev date override to set to Saturday with 0 completions this week
3. Navigate to a different tab and back to Today
4. Verify a red toast slides down with a message like "[Habit] needs attention. Time to get after it!"
5. Tap the toast — verify it dismisses immediately

**Expected:** Warning toast appears for far-behind habits, dismissible by tap.

### Test 12: Toast only shows once per day

**Steps:**
1. Trigger a celebration or warning toast (from test 10 or 11)
2. Navigate away from Today and back again
3. Verify the toast does NOT appear a second time
4. Change dev date to the next day
5. Navigate away and back to Today
6. Verify the toast DOES appear again (new day, new check)

**Expected:** Toast is deduplicated per calendar day via AsyncStorage flag.

### Test 13: Existing weekday habits unaffected

**Steps:**
1. Set Speed Sticks to specific weekdays: Mon, Wed, Fri (using weekday picker)
2. Verify mode toggle shows "Specific Days" selected
3. Use dev date override to Tuesday — verify Speed Sticks does NOT appear
4. Set to Wednesday — verify Speed Sticks DOES appear
5. Verify no pace indicator appears on Speed Sticks row

**Expected:** Weekday-mode habits continue to work exactly as before with no pace UI.

### Test 14: On-track at start of period (no indicator)

**Steps:**
1. Set a habit to 3x/week goal
2. Use dev date override to Monday (start of week)
3. With 0 completions (expected < 1 on Monday)
4. Verify the habit row shows NO pace indicator (on-track)

**Expected:** No pace indicator appears when it's too early in the period to judge.

### Test 15: Backward compatibility — no crash on old profile

**Steps:**
1. In Settings dev tools, clear all data
2. Complete onboarding again
3. Go to Settings, tap gear on a habit
4. Verify modal opens without crash
5. Verify mode toggle shows "Specific Days" by default
6. Verify weekday picker works normally

**Expected:** App handles missing `habitModes` and `habitGoals` gracefully, defaulting to weekday mode.

## Test Mutations Log

<!-- Updated by implement skill if tests need adjustment -->
