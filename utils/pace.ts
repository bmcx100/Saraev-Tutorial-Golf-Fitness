import type { HabitLog } from '@/contexts/habit-context';

export type PaceStatus = 'celebrate' | 'ahead' | 'on-track' | 'behind' | 'far-behind';

export function calculatePace(
  completions: number,
  goalCount: number,
  goalPeriod: 'daily' | 'weekly' | 'monthly',
  currentDate: Date,
): PaceStatus {
  let expected: number;

  if (goalPeriod === 'daily') {
    expected = goalCount;
  } else if (goalPeriod === 'weekly') {
    // Monday=1 through Sunday=7
    const dayOfWeek = currentDate.getDay();
    const elapsed = (dayOfWeek + 6) % 7 + 1; // Mon=1, Sun=7
    expected = goalCount * elapsed / 7;
  } else {
    // monthly
    const elapsed = currentDate.getDate();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    expected = goalCount * elapsed / daysInMonth;
  }

  if (expected < 1) return 'on-track';

  const ratio = completions / expected;

  if (ratio >= 1.25) return 'celebrate';
  if (ratio >= 1.0) return 'ahead';
  if (ratio >= 0.75) return 'behind';
  return 'far-behind';
}

export function getCompletionsInPeriod(
  habitId: string,
  goalPeriod: 'daily' | 'weekly' | 'monthly',
  currentDate: Date,
  logsMap: Map<string, HabitLog[]>,
): number {
  const periodDates = getPeriodDates(goalPeriod, currentDate);
  let completions = 0;

  for (const date of periodDates) {
    const logs = logsMap.get(date);
    if (!logs) continue;
    const log = logs.find((l) => l.habitId === habitId);
    if (log && log.count >= 1) {
      completions++;
    }
  }

  return completions;
}

function getPeriodDates(
  goalPeriod: 'daily' | 'weekly' | 'monthly',
  currentDate: Date,
): string[] {
  const dates: string[] = [];
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  if (goalPeriod === 'daily') {
    dates.push(fmt(currentDate));
  } else if (goalPeriod === 'weekly') {
    // Monday through current day
    const dayOfWeek = currentDate.getDay();
    const daysSinceMonday = (dayOfWeek + 6) % 7;
    for (let i = daysSinceMonday; i >= 0; i--) {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - i);
      dates.push(fmt(d));
    }
  } else {
    // Monthly: 1st through current day
    const dayOfMonth = currentDate.getDate();
    for (let i = 1; i <= dayOfMonth; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      dates.push(fmt(d));
    }
  }

  return dates;
}
