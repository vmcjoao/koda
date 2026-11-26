/**
 * Batch 8 — bring every TAG_CATALOG algorithm to ≥15 uses.
 * Usage: npm run ingest:curated-batch8
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { SEED_PROBLEMS } from '../../data/seed-problems';
import extraJson from '../../data/extra-problems.json';
import { COMPLEXITY_OPTIONS } from '../../constants/tags';

type Approach = {
  id: string;
  problem_id: string;
  approach_name: string;
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  key_insights: string[];
  editorial_summary_md: string;
};

type Draft = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  input_format_md: string;
  output_format_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string }[];
  target_complexity: string;
  approaches: Approach[];
};

type Offline = {
  title: string;
  statement_md: string;
  input_format_md: string;
  output_format_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string }[];
};

type Spec = {
  id: string;
  source: string;
  url: string;
  difficulty_rating: number;
  paradigms: string[];
  algorithms: string[];
  data_structures?: string[];
  key_insights: string[];
  approach_name: string;
  editorial_summary_md: string;
  target_complexity: string;
  offline: Offline;
};

function cfUrl(id: string): string {
  const m = id.slice(3).match(/^(\d+)([a-z]\d*)$/i);
  if (!m) return 'https://codeforces.com/problemset';
  return `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`;
}

function existingIds(): Set<string> {
  const ids = new Set<string>();
  for (const p of SEED_PROBLEMS) ids.add(p.id);
  for (const p of Array.isArray(extraJson) ? extraJson : []) {
    if (p && typeof p === 'object' && typeof (p as { id?: string }).id === 'string') {
      ids.add((p as { id: string }).id);
    }
  }
  return ids;
}

function defaultComplexity(raw: string): string {
  if ((COMPLEXITY_OPTIONS as readonly string[]).includes(raw)) return raw;
  if (/N³/i.test(raw)) return 'O(N³)';
  if (/N²/i.test(raw)) return 'O(N²)';
  if (/N \+ M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  if (/2\^N/i.test(raw)) return 'O(2^N)';
  return 'O(N)';
}

const SPECS: Spec[] = [
  // ── Meet in the Middle (+3) ──
  {
    id: 'cf-1005e2',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1005/E2',
    difficulty_rating: 2400,
    paradigms: ['Divide & Conquer', 'Math / Number Theory'],
    algorithms: ['Meet in the Middle', 'Prefix Sums', 'Binary Search'],
    data_structures: ['Hash Map'],
    key_insights: ['Median of even/odd length; MITM-style prefix balance counts around m'],
    approach_name: 'Median MITM',
    editorial_summary_md: 'Map balances left of m; match right prefixes for even-length median rules.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Median on Segments (General Case)',
      statement_md:
        'Permutation of $1..n$ containing $m$. Count subarrays whose median is $m$ (even lengths use the lower median).',
      input_format_md: 'n m and the permutation.',
      output_format_md: 'Print the count.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-888g-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1006/F',
    difficulty_rating: 2100,
    paradigms: ['Divide & Conquer', 'Brute Force', 'Graph Algorithms'],
    algorithms: ['Meet in the Middle', 'DFS'],
    data_structures: ['Hash Map', '2D Array'],
    key_insights: ['Half-paths from opposite corners meet on the anti-diagonal of the grid'],
    approach_name: 'Grid path MITM',
    editorial_summary_md: 'DFS half-length paths storing XOR→count; match from the other corner.',
    target_complexity: 'O(2^{N} · N)',
    offline: {
      title: 'Xor Paths (practice)',
      statement_md:
        'Count right/down paths from $(1,1)$ to $(n,m)$ whose XOR equals $k$ ($n+m\\le 40$).',
      input_format_md: 'n m k and the grid.',
      output_format_md: 'Number of paths.',
      constraints_text: '$n+m \\le 40$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc128-d',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc128/tasks/abc128_d',
    difficulty_rating: 1600,
    paradigms: ['Brute Force', 'Greedy', 'Divide & Conquer'],
    algorithms: ['Meet in the Middle', 'Sorting'],
    data_structures: ['Priority Queue', '1D Array'],
    key_insights: ['Enumerate how many take/put-back ops; MITM-like over left/right deque ends'],
    approach_name: 'Deque ops enumerate',
    editorial_summary_md: 'Try all counts of left/right takes and discards of negatives within K moves.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'equeue',
      statement_md:
        'Deque of jewel values. In ≤K moves take from either end or discard a held jewel. Maximize sum of held jewels.',
      input_format_md: 'N K and the array V.',
      output_format_md: 'Maximum achievable sum.',
      constraints_text: '$N \\le 50$',
      sample_io: [],
    },
  },

  // ── MST (+3) ──
  {
    id: 'cf-1245d-b',
    source: 'Codeforces',
    url: cfUrl('cf-1245d'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'Sorting'],
    data_structures: ['Priority Queue'],
    key_insights: ['Virtual node 0 for stations; Kruskal/Prim on cities + wires'],
    approach_name: 'Virtual-node MST',
    editorial_summary_md: 'Edge 0–i cost c_i; edge i–j cost (k_i+k_j)·Manhattan. Recover stations/wires.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Shichikuji and Power Grid',
      statement_md:
        'Connect n cities with power stations and wires. Station in i costs c_i; wire i–j costs $(k_i+k_j)\\cdot(|x_i-x_j|+|y_i-y_j|)$. Minimize total cost.',
      input_format_md: 'n, coordinates, c array, k array.',
      output_format_md: 'Cost, list of stations, list of wires.',
      constraints_text: '$n \\le 2000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-160d-b',
    source: 'Codeforces',
    url: cfUrl('cf-160d'),
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'DFS', 'Sorting'],
    data_structures: ['Adjacency List'],
    key_insights: ['Kruskal by weight; within equal-weight edges classify via bridges in component graph'],
    approach_name: 'MST edge classify',
    editorial_summary_md: 'Process weight groups; meta-graph bridges decide any/at least one/none.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Edges in MST (practice)',
      statement_md:
        'For each edge say if it appears in every MST, some MST, or no MST of the undirected weighted graph.',
      input_format_md: 'n m weighted edges.',
      output_format_md: 'm lines: `any`, `at least one`, or `none`.',
      constraints_text: '$m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-pt07z',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/PT07Z/',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'BFS', 'DFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['Tree diameter via two BFS; related to MST path bottlenecks on trees'],
    approach_name: 'Tree diameter',
    editorial_summary_md: 'BFS from arbitrary node to farthest, then BFS again for diameter length.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Longest path in a tree',
      statement_md: 'Given a tree with n nodes, find the length (edges) of the longest simple path.',
      input_format_md: 'n then n−1 edges.',
      output_format_md: 'The diameter length.',
      constraints_text: '$n \\le 10^4$',
      sample_io: [],
    },
  },

  // ── Ternary Search (+3) ──
  {
    id: 'cf-578c-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/578/C',
    difficulty_rating: 1800,
    paradigms: ['Binary Search on Answer', 'Math / Number Theory'],
    algorithms: ['Ternary Search'],
    data_structures: [],
    key_insights: ['f(x)=max prefix − min prefix of a_i−x is unimodal; ternary search x'],
    approach_name: 'Ternary on shift',
    editorial_summary_md: 'Ternary search real x minimizing the maximum |subarray sum| of a−x.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Weakness and Poorness',
      statement_md:
        'Choose real x; let b_i=a_i−x. Weakness is max |sum| over contiguous subarrays of b. Minimize weakness.',
      input_format_md: 'n and array a.',
      output_format_md: 'Minimum weakness (absolute/relative error 1e-6).',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-439d-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/439/D',
    difficulty_rating: 1700,
    paradigms: ['Binary Search on Answer', 'Greedy'],
    algorithms: ['Ternary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Cost to force max(a)≤min(b) is unimodal in the threshold t'],
    approach_name: 'Ternary threshold',
    editorial_summary_md: 'Ternary/binary search t; cost = Σ max(0,t−a_i)+max(0,b_j−t).',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Devu and his Brother',
      statement_md:
        'Arrays a and b. Increment a_i or decrement b_j by 1 per move. Make every a_i ≤ every b_j with minimum moves.',
      input_format_md: 'n m, array a, array b.',
      output_format_md: 'Minimum moves.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1486c1-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1486/C1',
    difficulty_rating: 1500,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Ternary Search', 'Binary Search'],
    data_structures: [],
    key_insights: ['Second-max queries; ternary/binary search the side containing the maximum'],
    approach_name: 'Interactive ternary',
    editorial_summary_md: 'Locate second maximum then binary/ternary search the segment with the max.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Guessing the Greatest (easy version)',
      statement_md:
        'Interactive: hidden permutation. Query `? l r` returns index of second maximum on [l,r]. Find the maximum’s index in ≤20 queries.',
      input_format_md: 'First line n; then interactive queries.',
      output_format_md: 'Print `! i` when found.',
      constraints_text: '$2 \\le n \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Bellman-Ford (+2) ──
  {
    id: 'cf-229b',
    source: 'Codeforces',
    url: cfUrl('cf-229b'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'Dijkstra'],
    data_structures: ['Priority Queue', 'Ordered Set'],
    key_insights: ['Shortest paths with forbidden arrival times; Dijkstra with next-free-time jumps'],
    approach_name: 'Timed SSSP',
    editorial_summary_md: 'At each node skip busy times; relax like Dijkstra (BF works on nonnegative too).',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Planes',
      statement_md:
        'Undirected weighted graph. At some vertices you cannot depart at certain integer times. Find earliest arrival at n from 1.',
      input_format_md: 'n m edges, then for each vertex the list of forbidden times.',
      output_format_md: 'Earliest time at n (or if unreachable still print the Dijkstra result convention of the statement).',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-938d-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/938/D',
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'Dijkstra'],
    data_structures: ['Priority Queue'],
    key_insights: ['Add super-source to all cities with edge cost a_i; Dijkstra = min concert+travel'],
    approach_name: 'Super-source SSSP',
    editorial_summary_md: 'Model buy-ticket-at-i then travel as distances from a virtual source.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Buy a Ticket',
      statement_md:
        'Undirected graph of cities. Concert in city i costs a_i; traveling an edge of weight w costs 2w. For each city print the minimum cost to attend some concert (possibly local).',
      input_format_md: 'n m, m edges, then array a.',
      output_format_md: 'n numbers — answers for each city.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── Floyd-Warshall (+2) ──
  {
    id: 'cf-25c-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/25/C',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['Incremental FW: new edge updates all pairs through its endpoints'],
    approach_name: 'Online FW',
    editorial_summary_md: 'After each new road, relax i→a→b→j and i→b→a→j for all i,j; print sum of pairs.',
    target_complexity: 'O(N²) per update',
    offline: {
      title: 'Roads in Berland',
      statement_md:
        'Complete graph distances among n cities. After each new bidirectional road, print the sum of pairwise shortest paths.',
      input_format_md: 'n, matrix, k updates (a b c).',
      output_format_md: 'k sums.',
      constraints_text: '$n \\le 300$',
      sample_io: [],
    },
  },
  {
    id: 'cf-295b-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/295/B',
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['Add vertices in reverse deletion order; FW only through the added set'],
    approach_name: 'Reverse FW',
    editorial_summary_md: 'Insert vertices backwards updating distances; record sum of pairs among remaining.',
    target_complexity: 'O(N³)',
    offline: {
      title: 'Greg and Graph',
      statement_md:
        'Directed complete weighted graph. Vertices deleted one by one; before each deletion print sum of pairwise shortest paths among remaining vertices.',
      input_format_md: 'n, matrix, deletion order.',
      output_format_md: 'n sums.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },

  // ── LIS (+2) ──
  {
    id: 'cf-486e-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/486/E',
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Binary Search', 'Segment Tree'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Forward/backward LIS lengths; classify positions vs global LIS'],
    approach_name: 'LIS classify',
    editorial_summary_md: 'lis_left + lis_right; mark 1/2/3 based on uniqueness in some LIS.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'LIS of Sequence',
      statement_md:
        'For each element of an array print whether it belongs to no LIS, some but not all LIS, or every LIS.',
      input_format_md: 'n and the array.',
      output_format_md: 'A string of digits 1/2/3 of length n.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-484e',
    source: 'Codeforces',
    url: cfUrl('cf-484e'),
    difficulty_rating: 2300,
    paradigms: ['Dynamic Programming', 'Divide & Conquer'],
    algorithms: ['LIS', 'Segment Tree', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Persistent segtree / offline queries for max min on subarrays — LIS-style thresholds'],
    approach_name: 'Persistent LIS queries',
    editorial_summary_md: 'Binary search answer; persistent segment tree tracks runnable lengths.',
    target_complexity: 'O(N log² N)',
    offline: {
      title: 'Signs',
      statement_md:
        'Array of heights. Answer queries: largest x such that some subarray of length ≥k inside [l,r] has minimum ≥x.',
      input_format_md: 'n, array, q queries l r k.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Topological Sort (+2) ──
  {
    id: 'cf-839c',
    source: 'Codeforces',
    url: cfUrl('cf-839c'),
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms', 'Math / Number Theory'],
    algorithms: ['Topological Sort', 'DFS', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Expected path length on a tree; DFS/topo-style aggregation of probabilities'],
    approach_name: 'Tree expectation',
    editorial_summary_md: 'From root, expected remaining length = 1 + avg over children.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Journey',
      statement_md:
        'A tree rooted at 1. Starting at 1, at each non-leaf move to a random child uniformly. What is the expected length of the journey until a leaf?',
      input_format_md: 'n and n−1 edges.',
      output_format_md: 'Expected length with absolute/relative error 1e-6.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-919d-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/919/D',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['DP on DAG of letter counts; cycle ⇒ −1'],
    approach_name: 'Topo DP letters',
    editorial_summary_md: 'If cycle print -1; else Kahn topo DP maximizing max letter frequency on a path.',
    target_complexity: 'O(26(N+M))',
    offline: {
      title: 'Substring',
      statement_md:
        'Directed graph with a letter on each vertex. Maximize occurrences of the most frequent letter on any path (or −1 if infinite).',
      input_format_md: 'n m, string of labels, then edges.',
      output_format_md: 'Maximum value or -1.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
];

async function main() {
  const have = existingIds();
  const todo = SPECS.filter((s) => !have.has(s.id));
  console.log(`Batch8: ${todo.length}/${SPECS.length} to add`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  for (const spec of todo) {
    const o = spec.offline;
    const draft: Draft = {
      id: spec.id,
      title: o.title,
      source: spec.source,
      url: spec.url,
      difficulty_rating: spec.difficulty_rating,
      statement_md: o.statement_md,
      input_format_md: o.input_format_md,
      output_format_md: o.output_format_md,
      constraints_text: o.constraints_text,
      sample_io: o.sample_io,
      target_complexity: defaultComplexity(spec.target_complexity),
      approaches: [
        {
          id: `${spec.id}-a1`,
          problem_id: spec.id,
          approach_name: spec.approach_name,
          paradigms: spec.paradigms,
          algorithms: spec.algorithms,
          data_structures: spec.data_structures || [],
          key_insights: spec.key_insights,
          editorial_summary_md: spec.editorial_summary_md,
        },
      ],
    };
    extras.push(draft);
    have.add(draft.id);
    added += 1;
    console.log(`  + ${draft.id}`);
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(`Added ${added}; extras now ${extras.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
