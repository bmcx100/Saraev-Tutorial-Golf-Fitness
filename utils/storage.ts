import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HabitLog } from '@/contexts/habit-context';
import type { Challenge } from '@/contexts/challenge-context';
import type { UserProfile } from '@/contexts/user-context';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import {
  syncSpeedSession,
  syncStrengthSession,
  syncSpeedStats,
  syncStrengthStats,
  syncExerciseDefaults,
  syncTrainingState,
} from '@/lib/supabase-sync';

// ── Date helpers ──────────────────────────────────────────────

export function todayKey(): string {
  return formatDate(new Date());
}

export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateRange(startDate: string, days: number): string[] {
  const dates: string[] = [];
  const d = new Date(startDate + 'T00:00:00');
  for (let i = 0; i < days; i++) {
    dates.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

// ── Habit logs ────────────────────────────────────────────────

function logsKey(date: string): string {
  return `habit-logs-${date}`;
}

export async function loadLogs(date: string): Promise<HabitLog[]> {
  const raw = await AsyncStorage.getItem(logsKey(date));
  return raw ? JSON.parse(raw) : [];
}

export async function saveLogs(date: string, logs: HabitLog[]): Promise<void> {
  await AsyncStorage.setItem(logsKey(date), JSON.stringify(logs));
}

export async function loadLogsForRange(dates: string[]): Promise<Map<string, HabitLog[]>> {
  const keys = dates.map(logsKey);
  const pairs = await AsyncStorage.multiGet(keys);
  const map = new Map<string, HabitLog[]>();
  pairs.forEach(([key, raw]) => {
    const date = key.replace('habit-logs-', '');
    map.set(date, raw ? JSON.parse(raw) : []);
  });
  return map;
}

// ── Challenges ────────────────────────────────────────────────

const CHALLENGES_KEY = 'challenges';

export async function loadChallenges(): Promise<Challenge[]> {
  const raw = await AsyncStorage.getItem(CHALLENGES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveChallenges(challenges: Challenge[]): Promise<void> {
  await AsyncStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
}

// ── User profile ──────────────────────────────────────────────

const PROFILE_KEY = 'user-profile';

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  const profile = JSON.parse(raw) as UserProfile;
  if (!profile.schedule) {
    profile.schedule = { categoryRotations: {}, habitWeekdays: {}, habitModes: {}, habitGoals: {} };
  }
  if (!profile.schedule.habitModes) {
    profile.schedule.habitModes = {};
  }
  if (!profile.schedule.habitGoals) {
    profile.schedule.habitGoals = {};
  }
  return profile;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ── Old format detection ──────────────────────────────────────

export function oldHabitsKey(date: string): string {
  return `habits-${date}`;
}

// ── Speed sessions ───────────────────────────────────────────

function speedSessionKey(date: string): string {
  return `speed-session-${date}`;
}

export async function loadSpeedSession(date: string): Promise<SpeedSession | null> {
  const raw = await AsyncStorage.getItem(speedSessionKey(date));
  return raw ? JSON.parse(raw) : null;
}

export async function saveSpeedSession(session: SpeedSession, userId?: string): Promise<void> {
  await AsyncStorage.setItem(speedSessionKey(session.date), JSON.stringify(session));
  if (userId) {
    try { await syncSpeedSession(userId, session); } catch (e) { console.warn('Sync failed:', e); }
  }
}

export async function loadSpeedSessionRange(dates: string[]): Promise<SpeedSession[]> {
  const keys = dates.map(speedSessionKey);
  const pairs = await AsyncStorage.multiGet(keys);
  const sessions: SpeedSession[] = [];
  for (const [, raw] of pairs) {
    if (raw) sessions.push(JSON.parse(raw));
  }
  return sessions;
}

// ── Strength sessions ────────────────────────────────────────

function strengthSessionKey(date: string): string {
  return `strength-session-${date}`;
}

export async function loadStrengthSession(date: string): Promise<StrengthSession | null> {
  const raw = await AsyncStorage.getItem(strengthSessionKey(date));
  return raw ? JSON.parse(raw) : null;
}

export async function saveStrengthSession(session: StrengthSession, userId?: string): Promise<void> {
  await AsyncStorage.setItem(strengthSessionKey(session.date), JSON.stringify(session));
  if (userId) {
    try { await syncStrengthSession(userId, session); } catch (e) { console.warn('Sync failed:', e); }
  }
}

export async function loadStrengthSessionRange(dates: string[]): Promise<StrengthSession[]> {
  const keys = dates.map(strengthSessionKey);
  const pairs = await AsyncStorage.multiGet(keys);
  const sessions: StrengthSession[] = [];
  for (const [, raw] of pairs) {
    if (raw) sessions.push(JSON.parse(raw));
  }
  return sessions;
}

export async function loadLastStrengthWorkoutDay(): Promise<WorkoutDay | null> {
  const raw = await AsyncStorage.getItem('strength-last-workout-day');
  return raw ? (JSON.parse(raw) as WorkoutDay) : null;
}

export async function saveLastStrengthWorkoutDay(day: WorkoutDay, userId?: string): Promise<void> {
  await AsyncStorage.setItem('strength-last-workout-day', JSON.stringify(day));
  if (userId) {
    try { await syncTrainingState(userId, day); } catch (e) { console.warn('Sync failed:', e); }
  }
}

export async function loadExerciseDefaults(): Promise<Record<string, { weight: number | null; reps: number }[]>> {
  const raw = await AsyncStorage.getItem('strength-exercise-defaults');
  return raw ? JSON.parse(raw) : {};
}

export async function saveExerciseDefaults(defaults: Record<string, { weight: number | null; reps: number }[]>, userId?: string): Promise<void> {
  await AsyncStorage.setItem('strength-exercise-defaults', JSON.stringify(defaults));
  if (userId) {
    try { await syncExerciseDefaults(userId, defaults); } catch (e) { console.warn('Sync failed:', e); }
  }
}

// ── Speed / Strength aggregate stats ────────────────────────

export interface SpeedStats {
  driverPR: { mph: number; date: string } | null;
  previousDriverPR: { mph: number; date: string } | null;
  lastSessionDate: string | null;
}

export interface StrengthStats {
  exercisePRs: Record<string, { weight: number; reps: number; date: string }>;
  streak: { days: number; lastSessionDate: string };
  bestStreak: number;
  lastPR: { exerciseId: string; exerciseName: string; weight: number; date: string } | null;
}

const SPEED_STATS_KEY = 'speed-stats';
const STRENGTH_STATS_KEY = 'strength-stats';

export async function loadSpeedStats(): Promise<SpeedStats | null> {
  const raw = await AsyncStorage.getItem(SPEED_STATS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSpeedStats(stats: SpeedStats, userId?: string): Promise<void> {
  await AsyncStorage.setItem(SPEED_STATS_KEY, JSON.stringify(stats));
  if (userId) {
    try { await syncSpeedStats(userId, stats); } catch (e) { console.warn('Sync failed:', e); }
  }
}

export async function loadStrengthStats(): Promise<StrengthStats | null> {
  const raw = await AsyncStorage.getItem(STRENGTH_STATS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function saveStrengthStats(stats: StrengthStats, userId?: string): Promise<void> {
  await AsyncStorage.setItem(STRENGTH_STATS_KEY, JSON.stringify(stats));
  if (userId) {
    try { await syncStrengthStats(userId, stats); } catch (e) { console.warn('Sync failed:', e); }
  }
}

export async function rebuildStatsAggregates(userId?: string): Promise<void> {
  const allKeys = await AsyncStorage.getAllKeys();

  // ── Rebuild Speed Stats ──
  const speedKeys = allKeys.filter((k) => k.startsWith('speed-session-'));
  const speedPairs = await AsyncStorage.multiGet(speedKeys);
  const speedSessions: SpeedSession[] = [];
  for (const [, raw] of speedPairs) {
    if (raw) speedSessions.push(JSON.parse(raw));
  }
  speedSessions.sort((a, b) => a.date.localeCompare(b.date));

  let speedStats: SpeedStats = { driverPR: null, previousDriverPR: null, lastSessionDate: null };
  for (const session of speedSessions) {
    if (session.maxOut.driver != null) {
      if (!speedStats.driverPR || session.maxOut.driver > speedStats.driverPR.mph) {
        speedStats.previousDriverPR = speedStats.driverPR;
        speedStats.driverPR = { mph: session.maxOut.driver, date: session.date };
      }
    }
    speedStats.lastSessionDate = session.date;
  }
  await saveSpeedStats(speedStats, userId);

  // ── Rebuild Strength Stats ──
  const strengthKeys = allKeys.filter((k) => k.startsWith('strength-session-'));
  const strengthPairs = await AsyncStorage.multiGet(strengthKeys);
  const strengthSessions: StrengthSession[] = [];
  for (const [, raw] of strengthPairs) {
    if (raw) strengthSessions.push(JSON.parse(raw));
  }
  strengthSessions.sort((a, b) => a.date.localeCompare(b.date));

  // Import WORKOUT_DAYS inline to find exercise names
  const { WORKOUT_DAYS } = require('@/constants/strength-protocols');

  let strengthStats: StrengthStats = {
    exercisePRs: {},
    streak: { days: 0, lastSessionDate: '' },
    bestStreak: 0,
    lastPR: null,
  };

  for (const session of strengthSessions) {
    // Streak calculation
    if (strengthStats.streak.lastSessionDate) {
      const lastDate = new Date(strengthStats.streak.lastSessionDate + 'T00:00:00');
      const thisDate = new Date(session.date + 'T00:00:00');
      const gap = Math.round((thisDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (gap === 0) {
        // same day, no change
      } else if (gap <= 2) {
        strengthStats.streak.days += gap;
      } else {
        strengthStats.streak.days = 1;
      }
    } else {
      strengthStats.streak.days = 1;
    }
    strengthStats.streak.lastSessionDate = session.date;
    if (strengthStats.streak.days > strengthStats.bestStreak) {
      strengthStats.bestStreak = strengthStats.streak.days;
    }

    // Exercise PRs
    for (const exLog of session.exercises) {
      let maxWeight = 0;
      let maxReps = 0;
      for (const set of exLog.sets) {
        if (set.completed && set.weight != null && set.weight > maxWeight) {
          maxWeight = set.weight;
          maxReps = set.reps;
        }
      }
      if (maxWeight > 0) {
        const existing = strengthStats.exercisePRs[exLog.exerciseId];
        if (!existing || maxWeight > existing.weight) {
          strengthStats.exercisePRs[exLog.exerciseId] = {
            weight: maxWeight,
            reps: maxReps,
            date: session.date,
          };
          // Find exercise name
          let exerciseName = exLog.exerciseId;
          for (const day of WORKOUT_DAYS) {
            const ex = day.exercises.find((e: any) => e.id === exLog.exerciseId);
            if (ex) { exerciseName = ex.name; break; }
          }
          strengthStats.lastPR = {
            exerciseId: exLog.exerciseId,
            exerciseName,
            weight: maxWeight,
            date: session.date,
          };
        }
      }
    }
  }
  await saveStrengthStats(strengthStats, userId);
}

// ── Pace toast dedup ─────────────────────────────────────────

export async function loadPaceToastShown(date: string): Promise<boolean> {
  const raw = await AsyncStorage.getItem(`pace-toast-shown-${date}`);
  return raw === 'true';
}

export async function savePaceToastShown(date: string): Promise<void> {
  await AsyncStorage.setItem(`pace-toast-shown-${date}`, 'true');
}

// ── Old format detection ──────────────────────────────────────

export async function hasOldData(): Promise<boolean> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.some((k) => k.startsWith('habits-') && !k.startsWith('habit-logs-'));
}

// ── Dev tools ─────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  await AsyncStorage.clear();
}

export async function generateStreakData(
  activeHabitIds: string[],
  days: number,
  fromDate?: string,
): Promise<number> {
  const base = fromDate ? new Date(fromDate + 'T00:00:00') : new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    const date = formatDate(d);
    const logs: HabitLog[] = activeHabitIds.map((habitId) => ({
      habitId,
      date,
      count: 1,
      completedAt: new Date(d.getTime() + 12 * 60 * 60 * 1000).toISOString(),
    }));
    await saveLogs(date, logs);
  }
  return days;
}
