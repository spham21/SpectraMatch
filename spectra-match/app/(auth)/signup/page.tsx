'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createSupabaseBrowserClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      setMessage('Registration successful! Check your email for confirmation.')
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-20 animate-fade-in">
      <div className="card space-y-8">
        <div className="text-center">
          <h2 className="mb-2">Create Account</h2>
          <p className="text-text-secondary text-sm">Join the SpectraMatch community.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Alex Smith"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {message && (
          <p className={`text-center text-sm ${message.includes('successful') ? 'text-success' : 'text-accent'}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-primary-soft hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
