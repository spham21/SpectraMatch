'use client'

import React from 'react'
import PersonalityCard from './PersonalityCard'
import CompatibilityCard from './CompatibilityCard'
import type { DimensionScores } from '@/lib/scoring'

interface ResultsScreenProps {
  type: string
  scores: DimensionScores
  personalityExcerpt: string
  compatibilityExcerpt: string
  compatibleTypes: string[]
  compatibilityRationale: string
}

export default function ResultsScreen({
  type,
  scores,
  personalityExcerpt,
  compatibilityExcerpt,
  compatibleTypes,
  compatibilityRationale
}: ResultsScreenProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 container py-12">
      <PersonalityCard 
        type={type} 
        scores={scores} 
        excerpt={personalityExcerpt} 
      />
      <CompatibilityCard 
        compatibleTypes={compatibleTypes} 
        excerpt={compatibilityExcerpt} 
        rationale={compatibilityRationale} 
      />
      
      <div className="lg:col-span-2 flex justify-center pt-8">
        <button 
          onClick={() => window.location.href = '/matches'}
          className="btn btn-primary px-12 py-4"
        >
          View Your Matches
        </button>
      </div>
    </div>
  )
}
