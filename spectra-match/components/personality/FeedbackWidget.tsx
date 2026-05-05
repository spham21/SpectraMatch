'use client'

import React, { useState } from 'react'
import { trackExcerptFeedback } from '@/lib/analytics'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

interface FeedbackWidgetProps {
  profileId: string
}

export default function FeedbackWidget({ profileId }: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleFeedback = async (isPositive: boolean) => {
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) return

      // Call edge function
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/excerpt-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ profileId, isPositive })
      })

      // Track locally
      await trackExcerptFeedback(profileId, isPositive)
      setSubmitted(true)
    } catch (err) {
      console.error('Error submitting feedback:', err)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4 text-xs font-semibold text-success animate-fade-in">
        Thanks for your feedback!
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
      <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Was this analysis accurate?</p>
      <div className="flex gap-4">
        <button 
          onClick={() => handleFeedback(true)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-success/10 hover:text-success hover:border-success transition-all"
          aria-label="Thumbs Up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
        </button>
        <button 
          onClick={() => handleFeedback(false)}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:bg-accent/10 hover:text-accent hover:border-accent transition-all"
          aria-label="Thumbs Down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>
        </button>
      </div>
    </div>
  )
}
