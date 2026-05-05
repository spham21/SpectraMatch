'use client'

import React from 'react'
import MatchFeed from '@/components/personality/MatchFeed'

export default function MatchesPage() {
  return (
    <div className="container py-20 max-w-3xl">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="mb-2">Your Compatible Matches</h1>
        <p className="text-text-secondary">People whose spectral signature aligns with yours.</p>
      </div>

      <MatchFeed />
    </div>
  )
}
