-- ============================================================
-- Spec 021: GF Prefix Migration & User Profiles
-- Run this in the Supabase dashboard SQL editor.
-- Renames 6 existing tables to gf_ prefix and creates
-- the gf_user_profiles table.
-- ============================================================

-- ── 1. Rename existing tables to gf_ prefix ───────────────────
-- ALTER TABLE RENAME preserves indexes, constraints, RLS policies,
-- and foreign keys automatically.

ALTER TABLE public.speed_sessions     RENAME TO gf_speed_sessions;
ALTER TABLE public.strength_sessions  RENAME TO gf_strength_sessions;
ALTER TABLE public.speed_stats        RENAME TO gf_speed_stats;
ALTER TABLE public.strength_stats     RENAME TO gf_strength_stats;
ALTER TABLE public.exercise_defaults  RENAME TO gf_exercise_defaults;
ALTER TABLE public.training_state     RENAME TO gf_training_state;

-- ── 2. New table: gf_user_profiles ─────────────────────────────

CREATE TABLE public.gf_user_profiles (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  active_habit_ids     jsonb NOT NULL DEFAULT '[]',
  schedule             jsonb NOT NULL DEFAULT '{}',
  speed_protocol       text,
  strength_protocol    text,
  onboarding_complete  boolean NOT NULL DEFAULT false,
  sound_enabled        boolean NOT NULL DEFAULT true,
  notifications_enabled boolean NOT NULL DEFAULT false,
  notification_morning text NOT NULL DEFAULT '08:00',
  notification_evening text NOT NULL DEFAULT '20:00',
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gf_user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own gf_user_profiles"
  ON public.gf_user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
