import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { Habit, HabitCategory } from '@/constants/habits';
import { loadQueueOrder, computeQueueOrder, saveQueueOrder, recomputeIfStale } from '@/utils/queue-order';

const CATEGORY_ORDER: HabitCategory[] = ['golf', 'workout', 'lifestyle'];

/**
 * Hook that returns today's habits sorted by learned queue order,
 * with completed habits sunk to the bottom.
 *
 * The order is cached for the current session and does not react
 * to real-time recompute results (stability guarantee).
 */
export function useQueueOrder(
  todayHabits: Habit[],
  getHabitProgress: (id: string) => { complete: boolean },
): Habit[] {
  const [learnedOrder, setLearnedOrder] = useState<string[] | null>(null);
  const sessionLoadedRef = useRef(false);

  const habitCategoryMap = useMemo(() => {
    const map: Record<string, HabitCategory> = {};
    for (const h of todayHabits) {
      map[h.id] = h.category;
    }
    return map;
  }, [todayHabits]);

  const activeIds = useMemo(
    () => todayHabits.map((h) => h.id),
    [todayHabits],
  );

  // Load stored order on mount (once per session)
  useEffect(() => {
    if (sessionLoadedRef.current) return;
    sessionLoadedRef.current = true;

    (async () => {
      const stored = await loadQueueOrder();
      if (stored) {
        setLearnedOrder(stored.order);
      } else if (activeIds.length > 0) {
        // First launch: compute and store
        const order = await computeQueueOrder(activeIds, habitCategoryMap);
        await saveQueueOrder({ order, computedAt: new Date().toISOString() });
        setLearnedOrder(order);
      }

      // Background: recompute if stale (result NOT applied this session)
      recomputeIfStale(activeIds, habitCategoryMap).catch(() => {});
    })();
  }, [activeIds, habitCategoryMap]);

  // Sort helper: position in learned order, or Infinity for unknown
  const sortByOrder = useCallback(
    (a: Habit, b: Habit): number => {
      if (!learnedOrder) {
        // Fallback: category order
        const catA = CATEGORY_ORDER.indexOf(a.category);
        const catB = CATEGORY_ORDER.indexOf(b.category);
        return catA - catB;
      }
      const idxA = learnedOrder.indexOf(a.id);
      const idxB = learnedOrder.indexOf(b.id);
      const posA = idxA >= 0 ? idxA : 1000 + CATEGORY_ORDER.indexOf(a.category);
      const posB = idxB >= 0 ? idxB : 1000 + CATEGORY_ORDER.indexOf(b.category);
      return posA - posB;
    },
    [learnedOrder],
  );

  return useMemo(() => {
    const incomplete = todayHabits
      .filter((h) => !getHabitProgress(h.id).complete)
      .sort(sortByOrder);
    const completed = todayHabits
      .filter((h) => getHabitProgress(h.id).complete)
      .sort(sortByOrder);
    return [...incomplete, ...completed];
  }, [todayHabits, getHabitProgress, sortByOrder]);
}
