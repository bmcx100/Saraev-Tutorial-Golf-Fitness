# Handoff: Subpar Onboarding Flow

## Overview
A 3-step first-run onboarding sequence for Subpar (golf-fitness app), built in
the v3b design system. The flow:

1. **How Subpar works** — orientation screen with the four things a user does in the app
2. **Build your game plan** — sectioned, multi-select picker (Golf · Workouts · Lifestyle) for what to track
3. **Take a challenge** — pick one of two month-one challenges (Get Long / Get Strong)

The user lands on this flow after sign-in and exits into the Today screen.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive
prototypes that show the intended look and behavior. They are **not production
code** to copy verbatim.

Your job is to **recreate these screens in the target codebase's existing
environment** (React Native, SwiftUI, Flutter — whatever Subpar ships in),
following its established patterns, component library, and design tokens.
The HTML/JSX in this bundle exists so you can read exact values (colors,
radii, type sizes, spacing, copy) and see the layout rendered, not to be
copy-pasted.

If no environment exists yet for Subpar, pick the framework that best fits
the rest of the product and implement there.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy, and interaction
states are all locked in. Recreate pixel-perfectly using the codebase's
existing tokens and components — match the prototype exactly on
**390 × 844 pt** (iPhone 14-class device).

If the prototype's values disagree with the existing Subpar v3b design
system, the design system wins. The values listed in this README all come
from the v3b system.

---

## Screens / Views

**Quick visual reference** — rendered at exact device dimensions (390 × 844):

| # | Screen / state | File |
|---|---|---|
| 01 | Welcome — How Subpar Works | `screenshots/01-welcome.png` |
| 02a | Build plan — empty (CTA disabled) | `screenshots/02-plan-empty.png` |
| 02b | Build plan — 2 selected | `screenshots/03-plan-partial.png` |
| 02c | Build plan — most selected | `screenshots/04-plan-full.png` |
| 03a | Challenge — empty (CTA disabled) | `screenshots/05-challenge-empty.png` |
| 03b | Challenge — Get Long picked | `screenshots/06-challenge-getlong.png` |
| 03c | Challenge — Get Strong picked | `screenshots/07-challenge-getstrong.png` |

All three screens share a common chrome:
- **iOS status bar** at the top (default — handled by the OS, not part of the design)
- **Top bar**: `STEP NN / 03` mono counter (left) · `Skip ↗` link (right) · 22px h-padding · 54px t-padding (under status bar)
- **Hero block**: eyebrow + display title + subtitle, 22px h-padding
- **Content scroll area**: the body of each screen
- **Bottom bar** (absolute, full-width, padding 14px 22px 32px):
  - Page dots (3 dots: past = sage `#92cba2`, current = forest `#1d4e34` 22px wide pill, future = rule `#e2dcc0`)
  - CTA button (citron pill, full-width, 16px radius)
  - Sits on a paper→transparent gradient fade so content scrolls behind it

### Screen 01 — How Subpar Works

**Purpose**: Set expectations for the four things the user will do in the app.

**Layout** (top → bottom inside the phone frame):
1. Status bar (system)
2. Top bar (STEP 01 / 03 · Skip ↗)
3. Hero (padding `22px 22px 4px`):
   - Row: brand mark (44px concentric ring · see Assets) + 2-line mono label (`SUBPAR · v3` / `WELCOME`)
   - Display title: "How Subpar / works**.**" — 46px / 800 / -0.045em / 0.94 line-height / color `#11371f` (greenDeep); the trailing period is `#cfde50` (citron)
   - Subtitle: "Four things you do. The app does the rest." — 14px / 500 / `#5d6e64` (sub)
4. Step cards (padding `20px 18px 0`, vertical `gap: 10`):
   - 4 cards stacked. Each card:
     - 16px padding, white background, 1px `#e2dcc0` border, 18px radius
     - Row layout, 14px gap, items align-start
     - **Numbered icon tile** (44 × 44, 14px radius, `#dde9d4` sage bg, forest icon, 18px svg):
       - The tile has a **mono number badge** floating top-right (-6 / -6 offset): forest bg, citron text, 99px radius, 9px / 800 mono, padding `2px 5px`
     - Body column:
       - Title: 15.5px / 800 / -0.018em / 1.15 line-height / `#11371f`
       - Description: 12.5px / 500 / 1.4 line-height / `#5d6e64`, 4px margin-top
