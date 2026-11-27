import assert from 'assert';
import {
  DEMO_01_BFS,
  DEMO_BELLMAN,
  DEMO_BRIDGES,
  DEMO_DIJKSTRA,
  DEMO_MST,
  DEMO_SCC,
} from '../data/learn/graph-demos';
import { randomLessonDemo } from '../lib/learnDemoGen';
import {
  buildCountingFrames,
  buildMergeFrames,
  buildQuickFrames,
  buildSelectionFrames,
  buildSortFrames,
  finalOrderValues,
  resolveSortAlgo,
  sortFrameCount,
} from '../lib/learnSortFrames';
import type { ArrayDemo, GraphDemo, LearnVizKind } from '../types/learn';
import {
  build01BfsSteps,
  buildBellmanSteps,
  buildBfsSteps,
  buildBridgeSteps,
  buildDfsSteps,
  buildDijkstraSteps,
  buildLcaSteps,
  buildMstSteps,
  buildPrimSteps,
  buildSccSteps,
  buildTopoSteps,
} from '../lib/learnViz';
import { DEMO_FLOYD, DEMO_TREE } from '../data/learn/graph-demos';
import { buildFloydFrames } from '../lib/learnFloyd';

function asGraph(demo: unknown): GraphDemo {
  assert.ok(demo && typeof demo === 'object' && 'nodes' in demo && 'edges' in demo);
  return demo as GraphDemo;
}

// Dijkstra: cheap path via 2 beats the direct heavy edge to 1.
const dij = buildDijkstraSteps(DEMO_DIJKSTRA);
const lastDij = dij[dij.length - 1]!;
assert.strictEqual(lastDij.dist?.['1'], 2, '0→2→1 should beat 0→1 (10)');
assert.strictEqual(lastDij.dist?.['3'], 4);

// MST: expensive 1-2 edge skipped.
const mst = buildMstSteps(DEMO_MST);
assert.ok(mst.some((s) => s.label.includes('skip')), 'Kruskal should skip a cycle edge');
const finalMst = mst[mst.length - 1]!;
assert.ok(!(finalMst.mstEdges ?? []).some((e) => e === '1-2' || e === '2-1'));

// SCC: directed demo yields multiple components.
const scc = buildSccSteps(DEMO_SCC);
const finalScc = scc[scc.length - 1]!;
assert.ok(finalScc.component, 'SCC replay assigns components');
const ids = new Set(Object.values(finalScc.component!));
assert.ok(ids.size >= 3, `expected ≥3 SCCs, got ${ids.size}`);
assert.strictEqual(finalScc.component!['0'], finalScc.component!['1']);
assert.strictEqual(finalScc.component!['0'], finalScc.component!['2']);
assert.notStrictEqual(finalScc.component!['0'], finalScc.component!['3']);
assert.notStrictEqual(finalScc.component!['3'], finalScc.component!['5']);

// Bridges: the joining edge is found.
const bridges = buildBridgeSteps(DEMO_BRIDGES);
const found = bridges.some(
  (s) => (s.mstEdges ?? []).includes('1-3') || (s.mstEdges ?? []).includes('3-1'),
);
assert.ok(found, 'bridge 1—3 should be detected');

// Bellman: negative edge improves 0→1→2→3 vs direct.
const bell = buildBellmanSteps(DEMO_BELLMAN);
const lastBell = bell[bell.length - 1]!;
assert.strictEqual(lastBell.dist?.['3'], 4, '0→1→2→3 = 5-3+2 = 4');

// 0-1 BFS: both routes to 3 cost 1 (0+1 or 1+0).
const z = build01BfsSteps(DEMO_01_BFS);
const lastZ = z[z.length - 1]!;
assert.strictEqual(lastZ.dist?.['3'], 1);
assert.strictEqual(lastZ.dist?.['1'], 0);

// --- randomLessonDemo purpose-fit ---
const GRAPH_KINDS: LearnVizKind[] = [
  'graph-bfs',
  'graph-dfs',
  'graph-dijkstra',
  'graph-topo',
  'graph-mst',
  'graph-scc',
  'graph-bridges',
  'graph-bellman',
  'graph-01-bfs',
  'dsu-merge',
];

