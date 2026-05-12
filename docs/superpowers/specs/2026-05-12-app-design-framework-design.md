# App Design Framework: Core Loop, Challenges, and Retention

**Date:** 2026-05-12
**Status:** Draft
**Scope:** Evolve the Golf Fitness habit tracker from a basic toggle app into a retention-focused product with core loop rewards, challenges, accountability, and notifications.

---

## 1. Design Decisions Summary

| Decision | Choice |
|----------|--------|
| App scope | Golf/fitness-specific (curated habit library) |
| Habit types | Binary (daily check-in) + Counter (tap-to-increment) |
| Counter UX | Each tap increments, each tap triggers reward feedback |
| Challenge structure | Cumulative target count (e.g., "50 sessions in 14 days") |
| Challenge lifecycle | Recurring — after onboarding 3-day challenge, ongoing 3/7/14/30-day challenges |
| Celebration style | Tiered — micro per tap, confetti on daily completion, full-screen on milestone |
| Onboarding | Habit selection only, minimal friction, auto-starts 3-day challenge |
| Notifications | Fixed schedule — morning reminder + evening check-in |
| Accountability view | Apple Fitness-style rings |
| Challenge navigation | Dedicated bottom tab |
| Architecture approach | Data model rebuild first, then feature build on top |

---

## 2. Data Model

### 2.1 Habit Definition

Replaces the current flat `Habit` interface in `constants/habits.ts`.

```typescript
interface Habit {
  id: string;                          // "putting", "hydration", etc.
  name: string;                        // "Putting Drills"
  icon: string;                        // MaterialIcons name
  category: "golf" | "fitness" | "wellness";
  trackingType: "binary" | "counter";
  targetCount: number;                 // 1 for binary, N for counter (e.g., 8)
  unit: string;                        // "session", "glasses", "reps"
  duration: string;                    // Display label: "15 min", "8 glasses"
  ringColor: string;                   // Hex color for this habit's ring
}
```

The curated library lives in `constants/habits.ts` as a `HABIT_LIBRARY` array. Users select which ones to track during onboarding.

### 2.2 Habit Log Entry

Replaces the current `habits-YYYY-MM-DD` → `string[]` pattern.

```typescript
interface HabitLog {
  habitId: string;
  date: string;        // "YYYY-MM-DD"
  count: number;       // 1 for binary complete, N for counter taps
  completedAt: string; // ISO timestamp of last update
}
```

**Storage key:** `habit-logs-YYYY-MM-DD` → `HabitLog[]`

Completion logic:
- Binary habit is complete when `count >= 1`
- Counter habit is complete when `count >= targetCount`
- Ring fill percentage = `count / targetCount`

### 2.3 Challenge

```typescript
interface Challenge {
  id: string;
  name: string;                    // "7-Day Putting Blitz"
  description: string;
  habitId: string;                 // Which habit this targets
  targetTotal: number;             // Cumulative target (e.g., 50)
  durationDays: number;            // 3, 7, 14, or 30
  startDate: string;               // "YYYY-MM-DD"
  status: "active" | "completed" | "failed" | "available";
}
```

**Storage key:** `challenges` → `Challenge[]`

Progress is computed by summing `HabitLog.count` for the challenge's `habitId` across the date range `[startDate, startDate + durationDays)`. No duplicate progress state.

Only one challenge can be active at a time.

### 2.4 Challenge Library

Predefined challenges in `constants/challenges.ts`:

```typescript
interface ChallengeTemplate {
  id: string;
  name: string;
  description: string;
  habitId: string;         // Must match a habit from the library
  targetTotal: number;
  durationDays: number;
}
```

Examples:
- "Putting Sprint" — 20 sessions in 7 days
- "Hydration Hero" — 100 glasses in 14 days
- "Stretch Streak" — 30 morning stretches in 30 days
- "Swing Sprint" — 20 swing sessions in 7 days
- "Core Crusher" — 21 workouts in 14 days

The 3-day onboarding challenge is a special template that targets whichever habit the user selected first, with a low target count to guarantee early success.

### 2.5 User Profile

```typescript
interface UserProfile {
  onboardingComplete: boolean;
  activeHabitIds: string[];        // Which habits from the library the user selected
  notificationMorning: string;     // "08:00"
  notificationEvening: string;     // "20:00"
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}
```

**Storage key:** `user-profile` → `UserProfile`

---

## 3. Screen Architecture

**5 screens total. 3 tabs + onboarding (one-time) + settings (push nav).**

