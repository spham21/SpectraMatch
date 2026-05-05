'use client'

import React, { useEffect, useState } from 'react'
import type { Dimension } from '@/lib/constants'

interface DimensionBarProps {
  dimension: Dimension
  score: number
  lowLabel: string
  highLabel: string
}

export default function DimensionBar({ dimension, score, lowLabel, highLabel }: DimensionBarProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end text-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{lowLabel}</span>
          <span className={`text-lg font-bold ${score < 50 ? 'text-primary' : 'text-text-muted opacity-40'}`}>
            {100 - score}%
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">{highLabel}</span>
          <span className={`text-lg font-bold ${score >= 50 ? 'text-accent' : 'text-text-muted opacity-40'}`}>
            {score}%
          </span>
        </div>
      </div>
      
      <div className="dimension-bar-track relative">
        <div 
          className={`dimension-bar-fill dimension-bar-fill--${dimension}`}
          data-animated={animated}
          style={{ width: animated ? `${score}%` : '0%', marginLeft: 'auto', marginRight: score >= 50 ? '0' : 'auto' }}
        />
        {/* Center line */}
        <div className="absolute top-0 left-1/2 w-px h-full bg-border/50 -translate-x-1/2" />
      </div>
    </div>
  )
}
