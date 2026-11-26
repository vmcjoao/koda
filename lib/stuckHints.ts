import { lessonLinksForTags, type LessonTagLink } from '@/lib/learn';
import type { ProblemWithApproaches, SolutionApproach } from '@/types/database';

export type StuckHintLevel = 0 | 1 | 2 | 3 | 4;

export type StuckHintStep = {
  level: StuckHintLevel;
  title: string;
  body: string;
};

/** Progressive coaching hints from the primary approach (no full editorial). */
export function stuckHintSteps(problem: ProblemWithApproaches): StuckHintStep[] {
  const approach = problem.approaches[0];
  if (!approach) {
    return [
      {
        level: 0,
        title: 'No approach on file',
        body: 'This problem has no tagged approach yet. Reveal will show whatever is available, then open Learn from related tags if any.',
      },
    ];
  }

  const steps: StuckHintStep[] = [
    {
      level: 0,
      title: 'Start here',
      body: 'Name the family of ideas before the algorithm. Wrong family → wrong rabbit hole.',
    },
  ];

  if (approach.paradigms.length) {
    steps.push({
      level: 1,
      title: 'Paradigm family',
      body: approach.paradigms.join(' · '),
    });
  }

  if (approach.algorithms.length) {
    steps.push({
      level: 2,
      title: 'Core algorithm',
      body: approach.algorithms.join(' · '),
    });
  }

  if (approach.data_structures.length) {
    steps.push({
      level: 3,
      title: 'Useful structures',
      body: approach.data_structures.join(' · '),
    });
  }

  if (approach.key_insights.length) {
    const clean = approach.key_insights.filter(
      (k) => !/auto-imported|replace this approach|origin:/i.test(k),
    );
    const insight = clean[0] ?? approach.key_insights[0];
    if (insight) {
      steps.push({
        level: 4,
        title: 'One twist',
        body: insight,
      });
    }
  }

  return steps;
}

export function stuckLearnLinks(approach: SolutionApproach | undefined): LessonTagLink[] {
  if (!approach) return [];
  return lessonLinksForTags({
    paradigms: approach.paradigms,
    algorithms: approach.algorithms,
    data_structures: approach.data_structures,
  }).slice(0, 4);
}
