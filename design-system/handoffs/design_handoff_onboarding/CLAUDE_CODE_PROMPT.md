# Claude Code prompt — Onboarding flow

Copy/paste this into Claude Code (or another coding assistant) along with
the unzipped `design_handoff_onboarding/` folder attached.

---

I have a high-fidelity design handoff for the **first-run onboarding
flow** for Subpar (a golf-fitness app). The full spec is in the attached
folder.

**Start by reading `design_handoff_onboarding/README.md` end-to-end —
it's the source of truth for layout, colors, typography, copy, and
interaction behavior.** Then look at
`design_handoff_onboarding/onboarding-screens.jsx` for exact values and
markup, and the seven `screenshots/*.png` for the canonical renders
(welcome, plan empty/partial/full, challenge empty/getlong/getstrong).

## What I want you to do
Implement this 3-step onboarding flow in the Subpar codebase using its
existing conventions:

1. Detect the framework (React / React Native / SwiftUI / Flutter / etc.)
   and the established directory layout. Match it — don't introduce a new
   pattern.
2. Find the existing design-system tokens (theme, colors, typography,
   spacing) and reuse them. The hex values in the README come from the
   Subpar v3b system — they should already exist as tokens. If they
   don't, add them once at the token level rather than hard-coding them
   into these screens.
3. Find existing primitives (Button, Pill, Card, Radio, Eyebrow, Sheet)
   and reuse them. Only build new ones if nothing in the codebase fits.
4. Use the existing routing/navigation system — these are sequential
   steps with horizontal slide transitions.

## Critical implementation notes
- The flow has **three steps**: Welcome → Build Plan → Take Challenge,
  then exits into the Today screen. Step counter top-left, Skip top-right,
  page dots + CTA at the bottom.
- The **CTA is disabled** when its step has unmet requirements (no plan
  items selected on step 2, no challenge selected on step 3). Disabled =
  muted parchment `#e6e1d3`, no arrow, `cursor: not-allowed`. Don't just
  fade the button — match the disabled treatment exactly.
- Step 2 is **multi-select** (a set of track IDs). The "Select all" link
  flips to "Clear all" when everything is selected. Section counters
  (`2/3`) update live as items are added/removed.
- Step 3 is **single-select** with a *dimming effect on the unpicked
  card* (`opacity: 0.62, filter: saturate(0.7)`). Picking the same card
  again does NOT unselect. This is intentional — it makes the choice feel
  deliberate.
- The **brand mark** is the concentric ring in the README. If the
  codebase has a shipped logo, use that instead. If not, replicate the
  ring (it's a 3-circle SVG with a partial dash arc and a tiny flag
  inside).
- The **terminal period** in display titles (`works.`, `plan.`,
  `challenge.`) is colored with the citron accent. Don't strip it.
- Going **back preserves selections** — both the track set and the
  challenge id should persist across step navigation.
- On the final CTA: POST `{ tracks: [...], challenge: ... }` to the
  onboarding-complete endpoint (wire to whatever exists), then route to
  Today on success.

## After implementing
- Run the codebase's lint + typecheck.
- Add small tests covering: CTA disabled when nothing selected, "Select
  all" toggle behavior, section counter math, back-button preserves
  selections.
- Show me a screenshot or the dev-server URL when it's done.

If anything in the README is unclear or contradicts the codebase, ask
before guessing.
