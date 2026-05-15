# Test Plan: Spec 015 — Speed Training Pillar Redesign

## Setup

- Start dev server: `npx expo start --web` (test on web, verify key behaviors on iOS simulator)
- Preconditions: User profile has `speedProtocol: 'superspeed-l1'` set (skip protocol picker)
- For protocol picker tests: clear `speedProtocol` from profile via Settings > Speed Training > Change Protocol
- No existing session for today (clear via Settings > Dev Tools > Clear All Data if needed)

## Tests

### Test 1: Forest Hero renders correctly

**Steps:**
1. Navigate to `/speed`
2. Verify hero section has dark green gradient background with rounded bottom corners
3. Verify "Get Long" eyebrow text appears in citron/yellow-green color
4. Verify "Speed Training." title appears in cream/white color
5. Verify back button (chevron) is visible in top-left
6. Verify three tabs appear: "Normal", "Step Drill", "Max Out"
7. Verify "Normal" tab is active (citron background) by default

**Expected:** Hero renders with forest gradient, correct typography, 3 tabs with Normal active.

### Test 2: Tab navigation is freely tappable

**Steps:**
1. Navigate to `/speed`
2. Tap "Step Drill" tab
3. Verify section heading changes to "Step Drill." and pillars remain (3 sticks)
4. Tap "Max Out" tab
5. Verify section heading changes to "Max Out." and layout changes to 2 pillars
6. Tap "Normal" tab
7. Verify returns to Normal Stance with 3 pillars

**Expected:** All tabs respond to taps immediately. No sequential enforcement. Layout updates per drill.

### Test 3: Normal Stance — 3 pillars with DOM + NON-DOM cells

**Steps:**
1. Navigate to `/speed` (Normal tab active)
2. Verify 3 vertical pillars are visible: Green, Blue, Red
3. Verify Green pillar is active (colored cap, white shaft, colored grip band)
4. Verify Blue and Red pillars are muted (dimmed, paper-toned)
5. Verify each pillar has 2 cells labeled "DOM" and "NON-DOM"
6. Verify section heading shows "Normal Stance." with eyebrow "DRILL · 1 OF 3"
7. Verify progress counter shows "0 / 6 SWINGS"

**Expected:** Three pillars render with correct active/muted states. Six input cells total.

### Test 4: Max Out — 2 pillars with single SPEED cell

**Steps:**
1. Navigate to `/speed`, tap "Max Out" tab
2. Verify 2 pillars: "Green Stick" and "Driver"
3. Verify each pillar has a single cell labeled "SPEED"
4. Verify Driver pillar has a distinct cap (white pill with driver silhouette, not a colored circle)
5. Verify section heading shows "Max Out." with helper "Green stick + driver · swing 3× max · best wins"
6. Verify progress counter shows "0 / 2 READINGS"

**Expected:** Two wider pillars with single SPEED cells. Driver has unique cap treatment.

### Test 5: Custom keypad input

**Steps:**
1. Navigate to `/speed`, tap Green DOM cell
2. Verify cell shows focused state (solid border, tinted background)
3. Tap "1" on the keypad
4. Verify "1" appears in the focused cell
5. Tap "1" then "7"
6. Verify cell shows "117"
7. Verify CTA label updates to "Log 117 mph →"

**Expected:** Keypad digits append to focused cell. CTA reflects current value. Max 3 digits.

### Test 6: NEXT key advances focus

**Steps:**
1. Navigate to `/speed`, tap Green DOM cell, type "110"
2. Tap NEXT key on keypad
3. Verify focus moves to Green NON-DOM cell
4. Tap NEXT again (without typing)
5. Verify focus moves to Blue DOM cell (empty, skipped)
6. Continue tapping NEXT through all 6 cells

**Expected:** Focus advances through fields in order: Green DOM → Green NON-DOM → Blue DOM → Blue NON-DOM → Red DOM → Red NON-DOM.

### Test 7: Delete key behavior

**Steps:**
1. Navigate to `/speed`, tap Green DOM cell, type "117"
2. Tap delete key once
3. Verify cell shows "11" (last digit removed)
4. Tap delete twice more
5. Verify cell shows "——" placeholder (empty)

**Expected:** Delete removes last digit. Empty cell shows placeholder.

