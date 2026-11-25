import assert from 'assert';
import { jaccard, scoreHypothesis } from '../lib/scoring';
import { getSeedProblem } from '../data/seed-problems';

assert.strictEqual(jaccard(['a', 'b'], ['b', 'c']), 1 / 3);
assert.strictEqual(jaccard([], []), 1);

const flight = getSeedProblem('cses-flight-discount');
assert.ok(flight);

const perfect = scoreHypothesis(
  {
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['Dijkstra'],
    dataStructures: ['Priority Queue', 'Adjacency List'],
    twists: ['State is (node, used_discount)', 'Edge transitions either keep discount unused or apply half cost once'],
    guessedComplexity: 'O(N log N)',
    complexityBonus: false,
  },
  flight!.approaches,
  flight!.target_complexity,
);

assert.ok(perfect.score >= 80, `expected high score, got ${perfect.score}`);
assert.ok(perfect.complexityBonus);
assert.ok(perfect.matchedApproach?.id === 'cses-flight-discount-a1');

const wrong = scoreHypothesis(
  {
    paradigms: ['Geometry'],
    algorithms: ['KMP'],
    dataStructures: ['Trie'],
    twists: ['Compress coordinates first'],
    guessedComplexity: 'O(N²)',
    complexityBonus: false,
  },
  flight!.approaches,
  flight!.target_complexity,
);

assert.ok(wrong.score < 40, `expected low score, got ${wrong.score}`);
assert.ok(wrong.mistakeTypes.includes('Wrong Paradigm'));

console.log('scoring tests passed');