### 3.1 Navigation Structure

```
First Launch → Onboarding → Today (auto-starts 3-day challenge)

Tab Bar:
├── Today (primary)
├── Challenges
└── Stats

Settings → accessed via gear icon in any tab header (push navigation)
```

### 3.2 Onboarding Screen (one-time, full-screen)

**Purpose:** Habit selection + notification permissions + first challenge kickoff.

- Card carousel of the curated habit library
- Each card shows: habit name, icon, type (binary/counter), duration, category
- Toggle to select/deselect habits
- Minimum 1 habit required, no maximum
- "Start Your First Challenge" button at bottom
- Requests push notification permission on button press
- Auto-creates 3-day onboarding challenge from first selected habit
- Sets `onboardingComplete: true` and navigates to Today

### 3.3 Today Screen (Tab 1 — Daily Tracking)

**Layout (top to bottom):**

1. **Header** — "Today" title + date + gear icon (settings)
2. **Fitness Rings** — Concentric SVG rings, one per active habit
   - Each ring color-coded to its habit
   - Fill animates with Reanimated spring as habits are completed
   - Binary habits: snap from empty to full on tap
   - Counter habits: proportional fill (count/targetCount)
   - Ring legend below with habit name + colored dot + completion status
3. **Challenge Banner** — If active challenge exists
   - Green gradient card
   - Shows challenge name, cumulative progress (32/50), days remaining
   - Tapping navigates to Challenges tab
   - Hidden if no active challenge
4. **Habit Rows** — Scrollable list of active habits
   - **Binary row:** Tap anywhere to toggle. Completed state: filled circle with checkmark, dimmed name with strikethrough
   - **Counter row:** Tap anywhere to increment. Shows "X of Y" subtitle + count badge. When target reached: same completed state as binary
   - Each row shows habit icon, name, duration label, and status

**Reward System (triggered on habit interactions):**

| Event | Visual | Haptic | Sound |
|-------|--------|--------|-------|
| Binary tap / counter increment | Icon bounces (scale 1→1.3→1), ring segment animates in | Light impact | Short chime |
| Counter reaches target | Row transitions to completed, ring closes fully | Medium impact | Success tone |
| All habits complete for day | All rings pulse simultaneously, confetti particles overlay for 2s | Heavy impact | Achievement sound |
| Challenge milestone reached | Full-screen particle celebration for 3s with congratulations text | Success notification | Fanfare |

Haptics use `expo-haptics`. Sound uses `expo-av` (short audio files bundled with the app).

### 3.4 Challenges Screen (Tab 2)

**Layout (top to bottom):**

1. **Header** — "Challenges" title
2. **Active Challenge Card** (hero, if one is active)
   - Green gradient background
   - "Active" badge + days elapsed
   - Challenge name + description
   - Progress ring (percentage) + linear progress bar
   - Stats: completed count, remaining, daily pace needed
   - Pace indicator turns amber when behind, green when on track or ahead
3. **Available Challenges** section
   - List of `ChallengeTemplate` entries filtered to habits the user has active
   - Each shows: habit icon, challenge name, target description, duration badge
   - Duration badge color-coded: 3d = green, 7d = red, 14d = blue, 30d = amber
   - Tapping starts the challenge if no active one exists
   - Disabled with explanation text if a challenge is already active
4. **Completed Challenges** section
   - Collapsed by default, shows count
   - Expandable to show past challenges with completion date, final count, and pass/fail

### 3.5 Stats Screen (Tab 3 — Accountability)

**Layout (top to bottom):**

1. **Header** — "Stats" title + streak badge (amber pill: "X day streak")
2. **Weekly Mini-Rings** — 7 condensed ring sets (Mon-Sun)
   - Each day shows 3 concentric rings (condensed from full ring set)
   - Represents aggregate completion: outer ring = most incomplete habit, inner = most complete
   - Fully closed day = all habits done. Partial = some incomplete
   - Today highlighted with bold label
   - "X/5" label below each day
3. **Habit Breakdown** — Per-habit weekly completion rates
   - Color dot + habit name + percentage + "X/7" fraction
   - Sorted by completion rate (highest first)
4. **Record Cards** — 3-column grid
   - Best streak (days)
   - Total completions (lifetime)
   - Challenges completed (lifetime)
   - These are cumulative counters — they only go up

### 3.6 Settings Screen (Push Navigation)

**Sections:**

