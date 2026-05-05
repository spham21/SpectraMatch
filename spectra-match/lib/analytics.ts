// @ts-nocheck
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

/** All supported analytics event names */
export type AnalyticsEventName =
  | 'test_started'
  | 'question_answered'
  | 'test_submitted'
  | 'results_viewed'
  | 'match_feed_viewed'
  | 'excerpt_feedback_submitted'

/** Generic analytics event payload */
export interface AnalyticsEvent {
  name: AnalyticsEventName
  properties?: Record<string, unknown>
}

/**
 * Tracks an analytics event by inserting into the `analytics_events` table.
 * Fails silently to avoid disrupting the user flow.
 *
 * @param name - The event name
 * @param properties - Optional key-value metadata
 */
export async function trackEvent(
  name: AnalyticsEventName,
  properties?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = createSupabaseBrowserClient()
    await supabase.from('analytics_events').insert({
      event_name: name,
      properties: properties ?? {},
    })
  } catch {
    // Analytics should never crash the app
  }
}

/**
 * Tracks the user starting the personality test.
 * @param sessionId - Unique session ID for this test run
 */
export function trackTestStarted(sessionId: string): Promise<void> {
  return trackEvent('test_started', { sessionId })
}

/**
 * Tracks a single question being answered.
 * @param questionId - The question's unique ID
 * @param score - The Likert score (1–7)
 * @param questionIndex - 0-indexed position in the shuffled order
 */
export function trackQuestionAnswered(
  questionId: string,
  score: number,
  questionIndex: number
): Promise<void> {
  return trackEvent('question_answered', { questionId, score, questionIndex })
}

/**
 * Tracks the test being submitted to the edge function.
 * @param sessionId - Unique session ID for this test run
 */
export function trackTestSubmitted(sessionId: string): Promise<void> {
  return trackEvent('test_submitted', { sessionId })
}

/**
 * Tracks the results screen being viewed.
 * @param mbtiType - The derived MBTI type
 */
export function trackResultsViewed(mbtiType: string): Promise<void> {
  return trackEvent('results_viewed', { mbtiType })
}

/**
 * Tracks feedback on a personality excerpt (thumbs up/down).
 * @param profileId - The personality_profile UUID
 * @param isPositive - true = thumbs up, false = thumbs down
 */
export function trackExcerptFeedback(
  profileId: string,
  isPositive: boolean
): Promise<void> {
  return trackEvent('excerpt_feedback_submitted', { profileId, isPositive })
}
