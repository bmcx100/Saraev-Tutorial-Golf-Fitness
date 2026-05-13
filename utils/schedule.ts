import type { ScheduleConfig, HabitGoalConfig } from '@/contexts/user-context';
import { HABIT_LIBRARY } from '@/constants/habits';

const WEEKDAY_SPREAD: Record<number, number[]> = {
  1: [3],
  2: [1, 4],
  3: [1, 3, 5],
  4: [1, 2, 4, 5],
  5: [1, 2, 3, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

export function getGoalWeekdays(goal: HabitGoalConfig): number[] {
  if (goal.period === 'daily') {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  let daysPerWeek: number;
  if (goal.period === 'weekly') {
    daysPerWeek = goal.count;
  } else {
    // monthly: convert to weekly rate
    daysPerWeek = Math.round(goal.count * 7 / 30);
  }

  daysPerWeek = Math.max(1, Math.min(7, daysPerWeek));
  return WEEKDAY_SPREAD[daysPerWeek];
}

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
