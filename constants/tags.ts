import type { TagCatalogEntry } from '@/types/database';

export const COMPLEXITY_OPTIONS = [
  'O(1)',
  'O(log N)',
  'O(N)',
  'O(N log N)',
  'O(N √N)',
  'O(N²)',
  'O(N³)',
  'O(2^N)',
  'O(N!)',
] as const;

export const TAG_CATALOG: TagCatalogEntry[] = [
  // Paradigms
  { id: 'p-dp', kind: 'paradigm', label: 'Dynamic Programming', aliases: ['dp', 'memoization'] },
  { id: 'p-greedy', kind: 'paradigm', label: 'Greedy', aliases: ['greedy algorithm'] },
  { id: 'p-dnc', kind: 'paradigm', label: 'Divide & Conquer', aliases: ['divide and conquer'] },
  { id: 'p-adhoc', kind: 'paradigm', label: 'Ad-Hoc', aliases: ['implementation', 'constructive'] },
  { id: 'p-bf', kind: 'paradigm', label: 'Brute Force', aliases: ['complete search', 'enumeration'] },
  { id: 'p-two-pointers', kind: 'paradigm', label: 'Two Pointers', aliases: ['two pointers', 'sliding window'] },
  { id: 'p-bsa', kind: 'paradigm', label: 'Binary Search on Answer', aliases: ['bs on answer', 'binary search'] },
  { id: 'p-graph', kind: 'paradigm', label: 'Graph Algorithms', aliases: ['graphs'] },
  { id: 'p-math', kind: 'paradigm', label: 'Math / Number Theory', aliases: ['math', 'number theory'] },
  { id: 'p-string', kind: 'paradigm', label: 'String Algorithms', aliases: ['strings'] },
  { id: 'p-geo', kind: 'paradigm', label: 'Geometry', aliases: ['computational geometry'] },
  { id: 'p-bitmask', kind: 'paradigm', label: 'Bitmask / Bit DP', aliases: ['bitmask', 'bit dp'] },
  { id: 'p-interactive', kind: 'paradigm', label: 'Interactive', aliases: [] },
  { id: 'p-flows', kind: 'paradigm', label: 'Flows / Matching', aliases: ['max flow', 'matching'] },

  // Algorithms
  { id: 'a-dijkstra', kind: 'algorithm', label: 'Dijkstra', aliases: ['shortest path'] },
  { id: 'a-bfs', kind: 'algorithm', label: 'BFS', aliases: ['breadth-first search'] },
  { id: 'a-dfs', kind: 'algorithm', label: 'DFS', aliases: ['depth-first search'] },
  { id: 'a-segtree', kind: 'algorithm', label: 'Segment Tree', aliases: ['seg tree'] },
  { id: 'a-dsu', kind: 'algorithm', label: 'DSU', aliases: ['union find', 'disjoint set'] },
  { id: 'a-kmp', kind: 'algorithm', label: 'KMP', aliases: ['knuth morris pratt'] },
  { id: 'a-sieve', kind: 'algorithm', label: 'Sieve', aliases: ['eratosthenes'] },
  { id: 'a-topo', kind: 'algorithm', label: 'Topological Sort', aliases: ['topo sort'] },
  { id: 'a-knapsack', kind: 'algorithm', label: 'Knapsack', aliases: ['0/1 knapsack'] },
  { id: 'a-binary-search', kind: 'algorithm', label: 'Binary Search', aliases: ['lower bound'] },
  { id: 'a-sorting', kind: 'algorithm', label: 'Sorting', aliases: ['sort'] },
  { id: 'a-prefix', kind: 'algorithm', label: 'Prefix Sums', aliases: ['prefix sum', 'difference array'] },
  { id: 'a-lca', kind: 'algorithm', label: 'LCA', aliases: ['lowest common ancestor'] },
  { id: 'a-mst', kind: 'algorithm', label: 'MST', aliases: ['kruskal', 'prim'] },
  { id: 'a-floyd', kind: 'algorithm', label: 'Floyd-Warshall', aliases: ['all pairs shortest path'] },
  { id: 'a-bellman', kind: 'algorithm', label: 'Bellman-Ford', aliases: [] },
  { id: 'a-hashing', kind: 'algorithm', label: 'String Hashing', aliases: ['rolling hash'] },
  { id: 'a-lis', kind: 'algorithm', label: 'LIS', aliases: ['longest increasing subsequence'] },
  { id: 'a-meet', kind: 'algorithm', label: 'Meet in the Middle', aliases: [] },
  { id: 'a-ternary', kind: 'algorithm', label: 'Ternary Search', aliases: [] },

  // Data structures
  { id: 'd-pq', kind: 'data_structure', label: 'Priority Queue', aliases: ['heap'] },
  { id: 'd-hashmap', kind: 'data_structure', label: 'Hash Map', aliases: ['unordered map', 'dictionary'] },
  { id: 'd-mono-stack', kind: 'data_structure', label: 'Monotonic Stack', aliases: ['mono stack'] },
  { id: 'd-fenwick', kind: 'data_structure', label: 'Fenwick Tree', aliases: ['bit', 'binary indexed tree'] },
  { id: 'd-sparse', kind: 'data_structure', label: 'Sparse Table', aliases: ['rmq'] },
  { id: 'd-array', kind: 'data_structure', label: '1D Array', aliases: ['array'] },
  { id: 'd-2d', kind: 'data_structure', label: '2D Array', aliases: ['matrix'] },
  { id: 'd-set', kind: 'data_structure', label: 'Ordered Set', aliases: ['set', 'tree set'] },
  { id: 'd-deque', kind: 'data_structure', label: 'Deque', aliases: ['double ended queue'] },
  { id: 'd-graph', kind: 'data_structure', label: 'Adjacency List', aliases: ['graph'] },
  { id: 'd-trie', kind: 'data_structure', label: 'Trie', aliases: ['prefix tree'] },
  { id: 'd-stack', kind: 'data_structure', label: 'Stack', aliases: [] },
  { id: 'd-queue', kind: 'data_structure', label: 'Queue', aliases: [] },
];

export function tagsByKind(kind: TagCatalogEntry['kind']): TagCatalogEntry[] {
  return TAG_CATALOG.filter((t) => t.kind === kind);
}
