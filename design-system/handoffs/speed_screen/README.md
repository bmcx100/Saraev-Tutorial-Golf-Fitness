# Handoff: Golf Fitness · Speed Training screen (Normal Stance + Max Out)

## Overview

Two screens of the **Speed Training** drill flow in the Golf Fitness mobile app (Subpar v3 design system):

1. **Normal Stance** — mid-flow state: 3 sticks (Green / Blue / Red), Green active, DOM cell focused, typing "117" mph.
2. **Max Out** — the third drill in the session: 2 clubs (Green Stick + Driver), single SPEED cell each, Green active.

Both screens share a forest-hero header, a custom numeric keypad, and a citron CTA. The "Pillars V1" stick-form treatment is the chosen visual direction across both.

## About the Design Files

The files in this bundle are **design references created in HTML/React** — prototypes showing intended look and behavior, not production code to copy directly. Your task is to **recreate the design in the target codebase's existing environment** (likely React Native, Expo, SwiftUI, or Flutter for a mobile app) using its established patterns, component library, navigation, and form handling. If no environment exists yet, choose the most appropriate stack and implement there.

The reference `.jsx` files use inline-styled vanilla React for design illustration. They are **not architected for production** — translate styles into the codebase's styling system (NativeWind, styled-components, StyleSheet, etc.).

## Fidelity

**High-fidelity.** All colors, typography, spacing, border radii, and shadows are specified at production values. Recreate pixel-perfectly within the target framework's idioms.

---

## Shared elements (both screens)

### Forest hero (top band)

- Container: full-width, `borderBottomLeftRadius: 28, borderBottomRightRadius: 28`, padding `54px 18px 16px`, overflow hidden.
- Background: `linear-gradient(160deg, #1d4e34 0%, #11371f 100%)` (forest → green-deep).
- Decoration: 4 curved topo lines as SVG behind content, stroke `#6db483`, opacity 0.28, stroke-width 0.9. See `pillars-shared.jsx` → `ForestHero` for exact paths.
- Status bar uses **dark mode** (white icons).

**Top row (flex, gap 12, align-center):**
- 36×36 round back button. Background `rgba(251,246,230, 0.10)`, border `rgba(251,246,230, 0.20)`, cream chevron icon (`<-`).
- Eyebrow caption next to it: **JetBrains Mono**, 9.5pt, weight 700, letter-spacing **0.24em**, uppercase, color `rgba(251,246,230, 0.6)`, `white-space: nowrap`.
  - Normal Stance: `DAY 1 · SESSION 3`
  - Max Out: `DAY 1 · SESSION 3 · DRILL 3 / 3`

**Title row (flex, align-end, justify-between, gap 12, margin-top 14):**
- Left column (flex 1, min-width 0):
  - Eyebrow: `Get Long` — JetBrains Mono, 11pt, weight 800, letter-spacing 0.22em, uppercase, color citron `#cfde50`.
  - Title: `Speed Training.` — Outfit, **28pt**, weight 800, letter-spacing -0.035em, line-height 0.95, color cream `#fbf6e6`, `white-space: nowrap`.
- Right column (flex 0 0 auto, white-space nowrap, text-right):
  - PR number: **JetBrains Mono**, 22pt, weight 700, color citron, letter-spacing -0.01em, text-shadow `0 0 14px rgba(207,222,80, 0.4)`.
  - PR caption below: JetBrains Mono, 9.5pt, weight 700, letter-spacing 0.2em, color `rgba(251,246,230, 0.6)`.
  - Normal Stance values: `118 / PR · MPH`
  - Max Out values: `127 / DRIVER PR`

**Tab segmented control (margin-top 14):**
- Container: flex row, gap 6, padding 4, background `rgba(251,246,230, 0.10)`, 1pt border `rgba(251,246,230, 0.16)`, border-radius 14.
- 3 tabs: `Normal`, `Step Drill`, `Max Out` — each flex 1, border-radius 10, padding 8/6, text-align center.
- Tab type: Outfit, 11.5pt, weight 800, letter-spacing 0.04em, uppercase, `white-space: nowrap`.
- Inactive tab: background transparent, color `rgba(251,246,230, 0.7)`.
- Active tab: background citron `#cfde50`, color green-deep `#11371f`, shadow `0 6px 12px rgba(207,222,80, 0.25), inset 0 1px 0 rgba(255,255,255, 0.35)`.
  - Normal Stance: index 0 active.
  - Max Out: index 2 active.

