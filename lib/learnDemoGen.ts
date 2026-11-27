import type {
  ArrayDemo,
  GraphDemo,
  KnapsackDemo,
  LearnDemo,
  LearnVizKind,
  PointsDemo,
  StringDemo,
} from '@/types/learn';
import { mulberry32 } from '@/lib/learnExerciseGen';

type Rng = () => number;

function randInt(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function shuffleInPlace<T>(rng: Rng, a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const W = 360;
const H = 220;
const PAD = 36;

function layoutCircle(n: number): { x: number; y: number }[] {
  const cx = W / 2;
  const cy = H / 2;
  const r = Math.min(cx, cy) - PAD;
  return Array.from({ length: n }, (_, i) => {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: Math.round(cx + r * Math.cos(ang)), y: Math.round(cy + r * Math.sin(ang)) };
  });
}

function layoutLayers(counts: number[]): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  const layers = counts.length;
  for (let L = 0; L < layers; L++) {
    const c = counts[L]!;
    const x = PAD + ((W - 2 * PAD) * L) / Math.max(1, layers - 1);
    for (let i = 0; i < c; i++) {
      const y = c === 1 ? H / 2 : PAD + ((H - 2 * PAD) * i) / Math.max(1, c - 1);
      out.push({ x: Math.round(x), y: Math.round(y) });
    }
  }
  return out;
}

function nodesFromPositions(
  positions: { x: number; y: number }[],
  labels?: string[],
): GraphDemo['nodes'] {
  return positions.map((p, i) => ({
    id: String(i),
    x: p.x,
    y: p.y,
    label: labels?.[i] ?? String(i),
  }));
}

function genBfs(rng: Rng): GraphDemo {
  const layerCounts = [1, 2, randInt(rng, 1, 2), 2];
  const positions = layoutLayers(layerCounts);
  const edges: GraphDemo['edges'] = [];
  let offset = 0;
  for (let L = 0; L < layerCounts.length - 1; L++) {
    const left = layerCounts[L]!;
    const right = layerCounts[L + 1]!;
    for (let i = 0; i < left; i++) {
      const u = offset + i;
      const targets = new Set<number>();
      targets.add(offset + left + randInt(rng, 0, right - 1));
      if (right > 1 && rng() > 0.4) {
        targets.add(offset + left + randInt(rng, 0, right - 1));
      }
      for (const v of targets) edges.push({ from: String(u), to: String(v) });
    }
    offset += left;
  }
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genDfsSpine(rng: Rng): GraphDemo {
  const spine = randInt(rng, 3, 4);
  const branch = randInt(rng, 2, 3);
  const n = spine + branch;
  const positions = layoutCircle(n);
  const edges: GraphDemo['edges'] = [];
  for (let i = 0; i < spine - 1; i++) edges.push({ from: String(i), to: String(i + 1) });
  edges.push({ from: '0', to: String(spine) });
  for (let i = spine; i < n - 1; i++) edges.push({ from: String(i), to: String(i + 1) });
  if (rng() > 0.5 && spine > 2) {
    edges.push({ from: String(1), to: String(spine) });
  }
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genTree(rng: Rng): GraphDemo {
  const n = randInt(rng, 5, 7);
  const positions = layoutCircle(n);
  const top = positions.reduce((bi, p, i) => (p.y < positions[bi]!.y ? i : bi), 0);
  [positions[0], positions[top]] = [positions[top]!, positions[0]!];
  const edges: GraphDemo['edges'] = [];
  for (let i = 1; i < n; i++) {
    const parent = randInt(rng, 0, i - 1);
    edges.push({ from: String(parent), to: String(i) });
  }
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genDijkstra(rng: Rng): GraphDemo {
  const positions = layoutLayers([1, 2, 1]);
  const heavy = randInt(rng, 8, 14);
  const cheap = randInt(rng, 1, 3);
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1', w: heavy },
    { from: '0', to: '2', w: cheap },
    { from: '2', to: '1', w: cheap },
    { from: '1', to: '3', w: randInt(rng, 1, 4) },
    { from: '2', to: '3', w: randInt(rng, 6, 12) },
  ];
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genTopo(rng: Rng): GraphDemo {
  const n = randInt(rng, 5, 6);
  const positions = layoutLayers(n === 5 ? [1, 2, 1, 1] : [1, 2, 2, 1]);
  const labels = 'ABCDEFGH'.slice(0, n).split('');
  const edges: GraphDemo['edges'] = [];
  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      if (rng() < 0.45) edges.push({ from: String(u), to: String(v) });
    }
  }
  for (let i = 0; i < n - 1; i++) {
    if (!edges.some((e) => e.from === String(i) && Number(e.to) > i)) {
      edges.push({ from: String(i), to: String(i + 1) });
    }
  }
  return {
    directed: true,
    nodes: nodesFromPositions(positions.slice(0, n), labels),
    edges,
    start: '0',
  };
}

function genMst(rng: Rng): GraphDemo {
  const n = 4;
  const positions = layoutCircle(n);
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1', w: randInt(rng, 1, 3) },
    { from: '0', to: '2', w: randInt(rng, 1, 4) },
    { from: '1', to: '2', w: randInt(rng, 8, 14) },
    { from: '1', to: '3', w: randInt(rng, 2, 5) },
    { from: '2', to: '3', w: randInt(rng, 2, 6) },
  ];
  if (rng() > 0.5) edges.push({ from: '0', to: '3', w: randInt(rng, 9, 15) });
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genScc(rng: Rng): GraphDemo {
  const positions = [
    { x: 50, y: 60 },
    { x: 130, y: 40 },
    { x: 130, y: 120 },
    { x: 230, y: 60 },
    { x: 310, y: 100 },
    { x: 290, y: 180 },
  ];
  if (rng() > 0.5) {
    for (const p of positions) {
      p.x += randInt(rng, -6, 6);
      p.y += randInt(rng, -6, 6);
    }
  }
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '3' },
    { from: '4', to: '5' },
  ];
  if (rng() > 0.5) edges.push({ from: '1', to: '3' });
  return { directed: true, nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genBridges(rng: Rng): GraphDemo {
  const positions = [
    { x: 50, y: 60 },
    { x: 130, y: 110 },
    { x: 50, y: 160 },
    { x: 230, y: 110 },
    { x: 310, y: 60 },
    { x: 310, y: 160 },
  ];
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '1', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ];
  if (rng() > 0.5) edges.push({ from: '4', to: '3' });
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genBellman(rng: Rng): GraphDemo {
  const nodes = nodesFromPositions([
    { x: 40, y: 110 },
    { x: 140, y: 50 },
    { x: 240, y: 50 },
    { x: 320, y: 110 },
    { x: 140, y: 180 },
  ]);
  const neg = -randInt(rng, 2, 5);
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1', w: randInt(rng, 4, 7) },
    { from: '1', to: '2', w: neg },
    { from: '2', to: '3', w: randInt(rng, 1, 4) },
    { from: '0', to: '3', w: randInt(rng, 9, 14) },
    { from: '0', to: '4', w: randInt(rng, 1, 3) },
    { from: '4', to: '3', w: randInt(rng, 6, 10) },
  ];
  return { directed: true, nodes, edges, start: '0' };
}

