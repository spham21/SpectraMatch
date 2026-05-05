import { MAX_DISTANCE, MAP_BONUS, MAX_NORMALIZED } from '@/lib/constants'
import type { DimensionScores } from '@/lib/scoring'

/**
 * Computes Euclidean distance between two 4-dimensional score vectors.
 * Private helper — not exported.
 *
 * @param a - First profile's dimension scores
 * @param b - Second profile's dimension scores
 * @returns Euclidean distance
 */
function euclideanDistance(a: DimensionScores, b: DimensionScores): number {
  const dEI = a.EI - b.EI
  const dSN = a.SN - b.SN
  const dTF = a.TF - b.TF
  const dJP = a.JP - b.JP

  return Math.sqrt(dEI ** 2 + dSN ** 2 + dTF ** 2 + dJP ** 2)
}

/** Input shape for compatibility computation */
export interface CompatibilityInput {
  /** Dimension scores for user A */
  scoresA: DimensionScores
  /** Dimension scores for user B */
  scoresB: DimensionScores
  /** Whether the types appear in each other's compatibility_map (triggers bonus) */
  isInCompatibilityMap: boolean
}

/**
 * Computes a 0–100 compatibility score between two personality profiles.
 *
 * Algorithm:
 *   1. Compute Euclidean distance between the two score vectors (max ≈ 200)
 *   2. Convert to proximity: base = (1 - distance / MAX_DISTANCE) * 100
 *   3. If isInCompatibilityMap, add MAP_BONUS points
 *   4. Clamp to [0, 100]
 *
 * @param input - The two profiles and compatibility map flag
 * @returns Final compatibility score in [0, 100]
 */
export function computeCompatibilityScore(input: CompatibilityInput): number {
  const { scoresA, scoresB, isInCompatibilityMap } = input

  const distance = euclideanDistance(scoresA, scoresB)
  const base = (1 - distance / MAX_DISTANCE) * MAX_NORMALIZED
  const withBonus = isInCompatibilityMap ? base + MAP_BONUS : base

  return Math.round(Math.max(0, Math.min(MAX_NORMALIZED, withBonus)))
}
