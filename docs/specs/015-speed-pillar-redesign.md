# Spec 015: Speed Training — Pillar Redesign

## What This Feature Does

Replaces the current speed training wizard UI with a Subpar v3 "pillars" visual treatment. Three drill tabs — Normal Stance, Step Drill, Max Out — live inside a single screen with a forest-gradient hero, stick-shaped input pillars, a custom keypad, and a citron CTA. The data model, storage, and session logic are unchanged (14 fields, one value each). This is a visual-only redesign.

**Design reference:** `docs/specs/design-system/handoffs/speed_screen/README.md` — the authoritative source for every color, font size, spacing, border-radius, shadow, and animation value. This spec covers architecture and behavior; the handoff covers pixel specs.

## Current State

`app/speed.tsx` (496 lines) renders a 3-step wizard: Normal Stance → Step Drill → Max Out. It uses the old `useColors()` theme hook, `MaterialIcons`, and plain `StyleSheet` without Subpar v3 tokens. The custom numpad (`components/speed-numpad.tsx`) is a basic 4×3 grid with a Tab key. Input fields (`components/speed-input-field.tsx`) are simple bordered boxes.

- Stick colors in `constants/speed-protocols.ts:23-27` use Tailwind-ish hues (`#22C55E`, `#3B82F6`, `#EF4444`), not the Subpar palette.
- The discard modal (`app/speed.tsx:446-474`) uses the old theme and generic styling.
- Session data: `SpeedSession` in `constants/speed-protocols.ts:14-21` stores `number | null` per cell (14 total). `SpeedStats` in `utils/storage.ts:170-174` tracks `driverPR`.
- Session count is not tracked anywhere — must be derived from AsyncStorage keys.

## Changes Required

### 1. Design Tokens — Add `stickBlue`

In `constants/design-tokens.ts`, add after the accent colors:

```typescript
// Speed stick colors
export const stickBlue = '#5e7eb8';

export const stickColors = {
  green: G7,         // #6db483
  blue: '#5e7eb8',
  red: clay,         // #cc6f4a
} as const;
```

### 2. Update Stick Colors in `speed-protocols.ts`

Replace the `STICK_COLORS` array colors with design-system values:

```typescript
import { stickColors } from '@/constants/design-tokens';

export const STICK_COLORS: { key: StickColor; label: string; color: string }[] = [
  { key: 'green', label: 'Green', color: stickColors.green },
  { key: 'blue',  label: 'Blue',  color: stickColors.blue },
  { key: 'red',   label: 'Red',   color: stickColors.red },
];
```

### 3. New Component: `components/speed/forest-hero.tsx`

Full-width hero with rounded bottom corners (radius 28). Forest→greenDeep gradient via `expo-linear-gradient`. Topo SVG lines overlay (reuse path shapes from `components/today/topo-background.tsx` with G7 stroke, opacity 0.28, stroke-width 0.9).

**Props:**
```typescript
interface ForestHeroProps {
  activeTab: 0 | 1 | 2;              // Normal, Step, Max Out
  onTabChange: (index: number) => void;
  sessionNumber: number;              // derived from stored session count
  prValue: number | null;             // from SpeedStats.driverPR
  prCaption: string;                  // 'PR \u00b7 MPH' or 'DRIVER PR'
  onBack: () => void;
}
```

**Contains:**
- Back button (36×36 round, cream chevron).
- Eyebrow caption: `DAY 1 · SESSION {n}` (Normal/Step) or `DAY 1 · SESSION {n} · DRILL 3 / 3` (Max Out). Protocol day tracking is out of scope — hardcode `DAY 1` for now.
- Title row: "Get Long" eyebrow (citron) + "Speed Training." title (cream) on left. PR number (citron, JetBrains Mono 22pt) + caption on right.
- Tab segmented control: 3 tabs (Normal / Step Drill / Max Out), freely tappable. Active tab: citron background, greenDeep text. Inactive: transparent, cream text at 0.7 opacity.

### 4. New Component: `components/speed/keypad.tsx`

Replaces `components/speed-numpad.tsx`. Paper background, rule top border. 4×3 grid, each cell 56pt tall with hairline grid dividers.

**Props:**
```typescript
interface KeypadProps {
  onDigit: (d: string) => void;
  onDelete: () => void;
  onNext: () => void;
}
```

**Keys:** 1–9 (JetBrains Mono 24pt, weight 600), 0, NEXT (bottom-left: skip arrow icon + mono label), DELETE (bottom-right: 56×34 greenDeep pill with cream backspace icon). Long-press delete clears the focused cell.

