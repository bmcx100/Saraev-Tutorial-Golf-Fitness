import { useState, useEffect } from 'react';
import {
  loadStrengthStats,
  loadLastStrengthWorkoutDay,
  loadStrengthSessionRange,
  formatDate,
  dateRange,
} from '@/utils/storage';
import type { StrengthSession } from '@/constants/strength-protocols';
import { WORKOUT_ROTATION, WORKOUT_DAYS } from '@/constants/strength-protocols';

export interface StrengthHeroData {
  streak: number;
  topLift: number | null;
  volumeWeek: number | null;
  volumeDelta: number | null;
  nextWorkoutLabel: string;
  nextWorkoutSubtitle: string;
}

function computeVolume(sessions: StrengthSession[]): number {
  let total = 0;
  for (const session of sessions) {
    for (const ex of session.exercises) {
      for (const set of ex.sets) {
        if (set.completed && set.weight != null) {
          total += set.weight * set.reps;
        }
      }
    }
  }
  return total;
}

export function useStrengthHeroStats(enabled: boolean): StrengthHeroData | null {
  const [data, setData] = useState<StrengthHeroData | null>(null);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function load() {
      const [strengthStats, lastDay] = await Promise.all([
        loadStrengthStats(),
        loadLastStrengthWorkoutDay(),
      ]);

      // Next workout day in rotation
      let nextWorkoutLabel = 'LEGS 1';
      let nextWorkoutSubtitle = 'Legs 1 \u00B7 Quads';
      if (lastDay) {
        const idx = WORKOUT_ROTATION.indexOf(lastDay);
        const nextIdx = (idx + 1) % WORKOUT_ROTATION.length;
        const nextDay = WORKOUT_DAYS.find(d => d.key === WORKOUT_ROTATION[nextIdx]);
        if (nextDay) {
          nextWorkoutLabel = nextDay.label.toUpperCase();
          nextWorkoutSubtitle = `${nextDay.label} \u00B7 ${nextDay.subtitle}`;
        }
      } else {
        const firstDay = WORKOUT_DAYS[0];
        nextWorkoutLabel = firstDay.label.toUpperCase();
        nextWorkoutSubtitle = `${firstDay.label} \u00B7 ${firstDay.subtitle}`;
      }

      // Top lift: max weight across all exercise PRs
      let topLift: number | null = null;
      if (strengthStats?.exercisePRs) {
        for (const pr of Object.values(strengthStats.exercisePRs)) {
          if (topLift === null || pr.weight > topLift) {
            topLift = pr.weight;
          }
        }
      }

      // Weekly volume: load last 14 days of sessions
      const today = new Date();
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);
      const dates = dateRange(formatDate(twoWeeksAgo), 14);
      const recentSessions = await loadStrengthSessionRange(dates);

      const weekBoundary = formatDate(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
      );
      const thisWeek = recentSessions.filter(s => s.date >= weekBoundary);
      const lastWeek = recentSessions.filter(s => s.date < weekBoundary);

      const volumeWeek = thisWeek.length > 0 ? computeVolume(thisWeek) : null;
      const volumeLastWeek = lastWeek.length > 0 ? computeVolume(lastWeek) : null;

      let volumeDelta: number | null = null;
      if (volumeWeek != null && volumeLastWeek != null && volumeLastWeek > 0) {
        volumeDelta = volumeWeek - volumeLastWeek;
      }

      if (cancelled) return;

      setData({
        streak: strengthStats?.streak.days ?? 0,
        topLift,
        volumeWeek,
        volumeDelta,
        nextWorkoutLabel,
        nextWorkoutSubtitle,
      });
    }

    load();
    return () => { cancelled = true; };
  }, [enabled]);

  return data;
}
