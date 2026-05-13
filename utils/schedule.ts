import type { ScheduleConfig } from '@/contexts/user-context';
import { HABIT_LIBRARY } from '@/constants/habits';

/**
 * Returns the habit IDs that are scheduled for a given date.
 *
 * If habitWeekdays[habitId] exists and is non-empty → include if today's weekday matches.
 * Otherwise → include always (unscheduled = daily).
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

    // Check weekday assignment
    const weekdays = schedule.habitWeekdays[habitId];
    if (weekdays && weekdays.length > 0) {
      return weekdays.includes(dayOfWeek);
    }

    // No schedule = daily
    return true;
  });
}
