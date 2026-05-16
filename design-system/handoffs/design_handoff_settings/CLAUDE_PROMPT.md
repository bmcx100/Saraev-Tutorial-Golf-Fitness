# Claude Code prompt — Subpar Settings screen

Paste the block below into Claude Code from the root of the Subpar repo, after dropping the contents of `design_handoff_settings/` somewhere visible in the project (e.g. `docs/handoff/settings/`).

---

I'm implementing a redesigned Settings screen in this app. A complete design spec is in `docs/handoff/settings/`.

**Start here:**
1. Read `docs/handoff/settings/README.md` end to end — it has the visual spec, tokens, and behavior.
2. Open every PNG in `docs/handoff/settings/screenshots/` and look at it. There are six (one per state).
3. Open `docs/handoff/settings/settings-screen.jsx` — it is the source-of-truth React component; treat the styles inside as the spec.
4. Open `docs/handoff/settings/pillars-shared.jsx` — these are the color tokens (`SPColors`). Match these exactly.

**The bundled HTML/JSX files are design references, not production code.** Don't copy the markup verbatim. Recreate the screens in this repo's existing environment (React Native components, navigation, theme, etc.), reusing whatever primitives we already have for Toggle, Pressable rows, dividers, screen padding, and so on.

**Before you start coding, do this:**
- Find where Settings is rendered today and where it sits in the nav stack. Tell me the file path.
- Find our existing Toggle component (or native Switch wrapper).
- Find our existing color/theme constants. Check whether the tokens in `pillars-shared.jsx` are already represented — if so, map to the existing names; if not, propose adding them to the theme module.
- Find where icons live (probably an SVG library or a custom set). Identify which of the icons listed in the README we already have vs. need to add (terminal, target/crosshair, golf driver, tee, runner, cardio line, etc.).

**Then implement, in this order:**
1. The accordion shell — `<SettingsScreen>` with one-section-open-at-a-time state. Hard-code the section labels and skip the bodies for now; just get the headers (collapsed + expanded forest-tile look) rendering correctly.
2. The bodies, one at a time, in this order: Tracking → Notifications → Preferences → Account → Dev Tools. Wire each body to its real data source as you go (selectors, toggles, time pickers, etc.).
3. Confirm Dev Tools is gated behind whatever debug flag we already use elsewhere — don't ship it to production users.
4. Pop the back arrow, sign-out alert, and destructive confirmations.

**Constraints:**
- Match the spec pixel-for-pixel: colors, radii, paddings, type sizes, letter spacings. The README has all of them.
- No new colors outside `SPColors` + the functional tokens (`#3aa57c` toggle on, `#cdd0c8` toggle off, etc.) listed in the README.
- One section open at a time (accordion behavior).
- Use the codebase's existing typography setup. If we don't have JetBrains Mono / Outfit loaded yet, add them via whatever font-loading pattern this repo uses (don't hard-code a `<link>` tag inline).
- The 32×32 forest-icon tile in the expanded header is the chosen treatment ("B · Forest icon tile"). Don't substitute another header style.
- Destructive buttons (Sign Out / Reset / Clear All) all use the same outlined-clay style — do not introduce a filled red button.

**When you're done:**
- List every file you created or modified.
- Show me the diff for the Settings screen route + any theme additions.
- Tell me if anything in the spec was ambiguous so I can clarify rather than you guessing.

If at any step you can't find the file/component/token I'm referring to, stop and ask. Don't invent paths.
