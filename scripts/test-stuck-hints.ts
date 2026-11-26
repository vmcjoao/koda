import assert from 'assert';
import { stuckHintSteps, stuckLearnLinks } from '../lib/stuckHints';
import type { ProblemWithApproaches } from '../types/database';

const problem: ProblemWithApproaches = {
  id: 'demo',
  title: 'Demo',
  source: 'Other',
  url: null,
  difficulty_rating: 1200,
  statement_md: 'x',
  constraints_text: '',
  sample_io: [],
  target_complexity: 'O(N)',
  approaches: [
    {
      id: 'a1',
      problem_id: 'demo',
      approach_name: 'BFS',
      paradigms: ['Graph Algorithms'],
      algorithms: ['BFS'],
      data_structures: ['Queue'],
      key_insights: ['Multi-source flood', 'Auto-imported from VJudge — replace'],
      editorial_summary_md: 'BFS.',
    },
  ],
};

const steps = stuckHintSteps(problem);
assert.ok(steps.some((s) => s.title === 'Paradigm family'));
assert.ok(steps.some((s) => s.body.includes('BFS')));
const twist = steps.find((s) => s.title === 'One twist');
assert.ok(twist && twist.body === 'Multi-source flood');

const links = stuckLearnLinks(problem.approaches[0]);
assert.ok(links.some((l) => l.lesson.id === 'bfs'));

console.log('stuck-hints tests passed');
