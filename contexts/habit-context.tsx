import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HABIT_LIBRARY, type Habit } from '@/constants/habits';
import { useUser } from '@/contexts/user-context';
import { loadLogs, saveLogs, loadLogsForRange, formatDate } from '@/utils/storage';
import { getScheduledHabitIds } from '@/utils/schedule';

export interface HabitLog {
  habitId: string;
  date: string;
  count: number;
  completedAt: string;
}

interface HabitContextType {
  activeHabits: Habit[];
  todayHabits: Habit[];
  todayLogs: HabitLog[];
  weekLogs: Map<string, HabitLog[]>;
  logHabit: (habitId: string) => { justCompleted: boolean; allDone: boolean };
  getHabitProgress: (habitId: string) => { count: number; target: number; complete: boolean };
}

const HabitContext = createContext<HabitContextType>({
  activeHabits: [],
  todayHabits: [],
  todayLogs: [],
  weekLogs: new Map(),
  logHabit: () => ({ justCompleted: false, allDone: false }),
  getHabitProgress: () => ({ count: 0, target: 1, complete: false }),
});

export const useHabits = () => useContext(HabitContext);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useUser();
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [weekLogs, setWeekLogs] = useState<Map<string, HabitLog[]>>(new Map());

  const activeHabits = HABIT_LIBRARY.filter((h) =>
    profile.activeHabitIds.includes(h.id),
  );

  const today = formatDate(new Date());

  const todayScheduledIds = getScheduledHabitIds(
    today,
    profile.activeHabitIds,
    profile.schedule,
  );
  const todayHabits = HABIT_LIBRARY.filter((h) =>
    todayScheduledIds.includes(h.id),
  );

  // Load today + past 7 days
  useEffect(() => {
    (async () => {
      const dates: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(formatDate(d));
      }
      const allLogs = await loadLogsForRange(dates);
      setWeekLogs(allLogs);
      setTodayLogs(allLogs.get(today) ?? []);
    })();
  }, [today, profile.activeHabitIds]);

  const getHabitProgress = useCallback(
    (habitId: string) => {
      const habit = HABIT_LIBRARY.find((h) => h.id === habitId);
      const target = habit?.targetCount ?? 1;
      const log = todayLogs.find((l) => l.habitId === habitId);
      const count = log?.count ?? 0;
      return { count, target, complete: count >= target };
    },
    [todayLogs],
  );

  const logHabit = useCallback(
    (habitId: string) => {
      const habit = HABIT_LIBRARY.find((h) => h.id === habitId);
      if (!habit) return { justCompleted: false, allDone: false };

      let updatedLogs: HabitLog[];
      const existing = todayLogs.find((l) => l.habitId === habitId);

      if (habit.trackingType === 'binary') {
        // Toggle: 0 → 1 or 1 → 0
        if (existing && existing.count >= 1) {
          updatedLogs = todayLogs.filter((l) => l.habitId !== habitId);
        } else {
          const newLog: HabitLog = {
            habitId,
            date: today,
            count: 1,
            completedAt: new Date().toISOString(),
          };
          updatedLogs = existing
            ? todayLogs.map((l) => (l.habitId === habitId ? newLog : l))
            : [...todayLogs, newLog];
        }
      } else {
        // Counter: increment by 1
        const newCount = (existing?.count ?? 0) + 1;
        const newLog: HabitLog = {
          habitId,
          date: today,
          count: newCount,
          completedAt: new Date().toISOString(),
        };
        updatedLogs = existing
          ? todayLogs.map((l) => (l.habitId === habitId ? newLog : l))
          : [...todayLogs, newLog];
      }

      setTodayLogs(updatedLogs);
      saveLogs(today, updatedLogs);

      // Update weekLogs for today
      setWeekLogs((prev) => {
        const next = new Map(prev);
        next.set(today, updatedLogs);
        return next;
      });

      // Compute return values
      const updatedLog = updatedLogs.find((l) => l.habitId === habitId);
      const justCompleted =
        !!updatedLog && updatedLog.count >= habit.targetCount &&
        (!existing || existing.count < habit.targetCount);

      const allDone = todayHabits.length > 0 && todayHabits.every((h) => {
        const log = updatedLogs.find((l) => l.habitId === h.id);
        return log ? log.count >= h.targetCount : false;
      });

      return { justCompleted, allDone };
    },
    [todayLogs, today, todayHabits],
  );

  return (
    <HabitContext.Provider
      value={{ activeHabits, todayHabits, todayLogs, weekLogs, logHabit, getHabitProgress }}
    >
      {children}
    </HabitContext.Provider>
  );
}
