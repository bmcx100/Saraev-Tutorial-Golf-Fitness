import { deriveTone } from '@/utils/strength-helpers';

describe('deriveTone', () => {
  it('marks fully-logged exercises as done', () => {
    const exercises = [
      { done: 3, total: 3 },
      { done: 0, total: 3 },
      { done: 0, total: 3 },
    ];
    expect(deriveTone(exercises, 0)).toBe('done');
  });

  it('marks the first incomplete exercise as next', () => {
    const exercises = [
      { done: 3, total: 3 },
      { done: 1, total: 3 },
      { done: 0, total: 3 },
    ];
    expect(deriveTone(exercises, 1)).toBe('next');
  });

  it('marks remaining incomplete exercises as idle', () => {
    const exercises = [
      { done: 3, total: 3 },
      { done: 1, total: 3 },
      { done: 0, total: 3 },
    ];
    expect(deriveTone(exercises, 2)).toBe('idle');
  });

  it('handles all exercises done', () => {
    const exercises = [
      { done: 3, total: 3 },
      { done: 3, total: 3 },
      { done: 3, total: 3 },
    ];
    expect(deriveTone(exercises, 0)).toBe('done');
    expect(deriveTone(exercises, 1)).toBe('done');
    expect(deriveTone(exercises, 2)).toBe('done');
  });

  it('handles no exercises started (first is next, rest idle)', () => {
    const exercises = [
      { done: 0, total: 3 },
      { done: 0, total: 3 },
      { done: 0, total: 3 },
    ];
    expect(deriveTone(exercises, 0)).toBe('next');
    expect(deriveTone(exercises, 1)).toBe('idle');
    expect(deriveTone(exercises, 2)).toBe('idle');
  });

  it('canonical state: done, next, idle, idle', () => {
    const exercises = [
      { done: 3, total: 3 }, // done
      { done: 1, total: 3 }, // next (first incomplete)
      { done: 0, total: 3 }, // idle
      { done: 0, total: 3 }, // idle
    ];
    expect(deriveTone(exercises, 0)).toBe('done');
    expect(deriveTone(exercises, 1)).toBe('next');
    expect(deriveTone(exercises, 2)).toBe('idle');
    expect(deriveTone(exercises, 3)).toBe('idle');
  });
});
