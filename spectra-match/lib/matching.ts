import { type DatingProfile } from './localUser'

/**
 * Shared filtering logic for matches.
 * 
 * @param currentUser - The profile of the person searching
 * @param theirGender - Gender of the potential match
 * @param theirSexuality - Sexuality of the potential match
 * @returns boolean
 */
export function isMatchCompatible(
  currentUser: DatingProfile, 
  theirGender: string, 
  theirSexuality: string
): boolean {
  const { gender: myGender, sexuality: mySexuality } = currentUser

  // Simple rule-based filtering
  if (mySexuality === 'Straight') {
    if (myGender === 'Man') return theirGender === 'Woman' && (theirSexuality === 'Straight' || theirSexuality === 'Bisexual')
    if (myGender === 'Woman') return theirGender === 'Man' && (theirSexuality === 'Straight' || theirSexuality === 'Bisexual')
  }

  if (mySexuality === 'Gay' || mySexuality === 'Lesbian') {
    return theirGender === myGender && (theirSexuality === 'Gay' || theirSexuality === 'Lesbian' || theirSexuality === 'Bisexual')
  }

  if (mySexuality === 'Bisexual' || mySexuality === 'Pansexual') {
    if (theirSexuality === 'Straight') {
      return (myGender === 'Man' && theirGender === 'Woman') || (myGender === 'Woman' && theirGender === 'Man')
    }
    if (theirSexuality === 'Gay' || theirSexuality === 'Lesbian') {
      return theirGender === myGender
    }
    return true
  }

  return true // Inclusive default
}
