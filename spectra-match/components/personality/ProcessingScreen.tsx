'use client'

import React from 'react'

export default function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="spinner mb-8" />
      <h2 className="mb-2 gradient-text">Analyzing your results...</h2>
      <p className="text-text-secondary animate-pulse max-w-sm">
        Our personality engine is processing your answers and generating your unique AI profile. This usually takes 5-10 seconds.
      </p>
      
      <div className="mt-12 space-y-4 w-full max-w-xs text-xs text-text-muted">
        <div className="flex justify-between items-center opacity-40">
          <span>Normalizing dimension scores</span>
          <span>DONE</span>
        </div>
        <div className="flex justify-between items-center opacity-70">
          <span>Deriving MBTI personality type</span>
          <span>PROCESSING</span>
        </div>
        <div className="flex justify-between items-center opacity-30">
          <span>Requesting AI personality excerpt</span>
          <span>WAITING</span>
        </div>
      </div>
    </div>
  )
}
