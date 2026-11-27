import { LESSON_EXERCISES } from '@/data/learn/exercises';
import {
  buildBfsSteps,
  buildDfsSteps,
  buildDijkstraSteps,
  type GraphStep,
} from '@/lib/learnViz';
import type {
  GraphDemo,
  GraphPredictAlgo,
  GraphPredictCheckpoint,
  LearnExercise,
  LearnMcq,
} from '@/types/learn';

type Rng = () => number; // [0, 1)

/** Mulberry32 — tiny deterministic PRNG from a seed. */
export function mulberry32(seed: number): Rng {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng() * (hi - lo + 1));
}

function pick<T>(rng: Rng, arr: T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)]!;
}

function shuffle<T>(rng: Rng, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(rng, 0, i);
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function shuffleMcq(rng: Rng, q: LearnMcq): LearnMcq {
  const order = shuffle(
    rng,
    q.choices.map((_, i) => i),
  );
  return {
    ...q,
    choices: order.map((i) => q.choices[i]!),
    answer: order.indexOf(q.answer),
  };
}

function shuffleExercise(rng: Rng, ex: LearnExercise): LearnExercise {
  if (ex.kind === 'mcq') return { ...shuffleMcq(rng, ex), id: ex.id, kind: 'mcq' };
  if (ex.kind === 'graph_predict') return ex;
  return {
    ...ex,
    steps: ex.steps.map((s) => shuffleMcq(rng, s)),
  };
}

function mcqFrom(
  rng: Rng,
  id: string,
  prompt: string,
  correct: string,
  wrong: string[],
  explain_md?: string,
  context_md?: string,
): LearnExercise {
  const q = makeMcq(rng, { prompt, correct, wrong, explain_md, context_md });
  return { id, kind: 'mcq', ...q };
}

// ── Graph helpers ──────────────────────────────────────────────

type Graph = { n: number; adj: number[][]; undirected: boolean };

function buildTreePlus(rng: Rng, n: number, extra: number): Graph {
  const adj: number[][] = Array.from({ length: n }, () => []);
  const add = (u: number, v: number) => {
    if (u === v) return;
    if (adj[u]!.includes(v)) return;
    adj[u]!.push(v);
    adj[v]!.push(u);
  };
  for (let i = 1; i < n; i++) add(i, randInt(rng, 0, i - 1));
  let tries = 0;
  while (extra > 0 && tries++ < 40) {
    const u = randInt(rng, 0, n - 1);
    const v = randInt(rng, 0, n - 1);
    const before = adj[u]!.length;
    add(u, v);
    if (adj[u]!.length > before) extra--;
  }
  for (const list of adj) list.sort((a, b) => a - b);
  return { n, adj, undirected: true };
}

function graphContext(g: Graph, weighted?: Map<string, number>): string {
  const lines: string[] = [];
  lines.push(`Undirected graph on nodes **0…${g.n - 1}**. Neighbors scanned in ascending order.`);
  const seen = new Set<string>();
  const edgeStrs: string[] = [];
  for (let u = 0; u < g.n; u++) {
    for (const v of g.adj[u]!) {
      if (u >= v) continue;
      const key = `${u}-${v}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const w = weighted?.get(key);
      edgeStrs.push(w != null ? `${u}-${v}:${w}` : `${u}-${v}`);
    }
  }
  lines.push(`Edges: \`${edgeStrs.join('`, `')}\`.`);
  return lines.join('\n\n');
}

function bfsOrder(g: Graph, start: number): { order: number[]; dist: number[] } {
  const dist = Array(g.n).fill(-1);
  const order: number[] = [];
  const q = [start];
  dist[start] = 0;
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++]!;
    order.push(u);
    for (const v of g.adj[u]!) {
      if (dist[v] >= 0) continue;
      dist[v] = dist[u]! + 1;
      q.push(v);
    }
  }
  return { order, dist };
}

function dfsOrder(g: Graph, start: number): number[] {
  const vis = Array(g.n).fill(false);
  const order: number[] = [];
  const go = (u: number) => {
    vis[u] = true;
    order.push(u);
    for (const v of g.adj[u]!) if (!vis[v]) go(v);
  };
  go(start);
  return order;
}

function dijkstra(g: Graph, w: Map<string, number>, start: number): number[] {
  const INF = 1e9;
  const dist = Array(g.n).fill(INF);
  dist[start] = 0;
  const used = Array(g.n).fill(false);
  for (let it = 0; it < g.n; it++) {
    let u = -1;
    for (let i = 0; i < g.n; i++) {
      if (used[i]) continue;
      if (u < 0 || dist[i]! < dist[u]!) u = i;
    }
    if (u < 0 || dist[u]! >= INF) break;
    used[u] = true;
    for (const v of g.adj[u]!) {
      const key = u < v ? `${u}-${v}` : `${v}-${u}`;
      const wt = w.get(key) ?? 1;
      if (dist[v]! > dist[u]! + wt) dist[v] = dist[u]! + wt;
    }
  }
  return dist;
}

function edgeKey(u: number, v: number) {
  return u < v ? `${u}-${v}` : `${v}-${u}`;
}

const DEMO_W = 360;
const DEMO_H = 220;
const DEMO_PAD = 36;

/** Circle layout matching Replay canvas so taps stay unambiguous. */
function layoutCircle(n: number): { x: number; y: number }[] {
  const cx = DEMO_W / 2;
  const cy = DEMO_H / 2;
  const r = Math.min(cx, cy) - DEMO_PAD;
  return Array.from({ length: n }, (_, i) => {
    const ang = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return { x: Math.round(cx + r * Math.cos(ang)), y: Math.round(cy + r * Math.sin(ang)) };
  });
}

/**
 * Lex-sorted undirected edges → adj lists with ascending neighbors in build*Steps.
 */
export function graphToDemo(
  g: Graph,
  start: number,
  weights?: Map<string, number>,
): GraphDemo {
  const positions = layoutCircle(g.n);
  const nodes = positions.map((p, i) => ({
    id: String(i),
    x: p.x,
    y: p.y,
    label: String(i),
  }));
  const edges: GraphDemo['edges'] = [];
  for (let u = 0; u < g.n; u++) {
    for (const v of g.adj[u]!) {
      if (u >= v) continue;
      const e: GraphDemo['edges'][number] = { from: String(u), to: String(v) };
      const w = weights?.get(edgeKey(u, v));
      if (w != null) e.w = w;
      edges.push(e);
    }
  }
  return { nodes, edges, start: String(start) };
}

type VisitKind = 'visit' | 'enter' | 'settle';

function parseVisitNode(label: string, kind: VisitKind): string | null {
  if (kind === 'settle') {
    const m = /^settle (\S+)/.exec(label);
    return m?.[1] ?? null;
  }
  if (kind === 'visit') {
    const m = /^visit (\S+)$/.exec(label);
    return m?.[1] ?? null;
  }
  const m = /^enter (\S+)$/.exec(label);
  return m?.[1] ?? null;
}

/**
 * Pick 2–3 “next node” checkpoints from Replay steps (skip the start visit).
 * freezeAt = visitIndex − 1; answer = node that becomes current on the visit step.
 * When `rng` is passed, samples a random subset (still in step order).
 */
export function pickGraphPredictCheckpoints(
  steps: GraphStep[],
  kind: VisitKind,
  max = 3,
  rng?: Rng,
): GraphPredictCheckpoint[] {
  const visits: { index: number; nodeId: string }[] = [];
  for (let i = 0; i < steps.length; i++) {
    const nodeId = parseVisitNode(steps[i]!.label, kind);
    if (nodeId != null) visits.push({ index: i, nodeId });
  }
  const candidates = visits.slice(1).filter((v) => v.index > 0);
  if (!candidates.length) return [];

  const want = Math.min(max, Math.max(1, Math.min(3, candidates.length)));
  let picked: typeof candidates = [];
  if (want >= candidates.length) {
    picked = [...candidates];
  } else if (rng) {
    picked = shuffle(rng, candidates)
      .slice(0, want)
      .sort((a, b) => a.index - b.index);
  } else {
    for (let k = 0; k < want; k++) {
      const idx = Math.round((k * (candidates.length - 1)) / Math.max(1, want - 1));
      const c = candidates[idx]!;
      if (!picked.some((p) => p.index === c.index)) picked.push(c);
    }
  }

  const prompts: Record<VisitKind, string> = {
    visit: 'Which node is visited (dequeued) next?',
    enter: 'Which node does DFS enter next?',
    settle: 'Which node does Dijkstra settle next?',
  };

  return picked.map(({ index, nodeId }) => ({
    freezeAt: index - 1,
    answerNodeId: nodeId,
    prompt: prompts[kind],
    explain_md: `Next processed node is **${nodeId}**.`,
  }));
}

function buildGraphPredict(
  id: string,
  title: string,
  algo: GraphPredictAlgo,
  demo: GraphDemo,
  kind: VisitKind,
  rng?: Rng,
): LearnExercise | null {
  const steps =
    algo === 'bfs'
      ? buildBfsSteps(demo)
      : algo === 'dfs'
        ? buildDfsSteps(demo)
        : buildDijkstraSteps(demo);
  const checkpoints = pickGraphPredictCheckpoints(steps, kind, 3, rng);
  if (!checkpoints.length) return null;
  return { id, kind: 'graph_predict', title, algo, demo, checkpoints };
}

/** Sample up to `k` items from a pool (without replacement). */
function samplePool<T>(rng: Rng, pool: T[], k: number): T[] {
  if (k >= pool.length) return shuffle(rng, pool);
  return shuffle(rng, pool).slice(0, Math.max(0, k));
}

/** Build MCQ with correct + wrongs shuffled. */
function makeMcq(
  rng: Rng,
  partial: Omit<LearnMcq, 'choices' | 'answer'> & { correct: string; wrong: string[] },
): LearnMcq {
  const uniqueWrong = [...new Set(partial.wrong.filter((w) => w !== partial.correct))];
  const choices = shuffle(rng, [partial.correct, ...uniqueWrong]).slice(0, 4);
  if (!choices.includes(partial.correct)) choices[0] = partial.correct;
  return {
    prompt: partial.prompt,
    context_md: partial.context_md,
    explain_md: partial.explain_md,
    choices,
    answer: choices.indexOf(partial.correct),
  };
}

// ── Generators ─────────────────────────────────────────────────