const builders: Record<string, (d: GraphDemo) => unknown[]> = {
  'graph-bfs': buildBfsSteps,
  'graph-dfs': buildDfsSteps,
  'graph-dijkstra': buildDijkstraSteps,
  'graph-topo': buildTopoSteps,
  'graph-mst': buildMstSteps,
  'graph-scc': buildSccSteps,
  'graph-bridges': buildBridgeSteps,
  'graph-bellman': buildBellmanSteps,
  'graph-01-bfs': build01BfsSteps,
  'dsu-merge': () => [{}, {}, {}, {}, {}],
};

for (const kind of GRAPH_KINDS) {
  for (let seed = 1; seed <= 5; seed++) {
    const demo = asGraph(randomLessonDemo(kind, seed * 9973));
    const steps = builders[kind]!(demo);
    assert.ok(steps.length >= 1, `${kind} seed=${seed} should build ≥1 step`);
  }
}

for (let seed = 1; seed <= 8; seed++) {
  const demo = asGraph(randomLessonDemo('graph-scc', seed * 4243));
  assert.strictEqual(demo.directed, true);
  const steps = buildSccSteps(demo);
  const last = steps[steps.length - 1]!;
  const comps = new Set(Object.values(last.component ?? {}));
  assert.ok(comps.size >= 2, `random SCC seed=${seed} expected ≥2 components, got ${comps.size}`);
}

for (let seed = 1; seed <= 8; seed++) {
  const demo = asGraph(randomLessonDemo('graph-bridges', seed * 1337));
  const steps = buildBridgeSteps(demo);
  const hasBridge = steps.some((s) => (s.mstEdges?.length ?? 0) > 0);
  assert.ok(hasBridge, `random bridges seed=${seed} should find ≥1 bridge`);
}

for (let seed = 1; seed <= 8; seed++) {
  const demo = asGraph(randomLessonDemo('graph-dijkstra', seed * 2711));
  const heavy = demo.edges.find((e) => e.from === '0' && e.to === '1')?.w ?? 0;
  const dijSteps = buildDijkstraSteps(demo);
  const last = dijSteps[dijSteps.length - 1]!;
  assert.ok(
    (last.dist?.['1'] ?? Infinity) < heavy,
    `random dijkstra seed=${seed}: cheap path should beat heavy 0→1 (${last.dist?.['1']} < ${heavy})`,
  );
}

for (let seed = 1; seed <= 8; seed++) {
  const demo = asGraph(randomLessonDemo('graph-lca', seed));
  assert.strictEqual(
    demo.edges.length,
    demo.nodes.length - 1,
    `lca seed=${seed} should be a tree`,
  );
}

{
  const prim = buildPrimSteps(DEMO_MST);
  assert.ok(prim.some((s) => s.label.startsWith('take')), 'Prim takes nodes');
  const finalPrim = prim[prim.length - 1]!;
  assert.ok((finalPrim.mstEdges ?? []).length >= DEMO_MST.nodes.length - 1);

  const lca = buildLcaSteps(DEMO_TREE, '3', '5');
  assert.ok(lca.some((s) => s.label.includes('LCA')), 'LCA labels query');
  const lastLca = lca[lca.length - 1]!;
  assert.ok(
    Object.values(lastLca.nodeState).includes('current') ||
      lastLca.label.toLowerCase().includes('lca'),
    'LCA ends on ancestor',
  );
}

// --- animated sort frames ---
function isSorted(a: number[]): boolean {
  for (let i = 1; i < a.length; i++) if (a[i]! < a[i - 1]!) return false;
  return true;
}

function asArray(demo: unknown): ArrayDemo {
  assert.ok(demo && typeof demo === 'object' && 'values' in demo);
  return demo as ArrayDemo;
}

