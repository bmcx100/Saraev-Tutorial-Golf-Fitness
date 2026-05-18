/**
 * Supabase database types for training schema (Spec 017).
 *
 * Column naming: snake_case (Postgres convention).
 * The sync layer (Spec 018) handles camelCase <-> snake_case mapping.
 *
 * Uses type aliases (not interfaces) to match Supabase's generated
 * output and ensure correct conditional-type resolution in the client.
 */

// ── JSONB shapes ─────────────────────────────────────────────

export type DrillSpeeds = {
  dom: number | null;
  nonDom: number | null;
};

export type DrillColorMap = {
  green: DrillSpeeds;
  blue: DrillSpeeds;
  red: DrillSpeeds;
};

export type ExerciseSetJson = {
  weight: number | null;
  reps: number;
  completed: boolean;
};

export type ExerciseLogJson = {
  exerciseId: string;
  sets: ExerciseSetJson[];
};

export type ExercisePrJson = {
  weight: number;
  reps: number;
  date: string;
};

export type LastPrJson = {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  date: string;
};

export type ExerciseDefaultSetJson = {
  weight: number | null;
  reps: number;
};

// ── speed_sessions ───────────────────────────────────────────

export type SpeedSessionRow = {
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
};

export type SpeedSessionInsert = {
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
};

export type SpeedSessionUpdate = {
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
};

// ── strength_sessions ────────────────────────────────────────

export type StrengthSessionRow = {
  id: string;
  user_id: string;
  session_date: string;
  protocol: string;
  workout_day: string;
  exercises: ExerciseLogJson[];
  completed_at: string;
  created_at: string;
};

export type StrengthSessionInsert = {
  id?: string;
  user_id: string;
  session_date: string;
  protocol: string;
  workout_day: string;
  exercises: ExerciseLogJson[];
  completed_at: string;
  created_at?: string;
};

export type StrengthSessionUpdate = {
  id?: string;
  user_id?: string;
  session_date?: string;
  protocol?: string;
  workout_day?: string;
  exercises?: ExerciseLogJson[];
  completed_at?: string;
  created_at?: string;
};

// ── speed_stats ──────────────────────────────────────────────

export type SpeedStatsRow = {
  user_id: string;
  driver_pr_mph: number | null;
  driver_pr_date: string | null;
  previous_driver_pr_mph: number | null;
  previous_driver_pr_date: string | null;
  last_session_date: string | null;
  updated_at: string;
};

export type SpeedStatsInsert = {
  user_id: string;
  driver_pr_mph?: number | null;
  driver_pr_date?: string | null;
  previous_driver_pr_mph?: number | null;
  previous_driver_pr_date?: string | null;
  last_session_date?: string | null;
  updated_at?: string;
};

export type SpeedStatsUpdate = {
  user_id?: string;
  driver_pr_mph?: number | null;
  driver_pr_date?: string | null;
  previous_driver_pr_mph?: number | null;
  previous_driver_pr_date?: string | null;
  last_session_date?: string | null;
  updated_at?: string;
};

// ── strength_stats ───────────────────────────────────────────

export type StrengthStatsRow = {
  user_id: string;
  exercise_prs: Record<string, ExercisePrJson>;
  streak_days: number;
  streak_last_session_date: string | null;
  best_streak: number;
  last_pr: LastPrJson | null;
  updated_at: string;
};

export type StrengthStatsInsert = {
  user_id: string;
  exercise_prs?: Record<string, ExercisePrJson>;
  streak_days?: number;
  streak_last_session_date?: string | null;
  best_streak?: number;
  last_pr?: LastPrJson | null;
  updated_at?: string;
};

export type StrengthStatsUpdate = {
  user_id?: string;
  exercise_prs?: Record<string, ExercisePrJson>;
  streak_days?: number;
  streak_last_session_date?: string | null;
  best_streak?: number;
  last_pr?: LastPrJson | null;
  updated_at?: string;
};

// ── exercise_defaults ────────────────────────────────────────

export type ExerciseDefaultsRow = {
  user_id: string;
  defaults: Record<string, ExerciseDefaultSetJson[]>;
  updated_at: string;
};

export type ExerciseDefaultsInsert = {
  user_id: string;
  defaults?: Record<string, ExerciseDefaultSetJson[]>;
  updated_at?: string;
};

export type ExerciseDefaultsUpdate = {
  user_id?: string;
  defaults?: Record<string, ExerciseDefaultSetJson[]>;
  updated_at?: string;
};

// ── training_state ───────────────────────────────────────────

export type TrainingStateRow = {
  user_id: string;
  last_workout_day: string | null;
  updated_at: string;
};

export type TrainingStateInsert = {
  user_id: string;
  last_workout_day?: string | null;
  updated_at?: string;
};

export type TrainingStateUpdate = {
  user_id?: string;
  last_workout_day?: string | null;
  updated_at?: string;
};

// ── gf_user_profiles ────────────────────────────────────────

export type UserProfileRow = {
  user_id: string;
  active_habit_ids: string[];
  schedule: Record<string, unknown>;
  speed_protocol: string | null;
  strength_protocol: string | null;
  onboarding_complete: boolean;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  notification_morning: string;
  notification_evening: string;
  updated_at: string;
};

export type UserProfileInsert = {
  user_id: string;
  active_habit_ids?: string[];
  schedule?: Record<string, unknown>;
  speed_protocol?: string | null;
  strength_protocol?: string | null;
  onboarding_complete?: boolean;
  sound_enabled?: boolean;
  notifications_enabled?: boolean;
  notification_morning?: string;
  notification_evening?: string;
  updated_at?: string;
};

export type UserProfileUpdate = {
  user_id?: string;
  active_habit_ids?: string[];
  schedule?: Record<string, unknown>;
  speed_protocol?: string | null;
  strength_protocol?: string | null;
  onboarding_complete?: boolean;
  sound_enabled?: boolean;
  notifications_enabled?: boolean;
  notification_morning?: string;
  notification_evening?: string;
  updated_at?: string;
};

// ── Database type ────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      gf_speed_sessions: {
        Row: SpeedSessionRow;
        Insert: SpeedSessionInsert;
        Update: SpeedSessionUpdate;
        Relationships: [];
      };
      gf_strength_sessions: {
        Row: StrengthSessionRow;
        Insert: StrengthSessionInsert;
        Update: StrengthSessionUpdate;
        Relationships: [];
      };
      gf_speed_stats: {
        Row: SpeedStatsRow;
        Insert: SpeedStatsInsert;
        Update: SpeedStatsUpdate;
        Relationships: [];
      };
      gf_strength_stats: {
        Row: StrengthStatsRow;
        Insert: StrengthStatsInsert;
        Update: StrengthStatsUpdate;
        Relationships: [];
      };
      gf_exercise_defaults: {
        Row: ExerciseDefaultsRow;
        Insert: ExerciseDefaultsInsert;
        Update: ExerciseDefaultsUpdate;
        Relationships: [];
      };
      gf_training_state: {
        Row: TrainingStateRow;
        Insert: TrainingStateInsert;
        Update: TrainingStateUpdate;
        Relationships: [];
      };
      gf_user_profiles: {
        Row: UserProfileRow;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
