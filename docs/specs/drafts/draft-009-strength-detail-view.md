# Draft: Spec 009 — Strength Detail View

Full-screen detail view accessed by tapping the strength hook card on the Stats tab. Route: `/stats-strength`. Vertically scrolling view with multiple analytical sections. Uses the same chart library introduced in spec 008.

## Decisions Already Made
- Full-screen route (not modal or inline expand)
- Chart library available from spec 008
- Strength streak definition (from spec 007): breaks after 3+ day gap between sessions, counts calendar days
- Streak milestones: 7, 14, 21, 30, 60, 90 days
- Strength data model: `StrengthSession` has `workoutDay` (legs1/pull/legs2/push), `exercises` array of `ExerciseLog` (each with `exerciseId` and `sets` array of `{ weight, reps, completed }`)
- Aggregate stats from spec 007 provide exercise PRs and streak data

## Sections

### 1. Workout Frequency View
- Which of the 4 rotation days (legs1/pull/legs2/push) have been completed in the current cycle
- How many total cycles completed
- Visual indicator showing rotation progress (e.g., 4 slots, filled for completed days in current cycle)

### 2. Volume Trend Graph
- Total weight lifted per session over time (weight × reps × sets, summed across all exercises in a session)
- Line or bar chart with sessions plotted by date
- This is described as "the most honest indicator of overall strength progression"
- Only counts completed sets (`set.completed === true`)

### 3. Per-Exercise PRs
- Each exercise listed with its best weight + reps and the date the PR was set
- Flagged visually if the PR was set in the most recent session (e.g., "NEW" badge or highlight)
- All exercises across all workout days (legs1/pull/legs2/push)
- Exercises from `WORKOUT_DAYS` constant: calf-raises, tib-raises, split-squats, squats, shrugs, lat-pulldowns, bent-over-rows, curls, nordic-curls, back-extensions, dead-lifts, dips, bench-press, overhead-press, front-delt-raises, side-delt-raises, tricep-extensions

### 4. Streak History
- Current streak (days)
- All-time best streak (days)
- Milestone badges earned (7-day, 14-day, 21-day, 30-day, 60-day, 90-day)
- Visual display of which milestones have been hit vs upcoming

### 5. Session History Log
- List of sessions: date, rotation day, exercises completed, total session volume
- Tappable for full session detail (all exercises with sets, weights, reps)
- Sorted most recent first

## Open Questions for Spec Writing
- How much session history to load? Same question as speed — 30 days, 90 days, or all-time?
- For the session detail tap-through, inline expand or another screen?
- Should exercise PRs be grouped by workout day or listed flat alphabetically?
- How to handle exercises that appear in multiple workout days (calf-raises, tib-raises in both legs1 and legs2) — single PR entry or separate per workout day?
- Volume calculation: should it use (weight ?? 0) × reps for consistency with existing code, or require weight to be non-null?