5. Topo line background overlay across the whole screen (`#cfd9c8` / opacity 0.5) — see Assets
6. Bottom bar — CTA label `Continue` (always enabled)

**Step content** (in order):
- `01` · bolt icon · **Set up your game plan.** — "Pick what to track — speed, strength, cardio. Tune it any time."
- `02` · flag icon · **Take on a challenge.** — "Monthly goals push you to build the habit, not just the workout."
- `03` · bars icon · **Track progress.** — "Streaks, charts, training history. The round of your life."
- `04` · check icon · **Stay on track.** — "Gentle reminders, never push notifications about steaks."

### Screen 02 — Build Your Game Plan

**Purpose**: Multi-select picker for which categories the user wants to track.
The user can pick zero-to-many items. CTA is disabled until at least one item is selected.

**Layout**:
1. Status bar
2. Top bar (STEP 02 / 03)
3. Hero (padding `14px 22px 0`):
   - Eyebrow: `YOUR PROGRAM` — 9.5px / 800 / 0.22em / forest mono
   - Display title: "Build your / game plan**.**" — 38px / 800 / -0.04em / 0.95 / greenDeep, citron period
   - Footer row (8px margin-top), 13.5px / 500:
     - Left: "You can change these in Settings." (`#5d6e64`)
     - Right: `Select all ↗` mono link (toggles to `Clear all ↗` when everything selected) — forest 11px / 700
4. Plan sections (padding `18px 18px 200px`, vertical `gap: 18`):
   - Three sections in this order: **Golf · Workouts · Lifestyle**
   - Each section:
     - Section header row (4px h-pad, 8px b-pad):
       - Left: mono eyebrow with the section name (capitalized once, all-caps via CSS) — `#6b756f`
       - Right: live counter `2/3` etc. — 9.5px / 600 mono, op 0.7
     - Item rows (`gap: 8`):
       - **Unselected row**: 12px / 14px padding, white bg, 1.5px `#e2dcc0` border, 16px radius
       - **Selected row**: same dimensions, but cream bg `#fbf6e6`, 1.5px forest border, `box-shadow: 0 8px 18px rgba(29,78,52,0.10)`, smooth `transition: all .15s`
       - Row contents (flex / 12px gap / align-center):
         - 40 × 40 tile (12px radius, see "Plan item tile colors" below), 17px icon
         - Body column:
           - Name: 14.5px / 800 / -0.015em / `#11371f`
           - Meta: 10.5px / 600 mono, 0.02em ls, muted — e.g. `1 session · binary`
         - Radio (24 × 24, 99px radius, see "Radio" below)
5. Bottom bar — CTA label `Next`. **Disabled** when no items selected (muted parchment `#e6e1d3`, no arrow, color `#a4a39a`, no shadow, `cursor: not-allowed`).

**Plan items** (id · name · meta · tile bg · tile fg · icon):
- Golf
  - `speed` · Speed Training · `1 session · binary` · `#dde9d4` · forest · bolt
  - `driver` · Driver · `1 session · binary` · `#bcdfc6` · forest · flag
  - `putt` · Putting · `2 sessions · accuracy` · `#bcdfc6` · forest · tee
- Workouts
  - `strength` · Strength Training · `1 session · binary` · `#f1d9cc` · `#cc6f4a` clay · dumbbell
  - `cardio` · Cardio · `1 session · binary` · `#f3eccd` · `#a37a1f` · trend
  - `core` · Core · `1 session · binary` · `#dbe6f0` · `#3a6688` · spark
- Lifestyle
  - `meals` · Meals · `3× daily · log` · `#e7d8f0` · `#6b4288` · check
  - `sleep` · Sleep · `Nightly · 7h target` · `#dbe6f0` · `#3a6688` · spark

**Radio component** (24 × 24, 99px radius):
- Unchecked: `#fff` bg, 1.5px `#cfc9b5` border
- Checked: forest bg, forest border, `box-shadow: 0 0 0 4px rgba(29,78,52,0.10)`, citron check svg (13px, stroke 3)

### Screen 03 — Take a Challenge

