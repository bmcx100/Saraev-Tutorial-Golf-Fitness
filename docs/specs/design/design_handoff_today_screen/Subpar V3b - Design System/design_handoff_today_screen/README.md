# Handoff: Today Screen Redesign (Subpar v3b)

## Overview

This handoff covers the **Today screen** redesign for **Subpar** — a golf speed-training / improvement app. Three variants are bundled, all working from the same design system. The primary deliverable to implement is **Variant C**, but A and B are included as alternates if you want to compare.

The Today screen is the user's daily landing pane: it shows what's left to do today, surfaces the next session to start, and exposes the active multi-week challenge (program).

## About the design files

**The files in this bundle are design references, created in HTML/React/Babel as visual prototypes.** They are NOT production code to copy directly. They demonstrate intended look, behavior, copy, and motion — using inline styles, in-browser Babel, and CDN-loaded React purely so the canvas renders in a browser.

Your job is to **recreate these designs in the target codebase's existing environment** (whatever stack the Subpar app actually uses — React Native, SwiftUI, Flutter, web React, etc.) using its established patterns, design tokens, component library, theming system, and conventions. If no environment exists yet, pick the most appropriate framework for a fitness/golf app of this kind (likely React Native or SwiftUI for mobile) and implement there.

**Don't ship the HTML.** Translate the visual + interaction language into native UI.

## Fidelity

**High-fidelity.** Exact colors, type weights, spacing, radii, and shadows are specified throughout. Match them faithfully. The system has 13 type-scale tokens, 9 radius tokens, 12 spacing tokens, and named color scales (G1–G10, Y1–Y10) — implement them as design tokens in your codebase rather than scattering hex literals through the components.

---

## Screens / views

### Today screen · Variant C (primary)

**Purpose:** The user opens the app; this is the first screen. It tells them:
1. What day they're on in their active challenge (Day 1 / 30)
2. What's queued for today (3 items)
3. What to start *right now* (the "Up Next" item with a CTA)
4. Where they sit on the multi-week program (Get Long mini-progress strip)

**Frame:** iPhone-class portrait, design width **390px**, design height **844px**. Scrolls vertically; tab bar pins to bottom.

**Background:** Page surface is **G10 #e1eee4** (lightest green). Faint topo contour SVG layered on at **opacity 0.55**, stroke `#9eb59a` weight `0.9`. The contour lines are decorative — see `screen-today-c.jsx` for the exact paths.

#### Layout (top to bottom)

| # | Component | Top offset | Notes |
|---|-----------|------------|-------|
| 1 | Compact header (date eyebrow + "Today" + gear) | `padding: 54px 22px 0` | Status-bar safe area baked into the 54px top padding |
| 2 | **G8 ring card** (the section the user explicitly picked) | `margin: 14px 18px 0` | G8 surface, big G9 disc bleeding off top-right, concentric 3-ring |
| 3 | "Up Next · Speed Training" hero | `margin: 14px 18px 0` | Forest gradient card with ball-tracer SVG + Get Long mini-progress + Start CTA |
| 4 | "Today's queue" header + 3-row list | `padding: 20px 24px 8px` (header), `0 18px` (rows) | Single numbered list; row 01 has citron outline |
| 5 | Floating dark tab bar | `padding: 14px 18px 24px` | 3 tabs · Today active |

Below: full anatomy for each component.

---

#### 1 · Header

- Container: `display: flex; justify-content: space-between; align-items: center; padding: 54px 22px 0`
- Left side:
  - Eyebrow: `Thu · May 14 · Day 1`
    - font: Outfit 700, 11.5px, letter-spacing 0.18em, UPPERCASE
    - color: G3 `#1d4e34`
  - Title: `Today`
    - font: Outfit 800, 32px, letter-spacing -0.035em, line-height 1
    - color: ink `#0e2118`
    - margin-top: 2px
