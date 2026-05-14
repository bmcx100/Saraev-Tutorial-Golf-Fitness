import { useState, useEffect, useMemo } from 'react';
import { formatDate, dateRange, loadStrengthSessionRange, loadStrengthStats } from '@/utils/storage';
import type { StrengthStats } from '@/utils/storage';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import { WORKOUT_ROTATION } from '@/constants/strength-protocols';

// ── Types ────────────────────────────────────────────────────

export interface SessionVolume {
  date: string;
  volume: number;
  workoutDay: WorkoutDay;
}

export interface CurrentCycle {
  completed: WorkoutDay[];
  total: number;
}

// ── Hook ─────────────────────────────────────────────────────

export function useStrengthDetail() {
  const [sessions, setSessions] = useState<StrengthSession[]>([]);
  const [strengthStats, setStrengthStats] = useState<StrengthStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - 29); // 30 days including today
      const dates = dateRange(formatDate(start), 30);

      const [sessionData, stats] = await Promise.all([
        loadStrengthSessionRange(dates),
        loadStrengthStats(),
      ]);

      if (cancelled) return;

      // Sort most-recent-first for display
      sessionData.sort((a, b) => b.date.localeCompare(a.date));
      setSessions(sessionData);
      setStrengthStats(stats);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Volume per session (date-ascending for chart)
  const sessionVolumes = useMemo<SessionVolume[]>(() => {
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    return sorted.map((s) => {
      let volume = 0;
      for (const ex of s.exercises) {
        for (const set of ex.sets) {
          if (set.completed) {
            volume += (set.weight ?? 0) * set.reps;
          }
        }
      }
      return { date: s.date, volume, workoutDay: s.workoutDay };
    });
  }, [sessions]);

  // Cycle counting from 30-day window
  const currentCycle = useMemo<CurrentCycle>(() => {
    // Process date-ascending
    const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
    let total = 0;
    const seen = new Set<WorkoutDay>();

    for (const s of sorted) {
      seen.add(s.workoutDay);
      if (seen.size === WORKOUT_ROTATION.length) {
        total++;
        seen.clear();
      }
    }

    return {
      completed: [...seen],
      total,
    };
  }, [sessions]);

  return {
    sessions,
    sessionVolumes,
    currentCycle,
    strengthStats,
    loading,
  };
}