function genBfs(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const g = buildTreePlus(rng, n, randInt(rng, 1, 3));
  const start = randInt(rng, 0, Math.min(2, n - 1));
  const demo = graphToDemo(g, start);
  const { order, dist } = bfsOrder(g, start);
  const far = dist.reduce((best, d, i) => (d > dist[best]! ? i : best), start);
  const mid = order[Math.min(2, order.length - 1)]!;
  const ctx = graphContext(g) + `\n\nStart at **${start}**.`;
  const predict = buildGraphPredict('bfs-predict', 'BFS · tap next', 'bfs', demo, 'visit', rng);
  const pool: LearnExercise[] = [
    mcqFrom(
      rng,
      'bfs-dist',
      `Distance (edges) from ${start} to ${far}?`,
      String(dist[far]),
      [String(dist[far]! + 1), String(Math.max(0, dist[far]! - 1)), String(dist[far]! + 2)],
      `dist[${far}] = **${dist[far]}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'bfs-order',
      'BFS visit (dequeue) order?',
      order.join(', '),
      [
        [...order].reverse().join(', '),
        shuffle(rng, [...order]).join(', '),
        order
          .slice()
          .sort((a, b) => a - b)
          .join(', '),
      ],
      `Layer by layer: **${order.join(', ')}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'bfs-frontier',
      `First neighbors enqueued from ${start}?`,
      g.adj[start]!.filter((v) => v !== start).join(', ') || '(none)',
      [
        [...g.adj[start]!].reverse().join(', ') || '0',
        String(g.adj[start]![0] ?? 0),
        `${start}, ${g.adj[start]!.join(', ')}`,
      ],
      `Ascending unused neighbors of ${start}.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'bfs-mid',
      `dist[${mid}] from ${start}?`,
      String(dist[mid]),
      [String(dist[mid]! + 1), String(Math.max(0, dist[mid]! - 1)), String(dist[mid]! + 2)],
      `BFS distance to ${mid} is **${dist[mid]}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'bfs-concept',
      'BFS finds fewest-edge paths when…',
      'All edges have equal cost',
      ['Edges may have any weights', 'The graph is a DAG', 'You need an MST'],
      'Unit-weight layers = edge count. Weighted → Dijkstra.',
    ),
  ];
  const out: LearnExercise[] = [];
  if (predict) out.push(predict);
  out.push(...samplePool(rng, pool, randInt(rng, 4, pool.length)));
  return out;
}

function genDfs(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const g = buildTreePlus(rng, n, randInt(rng, 0, 2));
  const start = randInt(rng, 0, Math.min(2, n - 1));
  const demo = graphToDemo(g, start);
  const order = dfsOrder(g, start);
  const firstChild = g.adj[start]!.find((v) => v !== start);
  const ctx =
    graphContext(g) + `\n\nStart DFS at **${start}** (recurse first unused neighbor).`;
  const predict = buildGraphPredict('dfs-predict', 'DFS · tap next', 'dfs', demo, 'enter', rng);
  const pool: LearnExercise[] = [
    mcqFrom(
      rng,
      'dfs-order',
      'Full DFS discovery order?',
      order.join(', '),
      [
        [...order].reverse().join(', '),
        shuffle(rng, [...order]).join(', '),
        order
          .slice()
          .sort((a, b) => a - b)
          .join(', '),
      ],
      `Discovery order: **${order.join(', ')}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'dfs-first',
      `First node entered after ${start}?`,
      String(firstChild ?? start),
      [
        String(g.adj[start]![1] ?? (firstChild ?? 0) + 1),
        String(order[order.length - 1]),
        String(start),
      ],
      `Lowest-id unused neighbor of ${start} is **${firstChild}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'dfs-last',
      'Last node in discovery order?',
      String(order[order.length - 1]),
      [String(order[0]), String(order[1] ?? order[0]), String(start)],
      `Discovery ends at **${order[order.length - 1]}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'dfs-concept',
      'Best default use of DFS among these?',
      'Components / cycles / tree DP',
      ['Fewest edges from source', 'MST', 'Weighted shortest paths'],
      'BFS wins unweighted shortest paths; DFS shines at structure.',
    ),
  ];
  const out: LearnExercise[] = [];
  if (predict) out.push(predict);
  out.push(...samplePool(rng, pool, randInt(rng, 4, pool.length)));
  return out;
}

function genDijkstra(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 6);
  const g = buildTreePlus(rng, n, randInt(rng, 1, 2));
  const weights = new Map<string, number>();
  for (let u = 0; u < n; u++) {
    for (const v of g.adj[u]!) {
      if (u < v) weights.set(edgeKey(u, v), randInt(rng, 1, 9));
    }
  }
  const start = 0;
  const demo = graphToDemo(g, start, weights);
  const dist = dijkstra(g, weights, start);
  const target = randInt(rng, 1, n - 1);
  const d = dist[target]!;
  const hop = g.adj[start]![0] ?? 1;
  const hopW = weights.get(edgeKey(start, hop)) ?? dist[hop]!;
  const ctx = graphContext(g, weights) + `\n\nSource **${start}**. Non-negative weights.`;
  const predict = buildGraphPredict(
    'dij-predict',
    'Dijkstra · tap next',
    'dijkstra',
    demo,
    'settle',
    rng,
  );
  const pool: LearnExercise[] = [
    mcqFrom(
      rng,
      'dij-dist',
      `Shortest distance ${start} → ${target}?`,
      String(d),
      [String(d + 1), String(d + 2), String(Math.max(0, d - 1))],
      `Dijkstra yields dist[${target}] = **${d}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'dij-hop',
      `dist[${hop}] right after relaxing ${start}'s edges?`,
      String(hopW),
      ['0', '∞', String(hopW + 3)],
      'First hop = direct edge weight from the source.',
      ctx,
    ),
    mcqFrom(
      rng,
      'dij-second',
      'Second node Dijkstra settles (after source)?',
      String(
        [...Array(n).keys()]
          .filter((i) => i !== start)
          .sort((a, b) => dist[a]! - dist[b]! || a - b)[0],
      ),
      shuffle(rng, [
        String(target),
        String(n - 1),
        String(g.adj[start]![1] ?? hop),
      ]).slice(0, 3),
      'Settle the unsettled node with smallest tentative distance.',
      ctx,
    ),
    mcqFrom(
      rng,
      'dij-concept',
      'Dijkstra requires…',
      'Non-negative edge weights',
      ['A DAG', 'Unit weights only', 'Negative cycles allowed'],
      'Negative edges break the settle-once invariant — use Bellman-Ford.',
    ),
  ];
  const out: LearnExercise[] = [];
  if (predict) out.push(predict);
  out.push(...samplePool(rng, pool, randInt(rng, 4, pool.length)));
  return out;
}

function genTopo(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 4, 6);
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      if (rng() < 0.45) adj[u]!.push(v);
    }
  }
  for (let i = 0; i + 1 < n; i++) {
    if (!adj[i]!.includes(i + 1)) adj[i]!.push(i + 1);
  }
  for (const list of adj) list.sort((a, b) => a - b);

  const indeg0 = Array(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) indeg0[v]!++;
  const zeros = [...Array(n).keys()].filter((i) => indeg0[i] === 0);
  const indeg = [...indeg0];
  const q: number[] = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) q.push(i);
  const order: number[] = [];
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++]!;
    order.push(u);
    for (const v of adj[u]!) if (--indeg[v]! === 0) q.push(v);
  }

  const edgeStrs: string[] = [];
  for (let u = 0; u < n; u++) for (const v of adj[u]!) edgeStrs.push(`${u}→${v}`);
  const ctx = `Directed edges: \`${edgeStrs.join('`, `')}\`.\n\nKahn’s algorithm (indegree + queue, ties by ascending id).`;

  return samplePool(rng, [
    {
      id: 'topo-gen',
      kind: 'trace' as const,
      title: 'Topo order',
      context_md: ctx,
      steps: [
        makeMcq(rng, {
          prompt: 'A valid Kahn topo order?',
          correct: order.join(', '),
          wrong: [
            [...order].reverse().join(', '),
            shuffle(rng, [...order]).join(', '),
            order
              .slice()
              .sort((a, b) => b - a)
              .join(', '),
          ],
          explain_md: `Kahn with ascending ties: **${order.join(', ')}**.`,
        }),
        makeMcq(rng, {
          prompt: 'Nodes with indegree 0 at the start?',
          correct: zeros.join(', ') || '(none)',
          wrong: [String(order[0]), order.slice(0, 2).join(', '), String(n - 1)],
          explain_md: `Sources: **${zeros.join(', ')}**.`,
        }),
      ],
    },
    mcqFrom(
      rng,
      'topo-first',
      'First node Kahn outputs?',
      String(order[0]),
      [String(order[order.length - 1]), String(n - 1), String(order[1] ?? 0)],
      `Queue starts with indegree-0 nodes; first is **${order[0]}**.`,
      ctx,
    ),
    mcqFrom(
      rng,
      'topo-concept',
      'Topo sort exists iff the digraph is…',
      'A DAG',
      ['A tree', 'Strongly connected', 'Undirected'],
      'A cycle blocks a linear extension.',
    ),
  ], 99);
}

function genBinarySearch(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 7, 10);
  const a: number[] = [];
  let x = randInt(rng, 1, 5);
  for (let i = 0; i < n; i++) {
    x += randInt(rng, 1, 4);
    a.push(x);
  }
  const target = pick(rng, a);
  const miss = a[a.length - 1]! + randInt(rng, 2, 5);
  const lo0 = 0;
  const hi0 = n;
  const mid0 = lo0 + Math.floor((hi0 - lo0) / 2);
  const ctx = `Sorted \`a = [${a.join(', ')}]\`. Find with \`[lo, hi)\`.`;
  return samplePool(
    rng,
    [
      {
        id: 'bs-gen',
        kind: 'trace' as const,
        title: 'Exact search',
        context_md: ctx + ` Target **${target}**.`,
        steps: [
          makeMcq(rng, {
            prompt: `First mid (lo=${lo0}, hi=${hi0})?`,
            correct: `${mid0} (a[mid]=${a[mid0]})`,
            wrong: [
              `${Math.max(0, mid0 - 1)} (a=${a[Math.max(0, mid0 - 1)]})`,
              `${Math.min(n - 1, mid0 + 1)} (a=${a[Math.min(n - 1, mid0 + 1)]})`,
              `${a.indexOf(target)} (final index)`,
            ],
            explain_md: `mid = lo + (hi-lo)/2 = **${mid0}**.`,
          }),
          makeMcq(rng, {
            prompt: `Index of ${target}?`,
            correct: String(a.indexOf(target)),
            wrong: [
              String(lowerBound(a, target)),
              String(Math.max(0, a.indexOf(target) - 1)),
              String(n),
            ],
            explain_md: `Found at **${a.indexOf(target)}**.`,
          }),
        ],
      },
      mcqFrom(
        rng,
        'bs-miss',
        `Is ${miss} in the array?`,
        'No',
        ['Yes', 'Only as lower_bound', 'Only if unique'],
        `\`${miss}\` is past the last element.`,
        ctx,
      ),
      mcqFrom(
        rng,
        'bs-concept',
        'Binary search needs the predicate / array to be…',
        'Monotone (sorted / ok flips once)',
        ['Randomly ordered', 'A binary tree', 'Unimodal only'],
        'One transition false→true (or sorted order) is the invariant.',
      ),
    ],
    99,
  );
}

