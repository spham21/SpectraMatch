import {
  MIN_RAW_SCORE,
  LIKERT_RANGE,
  QUESTIONS_PER_DIMENSION,
  MIN_NORMALIZED,
  MAX_NORMALIZED,
  TYPE_THRESHOLD,
  INTENSITY_BANDS,
  DIMENSIONS,
  DIMENSION_POLES,
  type Dimension,
  type IntensityBand,
  type MbtiType,
} from '@/lib/constants'

/** Normalized scores for all four MBTI dimensions (0–100 each) */
export interface DimensionScores {
  EI: number
  SN: number
  TF: number
  JP: number
}

/**
 * Normalizes a raw array of Likert answers (1–7) for one dimension
 * into a 0–100 score.
 *
 * Formula: ((sum - min_possible) / (max_possible - min_possible)) * 100
 *
 * @param rawAnswers - Array of `QUESTIONS_PER_DIMENSION` integers in [1, 7]
 * @returns Normalized score in [0, 100]
 */
export function normalizeDimension(rawAnswers: number[]): number {
  if (rawAnswers.length !== QUESTIONS_PER_DIMENSION) {
    throw new Error(
      `Expected ${QUESTIONS_PER_DIMENSION} answers, got ${rawAnswers.length}`
    )
  }

  const sum = rawAnswers.reduce((acc, val) => acc + val, 0)
  const minPossible = MIN_RAW_SCORE * QUESTIONS_PER_DIMENSION
  const maxPossible = (MIN_RAW_SCORE + LIKERT_RANGE) * QUESTIONS_PER_DIMENSION

  const normalized = ((sum - minPossible) / (maxPossible - minPossible)) * MAX_NORMALIZED

  return Math.round(Math.max(MIN_NORMALIZED, Math.min(MAX_NORMALIZED, normalized)))
}

/**
 * Derives the 4-letter MBTI type string from normalized dimension scores.
 *
 * Each dimension: score >= TYPE_THRESHOLD → high pole letter, else low pole letter.
 *   EI: high=E, low=I
 *   SN: high=N, low=S
 *   TF: high=F, low=T
 *   JP: high=P, low=J
 *
 * @param scores - Normalized scores for all four dimensions
 * @returns 4-letter MBTI type string (e.g. "INFP")
 */
export function deriveTypeFromScores(scores: DimensionScores): MbtiType {
  const e = scores.EI >= TYPE_THRESHOLD ? 'E' : 'I'
  const n = scores.SN >= TYPE_THRESHOLD ? 'N' : 'S'
  const f = scores.TF >= TYPE_THRESHOLD ? 'F' : 'T'
  const p = scores.JP >= TYPE_THRESHOLD ? 'P' : 'J'

  return `${e}${n}${f}${p}` as MbtiType
}

/**
 * Determines the intensity band of a single dimension score.
 *
 * Intensity is measured by distance from 50 (the center):
 *   distance = |score - 50|
 *   0–24  → SLIGHT
 *   25–49 → MODERATE
 *   50–74 → STRONG
 *   75–100 → VERY_STRONG
 *
 * @param score - Normalized dimension score in [0, 100]
 * @returns Intensity band label
 */
export function scoreIntensity(score: number): IntensityBand {
  const distance = Math.abs(score - TYPE_THRESHOLD)

  const bands = Object.entries(INTENSITY_BANDS) as [
    IntensityBand,
    { min: number; max: number }
  ][]

  for (const [band, { min, max }] of bands) {
    if (distance >= min && distance < max) {
      return band
    }
  }

  // Fallback — should never reach here with valid input
  return 'VERY_STRONG'
}

/**
 * Returns the readable label for a dimension's active pole.
 * @param dimension - The MBTI dimension
 * @param score - Normalized score (0–100)
 * @returns Human-readable pole label (e.g. "Introvert" or "Extrovert")
 */
  return score >= TYPE_THRESHOLD ? DIMENSION_POLES[dimension].high : DIMENSION_POLES[dimension].low
}