1. **My Habits** — Toggle habits on/off from the curated library. Adding a habit makes it appear on Today. Removing hides it (logs are preserved).
2. **Notifications** — Morning time picker (default 08:00), evening time picker (default 20:00), enable/disable toggle.
3. **Preferences** — Sound on/off, dark mode override (system/light/dark).

---

## 4. Context Architecture

Replace the current single `HabitContext` with a layered approach:

### 4.1 HabitContext (refactored)

```typescript
interface HabitContextType {
  activeHabits: Habit[];               // User's selected habits from library
  todayLogs: HabitLog[];              // Today's log entries
  weekLogs: Map<string, HabitLog[]>;  // Last 7 days keyed by date
  logHabit: (habitId: string) => { justCompleted: boolean; allDone: boolean };
  getHabitProgress: (habitId: string) => { count: number; target: number; complete: boolean };
}
```

`logHabit` replaces `toggleHabit`:
- For binary: sets count to 1 (or toggles back to 0 if already 1)
- For counter: increments count by 1 (no decrement needed per the counter-tap model)
- Persists to AsyncStorage immediately
- Returns `{ justCompleted, allDone }` — `justCompleted` is true when this tap caused the habit to reach its target, `allDone` is true when all habits for today are now complete. The caller uses these to trigger the appropriate reward tier.

### 4.2 ChallengeContext (new)

```typescript
interface ChallengeContextType {
  activeChallenge: Challenge | null;
  challengeProgress: number;           // Computed from habit logs
  availableChallenges: ChallengeTemplate[];
  completedChallenges: Challenge[];
  startChallenge: (templateId: string) => void;
  checkChallengeCompletion: () => void; // Called after each habit log
}
```

### 4.3 UserContext (new)

```typescript
interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  isOnboardingComplete: boolean;
}
```

### 4.4 Provider Hierarchy

```
<UserProvider>          // Profile, onboarding state
  <HabitProvider>       // Habit data, logging
    <ChallengeProvider> // Challenge state (depends on habit logs)
      <TabNavigator />
    </ChallengeProvider>
  </HabitProvider>
</UserProvider>
```

---

## 5. Reward System Implementation

### 5.1 Sound

- Use `expo-av` (`Audio.Sound`)
- Bundle 4 short audio files (< 50KB each): `tap.mp3`, `success.mp3`, `confetti.mp3`, `fanfare.mp3`
- Preload on app start via `Audio.Sound.createAsync`
- Play is gated by `userProfile.soundEnabled`

### 5.2 Haptics

- Use existing `expo-haptics` dependency
- `Haptics.impactAsync(ImpactFeedbackStyle.Light)` for taps
- `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` for counter completion
- `Haptics.impactAsync(ImpactFeedbackStyle.Heavy)` for all-habits-done
- `Haptics.notificationAsync(NotificationFeedbackType.Success)` for challenge milestone
- iOS only (already guarded by `process.env.EXPO_OS === 'ios'`)

### 5.3 Animations

- **Icon bounce:** Reanimated `withSpring` scale transform (1 → 1.3 → 1)
- **Ring fill:** Reanimated `withTiming` on SVG `stroke-dashoffset` with spring config
- **Confetti:** Lightweight particle system using Reanimated shared values. 30-40 colored circles with randomized position/velocity/rotation. Fades out over 2 seconds. Renders as an absolute-positioned overlay above content.
- **Full-screen celebration:** Same particle system but more particles (80-100), plus centered congratulations text with scale-in animation. 3-second duration.

No external animation libraries needed — Reanimated + SVG handles everything.

---

## 6. Notifications

### 6.1 Setup

- Add `expo-notifications` dependency
- Request permission during onboarding (after habit selection, before first challenge)
- Schedule two local recurring notifications based on user profile times

### 6.2 Notification Content

**Morning (default 08:00):**
- Title: "Time for your habits"
- Body: "Start your day right. You have X habits waiting."
- Updates daily to reflect current active habit count

**Evening (default 20:00):**
- Title: Conditional on completion status
  - All done: "Great job today! You completed all your habits."
  - Partial: "You're almost there — X habits left today."
  - None: "Don't forget your habits today!"
- Body: challenge progress if active ("32/50 on your Putting Sprint")

### 6.3 Implementation

- Use `expo-notifications` `scheduleNotificationAsync` with daily trigger
- Reschedule on app foreground (to update dynamic content)
- Cancel and reschedule when user changes times in Settings
- Respect `notificationsEnabled` toggle

