import { describe, it, expect } from 'vitest'
import { computeCompatibilityScore } from '@/lib/compatibility'
import type { DimensionScores } from '@/lib/scoring'
import { MAP_BONUS, MAX_NORMALIZED } from '@/lib/constants'

describe('computeCompatibilityScore', () => {
  it('returns ~100 for identical profiles without map bonus', () => {
    const scores: DimensionScores = { EI: 50, SN: 50, TF: 50, JP: 50 }
    const result = computeCompatibilityScore({
      scoresA: scores,
      scoresB: scores,
      isInCompatibilityMap: false,
    })
    expect(result).toBe(100)
  })

  it('applies MAP_BONUS when isInCompatibilityMap is true for identical profiles (capped at 100)', () => {
    const scores: DimensionScores = { EI: 50, SN: 50, TF: 50, JP: 50 }
    const result = computeCompatibilityScore({
      scoresA: scores,
      scoresB: scores,
      isInCompatibilityMap: true,
    })
    // 100 + MAP_BONUS capped at 100
    expect(result).toBe(MAX_NORMALIZED)
  })

  it('returns a lower score for maximally different profiles', () => {
    const scoresA: DimensionScores = { EI: 0, SN: 0, TF: 0, JP: 0 }
    const scoresB: DimensionScores = { EI: 100, SN: 100, TF: 100, JP: 100 }
    const result = computeCompatibilityScore({
      scoresA,
      scoresB,
      isInCompatibilityMap: false,
    })
    expect(result).toBeLessThan(10)
  })

  it('adds MAP_BONUS correctly when base is not near 100', () => {
    const scoresA: DimensionScores = { EI: 30, SN: 30, TF: 30, JP: 30 }
    const scoresB: DimensionScores = { EI: 70, SN: 70, TF: 70, JP: 70 }
    const withoutBonus = computeCompatibilityScore({
      scoresA,
      scoresB,
      isInCompatibilityMap: false,
    })
    const withBonus = computeCompatibilityScore({
      scoresA,
      scoresB,
      isInCompatibilityMap: true,
    })
    expect(withBonus - withoutBonus).toBe(MAP_BONUS)
  })

  it('score is always clamped to [0, 100]', () => {
    const scoresA: DimensionScores = { EI: 0, SN: 0, TF: 0, JP: 0 }
    const scoresB: DimensionScores = { EI: 100, SN: 100, TF: 100, JP: 100 }
    const result = computeCompatibilityScore({
      scoresA,
      scoresB,
      isInCompatibilityMap: true,
    })
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(100)
  })

  it('returns the same score regardless of A/B order (symmetric)', () => {
    const scoresA: DimensionScores = { EI: 60, SN: 40, TF: 75, JP: 30 }
    const scoresB: DimensionScores = { EI: 80, SN: 20, TF: 55, JP: 90 }
    const ab = computeCompatibilityScore({ scoresA, scoresB, isInCompatibilityMap: false })
    const ba = computeCompatibilityScore({ scoresA: scoresB, scoresB: scoresA, isInCompatibilityMap: false })
    expect(ab).toBe(ba)
  })
})
