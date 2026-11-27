import type { GraphDemo } from '@/types/learn';

export type NodeState = 'idle' | 'frontier' | 'done' | 'current';

export type GraphStep = {
  label: string;
  nodeState: Record<string, NodeState>;
  activeEdges: string[]; // "u-v"
  dist?: Record<string, number>;
  mstEdges?: string[];
  /** SCC / partition id per node (for multi-color replay). */
  component?: Record<string, number>;
};

function edgeKey(a: string, b: string) {
  return `${a}-${b}`;
}

function adjList(demo: GraphDemo, undirected = !demo.directed) {
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

/** 0-1 BFS with a deque — weight-0 edges go to the front. */
export function build01BfsSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo, false);
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const dist: Record<string, number> = {};
  for (const n of demo.nodes) dist[n.id] = Infinity;
  dist[demo.start] = 0;
  state[demo.start] = 'frontier';
  const dq: string[] = [demo.start];
  steps.push({
    label: `start ${demo.start}`,
    nodeState: { ...state },
    activeEdges: [],
    dist: { ...dist },
  });

  while (dq.length) {
    const u = dq.shift()!;
    state[u] = 'current';
    steps.push({
      label: `pop ${u} (d=${dist[u]})`,
      nodeState: { ...state },
      activeEdges: [],
      dist: { ...dist },
    });
    for (const { to: v, w } of g.get(u) ?? []) {
      const nw = dist[u] + (w === 0 ? 0 : 1);
      if (dist[v] <= nw) continue;
      dist[v] = nw;
      state[v] = 'frontier';
      if (w === 0) dq.unshift(v);
      else dq.push(v);
      steps.push({
        label: w === 0 ? `front ${v}` : `back ${v}`,
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

/** Prim: grow MST from start with a binary-heap-style frontier. */
export function buildPrimSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo, true);
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const inMst = new Set<string>();
  const mst: string[] = [];
  const best: Record<string, number> = {};
  const parentEdge: Record<string, string> = {};
  const INF = 1e15;

  for (const n of demo.nodes) best[n.id] = INF;
  best[demo.start] = 0;
  state[demo.start] = 'frontier';
  steps.push({
    label: `Prim start ${demo.start}`,
    nodeState: { ...state },
    activeEdges: [],
    mstEdges: [],
    dist: { ...best },
  });

  while (inMst.size < demo.nodes.length) {
    let u: string | null = null;
    let bu = INF;
    for (const n of demo.nodes) {
      if (inMst.has(n.id)) continue;
      if (best[n.id]! < bu) {
        bu = best[n.id]!;
        u = n.id;
      }
    }
    if (u == null || bu >= INF) break;
    inMst.add(u);
    state[u] = 'current';
    if (parentEdge[u]) mst.push(parentEdge[u]!);
    steps.push({
      label: `take ${u} (key=${bu === INF ? '∞' : bu})`,
      nodeState: { ...state },
      activeEdges: parentEdge[u] ? [parentEdge[u]!] : [],
      mstEdges: [...mst],
      dist: { ...best },
    });
    for (const { to: v, w } of g.get(u) ?? []) {
      if (inMst.has(v)) continue;
      if (w < best[v]!) {
        best[v] = w;
        parentEdge[v] = edgeKey(u, v);
        state[v] = 'frontier';
        steps.push({
          label: `relax ${v} via ${u} (w=${w})`,
          nodeState: { ...state },
          activeEdges: [edgeKey(u, v)],
          mstEdges: [...mst],
          dist: { ...best },
        });
      }
    }
    state[u] = 'done';
  }
  steps.push({
    label: 'Prim MST complete',
    nodeState: { ...state },
    activeEdges: [],
    mstEdges: [...mst],
    dist: { ...best },
  });
  return steps;
}

/** LCA query on a rooted tree (demo.start = root). Highlights lift of u,v to LCA. */
export function buildLcaSteps(demo: GraphDemo, uId = '3', vId = '5'): GraphStep[] {
  const g = adjList(demo, true);
  const parent: Record<string, string> = {};
  const depth: Record<string, number> = {};
  const root = demo.start;
  parent[root] = root;
  depth[root] = 0;
  const stack = [root];
  const seen = new Set([root]);
  while (stack.length) {
    const u = stack.pop()!;
    for (const { to: v } of g.get(u) ?? []) {
      if (seen.has(v)) continue;
      seen.add(v);
      parent[v] = u;
      depth[v] = depth[u]! + 1;
      stack.push(v);
    }
  }

  const u0 = demo.nodes.some((n) => n.id === uId) ? uId : demo.nodes[demo.nodes.length - 1]!.id;
  const v0 = demo.nodes.some((n) => n.id === vId) ? vId : demo.nodes[Math.min(2, demo.nodes.length - 1)]!.id;

  const steps: GraphStep[] = [];
  const state = baseState(demo);
  state[u0] = 'frontier';
  state[v0] = 'frontier';
  steps.push({
    label: `query LCA(${u0}, ${v0})`,
    nodeState: { ...state },
    activeEdges: [],
  });

  let u = u0;
  let v = v0;
  while (depth[u]! > depth[v]!) {
    const p = parent[u]!;
    state[u] = 'done';
    state[p] = 'current';
    steps.push({
      label: `lift ${u} → ${p}`,
      nodeState: { ...state },
      activeEdges: [edgeKey(u, p)],
    });
    state[p] = 'frontier';
    u = p;
  }
  while (depth[v]! > depth[u]!) {
    const p = parent[v]!;
    state[v] = 'done';
    state[p] = 'current';
    steps.push({
      label: `lift ${v} → ${p}`,
      nodeState: { ...state },
      activeEdges: [edgeKey(v, p)],
    });
    state[p] = 'frontier';
    v = p;
  }
  while (u !== v) {
    const pu = parent[u]!;
    const pv = parent[v]!;
    state[u] = 'done';
    state[v] = 'done';
    steps.push({
      label: `lift both ${u},${v} → ${pu},${pv}`,
      nodeState: { ...state },
      activeEdges: [edgeKey(u, pu), edgeKey(v, pv)],
    });
    state[pu] = 'frontier';
    state[pv] = 'frontier';
    u = pu;
    v = pv;
  }
  state[u] = 'current';
  steps.push({
    label: `LCA = ${u}`,
    nodeState: { ...state },
    activeEdges: [],
  });
  return steps;
}

/** Kosaraju: finish-order DFS on G, then DFS on Gᵀ assigning components. */
export function buildSccSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo, false);
  const gt = new Map<string, { to: string; w: number }[]>();
  for (const n of demo.nodes) gt.set(n.id, []);
  for (const e of demo.edges) {
    gt.get(e.to)!.push({ to: e.from, w: e.w ?? 1 });
  }

  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const order: string[] = [];
  const vis = new Set<string>();

  function dfs1(u: string) {
    vis.add(u);
    state[u] = 'current';
    steps.push({
      label: `DFS1 enter ${u}`,
      nodeState: { ...state },
      activeEdges: [],
    });
    for (const { to: v } of g.get(u) ?? []) {
      if (vis.has(v)) continue;
      state[v] = 'frontier';
      steps.push({
        label: `DFS1 → ${v}`,
        nodeState: { ...state },
        activeEdges: [edgeKey(u, v)],
      });
      dfs1(v);
    }
    state[u] = 'done';
    order.push(u);
    steps.push({
      label: `finish ${u}`,
      nodeState: { ...state },
      activeEdges: [],
    });
  }

  for (const n of demo.nodes) {
    if (!vis.has(n.id)) dfs1(n.id);
  }

  steps.push({
    label: `order ${[...order].reverse().join(' → ')}`,
    nodeState: { ...state },
    activeEdges: [],
  });

  const comp: Record<string, number> = {};
  let cid = 0;
  const assigned = new Set<string>();

  function dfs2(u: string, id: number) {
    assigned.add(u);
    comp[u] = id;
    state[u] = 'current';
    steps.push({
      label: `SCC ${id} ← ${u}`,
      nodeState: { ...state },
      activeEdges: [],
      component: { ...comp },
    });
    for (const { to: v } of gt.get(u) ?? []) {
      if (assigned.has(v)) continue;
      state[v] = 'frontier';
      steps.push({
        label: `Gᵀ ${u}→${v}`,
        nodeState: { ...state },
        activeEdges: [edgeKey(u, v)],
        component: { ...comp },
      });
      dfs2(v, id);
    }
    state[u] = 'done';
  }

  for (let i = order.length - 1; i >= 0; i--) {
    const u = order[i]!;
    if (assigned.has(u)) continue;
    dfs2(u, cid);
    cid += 1;
  }

  for (const n of demo.nodes) state[n.id] = 'done';
  steps.push({
    label: `${cid} SCCs`,
    nodeState: { ...state },
    activeEdges: [],
    component: { ...comp },
  });
  return steps;
}

