import { useState, useEffect, useMemo } from 'react';
import { formatDate, dateRange, loadSpeedSessionRange, loadStrengthSessionRange } from '@/utils/storage';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';

export interface DriverSpeedEntry {
  date: string;
  mph: number;
}

export interface LatestStrengthDay {
  date: string;
  workoutDay: WorkoutDay;
  totalVolume: number;
}

export function useTrainingHistory() {
  const [speedSessions, setSpeedSessions] = useState<SpeedSession[]>([]);
  const [strengthSessions, setStrengthSessions] = useState<StrengthSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - 29); // 30 days including today
      const dates = dateRange(formatDate(start), 30);

      const [speed, strength] = await Promise.all([
        loadSpeedSessionRange(dates),
        loadStrengthSessionRange(dates),
      ]);

      if (cancelled) return;

      // Sort by date ascending
      speed.sort((a, b) => a.date.localeCompare(b.date));
      strength.sort((a, b) => a.date.localeCompare(b.date));

      setSpeedSessions(speed);
      setStrengthSessions(strength);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const driverSpeeds = useMemo<DriverSpeedEntry[]>(() => {
    return speedSessions
      .filter((s) => s.maxOut.driver != null)
      .map((s) => ({ date: s.date, mph: s.maxOut.driver! }));
  }, [speedSessions]);

  const latestDriverSpeed = useMemo<number | null>(() => {
    return driverSpeeds.length > 0 ? driverSpeeds[driverSpeeds.length - 1].mph : null;
  }, [driverSpeeds]);

  const bestDriverSpeed = useMemo<number | null>(() => {
    if (driverSpeeds.length === 0) return null;
    return Math.max(...driverSpeeds.map((d) => d.mph));
  }, [driverSpeeds]);

  const strengthSessionCount = strengthSessions.length;

  const latestStrengthDay = useMemo<LatestStrengthDay | null>(() => {
    if (strengthSessions.length === 0) return null;
    const latest = strengthSessions[strengthSessions.length - 1];
    let totalVolume = 0;
    for (const exercise of latest.exercises) {
      for (const set of exercise.sets) {
        if (set.completed) {
          totalVolume += (set.weight ?? 0) * set.reps;
        }
      }
    }
    return {
      date: latest.date,
      workoutDay: latest.workoutDay,
      totalVolume,
    };
  }, [strengthSessions]);

  return {
    speedSessions,
    strengthSessions,
    loading,
    driverSpeeds,
    latestDriverSpeed,
    bestDriverSpeed,
    strengthSessionCount,
    latestStrengthDay,
  };
}
