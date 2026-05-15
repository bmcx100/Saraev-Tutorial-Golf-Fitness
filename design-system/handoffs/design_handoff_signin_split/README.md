# Handoff: Golf Fitness · Sign-In Screen (C-Split)

## Overview

A redesigned sign-in screen for the **Golf Fitness** mobile app (Subpar v3 design system). Replaces the existing generic green/white sign-in with a brand-forward two-band layout: a forest-green hero on top featuring the brand mark and a concentric-ring motif, with a white form card overlapping the seam into a warm paper-colored lower section.

## About the Design Files

The files in this bundle are **design references created in HTML/React** — prototypes showing intended look and behavior, not production code to copy directly. Your task is to **recreate the design in the target codebase's existing environment** (likely React Native, SwiftUI, Flutter, or similar for the mobile app) using its established patterns, component library, navigation, and form handling. If no environment exists yet, choose the most appropriate stack for a fitness mobile app and implement there.

The reference `.jsx` files use inline-styled vanilla React for design illustration. They are **not architected for production** — do not lift the inline-style approach into the real codebase. Translate styles into the codebase's styling system (NativeWind, styled-components, StyleSheet, etc.).

## Fidelity

**High-fidelity.** All colors, typography, spacing, border radii, and shadows are specified at production values. The developer should recreate the UI pixel-perfectly within the target framework's idioms.

## Screen: Sign In

### Purpose
The user authenticates to access their Golf Fitness training program. They either:
1. Sign in with email + password
2. Sign in with Google OAuth
3. Navigate to "Forgot password"
4. Navigate to "Create an account" (new user signup)
5. Request a magic-link email instead

### Frame
- Target frame: **390 × 844 pt** (iPhone 14/15 reference). Layout must scale gracefully to larger phones; small phones (375 × 667) should still fit without scroll if possible.
- Status bar: dark mode (white icons over forest hero).
- Safe area top ≈ 47pt accounted for in the 360pt hero height.

### Layout Structure

The screen has three vertically-stacked regions:

1. **Forest hero band** — 360pt tall, full width, dark forest gradient background, rounded bottom corners (`borderBottomLeftRadius: 36, borderBottomRightRadius: 36`).
2. **Form card** — Overlaps the hero by 50pt (`marginTop: -50`), inset 18pt from each side, white background, 24pt corner radius, large soft shadow.
3. **Footer links** — Centered vertically below the form card on the paper background, with 20pt top padding and ~28pt bottom padding for home indicator clearance.

The page background outside the hero is **paper `#f7f4ea`**.

---

### Region 1 · Forest hero (top)

**Background**
- Gradient: `linear-gradient(160deg, #1d4e34 0%, #11371f 100%)` (forest → green-deep)
- Bottom corners rounded 36pt; top corners square (status bar bleeds into the dark band)
- Overflow hidden

**Decoration 1 · Topo lines (SVG, behind everything)**
- 5–6 curved horizontal lines spanning the full width, suggesting topographic contour lines
- Stroke: `#6db483` (G7), opacity ~0.32, stroke-width 0.9
- See `signin-screens.jsx` → `TopoLines` for exact path definitions
- `preserveAspectRatio="xMidYMid slice"`, viewBox tuned for 390×360

**Decoration 2 · Concentric ring motif (SVG, top-right)**
- Positioned absolutely: `right: -80, top: -40` (bleeds off the corner)
- 280 × 280pt SVG with three concentric circles at radii 120/92/64
- Inner two rings: `rgba(251,246,230, 0.18 / 0.12)` (subtle cream)
- Outermost ring: `rgba(207,222,80, 0.32)` (citron at low alpha) **plus** a citron `#cfde50` arc dash on top — `strokeDasharray` set so 18% of the circle's circumference is solid, rotated -90° (starts at 12 o'clock). Stroke-width 3, round linecap.
- This is the brand's "progress ring" motif from the home screen — keep it; it carries strong continuity.

**Content** (relative, inside `padding: 64px 24px 0`)

a) **Brand row** (flex, gap 12)
   - Brand mark (see below) at 42pt
   - Mono caption: `SUBPAR · v3` — JetBrains Mono, 10pt, weight 700, letter-spacing 0.3em, color `rgba(251,246,230, 0.55)`

b) **Eyebrow** (margin-top 20pt)
   - Text: `Welcome back`
   - JetBrains Mono, 11pt, weight 800, letter-spacing 0.22em, uppercase
   - Color: citron `#cfde50`

