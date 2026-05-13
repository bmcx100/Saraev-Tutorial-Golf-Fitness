import { useState, useEffect, useMemo } from 'react';
import { useUser } from '@/contexts/user-context';
import { useHabits } from '@/contexts/habit-context';
import { loadLogsForRange, formatDate } from '@/utils/storage';
import { calculatePace, getCompletionsInPeriod, type PaceStatus } from '@/utils/pace';
import { HABIT_LIBRARY } from '@/constants/habits';
import type { HabitLog } from '@/contexts/habit-context';

export interface PaceInfo {
  status: PaceStatus;
  completions: number;
  expected: number;
}

export function usePace(): {
  paceMap: Map<string, PaceInfo>;
  celebrationHabits: string[];
  warningHabits: string[];
} {
  const { profile, devDateOverride } = useUser();
  const { todayLogs } = useHabits();
  const [periodLogs, setPeriodLogs] = useState<Map<string, HabitLog[]>>(new Map());

  const currentDate = useMemo(
    () => (devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date()),
    [devDateOverride],
  );

  const schedule = profile.schedule;
  const habitModes = schedule.habitModes ?? {};
  const habitGoals = schedule.habitGoals ?? {};

  // Find all goal-mode habits
  const goalHabitIds = useMemo(
    () => Object.keys(habitModes).filter((id) => habitModes[id] === 'goal' && habitGoals[id]),
    [habitModes, habitGoals],
  );

  // Load logs for the maximum period needed (31 days for monthly)
  useEffect(() => {
    if (goalHabitIds.length === 0) {
      setPeriodLogs(new Map());
      return;
    }

    (async () => {
      // Load up to 31 days back from currentDate
      const dates: string[] = [];
      for (let i = 30; i >= 0; i--) {
        const d = new Date(currentDate);
        d.setDate(d.getDate() - i);
        dates.push(formatDate(d));
      }
      const logs = await loadLogsForRange(dates);

      // Merge in today's live logs so pace updates immediately after logging
      const todayStr = formatDate(currentDate);
      logs.set(todayStr, todayLogs);

      setPeriodLogs(logs);
    })();
  }, [goalHabitIds.length, currentDate, todayLogs]);

  const result = useMemo(() => {
    const paceMap = new Map<string, PaceInfo>();
    const celebrationHabits: string[] = [];
    const warningHabits: string[] = [];

    for (const habitId of goalHabitIds) {
      const goal = habitGoals[habitId];
      if (!goal) continue;

      const completions = getCompletionsInPeriod(habitId, goal.period, currentDate, periodLogs);

      // Calculate expected for the info object
      let expected: number;
      if (goal.period === 'daily') {
        expected = goal.count;
      } else if (goal.period === 'weekly') {
        const dayOfWeek = currentDate.getDay();
        const elapsed = (dayOfWeek + 6) % 7 + 1;
        expected = goal.count * elapsed / 7;
      } else {
        const elapsed = currentDate.getDate();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const daysInMonth = new Date(year, month, 0).getDate();
        expected = goal.count * elapsed / daysInMonth;
      }

      const status = calculatePace(completions, goal.count, goal.period, currentDate);
      paceMap.set(habitId, { status, completions, expected });

      const habit = HABIT_LIBRARY.find((h) => h.id === habitId);
      if (status === 'celebrate' && habit) {
        celebrationHabits.push(habit.name);
      } else if (status === 'far-behind' && habit) {
        warningHabits.push(habit.name);
      }
    }

    return { paceMap, celebrationHabits, warningHabits };
  }, [goalHabitIds, habitGoals, currentDate, periodLogs]);

  return result;
}