function lowerBound(a: number[], x: number): number {
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid]! < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function upperBound(a: number[], x: number): number {
  let lo = 0;
  let hi = a.length;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (a[mid]! <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function genLowerBound(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 6, 9);
  const a: number[] = [];
  let x = randInt(rng, 1, 3);
  for (let i = 0; i < n; i++) {
    if (i && rng() < 0.35) a.push(a[i - 1]!);
    else {
      x += randInt(rng, 1, 3);
      a.push(x);
    }
  }
  const query = pick(rng, a);
  const lb = lowerBound(a, query);
  const miss = query + 1;
  const lbMiss = lowerBound(a, miss);
  return [
    {
      id: 'lb-gen',
      kind: 'trace',
      title: 'Lower bound',
      context_md: `\`a = [${a.join(', ')}]\`. lower_bound = first \`a[i] ≥ x\`.`,
      steps: [
        makeMcq(rng, {
          prompt: `lower_bound(${query})?`,
          correct: String(lb),
          wrong: [String(lb + 1), String(Math.max(0, lb - 1)), String(upperBound(a, query))],
          explain_md: `First index with a[i] ≥ ${query} is **${lb}**.`,
        }),
        makeMcq(rng, {
          prompt: `lower_bound(${miss})?`,
          correct: String(lbMiss),
          wrong: [String(lb), String(Math.min(n, lbMiss + 1)), String(0)],
          explain_md: `First ≥ ${miss} is index **${lbMiss}**.`,
        }),
      ],
    },
  ];
}

function genUpperBound(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 6, 9);
  const a: number[] = [];
  let x = randInt(rng, 1, 3);
  for (let i = 0; i < n; i++) {
    if (i && rng() < 0.4) a.push(a[i - 1]!);
    else {
      x += randInt(rng, 1, 3);
      a.push(x);
    }
  }
  const query = pick(rng, a);
  const lb = lowerBound(a, query);
  const ub = upperBound(a, query);
  return [
    {
      id: 'ub-gen',
      kind: 'trace',
      title: 'Upper bound',
      context_md: `\`a = [${a.join(', ')}]\`. count(x) = upper − lower.`,
      steps: [
        makeMcq(rng, {
          prompt: `Count of ${query}?`,
          correct: String(ub - lb),
          wrong: [String(ub - lb + 1), String(Math.max(0, ub - lb - 1)), String(ub)],
          explain_md: `upper=${ub}, lower=${lb} → **${ub - lb}**.`,
        }),
      ],
    },
  ];
}

function genPrefix(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 9));
  const pref = [0];
  for (const v of a) pref.push(pref[pref.length - 1]! + v);
  const r = randInt(rng, 2, n);
  const l = randInt(rng, 0, r - 1);
  const sum = pref[r]! - pref[l]!;
  return [
    {
      id: 'pref-gen',
      kind: 'trace',
      title: 'Prefix sums',
      context_md: `\`a = [${a.join(', ')}]\`, \`pref[0]=0\`, \`pref[i+1]=pref[i]+a[i]\`.`,
      steps: [
        makeMcq(rng, {
          prompt: `pref[${r}]?`,
          correct: String(pref[r]),
          wrong: [String(pref[r]! + 1), String(pref[r]! - a[r - 1]!), String(a[r - 1]!)],
          explain_md: `Sum of a[0..${r}) = **${pref[r]}**.`,
        }),
        makeMcq(rng, {
          prompt: `sum a[${l}..${r}) = pref[${r}]-pref[${l}]?`,
          correct: String(sum),
          wrong: [String(sum + 1), String(pref[r]), String(Math.abs(sum - 2))],
          explain_md: `${pref[r]} − ${pref[l]} = **${sum}**.`,
        }),
      ],
    },
  ];
}

function genKnapsack(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 3, 4);
  const W = randInt(rng, 7, 11);
  const w = Array.from({ length: n }, () => randInt(rng, 2, 5));
  const v = Array.from({ length: n }, () => randInt(rng, 2, 8));
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let tw = 0;
    let tv = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        tw += w[i]!;
        tv += v[i]!;
      }
    }
    if (tw <= W) best = Math.max(best, tv);
  }
  const items = w.map((wi, i) => `(${wi},${v[i]})`).join(', ');
  return [
    mcqFrom(
      rng,
      'ks-gen',
      `Items (w,v): ${items}. Capacity ${W}. Best 0/1 value?`,
      String(best),
      [String(best + 1), String(Math.max(0, best - 1)), String(best + 2)],
      `Brute-force subsets → **${best}**.`,
    ),
  ];
}

function genTwoPointers(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 5));
  const budget = randInt(rng, 5, 12);
  let best = 0;
  let l = 0;
  let sum = 0;
  for (let r = 0; r < n; r++) {
    sum += a[r]!;
    while (sum > budget) sum -= a[l++]!;
    best = Math.max(best, r - l + 1);
  }
  return [
    mcqFrom(
      rng,
      'tp-gen',
      `Non-negative a=[${a.join(', ')}], budget ${budget}. Longest subarray sum ≤ budget?`,
      String(best),
      [String(best + 1), String(Math.max(0, best - 1)), String(n)],
      `Sliding window max length = **${best}**.`,
    ),
  ];
}

function genLis(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 9));
  const dp = Array(n).fill(1);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) if (a[j]! < a[i]!) dp[i] = Math.max(dp[i]!, dp[j]! + 1);
  }
  const ans = Math.max(...dp);
  return [
    mcqFrom(
      rng,
      'lis-gen',
      `LIS length of [${a.join(', ')}]?`,
      String(ans),
      [String(ans + 1), String(Math.max(1, ans - 1)), String(n)],
      `O(N²) DP → **${ans}**.`,
    ),
  ];
}

function genCoordCompress(rng: Rng): LearnExercise[] {
  const raw = Array.from({ length: 4 }, () => randInt(rng, 1, 20));
  // force a duplicate sometimes
  if (rng() < 0.7) raw[2] = raw[0]!;
  const uniq = [...new Set(raw)].sort((a, b) => a - b);
  const ranks = raw.map((x) => uniq.indexOf(x));
  return [
    mcqFrom(
      rng,
      'cc-gen',
      `Compress [${raw.join(', ')}] to dense ranks.`,
      `[${ranks.join(', ')}]`,
      [
        `[${ranks.map((r) => r + 1).join(', ')}]`,
        `[${[...ranks].reverse().join(', ')}]`,
        `[${raw.join(', ')}]`,
      ],
      `Unique sorted [${uniq.join(', ')}] → **[${ranks.join(', ')}]**.`,
    ),
  ];
}

function genDsu(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 6);
  const ops: [number, number][] = [];
  for (let i = 0; i < n - 2; i++) {
    ops.push([randInt(rng, 0, n - 1), randInt(rng, 0, n - 1)]);
  }
  const p = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (p[x] === x ? x : (p[x] = find(p[x]!)));
  const unite = (a: number, b: number) => {
    a = find(a);
    b = find(b);
    if (a !== b) p[b] = a;
  };
  for (const [a, b] of ops) unite(a, b);
  const x = 0;
  const y = n - 1;
  const same = find(x) === find(y);
  const opStr = ops.map(([a, b]) => `unite(${a},${b})`).join(', ');
  return [
    mcqFrom(
      rng,
      'dsu-gen',
      `After ${opStr}: same(${x},${y})?`,
      same ? 'true' : 'false',
      [same ? 'false' : 'true', 'undefined', 'only if x==y'],
      `DSU find roots → **${same}**.`,
      `n = ${n} elements.`,
    ),
  ];
}

function genSieve(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 12, 30);
  const prime = Array(n + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (!prime[i]) continue;
    for (let j = i * i; j <= n; j += i) prime[j] = false;
  }
  const count = prime.reduce((a, p) => a + (p ? 1 : 0), 0);
  const firstMark = 4; // always first composite from p=2
  return [
    mcqFrom(
      rng,
      'sieve-gen',
      `How many primes ≤ ${n}?`,
      String(count),
      [String(count + 1), String(Math.max(0, count - 1)), String(count + 2)],
      `Sieve of Eratosthenes up to ${n} → **${count}**.`,
    ),
    mcqFrom(
      rng,
      'sieve-mark',
      'When p=2, first composite marked from p² is…',
      String(firstMark),
      ['2', '3', '6'],
      'Start at p²=4, then 6, 8, …',
    ),
  ];
}

function gcd(a: number, b: number): number {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return Math.abs(a);
}

function genNumberTheory(rng: Rng): LearnExercise[] {
  let a = randInt(rng, 20, 90);
  let b = randInt(rng, 10, 60);
  const g = gcd(a, b);
  const r1 = a % b;
  return [
    {
      id: 'nt-gen-euclid',
      kind: 'trace',
      title: 'Euclid',
      context_md: `Compute \`gcd(${a}, ${b})\`.`,
      steps: [
        makeMcq(rng, {
          prompt: `First remainder ${a} % ${b}?`,
          correct: String(r1),
          wrong: [String((r1 + 1) % b), String(b % Math.max(1, r1 || 1)), String(g)],
          explain_md: `${a} = q·${b} + **${r1}**.`,
        }),
        makeMcq(rng, {
          prompt: `Final gcd(${a}, ${b})?`,
          correct: String(g),
          wrong: [String(g + 1), String(Math.max(1, g - 1)), String(a)],
          explain_md: `Euclid terminates at **${g}**.`,
        }),
      ],
    },
    mcqFrom(
      rng,
      'nt-gen-lcm',
      `lcm(${a}, ${b}) = a·b/gcd = ?`,
      String((a / g) * b),
      [String(a * b), String(g), String(a + b)],
      `lcm = ${a}·${b}/${g} = **${(a / g) * b}**.`,
    ),
  ];
}

