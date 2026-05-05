'use client'

import React from 'react'
import type { Question } from '@/lib/questions'

interface QuestionCardProps {
  question: Question
  value: number | null
  onAnswer: (score: number) => void
}

/** Scores 1–7 displayed as size-graded circles with middle being smallest */
const LIKERT_SCORES = [1, 2, 3, 4, 5, 6, 7] as const

export default function QuestionCard({ question, value, onAnswer }: QuestionCardProps) {
  return (
    <div className="card max-w-2xl mx-auto animate-slide-in">
      <h3 className="text-center mb-12 min-h-[5rem] flex items-center justify-center px-6 leading-snug">
        {question.text}
      </h3>

      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest text-center w-16 sm:w-20 leading-tight">
              Strongly Disagree
            </span>

            <div className="likert-row flex-1 px-2">
              {LIKERT_SCORES.map((score) => (
                <button
                  key={score}
                  data-size={score}
                  onClick={() => onAnswer(score)}
                  className={`likert-btn ${value === score ? 'likert-btn--selected' : ''}`}
                  aria-label={`Score ${score} of 7`}
                  title={score === 4 ? "Neutral" : `${score} of 7`}
                />
              ))}
            </div>

            <span className="text-[10px] font-bold text-success uppercase tracking-widest text-center w-16 sm:w-20 leading-tight">
              Strongly Agree
            </span>
          </div>
        </div>

        <p className="text-center text-text-muted text-xs italic opacity-70">
          Tip: Be as honest as possible for the most accurate spectral signature.
        </p>
      </div>
    </div>
  )
}
