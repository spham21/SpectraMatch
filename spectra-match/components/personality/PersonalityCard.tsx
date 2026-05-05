'use client'

import React from 'react'
import DimensionBar from './DimensionBar'
import { DIMENSION_POLES } from '@/lib/constants'
import type { DimensionScores } from '@/lib/scoring'

interface PersonalityCardProps {
  type: string
  scores: DimensionScores
  excerpt: string
}

export default function PersonalityCard({ type, scores, excerpt }: PersonalityCardProps) {
  return (
    <div className="card space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <span className="badge badge-type mb-4">{type}</span>
        <h2 className="mb-2">Your Personality Profile</h2>
        <p className="text-text-secondary text-sm max-w-md">
          Based on your answers, your primary mode of living is focused on {type}.
        </p>
      </div>

      <div className="space-y-6">
        <DimensionBar 
          dimension="EI" 
          score={scores.EI} 
          lowLabel={DIMENSION_POLES.EI.low} 
          highLabel={DIMENSION_POLES.EI.high} 
        />
        <DimensionBar 
          dimension="SN" 
          score={scores.SN} 
          lowLabel={DIMENSION_POLES.SN.low} 
          highLabel={DIMENSION_POLES.SN.high} 
        />
        <DimensionBar 
          dimension="TF" 
          score={scores.TF} 
          lowLabel={DIMENSION_POLES.TF.low} 
          highLabel={DIMENSION_POLES.TF.high} 
        />
        <DimensionBar 
          dimension="JP" 
          score={scores.JP} 
          lowLabel={DIMENSION_POLES.JP.low} 
          highLabel={DIMENSION_POLES.JP.high} 
        />
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="mb-3 text-primary-soft">AI Insight</h4>
        <p className="text-text-primary leading-relaxed italic">
          "{excerpt || 'Your personality analysis is being prepared...'}"
        </p>
      </div>
    </div>
  )
}
