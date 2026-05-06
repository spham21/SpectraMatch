'use client'

import React from 'react'
import Link from 'next/link'

interface MatchCardProps {
  userId: string
  displayName: string
  avatarUrl: string | null
  mbtiType: string | null
  compatibilityScore: number
}

export default function MatchCard({ userId, displayName, avatarUrl, mbtiType, compatibilityScore }: MatchCardProps) {
  return (
    <div className="card flex items-center gap-6 animate-fade-in group">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full bg-bg-elevated overflow-hidden border-2 border-border group-hover:border-primary-soft transition-colors">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 badge badge-score bg-bg-surface border-border text-[10px] px-1.5">
          {compatibilityScore}%
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="truncate mb-1">{displayName}</h4>
        <div className="flex items-center gap-2">
          {mbtiType && <span className="text-xs font-bold text-primary-soft tracking-wider">{mbtiType}</span>}
          <span className="text-xs text-text-muted">• Compatible Energy</span>
        </div>
      </div>

      <Link href={`/profile/${userId}`} className="btn btn-ghost py-2 px-4 text-sm hidden sm:flex hover:bg-primary/10 hover:text-primary-soft">
        View Profile
      </Link>
    </div>
  )
}