function genFloyd(rng: Rng): GraphDemo {
  const n = 4;
  const positions = [
    { x: 80, y: 50 },
    { x: 260, y: 50 },
    { x: 80, y: 170 },
    { x: 260, y: 170 },
  ];
  const edges: GraphDemo['edges'] = [];
  for (let u = 0; u < n; u++) {
    for (let v = 0; v < n; v++) {
      if (u === v) continue;
      if (rng() < 0.55) edges.push({ from: String(u), to: String(v), w: randInt(rng, 1, 9) });
    }
  }
  if (!edges.some((e) => e.from === '0')) {
    edges.push({ from: '0', to: '1', w: randInt(rng, 1, 5) });
  }
  return { directed: true, nodes: nodesFromPositions(positions), edges, start: '0' };
}

function gen01Bfs(rng: Rng): GraphDemo {
  const positions = layoutLayers([1, 2, 1]);
  const edges: GraphDemo['edges'] = [
    { from: '0', to: '1', w: 0 },
    { from: '0', to: '2', w: 1 },
    { from: '1', to: '3', w: randInt(rng, 0, 1) },
    { from: '2', to: '3', w: randInt(rng, 0, 1) },
  ];
  if (edges[2]!.w === 1 && edges[3]!.w === 1) edges[3]!.w = 0;
  return { directed: true, nodes: nodesFromPositions(positions), edges, start: '0' };
}

function genDsu(rng: Rng): GraphDemo {
  const n = randInt(rng, 5, 6);
  const positions = layoutCircle(n);
  const edges: GraphDemo['edges'] = [];
  for (let i = 1; i < n; i++) {
    edges.push({ from: String(randInt(rng, 0, i - 1)), to: String(i) });
  }
  for (let k = 0; k < 2; k++) {
    const u = randInt(rng, 0, n - 1);
    const v = randInt(rng, 0, n - 1);
    if (u !== v) edges.push({ from: String(u), to: String(v) });
  }
  return { nodes: nodesFromPositions(positions), edges, start: '0' };
}