function genGeometryBasics(rng: Rng): LearnExercise[] {
  const ax = 0;
  const ay = 0;
  const bx = randInt(rng, 2, 5);
  const by = 0;
  const cx = randInt(rng, 1, 4);
  const cy = randInt(rng, 1, 4) * (rng() < 0.5 ? 1 : -1);
  const cross = bx * cy - by * cx;
  const orient = cross > 0 ? 'left' : cross < 0 ? 'right' : 'collinear';
  return [
    {
      id: 'geo-gen-orient',
      kind: 'trace',
      title: 'Orientation',
      context_md: `A=(${ax},${ay}), B=(${bx},${by}), C=(${cx},${cy}).`,
      steps: [
        makeMcq(rng, {
          prompt: 'cross (B−A)×(C−A)?',
          correct: String(cross),
          wrong: [String(-cross), String(cross + 1), '0'],
          explain_md: `${bx}·${cy} − ${by}·${cx} = **${cross}**.`,
        }),
        makeMcq(rng, {
          prompt: 'Turn at A toward C is…',
          correct: orient,
          wrong: ['left', 'right', 'collinear'].filter((x) => x !== orient).concat(['up']),
          explain_md: `Sign of cross → **${orient}**.`,
        }),
      ],
    },
  ];
}

function genTernary(rng: Rng): LearnExercise[] {
  // unimodal: decrease then increase — find min index
  const n = randInt(rng, 7, 10);
  const mid = randInt(rng, 2, n - 3);
  const a: number[] = [];
  let v = randInt(rng, 8, 15);
  for (let i = 0; i < n; i++) {
    if (i <= mid) {
      a.push(v);
      v -= randInt(rng, 1, 3);
    } else {
      v += randInt(rng, 1, 3);
      a.push(v);
    }
  }
  let best = 0;
  for (let i = 1; i < n; i++) if (a[i]! < a[best]!) best = i;
  return [
    {
      id: 'ter-gen',
      kind: 'trace',
      title: 'Unimodal min',
      context_md: `Unimodal array \`a = [${a.join(', ')}]\` (decreases then increases).`,
      steps: [
        makeMcq(rng, {
          prompt: 'Index of the minimum?',
          correct: String(best),
          wrong: [String(Math.max(0, best - 1)), String(Math.min(n - 1, best + 1)), String(0)],
          explain_md: `Minimum value ${a[best]} at index **${best}**.`,
        }),
      ],
    },
  ];
}

function genStack(rng: Rng): LearnExercise[] {
  const stack: number[] = [];
  const ops: string[] = [];
  for (let i = 0; i < 5; i++) {
    if (!stack.length || rng() < 0.65) {
      const x = randInt(rng, 1, 9);
      stack.push(x);
      ops.push(`push ${x}`);
    } else {
      stack.pop();
      ops.push('pop');
    }
  }
  const top = stack.length ? String(stack[stack.length - 1]) : 'empty';
  return [
    {
      id: 'stack-gen',
      kind: 'trace',
      title: 'Stack ops',
      context_md: `Start empty. Ops: ${ops.join(', ')}.`,
      steps: [
        makeMcq(rng, {
          prompt: 'Top after these ops?',
          correct: top,
          wrong: ['empty', String(randInt(rng, 1, 9)), String(stack[0] ?? 0)].filter(
            (x, i, a) => a.indexOf(x) === i && x !== top,
          ),
          explain_md: `LIFO → top is **${top}**.`,
        }),
      ],
    },
  ];
}

function genQueue(rng: Rng): LearnExercise[] {
  const q: number[] = [];
  const ops: string[] = [];
  for (let i = 0; i < 5; i++) {
    if (!q.length || rng() < 0.65) {
      const x = randInt(rng, 1, 9);
      q.push(x);
      ops.push(`push ${x}`);
    } else {
      q.shift();
      ops.push('pop');
    }
  }
  const front = q.length ? String(q[0]) : 'empty';
  return [
    {
      id: 'queue-gen',
      kind: 'trace',
      title: 'Queue ops',
      context_md: `Start empty. Ops: ${ops.join(', ')}.`,
      steps: [
        makeMcq(rng, {
          prompt: 'Front after these ops?',
          correct: front,
          wrong: ['empty', String(randInt(rng, 1, 9)), String(q[q.length - 1] ?? 0)].filter(
            (x, i, a) => a.indexOf(x) === i && x !== front,
          ),
          explain_md: `FIFO → front is **${front}**.`,
        }),
      ],
    },
  ];
}

function genNim(rng: Rng): LearnExercise[] {
  const heaps = Array.from({ length: randInt(rng, 3, 4) }, () => randInt(rng, 1, 7));
  const x = heaps.reduce((a, b) => a ^ b, 0);
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'nim-gen',
        `Nim heaps [${heaps.join(', ')}]. XOR?`,
        String(x),
        [String(x ^ 1), String(x ^ 2), String(heaps[0])],
        `${heaps.join(' ⊕ ')} = **${x}**${x === 0 ? ' (second wins)' : ' (first wins)'}.`,
      ),
      mcqFrom(
        rng,
        'nim-winner',
        `With XOR=${x}, who wins with optimal play?`,
        x === 0 ? 'Second' : 'First',
        [x === 0 ? 'First' : 'Second', 'Always first', 'Draw'],
        x === 0 ? 'XOR 0 is a losing position for the player to move.' : 'Non-zero XOR → first can move to 0.',
      ),
      mcqFrom(
        rng,
        'nim-concept',
        'Nimber / grundy for a heap of size k is…',
        'k itself',
        ['0 always', 'k mod 2', '2^k'],
        'Single Nim heap grundy = size.',
      ),
    ],
    99,
  );
}

function genMitm(rng: Rng): LearnExercise[] {
  const n = 6;
  const a = Array.from({ length: n }, () => randInt(rng, 1, 8));
  const target = a.slice(0, 3).reduce((s, x) => s + x, 0) + (rng() < 0.5 ? 0 : randInt(rng, 1, 3));
  let ok = false;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += a[i]!;
    if (s === target) {
      ok = true;
      break;
    }
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'mitm-gen',
        `Subset of [${a.join(', ')}] summing to ${target}?`,
        ok ? 'Yes' : 'No',
        [ok ? 'No' : 'Yes', 'Only if sorted', 'Impossible to know'],
        `Enumerate $2^{${n}}$ → **${ok ? 'Yes' : 'No'}**.`,
      ),
      mcqFrom(
        rng,
        'mitm-split',
        'Meet-in-the-middle for N=40 typically splits into halves of size…',
        '20 + 20',
        ['40 + 0', '10 + 30', '5 + 35'],
        '$2^{20}$ per half is the usual tradeoff.',
      ),
      mcqFrom(
        rng,
        'mitm-concept',
        'MITM beats naive $2^N$ when…',
        'You can split and match halves',
        ['N ≤ 10 only', 'The array is sorted', 'You need online queries'],
        'Trade $2^{N/2}$ time + memory for the join step.',
      ),
    ],
    99,
  );
}

function genHashMap(rng: Rng): LearnExercise[] {
  const a = Array.from({ length: 6 }, () => randInt(rng, 1, 5));
  const freq = new Map<number, number>();
  for (const x of a) freq.set(x, (freq.get(x) ?? 0) + 1);
  const key = pick(rng, a);
  const ans = freq.get(key)!;
  const distinct = freq.size;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'hm-gen',
        `Frequency of ${key} in [${a.join(', ')}]?`,
        String(ans),
        [String(ans + 1), String(Math.max(0, ans - 1)), '0'],
        `Hash map count → **${ans}**.`,
      ),
      mcqFrom(
        rng,
        'hm-distinct',
        `How many distinct values in [${a.join(', ')}]?`,
        String(distinct),
        [String(distinct + 1), String(Math.max(1, distinct - 1)), String(a.length)],
        `Map size = **${distinct}**.`,
      ),
      mcqFrom(
        rng,
        'hm-concept',
        'Adversarial tests on unordered_map often push you to…',
        'Custom hash or std::map',
        ['More buckets only', 'Sort the keys first', 'Use float keys'],
        'CF anti-hash: custom splitmix or ordered map.',
      ),
    ],
    99,
  );
}

function genSorting(rng: Rng): LearnExercise[] {
  const a = Array.from({ length: randInt(rng, 5, 7) }, () => randInt(rng, 1, 20));
  const sorted = [...a].sort((x, y) => x - y);
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'sort-out',
        `Sorted order of [${a.join(', ')}]?`,
        sorted.join(', '),
        [
          [...sorted].reverse().join(', '),
          shuffle(rng, [...a]).join(', '),
          a.join(', '),
        ],
        `Ascending: **${sorted.join(', ')}**.`,
      ),
      mcqFrom(
        rng,
        'sort-stable',
        'stable_sort is preferred when…',
        'Equal keys must keep input order',
        ['You need worst-case O(N)', 'Keys are unique', 'You sort floats'],
        'Stability preserves ties across multi-key passes.',
      ),
      mcqFrom(
        rng,
        'sort-cmp',
        'A comparator must be a…',
        'Strict weak ordering',
        ['≤ relation', 'Random shuffle', 'Hash equality'],
        '`cmp(a,a)` false; never both cmp(a,b) and cmp(b,a).',
      ),
    ],
    99,
  );
}

function genMst(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 4, 5);
  const g = buildTreePlus(rng, n, randInt(rng, 1, 2));
  const weights = new Map<string, number>();
  const edges: { u: number; v: number; w: number }[] = [];
  for (let u = 0; u < n; u++) {
    for (const v of g.adj[u]!) {
      if (u < v) {
        const w = randInt(rng, 1, 9);
        weights.set(edgeKey(u, v), w);
        edges.push({ u, v, w });
      }
    }
  }
  edges.sort((a, b) => a.w - b.w || a.u - b.u || a.v - b.v);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  let cost = 0;
  let taken = 0;
  const used: string[] = [];
  for (const e of edges) {
    const a = find(e.u);
    const b = find(e.v);
    if (a === b) continue;
    parent[a] = b;
    cost += e.w;
    used.push(`${e.u}-${e.v}`);
    if (++taken === n - 1) break;
  }
  const ctx = graphContext(g, weights) + '\n\nKruskal: sort edges, skip cycles.';
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'mst-cost',
        'MST total weight?',
        String(cost),
        [String(cost + 1), String(cost + 2), String(Math.max(0, cost - 1))],
        `Kruskal takes edges totaling **${cost}**.`,
        ctx,
      ),
      mcqFrom(
        rng,
        'mst-first',
        'First edge Kruskal accepts?',
        used[0] ?? 'none',
        [edges[edges.length - 1] ? `${edges[edges.length - 1]!.u}-${edges[edges.length - 1]!.v}` : '0-1', 'heaviest edge', `${startSafe(edges)}`],
        `Lightest non-cycle edge first → **${used[0]}**.`,
        ctx,
      ),
      mcqFrom(
        rng,
        'mst-concept',
        'Kruskal needs a…',
        'DSU / Union-Find',
        ['Priority queue only', 'Topo sort', 'BFS layers'],
        'Union-Find detects whether an edge closes a cycle.',
      ),
    ],
    99,
  );
}

