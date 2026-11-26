import type { GraphDemo } from '@/types/learn';

export type NodeState = 'idle' | 'frontier' | 'done' | 'current';

export type GraphStep = {
  label: string;
  nodeState: Record<string, NodeState>;
  activeEdges: string[]; // "u-v"
  dist?: Record<string, number>;
  mstEdges?: string[];
};

function edgeKey(a: string, b: string) {
  return `${a}-${b}`;
}

function adjList(demo: GraphDemo, undirected = true) {
  const g = new Map<string, { to: string; w: number }[]>();
  for (const n of demo.nodes) g.set(n.id, []);
  for (const e of demo.edges) {
    g.get(e.from)!.push({ to: e.to, w: e.w ?? 1 });
    if (undirected) g.get(e.to)!.push({ to: e.from, w: e.w ?? 1 });
  }
  return g;
}

function baseState(demo: GraphDemo): Record<string, NodeState> {
  const s: Record<string, NodeState> = {};
  for (const n of demo.nodes) s[n.id] = 'idle';
  return s;
}

export function buildBfsSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo);
  const steps: GraphStep[] = [];
  const dist: Record<string, number> = {};
  const state = baseState(demo);
  const q: string[] = [demo.start];
  dist[demo.start] = 0;
  state[demo.start] = 'frontier';
  steps.push({ label: `start ${demo.start}`, nodeState: { ...state }, activeEdges: [], dist: { ...dist } });

  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++];
    state[u] = 'current';
    steps.push({
      label: `visit ${u}`,
      nodeState: { ...state },
      activeEdges: [],
      dist: { ...dist },
    });
    for (const { to: v } of g.get(u) ?? []) {
      if (dist[v] != null) continue;
      dist[v] = dist[u] + 1;
      state[v] = 'frontier';
      q.push(v);
      steps.push({
        label: `enqueue ${v}`,
        nodeState: { ...state },
        activeEdges: [edgeKey(u, v)],
        dist: { ...dist },
      });
    }
    state[u] = 'done';
  }
  steps.push({
    label: 'done',
    nodeState: { ...state },
    activeEdges: [],
    dist: { ...dist },
  });
  return steps;
}

export function buildDfsSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo);
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const vis = new Set<string>();

  function dfs(u: string, via?: string) {
    vis.add(u);
    state[u] = 'current';
    steps.push({
      label: `enter ${u}`,
      nodeState: { ...state },
      activeEdges: via ? [edgeKey(via, u)] : [],
    });
    for (const { to: v } of g.get(u) ?? []) {
      if (vis.has(v)) continue;
      state[v] = 'frontier';
      dfs(v, u);
    }
    state[u] = 'done';
    steps.push({
      label: `leave ${u}`,
      nodeState: { ...state },
      activeEdges: [],
    });
  }

  dfs(demo.start);
  return steps;
}

export function buildDijkstraSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo);
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const dist: Record<string, number> = {};
  for (const n of demo.nodes) dist[n.id] = Infinity;
  dist[demo.start] = 0;
  const used = new Set<string>();

  steps.push({
    label: `start ${demo.start}`,
    nodeState: { ...state, [demo.start]: 'frontier' },
    activeEdges: [],
    dist: { ...dist },
  });

  while (used.size < demo.nodes.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const n of demo.nodes) {
      if (used.has(n.id)) continue;
      if (dist[n.id] < best) {
        best = dist[n.id];
        u = n.id;
      }
    }
    if (u == null || best === Infinity) break;
    used.add(u);
    state[u] = 'current';
    steps.push({
      label: `settle ${u} (d=${best})`,
      nodeState: { ...state },
      activeEdges: [],
      dist: { ...dist },
    });
    for (const { to: v, w } of g.get(u) ?? []) {
      if (used.has(v)) continue;
      if (dist[v] > dist[u] + w) {
        dist[v] = dist[u] + w;
        state[v] = 'frontier';
        steps.push({
          label: `relax ${u}→${v} = ${dist[v]}`,
          nodeState: { ...state },
          activeEdges: [edgeKey(u, v)],
          dist: { ...dist },
        });
      }
    }
    state[u] = 'done';
  }
  steps.push({
    label: 'done',
    nodeState: { ...state },
    activeEdges: [],
    dist: { ...dist },
  });
  return steps;
}

export function buildTopoSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo, false);
  const indeg: Record<string, number> = {};
  for (const n of demo.nodes) indeg[n.id] = 0;
  for (const e of demo.edges) indeg[e.to] = (indeg[e.to] ?? 0) + 1;

  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const q = demo.nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id);
  for (const u of q) state[u] = 'frontier';
  steps.push({
    label: `sources: ${q.join(',')}`,
    nodeState: { ...state },
    activeEdges: [],
  });

  const order: string[] = [];
  while (q.length) {
    const u = q.shift()!;
    state[u] = 'current';
    order.push(u);
    steps.push({
      label: `place ${u}`,
      nodeState: { ...state },
      activeEdges: [],
    });
    for (const { to: v } of g.get(u) ?? []) {
      indeg[v]--;
      if (indeg[v] === 0) {
        state[v] = 'frontier';
        q.push(v);
        steps.push({
          label: `unlock ${v}`,
          nodeState: { ...state },
          activeEdges: [edgeKey(u, v)],
        });
      }
    }
    state[u] = 'done';
  }
  steps.push({
    label: `order ${order.join(' → ')}`,
    nodeState: { ...state },
    activeEdges: [],
  });
  return steps;
}

export function buildMstSteps(demo: GraphDemo): GraphStep[] {
  const edges = [...demo.edges]
    .map((e) => ({ ...e, w: e.w ?? 1 }))
    .sort((a, b) => a.w - b.w);
  const parent: Record<string, string> = {};
  for (const n of demo.nodes) parent[n.id] = n.id;
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));

  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const mst: string[] = [];
  steps.push({ label: 'sort edges', nodeState: { ...state }, activeEdges: [], mstEdges: [] });

  for (const e of edges) {
    const a = find(e.from);
    const b = find(e.to);
    const key = edgeKey(e.from, e.to);
    if (a === b) {
      steps.push({
        label: `skip ${e.from}-${e.to} (cycle)`,
        nodeState: { ...state },
        activeEdges: [key],
        mstEdges: [...mst],
      });
      continue;
    }
    parent[a] = b;
    mst.push(key);
    state[e.from] = 'done';
    state[e.to] = 'done';
    steps.push({
      label: `add ${e.from}-${e.to} (w=${e.w})`,
      nodeState: { ...state },
      activeEdges: [key],
      mstEdges: [...mst],
    });
  }
  steps.push({
    label: 'MST complete',
    nodeState: { ...state },
    activeEdges: [],
    mstEdges: [...mst],
  });
  return steps;
}
