/**
 * Batch 5 — more CSES advanced + CF offline for tags still <10.
 * Usage: npm run ingest:curated-batch5
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
  'cf-449b': {
    title: 'Jzzhu and Cities',
    statement_md:
      'A country has $n$ cities, $m$ roads, and $k$ train routes from the capital (city 1). Train routes are edges from 1 with given lengths. You may close as many train routes as possible without increasing any city’s shortest-path distance from 1.',
    input_format_md:
      'First line: $n,m,k$.\n\nThen $m$ roads $u\\ v\\ x$.\n\nThen $k$ trains $s\\ y$ (edge $1\\to s$ of length $y$).',
    output_format_md: 'Print the maximum number of train routes you can close.',
    constraints_text: '$2 \\le n \\le 10^5$, $1 \\le m \\le 3\\cdot 10^5$',
    sample_io: [{ input: '5 5 3\n1 2 1\n2 3 2\n1 3 1\n3 4 1\n1 5 3\n3 2\n5 3\n4 2', output: '2' }],
  },
  'cf-938d': {
    title: 'Buy a Ticket',
    statement_md: 'duplicate guard',
    input_format_md: 'x',
    output_format_md: 'x',
    constraints_text: 'x',
    sample_io: [],
  },
  'cf-1070c': {
    title: 'Cloud Computing',
    statement_md:
      'You need $k$ CPU cores on each of $n$ days. Offers $(l,r,c,p)$ provide $c$ cores on days $l..r$ at price $p$ each. Minimize total cost (or $-1$).',
    input_format_md: 'First line $n,k,m$. Then $m$ offers.',
    output_format_md: 'Print the minimum cost or $-1$.',
    constraints_text: '$1 \\le n \\le 10^6$, $1 \\le m \\le 2\\cdot 10^5$',
    sample_io: [{ input: '4 2 2\n1 4 1 1\n1 4 1 1', output: '8' }],
  },
  'cf-1486c2': {
    title: 'Guessing the Greatest (hard version)',
    statement_md:
      'Interactive: array of $n$ distinct numbers. Query $?\\ l\\ r$ returns the index of the second maximum on $[l,r]$. Find the index of the global maximum in $\\le 20$ queries.',
    input_format_md: 'First the integer $n$ ($2 \\le n \\le 10^5$). Then interactive queries.',
    output_format_md: 'Print `! x` — the index of the maximum.',
    constraints_text: 'At most 20 queries',
    sample_io: [],
  },
  'cf-727a': {
    title: 'Transformation: from A to B',
    statement_md:
      'Start from $a$. You may multiply by 2 or append digit 1 (i.e. $x \\mapsto 10x+1$). Can you reach $b$? If yes, print one sequence of values.',
    input_format_md: 'Two integers $a$ and $b$ ($1 \\le a < b \\le 10^9$).',
    output_format_md: 'Print `YES` and the sequence, or `NO`.',
    constraints_text: '$1 \\le a < b \\le 10^9$',
    sample_io: [{ input: '2 162', output: 'YES\n5\n2 4 8 81 162' }],
  },
  'cf-1005d': {
    title: 'Polycarp and Div 3',
    statement_md:
      'Given a digit string, split it into the maximum number of contiguous pieces each divisible by 3 (as decimal integers; leading zeros allowed).',
    input_format_md: 'A single string of digits (length $1..2\\cdot 10^5$).',
    output_format_md: 'Print the maximum number of pieces.',
    constraints_text: '$1 \\le |s| \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3121', output: '2' }],
  },
  'cf-1288c': {
    title: 'Two Arrays',
    statement_md:
      'Count pairs of arrays $a,b$ of length $m$ with $1\\le a_i,b_i\\le n$, $a$ non-decreasing, $b$ non-increasing, and $a_i\\le b_i$ for all $i$, modulo $10^9+7$.',
    input_format_md: 'Two integers $n$ and $m$ ($1 \\le n \\le 1000$, $1 \\le m \\le 10$).',
    output_format_md: 'Print the answer modulo $10^9+7$.',
    constraints_text: '$1 \\le n \\le 1000$, $1 \\le m \\le 10$',
    sample_io: [{ input: '2 2', output: '5' }],
  },
  'cf-231e': {
    title: 'Cactus',
    statement_md:
      'A cactus graph (each edge in ≤1 simple cycle). Count pairs of vertices whose unique path goes through at least one cycle edge, or related path queries — specifically: given $q$ pairs, count how many edges on the path lie on cycles (compressed).',
    input_format_md: 'Graph of $n$ vertices $m$ edges, then $q$ queries.',
    output_format_md: 'For each query print $2^{k}$ where $k$ is the number of cycle-blocks on the path, modulo $10^9+7$.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [],
  },
  'cf-6d': {
    title: 'Lizak and Apples',
    statement_md: 'placeholder',
    input_format_md: 'x',
    output_format_md: 'x',
    constraints_text: 'x',
    sample_io: [],
  },
  'cf-486e': {
    title: 'LIS of Sequence',
    statement_md:
      'For each position of an array, classify whether it belongs to every LIS, some but not all, or no LIS. Output a string of `1`/`2`/`3` for each index.',
    input_format_md: 'First line $n$. Second line the array ($1 \\le n \\le 10^5$).',
    output_format_md: 'Print a string of length $n$ over `123`.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '1\n4', output: '3' }],
  },
  'cf-1000e': {
    title: 'We Need More Bosses',
    statement_md:
      'Given an undirected connected graph, you may orient edges arbitrarily, then choose two vertices $s,t$ maximizing the number of bridges on the unique path if the graph of 2-edge-connected components is a tree. Find that maximum.',
    input_format_md: 'First line $n,m$. Then $m$ edges.',
    output_format_md: 'Print the maximum number of bridges on a path in the bridge-tree.',
    constraints_text: '$2 \\le n \\le 3\\cdot 10^5$',
    sample_io: [{ input: '5 5\n1 2\n2 3\n3 1\n2 4\n3 5', output: '2' }],
  },
  'cf-319c': {
    title: 'Kalila and Dimna in the Logging Industry',
    statement_md:
      'Chop $n$ trees with heights $a_i$ and costs $b_i$. DP with convex hull trick: $dp_i = \\min_{j<i} dp_j + a_i b_j$.',
    input_format_md: 'First line $n$. Second line $a_1..a_n$. Third line $b_1..b_n$.',
    output_format_md: 'Print $dp_n$.',
    constraints_text: '$2 \\le n \\le 10^5$',
    sample_io: [{ input: '4\n1 3 5 9\n4 3 2 1', output: '23' }],
  },
  'cf-1083a': {
    title: 'The Fair Nut and the Best Path',
    statement_md:
      'A tree with vertex fuel $w_v$ and edge costs. Maximize $w_u + w_v - dist(u,v)$ over pairs (path fuel net).',
    input_format_md: 'Tree of $n$ vertices with fuels and weighted edges.',
    output_format_md: 'Print the maximum value.',
    constraints_text: '$1 \\le n \\le 3\\cdot 10^5$',
    sample_io: [{ input: '3\n1 3 3\n1 2 2\n1 3 2', output: '3' }],
  },
  'cf-613c': {
    title: 'Necklace',
    statement_md: 'placeholder',
    input_format_md: 'x',
    output_format_md: 'x',
    constraints_text: 'x',
    sample_io: [],
  },
};

delete CF['cf-938d'];
delete CF['cf-6d'];
delete CF['cf-613c'];

const CSES: Array<[string, number, number, string[], string[], string[], string, string, string, string]> = [
  // id, task, rating, paradigms, algorithms, ds, insight, approach, editorial, complexity
  ['cses-building-roads', 1666, 1200, ['Graph Algorithms'], ['DFS', 'DSU'], ['Adjacency List'], 'Connected components; add edges between component reps', 'Components + DSU', 'Count components and connect them into a tree of cities.', 'O(N + M)'],
  ['cses-monsters', 1194, 1600, ['Graph Algorithms'], ['BFS'], ['Queue', '2D Array'], 'Multi-source BFS from monsters vs BFS from A to escape borders', 'Dual BFS', 'Escape to the boundary without meeting a monster earlier.', 'O(NM)'],
  ['cses-tree-matching', 1130, 1500, ['Graph Algorithms', 'Dynamic Programming'], ['DFS'], ['Adjacency List'], 'Tree DP: take/skip edge at each node for maximum matching', 'Tree DP matching', 'Maximum number of edges in a matching on a tree.', 'O(N)'],
  ['cses-distinct-colors', 1139, 1700, ['Graph Algorithms'], ['DFS', 'Sorting'], ['Hash Map', 'Ordered Set'], 'Small-to-large merging of color sets on the tree', 'DSU on tree', 'Count distinct colors in each subtree.', 'O(N log N)'],
  ['cses-necessary-roads', 2076, 1600, ['Graph Algorithms'], ['DFS'], ['Stack'], 'Bridge-finding (Tarjan) lists edges whose removal disconnects', 'Bridges', 'List all bridges of the undirected graph.', 'O(N + M)'],
  ['cses-necessary-cities', 2077, 1600, ['Graph Algorithms'], ['DFS'], ['Stack'], 'Articulation points via DFS lowlink values', 'Cut vertices', 'List all articulation points.', 'O(N + M)'],
  ['cses-new-roads-queries', 2101, 1800, ['Graph Algorithms'], ['DSU', 'Sorting', 'MST'], ['Priority Queue'], 'Offline Kruskal + LCT/persistent DSU for when two cities connect', 'Offline MST queries', 'Minimum max-edge on path equals MST bottleneck; answer with DSU time.', 'O((N+Q) log N)'],
  ['cses-network-breakdown', 1677, 1500, ['Graph Algorithms'], ['DSU'], ['Stack'], 'Process edge deletions backward, union components', 'Reverse DSU', 'After each removal print component count by reversing the updates.', 'O(M log N)'],
  ['cses-school-excursion', 1706, 1600, ['Graph Algorithms', 'Dynamic Programming'], ['DFS', 'BFS'], ['Bitmask / Bit DP' as unknown], 'Component sizes then knapsack DP for reachable team sizes', 'Knapsack on components', 'Which total sizes of groups are possible from connected components.', 'O(N²)'],
  ['cses-parcel-delivery', 2121, 1900, ['Flows / Matching', 'Graph Algorithms'], ['BFS', 'Dijkstra'], ['Priority Queue'], 'Min-cost max-flow of k units from 1 to n', 'MCMF', 'Send exactly k units of flow at minimum cost.', 'O(K · (N+M) log N)'],
  ['cses-task-assignment', 2129, 1900, ['Flows / Matching'], ['BFS'], ['2D Array'], 'Min-cost bipartite matching (assignment problem)', 'Assignment MCMF', 'Assign n jobs to n workers minimizing total cost.', 'O(N³)'],
  ['cses-intersection-points', 1740, 1800, ['Geometry'], ['Sorting', 'Segment Tree'], ['Fenwick Tree'], 'Sweep line; fenwick counts horizontal segments stabbed by verticals', 'Sweep + BIT', 'Count intersections among axis-aligned segments.', 'O(N log N)'],
  ['cses-area-of-rectangles', 1741, 1900, ['Geometry'], ['Segment Tree', 'Sorting'], ['Deque'], 'Sweep line with lazy segtree for union area of rectangles', 'Rectangle union', 'Compute area of union of axis-aligned rectangles.', 'O(N log N)'],
  ['cses-minimal-rotation', 1110, 1600, ['String Algorithms'], ['String Hashing'], ['Deque'], 'Booth’s algorithm / duval for least rotation', 'Least rotation', 'Find the lexicographically minimal rotation of s.', 'O(N)'],
  ['cses-palindrome-queries', 2420, 1800, ['String Algorithms'], ['String Hashing', 'Segment Tree'], ['Fenwick Tree'], 'Hash forward/backward with fenwick for point updates', 'Palindrome hashes', 'Support updates and queries asking if a substring is a palindrome.', 'O((N+Q) log N)'],
  ['cses-all-palindromes', 3138, 1800, ['String Algorithms'], ['String Hashing'], ['Deque'], 'Manacher reports for each center the palindrome radii', 'Manacher', 'For each index output the longest palindrome centered there.', 'O(N)'],
  ['cses-maximum-xor-subarray', 1655, 1600, ['Math / Number Theory'], [], ['Trie'], 'Binary trie of prefix xors for max a[l..r] xor', 'XOR trie', 'Maximum XOR of any subarray via prefix XOR trie.', 'O(N)',],
  ['cses-sos-bit-problem', 1654, 1800, ['Bitmask / Bit DP'], [], ['1D Array'], 'SOS DP over subsets/supersets of bitmasks', 'SOS DP', 'For each mask compute subset/superset population aggregates.', 'O(N · 2^N)'],
  ['cses-counting-bits', 1146, 1400, ['Math / Number Theory', 'Bitmask / Bit DP'], [], [], 'Count 1-bits from 1..n with digit-DP style bit contributions', 'Bit contributions', 'Closed form per bit position how many times it is set.', 'O(log N)'],
  ['cses-binomial-coefficients', 1079, 1400, ['Math / Number Theory'], ['Sieve'], [], 'Precompute factorials and inverse factorials mod prime', 'Factorial mod', 'Answer many C(a,b) modulo 1e9+7.', 'O(MAX + Q)'],
  ['cses-fibonacci-numbers', 1722, 1500, ['Math / Number Theory', 'Dynamic Programming'], [], ['2D Array'], 'Matrix exponentiation for F_n mod 1e9+7', 'Matrix pow', 'Compute the n-th Fibonacci number modulo 1e9+7.', 'O(log N)'],
  ['cses-throwing-dice', 1096, 1600, ['Dynamic Programming', 'Math / Number Theory'], [], ['2D Array'], 'Linear recurrence via matrix expo for dice sum ways', 'Matrix recurrence', 'Number of ways to get sum n with 6-sided dice.', 'O(log N)'],
  ['cses-nim-game-i', 1730, 1200, ['Math / Number Theory'], [], [], 'XOR of heap sizes; nonzero is first-player win', 'Nim xor', 'Standard Nim winner determination.', 'O(N)'],
  ['cses-nim-game-ii', 1098, 1300, ['Math / Number Theory'], [], [], 'Misère-like / xor with heap cap 1..m variant on CSES', 'Nim variant', 'Each heap limited; still XOR after mapping heap sizes.', 'O(N)'],
  ['cses-stair-game', 1099, 1500, ['Math / Number Theory'], [], [], 'Staircase Nim: xor coins on odd stairs', 'Staircase Nim', 'Only odd-indexed piles matter under XOR.', 'O(N)'],
  ['cses-prefix-sum-queries', 2166, 1700, ['Ad-Hoc'], ['Segment Tree'], ['Sparse Table'], 'Segtree storing prefix-sum max for range after updates', 'Prefix-max segtree', 'Support point updates and max prefix-sum queries on subarrays.', 'O((N+Q) log N)'],
  ['cses-pizzeria-queries', 2206, 1700, ['Ad-Hoc'], ['Segment Tree'], [], 'Maintain a_i+i and a_i-i in two segtrees for nearest pizzeria', 'Two segtrees', 'Query min a_j + |i-j| with point updates to a.', 'O((N+Q) log N)'],
  ['cses-subarray-sum-queries', 1190, 1800, ['Ad-Hoc'], ['Segment Tree'], [], 'Segtree node keeps total, pref, suf, best subarray sum', 'Subarray segtree', 'Point updates and global maximum subarray sum queries.', 'O((N+Q) log N)'],
  ['cses-maximum-building-i', 1147, 1700, ['Greedy'], [], ['Monotonic Stack', 'Stack', '2D Array'], 'Largest rectangle of empty cells via histogram per row', 'Histogram stack', 'Maximum area of an empty rectangle in a grid.', 'O(NM)'],
  ['cses-bit-inversions', 1188, 1800, ['Ad-Hoc'], ['Segment Tree'], ['Ordered Set'], 'Track runs of equal bits; updates flip and merge/split intervals', 'Run segtree', 'Maintain longest substring of equal bits under flips.', 'O(Q log N)'],
  ['cses-shortest-subsequence', 1087, 1500, ['Greedy', 'String Algorithms'], [], [], 'Greedy extend until all letters appear; restart', 'Missing letter greedy', 'Shortest string over AGCT not appearing as subsequence.', 'O(N)'],
  ['cses-multiplication-table', 2422, 1500, ['Binary Search on Answer', 'Math / Number Theory'], ['Binary Search'], [], 'Binary search value in n×n table; count ≤x with sum min(n,x/i)', 'Table k-th', 'Find the median (middle element) of the multiplication table.', 'O(N log A)'],
  ['cses-hamming-distance', 2136, 1500, ['Bitmask / Bit DP', 'Brute Force'], [], [], 'n≤5000 bitstrings; XOR and popcount for min Hamming distance', 'Popcount pairs', 'Minimum Hamming distance between any two strings.', 'O(N²)'],
  ['cses-reachable-nodes', 2138, 1700, ['Graph Algorithms', 'Bitmask / Bit DP'], ['DFS', 'Topological Sort'], [], 'Bitsets of reachable ancestors on a DAG / merge in topo order', 'Bitset reachability', 'For each node count reachable nodes in a digraph.', 'O(N²/64)'],
  ['cses-subarray-squares', 2086, 1900, ['Dynamic Programming', 'Divide & Conquer'], [], ['Deque'], 'D&C DP / CHT for splitting array into k subarrays minimizing sum of squares of sums', 'D&C optimization', 'Classic dp[k][j]=min i dp[k-1][i]+cost(i+1,j) with quadrangle.', 'O(KN log N)'],
  ['cses-monster-game-i', 2084, 1900, ['Dynamic Programming'], [], ['Deque'], 'CHT for dp with linear monster strengths', 'Convex hull trick', 'Kill monsters with skill growing; optimize linear transitions.', 'O(N)'],
  ['cses-monster-game-ii', 2085, 2000, ['Dynamic Programming'], [], ['Deque'], 'Li Chao / CHT when lines are not sorted', 'Li Chao CHT', 'Same game with harder line order requiring Li Chao tree.', 'O(N log N)'],
  ['cses-knuth-division', 2088, 1900, ['Dynamic Programming', 'Divide & Conquer'], [], [], 'Knuth optimization on interval DP for splitting arrays', 'Knuth DP', 'Minimize cost of repeated array splits with opt[i][j] monotone.', 'O(N²)'],
  ['cses-apples-and-bananas', 2111, 1800, ['Math / Number Theory'], [], [], 'FFT/NTT convolution of apple and banana count polynomials', 'NTT convolution', 'Count ways to buy a apples and b bananas with given multiplicities.', 'O(N log N)'],
  ['cses-cut-and-paste', 2072, 1800, ['Ad-Hoc'], [], ['Deque', 'Stack'], 'Implicit treap / rope cut substring and paste at position', 'Implicit treap', 'Support cut-and-paste operations on a string.', 'O(Q log N)'],
  ['cses-substring-reversals', 2073, 1800, ['Ad-Hoc'], [], ['Deque'], 'Implicit treap with reverse lazy tags', 'Treap reverse', 'Reverse substrings online and print the final string.', 'O(Q log N)'],
  ['cses-reversals-and-sums', 2074, 1900, ['Ad-Hoc'], ['Segment Tree'], ['Deque'], 'Treap storing subtree sums with reverse tags', 'Treap sums', 'Support range reverse and range sum queries.', 'O(Q log N)'],
  ['cses-dynamic-connectivity', 2133, 2000, ['Graph Algorithms'], ['DSU'], ['Stack'], 'Segment tree over time + rollback DSU for edge lifespan', 'Offline dynamic connectivity', 'Answer connected-component queries while edges appear/disappear.', 'O(Q log² N)'],
];

// Fix school excursion ds field - I mistakenly put a paradigm in ds
const SPECS: Spec[] = [
  ...CSES.map(([id, task, rating, paradigms, algorithms, data_structures, insight, approach, editorial, complexity]) => ({
    id,
    source: 'CSES' as const,
    url: `https://cses.fi/problemset/task/${task}`,
    difficulty_rating: rating,
    paradigms: paradigms.filter((p) => p !== 'Bitmask / Bit DP' || id.includes('sos') || id.includes('hamming') || id.includes('reachable') || id.includes('counting-bits')),
    algorithms: algorithms.filter((a) => a !== ('Bitmask / Bit DP' as string)),
    data_structures: data_structures.filter((d) => d !== ('Bitmask / Bit DP' as string)),
    key_insights: [insight],
    approach_name: approach,
    editorial_summary_md: editorial,
    target_complexity: complexity,
  })),
  // fix school excursion
].map((s) => {
  if (s.id === 'cses-school-excursion') {
    return {
      ...s,
      paradigms: ['Graph Algorithms', 'Dynamic Programming'],
      algorithms: ['DFS', 'BFS', 'Knapsack'],
      data_structures: ['1D Array', 'Queue'],
    };
  }
  if (s.id === 'cses-maximum-xor-subarray') {
    return { ...s, paradigms: ['Math / Number Theory'], algorithms: [], data_structures: ['Trie'] };
  }
  return s;
});

// CF offline specs
const CF_SPECS: Spec[] = [
  {
    id: 'cf-449b',
    source: 'Codeforces',
    url: cfUrl('cf-449b'),
    difficulty_rating: 1900,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    data_structures: ['Priority Queue'],
    key_insights: ['Dijkstra; a train is redundant if dist[s] < y or another equal path exists without it'],
    approach_name: 'Dijkstra trains',
    editorial_summary_md: 'Compute distances allowing trains; count trains not needed for uniqueness of shortest paths.',
    target_complexity: 'O(M log N)',
    offline: CF['cf-449b'],
  },
  {
    id: 'cf-1486c2',
    source: 'Codeforces',
    url: cfUrl('cf-1486c2'),
    difficulty_rating: 1800,
    paradigms: ['Interactive', 'Binary Search on Answer'],
    algorithms: ['Binary Search'],
    key_insights: ['Query second-max to binary search which side holds the maximum'],
    approach_name: 'Interactive binary search',
    editorial_summary_md: 'Locate the second maximum first, then binary search the segment containing the max.',
    target_complexity: 'O(log N)',
    offline: CF['cf-1486c2'],
  },
  {
    id: 'cf-727a',
    source: 'Codeforces',
    url: cfUrl('cf-727a'),
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory', 'Brute Force'],
    algorithms: ['BFS'],
    data_structures: ['Queue', 'Hash Map'],
    key_insights: ['Work backwards from b: if even /2, if ends with 1 /10'],
    approach_name: 'Reverse BFS',
    editorial_summary_md: 'Invert operations from b down to a and reverse the path.',
    target_complexity: 'O(log B)',
    offline: CF['cf-727a'],
  },
  {
    id: 'cf-1005d',
    source: 'Codeforces',
    url: cfUrl('cf-1005d'),
    difficulty_rating: 1400,
    paradigms: ['Greedy', 'Math / Number Theory'],
    algorithms: ['Prefix Sums'],
    key_insights: ['Running digit sum mod 3; cut whenever residue hits 0 or repeats'],
    approach_name: 'Mod-3 greedy',
    editorial_summary_md: 'Greedily end a piece when the current segment sum is 0 mod 3.',
    target_complexity: 'O(N)',
    offline: CF['cf-1005d'],
  },
  {
    id: 'cf-1288c',
    source: 'Codeforces',
    url: cfUrl('cf-1288c'),
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming', 'Math / Number Theory'],
    algorithms: ['Prefix Sums'],
    key_insights: ['Combinatorial: choose with repetition = C(n+2m-1, 2m) style after transforming'],
    approach_name: 'Combinatorics DP',
    editorial_summary_md: 'Map monotone pairs to unrestricted combinations modulo prime.',
    target_complexity: 'O(N · M)',
    offline: CF['cf-1288c'],
  },
  {
    id: 'cf-486e',
    source: 'Codeforces',
    url: cfUrl('cf-486e'),
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Binary Search', 'Segment Tree'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Forward/backward LIS lengths; compare to global LIS for classification'],
    approach_name: 'LIS classify',
    editorial_summary_md: 'Compute lis_left and lis_right; mark positions based on uniqueness of role.',
    target_complexity: 'O(N log N)',
    offline: CF['cf-486e'],
  },
  {
    id: 'cf-1000e',
    source: 'Codeforces',
    url: cfUrl('cf-1000e'),
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'BFS'],
    data_structures: ['Stack', 'Queue'],
    key_insights: ['Compress 2-edge-CC into a tree; diameter equals max bridges on a path'],
    approach_name: 'Bridge tree diameter',
    editorial_summary_md: 'Build the bridge-block tree and find its diameter.',
    target_complexity: 'O(N + M)',
    offline: CF['cf-1000e'],
  },
  {
    id: 'cf-319c',
    source: 'Codeforces',
    url: cfUrl('cf-319c'),
    difficulty_rating: 2100,
    paradigms: ['Dynamic Programming', 'Divide & Conquer'],
    data_structures: ['Deque'],
    key_insights: ['Convex hull trick on lines y = b_j x + dp_j'],
    approach_name: 'CHT',
    editorial_summary_md: 'Maintain lower hull of lines for the logging DP.',
    target_complexity: 'O(N)',
    offline: CF['cf-319c'],
  },
  {
    id: 'cf-1083a',
    source: 'Codeforces',
    url: cfUrl('cf-1083a'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['DFS'],
    key_insights: ['Tree DP keeping best two child downward paths'],
    approach_name: 'Tree path DP',
    editorial_summary_md: 'For each node combine best downward fuel paths minus edge costs.',
    target_complexity: 'O(N)',
    offline: CF['cf-1083a'],
  },
  {
    id: 'cf-1070c',
    source: 'Codeforces',
    url: cfUrl('cf-1070c'),
    difficulty_rating: 2200,
    paradigms: ['Greedy', 'Binary Search on Answer'],
    algorithms: ['Segment Tree', 'Sorting'],
    data_structures: ['Priority Queue', 'Fenwick Tree'],
    key_insights: ['Sweep days with a segtree of offers sorted by price'],
    approach_name: 'Sweep + segtree',
    editorial_summary_md: 'Process offers by day coverage; always take cheapest available cores.',
    target_complexity: 'O((N+M) log N)',
    offline: CF['cf-1070c'],
  },
];

const ALL_SPECS: Spec[] = [...SPECS, ...CF_SPECS];

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
  if (/2\^N|N²\/64/i.test(raw)) return 'O(2^N)';
  if (/N³/i.test(raw)) return 'O(N³)';
  if (/log²|N²/i.test(raw)) return 'O(N²)';
  if (/N \+ M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  if (/O\(1\)|O\(log N\)/i.test(raw)) return raw.includes('log') ? 'O(log N)' : 'O(1)';
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
  const todo = ALL_SPECS.filter((s) => !have.has(s.id));
  console.log(`Batch5: ${todo.length}/${ALL_SPECS.length} to add`);

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
  console.log(`Added ${added}, failed ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
