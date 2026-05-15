import { supabase } from '@/lib/supabase';
import type { SpeedSession } from '@/constants/speed-protocols';
import type { StrengthSession, WorkoutDay } from '@/constants/strength-protocols';
import type { SpeedStats, StrengthStats } from '@/utils/storage';

/**
 * Cloud write (upsert) functions that mirror the AsyncStorage save API.
 * Each function fires-and-forgets: errors are logged but never thrown.
 */

export async function syncSpeedSession(userId: string, session: SpeedSession): Promise<void> {
  try {
    await supabase.from('speed_sessions').upsert(
      {
        user_id: userId,
        session_date: session.date,
        protocol: session.protocol,
        normal_stance: session.normalStance,
        step_drill: session.stepDrill,
        max_out_green: session.maxOut.green,
        max_out_driver: session.maxOut.driver,
        completed_at: session.completedAt,
      },
      { onConflict: 'user_id,session_date' },
    );
  } catch (e) {
    console.warn('syncSpeedSession failed:', e);
  }
}

export async function syncStrengthSession(userId: string, session: StrengthSession): Promise<void> {
  try {
    await supabase.from('strength_sessions').upsert(
      {
        user_id: userId,
        session_date: session.date,
        protocol: session.protocol,
        workout_day: session.workoutDay,
        exercises: session.exercises,
        completed_at: session.completedAt,
      },
      { onConflict: 'user_id,session_date' },
    );
  } catch (e) {
    console.warn('syncStrengthSession failed:', e);
  }
}

export async function syncSpeedStats(userId: string, stats: SpeedStats): Promise<void> {
  try {
    await supabase.from('speed_stats').upsert(
      {
        user_id: userId,
        driver_pr_mph: stats.driverPR?.mph ?? null,
        driver_pr_date: stats.driverPR?.date ?? null,
        previous_driver_pr_mph: stats.previousDriverPR?.mph ?? null,
        previous_driver_pr_date: stats.previousDriverPR?.date ?? null,
        last_session_date: stats.lastSessionDate,
      },
      { onConflict: 'user_id' },
    );
  } catch (e) {
    console.warn('syncSpeedStats failed:', e);
  }
}

export async function syncStrengthStats(userId: string, stats: StrengthStats): Promise<void> {
  try {
    await supabase.from('strength_stats').upsert(
      {
        user_id: userId,
        exercise_prs: stats.exercisePRs,
        streak_days: stats.streak.days,
        streak_last_session_date: stats.streak.lastSessionDate || null,
        best_streak: stats.bestStreak,
        last_pr: stats.lastPR,
      },
      { onConflict: 'user_id' },
    );
  } catch (e) {
    console.warn('syncStrengthStats failed:', e);
  }
}

export async function syncExerciseDefaults(
  userId: string,
  defaults: Record<string, { weight: number | null; reps: number }[]>,
): Promise<void> {
  try {
    await supabase.from('exercise_defaults').upsert(
      {
        user_id: userId,
        defaults: defaults,
      },
      { onConflict: 'user_id' },
    );
  } catch (e) {
    console.warn('syncExerciseDefaults failed:', e);
  }
}

export async function syncTrainingState(userId: string, lastWorkoutDay: WorkoutDay): Promise<void> {
  try {
    await supabase.from('training_state').upsert(
      {
        user_id: userId,
        last_workout_day: lastWorkoutDay,
      },
      { onConflict: 'user_id' },
    );
  } catch (e) {
    console.warn('syncTrainingState failed:', e);
  }
}
