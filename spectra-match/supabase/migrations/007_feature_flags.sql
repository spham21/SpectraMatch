-- Migration: 007_feature_flags
-- Feature flag table with rollout percentage support

CREATE TABLE IF NOT EXISTS public.feature_flags (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_pct SMALLINT CHECK (rollout_pct BETWEEN 0 AND 100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read feature flags"
  ON public.feature_flags FOR SELECT
  TO authenticated
  USING (true);

-- Seed default flags (all off by default)
INSERT INTO public.feature_flags (name, enabled, rollout_pct) VALUES
  ('matching_feed',         FALSE, 0),
  ('excerpt_feedback',      FALSE, 0),
  ('retake_flow',           FALSE, 0),
  ('excerpt_tone_ab_test',  FALSE, 0)
ON CONFLICT (name) DO NOTHING;
