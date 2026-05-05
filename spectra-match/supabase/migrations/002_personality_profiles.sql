-- Migration: 002_personality_profiles
-- Creates the personality_profiles table with scoring columns and schema_version

CREATE TABLE IF NOT EXISTS public.personality_profiles (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mbti_type              TEXT NOT NULL CHECK (mbti_type ~ '^[EI][NS][TF][JP]$'),
  ei_score               SMALLINT NOT NULL CHECK (ei_score BETWEEN 0 AND 100),
  sn_score               SMALLINT NOT NULL CHECK (sn_score BETWEEN 0 AND 100),
  tf_score               SMALLINT NOT NULL CHECK (tf_score BETWEEN 0 AND 100),
  jp_score               SMALLINT NOT NULL CHECK (jp_score BETWEEN 0 AND 100),
  personality_excerpt    TEXT,
  compatibility_excerpt  TEXT,
  excerpt_feedback       BOOLEAN,
  is_current             BOOLEAN NOT NULL DEFAULT TRUE,
  schema_version         SMALLINT NOT NULL DEFAULT 1,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS personality_profiles_user_id_idx
  ON public.personality_profiles (user_id);

CREATE INDEX IF NOT EXISTS personality_profiles_user_current_idx
  ON public.personality_profiles (user_id, is_current)
  WHERE is_current = TRUE;

-- Row-Level Security
ALTER TABLE public.personality_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own personality profiles"
  ON public.personality_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own personality profiles"
  ON public.personality_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own personality profiles"
  ON public.personality_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
