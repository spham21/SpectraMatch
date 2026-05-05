'use client'

import React from 'react'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md py-4 border-b border-border">
      <div className="container">
        <div className="flex justify-between items-center mb-2 text-xs font-semibold text-text-secondary">
          <span>{percentage}% COMPLETE</span>
          <span>{current} OF {total} QUESTIONS</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
