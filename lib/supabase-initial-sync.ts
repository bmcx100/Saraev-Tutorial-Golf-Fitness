import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import {
  saveSpeedSession,
  saveStrengthSession,
  saveExerciseDefaults,
  saveLastStrengthWorkoutDay,
  rebuildStatsAggregates,
  loadExerciseDefaults,
  loadLastStrengthWorkoutDay,
  loadProfile,
  saveProfile,
} from '@/utils/storage';
import {
  pullSpeedSessions,
  pullStrengthSessions,
  pullExerciseDefaults,
  pullTrainingState,
  pullUserProfile,
} from '@/lib/supabase-pull';
import {
  syncSpeedSession,
  syncStrengthSession,
  syncExerciseDefaults,
  syncTrainingState,
  syncUserProfile,
} from '@/lib/supabase-sync';

/**
 * Runs once after first successful authentication to reconcile local
 * and cloud training data using last-write-wins per session date.
 */
export async function initialSync(userId: string): Promise<void> {
  // 1. Pull all cloud data
  const [cloudSpeedSessions, cloudStrengthSessions, cloudDefaults, cloudLastDay] =
    await Promise.all([
      pullSpeedSessions(userId),
      pullStrengthSessions(userId),
      pullExerciseDefaults(userId),
      pullTrainingState(userId),
    ]);

  // 2. Load all local data by scanning AsyncStorage keys
  const allKeys = await AsyncStorage.getAllKeys();

  const speedKeys = allKeys.filter((k) => k.startsWith('speed-session-'));
  const speedPairs = await AsyncStorage.multiGet(speedKeys);
  const localSpeedSessions: SpeedSession[] = [];
  for (const [, raw] of speedPairs) {
    if (raw) localSpeedSessions.push(JSON.parse(raw));
  }

  const strengthKeys = allKeys.filter((k) => k.startsWith('strength-session-'));
  const strengthPairs = await AsyncStorage.multiGet(strengthKeys);
  const localStrengthSessions: StrengthSession[] = [];
  for (const [, raw] of strengthPairs) {
    if (raw) localStrengthSessions.push(JSON.parse(raw));
  }

  // 3. Merge speed sessions by date (last-write-wins via completedAt)
  const speedByDate = new Map<string, SpeedSession>();
  for (const s of localSpeedSessions) speedByDate.set(s.date, s);

  for (const cloud of cloudSpeedSessions) {
    const local = speedByDate.get(cloud.date);
    if (!local) {
      // Cloud-only: write to local
      await saveSpeedSession(cloud);
      speedByDate.set(cloud.date, cloud);
    } else if (cloud.completedAt > local.completedAt) {
      // Cloud wins: overwrite local
      await saveSpeedSession(cloud);
      speedByDate.set(cloud.date, cloud);
    } else if (cloud.completedAt < local.completedAt) {
      // Local wins: push to cloud
      await syncSpeedSession(userId, local);
    }
    // Equal timestamps: no action needed
  }

  // Push local-only sessions to cloud
  const cloudSpeedDates = new Set(cloudSpeedSessions.map((s) => s.date));
  for (const local of localSpeedSessions) {
    if (!cloudSpeedDates.has(local.date)) {
      await syncSpeedSession(userId, local);
    }
  }

  // 4. Merge strength sessions by date (last-write-wins via completedAt)
  const strengthByDate = new Map<string, StrengthSession>();
  for (const s of localStrengthSessions) strengthByDate.set(s.date, s);

  for (const cloud of cloudStrengthSessions) {
    const local = strengthByDate.get(cloud.date);
    if (!local) {
      await saveStrengthSession(cloud);
      strengthByDate.set(cloud.date, cloud);
    } else if (cloud.completedAt > local.completedAt) {
      await saveStrengthSession(cloud);
      strengthByDate.set(cloud.date, cloud);
    } else if (cloud.completedAt < local.completedAt) {
      await syncStrengthSession(userId, local);
    }
  }

  const cloudStrengthDates = new Set(cloudStrengthSessions.map((s) => s.date));
  for (const local of localStrengthSessions) {
    if (!cloudStrengthDates.has(local.date)) {
      await syncStrengthSession(userId, local);
    }
  }

  // 5. Rebuild stats from merged session set
  await rebuildStatsAggregates(userId);

  // 6. Merge singletons — exercise defaults
  const localDefaults = await loadExerciseDefaults();
  if (cloudDefaults && Object.keys(cloudDefaults).length > 0) {
    if (Object.keys(localDefaults).length === 0) {
      // Cloud has data, local empty — use cloud
      await saveExerciseDefaults(cloudDefaults);
    }
    // If both exist, keep local (it was written more recently during session)
    // Push local to cloud either way to ensure cloud is up to date
    await syncExerciseDefaults(userId, Object.keys(localDefaults).length > 0 ? localDefaults : cloudDefaults);
  } else if (Object.keys(localDefaults).length > 0) {
    // Local only — push to cloud
    await syncExerciseDefaults(userId, localDefaults);
  }

  // 7. Merge singletons — training state (last workout day)
  const localLastDay = await loadLastStrengthWorkoutDay();
  if (cloudLastDay && !localLastDay) {
    await saveLastStrengthWorkoutDay(cloudLastDay);
  } else if (localLastDay && !cloudLastDay) {
    await syncTrainingState(userId, localLastDay);
  } else if (localLastDay) {
    // Both exist — push local (most recent action)
    await syncTrainingState(userId, localLastDay);
  }

  // 8. Merge user profile
  const cloudProfile = await pullUserProfile(userId);
  const localProfile = await loadProfile();
  if (cloudProfile && (!localProfile || !localProfile.onboardingComplete)) {
    // Cloud exists and local is default (not onboarded) — use cloud
    await saveProfile(cloudProfile);
  } else if (localProfile && localProfile.onboardingComplete) {
    // Local is onboarded — keep local and push to cloud
    await syncUserProfile(userId, localProfile);
  }
}

const SYNC_FLAG_PREFIX = 'sync-completed-';

export function syncFlagKey(userId: string): string {
  return `${SYNC_FLAG_PREFIX}${userId}`;
}

export async function hasSyncCompleted(userId: string): Promise<boolean> {
  const val = await AsyncStorage.getItem(syncFlagKey(userId));
  return val === 'true';
}

export async function setSyncCompleted(userId: string): Promise<void> {
  await AsyncStorage.setItem(syncFlagKey(userId), 'true');
}

export async function clearSyncFlag(userId: string): Promise<void> {
  await AsyncStorage.removeItem(syncFlagKey(userId));
}