function startSafe(edges: { u: number; v: number }[]): string {
  return edges[0] ? `${edges[0].u}-${edges[0].v}` : '0-1';
}

function genFenwickDrill(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 9));
  const pref = [0];
  for (const x of a) pref.push(pref[pref.length - 1]! + x);
  const r = randInt(rng, 2, n);
  const l = randInt(rng, 0, r - 1);
  const sum = pref[r]! - pref[l]!;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'ft-sum',
        `a=[${a.join(', ')}] (0-based). sum[${l}..${r})?`,
        String(sum),
        [String(sum + a[l]!), String(Math.max(0, sum - 1)), String(pref[r])],
        `pref[${r}]-pref[${l}] = **${sum}**.`,
      ),
      mcqFrom(
        rng,
        'ft-concept',
        'Fenwick point update + prefix sum is…',
        'O(log N) each',
        ['O(1) update', 'O(N) query always', 'O(N log N) both'],
        '`i += i&-i` / `i -= i&-i` walk O(log N) nodes.',
      ),
      mcqFrom(
        rng,
        'ft-vs',
        'Prefer Fenwick over segtree when…',
        'Only invertible prefix ops (sum)',
        ['You need lazy range assign', 'Op is not invertible', 'You need RMQ only'],
        'Lazy / non-invertible combines → segtree.',
      ),
    ],
    99,
  );
}

function genKmpDrill(rng: Rng): LearnExercise[] {
  const pats = ['aba', 'aab', 'abab', 'aaa', 'ab'];
  const pat = pick(rng, pats);
  const pi = Array(pat.length).fill(0);
  for (let i = 1; i < pat.length; i++) {
    let j = pi[i - 1]!;
    while (j > 0 && pat[i] !== pat[j]) j = pi[j - 1]!;
    if (pat[i] === pat[j]) j++;
    pi[i] = j;
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'kmp-pi',
        `π array for pattern "${pat}"?`,
        pi.join(', '),
        [
          pi.map((x) => Math.max(0, x - 1)).join(', '),
          [...pi].reverse().join(', '),
          Array(pat.length).fill(0).join(', '),
        ],
        `Prefix function: **${pi.join(', ')}**.`,
      ),
      mcqFrom(
        rng,
        'kmp-concept',
        'KMP matching is…',
        'O(N + M)',
        ['O(NM) always', 'O(N log M)', 'O(M²)'],
        'π automaton advances/fails in amortized O(1) per char.',
      ),
    ],
    2,
  );
}

function genZDrill(rng: Rng): LearnExercise[] {
  const s = pick(rng, ['aabaa', 'abacaba', 'aaaa', 'abcab']);
  const n = s.length;
  const z = Array(n).fill(0);
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]!);
    while (i + z[i]! < n && s[z[i]!] === s[i + z[i]!]) z[i]!++;
    if (i + z[i]! - 1 > r) {
      l = i;
      r = i + z[i]! - 1;
    }
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'z-arr',
        `Z-array for "${s}" (z[0]=0)?`,
        z.join(', '),
        [
          [...z].reverse().join(', '),
          z.map((x) => x + 1).join(', '),
          Array(n).fill(0).join(', '),
        ],
        `Z: **${z.join(', ')}**.`,
      ),
      mcqFrom(
        rng,
        'z-concept',
        'z[i] is the longest substring from i that…',
        'Matches a prefix of s',
        ['Is a palindrome', 'Is unique', 'Matches a suffix only'],
        'Classic Z-box definition.',
      ),
    ],
    2,
  );
}

function genGreedyDrill(rng: Rng): LearnExercise[] {
  const intervals = Array.from({ length: randInt(rng, 4, 6) }, (_, i) => {
    const s = randInt(rng, 0, 8);
    return { s, e: s + randInt(rng, 1, 4), i };
  });
  const sorted = [...intervals].sort((a, b) => a.e - b.e || a.s - b.s);
  let end = -Infinity;
  let take = 0;
  for (const it of sorted) {
    if (it.s >= end) {
      take++;
      end = it.e;
    }
  }
  const label = intervals.map((it) => `[${it.s},${it.e}]`).join(', ');
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'gr-int',
        `Max non-overlapping among ${label}?`,
        String(take),
        [String(take + 1), String(Math.max(1, take - 1)), String(intervals.length)],
        'Sort by end time; take if start ≥ last end.',
      ),
      mcqFrom(
        rng,
        'gr-concept',
        'Interval scheduling greedy sorts by…',
        'End time',
        ['Start time', 'Length', 'Random'],
        'Earliest finish leaves the most room.',
      ),
    ],
    2,
  );
}

function genBsAnswer(rng: Rng): LearnExercise[] {
  const threshold = randInt(rng, 3, 8);
  const lo0 = 0;
  const hi0 = 16;
  const mid0 = lo0 + Math.floor((hi0 - lo0) / 2);
  const ok = (x: number) => x >= threshold;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'bsa-mid',
        `ok(x)=true iff x≥${threshold}. First mid on [0,16]?`,
        String(mid0),
        [String(threshold), String(hi0), String(Math.floor(hi0 / 4))],
        `mid = 0+(16-0)/2 = **${mid0}**.`,
      ),
      mcqFrom(
        rng,
        'bsa-move',
        `ok(${mid0}) is ${ok(mid0)}. Min-feasible template does…`,
        ok(mid0) ? 'hi = mid' : 'lo = mid + 1',
        [ok(mid0) ? 'lo = mid + 1' : 'hi = mid', 'return mid', 'hi = mid - 1'],
        'Feasible → shrink hi; infeasible → raise lo.',
      ),
      mcqFrom(
        rng,
        'bsa-ans',
        `Minimum feasible x on [0,16]?`,
        String(threshold),
        [String(threshold - 1), String(threshold + 1), String(mid0)],
        `First true is **${threshold}**.`,
      ),
    ],
    99,
  );
}

function genDiffArray(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 6, 8);
  const d = Array(n + 1).fill(0);
  const updates: [number, number, number][] = [];
  for (let k = 0; k < randInt(rng, 2, 3); k++) {
    const l = randInt(rng, 0, n - 2);
    const r = randInt(rng, l + 1, n - 1);
    const v = randInt(rng, 1, 5);
    d[l] += v;
    d[r] -= v;
    updates.push([l, r, v]);
  }
  const a = Array(n).fill(0);
  let run = 0;
  for (let i = 0; i < n; i++) {
    run += d[i]!;
    a[i] = run;
  }
  const ctx = `n=${n}. Range adds: ${updates.map(([l, r, v]) => `+${v} on [${l},${r})`).join('; ')}.`;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'diff-arr',
        'Array after applying difference updates?',
        a.join(', '),
        [
          d.slice(0, n).join(', '),
          shuffle(rng, [...a]).join(', '),
          a.map((x) => x + 1).join(', '),
        ],
        `Prefix of diff → **${a.join(', ')}**.`,
        ctx,
      ),
      mcqFrom(
        rng,
        'diff-concept',
        'To add +v on [l,r) with a diff array…',
        'd[l]+=v; d[r]-=v',
        ['d[l]+=v; d[r]+=v', 'Only d[l]+=v', 'Rebuild the whole array each time'],
        'Then one prefix pass materializes.',
      ),
    ],
    2,
  );
}

function genLisDrill(rng: Rng): LearnExercise[] {
  const a = Array.from({ length: randInt(rng, 6, 8) }, () => randInt(rng, 1, 12));
  const tails: number[] = [];
  for (const x of a) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'lis-len',
        `LIS length of [${a.join(', ')}]?`,
        String(tails.length),
        [String(tails.length + 1), String(Math.max(1, tails.length - 1)), String(a.length)],
        `Patience / tails → **${tails.length}**.`,
      ),
      mcqFrom(
        rng,
        'lis-concept',
        'O(N log N) LIS maintains…',
        'Tails of increasing subsequences',
        ['A Fenwick of edges', 'Only the last element', 'A max-heap of indices'],
        'tails[k] = smallest tail of an IS of length k+1.',
      ),
    ],
    2,
  );
}

function genPrefixMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 9));
  const pref = [0];
  for (const x of a) pref.push(pref[pref.length - 1]! + x);
  const r = randInt(rng, 2, n);
  const l = randInt(rng, 0, r - 1);
  const sum = pref[r]! - pref[l]!;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'pref-sum',
        `a=[${a.join(', ')}]. sum[${l}..${r})?`,
        String(sum),
        [String(sum + 1), String(pref[r]), String(Math.max(0, sum - a[l]!))],
        `pref[${r}]-pref[${l}] = **${sum}**.`,
      ),
      mcqFrom(
        rng,
        'pref-build',
        `pref[${Math.min(n, 3)}] for a=[${a.join(', ')}] (pref[0]=0)?`,
        String(pref[Math.min(n, 3)]),
        [String(a[0]), String(pref[Math.min(n, 3)]! + 1), String(a.slice(0, 3).reduce((s, x) => s + x, 0) - 1)],
        `Running sum → **${pref[Math.min(n, 3)]}**.`,
      ),
      mcqFrom(
        rng,
        'pref-concept',
        'Prefix sums shine for…',
        'Static range sum queries',
        ['Point updates mixed in', 'Online graph search', 'String matching'],
        'Point updates → Fenwick/segtree; static → prefix.',
      ),
    ],
    99,
  );
}

function genKnapsackMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 3, 4);
  const w = Array.from({ length: n }, () => randInt(rng, 1, 5));
  const v = Array.from({ length: n }, () => randInt(rng, 2, 8));
  const W = randInt(rng, 5, 10);
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < n; i++) {
    for (let cap = W; cap >= w[i]!; cap--) {
      dp[cap] = Math.max(dp[cap]!, dp[cap - w[i]!]! + v[i]!);
    }
  }
  const ctx = `0/1 knapsack: w=[${w.join(', ')}], v=[${v.join(', ')}], W=${W}.`;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'kn-opt',
        'Optimal value?',
        String(dp[W]),
        [String(dp[W]! + 1), String(Math.max(0, dp[W]! - 1)), String(v.reduce((s, x) => s + x, 0))],
        `DP → **${dp[W]}**.`,
        ctx,
      ),
      mcqFrom(
        rng,
        'kn-loop',
        '0/1 rolling knapsack loops capacity…',
        'High → low',
        ['Low → high', 'Random order', 'Only once at W'],
        'Descending prevents reusing an item.',
      ),
    ],
    2,
  );
}

function genTwoPointersMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 6, 8);
  const a: number[] = [];
  let x = randInt(rng, 1, 3);
  for (let i = 0; i < n; i++) {
    x += randInt(rng, 1, 4);
    a.push(x);
  }
  const target = a[1]! + a[n - 2]!;
  let lo = 0;
  let hi = n - 1;
  let found = false;
  while (lo < hi) {
    const s = a[lo]! + a[hi]!;
    if (s === target) {
      found = true;
      break;
    }
    if (s < target) lo++;
    else hi--;
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'tp-pair',
        `Sorted [${a.join(', ')}]. Pair summing to ${target}?`,
        found ? 'Yes' : 'No',
        [found ? 'No' : 'Yes', 'Only with hash map', 'Need N²'],
        `Two pointers → **${found ? 'Yes' : 'No'}**.`,
      ),
      mcqFrom(
        rng,
        'tp-concept',
        'Opposite-ends two pointers need the array…',
        'Sorted (or monotone)',
        ['Random', 'A permutation of 1..N only', 'Binary tree ordered'],
        'Monotone sum guides which pointer moves.',
      ),
    ],
    2,
  );
}

function genDsuMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => (parent[x] === x ? x : (parent[x] = find(parent[x]!)));
  const ops: string[] = [];
  for (let k = 0; k < randInt(rng, 3, 5); k++) {
    const a = randInt(rng, 0, n - 1);
    const b = randInt(rng, 0, n - 1);
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      ops.push(`union(${a},${b})`);
    } else ops.push(`union(${a},${b}) [nop]`);
  }
  const comps = new Set([...Array(n).keys()].map(find)).size;
  const x = randInt(rng, 0, n - 1);
  const y = randInt(rng, 0, n - 1);
  const same = find(x) === find(y);
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'dsu-comp',
        `After ${ops.join(', ')} on ${n} nodes — component count?`,
        String(comps),
        [String(comps + 1), String(Math.max(1, comps - 1)), String(n)],
        `DSU ends with **${comps}** components.`,
      ),
      mcqFrom(
        rng,
        'dsu-same',
        `Same set: ${x} and ${y}?`,
        same ? 'Yes' : 'No',
        [same ? 'No' : 'Yes', 'Always', 'Never'],
        `find(${x}) ${same ? '=' : '≠'} find(${y}).`,
      ),
      mcqFrom(
        rng,
        'dsu-concept',
        'Path compression + union by rank is…',
        'Almost O(1) amortized',
        ['O(N) per find', 'O(log log N) worst only without both', 'O(N²)'],
        'Ackermann inverse α(n) in practice constant.',
      ),
    ],
    99,
  );
}

function genSieveMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 20, 40);
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= n; j += i) isPrime[j] = false;
  }
  const primes = [...Array(n + 1).keys()].filter((i) => isPrime[i]);
  const q = randInt(rng, 2, n);
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'sv-count',
        `# primes ≤ ${n}?`,
        String(primes.length),
        [String(primes.length + 1), String(Math.max(0, primes.length - 1)), String(n)],
        `π(${n}) = **${primes.length}** here.`,
      ),
      mcqFrom(
        rng,
        'sv-q',
        `Is ${q} prime?`,
        isPrime[q] ? 'Yes' : 'No',
        [isPrime[q] ? 'No' : 'Yes', 'Only if odd', 'Need pollard'],
        isPrime[q] ? `${q} survives the sieve.` : `${q} is marked composite.`,
      ),
    ],
    2,
  );
}

function genStackMore(rng: Rng): LearnExercise[] {
  return [...genStack(rng), ...samplePool(rng, [
    mcqFrom(
      rng,
      'st-concept',
      'Monotonic stack is often used for…',
      'Next greater / smaller element',
      ['Shortest paths', 'MST', 'String hashing'],
      'Maintain increasing/decreasing candidates.',
    ),
  ], 1)];
}

function genQueueMore(rng: Rng): LearnExercise[] {
  return [...genQueue(rng), ...samplePool(rng, [
    mcqFrom(
      rng,
      'qu-concept',
      'BFS uses a queue because…',
      'FIFO matches layer order',
      ['LIFO is shorter', 'Random order works', 'Stacks store distances'],
      'Earlier discovered nodes expand first.',
    ),
  ], 1)];
}

function genCoordMore(rng: Rng): LearnExercise[] {
  const raw = Array.from({ length: randInt(rng, 5, 7) }, () => randInt(rng, 1, 1000));
  const uniq = [...new Set(raw)].sort((a, b) => a - b);
  const rank = raw.map((x) => uniq.indexOf(x));
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'cc-map',
        `Compress [${raw.join(', ')}] → ranks?`,
        rank.join(', '),
        [
          raw.join(', '),
          shuffle(rng, [...rank]).join(', '),
          rank.map((x) => x + 1).join(', '),
        ],
        `Unique sorted → **${rank.join(', ')}**.`,
      ),
      mcqFrom(
        rng,
        'cc-u',
        `How many unique values?`,
        String(uniq.length),
        [String(raw.length), String(uniq.length + 1), String(Math.max(1, uniq.length - 1))],
        `U = **${uniq.length}**.`,
      ),
    ],
    2,
  );
}

function genNumberTheoryMore(rng: Rng): LearnExercise[] {
  const a = randInt(rng, 20, 90);
  const b = randInt(rng, 12, 60);
  let x = a;
  let y = b;
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  const g = x;
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'nt-gcd',
        `gcd(${a}, ${b})?`,
        String(g),
        [String(g + 1), String(Math.max(1, g - 1)), String(a % b)],
        `Euclid → **${g}**.`,
      ),
      mcqFrom(
        rng,
        'nt-lcm',
        `lcm(${a}, ${b})?`,
        String((a / g) * b),
        [String(a * b), String(a + b), String(g)],
        `lcm = ab/gcd = **${(a / g) * b}**.`,
      ),
      mcqFrom(
        rng,
        'nt-inv',
        'Modular inverse of a mod p (p prime) via Fermat…',
        'a^{p-2} mod p',
        ['a^{p} mod p', 'a/2', 'gcd only'],
        'a^{p-1}≡1 → multiply by a^{p-2}.',
      ),
    ],
    99,
  );
}

function genGeometryMore(rng: Rng): LearnExercise[] {
  const ax = randInt(rng, 0, 5);
  const ay = randInt(rng, 0, 5);
  const bx = randInt(rng, 1, 6);
  const by = randInt(rng, 0, 6);
  const cx = randInt(rng, 0, 6);
  const cy = randInt(rng, 1, 6);
  const cross = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  const orient = cross > 0 ? 'left / CCW' : cross < 0 ? 'right / CW' : 'collinear';
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'geo-cross',
        `A(${ax},${ay}) B(${bx},${by}) C(${cx},${cy}). Orientation of turn ABC?`,
        orient,
        shuffle(rng, ['left / CCW', 'right / CW', 'collinear']).filter((x) => x !== orient).concat(['undefined']),
        `cross = **${cross}** → ${orient}.`,
      ),
      mcqFrom(
        rng,
        'geo-concept',
        'Cross product sign for 2D orientation is…',
        '(B-A)×(C-A)',
        ['Dot product only', 'Manhattan distance', 'Area of AABB'],
        'Standard CCW test.',
      ),
    ],
    2,
  );
}

function genTernaryMore(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 8, 12);
  const mid = randInt(rng, 2, n - 3);
  const values: number[] = [];
  let v = randInt(rng, 10, 20);
  for (let i = 0; i < n; i++) {
    values.push(v);
    if (i < mid) v -= randInt(rng, 1, 3);
    else v += randInt(rng, 1, 3);
  }
  const argmin = values.reduce((bi, x, i) => (x < values[bi]! ? i : bi), 0);
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'ter-min',
        `Unimodal f=[${values.join(', ')}]. Argmin index?`,
        String(argmin),
        [String(mid), String(0), String(n - 1)],
        `Valley at **${argmin}** (value ${values[argmin]}).`,
      ),
      mcqFrom(
        rng,
        'ter-concept',
        'Ternary search needs the function to be…',
        'Unimodal',
        ['Strictly sorted', 'Periodic', 'Convex only in 2D'],
        'One valley/peak so thirds discard correctly.',
      ),
    ],
    2,
  );
}

function genLowerMore(rng: Rng): LearnExercise[] {
  return genLowerBound(rng);
}

function genUpperMore(rng: Rng): LearnExercise[] {
  const base = genUpperBound(rng);
  return [
    ...base,
    mcqFrom(
      rng,
      'ub-concept',
      'upper_bound(x) points to…',
      'First element > x',
      ['First ≥ x', 'Last ≤ x', 'Exact match only'],
      'lower = first ≥; upper = first >.',
    ),
  ];
}

function concepts(
  rng: Rng,
  rows: { id: string; prompt: string; correct: string; wrong: string[]; explain: string }[],
  k = 4,
): LearnExercise[] {
  return samplePool(
    rng,
    rows.map((r) =>
      mcqFrom(rng, r.id, r.prompt, r.correct, r.wrong, r.explain),
    ),
    Math.min(Math.max(k, 3), rows.length),
  );
}

function genFloyd(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'fw-k',
      prompt: 'Floyd–Warshall’s triple loop order is…',
      correct: 'k, then i, then j',
      wrong: ['i, j, k', 'j, i, k', 'Only i, j'],
      explain: 'Middle vertex k must be outermost so DP uses finalized k.',
    },
    {
      id: 'fw-neg',
      prompt: 'Floyd can detect a negative cycle via…',
      correct: 'Some dist[i][i] < 0',
      wrong: ['dist[s][t] = ∞', 'A zero diagonal', 'Topo order fails'],
      explain: 'Negative self-distance ⇒ a negative cycle through i.',
    },
    {
      id: 'fw-time',
      prompt: 'Classic Floyd time complexity?',
      correct: 'O(N³)',
      wrong: ['O(N² log N)', 'O(NM)', 'O(N!)'],
      explain: 'Three nested loops over vertices.',
    },
    {
      id: 'fw-space',
      prompt: 'Floyd’s distance matrix uses…',
      correct: 'O(N²) memory',
      wrong: ['O(N)', 'O(M)', 'O(N³)'],
      explain: 'An N×N table (can overwrite in place).',
    },
    {
      id: 'fw-use',
      prompt: 'Floyd is a good default when…',
      correct: 'N is small and you need all-pairs distances',
      wrong: ['N=1e5 single-source', 'You only need MST', 'The graph is a functional graph of size 1e6'],
      explain: 'All-pairs for N≲400–500; else run many Dijkstras.',
    },
  ]);
}

