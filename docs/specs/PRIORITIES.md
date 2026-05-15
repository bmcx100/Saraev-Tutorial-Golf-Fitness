# Priorities

## In Progress
- **015 -- Speed Training Pillar Redesign** -- Visual overhaul of speed training screen with Subpar v3 pillar treatment: forest hero, stick pillars, custom keypad, citron CTA. Covers Normal Stance, Step Drill, and Max Out. No data model changes.
- **016 -- Build Strong Hero Card (BS6-XL)** -- Full-size Build Strong hero card for Today screen: barbell photo background with forest-tint stack, glass stat tiles (top lift, volume, delta), 12-segment progress bar, streak readout, dual CTA. Replaces UpNextHero when gym is up next.

## Up Next
- **017 -- Supabase Training Schema** -- Postgres tables, types, indexes, and RLS policies for speed/strength sessions, stats aggregates, exercise defaults, and training state. Foundation for cross-device sync.
- **018 -- Training Data Sync** -- Offline-first dual-write sync: AsyncStorage + Supabase write-through on save, cloud pull on first login, last-write-wins merge for multi-device.
- **010 -- Gamification & Emotional Hooks** -- PR celebrations, number-to-beat displays, milestone badges, gap-closing signals, streak jeopardy, protocol completion summaries (see draft: `docs/specs/drafts/draft-010-gamification-emotional-hooks.md`)
- **027 -- Stay on Track (Notifications)** -- Personalized per-habit reminders, configurable timing, push notification setup
- **028 -- Challenge Goal Setting** -- Personalized challenge goals: speed targets for Get Long, streak goals for Get Strong, cardio/core duration goals for Tighten It Up (see draft: `docs/specs/drafts/draft-challenge-goal-setting.md`)

## Completed
- **014 -- Password Recovery Flow** -- Forgot Password link on login, PASSWORD_RECOVERY event detection, dedicated reset-password screen, works on web + native
- **013 -- Smart Queue Order + Themed Up Next Hero** -- Up Next hero card adapts visual to habit (Get Long look for speed, Build Strong photo for strength, default for others); queue order learned from completion history; completed habits sink to bottom
- **011 -- Supabase Auth Core** -- Supabase client with encrypted storage, AuthProvider, email/password sign-up/sign-in, magic link, deep linking, navigation gating, logout
- **012 -- Native Social Auth** -- Native Google Sign-In (signInWithIdToken), native Apple Sign-In on iOS + OAuth fallback on Android, login screen social buttons
- **001 -- Habit Scheduling** -- Assign habits to weekdays or rotating cycles; hide non-scheduled habits from Today screen
- **002 -- Speed Protocol Tracking** -- Dedicated speed page with protocol onboarding, 3-step input wizard, custom numpad, session history
- **003 -- Strength Training Protocol Tracking** -- Dedicated strength page with L/P/L/P 4-day rotation, exercise checklist with weight/reps tracking, set completion, protocol onboarding
- **004 -- Onboarding Redesign** -- 3-step wizard: "How SUBPAR Works" overview, habit selection with Select All, challenge selection (Get Long / Get Strong / Tighten It Up); replaces 3-Day Kickoff
- **005 -- Track Progress (Stats Tab)** -- Driver speed trend card + strength summary card on Stats tab; 30-day history from AsyncStorage, no charting library
- **006 -- Habit Goal Modes & Pace Tracking** -- Per-habit scheduling mode (specific weekdays OR count goal with daily/weekly/monthly period), auto-generated visibility days, pace indicators on habit rows, celebration + warning toasts
- **007 -- Stats Hook Cards** -- Redesign speed/strength cards into emotionally-driven hook cards with PR celebrations, milestone proximity, streak tracking, tappable detail navigation
- **008 -- Speed Detail View** -- Full-screen speed stats: driver trend graph, per-stick PRs, dom vs non-dom gap, transfer rate, session history, consistency, protocol progress
- **009 -- Strength Detail View** -- Full-screen strength stats: workout frequency, volume trend graph, per-exercise PRs, streak history, session log