### 5. New Component: `components/speed/section-heading.tsx`

**Props:**
```typescript
interface SectionHeadingProps {
  eyebrow: string;       // 'DRILL \u00b7 1 OF 3'
  title: string;         // 'Normal Stance.'
  helper: string;        // '3 sticks \u00b7 swing 3\u00d7 \u00b7 best wins'
  progressNum: string;   // '1 / 6'
  progressCaption: string; // 'SWINGS'
}
```

### 6. New Component: `components/speed/cta-bar.tsx`

Full-width citron button at bottom. White background container with rule top border.

**Props:**
```typescript
interface CTABarProps {
  label: string;         // 'Log 117 mph' or 'Submit 117 mph'
  glyph: string;         // '\u2192' or '\u2713'
  onPress: () => void;
  loading?: boolean;
}
```

Press animation: 96% scale, brightness -8%, shadow halved.

### 7. New Component: `components/speed/speed-cell.tsx`

Single input cell used inside pillars. Two size variants:

- **Small** (Normal Stance / Step Drill): eyebrow DOM/NON-DOM (8pt), number 19pt, "mph" suffix 8pt.
- **Large** (Max Out): eyebrow SPEED (9pt), number 40pt, "mph" suffix 9pt.

**Props:**
```typescript
interface SpeedCellProps {
  label: string;         // 'DOM', 'NON-DOM', 'SPEED'
  value: number | null;
  focused: boolean;
  muted: boolean;        // true for inactive pillars
  accentColor: string;   // stick color for tint
  variant: 'small' | 'large';
  onPress: () => void;
}
```

**States:** Empty (dashed border, `——` placeholder), focused (2pt solid forest border, accent tint background), filled (solid value in greenDeep), muted (rule dashed border, dimmed placeholder).

### 8. New Component: `components/speed/swing-dots.tsx`

Decorative 3-dot pill at pillar bottom edge. Static — all 3 dots always empty (the dots remind the user to swing 3 times physically; no functional tracking).

**Props:**
```typescript
interface SwingDotsProps {
  color: string;   // stick color for filled dots (unused now, but wired for future)
  muted: boolean;
}
```

### 9. New Component: `components/speed/stick-pillar.tsx`

Vertical pillar for Normal Stance / Step Drill. Contains:
1. Tee cap (20pt colored circle, or 14pt StickRing when muted).
2. Grip band (stick-colored or paper-toned when muted).
3. Shaft with 2 SpeedCells (DOM + NON-DOM) + SwingDots at bottom.
4. Active indicator arrow above cap when active.

**Props:**
```typescript
interface StickPillarProps {
  stick: StickColor;
  active: boolean;
  domValue: number | null;
  nonDomValue: number | null;
  focusedCell: 'dom' | 'nonDom' | null;
  onCellPress: (cell: 'dom' | 'nonDom') => void;
}
```

### 10. New Component: `components/speed/driver-pillar.tsx`

Max Out driver variant. White pill cap with inline driver-head SVG (use simplified 34×24 wedge silhouette, no citron ball-dot). GreenDeep grip band. Single large SpeedCell.

**Props:**
```typescript
interface DriverPillarProps {
  active: boolean;
  value: number | null;
  focused: boolean;
  onCellPress: () => void;
}
```

### 11. Rewrite `app/speed.tsx`

Keep `ProtocolPicker` (restyle with Subpar v3 tokens). Replace `SpeedWizard` entirely:

**State:** Same as today — `session: SpeedSession`, `activeField: FieldId | null`, `step: number` (0/1/2), `errors: Set<string>`, `showDiscard: boolean`. Add `sessionNumber: number` and `driverPR: number | null` loaded on mount.

**Session number derivation (on mount):**
```typescript
const allKeys = await AsyncStorage.getAllKeys();
const sessionCount = allKeys.filter(k => k.startsWith('speed-session-')).length;
setSessionNumber(sessionCount + 1); // current session is N+1
```

**Tab behavior:** Freely navigable. Tapping any tab switches the drill view. No sequential enforcement.

**Field focus:** Tapping a cell sets it as active. Keypad NEXT advances through the current drill's fields in order (same as today's Tab behavior). After the last field in a drill, NEXT does nothing (user taps the CTA or switches tabs).

