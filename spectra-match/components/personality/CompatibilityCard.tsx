'use client'

import React from 'react'

interface CompatibilityCardProps {
  compatibleTypes: string[]
  excerpt: string
  rationale: string
}

export default function CompatibilityCard({ compatibleTypes, excerpt, rationale }: CompatibilityCardProps) {
  return (
    <div className="card space-y-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
        </div>
        <h2 className="mb-2">Compatibility Insight</h2>
        <p className="text-text-secondary text-sm max-w-md">
          How you connect with others and what you seek in a partnership.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-bold text-text-muted uppercase tracking-widest">Natural Matches</h4>
        <div className="flex flex-wrap gap-2">
          {compatibleTypes.map((type) => (
            <span key={type} className="badge badge-score">
              {type}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-border">
        <div>
          <h4 className="mb-2 text-accent-soft">The Dynamic</h4>
          <p className="text-text-primary leading-relaxed italic">
            "{excerpt || 'Generating compatibility details...'}"
          </p>
        </div>
        
        <div>
          <h4 className="mb-2 text-text-secondary text-sm font-semibold">Why it works</h4>
          <p className="text-text-secondary text-sm leading-relaxed">
            {rationale}
          </p>
        </div>
      </div>
    </div>
  )
}
