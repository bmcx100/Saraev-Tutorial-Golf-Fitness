/**
 * Pure logic for onboarding flow — extracted for testability.
 * No React or RN dependencies.
 */

export type PlanItem = {
  id: string;
  name: string;
  meta: string;
  tile: { bg: string; fg: string; icon: string };
};

export type PlanSection = {
  id: string;
  title: string;
  items: PlanItem[];
};

export const PLAN_SECTIONS: PlanSection[] = [
  {
    id: 'golf',
    title: 'Golf',
    items: [
      { id: 'speed-training', name: 'Speed Training', meta: '1 session · binary', tile: { bg: '#dde9d4', fg: '#1d4e34', icon: 'bolt' } },
      { id: 'driver', name: 'Driver', meta: '1 session · binary', tile: { bg: '#bcdfc6', fg: '#1d4e34', icon: 'flag' } },
      { id: 'putt', name: 'Putting', meta: '2 sessions · accuracy', tile: { bg: '#bcdfc6', fg: '#1d4e34', icon: 'tee' } },
    ],
  },
  {
    id: 'workouts',
    title: 'Workouts',
    items: [
      { id: 'gym', name: 'Strength Training', meta: '1 session · binary', tile: { bg: '#f1d9cc', fg: '#cc6f4a', icon: 'dumbbell' } },
      { id: 'cardio', name: 'Cardio', meta: '1 session · binary', tile: { bg: '#f3eccd', fg: '#a37a1f', icon: 'trend' } },
      { id: 'core', name: 'Core', meta: '1 session · binary', tile: { bg: '#dbe6f0', fg: '#3a6688', icon: 'spark' } },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    items: [
      { id: 'meals', name: 'Meals', meta: '3× daily · log', tile: { bg: '#e7d8f0', fg: '#6b4288', icon: 'check' } },
      { id: 'sleep', name: 'Sleep', meta: 'Nightly · 7h target', tile: { bg: '#dbe6f0', fg: '#3a6688', icon: 'spark' } },
    ],
  },
];

export const ALL_PLAN_IDS = PLAN_SECTIONS.flatMap((s) => s.items.map((i) => i.id));

/** Toggle a track id in/out of the set. Returns a new Set. */
export function toggleTrack(prev: Set<string>, id: string): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/** Toggle all on/off. If all selected, clears. Otherwise selects all. */
export function toggleAll(prev: Set<string>): Set<string> {
  if (prev.size === ALL_PLAN_IDS.length) return new Set();
  return new Set(ALL_PLAN_IDS);
}

/** Count selected items in a section. */
export function sectionCount(section: PlanSection, selected: Set<string>): number {
  return section.items.filter((i) => selected.has(i.id)).length;
}

/** Determine if CTA is enabled for a given step. */
export function isCtaEnabled(
  step: number,
  selectedTracks: Set<string>,
  selectedChallenge: string | null,
): boolean {
  if (step === 1) return true;
  if (step === 2) return selectedTracks.size > 0;
  if (step === 3) return selectedChallenge !== null;
  return false;
}

/** Whether "Select all" label should show "Clear all". */
export function isAllSelected(selected: Set<string>): boolean {
  return selected.size === ALL_PLAN_IDS.length;
}
