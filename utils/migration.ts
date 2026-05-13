import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEGACY_HABIT_IDS } from '@/constants/habits';
import type { HabitLog } from '@/contexts/habit-context';
import { DEFAULT_SCHEDULE } from '@/contexts/user-context';
import type { UserProfile } from '@/contexts/user-context';
import { loadProfile, saveProfile, saveLogs, formatDate } from '@/utils/storage';

/**
 * Migrates data from the old `habits-YYYY-MM-DD → string[]` format
 * to the new `habit-logs-YYYY-MM-DD → HabitLog[]` format.
 *
 * Returns `true` if migration occurred (old data existed),
 * `false` if no old data was found (fresh install).
 */
export async function migrateIfNeeded(): Promise<boolean> {
  const profile = await loadProfile();
  if (profile) return false; // Already migrated or onboarded

  const allKeys = await AsyncStorage.getAllKeys();
  const oldKeys = allKeys.filter(
    (k) => k.startsWith('habits-') && !k.startsWith('habit-logs-'),
  );

  if (oldKeys.length === 0) return false; // Fresh install, no old data

  // Read all old entries
  const pairs = await AsyncStorage.multiGet(oldKeys);

  for (const [key, raw] of pairs) {
    if (!raw) continue;

    const date = key.replace('habits-', '');
    const completedIds: string[] = JSON.parse(raw);

    const logs: HabitLog[] = completedIds.map((id) => ({
      habitId: id,
      date,
      count: 1,
      completedAt: new Date(date + 'T12:00:00').toISOString(),
    }));

    await saveLogs(date, logs);
  }

  // Delete old keys
  await AsyncStorage.multiRemove(oldKeys);

  // Create profile for migrated user — skip onboarding, use legacy habits
  const migratedProfile: UserProfile = {
    onboardingComplete: true,
    activeHabitIds: LEGACY_HABIT_IDS,
    notificationMorning: '08:00',
    notificationEvening: '20:00',
    notificationsEnabled: false,
    soundEnabled: true,
    schedule: DEFAULT_SCHEDULE,
    speedProtocol: null,
    strengthProtocol: null,
  };
  await saveProfile(migratedProfile);

  return true;
}
