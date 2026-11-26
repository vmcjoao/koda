import { lessonLinksForTags, type LessonTagLink } from '@/lib/learn';
import type {
  ProblemWithApproaches,
  ScoreBreakdown,
  SolutionApproach,
  UserAttempt,
} from '@/types/database';

export type DrillAxis = 'paradigm' | 'algorithm' | 'structures' | 'twist';

export type DrillLessonRec = LessonTagLink & {
  why: string;
  axis: DrillAxis;
};

export type DrillProblemRec = {
  problem: ProblemWithApproaches;
  why: string;
  overlap: number;
};

export type DrillNextPlan = {
  headline: string;
  focusReason: string;
  weakAxis: DrillAxis | null;
  lessons: DrillLessonRec[];
  practice: DrillProblemRec[];
};

const AXIS_LABEL: Record<DrillAxis, string> = {
  paradigm: 'Paradigm',
  algorithm: 'Algorithm',
  structures: 'Structures',
  twist: 'Twist',
};

function axisScores(breakdown: ScoreBreakdown): { axis: DrillAxis; score: number }[] {
  return [
    { axis: 'paradigm', score: breakdown.paradigmScore },
    { axis: 'algorithm', score: breakdown.algorithmScore },
    { axis: 'structures', score: breakdown.dsScore },
    { axis: 'twist', score: breakdown.twistScore },
  ];
}

function tagOverlap(a: SolutionApproach, b: SolutionApproach): number {
  const setA = new Set(
    [...a.paradigms, ...a.algorithms, ...a.data_structures].map((x) => x.toLowerCase()),
  );
  let hit = 0;
  for (const t of [...b.paradigms, ...b.algorithms, ...b.data_structures]) {
    if (setA.has(t.toLowerCase())) hit++;
  }
  return hit;
}

/**
 * Post-reveal coaching: weakest score axis → Learn lessons, then similar catalog problems.
 */
export function buildDrillNextPlan(input: {
  breakdown: ScoreBreakdown;
  currentProblemId: string;
  catalog: ProblemWithApproaches[];
  attempts?: UserAttempt[];
  ratingBand?: number;
  limitLessons?: number;
  limitPractice?: number;
}): DrillNextPlan {
  const {
    breakdown,
    currentProblemId,
    catalog,
    attempts = [],
    ratingBand = 1200,
    limitLessons = 3,
    limitPractice = 3,
  } = input;

  const approach = breakdown.matchedApproach;
  const axes = axisScores(breakdown).sort((a, b) => a.score - b.score);
  const weakest = axes[0]!;
  const weakAxis = weakest.score < 0.72 ? weakest.axis : null;

  const links = approach
    ? lessonLinksForTags({
        paradigms: approach.paradigms,
        algorithms: approach.algorithms,
        data_structures: approach.data_structures,
      })
    : [];

  const lessons: DrillLessonRec[] = [];
  const pushLesson = (link: LessonTagLink, axis: DrillAxis, why: string) => {
    if (lessons.some((l) => l.lesson.id === link.lesson.id)) return;
    lessons.push({ ...link, axis, why });
  };

  if (approach && weakAxis) {
    if (weakAxis === 'paradigm') {
      for (const label of approach.paradigms) {
        const link = links.find((l) => l.kind === 'paradigm' && l.label === label);
        if (link) {
          pushLesson(
            link,
            'paradigm',
            `Paradigm scored ${Math.round(breakdown.paradigmScore * 100)}% — drill this idea`,
          );
        }
      }
    } else if (weakAxis === 'algorithm') {
      for (const label of approach.algorithms) {
        const link = links.find((l) => l.kind === 'algorithm' && l.label === label);
        if (link) {
          pushLesson(
            link,
            'algorithm',
            `Algorithm scored ${Math.round(breakdown.algorithmScore * 100)}% — work the technique`,
          );
        }
      }
    } else if (weakAxis === 'structures') {
      for (const label of approach.data_structures) {
        const link = links.find((l) => l.kind === 'data_structure' && l.label === label);
        if (link) {
          pushLesson(
            link,
            'structures',
            `Structures scored ${Math.round(breakdown.dsScore * 100)}% — solidify the DS`,
          );
        }
      }
    } else {
      // Twist weak → still send to algorithm/paradigm lessons that encode the insight
      for (const link of links) {
        pushLesson(
          link,
          'twist',
          `Twist scored ${Math.round(breakdown.twistScore * 100)}% — revisit the catch in Learn`,
        );
      }
    }
  }

  // Fill remaining with any linked lessons (reinforce / lock-in)
  for (const link of links) {
    if (lessons.length >= limitLessons) break;
    pushLesson(
      link,
      weakAxis ?? 'algorithm',
      weakAxis
        ? 'Related lesson for this approach'
        : 'Strong read — lock it in with a short Learn pass',
    );
  }

  const attempted = new Set(attempts.map((a) => a.problem_id));
  const practice: DrillProblemRec[] = [];

  if (approach) {
    const scored = catalog
      .filter((p) => p.id !== currentProblemId)
      .map((p) => {
        let best = 0;
        for (const a of p.approaches) best = Math.max(best, tagOverlap(approach, a));
        const dist = Math.abs(p.difficulty_rating - ratingBand);
        return { problem: p, overlap: best, dist };
      })
      .filter((x) => x.overlap > 0)
      .sort((a, b) => {
        const aTried = attempted.has(a.problem.id) ? 1 : 0;
        const bTried = attempted.has(b.problem.id) ? 1 : 0;
        if (aTried !== bTried) return aTried - bTried;
        if (b.overlap !== a.overlap) return b.overlap - a.overlap;
        return a.dist - b.dist;
      });

    for (const row of scored.slice(0, limitPractice)) {
      practice.push({
        problem: row.problem,
        overlap: row.overlap,
        why: attempted.has(row.problem.id)
          ? `Similar tags · band ${row.problem.difficulty_rating} · already attempted`
          : `Similar tags · band ${row.problem.difficulty_rating} · fresh`,
      });
    }
  }

  const focusReason = weakAxis
    ? `Weakest axis: ${AXIS_LABEL[weakAxis]} (${Math.round(weakest.score * 100)}%)`
    : breakdown.mistakeTypes.length
      ? `Miss flags: ${breakdown.mistakeTypes.slice(0, 2).join(', ')}`
      : 'Axes look solid — reinforce with a similar problem';

  const headline = weakAxis
    ? `Drill next · ${AXIS_LABEL[weakAxis]}`
    : 'Drill next · lock it in';

  return {
    headline,
    focusReason,
    weakAxis,
    lessons: lessons.slice(0, limitLessons),
    practice,
  };
}