- Right side: gear icon button
  - 40×40 circle, background `#fbf6e6` (cream), border-radius 20
  - icon: `I.gear` 18px, color G3 forest
  - box-shadow `0 4px 12px rgba(29,78,52,0.10)`

---

#### 2 · G8 ring card (the one you picked)

This is the card variant the user chose from the G8 background iterations.

- Container:
  - background: **G8 `#92cba2`**
  - border-radius: 24px
  - padding: `16px 18px`
  - overflow: hidden (so the disc clips)
  - box-shadow: `0 14px 30px rgba(17,55,31,0.20), inset 0 1px 0 rgba(255,255,255,0.18)`
  - display: flex; align-items: center
- **Big G9 disc** (decorative shape):
  - position: absolute · top: -90px · right: -90px
  - width × height: 260×260
  - border-radius: 50%
  - background: **G9 `#bcdfc6`**
  - pointer-events: none
- **Concentric 3-ring** (left side):
  - SVG 76×76
  - Three concentric rings, stroke-width 7, gap 2 between rings (computed: r1 = (76-7)/2 = 34.5, r2 = r1-9 = 25.5, r3 = r2-9 = 16.5)
  - Tracks: `rgba(29,78,52,0.18)` (G3 @ 18%) on all three
  - Progress strokes (drawn over track when pct > 0): outer = G3 forest, middle = clay `#cc6f4a`, inner = flax `#e6c772`
  - On Day 1 all pcts = 0; only tracks render
  - For partial states: `strokeDasharray="${circ * pct} ${circ}"`, `transform="rotate(-90 38 38)"`, `strokeLinecap="round"`
- **Content** (right of ring, `marginLeft: 14`):
  - Citron pill: `DAY 1 · ACTIVE` preceded by flag-fill icon
    - inline-flex, gap 5, padding `3px 8px`, border-radius 99
    - background Y5 `#cfde50`, color G2 `#11371f`
    - font: Outfit 800, 10px, letter-spacing 0.06em
    - box-shadow `0 2px 8px rgba(207,222,80,0.33)` (citron @ 33%)
    - leading icon: `I.flagFill` 9×9
  - Title `The Round.`
    - margin-top 6, font: Outfit 800, 22px, letter-spacing -0.03em, line-height 1
    - color G3 forest `#1d4e34`
  - Subtitle `3 left · Golf · Workouts · Lifestyle`
    - margin-top 3, font: Outfit 600, 12px
    - color `rgba(14,33,24,0.65)`
- **Counter** (far right):
  - `0` — JetBrains Mono 800, 22px, color G3 forest
  - `OF 3` — JetBrains Mono 700, 9px, color `rgba(14,33,24,0.6)`
  - column layout, align flex-end, gap 2

---

#### 3 · Up Next hero

The action-forward hero. Pulls focus toward the FIRST thing to do.

- Container:
  - margin: `14px 18px 0`
  - border-radius: 28
  - overflow: hidden
  - background: `linear-gradient(135deg, #1d4e34 0%, #11371f 100%)` (G3 → G2)
  - color: cream `#fbf6e6`
  - padding: `20px 22px 22px`
  - box-shadow: `0 16px 34px rgba(29,78,52,0.30), inset 0 1px 0 rgba(255,255,255,0.06)`
- **Inner topo lines** (absolute, opacity 0.18, stroke citron `#cfde50` weight 0.8) — same SVG as the page background but tinted citron
- **Ball-tracer SVG** (absolute, top: -16, right: 0, w 360 h 200, viewBox 200×100, preserveAspectRatio="none"):
  - 4 strokes radiating from bottom-left to top-right, all stroke `#92cba2` (G8):
    - Solid glow: `M 4 86 Q 90 0, 196 14` · width 6 · opacity 0.18
    - Solid: same path · width 2.2 · opacity 0.95
    - Top dotted: `M 4 90 Q 100 -2, 196 21` · width 1.2 · opacity 0.55 · dash "2 5"
    - Mid dotted: `M 4 91 Q 93 3, 196 26` · width 1.3 · opacity 0.62 · dash "3 7"
  - All strokes use `vector-effect: non-scaling-stroke`