### Section heading (below hero)

Flex row, align-end, justify-between, gap 14, padding `14px 18px 4px`.

**Left column (flex 1):**
- Eyebrow: JetBrains Mono, 10pt, weight 700, letter-spacing 0.24em, color sub `#6b756f`.
  - Normal Stance: `DRILL · 1 OF 3`
  - Max Out: `DRILL · 3 OF 3`
- Title: Outfit, **22pt**, weight 800, letter-spacing -0.03em, color ink `#0e2118`, line-height 1.
  - Normal Stance: `Normal Stance.`
  - Max Out: `Max Out.`
- Helper: Outfit, 12pt, weight 500, color sub, line-height 1.35.
  - Normal Stance: `3 sticks · swing 3× · best wins`
  - Max Out: `Green stick + driver · swing 3× max · best wins`

**Right column (flex 0 0 auto, text-right):**
- Progress number: JetBrains Mono, 20pt, weight 700, color green-deep `#11371f`, tabular-nums, letter-spacing -0.01em.
  - Normal Stance: `1 / 6` (1 of 6 cells filled)
  - Max Out: `1 / 2` (1 of 2 speed readings filled)
- Progress caption: JetBrains Mono, 9pt, weight 700, letter-spacing 0.22em, color sub.
  - Normal Stance: `SWINGS`
  - Max Out: `READINGS`

### Custom numeric keypad

Replaces the platform native numeric keyboard. Background paper `#f7f4ea`, 1pt top border `#e2dcc0`.

- 4 rows × 3 columns. Each cell 56pt tall.
- Hairline grid: 1pt right border on cols 0–1 of each row, 1pt bottom border on rows 0–2.
- Numeric keys 1–9, 0: **JetBrains Mono**, 24pt, weight 600, color green-deep `#11371f`, letter-spacing -0.01em, tabular-nums.
- "0" key has a citron underline accent: 18×2pt pill, background citron, centered horizontally, bottom 10px. Signals "most-used key" — fine to drop in production if unwanted.
- Bottom-left "NEXT" function key: small skip-arrow icon (`<svg width="16">` line, stroke sub) + "NEXT" mono label, 10pt, weight 700, letter-spacing 0.16em, color sub. Action: advance to next field.
- Bottom-right delete pill: 56×34pt rounded rectangle (border-radius 10), background green-deep `#11371f`, cream chevron backspace icon centered.

See `pillars-shared.jsx` → `Keypad` for exact markup.

### CTA bar

- Container: padding `12px 18px 22px` (bottom padding accommodates home indicator), background `#ffffff`, 1pt top border `#e2dcc0`.
- Button: full-width, background citron `#cfde50`, color green-deep, border none, border-radius 16, padding `15px 18px`.
- Layout: flex row, center, gap 10.
- Label: Outfit, 15.5pt, weight 800, letter-spacing -0.005em.
- Trailing glyph: JetBrains Mono, 16pt, weight 700.
- Shadow: `0 10px 22px rgba(207,222,80, 0.32), inset 0 1px 0 rgba(255,255,255, 0.4)`.
- Pressed: 96% scale, brightness -8%, shadow halved.
- Loading state: replace label with spinner; do not change button size.
- Per screen:
  - Normal Stance: `Log 117 mph →`
  - Max Out: `Submit 117 mph ✓`

---

## Screen 01 · Normal Stance · Pillars V1

### Layout

After the hero and section heading, the body is a flex row of **three pillars**, gap 10, padding `8px 14px 18px`, flex 1.