/** DFS low-link bridges — highlights bridge edges as they are found. */
export function buildBridgeSteps(demo: GraphDemo): GraphStep[] {
  const g = adjList(demo, true);
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const tin: Record<string, number> = {};
  const low: Record<string, number> = {};
  const bridges: string[] = [];
  let timer = 0;

  function dfs(u: string, p: string | null) {
    tin[u] = low[u] = ++timer;
    state[u] = 'current';
    steps.push({
      label: `enter ${u} (tin=${tin[u]})`,
      nodeState: { ...state },
      activeEdges: p ? [edgeKey(p, u)] : [],
      mstEdges: [...bridges],
    });
    for (const { to: v } of g.get(u) ?? []) {
      if (v === p) continue;
      if (tin[v] != null) {
        low[u] = Math.min(low[u], tin[v]);
        steps.push({
          label: `back ${u}→${v}`,
          nodeState: { ...state },
          activeEdges: [edgeKey(u, v)],
          mstEdges: [...bridges],
        });
        continue;
      }
      state[v] = 'frontier';
      dfs(v, u);
      low[u] = Math.min(low[u], low[v]);
      if (low[v] > tin[u]) {
        bridges.push(edgeKey(u, v));
        steps.push({
          label: `bridge ${u}—${v}`,
          nodeState: { ...state },
          activeEdges: [edgeKey(u, v)],
          mstEdges: [...bridges],
        });
      }
    }
    state[u] = 'done';
    steps.push({
      label: `leave ${u} (low=${low[u]})`,
      nodeState: { ...state },
      activeEdges: [],
      mstEdges: [...bridges],
    });
  }

  for (const n of demo.nodes) {
    if (tin[n.id] == null) dfs(n.id, null);
  }
  steps.push({
    label: bridges.length ? `bridges: ${bridges.join(', ')}` : 'no bridges',
    nodeState: { ...state },
    activeEdges: [],
    mstEdges: [...bridges],
  });
  return steps;
}