- **Header row** (relative, flex space-between):
  - Citron pill `UP NEXT · 12 MIN` with bolt icon
    - same pill spec as the G8 card pill above
  - Right meta: `1 of 3` in JetBrains Mono 700, 11.5px, opacity 0.78
- **Title block** (margin-top 14):
  - `Speed Training.` — Outfit 800, 44px, letter-spacing -0.04em, line-height 0.92
  - Sub: `6 × 3 sets · L / R · part of <em>Get Long</em>` — Outfit 500, 13px, opacity 0.7
- **Get Long mini-progress row** (margin-top 16, padding `10px 12px`, border-radius 14, bg `rgba(255,255,255,0.06)`, border `1px solid rgba(255,255,255,0.08)`):
  - Flag-fill icon citron 14×14
  - Eyebrow `GET LONG · SESSION 1 / 12` — Outfit 700, 11px, opacity 0.65, letter-spacing 0.06em, UPPERCASE
  - 12-segment progress strip below — 12 flex-1 segments, height 5, gap 3, border-radius 3, bg `rgba(255,255,255,0.12)` (all dim on Day 1)
  - Right-side `29d` — JetBrains Mono 800, 12px, color citron
- **Primary CTA button** (margin-top 16, full-width):
  - padding 16px, border-radius 16, no border
  - background citron `#cfde50`, color G2 `#11371f`
  - font: Outfit 800, 16px, letter-spacing -0.01em
  - shadow `0 10px 22px rgba(207,222,80,0.33), 0 0 0 4px rgba(207,222,80,0.12)`
  - inline-flex center, gap 10
  - leading play icon `M8 5v14l11-7z` (fill currentColor, 14×14)
  - label: `Start now`

---

#### 4 · Today's queue

- **Section header** (padding `20px 24px 8px`, flex space-between):
  - Left: `Today's queue` — Outfit 800, 18px, letter-spacing -0.02em
  - Right: `3 items` — JetBrains Mono 700, 11.5px, color sub `#6b756f`
- **Rows** (padding `0 18px`, flex-column, gap 8):
  Each row is a card with shape:
  - background: white `#ffffff`
  - border-radius: 22
  - padding: `12px 14px 12px 12px`
  - box-shadow: `0 4px 14px rgba(29,78,52,0.06)`
  - **Up-next row only**: 2px solid citron outline, outline-offset -2px
  - display: flex, align-items center, gap 12
  - Leading group (flex, gap 8):
    - Index — JetBrains Mono 700, 11px, letter-spacing 0.05em, color sub
    - Icon chip — 34×34 circle, color-coded:
      - **Speed Training (01)**: bg citron `#cfde50`, icon G2 `#11371f`, `I.bolt` 14×14
      - **Driver (02)**: bg sageLight `#dde9d4`, icon G3 forest, `I.tee` 14×14
      - **Strength Training (03)**: bg peach `#f1d9cc`, icon clay `#cc6f4a`, `I.dumbbell` 14×14
  - Middle (flex 1):
    - Name — Outfit 700, 15px, letter-spacing -0.01em, color ink
    - Meta — Outfit 500, 11.5px, color sub
  - Right pill:
    - **Up next** (01 only): bg citron, color G2, padding `4px 9px`, border-radius 99, font 10.5px Outfit 800 UPPERCASE letter-spacing 0.08em
    - **Queued** (02, 03): no bg, color sub, same font

Row content:
| # | Name | Meta |
|---|------|------|
| 01 | Speed Training | `6 × 3 sets · L / R · 12 min` |
| 02 | Driver | `6 × 3 sets · L / R · 15 min` |
| 03 | Strength Training | `4 sets · 8 reps · 22 min` |

---

#### 5 · Floating dark tab bar

Pulled directly from the design system's nav spec. See `spec-navigation.jsx` for the full anatomy.

