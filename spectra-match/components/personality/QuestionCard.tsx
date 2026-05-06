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
    <div className="card animate-slide-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h3 className="text-center mb-12" style={{ minHeight: '5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', lineHeight: '1.4' }}>
        {question.text}
      </h3>

      <div className="likert-container">
        {/* Strongly Disagree - Left */}
        <div className="likert-label-container" style={{ textAlign: 'right' }}>
          <span className="likert-label" style={{ color: 'var(--color-accent)' }}>
            Strongly Disagree
          </span>
        </div>

        {/* Circles in the middle */}
        <div className="likert-row">
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

        {/* Strongly Agree - Right */}
        <div className="likert-label-container" style={{ textAlign: 'left' }}>
          <span className="likert-label" style={{ color: 'var(--color-success)' }}>
            Strongly Agree
          </span>
        </div>
      </div>

      <p className="text-center mt-12" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontStyle: 'italic', opacity: 0.7 }}>
        Tip: Be as honest as possible for the most accurate spectral signature.
      </p>
    </div>
  )
}
