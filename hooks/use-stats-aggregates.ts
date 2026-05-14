import { useState, useEffect } from 'react';
import { loadSpeedStats, loadStrengthStats, formatDate } from '@/utils/storage';
import type { SpeedStats, StrengthStats } from '@/utils/storage';
import { DRIVER_MILESTONES } from '@/constants/speed-protocols';
import { STREAK_MILESTONES } from '@/constants/strength-protocols';

export type SpeedCardMode = 'newPR' | 'nearMilestone' | 'stale' | 'default' | 'empty';
export type StrengthCardMode = 'newPR' | 'streakNearMilestone' | 'activeStreak' | 'default' | 'empty';

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function deriveSpeedCardMode(stats: SpeedStats | null, today: string): SpeedCardMode {
  if (!stats || !stats.driverPR) return 'empty';

  // 1. newPR: PR date === lastSessionDate AND within 2 days of today AND previousDriverPR exists
  if (
    stats.driverPR.date === stats.lastSessionDate &&
    stats.lastSessionDate &&
    daysBetween(stats.lastSessionDate, today) <= 2 &&
    stats.previousDriverPR
  ) {
    return 'newPR';
  }

  // 2. nearMilestone: PR within 2 mph of next milestone
  const nextMilestone = DRIVER_MILESTONES.find((m) => m > stats.driverPR!.mph);
  if (nextMilestone && nextMilestone - stats.driverPR.mph <= 2) {
    return 'nearMilestone';
  }

  // 3. stale: last session 4+ days ago
  if (stats.lastSessionDate && daysBetween(stats.lastSessionDate, today) >= 4) {
    return 'stale';
  }

  // 4. default
  return 'default';
}

function deriveStrengthCardMode(stats: StrengthStats | null, today: string): StrengthCardMode {
  if (!stats || Object.keys(stats.exercisePRs).length === 0) return 'empty';

  // 1. newPR: lastPR date === today
  if (stats.lastPR && stats.lastPR.date === today) {
    return 'newPR';
  }

  const streakActive =
    stats.streak.lastSessionDate &&
    daysBetween(stats.streak.lastSessionDate, today) <= 2;

  // 2. streakNearMilestone: active streak within 2 days of a milestone
  if (streakActive) {
    const nextMilestone = STREAK_MILESTONES.find((m) => m > stats.streak.days);
    if (nextMilestone && nextMilestone - stats.streak.days <= 2) {
      return 'streakNearMilestone';
    }
  }

  // 3. activeStreak: active and >= 3 days
  if (streakActive && stats.streak.days >= 3) {
    return 'activeStreak';
  }

  // 4. default
  return 'default';
}

export function useStatsAggregates() {
  const [speedStats, setSpeedStats] = useState<SpeedStats | null>(null);
  const [strengthStats, setStrengthStats] = useState<StrengthStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [speed, strength] = await Promise.all([
        loadSpeedStats(),
        loadStrengthStats(),
      ]);
      if (cancelled) return;
      setSpeedStats(speed);
      setStrengthStats(strength);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const today = formatDate(new Date());
  const speedCardMode = deriveSpeedCardMode(speedStats, today);
  const strengthCardMode = deriveStrengthCardMode(strengthStats, today);

  return {
    speedStats,
    strengthStats,
    speedCardMode,
    strengthCardMode,
    loading,
  };
}
