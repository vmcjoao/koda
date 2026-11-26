/** Soft rank line from accuracy — copy only, no economy. */
export function scoreRank(score: number): { label: string; blurb: string } {
  if (score >= 90) return { label: 'Perfect', blurb: 'Pattern locked in.' };
  if (score >= 75) return { label: 'Strong', blurb: 'Solid read — keep the edge sharp.' };
  if (score >= 55) return { label: 'Clear', blurb: 'Cleared — tighten the weak tags next.' };
  if (score >= 35) return { label: 'Struggle', blurb: 'Partial credit — review the editorial.' };
  return { label: 'Miss', blurb: 'Reset and try the tags again cold.' };
}
