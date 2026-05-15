# Spec 016: Build Strong Hero Card (BS6-XL)

## What This Feature Does

Replaces the current medium-sized Build Strong card in the `UpNextHero` component with a full-sized XL hero card when the gym habit is up next. The BS6-XL is the largest variant of the Build Strong card family — photo background with forest-tint stack, glassy stat tiles (top lift, weekly volume, week delta), a 12-segment progress bar, streak readout, and a paired CTA (citron "Start session N" + glass "Plan"). This card is built as a standalone reusable component with a props interface shared across the future size ladder (XS/S/M/L/XL).

## Current State

### Existing Build Strong Card (BS6-M)

`components/today/up-next-hero.tsx:170-314` contains a `StrengthHeroContent` function and a `strength` branch in the `UpNextHero` component. This renders a medium-sized card with:

- Barbell photo background via `ImageBackground` + two `LinearGradient` overlays (vertical forest tint + diagonal green wash) — same 3-layer stack the XL uses
- "DAY N · LABEL" citron pill + counter text
- "Build Strong." title at 40pt + subtitle
- Streak readout (32pt number + "d" suffix + "STREAK" label in JetBrains Mono)
- Segmented progress bar (9pt height, 3px gap, citron fill with shadow glow)
- Progress footer (session count, days left, volume delta)

Missing from the M variant that the XL adds: glass stat tiles, dual CTA row, larger typography (52pt title, 44pt streak), 12pt progress segments, secondary "Plan" button.

### Data Source

`hooks/use-strength-hero-stats.ts` exports `StrengthHeroData`:
```ts
{
  streak: number;
  topLift: number | null;
  volumeWeek: number | null;
  volumeDelta: number | null;
  nextWorkoutLabel: string;
  nextWorkoutSubtitle: string;
}
```

Challenge context (day, totalDays, sessionsCompleted, daysLeft) comes from `app/(tabs)/index.tsx:196-210` via `activeChallenge` and computed values.

### Design Tokens

`constants/design-tokens.ts` already has all colors (`citron`, `greenDeep`, `forest`, `cream`, `G1`–`G10`), all font families (Outfit 400–800, JetBrains Mono 500–800), spacing scale, and radii including `cardXl: 30`.

### Assets

`assets/images/buildstrong-barbell.png` already exists and is `require()`'d in the current `UpNextHero`.

## Changes Required

### 1. New Component: `components/today/build-strong-hero.tsx`

Create a standalone BS6-XL card component. Do NOT modify `UpNextHero` — this is a separate component.

**Props interface:**
```ts
interface BuildStrongHeroProps {
  day: number;
  totalDays: number;
  session: number;            // sessions completed so far
  totalSessions: number;      // always 12 for Build Strong
  weeks: number;
  streakDays: number;
  topLift: { value: number; unit: 'lb' | 'kg' } | null;
  volumePerWeek: { value: number; display: string; unit: 'lb' | 'kg' } | null;
  weekDelta: { value: number; unit: 'lb' | 'kg'; direction: 'up' | 'down' | 'flat' } | null;
  daysLeft: number;
  status: 'on-track' | 'behind' | 'ahead';
  nextSessionNumber: number;
  onPrimary: () => void;
  onPlan: () => void;
  onTap: () => void;
  onStreakTap?: () => void;
}
```

**Card structure (top to bottom, 22pt content padding all sides):**

1. **Top row** — citron active pill (`DAY {day} · SESSION {session}` with DumbbellIcon 11×11) left, plan caption (`Day {day} / {totalDays} · {weeks}-week plan`) right
2. **Title row** (marginTop 12) — "Build Strong." at 52pt/800/-0.04em left, streak readout (44pt number + 24pt "d" suffix, citron glow text-shadow, "STREAK" in JetBrains Mono 13pt/700/0.16em) right
3. **Stat tiles** (marginTop 16) — three flex:1 glass tiles in a row with gap 10. Glass style: `rgba(10,24,18,0.78)` background (flat fallback, no blur dependency), 1px border `rgba(255,255,255,0.10)`, borderRadius 14. Tile content: 10pt uppercase label + value (big=18pt/800 citron for "Top lift", normal=14pt/700 cream for "Volume/wk", accent=14pt/700 citron for "Δ Week")
4. **Progress bar** (marginTop 16) — 12 segments, flex:1 each, height 12, borderRadius 4, gap 3. Filled = citron + shadow glow `0 0 10px #cfde50`. Empty = `rgba(255,255,255,0.18)`
5. **Progress meta** (marginTop 10) — three items space-between: `{session}/{totalSessions} sessions` (session count in citron 800, rest in cream 600 at 0.7 opacity), `{daysLeft} days left` (cream 600 at 0.75), `↑ On track` (citron 700). All have text-shadow legibility hack
6. **CTA row** (marginTop 18) — primary citron button flex:1 ("Start session {nextSessionNumber} →", 14pt/800, shadow: `0 8px 18px rgba(207,222,80,0.33), 0 0 0 4px rgba(207,222,80,0.12)`) + secondary glass button ("Plan", 14pt/700, same glass base but border at 0.22 instead of 0.10)