**Purpose**: Single-select between two challenges. CTA locked until one is picked.
Picking one **dims and desaturates the other** so the choice feels deliberate.

**Layout**:
1. Status bar
2. Top bar (STEP 03 / 03)
3. Hero (padding `14px 22px 0`):
   - Eyebrow: `MONTH ONE · DAY ZERO` — forest mono
   - Display title: "Take a / challenge**.**" — 38px / 800 / -0.04em / 0.95 / greenDeep, citron period
   - Subtitle: "Pick one to kick off your first month. Swap any time." — 13.5px / 500 / `#5d6e64`
4. Challenge cards (padding `18px 18px 0`, vertical `gap: 14`):
   - Two cards in order: Get Long, Get Strong
   - Each card: 22px radius, overflow hidden, `padding: 18px 18px 20px`, linear-gradient bg `160deg, bg → bgDeep`
   - **Topo line svg overlay** (opacity 0.22, accent-colored, see Assets)
   - **Top row** (flex space-between, align-flex-start):
     - Tag pill: accent bg, deep-bg text, 4×10px padding, 99px radius, 10px / 800 mono, 0.14em ls, includes icon
     - **Selector circle** (26 × 26, 99px radius):
       - Unselected: `rgba(255,255,255,0.08)` bg, 1.5px `rgba(251,246,230,0.35)` border
       - Selected: accent bg, accent border, `box-shadow: 0 0 0 5px {accent}26`, deep-bg check (14px, stroke 3)
   - **Title block** (14px margin-top): 36px / 800 / -0.03em / 0.96 line-height; trailing period is the accent color
   - Subtitle: 13px / 500 / `rgba(251,246,230,0.78)`
   - **Metric strip** (16px margin-top, flex / gap 8):
     - Two pills, `rgba(255,255,255,0.08)` bg, 12px radius, 8/12px padding:
       - Pill 1 (flex 1): `GOAL` eyebrow (9.5px mono, op 0.7, 0.16em ls) · metric in 16px / 800 accent, tabular-nums
       - Pill 2 (flex 1.4): `SESSIONS` eyebrow · meta text in 13px / 700 cream
   - **Segmented preview** (14px margin-top): 12 cells, 6px tall, 3px radius, 3px gap, all `rgba(255,255,255,0.18)`
   - **Card shadow**:
     - Default: `0 10px 22px rgba(17,55,31,0.18)`
     - Selected: `0 16px 32px rgba(17,55,31,0.30), 0 0 0 2.5px {accent}` (ring)
   - **Dim state** (other card when one is selected): `opacity: 0.62`, `filter: saturate(0.7)`, `transition: all .18s`
5. Tertiary link (padding `14px 22px 0`, centered): `See all 6 challenges ↗` — 11px / 700 forest mono
6. Bottom bar — CTA label `Start training`. **Disabled** until a challenge is picked.

**Challenge content**:
- **Get Long** (id `getlong`)
  - bg `#1d4e34` forest → bgDeep `#11371f` greenDeep, accent `#cfde50` citron, fg `#fbf6e6` cream
  - Tag `POPULAR` · bolt icon
  - Subtitle: "Build swing speed"
  - Goal `+4 MPH` · Sessions `12 speed-training sessions · 30 days`
- **Get Strong** (id `getstrong`)
  - bg `#3a221a` → bgDeep `#22120c`, accent `#ff8d52` orange, fg `#fbf6e6`
  - Tag `NEW` · dumbbell icon
  - Subtitle: "Resistance + injury prevention"
  - Goal `+8 LB` · Sessions `12 gym sessions · 30 days`

---

## Interactions & Behavior

### Navigation
- **Skip** (top right, every screen): exits the onboarding flow entirely. Confirm with a destructive sheet if you want, but the design treats Skip as a quiet escape hatch.
- **Continue / Next / Start training** (CTA): advances to the next step. From screen 03, completes onboarding and routes to the Today screen.
- **Page dots** (bottom): purely decorative; not tap targets.
- **Step counter** (`STEP NN / 03`, top): purely decorative; not interactive.
- **iOS back gesture / chevron**: returns to the previous step. Going back **preserves** selections.

