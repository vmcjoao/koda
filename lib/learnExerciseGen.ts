import { LESSON_EXERCISES } from '@/data/learn/exercises';
import type { LearnExercise, LearnMcq } from '@/types/learn';

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
  const start = 0;
  const { order, dist } = bfsOrder(g, start);
  const frontier = g.adj[start]!.join(', ');
  const visitStr = order.join(', ');
  const far = dist.reduce((best, d, i) => (d > dist[best]! ? i : best), 0);
  const altOrders = new Set<string>();
  altOrders.add([...order].reverse().join(', '));
  altOrders.add(shuffle(rng, [...order]).join(', '));
  altOrders.add(
    order
      .slice()
      .sort((a, b) => a - b)
      .join(', '),
  );
  altOrders.delete(visitStr);

  return [
    {
      id: 'bfs-gen',
      kind: 'trace',
      title: 'BFS trace',
      context_md: graphContext(g) + `\n\nStart at **${start}**.`,
      steps: [
        makeMcq(rng, {
          prompt: `First nodes enqueued from ${start}?`,
          correct: frontier || '(none)',
          wrong: [
            [...g.adj[start]!].reverse().join(', ') || '0',
            String(g.adj[start]![0] ?? 0),
            `${start}, ${frontier}`,
          ],
          explain_md: `Ascending neighbors of ${start}: **${frontier}**.`,
        }),
        makeMcq(rng, {
          prompt: 'Full BFS visit (dequeue) order?',
          correct: visitStr,
          wrong: [...altOrders].slice(0, 3),
          explain_md: `Layer by layer from ${start}: **${visitStr}**.`,
        }),
        makeMcq(rng, {
          prompt: `Distance (edges) from ${start} to ${far}?`,
          correct: String(dist[far]),
          wrong: [
            String(dist[far]! + 1),
            String(Math.max(0, dist[far]! - 1)),
            String(dist[far]! + 2),
          ],
          explain_md: `dist[${far}] = **${dist[far]}**.`,
        }),
      ],
    },
  ];
}
function genDfs(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 5, 7);
  const g = buildTreePlus(rng, n, randInt(rng, 0, 2));
  const start = 0;
  const order = dfsOrder(g, start);
  const firstChild = g.adj[start]![0];
  return [
    {
      id: 'dfs-gen',
      kind: 'trace',
      title: 'DFS trace',
      context_md: graphContext(g) + `\n\nStart DFS at **${start}** (recurse first unused neighbor).`,
      steps: [
        makeMcq(rng, {
          prompt: `First node entered after ${start}?`,
          correct: String(firstChild ?? start),
          wrong: [
            String(g.adj[start]![1] ?? (firstChild ?? 0) + 1),
            String(order[order.length - 1]),
            String(start),
          ],
          explain_md: `Lowest-id neighbor of ${start} is **${firstChild}**.`,
        }),
        makeMcq(rng, {
          prompt: 'Full DFS discovery order?',
          correct: order.join(', '),
          wrong: [
            [...order].reverse().join(', '),
            shuffle(rng, [...order]).join(', '),
            order.slice().sort((a, b) => a - b).join(', '),
          ],
          explain_md: `Discovery order: **${order.join(', ')}**.`,
        }),
      ],
    },
  ];
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
  const dist = dijkstra(g, weights, start);
  const target = n - 1;
  const d = dist[target]!;
  return [
    {
      id: 'dij-gen',
      kind: 'trace',
      title: 'Dijkstra',
      context_md: graphContext(g, weights) + `\n\nSource **${start}**. Non-negative weights.`,
      steps: [
        makeMcq(rng, {
          prompt: `Shortest distance ${start} → ${target}?`,
          correct: String(d),
          wrong: [String(d + 1), String(d + 2), String(Math.max(0, d - 1))],
          explain_md: `Dijkstra yields dist[${target}] = **${d}**.`,
        }),
        makeMcq(rng, {
          prompt: `dist[${g.adj[start]![0] ?? 1}] right after relaxing ${start}'s edges?`,
          correct: String(
            weights.get(edgeKey(start, g.adj[start]![0] ?? 1)) ?? dist[g.adj[start]![0] ?? 1],
          ),
          wrong: ['0', '∞', String((weights.get(edgeKey(start, g.adj[start]![0] ?? 1)) ?? 1) + 3)],
          explain_md: 'First hop = the direct edge weight from the source.',
        }),
      ],
    },
  ];
}

