import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

/**
 * Creates a Supabase client for use in browser (Client Components).
 * Singleton pattern — safe to call on every render.
 *
 * @returns Supabase browser client
 */
export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Build-time safety: If keys are missing during Vercel's static generation,
  // we return a placeholder to prevent the build from crashing.
  if (!supabaseUrl || !supabaseAnonKey) {
    return createBrowserClient<Database>(
      'https://placeholder-project.supabase.co',
      'placeholder-key'
    )
  }
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
