-- Migration: 013_relax_auth_constraints
-- Drops strict auth.users requirements to support anonymous beta users

-- 1. Remove auth.users reference from public.profiles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- 2. Remove auth.users reference from public.personality_profiles
ALTER TABLE public.personality_profiles 
DROP CONSTRAINT IF EXISTS personality_profiles_user_id_fkey;

-- 3. Ensure profiles.user_id is still unique and indexed (already unique from 001)
-- 4. personality_profiles already has a link to profiles(user_id) from migration 011

-- 5. Add a comment explaining this for future developers
COMMENT ON COLUMN public.profiles.user_id IS 'Stable UUID. Can be a Supabase Auth ID or a browser-generated anonymous ID during beta.';
