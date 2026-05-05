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

  const processResults = async (finalAnswers: Record<string, number>) => {
    setState('processing')
    await trackTestSubmitted(getLocalUserId())

    // For beta: Calculate scores locally since auth is removed
    const byDimension: Record<string, number[]> = { EI: [], SN: [], TF: [], JP: [] }
    questions.forEach(q => {
      const dim = q.id.split('-')[0]
      if (dim in byDimension) byDimension[dim].push(finalAnswers[q.id] || 4)
    })

    const scores = {
      EI: normalizeDimension(byDimension.EI),
      SN: normalizeDimension(byDimension.SN),
      TF: normalizeDimension(byDimension.TF),
      JP: normalizeDimension(byDimension.JP),
    }

    const mbtiType = deriveTypeFromScores(scores)

    // Simulate AI delay
    await new Promise(r => setTimeout(r, 2000))

    // Save to localStorage
    savePersonalityResults({
      mbtiType,
      eiScore: scores.EI,
      snScore: scores.SN,
      tfScore: scores.TF,
      jpScore: scores.JP,
      personalityExcerpt: `As an ${mbtiType}, your spectral signature shows a unique alignment of energy. You approach the world with both curiosity and purpose.`,
      compatibilityExcerpt: `In relationships, you seek a connection that resonates with your core values and intellectual depth.`,
      compatibleTypes: ['ENFP', 'INFJ', 'INTJ'], // Mock for now
      compatibilityRationale: 'These types often share complementary spectral energies that lead to deep understanding.',
      createdAt: new Date().toISOString()
    })

    window.location.href = '/results'
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
