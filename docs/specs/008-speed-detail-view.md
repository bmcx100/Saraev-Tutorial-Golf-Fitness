# Spec 008: Speed Sticks Detail View

## What This Feature Does

Adds a full-screen speed stats detail view accessed by tapping the speed hook card on the Stats tab. The screen is a vertically scrolling feed of analytical sections — driver speed trend graph, per-stick PRs, dominant vs non-dominant gap analysis, stick-to-driver transfer rate, session history log with bottom sheet detail, weekly consistency tracker, and protocol progress summary.

## Current State

After spec 007, `app/stats-speed.tsx` exists as a placeholder stub with a "Coming soon" message. The speed hook card on the Stats tab navigates to this route via `router.push('/stats-speed')`.

Speed sessions are stored in AsyncStorage under `speed-session-YYYY-MM-DD` keys. Each `SpeedSession` (`constants/speed-protocols.ts`) has 14 fields: `normalStance` and `stepDrill` (each with green/blue/red × dom/nonDom), plus `maxOut` (green + driver). Loading functions exist in `utils/storage.ts`: `loadSpeedSessionRange(dates)` does batch retrieval via `AsyncStorage.multiGet()`.

`DRIVER_MILESTONES` (`[90, 95, ..., 140]`) is defined in `constants/speed-protocols.ts` (added by spec 007). `STICK_COLORS` provides color labels and hex values.

`useTrainingHistory` (`hooks/use-training-history.ts`) loads 30 days. The detail view needs 90 days. `react-native-svg` is already installed.

## Changes Required

### 1. Install chart library

Install `react-native-gifted-charts` and `expo-linear-gradient` via `npx expo install`. The library uses `react-native-svg` (already installed) and `react-native-reanimated` (already installed) for animations.

### 2. Create `useSpeedDetailData` hook

New file: `hooks/use-speed-detail-data.ts`

Loads 90 days of speed sessions on mount. Returns:

- `sessions: SpeedSession[]` — sorted date ascending
- `loading: boolean`
- `driverSpeeds: { date: string; mph: number }[]` — from `maxOut.driver` where non-null
- `stickPRs: Record<string, { mph: number; date: string } | null>` — keyed by `"green-dom"`, `"green-nonDom"`, `"blue-dom"`, etc. (6 entries). For each color+side, the PR is the max across both `normalStance` and `stepDrill` drills across all sessions.
- `domNonDomGap: { color: StickColor; label: string; currentGap: number; previousGap: number; trend: 'closing' | 'widening' | 'stable' }[]` — one entry per stick color. Uses `normalStance` values. `currentGap` = average dom - average nonDom over the last 45 days. `previousGap` = same over the 45 days before that. Trend: closing if currentGap < previousGap by 1+ mph, widening if > by 1+, stable otherwise.
- `transferRate: { stickGain: number; driverGain: number; assessment: 'good' | 'lagging' } | null` — compares earliest and latest sessions. `stickGain` = average improvement across all 6 normalStance stick positions. `driverGain` = latest driver maxOut - earliest driver maxOut. `'good'` if driverGain ≥ 0.7 × stickGain, `'lagging'` otherwise. Null if fewer than 2 sessions.
- `weeklyConsistency: { weekStart: string; count: number; hitMinimum: boolean }[]` — last 8 calendar weeks (Monday start). `hitMinimum` = count ≥ 3.
- `protocolSummary: { name: string; totalSessions: number; firstDate: string; lastDate: string; driverGain: number }` — `driverGain` = latest driver mph - first driver mph (0 if insufficient data).

### 3. Replace stats-speed.tsx stub with full detail view

Replace `app/stats-speed.tsx` with a `SafeAreaView` + `ScrollView` layout containing all 7 sections below. Top bar: back arrow (`router.back()`), title "Speed Stats". Show `ActivityIndicator` while loading.

#### Section A: Driver Speed Trend Graph

- `LineChart` from `react-native-gifted-charts`
- Data: `driverSpeeds` mapped to `{ value: mph, dataPointText: String(mph), label: dayMonth }` where `dayMonth` is "M/D" format
- Show data point dots (`showDataPoint: true`, size 6, color `colors.accent`)
- Y-axis: auto-scaled to data range ± 5 mph
- Horizontal reference lines at each `DRIVER_MILESTONES` value that falls within the chart's Y range. Each line labeled with its mph value on the right edge, dashed style, color `colors.border`.
- Chart height: 220. Line color: `colors.accent`. Area gradient fill from `colors.accent` (20% opacity) to transparent.
- Section title: "DRIVER SPEED TREND"
- Below chart: "90-day history" in secondary text
- If fewer than 2 data points, show "Complete more sessions to see your trend" instead of the chart.

#### Section B: Per-Stick PRs

- Section title: "STICK PRs"
- 3-row layout, one per color. Each row shows stick color dot + label, then two columns: Dom and Non-Dom. Each column shows mph value (fontWeight 700) and date below in secondary text (formatted "May 14").
- If a position has no PR (null), show "—".
- Use `STICK_COLORS` for color dots and labels.

#### Section C: Dominant vs Non-Dominant Gap

- Section title: "DOM vs NON-DOM GAP"
- One row per stick color showing: color dot, label, current gap in mph (e.g., "+5 mph"), and a trend arrow (↓ closing in green, ↑ widening in amber, → stable in secondary).
- Below the rows: a plain language summary for the color with the most significant trend. If gap is closing: `"Your non-dominant [color] side has gained X mph on your dominant side this\u00A0month."` If widening or stable, omit the summary.

