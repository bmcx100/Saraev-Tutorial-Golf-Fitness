import { supabase } from '@/lib/supabase';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import type { SpeedStats, StrengthStats } from '@/utils/storage';
import type { SpeedSessionRow, StrengthSessionRow, UserProfileRow } from '@/lib/database.types';
import type { UserProfile, ScheduleConfig } from '@/contexts/user-context';

/**
 * Cloud read (pull) functions. Used during initial sync to fetch all
 * training data for a given user. Maps snake_case columns back to
 * camelCase TS interfaces.
 */

export async function pullSpeedSessions(userId: string): Promise<SpeedSession[]> {
  const { data, error } = await supabase
    .from('gf_speed_sessions')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map((row: SpeedSessionRow) => ({
    date: row.session_date,
    protocol: row.protocol,
    normalStance: row.normal_stance,
    stepDrill: row.step_drill,
    maxOut: {
      green: row.max_out_green,
      driver: row.max_out_driver,
    },
    completedAt: row.completed_at,
  }));
}

export async function pullStrengthSessions(userId: string): Promise<StrengthSession[]> {
  const { data, error } = await supabase
    .from('gf_strength_sessions')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map((row: StrengthSessionRow) => ({
    date: row.session_date,
    protocol: row.protocol,
    workoutDay: row.workout_day as WorkoutDay,
    exercises: row.exercises,
    completedAt: row.completed_at,
  }));
}

export async function pullSpeedStats(userId: string): Promise<SpeedStats | null> {
  const { data, error } = await supabase
    .from('gf_speed_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    driverPR:
      data.driver_pr_mph != null && data.driver_pr_date != null
        ? { mph: data.driver_pr_mph, date: data.driver_pr_date }
        : null,
    previousDriverPR:
      data.previous_driver_pr_mph != null && data.previous_driver_pr_date != null
        ? { mph: data.previous_driver_pr_mph, date: data.previous_driver_pr_date }
        : null,
    lastSessionDate: data.last_session_date,
    fieldPRs: (data as any).field_prs ?? {},
  };
}

export async function pullStrengthStats(userId: string): Promise<StrengthStats | null> {
  const { data, error } = await supabase
    .from('gf_strength_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    exercisePRs: data.exercise_prs,
    streak: {
      days: data.streak_days,
      lastSessionDate: data.streak_last_session_date ?? '',
    },
    bestStreak: data.best_streak,
    lastPR: data.last_pr,
  };
}

export async function pullExerciseDefaults(
  userId: string,
): Promise<Record<string, { weight: number | null; reps: number }[]> | null> {
  const { data, error } = await supabase
    .from('gf_exercise_defaults')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return data.defaults;
}

export async function pullTrainingState(userId: string): Promise<WorkoutDay | null> {
  const { data, error } = await supabase
    .from('gf_training_state')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return data.last_workout_day as WorkoutDay | null;
}

export async function pullUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('gf_user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  const row = data as unknown as UserProfileRow;
  return {
    activeHabitIds: row.active_habit_ids,
    schedule: row.schedule as unknown as ScheduleConfig,
    speedProtocol: row.speed_protocol as UserProfile['speedProtocol'],
    strengthProtocol: row.strength_protocol as UserProfile['strengthProtocol'],
    onboardingComplete: row.onboarding_complete,
    soundEnabled: row.sound_enabled,
    notificationsEnabled: row.notifications_enabled,
    notificationMorning: row.notification_morning,
    notificationEvening: row.notification_evening,
  };
}
