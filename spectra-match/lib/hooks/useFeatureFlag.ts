// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

/**
 * Hashes a user ID into a 0–99 integer for rollout percentage logic.
 * Uses a simple deterministic djb2-style hash.
 *
 * @param userId - The authenticated user's UUID
 * @returns Integer in [0, 99]
 */
function hashUserIdToBucket(userId: string): number {
  let hash = 5381
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) + hash) ^ userId.charCodeAt(i)
  }
  return Math.abs(hash) % 100
}

/**
 * React hook that returns whether a feature flag is enabled for the current user.
 * Fetches from the `feature_flags` Supabase table and applies rollout_pct logic.
 *
 * @param flagName - The feature flag name (e.g. "matching_feed")
 * @returns `true` if the flag is enabled for this user, `false` otherwise
 */
export function useFeatureFlag(flagName: string): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchFlag() {
      const supabase = createSupabaseBrowserClient()

      const { data: flag } = await supabase
        .from('feature_flags')
        .select('enabled, rollout_pct')
        .eq('name', flagName)
        .single()

      if (cancelled || !flag) return

      if (!flag.enabled) {
        setEnabled(false)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user?.id

      if (!userId) {
        // Not logged in — gate behind flag only for authenticated users
        setEnabled(false)
        return
      }

      const rolloutPct = flag.rollout_pct ?? 100
      const bucket = hashUserIdToBucket(userId)
      setEnabled(bucket < rolloutPct)
    }

    fetchFlag()
    return () => { cancelled = true }
  }, [flagName])

  return enabled
}
