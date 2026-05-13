# Test Plan: Spec 002 — Speed Sticks Protocol Tracking

## Setup
- Starting URL: Expo dev server (phone or simulator)
- Preconditions: App onboarding complete, Speed Sticks habit active in profile, no speed protocol selected yet (`speedProtocol: null`)
- Reset: Clear AsyncStorage keys `speed-session-*` and set `speedProtocol` to `null` in profile between test runs

## Tests

### Test 1: Speed Sticks card navigates to Speed page
**Steps:**
1. Open the Today tab
2. Verify Speed Sticks row is visible
3. Tap the Speed Sticks row

**Expected:** App navigates to the Speed page (not a checkmark toggle). Speed Sticks row does NOT toggle complete.

### Test 2: Protocol picker shown on first visit
**Steps:**
1. Navigate to `/speed` with `speedProtocol: null`
2. Verify "Choose Your Protocol" title is visible
3. Verify "Super Speed Sticks L1" card is visible and tappable
4. Verify "BMC's Speedy Sticks of Quickness" card is visible with "Coming Soon" badge

**Expected:** Two protocol options displayed. BMC card is visually disabled (not tappable).

### Test 3: Selecting Super Speed L1 saves protocol and shows wizard
**Steps:**
1. On the protocol picker, tap "Super Speed Sticks L1"
2. Verify the picker disappears
3. Verify the speed input wizard is shown with "Normal Stance" as the active step

**Expected:** Protocol saved to profile. Wizard appears with step 1 active.

### Test 4: Normal Stance step has correct inputs
**Steps:**
1. On the wizard step 1 (Normal Stance)
2. Verify instruction text "Swing each 3×, log your best" is visible
3. Verify Green row with Dom and Non-Dom fields
4. Verify Blue row with Dom and Non-Dom fields
5. Verify Red row with Dom and Non-Dom fields

**Expected:** 6 input fields total (3 sticks × 2 sides). All show placeholder `--`.

### Test 5: Custom numpad appears on field tap
**Steps:**
1. On Normal Stance step, tap the Green Dom field
2. Verify the custom numpad slides up from the bottom
3. Verify numpad has digits 0-9, backspace (⌫), and tab (→) keys
4. Verify the Green Dom field has an active/highlighted border

**Expected:** Numpad visible with all expected keys. No OS keyboard appears. Tapped field is highlighted.

### Test 6: Numpad digit entry works
**Steps:**
1. Tap Green Dom field to activate numpad
2. Tap 1, then 0, then 5
3. Verify Green Dom field shows "105"
4. Tap backspace
5. Verify field shows "10"

**Expected:** Digits append to the value. Backspace removes last digit.

### Test 7: Numpad tab key advances focus
**Steps:**
1. Tap Green Dom field, enter "105"
2. Tap the tab key on numpad
3. Verify Green Non-Dom field is now active (highlighted)
4. Enter "98"
5. Tap tab again
6. Verify Blue Dom field is now active

**Expected:** Tab advances through fields in order: Green Dom → Green Non-Dom → Blue Dom → Blue Non-Dom → Red Dom → Red Non-Dom.

### Test 8: Step navigation with Next/Back
**Steps:**
1. Fill all 6 fields on Normal Stance step
2. Tap "Next"
3. Verify Step Drill is now the active step
4. Verify Normal Stance values are preserved (tap Back to check)
5. Tap Back
6. Verify Normal Stance fields still show entered values
7. Tap Next again to return to Step Drill

**Expected:** Forward/back navigation preserves all entered values across steps.

### Test 9: Max Out step has correct inputs
**Steps:**
1. Navigate to step 3 (Max Out) via Next buttons
2. Verify instruction text is visible
3. Verify Green row with a single input field
4. Verify Driver row with a single input field
5. Verify there are no Non-Dom fields

**Expected:** 2 input fields total (Green + Driver), dom-side only.

### Test 10: Submit with all fields filled
**Steps:**
1. Fill all 14 fields across 3 steps
2. On Max Out step, tap "Submit"
3. Verify app navigates back to Today tab
4. Verify Speed Sticks row shows checkmark (complete)
5. Verify Golf ring reflects Speed Sticks completion

**Expected:** Session saved. Habit marked complete. Ring updated.

### Test 11: Submit blocked with empty fields
**Steps:**
1. Fill only some fields (leave at least one empty)
2. Navigate to Max Out step, tap "Submit"
3. Verify an inline message appears indicating empty fields
4. Verify empty fields are highlighted/marked

**Expected:** Submit is blocked. User sees which fields need values.

### Test 12: Cancel with data — discard warning
**Steps:**
1. Enter at least one speed value on any step
2. Tap the back/close button to exit the speed page (back on step 1)
3. Verify a confirmation alert appears: "Discard this session?"
4. Tap "Cancel" (stay)
5. Verify form is still visible with values intact
6. Tap back again, then tap "Discard"
7. Verify app returns to Today tab without saving

**Expected:** Alert shown when canceling with data. Dismissing keeps the form. Confirming discards and navigates home.

### Test 13: Cancel without data — no warning
**Steps:**
1. Navigate to Speed page (wizard visible, no values entered)
2. Tap the back/close button

**Expected:** Navigates home immediately without a discard alert.

### Test 14: Re-entry pre-fills saved session
**Steps:**
1. Complete a speed session (submit all 14 values)
2. From Today tab, tap Speed Sticks card again
3. Verify wizard opens with all previously saved values pre-filled
4. Verify each step shows the saved values when navigated to

**Expected:** Existing session data loaded from storage and displayed in all fields.

### Test 15: Re-submit overwrites session
**Steps:**
1. Complete a session, then re-open Speed page
2. Change one value (e.g., Green Dom from 105 to 110)
3. Tap Submit
4. Re-open Speed page
5. Verify changed value persists (shows 110, not 105)

**Expected:** Only one session per day. Re-submitting overwrites.

### Test 16: Settings — protocol section visible for Speed Sticks
**Steps:**
1. Open Settings
2. Tap the gear icon on the Speed Sticks row
3. Verify "Speed Protocol" section is visible in the detail panel
4. Verify current protocol name is displayed (e.g., "Super Speed Sticks L1")

**Expected:** Protocol info shown in the habit detail modal.

### Test 17: Settings — change protocol resets to picker
**Steps:**
1. In Speed Sticks detail panel, tap "Change Protocol"
2. Close settings, navigate to Speed page
3. Verify protocol picker is shown (not the wizard)

**Expected:** Clearing protocol brings back the onboarding picker on next visit.

### Test 18: Protocol picker accessible from settings
**Steps:**
1. Set `speedProtocol` to `null` (via Change Protocol)
2. Open Settings → Speed Sticks detail panel
3. Verify "Change Protocol" or current status shows "Not set"
4. Navigate to Speed page
5. Verify picker is shown

**Expected:** Settings accurately reflects protocol state and reset works end-to-end.

### Test 19: Speed page without Speed Sticks active
**Steps:**
1. Deactivate Speed Sticks in Settings (uncheck it)
2. Verify Speed Sticks row is not visible on Today tab
3. Directly navigate to `/speed` (if possible via deep link)

**Expected:** Speed page should still function if reached directly. Completing a session should not crash (though the habit won't appear on Today since it's inactive).

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
