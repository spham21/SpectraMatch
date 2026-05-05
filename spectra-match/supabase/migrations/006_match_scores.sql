-- Migration: 006_match_scores
-- Stores pairwise compatibility scores between users

CREATE TABLE IF NOT EXISTS public.match_scores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  final_score SMALLINT NOT NULL CHECK (final_score BETWEEN 0 AND 100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_a, user_b)
);

CREATE INDEX IF NOT EXISTS match_scores_user_a_idx
  ON public.match_scores (user_a, final_score DESC);

-- Row-Level Security
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own match scores"
  ON public.match_scores FOR SELECT
  TO authenticated
  USING (user_a = auth.uid());