**Background stack (3 layers behind content):**

- Layer 1: `ImageBackground` with barbell photo. On RN, apply `opacity: 0.92` on the image style (approximates `saturate(0.85) contrast(1.05)` since RN doesn't support CSS filters — same approach as current UpNextHero)
- Layer 2: `LinearGradient` 180deg — `rgba(10,24,18,0.78)` 0%, `rgba(17,55,31,0.62)` 40%, `rgba(17,55,31,0.48)` 70%, `rgba(17,55,31,0.72)` 100%
- Layer 3: `LinearGradient` 135deg — `rgba(29,78,52,0.33)` → `rgba(17,55,31,0.55)` (cannot use `mixBlendMode: multiply` on RN — layer it on top as-is, same as current UpNextHero which already does this)

**Card outer:** borderRadius 30, overflow hidden, `shadows.card` token, backgroundColor `greenDeep` as fallback.

**Empty/fresh-user state (day 1, session 0):**
- Pill: `START · DAY 1`
- Streak: `0d`
- Progress bar: 0 filled
- Meta left: `0/12 sessions`
- Meta right: omit status text
- Primary CTA: `Start session 1 →`

**Accessibility:**
- Outer `Pressable` wraps the card body (excluding CTAs) with `accessibilityLabel` describing program state
- Decorative text elements (pill label, "STREAK", tile labels) get `accessibilityElementsHidden={true}` / `importantForAccessibility="no"`
- Both CTA buttons ≥ 44pt tap targets (14pt padding on all sides gives 48pt minimum height)
- Streak readout tappable area padded to 44×44 minimum

### 2. Glass Style Extraction

Extract the shared glass style as a constant in the new component file:

```ts
const glassBase = {
  backgroundColor: 'rgba(10,24,18,0.78)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
};
```

The secondary CTA overrides the border to `rgba(255,255,255,0.22)`.

Note: Using the flat fallback (`0.78` opacity) per the design README's recommendation for platforms without `backdrop-filter`. No `expo-blur` dependency.

### 3. New Design Token: `radii.progressSeg`

Add to `constants/design-tokens.ts`:

```ts
progressSeg: 4,
```

This is the 4pt radius for the 12 progress-bar segments. Currently only 3pt (pill radius for `borderRadius: 3` in UpNextHero's smaller segments) exists implicitly.

### 4. Format Helper: `formatVolume`

Add a small formatting function inside the new component (or in a utils file if reuse is likely):

```ts
function formatVolume(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value));
}
```

### 5. Today Screen Integration

In `app/(tabs)/index.tsx`:

- Import `BuildStrongHero` from `@/components/today/build-strong-hero`
- In the "Up Next Hero" section, when `heroVariant === 'strength'`, render `BuildStrongHero` instead of `UpNextHero`
- Map existing data to the props interface:
  - `day` = `challengeDayNumber` (fallback 1)
  - `totalDays` = computed from challenge `durationDays` (fallback 30)
  - `session` = `challengeProgress` (fallback 0)
  - `totalSessions` = `activeChallenge?.targetTotal` (fallback 12)
  - `weeks` = `Math.ceil(totalDays / 7)`
  - `streakDays` = `strengthData?.streak ?? 0`
  - `topLift` = `strengthData?.topLift ? { value: strengthData.topLift, unit: 'lb' } : null`
  - `volumePerWeek` = derive from `strengthData?.volumeWeek`
  - `weekDelta` = derive from `strengthData?.volumeDelta`
  - `daysLeft` = `challengeDaysLeft`
  - `status` = `'on-track'` (hardcoded for v1 — status logic is out of scope)
  - `nextSessionNumber` = `(challengeProgress ?? 0) + 1`
  - `onPrimary` = `() => handleLog('gym')`
  - `onPlan` = `() => router.push('/stats-strength')`
  - `onTap` = `() => router.push('/stats-strength')`

### 6. Animations (react-native-reanimated)

**Mount stagger:** On first render, content elements (top row → title → tiles → bar → meta → CTAs) fade in + translate-Y 8pt over 320ms with 60ms offsets. Use `FadeInDown` or `entering` props from reanimated.

**Progress segment fill:** When a new segment fills, scale 0→1 over 320ms with a glow pulse. Use `useAnimatedStyle` to drive the filled segment's scale and shadow.

**Reduced motion:** Check `AccessibilityInfo.isReduceMotionEnabled()` or use reanimated's `ReduceMotion.System` config. When active, skip all animations — render in final state.

**CTA press:** Scale to 0.96 over 200ms ease-out on press-in. Revert on press-out. Use `Pressable` with `onPressIn`/`onPressOut` driving a shared value.

## Key Implementation Details

- **No blur dependency.** The glass tiles use a flat `rgba(10,24,18,0.78)` background. This matches the README's fallback recommendation and avoids adding `expo-blur` as a dependency. The photo is mostly obscured by the gradient stack at tile locations anyway.
- **Multiply blend mode is not available on RN.** Layer 3 (diagonal forest tint) is applied as a standard overlay, same as the existing `UpNextHero` strength variant already does. The visual difference is negligible because the layer uses low alpha values (20–33%).
- **Photo filter approximation.** RN's `ImageBackground` doesn't support CSS `filter`. The existing approach uses `opacity: 0.92` on the image style, which approximates the desaturation. Keep the same approach.
- **Shadow stacks on RN.** RN supports only a single shadow per view. For the primary CTA's dual shadow (drop + halo), use `shadows.cta` from design-tokens for the iOS shadow and `elevation` for Android. The 4px citron halo can be approximated with a wrapper `View` that has its own shadow, or accepted as a platform limitation. On web (Expo Web), the full CSS `boxShadow` string can be applied.
- **The `UpNextHero` component is not modified.** The new `BuildStrongHero` is a separate component. The existing `UpNextHero` continues to work for speed/default variants and for the strength variant when no challenge is active (it shows a simpler card without the XL treatment).
- **Size ladder.** Only XL is implemented. The props interface is shared across all sizes. XS/S/M/L are left for follow-up specs. The component is named `BuildStrongHero` (not `BuildStrongHeroXL`) because it will eventually contain size logic internally based on context.
- **When to show BS6-XL vs UpNextHero strength variant:** BS6-XL shows when `heroVariant === 'strength'` regardless of whether a challenge is active. If no challenge is active, use sensible defaults (day=1, totalDays=30, session=0, etc.). The card always shows for the gym habit.

## Acceptance Criteria

- [ ] `BuildStrongHero` component renders at ~354pt wide with 30pt border radius, barbell photo background, and forest-tint gradient stack
- [ ] Three glass stat tiles show "Top lift", "Volume / wk", and "Δ Week" with correct typography hierarchy (big citron, normal cream, accent citron)
- [ ] 12-segment progress bar fills segments based on `session` count with citron color and glow shadow on filled segments
- [ ] Progress meta row shows `{session}/{totalSessions} sessions`, `{daysLeft} days left`, and status indicator
- [ ] Primary CTA reads "Start session {N} →" with citron background and glow shadow
- [ ] Secondary CTA reads "Plan" with glass style and navigates to `/stats-strength`
- [ ] Tapping primary CTA triggers `onPrimary` (navigates to strength screen)
- [ ] Tapping card body triggers `onTap`
- [ ] Streak readout shows streak days with citron glow text-shadow
- [ ] Empty state (session 0): pill shows "START · DAY 1", progress bar empty, CTA shows "Start session 1 →"
- [ ] Mount animation: staggered fade-in of content elements (disabled under reduced motion)
- [ ] Card replaces `UpNextHero` on Today screen when gym habit is up next
- [ ] Component accepts the full props interface for future size-ladder reuse
- [ ] All tap targets ≥ 44pt
- [ ] No new dependencies added (no expo-blur, no new state library)

## Files to Touch

- `components/today/build-strong-hero.tsx` — **new file**, the BS6-XL card component (~300 lines)
- `constants/design-tokens.ts` — add `radii.progressSeg = 4`
- `app/(tabs)/index.tsx` — import `BuildStrongHero`, render it in place of `UpNextHero` for strength variant, map data to props
