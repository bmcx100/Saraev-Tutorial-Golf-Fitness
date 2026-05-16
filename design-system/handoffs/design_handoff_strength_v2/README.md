# Handoff: Subpar · Strength Training (Smart next-set)

## Overview
The strength-training session screen for Subpar. The user opens a planned
workout (e.g. Week 3 · Day 2 · Legs 1) and works through ~4 exercises ×
3 sets each. This redesign replaces a tap-to-expand-to-edit + number-pad
pattern with a single big "Log Set N" button per exercise — log a set in
one tap at the planned weight × reps. Editing weight/reps is the secondary
path and lives in a sheet, not inline.

## About the Design Files
The files in this bundle are **design references created in HTML** —
prototypes showing the intended look and behavior. They are **not
production code to copy verbatim.** Your job is to **recreate this screen
in the target codebase's existing environment** (React Native, SwiftUI,
Flutter, whatever Subpar already ships in), using its established
component library, theme tokens, and design patterns.

If no environment exists yet, pick the framework that best fits the rest
of the product and implement there.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interaction
states are all locked in. Recreate pixel-perfectly using the codebase's
existing tokens and components — match the prototype exactly on
**390 × 844 pt** (iPhone 14-class device).

If the prototype's values disagree with the existing Subpar v3b design
system, the design system wins. The values listed in this README all come
from v3b.

---

## Screens / Views

There's one screen. It has four exercises stacked, each rendered as an
**ExerciseCard** in one of three states. See
`screenshots/01-strength-default.png` for the canonical render.

### Page anatomy (top → bottom)

1. **iOS status bar** (system)
2. **Forest hero** — full-bleed forest gradient, 28px bottom corner radii
3. **Exercise list** — vertical stack of `ExerciseCard`s (12px gap, 14px h-padding)
4. **Submit CTA** — bottom bar, 1px top border, white background

### Forest hero (`StrengthHero`)
- Background: `linear-gradient(160deg, #1d4e34 0%, #11371f 100%)` — 50px top padding for status-bar inset, 12px bottom
- Decorative topo-line SVG overlay at `opacity 0.28`, stroke `#6db483` (see Assets)
- Bottom-left/right corners: `border-radius: 28`
- **Row 1**: 32 × 32 round back-chevron tile (`rgba(251,246,230,0.10)` bg, `cream` icon) + mono "WK 3 · DAY 2" label (9.5px / 0.24em / `rgba(251,246,230,0.6)`)
- **Row 2** (flex space-between, items-end):
  - Left column:
    - Eyebrow: `BUILD STRONG` — 11px / 800 / 0.22em / `#cfde50` (citron) mono uppercase
    - Title: `Strength Training.` — 26px / 800 / -0.035em / `#fbf6e6` (cream), period in same color
    - Muscle chip: `QUADS · 4 EXERCISES` — citron text on `rgba(207,222,80,0.18)` pill with 1px citron-alpha border, 10px / 700 / 0.18em mono
  - Right column (right-aligned):
    - Progress: `4 / 12` — 22px / 700 / `#cfde50` citron mono with `0 0 14px rgba(207,222,80,0.4)` text-shadow
    - Sub-label: `SETS DONE` — 9.5px / 700 / 0.2em mono on `rgba(251,246,230,0.6)`
- **Row 3** — 4-tab strip:
  - Container: 4px padding, `rgba(251,246,230,0.10)` bg, 1px `rgba(251,246,230,0.16)` border, 14px radius
  - Tabs: equal flex, 7×4 padding, 10px radius. Active tab = citron bg + `#11371f` text; inactive = transparent + `rgba(251,246,230,0.7)` text
  - Tab labels: `LEGS 1` / `PULL` / `LEGS 2` / `PUSH` — 11px / 800 / 0.04em uppercase Outfit

### ExerciseCard — three tones: `done`, `next`, `idle`

The card is a rounded white surface that **changes radically based on
state**. Each card has the same three internal rows but different
emphasis.

#### Tone: `idle` (default — exercise not started)
- Background: `#fff`
- Border: `1px solid #e2dcc0` (rule)
- Border-radius: `18`
- Padding: `12px 14px`
- Box-shadow: `0 1px 0 rgba(17,55,31,0.04)` (almost invisible)
- Title: `15.5px / 800 / -0.018em` ink
- Value pills (`WEIGHT 50 lb` / `REPS 8 reps`): dashed `1.5px #e2dcc0` border, transparent bg, value in `rgba(14,33,24,0.55)` (faded)
- 3-dot progress: 3 small 7×7 dots in `rgba(14,33,24,0.15)`
- Log Set button: small (10×14 padding, 13px text), white bg, 1.5px `#e2dcc0` border, `#1d4e34` text, no shadow
- No subtitle, no badge

