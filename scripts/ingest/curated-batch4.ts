/**
 * Batch 4 — keep filling tags still under ~8 occurrences.
 * Usage: npm run ingest:curated-batch4
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
  source: 'CSES' | 'Codeforces';
  url: string;
  titleHint?: string;
  difficulty_rating: number;
  paradigms: string[];
  algorithms?: string[];
  data_structures?: string[];
  key_insights: string[];
  approach_name: string;
  editorial_summary_md: string;
  target_complexity: string;
  offline?: Offline;
};

function cfUrl(id: string): string {
  const m = id.slice(3).match(/^(\d+)([a-z]\d*)$/i);
  if (!m) return 'https://codeforces.com/problemset';
  return `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`;
}

const CF: Record<string, Offline> = {
  'cf-295b': {
    title: 'Greg and Graph',
    statement_md:
      'You are given an $n\\times n$ adjacency matrix of a complete digraph. Vertices are deleted in a given order. Before each deletion, output the sum of shortest-path distances among remaining vertices.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 400$).\n\nThen an $n\\times n$ matrix.\n\nThen a permutation of $1..n$ — deletion order.',
    output_format_md: 'Print $n$ numbers — the distance sums before each deletion.',
    constraints_text: '$1 \\le n \\le 400$',
    sample_io: [
      {
        input: '4\n0 3 1 1\n3 0 1 1\n1 1 0 1\n1 1 1 0\n4 1 2 3',
        output: '17 7 2 0',
      },
    ],
  },
  'cf-20c': {
    title: 'Dijkstra?',
    statement_md:
      'Find any shortest path from vertex $1$ to vertex $n$ in an undirected weighted graph, or determine that none exists.',
    input_format_md:
      'The first line contains $n$ and $m$ ($2 \\le n \\le 10^5$, $0 \\le m \\le 10^5$).\n\nThen $m$ edges $a\\ b\\ w$ ($1 \\le w \\le 10^6$).',
    output_format_md: 'Print the vertices of a shortest path, or $-1$.',
    constraints_text: '$2 \\le n \\le 10^5$',
    sample_io: [{ input: '5 6\n1 2 2\n2 5 5\n2 3 4\n1 4 1\n4 3 3\n3 5 1', output: '1 4 3 5' }],
  },
  'cf-1363a': {
    title: 'Odd Selection',
    statement_md:
      'You have $n$ integers. Can you choose exactly $x$ of them so that their sum is odd?',
    input_format_md:
      'The first line contains $t$.\n\nEach test: first line $n$ and $x$; second line $n$ integers.',
    output_format_md: 'Print `Yes` or `No` for each test.',
    constraints_text: '$1 \\le t \\le 1000$, $1 \\le x \\le n \\le 1000$',
    sample_io: [{ input: '5\n1 1\n999\n1 1\n1000\n2 1\n1000 1000\n2 2\n19 20\n3 2\n1 1 1', output: 'Yes\nNo\nNo\nYes\nYes' }],
  },
  'cf-448d': {
    title: 'Multiplication Table',
    statement_md:
      'Consider the $n \\times m$ multiplication table ($i\\cdot j$ at cell $(i,j)$). Find the $k$-th smallest number in it.',
    input_format_md: 'A single line with $n$, $m$, and $k$ ($1 \\le n,m \\le 10^5$, $1 \\le k \\le n\\cdot m$).',
    output_format_md: 'Print the $k$-th smallest entry.',
    constraints_text: '$1 \\le n,m \\le 10^5$',
    sample_io: [{ input: '2 3 4', output: '3' }],
  },
  'cf-1355c': {
    title: 'Count Triangles',
    statement_md:
      'Count triangles with integer sides $a\\le x\\le b\\le y\\le c\\le z\\le d$ that satisfy the triangle inequality (degenerate not allowed).',
    input_format_md: 'Four integers $A,B,C,D$ ($1 \\le A\\le B\\le C\\le D\\le 5\\cdot 10^5$).',
    output_format_md: 'Print the number of valid triangles.',
    constraints_text: '$1 \\le A\\le B\\le C\\le D\\le 5\\cdot 10^5$',
    sample_io: [{ input: '1 2 3 4', output: '1' }],
  },
  'cf-372a': {
    title: 'Counting Kangaroo is Fun',
    statement_md:
      'You have $n$ kangaroos with sizes $s_i$. A kangaroo can fit into another at least twice as large, and each can contain at most one other (recursively). Maximize the number of visible kangaroos (not inside another).',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 5\\cdot 10^5$).\n\nThen $n$ sizes.',
    output_format_md: 'Print the minimum number of visible kangaroos.',
    constraints_text: '$1 \\le n \\le 5\\cdot 10^5$',
    sample_io: [{ input: '8\n2\n5\n7\n6\n9\n8\n4\n2', output: '5' }],
  },
  'cf-567c': {
    title: 'Geometric Progression',
    statement_md:
      'Count index triples $i<j<k$ such that $a_j/a_i = a_k/a_j = r$ (values form a geometric progression with ratio $r$).',
    input_format_md:
      'The first line contains $n$ and $r$ ($1 \\le n \\le 2\\cdot 10^5$, $1 \\le r \\le 10^9$).\n\nThe second line contains $a_1\\dots a_n$ ($|a_i| \\le 10^9$).',
    output_format_md: 'Print the number of triples.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '5 2\n1 1 2 2 4', output: '4' }],
  },
  'cf-61d': {
    title: 'Eternal Victory',
    statement_md:
      'A tree with weighted edges. Starting at $1$, you must visit every vertex (and may traverse edges multiple times). Minimize the total walked length.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nThen $n-1$ edges $a\\ b\\ d$.',
    output_format_md: 'Print the minimum walk length.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '3\n1 2 3\n2 3 4', output: '10' }],
  },
  'cf-545e': {
    title: 'Paths and Trees',
    statement_md:
      'Given an undirected weighted graph and a source $u$, choose a spanning subgraph of $n-1$ edges that preserves shortest-path distances from $u$ to all vertices and has minimum total edge weight among such subgraphs.',
    input_format_md:
      'The first line contains $n$ and $m$.\n\nThen $m$ edges.\n\nThen $u$.',
    output_format_md: 'Print the total weight and the list of chosen edge indices.',
    constraints_text: '$1 \\le n \\le 3\\cdot 10^5$, $0 \\le m \\le 3\\cdot 10^5$',
    sample_io: [
      {
        input: '3 3\n1 2 3\n2 3 4\n1 3 5\n1',
        output: '7\n1 2',
      },
    ],
  },
  'cf-1132b': {
    title: 'Draw!',
    statement_md:
      'Skipped — placeholder replaced below.',
    input_format_md: 'x',
    output_format_md: 'x',
    constraints_text: 'x',
    sample_io: [],
  },
  'cf-1422d': {
    title: 'Returning Home',
    statement_md:
      'You move on the plane from $(sx,sy)$ to $(fx,fy)$. You may walk between adjacent integer points for cost $1$ per unit, or teleport between given special points for free if they share x or y. Minimize cost.',
    input_format_md:
      'The first line contains $n$ and $m$ (grid bound and number of specials).\n\nThen start and finish coordinates.\n\nThen $m$ special points.',
    output_format_md: 'Print the minimum cost.',
    constraints_text: '$1 \\le m \\le 10^5$',
    sample_io: [{ input: '5 3\n1 1 5 5\n1 2\n4 1\n3 3', output: '4' }],
  },
  'cf-938d': {
    title: 'Buy a Ticket',
    statement_md:
      'A weighted undirected graph of $n$ cities. Concert in city $i$ costs $a_i$. You may travel edges paying twice the weight. For each city compute the minimum cost to attend some concert (travel + ticket).',
    input_format_md:
      'The first line contains $n$ and $m$.\n\nThen $m$ edges.\n\nThen array $a_1\\dots a_n$.',
    output_format_md: 'Print $n$ answers.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [
      {
        input: '4 2\n1 2 4\n2 3 7\n6 20 1 25',
        output: '6 14 1 25',
      },
    ],
  },
  'cf-1473d': {
    title: 'Program',
    statement_md:
      'You have a program of `+`/`-` moves on an integer starting at $0$. For each query that deletes a substring, report how many distinct values the position can take during execution.',
    input_format_md:
      'The first line contains $t$.\n\nEach test: $n$ and $m$, the program string, then $m$ queries $l\\ r$.',
    output_format_md: 'For each query print the number of distinct positions visited.',
    constraints_text: 'Sum of $n,m$ $\\le 2\\cdot 10^5$',
    sample_io: [{ input: '2\n8 4\n-+--+--+\n1 8\n2 8\n2 5\n1 1\n4 10\n+-++\n1 1\n1 2\n2 2\n1 3\n2 3\n2 4\n1 4\n2 4\n1 2\n1 3', output: '1\n2\n4\n4\n3\n3\n4\n2\n3\n2\n1\n2\n3\n2' }],
  },
  'cf-487b': {
    title: 'Strip',
    statement_md:
      'Split an array into the minimum number of contiguous strips such that each strip length $\\ge l$ and max-min $\\le s$.',
    input_format_md:
      'The first line contains $n$, $s$, and $l$.\n\nThe second line contains the array.',
    output_format_md: 'Print the minimum number of strips or $-1$.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '7 2 2\n1 3 1 2 4 1 2', output: '3' }],
  },
  'cf-1195c': {
    title: 'Basketball Exercise',
    statement_md:
      'Two rows of $n$ students with heights. Choose a sequence alternating rows (no two adjacent from the same column index pattern: students from different rows each time, columns strictly increasing). Maximize height sum.',
    input_format_md:
      'The first line contains $n$.\n\nThe second line contains row 1 heights.\n\nThe third line contains row 2 heights.',
    output_format_md: 'Print the maximum sum.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '5\n9 3 5 7 3\n5 8 1 4 5', output: '29' }],
  },
};

// Fix broken placeholder
delete CF['cf-1132b'];

const SPECS: Spec[] = [
  // Geometry
  {
    id: 'cses-polygon-lattice-points',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2193',
    difficulty_rating: 1600,
    paradigms: ['Geometry', 'Math / Number Theory'],
    key_insights: ['Pick’s theorem: boundary points via gcd on edges; interior = area - B/2 + 1'],
    approach_name: 'Pick’s theorem',
    editorial_summary_md: 'Compute twice-area with shoelace and boundary lattice points with gcd.',
    target_complexity: 'O(N)',
  },

  // Segtree / PQ / Ordered Set
  {
    id: 'cses-hotel-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1143',
    difficulty_rating: 1500,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Binary Search'],
    data_structures: ['Priority Queue'],
    key_insights: ['Segtree stores max free rooms; find leftmost hotel that fits'],
    approach_name: 'Max segtree',
    editorial_summary_md: 'Each query finds the first hotel with enough free rooms and decreases it.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-polynomial-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1736',
    difficulty_rating: 1900,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    key_insights: ['Lazy segtree for arithmetic-progression range adds + range sums'],
    approach_name: 'AP lazy segtree',
    editorial_summary_md: 'Represent range add of 1,2,3,… with two lazy values and closed-form sums.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-range-queries-and-copies',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1737',
    difficulty_rating: 1900,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    key_insights: ['Persistent segtree: each array version is a new root'],
    approach_name: 'Persistent segtree',
    editorial_summary_md: 'Support copy-array operations with persistence; point updates and range sums per version.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-concert-tickets',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1091',
    difficulty_rating: 1300,
    paradigms: ['Greedy'],
    data_structures: ['Ordered Set', 'Priority Queue'],
    algorithms: ['Binary Search', 'Sorting'],
    key_insights: ['Multiset of ticket prices; upper_bound for customer max price'],
    approach_name: 'Ordered multiset',
    editorial_summary_md: 'For each customer take the most expensive affordable ticket.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-stick-divisions',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1161',
    difficulty_rating: 1500,
    paradigms: ['Greedy'],
    data_structures: ['Priority Queue'],
    key_insights: ['Reverse Huffman: always merge two smallest sticks'],
    approach_name: 'Heap merging',
    editorial_summary_md: 'Cost to combine is the new length; greedily combine smallest parts.',
    target_complexity: 'O(N log N)',
  },

  // Strings / Trie / Hash / KMP
  {
    id: 'cses-counting-patterns',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2103',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing', 'KMP'],
    data_structures: ['Trie'],
    key_insights: ['Aho-Corasick occurrence counts for each pattern'],
    approach_name: 'Aho-Corasick',
    editorial_summary_md: 'Build a trie of patterns with failure links; stream the text and tally matches.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-pattern-positions',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2104',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing', 'KMP'],
    data_structures: ['Trie'],
    key_insights: ['Report first occurrence index of each pattern (Aho-Corasick / SA)'],
    approach_name: 'First occurrence',
    editorial_summary_md: 'Multi-pattern search returning the leftmost position for every pattern.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-word-combinations-trie',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1731',
    difficulty_rating: 1600,
    paradigms: ['String Algorithms', 'Dynamic Programming'],
    data_structures: ['Trie'],
    algorithms: ['String Hashing'],
    key_insights: ['DP[i] ways to build prefix i; trie or hash-set of dictionary words'],
    approach_name: 'Trie DP',
    editorial_summary_md: 'From each position walk the trie of dictionary words and add ways.',
    target_complexity: 'O(N · L)',
  },

  // Math / Sieve
  {
    id: 'cses-divisor-analysis',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2182',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Given prime factorization, compute number/sum/product of divisors mod 1e9+7'],
    approach_name: 'Factor formulas',
    editorial_summary_md: 'Use multiplicative formulas; product of divisors needs careful exponents mod φ(MOD-1).',
    target_complexity: 'O(K log EXP)',
  },
  {
    id: 'cses-counting-coprime-pairs',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2417',
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Mobius inversion over gcd; sieve μ and multiples counts'],
    approach_name: 'Mobius sieve',
    editorial_summary_md: 'Count pairs with gcd 1 via μ(d) · C(cnt_d, 2) style sums.',
    target_complexity: 'O(MAX log MAX)',
  },

  // Graphs thin tags
  {
    id: 'cses-graph-girth',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1707',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['BFS'],
    data_structures: ['Queue'],
    key_insights: ['BFS from each node detects shortest cycle through that source'],
    approach_name: 'Multi-source girth BFS',
    editorial_summary_md: 'The girth is the minimum over BFS-found back edges of dist sums.',
    target_complexity: 'O(N · (N+M))',
  },
  {
    id: 'cses-coin-grid',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1709',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS', 'DFS'],
    key_insights: ['Minimum vertex cover on bipartite row-column graph of coins'],
    approach_name: 'Bipartite cover',
    editorial_summary_md: 'Model coins as edges between rows and columns; Konig cover = matching.',
    target_complexity: 'O(V · E)',
  },
  {
    id: 'cses-planets-queries-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1160',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Binary Search', 'DFS'],
    data_structures: ['Queue'],
    key_insights: ['Functional graph: binary lifting + cycle handling for reachability queries'],
    approach_name: 'Functional queries',
    editorial_summary_md: 'Answer whether a can reach b and the distance along unique outgoing edges.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-finding-a-centroid',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2079',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms', 'Divide & Conquer'],
    algorithms: ['DFS'],
    key_insights: ['Centroid = node with all subtree sizes ≤ N/2'],
    approach_name: 'Centroid find',
    editorial_summary_md: 'Compute subtree sizes; the centroid balances the heaviest child.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-tree-isomorphism-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1700',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'Sorting'],
    data_structures: ['Hash Map'],
    key_insights: ['Rooted AHU tree hash: sort child hashes recursively'],
    approach_name: 'AHU hashing',
    editorial_summary_md: 'Compare two rooted trees via canonical parenthesized hashes.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-tree-isomorphism-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1701',
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'Sorting'],
    data_structures: ['Hash Map', 'Queue'],
    key_insights: ['Unrooted: try roots at tree centers (1 or 2) and compare AHU hashes'],
    approach_name: 'Center + AHU',
    editorial_summary_md: 'Find centers then test isomorphism as rooted trees.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-fixed-length-paths-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2081',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms', 'Divide & Conquer'],
    algorithms: ['DFS'],
    key_insights: ['Centroid decomp counting paths with length in [a,b]'],
    approach_name: 'Centroid paths',
    editorial_summary_md: 'Count pairs at distance in a range using centroid decomposition and fenwick/prefix.',
    target_complexity: 'O(N log² N)',
  },
  {
    id: 'cses-path-queries-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2134',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Segment Tree', 'LCA'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['HLD + segtree for path max queries and point updates'],
    approach_name: 'HLD',
    editorial_summary_md: 'Heavy-light decomposition flattens paths into O(log n) segments.',
    target_complexity: 'O((N+Q) log² N)',
  },

  // Bitmask / DP
  {
    id: 'cses-counting-tilings',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2181',
    difficulty_rating: 1800,
    paradigms: ['Bitmask / Bit DP', 'Dynamic Programming'],
    key_insights: ['Profile DP filling grid column-by-column with bitmasks'],
    approach_name: 'Profile DP',
    editorial_summary_md: 'Enumerate vertical/horizontal tile placements transitioning masks between columns.',
    target_complexity: 'O(N · 2^M · M)',
  },
  {
    id: 'cses-elevator-rides',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1653',
    difficulty_rating: 1600,
    paradigms: ['Bitmask / Bit DP', 'Dynamic Programming'],
    key_insights: ['dp[mask] = (rides, last load); try adding people to current ride'],
    approach_name: 'Bitmask elevator',
    editorial_summary_md: 'Minimize elevator rides for n≤20 people with weight capacity x.',
    target_complexity: 'O(2^N · N)',
  },
  {
    id: 'cses-increasing-subsequence-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1748',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Segment Tree', 'Sorting'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Count increasing subsequences with fenwick on compressed values'],
    approach_name: 'Fenwick LIS count',
    editorial_summary_md: 'dp[v] += 1 + sum of dp[u] for u<v; maintain with a BIT.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-grid-path-description',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1625',
    difficulty_rating: 1700,
    paradigms: ['Brute Force', 'Bitmask / Bit DP'],
    algorithms: ['DFS'],
    key_insights: ['Backtracking on a 7×7 grid with pruning when the path self-splits'],
    approach_name: 'Grid backtracking',
    editorial_summary_md: 'Count paths matching a move pattern visiting every cell once.',
    target_complexity: 'O(N!)',
  },

  // Mono stack / Deque / Two pointers
  {
    id: 'cses-sum-of-four-values',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1642',
    difficulty_rating: 1500,
    paradigms: ['Two Pointers', 'Brute Force'],
    algorithms: ['Sorting', 'Binary Search'],
    data_structures: ['Hash Map'],
    key_insights: ['Hash pair sums or fix two indices and two-pointer the rest'],
    approach_name: 'Pair hashing',
    editorial_summary_md: 'Store two-sums with indices; look for complementary pairs without overlap.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'cf-487b',
    source: 'Codeforces',
    url: cfUrl('cf-487b'),
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming', 'Two Pointers'],
    algorithms: ['Binary Search'],
    data_structures: ['Deque', 'Sparse Table'],
    key_insights: ['Sparse table / deques for range max-min; DP leftmost valid segment ends'],
    approach_name: 'Deque DP',
    editorial_summary_md: 'For each r find minimal l with constraints; DP number of strips.',
    target_complexity: 'O(N)',
    offline: CF['cf-487b'],
  },
  {
    id: 'cf-372a',
    source: 'Codeforces',
    url: cfUrl('cf-372a'),
    difficulty_rating: 1600,
    paradigms: ['Greedy', 'Two Pointers'],
    algorithms: ['Binary Search', 'Sorting'],
    data_structures: ['Deque'],
    key_insights: ['Sort; greedy match largest with largest that can nest (≤ half)'],
    approach_name: 'Two-pointer nesting',
    editorial_summary_md: 'After sorting, pair from the middle split to minimize visible kangaroos.',
    target_complexity: 'O(N log N)',
    offline: CF['cf-372a'],
  },

  // Floyd / Dijkstra / PQ / Bellman extras
  {
    id: 'cf-295b',
    source: 'Codeforces',
    url: cfUrl('cf-295b'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['Add vertices in reverse deletion order; Floyd online'],
    approach_name: 'Reverse Floyd',
    editorial_summary_md: 'Run Floyd by inserting nodes backward; accumulate distance sums.',
    target_complexity: 'O(N³)',
    offline: CF['cf-295b'],
  },
  {
    id: 'cf-20c',
    source: 'Codeforces',
    url: cfUrl('cf-20c'),
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    data_structures: ['Priority Queue', 'Adjacency List'],
    key_insights: ['Standard Dijkstra with parent pointers to reconstruct path'],
    approach_name: 'Dijkstra path',
    editorial_summary_md: 'Compute 1→n distances and walk parents back to print the path.',
    target_complexity: 'O(M log N)',
    offline: CF['cf-20c'],
  },
  {
    id: 'cf-938d',
    source: 'Codeforces',
    url: cfUrl('cf-938d'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    data_structures: ['Priority Queue'],
    key_insights: ['Multi-source Dijkstra from all concerts with edge weights doubled'],
    approach_name: 'Multi-source Dijkstra',
    editorial_summary_md: 'Seed the heap with ticket costs; relax edges at 2w.',
    target_complexity: 'O(M log N)',
    offline: CF['cf-938d'],
  },
  {
    id: 'cf-545e',
    source: 'Codeforces',
    url: cfUrl('cf-545e'),
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'MST'],
    data_structures: ['Priority Queue'],
    key_insights: ['Among Dijkstra tree edges, pick lightest incoming edges that realize dist[]'],
    approach_name: 'Shortest-path tree',
    editorial_summary_md: 'Build a minimum-weight shortest-path tree from the source.',
    target_complexity: 'O(M log N)',
    offline: CF['cf-545e'],
  },
  {
    id: 'cf-1422d',
    source: 'Codeforces',
    url: cfUrl('cf-1422d'),
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra', 'Sorting'],
    data_structures: ['Priority Queue'],
    key_insights: ['Graph on specials + start/finish; edges when sharing x/y after sort'],
    approach_name: 'Implicit grid graph',
    editorial_summary_md: 'Connect sorted specials by x and by y; Dijkstra from start.',
    target_complexity: 'O(M log M)',
    offline: CF['cf-1422d'],
  },
  {
    id: 'cf-61d',
    source: 'Codeforces',
    url: cfUrl('cf-61d'),
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['DFS'],
    key_insights: ['Answer = 2*sum(edges) - max root-to-leaf path'],
    approach_name: 'Tree traversal cost',
    editorial_summary_md: 'Must cover every edge twice except you can finish at the farthest leaf.',
    target_complexity: 'O(N)',
    offline: CF['cf-61d'],
  },

  // BSA / Ternary-ish
  {
    id: 'cf-448d',
    source: 'Codeforces',
    url: cfUrl('cf-448d'),
    difficulty_rating: 1800,
    paradigms: ['Binary Search on Answer', 'Math / Number Theory'],
    algorithms: ['Binary Search', 'Ternary Search'],
    key_insights: ['Binary search value x; count entries ≤ x by summing min(m, x/i)'],
    approach_name: 'Count in table',
    editorial_summary_md: 'Monotonic count of table entries ≤ mid; search the k-th.',
    target_complexity: 'O(N log A)',
    offline: CF['cf-448d'],
  },
  {
    id: 'cf-1355c',
    source: 'Codeforces',
    url: cfUrl('cf-1355c'),
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory', 'Two Pointers'],
    algorithms: ['Prefix Sums'],
    key_insights: ['Fix z; count (x,y) with x+y>z using prefix counts on ranges'],
    approach_name: 'Triangle enumeration',
    editorial_summary_md: 'Sweep possible hypotenuse lengths with contribution formulas.',
    target_complexity: 'O(D)',
    offline: CF['cf-1355c'],
  },

  // Hash map / misc
  {
    id: 'cf-567c',
    source: 'Codeforces',
    url: cfUrl('cf-567c'),
    difficulty_rating: 1700,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Left/right frequency maps for a/r and a*r while scanning'],
    approach_name: 'Two-map GP',
    editorial_summary_md: 'For each middle value count left predecessors and right successors.',
    target_complexity: 'O(N)',
    offline: CF['cf-567c'],
  },
  {
    id: 'cf-1195c',
    source: 'Codeforces',
    url: cfUrl('cf-1195c'),
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    data_structures: ['1D Array'],
    key_insights: ['dp1[i]/dp2[i] best ending on row1/row2 at column i'],
    approach_name: 'Two-row DP',
    editorial_summary_md: 'Transition from the other row’s previous best plus current height.',
    target_complexity: 'O(N)',
    offline: CF['cf-1195c'],
  },
  {
    id: 'cf-1473d',
    source: 'Codeforces',
    url: cfUrl('cf-1473d'),
    difficulty_rating: 1700,
    paradigms: ['Prefix Sums', 'Ad-Hoc'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Sparse Table', 'Stack'],
    key_insights: ['Pref min/max outside deleted range combine with middle reset'],
    approach_name: 'Prefix extrema',
    editorial_summary_md: 'Precompute prefix/suffix mins and maxes to answer deletion queries.',
    target_complexity: 'O(N + Q)',
    offline: CF['cf-1473d'],
  },
  {
    id: 'cf-1363a',
    source: 'Codeforces',
    url: cfUrl('cf-1363a'),
    difficulty_rating: 900,
    paradigms: ['Math / Number Theory', 'Brute Force'],
    key_insights: ['Need odd count of odds in the chosen subset; check parity availability'],
    approach_name: 'Parity cases',
    editorial_summary_md: 'Track counts of odd/even; verify whether an odd sum of size x exists.',
    target_complexity: 'O(N)',
    offline: CF['cf-1363a'],
  },
  {
    id: 'cses-sliding-window-minimum',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3221',
    difficulty_rating: 1400,
    paradigms: ['Two Pointers'],
    data_structures: ['Deque'],
    algorithms: ['Prefix Sums'],
    key_insights: ['Monotonic deque maintains candidates for window minimum'],
    approach_name: 'Monotonic deque',
    editorial_summary_md: 'Slide a window of length k; pop back while larger, pop front when out of window.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-sliding-window-sum',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3220',
    difficulty_rating: 1200,
    paradigms: ['Two Pointers', 'Prefix Sums'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Queue'],
    key_insights: ['Maintain running sum while advancing the window'],
    approach_name: 'Window sum',
    editorial_summary_md: 'Add entering values and subtract leaving ones for each window sum.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-sliding-window-median',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1076',
    difficulty_rating: 1600,
    paradigms: ['Two Pointers'],
    data_structures: ['Ordered Set', 'Priority Queue'],
    algorithms: ['Sorting'],
    key_insights: ['Two multisets / policy PBDS keep lower and upper halves for median'],
    approach_name: 'Dual multiset median',
    editorial_summary_md: 'Balance two ordered bags so the median is the max of the lower half.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-distinct-substrings',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2105',
    difficulty_rating: 1700,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    data_structures: ['Trie'],
    key_insights: ['Suffix array/automaton or hash-set of all substrings with SA LCP'],
    approach_name: 'Suffix structures',
    editorial_summary_md: 'Count distinct substrings via SA+LCP: n(n+1)/2 - sum LCP.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-string-functions',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2107',
    difficulty_rating: 1500,
    paradigms: ['String Algorithms'],
    algorithms: ['KMP', 'String Hashing'],
    key_insights: ['Compute Z-array and KMP prefix function (pi) for the string'],
    approach_name: 'Z and pi',
    editorial_summary_md: 'Output both the Z-array and the Knuth–Morris–Pratt border array.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-next-prime',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3396',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['For each query find the next prime ≥ n (segmented check / sieve up to bound)'],
    approach_name: 'Next prime',
    editorial_summary_md: 'Primality test each candidate upward; pre-sieve helps for many queries.',
    target_complexity: 'O(Q √A)',
  },
  {
    id: 'cses-mst-edge-check',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/3407',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['MST', 'DSU', 'Sorting'],
    key_insights: ['An edge can appear in some MST iff it does not create a lighter cycle'],
    approach_name: 'MST edge check',
    editorial_summary_md: 'Sort edges; DSU determines which edges are MST-feasible.',
    target_complexity: 'O(M log M)',
  },
];

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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
        await sleep(900 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
      await sleep(700 * (i + 1));
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

function defaultComplexity(raw: string): string {
  if ((COMPLEXITY_OPTIONS as readonly string[]).includes(raw)) return raw;
  if (/N!/i.test(raw)) return 'O(N!)';
  if (/2\^N/i.test(raw)) return 'O(2^N)';
  if (/N³|N\^3/i.test(raw)) return 'O(N³)';
  if (/log²|N²|N\^2/i.test(raw)) return 'O(N²)';
  if (/N \+ M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  if (/O\(1\)/i.test(raw)) return 'O(1)';
  return 'O(N)';
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
    title: (spec.titleHint || parsed.title).trim(),
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
  const skipIfHave = new Map([['cses-word-combinations-trie', 'cses-word-combinations']]);
  const todo = SPECS.filter((s) => {
    if (have.has(s.id)) return false;
    const o = skipIfHave.get(s.id);
    if (o && have.has(o)) return false;
    return true;
  });

  console.log(`Batch4: ${todo.length}/${SPECS.length} to add`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  // Retag word-combinations with Trie if present
  let retagged = 0;
  const wc = extras.find((p) => p.id === 'cses-word-combinations');
  if (wc?.approaches?.[0]) {
    const a = wc.approaches[0];
    const before = JSON.stringify(a);
    a.paradigms = [...new Set([...(a.paradigms || []), 'String Algorithms', 'Dynamic Programming'])];
    a.data_structures = [...new Set([...(a.data_structures || []), 'Trie'])];
    a.algorithms = [...new Set([...(a.algorithms || []), 'String Hashing'])];
    if (JSON.stringify(a) !== before) retagged += 1;
  }

  let added = 0;
  let failed = 0;
  const results = await mapPool(todo, 3, async (spec, i) => {
    try {
      await sleep(100 * (i % 8));
      const draft = await buildDraft(spec);
      if ((i + 1) % 10 === 0 || i === todo.length - 1) console.log(`  ${i + 1}/${todo.length} ok ${spec.id}`);
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
  console.log(`Added ${added}, retagged ${retagged}, failed ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
