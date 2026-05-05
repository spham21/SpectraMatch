import { type DatingProfile } from './localUser'
import { MBTI_TYPES, type MbtiType } from './constants'

/** Simulated user in the database */
export interface MockUser {
  userId: string
  displayName: string
  age: number
  gender: string
  sexuality: string
  mbtiType: MbtiType
  bio: string
  avatarUrl: string | null
  compatibilityScore?: number
}

const GENDERS = ['Man', 'Woman', 'Non-binary']
const NAMES = {
  Man: ['James', 'Liam', 'Noah', 'Ethan', 'Oliver', 'Lucas', 'Mason', 'Logan', 'Alexander', 'Sebastian'],
  Woman: ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn'],
  'Non-binary': ['Alex', 'Jordan', 'Charlie', 'Riley', 'Casey', 'Quinn', 'Sage', 'Skyler', 'Taylor', 'Avery']
}

const BIOS = [
  "Adventure seeker and coffee enthusiast. ☕️",
  "Always looking for the next great book to read. 📚",
  "Tech lover and part-time hiker. 🏔️",
  "Passionate about art and good conversations.",
  "Introverted soul with a love for live music. 🎸",
  "Believer in kindness and spectral alignment.",
  "Digital nomad currently exploring the world.",
  "Dog person who loves a good sunset walk. 🐕",
  "Amateur chef and trivia night regular.",
  "Looking for someone to share good vibes with."
]

/**
 * Generates a stable set of mock users.
 * @param count - Number of users to generate
 * @returns Array of mock users
 */
export function generateMockUsers(count: number = 50): MockUser[] {
  const users: MockUser[] = []
  
  for (let i = 0; i < count; i++) {
    const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)]
    const namePool = NAMES[gender as keyof typeof NAMES] || NAMES['Non-binary']
    const name = namePool[Math.floor(Math.random() * namePool.length)]
    
    // Distribute sexualities somewhat realistically for a dating app simulation
    const rand = Math.random()
    let sexuality = 'Straight'
    if (rand > 0.85) sexuality = 'Bisexual'
    else if (rand > 0.7) sexuality = 'Gay' // Simplification for mock
    
    users.push({
      userId: `mock-${i}`,
      displayName: `${name} ${String.fromCharCode(65 + (i % 26))}.`,
      age: Math.floor(Math.random() * (45 - 20 + 1)) + 20,
      gender,
      sexuality,
      mbtiType: MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)],
      bio: BIOS[Math.floor(Math.random() * BIOS.length)],
      avatarUrl: null
    })
  }
  
  return users
}

/**
 * Filters mock users based on the current user's preferences.
 * Logic:
 * - Straight Man -> Woman (Straight/Bisexual)
 * - Straight Woman -> Man (Straight/Bisexual)
 * - Gay Man -> Man (Gay/Bisexual)
 * - Lesbian Woman -> Woman (Gay/Bisexual)
 * - Bisexual -> Any gender with compatible sexuality
 * 
 * @param currentUser - The profile of the person searching
 * @param allUsers - The list of potential matches
 * @returns Filtered and relevant matches
 */
export function filterMatches(currentUser: DatingProfile, allUsers: MockUser[]): MockUser[] {
  return allUsers.filter(user => {
    // Basic sexuality/gender logic
    const { gender: myGender, sexuality: mySexuality } = currentUser
    const { gender: theirGender, sexuality: theirSexuality } = user

    // Don't match with self
    if (user.userId === 'current-user') return false

    // Simple rule-based filtering
    if (mySexuality === 'Straight') {
      if (myGender === 'Man') return theirGender === 'Woman' && (theirSexuality === 'Straight' || theirSexuality === 'Bisexual')
      if (myGender === 'Woman') return theirGender === 'Man' && (theirSexuality === 'Straight' || theirSexuality === 'Bisexual')
    }

    if (mySexuality === 'Gay' || mySexuality === 'Lesbian') {
      return theirGender === myGender && (theirSexuality === 'Gay' || theirSexuality === 'Lesbian' || theirSexuality === 'Bisexual')
    }

    if (mySexuality === 'Bisexual' || mySexuality === 'Pansexual') {
      // Bisexuals are open to most, but their match must also be compatible
      if (theirSexuality === 'Straight') {
        return (myGender === 'Man' && theirGender === 'Woman') || (myGender === 'Woman' && theirGender === 'Man')
      }
      if (theirSexuality === 'Gay' || theirSexuality === 'Lesbian') {
        return theirGender === myGender
      }
      return true // Both are bi/pan
    }

    return true // Default for other categories to keep it inclusive
  })
}
