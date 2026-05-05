'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createSupabaseBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
    } else {
      window.location.href = '/test'
    }
  }

  const handleMagicLink = async () => {
    if (!email) {
      setMessage('Please enter your email first')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) setMessage(error.message)
    else setMessage('Check your email for the magic link!')
  }

  return (
    <div className="container max-w-md py-20 animate-fade-in">
      <div className="card space-y-8">
        <div className="text-center">
          <h2 className="mb-2">Welcome Back</h2>
          <p className="text-text-secondary text-sm">Log in to continue your journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-bg-surface px-2 text-text-muted">Or continue with</span></div>
        </div>

        <button 
          onClick={handleMagicLink}
          className="btn btn-ghost w-full py-3 text-sm"
          disabled={loading}
        >
          Email Magic Link
        </button>

        {message && (
          <p className={`text-center text-sm ${message.includes('Check') ? 'text-success' : 'text-accent'}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-text-secondary">
          Don't have an account? <Link href="/signup" className="text-primary-soft hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