---

## 7. Curated Habit Library

Expand the current 5 habits to a fuller library that covers golf, fitness, and wellness:

**Golf:**
- Putting Drills (binary, 15 min)
- Swing Practice (binary, 20 min)
- Short Game Practice (binary, 15 min)
- Driving Range (binary, 30 min)
- Course Visualization (binary, 10 min)

**Fitness:**
- Morning Stretch (binary, 5 min)
- Core Workout (binary, 10 min)
- Resistance Band Training (binary, 15 min)
- Yoga/Mobility (binary, 20 min)
- Walking (binary, 30 min)

**Wellness:**
- Hydration (counter, 8 glasses)
- Protein Intake (counter, 3 meals)
- Sleep Log (binary, 1 entry)
- Meditation (binary, 10 min)

Users select from this library during onboarding. They can change their selection in Settings at any time.

---

## 8. Surface Area Check

| # | Screen | Purpose | Complexity |
|---|--------|---------|------------|
| 1 | Onboarding | Habit selection + first challenge | Low (one-time) |
| 2 | Today | Daily tracking, rings, rewards | High (primary screen) |
| 3 | Challenges | Active challenge + browse available | Medium |
| 4 | Stats | Weekly rings, habit breakdown, records | Medium |
| 5 | Settings | Habits, notifications, preferences | Low |

**5 screens total.** Within the 5-7 target. No unnecessary screens. Every screen serves the core loop or accessory features directly.

---

## 9. Migration from Current App

The current app stores data as `habits-YYYY-MM-DD` → `string[]` of completed habit IDs.

**Migration strategy:**
1. On first launch after update, check for `user-profile` key. If missing, user hasn't migrated.
2. Read all existing `habits-YYYY-MM-DD` keys from AsyncStorage.
3. Convert each to the new `HabitLog[]` format (each ID becomes `{ habitId, date, count: 1, completedAt: date }`).
4. Write to new `habit-logs-YYYY-MM-DD` keys.
5. Delete old keys.
6. If old data exists, skip onboarding and set `activeHabitIds` to the original 5 habits.
7. If no old data exists, show onboarding.

This preserves existing user data while enabling the new features.

---

## 10. New Dependencies

| Package | Purpose | Size Impact |
|---------|---------|-------------|
| `expo-notifications` | Local push notifications | ~50KB |
| `expo-av` | Sound playback for reward chimes | ~100KB (already available in Expo) |

Both are part of the Expo SDK and installed via `npx expo install`. No third-party libraries needed.

---

## 11. File Structure (New/Modified)

```
constants/
  habits.ts          ← MODIFIED: new Habit interface, expanded HABIT_LIBRARY
  challenges.ts      ← NEW: ChallengeTemplate array
  theme.ts           ← MODIFIED: add ring colors to palette
  sounds.ts          ← NEW: sound file references + preload helper

contexts/
  habit-context.tsx   ← MODIFIED: new schema, logHabit, weekLogs map
  challenge-context.tsx ← NEW: challenge state management
  user-context.tsx    ← NEW: user profile + onboarding state

components/
  fitness-rings.tsx   ← NEW: SVG ring component (Reanimated)
  mini-rings.tsx      ← NEW: condensed weekly ring component
  challenge-card.tsx  ← NEW: active challenge hero card
  challenge-row.tsx   ← NEW: available/completed challenge list item
  confetti.tsx        ← NEW: particle celebration overlay
  habit-row.tsx       ← MODIFIED: support counter type + reward animations
  progress-bar.tsx    ← MODIFIED: may be replaced by rings on Today

app/
  _layout.tsx         ← MODIFIED: add UserProvider, onboarding routing
  onboarding.tsx      ← NEW: onboarding screen
  settings.tsx        ← NEW: settings screen
  (tabs)/
    _layout.tsx       ← MODIFIED: add ChallengeProvider, update tab config
    index.tsx         ← MODIFIED: rings + challenge banner + new habit rows
    stats.tsx         ← MODIFIED: weekly rings + breakdown + records
    challenges.tsx    ← NEW: replaces explore.tsx tab

assets/
  sounds/
    tap.mp3           ← NEW
    success.mp3       ← NEW
    confetti.mp3      ← NEW
    fanfare.mp3       ← NEW

utils/
  storage.ts          ← NEW: centralized AsyncStorage helpers
  migration.ts        ← NEW: data migration from old format
  notifications.ts    ← NEW: notification scheduling helpers
```