function uniqueSorted(rng: Rng, n: number, lo = 1, hi = 40): number[] {
  const set = new Set<number>();
  while (set.size < n) set.add(randInt(rng, lo, hi));
  return [...set].sort((a, b) => a - b);
}

function genArrayBinarySearch(rng: Rng): ArrayDemo {
  const values = uniqueSorted(rng, randInt(rng, 7, 10));
  const target =
    rng() > 0.25
      ? values[randInt(rng, 0, values.length - 1)]!
      : randInt(rng, values[0]!, values[values.length - 1]!);
  return { values, target };
}

function genArrayPrefix(rng: Rng): ArrayDemo {
  const n = randInt(rng, 5, 8);
  return { values: Array.from({ length: n }, () => randInt(rng, -3, 9)) };
}

function genArraySort(rng: Rng, lessonId?: string): ArrayDemo {
  if (lessonId === 'counting-sort') {
    const n = 6;
    return { values: Array.from({ length: n }, () => randInt(rng, 0, 4)) };
  }
  // Merge/quick replays stay readable with a fixed-ish length.
  const n =
    lessonId === 'mergesort' ||
    lessonId === 'divide-conquer' ||
    lessonId === 'quicksort'
      ? 6
      : randInt(rng, 5, 8);
  const values = uniqueSorted(rng, n, 1, 20);
  return { values: shuffleInPlace(rng, [...values]) };
}

function genFenwick(rng: Rng): ArrayDemo {
  const n = randInt(rng, 5, 7);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 6)) };
}

function genSparse(rng: Rng): ArrayDemo {
  const n = randInt(rng, 5, 7);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 12)) };
}

function genDiff(rng: Rng): ArrayDemo {
  const n = randInt(rng, 5, 7);
  const d = Array(n).fill(0);
  // 2–3 synthetic range updates → difference array
  const ops = randInt(rng, 2, 3);
  for (let o = 0; o < ops; o++) {
    const l = randInt(rng, 0, n - 2);
    const r = randInt(rng, l, n - 1);
    const v = randInt(rng, 1, 4) * (rng() > 0.3 ? 1 : -1);
    d[l] += v;
    if (r + 1 < n) d[r + 1] -= v;
  }
  return { values: d };
}

function genHeap(rng: Rng): ArrayDemo {
  const n = randInt(rng, 4, 6);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 15)) };
}

function genKmp(rng: Rng): StringDemo {
  const alphabet = 'ab';
  const n = randInt(rng, 5, 8);
  let text = '';
  for (let i = 0; i < n; i++) text += alphabet[randInt(rng, 0, 1)];
  if (rng() > 0.3) text = text.slice(0, 2) + text;
  return { text: text.slice(0, 10) };
}

function genTrie(rng: Rng): StringDemo {
  const roots = ['a', 'ab', 'b', 'ba', 'c'];
  const words = new Set<string>();
  const n = randInt(rng, 3, 4);
  while (words.size < n) {
    const base = roots[randInt(rng, 0, roots.length - 1)]!;
    words.add(base + (rng() > 0.5 ? alphabetPick(rng) : ''));
  }
  return { text: [...words].join(' ') };
}

function alphabetPick(rng: Rng): string {
  return 'abc'[randInt(rng, 0, 2)]!;
}

function genBitmask(rng: Rng): ArrayDemo {
  const n = randInt(rng, 3, 4);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 9)) };
}

function genDequeWindow(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 8);
  return {
    values: Array.from({ length: n }, () => randInt(rng, 1, 12)),
    target: randInt(rng, 2, 4),
  };
}

function genTernary(rng: Rng): ArrayDemo {
  // Build a unimodal (valley) sequence
  const n = randInt(rng, 7, 9);
  const mid = randInt(rng, 2, n - 3);
  const values: number[] = [];
  let v = randInt(rng, 8, 14);
  for (let i = 0; i < n; i++) {
    values.push(v);
    if (i < mid) v -= randInt(rng, 1, 3);
    else v += randInt(rng, 1, 3);
  }
  return { values };
}

function genHashMap(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 8);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 5)) };
}

function genArrayLis(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 8);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 12)) };
}

function genTwoPointers(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 9);
  const values = uniqueSorted(rng, n);
  const target = values[randInt(rng, 2, n - 1)]! + values[randInt(rng, 0, 2)]!;
  return { values, target };
}