function genBellman(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'bf-relax',
      prompt: 'Bellman–Ford main loop runs how many full relax passes?',
      correct: 'N − 1',
      wrong: ['N', 'M', 'log N'],
      explain: 'Shortest paths are simple → at most N−1 edges.',
    },
    {
      id: 'bf-neg',
      prompt: 'An N-th improving relax means…',
      correct: 'A negative cycle is reachable',
      wrong: ['The graph is a DAG', 'Distances are final', 'MST exists'],
      explain: 'Further improvement ⇒ a negative cycle.',
    },
    {
      id: 'bf-vs',
      prompt: 'Prefer Bellman–Ford over Dijkstra when…',
      correct: 'Edges may be negative',
      wrong: ['All weights are positive', 'The graph is undirected unit', 'You need MST'],
      explain: 'Dijkstra’s settle-once needs non-negative weights.',
    },
    {
      id: 'bf-time',
      prompt: 'Bellman–Ford time complexity?',
      correct: 'O(NM)',
      wrong: ['O(N² log N)', 'O(N+M)', 'O(N³)'],
      explain: 'N−1 passes over all M edges.',
    },
    {
      id: 'bf-spfa',
      prompt: 'SPFA is…',
      correct: 'A queue-optimized Bellman–Ford (worst-case still bad)',
      wrong: ['Always O(M log N)', 'A max-flow algorithm', 'Only for DAGs'],
      explain: 'Fast on random graphs; adversarial cases are exponential.',
    },
  ]);
}

function genBridges(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'br-def',
      prompt: 'A bridge is an edge whose removal…',
      correct: 'Increases the number of connected components',
      wrong: ['Creates a cycle', 'Shortens all paths', 'Makes the graph bipartite'],
      explain: 'Bridge = critical connectivity edge.',
    },
    {
      id: 'br-disc',
      prompt: 'Tarjan bridge check uses…',
      correct: 'disc / lowlink times',
      wrong: ['Only BFS layers', 'Union-Find alone', 'Topo indegrees'],
      explain: 'low[v] > disc[u] ⇒ (u,v) is a bridge.',
    },
    {
      id: 'br-tree',
      prompt: 'In a tree, how many bridges are there?',
      correct: 'Every edge is a bridge',
      wrong: ['None', 'Only leaf edges', 'N/2'],
      explain: 'Removing any tree edge disconnects it.',
    },
    {
      id: 'br-cycle',
      prompt: 'An edge on a simple cycle is…',
      correct: 'Never a bridge',
      wrong: ['Always a bridge', 'A bridge iff tree edge', 'An SCC root'],
      explain: 'Alternate path remains after removal.',
    },
    {
      id: 'br-art',
      prompt: 'Related notion for vertices is…',
      correct: 'Articulation points / cut vertices',
      wrong: ['Sources in a topo order', 'Centroid only', 'Matching mates'],
      explain: 'Same DFS tree / lowlink family of algorithms.',
    },
  ]);
}

function genScc(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'scc-def',
      prompt: 'An SCC is a maximal set where…',
      correct: 'Every pair is mutually reachable',
      wrong: ['There is a unique sink', 'The subgraph is a tree', 'Indegrees are zero'],
      explain: 'Strong connectivity = directed cycles covering the set.',
    },
    {
      id: 'scc-kos',
      prompt: 'Kosaraju’s second DFS runs on…',
      correct: 'The transpose graph',
      wrong: ['The MST', 'Only undirected edges', 'A BFS tree'],
      explain: 'Finish-order then DFS on Gᵀ assigns components.',
    },
    {
      id: 'scc-cond',
      prompt: 'The condensation of SCCs is always…',
      correct: 'A DAG',
      wrong: ['A cycle', 'A tree', 'Bipartite'],
      explain: 'A cycle among SCCs would merge them.',
    },
    {
      id: 'scc-tarjan',
      prompt: 'Tarjan’s SCC algorithm uses…',
      correct: 'One DFS with a stack + lowlink',
      wrong: ['Two full graph copies only', 'Kruskal', '0-1 BFS'],
      explain: 'Pop the stack when low[u]=disc[u].',
    },
    {
      id: 'scc-sink',
      prompt: 'A sink SCC in the condensation…',
      correct: 'Has outdegree 0',
      wrong: ['Has indegree 0', 'Is always a single vertex', 'Contains the global source'],
      explain: 'No edges leave that component.',
    },
  ]);
}
function genBitmask(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 3, 4);
  const a = Array.from({ length: n }, () => randInt(rng, 1, 9));
  const target = a.reduce((s, x) => s + x, 0) >> 1;
  let ways = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    let s = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) s += a[i]!;
    if (s === target) ways++;
  }
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'bm-ways',
        `a=[${a.join(', ')}]. # subsets summing to ${target}?`,
        String(ways),
        [String(ways + 1), String(Math.max(0, ways - 1)), String(1 << n)],
        `Enumerate 2^${n} → **${ways}**.`,
      ),
      ...concepts(rng, [
        {
          id: 'bm-size',
          prompt: 'Typical bitmask DP for N≤20 has about how many masks?',
          correct: '2^20',
          wrong: ['N!', 'N²', '20^2'],
          explain: 'One bit per item → 2^N states.',
        },
        {
          id: 'bm-trans',
          prompt: 'TSP-style bitmask DP often transitions by…',
          correct: 'Adding one unused city to the mask',
          wrong: ['Sorting the mask', 'BFS on residual', 'Kruskal edges'],
          explain: 'dp[mask][v] ← dp[mask\\v][u] + cost(u,v).',
        },
      ], 99),
    ],
    99,
  );
}

function genTrieDrill(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'trie-edge',
      prompt: 'A trie edge typically represents…',
      correct: 'One character',
      wrong: ['A whole word', 'An integer rank', 'A graph bridge'],
      explain: 'Children keyed by next char.',
    },
    {
      id: 'trie-end',
      prompt: 'Marking word ends is needed because…',
      correct: 'Prefixes of words may also be words',
      wrong: ['Tries cannot store strings', 'DFS would loop', 'Hashing fails'],
      explain: 'Without end marks, “app” hides inside “apple”.',
    },
    {
      id: 'trie-use',
      prompt: 'Tries excel at…',
      correct: 'Prefix queries / dictionary matching',
      wrong: ['All-pairs shortest paths', 'Sorting integers', 'MST'],
      explain: 'Shared prefixes → fast autocomplete / XOR tries.',
    },
    {
      id: 'trie-xor',
      prompt: 'A binary trie on bits is often used for…',
      correct: 'Maximum XOR pair queries',
      wrong: ['Kruskal MST', 'Topo sort', '0-1 BFS layers'],
      explain: 'Walk opposite bits greedily.',
    },
    {
      id: 'trie-fail',
      prompt: 'Aho–Corasick extends a trie with…',
      correct: 'Failure links (KMP-like)',
      wrong: ['Union-Find parents', 'Lazy segtree tags', 'Mo’s blocks'],
      explain: 'Automaton for multi-pattern matching.',
    },
  ]);
}

function genFlow(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'flow-cut',
      prompt: 'Max-flow equals…',
      correct: 'Min-cut capacity',
      wrong: ['MST weight', 'Number of SCCs', 'Longest path'],
      explain: 'Max-flow min-cut theorem.',
    },
    {
      id: 'flow-aug',
      prompt: 'Ford–Fulkerson repeatedly finds…',
      correct: 'An augmenting path in the residual graph',
      wrong: ['A topo order', 'A negative cycle', 'A bridge'],
      explain: 'Push flow along s–t residual paths until none remain.',
    },
    {
      id: 'flow-unit',
      prompt: 'Bipartite matching reduces to max-flow with…',
      correct: 'Unit-capacity edges through a bipartition',
      wrong: ['Negative weights', 'Undirected MST', 'Only DFS'],
      explain: 'Source→L→R→sink, caps 1.',
    },
    {
      id: 'flow-dinic',
      prompt: 'Dinic’s algorithm layers the residual graph with…',
      correct: 'BFS levels + DFS blocking flow',
      wrong: ['Only Kruskal', 'Bellman–Ford SPFA', 'Mo’s blocks'],
      explain: 'Level graph then push blocking flow.',
    },
    {
      id: 'flow-cap',
      prompt: 'Saturating an edge in the residual means…',
      correct: 'No more flow can use that residual capacity',
      wrong: ['The edge is a bridge in G', 'Distances become negative', 'The cut is empty'],
      explain: 'Residual capacity hits 0 on that direction.',
    },
  ]);
}

function genPq(rng: Rng): LearnExercise[] {
  const ops: string[] = [];
  const heap: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (!heap.length || rng() < 0.6) {
      const x = randInt(rng, 1, 9);
      heap.push(x);
      heap.sort((a, b) => a - b);
      ops.push(`push ${x}`);
    } else {
      ops.push(`pop ${heap.shift()}`);
    }
  }
  const top = heap.length ? String(heap[0]) : 'empty';
  return samplePool(
    rng,
    [
      mcqFrom(
        rng,
        'pq-top',
        `Min-heap ops: ${ops.join(', ')}. Next pop?`,
        top,
        ['empty', String(randInt(rng, 1, 9)), String(heap[heap.length - 1] ?? 0)],
        `Min on top → **${top}**.`,
      ),
      ...concepts(rng, [
        {
          id: 'pq-dij',
          prompt: 'Dijkstra’s binary heap gives…',
          correct: 'O((N+M) log N)',
          wrong: ['O(N²) always', 'O(M)', 'O(N!)'],
          explain: 'Each edge may decrease-key / push; pop N times.',
        },
      ], 99),
    ],
    2,
  );
}

function genMoDrill(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'mo-sort',
      prompt: 'Mo’s algorithm sorts queries by…',
      correct: 'Block of L, then R',
      wrong: ['Only R ascending', 'Random order', 'Answer value'],
      explain: '√N blocks minimize pointer movement.',
    },
    {
      id: 'mo-off',
      prompt: 'Mo’s algorithm is…',
      correct: 'Offline',
      wrong: ['Online for any update', 'Only for trees', 'A streaming one-pass'],
      explain: 'All queries known before answering.',
    },
    {
      id: 'mo-add',
      prompt: 'While moving the window you must…',
      correct: 'add/remove indices and update the answer',
      wrong: ['Rebuild the array', 'Sort the subarray', 'Run Dijkstra'],
      explain: 'Maintain a frequency structure as L/R move.',
    },
    {
      id: 'mo-block',
      prompt: 'Typical Mo block size is about…',
      correct: '√N',
      wrong: ['log N', 'N/2', 'N'],
      explain: 'Balances L jumps vs R movement.',
    },
    {
      id: 'mo-hilbert',
      prompt: 'Hilbert-order Mo is a…',
      correct: 'Cache-friendly query ordering optimization',
      wrong: ['Replacement for add/remove', 'Online update structure', 'Max-flow reduction'],
      explain: 'Same algorithm; better locality on some tests.',
    },
  ]);
}

