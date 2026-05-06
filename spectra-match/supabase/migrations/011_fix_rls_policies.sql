-- Migration: 011_fix_rls_policies
-- Relaxes RLS for beta: allows anon and authenticated users to read all profiles and personality_profiles
-- This is necessary because the app uses anonymous local IDs and needs to show other users' types in the feed.

-- 1. Profiles Table
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can read all profiles" ON public.profiles;
CREATE POLICY "Anyone can read all profiles"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
CREATE POLICY "Anyone can insert profiles"
  ON public.profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update their own profile" ON public.profiles;
CREATE POLICY "Anyone can update their own profile"
  ON public.profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 2. Personality Profiles Table
DROP POLICY IF EXISTS "Users can read their own personality profiles" ON public.personality_profiles;
DROP POLICY IF EXISTS "Anyone can read all personality profiles" ON public.personality_profiles;
CREATE POLICY "Anyone can read all personality profiles"
  ON public.personality_profiles FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert personality profiles" ON public.personality_profiles;
CREATE POLICY "Anyone can insert personality profiles"
  ON public.personality_profiles FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update personality profiles" ON public.personality_profiles;
CREATE POLICY "Anyone can update personality profiles"
  ON public.personality_profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Research Dictionary Table (Ensure it''s readable)
ALTER TABLE public.research_dictionary ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read research dictionary" ON public.research_dictionary;
CREATE POLICY "Anyone can read research dictionary"
  ON public.research_dictionary FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Excerpt Prompts Table (Ensure it''s readable)
ALTER TABLE public.excerpt_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read excerpt prompts" ON public.excerpt_prompts;
CREATE POLICY "Anyone can read excerpt prompts"
  ON public.excerpt_prompts FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Compatibility Map Table (Ensure it''s readable)
ALTER TABLE public.compatibility_map ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read compatibility map" ON public.compatibility_map;
CREATE POLICY "Anyone can read compatibility map"
  ON public.compatibility_map FOR SELECT
  TO anon, authenticated
  USING (true);

-- 5. Restore Relationship for PostgREST
-- PostgREST needs a foreign key to understand how to join profiles and personality_profiles.
-- Since we dropped the auth.users fkey for the beta, we link them directly.
ALTER TABLE public.personality_profiles 
DROP CONSTRAINT IF EXISTS personality_profiles_user_id_profiles_fkey;

ALTER TABLE public.personality_profiles 
ADD CONSTRAINT personality_profiles_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
