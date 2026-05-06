/**
 * Application-wide constants.
 * All magic numbers live here — no inline literals in business logic.
 */

/** Maximum Euclidean distance possible in 4-dimensional [0,100] score space */
export const MAX_DISTANCE = Math.sqrt(4 * 100 * 100) // ≈ 200

/** Bonus points added when two types appear in each other's compatibility_map */
export const MAP_BONUS = 10

/** Total number of questions in the MBTI test */
export const TOTAL_QUESTIONS = 60

/** Questions per personality dimension (EI, SN, TF, JP) */
export const QUESTIONS_PER_DIMENSION = 15

/** Minimum raw score on a single question (Likert scale) */
export const MIN_RAW_SCORE = 1

/** Maximum raw score on a single question (Likert scale) */
export const MAX_RAW_SCORE = 7

/** Number of points on the Likert scale */
export const LIKERT_RANGE = MAX_RAW_SCORE - MIN_RAW_SCORE // = 6

/** Minimum normalized dimension score (0–100) */
export const MIN_NORMALIZED = 0

/** Maximum normalized dimension score (0–100) */
export const MAX_NORMALIZED = 100

/** Threshold score below which a type letter is the "low pole" */
export const TYPE_THRESHOLD = 50

/** Intensity bands (exclusive upper bound, except last) */
export const INTENSITY_BANDS = {
  SLIGHT: { min: 0, max: 25 },
  MODERATE: { min: 25, max: 50 },
  STRONG: { min: 50, max: 75 },
  VERY_STRONG: { min: 75, max: 101 },
} as const

export type IntensityBand = keyof typeof INTENSITY_BANDS

/** MBTI dimension definitions */
export const DIMENSIONS = ['EI', 'SN', 'TF', 'JP'] as const
export type Dimension = (typeof DIMENSIONS)[number]

/** Low and high pole labels for each dimension */
export const DIMENSION_POLES: Record<Dimension, { low: string; high: string }> = {
  EI: { low: 'Introvert', high: 'Extrovert' },
  SN: { low: 'Sensing', high: 'Intuitive' },
  TF: { low: 'Thinking', high: 'Feeling' },
  JP: { low: 'Judging', high: 'Perceiving' },
}

/** All 16 valid MBTI type codes */
export const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ',
] as const
export type MbtiType = (typeof MBTI_TYPES)[number]

/** Current personality profile schema version */
export const SCHEMA_VERSION = 1

/** Dating Questionnaire Options */
export const GENDER_OPTIONS = ['Man', 'Woman', 'Non-binary', 'Genderfluid', 'Agender', 'Prefer not to say', 'Other']
export const SEXUALITY_OPTIONS = ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual', 'Asexual', 'Queer', 'Prefer not to say', 'Other']
export const LOOKING_FOR_OPTIONS = ['Long-term relationship', 'Something casual', 'Friendship', 'Not sure yet', 'Open to anything']