{
  const values = [5, 2, 8, 1, 9, 3];
  const sel = buildSelectionFrames(values);
  assert.ok(isSorted(finalOrderValues(sel)), 'selection ends sorted');
  const swapped = sel.some(
    (f, i) =>
      i > 0 &&
      f.label.startsWith('swapped') &&
      f.order.join() !== sel[i - 1]!.order.join(),
  );
  assert.ok(swapped, 'selection should include an order-changing swap frame');
  assert.strictEqual(sortFrameCount({ values }), sel.length);

  const merge = buildMergeFrames(values);
  assert.ok(isSorted(finalOrderValues(merge)), 'merge ends sorted');
  assert.ok(merge.some((f) => f.layout === 'split'), 'merge has split frames');
  assert.ok(merge.some((f) => f.layout === 'merge'), 'merge has merge frames');

  const quick = buildQuickFrames(values);
  assert.ok(isSorted(finalOrderValues(quick)), 'quick ends sorted');
  assert.ok(
    quick.some((f) => f.label.includes('swap') || f.label.includes('place pivot')),
    'quick should swap during partition',
  );

  assert.strictEqual(buildSortFrames({ values }, 'mergesort')[0]!.label.includes('Mergesort'), true);
  assert.strictEqual(buildSortFrames({ values }, 'quicksort')[0]!.label.includes('Quicksort'), true);
  assert.strictEqual(buildSortFrames({ values }, 'divide-conquer')[0]!.label.includes('Mergesort'), true);

  for (let seed = 1; seed <= 5; seed++) {
    const demo = asArray(randomLessonDemo('array-sort', seed * 911, 'mergesort'));
    assert.strictEqual(demo.values.length, 6, 'mergesort shuffle biased to length 6');
    const frames = buildSortFrames(demo, 'mergesort');
    assert.strictEqual(sortFrameCount(demo, 'mergesort'), frames.length);
    assert.ok(isSorted(finalOrderValues(frames)), `random merge seed=${seed} sorted`);
  }

  for (let seed = 1; seed <= 5; seed++) {
    const demo = asArray(randomLessonDemo('array-sort', seed * 733, 'quicksort'));
    assert.strictEqual(demo.values.length, 6);
    assert.ok(isSorted(finalOrderValues(buildSortFrames(demo, 'quicksort'))));
  }

  assert.strictEqual(resolveSortAlgo('counting-sort'), 'counting');
  const counting = buildCountingFrames([3, 1, 2, 0, 3, 1]);
  assert.ok(counting[0]!.label.includes('Counting'));
  assert.ok(isSorted(finalOrderValues(counting)), 'counting ends sorted');
  assert.ok(counting.some((f) => (f.counts?.length ?? 0) > 0), 'counting shows count[]');
}

// --- purpose-fit kinds (shuffle smoke + floyd logic; UI frameCounts live in RN components) ---
{
  const floyd = buildFloydFrames(DEMO_FLOYD);
  assert.ok(floyd.some((f) => f.label.includes('k=')), 'floyd frames mention k');
  assert.ok(floyd[floyd.length - 1]!.d[0]![3]! < 1e8, 'floyd reaches 0→3');

  const floydDemo = asGraph(randomLessonDemo('graph-floyd', 45));
  assert.strictEqual(floydDemo.directed, true);

  for (const kind of [
    'array-fenwick',
    'array-sparse',
    'array-diff',
    'graph-floyd',
    'string-kmp',
    'heap-pq',
    'string-trie',
    'dp-bitmask',
    'array-deque-window',
    'array-ternary',
    'array-hashmap',
    'segtree-lazy',
    'array-mo',
    'array-mitm',
    'graph-prim',
    'graph-lca',
    'array-sweep',
    'array-greedy',
    'array-brute',
    'array-gcd',
    'array-compress',
    'string-hash',
  ] as LearnVizKind[]) {
    assert.ok(randomLessonDemo(kind, 101), `shuffle ${kind}`);
  }

  const trie = randomLessonDemo('string-trie', 7) as { text: string };
  assert.ok(trie.text.split(/\s+/).length >= 2, 'trie shuffle has multiple words');

  const ternary = asArray(randomLessonDemo('array-ternary', 8));
  assert.ok(ternary.values.length >= 5);

  const mitm = asArray(randomLessonDemo('array-mitm', 9));
  assert.ok(mitm.values.length >= 4 && mitm.target != null);

  const hash = randomLessonDemo('string-hash', 11) as { text: string };
  assert.ok(hash.text.length >= 4);

  const gcd = asArray(randomLessonDemo('array-gcd', 12));
  assert.strictEqual(gcd.values.length, 2);
}

console.log('learn-viz tests passed');