- Outer wrapper padding: `14px 18px 24px`
- Container: background G3 forest, border-radius 30, padding 6, gap 4, display flex
- Shadow: `0 14px 30px rgba(29,78,52,0.30)`
- Tabs (3 total):
  - **Today (active)**: `I.checkCircle` 18×18, label "Today", bg citron `#cfde50`, color G3 forest, flex 1.4
  - **Challenges**: `I.flag` 18×18, no label (icon-only when inactive), color `rgba(251,246,230,0.65)`, flex 1
  - **Stats**: `I.bars` 18×18, no label, same color, flex 1
- Each tab: padding `10px 12px`, border-radius 24
- Active label: Outfit 800, 13px
- Only the active tab shows its label — this is the key rule

---

## Interactions & behavior

### Tap targets
- All buttons / chips / tabs: minimum 44×44 effective tap area
- Tab bar tabs: tap anywhere in the pill area cycles selection

### Animations & transitions
- Tab bar selection: 220ms ease-out width transform (the active tab expands flex 1 → 1.4 and the others shrink)
- Pill press feedback: 100ms scale 0.97
- CTA hover (web) / press (native): 150ms slight brightness +5% on citron + shadow lift +20%

### State transitions on the Today screen

| Action | Resulting state change |
|--------|------------------------|
| Tap "Start now" CTA in Up Next hero | Push to Session Player screen for Speed Training |
| Tap row 01 (Up Next) | Same — push to Session Player |
| Tap row 02 / 03 (Queued) | Push to that session's detail screen (not auto-start) |
| Tap gear (header) | Push to Settings |
| Tap Challenges tab | Switch to Challenges tab (preserves Today scroll position) |
| Tap Stats tab | Switch to Stats tab |
| Complete a session (after pushing through Player) | Return to Today; corresponding row becomes "Done" state (strikethrough + completed icon — see Topo v4 reference for the completed-row visual: forest text strikethrough, citron check icon on dark forest button) |
| All 3 sessions complete | Ring card animates rings to 100%; "Day 1." headline can change to "Cleared." (see `screen-topo-v4.jsx`) |

### Loading / empty / error states
- Today screen first load: show skeleton placeholders for the queue rows (gray bg, no icons)
- If user has NO active challenge: hide the Up Next hero, show a "Choose a challenge" CTA in its place (not designed yet — flag for design)
- If today has 0 items (rest day): hide queue section, replace with empty-state illustration (also not yet designed)

### Responsive behavior
- Designed for 390px portrait; the layout should scale fluidly between 360–430px width
- Tab bar should remain pinned to bottom-safe-area on all screen sizes
- Don't change the layout fundamentally on tablet — center the column at ~430px and add a side panel for navigation rather than spreading

---

## State management

State variables required (rough — adapt to your store):

```ts
type TodayScreenState = {
  // From global app state
  date: Date;                 // today's date (e.g. "Thu May 14")
  currentChallenge: {         // the active multi-week program
    id: string;
    name: string;             // "Get Long"
    totalSessions: number;    // 12
    completedSessions: number;// 0 on day 1
    startDate: Date;
    durationDays: number;     // 30
    daysElapsed: number;      // 1
  } | null;

  todayQueue: {               // today's items
    id: string;
    type: 'golf-speed' | 'golf-driver' | 'strength' | ...;
    name: string;
    meta: string;             // "6 × 3 sets · L / R · 12 min"
    minutes: number;
    iconKind: keyof typeof I;
    chipColor: 'citron' | 'sage' | 'peach';
    state: 'queued' | 'up-next' | 'in-progress' | 'done';
  }[];

  ring: {                     // computed from today's queue
    golfPct: number;          // 0..1
    workoutsPct: number;
    lifestylePct: number;
    totalLeft: number;        // 3 on day 1
  };

  activeTab: 'today' | 'challenges' | 'stats';
}
```

The "Up Next" is the first row in `todayQueue` with state `up-next` or the first `queued` row if none is marked. Promote a row to `up-next` when the previous one completes.

---