### Test 8: Auto-advance after 3 digits

**Steps:**
1. Navigate to `/speed`, tap Green DOM cell
2. Type "1", "1", "7" (3 digits)
3. Verify focus automatically advances to Green NON-DOM cell

**Expected:** After 3rd digit entered, focus moves to next cell without tapping NEXT.

### Test 9: Cell tap changes focus

**Steps:**
1. Navigate to `/speed`, focus is on Green DOM
2. Tap Blue DOM cell directly
3. Verify Blue pillar becomes active (colored cap, white shaft)
4. Verify Green pillar becomes muted
5. Verify Blue DOM cell is focused

**Expected:** Tapping any cell activates its pillar and focuses the cell.

### Test 10: CTA submit on Max Out — validates all fields

**Steps:**
1. Navigate to `/speed`
2. Fill only Normal Stance Green DOM with "110"
3. Tap "Max Out" tab
4. Type "127" in Green Stick SPEED cell
5. Tap "Submit 127 mph ✓" CTA
6. Verify error state appears — empty fields highlighted
7. Verify submission does NOT occur (still on speed screen)

**Expected:** Submit requires all 14 fields filled. Highlights empties.

### Test 11: Full session submit

**Steps:**
1. Navigate to `/speed`
2. Fill all 6 Normal Stance fields (type 3 digits in each, NEXT advances)
3. Switch to Step Drill tab, fill all 6 fields
4. Switch to Max Out tab, fill both fields
5. Tap "Submit {value} mph ✓"
6. Verify navigation returns to home screen
7. Verify Speed Training habit shows as completed (ring filled)

**Expected:** Complete session saves to AsyncStorage and marks habit done.

### Test 12: Discard modal on back-press with data

**Steps:**
1. Navigate to `/speed`
2. Type "100" in Green DOM
3. Tap the back button in the hero
4. Verify discard modal appears: "Discard this session?"
5. Verify modal uses Subpar v3 styling (paper background, forest/citron buttons)
6. Tap "Cancel"
7. Verify modal closes, data preserved
8. Tap back button again
9. Tap "Discard"
10. Verify returns to home screen

**Expected:** Discard modal appears when backing out with data. Cancel preserves data. Discard returns home.

### Test 13: Session reload on re-entry

**Steps:**
1. Complete a full session (all 14 fields) and submit
2. Navigate to `/speed` again
3. Verify all previously entered values are pre-filled
4. Verify can edit and re-submit

**Expected:** Today's saved session loads on re-entry.

### Test 14: Protocol picker still works

**Steps:**
1. Clear speedProtocol (Settings > Speed Training > Change Protocol, or clear profile)
2. Navigate to `/speed`
3. Verify protocol picker appears with "Super Speed Sticks L1" and "BMC" (disabled)
4. Tap "Super Speed Sticks L1"
5. Verify transitions to the speed input screen with pillar design

**Expected:** Protocol picker functions as before, restyled with Subpar v3.

### Test 15: Hero session number and PR display

**Steps:**
1. Clear all speed data (Settings > Dev Tools)
2. Navigate to `/speed`
3. Verify hero shows "SESSION 1" (first session)
4. Verify PR area shows no value (or "—") since no sessions exist
5. Complete a session with driver value of 127
6. Navigate to `/speed` again
7. Verify hero shows "SESSION 2" and PR shows "127"

**Expected:** Session number increments. PR reflects saved SpeedStats.

### Test 16: Decorative swing dots render

**Steps:**
1. Navigate to `/speed`
2. Verify each pillar has a small pill with 3 dots at the bottom edge
3. Verify dots are static (don't change when entering values)

**Expected:** Swing dots are decorative, static, positioned at pillar bottom edge.

### Test 17: Accessibility — tap targets and labels

**Steps:**
1. Navigate to `/speed`
2. Verify all keypad keys, cells, tabs, back button, and CTA are at least 44×44pt
3. Enable screen reader (VoiceOver/TalkBack)
4. Verify each pillar is announced as a group (e.g., "Green training stick")
5. Verify focused cell announces state ("Editing Green dominant hand")

**Expected:** All interactive elements meet 44pt minimum. Screen reader provides meaningful descriptions.

## Test Mutations Log
<!-- Updated by implement skill if tests need adjustment -->
