'use client'

import React, { useState } from 'react'
import { saveDatingProfile, type DatingProfile, getLocalUserId } from '@/lib/localUser'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { GENDER_OPTIONS, SEXUALITY_OPTIONS, LOOKING_FOR_OPTIONS } from '@/lib/constants'

interface DatingQuestionnaireProps {
  onComplete: () => void
}

/** Select field option list */
function SelectField({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'m6 9 6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

/**
 * Dating questionnaire form — collects name, age, gender, sexuality,
 * what someone is looking for, and a short bio.
 * Saves to localStorage via localUser utilities.
 */
export default function DatingQuestionnaire({ onComplete }: DatingQuestionnaireProps) {
  const [form, setForm] = useState<Omit<DatingProfile, 'completedAt'>>({
    name: '',
    age: '',
    gender: '',
    sexuality: '',
    lookingFor: '',
    bio: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({})

  const set = (field: keyof typeof form) => (value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const validate = (): boolean => {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 100)
      next.age = 'Enter a valid age (18+).'
    if (!form.gender) next.gender = 'Please select a gender.'
    if (!form.sexuality) next.sexuality = 'Please select a sexuality.'
    if (!form.lookingFor) next.lookingFor = 'Please select what you\'re looking for.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    const datingData = { ...form, completedAt: new Date().toISOString() }
    saveDatingProfile(datingData)

    try {
      const supabase = createSupabaseBrowserClient()
      const userId = getLocalUserId()

      // Upsert the profile into Supabase so it exists for the test submission
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          display_name: form.name,
          age: Number(form.age),
          gender: form.gender,
          sexuality: form.sexuality,
          looking_for: form.lookingFor,
          bio: form.bio
        }, { onConflict: 'user_id' })

      if (error) throw error
      onComplete()
    } catch (err) {
      console.error('Error saving profile to Supabase:', err)
      // We still call onComplete even if Supabase fails, but the AI won't work perfectly
      onComplete()
    }
  }

  return (
    <div className="card max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="mb-3">Tell Us About Yourself</h2>
        <p className="text-text-secondary">
          This helps us find your most compatible matches. Your info stays on your device during beta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Name */}
        <div className="form-group">
          <label htmlFor="dq-name" className="form-label">First Name</label>
          <input
            id="dq-name"
            type="text"
            placeholder="e.g. Alex"
            value={form.name}
            onChange={(e) => set('name')(e.target.value)}
            className="form-input"
            autoComplete="given-name"
          />
          {errors.name && <span className="text-xs text-accent">{errors.name}</span>}
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="dq-age" className="form-label">Age</label>
          <input
            id="dq-age"
            type="number"
            min={18}
            max={100}
            placeholder="e.g. 26"
            value={form.age}
            onChange={(e) => set('age')(e.target.value ? Number(e.target.value) : '')}
            className="form-input"
          />
          {errors.age && <span className="text-xs text-accent">{errors.age}</span>}
        </div>

        {/* Gender */}
        <SelectField
          id="dq-gender"
          label="Gender"
          value={form.gender}
          options={GENDER_OPTIONS}
          onChange={set('gender')}
        />
        {errors.gender && <span className="text-xs text-accent -mt-3 block">{errors.gender}</span>}

        {/* Sexuality */}
        <SelectField
          id="dq-sexuality"
          label="Sexuality"
          value={form.sexuality}
          options={SEXUALITY_OPTIONS}
          onChange={set('sexuality')}
        />
        {errors.sexuality && <span className="text-xs text-accent -mt-3 block">{errors.sexuality}</span>}

        {/* Looking for */}
        <SelectField
          id="dq-looking"
          label="Looking For"
          value={form.lookingFor}
          options={LOOKING_FOR_OPTIONS}
          onChange={set('lookingFor')}
        />
        {errors.lookingFor && <span className="text-xs text-accent -mt-3 block">{errors.lookingFor}</span>}

        {/* Bio */}
        <div className="form-group">
          <label htmlFor="dq-bio" className="form-label">Short Bio <span className="text-text-muted">(optional)</span></label>
          <textarea
            id="dq-bio"
            rows={3}
            placeholder="A little about yourself…"
            value={form.bio}
            onChange={(e) => set('bio')(e.target.value)}
            className="form-input"
            style={{ resize: 'none' }}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full py-4 text-lg">
          Continue to Personality Test →
        </button>
      </form>
    </div>
  )
}