## Design tokens

### Colors

```
// Greens (G1 = darkest, G10 = lightest)
G1   #0a2515
G2   #11371f   greenDeep   gradient end · pill text
G3   #1d4e34   forest      gradient start · primary text on light · hero bg
G4   #2a6243
G5   #387b54
G6   #4f9869
G7   #6db483
G8   #92cba2   sage-mid    Today ring card background (Variant C)
G9   #bcdfc6   sage        Decorative disc on ring card · sage chip
G10  #e1eee4               page background

// Yellow / citron
Y5   #cfde50   citron      THE accent. Active states, CTAs, progress, Today tab.

// Neutrals
ink         #0e2118        primary dark text
sub         #6b756f        secondary text
cream       #fbf6e6        text on dark surfaces · gear bg
paper       #f7f4ea        warm white for docs/light cards

// Accents
clay        #cc6f4a        workout / "Workouts" ring
flax        #e6c772        lifestyle / inner ring
peach       #f1d9cc        workout chip background
sageLight   #dde9d4        golf chip background

// Track colors on dark forest
trackForest rgba(255,255,255,0.10–0.18)
// Track colors on light G8
trackG8     rgba(29,78,52,0.18)
```

### Typography

Family: **Outfit** (Google Fonts, weights 400/500/600/700/800)
Mono: **JetBrains Mono** (Google Fonts, weights 500/600/700)

```
display/xxl    64 / 0.95   -0.04em    800
display/xl     52 / 0.92   -0.04em    800   XL card title
display/l      44 / 0.95   -0.035em   800   hero card title ("Speed Training.")
display/m      40 / 0.95   -0.035em   800
title/l        32 / 1.00   -0.03em    800   readout numbers
title/m        26 / 1.00   -0.03em    800
title/s        22 / 1.05   -0.025em   700   ring card title ("The Round.")
body/lg        18 / 1.30   -0.02em    700   row title
body/md        14 / 1.40   -0.01em    700   buttons
body/sm        13 / 1.45    0em       500   subtitle / meta
body/xs        12 / 1.40    0em       600   pill text
caption        11 / 1.30    0.04em    800   UPPERCASE active pill
eyebrow        10.5 / 1.20  0.22em    800   UPPERCASE section eyebrow
```

Always set `fontVariantNumeric: 'tabular-nums'` on numeric readouts (MPH, lb, day counts, %, "0/12").

### Spacing

```
sp/1   3px
sp/2   4px
sp/3   6px
sp/4   8px
sp/5   10px
sp/6   12px
sp/7   14px
sp/8   16px
sp/9   18px
sp/10  20px
sp/11  22px
sp/12  26px
```

### Radius

```
r/pill      99px        pills, progress bar, segmented control
r/xs        12px        stat tiles, ghost button
r/sm        14px        stat tile (xl), inline button
r/md        16px        primary CTA, sticker tile
r/lg        22px        item row card, list block
r/card-xs   24px        card · XS, S
r/card-m    26px        card · M
r/card-l    28px        card · L
r/card-xl   30px        card · XL
```

### Shadows

```
sh/row    0 4 14 rgba(29,78,52,0.06)                  list rows on cream
sh/card   0 14 30 rgba(17,55,31,0.42),                hero forest card · all sizes
          inset 0 1 0 rgba(255,255,255,0.06)
sh/cta    0 12 24 rgba(207,222,80,0.35),              primary CTA halo on forest
          0 0 0 4 rgba(207,222,80,0.18)
sh/g8     0 14 30 rgba(17,55,31,0.20),                Variant C G8 ring card
          inset 0 1 0 rgba(255,255,255,0.18)
```

---

## Assets

Bundled in `design-files/assets/`:

- `original-today.png` — the screenshot the user provided that was the starting point for this redesign
- `buildstrong-barbell.png` — photo background used by the Build Strong card (not used in the Today screen itself, but referenced by the design system)

### Icons

