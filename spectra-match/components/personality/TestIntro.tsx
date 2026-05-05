'use client'

import React from 'react'

interface TestIntroProps {
  onStart: () => void
}

export default function TestIntro({ onStart }: TestIntroProps) {
  return (
    <div className="card max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="mb-4">SpectraMatch Personality Test</h1>
        <p className="text-text-secondary text-lg">
          Discover your MBTI type and see how you align with others. This test takes about 8 minutes.
        </p>
      </div>

      <div className="stagger-children space-y-6 mb-10">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">1</div>
          <div>
            <h4 className="mb-1">Deep Insight</h4>
            <p className="text-text-secondary">We measure 4 core dimensions of personality to build your unique profile.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">2</div>
          <div>
            <h4 className="mb-1">AI-Powered Excerpts</h4>
            <p className="text-text-secondary">Gemini Flash generates a personalized description based on your specific scores.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">3</div>
          <div>
            <h4 className="mb-1">Compatibility Feed</h4>
            <p className="text-text-secondary">See how your energy matches with other users in our real-time feed.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button className="btn btn-primary w-full py-4 text-lg" onClick={onStart}>
          Start the Test
        </button>
        <p className="text-center text-text-muted text-xs">
          By starting, you agree to our terms of service. Your answers are private.
        </p>
      </div>
    </div>
  )
}
