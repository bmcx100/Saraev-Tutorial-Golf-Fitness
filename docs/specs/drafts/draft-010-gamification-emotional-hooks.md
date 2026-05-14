# Draft 010: Gamification & Emotional Hooks

Notes and early thinking for a future spec covering the motivational layer of the app — PR celebrations, milestone badges, streak jeopardy, and other emotional hooks that make training sessions feel consequential.

---

## PR Moment

When a session is saved and any value — any stick, either side, driver speed, any exercise weight or volume — exceeds the previous best, the app fires a dedicated celebration before returning to the home screen. Full-screen moment, haptic, sound. The message is specific to exactly what was broken: "New green stick PR — 118 mph" or "New squat PR — 285 lbs × 8." If multiple PRs were set in one session, they're listed together. This is the most important hook in the app. It should feel like something happened, not like a notification.

## The Number to Beat

The session start screen for both speed and strength shows the user's current PRs before they begin. For speed: the best recorded speed per stick and driver. For strength: the best weight and reps for each exercise in today's rotation. This creates a concrete micro-goal before a single rep or swing. The user isn't just training — they're competing against their past self from the moment they open the session.

## Milestone Thresholds

Speed has culturally meaningful driver speed thresholds (100, 110, 115, 120, 125, 130 mph). Strength has milestone streak lengths (7, 14, 21, 30 days) and volume thresholds. The first time a user crosses any threshold, it gets a dedicated celebration distinct from a normal PR — a unique badge, a named achievement ("120 Club"), and a permanent marker on the trend graph. Milestones accumulate and are visible in the detail views as a trophy-style list.

## Gap Closing Signal

When the dom/non-dom speed gap narrows meaningfully over a multi-week window, the app surfaces it as a card-level callout in the Speed detail view: "Your non-dominant side is catching up." This rewards the user for doing the part of the protocol that feels pointless (swinging with your weaker side) by showing them the data that proves it's working.

## Streak Jeopardy

If a user has an active strength streak and hasn't logged a session on a day when they typically train, the card-level hook shifts to urgency: "Train today to keep your 11-day streak." This is not a push notification — it's a change in what the card surfaces. The streak itself becomes the hook when it's at risk.

## Protocol Completion

When the user finishes all sessions in a protocol level, the app presents a full-screen summary before returning to normal: start speed vs. finish speed, total gain in mph and percentage, sessions completed, PRs set, milestones crossed. A natural chapter-end moment. It closes with a direct prompt to start the next level, framed around what typical users gain at that level. The transition from "done" to "what's next" is immediate and motivating.
