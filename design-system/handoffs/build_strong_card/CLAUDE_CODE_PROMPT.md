# Claude Code prompt · implementing the BS6-XL Build Strong card

Copy-paste the prompt below into Claude Code after you've extracted this bundle into your repo (or placed it alongside so Claude Code can read both).

---

```
I'm implementing the BS6-XL Build Strong card — the largest variant of the Build Strong card family in my Golf Fitness mobile app. This card sits at the top of the Today screen when Build Strong is the active program.

I have a full design handoff in @design_handoff_bs6_xl/ — please start by reading README.md in that folder end-to-end. The HTML/JSX files in the bundle are design references only, NOT code to copy.

Your task:

1. Read @design_handoff_bs6_xl/README.md carefully. It specifies the photo background stack, every typography spec, color, spacing value, radius, shadow, blur, and the data-binding interface I'm recommending.

2. Survey my existing codebase:
   - Identify the framework (React Native, Expo, SwiftUI, Flutter, etc.)
   - Find the existing Today screen (where this card will live)
   - Find any existing Build Strong card variants (XS / S / M / L) if any exist — this is the XL of a 5-size ladder
   - Identify the design-token / theme system (NativeWind, styled-components, StyleSheet, design tokens file)
   - Identify the icon library and the image-component conventions (background images may need a specific component on RN — e.g. expo-image, FastImage, ImageBackground)
   - Identify whether backdrop-filter / blur surfaces are already used in the app and how (expo-blur, BlurView, custom shader)
   - Identify how the program/session/streak data is currently shaped in state — the card needs day/session/streak/topLift/volumePerWeek/weekDelta/daysLeft/status/nextSessionNumber

3. Report back with:
   - Framework + key libraries
   - Where the new component file should live and what to name it
   - Which existing components/tokens you'll reuse vs. need to build new
   - The data shape gap, if any — what fields are missing from the program model that this card needs
   - How you'll handle the blur:
       a. backdrop-filter (web / iOS WebView): native CSS
       b. RN: expo-blur BlurView around each tile
       c. Flutter: BackdropFilter widget
       d. Fallback for platforms without blur: flat rgba(10, 24, 18, 0.78) per README
   - The Subpar palette this design uses — add to your theme if missing:
       citron      #cfde50
       greenDeep   #11371f
       green       #1d4e34
       cream       #fbf6e6
   - Fonts to register if not already: Outfit (500/600/700/800), JetBrains Mono (700)
   - Whether the barbell photo asset goes in the codebase's asset pipeline as-is or needs reprocessing (compression / @1x/@2x/@3x for native)

4. WAIT for me to confirm before you start writing code. Don't start implementing until I've signed off on the plan.

5. When implementing:
   - Build as a **reusable component** that accepts the props interface in the README's "Data binding" section, NOT a hard-coded card. Even if I only need the XL today, this card is part of a size ladder and the props interface is the same across sizes.
   - The background is a STACK of three layers: photo, vertical gradient, diagonal forest-tint multiply. Match exactly. Filter on the photo (saturate 0.85, contrast 1.05) and the multiply blend on the third layer are both required for brand cohesion.
   - The text shadows on labels over the photo are not decorative — they're legibility hacks tuned to the gradient stack. Keep them.
   - The primary CTA uses a SPECIFIC two-stack shadow that makes it feel "live": `0 8px 18px rgba(207,222,80, 0.33), 0 0 0 4px rgba(207,222,80, 0.12)`. Match the second halo exactly — it's what separates this from a flat citron button.
   - The streak readout's citron glow is a text-shadow (`0 0 18px ...`), not a box-shadow. Don't substitute.
   - The progress bar's 12 segments are independently animatable — render each as its own element with the citron glow on filled state.
   - The glass style for stat tiles + secondary CTA is the same base — extract as a shared token/style.
   - Honor accessibility per README §Accessibility: 44pt tap targets, accessibilityLabel on the card body, hidden decorative captions, Dynamic Type support to ~130%, reduced-motion variants.

6. After the card is built, show me:
   - A screenshot/preview at 354pt wide on a paper background
   - The list of files you added or changed
   - Any deviations from the design you made and why
   - Whether you scaffolded the other sizes (XS / S / M / L) as part of the same component or left them for a follow-up

Things explicitly OUT of scope unless I say otherwise:
- The Build Strong program detail screen the card taps into
- The session-runner screen the primary CTA launches
- The streak history sheet
- The other card families (Drain It, Get Long) — those are separate handoffs

Constraints:
- Don't introduce a new state-management library — use whatever's already in the project
- Don't change the existing theme structure — extend it
- Don't bring the HTML preview into the real app
- Don't copy the inline-styled JSX from bs6-xl.jsx verbatim; translate to the codebase's styling system

Ready when you are — start with step 1.
```

---

## Tips for the handoff

- Drop the entire `design_handoff_bs6_xl/` folder into your repo root (or wherever Claude Code can read it). The `@design_handoff_bs6_xl/README.md` reference in the prompt assumes that location.
- Open `preview.html` in a browser yourself first so you can show Claude Code a screenshot if it asks for visual reference. It renders the card at native 354pt width on a paper background.
- The barbell photo asset is included as-is from the design system. If your codebase already has a higher-res master, use that — the bundled file is web-optimized.
- If you've already shipped earlier handoffs (Sign-In screen, Speed Training screens), most of the Subpar palette and fonts will already be in the theme — Claude Code will detect that in step 2.
- If you want Claude Code to scaffold the other sizes (XS/S/M/L) in the same pass, say so explicitly in step 5 — the size ladder is documented in `card-buildstrong.jsx` in your design system project (not in this bundle, but you can paste the file in if needed).
