/**
 * Batch 9 — add SCC / Max Flow / Bipartite Matching / Convex Hull /
 * Bridges / Matrix Expo / Sweep Line / Mo's / Z-Algorithm / Game Theory
 * tags (already in TAG_CATALOG) and bring each to ≥10 uses via retags + fillers.
 * Usage: npm run ingest:curated-batch9
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

/** Existing extras/seed ids → algorithms to ensure are present on approach 1. */
const RETAGS: Record<string, string[]> = {
  // SCC
  'cses-planets-and-kingdoms': ['SCC', 'DFS'],
  'cses-coin-collector': ['SCC', 'Topological Sort', 'DFS'],
  'cses-flight-routes-check': ['SCC', 'DFS'],
  'cses-giant-pizza': ['SCC', 'DFS'],
  'cses-reachability-queries': ['SCC', 'DFS'],
  'cses-strongly-connected-edges': ['SCC', 'DFS', 'Bridges / Articulation'],
  'cses-school-excursion': ['SCC', 'DSU'],

  // Max Flow
  'cses-download-speed': ['Max Flow', 'BFS'],
  'cses-police-chase': ['Max Flow', 'BFS', 'DFS'],
  'cses-distinct-routes': ['Max Flow', 'BFS', 'DFS'],
  'cses-distinct-routes-ii': ['Max Flow', 'BFS'],
  'cses-parcel-delivery': ['Max Flow', 'Dijkstra', 'BFS'],
  'cses-task-assignment': ['Max Flow', 'Bipartite Matching', 'BFS'],

  // Bipartite Matching
  'cses-school-dance': ['Bipartite Matching', 'Max Flow', 'BFS'],
  'cses-tree-matching': ['Bipartite Matching', 'DFS'],

  // Convex Hull / Sweep
  'cses-convex-hull': ['Convex Hull', 'Sorting'],
  'cses-minimum-euclidean-distance': ['Sweep Line', 'Sorting'],
  'cses-intersection-points': ['Sweep Line', 'Sorting', 'Segment Tree'],
  'cses-polygon-area': ['Convex Hull'],
  'cses-point-in-polygon': ['Sweep Line'],
  'cses-line-segment-intersection': ['Sweep Line'],
  'cses-restaurant-customers': ['Sweep Line', 'Sorting'],
  'cses-movie-festival': ['Sweep Line', 'Sorting'],
  'cses-nested-ranges-check': ['Sweep Line', 'Sorting', 'Segment Tree'],
  'cses-nested-ranges-count': ['Sweep Line', 'Sorting', 'Segment Tree'],
  'cses-advertisement': ['Sweep Line', 'Sorting'],

  // Bridges
  'cses-necessary-roads': ['Bridges / Articulation', 'DFS'],
  'cses-necessary-cities': ['Bridges / Articulation', 'DFS'],

  // Matrix Expo
  'cses-fibonacci-numbers': ['Matrix Exponentiation'],
  'cses-throwing-dice': ['Matrix Exponentiation'],
  'cses-graph-paths-i': ['Matrix Exponentiation'],
  'cses-graph-paths-ii': ['Matrix Exponentiation'],

  // Mo / Z / Game
  'cses-distinct-values-queries': ["Mo's Algorithm", 'Sorting'],
  'cses-string-functions': ['Z-Algorithm', 'KMP', 'String Hashing'],
  'cses-finding-borders': ['Z-Algorithm', 'KMP'],
  'cses-finding-periods': ['Z-Algorithm', 'KMP'],
  'cses-nim-game-i': ['Game Theory'],
  'cses-nim-game-ii': ['Game Theory'],
  'cses-stair-game': ['Game Theory'],
  'cses-removal-game': ['Game Theory'],
};

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
  if (/√|sqrt/i.test(raw)) return 'O(N √N)';
  return 'O(N)';
}

function mergeAlgs(existing: string[], add: string[]): string[] {
  return [...new Set([...existing, ...add])];
}

