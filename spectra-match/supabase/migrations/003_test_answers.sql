-- Migration: 003_test_answers
-- Stores per-question answers for drop-off analytics

CREATE TABLE IF NOT EXISTS public.test_answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id  UUID NOT NULL,
  question_id TEXT NOT NULL,
  score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 7),
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_answers_user_session_idx
  ON public.test_answers (user_id, session_id);

-- Row-Level Security
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own test answers"
  ON public.test_answers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own test answers"
  ON public.test_answers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
