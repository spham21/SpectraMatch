'use client'

import React, { useEffect, useState } from 'react'
import { getDatingProfile, getPersonalityResults, type DatingProfile, type PersonalityResults } from '@/lib/localUser'
import Link from 'next/link'

export default function ProfilePage() {
  const [datingProfile, setDatingProfile] = useState<DatingProfile | null>(null)
  const [personality, setPersonality] = useState<PersonalityResults | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setDatingProfile(getDatingProfile())
    setPersonality(getPersonalityResults())
    setLoading(false)
  }, [])

  if (loading) return (
    <div className="container py-20 flex justify-center">
      <div className="spinner" />
    </div>
  )

  if (!datingProfile) {
    return (
      <div className="container py-20 text-center space-y-6">
        <h2 className="gradient-text">No Profile Found</h2>
        <p className="text-text-secondary max-w-md mx-auto">
          You haven't completed your profile yet. Take the test to discover your type and find matches!
        </p>
        <Link href="/test" className="btn btn-primary px-8 py-3 inline-block">
          Get Started
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="card space-y-8 animate-fade-in">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-bg-elevated border-4 border-border overflow-hidden flex items-center justify-center text-text-muted">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div>
            <h2 className="mb-1">{datingProfile.name}, {datingProfile.age}</h2>
            <p className="text-text-secondary text-sm">{datingProfile.gender} • {datingProfile.sexuality}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">About Me</h4>
            <p className="text-text-primary leading-relaxed">
              {datingProfile.bio || "No bio added yet."}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Looking For</h4>
            <p className="text-text-primary">
              {datingProfile.lookingFor}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-bg-elevated/30 border-dashed">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Personality Type</span>
            {personality ? (
              <div className="flex items-center gap-3">
                <span className="badge badge-type text-sm px-3 py-1">{personality.mbtiType}</span>
                <Link href="/results" className="text-xs text-primary-soft hover:underline">View Results →</Link>
              </div>
            ) : (
              <Link href="/test" className="text-xs text-accent-soft hover:underline">Take Test Now →</Link>
            )}
          </div>
          
          <div className="card bg-bg-elevated/30 border-dashed">
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Profile Created</span>
            <span className="text-sm text-text-primary">{new Date(datingProfile.completedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <Link href="/test" className="btn btn-ghost w-full">
            Retake Personality Test
          </Link>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="btn btn-ghost w-full text-accent hover:border-accent/50 hover:bg-accent/5"
          >
            Reset Profile (Beta)
          </button>
        </div>
      </div>
    </div>
  )
}
