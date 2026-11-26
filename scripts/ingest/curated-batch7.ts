/**
 * Batch 7 — fill thin TAG_CATALOG slices (<12 uses).
 * Usage: npm run ingest:curated-batch7
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
  algorithms?: string[];
  data_structures?: string[];
  key_insights: string[];
  approach_name: string;
  editorial_summary_md: string;
  target_complexity: string;
  offline?: Offline;
  csesTask?: number;
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
  if (/2\^N/i.test(raw)) return 'O(2^N)';
  if (/N³/i.test(raw)) return 'O(N³)';
  if (/N²/i.test(raw)) return 'O(N²)';
  if (/N \+ M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  return 'O(N)';
}

const SPECS: Spec[] = [
  // ── Bellman-Ford / negative cycles ──
  {
    id: 'uva-558',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/5/558.pdf',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['Bellman-Ford |V|-1 rounds then one more detects a negative cycle'],
    approach_name: 'Negative cycle BF',
    editorial_summary_md: 'Run Bellman-Ford from a super-source or every node; report if a relaxing edge remains.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Wormholes',
      statement_md:
        'In a spacetime with $n$ stars and $m$ wormholes (directed edges that may have negative time cost), decide whether there is a negative cycle (you can go back in time indefinitely).',
      input_format_md: 'Multiple tests. Each: $n\\ m$ then $m$ triples $x\\ y\\ t$ (edge $x\\to y$ cost $t$).',
      output_format_md: 'Print `possible` if a negative cycle exists, else `not possible`.',
      constraints_text: '$1 \\le n \\le 1000$, $1 \\le m \\le 2000$',
      sample_io: [{ input: '3 3\n0 1 1000\n1 2 15\n2 1 -42', output: 'possible' }],
    },
  },
  {
    id: 'poj-3259',
    source: 'POJ',
    url: 'http://poj.org/problem?id=3259',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['Mix bidirectional roads (+) with directed wormholes (−); BF detects time-travel cycles'],
    approach_name: 'BF wormholes',
    editorial_summary_md: 'Build the graph and use Bellman-Ford / SPFA to detect a negative cycle.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Wormholes',
      statement_md:
        'Farmer John has $N$ fields, $M$ bidirectional paths with positive travel time, and $W$ wormholes that go back in time. Can he start somewhere and return before he left?',
      input_format_md: 'First line $F$ tests. Each test: $N\\ M\\ W$, then $M$ roads and $W$ wormholes.',
      output_format_md: 'For each test print `YES` if a negative cycle exists else `NO`.',
      constraints_text: '$1 \\le N \\le 500$',
      sample_io: [{ input: '2\n3 3 1\n1 2 2\n1 3 4\n2 3 1\n3 1 3\n3 2 1\n1 2 3\n2 3 4\n3 1 8', output: 'NO\nYES' }],
    },
  },
  {
    id: 'uva-10449',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/104/10449.pdf',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['BF with cubic edge costs; nodes reachable from a negative cycle get −∞'],
    approach_name: 'BF + neg-cycle flood',
    editorial_summary_md: 'After BF, DFS/BFS from nodes updated on the N-th pass and mark queries as unreachable/neg-inf.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Traffic',
      statement_md:
        'Cities have business values $b_i$. Driving $u\\to v$ costs $(b_v-b_u)^3$. Find the cheapest path cost from city 1 to each queried city (or `?` if unreachable or arbitrarily small via a negative cycle).',
      input_format_md: 'n, busyness array, m edges, then q queries.',
      output_format_md: 'For each query print the cost if finite and ≥3, else `?`.',
      constraints_text: '$n \\le 200$',
      sample_io: [],
    },
  },
  {
    id: 'poj-1860',
    source: 'POJ',
    url: 'http://poj.org/problem?id=1860',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms', 'Math / Number Theory'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['Model exchange as edges that increase money; positive cycle reachable from start = profit'],
    approach_name: 'Positive-cycle BF',
    editorial_summary_md: 'Invert Bellman-Ford to maximize money; a positive cycle reachable from our currency works.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Currency Exchange',
      statement_md:
        'There are $N$ currencies and $M$ exchange points. Each point trades $A\\leftrightarrow B$ with rates and commissions. Starting with currency $S$ and amount $V$, can you increase your money by a sequence of exchanges?',
      input_format_md: 'N M S V, then M lines of exchange parameters.',
      output_format_md: 'Print `YES` or `NO`.',
      constraints_text: '$N \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1473e',
    source: 'Codeforces',
    url: cfUrl('cf-1473e'),
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'Bellman-Ford'],
    data_structures: ['Priority Queue'],
    key_insights: ['State Dijkstra with flags: used free min-edge and/or paid double max-edge'],
    approach_name: 'Layered Dijkstra',
    editorial_summary_md: 'Shortest paths in a product graph of (node × used_coupon × used_penalty).',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Minimum Path',
      statement_md:
        'Find a path from 1 to each node minimizing $\\sum w - \\max w + \\min w$ (you may “skip” the max edge cost once and “double-count” the min once).',
      input_format_md: 'n m and m weighted undirected edges.',
      output_format_md: 'Print n−1 distances from 1 to 2..n.',
      constraints_text: '$2 \\le n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── Meet in the Middle ──
  {
    id: 'cf-888e',
    source: 'Codeforces',
    url: cfUrl('cf-888e'),
    difficulty_rating: 1800,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'Sorting', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Split array in half; enumerate subset sums; binary search complements mod m'],
    approach_name: 'MITM subset sums',
    editorial_summary_md: 'Generate all subset sums of each half and maximize (a+b) mod m.',
    target_complexity: 'O(2^{N/2} N)',
    offline: {
      title: 'Maximum Subsequence',
      statement_md:
        'Given $n$ integers and modulus $m$, choose a subsequence maximizing the sum modulo $m$.',
      input_format_md: 'First line $n\\ m$. Second line $n$ integers.',
      output_format_md: 'Print the maximum sum modulo $m$.',
      constraints_text: '$1 \\le n \\le 35$, $1 \\le m \\le 10^9$',
      sample_io: [{ input: '4 4\n5 2 4 1', output: '3' }],
    },
  },
  {
    id: 'cf-1006f',
    source: 'Codeforces',
    url: cfUrl('cf-1006f'),
    difficulty_rating: 2100,
    paradigms: ['Divide & Conquer', 'Brute Force', 'Graph Algorithms'],
    algorithms: ['Meet in the Middle', 'DFS'],
    data_structures: ['Hash Map', '2D Array'],
    key_insights: ['Meet in the middle on grid paths: DFS from start and from end meeting on the diagonal'],
    approach_name: 'Grid MITM',
    editorial_summary_md: 'Enumerate half-paths storing XOR→count; match with paths from the opposite corner.',
    target_complexity: 'O(2^{N} · N)',
    offline: {
      title: 'Xor Paths',
      statement_md:
        'An $n\\times m$ grid has values $a_{i,j}$. Count paths from $(1,1)$ to $(n,m)$ (only right/down) whose XOR equals $k$.',
      input_format_md: 'n m k and the grid.',
      output_format_md: 'Print the number of paths.',
      constraints_text: '$1 \\le n,m \\le 20$, $n+m \\le 40$',
      sample_io: [],
    },
  },
  {
    id: 'cf-912e',
    source: 'Codeforces',
    url: cfUrl('cf-912e'),
    difficulty_rating: 2400,
    paradigms: ['Divide & Conquer', 'Math / Number Theory', 'Binary Search on Answer'],
    algorithms: ['Meet in the Middle', 'Binary Search', 'Sieve'],
    data_structures: ['1D Array'],
    key_insights: ['Split primes into two sets; generate products; binary search k-th lucky number'],
    approach_name: 'Prime MITM',
    editorial_summary_md: 'Build all products from each half of the prime set and two-pointer/binary-search the k-th.',
    target_complexity: 'O(P log A)',
    offline: {
      title: 'Prime Gift',
      statement_md:
        'Lucky numbers are products of a given set of primes (with replacement). Find the $k$-th lucky number.',
      input_format_md: 'n, n primes, then k.',
      output_format_md: 'Print the k-th lucky number.',
      constraints_text: '$n \\le 16$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc184-f',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc184/tasks/abc184_f',
    difficulty_rating: 1800,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'Sorting', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Split n≤40 into halves; subset sums + upper_bound for capacity T'],
    approach_name: 'MITM knapsack',
    editorial_summary_md: 'Enumerate half subset sums; for each left sum take best right sum ≤ T−left.',
    target_complexity: 'O(2^{N/2} N)',
    offline: {
      title: 'Programming Contest',
      statement_md:
        'You have $n$ problems with times $a_i$ and limit $T$. Maximize total time of a subset that does not exceed $T$.',
      input_format_md: 'n T and the array a.',
      output_format_md: 'Print the maximum feasible sum.',
      constraints_text: '$1 \\le n \\le 40$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1516c',
    source: 'Codeforces',
    url: cfUrl('cf-1516c'),
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming', 'Math / Number Theory'],
    algorithms: ['Knapsack', 'Meet in the Middle'],
    data_structures: ['1D Array'],
    key_insights: ['If total even and a subset hits half, remove a minimally odd-valued element after dividing by 2'],
    approach_name: 'Knapsack partition',
    editorial_summary_md: 'Subset-sum DP checks partition; strip factors of 2 to find a single removal.',
    target_complexity: 'O(N · S)',
    offline: {
      title: 'Baby Ehab Partitions Again',
      statement_md:
        'Array $a$ is “good” if it cannot be split into two subsequences with equal sums. Remove the minimum number of elements to make it good.',
      input_format_md: 'n and the array.',
      output_format_md: 'Print k, then k indices to remove.',
      constraints_text: '$1 \\le n \\le 100$',
      sample_io: [],
    },
  },

  // ── Floyd-Warshall ──
  {
    id: 'cf-33b',
    source: 'Codeforces',
    url: cfUrl('cf-33b'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'String Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['26-letter graph of change costs; FW then align strings with best common letter'],
    approach_name: 'Alphabet FW',
    editorial_summary_md: 'All-pairs min cost to change letter a→b; for each position pick best target.',
    target_complexity: 'O(N + Σ³)',
    offline: {
      title: 'String Problem',
      statement_md:
        'You may change letters paying given costs. Make two strings equal with minimum total cost (or determine impossible).',
      input_format_md: 'Two strings, n change rules (c1 c2 cost).',
      output_format_md: 'Minimum cost and the resulting string, or -1.',
      constraints_text: '$|s|,|t| \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-543b',
    source: 'Codeforces',
    url: cfUrl('cf-543b'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall', 'BFS'],
    data_structures: ['2D Array', 'Queue'],
    key_insights: ['All-pairs BFS distances; try every shared edge/path overlap of two routes'],
    approach_name: 'APSP + enumerate',
    editorial_summary_md: 'Precompute distances; maximize unused edges under two path length constraints.',
    target_complexity: 'O(N³)',
    offline: {
      title: 'Destroying Roads',
      statement_md:
        'An unweighted connected graph. Keep a simple path s1–t1 of length ≤l1 and s2–t2 ≤l2; maximize remaining edges (destroy the rest).',
      input_format_md: 'n m edges, then s1 t1 l1 and s2 t2 l2.',
      output_format_md: 'Max edges kept, or -1.',
      constraints_text: '$n \\le 3000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1196f',
    source: 'Codeforces',
    url: cfUrl('cf-1196f'),
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall', 'Dijkstra', 'Sorting'],
    data_structures: ['Priority Queue', '2D Array'],
    key_insights: ['Only the k lightest edges matter; build dense graph on endpoints and FW/Dijkstra'],
    approach_name: 'Top-k edges FW',
    editorial_summary_md: 'Reduce to ≤2k vertices incident to the lightest k edges; compute k-th shortest among pairs.',
    target_complexity: 'O(K³)',
    offline: {
      title: 'K-th Path',
      statement_md:
        'Undirected weighted graph. Among all unordered pairs of distinct vertices, consider the shortest-path distances; print the $k$-th smallest of those distances.',
      input_format_md: 'n m k and m edges.',
      output_format_md: 'Print the k-th smallest pairwise distance.',
      constraints_text: '$k \\le 400$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc218-f',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc218/tasks/abc218_f',
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['BFS', 'Floyd-Warshall'],
    data_structures: ['Queue', 'Adjacency List'],
    key_insights: ['BFS shortest path; for each edge check if bypassing it changes dist(1,n)'],
    approach_name: 'Path edge removal',
    editorial_summary_md: 'Find one shortest path; for edges on it recompute BFS without that edge.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Blocked Roads',
      statement_md:
        'Directed unweighted graph. For each edge in order, print the shortest path from 1 to N if that edge is removed (or -1).',
      input_format_md: 'N M and M directed edges.',
      output_format_md: 'M lines of answers.',
      constraints_text: '$N \\le 400$',
      sample_io: [],
    },
  },
  {
    id: 'cf-14d',
    source: 'Codeforces',
    url: cfUrl('cf-14d'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Brute Force'],
    algorithms: ['Floyd-Warshall', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Tree: try every edge as bridge between two components; diameters product'],
    approach_name: 'Tree split diameters',
    editorial_summary_md: 'Remove each edge, compute diameter of both sides, maximize product.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Two Paths',
      statement_md:
        'Given a tree, choose two edge-disjoint simple paths maximizing (length1)×(length2).',
      input_format_md: 'n and n−1 edges.',
      output_format_md: 'Print the maximum product.',
      constraints_text: '$n \\le 200$',
      sample_io: [],
    },
  },

  // ── Ternary Search ──
  {
    id: 'cf-782b',
    source: 'Codeforces',
    url: cfUrl('cf-782b'),
    difficulty_rating: 1800,
    paradigms: ['Binary Search on Answer', 'Geometry'],
    algorithms: ['Ternary Search', 'Binary Search'],
    data_structures: [],
    key_insights: ['Meeting time as function of position is unimodal; ternary search the x-coordinate'],
    approach_name: 'Ternary on line',
    editorial_summary_md: 'Ternary search position; check max |x−x_i|/v_i.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'The Meeting Place Cannot Be Changed',
      statement_md:
        'Friends at positions $x_i$ with speeds $v_i$ on a line. Find the minimum time for all to meet at one point.',
      input_format_md: 'n, then x array, then v array.',
      output_format_md: 'Print the minimum time with absolute/relative error 1e-6.',
      constraints_text: '$1 \\le n \\le 60000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1288a',
    source: 'Codeforces',
    url: cfUrl('cf-1288a'),
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory', 'Binary Search on Answer'],
    algorithms: ['Ternary Search', 'Binary Search'],
    data_structures: [],
    key_insights: ['f(x)=x+ceil(d/(x+1)) is unimodal; ternary or check near sqrt(d)'],
    approach_name: 'Unimodal min',
    editorial_summary_md: 'Minimize days = wait + ceil(d/(wait+1)); ternary or O(√d) scan.',
    target_complexity: 'O(log D)',
    offline: {
      title: 'Deadline',
      statement_md:
        'A program takes $x + \\lceil d/(x+1)\\rceil$ days if you wait $x$ days before compiling. Can you finish in ≤ $n$ days?',
      input_format_md: 't tests with n d.',
      output_format_md: 'YES/NO per test.',
      constraints_text: '$1 \\le n,d \\le 10^9$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1856c',
    source: 'Codeforces',
    url: cfUrl('cf-1856c'),
    difficulty_rating: 1600,
    paradigms: ['Binary Search on Answer', 'Greedy'],
    algorithms: ['Ternary Search', 'Binary Search'],
    data_structures: [],
    key_insights: ['Binary/ternary search the final maximum; greedily propagate needed increments leftward'],
    approach_name: 'BSA on max',
    editorial_summary_md: 'Check whether a target max is achievable with ≤k increments under a_i+1 constraints.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'To Become Max',
      statement_md:
        'You may perform ≤ $k$ operations: choose i<n and increment a_i if a_i≤a_{i+1}. Maximize the maximum array value.',
      input_format_md: 'Tests with n k and array a.',
      output_format_md: 'Maximum achievable peak.',
      constraints_text: '$\\sum n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-863b',
    source: 'Codeforces',
    url: cfUrl('cf-863b'),
    difficulty_rating: 1400,
    paradigms: ['Brute Force', 'Greedy'],
    algorithms: ['Ternary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Try every pair of people to put in tandem; sort rest and pair adjacent'],
    approach_name: 'Enumerate tandem',
    editorial_summary_md: 'O(n²) choose tandem pair; remaining 2n−2 people form n−1 teams of neighbors after sort.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Kayaking',
      statement_md:
        '2n people with weights. One tandem kayak (2 people) and n−1 normal kayaks. Instability is sum of |w differences| in each kayak. Minimize instability.',
      input_format_md: 'n and 2n weights.',
      output_format_md: 'Minimum total instability.',
      constraints_text: '$2 \\le n \\le 50$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1355c',
    source: 'Codeforces',
    url: cfUrl('cf-1355c'),
    difficulty_rating: 1700,
    paradigms: ['Math / Number Theory', 'Two Pointers'],
    algorithms: ['Ternary Search', 'Binary Search', 'Prefix Sums'],
    data_structures: [],
    key_insights: ['Enumerate z then count (x,y) triangles; or sweep with prefix sums — unimodal counts'],
    approach_name: 'Triangle sweep',
    editorial_summary_md: 'For each possible z in [C,D] count valid (x,y) with triangle inequalities via prefix sums.',
    target_complexity: 'O(D)',
    offline: {
      title: 'Count Triangles',
      statement_md:
        'Integers A≤B≤C≤D. Count triples (x,y,z) with A≤x≤B≤y≤C≤z≤D that form a non-degenerate triangle.',
      input_format_md: 'Four integers A B C D.',
      output_format_md: 'Print the count.',
      constraints_text: '$1 \\le A \\le B \\le C \\le D \\le 5\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── LIS ──
  {
    id: 'cf-340d',
    source: 'Codeforces',
    url: cfUrl('cf-340d'),
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Permutation LIS length equals minimum moves in this bubble-sort related model'],
    approach_name: 'LIS length',
    editorial_summary_md: 'Patience sorting / fenwick LIS on the permutation.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Bubble Sort Graph',
      statement_md:
        'A permutation defines edges between elements that are out of order. Find the size of the maximum independent set (equiv. LIS length).',
      input_format_md: 'n and the permutation.',
      output_format_md: 'Print the LIS length.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-4d',
    source: 'Codeforces',
    url: cfUrl('cf-4d'),
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Sort envelopes; DP LIS with both width and height strictly increasing'],
    approach_name: '2D LIS',
    editorial_summary_md: 'Sort by width; DP longest chain with strict height increase; reconstruct path.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Mysterious Present',
      statement_md:
        'You have a card of size w×h and n envelopes. Nest envelopes (strictly larger both sides) maximizing chain length; print the sequence.',
      input_format_md: 'n w h then n envelope sizes.',
      output_format_md: 'Length and indices of envelopes.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-977f',
    source: 'Codeforces',
    url: cfUrl('cf-977f'),
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Hash Map'],
    data_structures: ['Hash Map'],
    key_insights: ['dp[value]=dp[value−1]+1; track best consecutive LIS'],
    approach_name: 'Consecutive LIS',
    editorial_summary_md: 'Hash map stores best chain ending at each value; reconstruct indices.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Consecutive Subsequence',
      statement_md:
        'Find the longest subsequence of consecutive values (x, x+1, x+2, …) and print indices.',
      input_format_md: 'n and the array.',
      output_format_md: 'Length then indices.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1296e2',
    source: 'Codeforces',
    url: cfUrl('cf-1296e2'),
    difficulty_rating: 1900,
    paradigms: ['Greedy', 'String Algorithms'],
    algorithms: ['LIS', 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Color letters so each color class is sorted; colors needed = LIS of the string as sequence'],
    approach_name: 'LIS coloring',
    editorial_summary_md: 'Greedily assign each letter the color = length of increasing chain ending there.',
    target_complexity: 'O(N)',
    offline: {
      title: 'String Coloring (hard version)',
      statement_md:
        'Color characters so that sorting within each color makes the whole string sorted. Minimize number of colors.',
      input_format_md: 'n and string s.',
      output_format_md: 'k and color of each position.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-269b',
    source: 'Codeforces',
    url: cfUrl('cf-269b'),
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS'],
    data_structures: ['1D Array'],
    key_insights: ['After sorting by position, species sequence LIS; n−LIS replants'],
    approach_name: 'Species LIS',
    editorial_summary_md: 'Minimum changes so species are nondecreasing along the row = n − LIS.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Greenhouse Effect',
      statement_md:
        'Plants have species and positions. Replant some so species become nondecreasing by position. Minimize replants.',
      input_format_md: 'n m then n lines species position.',
      output_format_md: 'Minimum plants to move.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-597c',
    source: 'Codeforces',
    url: cfUrl('cf-597c'),
    difficulty_rating: 2200,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Segment Tree'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Count increasing subsequences of length k+1 with fenwick layers'],
    approach_name: 'LIS count fenwick',
    editorial_summary_md: 'dp[len][val] via fenwick prefix sums over previous layer.',
    target_complexity: 'O(K N log N)',
    offline: {
      title: 'Subsequences',
      statement_md:
        'Permutation of 1..n. Count increasing subsequences of length exactly $k+1$.',
      input_format_md: 'n k and the permutation.',
      output_format_md: 'Print the count.',
      constraints_text: '$n \\le 10^5$, $k \\le 10$',
      sample_io: [],
    },
  },

  // ── Interactive ──
  {
    id: 'cses-colored-chairs',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3273',
    csesTask: 3273,
    difficulty_rating: 1700,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Binary Search'],
    data_structures: [],
    key_insights: ['Interactive queries compare chair colors to locate a target pattern'],
    approach_name: 'Interactive search',
    editorial_summary_md: 'Use adaptive queries to deduce the hidden coloring with few asks.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-inversion-sorting',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3140',
    csesTask: 3140,
    difficulty_rating: 1800,
    paradigms: ['Interactive'],
    algorithms: ['Binary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Query inversion-like responses to reconstruct/sort the hidden permutation'],
    approach_name: 'Interactive sort',
    editorial_summary_md: 'Binary-search style interactive protocol to sort with limited feedback.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cf-1486c1',
    source: 'Codeforces',
    url: cfUrl('cf-1486c1'),
    difficulty_rating: 1500,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Binary Search', 'Ternary Search'],
    data_structures: [],
    key_insights: ['Query second-max on ranges to binary search the position of the maximum'],
    approach_name: 'Interactive second-max',
    editorial_summary_md: 'Ask for second maximum on [1,n] then binary search the side containing the max.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Guessing the Greatest (easy)',
      statement_md:
        'Interactive: hidden permutation of 1..n. Query `? l r` returns index of the second maximum on [l,r]. Find the index of the maximum in ≤20 queries.',
      input_format_md: 'First line n. Then interactive queries.',
      output_format_md: 'Print `! i` when found.',
      constraints_text: '$2 \\le n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-727c',
    source: 'Codeforces',
    url: cfUrl('cf-727c'),
    difficulty_rating: 1400,
    paradigms: ['Interactive', 'Math / Number Theory'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: ['Query pairs to recover all a_i from sums a_i+a_j'],
    approach_name: 'Sum queries',
    editorial_summary_md: 'Ask 1+2, 2+3, 1+3 to solve first three, then pair each other with 1.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Guess the Array',
      statement_md:
        'Interactive: hidden positive array. Query `? i j` returns a_i+a_j. Recover the array in ≤ n+20 queries.',
      input_format_md: 'First line n.',
      output_format_md: 'Print `! a1..an`.',
      constraints_text: '$3 \\le n \\le 5000$',
      sample_io: [],
    },
  },

  // ── LCA ──
  {
    id: 'cf-191c',
    source: 'Codeforces',
    url: cfUrl('cf-191c'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS', 'Prefix Sums'],
    data_structures: ['Adjacency List'],
    key_insights: ['Difference array on tree paths via +1 at ends −2 at LCA; DFS sums to edges'],
    approach_name: 'Tree diff + LCA',
    editorial_summary_md: 'Accumulate path covers then push sums to edges.',
    target_complexity: 'O(N log N)',
    offline: {
      title: "Fools and Roads",
      statement_md:
        'A tree of n cities. For each of k paths (a_i,b_i) every edge on the path gets +1. Print the final value of every edge.',
      input_format_md: 'n, tree edges, k, then k pairs.',
      output_format_md: 'n−1 integers — load on each input edge.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-519e',
    source: 'Codeforces',
    url: cfUrl('cf-519e'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Subtree sizes + LCA/binary lifting to count vertices equidistant or on midpoints'],
    approach_name: 'LCA midpoint',
    editorial_summary_md: 'For each query climb to the middle of the path and combine subtree sizes.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'A and B and Lecture Rooms',
      statement_md:
        'Tree on n vertices. For queries (a,b) count vertices x with dist(x,a)=dist(x,b).',
      input_format_md: 'Tree then q queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-587c',
    source: 'Codeforces',
    url: cfUrl('cf-587c'),
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Binary lifting stores up to 10 smallest people ids on the path'],
    approach_name: 'LCA with merged lists',
    editorial_summary_md: 'Lift while merging sorted id lists of size ≤10.',
    target_complexity: 'O(N log N · K)',
    offline: {
      title: 'Duff in the Army',
      statement_md:
        'Tree with people living in cities (ids). For queries v u a print up to a smallest ids on the path v–u.',
      input_format_md: 'n m q, edges, people placements, queries.',
      output_format_md: 'For each query: count then ids.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1328e',
    source: 'Codeforces',
    url: cfUrl('cf-1328e'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Path to root queries: all vertices lie on one root path iff depths/tin-tout nest under the deepest'],
    approach_name: 'Root-path check',
    editorial_summary_md: 'Move each vertex to its parent; check they form a chain via tin/tout of the deepest.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Tree Queries',
      statement_md:
        'Rooted tree at 1. For each query set of vertices, check whether there is a path from 1 to some vertex that includes all of them or their parents.',
      input_format_md: 'Tree, then queries with vertex lists.',
      output_format_md: 'YES/NO per query.',
      constraints_text: '$n,q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-609e',
    source: 'Codeforces',
    url: cfUrl('cf-609e'),
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'LCA', 'DSU', 'Sorting'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Build MST; for each edge answer MST_weight − max_on_path(u,v) + w(e)'],
    approach_name: 'MST + path max LCA',
    editorial_summary_md: 'Kruskal MST then binary lifting for maximum edge on tree path.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Minimum spanning tree for each edge',
      statement_md:
        'For every edge, find the MST weight of the graph if that edge is forced to be included.',
      input_format_md: 'n m and m weighted edges.',
      output_format_md: 'm lines — MST weight forcing each edge.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1051f',
    source: 'Codeforces',
    url: cfUrl('cf-1051f'),
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'LCA', 'DFS'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Tree has ≤21 extra edges; Dijkstra from their endpoints + LCA tree distances'],
    approach_name: 'Near-tree APSP',
    editorial_summary_md: 'Build spanning tree; for non-tree edges run Dijkstra from endpoints; combine with LCA.',
    target_complexity: 'O(K(N+M) log N)',
    offline: {
      title: 'The Shortest Statement',
      statement_md:
        'Connected weighted graph with n≤1e5, m−n≤20. Answer shortest-path queries.',
      input_format_md: 'n m edges, then q queries.',
      output_format_md: 'Distance per query.',
      constraints_text: '$m-n \\le 20$',
      sample_io: [],
    },
  },

  // ── Monotonic Stack ──
  {
    id: 'cf-5c',
    source: 'Codeforces',
    url: cfUrl('cf-5c'),
    difficulty_rating: 1900,
    paradigms: ['String Algorithms', 'Dynamic Programming'],
    algorithms: [],
    data_structures: ['Monotonic Stack', 'Stack'],
    key_insights: ['Stack of indices of "("; track longest valid bracket substring counts'],
    approach_name: 'Bracket stack',
    editorial_summary_md: 'Classic longest valid parentheses via stack; count occurrences of that length.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Longest Regular Bracket Sequence',
      statement_md:
        'Given a bracket string, find the length of the longest regular substring and how many such substrings exist.',
      input_format_md: 'One string of ( and ).',
      output_format_md: 'Print length and count (0 1 if none).',
      constraints_text: '$|s| \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1691d',
    source: 'Codeforces',
    url: cfUrl('cf-1691d'),
    difficulty_rating: 2000,
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Monotonic Stack', 'Sparse Table'],
    key_insights: ['For each position as max, span where it is maximum; check prefix maxima of sums'],
    approach_name: 'Mono stack ranges',
    editorial_summary_md: 'Monotonic stack gives ownership ranges; sparse table / prefix checks sum constraints.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Max GEQ Sum Brute',
      statement_md:
        'Array is good if every subarray has maximum ≥ sum of the subarray. Decide if the array is good.',
      input_format_md: 'Tests with n and array a (can be negative).',
      output_format_md: 'YES/NO.',
      constraints_text: '$\\sum n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1420c2',
    source: 'Codeforces',
    url: cfUrl('cf-1420c2'),
    difficulty_rating: 2000,
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: [],
    data_structures: ['Monotonic Stack', '1D Array'],
    key_insights: ['Peak-valley contribution; updates adjust local extremum contributions'],
    approach_name: 'Alternating peaks',
    editorial_summary_md: 'Maintain sum of positive differences of a zigzag subsequence under point updates.',
    target_complexity: 'O(N + Q)',
    offline: {
      title: 'Pokemon Army (hard)',
      statement_md:
        'Choose a subsequence maximizing a_{b1}−a_{b2}+a_{b3}−…. Support point updates and print the best value.',
      input_format_md: 'Tests with n q, array, then updates.',
      output_format_md: 'Initial answer and after each update.',
      constraints_text: '$\\sum n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1313c1',
    source: 'Codeforces',
    url: cfUrl('cf-1313c1'),
    difficulty_rating: 1400,
    paradigms: ['Greedy', 'Brute Force'],
    algorithms: [],
    data_structures: ['Monotonic Stack', '1D Array'],
    key_insights: ['Try each peak; force unimodal by taking min with peak going outward'],
    approach_name: 'Enumerate peak',
    editorial_summary_md: 'O(n²) choose maximum position and build the bitonic roof.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Skyscrapers (easy)',
      statement_md:
        'Build heights h_i≤m_i that are first nondecreasing then nonincreasing; maximize sum h.',
      input_format_md: 'n and array m.',
      output_format_md: 'Optimal heights.',
      constraints_text: '$n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1156c',
    source: 'Codeforces',
    url: cfUrl('cf-1156c'),
    difficulty_rating: 1700,
    paradigms: ['Two Pointers', 'Greedy'],
    algorithms: ['Sorting', 'Binary Search'],
    data_structures: ['Monotonic Stack'],
    key_insights: ['Sort points; greedy pair smallest with earliest feasible large partner'],
    approach_name: 'Two pointers pairs',
    editorial_summary_md: 'Sort and two-pointer match pairs with difference ≥z.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Match Points',
      statement_md:
        'Points on a line. Pair as many as possible so each pair has distance ≥ z; each point in at most one pair.',
      input_format_md: 'n z and positions.',
      output_format_md: 'Maximum number of pairs.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── MST ──
  {
    id: 'cf-160d',
    source: 'Codeforces',
    url: cfUrl('cf-160d'),
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'DFS', 'Sorting'],
    data_structures: ['Adjacency List'],
    key_insights: ['Kruskal by weight; within equal-weight edges classify any/all/none via bridges in component graph'],
    approach_name: 'Kruskal classify',
    editorial_summary_md: 'Process weight groups; build meta-graph of DSU comps and find bridges.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Edges in MST',
      statement_md:
        'For each edge say if it appears in every MST, some MST, or no MST.',
      input_format_md: 'n m weighted edges.',
      output_format_md: 'm lines: `any`, `at least one`, or `none`.',
      constraints_text: '$m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-888g',
    source: 'Codeforces',
    url: cfUrl('cf-888g'),
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms', 'Divide & Conquer'],
    algorithms: ['MST', 'DFS'],
    data_structures: ['Trie'],
    key_insights: ['Borůvka / trie: recursively connect halves by minimum XOR edge'],
    approach_name: 'Xor-MST trie',
    editorial_summary_md: 'Sort values, build binary trie, divide-and-conquer Borůvka on bit prefixes.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Xor-MST',
      statement_md:
        'Complete graph on n vertices with labels a_i; edge weight a_i⊕a_j. Find MST weight.',
      input_format_md: 'n and array a.',
      output_format_md: 'MST total weight.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cses-mst-edge-set-check',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3408',
    csesTask: 3408,
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'Sorting'],
    data_structures: [],
    key_insights: ['Check whether a given edge set can be extended to / is part of an MST'],
    approach_name: 'MST set check',
    editorial_summary_md: 'Kruskal logic: edges must connect different components at their weight threshold.',
    target_complexity: 'O(M log N)',
  },
  {
    id: 'cses-mst-edge-cost',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3409',
    csesTask: 3409,
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'LCA', 'DSU'],
    data_structures: ['Adjacency List'],
    key_insights: ['Similar to CF 609E: MST plus replacement cost via path maxima'],
    approach_name: 'MST edge cost',
    editorial_summary_md: 'Compute for edges the MST weight if forced in/out using tree path max.',
    target_complexity: 'O(M log N)',
  },
  {
    id: 'cf-1242b',
    source: 'Codeforces',
    url: cfUrl('cf-1242b'),
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'BFS'],
    data_structures: ['Ordered Set', 'Adjacency List'],
    key_insights: ['Complement-graph BFS / DSU: components in G-bar become MST leaves with cost 0/1'],
    approach_name: 'Complement components',
    editorial_summary_md: 'Find connected components of the complement; MST cost is (#components−1).',
    target_complexity: 'O(N + M log N)',
    offline: {
      title: '0-1 MST',
      statement_md:
        'Complete graph on n vertices where listed edges have weight 1 and all others weight 0. Find the MST weight.',
      input_format_md: 'n m and m weight-1 edges.',
      output_format_md: 'MST total weight.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Sparse Table ──
  {
    id: 'cf-872b',
    source: 'Codeforces',
    url: cfUrl('cf-872b'),
    difficulty_rating: 1500,
    paradigms: ['Ad-Hoc', 'Greedy'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Sparse Table', '1D Array'],
    key_insights: ['For k=1 answer is min; k≥3 answer max; k=2 is max of ends after one cut'],
    approach_name: 'Casework RMQ',
    editorial_summary_md: 'Analyze how many “remove segment min” operations interact with global max/min.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Maximum of Maximums of Minimums',
      statement_md:
        'Split the array into exactly k contiguous parts; maximize the minimum of the maxima of parts? Actually: maximize the maximum among the minima of the parts.',
      input_format_md: 'n k and array a.',
      output_format_md: 'The best achievable value.',
      constraints_text: '$1 \\le k \\le n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-475d',
    source: 'Codeforces',
    url: cfUrl('cf-475d'),
    difficulty_rating: 2100,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Sparse Table', 'Hash Map'],
    key_insights: ['Sparse table GCDs; for each L jump R while gcd stays constant'],
    approach_name: 'GCD sparse table',
    editorial_summary_md: 'Enumerate left endpoints and jump by powers of two while gcd is stable; map counts.',
    target_complexity: 'O(N log N log A)',
    offline: {
      title: 'CGCDSSQ',
      statement_md:
        'For each query value x count subarrays whose GCD equals x.',
      input_format_md: 'n, array, q, then q values.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-803g',
    source: 'Codeforces',
    url: cfUrl('cf-803g'),
    difficulty_rating: 2200,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    data_structures: ['Sparse Table'],
    key_insights: ['Periodic array of length n·k; sparse table / segtree on the repeated array with care'],
    approach_name: 'Periodic RMQ',
    editorial_summary_md: 'Build sparse table on one period and handle cross-period queries.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Periodic RMQ Problem',
      statement_md:
        'Array b is a repeated k times. Support range assign and range minimum on b.',
      input_format_md: 'n k, array a (period), then q operations.',
      output_format_md: 'Answers to minimum queries.',
      constraints_text: '$n\\cdot k \\le 10^5$ effective via structure',
      sample_io: [],
    },
  },
  {
    id: 'cses-increasing-array-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2416',
    csesTask: 2416,
    difficulty_rating: 1800,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Sorting'],
    data_structures: ['Sparse Table', 'Monotonic Stack'],
    key_insights: ['Mono stack next greater + prefix sums / sparse for range costs to make increasing'],
    approach_name: 'Next-greater queries',
    editorial_summary_md: 'Precompute cost to raise subarrays using stack and answer offline.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cf-1490f',
    source: 'Codeforces',
    url: cfUrl('cf-1490f'),
    difficulty_rating: 1500,
    paradigms: ['Greedy', 'Binary Search on Answer'],
    algorithms: ['Sorting', 'Binary Search'],
    data_structures: ['Sparse Table', 'Hash Map'],
    key_insights: ['Frequency map; for each possible surviving frequency, count deletions'],
    approach_name: 'Frequency sweep',
    editorial_summary_md: 'Try each threshold of equal frequencies; minimize removals so all remaining values share one frequency.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Equal Frequency',
      statement_md:
        'Delete the minimum number of elements so that every value that still appears does so the same number of times.',
      input_format_md: 'Tests with n and array a.',
      output_format_md: 'Minimum deletions.',
      constraints_text: '$\\sum n \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Topological Sort ──
  {
    id: 'cf-219d',
    source: 'Codeforces',
    url: cfUrl('cf-219d'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'Topological Sort'],
    data_structures: ['Adjacency List'],
    key_insights: ['Rerooting: count edges to reverse toward each root'],
    approach_name: 'Reroot reverses',
    editorial_summary_md: 'DFS computes reverses needed for root 1; reroot DP adjusts when moving root.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Choosing Capital for Treeland',
      statement_md:
        'Directed edges on a tree. Choose a capital minimizing the number of edges to reverse so every city can reach the capital.',
      input_format_md: 'n and n−1 directed edges.',
      output_format_md: 'Minimum reverses and all optimal capitals.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-510c',
    source: 'Codeforces',
    url: cfUrl('cf-510c'),
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'String Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['Compare adjacent names to add alphabet inequality edges; topo order = alphabet'],
    approach_name: 'Alphabet topo',
    editorial_summary_md: 'Build 26-node graph from consecutive string comparisons; Kahn/DFS cycle detect.',
    target_complexity: 'O(N · L)',
    offline: {
      title: 'Fox And Names',
      statement_md:
        'Given n names in the order they should appear, restore any alphabet order (permutation of letters) that makes the list sorted, or say impossible.',
      input_format_md: 'n and n strings.',
      output_format_md: 'A 26-letter permutation or `Impossible`.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-919d',
    source: 'Codeforces',
    url: cfUrl('cf-919d'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['DP on DAG (or cycle⇒inf): max count of a letter on a path'],
    approach_name: 'Topo DP letters',
    editorial_summary_md: 'If cycle print -1; else topo DP 26 counts per node.',
    target_complexity: 'O(26(N+M))',
    offline: {
      title: 'Substring',
      statement_md:
        'Directed graph with a letter on each vertex. Maximize the number of times the most frequent letter appears on any path (or -1 if infinite).',
      input_format_md: 'n m, string of labels, then edges.',
      output_format_md: 'Maximum value or -1.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1385e',
    source: 'Codeforces',
    url: cfUrl('cf-1385e'),
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['Topo order undirected edges according to a topo of the directed part'],
    approach_name: 'Orient by topo',
    editorial_summary_md: 'If directed edges have a cycle → NO; else orient undirected edges along topo order.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Directing Edges',
      statement_md:
        'Some edges directed, some undirected. Orient the undirected ones to make the whole graph acyclic.',
      input_format_md: 'Tests with n m and edges typed 1/2.',
      output_format_md: 'YES and orientations, or NO.',
      constraints_text: '$\\sum n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1217d',
    source: 'Codeforces',
    url: cfUrl('cf-1217d'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['If DAG one color; else 2 colors — paint back-edges differently'],
    approach_name: '2-color cycles',
    editorial_summary_md: 'Detect cycle; color edges by whether they go forward in a DFS forest.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Coloring Edges',
      statement_md:
        'Color directed edges with minimum colors so no monochromatic cycle exists.',
      input_format_md: 'n m and directed edges.',
      output_format_md: 'Number of colors and color of each edge.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },

  // ── Flows / Matching ──
  {
    id: 'cses-distinct-routes-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2130',
    csesTask: 2130,
    difficulty_rating: 2000,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['Queue', 'Adjacency List'],
    key_insights: ['Min-cost max-flow of unit paths from 1 to n; recover k routes'],
    approach_name: 'MCMF routes',
    editorial_summary_md: 'Successively find shortest augmenting paths; output the disjoint routes.',
    target_complexity: 'O(K · (N+M) log N)',
  },
  {
    id: 'cf-546e',
    source: 'Codeforces',
    url: cfUrl('cf-546e'),
    difficulty_rating: 2000,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['2D Array', 'Queue'],
    key_insights: ['Split vertices in/out; max flow models troop movements along edges'],
    approach_name: 'Circulation flow',
    editorial_summary_md: 'Build flow network with supplies/demands; check full flow equals sum a_i.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Soldier and Traveling',
      statement_md:
        'n cities with a_i soldiers now and b_i required. Soldiers may move along edges (or stay). Decide if possible and output the movement matrix.',
      input_format_md: 'n m, arrays a b, then edges.',
      output_format_md: 'YES and n×n matrix of moves, or NO.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1082g',
    source: 'Codeforces',
    url: cfUrl('cf-1082g'),
    difficulty_rating: 2300,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['Queue'],
    key_insights: ['Project-subgraph value = sum edge weights − vertex costs; max flow / min cut'],
    approach_name: 'Project min-cut',
    editorial_summary_md: 'Classic “close vertices vs take edges” min-cut construction.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Petya and Graph',
      statement_md:
        'Undirected graph with vertex costs and edge profits. Choose a subgraph maximizing sum(edge weights)−sum(vertex costs).',
      input_format_md: 'n m, vertex costs, then weighted edges.',
      output_format_md: 'Maximum profit.',
      constraints_text: '$n \\le 1000$, $m \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1209d',
    source: 'Codeforces',
    url: cfUrl('cf-1209d'),
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DSU', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Each edge is a satisfied guest; components of size s give s−1 useful edges'],
    approach_name: 'DSU components',
    editorial_summary_md: 'Build graph of ingredients; answer = k − sum (comp_size−1).',
    target_complexity: 'O(N + K)',
    offline: {
      title: 'Cow and Snacks',
      statement_md:
        'k guests each want two snacks. Serve guests in some order; a guest is sad if either snack is already taken. Minimize sad guests.',
      input_format_md: 'n k and k pairs.',
      output_format_md: 'Minimum number of sad guests.',
      constraints_text: '$n,k \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1005f',
    source: 'Codeforces',
    url: cfUrl('cf-1005f'),
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms', 'Flows / Matching'],
    algorithms: ['BFS', 'DFS'],
    data_structures: ['Queue', 'Adjacency List'],
    key_insights: ['BFS tree from 1; each non-root chooses a parent edge among shortest-path predecessors'],
    approach_name: 'Shortest-path tree enum',
    editorial_summary_md: 'Count ways ≤k by choosing parents; output edge subsets.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Berland and the Shortest Paths',
      statement_md:
        'Unweighted undirected graph. Among spanning subgraphs where dist(1,v) equals original distances for all v, print up to k of them.',
      input_format_md: 'n m k and edges.',
      output_format_md: 't≤k, then t binary strings of chosen edges.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── KMP ──
  {
    id: 'cf-182d',
    source: 'Codeforces',
    url: cfUrl('cf-182d'),
    difficulty_rating: 1500,
    paradigms: ['String Algorithms', 'Math / Number Theory'],
    algorithms: ['KMP', 'String Hashing'],
    data_structures: [],
    key_insights: ['Common divisors of lengths; check if prefix repeats via KMP border / hashing'],
    approach_name: 'Period check',
    editorial_summary_md: 'A string is generated by period p if n%|p|==0 and s=p*(n/|p|).',
    target_complexity: 'O(N)',
    offline: {
      title: 'Common Divisors',
      statement_md:
        'Two strings. Count strings t that generate both as concatenations of t.',
      input_format_md: 'Two strings s and t.',
      output_format_md: 'The count.',
      constraints_text: '$|s|,|t| \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-432d',
    source: 'Codeforces',
    url: cfUrl('cf-432d'),
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['KMP', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['Z-function or KMP borders that are also prefixes occurring as suffixes'],
    approach_name: 'Border frequencies',
    editorial_summary_md: 'Compute Z or prefix-function; count occurrences of each border length.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Prefixes and Suffixes',
      statement_md:
        'List all prefixes that are also suffixes, and how many times each occurs in the string as a substring.',
      input_format_md: 'One string s.',
      output_format_md: 'k then k lines length count.',
      constraints_text: '$|s| \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-526d',
    source: 'Codeforces',
    url: cfUrl('cf-526d'),
    difficulty_rating: 2100,
    paradigms: ['String Algorithms'],
    algorithms: ['KMP', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['KMP periods: positions covered by k-fold repetitions of a border'],
    approach_name: 'K-repeat KMP',
    editorial_summary_md: 'Use prefix-function periods to mark indices belonging to a^k b patterns.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Om Nom and Necklace',
      statement_md:
        'Mark each prefix whether it can be written as (a…a k times)+b with |b|<|a| (b may be empty).',
      input_format_md: 'n k and string s.',
      output_format_md: 'Binary string of length n.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'cf-471d',
    source: 'Codeforces',
    url: cfUrl('cf-471d'),
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['KMP'],
    data_structures: [],
    key_insights: ['Difference arrays of heights; KMP count occurrences of pattern diffs in text diffs'],
    approach_name: 'Diff KMP',
    editorial_summary_md: 'Match consecutive differences so absolute heights can shift.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'MUH and Important Things',
      statement_md:
        'Two sequences of heights (bear sculptures). Count positions where the pattern can match the wall after a uniform vertical shift.',
      input_format_md: 'n m and two arrays.',
      output_format_md: 'Number of matches.',
      constraints_text: '$n,m \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-346b',
    source: 'Codeforces',
    url: cfUrl('cf-346b'),
    difficulty_rating: 2000,
    paradigms: ['Dynamic Programming', 'String Algorithms'],
    algorithms: ['KMP'],
    data_structures: ['2D Array'],
    key_insights: ['LCS DP with KMP automaton state on the forbidden virus string'],
    approach_name: 'LCS + KMP automaton',
    editorial_summary_md: 'dp[i][j][k] on prefixes of s,t and match depth in virus.',
    target_complexity: 'O(|S||T||V|)',
    offline: {
      title: 'Lucky Common Subsequence',
      statement_md:
        'Find the longest common subsequence of s and t that does not contain virus string v as a substring.',
      input_format_md: 'Three strings s, t, v.',
      output_format_md: 'The LCS or 0.',
      constraints_text: 'Lengths ≤100',
      sample_io: [],
    },
  },

  // ── Trie ──
  {
    id: 'cf-706d',
    source: 'Codeforces',
    url: cfUrl('cf-706d'),
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory', 'Bitmask / Bit DP'],
    algorithms: [],
    data_structures: ['Trie', 'Hash Map'],
    key_insights: ['Binary trie of multiset values for max XOR with query'],
    approach_name: 'XOR trie',
    editorial_summary_md: 'Support insert/delete/query maximum XOR with x.',
    target_complexity: 'O(Q · 30)',
    offline: {
      title: 'Vasiliy\'s Multiset',
      statement_md:
        'Start with {0}. Support insert x, delete x, or query max (x XOR y) over y in the multiset.',
      input_format_md: 'q operations `+ x`, `- x`, or `? x`.',
      output_format_md: 'For each `?` print the answer.',
      constraints_text: '$q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-665e',
    source: 'Codeforces',
    url: cfUrl('cf-665e'),
    difficulty_rating: 2100,
    paradigms: ['Math / Number Theory', 'Bitmask / Bit DP'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Trie'],
    key_insights: ['Prefix XOR trie counting pairs with XOR ≥ k'],
    approach_name: 'Prefix XOR trie',
    editorial_summary_md: 'Insert prefix xors; for each new prefix walk trie counting branches ≥k.',
    target_complexity: 'O(N · 30)',
    offline: {
      title: 'Beautiful Subarrays',
      statement_md:
        'Count subarrays whose XOR is ≥ k.',
      input_format_md: 'n k and array a.',
      output_format_md: 'The count.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'cf-455b',
    source: 'Codeforces',
    url: cfUrl('cf-455b'),
    difficulty_rating: 1900,
    paradigms: ['String Algorithms', 'Math / Number Theory'],
    algorithms: ['DFS'],
    data_structures: ['Trie'],
    key_insights: ['Trie game: grundy/win-lose positions for first and second player'],
    approach_name: 'Trie game theory',
    editorial_summary_md: 'Compute whether first can force a win / force a loss on the trie of words.',
    target_complexity: 'O(Σ |s|)',
    offline: {
      title: 'A Lot of Games',
      statement_md:
        'Two players alternately extend a string keeping it a prefix of some given word. After k rounds who wins with optimal play?',
      input_format_md: 'n k and n strings.',
      output_format_md: '`First` or `Second`.',
      constraints_text: 'Total length ≤10^5',
      sample_io: [],
    },
  },
  {
    id: 'cf-1132c',
    source: 'Codeforces',
    url: cfUrl('cf-1132c'),
    difficulty_rating: 1700,
    paradigms: ['Greedy', 'Brute Force'],
    algorithms: ['Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Try every pair of painters to skip; prefix counts of coverage 1 and 2'],
    approach_name: 'Skip two painters',
    editorial_summary_md: 'Precompute coverage; O(q²) remove two intervals and evaluate painted cells.',
    target_complexity: 'O(N · Q + Q²)',
    offline: {
      title: 'Painting the Fence',
      statement_md:
        'q painters each paint [l_i,r_i]. Choose q−2 of them to maximize the number of painted sections (covered ≥1).',
      input_format_md: 'n q and q segments.',
      output_format_md: 'Maximum painted sections.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-948d',
    source: 'Codeforces',
    url: cfUrl('cf-948d'),
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory', 'Bitmask / Bit DP'],
    algorithms: [],
    data_structures: ['Trie'],
    key_insights: ['Binary trie of a_i; greedily match bits of each a_i against remaining p values'],
    approach_name: 'XOR pairing trie',
    editorial_summary_md: 'Insert all p_j; for each a_i in order extract the best XOR partner from the trie.',
    target_complexity: 'O(N · 30)',
    offline: {
      title: 'Perfect Security',
      statement_md:
        'Given arrays a and p, permute p to minimize the lexicographic sequence a_i XOR p_{π(i)}.',
      input_format_md: 'n, array a, array p.',
      output_format_md: 'The optimal XOR sequence.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── Dijkstra / DSU / Sieve / Knapsack extras ──
  {
    id: 'cf-567e',
    source: 'Codeforces',
    url: cfUrl('cf-567e'),
    difficulty_rating: 2200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Forward/backward Dijkstra; edge is on all/some shortest s–t paths'],
    approach_name: 'Bidirectional Dijkstra',
    editorial_summary_md: 'Classify edges by dist[s→u]+w+dist[v→t] vs shortest and uniqueness via counts.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'President and Roads',
      statement_md:
        'For each road say if it lies on some shortest path from s to t, and if yes whether it is a bridge among them (must keep).',
      input_format_md: 'n m s t and weighted directed edges.',
      output_format_md: 'Per edge: `YES`, `YES x` (can decrease by x), or `NO`.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1366d',
    source: 'Codeforces',
    url: cfUrl('cf-1366d'),
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    data_structures: ['1D Array'],
    key_insights: ['Linear sieve smallest prime factor; split n into two coprime factors >1'],
    approach_name: 'SPF split',
    editorial_summary_md: 'For each a_i output two factors whose gcd with each other is 1, or -1s.',
    target_complexity: 'O(A log log A + N)',
    offline: {
      title: 'Two Divisors',
      statement_md:
        'For each a_i find d1,d2>1 with d1|a_i, d2|a_i and gcd(d1+d2,a_i)=1, or -1 -1.',
      input_format_md: 'n and array a.',
      output_format_md: 'Two lines of n answers.',
      constraints_text: '$a_i \\le 10^7$',
      sample_io: [],
    },
  },
  {
    id: 'cf-615d',
    source: 'Codeforces',
    url: cfUrl('cf-615d'),
    difficulty_rating: 1900,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    data_structures: ['Hash Map'],
    key_insights: ['Product of divisors of n = n^{τ(n)/2}; compute via prime exponents mod φ'],
    approach_name: 'Divisor product',
    editorial_summary_md: 'From prime factorization compute n^{τ/2} modulo 1e9+7 with careful exponents.',
    target_complexity: 'O(N log M)',
    offline: {
      title: 'Multiscale Numbers',
      statement_md:
        'Given the prime factorization of n (list of primes with repetition), output the product of all positive divisors of n modulo 1e9+7.',
      input_format_md: 'k then k prime factors.',
      output_format_md: 'One integer.',
      constraints_text: '$k \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-27e',
    source: 'Codeforces',
    url: cfUrl('cf-27e'),
    difficulty_rating: 2000,
    paradigms: ['Dynamic Programming', 'Math / Number Theory'],
    algorithms: ['Knapsack'],
    data_structures: ['1D Array'],
    key_insights: ['Minimize number with exactly n divisors via DP over prime exponents'],
    approach_name: 'Divisor DP',
    editorial_summary_md: 'dp[divisors]=min number; try multiply next primes with exponents.',
    target_complexity: 'O(N · P)',
    offline: {
      title: 'Number With The Given Amount Of Divisors',
      statement_md:
        'Find the minimum positive integer with exactly n divisors.',
      input_format_md: 'Single integer n.',
      output_format_md: 'The minimal integer.',
      constraints_text: '$1 \\le n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-864e',
    source: 'Codeforces',
    url: cfUrl('cf-864e'),
    difficulty_rating: 1800,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    data_structures: ['2D Array'],
    key_insights: ['0/1 knapsack with deadline: items sorted by burn time; DP over time'],
    approach_name: 'Deadline knapsack',
    editorial_summary_md: 'Sort by d_i; dp[t]=max value rescued by time t without exceeding deadlines.',
    target_complexity: 'O(N · T)',
    offline: {
      title: 'Fire',
      statement_md:
        'Items have rescue time t_i, burn deadline d_i, value p_i. Maximize value of items saved before each burns; recover the set.',
      input_format_md: 'n then n triples t d p.',
      output_format_md: 'Max value, count, indices.',
      constraints_text: '$n \\le 100$, $d_i \\le 2000$',
      sample_io: [],
    },
  },

  // ── Top-up: push remaining thin tags to ≥12 ──
  {
    id: 'spoj-easydij',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/EZDIJKST/',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'Dijkstra'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Classic single-source shortest paths; BF works; Dijkstra preferred for nonnegative'],
    approach_name: 'SSSP',
    editorial_summary_md: 'Run Dijkstra (or Bellman-Ford) from A to B.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Easy Dijkstra Problem',
      statement_md:
        'Directed weighted graph (nonnegative). Find shortest path from A to B or report no path.',
      input_format_md: 'Tests with V K edges, then A B.',
      output_format_md: 'Distance or `NO`.',
      constraints_text: 'Typical SPOJ limits',
      sample_io: [],
    },
  },
  {
    id: 'uva-10099',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/100/10099.pdf',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'MST'],
    data_structures: ['Adjacency List'],
    key_insights: ['Maximum-capacity path via modified Kruskal/MST or BF-like relax on min edge'],
    approach_name: 'Maximin path',
    editorial_summary_md: 'Maximize bottleneck from S to D; MST or modified Dijkstra on capacity.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'The Tourist Guide',
      statement_md:
        'Buses have passenger capacities on roads. Find the minimum number of trips to bring R tourists from S to D (guide takes a seat each trip).',
      input_format_md: 'Scenarios with N R roads, S D T.',
      output_format_md: 'Minimum trips per scenario.',
      constraints_text: '$N \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'uva-558-b',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/5/558.pdf',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['Same wormhole setting; practice SPFA / BF cycle detection variants'],
    approach_name: 'SPFA cycle',
    editorial_summary_md: 'Queue-based Bellman-Ford with visit counters detects negative cycles.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Wormholes (SPFA practice)',
      statement_md:
        'Detect whether a system of wormholes admits a negative cycle using SPFA visit counting.',
      input_format_md: 'Multiple tests with n m wormholes.',
      output_format_md: '`possible` / `not possible`.',
      constraints_text: '$n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-786b',
    source: 'Codeforces',
    url: cfUrl('cf-786b'),
    difficulty_rating: 2300,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'Bellman-Ford', 'Segment Tree'],
    data_structures: ['Priority Queue'],
    key_insights: ['Segment-tree graph: range-to-point and point-to-range edges then Dijkstra'],
    approach_name: 'Segtree shortest paths',
    editorial_summary_md: 'Build 4n nodes for in/out segment trees; Dijkstra from source.',
    target_complexity: 'O(M log² N)',
    offline: {
      title: 'Legacy',
      statement_md:
        'n planets with three edge types (point→point, point→range, range→point). Shortest paths from s.',
      input_format_md: 'n q s and q edge descriptions.',
      output_format_md: 'Distances from s (or -1).',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-715b',
    source: 'Codeforces',
    url: cfUrl('cf-715b'),
    difficulty_rating: 2300,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'Bellman-Ford'],
    data_structures: ['Priority Queue'],
    key_insights: ['Assign weights to zero-edges so shortest s–t equals L via two Dijkstras'],
    approach_name: 'Erase edges carefully',
    editorial_summary_md: 'Binary-search / constructive assignment of erased edge weights.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Complete The Graph',
      statement_md:
        'Some edges have weight 0 (erasable). Assign positive weights so the shortest path from s to t equals exactly L.',
      input_format_md: 'n m L s t and edges (0 = erasable).',
      output_format_md: 'YES with weights, or NO.',
      constraints_text: '$n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1494d',
    source: 'Codeforces',
    url: cfUrl('cf-1494d'),
    difficulty_rating: 2400,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'DFS'],
    data_structures: ['2D Array'],
    key_insights: ['Reconstruct hierarchy tree from LCA-salary matrix via divide on max'],
    approach_name: 'Matrix divide',
    editorial_summary_md: 'Recursively split employees by maximum pairwise LCA salary blocks.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Dogeforces',
      statement_md:
        'Given n×n matrix of LCA salaries of employees, restore a company tree with distinct salaries.',
      input_format_md: 'n and the matrix.',
      output_format_md: 'Tree description with salaries.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1005e1',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1005/E1',
    difficulty_rating: 1800,
    paradigms: ['Divide & Conquer', 'Math / Number Theory'],
    algorithms: ['Meet in the Middle', 'Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Median condition ↔ balance of >m and <m; MITM / prefix map around position of m'],
    approach_name: 'Median prefixes',
    editorial_summary_md: 'Map balances left of m; scan right counting good subarrays.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Median on Segments (Permutations Edition)',
      statement_md:
        'Permutation of 1..n containing m. Count subarrays whose median is m.',
      input_format_md: 'n m and the permutation.',
      output_format_md: 'The count.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1517e',
    source: 'Codeforces',
    url: cfUrl('cf-1517e'),
    difficulty_rating: 2300,
    paradigms: ['Divide & Conquer', 'Two Pointers'],
    algorithms: ['Meet in the Middle', 'Binary Search', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Casework on pattern of +/− assignment; two pointers / MITM on prefix sums'],
    approach_name: 'Sign patterns',
    editorial_summary_md: 'Count assignments of ± with p1=− and constraints via prefix techniques.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Rubik\'s Cube Coloring',
      statement_md:
        'Count ways to assign ± to array elements under median/sum constraints (see statement).',
      input_format_md: 'Tests with n and array a.',
      output_format_md: 'Answer modulo 998244353.',
      constraints_text: '$\\sum n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc212-f',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc212/tasks/abc212_f',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms', 'Divide & Conquer'],
    algorithms: ['Meet in the Middle', 'Binary Search', 'Sorting'],
    data_structures: ['Ordered Set'],
    key_insights: ['Buses as edges in time; binary lifting / doubling on next bus'],
    approach_name: 'Bus doubling',
    editorial_summary_md: 'Precompute 2^k jumps on the next usable bus from each bus end.',
    target_complexity: 'O((N+Q) log T)',
    offline: {
      title: 'Greedy Takahashi',
      statement_md:
        'Buses between cities with departure/arrival times. Answer queries: starting at city A at time S, where are you after traveling until time T?',
      input_format_md: 'N M Q, buses, then queries.',
      output_format_md: 'City per query.',
      constraints_text: '$N,M,Q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1209f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1209/F',
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['BFS', 'Dijkstra'],
    data_structures: ['Queue', 'Adjacency List'],
    key_insights: ['Digit-expand edges into a graph on digits; BFS from 0 for lexicographic shortest'],
    approach_name: 'Digit BFS',
    editorial_summary_md: 'Split multi-digit edge weights into unit digit nodes; BFS layers by digit value.',
    target_complexity: 'O(N + M log A)',
    offline: {
      title: 'Koala and Notebook',
      statement_md:
        'Undirected graph with edges labeled by their index digits. Among paths from 1 to each v, minimize the decimal number formed by concatenating edge labels; print that number mod 1e9+7.',
      input_format_md: 'n m and m edges.',
      output_format_md: 'n−1 lines for vertices 2..n.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1794c',
    source: 'Codeforces',
    url: cfUrl('cf-1794c'),
    difficulty_rating: 1400,
    paradigms: ['Greedy', 'Two Pointers'],
    algorithms: ['Binary Search'],
    data_structures: ['Deque'],
    key_insights: ['Maintain a deque of the current prefix; shrink while a_i < length'],
    approach_name: 'Deque window',
    editorial_summary_md: 'For each prefix find maximum k such that you can keep k problems with a≥1..k after sorting.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Hard Problem',
      statement_md:
        'For each prefix of the array, find the maximum number of problems you can choose so that the k-th easiest has rating ≥k.',
      input_format_md: 'Tests with n and array a.',
      output_format_md: 'n integers — answers for each prefix.',
      constraints_text: '$\\sum n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-217a',
    source: 'Codeforces',
    url: cfUrl('cf-217a'),
    difficulty_rating: 1200,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall', 'DFS', 'DSU'],
    data_structures: ['2D Array'],
    key_insights: ['Snow drifts share row/col; components; answer = components−1'],
    approach_name: 'Grid components',
    editorial_summary_md: 'Connect drifts on same row/column; need components−1 new drifts.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Ice Skating',
      statement_md:
        'Snow drifts at integer points. You can skate between drifts sharing x or y. How many new drifts to connect all?',
      input_format_md: 'n and n points.',
      output_format_md: 'Minimum new drifts.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-702c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/702/C',
    difficulty_rating: 1500,
    paradigms: ['Binary Search on Answer', 'Two Pointers'],
    algorithms: ['Ternary Search', 'Binary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Binary search radius r; each city covered by some tower within r'],
    approach_name: 'BSA coverage',
    editorial_summary_md: 'Sort cities and towers; check coverage with two pointers.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Cellular Network',
      statement_md:
        'Cities and cellular towers on a line. Find minimum range r so every city is within r of some tower.',
      input_format_md: 'n m, city positions, tower positions.',
      output_format_md: 'Minimum r.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1257d',
    source: 'Codeforces',
    url: cfUrl('cf-1257d'),
    difficulty_rating: 1600,
    paradigms: ['Binary Search on Answer', 'Greedy'],
    algorithms: ['Ternary Search', 'Binary Search', 'Sorting'],
    data_structures: ['Sparse Table'],
    key_insights: ['For each endurance, max power; greedy cover monsters with best hero'],
    approach_name: 'Hero coverage',
    editorial_summary_md: 'Sparse table / suffix max of hero power by endurance; greedy days.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Yet Another Monster Killing Problem',
      statement_md:
        'Monsters with powers; heroes with (power, endurance). Minimum days to kill all monsters in order (each day one hero fights a prefix).',
      input_format_md: 'Tests with monsters and heroes.',
      output_format_md: 'Minimum days or -1.',
      constraints_text: '$\\sum n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1282c',
    source: 'Codeforces',
    url: cfUrl('cf-1282c'),
    difficulty_rating: 1700,
    paradigms: ['Greedy', 'Binary Search on Answer'],
    algorithms: ['Ternary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Sort problems by time; decide how many hard/easy before exam'],
    approach_name: 'Exam sweep',
    editorial_summary_md: 'Try finishing just before each problem deadline; greedy fill remaining time.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Petya and Exam',
      statement_md:
        'n problems easy/hard with times a,b and mandatory times t_i. Maximize problems solved before exam at time T.',
      input_format_md: 'Tests with n T a b and problems.',
      output_format_md: 'Max problems.',
      constraints_text: '$\\sum n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1359d',
    source: 'Codeforces',
    url: cfUrl('cf-1359d'),
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming', 'Greedy'],
    algorithms: ['Ternary Search', 'Prefix Sums'],
    data_structures: ['Monotonic Stack'],
    key_insights: ['Kadane-like with maximum element removed from the subarray score'],
    approach_name: 'Kadane without max',
    editorial_summary_md: 'For each possible max value, run constrained Kadane on elements ≤ that max.',
    target_complexity: 'O(N · A)',
    offline: {
      title: 'Yet Another Yet Another Task',
      statement_md:
        'Choose a subarray; score = sum − maximum. Maximize the score.',
      input_format_md: 'n and array a (−30..30).',
      output_format_md: 'Maximum score.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-580c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/580/C',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['DFS paths from root tracking consecutive cats; count valid restaurants'],
    approach_name: 'Tree DFS cats',
    editorial_summary_md: 'Prune paths with >m consecutive cats; count leaves reached.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Kefa and Park',
      statement_md:
        'Tree rooted at 1; vertices may have cats. Count leaf restaurants reachable with ≤ m consecutive cats on the path.',
      input_format_md: 'n m, cat flags, edges.',
      output_format_md: 'Number of restaurants.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1632d',
    source: 'Codeforces',
    url: cfUrl('cf-1632d'),
    difficulty_rating: 2100,
    paradigms: ['Math / Number Theory', 'Greedy'],
    algorithms: ['Binary Search'],
    data_structures: ['Sparse Table', 'Monotonic Stack'],
    key_insights: ['Sparse table GCDs; two pointers segments where gcd decreases'],
    approach_name: 'GCD segments',
    editorial_summary_md: 'Maintain active segments of equal GCD; count when gcd equals length.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'New Year Concert',
      statement_md:
        'Build array left to right; whenever a subarray has GCD equal to its length, change the current element. Count changes.',
      input_format_md: 'n and array a.',
      output_format_md: 'n integers — changes after placing each prefix.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1471e',
    source: 'Codeforces',
    url: cfUrl('cf-1471e'),
    difficulty_rating: 2200,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Binary Search'],
    data_structures: [],
    key_insights: ['Interactive rotating array; find 1 then binary search neighbors'],
    approach_name: 'Interactive peak',
    editorial_summary_md: 'Find position of 1 with sparse queries then locate k via comparisons.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Finding the Array',
      statement_md:
        'Interactive: hidden array is a cyclic shift of a unimodal permutation. Find the position of value 1 with limited queries.',
      input_format_md: 'n then interactive `? i` queries.',
      output_format_md: '`! i` when found.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1487e',
    source: 'Codeforces',
    url: cfUrl('cf-1487e'),
    difficulty_rating: 2000,
    paradigms: ['Greedy'],
    algorithms: ['Dijkstra', 'Sorting'],
    data_structures: ['Priority Queue', 'Ordered Set'],
    key_insights: ['Cheapest combination of 4 courses avoiding forbidden pairs via sorted sets'],
    approach_name: 'Multi-layer cheapest',
    editorial_summary_md: 'Sort each meal layer; skip forbidden edges with sets / priority queue.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Cheap Dinner',
      statement_md:
        'Four dish types with prices and forbidden consecutive pairs. Pick one of each minimizing total price (or -1).',
      input_format_md: 'Sizes, prices, then forbidden pair lists.',
      output_format_md: 'Minimum cost or -1.',
      constraints_text: '$n_i \\le 1.5\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1625c',
    source: 'Codeforces',
    url: cfUrl('cf-1625c'),
    difficulty_rating: 1800,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    data_structures: ['2D Array'],
    key_insights: ['DP: remove ≤k signs; cost = length × speed of last kept sign'],
    approach_name: 'Remove signs DP',
    editorial_summary_md: 'dp[i][used]=min time to reach sign i having removed `used` prior signs.',
    target_complexity: 'O(N² · K)',
    offline: {
      title: 'Road Optimization',
      statement_md:
        'Road of length L with speed-limit signs. Remove ≤k signs to minimize travel time.',
      input_format_md: 'n L k, positions, speed limits.',
      output_format_md: 'Minimum time.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1436e',
    source: 'Codeforces',
    url: cfUrl('cf-1436e'),
    difficulty_rating: 2400,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    data_structures: ['Monotonic Stack', 'Fenwick Tree'],
    key_insights: ['MEX of all subarrays; fenwick tracks last positions per value'],
    approach_name: 'Subarray MEX',
    editorial_summary_md: 'Find smallest positive integer that is not a MEX of any subarray.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Two Arrays',
      statement_md:
        'Compute the MEX of the set of MEXes of all subarrays of a.',
      input_format_md: 'n and array a.',
      output_format_md: 'That MEX.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1092f',
    source: 'Codeforces',
    url: cfUrl('cf-1092f'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['DFS', 'MST'],
    data_structures: ['Adjacency List'],
    key_insights: ['Rerooting: sum of dist×value; transfer when moving root'],
    approach_name: 'Reroot tree DP',
    editorial_summary_md: 'Compute for root 1 then reroot to maximize Σ a_v·dist(root,v).',
    target_complexity: 'O(N)',
    offline: {
      title: 'Tree with Maximum Cost',
      statement_md:
        'Tree with vertex weights a_i. Choose a root maximizing sum over v of a_v·dist(root,v).',
      input_format_md: 'n, array a, edges.',
      output_format_md: 'Maximum cost.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1006e',
    source: 'Codeforces',
    url: cfUrl('cf-1006e'),
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'Topological Sort', 'LCA'],
    data_structures: ['Adjacency List'],
    key_insights: ['DFS order + subtree sizes answer k-th vertex in DFS listing of subtree'],
    approach_name: 'DFS order queries',
    editorial_summary_md: 'tin/subtree size; k-th in subtree is order[tin+k−1].',
    target_complexity: 'O(N + Q)',
    offline: {
      title: 'Military Problem',
      statement_md:
        'Rooted tree. For queries (u,k) print the k-th vertex in DFS order of u’s subtree (or -1).',
      input_format_md: 'n q, parents, queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1363e',
    source: 'Codeforces',
    url: cfUrl('cf-1363e'),
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['DFS', 'Topological Sort'],
    data_structures: ['Adjacency List'],
    key_insights: ['Push needed flips down the tree; pay at cheapest ancestor'],
    approach_name: 'Tree flip greedy',
    editorial_summary_md: 'DFS returns excess 0/1 needing flip; resolve at minimum a_i on path.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Tree Shuffling',
      statement_md:
        'Tree rooted at 1; each node has cost a_i and bits b_i,c_i. Flip bits paying a_i (affects subtree). Match b to c minimizing cost.',
      input_format_md: 'n, triples a b c, edges.',
      output_format_md: 'Minimum cost.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-487e',
    source: 'Codeforces',
    url: cfUrl('cf-487e'),
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms', 'Flows / Matching'],
    algorithms: ['DFS', 'Segment Tree'],
    data_structures: ['Adjacency List', 'Stack'],
    key_insights: ['Build bridge-block tree (cactus); HLD/segtree for path minima with square vertices'],
    approach_name: 'Cactus path min',
    editorial_summary_md: 'Round-square tree; maintain multiset of values on squares for path queries/updates.',
    target_complexity: 'O((N+Q) log N)',
    offline: {
      title: 'Tourists',
      statement_md:
        'Undirected 2-edge-connected components form a cactus. Support vertex value updates and path minimum queries.',
      input_format_md: 'n m q, values, edges, operations.',
      output_format_md: 'Answers to queries.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-342e',
    source: 'Codeforces',
    url: cfUrl('cf-342e'),
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS', 'BFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Centroid decomposition: maintain closest red in each centroid region'],
    approach_name: 'Centroid coloring',
    editorial_summary_md: 'Update paints a node red; query min dist to a red via centroid ancestors.',
    target_complexity: 'O((N+Q) log² N)',
    offline: {
      title: 'Xenia and Tree',
      statement_md:
        'Tree initially with node 1 red. Support paint-a-node-red and query distance to the nearest red.',
      input_format_md: 'n m, edges, then m operations.',
      output_format_md: 'Answers to distance queries.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-208e',
    source: 'Codeforces',
    url: cfUrl('cf-208e'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'DFS'],
    data_structures: ['Adjacency List', 'Hash Map'],
    key_insights: ['Binary lift to k-th ancestor; count vertices with same depth in subtree via DFS times'],
    approach_name: 'K-th ancestor queries',
    editorial_summary_md: 'For query v p find p-th ancestor and count depth peers in its subtree minus 1.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Blood Cousins',
      statement_md:
        'Forest of rooted trees. For each query (v,p) count vertices that share the p-th ancestor with v (cousins).',
      input_format_md: 'n, parents, q queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },

  // Honest fillers for tags still short of 12
  {
    id: 'atc-abc079-d',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc079/tasks/abc079_d',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['FW on digit-change costs; sum min cost to turn each wall cell into 1'],
    approach_name: 'Digit FW',
    editorial_summary_md: 'All-pairs min cost among digits 0–9; apply to the grid.',
    target_complexity: 'O(1)',
    offline: {
      title: 'Wall',
      statement_md:
        'A grid of digits. You may change digit i to j for a given cost (then further changes allowed). Minimize total cost to make every non-−1 cell equal to 1.',
      input_format_md: 'H W, 10×10 cost matrix, then the grid.',
      output_format_md: 'Minimum total cost.',
      constraints_text: '$H,W \\le 200$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc012-d',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc012/tasks/abc012_4',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['FW all-pairs; choose bus stop minimizing the maximum distance to any other'],
    approach_name: 'Minimax FW',
    editorial_summary_md: 'Compute APSP; pick vertex with minimum eccentricity.',
    target_complexity: 'O(N³)',
    offline: {
      title: 'Bus Stop',
      statement_md:
        'Undirected weighted graph of bus stops. Choose a stop minimizing the maximum travel time to any other stop.',
      input_format_md: 'N M and M edges.',
      output_format_md: 'The minimum possible maximum time.',
      constraints_text: '$N \\le 300$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc70-d',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc070/tasks/abc070_d',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall', 'DFS', 'Dijkstra'],
    data_structures: ['Adjacency List'],
    key_insights: ['Tree: fix hub K; answer dist(a,K)+dist(b,K) via one DFS'],
    approach_name: 'Tree via hub',
    editorial_summary_md: 'DFS/BFS distances from K; each query is sum of two distances.',
    target_complexity: 'O(N + Q)',
    offline: {
      title: 'Transit Tree Path',
      statement_md:
        'Weighted tree. Queries ask shortest path a→b that must pass through vertex K.',
      input_format_md: 'N, edges, K, Q, then queries.',
      output_format_md: 'Distance per query.',
      constraints_text: '$N \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'uva-10496',
    source: 'UVA',
    url: 'https://onlinejudge.org/external/104/10496.pdf',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming', 'Bitmask / Bit DP'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['FW/manhattan distances then TSP bit DP on beepers'],
    approach_name: 'TSP bit DP',
    editorial_summary_md: 'Collect all beepers and return; classic Held-Karp on ≤10 points.',
    target_complexity: 'O(2^N · N²)',
    offline: {
      title: 'Collecting Beepers',
      statement_md:
        'Robot on a grid must visit all beepers and return to start. Minimize Manhattan travel.',
      input_format_md: 'Scenarios with size, start, beepers.',
      output_format_md: 'Minimum length per scenario.',
      constraints_text: '≤10 beepers',
      sample_io: [],
    },
  },
  {
    id: 'cf-986c',
    source: 'Codeforces',
    url: cfUrl('cf-986c'),
    difficulty_rating: 2400,
    paradigms: ['Graph Algorithms', 'Bitmask / Bit DP'],
    algorithms: ['DFS', 'BFS', 'Meet in the Middle'],
    data_structures: ['Queue'],
    key_insights: ['Complement graph on bitmasks; DFS components of given numbers and reachable complements'],
    approach_name: 'Bitmask components',
    editorial_summary_md: 'Traverse using subset edges of XOR complement; count components.',
    target_complexity: 'O(N · 2^N / N)',
    offline: {
      title: 'AND Graph',
      statement_md:
        'Vertices are given n-bit integers. Edge if a&b=0. Count connected components.',
      input_format_md: 'n m and m distinct integers.',
      output_format_md: 'Number of components.',
      constraints_text: '$n \\le 22$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1006f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1006/F',
    difficulty_rating: 2100,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'DFS'],
    data_structures: ['Hash Map', '2D Array'],
    key_insights: ['Duplicate id safe — filtered if present'],
    approach_name: 'Grid MITM',
    editorial_summary_md: 'Half-paths from corners meeting on diagonal.',
    target_complexity: 'O(2^{N} · N)',
    offline: {
      title: 'Xor Paths',
      statement_md: 'Count right/down paths with given XOR on a grid.',
      input_format_md: 'n m k and grid.',
      output_format_md: 'Count.',
      constraints_text: '$n+m \\le 40$',
      sample_io: [],
    },
  },
  {
    id: 'cf-888e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/888/E',
    difficulty_rating: 1800,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'Sorting', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Duplicate-safe MITM subset sum mod m'],
    approach_name: 'MITM subset sums',
    editorial_summary_md: 'Half subset sums + binary search.',
    target_complexity: 'O(2^{N/2} N)',
    offline: {
      title: 'Maximum Subsequence',
      statement_md: 'Maximize subsequence sum modulo m.',
      input_format_md: 'n m and array.',
      output_format_md: 'Answer.',
      constraints_text: '$n \\le 35$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1313c2',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1313/C2',
    difficulty_rating: 1800,
    paradigms: ['Greedy'],
    algorithms: [],
    data_structures: ['Monotonic Stack', '1D Array'],
    key_insights: ['Mono stack builds best unimodal roof with peak at each i; take max'],
    approach_name: 'Mono stack roofs',
    editorial_summary_md: 'Prefix/suffix forced minima via stack; combine for each peak.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Skyscrapers (hard)',
      statement_md:
        'Build unimodal heights ≤m_i maximizing sum (hard n≤5e5 version).',
      input_format_md: 'n and m array.',
      output_format_md: 'Optimal heights.',
      constraints_text: '$n \\le 5\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1157e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1157/E',
    difficulty_rating: 1600,
    paradigms: ['Greedy'],
    algorithms: ['LIS', 'Sorting'],
    data_structures: ['Ordered Set'],
    key_insights: ['Ordered multiset of b; pick best (a_i+b)%n partner'],
    approach_name: 'Multiset complements',
    editorial_summary_md: 'For each a_i take lower_bound of (n-a_i) in remaining b values.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Minimum Array',
      statement_md:
        'Permute b to minimize lexicographic (a_i+b_p_i) mod n.',
      input_format_md: 'n, a, b.',
      output_format_md: 'Optimal c.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-572b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/572/B',
    difficulty_rating: 1300,
    paradigms: ['Greedy'],
    algorithms: ['Sorting', 'LIS'],
    data_structures: ['Ordered Set', 'Hash Map'],
    key_insights: ['Aggregate orders by price; take best s buy/sell levels'],
    approach_name: 'Order book',
    editorial_summary_md: 'Map prices to volumes; print top s sell and buy levels.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Order Book',
      statement_md:
        'Process buy/sell orders; print the s best sell and buy price levels with aggregated volumes.',
      input_format_md: 'n s and n orders.',
      output_format_md: 'Sell then buy levels.',
      constraints_text: '$n \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1486d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1486/D',
    difficulty_rating: 2100,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Binary Search', 'Prefix Sums', 'LIS'],
    data_structures: [],
    key_insights: ['BSA on median; ±1 prefix check for length ≥k'],
    approach_name: 'BSA median',
    editorial_summary_md: 'Binary search median value; verify with prefix minima.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Max Median',
      statement_md: 'Maximize the median of a subarray of length at least k.',
      input_format_md: 'n k and array.',
      output_format_md: 'Maximum median.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1486c1',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1486/C1',
    difficulty_rating: 1500,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Binary Search', 'Ternary Search'],
    data_structures: [],
    key_insights: ['Already in batch if free — interactive second-max'],
    approach_name: 'Interactive second-max',
    editorial_summary_md: 'Binary search using second-maximum queries.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Guessing the Greatest (easy)',
      statement_md: 'Interactive find max index via second-max queries.',
      input_format_md: 'n then queries.',
      output_format_md: '`! i`.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-727c-b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/727/C',
    difficulty_rating: 1400,
    paradigms: ['Interactive'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: ['Pair-sum queries recover the hidden array'],
    approach_name: 'Sum queries',
    editorial_summary_md: 'Three equations for first three elements; then query with index 1.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Guess the Array (practice)',
      statement_md: 'Interactive recovery of an array from pairwise sums.',
      input_format_md: 'n then `?` queries.',
      output_format_md: '`!` array.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'lightoj-1074',
    source: 'LightOJ',
    url: 'https://lightoj.com/problem/extended-traffic',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    data_structures: ['Adjacency List'],
    key_insights: ['Cubic busyness differences as edge weights; BF + neg-cycle flood'],
    approach_name: 'BF traffic',
    editorial_summary_md: 'Same pattern as UVA Traffic: mark nodes reachable from negative cycles.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Extended Traffic',
      statement_md:
        'Cities with busyness; edge cost (b_v−b_u)³. Answer shortest path queries from city 1, printing `?` if unreachable or −∞.',
      input_format_md: 'T cases with n, busyness, edges, queries.',
      output_format_md: 'Case headers and answers.',
      constraints_text: '$n \\le 200$',
      sample_io: [],
    },
  },
  {
    id: 'spoj-highways',
    source: 'SPOJ',
    url: 'https://www.spoj.com/problems/HIGHWAYS/',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'Dijkstra'],
    data_structures: ['Priority Queue'],
    key_insights: ['Shortest path between two cities on undirected roads'],
    approach_name: 'SSSP highways',
    editorial_summary_md: 'Dijkstra from source; BF also correct on nonnegative weights.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Highways',
      statement_md: 'Find shortest route between two cities in an undirected weighted graph.',
      input_format_md: 'Tests with n m start end and edges.',
      output_format_md: 'Distance or `NONE`.',
      constraints_text: 'SPOJ typical',
      sample_io: [],
    },
  },
  {
    id: 'cf-545e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/545/E',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'MST'],
    data_structures: ['Priority Queue'],
    key_insights: ['Dijkstra tree choosing lightest parent edges yields minimum spanning shortest-path tree'],
    approach_name: 'Shortest-path MST',
    editorial_summary_md: 'Run Dijkstra tracking parent edge weight; sum chosen edge weights.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Paths and Trees',
      statement_md:
        'Undirected weighted graph. From vertex u build a spanning tree of shortest-path edges with minimum total weight.',
      input_format_md: 'n m edges, then u.',
      output_format_md: 'Total weight and n−1 edge indices.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-160d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/160/D',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST', 'DSU', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Duplicate-safe Kruskal edge classification'],
    approach_name: 'Kruskal classify',
    editorial_summary_md: 'Classify edges as any/at least one/none for MSTs.',
    target_complexity: 'O(M log N)',
    offline: {
      title: 'Edges in MST',
      statement_md: 'Classify each edge for MST membership.',
      input_format_md: 'n m edges.',
      output_format_md: 'any / at least one / none.',
      constraints_text: '$m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1217d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1217/D',
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Duplicate-safe edge coloring for cycles'],
    approach_name: '2-color cycles',
    editorial_summary_md: 'DAG → 1 color; else 2 colors on back edges.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Coloring Edges',
      statement_md: 'Color digraph edges to avoid monochromatic cycles.',
      input_format_md: 'n m edges.',
      output_format_md: 'colors.',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-510c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/510/C',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'String Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Queue'],
    key_insights: ['Duplicate-safe alphabet topo'],
    approach_name: 'Alphabet topo',
    editorial_summary_md: 'Build letter graph from name order; topo sort.',
    target_complexity: 'O(N · L)',
    offline: {
      title: 'Fox And Names',
      statement_md: 'Restore alphabet from sorted names.',
      input_format_md: 'n names.',
      output_format_md: 'alphabet or Impossible.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1082g',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1082/G',
    difficulty_rating: 2300,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['Queue'],
    key_insights: ['Duplicate-safe project min-cut'],
    approach_name: 'Project min-cut',
    editorial_summary_md: 'Max profit subgraph via min cut.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Petya and Graph',
      statement_md: 'Max edge-weight sum minus vertex costs.',
      input_format_md: 'n m.',
      output_format_md: 'profit.',
      constraints_text: '$n,m \\le 1000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-372c',
    source: 'Codeforces',
    url: cfUrl('cf-372c'),
    difficulty_rating: 2100,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Ternary Search'],
    data_structures: ['Deque'],
    key_insights: ['DP with sliding window maximum over reachable positions between fireworks'],
    approach_name: 'Deque DP',
    editorial_summary_md: 'For each firework time, update happiness with deque of prior positions.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Watching Fireworks is Fun',
      statement_md:
        'Fireworks at times t_i positions a_i; move ≤d per unit time. Maximize sum of happiness values.',
      input_format_md: 'n m d and m fireworks.',
      output_format_md: 'Maximum happiness.',
      constraints_text: '$n \\le 150000$, $m \\le 300$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1355c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1355/C',
    difficulty_rating: 1700,
    paradigms: ['Math / Number Theory', 'Two Pointers'],
    algorithms: ['Ternary Search', 'Prefix Sums'],
    data_structures: [],
    key_insights: ['Duplicate-safe triangle counting'],
    approach_name: 'Triangle sweep',
    editorial_summary_md: 'Prefix sums over possible z.',
    target_complexity: 'O(D)',
    offline: {
      title: 'Count Triangles',
      statement_md: 'Count triangles with sides in ranges A..B, B..C, C..D.',
      input_format_md: 'A B C D.',
      output_format_md: 'Count.',
      constraints_text: '$D \\le 5\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-626e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/626/E',
    difficulty_rating: 2400,
    paradigms: ['Binary Search on Answer', 'Math / Number Theory'],
    algorithms: ['Ternary Search', 'Sorting', 'Prefix Sums'],
    data_structures: [],
    key_insights: ['Sort; for each median ternary/binary search how many to take from ends to max mean−median'],
    approach_name: 'Ternary on take size',
    editorial_summary_md: 'For fixed median index, the optimal number of paired extremes is unimodal.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Group of Students',
      statement_md:
        'Choose an odd-sized multiset from the array maximizing (mean − median). Print the subset.',
      input_format_md: 'n and array a.',
      output_format_md: 'Size then elements.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'atc-abc184-f2',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/abc184/tasks/abc184_f',
    difficulty_rating: 1800,
    paradigms: ['Divide & Conquer', 'Brute Force'],
    algorithms: ['Meet in the Middle', 'Sorting', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Half subset sums; upper_bound for remaining capacity'],
    approach_name: 'MITM knapsack',
    editorial_summary_md: 'Split n≤40; maximize sum ≤T.',
    target_complexity: 'O(2^{N/2} N)',
    offline: {
      title: 'Programming Contest (MITM)',
      statement_md:
        'n≤40 problem times; maximize total time without exceeding T.',
      input_format_md: 'n T and times.',
      output_format_md: 'Maximum sum ≤T.',
      constraints_text: '$n \\le 40$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1101d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1101/D',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms', 'Math / Number Theory'],
    algorithms: ['DFS', 'Sieve'],
    data_structures: ['Adjacency List'],
    key_insights: ['Tree DP per prime factor: longest path where gcd of vertex values >1'],
    approach_name: 'Prime tree DP',
    editorial_summary_md: 'For each prime, consider subgraph of multiples; tree diameter style DP.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'GCD Counting',
      statement_md:
        'Tree with values a_v. Longest simple path where gcd of values on the path is >1.',
      input_format_md: 'n, array a, edges.',
      output_format_md: 'Maximum length (edges) or 0.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1534e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1534/E',
    difficulty_rating: 2200,
    paradigms: ['Interactive', 'Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['Queue'],
    key_insights: ['Interactive: query k indices; model XOR of answers; shortest path in state graph'],
    approach_name: 'Interactive XOR BFS',
    editorial_summary_md: 'BFS on number of known elements; reconstruct query sequence.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Lost Array',
      statement_md:
        'Interactive: hidden array. Query any k distinct indices; receive XOR of those values. Find the whole array with limited queries.',
      input_format_md: 'n k then interactive queries.',
      output_format_md: '`!` and the array.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },
];

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function unescapeHtml(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html: string): string {
  return unescapeHtml(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<span class="math math-inline">([\s\S]*?)<\/span>/gi, (_m, tex) => `$${tex.trim()}$`)
      .replace(/<span class="math math-display">([\s\S]*?)<\/span>/gi, (_m, tex) => `$$${tex.trim()}$$`)
      .replace(/<[^>]+>/g, '')
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url: string, attempts = 3): Promise<string> {
  let last = '';
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'text/html', 'User-Agent': UA },
        redirect: 'follow',
      });
      if (res.status === 429 || res.status === 403) {
        last = `HTTP ${res.status}`;
        await sleep(800 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
      await sleep(600 * (i + 1));
    }
  }
  throw new Error(last || 'fetch failed');
}

function parseCses(html: string): { title: string; body: string } {
  const title = html.match(/<h1>([^<]+)<\/h1>/)?.[1]?.trim() || 'CSES Problem';
  const md = html.match(/<div class="md">([\s\S]*?)<\/div>/)?.[1] || '';
  return { title, body: stripTags(md) };
}

function sectionFromBody(body: string, label: RegExp): string {
  const m = body.match(
    new RegExp(
      `(?:^|\\n)#*\\s*${label.source}\\s*\\n([\\s\\S]*?)(?=\\n#*\\s*(?:Input|Output|Constraints?|Sample|Examples?|Note)\\b|$)`,
      'i',
    ),
  );
  return m?.[1]?.trim().slice(0, 1200) || '';
}

function extractConstraints(body: string): string {
  const c = sectionFromBody(body, /Constraints?/);
  if (c) return c.slice(0, 500);
  const ranges = body.match(/\([^)]{0,50}\d[^)]{0,50}\)/g);
  if (ranges?.length) return ranges.slice(0, 8).join(' ');
  return 'See statement.';
}

function extractSamples(body: string): { input: string; output: string }[] {
  const samples: { input: string; output: string }[] = [];
  const re =
    /Sample Input\s*([\s\S]*?)\s*Sample Output\s*([\s\S]*?)(?=\s*Sample Input\b|\s*Note\b|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) && samples.length < 3) {
    samples.push({ input: m[1].trim(), output: m[2].trim().split(/\n\n/)[0].trim() });
  }
  return samples;
}

function approachFor(spec: Spec): Approach {
  return {
    id: `${spec.id}-a1`,
    problem_id: spec.id,
    approach_name: spec.approach_name,
    paradigms: spec.paradigms,
    algorithms: spec.algorithms || [],
    data_structures: spec.data_structures || [],
    key_insights: spec.key_insights,
    editorial_summary_md: spec.editorial_summary_md,
  };
}

async function buildDraft(spec: Spec): Promise<Draft> {
  if (spec.offline) {
    const o = spec.offline;
    return {
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
      approaches: [approachFor(spec)],
    };
  }
  const html = await fetchText(spec.url);
  const parsed = parseCses(html);
  if (!parsed.body || parsed.body.length < 40) throw new Error('empty body');
  const body = parsed.body;
  return {
    id: spec.id,
    title: parsed.title.trim(),
    source: spec.source,
    url: spec.url,
    difficulty_rating: spec.difficulty_rating,
    statement_md: body,
    input_format_md: sectionFromBody(body, /Input/) || 'See statement.',
    output_format_md: sectionFromBody(body, /Output/) || 'See statement.',
    constraints_text: extractConstraints(body),
    sample_io: extractSamples(body),
    target_complexity: defaultComplexity(spec.target_complexity),
    approaches: [approachFor(spec)],
  };
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return out;
}

async function main() {
  const have = existingIds();
  // dedupe specs by id
  const seen = new Set<string>();
  const unique = SPECS.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  const todo = unique.filter((s) => !have.has(s.id));
  console.log(`Batch7: ${todo.length}/${unique.length} to add (${unique.length - todo.length} already present)`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  let failed = 0;
  const results = await mapPool(todo, 3, async (spec, i) => {
    try {
      await sleep(80 * (i % 10));
      const draft = await buildDraft(spec);
      if ((i + 1) % 12 === 0 || i === todo.length - 1) {
        console.log(`  ${i + 1}/${todo.length} ok ${spec.id}`);
      }
      return { ok: true as const, draft };
    } catch (e) {
      console.warn(`  fail ${spec.id}: ${e instanceof Error ? e.message : e}`);
      return { ok: false as const };
    }
  });

  for (const r of results) {
    if (!r.ok) {
      failed += 1;
      continue;
    }
    if (have.has(r.draft.id)) continue;
    extras.push(r.draft);
    have.add(r.draft.id);
    added += 1;
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(`Added ${added}, failed ${failed}, extras now ${extras.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