#### Tone: `next` (the active exercise — the one the user is working on)
This is where the design lives or dies. The active card has to *visually
shout* "you are here."
- Background: `linear-gradient(180deg, #ffffff 0%, #fbfaf2 100%)`
- Border: `2px solid #cfde50` (citron, full thickness)
- Border-radius: `18`
- Padding: `14px 14px` (a hair larger than idle)
- Transform: `translateY(-1px)` (subtle lift)
- Box-shadow — three stacked layers for the citron halo + lift:
  ```
  0 0 0 4px rgba(207,222,80,0.20),
  0 18px 30px rgba(17,55,31,0.18),
  0 4px 10px rgba(17,55,31,0.10)
  ```
- **Floating badge** at top-left, straddling the border:
  - Absolute, `top: -10px, left: 14px`
  - `padding: 3px 9px`, 99px radius
  - Citron bg, `#11371f` text
  - 9px / 800 / 0.20em mono, no wrap
  - Box-shadow: `0 4px 10px rgba(207,222,80,0.5)`
  - Text: `NOW · SET {N}` where N = `done + 1`
- Title: bumped to `17px / 800` ink
- **Subtitle directly under title**: `TAP A VALUE TO ADJUST` — 10px / 700 / 0.16em forest mono
- Value pills: white bg, 1.5px solid forest border, value in deep-green `#11371f`, inset/outset shadow: `0 4px 10px rgba(17,55,31,0.10), inset 0 1px 0 rgba(255,255,255,0.6)`
- 3-dot progress: completed dots in citron (`14×7px pill, 0 0 6px rgba(207,222,80,0.5)` glow); next-up dot in forest (`7×7`); future in faded ink
- Log Set button: **big and citron** — 13×14 padding, 15px / 800 text, citron bg, `#11371f` text, mono `→` arrow on the right (14px), shadow: `0 10px 22px rgba(207,222,80,0.45), inset 0 1px 0 rgba(255,255,255,0.45)`

#### Tone: `done` (exercise fully logged)
- Background: `#fff`
- Border: `1px solid #e2dcc0`
- Border-radius: `18`
- Opacity: `0.78` (slightly faded so the active card visually dominates)
- Title: 15.5px / 800 ink
- Value pills: `#f7f4ea` paper bg, 1px `#e2dcc0` border, value in `#11371f` (logged values)
- 3-dot progress: 3 citron pills with citron glow
- Log Set button: replaced by a "done pill" — `rgba(207,222,80,0.20)` bg, 1px citron border, `#11371f` text, leading check icon, text `3 of 3 done`

### Value pill (`ValuePill`)
- `64px min-width`, 12px radius, 7×10 padding
- Column layout: small mono `WEIGHT` / `REPS` label on top, then value + unit on a baseline row
- Label: 9px / 700 / 0.18em mono `#5d6e64`
- Value: 19px / 700 / -0.02em mono `#11371f`, tabular-nums, fontVariantNumeric
- Unit: 9.5px / 600 / 0.04em mono `#5d6e64`
- **Tap to edit** → opens a weight/reps adjust sheet (modal). The sheet is OUT OF SCOPE for this prototype; spec it independently or reuse the codebase's number-input pattern. Recommended: a half-sheet with ±5 lb and ±1 rep steppers, plus a "apply to: this set / remaining / all" scope toggle.

### Submit CTA bar (`SubmitCTA`)
- Sits below the card list, full width, white bg, 1px `#e2dcc0` top border
- 12×18 padding, 22px bottom-padding (safe-area)
- Button: full-width, 16px radius, 14×18 padding
- Two states based on `progress`:
  - **Incomplete** (default while `done < total`): `rgba(207,222,80,0.35)` bg, `rgba(17,55,31,0.5)` text, no shadow. Still tappable (user might submit partial workout), but visually muted.
  - **Complete** (`done === total`): `#cfde50` bg, `#11371f` text, shadow `0 10px 22px rgba(207,222,80,0.32), inset 0 1px 0 rgba(255,255,255,0.4)`
- Layout: 15px / 800 / -0.005em `Submit Workout` (left) · 13px / 700 / 0.06em mono `{progress} SETS` (right)

---

## Interactions & Behavior

