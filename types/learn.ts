export type LearnFamily = 'graphs' | 'search' | 'structures' | 'dp' | 'math' | 'strings';

export type LearnVizKind =
  | 'graph-bfs'
  | 'graph-dfs'
  | 'graph-dijkstra'
  | 'graph-topo'
  | 'graph-mst'
  | 'array-binary-search'
  | 'dsu-merge'
  | 'array-prefix';

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

export type LearnLesson = {
  id: string;
  tagLabel: string;
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
    demo: GraphDemo | ArrayDemo;
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
};