c) **Headline** (margin-top 8pt)
   - Text: `Golf Fitness.` (period included — part of the system's voice)
   - Outfit, 48pt, weight 800, letter-spacing -0.045em, line-height 0.92
   - Color: cream `#fbf6e6`

d) **Subtitle** (margin-top 6pt)
   - Text: `Train smarter · play better.`
   - Outfit, 14pt, weight 500
   - Color: `rgba(251,246,230, 0.72)` (cream @ 72%)

#### Brand mark (`BrandMark`, 42pt on this screen)

A small custom SVG composed of:
- Outer ring · 2pt stroke, color `rgba(251,246,230, 0.22)` (cream @ 22% on dark)
- Middle ring · same treatment
- Inner solid citron disc `#cfde50`
- Tiny green-deep flag (pole + triangle pennant) centered on the disc
- A cream arc dash overlaid on the outer ring (32% of circumference, rotated -78°) — visualizes "in progress"

See `signin-screens.jsx` → `BrandMark` for exact geometry. The arc radii are derived from `size/2 - 4`, then `-9`, then `-9` again. Reuse this mark across the app (it appears in the splash, header, achievements).

---

### Region 2 · Form card (overlaps hero)

**Container**
- Margin: `-50px 18px 0` (pulls upward into the hero by 50pt)
- Background: white `#ffffff`
- Border: 1pt solid `#e2dcc0` (rule)
- Border radius: 24pt
- Padding: 22pt × 20pt
- Shadow: `0 22px 40px rgba(17,55,31, 0.18)` (forest-tinted shadow)
- Vertical layout: flex column, gap 12pt between children

**Header row** (flex, baseline-aligned, space-between)
- Left: `Sign in` — Outfit, 19pt, weight 800, letter-spacing -0.02em, color `#11371f` (green-deep)
- Right: `DAY 1 · ACTIVE` — JetBrains Mono, 10pt, weight 700, letter-spacing 0.2em, color `#6b756f` (sub)
  - This mono caption is decorative — it ties to the home screen "Day 1" state. If your auth model has no concept of "Day 1" yet, replace with a tagline like `RETURNING` or omit; do not invent state.

**Email field** — `Field` component
- Eyebrow label above: `EMAIL` — JetBrains Mono, 9.5pt, weight 700, letter-spacing 0.22em, uppercase, color `#6b756f`, margin-bottom 6pt
- Input container: flex row, gap 10pt, background white, 1pt border `#e2dcc0`, 14pt radius, padding 12pt × 14pt
- Leading icon: 14×14 mail icon (line, 1.8 stroke). Color when empty: `#9aa39c`. Color when focused/filled: `#0e2118`.
- Placeholder: `you@golf.com` — Outfit 15pt weight 500, color `#9aa39c`
- Filled text: same size/weight, color `#0e2118` (ink), letter-spacing -0.005em
- Focus state (not shown in mock — please add): border becomes `#1d4e34` (forest), 1.5pt; subtle forest-tinted focus ring `0 0 0 4px rgba(29,78,52, 0.12)`

**Password field** — same shape as email
- Eyebrow: `PASSWORD`
- Leading icon: 14×14 lock icon (line, 1.8 stroke)
- Placeholder: bullets `••••••••••` (do not render literal asterisks; the input itself should be `type="password"`)
- Trailing affordance to add: a small eye-toggle button to show/hide password. JetBrains Mono "SHOW" / "HIDE" caption is on-brand if a glyph feels wrong.

**Forgot link row** (flex, justify-end)
- Text: `Forgot? ↗`
- JetBrains Mono, 11pt, weight 700, color forest `#1d4e34`
- Tap target ≥ 44pt height — wrap the visible text in a touchable with vertical padding

**Primary CTA · `Tee it up`**
- Background: citron `#cfde50`
- Text color: green-deep `#11371f`
- Border: none
- Radius: 14pt
- Padding: 14pt × 18pt
- Layout: flex row, space-between, align-center
- Left text: `Tee it up` — Outfit 15pt weight 800, letter-spacing -0.005em
- Right glyph: `→` — JetBrains Mono 14pt weight 700
- Shadow: `0 10px 22px rgba(207,222,80, 0.30)` PLUS an inset top highlight `inset 0 1px 0 rgba(255,255,255, 0.4)`
- Pressed state: 96% scale, shadow -50% intensity, brightness -8%
- Loading state: replace text with a small spinner in green-deep on the citron; do not change button size

**OR divider**
- Flex row, gap 10pt, align-center, margin-top 2pt
- Left/right: 1pt rule `#e2dcc0`, `flex: 1`
- Center: `OR` — JetBrains Mono 9.5pt weight 600/700, letter-spacing 0.32em, color `#9aa39c`