### Selection behavior
- **Screen 02** is multi-select. Tapping a row toggles its selection.
  - `Select all` link toggles every item; flips to `Clear all` when all are selected (or all but one — see prototype).
  - Section counters (`2/3`) update live as items are selected.
  - CTA enables on first selection; disables again at zero.
- **Screen 03** is single-select (radio behavior).
  - Tapping the same card again leaves it selected (does not unselect).
  - The non-selected card dims to `opacity 0.62` + `saturate 0.7`.
  - CTA enables on selection.

### Transitions
- Step-to-step: horizontal slide (240ms, ease-out). Forward = right-to-left, back = left-to-right.
- Card selected state changes: `transition: all .15s` on plan rows, `.18s` on challenge cards.
- CTA enable/disable: cross-fade colors, 200ms.
- Page dot active indicator: width and color animate over 200ms.

### Loading states
- After tapping the final CTA on screen 03, show a brief loading spinner inside the CTA (replace label with a 20px ring) while the program is provisioned, then route to Today.
- No skeletons needed on these screens — content is static.

### Error states
- Server failure on final commit: snackbar at the bottom, clay color `#cc6f4a`, "Couldn't save your plan. Retry." with retry button. Selections persist.

### Responsive
- These designs target iPhone (390 × 844). For larger phones, content stays at max-width 430px centered; the bottom-bar gradient fade hugs the bottom safe-area inset.
- For tablets / web, content widths to 480px max, centered; everything else stays the same.

---

## State Management

```ts
type OnboardingState = {
  step: 1 | 2 | 3;                         // current screen
  selectedTracks: Set<TrackId>;            // screen 02 selections
  selectedChallenge: ChallengeId | null;   // screen 03 selection
};

type TrackId =
  | 'speed' | 'driver' | 'putt'
  | 'strength' | 'cardio' | 'core'
  | 'meals' | 'sleep';

type ChallengeId = 'getlong' | 'getstrong';
```

**Transitions**:
- Tap track row → toggle `selectedTracks`
- Tap `Select all` → fill `selectedTracks` with every TrackId; if already full, clear it
- Tap challenge card → set `selectedChallenge = id`
- CTA disabled when `step === 2 && selectedTracks.size === 0`
- CTA disabled when `step === 3 && selectedChallenge === null`

**Data fetching**:
- On final CTA: POST `{ tracks: [...], challenge: ... }` to `/api/onboarding/complete`. On 200, route to Today.

---

## Design Tokens

### Colors

| Token | Hex | Use |
|---|---|---|
| `forest` (G3) | `#1d4e34` | Selected borders, primary dark, brand mark stroke, mono eyebrow accent |
| `greenDeep` (G2) | `#11371f` | Display headlines, citron-button text |
| `grass` | `#2f7a4d` | Reserved (not used in onboarding) |
| `g7` | `#6db483` | Topo line accents on dark surfaces |
| `g8` | `#92cba2` | Past page dot |
| `g9` | `#bcdfc6` | Plan tile bg (driver, putt) |
| `sage` | `#dde9d4` | Plan tile bg (speed), step icon tile bg |
| `g10` | `#e1eee4` | Reserved |
| `citron` (Y5) | `#cfde50` | Single accent — CTA bg, terminal period, radio check, selected ring on Get Long |
| `cream` | `#fbf6e6` | Selected row bg, dark-surface text, CTA text on forest |
| `paper` | `#f7f4ea` | Page bg |
| `rule` | `#e2dcc0` | Borders on unselected rows / step cards |
| `clay` | `#cc6f4a` | Strength tile fg |
| `flax` | `#e6c772` | Reserved |
| `ink` | `#0e2118` | Body text |
| `sub` | `#5d6e64` | Subtitles |
| `muted` | `#6b756f` | Mono eyebrows, secondary text |
| Strength card bg | `#3a221a` → `#22120c` | Get Strong gradient |
| Strength accent | `#ff8d52` | Get Strong accent |
| Disabled CTA bg | `#e6e1d3` | Muted parchment |
| Disabled CTA fg | `#a4a39a` | Muted text |

### Typography
- **Outfit** (Google Fonts) — weights 400, 500, 600, 700, 800. Display + body.
- **JetBrains Mono** (Google Fonts) — weights 500, 600, 700, 800. Eyebrows, counters, metadata, metrics labels.