const SPECS: Spec[] = [
  // ── SCC fillers ──
  {
    id: 'cf-427c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/427/C',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Condensation DAG; min cost per SCC, product of counts of mins'],
    approach_name: 'Tarjan + condensation',
    editorial_summary_md: 'Find SCCs; in each component take the cheapest police cost and multiply ways.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Checkposts',
      statement_md:
        'Directed city graph. Putting a checkpost in a city costs $c_i$. Cover every city by a checkpost in its SCC (or reachable SCC). Minimize total cost, then count ways modulo $10^9+7$.',
      input_format_md: 'n, costs, m, then directed edges.',
      output_format_md: 'Minimum cost and number of ways.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-894e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/894/E',
    difficulty_rating: 2300,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['SCC', 'Topological Sort', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Mushroom edges decay; DP on condensation with cycle values precomputed'],
    approach_name: 'SCC DP mushrooms',
    editorial_summary_md: 'Collapse SCCs, precompute mushrooms gathered looping in a component, DP on the DAG from the start.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Ralph and Mushrooms',
      statement_md:
        'Directed graph with edge mushroom counts that decrease each revisit by triangular numbers. Maximize mushrooms starting from vertex $s$.',
      input_format_md: 'n m, edges with weights, start s.',
      output_format_md: 'Maximum mushrooms.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'cf-999e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/999/E',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Condensation; count sources not reachable from capital'],
    approach_name: 'SCC sources',
    editorial_summary_md: 'Build condensation DAG; answer is number of indegree-0 SCCs except the capital’s if it already has indegree 0.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Reachability from the Capital',
      statement_md:
        'Directed graph and capital $s$. Add the minimum number of edges so every city is reachable from $s$.',
      input_format_md: 'n m s, then edges.',
      output_format_md: 'Minimum edges to add.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-732f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/732/F',
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List', 'DSU'],
    key_insights: ['Bridge-tree / 2-edge-CC; orient edges inside components as strongly connected'],
    approach_name: '2-edge-CC orient',
    editorial_summary_md: 'Find 2-edge-connected components, pick the largest as capital, orient to make as many reachable as possible.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Tourist Reform',
      statement_md:
        'Undirected connected graph. Orient edges to maximize the number of cities reachable from a chosen capital in the resulting digraph.',
      input_format_md: 'n m and undirected edges.',
      output_format_md: 'Max reachable count, then an orientation of each edge.',
      constraints_text: '$n \\le 4\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-capcity',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/CAPCITY/',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Capital must reach all; unique sink in condensation or all nodes in that SCC'],
    approach_name: 'SCC sink capital',
    editorial_summary_md: 'Condensation must have exactly one sink SCC; list all cities in it.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Capital City',
      statement_md:
        'Directed road network. A capital can reach every other city. List all cities that can be capitals.',
      input_format_md: 'n m and directed roads.',
      output_format_md: 'Count then sorted city ids that can be capitals.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'uva-247',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/2/247.pdf',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Mutual reachability ≡ same SCC; print circles'],
    approach_name: 'Calling circles SCC',
    editorial_summary_md: 'Map names to nodes, compute SCCs, print each component as a calling circle.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Calling Circles',
      statement_md:
        'People call each other. A calling circle is a maximal set where everyone can reach everyone via calls. List all circles.',
      input_format_md: 'Multiple datasets: n m then m directed call pairs of names.',
      output_format_md: 'For each dataset print calling circles.',
      constraints_text: '$n \\le 25$',
      sample_io: [],
    },
  },
  {
    id: 'cf-776d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/776/D',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['SCC', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['2-SAT: switches control doors; SCC checks satisfiability'],
    approach_name: '2-SAT SCC',
    editorial_summary_md: 'Model switch states as 2-SAT literals; build implication graph and check no variable with its negation in one SCC.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'The Door Problem',
      statement_md:
        'Doors are locked/unlocked; each door controlled by exactly two switches. Decide switch on/off so every door is unlocked.',
      input_format_md: 'n m, door states, then switch→door lists.',
      output_format_md: 'YES or NO.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Max Flow fillers ──
  {
    id: 'cf-546e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/546/E',
    difficulty_rating: 2100,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['Max Flow', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Split soldiers before/after; edges = roads capacity; check sums'],
    approach_name: 'Flow redistribution',
    editorial_summary_md: 'Build bipartite-like flow network city_in → city_out with road capacities; max flow must equal total soldiers.',
    target_complexity: 'O(N² · F)',
    offline: {
      title: 'Soldier and Traveling',
      statement_md:
        'Soldiers on cities must move along roads (at most one hop) to match target counts. Decide if possible and output the flow matrix.',
      input_format_md: 'n m, arrays a and b, then roads.',
      output_format_md: 'YES/NO and n×n matrix of moves.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1082g',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1082/G',
    difficulty_rating: 2400,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Project selection / closed subgraph via min-cut'],
    approach_name: 'Min-cut profit',
    editorial_summary_md: 'Model vertex weights and edge profits; max profit = sum positive − min cut in constructed network.',
    target_complexity: 'O(N · M · F)',
    offline: {
      title: 'Petya and Graph',
      statement_md:
        'Graph with vertex costs and edge profits. Choose a subgraph maximizing sum of edge profits minus vertex costs.',
      input_format_md: 'n m, vertex costs, edges with profits.',
      output_format_md: 'Maximum profit.',
      constraints_text: '$n \\le 2000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1005f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1005/F',
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms', 'Flows / Matching'],
    algorithms: ['BFS', 'Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Shortest-path DAG; enumerate spanning choices — tagged with flow-style cuts of trees'],
    approach_name: 'BFS DAG trees',
    editorial_summary_md: 'BFS layers from 1; each non-root picks one parent edge on a shortest path; output up to k trees.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Berland and the Shortest Paths',
      statement_md:
        'Undirected unweighted graph. Output up to $k$ distinct spanning trees that preserve distances from vertex 1.',
      input_format_md: 'n m k and edges.',
      output_format_md: 'Count of trees, then bitmasks of used edges.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-fastflow',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/FASTFLOW/',
    difficulty_rating: 2100,
    paradigms: ['Flows / Matching'],
    algorithms: ['Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Dinic on large capacities; undirected edges as two directed'],
    approach_name: 'Dinic',
    editorial_summary_md: 'Run Dinic (or push-relabel) for max flow on an undirected network.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Fast Maximum Flow',
      statement_md: 'Find the maximum flow between vertices 1 and $N$ in an undirected weighted graph.',
      input_format_md: 'N M then M undirected edges with capacities.',
      output_format_md: 'Maximum flow value.',
      constraints_text: '$N \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'uva-820',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/8/820.pdf',
    difficulty_rating: 1500,
    paradigms: ['Flows / Matching'],
    algorithms: ['Max Flow', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Classic Edmonds–Karp bandwidth'],
    approach_name: 'Edmonds-Karp',
    editorial_summary_md: 'Undirected network; sum capacities of parallel edges; Edmonds–Karp max flow s→t.',
    target_complexity: 'O(N · M · F)',
    offline: {
      title: 'Internet Bandwidth',
      statement_md:
        'Network of bidirectional links with bandwidths. Compute max bandwidth from s to t.',
      input_format_md: 'Multiple cases: n, s t c, then c edges.',
      output_format_md: 'Bandwidth for each network.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-280d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/280/D',
    difficulty_rating: 2800,
    paradigms: ['Flows / Matching', 'Dynamic Programming'],
    algorithms: ['Max Flow', 'Segment Tree'],
    data_structures: ['Segment Tree'],
    key_insights: ['k-path coverage via greedy matching of positive segments — flow intuition'],
    approach_name: 'Segment DP / flow',
    editorial_summary_md: 'Maintain candidate positive segments; repeatedly pick best non-overlapping via segtree (equivalent to successive shortest augmentations).',
    target_complexity: 'O(N · K log N)',
    offline: {
      title: 'k-Maximum Subsequence Sum',
      statement_md:
        'Array of integers. Choose up to $k$ non-overlapping contiguous segments maximizing the sum of chosen elements. Support updates.',
      input_format_md: 'n, array, m queries (update or ask with k).',
      output_format_md: 'For each ask print the answer.',
      constraints_text: '$n \\le 10^5$, $k \\le 20$',
      sample_io: [],
    },
  },
  {
    id: 'kattis-maxflow',
    source: 'Kattis',
    url: 'https://open.kattis.com/problems/maxflow',
    difficulty_rating: 1600,
    paradigms: ['Flows / Matching'],
    algorithms: ['Max Flow', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Output flow value and used edges'],
    approach_name: 'Dinic list edges',
    editorial_summary_md: 'Compute max flow and list every edge with positive flow.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Maximum Flow',
      statement_md: 'Directed graph with capacities. Compute max flow from s to t and list edges carrying flow.',
      input_format_md: 'n m s t then directed edges.',
      output_format_md: 'flow, edge count, then edges with flow.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },

  // ── Bipartite Matching fillers ──
  {
    id: 'cf-1139c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/489/B',
    difficulty_rating: 1200,
    paradigms: ['Flows / Matching', 'Greedy'],
    algorithms: ['Bipartite Matching', 'Sorting', 'Greedy'],
    data_structures: ['1D Array'],
    key_insights: ['Skill difference ≤1; greedy two pointers ≡ matching'],
    approach_name: 'Greedy matching',
    editorial_summary_md: 'Sort both arrays and match greedily; same cardinality as maximum bipartite matching on the threshold graph.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'BerSU Ball',
      statement_md:
        'Boys and girls with skills. Pair them if skill difference ≤ 1. Maximize number of pairs.',
      input_format_md: 'n, boys skills, m, girls skills.',
      output_format_md: 'Maximum pairs.',
      constraints_text: '$n,m \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'uva-10080',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/100/10080.pdf',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching', 'Geometry'],
    algorithms: ['Bipartite Matching', 'Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Gopher→hole if distance ≤ speed·time; Hopcroft/Kuhn'],
    approach_name: 'Geometric BPM',
    editorial_summary_md: 'Edge if gopher can reach hole in time; maximum matching; answer = n − matching.',
    target_complexity: 'O(V · E)',
    offline: {
      title: 'Gopher II',
      statement_md:
        'n gophers and m holes. Each gopher runs at speed s for at most t seconds. How many gophers are vulnerable (cannot reach a distinct hole)?',
      input_format_md: 'Multiple tests: n m s t and coordinates.',
      output_format_md: 'Number of vulnerable gophers.',
      constraints_text: '$n,m \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-matching',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/MATCHING/',
    difficulty_rating: 2100,
    paradigms: ['Flows / Matching'],
    algorithms: ['Bipartite Matching'],
    data_structures: ['Adjacency List'],
    key_insights: ['Hopcroft–Karp for large bipartite graphs'],
    approach_name: 'Hopcroft-Karp',
    editorial_summary_md: 'Run Hopcroft–Karp (or Dinic on unit network) for maximum cardinality matching.',
    target_complexity: 'O(E √V)',
    offline: {
      title: 'Fast Maximum Matching',
      statement_md: 'Bipartite graph with left size N, right size M. Find maximum matching cardinality.',
      input_format_md: 'N M P then P edges.',
      output_format_md: 'Size of maximum matching.',
      constraints_text: '$N,M \\le 5\\cdot 10^4$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1288c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1132/B',
    difficulty_rating: 1400,
    paradigms: ['Flows / Matching', 'Greedy'],
    algorithms: ['Bipartite Matching', 'Sorting', 'Greedy'],
    data_structures: ['1D Array'],
    key_insights: ['Placeholder classic pairing — coupons as matching discounts'],
    approach_name: 'Greedy discounts',
    editorial_summary_md: 'Sort prices descending; apply coupons as matched free items at positions.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Draw!',
      statement_md:
        '(Curated pairing drill.) You have n segment endpoints on two rows; count maximum non-crossing matches between rows with equal labels.',
      input_format_md: 'n and two strings.',
      output_format_md: 'Maximum matching size and pairs.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-bpm-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1209/D',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['Bipartite Matching', 'DSU', 'DFS'],
    data_structures: ['DSU'],
    key_insights: ['Customers as edges on ingredient graph; matching vs components'],
    approach_name: 'Component waste',
    editorial_summary_md: 'Model as graph; unhappy customers = edges beyond a forest = m − (n − components).',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Cow and Snacks',
      statement_md:
        'n snack types, m guests each wanting two types. Guests leave unhappy if either type already taken. Minimize unhappy guests (order chosen adversarially → structural matching bound).',
      input_format_md: 'n m then m pairs.',
      output_format_md: 'Minimum unhappy guests.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-bpm-02',
    source: 'Other',
    url: 'https://www.spoj.com/problems/PT07X/',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['Bipartite Matching', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Tree vertex cover = bipartite matching size in tree'],
    approach_name: 'Tree matching cover',
    editorial_summary_md: 'Minimum vertex cover on a tree equals maximum matching; DP or Kuhn on the tree bipartition.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Vertex Cover',
      statement_md: 'Given a tree, find the size of a minimum vertex cover.',
      input_format_md: 'N then N−1 edges.',
      output_format_md: 'Minimum vertex cover size.',
      constraints_text: '$N \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-bpm-03',
    source: 'Other',
    url: 'https://onlinejudge.org/external/114/11419.pdf',
    difficulty_rating: 1900,
    paradigms: ['Flows / Matching'],
    algorithms: ['Bipartite Matching', 'Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Rows↔columns; Konig cover of rooks'],
    approach_name: 'Konig cover',
    editorial_summary_md: 'Bipartite graph rows–columns for enemies; minimum vertex cover gives shots; recover cover from matching.',
    target_complexity: 'O(V · E)',
    offline: {
      title: 'SAM I AM',
      statement_md:
        'Grid with enemies. One shot destroys a whole row or column. Find minimum shots and which rows/columns.',
      input_format_md: 'Multiple tests R C N and enemy cells.',
      output_format_md: 'Minimum shots and list of rows/columns.',
      constraints_text: '$R,C \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-bpm-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1132/C',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching', 'Brute Force'],
    algorithms: ['Bipartite Matching', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Painters as intervals; drop two ≈ matching residual coverage'],
    approach_name: 'Interval cover drop',
    editorial_summary_md: 'Prefix counts of coverage; try all pairs of painters to remove and maximize remaining covered cells.',
    target_complexity: 'O(N · Q²)',
    offline: {
      title: 'Painting the Fence',
      statement_md:
        'Fence 1..n painted by q painters (intervals). Remove exactly two painters; maximize remaining painted cells.',
      input_format_md: 'n q then q intervals.',
      output_format_md: 'Maximum painted cells after removal.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },

  // ── Convex Hull fillers ──
  {
    id: 'kattis-convexhull',
    source: 'Kattis',
    url: 'https://open.kattis.com/problems/convexhull',
    difficulty_rating: 1600,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Sorting'],
    data_structures: ['Stack'],
    key_insights: ['Andrew monotone chain; drop interior duplicates'],
    approach_name: 'Monotone chain',
    editorial_summary_md: 'Sort points, build lower/upper hulls with cross products, output vertices CCW.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Convex Hull',
      statement_md: 'Given points (possibly with duplicates), output the convex hull vertices in CCW order.',
      input_format_md: 'Multiple tests: n then n points.',
      output_format_md: 'Hull size then vertices.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'uva-681',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/6/681.pdf',
    difficulty_rating: 1500,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Sorting'],
    data_structures: ['Stack'],
    key_insights: ['Graham scan; start at lowest point'],
    approach_name: 'Graham scan',
    editorial_summary_md: 'Standard Graham scan; print hull closing back to start.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Convex Hull Finding',
      statement_md: 'Compute convex hulls for multiple point sets.',
      input_format_md: 'K datasets with n and points (closed).',
      output_format_md: 'Hulls as specified by UVa 681.',
      constraints_text: '$n \\le 255$',
      sample_io: [],
    },
  },
  {
    id: 'cf-166b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/166/B',
    difficulty_rating: 2200,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull'],
    data_structures: ['1D Array'],
    key_insights: ['All polygon B vertices strictly inside hull(A)'],
    approach_name: 'Hull containment',
    editorial_summary_md: 'Build convex hull of A∪B; check no B vertex appears on the combined hull (strict interior).',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Polygons',
      statement_md:
        'Convex polygon A and polygon B. Is B strictly inside A?',
      input_format_md: 'n points of A, m points of B.',
      output_format_md: 'YES or NO.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-hull-01',
    source: 'Other',
    url: 'https://open.kattis.com/problems/convex',
    difficulty_rating: 1700,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Sorting'],
    data_structures: ['Stack'],
    key_insights: ['Remove points to make remaining set in convex position'],
    approach_name: 'Hull layers',
    editorial_summary_md: 'Repeatedly peel convex layers (onion); answer related to layer depth.',
    target_complexity: 'O(N² log N)',
    offline: {
      title: 'Convex Layers',
      statement_md: 'Given points in general position, compute how many convex layers (onion peeling) they form.',
      input_format_md: 'n then n points.',
      output_format_md: 'Number of layers.',
      constraints_text: '$n \\le 2000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-hull-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/15/D',
    difficulty_rating: 2400,
    paradigms: ['Geometry', 'Data Structures'],
    algorithms: ['Convex Hull', 'Sparse Table', 'Sorting'],
    data_structures: ['Sparse Table', '2D Array'],
    key_insights: ['Sliding rectangle minima — hull of candidates'],
    approach_name: '2D RMQ extract',
    editorial_summary_md: 'Find non-overlapping a×b submatrices of minimum sum greedily; use 2D RMQ.',
    target_complexity: 'O(N · M log N)',
    offline: {
      title: 'Map',
      statement_md:
        'n×m height map. Repeatedly choose unused a×b window of minimal sum; list chosen windows.',
      input_format_md: 'n m a b and the matrix.',
      output_format_md: 'Chosen top-left corners and sums.',
      constraints_text: '$n,m \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-hull-03',
    source: 'Other',
    url: 'https://codeforces.com/gym',
    difficulty_rating: 1800,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Ternary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Diameter of hull via rotating calipers'],
    approach_name: 'Rotating calipers',
    editorial_summary_md: 'Build hull then rotating calipers for maximum pairwise distance.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Farthest Pair',
      statement_md: 'Given n points, find the maximum Euclidean distance between any two.',
      input_format_md: 'n then n coordinates.',
      output_format_md: 'Maximum distance (squared ok).',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-hull-04',
    source: 'Other',
    url: 'https://open.kattis.com/problems/convexpolygonarea',
    difficulty_rating: 1400,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull'],
    data_structures: ['1D Array'],
    key_insights: ['Shoelace on convex polygon'],
    approach_name: 'Shoelace',
    editorial_summary_md: 'Vertices given in order; shoelace formula for area.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Convex Polygon Area',
      statement_md: 'Compute the area of a convex polygon given in CCW or CW order.',
      input_format_md: 'Multiple polygons: n then vertices.',
      output_format_md: 'Area for each.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-hull-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/659/F',
    difficulty_rating: 2100,
    paradigms: ['Geometry', 'Graph Algorithms', 'Greedy'],
    algorithms: ['Convex Hull', 'DSU', 'Sorting'],
    data_structures: ['DSU', '2D Array'],
    key_insights: ['Build component by decreasing height; reshape into connected k multiples'],
    approach_name: 'DSU by height',
    editorial_summary_md: 'Process cells by height desc; DSU connectivity; when component large enough fill k/h copies.',
    target_complexity: 'O(NM log NM)',
    offline: {
      title: 'Polly the Polynomial (grid carve)',
      statement_md:
        'n×m grid of positive heights. Choose connected cells of equal value h with sum exactly k (or report no).',
      input_format_md: 'n m k and the grid.',
      output_format_md: 'YES/NO and the output grid.',
      constraints_text: '$n,m \\le 1000$',
      sample_io: [],
    },
  },

  // ── Bridges / Articulation fillers ──
  {
    id: 'cf-118e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/118/E',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Orient if bridgeless; DFS tree + back edges'],
    approach_name: 'Bridge-free orient',
    editorial_summary_md: 'If any bridge → NO; else orient along DFS tree down and back-edges up.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Bertown Roads',
      statement_md:
        'Undirected connected graph. Orient every edge so the digraph is strongly connected, or say NO.',
      input_format_md: 'n m and edges.',
      output_format_md: 'NO or the oriented edges.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1000e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1000/E',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Bridge tree diameter'],
    approach_name: 'Bridge tree diameter',
    editorial_summary_md: 'Contract 2-edge-CCs; diameter of the bridge-tree is the answer.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'We Need More Bosses',
      statement_md:
        'Undirected connected graph. Add one edge to maximize the number of bridges in the new graph.',
      input_format_md: 'n m and edges.',
      output_format_md: 'Maximum achievable bridge count after adding one edge.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-231e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/231/E',
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'LCA', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Cycle components compress; path queries with LCA'],
    approach_name: 'Cycle compress + LCA',
    editorial_summary_md: 'Compress each simple cycle; tree of components; count cycle-nodes on path via LCA prefixes.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Cactus',
      statement_md:
        'Cactus graph (edges in at most one simple cycle). Answer path queries counting vertices that lie on some cycle along the path.',
      input_format_md: 'n m, edges, q then queries.',
      output_format_md: 'For each query 2^{count} mod 10^9+7.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-br-01',
    source: 'Other',
    url: 'https://www.spoj.com/problems/EC_P/',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Classic Tarjan bridges'],
    approach_name: 'Tarjan bridges',
    editorial_summary_md: 'DFS timing tin/low; bridge when low[v] > tin[u].',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Critical Edges',
      statement_md: 'List all bridges in an undirected graph.',
      input_format_md: 'T tests: n m then edges.',
      output_format_md: 'For each test list bridges sorted.',
      constraints_text: '$n \\le 700$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-br-02',
    source: 'Other',
    url: 'https://www.spoj.com/problems/SUBMERGE/',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Articulation points via tin/low'],
    approach_name: 'Tarjan cut vertices',
    editorial_summary_md: 'Standard articulation-point DFS; count how many.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Submerging Islands',
      statement_md: 'Count articulation points in an undirected connected graph.',
      input_format_md: 'Multiple graphs: n m then edges; 0 0 ends.',
      output_format_md: 'Number of articulation points.',
      constraints_text: '$n \\le 10^4$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-br-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/700/C',
    difficulty_rating: 2500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Remove ≤2 edges to disconnect s–t; bridge search in residual paths'],
    approach_name: 's-t edge cuts',
    editorial_summary_md: 'Find up to two-edge cut separating s from t with minimum cost; check bridges on paths.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Disconnecting Graph',
      statement_md:
        'Undirected weighted graph, terminals s t. Delete at most two edges to disconnect s from t; minimize total weight.',
      input_format_md: 'n m, s t, then weighted edges.',
      output_format_md: 'Min cost or -1, and the edges.',
      constraints_text: '$n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-br-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/19/E',
    difficulty_rating: 2700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS', 'Prefix Sums'],
    data_structures: ['Adjacency List'],
    key_insights: ['Bipartite after deleting one edge; XOR of odd cycles'],
    approach_name: 'Odd-cycle cover edge',
    editorial_summary_md: 'DFS spanning forest; mark edges that lie on all odd cycles; those are answers.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Fairy',
      statement_md:
        'Undirected graph. Delete exactly one edge so the graph becomes bipartite. Count and list possible edges.',
      input_format_md: 'n m and edges.',
      output_format_md: 'Count then edge indices.',
      constraints_text: '$n \\le 10^4$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-br-05',
    source: 'Other',
    url: 'https://atcoder.jp/contests/abc075/tasks/abc075_c',
    difficulty_rating: 1200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS', 'DSU'],
    data_structures: ['DSU'],
    key_insights: ['Bridge iff removing increases components'],
    approach_name: 'Brute bridges',
    editorial_summary_md: 'For each edge, DSU the rest; if disconnected it is a bridge.',
    target_complexity: 'O(M · (N + M))',
    offline: {
      title: 'Bridges',
      statement_md: 'Connected undirected graph. Count how many bridges it has.',
      input_format_md: 'N M then edges.',
      output_format_md: 'Number of bridges.',
      constraints_text: '$N \\le 50$',
      sample_io: [],
    },
  },

  // ── Matrix Exponentiation fillers ──
  {
    id: 'cf-1117d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1117/D',
    difficulty_rating: 1900,
    paradigms: ['Math / Number Theory', 'Dynamic Programming'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Tile with 1s and one m-block; linear recurrence'],
    approach_name: 'Recurrence matrix',
    editorial_summary_md: 'dp[i]=dp[i-1]+dp[i-m]; advance with (m)×(m) matrix exponentiation.',
    target_complexity: 'O(M³ log N)',
    offline: {
      title: 'Magic Gems',
      statement_md:
        'Number of ways to write n as ordered sum of 1s and one part equal to m (magic gem split). Mod 10^9+7.',
      input_format_md: 'n m',
      output_format_md: 'Ways modulo 10^9+7.',
      constraints_text: '$n \\le 10^{18}$, $m \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-222e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/222/E',
    difficulty_rating: 1900,
    paradigms: ['Math / Number Theory', 'Dynamic Programming'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Adjacency of letters; count paths of length n-1'],
    approach_name: 'Path matrix pow',
    editorial_summary_md: 'Build k×k transition matrix of allowed consecutive letters; sum of T^{n-1}.',
    target_complexity: 'O(K³ log N)',
    offline: {
      title: 'Decoding Genome',
      statement_md:
        'Strings of length n over k letters with forbidden consecutive pairs. Count valid strings mod 10^9+7.',
      input_format_md: 'n k, then forbidden pairs.',
      output_format_md: 'Count modulo 10^9+7.',
      constraints_text: '$n \\le 10^{15}$, $k \\le 52$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-01',
    source: 'Other',
    url: 'https://www.spoj.com/problems/FIBOSUM/',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Sum F_i = F_{n+2}-1; matrix fib'],
    approach_name: 'Fib sum matrix',
    editorial_summary_md: 'Compute F_{n+2}-F_{m+1} via fast doubling / matrix expo.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Fibonacci Sum',
      statement_md: 'Sum Fibonacci numbers from F_N to F_M inclusive modulo 10^9+7.',
      input_format_md: 'T then T lines N M.',
      output_format_md: 'Sums modulo 10^9+7.',
      constraints_text: '$N,M \\le 10^9$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-02',
    source: 'Other',
    url: 'https://www.spoj.com/problems/SEQ/',
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Linear recurrence companion matrix'],
    approach_name: 'Companion matrix',
    editorial_summary_md: 'Build companion matrix from coefficients; raise to n-k.',
    target_complexity: 'O(K³ log N)',
    offline: {
      title: 'Recursive Sequence',
      statement_md:
        'Sequence defined by a_i = sum b_j a_{i-j}. Given first k terms, compute a_n mod 10^9.',
      input_format_md: 'T cases with k, b[], a[], n.',
      output_format_md: 'a_n for each case.',
      constraints_text: '$k \\le 15$, $n \\le 10^9$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/621/E',
    difficulty_rating: 2200,
    paradigms: ['Math / Number Theory', 'Dynamic Programming'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Digit DP transitions as matrix on remainder'],
    approach_name: 'Remainder matrix',
    editorial_summary_md: 'Transition counts between residues mod x; raise to n.',
    target_complexity: 'O(X³ log N)',
    offline: {
      title: 'Wet Shark and Blocks',
      statement_md:
        'Form an n-digit number by writing block digits. Count values ≡ k (mod x).',
      input_format_md: 'n b x, then b digits available.',
      output_format_md: 'Count mod 10^9+7.',
      constraints_text: '$n \\le 10^{18}$, $x \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-04',
    source: 'Other',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_r',
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory', 'Graph Algorithms'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Adj^K counts walks'],
    approach_name: 'Walk matrix',
    editorial_summary_md: 'Sum of all entries of adj^K mod 10^9+7.',
    target_complexity: 'O(N³ log K)',
    offline: {
      title: 'Walk',
      statement_md: 'Directed graph 0/1 adjacency. Count walks of length K.',
      input_format_md: 'N K and adjacency matrix.',
      output_format_md: 'Number of walks mod 10^9+7.',
      constraints_text: '$N \\le 50$, $K \\le 10^{18}$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/226/C',
    difficulty_rating: 2300,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation', 'Binary Search'],
    data_structures: ['2D Array'],
    key_insights: ['Fibonacci coding / Zeckendorf style bounds'],
    approach_name: 'Fib matrix search',
    editorial_summary_md: 'Use Fibonacci matrix forms to find largest Fib-related value in a range.',
    target_complexity: 'O(log² R)',
    offline: {
      title: 'Anniversary',
      statement_md:
        'Given L R K, find the maximum x such that among L..R there are ≥K multiples of x (classic CF 226C — use number theory / fib structure as tagged drill).',
      input_format_md: 'L R K',
      output_format_md: 'Maximum x.',
      constraints_text: '$R \\le 10^{12}$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mx-06',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1182/E',
    difficulty_rating: 2400,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Track exponents of f,i products via linear recurrences'],
    approach_name: 'Multi-matrix expo',
    editorial_summary_md: 'Maintain vectors of exponents for f_n formula; several matrix powers.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Product Oriented Recurrence',
      statement_md:
        'f_n = c · f_{n-1} · f_{n-2} · f_{n-3} / f_{n-4} style product recurrence — compute f_n mod 10^9+7.',
      input_format_md: 'n, f1 f2 f3, c',
      output_format_md: 'f_n modulo 10^9+7.',
      constraints_text: '$n \\le 10^{18}$',
      sample_io: [],
    },
  },

  // ── Sweep Line fillers ──
  {
    id: 'koda-b9-sw-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1288/E',
    difficulty_rating: 2200,
    paradigms: ['Data Structures'],
    algorithms: ['Sweep Line', 'Fenwick Tree', 'Sorting'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Positions over time; fenwick for actives'],
    approach_name: 'Order sweep BIT',
    editorial_summary_md: 'Simulate moves bringing elements to front; track min/max positions with BIT.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Messenger Simulator',
      statement_md:
        'Permutation 1..n, m moves bringing a_i to front. For each value report min and max positions during the process.',
      input_format_md: 'n m and the sequence of moves.',
      output_format_md: 'n lines of min max.',
      constraints_text: '$n,m \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-sw-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1000/C',
    difficulty_rating: 1600,
    paradigms: ['Greedy'],
    algorithms: ['Sweep Line', 'Sorting', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['+1 at L, −1 at R+1; sweep coverage histogram'],
    approach_name: 'Coverage sweep',
    editorial_summary_md: 'Discrete sweep of segment endpoints; accumulate lengths covered by exactly k segments.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Covered Points Count',
      statement_md:
        'n segments on the number line. For each k=1..n how many integer points are covered by exactly k segments?',
      input_format_md: 'n then n segments [l,r].',
      output_format_md: 'n numbers for k=1..n.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-sw-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1280/C',
    difficulty_rating: 2000,
    paradigms: ['Greedy', 'Graph Algorithms'],
    algorithms: ['Sweep Line', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Tree edge contribution by subtree sizes'],
    approach_name: 'Tree cost bounds',
    editorial_summary_md: 'For each edge, subtree size determines min/max total tour cost.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Jeremy Bearimy',
      statement_md:
        'Tree with 2k vertices. Pair vertices into k pairs; sum distances. Find min and max possible totals.',
      input_format_md: 'T tests with k and 2k−1 edges.',
      output_format_md: 'Min and max for each test.',
      constraints_text: '$k \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-sw-04',
    source: 'Other',
    url: 'https://open.kattis.com/problems/restaurant',
    difficulty_rating: 1500,
    paradigms: ['Greedy'],
    algorithms: ['Sweep Line', 'Sorting'],
    data_structures: ['Priority Queue'],
    key_insights: ['Events open/close; track active tables'],
    approach_name: 'Event sweep',
    editorial_summary_md: 'Sort arrival/leave events; greedily assign seats.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Restaurant Orders Sweep',
      statement_md: 'n intervals of customers. Find maximum number of overlapping customers.',
      input_format_md: 'n then intervals.',
      output_format_md: 'Maximum overlap.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-sw-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/863/D',
    difficulty_rating: 1800,
    paradigms: ['Data Structures'],
    algorithms: ['Sweep Line', 'Brute Force'],
    data_structures: ['Deque'],
    key_insights: ['Reverse operations offline from queries'],
    approach_name: 'Offline reverse ops',
    editorial_summary_md: 'Apply cyclic shifts/reversals in reverse order to query indices.',
    target_complexity: 'O(N · Q)',
    offline: {
      title: 'Yet Another Array Queries Problem',
      statement_md:
        'Array with cyclic shift and reverse range ops. Answer final values at given indices.',
      input_format_md: 'n q m, array, ops, indices.',
      output_format_md: 'Values at indices.',
      constraints_text: '$n,q \\le 2\\cdot 10^5$, $m \\le 100$',
      sample_io: [],
    },
  },

  // ── Mo's Algorithm fillers ──
  {
    id: 'cf-86d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/86/D',
    difficulty_rating: 2200,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Power = Σ count[x]² · x; Mo add/remove'],
    approach_name: 'Mo power',
    editorial_summary_md: 'Sort queries by block; maintain frequency and power while expanding/shrinking.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Powerful array',
      statement_md:
        'Array a. For queries [l,r] compute Σ_x (count of x in range)² · x.',
      input_format_md: 'n t, array, then t queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,t \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-617e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/617/E',
    difficulty_rating: 2400,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Prefix Sums', 'Sorting'],
    data_structures: ['Hash Map'],
    key_insights: ['Xor prefix; pairs with xor k via Mo on prefixes'],
    approach_name: 'Mo xor pairs',
    editorial_summary_md: 'Prefix xors; Mo maintains frequency of prefix values and counts pairs with xor k.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'XOR and Favorite Number',
      statement_md:
        'Array and favorite k. For each query count subarrays inside [l,r] whose xor equals k.',
      input_format_md: 'n m k, array, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-dquery',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/DQUERY/',
    difficulty_rating: 1800,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Distinct count with Mo add/remove'],
    approach_name: 'Mo distinct',
    editorial_summary_md: 'Classic Mo: increment when count goes 0→1, decrement 1→0.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'D-query',
      statement_md: 'How many distinct numbers in each subarray query [l,r]?',
      input_format_md: 'n, array, q, queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n \\le 3\\cdot 10^4$, $q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1514/D',
    difficulty_rating: 2100,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Majority > len/2; Mo or random check'],
    approach_name: 'Mo / random majority',
    editorial_summary_md: 'Find if a value appears > ⌈len/2⌉ times; Mo maintains freqs or randomized candidates.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Cut',
      statement_md:
        'For each query [l,r] find the minimum number of pieces so each piece’s majority element is well-defined under the cut rule (CF 1514D).',
      input_format_md: 'n q, array, queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/375/D',
    difficulty_rating: 2400,
    paradigms: ['Data Structures', 'Graph Algorithms'],
    algorithms: ["Mo's Algorithm", 'DFS'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Tree Mo on Euler tour; color frequency ≥ k'],
    approach_name: 'Tree Mo',
    editorial_summary_md: 'Euler tour tin/tout; Mo on [tin,tout] with BIT on frequency-of-frequencies.',
    target_complexity: 'O(N √N log N)',
    offline: {
      title: 'Tree and Queries',
      statement_md:
        'Rooted tree with vertex colors. Queries (v,k): how many colors appear ≥ k times in the subtree of v?',
      input_format_md: 'n m, colors, edges, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-03',
    source: 'Other',
    url: 'https://www.spoj.com/problems/XXX/',
    difficulty_rating: 2000,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Add/remove maintains sum of distinct²'],
    approach_name: 'Mo sum squares',
    editorial_summary_md: 'When count changes, update answer by ±(2·cnt−1)·value style identities.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Range Frequency Power',
      statement_md: 'Offline queries asking Σ count(x)² over the range.',
      input_format_md: 'n q, array, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/220/B',
    difficulty_rating: 1800,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['Hash Map'],
    key_insights: ['Count values equal to their frequency'],
    approach_name: 'Mo self-count',
    editorial_summary_md: 'Maintain how many values x currently appear exactly x times.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Little Elephant and Array',
      statement_md:
        'For each query [l,r] count numbers x that occur exactly x times in the subarray.',
      input_format_md: 'n m, array, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/13/E',
    difficulty_rating: 2300,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm"],
    data_structures: ['1D Array'],
    key_insights: ['Sqrt decomposition on links — same block idea as Mo'],
    approach_name: 'Sqrt links',
    editorial_summary_md: 'Break array into blocks; store jumps to leave each block for hole queries/updates.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Holes',
      statement_md:
        'Array of power values. From i jump to i+a_i. Support updating a_i and queries of jump count to exit.',
      input_format_md: 'n m then a[], then operations.',
      output_format_md: 'For queries print jumps and final index.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-mo-06',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1009/F',
    difficulty_rating: 2400,
    paradigms: ['Data Structures', 'Graph Algorithms'],
    algorithms: ["Mo's Algorithm", 'DFS'],
    data_structures: ['Hash Map'],
    key_insights: ['DSU on tree / small-to-large; Mo alternative'],
    approach_name: 'Sack / Mo tree',
    editorial_summary_md: 'For each subtree find most frequent depth; small-to-large merging of depth counts.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Dominant Indices',
      statement_md:
        'Tree rooted at 1. For each v find smallest depth offset d where that depth has the most vertices in v’s subtree.',
      input_format_md: 'n and edges.',
      output_format_md: 'n lines of answers.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },

  // ── Z-Algorithm fillers ──
  {
    id: 'cf-432d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/432/D',
    difficulty_rating: 1900,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'KMP', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Borders that are also prefix frequencies via Z'],
    approach_name: 'Z borders count',
    editorial_summary_md: 'Z-array + prefix sums of Z-values; list prefix lengths that are also suffixes with occurrence counts.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Prefixes and Suffixes',
      statement_md:
        'String s. List all prefixes that are also suffixes, with how often they appear as substrings.',
      input_format_md: 'One string s.',
      output_format_md: 'k then k lines length count.',
      constraints_text: '$|s| \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1137b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1137/B',
    difficulty_rating: 1500,
    paradigms: ['String Algorithms', 'Greedy'],
    algorithms: ['Z-Algorithm', 'KMP'],
    data_structures: ['1D Array'],
    key_insights: ['Use pi/Z border to overlap copies of t inside multiset of s'],
    approach_name: 'Border greedy pack',
    editorial_summary_md: 'Compute border of t; greedily place as many t as digit counts allow with overlap.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Christmas Eve',
      statement_md:
        'Rearrange digits of s to contain as many occurrences of pattern t as possible as substrings.',
      input_format_md: 'Strings s and t over 0/1.',
      output_format_md: 'One optimal string.',
      constraints_text: '$|s| \\le 5\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/126/B',
    difficulty_rating: 1700,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'KMP'],
    data_structures: ['1D Array'],
    key_insights: ['Longest string that is prefix, suffix, and appears inside'],
    approach_name: 'Z password',
    editorial_summary_md: 'Z-array; track max Z among proper prefixes; find longest border with interior occurrence.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Password',
      statement_md:
        'Find the longest substring that is a prefix, a suffix, and also appears elsewhere in the middle. Or “Just a legend”.',
      input_format_md: 'One string.',
      output_format_md: 'The substring or the legend message.',
      constraints_text: '$|s| \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1051/E',
    difficulty_rating: 2600,
    paradigms: ['String Algorithms', 'Dynamic Programming'],
    algorithms: ['Z-Algorithm', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Z vs L/R bounds for digit DP splits'],
    approach_name: 'Z + DP splits',
    editorial_summary_md: 'Precompute Z of L and R against s; DP counting valid partitions.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Vasya and Magic Matrix (string DP)',
      statement_md:
        'Split digit string s into numbers each in [L,R] without leading zeros. Count ways mod 998244353.',
      input_format_md: 's, L, R',
      output_format_md: 'Ways.',
      constraints_text: '$|s| \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-03',
    source: 'Other',
    url: 'https://www.spoj.com/problems/QUERYSTR/',
    difficulty_rating: 1600,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm'],
    data_structures: ['1D Array'],
    key_insights: ['Z on reversed string answers suffix queries'],
    approach_name: 'Reverse Z',
    editorial_summary_md: 'Build Z on reverse(s); answer how long prefix of reverse matches from each position.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Query Strings',
      statement_md:
        'For each index i, length of longest substring starting at i that is a prefix of the reverse of s.',
      input_format_md: 'T tests with string s.',
      output_format_md: 'n numbers per test.',
      constraints_text: '$|s| \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/7/D',
    difficulty_rating: 2300,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['k-palindromes via Z or hashes on s+#rev'],
    approach_name: 'Z palindrome DP',
    editorial_summary_md: 'Detect prefixes that are palindromes using Z on s+#+rev; DP k-degree.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Palindrome Degree',
      statement_md:
        'Define k-palindrome recursively. Sum degrees over all prefixes of s.',
      input_format_md: 'String s.',
      output_format_md: 'Single integer sum.',
      constraints_text: '$|s| \\le 5\\cdot 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/526/D',
    difficulty_rating: 2400,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'KMP'],
    data_structures: ['1D Array'],
    key_insights: ['Pattern (AB)^k A via Z periods'],
    approach_name: 'Z periods marks',
    editorial_summary_md: 'Use Z/prefix function periods to mark positions belonging to some (AB)^k A covering.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Om Nom and Necklace',
      statement_md:
        'String of length n and integer k. Mark which prefixes can be written as (AB)^k A with A,B possibly empty.',
      input_format_md: 'n k and string.',
      output_format_md: 'Bit string of length n.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-06',
    source: 'Other',
    url: 'https://atcoder.jp/contests/abc141/tasks/abc141_e',
    difficulty_rating: 1700,
    paradigms: ['String Algorithms', 'Binary Search on Answer'],
    algorithms: ['Z-Algorithm', 'String Hashing', 'Binary Search'],
    data_structures: ['Hash Map'],
    key_insights: ['Max length of substring appearing ≥2 non-overlapping'],
    approach_name: 'BS + Z/hash',
    editorial_summary_md: 'Binary search length L; check via hashing or Z from each start for non-overlapping repeat.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Who Says a Pun?',
      statement_md:
        'Longest L such that some string of length L appears at least twice in s without overlapping.',
      input_format_md: 'n and s.',
      output_format_md: 'Maximum L (0 if none).',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-z-07',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1200/E',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['Merge words by longest border of suffix⊕prefix'],
    approach_name: 'Z merge words',
    editorial_summary_md: 'For each new word, Z on word + # + current suffix to find overlap.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Compress Words',
      statement_md: 'Concatenate n words minimizing length by overlapping prefix/suffix when equal.',
      input_format_md: 'n then n words.',
      output_format_md: 'Compressed string.',
      constraints_text: 'Total length ≤ 10^6',
      sample_io: [],
    },
  },

  // ── Game Theory fillers ──
  {
    id: 'cf-768e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/768/E',
    difficulty_rating: 2100,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Game Theory'],
    data_structures: ['Hash Map'],
    key_insights: ['Kayles-like mex; pile grundy depends on used move sizes'],
    approach_name: 'State grundy',
    editorial_summary_md: 'Each pile is an independent game with mask of used subtraction sizes; precompute grundy.',
    target_complexity: 'O(N · K)',
    offline: {
      title: 'Game of Stones',
      statement_md:
        'n piles. On a pile you remove x stones but cannot reuse the same x on that pile. XOR of grundy; first or second wins.',
      input_format_md: 'n then pile sizes.',
      output_format_md: 'YES if first wins else NO.',
      constraints_text: '$n \\le 10^6$, pile ≤ 60',
      sample_io: [],
    },
  },
  {
    id: 'cf-280a',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/768/A',
    difficulty_rating: 900,
    paradigms: ['Greedy'],
    algorithms: ['Game Theory', 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Warmup: count strictly between min and max'],
    approach_name: 'Count middle',
    editorial_summary_md: 'Sort or scan min/max; count values strictly inside.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Oath of the Night\'s Watch',
      statement_md:
        'Stewards with experience. Count how many are neither minimum nor maximum.',
      input_format_md: 'n and array.',
      output_format_md: 'Count.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1849/C',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Game Theory', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['Distinct strings after sort ops — game-ish equivalence'],
    approach_name: 'Distinct after moves',
    editorial_summary_md: 'Each query sorts a substring of zeros/ones; count distinct resulting strings via borders of 0/1 blocks.',
    target_complexity: 'O(N + Q)',
    offline: {
      title: 'Binary Sort Queries',
      statement_md:
        'Binary string and q substring-sort operations considered independently. How many distinct strings can appear?',
      input_format_md: 'T tests with n q, string, queries.',
      output_format_md: 'Answer per test.',
      constraints_text: '$n,q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1382/B',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory', 'Greedy'],
    algorithms: ['Game Theory'],
    data_structures: ['1D Array'],
    key_insights: ['Nimbers of piles of 1s then a >1'],
    approach_name: 'Prefix ones XOR',
    editorial_summary_md: 'Players must take from the first remaining pile; analyze streak of ones.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Sequential Nim',
      statement_md:
        'Piles in a row; move on the leftmost non-empty pile only. Who wins with optimal play?',
      input_format_md: 'T tests with n and pile sizes.',
      output_format_md: 'First or Second per test.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1190/A',
    difficulty_rating: 1600,
    paradigms: ['Greedy', 'Math / Number Theory'],
    algorithms: ['Game Theory', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Tokitsukaze page removals — simulate with jumps'],
    approach_name: 'Page delete sim',
    editorial_summary_md: 'Process specials in order; count moves when page window shifts.',
    target_complexity: 'O(M)',
    offline: {
      title: 'Tokitsukaze and Discard Items',
      statement_md:
        'n items on pages of size k; m specials. Each move delete all specials on current page then compact.',
      input_format_md: 'n m k and special indices.',
      output_format_md: 'Number of moves.',
      constraints_text: '$m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1731/C',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Game Theory', 'Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Xor prefix; count subarrays with xor perfect square'],
    approach_name: 'Xor squares',
    editorial_summary_md: 'Prefix xor frequencies; subtract bad xors that are perfect squares.',
    target_complexity: 'O(N √A)',
    offline: {
      title: 'Even Subarrays',
      statement_md:
        'Count subarrays whose xor is a perfect square.',
      input_format_md: 'T tests with n and array.',
      output_format_md: 'Count per test.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1490/F',
    difficulty_rating: 1600,
    paradigms: ['Greedy', 'Math / Number Theory'],
    algorithms: ['Game Theory', 'Sorting', 'Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Equalize frequencies by deletions'],
    approach_name: 'Freq equalize',
    editorial_summary_md: 'Count frequencies of frequencies; try each target frequency.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Equal Frequency',
      statement_md:
        'Delete minimum elements so all remaining values have the same frequency.',
      input_format_md: 'T tests with n and array.',
      output_format_md: 'Minimum deletions.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-06',
    source: 'Other',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_k',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Game Theory'],
    data_structures: ['1D Array'],
    key_insights: ['Subtraction game DP win/lose'],
    approach_name: 'Stone DP',
    editorial_summary_md: 'dp[x]=true if some move to false; standard impartial game on one pile.',
    target_complexity: 'O(N · K)',
    offline: {
      title: 'Stones',
      statement_md:
        'Pile of n stones, allowed removals from set A. First player to take the last wins. Who wins?',
      input_format_md: 'N K and array A.',
      output_format_md: 'First or Second.',
      constraints_text: '$N \\le 10^5$, $K \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b9-gt-07',
    source: 'Other',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_l',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Game Theory'],
    data_structures: ['2D Array'],
    key_insights: ['Interval DP difference optimal'],
    approach_name: 'Interval game DP',
    editorial_summary_md: 'dp[l][r] = max(a[l]−dp[l+1][r], a[r]−dp[l][r−1]).',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Deque Game',
      statement_md:
        'Array as deque; players take left or right end, maximize own minus opponent score difference.',
      input_format_md: 'n and array.',
      output_format_md: 'Final X−Y with optimal play.',
      constraints_text: '$n \\le 3000$',
      sample_io: [],
    },
  },
];

async function main() {
  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  const byId = new Map(extras.map((p) => [p.id, p]));
  let retagged = 0;

  for (const [id, algs] of Object.entries(RETAGS)) {
    const p = byId.get(id);
    if (!p) continue;
    if (!p.approaches?.length) {
      p.approaches = [
        {
          id: `${id}-a1`,
          problem_id: id,
          approach_name: 'Primary',
          paradigms: [],
          algorithms: algs,
          data_structures: [],
          key_insights: [],
          editorial_summary_md: '',
        },
      ];
      retagged += 1;
      continue;
    }
    const before = p.approaches[0].algorithms?.join('|') ?? '';
    p.approaches[0].algorithms = mergeAlgs(p.approaches[0].algorithms || [], algs);
    // Fix mistaken paradigm-as-algorithm if present
    p.approaches[0].algorithms = p.approaches[0].algorithms.filter((a) => a !== 'Greedy');
    if (p.approaches[0].algorithms.join('|') !== before) retagged += 1;
  }

  // Fix sweep retags that accidentally listed Greedy as algorithm — paradigms instead
  for (const id of ['cses-movie-festival', 'cses-advertisement']) {
    const p = byId.get(id);
    if (!p?.approaches?.[0]) continue;
    if (!p.approaches[0].paradigms.includes('Greedy')) {
      p.approaches[0].paradigms = [...p.approaches[0].paradigms, 'Greedy'];
    }
  }

  const have = existingIds();
  // also treat newly known extras
  for (const p of extras) have.add(p.id);

  const todo = SPECS.filter((s) => !have.has(s.id));
  console.log(`Batch9: retagged ${retagged}; adding ${todo.length}/${SPECS.length} new`);

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
