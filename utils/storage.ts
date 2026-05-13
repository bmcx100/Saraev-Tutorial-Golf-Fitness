import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HabitLog } from '@/contexts/habit-context';
import type { Challenge } from '@/contexts/challenge-context';
import type { UserProfile } from '@/contexts/user-context';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';

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
    profile.schedule = { categoryRotations: {}, habitWeekdays: {} };
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

export async function saveSpeedSession(session: SpeedSession): Promise<void> {
  await AsyncStorage.setItem(speedSessionKey(session.date), JSON.stringify(session));
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

export async function saveStrengthSession(session: StrengthSession): Promise<void> {
  await AsyncStorage.setItem(strengthSessionKey(session.date), JSON.stringify(session));
}

export async function loadLastStrengthWorkoutDay(): Promise<WorkoutDay | null> {
  const raw = await AsyncStorage.getItem('strength-last-workout-day');
  return raw ? (JSON.parse(raw) as WorkoutDay) : null;
}

export async function saveLastStrengthWorkoutDay(day: WorkoutDay): Promise<void> {
  await AsyncStorage.setItem('strength-last-workout-day', JSON.stringify(day));
}

export async function loadExerciseDefaults(): Promise<Record<string, { weight: number | null; reps: number }[]>> {
  const raw = await AsyncStorage.getItem('strength-exercise-defaults');
  return raw ? JSON.parse(raw) : {};
}

export async function saveExerciseDefaults(defaults: Record<string, { weight: number | null; reps: number }[]>): Promise<void> {
  await AsyncStorage.setItem('strength-exercise-defaults', JSON.stringify(defaults));
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
