# Handoff · Subpar Settings Screen

## Overview

A redesign of the Subpar app's Settings screen — a single scrollable list of collapsible topic groups. Tap a header → that section expands inline, others collapse. One section open at a time. The accordion covers five topics: Tracking, Notifications, Preferences, Account, and Dev Tools.

## About the Design Files

The files in this bundle are **design references created in HTML** — React + inline-Babel prototypes showing the intended look and behavior. They are **not** production code to copy directly. Your task is to recreate these designs in the Subpar app's existing environment (React Native / Expo, per Subpar's stack) using the established components, navigation, and theming patterns. Match the visual spec pixel-for-pixel; replace the prototype's HTML/CSS-in-JS with the codebase's idiomatic equivalents (Pressable, View, Text, native switches, etc.).

If no environment exists yet, choose the most appropriate framework for the project and implement the designs there.

## Fidelity

**High-fidelity.** Exact colors, typography, spacing, and component shapes are documented below and reflected in the screenshots. Match them precisely.

## Files in this bundle

| File | What it is |
| --- | --- |
| `Settings Screen.html` | The main prototype. Loads all dependencies and renders six artboards (one per state) on a pan/zoom canvas. Open this in a browser. |
| `settings-screen.jsx` | The `SettingsScreen({ expanded })` component + all subcomponents (sections, rows, toggles, icons). The source of truth for layout & styling. |
| `pillars-shared.jsx` | Shared color tokens (`SPColors`) used across the Subpar design system. Re-exported as `window.SPColors`. |
| `ios-frame.jsx` | The iOS device bezel used in the prototype canvas. Not part of the production screen — just for the mock. |
| `design-canvas.jsx` | The pan/zoom presentation canvas. Not production code. |
| `screenshots/` | Six PNGs, one per state (see below). |
| `CLAUDE_PROMPT.md` | A ready-to-paste prompt for Claude Code with implementation guidance. |

## States / Screenshots

| File | State | When shown |
| --- | --- | --- |
| `screenshots/01-all-collapsed.png` | Default — all sections collapsed | First visit to Settings |
| `screenshots/02-tracking-expanded.png` | Tracking expanded | Tap Tracking header |
| `screenshots/03-notifications-expanded.png` | Notifications expanded | Tap Notifications header |
| `screenshots/04-preferences-expanded.png` | Preferences expanded | Tap Preferences header |
| `screenshots/05-account-expanded.png` | Account expanded | Tap Account header |
| `screenshots/06-dev-tools-expanded.png` | Dev Tools expanded | Tap Dev Tools header (dev-only — gate behind a debug flag) |

## Layout

- **Screen frame:** 390 × 844 pt (iPhone 13/14 reference). Background is plain white (`#ffffff`).
- **Top bar:** 36-pt back arrow on the left, "Settings" title centered, 36-pt empty slot on the right (kept for symmetry). Bottom padding 6 pt below title.
- **Hint line:** "Expand a topic to edit settings", centered, 12.5 pt, weight 500, `#6b756f`. 6/14 pt top/bottom padding.
- **Section list:** vertical stack with 10-pt gaps. 14-pt horizontal page padding. 18-pt bottom padding.
- **Each section card:**
  - Border radius `14`.
  - Collapsed: `1px solid #e2dcc0` border, `#f7f4ea` (paper) background, no shadow.
  - Expanded: `1px solid #e2dcc0` border, `#ffffff` background, `box-shadow: 0 10px 22px rgba(17,55,31,0.08)`.
  - Dev Tools is the exception — its border + header glyph use `#cc6f4a` (clay) regardless of state.

## Section header (collapsed vs. expanded)

### Collapsed
- Single row, `14px 16px` padding.
- Left: label in JetBrains Mono, 11 pt, weight 800, letter-spacing `0.22em`, uppercase, color `#6b756f` (Dev Tools uses `#cc6f4a`). `white-space: nowrap`.
- Right: 15-pt "sliders" icon (three rows with toggle-dot bullets). Same color as the label.

### Expanded
- Row height ~52 pt. Padding `10px 12px 10px 10px`. `1px solid #e2dcc0` bottom border.
- **Icon tile**, left: 32 × 32, radius 9, `inset 0 1px 0 rgba(255,255,255,0.10)`.
  - Background `#11371f` (greenDeep), glyph stroked in `#cfde50` (citron), for all standard sections.
  - For Dev Tools, background `#cc6f4a` (clay), glyph stroked in `#fbf6e6` (cream).
