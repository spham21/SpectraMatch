/**
 * localUser.ts
 * -----------
 * Manages a lightweight anonymous user stored entirely in localStorage.
 * Replaces Supabase auth during beta — no sign-in required.
 */

const KEY_USER_ID = 'sm_user_id'
const KEY_DATING_PROFILE = 'sm_dating_profile'
const KEY_PERSONALITY_RESULTS = 'sm_personality_results'

/** Shape of the dating questionnaire answers */
export interface DatingProfile {
  name: string
  age: number | ''
  gender: string
  sexuality: string
  lookingFor: string
  bio: string
  completedAt: string
}

/** Shape of cached personality results */
export interface PersonalityResults {
  mbtiType: string
  eiScore: number
  snScore: number
  tfScore: number
  jpScore: number
  personalityExcerpt: string
  compatibilityExcerpt: string
  compatibleTypes: string[]
  compatibilityRationale: string
  createdAt: string
}

/**
 * Returns a stable anonymous user ID for this device.
 * Creates one on first call and persists it in localStorage.
 */
export function getLocalUserId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = localStorage.getItem(KEY_USER_ID)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY_USER_ID, id)
  }
  return id
}

/**
 * Saves the user's completed dating profile to localStorage.
 * @param profile - The completed questionnaire answers
 */
export function saveDatingProfile(profile: DatingProfile): void {
  localStorage.setItem(KEY_DATING_PROFILE, JSON.stringify(profile))
}

/**
 * Retrieves the saved dating profile, or null if not set.
 */
export function getDatingProfile(): DatingProfile | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY_DATING_PROFILE)
  if (!raw) return null
  try {
    return JSON.parse(raw) as DatingProfile
  } catch {
    return null
  }
}

/**
 * Saves personality test results to localStorage.
 * @param results - The scoring output from the test
 */
export function savePersonalityResults(results: PersonalityResults): void {
  localStorage.setItem(KEY_PERSONALITY_RESULTS, JSON.stringify(results))
}

/**
 * Retrieves cached personality test results, or null if none.
 */
export function getPersonalityResults(): PersonalityResults | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY_PERSONALITY_RESULTS)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PersonalityResults
  } catch {
    return null
  }
}

/**
 * Returns true if the dating questionnaire has been filled out.
 */
export function hasDatingProfile(): boolean {
  return getDatingProfile() !== null
}
