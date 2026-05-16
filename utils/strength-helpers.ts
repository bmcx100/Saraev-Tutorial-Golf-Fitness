export type CardTone = 'idle' | 'next' | 'done';

/**
 * Derive the visual tone for an exercise card based on its position
 * in the workout and completion state.
 *
 * - `done`  — all sets completed
 * - `next`  — first exercise (in list order) with sets remaining
 * - `idle`  — incomplete but not the active exercise
 */
export function deriveTone(
  exercises: { done: number; total: number }[],
  index: number,
): CardTone {
  const ex = exercises[index];
  if (ex.done >= ex.total) return 'done';
  const firstIncomplete = exercises.findIndex((e) => e.done < e.total);
  if (firstIncomplete === index) return 'next';
  return 'idle';
}
