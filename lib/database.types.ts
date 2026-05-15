/**
 * Supabase database types for training schema (Spec 017).
 *
 * Column naming: snake_case (Postgres convention).
 * The sync layer (Spec 018) handles camelCase ↔ snake_case mapping.
 */

// ── JSONB shapes ─────────────────────────────────────────────

export interface DrillSpeeds {
  dom: number | null;
  nonDom: number | null;
}

export interface DrillColorMap {
  green: DrillSpeeds;
  blue: DrillSpeeds;
  red: DrillSpeeds;
}

export interface ExerciseSetJson {
  weight: number | null;
  reps: number;
  completed: boolean;
}

export interface ExerciseLogJson {
  exerciseId: string;
  sets: ExerciseSetJson[];
}

export interface ExercisePrJson {
  weight: number;
  reps: number;
  date: string;
}

export interface LastPrJson {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  date: string;
}

export interface ExerciseDefaultSetJson {
  weight: number | null;
  reps: number;
}

// ── speed_sessions ───────────────────────────────────────────

export interface SpeedSessionRow {
  id: string;
  user_id: string;
  session_date: string;
  protocol: string;
  normal_stance: DrillColorMap;
  step_drill: DrillColorMap;
  max_out_green: number | null;
  max_out_driver: number | null;
  completed_at: string;
  created_at: string;
}

export interface SpeedSessionInsert {
  id?: string;
  user_id: string;
  session_date: string;
  protocol: string;
  normal_stance: DrillColorMap;
  step_drill: DrillColorMap;
  max_out_green?: number | null;
  max_out_driver?: number | null;
  completed_at: string;
  created_at?: string;
}

export interface SpeedSessionUpdate {
  id?: string;
  user_id?: string;
  session_date?: string;
  protocol?: string;
  normal_stance?: DrillColorMap;
  step_drill?: DrillColorMap;
  max_out_green?: number | null;
  max_out_driver?: number | null;
  completed_at?: string;
  created_at?: string;
}

// ── strength_sessions ────────────────────────────────────────

export interface StrengthSessionRow {
  id: string;
  user_id: string;
  session_date: string;
  protocol: string;
  workout_day: string;
  exercises: ExerciseLogJson[];
  completed_at: string;
  created_at: string;
}

export interface StrengthSessionInsert {
  id?: string;
  user_id: string;
  session_date: string;
  protocol: string;
  workout_day: string;
  exercises: ExerciseLogJson[];
  completed_at: string;
  created_at?: string;
}

export interface StrengthSessionUpdate {
  id?: string;
  user_id?: string;
  session_date?: string;
  protocol?: string;
  workout_day?: string;
  exercises?: ExerciseLogJson[];
  completed_at?: string;
  created_at?: string;
}

// ── speed_stats ──────────────────────────────────────────────

export interface SpeedStatsRow {
  user_id: string;
  driver_pr_mph: number | null;
  driver_pr_date: string | null;
  previous_driver_pr_mph: number | null;
  previous_driver_pr_date: string | null;
  last_session_date: string | null;
  updated_at: string;
}

export interface SpeedStatsInsert {
  user_id: string;
  driver_pr_mph?: number | null;
  driver_pr_date?: string | null;
  previous_driver_pr_mph?: number | null;
  previous_driver_pr_date?: string | null;
  last_session_date?: string | null;
  updated_at?: string;
}

export interface SpeedStatsUpdate {
  user_id?: string;
  driver_pr_mph?: number | null;
  driver_pr_date?: string | null;
  previous_driver_pr_mph?: number | null;
  previous_driver_pr_date?: string | null;
  last_session_date?: string | null;
  updated_at?: string;
}

// ── strength_stats ───────────────────────────────────────────

export interface StrengthStatsRow {
  user_id: string;
  exercise_prs: Record<string, ExercisePrJson>;
  streak_days: number;
  streak_last_session_date: string | null;
  best_streak: number;
  last_pr: LastPrJson | null;
  updated_at: string;
}

export interface StrengthStatsInsert {
  user_id: string;
  exercise_prs?: Record<string, ExercisePrJson>;
  streak_days?: number;
  streak_last_session_date?: string | null;
  best_streak?: number;
  last_pr?: LastPrJson | null;
  updated_at?: string;
}

export interface StrengthStatsUpdate {
  user_id?: string;
  exercise_prs?: Record<string, ExercisePrJson>;
  streak_days?: number;
  streak_last_session_date?: string | null;
  best_streak?: number;
  last_pr?: LastPrJson | null;
  updated_at?: string;
}

// ── exercise_defaults ────────────────────────────────────────

export interface ExerciseDefaultsRow {
  user_id: string;
  defaults: Record<string, ExerciseDefaultSetJson[]>;
  updated_at: string;
}

export interface ExerciseDefaultsInsert {
  user_id: string;
  defaults?: Record<string, ExerciseDefaultSetJson[]>;
  updated_at?: string;
}

export interface ExerciseDefaultsUpdate {
  user_id?: string;
  defaults?: Record<string, ExerciseDefaultSetJson[]>;
  updated_at?: string;
}

// ── training_state ───────────────────────────────────────────

export interface TrainingStateRow {
  user_id: string;
  last_workout_day: string | null;
  updated_at: string;
}

export interface TrainingStateInsert {
  user_id: string;
  last_workout_day?: string | null;
  updated_at?: string;
}

export interface TrainingStateUpdate {
  user_id?: string;
  last_workout_day?: string | null;
  updated_at?: string;
}

// ── Database type ────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      speed_sessions: {
        Row: SpeedSessionRow;
        Insert: SpeedSessionInsert;
        Update: SpeedSessionUpdate;
      };
      strength_sessions: {
        Row: StrengthSessionRow;
        Insert: StrengthSessionInsert;
        Update: StrengthSessionUpdate;
      };
      speed_stats: {
        Row: SpeedStatsRow;
        Insert: SpeedStatsInsert;
        Update: SpeedStatsUpdate;
      };
      strength_stats: {
        Row: StrengthStatsRow;
        Insert: StrengthStatsInsert;
        Update: StrengthStatsUpdate;
      };
      exercise_defaults: {
        Row: ExerciseDefaultsRow;
        Insert: ExerciseDefaultsInsert;
        Update: ExerciseDefaultsUpdate;
      };
      training_state: {
        Row: TrainingStateRow;
        Insert: TrainingStateInsert;
        Update: TrainingStateUpdate;
      };
    };
  };
}
