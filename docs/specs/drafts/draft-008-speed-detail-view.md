# Draft: Spec 008 — Speed Sticks Detail View

Full-screen detail view accessed by tapping the speed hook card on the Stats tab. Route: `/stats-speed`. This screen is a vertically scrolling view with multiple analytical sections. Chart library will be added for this spec (pick best fit for Expo 54 / RN 0.81 / Reanimated 4).

## Decisions Already Made
- Full-screen route (not modal or inline expand)
- Chart library to be introduced in this spec
- Driver speed milestones: 90, 95, 100, 105, 110, 115, 120, 125, 130, 135, 140
- Aggregate stats architecture from spec 007 provides PR data; this view loads full session history for trend visualization via `useTrainingHistory` or extended version
- Speed session data model: `SpeedSession` has `normalStance`, `stepDrill` (each with green/blue/red × dom/nonDom), and `maxOut` (green + driver)

## Sections

### 1. Driver Speed Trend Graph
- Full session history plotted by date as a line chart
- Individual data points visible (not just a smooth line)
- Milestone thresholds (90, 95, 100, ..., 140) marked as labeled horizontal lines so the user can see exactly when they crossed each one
- This is the primary visualization on the page

### 2. Per-Stick PRs
- Green, blue, red sticks — dominant and non-dominant side for each
- Each showing the best speed (mph) and the date it was set
- 6 entries total (3 colors × 2 sides)

### 3. Dominant vs Non-Dominant Gap
- Tracked over time — how the gap between dom and non-dom speeds has changed
- Plain language note if the gap is closing: "Your non-dominant side has gained 3 mph on your dominant side this month."
- Could be a secondary chart or a simple stat with trend indicator

### 4. Stick-to-Driver Transfer Rate
- Compares stick speed gains to driver speed gains
- Plain language assessment:
  - "Your stick gains are transferring well" (driver speed keeping pace with stick improvements)
  - "Your driver speed hasn't caught up to your stick progress yet" (sticks improving but driver lagging)
- Logic: compare the ratio of driver speed improvement to average stick speed improvement over the loaded timeframe

### 5. Session History Log
- List of sessions: date, protocol week/session, key speeds per stick and driver max-out
- Tappable to see full session detail (all 14 fields)
- Sorted most recent first

### 6. Consistency View
- Sessions per week over the last 8 weeks
- Color-coded by whether the user hit the protocol minimum (3x/week)
- Could be a simple grid or bar chart: 8 columns, each showing session count with green (≥3) or yellow/red (<3) coloring

### 7. Protocol Progress
- Current protocol level and week, with a completion bar
- When a protocol level finishes, this section shows the full run summary:
  - Start speed, finish speed, total gain, PRs set during the level
- Note: the current app only has "superspeed-l1" protocol — this section may be simple for now but should be structured to support multiple levels later

## Open Questions for Spec Writing
- How much session history to load? 30 days (current hook), 90 days, or all-time?
- What defines "protocol week/session" — is this just sequential numbering of sessions, or is there a formal week structure in the protocol?
- For the session detail tap-through, is that another screen or an inline expand?
- What chart library to use? Need to evaluate compatibility with Expo 54 / RN 0.81 / Reanimated 4
