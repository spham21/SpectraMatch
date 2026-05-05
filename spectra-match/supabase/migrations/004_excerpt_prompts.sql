-- Migration: 004_excerpt_prompts
-- Stores AI prompt templates that can be edited without redeploying

CREATE TABLE IF NOT EXISTS public.excerpt_prompts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_type           TEXT NOT NULL CHECK (prompt_type IN ('personality', 'compatibility')),
  mbti_type             TEXT CHECK (mbti_type ~ '^[EI][NS][TF][JP]$'),
  system_prompt         TEXT NOT NULL,
  user_prompt_template  TEXT NOT NULL,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (prompt_type, mbti_type)
);

-- Row-Level Security
ALTER TABLE public.excerpt_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read excerpt prompts"
  ON public.excerpt_prompts FOR SELECT
  TO authenticated
  USING (true);

-- service_role can write (insert/update/delete)
-- No explicit policy needed — service_role bypasses RLS