Each pillar is a vertical stack:
1. **Tee cap** — 20pt diameter (Driver cap on screen 02 differs; Normal Stance always uses the 20pt solid stick-colored cap), self-centered, marginBottom -2 so it sits flush over the grip band, z-index 2.
2. **Grip band** — solid stick-color, border-top-radius 14, padding `6px 6px 5px`, inset shadow `inset 0 -2px 0 {stick}99` (90% darker stick color for a subtle bottom bevel). Contains the stick name in white Outfit, 12pt, weight 800, with a `0 1px 0 rgba(0,0,0,0.15)` text-shadow.
3. **Shaft** — flex 1, border-top none, border-bottom-radius 16. Contains the input cells stacked vertically (gap 6) plus the bottom-edge swing-dot pill.

### Active vs. inactive treatment

**Active pillar (Green, in this state):**
- Cap: stick-colored circle with a 2pt **citron border** and a stack of shadows: `0 0 0 3px rgba(207,222,80, 0.5), 0 4px 8px {stick}55`.
- A small **down-arrow indicator** sits directly above the cap (7pt tall triangle pointing down, color green-deep, centered horizontally). Tells the user which stick they're currently on.
- Shaft background: white `#ffffff`. Border: 1pt stick color.
- Shaft shadow: `0 12px 22px rgba(17,55,31, 0.14), 0 0 0 2px {stick}33` (the second shadow is a soft stick-colored ring).
- Faint vertical "groove" line through the center of the shaft: 1pt wide, top 6 / bottom 18, background `{stick}22`. Adds dimension without competing with content.

**Muted pillars (Blue + Red, in this state):**
- **No solid cap** — replaced by a small 14pt `StickRing` (concentric 2-color ring) self-centered with marginBottom 4. Signals "this is a stick" but quietly.
- **No solid grip band** — replaced by a paper-toned strip: background `rgba(255,255,255, 0.5)`, 1pt border rule `#e2dcc0`, border-top-radius 14, padding `5px 6px`. Stick name renders in **sub gray** (`#6b756f`) instead of white. Reads as muted.
- **Shaft tint**: background `rgba(255,255,255, 0.4)`, 1pt border rule. No shadow.
- Empty cells use 1pt **dashed border** in rule color, not the active sc-tinted style.
- Cell numbers render as `——` placeholder in `rgba(14,33,24, 0.18)`.
- No `opacity` overlay on the parent pillar — the muted treatment is achieved via component-level palette swaps, not a blanket fade. This keeps text legible.

### Cells (DOM / NON-DOM)

Each pillar shaft contains two cells stacked:

**Cell anatomy (active stick, empty state):**
- Border: 1pt dashed `{stick}66`, border-radius 10, padding `7px 4px`.
- Background: transparent.
- Mono eyebrow: JetBrains Mono, 8pt, weight 700, letter-spacing 0.22em, color sub. Text: `DOM` or `NON-DOM`.
- Number: JetBrains Mono, 19pt, weight 700, tabular-nums, letter-spacing -0.02em, line-height 1.1.
  - Empty: `——` in `rgba(14,33,24, 0.22)`.
  - Filled: actual value in green-deep `#11371f`.
- "mph" suffix: JetBrains Mono, 8pt, weight 600, letter-spacing 0.08em, color sub.

**Cell focused state (the one being typed into right now):**
- Border: 2pt solid forest `#1d4e34`.
- Background: `{stick}15` (10% tint of stick color).
- Box-shadow: none (the 2pt border carries the focus signal).
- Number color: green-deep, even while empty.

In the Normal Stance design state shown: **Green DOM is focused**, value displays "117" (the live-typing partial). NON-DOM is empty/inactive.

### Bottom-edge swing-dot pill

Sits at the **bottom edge of every pillar shaft**, positioned absolutely:
- `bottom: 0, left: 50%, transform: translate(-50%, 50%)` — half on, half off the card.
- Container: paper background `#f7f4ea`, 1pt border `#e2dcc0`, border-radius 99 (pill), padding `4px 8px`. Sits in a small rounded pill so it cleanly breaks the pillar's bottom edge.
- Contents: 3 dots, each 6×6 px, gap 5.
  - Filled (swing logged): background = stick color (or `rgba(14,33,24, 0.4)` on muted pillars).
  - Empty: background `rgba(14,33,24, 0.18)`.
  - The **most recently filled dot** (i.e. index `done - 1`) gets a `0 0 4px {color}` glow.
- On Normal Stance, Green shows 2 of 3 dots filled (currently on swing 3 of 3 for the DOM column). Blue and Red show 0 of 3.