/** Bellman-Ford: |V|-1 full relax passes, then flag residual improvements. */
export function buildBellmanSteps(demo: GraphDemo): GraphStep[] {
  const steps: GraphStep[] = [];
  const state = baseState(demo);
  const dist: Record<string, number> = {};
  for (const n of demo.nodes) dist[n.id] = Infinity;
  dist[demo.start] = 0;
  state[demo.start] = 'frontier';
  steps.push({
    label: `start ${demo.start}`,
    nodeState: { ...state },
    activeEdges: [],
    dist: { ...dist },
  });

  const n = demo.nodes.length;
  for (let pass = 1; pass <= n - 1; pass++) {
    let any = false;
    for (const e of demo.edges) {
      const w = e.w ?? 1;
      if (dist[e.from] === Infinity) continue;
      if (dist[e.to] > dist[e.from] + w) {
        dist[e.to] = dist[e.from] + w;
        state[e.to] = 'frontier';
        state[e.from] = 'current';
        any = true;
        steps.push({
          label: `pass ${pass}: ${e.from}→${e.to} = ${dist[e.to]}`,
          nodeState: { ...state },
          activeEdges: [edgeKey(e.from, e.to)],
          dist: { ...dist },
        });
        state[e.from] = 'done';
      }
    }
    if (!any) {
      steps.push({
        label: `pass ${pass}: stable`,
        nodeState: { ...state },
        activeEdges: [],
        dist: { ...dist },
      });
      break;
    }
  }

  for (const n of demo.nodes) {
    if (dist[n.id] < Infinity) state[n.id] = 'done';
  }
  steps.push({
    label: 'done',
    nodeState: { ...state },
    activeEdges: [],
    dist: { ...dist },
  });
  return steps;
}
