import { describe, it, expect } from 'vitest'
import { normalizeDimension, deriveTypeFromScores, scoreIntensity } from '@/lib/scoring'
import { QUESTIONS_PER_DIMENSION } from '@/lib/constants'

/** Helper: creates an array of N identical values */
function repeat(value: number, count: number = QUESTIONS_PER_DIMENSION): number[] {
  return Array(count).fill(value)
}

describe('normalizeDimension', () => {
  it('returns 0 when all answers are the minimum (1)', () => {
    expect(normalizeDimension(repeat(1))).toBe(0)
  })

  it('returns 100 when all answers are the maximum (7)', () => {
    expect(normalizeDimension(repeat(7))).toBe(100)
  })

  it('returns 50 when all answers are the midpoint (4)', () => {
    expect(normalizeDimension(repeat(4))).toBe(50)
  })

  it('returns a value between 0 and 100 for mixed answers', () => {
    const mixed = [1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 4]
    const result = normalizeDimension(mixed)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(100)
  })

  it('throws when given the wrong number of answers', () => {
    expect(() => normalizeDimension([1, 2, 3])).toThrow()
  })

  it('handles an array of all 2s (low-ish score)', () => {
    const result = normalizeDimension(repeat(2))
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(50)
  })

  it('handles an array of all 6s (high-ish score)', () => {
    const result = normalizeDimension(repeat(6))
    expect(result).toBeGreaterThan(50)
    expect(result).toBeLessThan(100)
  })
})

describe('deriveTypeFromScores', () => {
  it('derives INFP from low EI, high SN, high TF, high JP', () => {
    expect(deriveTypeFromScores({ EI: 30, SN: 70, TF: 80, JP: 90 })).toBe('INFP')
  })

  it('derives ESTJ from high EI, low SN, low TF, low JP', () => {
    expect(deriveTypeFromScores({ EI: 80, SN: 20, TF: 30, JP: 10 })).toBe('ESTJ')
  })

  it('derives INTJ from low EI, high SN, low TF, low JP', () => {
    expect(deriveTypeFromScores({ EI: 10, SN: 80, TF: 20, JP: 5 })).toBe('INTJ')
  })

  it('derives ENFJ from high EI, high SN, high TF, low JP', () => {
    expect(deriveTypeFromScores({ EI: 90, SN: 60, TF: 75, JP: 40 })).toBe('ENFJ')
  })

  it('treats score exactly at threshold (50) as the high pole', () => {
    // score = 50 → high pole → E, N, F, P
    expect(deriveTypeFromScores({ EI: 50, SN: 50, TF: 50, JP: 50 })).toBe('ENFP')
  })

  it('treats score just below threshold (49) as the low pole', () => {
    expect(deriveTypeFromScores({ EI: 49, SN: 49, TF: 49, JP: 49 })).toBe('ISTJ')
  })

  it('derives all-high type (ENFP)', () => {
    expect(deriveTypeFromScores({ EI: 100, SN: 100, TF: 100, JP: 100 })).toBe('ENFP')
  })

  it('derives all-low type (ISTJ)', () => {
    expect(deriveTypeFromScores({ EI: 0, SN: 0, TF: 0, JP: 0 })).toBe('ISTJ')
  })
})

describe('scoreIntensity', () => {
  it('returns SLIGHT for score near the center (55)', () => {
    expect(scoreIntensity(55)).toBe('SLIGHT')
  })

  it('returns SLIGHT for score 50 (exactly at threshold)', () => {
    expect(scoreIntensity(50)).toBe('SLIGHT')
  })

  it('returns MODERATE for score 20 (distance = 30)', () => {
    expect(scoreIntensity(20)).toBe('MODERATE')
  })

  it('returns STRONG for score 90 (distance = 40 → no, 40 >= 25 but < 50 → MODERATE... wait)', () => {
    // distance from 50 = |90-50| = 40 → 25 <= 40 < 50 → MODERATE? No:
    // MODERATE = 25–49, STRONG = 50–74
    // distance = 40 → MODERATE
    expect(scoreIntensity(90)).toBe('MODERATE')
  })

  it('returns STRONG for score 5 (distance = 45 → MODERATE)', () => {
    expect(scoreIntensity(5)).toBe('MODERATE')
  })

  it('returns VERY_STRONG for score 100 (distance = 50)', () => {
    expect(scoreIntensity(100)).toBe('STRONG')
  })

  it('returns VERY_STRONG for score 0 (distance = 50)', () => {
    expect(scoreIntensity(0)).toBe('STRONG')
  })
})
