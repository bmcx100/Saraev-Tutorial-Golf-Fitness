import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadLogsForRange, formatDate } from '@/utils/storage';
import type { HabitCategory } from '@/constants/habits';

const QUEUE_ORDER_KEY = 'queue-order';

const CATEGORY_ORDER: HabitCategory[] = ['golf', 'workout', 'lifestyle'];

interface StoredQueueOrder {
  order: string[];
  computedAt: string;
}

export async function loadQueueOrder(): Promise<StoredQueueOrder | null> {
  const raw = await AsyncStorage.getItem(QUEUE_ORDER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveQueueOrder(order: StoredQueueOrder): Promise<void> {
  await AsyncStorage.setItem(QUEUE_ORDER_KEY, JSON.stringify(order));
}

/**
 * Compute the learned queue order from 14 days of habit completion data.
 * Sorts habits by their average completion hour-of-day (earliest first).
 * Habits with no data fall back to category order.
 */
export async function computeQueueOrder(
  activeHabitIds: string[],
  habitCategoryMap: Record<string, HabitCategory>,
  baseDate?: Date,
): Promise<string[]> {
  const base = baseDate ?? new Date();
  const dates: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }

  const allLogs = await loadLogsForRange(dates);

  // Collect all completedAt timestamps per habit
  const hoursByHabit = new Map<string, number[]>();
  for (const [, logs] of allLogs) {
    for (const log of logs) {
      if (!log.completedAt || !activeHabitIds.includes(log.habitId)) continue;
      const d = new Date(log.completedAt);
      const hour = d.getHours() + d.getMinutes() / 60;
      const existing = hoursByHabit.get(log.habitId) ?? [];
      existing.push(hour);
      hoursByHabit.set(log.habitId, existing);
    }
  }

  // Compute average hour per habit
  const avgHourMap = new Map<string, number>();
  for (const [habitId, hours] of hoursByHabit) {
    const avg = hours.reduce((sum, h) => sum + h, 0) / hours.length;
    avgHourMap.set(habitId, avg);
  }

  // Split into habits with data vs without
  const withData = activeHabitIds.filter((id) => avgHourMap.has(id));
  const withoutData = activeHabitIds.filter((id) => !avgHourMap.has(id));

  // Sort habits with data by avg completion hour
  withData.sort((a, b) => (avgHourMap.get(a) ?? 0) - (avgHourMap.get(b) ?? 0));

  // Sort habits without data by category order
  withoutData.sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(habitCategoryMap[a] ?? 'lifestyle');
    const catB = CATEGORY_ORDER.indexOf(habitCategoryMap[b] ?? 'lifestyle');
    return catA - catB;
  });

  return [...withData, ...withoutData];
}

/**
 * Recompute and save queue order if stale (>24h since last computation).
 * Returns true if recomputation occurred.
 */
export async function recomputeIfStale(
  activeHabitIds: string[],
  habitCategoryMap: Record<string, HabitCategory>,
  baseDate?: Date,
): Promise<boolean> {
  const stored = await loadQueueOrder();
  if (stored) {
    const elapsed = Date.now() - new Date(stored.computedAt).getTime();
    if (elapsed < 24 * 60 * 60 * 1000) return false;
  }

  const order = await computeQueueOrder(activeHabitIds, habitCategoryMap, baseDate);
  await saveQueueOrder({ order, computedAt: new Date().toISOString() });
  return true;
}
