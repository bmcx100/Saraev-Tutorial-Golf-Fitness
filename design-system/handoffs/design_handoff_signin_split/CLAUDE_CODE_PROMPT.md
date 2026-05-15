# Claude Code prompt · implementing the Golf Fitness sign-in screen

Copy-paste the prompt below into Claude Code after you've extracted this bundle into your repo (or sit it alongside your repo so Claude Code can read both).

---

```
I'm implementing a redesigned sign-in screen for my Golf Fitness mobile app. I have a full design handoff in @design_handoff_signin_split/ — please start by reading README.md in that folder end-to-end. The HTML/JSX files in the bundle are design references only, NOT code to copy.

Your task:

1. Read @design_handoff_signin_split/README.md carefully. It specifies every color, font, size, spacing, and interaction.

2. Survey my existing codebase:
   - Identify the framework (React Native, Expo, SwiftUI, Flutter, etc.)
   - Find the existing auth flow / sign-in screen if one exists
   - Identify the design-token / theme system (NativeWind, styled-components, StyleSheet, design tokens file, etc.)
   - Identify the icon library and form-input component conventions
   - Identify the navigation library
   - Identify how Google OAuth is wired (if at all)

3. Report back with:
   - The framework + key libraries you found
   - Where the new sign-in screen should live (file path)
   - Which existing components you'll reuse vs. need to build new
   - Any tokens missing from my theme that I'll need to add (the design uses a specific Subpar palette — forest #1d4e34, green-deep #11371f, citron #cfde50, cream #fbf6e6, paper #f7f4ea, clay #cc6f4a — and Outfit + JetBrains Mono fonts)
   - Anything in the design that conflicts with patterns already in the codebase, so we can decide together

4. WAIT for me to confirm before you start writing code. Don't start implementing until I've signed off on the plan.

5. When implementing:
   - Match the design pixel-perfectly using the codebase's idioms (not the inline-style React in the reference)
   - Add Outfit + JetBrains Mono to the font registration if they aren't already there
   - Build the BrandMark and ProgressRing as reusable components — the brand mark appears across the app and the ring motif is on the home screen too
   - Keep the citron CTA's interaction polish (press scale, loading spinner that doesn't resize the button)
   - Wire up real form validation and the error states described in the README
   - Use the platform's official Google Sign-In SDK, not a hand-rolled OAuth flow
   - Store auth tokens in the secure store (Keychain / EncryptedSharedPreferences / expo-secure-store), never in plain storage
   - Make the screen accessible: 44pt tap targets, proper label associations, support Dynamic Type up to ~130%

6. After the screen is built, show me:
   - A screenshot/preview
   - The list of files you added or changed
   - Any deviations from the design you made and why
   - What's left to wire up (e.g. "the magic-link screen is referenced but not built — want me to scaffold it next?")

Things explicitly OUT of scope unless I say otherwise:
- The Sign-up screen (only linked from this screen)
- The Magic-link request screen (only linked)
- The Forgot-password flow (only linked)
- The Today screen (just navigate to it after success)

Constraints:
- Don't introduce a new state-management library — use whatever's already in the project
- Don't change the existing theme structure — extend it
- Don't bring the iOS-frame chrome from the reference into the real app
- Don't copy the inline-styled JSX from signin-screens.jsx verbatim; translate to the codebase's styling system

Ready when you are — start with step 1.
```

---

## Tips for the handoff

- Drop the entire `design_handoff_signin_split/` folder into your repo root (or wherever Claude Code can read it). The `@design_handoff_signin_split/README.md` reference in the prompt assumes that location.
- Open `preview.html` in a browser yourself first so you can show Claude Code a screenshot if it asks for visual reference.
- If your repo already has a strong design-token file, you may want to feed Claude Code a pointer to that file in step 2 — it'll help them figure out where to extend.
- If you're using Expo Router / React Navigation, mention the route name you want for the screen (e.g. `/sign-in` or `(auth)/sign-in`) — saves a round-trip.
