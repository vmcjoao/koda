import type { HypothesisDraft, ScoreBreakdown, SolutionApproach } from '@/types/database';

function normalize(tags: string[]): Set<string> {
  return new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean));
}

/** Jaccard similarity of two tag sets (0–1). Empty expected → 1 if both empty, else 0. */
export function jaccard(selected: string[], expected: string[]): number {
  const a = normalize(selected);
  const b = normalize(expected);
  if (a.size === 0 && b.size === 0) return 1;
  if (b.size === 0) return a.size === 0 ? 1 : 0;
  if (a.size === 0) return 0;

  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

function scoreApproach(
  draft: Pick<
    HypothesisDraft,
    'paradigms' | 'algorithms' | 'dataStructures' | 'twists' | 'guessedComplexity' | 'complexityBonus'
  >,
  approach: SolutionApproach,
  targetComplexity: string,
): ScoreBreakdown {
  const paradigmScore = jaccard(draft.paradigms, approach.paradigms);
  const algorithmScore = jaccard(draft.algorithms, approach.algorithms);
  const dsScore = jaccard(draft.dataStructures, approach.data_structures);
  const twistScore = jaccard(draft.twists, approach.key_insights);

  // Weighted: twists and paradigms matter most for "Codeless CP"
  const base =
    paradigmScore * 0.3 + algorithmScore * 0.25 + dsScore * 0.2 + twistScore * 0.25;

  const complexityBonus =
    draft.complexityBonus ||
    (!!draft.guessedComplexity &&
      draft.guessedComplexity.trim().toLowerCase() === targetComplexity.trim().toLowerCase());

  let score = Math.round(base * 100);
  if (complexityBonus) {
    score = Math.min(100, score + 5);
  }

  const mistakeTypes: string[] = [];
  if (paradigmScore < 0.5) mistakeTypes.push('Wrong Paradigm');
  if (twistScore < 0.5 && approach.key_insights.length > 0) mistakeTypes.push('Missed Edge Case/Twist');
  if (!complexityBonus && draft.guessedComplexity) mistakeTypes.push('Missed Constraint/TLE');

  return {
    score,
    matchedApproach: approach,
    paradigmScore,
    algorithmScore,
    dsScore,
    twistScore,
    complexityBonus,
    mistakeTypes,
  };
}

/** Score draft against all approaches; return best match. */
export function scoreHypothesis(
  draft: Pick<
    HypothesisDraft,
    'paradigms' | 'algorithms' | 'dataStructures' | 'twists' | 'guessedComplexity' | 'complexityBonus'
  >,
  approaches: SolutionApproach[],
  targetComplexity: string,
): ScoreBreakdown {
  if (approaches.length === 0) {
    return {
      score: 0,
      matchedApproach: null,
      paradigmScore: 0,
      algorithmScore: 0,
      dsScore: 0,
      twistScore: 0,
      complexityBonus: false,
      mistakeTypes: ['Wrong Paradigm'],
    };
  }

  let best: ScoreBreakdown | null = null;
  for (const approach of approaches) {
    const result = scoreApproach(draft, approach, targetComplexity);
    if (!best || result.score > best.score) {
      best = result;
    }
  }
  return best!;
}

export function fuzzyMatch(query: string, label: string, aliases: string[] = []): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [label, ...aliases].join(' ').toLowerCase();
  return haystack.includes(q) || q.split(/\s+/).every((part) => haystack.includes(part));
}
