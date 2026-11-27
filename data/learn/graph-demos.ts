import type { GraphDemo } from '@/types/learn';

/** Layered unweighted graph — BFS distances are obvious by hop count. */
export const DEMO_BFS: GraphDemo = {
  nodes: [
    { id: '0', x: 40, y: 110, label: '0' },
    { id: '1', x: 130, y: 50, label: '1' },
    { id: '2', x: 130, y: 170, label: '2' },
    { id: '3', x: 220, y: 110, label: '3' },
    { id: '4', x: 310, y: 60, label: '4' },
    { id: '5', x: 310, y: 160, label: '5' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '3', to: '5' },
  ],
  start: '0',
};

/** Deep-first friendly: a spine with one side branch — DFS goes deep before the sibling. */
export const DEMO_DFS: GraphDemo = {
  nodes: [
    { id: '0', x: 40, y: 110, label: '0' },
    { id: '1', x: 120, y: 50, label: '1' },
    { id: '2', x: 200, y: 50, label: '2' },
    { id: '3', x: 280, y: 50, label: '3' },
    { id: '4', x: 120, y: 170, label: '4' },
    { id: '5', x: 200, y: 170, label: '5' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '0', to: '4' },
    { from: '4', to: '5' },
  ],
  start: '0',
};

/**
 * Weighted graph where fewest hops ≠ cheapest path:
 * 0→1 costs 10, but 0→2→1 costs 1+1=2.
 */
export const DEMO_DIJKSTRA: GraphDemo = {
  nodes: [
    { id: '0', x: 50, y: 110, label: '0' },
    { id: '1', x: 180, y: 40, label: '1' },
    { id: '2', x: 180, y: 180, label: '2' },
    { id: '3', x: 300, y: 110, label: '3' },
  ],
  edges: [
    { from: '0', to: '1', w: 10 },
    { from: '0', to: '2', w: 1 },
    { from: '2', to: '1', w: 1 },
    { from: '1', to: '3', w: 2 },
    { from: '2', to: '3', w: 8 },
  ],
  start: '0',
};

/** Undirected with a tempting expensive edge that Kruskal must skip (cycle). */
export const DEMO_MST: GraphDemo = {
  nodes: [
    { id: '0', x: 60, y: 110, label: '0' },
    { id: '1', x: 160, y: 40, label: '1' },
    { id: '2', x: 160, y: 180, label: '2' },
    { id: '3', x: 280, y: 110, label: '3' },
  ],
  edges: [
    { from: '0', to: '1', w: 1 },
    { from: '0', to: '2', w: 2 },
    { from: '1', to: '2', w: 9 }, // cycle bait
    { from: '1', to: '3', w: 3 },
    { from: '2', to: '3', w: 4 },
  ],
  start: '0',
};

/**
 * Directed graph with three SCCs — not weakly “one blob”:
 * {0,1,2} cycle, {3,4} cycle, {5} alone. Edges 2→3 and 4→5 between comps.
 */
export const DEMO_SCC: GraphDemo = {
  directed: true,
  nodes: [
    { id: '0', x: 50, y: 60, label: '0' },
    { id: '1', x: 140, y: 40, label: '1' },
    { id: '2', x: 140, y: 120, label: '2' },
    { id: '3', x: 240, y: 60, label: '3' },
    { id: '4', x: 320, y: 100, label: '4' },
    { id: '5', x: 300, y: 180, label: '5' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
    { from: '4', to: '3' },
    { from: '4', to: '5' },
  ],
  start: '0',
};

/** Two triangles joined by a single bridge edge 1—3. */
export const DEMO_BRIDGES: GraphDemo = {
  nodes: [
    { id: '0', x: 50, y: 60, label: '0' },
    { id: '1', x: 130, y: 110, label: '1' },
    { id: '2', x: 50, y: 160, label: '2' },
    { id: '3', x: 230, y: 110, label: '3' },
    { id: '4', x: 310, y: 60, label: '4' },
    { id: '5', x: 310, y: 160, label: '5' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '1', to: '2' },
    { from: '2', to: '0' },
    { from: '1', to: '3' }, // bridge
    { from: '3', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '3' },
  ],
  start: '0',
};

/** Negative edge + optional trap: 0→3 is long; 0→1→2→3 uses a negative. */
export const DEMO_BELLMAN: GraphDemo = {
  directed: true,
  nodes: [
    { id: '0', x: 40, y: 110, label: '0' },
    { id: '1', x: 140, y: 50, label: '1' },
    { id: '2', x: 240, y: 50, label: '2' },
    { id: '3', x: 320, y: 110, label: '3' },
    { id: '4', x: 140, y: 180, label: '4' },
  ],
  edges: [
    { from: '0', to: '1', w: 5 },
    { from: '1', to: '2', w: -3 },
    { from: '2', to: '3', w: 2 },
    { from: '0', to: '3', w: 10 },
    { from: '0', to: '4', w: 1 },
    { from: '4', to: '3', w: 8 },
  ],
  start: '0',
};

/** Tiny dense digraph for all-pairs intuition. */
export const DEMO_FLOYD: GraphDemo = {
  directed: true,
  nodes: [
    { id: '0', x: 80, y: 50, label: '0' },
    { id: '1', x: 260, y: 50, label: '1' },
    { id: '2', x: 80, y: 170, label: '2' },
    { id: '3', x: 260, y: 170, label: '3' },
  ],
  edges: [
    { from: '0', to: '1', w: 3 },
    { from: '0', to: '2', w: 5 },
    { from: '1', to: '2', w: 1 },
    { from: '1', to: '3', w: 4 },
    { from: '2', to: '3', w: 2 },
    { from: '3', to: '0', w: 8 },
  ],
  start: '0',
};

/** Rooted tree for LCA / tree DFS. */
export const DEMO_TREE: GraphDemo = {
  nodes: [
    { id: '0', x: 180, y: 30, label: '0' },
    { id: '1', x: 90, y: 100, label: '1' },
    { id: '2', x: 270, y: 100, label: '2' },
    { id: '3', x: 40, y: 180, label: '3' },
    { id: '4', x: 140, y: 180, label: '4' },
    { id: '5', x: 270, y: 180, label: '5' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '2', to: '5' },
  ],
  start: '0',
};

/** 0-1 weights: free edges vs paid — deque BFS should prefer 0-cost first. */
export const DEMO_01_BFS: GraphDemo = {
  directed: true,
  nodes: [
    { id: '0', x: 40, y: 110, label: '0' },
    { id: '1', x: 140, y: 50, label: '1' },
    { id: '2', x: 140, y: 170, label: '2' },
    { id: '3', x: 260, y: 110, label: '3' },
  ],
  edges: [
    { from: '0', to: '1', w: 0 },
    { from: '0', to: '2', w: 1 },
    { from: '1', to: '3', w: 1 },
    { from: '2', to: '3', w: 0 },
  ],
  start: '0',
};

export const DEMO_TOPO: GraphDemo = {
  directed: true,
  nodes: [
    { id: '0', x: 40, y: 110, label: 'A' },
    { id: '1', x: 140, y: 50, label: 'B' },
    { id: '2', x: 140, y: 170, label: 'C' },
    { id: '3', x: 240, y: 110, label: 'D' },
    { id: '4', x: 340, y: 110, label: 'E' },
  ],
  edges: [
    { from: '0', to: '1' },
    { from: '0', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
  ],
  start: '0',
};