**Secondary CTA · `Continue with Google`**
- Background: white
- Border: 1pt `#e2dcc0`
- Text color: `#0e2118` (ink)
- Radius: 14pt
- Padding: 12pt × 18pt
- Layout: flex row, center, gap 10pt
- Left: 15×15 Google "G" SVG (the standard 4-color mark — use the official Google branding guideline asset from your platform's SDK; do not hand-redraw)
- Label: `Continue with Google` — Outfit 13.5pt weight 700

---

### Region 3 · Footer (on paper background)

- Container padding: 20pt top, 24pt sides, 28pt bottom
- Flex column, align-center, gap 8pt

a) **Sign-up link**
   - Plain text + link, Outfit 13pt weight 600
   - Plain part: `New here? ` — color green-deep `#11371f`
   - Link part: `Create an account` — color clay `#cc6f4a`, weight 700, underline with `text-decoration-color: rgba(204,111,74, 0.4)` (40% clay)
   - Whole thing is the tap target; underline only on the link span

b) **Magic-link link**
   - Text: `USE MAGIC LINK ↗`
   - JetBrains Mono 10pt weight 600, letter-spacing 0.24em, color `rgba(29,78,52, 0.5)` (forest @ 50%)
   - Tappable, navigates to the magic-link request screen

---

## Interactions & Behavior

### Field focus
- On focus, animate border `#e2dcc0` → `#1d4e34` (forest) over 120ms ease-out
- Add a 4pt focus ring `rgba(29,78,52, 0.12)` simultaneously
- Eyebrow label above the field shifts color from `#6b756f` → `#1d4e34` on focus

### Validation
- Email: validate format on blur; show inline error below the field
- Password: minimum 8 chars (or whatever the API enforces); validate on blur or on submit
- Error state styling: border `#cc6f4a` (clay), eyebrow color `#cc6f4a`, error message Outfit 12pt weight 600 clay, with 6pt top margin

### Submit
- Disable button + show spinner while request is in flight
- On 401/invalid: clear password field, focus password input, show single error: `Email or password doesn't match.` (Outfit 13pt weight 600 clay, mounted directly above the CTA inside the card)
- On success: navigate to Today screen with a soft cross-fade (200ms)

### Google OAuth
- Use platform-native flow (ASWebAuthenticationSession on iOS, Custom Tabs on Android, or `expo-auth-session` if Expo). Do not embed a webview.
- While OAuth is in flight, show a small spinner replacing the Google "G" icon; disable both buttons.

### Magic link
- Tapping `USE MAGIC LINK` navigates to a separate screen (out of scope here) where the user enters just their email and receives a one-tap link.

### Keyboard
- When the keyboard appears, the form card should scroll into view such that the password field bottom edge sits ≥ 12pt above the keyboard. The hero is allowed to slide partially off-screen.
- Return key on email: focus password. Return on password: submit.

### Animations
- On screen mount: hero topo lines fade in over 400ms; brand mark and headline slide up 12pt + fade in (staggered 80ms, 200ms ease-out)
- Concentric-ring citron arc has an optional 1.4s "draw-in" animation from 0% → 18% on mount (stroke-dashoffset)
- CTA shadow lifts slightly on press (-2pt y offset, brightness -8%)

## State Management

Minimal local state for the screen:
- `email: string`
- `password: string`
- `submitting: boolean`
- `error: string | null`
- `googleSubmitting: boolean`
- `passwordVisible: boolean`

Auth itself lives in the global auth store/context (whatever pattern the app uses). On successful sign-in, store token via the platform secure store (`expo-secure-store`, Keychain, EncryptedSharedPreferences) — never `AsyncStorage`/`localStorage`.

## Design Tokens

### Colors
```
forest        #1d4e34   primary brand · CTAs on light · gradients
green-deep    #11371f   text on light · gradient bottom · button text on citron
g7            #6db483   topo line color
g8            #92cba2   sage surface (not used in Split)
g9            #bcdfc6   sage accent (not used in Split)
citron        #cfde50   single accent color · primary CTA · brand mark center
cream         #fbf6e6   text on dark · brand mark accents
paper         #f7f4ea   page background (outside hero)
rule          #e2dcc0   borders, dividers
clay          #cc6f4a   tertiary accent · "Create account" link · error states
ink           #0e2118   primary body text on light
sub           #6b756f   secondary text on light
```

### Typography
- **Outfit** (Google Fonts) — display + UI · weights 400, 500, 600, 700, 800
- **JetBrains Mono** (Google Fonts) — metadata · weights 500, 600, 700

