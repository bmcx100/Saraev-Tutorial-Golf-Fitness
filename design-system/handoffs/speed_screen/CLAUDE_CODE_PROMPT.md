# Claude Code prompt · implementing the Golf Fitness Speed Training screens

Copy-paste the prompt below into Claude Code after you've extracted this bundle into your repo (or placed it alongside so Claude Code can read both).

---

```
I'm implementing two redesigned screens for my Golf Fitness mobile app:
  1. Speed Training · Normal Stance (entry flow, 3 sticks × 2 cells)
  2. Speed Training · Max Out (final drill, 2 clubs × 1 cell each)

I have a full design handoff in @design_handoff_speed_training/ — please start by reading README.md in that folder end-to-end. The HTML/JSX files in the bundle are design references only, NOT code to copy.

Your task:

1. Read @design_handoff_speed_training/README.md carefully. It specifies every color, font, size, spacing, border radius, shadow, and interaction for both screens, plus shared elements (forest hero, custom keypad, section heading, CTA).

2. Survey my existing codebase:
   - Identify the framework (React Native, Expo, SwiftUI, Flutter, etc.)
   - Find the existing Speed Training screen or drill flow if any exists
   - Identify the design-token / theme system (NativeWind, styled-components, StyleSheet, design tokens file, etc.)
   - Identify the icon library, custom keyboard handling, and form-input conventions
   - Identify the navigation library and where session-summary lives
   - Identify how local-state-per-drill is currently persisted

3. Report back with:
   - The framework + key libraries you found
   - Where the two new screens should live (file paths)
   - Which existing components you'll reuse vs. need to build new
   - Any tokens missing from my theme that I need to add. The Subpar palette this design depends on:
       forest      #1d4e34
       green-deep  #11371f
       g7          #6db483 (= stick-green)
       stick-blue  #5e7eb8 (tuned, NOT iOS blue)
       stick-red   #cc6f4a (= clay)
       citron      #cfde50
       cream       #fbf6e6
       paper       #f7f4ea
       ink         #0e2118
       sub         #6b756f
       rule        #e2dcc0
   - Fonts to add: Outfit (400/500/600/700/800) and JetBrains Mono (500/600/700)
   - Anything in the design that conflicts with patterns already in the codebase so we can decide together

4. WAIT for me to confirm before you start writing code. Don't start implementing until I've signed off on the plan.

5. When implementing:
   - Build the SHARED parts first as reusable components, in this order:
       a. `ForestHero` — takes props for active-tab index, PR number, PR caption, eyebrow text
       b. `Keypad` — fully reusable custom numeric input
       c. `SectionHeading` — title + eyebrow + helper + progress counter
       d. `CTABar` — citron primary action
       e. `StickPillar` — handles active/muted variants and DOM/NON-DOM cells
       f. `DriverPillar` — the Max Out driver variant
   - Then assemble the two screens from those components
   - Match the design pixel-perfectly using the codebase's idioms (translate inline styles to whatever styling system is in use)
   - The keypad is a CUSTOM input — don't fall back to the platform numeric keyboard. The whole input flow must run through the custom keypad
   - Cell focus, NEXT, and DELETE behaviors must work as specified (see README "Interactions & Behavior")
   - The "best of 3 swings" logic stores all swings and reads back the max
   - Persist drill state locally on every keystroke so a backgrounded app doesn't lose progress
   - Driver-head SVG: in production, recommend bumping the cap from 26×20 to ~34×24 for clarity, and DROP the tiny citron ball-dot inside the silhouette (it doesn't read at this scale). The README also notes this.
   - Honor accessibility: 44pt tap targets, screen-reader labels per pillar/cell, Dynamic Type up to ~130%, reduced-motion variants

6. After both screens are built, show me:
   - A screenshot/preview of each
   - The list of files you added or changed
   - Any deviations from the design you made and why
   - What's left to wire up — Step Drill is the same shape as Normal Stance (just the helper copy differs); did you scaffold it?

Things explicitly OUT of scope unless I say otherwise:
- The session-summary screen the Max Out CTA navigates to
- The Today screen these flows are launched from
- Multi-language / RTL support
- Tablet / iPad layouts

Constraints:
- Don't introduce a new state-management library — use whatever's already in the project
- Don't change the existing theme structure — extend it
- Don't bring the iOS-frame chrome from the reference into the real app
- Don't copy the inline-styled JSX from these files verbatim; translate to the codebase's styling system

Ready when you are — start with step 1.
```

---

## Tips for the handoff

- Drop the entire `design_handoff_speed_training/` folder into your repo root (or wherever Claude Code can read it). The `@design_handoff_speed_training/README.md` reference in the prompt assumes that location.
- Open `preview.html` in a browser yourself first so you can show Claude Code a screenshot if it asks for visual reference. It renders both screens side-by-side.
- Step Drill uses the same component as Normal Stance — same 3 sticks × 2 cells — with just the helper copy differing. If you want Claude Code to scaffold Step Drill in the same pass, mention it explicitly in step 5.
- If you already shipped the Sign-In screen handoff, mention that — many of the shared tokens and the forest hero pattern will already be in the theme.