function genTopo(rng: Rng): LearnExercise[] {
  const n = randInt(rng, 4, 6);
  const adj: number[][] = Array.from({ length: n }, () => []);
  // layered DAG: edges only forward
  for (let u = 0; u < n; u++) {
    for (let v = u + 1; v < n; v++) {
      if (rng() < 0.45) adj[u]!.push(v);
    }
  }
  for (let i = 0; i + 1 < n; i++) {
    if (!adj[i]!.includes(i + 1)) adj[i]!.push(i + 1);
  }
  for (const list of adj) list.sort((a, b) => a - b);

  const indeg = Array(n).fill(0);
  for (let u = 0; u < n; u++) for (const v of adj[u]!) indeg[v]!++;
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

  return [
    {
      id: 'topo-gen',
      kind: 'trace',
      title: 'Topo order',
      context_md: `Directed edges: \`${edgeStrs.join('`, `')}\`.\n\nKahn’s algorithm (indegree + queue, ties by ascending id).`,
      steps: [
        makeMcq(rng, {
          prompt: 'A valid Kahn topo order?',
          correct: order.join(', '),
          wrong: [
            [...order].reverse().join(', '),
            shuffle(rng, [...order]).join(', '),
            order.slice().sort((a, b) => b - a).join(', '),
          ],
          explain_md: `Kahn with ascending ties: **${order.join(', ')}**.`,
        }),
      ],
    },
  ];
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
  const lo0 = 0;
  const hi0 = n;
  const mid0 = lo0 + Math.floor((hi0 - lo0) / 2);
  return [
    {
      id: 'bs-gen',
      kind: 'trace',
      title: 'Exact search',
      context_md: `Sorted \`a = [${a.join(', ')}]\`. Find **${target}** with \`[lo, hi)\`.`,
      steps: [
        makeMcq(rng, {
          prompt: `First mid (lo=${lo0}, hi=${hi0})?`,
          correct: `${mid0} (a[mid]=${a[mid0]})`,
          wrong: [
            `${mid0 - 1} (a=${a[mid0 - 1]})`,
            `${mid0 + 1} (a=${a[mid0 + 1]})`,
            `${a.indexOf(target)} (final index)`,
          ],
          explain_md: `mid = lo + (hi-lo)/2 = **${mid0}**.`,
        }),
        makeMcq(rng, {
          prompt: `Does ${target} exist?`,
          correct: 'Yes',
          wrong: ['No', 'Only as lower_bound', 'Only if unique'],
          explain_md: `\`${target}\` is in the array.`,
        }),
      ],
    },
  ];
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
  return [
    mcqFrom(
      rng,
      'sieve-gen',
      `How many primes ≤ ${n}?`,
      String(count),
      [String(count + 1), String(Math.max(0, count - 1)), String(count + 2)],
      `Sieve of Eratosthenes up to ${n} → **${count}**.`,
    ),
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
  return [
    mcqFrom(
      rng,
      'nim-gen',
      `Nim heaps [${heaps.join(', ')}]. XOR?`,
      String(x),
      [String(x ^ 1), String(x ^ 2), String(heaps[0])],
      `${heaps.join(' ⊕ ')} = **${x}**${x === 0 ? ' (second wins)' : ' (first wins)'}.`,
    ),
  ];
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
  return [
    mcqFrom(
      rng,
      'mitm-gen',
      `Subset of [${a.join(', ')}] summing to ${target}?`,
      ok ? 'Yes' : 'No',
      [ok ? 'No' : 'Yes', 'Only if sorted', 'Impossible to know'],
      `Full enumerate $2^{${n}}$ → **${ok ? 'Yes' : 'No'}** (MITM mindset for larger N).`,
    ),
  ];
}

function genHashMap(rng: Rng): LearnExercise[] {
  const a = Array.from({ length: 6 }, () => randInt(rng, 1, 5));
  const freq = new Map<number, number>();
  for (const x of a) freq.set(x, (freq.get(x) ?? 0) + 1);
  const key = pick(rng, a);
  const ans = freq.get(key)!;
  return [
    mcqFrom(
      rng,
      'hm-gen',
      `Frequency of ${key} in [${a.join(', ')}]?`,
      String(ans),
      [String(ans + 1), String(Math.max(0, ans - 1)), '0'],
      `Hash map count → **${ans}**.`,
    ),
  ];
}

type Gen = (rng: Rng) => LearnExercise[];

const GENERATORS: Record<string, Gen> = {
  bfs: genBfs,
  dfs: genDfs,
  dijkstra: genDijkstra,
  'topo-sort': genTopo,
  'binary-search': genBinarySearch,
  'lower-bound': genLowerBound,
  'upper-bound': genUpperBound,
  'prefix-sums': genPrefix,
  knapsack: genKnapsack,
  'two-pointers': genTwoPointers,
  lis: genLis,
  'coordinate-compression': genCoordCompress,
  dsu: genDsu,
  sieve: genSieve,
  'ternary-search': genTernary,
  'stack-ds': genStack,
  'queue-ds': genQueue,
  'game-theory': genNim,
  'meet-in-middle': genMitm,
  'hash-map': genHashMap,
};

/** True if this lesson can show a Check stage. */
export function lessonHasExercises(lessonId: string): boolean {
  return lessonId in GENERATORS || (LESSON_EXERCISES[lessonId]?.length ?? 0) > 0;
}

/**
 * Build exercises for a lesson. Prefers a procedural generator (fresh graph/array);
 * otherwise shuffles the static bank. Mixes a static concept MCQ when both exist.
 */
export function buildExercises(lessonId: string, seed: number): LearnExercise[] {
  const rng = mulberry32(seed >>> 0);
  const gen = GENERATORS[lessonId];
  const staticBank = LESSON_EXERCISES[lessonId] ?? [];

  if (gen) {
    try {
      const generated = gen(rng).map((ex) => shuffleExercise(rng, ex));
      // Append one shuffled conceptual MCQ from the static bank when available.
      const concept = staticBank.find((e) => e.kind === 'mcq');
      if (concept) generated.push(shuffleExercise(rng, { ...concept, id: `${concept.id}-mix` }));
      return generated;
    } catch {
      /* fall through to static */
    }
  }

  return staticBank.map((ex) => shuffleExercise(rng, { ...ex }));
}
