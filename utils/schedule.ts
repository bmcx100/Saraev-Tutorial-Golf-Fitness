import type { ScheduleConfig } from '@/contexts/user-context';
import { HABIT_LIBRARY } from '@/constants/habits';

/**
 * Returns the habit IDs that are scheduled for a given date.
 *
 * Priority:
 * 1. If a habit's category has a rotation → include only if it's the rotation pick for that day
 * 2. Else if habitWeekdays[habitId] exists and is non-empty → include if today's weekday matches
 * 3. Else → include always (unscheduled = daily)
 */
export function getScheduledHabitIds(
  date: string,
  activeHabitIds: string[],
  schedule: ScheduleConfig,
): string[] {
  const dayOfWeek = new Date(date + 'T00:00:00').getDay(); // 0=Sun … 6=Sat

  return activeHabitIds.filter((habitId) => {
    const habit = HABIT_LIBRARY.find((h) => h.id === habitId);
    if (!habit) return false;

    // Check category rotation
    const rotation = schedule.categoryRotations[habit.category];
    if (rotation && rotation.sequence.length > 0) {
      const cycleDay = getCycleDayIndex(date, rotation.startDate, rotation.sequence.length);
      return rotation.sequence[cycleDay] === habitId;
    }

    // Check weekday assignment
    const weekdays = schedule.habitWeekdays[habitId];
    if (weekdays && weekdays.length > 0) {
      return weekdays.includes(dayOfWeek);
    }

    // No schedule = daily
    return true;
  });
}

/**
 * Returns the 0-based cycle day index for a given date.
 * Uses double-modulo to handle dates before startDate (wraps backward).
 */
export function getCycleDayIndex(
  date: string,
  startDate: string,
  cycleLength: number,
): number {
  const daysBetween = Math.floor(
    (Date.parse(date + 'T00:00:00') - Date.parse(startDate + 'T00:00:00')) / 86_400_000,
  );
  return ((daysBetween % cycleLength) + cycleLength) % cycleLength;
}
