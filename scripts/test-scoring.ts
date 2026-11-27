import assert from 'assert';
import { axisScore, jaccard, scoreHypothesis } from '../lib/scoring';
import { getSeedProblem } from '../data/seed-problems';

assert.strictEqual(jaccard(['a', 'b'], ['b', 'c']), 1 / 3);
assert.strictEqual(jaccard([], []), 1);

// Empty expected axis is optional — extras must not tank the score.
assert.strictEqual(axisScore(['1D Array'], []), 1);
// Accepted alternatives are OR — picking one valid tag is full credit.
assert.strictEqual(axisScore(['Hash Map'], ['Hash Map', 'Ordered Set', '1D Array']), 1);
assert.strictEqual(axisScore(['1D Array'], ['Hash Map', 'Ordered Set', '1D Array']), 1);
assert.strictEqual(axisScore(['Trie'], ['Hash Map', 'Ordered Set']), 0);

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

const playlist = getSeedProblem('cses-playlist');
assert.ok(playlist);
const playlistTwoPointers = scoreHypothesis(
  {
    paradigms: ['Two Pointers'],
    algorithms: [],
    dataStructures: ['1D Array'],
    twists: ['Maintain a window of unique songs', 'Move left pointer when duplicate appears'],
    guessedComplexity: 'O(N)',
    complexityBonus: false,
  },
  playlist!.approaches,
  playlist!.target_complexity,
);
assert.ok(
  playlistTwoPointers.score >= 95,
  `two-pointer + array playlist should score high, got ${playlistTwoPointers.score}`,
);
assert.strictEqual(playlistTwoPointers.dsScore, 1);

const sumTwo = getSeedProblem('cses-sum-of-two-values');
assert.ok(sumTwo && sumTwo.approaches.length >= 2);
const twoPointerSum = scoreHypothesis(
  {
    paradigms: ['Two Pointers'],
    algorithms: ['Sorting'],
    dataStructures: ['1D Array'],
    twists: ['Keep original indices when sorting', 'Move left/right based on sum vs x'],
    guessedComplexity: sumTwo!.target_complexity,
    complexityBonus: false,
  },
  sumTwo!.approaches,
  sumTwo!.target_complexity,
);
assert.ok(
  twoPointerSum.matchedApproach?.id === 'cses-sum-of-two-values-a2',
  `should match two-pointer approach, got ${twoPointerSum.matchedApproach?.id}`,
);
assert.ok(twoPointerSum.score >= 95, `expected high score, got ${twoPointerSum.score}`);

console.log('scoring tests passed');
