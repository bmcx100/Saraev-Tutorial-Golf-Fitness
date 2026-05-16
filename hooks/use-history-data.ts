import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/contexts/user-context';
import { useChallenges } from '@/contexts/challenge-context';
import {
  formatDate,
  dateRange,
  loadSpeedSessionRange,
  loadStrengthSessionRange,
  loadSpeedStats,
  loadStrengthStats,
} from '@/utils/storage';
import type { SpeedStats, StrengthStats } from '@/utils/storage';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import type { HabitLog } from '@/contexts/habit-context';

export interface DayActivity {
  habitsCompleted: number;
  habitsTotal: number;
  speedSession?: { driverMph: number | null; greenMph: number | null };
  strengthSession?: { workoutDay: WorkoutDay; volume: number };
}

export interface HistoryData {
  dailyActivity: Map<string, DayActivity>;
  speedStats: SpeedStats | null;
  strengthStats: StrengthStats | null;
  driverTrend: { direction: 'up' | 'down' | 'flat'; delta: number };
  speedJourney: { firstMph: number; currentMph: number; gain: number } | null;
  gymSpeedConnection: { gymSessions30d: number; driverDelta: number } | null;
  monthDays: { date: string; level: 0 | 1 | 2 | 3 }[];
  activeDaysCount: number;
  currentStreak: number;
  loading: boolean;
}

function getMonthDates(today: Date): string[] {
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates: string[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    dates.push(formatDate(new Date(year, month, d)));
  }
  return dates;
}

function computeVolume(session: StrengthSession): number {
  let total = 0;
  for (const ex of session.exercises) {
    for (const set of ex.sets) {
      if (set.completed && set.weight != null) {
        total += set.weight * set.reps;
      }
    }
  }
  return total;
}

export function useHistoryData(): HistoryData {
  const { profile } = useUser();
  const { completedChallenges } = useChallenges();

  const [dailyActivity, setDailyActivity] = useState<Map<string, DayActivity>>(new Map());
  const [speedStats, setSpeedStats] = useState<SpeedStats | null>(null);
  const [strengthStats, setStrengthStats] = useState<StrengthStats | null>(null);
  const [speedSessions, setSpeedSessions] = useState<SpeedSession[]>([]);
  const [strengthSessions, setStrengthSessions] = useState<StrengthSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const today = new Date();
      const start = new Date(today);
      start.setDate(start.getDate() - 29);
      const dates = dateRange(formatDate(start), 30);

      const [speedSess, strengthSess, speedSt, strengthSt] = await Promise.all([
        loadSpeedSessionRange(dates),
        loadStrengthSessionRange(dates),
        loadSpeedStats(),
        loadStrengthStats(),
      ]);

      // Load habit logs
      const habitKeys = dates.map((d) => `habit-logs-${d}`);
      const habitPairs = await AsyncStorage.multiGet(habitKeys);
      const habitMap = new Map<string, HabitLog[]>();
      for (const [key, raw] of habitPairs) {
        const date = key.replace('habit-logs-', '');
        habitMap.set(date, raw ? JSON.parse(raw) : []);
      }

      if (cancelled) return;

      // Build dailyActivity map
      const activity = new Map<string, DayActivity>();
      const totalHabits = profile.activeHabitIds.length;

      for (const date of dates) {
        const logs = habitMap.get(date) ?? [];
        const completed = logs.filter((l) => l.count > 0).length;
        const day: DayActivity = {
          habitsCompleted: completed,
          habitsTotal: totalHabits,
        };

        const speedSession = speedSess.find((s) => s.date === date);
        if (speedSession) {
          day.speedSession = {
            driverMph: speedSession.maxOut.driver,
            greenMph: speedSession.maxOut.green,
          };
        }

        const strengthSession = strengthSess.find((s) => s.date === date);
        if (strengthSession) {
          day.strengthSession = {
            workoutDay: strengthSession.workoutDay,
            volume: computeVolume(strengthSession),
          };
        }

        activity.set(date, day);
      }

      setDailyActivity(activity);
      setSpeedStats(speedSt);
      setStrengthStats(strengthSt);
      setSpeedSessions(speedSess);
      setStrengthSessions(strengthSess);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [profile.activeHabitIds]);

  const driverTrend = useMemo<HistoryData['driverTrend']>(() => {
    const sorted = [...speedSessions]
      .filter((s) => s.maxOut.driver != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (sorted.length < 2) return { direction: 'flat', delta: 0 };

    const first = sorted[0].maxOut.driver!;
    const last = sorted[sorted.length - 1].maxOut.driver!;
    const delta = Math.round((last - first) * 10) / 10;

    if (delta > 0) return { direction: 'up', delta };
    if (delta < 0) return { direction: 'down', delta: Math.abs(delta) };
    return { direction: 'flat', delta: 0 };
  }, [speedSessions]);

  const speedJourney = useMemo<HistoryData['speedJourney']>(() => {
    const sorted = [...speedSessions]
      .filter((s) => s.maxOut.driver != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (sorted.length < 2) return null;

    const firstMph = sorted[0].maxOut.driver!;
    const currentMph = sorted[sorted.length - 1].maxOut.driver!;
    return {
      firstMph,
      currentMph,
      gain: Math.round((currentMph - firstMph) * 10) / 10,
    };
  }, [speedSessions]);

  const gymSpeedConnection = useMemo<HistoryData['gymSpeedConnection']>(() => {
    if (!profile.speedProtocol || !profile.strengthProtocol) return null;
    if (strengthSessions.length === 0) return null;

    const sorted = [...speedSessions]
      .filter((s) => s.maxOut.driver != null)
      .sort((a, b) => a.date.localeCompare(b.date));

    let driverDelta = 0;
    if (sorted.length >= 2) {
      driverDelta = Math.round(
        (sorted[sorted.length - 1].maxOut.driver! - sorted[0].maxOut.driver!) * 10
      ) / 10;
    }

    return {
      gymSessions30d: strengthSessions.length,
      driverDelta,
    };
  }, [speedSessions, strengthSessions, profile.speedProtocol, profile.strengthProtocol]);

  const monthDays = useMemo<HistoryData['monthDays']>(() => {
    const today = new Date();
    const monthDates = getMonthDates(today);

    return monthDates.map((date) => {
      const day = dailyActivity.get(date);
      if (!day) return { date, level: 0 as const };

      const hasTraining = !!(day.speedSession || day.strengthSession);
      if (hasTraining) return { date, level: 3 as const };

      const total = day.habitsTotal || 1;
      const pct = day.habitsCompleted / total;

      if (pct >= 1) return { date, level: 3 as const };
      if (pct >= 0.5) return { date, level: 2 as const };
      if (day.habitsCompleted > 0) return { date, level: 1 as const };
      return { date, level: 0 as const };
    });
  }, [dailyActivity]);

  const activeDaysCount = useMemo(() => {
    return monthDays.filter((d) => d.level > 0).length;
  }, [monthDays]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const date = formatDate(d);
      const day = dailyActivity.get(date);
      if (day && (day.habitsCompleted > 0 || day.speedSession || day.strengthSession)) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [dailyActivity]);

  return {
    dailyActivity,
    speedStats,
    strengthStats,
    driverTrend,
    speedJourney,
    gymSpeedConnection,
    monthDays,
    activeDaysCount,
    currentStreak,
    loading,
  };
}