#### Section D: Stick-to-Driver Transfer Rate

- Section title: "TRANSFER RATE"
- If `transferRate` is null (fewer than 2 sessions), show "Need more sessions to calculate transfer rate."
- If `assessment === 'good'`: green accent text: `"Your stick gains are transferring well to your driver."` Show stick gain and driver gain as secondary stats.
- If `assessment === 'lagging'`: amber text: `"Your driver speed hasn't caught up to your stick progress\u00A0yet."` Show both gains.

#### Section E: Session History Log

- Section title: "SESSION HISTORY"
- List of sessions sorted most recent first. Each row shows:
  - Session number (sequential from #1 = earliest to #N = most recent, displayed as `#N`)
  - Date (formatted "May 14, 2026")
  - Driver maxOut mph (or "—" if null)
  - Green maxOut mph (or "—" if null)
- Row is `Pressable` — on tap, opens the session detail bottom sheet (see section 4).
- Show last 20 sessions. If more exist, show "Showing last 20 of N sessions" in secondary text.

#### Section F: Consistency View

- Section title: "WEEKLY CONSISTENCY"
- 8 columns in a row, each representing one week (most recent on right).
- Each column: a small vertical bar scaled to max 7 (sessions). Bar color: `colors.accent` if `hitMinimum` (≥3), `colors.streakBadge` (amber) if 1-2, `colors.border` (gray) if 0.
- Below each bar: week start date as "M/D" label.
- Below the chart row: "3+ sessions/week = on track" in secondary text.

#### Section G: Protocol Progress

- Section title: "PROTOCOL PROGRESS"
- Card showing: protocol name (e.g., "SuperSpeed L1"), total sessions completed, training period ("May 1 — May 14, 2026"), and total driver speed gain ("+X mph" in accent if positive, secondary text if 0 or negative).
- No completion bar (no defined protocol endpoint exists in the data model).

### 4. Session detail bottom sheet modal

When a session row is tapped in the history log, open a `Modal` (animationType "slide") styled as a bottom sheet — rounded top corners (borderTopLeftRadius/Right 20), dark overlay background, content fills bottom ~80% of screen.

Content: `ScrollView` with session date as header, then 3 sections matching the speed input wizard:
- **Normal Stance**: 3 rows (green/blue/red) × 2 columns (Dom/Non-Dom) showing mph values
- **Step Drill**: same layout
- **Max Out**: 2 rows (Green stick, Driver) showing mph values

Close button (X icon) at top-right of the modal content. Tap outside (on overlay) also closes.

## Key Implementation Details

**Chart library choice: `react-native-gifted-charts`.** Already compatible with the project's `react-native-svg` (15.12.1) and `react-native-reanimated` (4.1.1). Needs `expo-linear-gradient` for area gradient fills. Install all via `npx expo install`.

**90-day date range.** Generated by `dateRange(formatDate(start), 90)` where start = today - 89 days. Uses existing `loadSpeedSessionRange()` from `utils/storage.ts`.

**Per-stick PR aggregation.** For each session, for each color+side, take the max of `normalStance[color][side]` and `stepDrill[color][side]`. Then across all sessions, keep the highest. This gives the user's best-ever speed with each stick regardless of drill type.

**Dom vs Non-Dom gap uses normalStance only.** Normal Stance is the baseline drill. Step Drill involves a step that changes the movement pattern, making it less comparable for gap analysis.

**Transfer rate threshold: 70%.** If driver gain is at least 70% of stick gain, the transfer is assessed as "good." Below that, "lagging." This is a rough heuristic — the plain language framing avoids implying precision.

**Session numbering is chronological.** Session #1 is the earliest session in the loaded range. The history list displays most recent first, so #N appears at top.

**Bottom sheet uses `Modal` not a library.** Keeps dependencies minimal. Styled with rounded top corners and overlay to look like a bottom sheet. Uses the same modal pattern as existing discard confirmation modals in `app/speed.tsx` and `app/strength.tsx`.

**Reference lines filtered to data range.** Only milestones within `[minMph - 5, maxMph + 5]` are shown as horizontal lines. This prevents cluttering the chart with irrelevant thresholds.

## Acceptance Criteria

- [ ] Tapping speed hook card navigates to the full speed detail view (not a placeholder)
- [ ] Driver speed trend chart renders with data points and connecting line
- [ ] Milestone reference lines appear as dashed horizontal lines within the chart's Y range
- [ ] Chart shows "Complete more sessions to see your trend" when fewer than 2 data points
- [ ] Per-stick PRs show 6 entries (3 colors × 2 sides) with speed and date
- [ ] Dom vs non-dom gap shows current gap and trend direction per stick color
- [ ] Plain language gap summary appears when a color's gap is closing
- [ ] Transfer rate shows appropriate assessment ("good" or "lagging") with gain numbers
- [ ] Session history lists up to 20 sessions with number, date, driver speed, green speed
- [ ] Tapping a session row opens a bottom sheet modal showing all 14 fields
- [ ] Bottom sheet closes via X button or overlay tap
- [ ] Consistency view shows 8 weeks of session counts with color-coded bars
- [ ] Protocol progress shows session count, date range, and driver gain
- [ ] Back arrow returns to Stats tab
- [ ] Loading state shows while data is being fetched

## Files to Touch

- `package.json` — add `react-native-gifted-charts`, `expo-linear-gradient`
- `hooks/use-speed-detail-data.ts` — new hook for 90-day speed data + all derived values
- `app/stats-speed.tsx` — replace stub with full detail view (7 sections + bottom sheet)
