export type LearnFamily =
  | 'graphs'
  | 'search'
  | 'structures'
  | 'dp'
  | 'math'
  | 'strings'
  | 'geometry'
  | 'techniques';

export type LearnTagKind = 'algorithm' | 'paradigm' | 'data_structure';

export type LearnVizKind =
  | 'graph-bfs'
  | 'graph-dfs'
  | 'graph-dijkstra'
  | 'graph-topo'
  | 'graph-mst'
  | 'array-binary-search'
  | 'dsu-merge'
  | 'array-prefix'
  | 'dp-knapsack'
  | 'mono-stack';

export type GraphDemo = {
  nodes: { id: string; x: number; y: number; label?: string }[];
  edges: { from: string; to: string; w?: number }[];
  start: string;
};

export type ArrayDemo = {
  values: number[];
  /** binary search target, etc. */
  target?: number;
};

export type KnapsackDemo = {
  weights: number[];
  values: number[];
  capacity: number;
};

export type LearnDemo = GraphDemo | ArrayDemo | KnapsackDemo;

export type LearnLesson = {
  id: string;
  /** Exact TAG_CATALOG label used for practice matching. */
  tagLabel: string;
  /** Which catalog kind `tagLabel` belongs to (default: algorithm). */
  tagKind?: LearnTagKind;
  title: string;
  family: LearnFamily;
  summary: string;
  usage_md: string;
  complexity: {
    time: string;
    extraMemory: string;
    notes_md?: string;
  };
  visualization?: {
    kind: LearnVizKind;
    demo: LearnDemo;
  };
  implementation: {
    language: 'cpp' | 'python' | 'java';
    code: string;
    notes_md?: string;
  };
  practiceProblemIds?: string[];
};

export const LEARN_FAMILY_LABELS: Record<LearnFamily, string> = {
  graphs: 'Graphs',
  search: 'Search',
  structures: 'Structures',
  dp: 'Dynamic Programming',
  math: 'Math',
  strings: 'Strings',
  geometry: 'Geometry',
  techniques: 'Techniques',
};
