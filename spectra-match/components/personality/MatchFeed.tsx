'use client'

import React, { useEffect, useState } from 'react'
import MatchCard from './MatchCard'
import { getPersonalityResults, getDatingProfile, getLocalUserId } from '@/lib/localUser'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { isMatchCompatible } from '@/lib/matching'

export default function MatchFeed() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const results = getPersonalityResults()
  const datingProfile = getDatingProfile()
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchMatches = async () => {
      if (!datingProfile) {
        setLoading(false)
        return
      }

      try {
        // Fetch all profiles and their current personality profiles
        // In a high-scale app, we'd do this filtering in SQL, but for beta, JS is fine
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            display_name,
            age,
            gender,
            sexuality,
            avatar_url,
            personality_profiles (
              mbti_type,
              is_current
            )
          `)
          .neq('user_id', getLocalUserId()) // Exclude self based on anonymous ID


        if (error) {
          console.error('Supabase fetch error:', error)
          throw error
        }

        if (!data || data.length === 0) {
          console.log('No profiles found in database.')
          setMatches([])
          return
        }

        const filtered = data
          .filter(u => isMatchCompatible(datingProfile, u.gender || '', u.sexuality || ''))
          .map(u => {
            const personality = Array.isArray(u.personality_profiles) 
              ? u.personality_profiles.find((p: any) => p.is_current)
              : null
            
            return {
              userId: u.user_id,
              displayName: `${u.display_name}, ${u.age}`,
              mbtiType: personality?.mbti_type || '????',
              avatarUrl: u.avatar_url,
              // Deterministic compatibility score based on IDs to avoid "shifting"
              compatibilityScore: (parseInt(u.id.slice(0, 8), 16) % 30) + 70 
            }
          })
          .sort((a, b) => b.compatibilityScore - a.compatibilityScore)

        setMatches(filtered)
      } catch (err: any) {
        // Handle expired session by clearing it
        if (err.code === 'PGRST303' || err.message?.includes('JWT expired')) {
          console.warn('Session expired. Reverting to anonymous access...')
          await supabase.auth.signOut()
          // Optionally re-fetch after sign out to use anon key
          window.location.reload()
          return
        }

        // Log the actual error object for debugging
        console.error('Detailed fetch error:', {
          message: err.message,
          details: err.details,
          hint: err.hint,
          code: err.code
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [datingProfile])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map(i => <div key={i} className="card h-24 bg-bg-elevated/50" />)}
      </div>
    )
  }

  if (!datingProfile) {
    return (
      <div className="text-center py-20 card bg-bg-surface/30 border-dashed">
        <h3 className="mb-2 text-text-secondary">Complete your profile</h3>
        <p className="text-text-muted text-sm mb-6">We need to know your preferences to find your matches.</p>
        <a href="/test" className="btn btn-primary px-8">Setup Profile</a>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-20 card bg-bg-surface/30 border-dashed">
        <h3 className="mb-2 text-text-secondary">No matches found yet</h3>
        <p className="text-text-muted text-sm">We couldn't find anyone matching your preferences right now.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="stagger-children space-y-4">
        {matches.map((match) => (
          <MatchCard 
            key={match.userId}
            userId={match.userId}
            displayName={match.displayName}
            avatarUrl={match.avatarUrl}
            mbtiType={match.mbtiType}
            compatibilityScore={match.compatibilityScore}
          />
        ))}
      </div>
      
      <div className="flex justify-center pt-8">
        <p className="text-text-muted text-xs uppercase tracking-widest font-bold">
          {matches.length} matches found in the database
        </p>
      </div>
    </div>
  )
}
