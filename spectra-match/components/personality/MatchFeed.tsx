'use client'

import React, { useEffect, useState } from 'react'
import MatchCard from './MatchCard'
import { getPersonalityResults, getDatingProfile } from '@/lib/localUser'
import { generateMockUsers, filterMatches, type MockUser } from '@/lib/mockUsers'

export default function MatchFeed() {
  const [matches, setMatches] = useState<MockUser[]>([])
  const [loading, setLoading] = useState(true)
  const results = getPersonalityResults()
  const datingProfile = getDatingProfile()

  useEffect(() => {
    if (!datingProfile) {
      setLoading(false)
      return
    }

    // Simulate database fetch
    const timer = setTimeout(() => {
      const allMockUsers = generateMockUsers(100)
      const filtered = filterMatches(datingProfile, allMockUsers)
      
      // Add pseudo-random compatibility scores based on MBTI types
      // In a real app, this would use lib/compatibility.ts
      const scoredMatches = filtered.map(user => ({
        ...user,
        compatibilityScore: Math.floor(Math.random() * (98 - 60 + 1)) + 60
      })).sort((a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0))

      setMatches(scoredMatches.slice(0, 20)) // Show top 20
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
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
        <p className="text-text-muted text-sm">We couldn't find anyone matching your preferences right now. Try updating your profile!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="stagger-children space-y-4">
        {matches.map((match) => (
          <MatchCard 
            key={match.userId}
            displayName={`${match.displayName}, ${match.age}`}
            avatarUrl={match.avatarUrl}
            mbtiType={match.mbtiType}
            compatibilityScore={match.compatibilityScore || 0}
          />
        ))}
      </div>
      
      <div className="flex justify-center pt-8">
        <p className="text-text-muted text-xs uppercase tracking-widest font-bold">
          {matches.length} matches found for your energy
        </p>
      </div>
    </div>
  )
}