Type scale used in onboarding:
- Display (welcome): 46 / 800 / -0.045em / 0.94
- Display (plan / challenge): 38 / 800 / -0.04em / 0.95
- Challenge card title: 36 / 800 / -0.03em / 0.96
- Step card title: 15.5 / 800 / -0.018em / 1.15
- Plan row name: 14.5 / 800 / -0.015em / 1.1
- CTA: 15 / 800 / -0.005em
- Body / subtitle: 13-14 / 500
- Metric value (mono): 16 / 800 / tabular-nums
- Mono eyebrow: 10.5 / 800 / 0.22em / uppercase
- Mono meta on plan row: 10.5 / 600 / 0.02em

### Spacing & radii
- Page horizontal padding: **22px** (hero) · **18px** (lists)
- Top inset from status bar to STEP counter: **54px**
- Bottom safe-area padding for the bottom bar: **32px**
- Inter-row gap on plan rows: **8px**
- Inter-section gap on plan list: **18px**
- Inter-step-card gap: **10px**
- Challenge card vertical gap: **14px**
- Radii: step card **18**, plan row **16**, challenge card **22**, icon tile **12-14**, radio **99**, CTA **16**

### Shadows
- Selected plan row: `0 8px 18px rgba(29,78,52,0.10)`
- Challenge card default: `0 10px 22px rgba(17,55,31,0.18)`
- Challenge card selected: `0 16px 32px rgba(17,55,31,0.30), 0 0 0 2.5px <accent>`
- CTA: `0 10px 22px rgba(207,222,80,0.30), inset 0 1px 0 rgba(255,255,255,0.4)`

---

## Assets

All assets are inline SVGs in `icons.jsx` and embedded in `onboarding-screens.jsx`. No external image files are required.

### Icons (from `icons.jsx`, all stroke or fill `currentColor`)
- `bolt` — used in: Speed Training tile, Get Long tag
- `flag` — Driver tile, step 02 number tile
- `tee` — Putting tile
- `dumbbell` — Strength Training tile, Get Strong tag
- `trend` — Cardio tile
- `spark` — Core / Sleep tiles
- `bars` — step 03 number tile (Track progress)
- `check` — step 04 number tile (Stay on track), Meals tile

### Brand mark (concentric ring)
Defined inline in `onboarding-screens.jsx` as `BrandMark`. It's three concentric circles:
- Outermost: 2px stroke, faint track color, with a partial dash (~32%) in stroke color, rotated -78°
- Middle: 2px stroke, faint track
- Inner: solid citron disc with a small forest "flag" overlay (pole + triangle)

Replace it with your real brand mark component if Subpar has one shipped in the codebase.

### Topo line SVGs
Background contour-line decoration. Two recipes:
- **Light bg** (welcome screen): color `#cfd9c8`, opacity 0.5
- **Dark surfaces** (challenge cards): citron / orange, opacity 0.22

Implemented inline in `onboarding-screens.jsx` as `TopoLines`. Match the curves verbatim from the prototype — they're hand-tuned to feel natural.

### Fonts
Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet"/>
```

---

## Files

In this handoff bundle:

| File | What it contains |
|---|---|
| `Onboarding Screens.html` | The full canvas — open this in a browser to see all 7 artboards side-by-side. Useful for the developer to A/B against their implementation. |
| `onboarding-screens.jsx` | All three screens (`OnbWelcome`, `OnbPlan`, `OnbChallenge`) plus shared chrome (`TopBar`, `BottomBar`, `PageDots`, `CTAButton`, `Radio`, `BrandMark`, `TopoLines`) and the data tables (`STEPS`, `PLAN_SECTIONS`, `CHALLENGES`). |
| `icons.jsx` | Inline SVG icon set used across the system. |
| `ios-frame.jsx` | iPhone bezel + status bar — only used to render the prototype inside a device frame. Not relevant to production. |
| `design-canvas.jsx` | The Figma-style canvas wrapper — also not relevant to production. |
| `screenshots/*.png` | Static PNG renders of each artboard at native 390×844 — quick reference without opening the HTML. |

When in doubt, read `onboarding-screens.jsx` — it's the source of truth for every measurement, color, and copy string in this design.