- **Per-section glyph** (2 px stroke, round caps/joins, 16 pt):
  - **Tracking** — concentric circles (target). Outer r=9, inner r=5, center dot r=1.6 filled.
  - **Notifications** — bell + clapper.
  - **Preferences** — sun (8 spokes + center r=3 circle).
  - **Account** — head r=4 + shoulders arc.
  - **Dev Tools** — terminal window (16×18 rounded rect r=2, chevron `> ` and underscore).
- **Label**, center: same type spec as collapsed but color `#11371f` (greenDeep) or `#cc6f4a` for Dev Tools.
- **Right slot**: 15-pt sliders icon in `#6b756f`.

## Section bodies

Padding `4px 16px 14px` inside each expanded body. Rows separated by `1px solid #e2dcc0` (omit on the last row).

### Tracking
Three groups stacked: **Golf** / **Workouts** / **Lifestyle**. Each group header is a left-aligned line at 14 pt / 800 / `#0e2118` with `margin-top: 12px` and `margin-bottom: 2px`.

Each row: `10px 0` padding, `12px` gap.
- 18 × 18 line icon (line weight 1.8, stroke `#0e2118`). Specific glyphs:
  - Speed Training — lightning bolt
  - Driver — golf driver (shaft + grip)
  - Putting — putter + ball
  - Strength Training — runner
  - Cardio — heart-rate line
  - Core — seated figure
  - Meals — fork + knife
  - H2O — water drop
  - Alcohol — cocktail glass
  - Sleep — crescent moon
- Label, 14.5 pt, weight 500, `#0e2118`.
- 15-pt gear icon, color `#6b756f`.
- 18 × 18 selector circle:
  - On: background `#3aa57c`, no border, white check (3.4-pt stroke), drop-shadow `0 2px 4px rgba(58,165,124,0.30)`.
  - Off: white background, `1.5px solid #cdd0c8` border.

In the screenshot, **Speed Training** (Golf group) and **Strength Training** (Workouts group) are the ON examples.

### Notifications
- `ToggleRow` "Enable notifications" — ON.
- `KVRow` "Morning reminder" — value `08:00`.
- `KVRow` "Evening check-in" — value `20:00` (last row).

### Preferences
- `ToggleRow` "Sound effects" — ON (last row).

### Account
- A line of email text, 14.5 pt / 500 / `#0e2118`. Sample: `hurstryan1@gmail.com`. Padding `4px 0 12px`.
- `DangerBtn` "Sign Out" with the sign-out icon.

### Dev Tools
Rows top-to-bottom:
1. `DevRow` Test Confetti — party-popper line icon.
2. `DevRow` Complete All Today's Habits — two checkmarks.
3. `DevRow` Force Complete Challenge — trophy.
4. **Day stepper** — three columns: `−Day` button (left), "Today" label (center, 14.5 / 800 / ink), `+Day` button (right). Buttons use `rgba(58,165,124,0.14)` bg, `#246b4f` text, radius 10, padding `8px 14px`. `8px 0` row padding.
5. Horizontal divider — `1px` `#e2dcc0`, `2px 0` margin.
6. `DevRow` Generate 7-Day Streak — chart-line icon.
7. `DevRow` Generate 30-Day Streak — chart-line icon.
8. `DevRow` Rebuild Stats — bar chart (last row).
9. **DATA subhead** — JetBrains Mono 10.5 pt / 800 / `0.22em` tracking / uppercase / `#cc6f4a`. `12px` top / `6px` bottom margin.
10. Two `DangerBtn`s stacked with 10-pt gap: "Reset Today's Progress" (reset icon) and "Clear All Data" (trash icon).

A `DevRow` is the same shape as a tracking row but without the gear/selector slots: 18-pt icon, 12-pt gap, 14.5 / 500 / ink label, `11px 0` padding, `1px` bottom rule.

## Shared components

### `Toggle`
- Track 44 × 26, radius 99.
- On: `#3aa57c`.
- Off: `#cdd0c8`.
- Inset `0 1px 2px rgba(0,0,0,0.10)`.
- Knob 22 × 22, white, radius 99, `box-shadow: 0 2px 4px rgba(0,0,0,0.18)`, positioned 2 pt from top and from on-side edge.

### `KVRow`
- `12px 0` padding, space-between flex.
- Label: 14.5 / 500 / ink.
- Value: JetBrains Mono, 14 / 700 / ink, letter-spacing `0.04em`, `tabular-nums`.

### `DangerBtn` (Sign Out / Reset / Clear)
- Full-width.
- Background `#ffffff`, color `#cc6f4a` (clay), border `1.5px solid #cc6f4a`, radius 12, padding `11px 14px`.
- Center row with 8-pt gap: 16-pt outlined icon (clay stroke) + label in Outfit 14 / 800.

## Design tokens