12 inline SVGs are defined in `icons.jsx` under the `I.*` namespace. They use `currentColor` and `stroke-width: 1.8` (round caps). When re-implementing, use your codebase's icon library (e.g. Lucide, SF Symbols, Heroicons) and pick the nearest visual match — or port the SVG strings directly.

Icons used on the Today screen:
- `I.gear` — header settings button
- `I.flagFill` — active pill leading icon, "Up Next" pill leading icon, Get Long mini-progress leading icon
- `I.bolt` — Speed Training row chip
- `I.tee` — Driver row chip
- `I.dumbbell` — Strength Training row chip
- `I.checkCircle` — Today tab (active)
- `I.flag` — Challenges tab
- `I.bars` — Stats tab

---

## Files

All bundled in `design-files/`. Open `Today Screen Redesign.html` in a browser to see the rendered prototype.

### Entry points (HTML)
- **`Today Screen Redesign.html`** — the canvas with Original / A / B / C side-by-side + rationale notes. Open this first.
- `Design System.html` — the full design-system spec page (overview, color, type, spacing, icons, nav, cards). Reference for tokens.

### Variant C source (primary target)
- `screen-today-c.jsx` — the screen the user picked. **Implement this.**

### Alternates (for reference)
- `screen-today-a.jsx` — Variant A · faithful structure
- `screen-today-b.jsx` — Variant B · action-forward (Variant C is B + the G8 ring card)
- `screen-topo-v4.jsx` — the "all complete" end-of-day state that informed the design language

### Scaffolding
- `design-canvas.jsx` — pan/zoom canvas host (only used to render the prototype; not part of the app)
- `ios-frame.jsx` — iPhone bezel for the canvas (not part of the app)
- `icons.jsx` — `I.*` icon set
- `assets/` — images

### Design-system reference files
- `spec-overview.jsx` — system at a glance
- `spec-typography.jsx` — type scale and pairings
- `spec-spacing.jsx` — spacing, radius, elevation
- `spec-iconography.jsx` — icon rules
- `spec-navigation.jsx` — tab bar anatomy
- `swatch-greens.jsx` · `swatch-yellows.jsx` · `color-y5-focus.jsx` — color references
- `card-drainit.jsx` · `card-getlong-speed.jsx` · `card-buildstrong.jsx` — challenge card components in all 5 sizes (XS → XL)
- `components-getlong.jsx` · `components-buildstrong.jsx` — pixel-exact card-background specs

---

## Implementation checklist

A suggested order:

1. **Design tokens** — port the color, type, spacing, radius, shadow tokens into your codebase's theme system. This unblocks everything else.
2. **Icon set** — wire up Lucide/SF Symbols equivalents for the 12 icons, or copy the SVG strings into your icon module.
3. **Concentric 3-ring component** — reusable, takes `size`, `strokeWidth`, `pcts[]`, `colors[]`, `tracks[]`. Used on the Today screen and in the Topo v4 "round" widget.
4. **Pill / chip primitives** — citron-active, sage-chip, peach-chip, etc.
5. **Floating tab bar** — three-tab, only active labeled, citron-on-forest.
6. **Header component** — date eyebrow + title + gear button.
7. **G8 ring card** — implement as a parameterized component so it can be reused on other "summary" screens.
8. **Up Next hero** — the forest gradient card with tracer SVG. The tracer should be a reusable component too — it's used on the Get Long challenge card.
9. **Queue row** — single component with a `state` prop (`queued | up-next | in-progress | done`).
10. **Wire data + assemble the screen.**

## Open questions for the dev

A few things were not designed yet — flag back to design when you hit them:

- **Rest day empty state** — what does the Today screen look like when `todayQueue` is empty?
- **No-active-challenge state** — what replaces the Up Next hero?
- **Session-complete animation** — how the ring fills and the row transitions to "Done"
- **Onboarding** — Day 0 / no-challenge-selected flow
- **Dark mode** — not yet defined; the system is light-only currently

Ping the designer (and reference `Today Screen Redesign.html`) before guessing.
