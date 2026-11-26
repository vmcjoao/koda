import assert from 'assert';
import { buildDrillNextPlan } from '../lib/drillNext';
import type { ProblemWithApproaches, ScoreBreakdown } from '../types/database';

const approach = {
  id: 'a1',
  problem_id: 'p1',
  approach_name: 'BFS layers',
  paradigms: ['Graph Algorithms'],
  algorithms: ['BFS'],
  data_structures: ['Queue'],
  key_insights: ['Multi-source BFS'],
  editorial_summary_md: 'Run BFS.',
};

const weak: ScoreBreakdown = {
  score: 40,
  matchedApproach: approach,
  paradigmScore: 0.8,
  algorithmScore: 0.2,
  dsScore: 0.7,
  twistScore: 0.6,
  complexityBonus: false,
  mistakeTypes: ['Wrong Paradigm'],
};

const catalog: ProblemWithApproaches[] = [
  {
    id: 'p1',
    title: 'Current',
    source: 'CSES',
    url: null,
    difficulty_rating: 1200,
    statement_md: 'x',
    constraints_text: '',
    sample_io: [],
    target_complexity: 'O(N)',
    approaches: [approach],
  },
  {
    id: 'p2',
    title: 'Sibling BFS',
    source: 'CSES',
    url: null,
    difficulty_rating: 1250,
    statement_md: 'y',
    constraints_text: '',
    sample_io: [],
    target_complexity: 'O(N)',
    approaches: [
      {
        ...approach,
        id: 'a2',
        problem_id: 'p2',
        approach_name: 'BFS escape',
      },
    ],
  },
];

const plan = buildDrillNextPlan({
  breakdown: weak,
  currentProblemId: 'p1',
  catalog,
  ratingBand: 1200,
});

assert.strictEqual(plan.weakAxis, 'algorithm');
assert.ok(plan.headline.includes('Algorithm'));
assert.ok(plan.lessons.some((l) => l.lesson.id === 'bfs'));
assert.ok(plan.practice.some((p) => p.problem.id === 'p2'));

console.log('drill-next tests passed');