**CTA behavior:**
- Normal Stance / Step Drill: label shows `Log {value} mph →` (value from focused cell, or just `Log mph →` if no cell focused). Commits the current value and advances to the next empty cell in the current drill. If all cells in the drill are filled, advances to the next tab.
- Max Out: label shows `Submit {value} mph ✓`. If all 14 fields are filled, submits the session (same logic as today's `handleSubmit`). If fields are missing, highlights empty fields and shows error state.

**Discard modal:** Restyle with Subpar v3 tokens — paper background, forest/citron buttons, Outfit typography. Trigger on back-press when `hasAnyData()` is true.

**Layout (Normal Stance / Step Drill):** ForestHero → SectionHeading → 3 StickPillars in a flex row (gap 10, padding 8/14/18) → Keypad → CTABar.

**Layout (Max Out):** ForestHero → SectionHeading → 2 pillars in a flex row (Green StickPillar with single SPEED cell + DriverPillar, gap 14, padding 8/16/20) → Keypad → CTABar.

### 12. Delete Old Components

Remove `components/speed-numpad.tsx` and `components/speed-input-field.tsx`. Verify no other screen imports them.

## Key Implementation Details

- **No data model changes.** `SpeedSession`, `SpeedStats`, storage functions, and the submit flow are untouched. The redesign is visual only.
- **Use design tokens directly** (`forest`, `citron`, `cream`, `paper`, etc.) instead of the `useColors()` hook. The speed screen is effectively light-theme-only.
- **Stale closure prevention:** Continue using `useRef` for session state in callbacks, same pattern as current code.
- **Topo SVG paths:** Adapt the 4 curved paths from the design handoff's `ForestHero` SVG. The existing `topo-background.tsx` has different paths for card vs. full-page — create a new `heroTopo` path set rather than overloading.
- **Animations:** Mount: hero topo fade-in 400ms, pillars stagger up 12pt + fade (60ms offsets). Cap glow: 200ms ease-out on pillar activation. CTA press: 96% scale. Use `react-native-reanimated` for all.
- **Accessibility:** 44pt minimum tap targets. Screen-reader groups per pillar. Focused cells announce state. Decorative elements `aria-hidden`. Dynamic Type support up to 130%.
- **Auto-advance on 3 digits:** Keep the existing behavior — when the user types a 3rd digit, focus auto-advances to the next field in the current drill.

## Acceptance Criteria

- [ ] Speed screen uses Subpar v3 design system (forest hero, citron accents, Outfit/JetBrains Mono typography)
- [ ] Three drill tabs (Normal / Step Drill / Max Out) are freely tappable
- [ ] Normal Stance and Step Drill show 3 stick pillars with DOM + NON-DOM cells each
- [ ] Max Out shows 2 pillars (Green Stick + Driver) with single SPEED cell each
- [ ] Active pillar has colored cap, grip band, white shaft, citron cap glow; inactive pillars are muted
- [ ] Custom keypad with NEXT key, delete pill, and hairline grid replaces old numpad
- [ ] Tapping a cell focuses it; keypad input updates the focused cell
- [ ] NEXT key advances focus through the current drill's fields in order
- [ ] Auto-advance after 3 digits typed
- [ ] CTA shows current value and commits/advances appropriately per drill
- [ ] Max Out Submit validates all 14 fields are filled; highlights empties if not
- [ ] Discard modal triggers on back-press with data entered, styled with Subpar v3
- [ ] Session submits to AsyncStorage and marks speed-training habit done (unchanged logic)
- [ ] Hero shows derived session number and driver PR from SpeedStats
- [ ] Stick colors use design-system values (G7 green, #5e7eb8 blue, clay red)
- [ ] Protocol picker still works (restyle only)
- [ ] Decorative swing dots render at bottom of each pillar
- [ ] Mount animations: topo fade-in, pillar stagger
- [ ] All tap targets >= 44pt; screen-reader labels on pillars and cells

## Files to Touch

- `constants/design-tokens.ts` — add `stickBlue`, `stickColors` map
- `constants/speed-protocols.ts` — update `STICK_COLORS` to use design-token colors
- `app/speed.tsx` — full rewrite (keep ProtocolPicker logic, replace SpeedWizard)
- `components/speed/forest-hero.tsx` — **new** — hero with gradient, topo, tabs, PR
- `components/speed/keypad.tsx` — **new** — custom numeric input
- `components/speed/section-heading.tsx` — **new** — title + progress counter
- `components/speed/cta-bar.tsx` — **new** — citron action button
- `components/speed/speed-cell.tsx` — **new** — input cell (small + large variants)
- `components/speed/swing-dots.tsx` — **new** — decorative 3-dot pill
- `components/speed/stick-pillar.tsx` — **new** — Normal/Step pillar
- `components/speed/driver-pillar.tsx` — **new** — Max Out driver pillar
- `components/speed-numpad.tsx` — **delete**
- `components/speed-input-field.tsx` — **delete**