| Token     | Size | Weight | Line   | Tracking  | Use here                          |
|-----------|------|--------|--------|-----------|-----------------------------------|
| display/l | 48   | 800    | 0.92   | -0.045em  | `Golf Fitness.` headline          |
| title/m   | 19   | 800    | —      | -0.02em   | `Sign in` card title              |
| body/md   | 15   | 800    | —      | -0.005em  | CTA labels                        |
| body/md   | 14   | 500    | —      | —         | Hero subtitle                     |
| body/sm   | 13.5 | 700    | —      | —         | Google button label               |
| body/sm   | 13   | 600/700| —      | —         | Footer sign-up link               |
| caption   | 11   | 800    | —      | 0.22em    | `WELCOME BACK` eyebrow            |
| eyebrow   | 10   | 700    | —      | 0.30em    | `SUBPAR · v3` mono caption        |
| eyebrow   | 10   | 700    | —      | 0.24em    | Footer magic-link caption         |
| mono/sm   | 9.5  | 700    | —      | 0.22em    | Field labels (`EMAIL`, `PASSWORD`)|
| mono/sm   | 9.5  | 600    | —      | 0.32em    | `OR` divider                      |
| mono/md   | 10   | 700    | —      | 0.2em     | `DAY 1 · ACTIVE` mono caption     |
| mono/md   | 11   | 700    | —      | 0.04em    | `Forgot? ↗` link                  |

### Spacing
The app uses an 4pt scale, but the sign-in screen lands on these specific values:
- Card inner padding: 22pt vertical, 20pt horizontal
- Field-to-field gap: 12pt
- Hero content padding: 64pt top, 24pt sides
- Form card horizontal inset: 18pt
- Form card vertical overlap into hero: -50pt
- Footer padding: 20pt top, 24pt sides, 28pt bottom

### Radius
- Cards: 24pt
- Hero bottom corners: 36pt
- Fields + CTAs: 14pt
- Pills / tags: 99pt (full pill)

### Shadows
- Form card: `0 22px 40px rgba(17,55,31, 0.18)` (forest-tinted)
- Citron CTA: `0 10px 22px rgba(207,222,80, 0.30)` + inset top highlight `inset 0 1px 0 rgba(255,255,255, 0.4)`

## Assets

- **Brand mark** — built inline as SVG in `signin-screens.jsx` (`BrandMark`). Reproduce as a reusable component in the codebase. Should accept `size` and `onDark` props.
- **Topo lines** — inline SVG (`TopoLines` in `signin-screens.jsx`). Reusable; appears across the app.
- **Concentric ring decoration** — inline SVG in `SigninSplit`. The motif appears throughout the app (home screen progress ring, achievements). Build as a parametric component: `<ProgressRing size pct stroke trackColor accentColor />` and reuse here with `pct=0.18`.
- **Mail / Lock icons** — inline 1.8-stroke SVG, 14×14. Use your icon library equivalents (Feather, Lucide, SF Symbols, Material) if they match the line weight; otherwise inline.
- **Google "G" mark** — 4-color official Google brand mark. Use the platform's official Google Sign-In SDK asset rather than the inline SVG in the reference; the reference is approximate.

## Fonts

Load Outfit and JetBrains Mono from Google Fonts (or self-host). Required weights:
- Outfit: 400, 500, 600, 700, 800
- JetBrains Mono: 500, 600, 700

On native: bundle the WOFF2/TTF in the app and register via Expo Font / native font registration. Do not rely on system fallbacks for display text — the entire visual system depends on Outfit's metrics.

## Accessibility

- All tap targets ≥ 44 × 44pt (including the small "Forgot?" and "MAGIC LINK" links — pad them)
- Color contrast: cream-on-forest (≥ 9:1), green-deep-on-citron (≥ 5:1), sub-on-white (≥ 4.5:1) — all pass WCAG AA
- The mono eyebrow `DAY 1 · ACTIVE` is decorative — mark `aria-hidden` / `accessibilityElementsHidden`
- Form labels: the visible mono eyebrows above each field are the labels — wire them via `aria-labelledby` or the native equivalent. Do not rely on placeholder-as-label
- Submit button announces loading state changes
- Support iOS Dynamic Type / Android font scaling — the layout should reflow gracefully up to ~130% scale

## Files in this bundle

- `preview.html` — open in a browser to see the screen rendered at 390 × 844 inside an iOS frame. Requires the other files alongside it.
- `signin-screens.jsx` — the React reference implementation. Contains all three explored variants; **only `SigninSplit` is the one to implement** (the other two — `SigninForest`, `SigninSage` — are kept for context on the design exploration).
- `ios-frame.jsx` — the iOS device chrome used by the preview only. Do not port — your real app already has a real device.
- `icons.jsx` — the shared inline icon set referenced by the brand mark. The Mail and Lock icons used in the form are defined directly inside `signin-screens.jsx`.
