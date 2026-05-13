import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HabitLog } from '@/contexts/habit-context';
import type { Challenge } from '@/contexts/challenge-context';
import type { UserProfile } from '@/contexts/user-context';

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

export async function hasOldData(): Promise<boolean> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.some((k) => k.startsWith('habits-') && !k.startsWith('habit-logs-'));
}
