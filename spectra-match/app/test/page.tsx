'use client'

import React, { useState, useEffect } from 'react'
import { getShuffledQuestions, type Question } from '@/lib/questions'
import { trackTestStarted, trackQuestionAnswered, trackTestSubmitted } from '@/lib/analytics'
import { getLocalUserId, hasDatingProfile, savePersonalityResults } from '@/lib/localUser'
import TestIntro from '@/components/personality/TestIntro'
import DatingQuestionnaire from '@/components/personality/DatingQuestionnaire'
import ProgressBar from '@/components/personality/ProgressBar'
import QuestionCard from '@/components/personality/QuestionCard'
import ProcessingScreen from '@/components/personality/ProcessingScreen'
import { normalizeDimension, deriveTypeFromScores } from '@/lib/scoring'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type TestState = 'dating' | 'intro' | 'questions' | 'processing'

export default function TestPage() {
  const [state, setState] = useState<TestState>('dating')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  
  useEffect(() => {
    if (hasDatingProfile()) {
      setState('intro')
    }
  }, [])

  const handleDatingComplete = () => setState('intro')

  const handleStart = async () => {
    const shuffled = getShuffledQuestions()
    setQuestions(shuffled)
    setState('questions')
    await trackTestStarted(getLocalUserId())
  }

  const handleAnswer = async (score: number) => {
    const question = questions[currentIndex]
    const updatedAnswers = { ...answers, [question.id]: score }
    setAnswers(updatedAnswers)

    await trackQuestionAnswered(question.id, score, currentIndex)

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300)
    } else {
      await processResults(updatedAnswers)
    }
  }

  /** Ensures a profile exists for the user to avoid foreign key errors */
  async function ensureProfile(supabase: any, userId: string) {
    const { data } = await supabase.from('profiles').select('user_id').eq('user_id', userId).single()
    if (!data) {
      await (supabase.from('profiles').upsert({ user_id: userId, display_name: 'Anonymous Beta User' } as any) as any)
    }
  }

  /** Invokes the AI Edge Function to score the test and generate excerpts */
  async function submitToAI(supabase: any, userId: string, finalAnswers: Record<string, number>) {
    const formattedAnswers = Object.entries(finalAnswers).map(([id, score]) => ({
      questionId: id,
      score
    }))

    const { data, error } = await supabase.functions.invoke('submit-test', {
      body: { answers: formattedAnswers, anonymousUserId: userId }
    })

    if (error) {
      console.error('AI Function Error Object:', error)
      const details = error.context ? await error.context.json().catch(() => ({ error: error.message })) : { error: error.message }
      const finalMessage = details.error || details.message || error.message
      throw new Error(`Edge Function Error: ${finalMessage}`)
    }
    return data
  }

  /** Fetches the generated profile and caches it locally */
  async function finalizeResults(supabase: any, profileId: string) {
    const { data: profile, error } = await supabase.from('personality_profiles').select('*').eq('id', profileId).single()
    if (error) throw error

    savePersonalityResults({
      mbtiType: profile.mbti_type,
      eiScore: profile.ei_score,
      snScore: profile.sn_score,
      tfScore: profile.tf_score,
      jpScore: profile.jp_score,
      personalityExcerpt: profile.personality_excerpt,
      compatibilityExcerpt: profile.compatibility_excerpt,
      compatibleTypes: ['ENFP', 'INFJ', 'INTJ'],
      compatibilityRationale: 'Based on spectral resonance patterns.',
      createdAt: profile.created_at
    })
  }

  const processResults = async (finalAnswers: Record<string, number>) => {
    setState('processing')
    const userId = getLocalUserId()
    const supabase = createSupabaseBrowserClient()

    try {
      await trackTestSubmitted(userId)
      await ensureProfile(supabase, userId)
      const { profileId } = await submitToAI(supabase, userId, finalAnswers)
      await finalizeResults(supabase, profileId)
      window.location.href = '/results'
    } catch (err) {
      console.error('Test Submission Error:', err)
      alert('AI processing failed. Please try again or check your connection.')
      setState('questions')
    }
  }

  return (
    <div className="pb-20">
      {state === 'dating' && (
        <div className="container py-20">
          <DatingQuestionnaire onComplete={handleDatingComplete} />
        </div>
      )}

      {state === 'intro' && (
        <div className="container py-20">
          <TestIntro onStart={handleStart} />
        </div>
      )}

      {state === 'questions' && questions.length > 0 && questions[currentIndex] && (
        <>
          <ProgressBar current={currentIndex + 1} total={questions.length} />
          <div className="container py-20">
            <QuestionCard 
              question={questions[currentIndex]} 
              value={answers[questions[currentIndex].id] || null}
              onAnswer={handleAnswer}
            />
            
            <div className="max-w-xl mx-auto mt-8 flex justify-between px-4">
              <button 
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn btn-ghost py-2 px-6 disabled:opacity-30"
              >
                Previous
              </button>
              <div className="text-xs text-text-muted font-bold tracking-widest flex items-center">
                QUESTION {currentIndex + 1} / {questions.length}
              </div>
            </div>
          </div>
        </>
      )}

      {state === 'questions' && questions.length === 0 && (
        <div className="container py-20 text-center">
          <div className="spinner mb-4 mx-auto" />
          <p className="text-text-secondary">Loading questions...</p>
        </div>
      )}

      {state === 'processing' && <ProcessingScreen />}
    </div>
  )
}
