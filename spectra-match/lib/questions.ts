import type { Dimension } from '@/lib/constants'

/** A single test question */
export interface Question {
  /** Unique question identifier (e.g. "EI-01") */
  id: string
  /** Which MBTI dimension this question measures */
  dimension: Dimension
  /** The question text shown to the user */
  text: string
  /** Label for the low-score pole (score = 1) */
  lowPole: string
  /** Label for the high-score pole (score = 7) */
  highPole: string
}

/** Raw question bank — 60 questions total, 15 per dimension */
export const QUESTION_BANK: Question[] = [
  // ── EI dimension (Introvert ↔ Extrovert) ──────────────────────────────
  { id: 'EI-01', dimension: 'EI', text: 'At a party, you feel energized by talking to many different people.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-02', dimension: 'EI', text: 'You prefer spending your free time with a group rather than alone.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-03', dimension: 'EI', text: 'You find it easy to introduce yourself to strangers.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-04', dimension: 'EI', text: 'You often initiate conversations rather than waiting for others.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-05', dimension: 'EI', text: 'A quiet evening at home feels less satisfying than going out.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-06', dimension: 'EI', text: 'You recharge your energy through social interactions.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-07', dimension: 'EI', text: 'You enjoy being the center of attention in group settings.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-08', dimension: 'EI', text: 'You feel comfortable speaking in front of large audiences.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-09', dimension: 'EI', text: 'You tend to think out loud rather than reflect internally.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-10', dimension: 'EI', text: 'You have a wide circle of friends and acquaintances.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-11', dimension: 'EI', text: 'You prefer collaborative work over working alone.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-12', dimension: 'EI', text: 'Social situations rarely drain your energy.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-13', dimension: 'EI', text: 'You get excited about meeting new people.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-14', dimension: 'EI', text: 'You express your feelings and thoughts freely to others.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'EI-15', dimension: 'EI', text: 'You would rather work in a busy open office than in a private room.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },

  // ── SN dimension (Sensing ↔ Intuitive) ───────────────────────────────
  { id: 'SN-01', dimension: 'SN', text: 'You prefer focusing on possibilities and future implications over concrete facts.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-02', dimension: 'SN', text: 'You enjoy exploring abstract theories and concepts.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-03', dimension: 'SN', text: 'You often notice patterns and connections others miss.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-04', dimension: 'SN', text: 'You trust hunches and gut feelings more than step-by-step instructions.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-05', dimension: 'SN', text: 'You prefer reading between the lines over taking information at face value.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-06', dimension: 'SN', text: 'You are more interested in what could be than what is.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-07', dimension: 'SN', text: 'Imagining future scenarios excites you more than reviewing past events.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-08', dimension: 'SN', text: 'You often come up with original and unconventional ideas.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-09', dimension: 'SN', text: 'You prefer metaphors and analogies over literal descriptions.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-10', dimension: 'SN', text: 'You find routine and standard procedures uninspiring.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-11', dimension: 'SN', text: 'You often think about the big picture rather than details.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-12', dimension: 'SN', text: 'You are drawn to creative and imaginative work.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-13', dimension: 'SN', text: 'You rely on inspiration more than experience when solving problems.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-14', dimension: 'SN', text: 'You prefer ambiguous, open-ended tasks to concrete, defined ones.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'SN-15', dimension: 'SN', text: 'You enjoy philosophical discussions more than practical how-to guides.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },

  // ── TF dimension (Thinking ↔ Feeling) ────────────────────────────────
  { id: 'TF-01', dimension: 'TF', text: 'When making decisions, you prioritize others\' feelings over cold logic.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-02', dimension: 'TF', text: 'You believe harmony in a group is more important than being right.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-03', dimension: 'TF', text: 'You are moved by stories of personal hardship and empathize easily.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-04', dimension: 'TF', text: 'You often take into account how a decision will affect relationships.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-05', dimension: 'TF', text: 'You prefer to give encouragement rather than critical feedback.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-06', dimension: 'TF', text: 'You find it easy to understand and share the feelings of others.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-07', dimension: 'TF', text: 'Your personal values guide your decisions more than rules or policies.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-08', dimension: 'TF', text: 'You avoid confrontation because you dislike causing emotional discomfort.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-09', dimension: 'TF', text: 'You prioritize emotional well-being over task efficiency.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-10', dimension: 'TF', text: 'You care deeply about whether your work aligns with your values.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-11', dimension: 'TF', text: 'Complimenting others comes naturally and frequently to you.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-12', dimension: 'TF', text: 'You are often described as warm, caring, or compassionate.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-13', dimension: 'TF', text: 'You feel a deep sense of loyalty to people you are close to.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-14', dimension: 'TF', text: 'A good argument should consider everyone\'s needs, not just the facts.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'TF-15', dimension: 'TF', text: 'You find emotional language more persuasive than statistics.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },

  // ── JP dimension (Judging ↔ Perceiving) ──────────────────────────────
  { id: 'JP-01', dimension: 'JP', text: 'You prefer to keep your options open rather than commit to a plan.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-02', dimension: 'JP', text: 'You are comfortable leaving tasks unfinished and returning to them later.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-03', dimension: 'JP', text: 'You enjoy spontaneous plans more than scheduled ones.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-04', dimension: 'JP', text: 'You adapt easily when circumstances change unexpectedly.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-05', dimension: 'JP', text: 'You prefer flexible work with variety over structured routines.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-06', dimension: 'JP', text: 'You often make decisions based on how you feel in the moment.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-07', dimension: 'JP', text: 'You find rigid schedules and strict deadlines stressful or limiting.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-08', dimension: 'JP', text: 'You prefer to gather more information before making a final decision.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-09', dimension: 'JP', text: 'You enjoy going with the flow rather than following a detailed plan.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-10', dimension: 'JP', text: 'You often start projects before fully planning them out.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-11', dimension: 'JP', text: 'Unexpected detours in your day feel exciting rather than frustrating.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-12', dimension: 'JP', text: 'You prefer exploring multiple approaches rather than committing to one.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-13', dimension: 'JP', text: 'You often wait until the last minute when making choices.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-14', dimension: 'JP', text: 'You enjoy the process of doing things more than finishing them.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
  { id: 'JP-15', dimension: 'JP', text: 'You feel that strict organization limits your creativity.', lowPole: 'Strongly disagree', highPole: 'Strongly agree' },
]

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * Returns the same (mutated) array for convenience.
 *
 * @param array - Array to shuffle
 * @returns The shuffled array (same reference)
 */
export function shuffleQuestions<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 * Returns a shuffled copy of the full question bank.
 * Keeps dimension grouping intact internally but randomizes presentation order.
 *
 * @returns Shuffled array of all 60 questions
 */
export function getShuffledQuestions(): Question[] {
  return shuffleQuestions([...QUESTION_BANK])
}
