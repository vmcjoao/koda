/**
 * Gap-fill batch: algorithms/paradigms/DS with 0 or very few catalog hits.
 * Tags use exact TAG_CATALOG labels.
 *
 * Usage: npm run ingest:curated-batch3
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
  source: 'CSES' | 'AtCoder' | 'Codeforces';
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

const CF: Record<string, Offline> = {
  'cf-230b': {
    title: 'T-primes',
    statement_md:
      'A T-prime is a number with exactly three positive divisors. Given $n$ integers, decide for each whether it is a T-prime.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nThe second line contains $n$ integers $x_i$ ($1 \\le x_i \\le 10^{12}$).',
    output_format_md: 'Print `YES` or `NO` for each number on its own line.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le x_i \\le 10^{12}$',
    sample_io: [{ input: '3\n4 5 6', output: 'YES\nNO\nNO' }],
  },
  'cf-26a': {
    title: 'Almost Prime',
    statement_md:
      'A number is almost prime if it has exactly two distinct prime factors. Count almost primes in $[1,n]$.',
    input_format_md: 'A single integer $n$ ($1 \\le n \\le 3000$).',
    output_format_md: 'Print the count of almost primes ≤ $n$.',
    constraints_text: '$1 \\le n \\le 3000$',
    sample_io: [{ input: '10', output: '2' }],
  },
  'cf-25c': {
    title: 'Roads in Berland',
    statement_md:
      'Berland has $n$ cities with a matrix of shortest-path lengths. After each of $k$ new roads, recompute the sum of pairwise shortest distances over all unordered pairs.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 300$).\n\nThen an $n \\times n$ matrix of distances.\n\nThen $k$ ($1 \\le k \\le 300$) and $k$ roads $a\\ b\\ c$.',
    output_format_md: 'After each new road print the sum of all pairwise shortest distances.',
    constraints_text: '$1 \\le n,k \\le 300$',
    sample_io: [
      {
        input: '3\n0 4 5\n4 0 3\n5 3 0\n1\n1 3 1',
        output: '7',
      },
    ],
  },
  'cf-439d': {
    title: 'Devu and his Brother',
    statement_md:
      'Devu has array $a$ and his brother array $b$. In one move increase any $a_i$ by 1 or decrease any $b_j$ by 1. Minimize moves so $\\min a \\ge \\max b$.',
    input_format_md:
      'The first line contains $n$ and $m$ ($1 \\le n,m \\le 10^5$).\n\nThe second line contains $a_1\\dots a_n$.\n\nThe third line contains $b_1\\dots b_m$ ($1 \\le a_i,b_j \\le 10^9$).',
    output_format_md: 'Print the minimum number of moves.',
    constraints_text: '$1 \\le n,m \\le 10^5$',
    sample_io: [{ input: '2 2\n2 3\n3 5', output: '3' }],
  },
  'cf-578c': {
    title: 'Weakness and Poorness',
    statement_md:
      'Given an array $a_1\\dots a_n$, choose a real $x$ and consider $b_i=a_i-x$. The weakness is the maximum absolute subarray sum of $b$. Minimize the weakness over $x$.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $a_i$ ($|a_i| \\le 10^4$).',
    output_format_md: 'Print the minimum possible weakness with absolute/relative error $10^{-6}$.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3\n1 2 3', output: '1.000000000000000' }],
  },
  'cf-547b': {
    title: 'Mike and Feet',
    statement_md:
      'Given an array of $n$ bear strengths, for every group size $k=1..n$ find the maximum of the minimums over all contiguous groups of size $k$.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$).',
    output_format_md: 'Print $n$ integers — answers for $k=1..n$.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '10\n1 2 3 4 5 4 3 2 1 6', output: '6 4 4 3 3 2 2 1 1 1' }],
  },
  'cf-1313c2': {
    title: 'Skyscrapers (hard version)',
    statement_md:
      'You must build $n$ skyscrapers with heights $h_i \\le m_i$ that are first non-decreasing then non-increasing (unimodal). Maximize $\\sum h_i$.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 5\\cdot 10^5$).\n\nThe second line contains $m_1\\dots m_n$ ($1 \\le m_i \\le 10^9$).',
    output_format_md: 'Print $n$ heights of an optimal skyline.',
    constraints_text: '$1 \\le n \\le 5\\cdot 10^5$',
    sample_io: [{ input: '5\n1 2 3 2 1', output: '1 2 3 2 1' }],
  },
  'cf-514c': {
    title: 'Watto and Mechanism',
    statement_md:
      'You are given $n$ memory strings and $m$ queries. A query string matches if it differs in exactly one character from some memory string. Answer YES/NO for each query.',
    input_format_md:
      'The first line contains $n$ and $m$ ($1 \\le n,m \\le 3\\cdot 10^5$).\n\nThen $n$ memory strings and $m$ query strings over `abc` (total length $\\le 6\\cdot 10^5$).',
    output_format_md: 'Print `YES` or `NO` for each query.',
    constraints_text: 'Total length $\\le 6\\cdot 10^5$',
    sample_io: [{ input: '2 3\naaaaa\nacacaca\naaaaab\nacacaca\nbbb', output: 'YES\nYES\nNO' }],
  },
  'cf-835d': {
    title: 'Palindromic characteristics',
    statement_md:
      'A string is a $1$-palindrome if it is a palindrome. It is a $k$-palindrome ($k>1$) if it is a palindrome and its left half is a $(k-1)$-palindrome. Count how many substrings are $k$-palindromes for each $k$.',
    input_format_md: 'A single string $s$ ($1 \\le |s| \\le 5000$) of lowercase letters.',
    output_format_md: 'Print $|s|$ integers — counts for $k=1..|s|$.',
    constraints_text: '$1 \\le |s| \\le 5000$',
    sample_io: [{ input: 'aaa', output: '6 3 1' }],
  },
  'cf-1200e': {
    title: 'Compress Words',
    statement_md:
      'You are given $n$ words. Start with the empty string and append each word, but remove the longest prefix of the new word that is already a suffix of the current string. Output the final string.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nThe second line contains $n$ words (total length $\\le 10^6$).',
    output_format_md: 'Print the compressed string.',
    constraints_text: 'Total length $\\le 10^6$',
    sample_io: [{ input: '3\na aa aaa', output: 'aaaa' }],
  },
  'cf-166e': {
    title: 'Tetrahedron',
    statement_md:
      'A grasshopper starts at vertex $D$ of a tetrahedron $ABCD$ and each second jumps to a different vertex. Count ways to be at $D$ after exactly $n$ jumps modulo $10^9+7$.',
    input_format_md: 'A single integer $n$ ($1 \\le n \\le 10^7$).',
    output_format_md: 'Print the number of ways modulo $10^9+7$.',
    constraints_text: '$1 \\le n \\le 10^7$',
    sample_io: [{ input: '2', output: '3' }],
  },
  'cf-15d': {
    title: 'Map',
    statement_md:
      'You are given an $n \\times m$ height map and a $a \\times b$ rectangle. Among all placements, choose the one minimizing the sum of heights in the rectangle after subtracting the minimum height in it (cost). Rectangles must not overlap previously chosen ones; greedily take the globally best remaining placement repeatedly.',
    input_format_md:
      'The first line contains $n,m,a,b$.\n\nThen an $n \\times m$ matrix of heights ($1 \\le n,m \\le 1000$).',
    output_format_md: 'Print the number of chosen rectangles $k$, then $k$ lines with position and cost.',
    constraints_text: '$1 \\le n,m \\le 1000$',
    sample_io: [{ input: '2 2 1 1\n1 2\n3 4', output: '4\n1 1 0\n1 2 0\n2 1 0\n2 2 0' }],
  },
  'cf-1c': {
    title: 'Ancient Berland Circus',
    statement_md:
      'Three points on the plane are vertices of a regular $n$-gon for some $n\\ge 3$. Find the smallest possible area of such a regular polygon.',
    input_format_md: 'Three lines with coordinates of the points (absolute values $\\le 100$).',
    output_format_md: 'Print the minimum area with high precision.',
    constraints_text: 'Points are not collinear',
    sample_io: [{ input: '0.000000000000 0.000000000000\n1.000000000000 1.000000000000\n0.000000000000 1.000000000000', output: '1.000000000' }],
  },
  'cf-1245d': {
    title: 'Shichikuji and Power Grid',
    statement_md:
      'There are $n$ cities. You may build a power station in city $i$ for cost $c_i$, or connect $i$ and $j$ with a wire costing $(k_i+k_j)\\cdot dist(i,j)$. Supply every city with electricity at minimum cost; output stations and connections.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 2000$).\n\nThen $n$ coordinates, then array $c$, then array $k$.',
    output_format_md: 'Print total cost, the list of stations, and the list of wires.',
    constraints_text: '$1 \\le n \\le 2000$',
    sample_io: [
      {
        input: '3\n2 3\n1 1\n3 2\n3 2 3\n3 2 3',
        output: '8\n3\n1 2 3\n0',
      },
    ],
  },
  'cf-1213g': {
    title: 'Path Queries',
    statement_md:
      'You are given a weighted tree on $n$ vertices and $q$ queries. For each query $q_i$, count unordered pairs of vertices whose maximum edge on the path is $\\le q_i$.',
    input_format_md:
      'The first line contains $n$ and $q$ ($1 \\le n,q \\le 10^5$).\n\nThen $n-1$ edges with weights.\n\nThen $q$ integers $q_i$.',
    output_format_md: 'Print $q$ answers.',
    constraints_text: '$1 \\le n,q \\le 10^5$',
    sample_io: [{ input: '7 5\n1 2 1\n1 3 1\n2 4 2\n2 5 3\n3 6 2\n3 7 4\n1 2 3 4 5', output: '0 3 5 7 7' }],
  },
  'cf-484b': {
    title: 'Maximum Value',
    statement_md:
      'Given a multiset of positive integers ≤ $2\\cdot 10^6$, find $\\max (a_i \\bmod a_j)$ over all pairs.',
    input_format_md:
      'The first line contains $n$ ($2 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 2\\cdot 10^6$).',
    output_format_md: 'Print the maximum remainder.',
    constraints_text: '$2 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3\n3 4 5', output: '2' }],
  },
  'cf-1005e1': {
    title: 'Median on Segments (Permutations Edition)',
    statement_md:
      'Given a permutation of $1..n$ and an integer $m$, count subsegments whose median is $m$.',
    input_format_md:
      'The first line contains $n$ and $m$ ($1 \\le m \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains the permutation.',
    output_format_md: 'Print the number of subsegments with median $m$.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '5 4\n1 4 5 2 3', output: '4' }],
  },
};

function cfUrl(id: string): string {
  const rest = id.slice(3);
  const m = rest.match(/^(\d+)([a-z]\d*)$/i);
  if (!m) return 'https://codeforces.com/problemset';
  return `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`;
}

const SPECS: Spec[] = [
  // —— Geometry (0) ——
  {
    id: 'cses-point-location-test',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2189',
    difficulty_rating: 1200,
    paradigms: ['Geometry'],
    key_insights: ['Cross product sign tells left/right/on of a point vs directed segment'],
    approach_name: 'Orient test',
    editorial_summary_md: 'Use the sign of (b-a)×(c-a) to classify point C relative to line AB.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-line-segment-intersection',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2190',
    difficulty_rating: 1400,
    paradigms: ['Geometry'],
    key_insights: ['Proper intersection via opposite orientations; handle collinear overlap'],
    approach_name: 'Segment intersection',
    editorial_summary_md: 'Standard orientation predicates with special cases for touching endpoints.',
    target_complexity: 'O(1)',
  },
  {
    id: 'cses-polygon-area',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2191',
    difficulty_rating: 1200,
    paradigms: ['Geometry'],
    key_insights: ['Shoelace formula; report twice the area as an integer'],
    approach_name: 'Shoelace',
    editorial_summary_md: 'Sum x_i y_{i+1} - x_{i+1} y_i over the polygon vertices.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-point-in-polygon',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2192',
    difficulty_rating: 1500,
    paradigms: ['Geometry'],
    key_insights: ['Ray casting for inside/outside; on-boundary via segment occupancy'],
    approach_name: 'Ray casting',
    editorial_summary_md: 'Count crossings with a horizontal ray; separately detect boundary hits.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-minimum-euclidean-distance',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2194',
    difficulty_rating: 1800,
    paradigms: ['Geometry', 'Divide & Conquer'],
    key_insights: ['Classic closest-pair divide-and-conquer with strip check'],
    approach_name: 'Closest pair D&C',
    editorial_summary_md: 'Sort by x; recurse; check a strip of width δ sorted by y.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-convex-hull',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2195',
    difficulty_rating: 1600,
    paradigms: ['Geometry'],
    algorithms: ['Sorting'],
    key_insights: ['Monotone chain / Andrew’s algorithm builds lower and upper hulls'],
    approach_name: 'Monotone chain',
    editorial_summary_md: 'Sort points; build hull with cross-product left turns.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cf-1c',
    source: 'Codeforces',
    url: cfUrl('cf-1c'),
    difficulty_rating: 2100,
    paradigms: ['Geometry', 'Math / Number Theory'],
    key_insights: ['Circumcenter + angle steps; n from almost-integer multiples of central angles'],
    approach_name: 'Regular polygon fit',
    editorial_summary_md: 'Recover the circumcircle and the smallest n whose chordal steps match the points.',
    target_complexity: 'O(N)',
    offline: CF['cf-1c'],
  },

  // —— Divide & Conquer (1) ——
  {
    id: 'cses-apple-division',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1623',
    difficulty_rating: 1100,
    paradigms: ['Divide & Conquer', 'Bitmask / Bit DP', 'Brute Force'],
    algorithms: ['Meet in the Middle'],
    key_insights: ['n≤20: try all splits; minimize |2S1 - total|'],
    approach_name: 'Subset enumeration',
    editorial_summary_md: 'Enumerate subsets for one group; the rest forms the other pile.',
    target_complexity: 'O(2^N)',
  },

  // —— Flows / Matching (0) ——
  {
    id: 'cses-download-speed-flows',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1694',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['DFS', 'BFS'],
    key_insights: ['Max flow 1→n with Dinic/EK on given capacities'],
    approach_name: 'Max flow',
    editorial_summary_md: 'Model the network directly; compute maximum flow from computer 1 to n.',
    target_complexity: 'O(N² · M)',
  },
  {
    id: 'cses-school-dance-matching',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1696',
    difficulty_rating: 1700,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS', 'DFS'],
    key_insights: ['Bipartite matching via flow: source→boys→girls→sink'],
    approach_name: 'Bipartite matching',
    editorial_summary_md: 'Build the bipartite dance graph and compute maximum matching.',
    target_complexity: 'O(V² · E)',
  },
  {
    id: 'cses-police-chase-flows',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1695',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS'],
    key_insights: ['Unit-capacity min cut equals max flow; recover edges from residual'],
    approach_name: 'Min cut',
    editorial_summary_md: 'Disconnect 1 from n with fewest streets; list the cut edges.',
    target_complexity: 'O(N² · M)',
  },
  {
    id: 'cses-distinct-routes-flows',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1711',
    difficulty_rating: 1800,
    paradigms: ['Flows / Matching', 'Graph Algorithms'],
    algorithms: ['BFS', 'DFS'],
    key_insights: ['Edge-disjoint paths = unit-cap max flow; reconstruct via residual'],
    approach_name: 'Disjoint paths',
    editorial_summary_md: 'Find as many edge-disjoint routes from 1 to n as possible and print them.',
    target_complexity: 'O(N² · M)',
  },

  // —— Sieve (0) ——
  {
    id: 'cses-common-divisors',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1081',
    difficulty_rating: 1400,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Frequency array; scan multiples from high to low for largest d with ≥2 multiples'],
    approach_name: 'Sieve frequencies',
    editorial_summary_md: 'Count occurrences; the largest d that divides at least two numbers wins.',
    target_complexity: 'O(MAX log MAX)',
  },
  {
    id: 'cses-sum-of-divisors',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1082',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Floor blocks: sum_{i=1}^n σ(i) via iterating over quotient ranges'],
    approach_name: 'Dirichlet floor sum',
    editorial_summary_md: 'Sum of divisor-sum function over 1..n using O(√n) floor segments.',
    target_complexity: 'O(√N)',
  },
  {
    id: 'cses-prime-multiples',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2185',
    difficulty_rating: 1600,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Inclusion-exclusion over subsets of k primes counting multiples ≤ n'],
    approach_name: 'Inclusion-exclusion',
    editorial_summary_md: 'Count integers ≤ n divisible by at least one of the given primes.',
    target_complexity: 'O(2^K · K)',
  },
  {
    id: 'cf-230b',
    source: 'Codeforces',
    url: cfUrl('cf-230b'),
    difficulty_rating: 1300,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Exactly 3 divisors iff number is square of a prime'],
    approach_name: 'Prime squares',
    editorial_summary_md: 'Sieve primes up to 1e6; check whether x is p² for prime p.',
    target_complexity: 'O(MAX log log MAX + N)',
    offline: CF['cf-230b'],
  },
  {
    id: 'cf-26a',
    source: 'Codeforces',
    url: cfUrl('cf-26a'),
    difficulty_rating: 900,
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    key_insights: ['Factorize each value with SPF sieve; count those with ω=2'],
    approach_name: 'SPF sieve',
    editorial_summary_md: 'Linear sieve smallest prime factor; count almost primes ≤ n.',
    target_complexity: 'O(N log log N)',
    offline: CF['cf-26a'],
  },

  // —— MST (0) ——
  {
    id: 'cses-road-reparation-mst',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1675',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['MST', 'DSU', 'Sorting'],
    data_structures: ['Priority Queue'],
    key_insights: ['Kruskal: sort edges, DSU merge until one component'],
    approach_name: 'Kruskal MST',
    editorial_summary_md: 'Build a minimum spanning tree of cities or report IMPossible.',
    target_complexity: 'O(M log M)',
  },
  {
    id: 'cf-1245d',
    source: 'Codeforces',
    url: cfUrl('cf-1245d'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['MST', 'DSU'],
    key_insights: ['Virtual node 0 for power stations; MST on complete graph with station edges'],
    approach_name: 'MST with virtual node',
    editorial_summary_md: 'Connect cities and a virtual power source; Kruskal yields stations + wires.',
    target_complexity: 'O(N² log N)',
    offline: CF['cf-1245d'],
  },

  // —— String Hashing (0) + strings ——
  {
    id: 'cses-string-matching-hash',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1753',
    difficulty_rating: 1400,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing', 'KMP'],
    key_insights: ['Rolling hash or KMP counts pattern occurrences in the text'],
    approach_name: 'Hash / KMP',
    editorial_summary_md: 'Find all starting positions of the pattern string in the text.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-repeating-substring',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2106',
    difficulty_rating: 1700,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    key_insights: ['Binary search length + hash set detects a repeated substring'],
    approach_name: 'Hash + BSA',
    editorial_summary_md: 'Search the longest string length that appears at least twice via double hashing.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-finding-patterns',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2102',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    data_structures: ['Trie'],
    key_insights: ['Aho-Corasick or suffix structure answers which patterns occur'],
    approach_name: 'Multi-pattern matching',
    editorial_summary_md: 'Mark which of the k patterns appear as substrings of s.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-required-substring',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1112',
    difficulty_rating: 1800,
    paradigms: ['String Algorithms', 'Dynamic Programming'],
    algorithms: ['KMP'],
    key_insights: ['DP on position × KMP automaton state counting strings containing pattern'],
    approach_name: 'KMP automaton DP',
    editorial_summary_md: 'Count length-n strings over A–Z that contain the required substring.',
    target_complexity: 'O(N · |P|)',
  },
  {
    id: 'cses-longest-palindrome',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1111',
    difficulty_rating: 1600,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    key_insights: ['Manacher or binary search + hash for longest palindromic substring'],
    approach_name: 'Manacher / hash',
    editorial_summary_md: 'Find any longest palindromic substring of s.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cf-835d',
    source: 'Codeforces',
    url: cfUrl('cf-835d'),
    difficulty_rating: 1800,
    paradigms: ['String Algorithms', 'Dynamic Programming'],
    algorithms: ['String Hashing'],
    key_insights: ['DP + palindromic checks via hash; k-palindrome halves'],
    approach_name: 'Palindrome DP',
    editorial_summary_md: 'Classify every substring’s palindromic degree using hashing.',
    target_complexity: 'O(N²)',
    offline: CF['cf-835d'],
  },
  {
    id: 'cf-1200e',
    source: 'Codeforces',
    url: cfUrl('cf-1200e'),
    difficulty_rating: 1600,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing', 'KMP'],
    key_insights: ['Hash the overlap between current suffix and next word prefix'],
    approach_name: 'Suffix-prefix hash',
    editorial_summary_md: 'When appending each word, strip the longest matching border via hash/Z/KMP.',
    target_complexity: 'O(N)',
    offline: CF['cf-1200e'],
  },

  // —— Meet in the Middle (0 as algorithm tag) ——
  {
    id: 'cses-meet-in-the-middle-mitm',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1628',
    difficulty_rating: 1700,
    paradigms: ['Brute Force', 'Divide & Conquer'],
    algorithms: ['Meet in the Middle', 'Binary Search', 'Sorting'],
    key_insights: ['Split n≤40 into halves; sort subset sums; two-pointer/binary search complements'],
    approach_name: 'Meet in the middle',
    editorial_summary_md: 'Count subset sums equal to x by combining two half enumerations.',
    target_complexity: 'O(2^{N/2} N)',
  },

  // —— Ternary Search (0) ——
  {
    id: 'cf-439d',
    source: 'Codeforces',
    url: cfUrl('cf-439d'),
    difficulty_rating: 1600,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Ternary Search', 'Binary Search'],
    key_insights: ['Cost vs target threshold is convex; ternary/binary search the final barrier value'],
    approach_name: 'Ternary on threshold',
    editorial_summary_md: 'Search the final value T that min a and max b converge to; cost is convex in T.',
    target_complexity: 'O(N log A)',
    offline: CF['cf-439d'],
  },
  {
    id: 'cf-578c',
    source: 'Codeforces',
    url: cfUrl('cf-578c'),
    difficulty_rating: 1900,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Ternary Search'],
    key_insights: ['Weakness(x) is convex; ternary search x and Kadane for abs subarray sums'],
    approach_name: 'Ternary + Kadane',
    editorial_summary_md: 'For fixed x evaluate weakness via max/min subarray sums; ternary search x.',
    target_complexity: 'O(N log A)',
    offline: CF['cf-578c'],
  },

  // —— Floyd-Warshall (1) ——
  {
    id: 'cf-25c',
    source: 'Codeforces',
    url: cfUrl('cf-25c'),
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['After adding edge (a,b,c), update all pairs via going through a or b'],
    approach_name: 'Incremental Floyd',
    editorial_summary_md: 'Maintain APSP matrix; each new road relaxes all pairs in O(n²).',
    target_complexity: 'O(N² · K)',
    offline: CF['cf-25c'],
  },
  {
    id: 'cses-shortest-routes-ii-floyd',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1672',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Floyd-Warshall'],
    data_structures: ['2D Array'],
    key_insights: ['Dense APSP with Floyd-Warshall on ≤500 nodes'],
    approach_name: 'Floyd-Warshall',
    editorial_summary_md: 'Compute all-pairs shortest routes; answer distance queries.',
    target_complexity: 'O(N³)',
  },

  // —— Bellman-Ford ——
  {
    id: 'cses-high-score-bellman',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1673',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford', 'DFS'],
    key_insights: ['Negate weights for longest path; detect positive cycle reaching n'],
    approach_name: 'Bellman-Ford score',
    editorial_summary_md: 'Longest path 1→n with possible unbounded score via positive cycles.',
    target_complexity: 'O(N · M)',
  },

  // —— LIS ——
  {
    id: 'cses-increasing-subsequence-lis',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1145',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS', 'Binary Search'],
    key_insights: ['Patience sorting tails array for LIS length'],
    approach_name: 'LIS n log n',
    editorial_summary_md: 'Maintain minimal tails per length; binary search updates.',
    target_complexity: 'O(N log N)',
  },

  // —— DSU / Topo / Dijkstra / LCA / BFS extras ——
  {
    id: 'cf-1213g',
    source: 'Codeforces',
    url: cfUrl('cf-1213g'),
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DSU', 'Sorting'],
    key_insights: ['Offline queries: add edges by increasing weight; DSU component sizes count pairs'],
    approach_name: 'Offline DSU',
    editorial_summary_md: 'Sort edges and queries; merge components while answering path-max ≤ q.',
    target_complexity: 'O((N+Q) log N)',
    offline: CF['cf-1213g'],
  },
  {
    id: 'cses-longest-flight-route',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1680',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['Topological Sort', 'DFS'],
    key_insights: ['DAG DP for longest path 1→n with predecessor reconstruction'],
    approach_name: 'Topo DP',
    editorial_summary_md: 'Process cities in topological order; track max flights and parents.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-game-routes',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1681',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['Topological Sort', 'DFS'],
    key_insights: ['DAG path-count DP modulo 1e9+7'],
    approach_name: 'Topo path counts',
    editorial_summary_md: 'Number of routes from 1 to n in a DAG via topo DP.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-flight-discount-dijkstra',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1195',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    data_structures: ['Priority Queue'],
    key_insights: ['State graph: (city, used_discount?); Dijkstra on 2n nodes'],
    approach_name: 'State Dijkstra',
    editorial_summary_md: 'Shortest path with at most one edge halved.',
    target_complexity: 'O(M log N)',
  },

  // —— Segment Tree / Fenwick / Sparse Table ——
  {
    id: 'cses-dynamic-range-sum-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1648',
    difficulty_rating: 1400,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Prefix Sums'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Point updates + range sum with fenwick or segtree'],
    approach_name: 'Fenwick / segtree',
    editorial_summary_md: 'Support updating array values and querying range sums.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-dynamic-range-minimum-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1649',
    difficulty_rating: 1400,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    data_structures: ['Sparse Table'],
    key_insights: ['If only queries static, sparse table; with updates use segtree'],
    approach_name: 'RMQ structure',
    editorial_summary_md: 'Point updates and range minimum queries on an array.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-range-updates-and-sums',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1735',
    difficulty_rating: 1800,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    key_insights: ['Lazy segtree with range add and range assign + range sum'],
    approach_name: 'Lazy segtree',
    editorial_summary_md: 'Compose assign/add lazy tags carefully for range sum queries.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-salary-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1144',
    difficulty_rating: 1700,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Sorting'],
    data_structures: ['Fenwick Tree', 'Ordered Set'],
    key_insights: ['Coordinate compress salaries; fenwick counts employees in [a,b]'],
    approach_name: 'Compressed fenwick',
    editorial_summary_md: 'Offline compress values; maintain frequency BIT for salary range counts.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-list-removals',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1749',
    difficulty_rating: 1500,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Order-statistic fenwick finds the p-th remaining element'],
    approach_name: 'Indexed removal',
    editorial_summary_md: 'Each query deletes the x-th still-present position using a BIT of alive flags.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-distinct-values-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1734',
    difficulty_rating: 1700,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Sorting'],
    data_structures: ['Fenwick Tree'],
    key_insights: ['Mo’s algorithm or last-occurrence fenwick offline for distinct counts'],
    approach_name: 'Offline distinct',
    editorial_summary_md: 'Process queries by right endpoint; keep one occurrence per value in a BIT.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-forest-queries-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1739',
    difficulty_rating: 1700,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree', 'Prefix Sums'],
    data_structures: ['Fenwick Tree', '2D Array'],
    key_insights: ['2D fenwick for point flips and rectangle sum queries'],
    approach_name: '2D fenwick',
    editorial_summary_md: 'Toggle trees and query subtree rectangle counts on a grid.',
    target_complexity: 'O((N+Q) log² N)',
  },

  // —— Monotonic Stack (0) ——
  {
    id: 'cses-advertisement',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1142',
    difficulty_rating: 1500,
    paradigms: ['Greedy'],
    algorithms: ['Sorting'],
    data_structures: ['Monotonic Stack', 'Stack'],
    key_insights: ['Largest rectangle in histogram via nearest smaller left/right'],
    approach_name: 'Histogram stack',
    editorial_summary_md: 'For each bar, width = R-L-1 using monotonic stack of indices.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-nearest-smaller-mono',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1645',
    difficulty_rating: 1300,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Monotonic Stack', 'Stack'],
    key_insights: ['Increasing stack yields previous smaller element indices'],
    approach_name: 'Monotonic stack',
    editorial_summary_md: 'Scan left-to-right popping larger values; top is the answer.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cf-547b',
    source: 'Codeforces',
    url: cfUrl('cf-547b'),
    difficulty_rating: 1800,
    paradigms: ['Greedy'],
    data_structures: ['Monotonic Stack', 'Stack'],
    key_insights: ['For each position, span where it is minimum; update answers by span length'],
    approach_name: 'Span via mono stack',
    editorial_summary_md: 'Nearest smaller left/right gives the max group size for each minimum.',
    target_complexity: 'O(N)',
    offline: CF['cf-547b'],
  },
  {
    id: 'cf-1313c2',
    source: 'Codeforces',
    url: cfUrl('cf-1313c2'),
    difficulty_rating: 1900,
    paradigms: ['Greedy', 'Dynamic Programming'],
    data_structures: ['Monotonic Stack', 'Stack'],
    key_insights: ['Pref/suf best unimodal sums via mono stack contribution tricks'],
    approach_name: 'Unimodal mono stack',
    editorial_summary_md: 'Compute best mountain skyline with left and right histogram-like stacks.',
    target_complexity: 'O(N)',
    offline: CF['cf-1313c2'],
  },

  // —— Trie (1) ——
  {
    id: 'cf-514c',
    source: 'Codeforces',
    url: cfUrl('cf-514c'),
    difficulty_rating: 2100,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    data_structures: ['Trie', 'Hash Map'],
    key_insights: ['Store hashes of memory strings; query by flipping one character hash'],
    approach_name: 'Hash set of strings',
    editorial_summary_md: 'Check existence of a string at Hamming distance 1 using polynomial hashes.',
    target_complexity: 'O(N)',
    offline: CF['cf-514c'],
  },

  // —— Bitmask (3) ——
  {
    id: 'cses-creating-strings',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1622',
    difficulty_rating: 1000,
    paradigms: ['Brute Force', 'Bitmask / Bit DP'],
    algorithms: ['Sorting'],
    key_insights: ['Generate unique permutations via recursion/backtracking with used marks'],
    approach_name: 'Permutations',
    editorial_summary_md: 'List all distinct reorderings of the given string in sorted order.',
    target_complexity: 'O(N!)',
  },
  {
    id: 'cf-166e',
    source: 'Codeforces',
    url: cfUrl('cf-166e'),
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming', 'Bitmask / Bit DP'],
    key_insights: ['Two states: at D vs elsewhere; recurrence ways[n]'],
    approach_name: 'State DP',
    editorial_summary_md: 'Let a_n ways at D, b_n elsewhere; a_n=3 b_{n-1}, b_n=2 b_{n-1}+a_{n-1}.',
    target_complexity: 'O(N)',
    offline: CF['cf-166e'],
  },

  // —— BSA extras ——
  {
    id: 'cf-484b',
    source: 'Codeforces',
    url: cfUrl('cf-484b'),
    difficulty_rating: 1900,
    paradigms: ['Math / Number Theory', 'Binary Search on Answer'],
    algorithms: ['Binary Search', 'Sorting', 'Sieve'],
    key_insights: ['For each modulus candidate, scan multiples using next-present values'],
    approach_name: 'Multiples sweep',
    editorial_summary_md: 'Sort unique values; for each a_j walk multiples to maximize remainders.',
    target_complexity: 'O(MAX log MAX)',
    offline: CF['cf-484b'],
  },
  {
    id: 'cf-1005e1',
    source: 'Codeforces',
    url: cfUrl('cf-1005e1'),
    difficulty_rating: 1800,
    paradigms: ['Two Pointers', 'Math / Number Theory'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Hash Map'],
    key_insights: ['Map values to -1/0/+1 around m; count prefixes with balanced transforms'],
    approach_name: 'Median prefixes',
    editorial_summary_md: 'Transform relative to m and count subarrays with the median property.',
    target_complexity: 'O(N)',
    offline: CF['cf-1005e1'],
  },

  // —— Deque ——
  {
    id: 'cses-maximum-subarray-sum-ii-deque',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1644',
    difficulty_rating: 1600,
    paradigms: ['Prefix Sums'],
    algorithms: ['Prefix Sums'],
    data_structures: ['Deque', 'Ordered Set'],
    key_insights: ['Sliding-window minimum on prefix sums for length in [a,b]'],
    approach_name: 'Deque on prefixes',
    editorial_summary_md: 'Maintain candidate left endpoints in a monotonic deque of prefix indices.',
    target_complexity: 'O(N)',
  },

  // —— Sparse Table dedicated ——
  {
    id: 'cses-static-range-minimum-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1647',
    difficulty_rating: 1200,
    paradigms: ['Ad-Hoc'],
    algorithms: ['Segment Tree'],
    data_structures: ['Sparse Table'],
    key_insights: ['Static RMQ: sparse table answers in O(1) after O(N log N) build'],
    approach_name: 'Sparse table RMQ',
    editorial_summary_md: 'Precompute minima of dyadic intervals; answer each query with two blocks.',
    target_complexity: 'O(N log N)',
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
  if (/2\^N|3\^N/i.test(raw)) return 'O(2^N)';
  if (/N³|N\^3/i.test(raw)) return 'O(N³)';
  if (/N²|N\^2|log²/i.test(raw)) return 'O(N²)';
  if (/N \+ M|N\+M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  if (/O\(1\)/i.test(raw)) return 'O(1)';
  if (/√|sqrt/i.test(raw)) return 'O(N √N)';
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
  // Avoid duplicate content under new ids when originals exist
  const skipIfHave = new Map<string, string>([
    ['cses-download-speed-flows', 'cses-download-speed'],
    ['cses-school-dance-matching', 'cses-school-dance'],
    ['cses-police-chase-flows', 'cses-police-chase'],
    ['cses-distinct-routes-flows', 'cses-distinct-routes'],
    ['cses-road-reparation-mst', 'cses-road-reparation'],
    ['cses-string-matching-hash', 'cses-string-matching'],
    ['cses-meet-in-the-middle-mitm', 'cses-meet-in-the-middle'],
    ['cses-shortest-routes-ii-floyd', 'cses-shortest-routes-ii'],
    ['cses-high-score-bellman', 'cses-high-score'],
    ['cses-increasing-subsequence-lis', 'cses-increasing-subsequence'],
    ['cses-flight-discount-dijkstra', 'cses-flight-discount'],
    ['cses-nearest-smaller-mono', 'cses-nearest-smaller-values'],
    ['cses-maximum-subarray-sum-ii-deque', 'cses-maximum-subarray-sum-ii'],
    ['cses-apple-division', 'cses-1623'],
    ['cses-creating-strings', 'cses-1622'],
  ]);

  const todo = SPECS.filter((s) => {
    if (have.has(s.id)) return false;
    const orig = skipIfHave.get(s.id);
    if (orig && have.has(orig)) return false;
    return true;
  });

  console.log(`Batch3 gap-fill: ${todo.length}/${SPECS.length} to add`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  // For skipped duplicates that exist without proper tags, upgrade tags in-place
  let retagged = 0;
  for (const [newId, oldId] of skipIfHave) {
    const spec = SPECS.find((s) => s.id === newId);
    if (!spec) continue;
    const idx = extras.findIndex((p) => p.id === oldId);
    if (idx < 0) continue;
    const a = extras[idx].approaches?.[0];
    if (!a) continue;
    const before = JSON.stringify([a.paradigms, a.algorithms, a.data_structures]);
    a.paradigms = [...new Set([...(a.paradigms || []), ...spec.paradigms])];
    a.algorithms = [...new Set([...(a.algorithms || []), ...(spec.algorithms || [])])];
    a.data_structures = [
      ...new Set([...(a.data_structures || []), ...(spec.data_structures || [])]),
    ];
    const after = JSON.stringify([a.paradigms, a.algorithms, a.data_structures]);
    if (before !== after) retagged += 1;
  }

  let added = 0;
  let failed = 0;
  const results = await mapPool(todo, 3, async (spec, i) => {
    try {
      await sleep(100 * (i % 8));
      const draft = await buildDraft(spec);
      if ((i + 1) % 10 === 0 || i === todo.length - 1) {
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
  console.log(`Added ${added}, retagged ${retagged} existing, failed ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
