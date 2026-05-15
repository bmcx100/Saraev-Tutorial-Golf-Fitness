# Handoff: Build Strong · BS6-XL card

## Overview

The **BS6-XL** card is the largest variant of the **Build Strong** card family in the Golf Fitness app (Subpar v3 design system). It's the canonical "hero" surface for the resistance-training challenge — surfaced at the top of the Today screen when Build Strong is the active program.

Photo background (gym-floor barbell) with a forest-tint stack, a citron-glow streak readout, three glassy stat tiles, a 12-segment session progress bar, and a paired CTA (primary citron "Start session" + secondary glass "Plan").

## About the design files

The files in this bundle are **design references created in React/HTML** — a prototype showing intended look and behavior, not production code to copy directly. Your task is to **recreate the card in the target codebase's existing environment** (likely React Native, Expo, SwiftUI, or Flutter for a mobile app) using its established patterns, image components, and styling system. If no environment exists yet, choose the most appropriate stack and implement there.

The reference `.jsx` uses inline-styled React for design illustration. It is **not architected for production** — translate styles into the codebase's styling system (NativeWind, styled-components, StyleSheet, etc.).

## Fidelity

**High-fidelity.** All colors, typography, sizes, radii, shadows, opacity values, and blend modes are specified at production values. Recreate pixel-perfectly within the target framework's idioms.

---

## Frame