### Primary path — "tap to log"
1. App opens. First exercise is marked `next` (active card glows).
2. User taps **Log Set N** button on the active card.
3. The set is logged at the current `weight × reps` target. Animations:
   - Card pulses citron once
   - 3-dot progress fills the next dot to citron
   - `NOW · SET N` badge increments
   - `Log Set N` button label increments
4. After the 3rd set on an exercise, the card transitions to `done` tone
   (opacity 0.78, dots all citron, button → "3 of 3 done" pill) and the
   NEXT exercise in the list transitions from `idle` → `next` (becomes the
   glowing card). Scroll the list so the new active card is centered.

### Editing weight / reps
- Tap either value pill (`WEIGHT 50 lb` or `REPS 8 reps`) on any card.
- A half-modal sheet opens with ± steppers (5 lb / 1 rep).
- Sheet has a scope toggle: `this set` / `remaining sets` / `all sets`.
- Default scope = `this set` (don't disturb the program).
- Confirm → sheet dismisses, value pill updates in place.
- Cancel → sheet dismisses, no change.

### Tab strip (Legs 1 / Pull / Legs 2 / Push)
- Switching tabs navigates to a different planned workout for the same week.
- Don't allow switching with unsaved progress on the current workout — show
  a confirm sheet ("Discard 4 logged sets?") or auto-save and switch.

### Back / cancel
- Top-left back chevron returns to the program view. Auto-save current progress.

### Submit Workout
- Tap → server commit, then route to a workout summary screen (out of scope).
- If `done < total`, show a confirm sheet ("Submit with 8 sets remaining?").

### Animation tokens (suggested)
- Card tone transitions: 240ms ease-out
- Citron pulse on log: 320ms ease-in-out, single
- Dot-progress fill: 180ms ease-out
- Active-card transform: 240ms cubic-bezier(0.2, 0.7, 0.3, 1)

### Loading / error states
- **Logging a set**: optimistic — UI updates instantly, queue server commit.
  On failure, show a snackbar at the bottom (clay color `#cc6f4a`,
  "Couldn't save set 2. Retry."), unwind the set's logged state.
- **Submit**: spinner replaces the CTA label until server confirms; route
  on success, show retry on failure.

### Responsive
- Target is iPhone (390 × 844). For wider phones, content centers and tops
  out at `max-width: 430px`. For tablets / web, cap at `480px` and add
  side breathing room. The hero stays full-bleed.

---

## State Management

```ts
type WorkoutState = {
  weekDay: { week: number; day: number };       // 'WK 3 · DAY 2'
  splitTab: 'legs1' | 'pull' | 'legs2' | 'push';
  exercises: Exercise[];
};

type Exercise = {
  id: string;
  name: string;          // 'Tib Raises'
  weight: number;        // lb (default target)
  reps: number;          // default target
  total: number;         // sets planned (usually 3)
  sets: LoggedSet[];     // length 0..total
};

type LoggedSet = {
  weight: number;        // actual logged
  reps: number;
  timestamp: number;
};
```

### Derived state per card
- `done = sets.length`
- `tone`:
  - `'done'` if `done >= total`
  - `'next'` if this is the first exercise (in list order) with `done < total`
  - `'idle'` otherwise
- `label` (CTA text):
  - `done` → `"3 of 3 done"`
  - `next` → `"Log Set " + (done + 1)`
  - `idle` → `"Log Set 1"`

### Aggregate progress for hero + submit
- Total planned sets = `sum(e.total)` across all exercises
- Total done = `sum(e.sets.length)`
- Display as `"{done} / {total}"`

### Transitions
- `tapLogSet(exerciseId)`: append `{ weight: e.weight, reps: e.reps, t: now }` to `e.sets`
- `editTarget(exerciseId, scope, { weight, reps })`:
  - `scope === 'this set'` — adjust ONLY the upcoming set (store override, don't change `e.weight`)
  - `scope === 'remaining'` — set `e.weight/reps` to new values for sets `done..total-1`
  - `scope === 'all'` — update `e.weight/reps` and rewrite the logged sets too (rare)
- `submit()`: POST `WorkoutState` to `/api/workouts/{id}/log`

---

## Design Tokens

### Colors

| Token | Hex | Use |
|---|---|---|
| `forest` (G3) | `#1d4e34` | Hero gradient (top), value-pill border on active, dot of "next set", forest text |
| `greenDeep` (G2) | `#11371f` | Hero gradient (bottom), CTA text on citron, badge text, value-pill numbers |
| `g7` | `#6db483` | Topo line stroke on the hero |
| `citron` (Y5) | `#cfde50` | Active card border + halo, NOW badge bg, Log Set button bg, completed dots, hero progress number, hero tab active bg |
| `cream` | `#fbf6e6` | Hero text |
| `paper` | `#f7f4ea` | Page bg, done-card value-pill bg |
| `rule` | `#e2dcc0` | Idle card borders, submit-bar top border, dashed pill borders |
| `ink` | `#0e2118` | Body text, card titles |
| `sub` | `#5d6e64` | Mono labels on pills, subtitles |
| `clay` | `#cc6f4a` | Error snackbar (not currently rendered) |

### Typography
- **Outfit** (Google Fonts) — display + body
- **JetBrains Mono** (Google Fonts) — labels, metrics, badges (always tabular-nums where digits)

Sizes used here (rounded):
- Hero title: 26 / 800 / -0.035em / 0.95
- Hero progress: 22 / 700 / mono / tabular-nums
- Hero tab label: 11 / 800 / 0.04em / uppercase
- Active card title: 17 / 800 / -0.018em
- Idle/done card title: 15.5 / 800
- Active CTA: 15 / 800 / -0.01em
- Idle/done CTA: 13 / 800
- Value pill value: 19 / 700 / mono / tabular-nums
- Value pill label: 9 / 700 / 0.18em / mono / uppercase
- Mono eyebrow on active card: 10 / 700 / 0.16em
- NOW badge: 9 / 800 / 0.20em / mono / uppercase
- Bottom CTA: 15 / 800 main · 13 / 700 mono progress

### Spacing & radii
- Page h-padding: 14 (lists), 18 (hero, submit bar)
- Inter-card gap: 12
- Inside-card gap: 10
- Card radius: 18
- Hero bottom radius: 28
- Value pill radius: 12
- CTA radius: 14 (per card), 16 (bottom submit)
- Tab strip radius: 14 outer, 10 inner

### Shadows
| Use | Value |
|---|---|
| Idle card | `0 1px 0 rgba(17,55,31,0.04)` |
| Active card stack | `0 0 0 4px rgba(207,222,80,0.20), 0 18px 30px rgba(17,55,31,0.18), 0 4px 10px rgba(17,55,31,0.10)` |
| NOW badge | `0 4px 10px rgba(207,222,80,0.5)` |
| Log Set (next) | `0 10px 22px rgba(207,222,80,0.45), inset 0 1px 0 rgba(255,255,255,0.45)` |
| Active value pill | `0 4px 10px rgba(17,55,31,0.10), inset 0 1px 0 rgba(255,255,255,0.6)` |
| Hero active tab | `0 6px 12px rgba(207,222,80,0.25), inset 0 1px 0 rgba(255,255,255,0.35)` |
| Submit CTA (complete) | `0 10px 22px rgba(207,222,80,0.32), inset 0 1px 0 rgba(255,255,255,0.4)` |

---

## Assets

All assets are inline SVGs in `strength-next-set.jsx`. No image files
needed.

- **CheckIcon** — 24×24 viewbox, stroke 3, used in done-card pill + Submit when complete
- **BackIcon** — 24×24 viewbox, stroke 2, used in the hero back tile
- **Topo lines** — 4-curve SVG overlay drawn into the hero gradient at opacity 0.28, stroke `#6db483`. Tune curves to taste; the prototype's curves are hand-tuned to feel natural.

### Fonts
Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700;800&display=swap" rel="stylesheet"/>
```

---

## Files

| File | Purpose |
|---|---|
| `Strength Training.html` | Open in a browser to see the prototype rendered in an iOS frame. Reference, not production. |
| `CLAUDE_CODE_PROMPT.md` | Ready-to-paste prompt for Claude Code (or any coding assistant) to implement this screen. |
| `strength-next-set.jsx` | All source for the screen — hero, ExerciseCard (all 3 tones), Value pill, Log Set button, Submit CTA. Source of truth for every measurement, color, and copy string. |
| `ios-frame.jsx` | Device bezel — not relevant to production, only used by the prototype HTML. |
| `screenshots/01-strength-default.png` | The canonical render at native 390 × 844. |

When in doubt, read `strength-next-set.jsx`.

---

## Exploration history

This is **variant C** from a three-variant exploration:
- **A · Drawer** — pencil icon per card opens an inline stepper drawer with scope toggle (`this set / remaining / all`).
- **B · Long-press** — same drawer, invoked by long-press; cleanest look, gesture has discoverability cost.
- **C · Smart next-set** (THIS) — single big "Log Set N" button, active card glows hard, editing handled by a sheet.

C won because it's the most efficient default flow: 1 tap per set, the
active card is unmistakable, and the screen stays compact (4 cards
visible without scroll).
