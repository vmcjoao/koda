import type { UserAttempt, UserProfile } from '../types/database';

const DEMO_USER_ID = 'demo-user';

/** Guest / offline attempts that still need a cloud upload. */
export function isPendingCloudAttempt(
  attempt: Pick<UserAttempt, 'id' | 'user_id'>,
  demoUserId = DEMO_USER_ID,
): boolean {
  return attempt.id.startsWith('local-') || attempt.user_id === demoUserId;
}

function laterDate(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return a >= b ? a : b;
}

/** Prefer the richer local XP profile when merging guest progress into a cloud account. */
export function mergeProfilesForSync(local: UserProfile, remote: UserProfile): UserProfile {
  const localWins = local.xp >= remote.xp;
  return {
    user_id: remote.user_id,
    display_name: remote.display_name ?? local.display_name,
    xp: Math.max(local.xp, remote.xp),
    streak: Math.max(local.streak, remote.streak),
    rating_band: localWins ? local.rating_band : remote.rating_band,
    last_active_date: laterDate(local.last_active_date, remote.last_active_date),
  };
}