- Native footprint on a 390pt-wide phone: **~354pt wide × ~440pt tall** (the card sits with 18pt horizontal margins to the phone edges).
- Container border-radius: **30pt** (the largest in the size ladder — XS uses 24).
- `overflow: hidden` so the photo background clips to the radius.
- Outer shadow stack: `0 14px 30px rgba(17,55,31, 0.42), inset 0 1px 0 rgba(255,255,255, 0.06)`.
  - The outer drop is a forest-tinted shadow (matches the system's "card on paper" treatment).
  - The inset top-line is a 6% white highlight that fakes a tiny rim-light.

---

## Background stack (z-order from back to front)

Three absolutely-positioned full-cover layers stacked behind the content (`zIndex: 0`).

### Layer 1 · Photo

- Image: `assets/buildstrong-barbell.png` (bundled).
- `background-size: cover`
- `background-position: center 40%` (anchored slightly above center so the barbell stays in frame at all card heights).
- `background-repeat: no-repeat`
- `filter: saturate(0.85) contrast(1.05)` — slightly desaturates the source so the citron and forest tints downstream don't fight the photo's natural color, and bumps contrast 5% to keep the barbell readable through the tints.

### Layer 2 · Vertical readability gradient

```
linear-gradient(180deg,
  rgba(10, 24, 18, 0.78)  0%,
  rgba(17, 55, 31, 0.62)  40%,
  rgba(17, 55, 31, 0.48)  70%,
  rgba(17, 55, 31, 0.72)  100%)
```

Top-anchored (0.78) and bottom-anchored (0.72) tints to maximize legibility of the status pill at top and the CTAs at bottom. Mid (40–70%) lifts to ~0.5 opacity so the barbell can breathe through.

### Layer 3 · Diagonal forest tint (multiply)

```
linear-gradient(135deg, #1d4e3433 0%, #11371f55 100%)
mix-blend-mode: multiply
```

A diagonal forest/green-deep tint at low alpha (20–33%) blended via `multiply`. This pulls the photo into the design system's forest hue without crushing detail. Critical for brand cohesion across all 5 sizes — don't skip.

---

## Content layout

All content sits at `zIndex: 1` above the background stack. Card content padding: **22pt × 22pt**.

The content is a vertical stack of 6 elements with these margin-tops:

1. **Top row** (no margin)
2. **Title row** — margin-top 12pt
3. **Stat tiles** — margin-top 16pt
4. **Session progress bar** — margin-top 16pt
5. **Progress meta row** — margin-top 10pt
6. **CTA row** — margin-top 18pt

### 1 · Top row

`display: flex, justify-content: space-between, align-items: center`

**Left: active status pill**
- Background: citron `#cfde50`, color green-deep `#11371f`.
- Padding `3px 9px`, border-radius **99** (full pill).
- Layout: inline-flex, gap 6, align-center.
- Leading icon: 11×11 dumbbell SVG (line, 1.8pt stroke, `currentColor` so it inherits the green-deep). See `icons.jsx` → `I.dumbbell`. Stroke linecap/linejoin round.
- Label: `DAY 5 · SESSION 1` — Outfit, 11pt, weight 800, no special tracking.

**Right: plan caption**
- Text: `Day 5 / 30 · 4-week plan`
- Outfit, 12pt, weight 600, color `rgba(251, 246, 230, 0.78)` (cream @ 78%).
- Drop shadow on text: `0 1px 2px rgba(0,0,0, 0.4)` — keeps readability over photo regardless of gradient stop.

### 2 · Title row

`display: flex, align-items: flex-end, justify-content: space-between, gap: 14`

**Left: title block**
- Title: `Build Strong.` — Outfit, **52pt**, weight 800, letter-spacing **-0.04em**, line-height 0.92.
- Color: cream `#fbf6e6`.
- Text shadow: `0 2px 14px rgba(0,0,0, 0.45)` — wide soft black shadow for legibility over the photo.
- Period included — part of the system's voice.
- Subtitle (margin-top 4pt): `Resistance + injury prevention · 12 sessions`
  - Outfit, 13pt, weight 500, color `rgba(251, 246, 230, 0.78)`.
  - Text shadow: `0 1px 4px rgba(0,0,0, 0.45)`.

**Right: streak readout**
- Two-line stack, right-aligned, line-height 1.
- Big number: `5d` rendered as:
  - `5` — Outfit, **44pt**, weight 800, color citron, letter-spacing -0.035em, tabular-nums.
  - `d` — same font, **24pt**, margin-left 1pt.
- Citron text shadow: `0 0 18px #cfde5066` (citron glow).
- Caption (margin-top 4pt): `STREAK`
  - JetBrains Mono, 13pt, weight 700, letter-spacing **0.16em**, color `rgba(251, 246, 230, 0.65)`.

### 3 · Stat tiles row

`display: flex, gap: 10`

Three glassy tiles, each `flex: 1`:

**Glass tile base style (reused twice — extract as a token):**
```
background: rgba(10, 24, 18, 0.55)
backdrop-filter: blur(6px)
-webkit-backdrop-filter: blur(6px)
border: 1pt solid rgba(255, 255, 255, 0.10)
border-radius: 14pt
padding: 10pt × 12pt
```

**Tile content:**
- Label row (always): Outfit, **10pt**, weight 700, letter-spacing 0.08em, uppercase, color `rgba(251, 246, 230, 0.7)`.
- Value row (varies by tile):
  - `big` flag: 18pt, weight 800, margin-top 2pt, color citron, line-height 1.
  - default: 14pt, weight 700, margin-top 3pt, color cream, line-height 1.
  - `accent` flag: same as default size/weight but color citron.

| Tile           | Label        | Value     | big | accent |
|----------------|--------------|-----------|-----|--------|
| Top lift       | `Top lift`   | `185 lb`  | ✓   | —      |
| Volume / wk    | `Volume / wk`| `4.2k lb` | —   | —      |
| Δ Week         | `Δ Week`     | `+15 lb`  | —   | ✓      |

The first tile is the visual hero of the row (larger value, citron); the third tile is the call-out (smaller value but still citron); the middle tile is the neutral cream secondary value. Don't change this rhythm — it carries through to L and M sizes too.

### 4 · Session progress bar

`display: flex, gap: 3`

12 equal segments, each `flex: 1, height: 12pt, border-radius: 4pt`.

- Filled segments (index < `sessionsCompleted`, here 1): background citron, glow `0 0 10px #cfde50`.
- Empty segments: background `rgba(255, 255, 255, 0.18)` (18% white over the photo stack).

Total session count is fixed at 12; the filled count is dynamic (data-driven).

### 5 · Progress meta row

`display: flex, justify-content: space-between, font-size: 12, font-weight: 600`

Three spans separated by `justify-content: space-between`:

- **Left:** `<citron-bold>1</citron-bold>/12 sessions`
  - `1` → Outfit 12pt weight 800, color citron.
  - `/12 sessions` → Outfit 12pt weight 600, color cream at 0.7 opacity.
- **Center:** `25 days left` — Outfit 12pt weight 600, opacity 0.75.
- **Right:** `↑ On track` — Outfit 12pt weight 700, color citron.

All three carry the same `text-shadow: 0 1px 2px rgba(0,0,0, 0.4)` legibility shadow.

### 6 · CTA row

`display: flex, gap: 8`

**Primary CTA · `Start session 2 →`**
- `flex: 1` (takes the remaining width).
- Padding 14pt all around.
- Border-radius 16pt, border none.
- Background citron `#cfde50`, color green-deep `#11371f`.
- Label: Outfit, 14pt, weight 800, letter-spacing -0.01em.
- Trailing glyph: `→` baked into the label string (or rendered as a separate span if you want better control over its font).
- **Shadow stack** — this is the system's "solid + glow" button treatment:
  ```
  0 8px 18px rgba(207, 222, 80, 0.55%),
  0 0 0 4px rgba(207, 222, 80, 0.12)
  ```
  - First: deep citron drop shadow (the lift).
  - Second: 4pt soft citron halo (the glow) — a 0.12-opacity outset that fakes a focus ring. Important — the glow is what makes the CTA feel "live".

**Secondary CTA · `Plan`**
- Padding 14pt vertical × 18pt horizontal.
- Border-radius 16pt.
- **Same glass style as the stat tiles** (background, blur, border) but with a slightly stronger border: `1pt solid rgba(255, 255, 255, 0.22)` instead of 0.10.
- Color cream, Outfit 14pt weight 700.

The pairing rule across the system: a citron solid-glow primary + a glass secondary. Don't substitute outlines or ghosts here.

---

## Interactions

### Tap behavior

- **Card body** — tappable (excluding the CTA buttons). Navigates to the Build Strong detail screen.
- **Primary CTA** — direct-launches the next session (skips the detail screen). Pressed state: 96% scale, 200ms ease-out; shadow stack halves; brightness -8%.
- **Secondary CTA** — opens the program plan/calendar. Pressed state: same.
- **Streak readout** — tappable; opens the streak history sheet. (Optional in v1; add only if the app already has streak history elsewhere.)

### Loading state

- The card is rendered from cached data so it should never block paint. While the next-session payload is fetching, the primary CTA shows a small spinner replacing the arrow — do not change button size or shadow stack.

### Empty / fresh-user state

- If the user is on Day 1 / Session 0, change:
  - Active pill: `START · DAY 1`
  - Title subtitle: stays the same
  - Streak readout: `0d` (still citron)
  - Progress bar: 0 segments filled
  - Meta left: `0/12 sessions`
  - Meta right: omit `↑ On track`
  - Primary CTA: `Start session 1 →`
- (Not shown in the reference comp, but please scaffold.)

### Animations

- On mount: photo + tint fade in 200ms; content stagger-rises 8pt + fades in over 320ms with 60ms offsets per element (top row → title → tiles → bar → meta → CTAs).
- On a freshly completed session: when a new segment fills in the progress bar, scale 0 → 1 + 320ms glow pulse on the newly-filled segment.
- Reduced motion: disable all of the above — render in final state immediately.

---

## Design tokens

### Colors

```
greenDeep   #11371f    card bg base · CTA text on citron · forest-tint multiply stop
green       #1d4e34    forest-tint multiply gradient start
citron      #cfde50    THE accent · CTA · streak number · accent tile values · progress fill
cream       #fbf6e6    primary text on dark · secondary CTA text
ink         #10241a    deep ink (not used directly on this card; system token)
sub         #6b756f    sub text (not used directly here; system token)
```

### Typography

- **Outfit** (Google Fonts) — display + UI · weights 500, 600, 700, 800
- **JetBrains Mono** (Google Fonts) — metadata · weight 700

| Where                  | Family  | Size | Weight | Tracking |
|------------------------|---------|------|--------|----------|
| Title `Build Strong.`  | Outfit  | 52   | 800    | -0.04em  |
| Title subtitle         | Outfit  | 13   | 500    | normal   |
| Streak `5` digit       | Outfit  | 44   | 800    | -0.035em |
| Streak `d` suffix      | Outfit  | 24   | 800    | -0.035em |
| Streak caption         | JBMono  | 13   | 700    | 0.16em   |
| Active pill label      | Outfit  | 11   | 800    | normal   |
| Plan caption (top right)| Outfit | 12   | 600    | normal   |
| Tile label             | Outfit  | 10   | 700    | 0.08em   |
| Tile value (big)       | Outfit  | 18   | 800    | normal   |
| Tile value (normal)    | Outfit  | 14   | 700    | normal   |
| Meta row text          | Outfit  | 12   | 600/700/800 | normal |
| Primary CTA label      | Outfit  | 14   | 800    | -0.01em  |
| Secondary CTA label    | Outfit  | 14   | 700    | normal   |

### Spacing (used)

| pt   | use                                         |
|------|---------------------------------------------|
| 3    | progress-bar segment gap                    |
| 8    | CTA row gap                                 |
| 10   | stat tiles row gap · meta row vertical gap  |
| 12   | tile horizontal padding · title row top     |
| 14   | tile gap · CTA padding · title-row gap      |
| 16   | progress-bar top · stat-tiles top           |
| 18   | CTA row top · secondary CTA horizontal pad  |
| 22   | card content padding                        |

### Radius

- **30pt** — card outer (XL — the largest in the size ladder).
- **16pt** — CTAs.
- **14pt** — stat tiles.
- **4pt** — progress-bar segments.
- **99pt** — active pill (full pill).

### Shadows

```
card outer            0 14px 30px rgba(17,55,31, 0.42), inset 0 1px 0 rgba(255,255,255, 0.06)
text legibility       0 1px 2px rgba(0,0,0, 0.4)       (small captions over photo)
title legibility      0 2px 14px rgba(0,0,0, 0.45)     (52pt title)
subtitle legibility   0 1px 4px rgba(0,0,0, 0.45)
streak citron glow    text-shadow: 0 0 18px rgba(207,222,80, 0.4)
progress segment glow 0 0 10px #cfde50                 (per filled segment)
primary CTA           0 8px 18px rgba(207,222,80, 0.33), 0 0 0 4px rgba(207,222,80, 0.12)
```

### Glass style (shared between tiles + secondary CTA)

```
background: rgba(10, 24, 18, 0.55)
backdrop-filter: blur(6px)  (+ -webkit prefix)
border: 1pt solid rgba(255, 255, 255, 0.10)   // 0.22 on the secondary CTA
```

If the target platform doesn't support `backdrop-filter` (older Android WebView, some Flutter web targets), substitute with a flat `rgba(10, 24, 18, 0.78)` and drop the blur — the photo behind will mostly disappear, but the readability stays.

---

## Data binding

Props the component should accept (recommended interface for a production version):

```
{
  day: number,                  // 5
  totalDays: number,            // 30
  session: number,              // 1
  totalSessions: number,        // 12
  weeks: number,                // 4
  streakDays: number,           // 5
  topLift: { value: number, unit: 'lb' | 'kg' },     // { value: 185, unit: 'lb' }
  volumePerWeek: { value: number, display: string, unit: 'lb' | 'kg' },  // { display: '4.2k', unit: 'lb' }
  weekDelta: { value: number, unit: 'lb' | 'kg', direction: 'up' | 'down' | 'flat' },
  daysLeft: number,             // 25
  status: 'on-track' | 'behind' | 'ahead',
  nextSessionNumber: number,    // 2
  onPrimary: () => void,        // tap "Start session N"
  onPlan: () => void,           // tap "Plan"
  onTap: () => void,            // tap card body
  onStreakTap?: () => void,     // optional
}
```

The reference uses hard-coded display strings — your production version should derive them from the props.

---

## Assets

- `assets/buildstrong-barbell.png` — the gym-floor barbell photo. Bundled with this handoff. Original source: stock photography from the Subpar brand asset library. **At production, swap in the highest-resolution version available; this bundle has a web-optimized export.**
- `icons.jsx` → `I.dumbbell` — the small dumbbell icon used in the active pill. Currently inline SVG. In production, prefer the codebase's icon library equivalent if it has a matching minimal line-weight dumbbell at 1.8pt stroke.

---

## Fonts

Load **Outfit** and **JetBrains Mono** from Google Fonts (or self-host).

- Outfit weights needed: 500, 600, 700, 800
- JetBrains Mono weights needed: 700

On native: bundle the WOFF2/TTF in the app and register via Expo Font / native font registration. Do not fall back to system fonts for the title — Outfit's metrics at 52pt/-0.04em are core to the visual.

---

## Accessibility

- All tap targets ≥ 44 × 44pt. The streak readout (if made tappable) needs padding to reach the minimum.
- Contrast: cream-on-greenDeep ≥9:1, greenDeep-on-citron ≥5:1, all citron-on-photo readings preserve ≥4.5:1 thanks to the gradient stack + text shadows.
- Photo: provide an `accessibilityLabel` on the card body (e.g. "Build Strong training program, day 5 of 30, 1 of 12 sessions complete, current streak 5 days. Tap to open program.").
- Decorative captions (`DAY 5 · SESSION 1`, `STREAK`, `12 SESSIONS`) should be marked `accessibilityElementsHidden` — the same info is reachable from the card's main label.
- Support Dynamic Type / Android font scaling up to ~130%. The title flexes; the streak readout may need to drop one size tier; tiles may wrap to two lines at 130%.
- Reduced motion: disable mount stagger, progress-bar pulse, and CTA press scale.

---

## Files in this bundle

- `preview.html` — open in a browser to see the card rendered at 354×~440pt on a paper background. Requires all the other files in the same directory.
- `bs6-xl.jsx` — the React reference. Exports `BS6XL`. **All values are hard-coded for the design state shown in the reference** — props are the production team's job.
- `icons.jsx` — the shared inline icon set. Only `I.dumbbell` is used by this card.
- `assets/buildstrong-barbell.png` — the photo background asset.
