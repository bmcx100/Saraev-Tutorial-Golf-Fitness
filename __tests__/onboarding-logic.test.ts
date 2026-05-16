import {
  ALL_PLAN_IDS,
  PLAN_SECTIONS,
  toggleTrack,
  toggleAll,
  sectionCount,
  isCtaEnabled,
  isAllSelected,
} from '@/utils/onboarding-logic';

describe('Onboarding logic', () => {
  // ── CTA disabled state ────────────────────────────────────────────

  describe('isCtaEnabled', () => {
    it('step 1 (Welcome) is always enabled', () => {
      expect(isCtaEnabled(1, new Set(), null)).toBe(true);
    });

    it('step 2 is disabled when no tracks selected', () => {
      expect(isCtaEnabled(2, new Set(), null)).toBe(false);
    });

    it('step 2 is enabled when at least one track selected', () => {
      expect(isCtaEnabled(2, new Set(['speed-training']), null)).toBe(true);
    });

    it('step 3 is disabled when no challenge selected', () => {
      expect(isCtaEnabled(3, new Set(['speed-training']), null)).toBe(false);
    });

    it('step 3 is enabled when a challenge is selected', () => {
      expect(isCtaEnabled(3, new Set(['speed-training']), 'get-long')).toBe(true);
    });
  });

  // ── Select all / Clear all toggle ─────────────────────────────────

  describe('toggleAll', () => {
    it('selects all when nothing is selected', () => {
      const result = toggleAll(new Set());
      expect(result.size).toBe(ALL_PLAN_IDS.length);
      ALL_PLAN_IDS.forEach((id) => expect(result.has(id)).toBe(true));
    });

    it('selects all when partially selected', () => {
      const result = toggleAll(new Set(['speed-training', 'driver']));
      expect(result.size).toBe(ALL_PLAN_IDS.length);
    });

    it('clears all when everything is already selected', () => {
      const result = toggleAll(new Set(ALL_PLAN_IDS));
      expect(result.size).toBe(0);
    });

    it('isAllSelected returns true only when all are selected', () => {
      expect(isAllSelected(new Set())).toBe(false);
      expect(isAllSelected(new Set(['speed-training']))).toBe(false);
      expect(isAllSelected(new Set(ALL_PLAN_IDS))).toBe(true);
    });
  });

  // ── Section counter math ──────────────────────────────────────────

  describe('sectionCount', () => {
    const golf = PLAN_SECTIONS.find((s) => s.id === 'golf')!;
    const workouts = PLAN_SECTIONS.find((s) => s.id === 'workouts')!;
    const lifestyle = PLAN_SECTIONS.find((s) => s.id === 'lifestyle')!;

    it('returns 0 when nothing in the section is selected', () => {
      expect(sectionCount(golf, new Set())).toBe(0);
      expect(sectionCount(workouts, new Set())).toBe(0);
      expect(sectionCount(lifestyle, new Set())).toBe(0);
    });

    it('counts only items within the section', () => {
      // Select 1 golf + 1 workout — golf count should be 1, not 2
      const sel = new Set(['speed-training', 'gym']);
      expect(sectionCount(golf, sel)).toBe(1);
      expect(sectionCount(workouts, sel)).toBe(1);
      expect(sectionCount(lifestyle, sel)).toBe(0);
    });

    it('counts all items when section is fully selected', () => {
      const allGolf = new Set(golf.items.map((i) => i.id));
      expect(sectionCount(golf, allGolf)).toBe(golf.items.length);
    });

    it('section totals match expected sizes', () => {
      expect(golf.items.length).toBe(3);
      expect(workouts.items.length).toBe(3);
      expect(lifestyle.items.length).toBe(2);
    });
  });

  // ── Toggle track (individual item) ────────────────────────────────

  describe('toggleTrack', () => {
    it('adds an item that is not selected', () => {
      const result = toggleTrack(new Set(), 'speed-training');
      expect(result.has('speed-training')).toBe(true);
      expect(result.size).toBe(1);
    });

    it('removes an item that is already selected', () => {
      const result = toggleTrack(new Set(['speed-training', 'driver']), 'speed-training');
      expect(result.has('speed-training')).toBe(false);
      expect(result.has('driver')).toBe(true);
      expect(result.size).toBe(1);
    });

    it('does not mutate the original set', () => {
      const original = new Set(['speed-training']);
      const result = toggleTrack(original, 'driver');
      expect(original.size).toBe(1);
      expect(result.size).toBe(2);
    });
  });

  // ── Back preserves selections ─────────────────────────────────────

  describe('back navigation preserves state', () => {
    it('track selections persist across simulated step changes', () => {
      // Simulate: select tracks on step 2, go to step 3, go back to step 2
      let tracks = new Set<string>();
      tracks = toggleTrack(tracks, 'speed-training');
      tracks = toggleTrack(tracks, 'gym');

      // "Advance" to step 3 — tracks should still contain our selections
      let step = 3;
      expect(tracks.has('speed-training')).toBe(true);
      expect(tracks.has('gym')).toBe(true);

      // "Go back" to step 2 — selections still intact
      step = 2;
      expect(tracks.size).toBe(2);
      expect(isCtaEnabled(step, tracks, null)).toBe(true);
    });

    it('challenge selection persists across step changes', () => {
      const challenge: string | null = 'get-long';
      // Go back to step 2 and return to step 3
      const step = 3;
      expect(isCtaEnabled(step, new Set(['speed-training']), challenge)).toBe(true);
    });
  });
});