### State for screen 01

| Pillar | DOM | NON-DOM | Swings done | Focused cell |
|--------|-----|---------|-------------|--------------|
| Green  | 117 (live) | empty | 2 / 3 | DOM |
| Blue   | empty | empty | 0 / 3 | — |
| Red    | empty | empty | 0 / 3 | — |

---

## Screen 02 · Max Out · Green Stick + Driver

### What changes

- **Tab strip:** active tab moves from `Normal` (index 0) to `Max Out` (index 2).
- **Hero eyebrow:** adds `· DRILL 3 / 3` to the right of `DAY 1 · SESSION 3`.
- **Hero PR readout:** number swaps from `118` (generic PR) to `127`; caption swaps from `PR · MPH` to `DRIVER PR`. Driver speed is the relevant PR in Max Out.
- **Section heading:** title becomes `Max Out.`, eyebrow becomes `DRILL · 3 OF 3`, helper becomes `Green stick + driver · swing 3× max · best wins`.
- **Progress counter:** `1 / 2 / READINGS` (only 2 readings total — one per club).
- **Body:** only **two pillars** instead of three: Green Stick + Driver. Wider (flex 1 each), gap 14, padding `8px 16px 20px`.
- **Cells:** each pillar has **a single SPEED cell** instead of stacked DOM + NON-DOM.
- **CTA:** label becomes `Submit 117 mph`, trailing glyph swaps from `→` to `✓`.

### Green Stick pillar (Max Out)

Same anatomy as the active pillar on screen 01, but:

- **Cap:** 22pt (slightly larger than the 20pt cap on screen 01).
- **Grip band:** padding `8px 6px 7px`, border-top-radius 16, name renders at Outfit 14pt weight 800. Caption text: `Green Stick`.
- **Shaft:** border-radius 18 on bottom corners (slightly more rounded), padding `14px 8px 18px`. Vertical groove sits between top 6 and bottom 18 (clears the bottom-dot pill).
- Contains a single SPEED cell.

### Driver pillar

**A new pillar treatment, paired to read as a sibling of the Green stick — not a stranger.**

- **Cap (new):** instead of a solid colored circle, the driver cap is a white pill containing a small inline driver-head SVG silhouette.
  - Container: `padding: 4px 6px`, background white, border-radius 99, marginBottom -4, z-index 2.
  - Border: 1pt rule `#e2dcc0` when inactive; **2pt citron** when active, plus the same `0 0 0 3px rgba(207,222,80, 0.5)` glow ring as the active Green cap.
  - Inside: a 26×20 SVG of a driver-head wedge.
    - **Implementation note:** the SVG markup is in `max-out.jsx` → `DriverHead`. At 26×20 it reads as "dark club-shaped silhouette" — fine for the design comp, but in production we recommend either: (a) bumping the cap & SVG to ~34×24 so the wedge shape is clearer, or (b) replacing with a tighter custom Lottie/SF Symbol of a driver head from the client's icon set. **The citron ball-dot inside the wedge is decorative and should be removed in production** — at the design's scale it reads as noise, not a ball.
  - When active, the same 7pt green-deep down-arrow sits directly above the cap.