```ts
// Colors (from pillars-shared.jsx — SPColors)
const ink       = '#0e2118';  // primary text
const sub       = '#6b756f';  // secondary text / muted
const forest    = '#1d4e34';  // primary accent (used in hero gradients)
const greenDeep = '#11371f';  // header icon tile background
const citron    = '#cfde50';  // header icon glyph, on-state highlight
const cream     = '#fbf6e6';  // dev tools tile glyph
const paper     = '#f7f4ea';  // collapsed section background
const rule      = '#e2dcc0';  // hairlines / borders
const clay      = '#cc6f4a';  // dev-tools accent + destructive

// Functional
const toggleOn  = '#3aa57c';
const toggleOff = '#cdd0c8';
const dayBtnBg  = 'rgba(58,165,124,0.14)';
const dayBtnFg  = '#246b4f';
```

```ts
// Typography
fontSans = 'Outfit'         // 400 / 500 / 600 / 700 / 800
fontMono = 'JetBrains Mono' // 500 / 600 / 700 / 800

// Sizes used
title         : 17 / 800 / -0.02em
hint          : 12.5 / 500
sectionLabel  : 11 / 800 / 0.22em (mono, uppercase)
groupHeader   : 14 / 800 / -0.01em
rowLabel      : 14.5 / 500 / -0.005em
kvValue       : 14 / 700 / 0.04em (mono, tabular-nums)
dangerBtn     : 14 / 800 / -0.005em
dataSubhead   : 10.5 / 800 / 0.22em (mono, uppercase)
dayStepperBtn : 13 / 700 / -0.005em
```

```ts
// Spacing & radii
sectionRadius  : 14
iconTileRadius : 9
buttonRadius   : 12
pageGutter     : 14   // horizontal page padding
sectionGap     : 10   // vertical gap between sections
rowVertical    : { tracking: 10, kv: 12, dev: 11 }
sectionBodyPad : '4px 16px 14px'
```

```ts
// Shadow
sectionOpenShadow = '0 10px 22px rgba(17,55,31,0.08)'
toggleOnShadow    = '0 2px 4px rgba(58,165,124,0.30)'
toggleKnobShadow  = '0 2px 4px rgba(0,0,0,0.18)'
```

## Interactions & behavior

- **Accordion**: tap a collapsed section header → that section expands and any other expanded section collapses. Tap an expanded section header → it collapses (no section open). No more than one section open at a time.
- **Transition**: ~180ms ease-out on height + opacity for the body; the header chrome (icon tile, color) swaps instantly. Acceptable to start with an instant swap if the runtime's animation primitives make this harder.
- **Back arrow** (top-left): navigate back one step in the navigation stack.
- **Tracking rows**:
  - Tap the gear → open that tracker's detail / config screen.
  - Tap the selector circle → toggle tracking of this metric (persist to user prefs).
  - Tap anywhere else on the row → same as the selector (toggles tracking).
- **Notifications**:
  - "Enable notifications" toggle requests system permission on first ON.
  - "Morning reminder" / "Evening check-in" rows are tappable — open a time picker; persist the result and re-render the value pill.
- **Preferences · Sound effects**: toggle plays/silences in-app SFX.
- **Account**:
  - Email line is read-only.
  - "Sign Out" — present a confirmation alert ("Are you sure?"); on confirm, sign out and reset to the auth root.
- **Dev Tools** (debug only — hide behind a build flag or feature toggle):
  - Test Confetti → fire the in-app confetti animation.
  - Complete All Today's Habits → mark today's habits done.
  - Force Complete Challenge → mark the active challenge complete.
  - − Day / + Day → shift the in-app "today" pointer.
  - Generate 7 / 30-Day Streak → backfill streak data.
  - Rebuild Stats → recompute aggregates.
  - Reset Today's Progress → clear today's logs (confirm).
  - Clear All Data → wipe local data and sign out (double-confirm, destructive).

## State management

Local UI state in this component:
- `expanded: 'none' | 'tracking' | 'notifications' | 'preferences' | 'account' | 'dev'` — which section is open.

External state needed (read from the existing app stores):
- Per-tracking-metric on/off boolean.
- Notification settings: `enabled`, `morningTime`, `eveningTime`.
- Preferences: `soundEffectsOn`.
- Current user email.
- Build flag / role check for whether Dev Tools is visible.

## Notes

- The header glyph-tile treatment is the chosen direction (treatment B from the explorations). It serves as the on/off indicator for the section _and_ doubles as a category icon.
- Don't introduce new colors. Everything maps to tokens already in `SPColors`.
- The destructive buttons intentionally use an outlined clay style instead of filled red — keeps the page calm and matches the rest of the system.
