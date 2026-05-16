# Claude Code prompt — Strength Training screen

Copy/paste this into Claude Code (or another coding assistant) along with
the unzipped `design_handoff_strength_v2/` folder attached.

---

I have a high-fidelity design handoff for the **Strength Training session
screen** for Subpar (a golf-fitness app). The full spec is in the attached
folder.

**Start by reading `design_handoff_strength_v2/README.md` end-to-end —
it's the source of truth for layout, colors, typography, copy, and
interaction behavior.** Then look at
`design_handoff_strength_v2/strength-next-set.jsx` for exact values and
markup, and `design_handoff_strength_v2/screenshots/01-strength-default.png`
for the canonical render.

## What I want you to do
Implement this screen in the Subpar codebase using its existing
conventions:

1. Detect the framework (React / React Native / SwiftUI / Flutter / etc.)
   and the established directory layout. Match it — don't introduce a new
   pattern.
2. Find the existing design-system tokens (theme, colors, typography,
   spacing) and reuse them. The hex values in the README come from the
   Subpar v3b system — they should already exist as tokens. If they don't,
   add them once at the token level rather than hard-coding them into this
   screen.
3. Find existing primitives (Button, Pill, Card, Sheet, BottomSheet) and
   reuse them. Only build new ones if nothing in the codebase fits.
4. Build the screen using **dynamic state**, not hard-coded fixtures —
   wire it to whatever workout/session model the codebase already has.
   The data shape in the README (`WorkoutState`, `Exercise`, `LoggedSet`)
   is a suggestion; adapt it to existing models.

## Critical implementation notes
- The screen has **three card tones** (`idle`, `next`, `done`). Derive
  the tone from state — never store it. `next` = the first exercise where
  `done < total`. Done's opacity dim (0.78) matters; don't skip it.
- The **active card glow** is intentional and load-bearing — three
  stacked shadows plus a 2px citron border, a 1px upward translate, and a
  floating "NOW · SET N" badge. Match it precisely; this is what tells
  the user where they are.
- Logging a set is **optimistic** — update UI instantly, queue the commit,
  unwind on failure with a clay-colored snackbar.
- The weight/reps **edit sheet is intentionally out of scope of this
  handoff**. Build a small half-sheet using the codebase's existing
  bottom-sheet primitive: ± steppers (5 lb / 1 rep) and a "apply to: this
  set / remaining / all" scope toggle, default `this set`. Tap on a value
  pill opens this sheet.
- The number pad from the previous version is **gone**. No keypad
  anywhere on this screen.
- Use **tabular numerics** on every metric: `font-variant-numeric:
  tabular-nums`. Numbers must align column-to-column.

## After implementing
- Run the codebase's lint + typecheck.
- Add a small test that exercises tone derivation (3 exercises in
  different states → expect first incomplete to be `next`, others `idle`,
  fully-logged → `done`).
- Show me a screenshot or the dev-server URL when it's done.

If anything in the README is unclear or contradicts the codebase, ask
before guessing.