function genMonoStack(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 8);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 15)) };
}

function genSieve(rng: Rng): ArrayDemo {
  const n = randInt(rng, 20, 36);
  return { values: [n], target: n };
}

function genKnapsack(rng: Rng): KnapsackDemo {
  const n = randInt(rng, 3, 4);
  const weights = Array.from({ length: n }, () => randInt(rng, 1, 5));
  const values = Array.from({ length: n }, () => randInt(rng, 2, 8));
  const capacity = randInt(rng, 5, 10);
  return { weights, values, capacity };
}

function genStringZ(rng: Rng): StringDemo {
  const alphabet = 'abc';
  const n = randInt(rng, 5, 8);
  let text = '';
  for (let i = 0; i < n; i++) text += alphabet[randInt(rng, 0, 2)];
  if (rng() > 0.4) text = text.slice(0, 2) + text;
  return { text: text.slice(0, 10) };
}

function genPoints(rng: Rng, hullish: boolean): PointsDemo {
  const n = randInt(rng, 5, 8);
  const points = Array.from({ length: n }, (_, i) => ({
    x: randInt(rng, 40, 320),
    y: randInt(rng, 30, 190),
    label: String.fromCharCode(65 + i),
  }));
  if (hullish) {
    points[0] = { x: 40, y: 180, label: 'A' };
    points[1] = { x: 320, y: 180, label: 'B' };
    points[2] = { x: 180, y: 30, label: 'C' };
  }
  return { points };
}

function genNim(rng: Rng): ArrayDemo {
  const n = randInt(rng, 3, 4);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 7)) };
}

function genStackQueue(rng: Rng): ArrayDemo {
  const n = randInt(rng, 5, 7);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 9)) };
}

function genSegtree(rng: Rng): ArrayDemo {
  const n = randInt(rng, 6, 8);
  return { values: Array.from({ length: n }, () => randInt(rng, 1, 12)) };
}

/**
 * Fresh purpose-fit demo for a lesson Replay shuffle.
 * `lessonId` overrides kind when the viz kind alone is ambiguous (LCA tree, Floyd).
 */
export function randomLessonDemo(
  kind: LearnVizKind,
  seed: number,
  lessonId?: string,
): LearnDemo {
  const rng = mulberry32(seed >>> 0);

  if (lessonId === 'lca') return genTree(rng);

  switch (kind) {
    case 'graph-bfs':
      return genBfs(rng);
    case 'graph-dfs':
      return genDfsSpine(rng);
    case 'graph-dijkstra':
      return genDijkstra(rng);
    case 'graph-topo':
      return genTopo(rng);
    case 'graph-mst':
      return genMst(rng);
    case 'graph-scc':
      return genScc(rng);
    case 'graph-bridges':
      return genBridges(rng);
    case 'graph-bellman':
      return genBellman(rng);
    case 'graph-01-bfs':
      return gen01Bfs(rng);
    case 'graph-floyd':
      return genFloyd(rng);
    case 'dsu-merge':
      return genDsu(rng);
    case 'array-binary-search':
      return genArrayBinarySearch(rng);
    case 'array-prefix':
      return genArrayPrefix(rng);
    case 'array-fenwick':
      return genFenwick(rng);
    case 'array-sparse':
      return genSparse(rng);
    case 'array-diff':
      return genDiff(rng);
    case 'array-sort':
      return genArraySort(rng, lessonId);
    case 'array-lis':
      return genArrayLis(rng);
    case 'array-two-pointers':
      return genTwoPointers(rng);
    case 'array-deque-window':
      return genDequeWindow(rng);
    case 'mono-stack':
      return genMonoStack(rng);
    case 'array-sieve':
      return genSieve(rng);
    case 'array-ternary':
      return genTernary(rng);
    case 'array-hashmap':
      return genHashMap(rng);
    case 'dp-knapsack':
      return genKnapsack(rng);
    case 'dp-bitmask':
      return genBitmask(rng);
    case 'string-z':
      return genStringZ(rng);
    case 'string-kmp':
      return genKmp(rng);
    case 'string-trie':
      return genTrie(rng);
    case 'geo-orient':
      return genPoints(rng, false);
    case 'geo-hull':
      return genPoints(rng, true);
    case 'nim-heaps':
      return genNim(rng);
    case 'heap-pq':
      return genHeap(rng);
    case 'array-stack':
    case 'array-queue':
      return genStackQueue(rng);
    case 'segtree-sum':
      return genSegtree(rng);
    case 'segtree-lazy':
      return genSegtree(rng);
    default:
      return genArraySort(rng);
  }
}
