# Draft: Challenge Goal Setting

Early thinking on the full challenge goal-setting system. Spec 004 introduces three onboarding challenges with fixed targets (12 sessions / 30 days). This draft captures the vision for personalized, progressive goals.

## Get Long (Speed Goals)

- User chooses a target swing speed per club (e.g., "120 mph driver")
- During a speed session, they hit until they reach the goal speed
- Speed data already captured by the Speed Protocol (app/speed.tsx) -- connect challenge progress to actual recorded speeds
- Progressive goals: after hitting a target, suggest the next tier
- Possible integration with launch monitor / speed sensor APIs

## Get Strong (Strength Streak)

- User sets a streak goal (e.g., "2 weeks at 4x/week")
- Tracks preferred workout frequency vs actual completions
- Ties into Strength Protocol (app/strength.tsx) -- a completed strength session counts automatically
- Could track volume progression (total weight lifted over time)
- Streak-based rewards: 7-day, 14-day, 30-day badges

## Tighten It Up (Cardio + Core)

- User sets a combined cardio/core goal (e.g., "3x/week for 2 weeks")
- Separate tracking for cardio minutes and core sessions
- Could support different cardio types (running, cycling, rowing) in the future
- Core exercises could have their own mini-protocol

## Open Questions

- Should goals be editable mid-challenge?
- How do completed challenges feed into new ones (progressive difficulty)?
- Badge/achievement system for completed challenges
- Should challenges auto-suggest based on user's weakest category?
- How to handle the case where a user completes a challenge early -- auto-start the next tier?
