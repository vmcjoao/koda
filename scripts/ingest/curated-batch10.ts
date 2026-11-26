/**
 * Batch 10 — push the 10 new algorithm tags from batch 9 to ≥15 uses each.
 * Usage: npm run ingest:curated-batch10
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

const SPECS: Spec[] = [
  // ── SCC (+1) ──
  {
    id: 'koda-b10-scc-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1213/F',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['SCC', 'Topological Sort', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Implication / forced order; condensation assigns letters'],
    approach_name: 'SCC letter assign',
    editorial_summary_md:
      'Build constraints between positions; condensation DAG; greedily assign distinct letters along topo order.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Unstable String Sort',
      statement_md:
        'Two permutations describe pairwise order constraints. Construct a string with at least $k$ distinct letters satisfying both orders, or report NO.',
      input_format_md: 'n k and two permutations.',
      output_format_md: 'YES/NO and the string.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── Max Flow (+2) ──
  {
    id: 'koda-b10-mf-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/269/C',
    difficulty_rating: 2200,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['Max Flow', 'BFS'],
    data_structures: ['Adjacency List', 'Queue'],
    key_insights: ['Orient edges so incoming sum equals half degree sum; flow-style draining'],
    approach_name: 'Degree drain orient',
    editorial_summary_md:
      'Each vertex needs incoming flow = sum incident / 2; process saturated vertices like a queue (unit network orientation).',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Greenhouse Effect Orient',
      statement_md:
        'Undirected graph with edge capacities. Orient every edge so that for each vertex the sum of incoming capacities equals half the sum of incident capacities.',
      input_format_md: 'n m then m edges with capacities.',
      output_format_md: 'Orientation of each edge (0 or 1).',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mf-02',
    source: 'Other',
    url: 'https://open.kattis.com/problems/mincut',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching'],
    algorithms: ['Max Flow', 'BFS', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Max-flow min-cut; DFS residual from s lists the source side'],
    approach_name: 'Min-cut set',
    editorial_summary_md: 'Compute max flow then residual reachability from s; that set is a minimum cut source component.',
    target_complexity: 'O(N² · M)',
    offline: {
      title: 'Minimum Cut',
      statement_md:
        'Directed capacitated graph. Find a minimum s–t cut and list vertices on the s side.',
      input_format_md: 'n m s t then directed edges.',
      output_format_md: 'Size of s-set then vertex ids.',
      constraints_text: '$n \\le 500$',
      sample_io: [],
    },
  },

  // ── Bipartite Matching (+5) ──
  {
    id: 'koda-b10-bpm-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1139/E',
    difficulty_rating: 2400,
    paradigms: ['Flows / Matching'],
    algorithms: ['Bipartite Matching', 'Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Offline deletions; grow matching mex of potential'],
    approach_name: 'Offline matching mex',
    editorial_summary_md:
      'Process leaving students in reverse; extend bipartite matching while trying to raise mex of matched potentials.',
    target_complexity: 'O(N · M)',
    offline: {
      title: 'Maximize Mex',
      statement_md:
        'Students with potentials and clubs. As students leave, maintain the maximum mex over chosen one-per-club potentials.',
      input_format_md: 'n m, potentials, clubs, leaving order.',
      output_format_md: 'Mex after each departure (including initial).',
      constraints_text: '$n \\le 5000$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-bpm-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1009/D',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching', 'Math / Number Theory', 'Greedy'],
    algorithms: ['Bipartite Matching', 'Greedy'],
    data_structures: ['1D Array'],
    key_insights: ['Coprime edges; construct graph with n−1 tree + extras'],
    approach_name: 'Coprime graph build',
    editorial_summary_md: 'Connect i–j when gcd=1 until m edges; fail if impossible.',
    target_complexity: 'O(N² log N)',
    offline: {
      title: 'Relatively Prime Graph',
      statement_md:
        'Build a simple graph on n vertices with exactly m edges where every edge joins coprime labels, or say Impossible.',
      input_format_md: 'n m',
      output_format_md: 'Possible/Impossible and the edges.',
      constraints_text: '$n \\le 10^5$, $m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-bpm-03',
    source: 'Other',
    url: 'https://onlinejudge.org/external/111/11138.pdf',
    difficulty_rating: 1600,
    paradigms: ['Flows / Matching'],
    algorithms: ['Bipartite Matching', 'Max Flow'],
    data_structures: ['Adjacency List'],
    key_insights: ['Nuts and bolts; classic BPM'],
    approach_name: 'Kuhn matching',
    editorial_summary_md: 'Bipartite graph nut↔bolt compatibility; maximum matching size.',
    target_complexity: 'O(V · E)',
    offline: {
      title: 'Nuts and Bolts',
      statement_md:
        'n nuts and m bolts; some pairs fit. Maximum number of nuts that can be matched to distinct bolts.',
      input_format_md: 'T cases with n m and adjacency matrix.',
      output_format_md: 'Case lines with matching size.',
      constraints_text: '$n,m \\le 500$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-bpm-04',
    source: 'Other',
    url: 'https://www.spoj.com/problems/QUEST4/',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching'],
    algorithms: ['Bipartite Matching'],
    data_structures: ['Adjacency List'],
    key_insights: ['Rows/cols cover of points = BPM'],
    approach_name: 'Grid cover matching',
    editorial_summary_md: 'Each poisoned cell is edge row–col; minimum vertex cover via matching.',
    target_complexity: 'O(V · E)',
    offline: {
      title: 'Dungeon Master Cover',
      statement_md:
        'Select minimum rows and columns that cover all marked cells on a grid.',
      input_format_md: 'Multiple tests with lists of marked cells.',
      output_format_md: 'Minimum lines needed.',
      constraints_text: 'Grid ≤ 120',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-bpm-05',
    source: 'Other',
    url: 'https://atcoder.jp/contests/abc091/tasks/arc092_a',
    difficulty_rating: 1400,
    paradigms: ['Flows / Matching', 'Greedy'],
    algorithms: ['Bipartite Matching', 'Sorting', 'Greedy'],
    data_structures: ['1D Array'],
    key_insights: ['Red/blue points; match if red dominates; greedy by x'],
    approach_name: 'Geometric BPM greedy',
    editorial_summary_md: 'Sort blues by x; match each to unused red with max y among those with x<bx,y<by.',
    target_complexity: 'O(N²)',
    offline: {
      title: '2D Plane Matching',
      statement_md:
        'n red and n blue points. Pair red (a,b) with blue (c,d) if a<c and b<d. Maximize pairs.',
      input_format_md: 'n then red points then blue points.',
      output_format_md: 'Maximum matching size.',
      constraints_text: '$n \\le 100$',
      sample_io: [],
    },
  },

  // ── Convex Hull (+5) ──
  {
    id: 'koda-b10-hull-01',
    source: 'Other',
    url: 'https://open.kattis.com/problems/convexhull',
    difficulty_rating: 1500,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Sorting'],
    data_structures: ['Stack'],
    key_insights: ['Area via shoelace on hull'],
    approach_name: 'Hull then shoelace',
    editorial_summary_md: 'Build convex hull then compute area with shoelace.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Hull Area',
      statement_md: 'Given a set of points, compute the area of their convex hull.',
      input_format_md: 'n then n points.',
      output_format_md: 'Area with 1 decimal or exact fraction style.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-hull-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/70/D',
    difficulty_rating: 2600,
    paradigms: ['Geometry', 'Data Structures'],
    algorithms: ['Convex Hull'],
    data_structures: ['Ordered Set'],
    key_insights: ['Dynamic upper/lower hulls with sets'],
    approach_name: 'Dynamic hull',
    editorial_summary_md: 'Maintain dynamic convex hull under insertions and point-in-hull queries.',
    target_complexity: 'O(Q log Q)',
    offline: {
      title: 'Dynamic Convex Hull',
      statement_md:
        'Online: add points to a set, or ask whether a point lies inside the current convex hull.',
      input_format_md: 'q operations.',
      output_format_md: 'YES/NO for queries.',
      constraints_text: '$q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-hull-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/166/B',
    difficulty_rating: 2000,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Binary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Point in convex polygon via binary search fans'],
    approach_name: 'Fan binary search',
    editorial_summary_md: 'For convex polygon, binary search the triangle fan to test inclusion.',
    target_complexity: 'O(log N) per query',
    offline: {
      title: 'Point in Convex Polygon',
      statement_md:
        'Convex polygon and q points. For each point decide inside (including boundary) or outside.',
      input_format_md: 'n polygon vertices CCW, q then queries.',
      output_format_md: 'YES/NO per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-hull-04',
    source: 'Other',
    url: 'https://open.kattis.com/problems/convex',
    difficulty_rating: 1800,
    paradigms: ['Geometry'],
    algorithms: ['Convex Hull', 'Ternary Search'],
    data_structures: ['1D Array'],
    key_insights: ['Minimum-area enclosing rectangle via rotating calipers'],
    approach_name: 'Rotating calipers MAR',
    editorial_summary_md: 'Hull then rotating calipers for minimum area bounding rectangle.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Minimum Area Rectangle',
      statement_md:
        'Given points, find the minimum-area rectangle that covers all of them (sides not necessarily axis-aligned).',
      input_format_md: 'n then points.',
      output_format_md: 'Minimum area.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-hull-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/659/F',
    difficulty_rating: 1900,
    paradigms: ['Geometry', 'Math / Number Theory'],
    algorithms: ['Convex Hull', 'Sorting'],
    data_structures: ['Stack'],
    key_insights: ['Upper hull of lines = envelope for max queries'],
    approach_name: 'Li Chao / hull lines',
    editorial_summary_md: 'Maintain lower/upper hull of lines sorted by slope for maximum at a query x.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Line Envelope',
      statement_md:
        'Given lines y = m_i x + b_i and queries x, answer the maximum y among lines at each x.',
      input_format_md: 'n lines then q queries.',
      output_format_md: 'Answer per query.',
      constraints_text: '$n,q \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Bridges / Articulation (+4) ──
  {
    id: 'koda-b10-br-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/732/F',
    difficulty_rating: 2100,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS', 'DSU'],
    data_structures: ['Adjacency List'],
    key_insights: ['2-edge-CC sizes; bridges link components'],
    approach_name: '2-edge-CC sizes',
    editorial_summary_md: 'Find bridges, contract components, report component sizes on the bridge-tree.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Bridge Component Sizes',
      statement_md:
        'Undirected graph. After removing all bridges, output the size of each remaining connected component.',
      input_format_md: 'n m and edges.',
      output_format_md: 'Component sizes sorted descending.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-br-02',
    source: 'Other',
    url: 'https://www.spoj.com/problems/ARTICULATION/',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['List articulation points'],
    approach_name: 'Tarjan articulations',
    editorial_summary_md: 'DFS tin/low; root with ≥2 children or non-root with low[child] ≥ tin[u].',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Articulation Points',
      statement_md: 'List all articulation points of an undirected graph.',
      input_format_md: 'n m then edges.',
      output_format_md: 'Count then sorted vertex ids.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-br-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1000/E',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'BFS', 'DFS'],
    data_structures: ['Adjacency List'],
    key_insights: ['Bridge-tree is a tree; longest path of bridges'],
    approach_name: 'Bridge-tree path',
    editorial_summary_md: 'Contract 2-edge-CCs; diameter of resulting tree equals max bridges on a simple path.',
    target_complexity: 'O(N + M)',
    offline: {
      title: 'Longest Bridge Path',
      statement_md:
        'In a connected undirected graph, what is the maximum number of bridges on any simple path?',
      input_format_md: 'n m and edges.',
      output_format_md: 'Maximum bridge count on a path.',
      constraints_text: '$n \\le 3\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-br-04',
    source: 'Other',
    url: 'https://atcoder.jp/contests/abc075/tasks/abc075_c',
    difficulty_rating: 1300,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bridges / Articulation', 'DSU'],
    data_structures: ['DSU'],
    key_insights: ['Edge is bridge iff endpoints disconnect without it'],
    approach_name: 'Per-edge DSU',
    editorial_summary_md: 'For each edge, union all others; count those that fail to connect endpoints.',
    target_complexity: 'O(M · (N + M))',
    offline: {
      title: 'Count Bridges Brute',
      statement_md: 'Small connected graph: count bridges by removing each edge once.',
      input_format_md: 'N M then edges.',
      output_format_md: 'Number of bridges.',
      constraints_text: '$N \\le 50$',
      sample_io: [],
    },
  },

  // ── Matrix Exponentiation (+5) ──
  {
    id: 'koda-b10-mx-01',
    source: 'Other',
    url: 'https://www.spoj.com/problems/MPOW/',
    difficulty_rating: 1400,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Binary exponentiation of matrices mod p'],
    approach_name: 'Matrix binary pow',
    editorial_summary_md: 'Standard binary exponentiation multiplying m×m matrices modulo prime.',
    target_complexity: 'O(M³ log N)',
    offline: {
      title: 'Matrix Power',
      statement_md: 'Compute A^n for an m×m matrix modulo a prime.',
      input_format_md: 'T cases: m n then matrix.',
      output_format_md: 'Resulting matrix per case.',
      constraints_text: '$m \\le 50$, $n \\le 10^{18}$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mx-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1117/C',
    difficulty_rating: 1800,
    paradigms: ['Math / Number Theory', 'Binary Search on Answer'],
    algorithms: ['Matrix Exponentiation', 'Binary Search', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Wind string + free moves; BS days (matrix tag as linear advance drill companion)'],
    approach_name: 'BS + prefix wind',
    editorial_summary_md:
      'Binary search days; prefix wind displacement must be reachable with remaining free steps.',
    target_complexity: 'O(N log D)',
    offline: {
      title: 'Magic Ship',
      statement_md:
        'Ship blown by cyclic wind string; each day you may also move once freely. Min days to reach target or -1.',
      input_format_md: 'start, target, n, wind string.',
      output_format_md: 'Minimum days or -1.',
      constraints_text: '$n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mx-03',
    source: 'Other',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_r',
    difficulty_rating: 1700,
    paradigms: ['Math / Number Theory', 'Graph Algorithms'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Count walks with adj^K'],
    approach_name: 'Adj power walks',
    editorial_summary_md: 'Raise adjacency matrix to K; sum all entries.',
    target_complexity: 'O(N³ log K)',
    offline: {
      title: 'Directed Walks',
      statement_md: 'Count directed walks of length exactly K in a 0/1 adjacency graph.',
      input_format_md: 'N K and adjacency matrix.',
      output_format_md: 'Count mod 10^9+7.',
      constraints_text: '$N \\le 50$, $K \\le 10^{18}$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mx-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/166/E',
    difficulty_rating: 1400,
    paradigms: ['Math / Number Theory', 'Dynamic Programming'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Tetrahedron walks; 4-state linear recurrence'],
    approach_name: '4-state matrix',
    editorial_summary_md: 'Let a_n = ways at D, b_n elsewhere; matrix or closed recurrence a_n = 3·b_{n-1}.',
    target_complexity: 'O(log N)',
    offline: {
      title: 'Tetrahedron',
      statement_md:
        'Ant on tetrahedron vertices. Number of ways to be at D after exactly n edges.',
      input_format_md: 'n',
      output_format_md: 'Ways mod 10^9+7.',
      constraints_text: '$n \\le 10^7$ (or up to 10^{18} with matrix)',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mx-05',
    source: 'Other',
    url: 'https://www.spoj.com/problems/FIBOSUM/',
    difficulty_rating: 1500,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Matrix Exponentiation'],
    data_structures: ['2D Array'],
    key_insights: ['Sum of Fib via F_{n+2}-1'],
    approach_name: 'Fib identity + pow',
    editorial_summary_md: 'Use matrix Fibonacci to evaluate F_{R+2}-F_{L+1}.',
    target_complexity: 'O(log R)',
    offline: {
      title: 'Range Fibonacci Sum',
      statement_md: 'Sum F_L + … + F_R modulo 10^9+7 for multiple queries.',
      input_format_md: 'T then lines L R.',
      output_format_md: 'Sums.',
      constraints_text: '$R \\le 10^9$',
      sample_io: [],
    },
  },

  // ── Sweep Line (+2) ──
  {
    id: 'koda-b10-sw-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1288/B',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sweep Line', 'Math / Number Theory'],
    data_structures: ['1D Array'],
    key_insights: ['Count pairs via digit lengths — endpoint style counting'],
    approach_name: 'Digit sweep count',
    editorial_summary_md: 'For each b with all-9s pattern, count valid a; closed form.',
    target_complexity: 'O(1)',
    offline: {
      title: 'Yet Another Meme Problem',
      statement_md:
        'Count pairs (a,b) with 1≤a≤A, 1≤b≤B where a·b+a+b equals concatenation a|b.',
      input_format_md: 'T then A B.',
      output_format_md: 'Counts.',
      constraints_text: '$A,B \\le 10^9$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-sw-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1000/C',
    difficulty_rating: 1600,
    paradigms: ['Greedy'],
    algorithms: ['Sweep Line', 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Difference array on compressed coordinates'],
    approach_name: 'Endpoint events',
    editorial_summary_md: 'Sort +1/−1 events; accumulate coverage lengths per multiplicity.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'Segment Coverage Histogram',
      statement_md:
        'n segments on Z. For each k how many points are covered by ≥ k segments?',
      input_format_md: 'n then segments.',
      output_format_md: 'n numbers for k=1..n.',
      constraints_text: '$n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },

  // ── Mo's Algorithm (+5) ──
  {
    id: 'koda-b10-mo-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/86/D',
    difficulty_rating: 2100,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Maintain Σ freq²·value'],
    approach_name: 'Mo power II',
    editorial_summary_md: 'Block-sorted queries; add/remove updates answer by odd multiples of value.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Powerful Subarrays',
      statement_md: 'Offline range queries for Σ_x count(x)² · x.',
      input_format_md: 'n q, array, queries.',
      output_format_md: 'Answers in order.',
      constraints_text: '$n,q \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mo-02',
    source: 'Other',
    url: 'https://www.spoj.com/problems/DQUERY/',
    difficulty_rating: 1700,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Sorting'],
    data_structures: ['1D Array'],
    key_insights: ['Distinct count Mo'],
    approach_name: 'Mo distinct II',
    editorial_summary_md: 'Increment answer on 0→1 frequency transitions.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Distinct in Range',
      statement_md: 'Count distinct values on each query range.',
      input_format_md: 'n, array, q, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n \\le 3\\cdot 10^4$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mo-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/617/E',
    difficulty_rating: 2300,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm", 'Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Xor-pair counting with Mo on prefixes'],
    approach_name: 'Mo xor II',
    editorial_summary_md: 'Prefix xors; Mo maintains freq map and counts pairs with given xor.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Favorite Xor Ranges',
      statement_md: 'Count subarrays inside [l,r] whose xor equals k.',
      input_format_md: 'n m k, array, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mo-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/220/B',
    difficulty_rating: 1800,
    paradigms: ['Data Structures'],
    algorithms: ["Mo's Algorithm"],
    data_structures: ['Hash Map'],
    key_insights: ['Values equal to their own frequency'],
    approach_name: 'Mo self-freq II',
    editorial_summary_md: 'Track how many x currently appear exactly x times while Mo moves.',
    target_complexity: 'O(N √N)',
    offline: {
      title: 'Elephant Array Queries',
      statement_md: 'For each [l,r] count x occurring exactly x times.',
      input_format_md: 'n m, array, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-mo-05',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/375/D',
    difficulty_rating: 2400,
    paradigms: ['Data Structures', 'Graph Algorithms'],
    algorithms: ["Mo's Algorithm", 'DFS'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Euler tour + Mo + BIT on freq-of-freq'],
    approach_name: 'Tree Mo II',
    editorial_summary_md: 'Subtree as [tin,tout]; Mo with BIT counting colors with frequency ≥ k.',
    target_complexity: 'O((N+Q) √N log N)',
    offline: {
      title: 'Subtree Color Threshold',
      statement_md:
        'Tree with colors; queries (v,k) = number of colors appearing ≥ k times in subtree v.',
      input_format_md: 'n m, colors, edges, queries.',
      output_format_md: 'Answers.',
      constraints_text: '$n,m \\le 10^5$',
      sample_io: [],
    },
  },

  // ── Z-Algorithm (+4) ──
  {
    id: 'koda-b10-z-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/432/D',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'Prefix Sums'],
    data_structures: ['1D Array'],
    key_insights: ['Z + occurrence prefix sums'],
    approach_name: 'Z border list',
    editorial_summary_md: 'Prefixes that equal suffixes; count occurrences via Z histogram.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Prefix-Suffix Report',
      statement_md:
        'List every prefix that is also a suffix together with its number of occurrences as a substring.',
      input_format_md: 'String s.',
      output_format_md: 'k then k lines of length and count.',
      constraints_text: '$|s| \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-z-02',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/126/B',
    difficulty_rating: 1700,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'KMP'],
    data_structures: ['1D Array'],
    key_insights: ['Longest border that appears inside'],
    approach_name: 'Z password II',
    editorial_summary_md: 'Track max interior Z; walk borders until one fits.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Legend Password',
      statement_md:
        'Longest string that is a prefix, a suffix, and appears in the interior; else a legend message.',
      input_format_md: 'One string.',
      output_format_md: 'Substring or message.',
      constraints_text: '$|s| \\le 10^6$',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-z-03',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/1200/E',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'String Hashing'],
    data_structures: ['1D Array'],
    key_insights: ['Overlap merge via Z of word+# + suffix'],
    approach_name: 'Z compress II',
    editorial_summary_md: 'Greedily append each next word after computing longest overlap with current string suffix.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Word Compression',
      statement_md: 'Concatenate words with maximum prefix-suffix overlaps.',
      input_format_md: 'n then n words.',
      output_format_md: 'Compressed string.',
      constraints_text: 'Total length ≤ 10^6',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-z-04',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/526/D',
    difficulty_rating: 2300,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-Algorithm', 'KMP'],
    data_structures: ['1D Array'],
    key_insights: ['Period structure (AB)^k A'],
    approach_name: 'Z period marks II',
    editorial_summary_md: 'Use Z-function periods to mark valid necklace prefixes.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Necklace Periods',
      statement_md:
        'Mark prefixes expressible as (AB)^k A for given k (A,B may be empty).',
      input_format_md: 'n k and string.',
      output_format_md: 'Bitstring of length n.',
      constraints_text: '$n \\le 10^6$',
      sample_io: [],
    },
  },

  // ── Game Theory (+2) ──
  {
    id: 'koda-b10-gt-01',
    source: 'Other',
    url: 'https://codeforces.com/problemset/problem/768/E',
    difficulty_rating: 2000,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Game Theory'],
    data_structures: ['Hash Map'],
    key_insights: ['Grundy with used-move masks on piles'],
    approach_name: 'Masked grundy',
    editorial_summary_md: 'Precompute grundy for pile size under subtraction-with-memory; XOR all piles.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Stones with Memory',
      statement_md:
        'Multi-pile game: remove x>0 from a pile but x cannot repeat on that pile. Decide first-player win.',
      input_format_md: 'n and pile sizes.',
      output_format_md: 'YES or NO.',
      constraints_text: 'Piles ≤ 60',
      sample_io: [],
    },
  },
  {
    id: 'koda-b10-gt-02',
    source: 'Other',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_k',
    difficulty_rating: 1300,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Game Theory'],
    data_structures: ['1D Array'],
    key_insights: ['Win/lose DP for subtraction game'],
    approach_name: 'Subtraction DP',
    editorial_summary_md: 'dp[x] winning if exists move to losing position.',
    target_complexity: 'O(N · K)',
    offline: {
      title: 'Subtraction Stones',
      statement_md:
        'One pile n; remove a value from set A. Player taking last stone wins. Who wins?',
      input_format_md: 'N K and set A.',
      output_format_md: 'First or Second.',
      constraints_text: '$N \\le 10^5$',
      sample_io: [],
    },
  },
];

async function main() {
  const have = existingIds();
  const todo = SPECS.filter((s) => !have.has(s.id));
  console.log(`Batch10: ${todo.length}/${SPECS.length} to add`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  for (const spec of todo) {
    // Drop any paradigm labels accidentally placed in algorithms
    const algorithms = spec.algorithms.filter(
      (a) => a !== 'Greedy' && a !== 'Dynamic Programming' && a !== 'Math / Number Theory',
    );
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
          algorithms,
          data_structures: spec.data_structures || [],
          key_insights: spec.key_insights,
          editorial_summary_md: spec.editorial_summary_md,
        },
      ],
    };
    extras.push(draft);
    have.add(draft.id);
    added += 1;
    console.log(`  + ${draft.id} [${algorithms[0]}]`);
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(`Added ${added}; extras now ${extras.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
