-- Migration: 010_seed_mock_users
-- Adds dating fields, seeds mock users, and adds research dictionary

-- 0. Research Dictionary Table
CREATE TABLE IF NOT EXISTS public.research_dictionary (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT UNIQUE NOT NULL,
  content     JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Add dating fields to profiles if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age SMALLINT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS sexuality TEXT,
ADD COLUMN IF NOT EXISTS looking_for TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;


-- 2. Drop auth.users foreign key constraints for the beta period
-- This allows us to have mock/anonymous users without real auth records
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.personality_profiles DROP CONSTRAINT IF EXISTS personality_profiles_user_id_fkey;

-- 3. Seed Mock Users
-- We'll insert into profiles first, then their personality results
-- Using stable UUIDs so they don't change on refresh

-- Mock User 1: Sarah (ENFP)
INSERT INTO public.profiles (id, user_id, display_name, age, gender, sexuality, looking_for, bio)
VALUES (
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
  'Sarah J.', 26, 'Woman', 'Straight', 'Long-term relationship', 
  'Adventure seeker and coffee enthusiast. ☕️ Always looking for the next great book to read.'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.personality_profiles (user_id, mbti_type, ei_score, sn_score, tf_score, jp_score, personality_excerpt, compatibility_excerpt)
VALUES (
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 
  'ENFP', 85, 70, 75, 80,
  'An enthusiastic and creative soul who finds inspiration in the possibilities of the future.',
  'Seeks a partner who appreciates spontaneity and deep emotional connection.'
) ON CONFLICT DO NOTHING;

-- Mock User 2: Michael (INFJ)
INSERT INTO public.profiles (id, user_id, display_name, age, gender, sexuality, looking_for, bio)
VALUES (
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 
  'Michael R.', 29, 'Man', 'Straight', 'Long-term relationship', 
  'Tech lover and part-time hiker. 🏔️ Passionate about art and good conversations.'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.personality_profiles (user_id, mbti_type, ei_score, sn_score, tf_score, jp_score, personality_excerpt, compatibility_excerpt)
VALUES (
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 
  'INFJ', 20, 80, 85, 30,
  'A quiet and mystical individual who seeks to understand the deeper meaning of life.',
  'Needs a partner who values quiet reflection and intellectual depth.'
) ON CONFLICT DO NOTHING;

-- Mock User 3: Elena (INTJ)
INSERT INTO public.profiles (id, user_id, display_name, age, gender, sexuality, looking_for, bio)
VALUES (
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 
  'Elena W.', 31, 'Woman', 'Straight', 'Something casual', 
  'Digital nomad currently exploring the world. Amateur chef and trivia night regular.'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.personality_profiles (user_id, mbti_type, ei_score, sn_score, tf_score, jp_score, personality_excerpt, compatibility_excerpt)
VALUES (
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 
  'INTJ', 15, 90, 10, 20,
  'A strategic thinker with a complex inner world, valuing efficiency and logic.',
  'Looking for someone who respects independence and high-level problem solving.'
) ON CONFLICT DO NOTHING;

-- Mock User 4: David (INFP)
INSERT INTO public.profiles (id, user_id, display_name, age, gender, sexuality, looking_for, bio)
VALUES (
  'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 
  'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 
  'David K.', 24, 'Man', 'Straight', 'Friendship', 
  'Dog person who loves a good sunset walk. 🐕 Looking for someone to share good vibes with.'
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.personality_profiles (user_id, mbti_type, ei_score, sn_score, tf_score, jp_score, personality_excerpt, compatibility_excerpt)
VALUES (
  'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 
  'INFP', 30, 75, 90, 85,
  'A compassionate dreamer who stays true to their personal values.',
  'Compatible with those who offer emotional safety and creative freedom.'
) ON CONFLICT DO NOTHING;

-- Seed Research Dictionary Content
INSERT INTO public.research_dictionary (key, content)
VALUES ('interaction_dictionary_v1', '{
  "core_philosophy": {
    "compatibility_paradox": "Compatibility is not a destination but a dynamic mechanism of interaction. Predictable tension (cognitive friction) exists when distinct processing systems collide.",
    "golden_pair_myth": "Longevity data suggests a shared function stack is no substitute for interpersonal skills."
  },
  "mechanisms": {
    "SN": "Communication Style: Sensors prioritize concrete details; Intuitives prioritize abstract possibilities.",
    "TF": "Support & Validation: T-types prioritize logic; F-types prioritize impact.",
    "EI": "Energy Management: Social battery asymmetry is a primary friction point.",
    "JP": "Lifestyle Structure: J-types seek closure; P-types value open options."
  },
  "protocols": {
    "vent_vs_solve": "Ask if logic or validation is needed.",
    "concrete_detail": "Provide 3 facts before abstracting.",
    "social_battery": "Schedule recharge blocks."
  }
}'::jsonb) ON CONFLICT (key) DO NOTHING;

