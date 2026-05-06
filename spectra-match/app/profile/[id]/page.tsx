'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import ResultsScreen from '@/components/personality/ResultsScreen'

export default function PublicProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [personality, setPersonality] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchProfile = async () => {
      // Ensure id is a string to satisfy Supabase/TypeScript
      const userId = Array.isArray(id) ? id[0] : id
      if (!userId) return

      // 1. Fetch user profile info
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError)
        setLoading(false)
        return
      }

      // 2. Fetch personality results
      const { data: personalityData, error: personalityError } = await supabase
        .from('personality_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('is_current', true)
        .single()

      setProfile(profileData)
      setPersonality(personalityData)
      setLoading(false)
    }

    if (id) fetchProfile()
  }, [id, supabase])

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center">
        <div className="spinner mb-4" />
        <p className="text-text-secondary">Loading spectral profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-20 text-center">
        <h2 className="mb-4">Profile Not Found</h2>
        <button onClick={() => router.back()} className="btn btn-ghost">Go Back</button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="card flex flex-col md:flex-row items-center gap-8 animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-bg-elevated border-4 border-border overflow-hidden flex items-center justify-center text-text-muted shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl">{profile.display_name}, {profile.age}</h1>
              {personality && (
                <span className="badge badge-type text-sm px-3 py-1">{personality.mbti_type}</span>
              )}
            </div>
            <p className="text-text-secondary text-lg">
              {profile.gender} • {profile.sexuality}
            </p>
            <p className="text-text-primary max-w-xl leading-relaxed italic">
              "{profile.bio || 'No bio provided.'}"
            </p>
          </div>
        </div>

        {/* Personality Results Section */}
        {personality ? (
          <div className="space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="text-center">
              <h2 className="gradient-text mb-2">Spectral Alignment</h2>
              <p className="text-text-secondary">How their energy manifests in the world.</p>
            </div>
            
            <ResultsScreen 
              type={personality.mbti_type}
              scores={{
                EI: personality.ei_score,
                SN: personality.sn_score,
                TF: personality.tf_score,
                JP: personality.jp_score
              }}
              personalityExcerpt={personality.personality_excerpt}
              compatibilityExcerpt={personality.compatibility_excerpt}
              // We'll hide the detailed compatibility rationale for public profiles for now
              compatibleTypes={[]}
              compatibilityRationale=""
            />
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-text-secondary">This user hasn't completed their personality test yet.</p>
          </div>
        )}

        <div className="flex justify-center pt-8">
          <button onClick={() => router.back()} className="btn btn-ghost px-10">
            Back to Matches
          </button>
        </div>
      </div>
    </div>
  )
}