function genStringHash(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'sh-roll',
      prompt: 'Polynomial rolling hash builds…',
      correct: 'Prefix hashes for O(1) substring hashes',
      wrong: ['Suffix arrays only', 'A Fenwick of chars', 'KMP π only'],
      explain: 'hash(l..r) from pref[r]-pref[l-1]*base^(len).',
    },
    {
      id: 'sh-mod',
      prompt: 'Against anti-hash tests, prefer…',
      correct: 'Two moduli / strong 64-bit mix',
      wrong: ['A single small prime', 'No modulus', 'Sorting hashes'],
      explain: 'Single weak mod is breakable.',
    },
    {
      id: 'sh-cmp',
      prompt: 'Equal hashes mean…',
      correct: 'Likely equal strings (check on collision)',
      wrong: ['Always different strings', 'A guaranteed palindrome', 'Sorted order'],
      explain: 'Hashing is probabilistic unless verified.',
    },
    {
      id: 'sh-lcp',
      prompt: 'Binary-searching LCP with hashes needs…',
      correct: 'Monotone equality of prefixes',
      wrong: ['A max-flow', 'Negative edge weights', 'Topo sort'],
      explain: 'Longer equal prefixes stay equal when shortened.',
    },
    {
      id: 'sh-base',
      prompt: 'A good rolling-hash base is usually…',
      correct: 'A random odd integer / large multiplier',
      wrong: ['Always 2', 'Always 10', 'The string length'],
      explain: 'Fixed tiny bases are easier to attack.',
    },
  ]);
}

function genLcaDrill(rng: Rng): LearnExercise[] {
  return concepts(rng, [
    {
      id: 'lca-lift',
      prompt: 'Binary lifting precomputes…',
      correct: '2^k-th parents',
      wrong: ['All-pairs distances only', 'Euler tour exclusive', 'MST parents'],
      explain: 'up[k][v] = parent^{2^k}(v).',
    },
    {
      id: 'lca-dist',
      prompt: 'dist(u,v) via LCA is…',
      correct: 'depth[u]+depth[v]−2·depth[lca]',
      wrong: ['depth[u]−depth[v]', 'Only BFS from root', 'up[0][u]'],
      explain: 'Climb both to the LCA.',
    },
    {
      id: 'lca-alt',
      prompt: 'Euler tour + RMQ LCA needs…',
      correct: 'A sparse table (or similar) on the tour',
      wrong: ['Dijkstra', 'Max-flow', 'Counting sort'],
      explain: 'LCA = min-depth node on the tour segment.',
    },
    {
      id: 'lca-build',
      prompt: 'Binary lifting build time is…',
      correct: 'O(N log N)',
      wrong: ['O(N)', 'O(N²)', 'O(N log log N) only'],
      explain: 'log N parents for each of N nodes.',
    },
    {
      id: 'lca-query',
      prompt: 'One LCA query with lifting is…',
      correct: 'O(log N)',
      wrong: ['O(1) without RMQ prep', 'O(N)', 'O(log log N) always'],
      explain: 'Equalize depth then jump down the bits.',
    },
  ]);
}

function genDpIntro(rng: Rng): LearnExercise[] {
  return [
    ...genKnapsackMore(rng),
    ...concepts(rng, [
      {
        id: 'dp-order',
        prompt: 'Before coding DP, fix…',
        correct: 'State → transition → base → order',
        wrong: ['Only the final answer type', 'A random recursion', 'MST first'],
        explain: 'Wrong order is the classic bug.',
      },
    ], 99),
  ];
}

function gen01Bfs(rng: Rng): LearnExercise[] {
  return [
    ...genBfs(rng).filter((e) => e.kind === 'graph_predict' || e.kind === 'mcq'),
    ...concepts(rng, [
      {
        id: '01-deq',
        prompt: '0-1 BFS puts weight-0 edges…',
        correct: 'At the front of the deque',
        wrong: ['At the back always', 'Into a binary heap', 'Into a stack'],
        explain: '0-cost stays in the current distance layer.',
      },
    ], 99),
  ];
}

type Gen = (rng: Rng) => LearnExercise[];

const GENERATORS: Record<string, Gen> = {
  bfs: genBfs,
  dfs: genDfs,
  dijkstra: genDijkstra,
  'topo-sort': genTopo,
  'binary-search': genBinarySearch,
  'lower-bound': genLowerMore,
  'upper-bound': genUpperMore,
  'prefix-sums': genPrefixMore,
  knapsack: genKnapsackMore,
  'two-pointers': genTwoPointersMore,
  lis: genLisDrill,
  'coordinate-compression': genCoordMore,
  dsu: genDsuMore,
  sieve: genSieveMore,
  'ternary-search': genTernaryMore,
  'stack-ds': genStackMore,
  'queue-ds': genQueueMore,
  'game-theory': genNim,
  'meet-in-middle': genMitm,
  'hash-map': genHashMap,
  'math-number-theory': genNumberTheoryMore,
  'geometry-basics': genGeometryMore,
  sorting: genSorting,
  mergesort: genSorting,
  quicksort: genSorting,
  'counting-sort': genSorting,
  mst: genMst,
  'mst-prim': genMst,
  fenwick: genFenwickDrill,
  'segment-tree': genFenwickDrill,
  'segment-tree-lazy': genFenwickDrill,
  'sparse-table': genFenwickDrill,
  kmp: genKmpDrill,
  'z-algorithm': genZDrill,
  greedy: genGreedyDrill,
  'binary-search-answer': genBsAnswer,
  'difference-array': genDiffArray,
  'bitmask-dp': genBitmask,
  'deque-window': genTwoPointersMore,
  'priority-queue': genPq,
  'monotonic-stack': genStackMore,
  'string-hashing': genStringHash,
  'brute-force': genMitm,
  trie: genTrieDrill,
  lca: genLcaDrill,
  'mo-algorithm': genMoDrill,
  'sweep-line': genDiffArray,
  'convex-hull': genGeometryMore,
  'floyd-warshall': genFloyd,
  'bellman-ford': genBellman,
  'bfs-01': gen01Bfs,
  bridges: genBridges,
  scc: genScc,
  'max-flow': genFlow,
  'flows-matching': genFlow,
  'bipartite-matching': genFlow,
  'divide-conquer': genSorting,
  'dynamic-programming': genDpIntro,
  'ad-hoc': genSorting,
  interactive: genBinarySearch,
  'ordered-set': genCoordMore,
  'matrix-expo': genNumberTheoryMore,
};

/** True if this lesson can show a Check stage. */
export function lessonHasExercises(lessonId: string): boolean {
  return lessonId in GENERATORS || (LESSON_EXERCISES[lessonId]?.length ?? 0) > 0;
}

/** Flattened scored beats (MCQ steps + graph_predict checkpoints). */
export function countExerciseBeats(exercises: LearnExercise[]): number {
  let n = 0;
  for (const ex of exercises) {
    if (ex.kind === 'mcq') n += 1;
    else if (ex.kind === 'trace') n += ex.steps.length;
    else n += ex.checkpoints.length;
  }
  return n;
}

const MIN_BEATS = 8;
/** Soft cap so Skill Check stays finishable. */
const MAX_BEATS = 14;

/**
 * Build exercises for a lesson. Prefers a procedural generator (fresh graph/array);
 * mixes curated static drills; always aims for a fat pack (≥8 beats) with a second
 * procedural pass when needed; shuffles final order.
 */
export function buildExercises(lessonId: string, seed: number): LearnExercise[] {
  const rng = mulberry32(seed >>> 0);
  const gen = GENERATORS[lessonId];
  const staticBank = LESSON_EXERCISES[lessonId] ?? [];
  const out: LearnExercise[] = [];
  const usedStatic = new Set<string>();

  if (gen) {
    try {
      out.push(...gen(rng).map((ex) => shuffleExercise(rng, ex)));
      // Second independent pack → more graphs/arrays/questions per run.
      out.push(
        ...gen(rng).map((ex) =>
          shuffleExercise(rng, { ...ex, id: `${ex.id}-alt` }),
        ),
      );
    } catch {
      /* fall through to static */
    }
  }

  const shuffledStatic = shuffle(rng, staticBank);

  function pushStatic(ex: LearnExercise, tag: string) {
    if (usedStatic.has(ex.id)) return;
    usedStatic.add(ex.id);
    out.push(
      shuffleExercise(rng, {
        ...ex,
        id: `${ex.id}-${tag}-${(seed >>> 0) % 100000}`,
      }),
    );
  }

  if (out.length > 0) {
    // Prefer mixing most of the curated bank (at least 1 when any exist).
    const maxExtra = Math.min(shuffledStatic.length, 4);
    const nExtra =
      maxExtra === 0 ? 0 : randInt(rng, Math.min(1, maxExtra), maxExtra);
    for (let i = 0; i < nExtra; i++) pushStatic(shuffledStatic[i]!, 'mix');
  } else {
    for (const ex of shuffledStatic) pushStatic(ex, 'static');
  }

  // Top up short runs: more static, then more procedural packs.
  let guard = 0;
  while (countExerciseBeats(out) < MIN_BEATS && guard++ < 12) {
    const next = shuffledStatic.find((ex) => !usedStatic.has(ex.id));
    if (next) {
      pushStatic(next, 'pad');
      continue;
    }
    if (gen) {
      try {
        const more = gen(rng).map((ex) =>
          shuffleExercise(rng, { ...ex, id: `${ex.id}-b${guard}` }),
        );
        if (!more.length) break;
        out.push(...more);
      } catch {
        break;
      }
    } else break;
  }

  // Trim oversized packs while keeping predict drills and a mix of MCQs.
  let beats = countExerciseBeats(out);
  if (beats > MAX_BEATS) {
    const predict = out.filter((e) => e.kind === 'graph_predict');
    const rest = shuffle(
      rng,
      out.filter((e) => e.kind !== 'graph_predict'),
    );
    const kept = [...predict];
    for (const ex of rest) {
      if (countExerciseBeats(kept) >= MIN_BEATS && countExerciseBeats(kept) + exerciseWeight(ex) > MAX_BEATS) {
        continue;
      }
      kept.push(ex);
      if (countExerciseBeats(kept) >= MAX_BEATS) break;
    }
    return shuffle(rng, kept);
  }

  return shuffle(rng, out);
}

function exerciseWeight(ex: LearnExercise): number {
  if (ex.kind === 'mcq') return 1;
  if (ex.kind === 'trace') return ex.steps.length;
  return ex.checkpoints.length;
}
