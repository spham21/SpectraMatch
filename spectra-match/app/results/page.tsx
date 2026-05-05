'use client'

import React, { useEffect, useState } from 'react'
import { getPersonalityResults, type PersonalityResults } from '@/lib/localUser'
import ResultsScreen from '@/components/personality/ResultsScreen'
import FeedbackWidget from '@/components/personality/FeedbackWidget'

export default function ResultsPage() {
  const [profile, setProfile] = useState<PersonalityResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const results = getPersonalityResults()
    if (results) {
      setProfile(results)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container py-20 flex flex-col items-center">
        <div className="spinner mb-4" />
        <p className="text-text-secondary animate-pulse">Loading your profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container py-20 text-center">
        <h2 className="mb-4">No Results Found</h2>
        <p className="text-text-secondary mb-8">Take the test to see your spectral signature.</p>
        <a href="/test" className="btn btn-primary">Take the Test</a>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="mb-2 gradient-text">Your Spectral Signature</h1>
        <p className="text-text-secondary">Insight generated on {new Date(profile.createdAt).toLocaleDateString()}</p>
      </div>

      <ResultsScreen 
        type={profile.mbtiType}
        scores={{
          EI: profile.eiScore,
          SN: profile.snScore,
          TF: profile.tfScore,
          JP: profile.jpScore
        }}
        personalityExcerpt={profile.personalityExcerpt}
        compatibilityExcerpt={profile.compatibilityExcerpt}
        compatibleTypes={profile.compatibleTypes}
        compatibilityRationale={profile.compatibilityRationale}
      />

      <div className="max-w-2xl mx-auto mt-12 pt-12 border-t border-border/50">
        {/* We'll hide feedback widget for now since it might need profileId for Supabase */}
        <p className="text-center text-text-muted text-sm italic">
          Beta Version — Results are stored locally on your device.
        </p>
      </div>
    </div>
  )
}