- **Grip band:** background **green-deep `#11371f`** (not stick-color — there's no canonical "driver color"). Inset shadow `inset 0 -2px 0 rgba(0,0,0, 0.25)`. White Outfit 14pt weight 800 "Driver" label.
- **Shaft:** border 1pt green-deep when active, otherwise 1pt rule. Active shadow uses a forest-tinted ring: `0 12px 22px rgba(17,55,31, 0.14), 0 0 0 2px rgba(17,55,31, 0.18)`. Center groove uses `rgba(17,55,31, 0.16)`.

### SPEED cell (Max Out only)

Larger than the DOM/NON-DOM cells on screen 01 — there's only one cell per pillar in Max Out, so the readout grows.

- Border: 1pt dashed `{accent}66` (stick color for Green, green-deep for Driver), border-radius 12, padding `14px 10px`.
- Mono eyebrow: JetBrains Mono, 9pt, weight 700, letter-spacing 0.24em, color sub. Text: `SPEED`.
- Number: JetBrains Mono, **40pt**, weight 700, tabular-nums, letter-spacing -0.025em, line-height 1.
  - Empty: `— — —` in `rgba(14,33,24, 0.22)`.
  - Filled: actual value in green-deep.
- "mph" suffix: JetBrains Mono, 9pt, weight 600, letter-spacing 0.1em, color sub.
- Focused state: 2pt forest border + `{accent}15` background tint.

### State for screen 02

| Pillar       | SPEED | Swings done | Focused |
|--------------|-------|-------------|---------|
| Green Stick  | 117 (live) | 2 / 3 | yes |
| Driver       | empty | 0 / 3 | no |

---

## Interactions & Behavior

### Cell focus

- Tap a cell → it becomes the focused cell. Border animates from dashed `{accent}66` (1pt) → solid forest (2pt) over 120ms ease-out. Background fills with `{accent}15`. Number color shifts to green-deep.
- The custom keypad is always visible (not pop-up). Tapping a cell does NOT open the platform keyboard — all input flows through the keypad.

### Number entry

- Tapping a digit appends to the focused cell. Max 3 digits (mph values cap at 999 — in practice ~180).
- The displayed number updates immediately as the user types. The placeholder `——` is replaced as soon as the first digit is entered.
- Tapping the same digit twice rapidly is fine; debounce only the final submit.

### NEXT (skip / advance)

- Tapping the NEXT key advances the focus to the next cell:
  - Normal Stance: Green DOM → Green NON-DOM → Blue DOM → Blue NON-DOM → Red DOM → Red NON-DOM. After Red NON-DOM, the CTA gains focus.
  - Max Out: Green SPEED → Driver SPEED. After Driver SPEED, the CTA gains focus.
- NEXT does NOT auto-fill — if the current cell is empty, it stays empty and focus moves on. The swing dot does not increment.

### Delete

- Tap delete to remove the last digit of the focused cell.
- Holding delete (long-press) clears the cell.

### Swing dots

- Each cell has 3 swings (the cell stores the **best** of the 3, but visually tracks how many have been logged so far via the dots).
- When the user enters a value and the keypad's commit happens (auto-commit on advance or explicit "Log" tap), one dot fills.
- After 3 swings, the cell locks the **highest** value entered. Show a small "✓" badge in the cell on completion. (Not shown in this design state.)

### CTA tap

- Normal Stance "Log 117 mph →": commits the current cell value, increments the swing dot, advances focus to the next swing or cell.
- Max Out "Submit 117 mph ✓": commits the current cell. If this completes the drill, submits the full session payload to the server and navigates to the session-summary screen.

### Keyboard appears (n/a)

- The custom keypad replaces the platform keyboard; the screen layout never needs to reflow for a system keyboard.

### Animations

- On screen mount: hero topo lines fade in 400ms; section heading and pillars stagger up 12pt + fade in (60ms offsets).
- Cap glow on activating a pillar: 200ms ease-out, citron ring scales 0.92 → 1.
- Bottom-dot fill: scale 0 → 1 + brief 320ms glow pulse on the newly filled dot.
- CTA press: 96% scale, brightness -8%, shadow halved.

---

## State Management

Per drill, the screen holds:

- `sticks: Array<StickEntry>` — for Normal Stance, 3 entries (Green/Blue/Red), each with `{ dom: number[] (up to 3 swings), non: number[] (up to 3 swings) }`. For Max Out, 2 entries (Green Stick/Driver) each with `{ speed: number[] }`.
- `focus: { stickIndex: number, cell: 'dom' | 'non' | 'speed' } | null`
- `buffer: string` — the current typed digits for the focused cell, before commit.
- `submitting: boolean`

The "best of N" rule means: when reading a value back for display, use `Math.max(...swings)` (or null if no swings yet).

Persist locally as the user types so a backgrounded app doesn't lose progress.

---

## Design Tokens

### Colors

```
ink             #0e2118    primary text on light surfaces
sub             #6b756f    secondary text · sub-labels · helpers
forest          #1d4e34    primary brand · CTAs on light · gradients · active focus rings
greenDeep       #11371f    darkest brand · CTA text on citron · driver grip band · gradient stop
g7              #6db483    topo line color · GREEN stick color (also the swatch token)
g8              #92cba2    sage (not used here, but in the system)
g9              #bcdfc6    sage accent (not used here)
citron          #cfde50    THE accent · CTAs · active tab · active cap rim · most-used keypad accent
cream           #fbf6e6    text on dark · hero text
paper           #f7f4ea    page background outside hero · keypad background
rule            #e2dcc0    borders · dividers · muted pillar accents
clay            #cc6f4a    tertiary accent · RED stick color
stick-green     #6db483    Green training-stick color (= g7)
stick-blue      #5e7eb8    Blue training-stick color (system-tuned blue · NOT iOS blue)
stick-red       #cc6f4a    Red training-stick color (= clay)
driver-grip     #11371f    Driver pillar grip-band color (= greenDeep)
```

### Typography

- **Outfit** (Google Fonts) — display + UI · weights 400, 500, 600, 700, 800
- **JetBrains Mono** (Google Fonts) — every numeric readout, eyebrow, and metadata · weights 500, 600, 700

| Where | Family | Size | Weight | Tracking |
|-------|--------|------|--------|----------|
| Hero title `Speed Training.` | Outfit | 28 | 800 | -0.035em |
| Hero PR number | JBMono | 22 | 700 | -0.01em |
| Hero "GET LONG" eyebrow | JBMono | 11 | 800 | 0.22em |
| Hero "DAY 1 · SESSION 3..." caption | JBMono | 9.5 | 700 | 0.24em |
| Hero PR caption | JBMono | 9.5 | 700 | 0.2em |
| Tab labels | Outfit | 11.5 | 800 | 0.04em |
| Section heading title | Outfit | 22 | 800 | -0.03em |
| Section heading eyebrow | JBMono | 10 | 700 | 0.24em |
| Section heading helper | Outfit | 12 | 500 | normal |
| Progress number (right of section) | JBMono | 20 | 700 | -0.01em |
| Pillar grip-band name | Outfit | 12–14 | 800 | -0.005em |
| Cell label (DOM/NON-DOM) | JBMono | 8 | 700 | 0.22em |
| Cell number (small, DOM/NON-DOM) | JBMono | 19 | 700 | -0.02em |
| Cell label (SPEED, Max Out) | JBMono | 9 | 700 | 0.24em |
| Cell number (large, SPEED) | JBMono | 40 | 700 | -0.025em |
| Cell "mph" suffix | JBMono | 8–9 | 600 | 0.08–0.1em |
| Keypad number | JBMono | 24 | 600 | -0.01em |
| Keypad "NEXT" caption | JBMono | 10 | 700 | 0.16em |
| CTA label | Outfit | 15.5 | 800 | -0.005em |
| CTA glyph | JBMono | 16 | 700 | normal |

### Spacing scale (used)

| Value | Use |
|-------|-----|
| 4pt | tab control inner padding · pillar margin offsets · pill padding |
| 6pt | pillar internal padding · grip band padding · cell padding |
| 8pt | pillar padding · group gaps |
| 10pt | row gaps · pillar row gap (Normal Stance) |
| 12pt | hero column gap |
| 14pt | hero spacing · section heading top padding · pillar row gap (Max Out) |
| 16pt | side padding · grip-band radius (Max Out) |
| 18pt | hero side padding · section heading side padding · CTA side padding |
| 22pt | CTA bottom padding (home indicator clearance) |

### Border radius

| Token | Value | Use |
|-------|-------|-----|
| pill | 99 | tabs · swing-dot bottom pill · driver cap container |
| sm | 10 | keypad delete pill · cells |
| md | 12 | SPEED cell · note cards |
| lg | 14 | tab container · grip band top corners |
| lg-2 | 16 | shaft bottom corners (Normal Stance) · CTA |
| xl | 18 | shaft bottom corners (Max Out) · pillar overall |
| hero-bottom | 28 | hero bottom corners |

### Shadows

```
hero PR glow              text-shadow: 0 0 14px rgba(207,222,80, 0.4)
active tab                0 6px 12px rgba(207,222,80, 0.25), inset 0 1px 0 rgba(255,255,255, 0.35)
active cap glow           0 0 0 3px rgba(207,222,80, 0.5), 0 4px 8px {stick}55
inactive cap              0 2px 4px {stick}55
active grip-band inset    inset 0 -2px 0 {stick}99
active shaft              0 12px 22px rgba(17,55,31, 0.14), 0 0 0 2px {accent}33
driver active shaft       0 12px 22px rgba(17,55,31, 0.14), 0 0 0 2px rgba(17,55,31, 0.18)
focused cell              none (the 2pt forest border carries the signal)
CTA                       0 10px 22px rgba(207,222,80, 0.32), inset 0 1px 0 rgba(255,255,255, 0.4)
text on grip-band         0 1px 0 rgba(0,0,0, 0.15)  /  rgba(0,0,0, 0.2) for driver
```

---

## Assets

- **Topo lines** — inline SVG in the forest hero. Reuse the same 4 curves across all forest-band hero screens.
- **Stick ring (`StickRing`)** — 14×14 inline SVG: outer ring stroke 2.5pt + filled inner dot. Replace with the codebase's icon library equivalent only if a matching minimal mark exists; otherwise inline.
- **Driver-head silhouette (`DriverHead`)** — 26×20 inline SVG wedge. **Production recommendation:** ship a 34×24 vector from the icon set, or commission a tighter SVG. The citron "ball" dot inside the silhouette should be dropped — too small to read at this scale.
- **Back chevron, delete, skip icons** — line strokes at 1.8–2pt. Replace with platform icon library if available (Feather, Lucide, SF Symbols, Material).

## Fonts

Load **Outfit** and **JetBrains Mono** from Google Fonts (or self-host). Required weights:
- Outfit: 400, 500, 600, 700, 800
- JetBrains Mono: 500, 600, 700

On native: bundle the WOFF2/TTF in the app and register via Expo Font / native font registration. Do not rely on system fallbacks for display text or any numeric readout — the entire visual system depends on these specific metrics.

## Accessibility

- All tap targets ≥ 44 × 44pt. The keypad cells are 56pt tall × ~130pt wide on a 390-wide phone — comfortable. The NEXT and DELETE function keys need to maintain ≥ 44×44 tap targets even though the visual elements (label or pill) are smaller.
- Color contrast: cream on forest (≥9:1) · ink on white (>12:1) · sub on paper (≥4.5:1) · greenDeep on citron (≥5:1) — all pass WCAG AA.
- Decorative mono captions (e.g. `DAY 1 · SESSION 3`, the citron-tagged drill counter) should be marked `aria-hidden` / `accessibilityElementsHidden` on iOS — the same info is reachable from semantic structure.
- Each pillar should be a single semantic group: announce as e.g. "Green training stick, swing 2 of 3, dominant hand 117 mph, non-dominant empty, double-tap to edit".
- Focused cells announce their state change to screen readers ("Editing Green dominant hand, current value 117 mph").
- Support Dynamic Type / Android font scaling up to ~130%. The keypad scales last (it's a fixed-grid component); cells reflow first.
- Reduced-motion: disable the dot-fill scale animation and the cap-glow scale-in. Keep instant state changes.

## Files in this bundle

- `preview.html` — open in a browser. Renders both screens side-by-side inside iOS frames (390×844 each). Status bar in dark mode. Requires all the `.jsx` files alongside.
- `pillars-shared.jsx` — exports `ForestHero`, `Keypad`, `CTABar`, `StickRing`, color tokens (`SPColors`), back/delete/skip icons. Used by both screens.
- `pillars-final.jsx` — exports `PillarsP3Refined` (the Normal Stance screen) and `PillarsP3RedActive` (a parallel direction kept for reference — **only `PillarsP3Refined` is the one to implement**).
- `max-out.jsx` — exports `MaxOutScreen`. Contains its own copy of the forest hero (because the tab strip and PR readout differ) plus the new `DriverPillar`.
- `ios-frame.jsx` — the iOS device chrome used by `preview.html` only. Do not port to the real app.
- `icons.jsx` — the shared inline icon set (only `StickRing` and a few generic icons are used here; most icons are inlined directly in the screen files).
