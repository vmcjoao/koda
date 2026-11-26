/**
 * Fetch + import a curated batch of classic problems into extras.
 * Targets thin catalog slices: DP, strings, trees, BSA, math, harder CF, AtCoder.
 *
 * Usage: npm run ingest:curated-expansion
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

type ProblemDraft = {
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
  /** Used when OJ fetch is blocked (e.g. CF Cloudflare). */
  offline?: {
    title: string;
    statement_md: string;
    input_format_md: string;
    output_format_md: string;
    constraints_text: string;
    sample_io: { input: string; output: string }[];
  };
};

/** Offline CF statements (Cloudflare often blocks automated fetch). */
const CF_OFFLINE: Record<string, NonNullable<Spec['offline']>> = {
  'cf-1201c': {
    title: 'Maximum Median',
    statement_md:
      'You are given an array $a$ of $n$ integers, where $n$ is odd, and an integer $k$. In one move you may increase any element by $1$. What is the maximum median you can achieve with at most $k$ moves?',
    input_format_md:
      'The first line contains two integers $n$ and $k$ ($1 \\le n \\le 2\\cdot 10^5$, $n$ odd, $1 \\le k \\le 10^9$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$).',
    output_format_md: 'Print a single integer — the maximum possible median.',
    constraints_text: '$n$ odd, $1 \\le n \\le 2\\cdot 10^5$, $1 \\le k,a_i \\le 10^9$',
    sample_io: [{ input: '3 2\n1 3 5', output: '5' }],
  },
  'cf-189a': {
    title: 'Cut Ribbon',
    statement_md:
      'Polycarp has a ribbon of length $n$. He can only cut pieces of lengths $a$, $b$, or $c$. What is the maximum number of pieces he can cut the ribbon into? Each piece must have length $a$, $b$, or $c$.',
    input_format_md: 'A single line with four integers $n, a, b, c$ ($1 \\le n,a,b,c \\le 4000$).',
    output_format_md: 'Print the maximum number of pieces.',
    constraints_text: '$1 \\le n,a,b,c \\le 4000$',
    sample_io: [{ input: '5 5 3 2', output: '2' }],
  },
  'cf-455a': {
    title: 'Boredom',
    statement_md:
      'You are given a sequence $a_1,\\dots,a_n$. In one move you may take any element $a_i=x$, delete it and gain $x$ points, and all elements equal to $x-1$ or $x+1$ are also deleted (no points for them). Maximize the total points.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 10^5$).',
    output_format_md: 'Print the maximum number of points.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le a_i \\le 10^5$',
    sample_io: [{ input: '2\n1 2', output: '2' }],
  },
  'cf-489c': {
    title: 'Given Length and Sum of Digits...',
    statement_md:
      'Find the smallest and largest decimal integers with exactly $m$ digits and digit sum $s$. Leading zeros are not allowed (except the number $0$ when $m=1$). If impossible, print $-1$ $-1$.',
    input_format_md: 'A single line with two integers $m$ and $s$ ($1 \\le m \\le 100$, $0 \\le s \\le 900$).',
    output_format_md: 'Print two integers — the minimal and maximal numbers — or $-1$ $-1$.',
    constraints_text: '$1 \\le m \\le 100$, $0 \\le s \\le 900$',
    sample_io: [{ input: '2 15', output: '69 96' }],
  },
  'cf-545c': {
    title: 'Woodcutters',
    statement_md:
      'There are $n$ trees on a line at distinct positions $x_i$ with heights $h_i$. You may fell a tree left or right (occupying $[x_i-h_i,x_i]$ or $[x_i,x_i+h_i]$) or leave it standing. Felled intervals must not contain another tree’s position. Maximize the number of felled trees.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nEach of the next $n$ lines contains $x_i$ and $h_i$ ($1 \\le x_i,h_i \\le 10^9$), sorted by $x_i$.',
    output_format_md: 'Print the maximum number of trees you can cut.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '5\n1 2\n2 1\n5 10\n10 9\n19 1', output: '3' }],
  },
  'cf-580b': {
    title: 'Kefa and Company',
    statement_md:
      'Kefa wants a friend group where the difference between the richest and poorest is strictly less than $d$. Each friend $i$ has money $m_i$ and friendship factor $s_i$. Maximize the sum of friendship factors in such a group.',
    input_format_md:
      'The first line contains $n$ and $d$ ($1 \\le n \\le 10^5$, $1 \\le d \\le 10^9$).\n\nEach of the next $n$ lines contains $m_i$ and $s_i$ ($1 \\le m_i,s_i \\le 10^9$).',
    output_format_md: 'Print the maximum total friendship factor.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le d,m_i,s_i \\le 10^9$',
    sample_io: [{ input: '4 5\n75 5\n0 100\n150 20\n75 12', output: '37' }],
  },
  'cf-702c': {
    title: 'Cellular Network',
    statement_md:
      'There are $n$ cities and $m$ cellular towers on a line. Find the minimum range $r$ such that every city is within distance $r$ of at least one tower.',
    input_format_md:
      'The first line contains $n$ and $m$ ($1 \\le n,m \\le 10^5$).\n\nThe second line contains $n$ city coordinates.\n\nThe third line contains $m$ tower coordinates.\n\nAll coordinates are between $0$ and $10^9$, given in non-decreasing order.',
    output_format_md: 'Print the minimum possible range $r$.',
    constraints_text: '$1 \\le n,m \\le 10^5$',
    sample_io: [{ input: '3 2\n1 5 10\n4 6', output: '4' }],
  },
  'cf-550b': {
    title: 'Preparing Olympiad',
    statement_md:
      'You have $n$ problems with difficulties $c_i$. Choose a subset of at least two problems such that the total difficulty is between $l$ and $r$ inclusive, and the difference between the hardest and easiest chosen problem is at least $x$. How many subsets are valid?',
    input_format_md:
      'The first line contains $n,l,r,x$ ($2 \\le n \\le 15$, $1 \\le l \\le r \\le 10^9$, $1 \\le x \\le 10^6$).\n\nThe second line contains $n$ integers $c_i$ ($1 \\le c_i \\le 10^6$).',
    output_format_md: 'Print the number of valid subsets.',
    constraints_text: '$2 \\le n \\le 15$',
    sample_io: [{ input: '3 5 6 1\n1 2 3', output: '2' }],
  },
  'cf-327a': {
    title: 'Flipping',
    statement_md:
      'You are given a binary array of length $n$. You must choose one contiguous subarray and flip all bits in it (0↔1). Maximize the number of ones in the array after exactly one flip.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 100$).\n\nThe second line contains $n$ integers $a_i$ ($0$ or $1$).',
    output_format_md: 'Print the maximum number of ones after one flip.',
    constraints_text: '$1 \\le n \\le 100$',
    sample_io: [{ input: '5\n1 0 0 1 0', output: '4' }],
  },
  'cf-1352c': {
    title: 'K-th Not Divisible by n',
    statement_md:
      'You are given positive integers $n$ and $k$. Find the $k$-th positive integer that is not divisible by $n$.',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 1000$).\n\nEach of the next $t$ lines contains $n$ and $k$ ($2 \\le n \\le 10^9$, $1 \\le k \\le 10^9$).',
    output_format_md: 'For each test case print the answer on its own line.',
    constraints_text: '$2 \\le n \\le 10^9$, $1 \\le k \\le 10^9$',
    sample_io: [{ input: '6\n3 7\n4 12\n2 1000000000\n7 97\n1000000000 1000000000\n2 1', output: '10\n15\n1999999999\n113\n1000000001\n1' }],
  },
  'cf-1873e': {
    title: 'Building an Aquarium',
    statement_md:
      'There are $n$ columns of coral with heights $a_i$. You choose a water height $h$ and pour $\\sum_i \\max(0, h-a_i)$ units of water. Find the maximum $h$ such that the water used is at most $x$.',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 10^4$).\n\nEach test case: first line $n$ and $x$ ($1 \\le n \\le 2\\cdot 10^5$, $1 \\le x \\le 10^{18}$); second line $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$). Sum of $n$ over tests $\\le 2\\cdot 10^5$.',
    output_format_md: 'For each test case print the maximum $h$.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$, $1 \\le x \\le 10^{18}$',
    sample_io: [{ input: '5\n4 15\n1 1 4 1\n4 16\n1 1 4 1\n4 1000000000000000000\n1000000000 1000000000 1000000000 1000000000\n1 1000000000000000000\n1\n7 9\n1 2 1 2 5 2 1', output: '4\n5\n1000000000000000000\n1000000000000000001\n3' }],
  },
  'cf-1690d': {
    title: 'Black and White Stripe',
    statement_md:
      'You have a stripe of length $n$ with cells colored black (`B`) or white (`W`). In one move you may recolor any cell. What is the minimum number of recolors so that some contiguous segment of length $k$ is all black?',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 10^4$).\n\nEach test: first line $n$ and $k$ ($1 \\le k \\le n \\le 2\\cdot 10^5$); second line a string of length $n$ over `B`/`W`. Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'For each test case print the minimum number of recolors.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '4\n5 3\nBBWBW\n5 5\nBBWBW\n1 1\nW\n3 1\nWWW', output: '1\n2\n1\n0' }],
  },
  'cf-1324d': {
    title: 'Pair of Topics',
    statement_md:
      'There are $n$ topics. Teacher’s interest is $a_i$, student’s is $b_i$. A pair $(i,j)$ ($i<j$) is good if $a_i+a_j > b_i+b_j$. Count the number of good pairs.',
    input_format_md:
      'The first line contains $n$ ($2 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $a_1\\dots a_n$ ($1 \\le a_i \\le 10^9$).\n\nThe third line contains $b_1\\dots b_n$ ($1 \\le b_i \\le 10^9$).',
    output_format_md: 'Print the number of good pairs.',
    constraints_text: '$2 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '5\n4 8 2 6 2\n4 5 4 1 3', output: '7' }],
  },
  'cf-1005c': {
    title: 'Summarize to the Power of Two',
    statement_md:
      'An array element may be removed if it cannot be paired with some other (possibly same-value different index) element so that their sum is a power of two. How many elements must be removed so that every remaining element has such a pair?',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 1.2\\cdot 10^5$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$).',
    output_format_md: 'Print the number of elements to remove.',
    constraints_text: '$1 \\le n \\le 1.2\\cdot 10^5$',
    sample_io: [{ input: '6\n4 7 1 5 4 9', output: '1' }],
  },
  'cf-1472d': {
    title: 'Even-Odd Game',
    statement_md:
      'Alice and Bob play optimally on an array of $n$ integers. On a turn a player takes one remaining number: Alice scores it if even; Bob scores it if odd. They alternate, Alice first. Print “Alice”, “Bob”, or “Tie” comparing final scores.',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 10^4$).\n\nEach test: first line $n$ ($1 \\le n \\le 2\\cdot 10^5$); second line $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$). Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'For each test case print Alice, Bob, or Tie.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '4\n4\n1 2 3 4\n5\n1 2 3 4 5\n1\n1000000000\n3\n1 1 1', output: 'Alice\nBob\nAlice\nTie' }],
  },
};

/** Gap-filling classics not already in the local catalog. */
const SPECS: Spec[] = [
  // —— CSES DP / math / strings / trees / graphs ——
  {
    id: 'cses-money-sums',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1745',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    key_insights: ['0/1 knapsack on achievable sums with values as both weight and value'],
    approach_name: 'Subset-sum DP',
    editorial_summary_md: 'Mark achievable totals with a boolean DP over coin values (each used at most once).',
    target_complexity: 'O(N * SUM)',
  },
  {
    id: 'cses-array-description',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1746',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    key_insights: ['dp[i][v] = ways to fill prefix i ending with value v; adjacent differ by ≤1'],
    approach_name: 'Adjacent-value DP',
    editorial_summary_md: 'Fill unknowns left-to-right; transition only from previous values within distance 1.',
    target_complexity: 'O(N * M)',
  },
  {
    id: 'cses-rectangle-cutting',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1744',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Min cuts to split an a×b rectangle into squares; try every first cut'],
    approach_name: 'Rectangle DP',
    editorial_summary_md: 'dp[a][b] = min over horizontal/vertical cuts; base when a=b is 0.',
    target_complexity: 'O(A²B + AB²)',
  },
  {
    id: 'cses-removal-game',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1097',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Two-player optimal play on an array ends; score difference / first-player score via interval DP'],
    approach_name: 'Interval game DP',
    editorial_summary_md: 'dp on subarrays: player takes left or right end optimally against an optimal opponent.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'cses-two-sets-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1093',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    key_insights: ['Partition 1..n into equal sums iff n(n+1)/2 even; count half the ways'],
    approach_name: 'Partition DP',
    editorial_summary_md: 'Subset-sum count to total/2 using numbers 1..n once; divide by 2 for unordered partitions.',
    target_complexity: 'O(N * SUM)',
  },
  {
    id: 'cses-counting-towers',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2413',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Track whether the top cells are linked or split; two coupled recurrences'],
    approach_name: 'Tower DP states',
    editorial_summary_md: 'Maintain linked vs split top configurations and transition brick placements carefully.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-projects',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1140',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming', 'Binary Search on Answer'],
    algorithms: ['Binary Search'],
    key_insights: ['Sort by end day; dp[i] = max reward taking/skipping project i with prev compatible via binary search'],
    approach_name: 'Weighted interval DP',
    editorial_summary_md: 'Classic weighted interval scheduling after sorting projects by finishing time.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-increasing-subsequence',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1145',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    algorithms: ['LIS'],
    key_insights: ['Patience sorting / tails array for LIS length in n log n'],
    approach_name: 'LIS n log n',
    editorial_summary_md: 'Maintain the smallest possible tail for each subsequence length; binary search updates.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-reading-books',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1631',
    difficulty_rating: 1300,
    paradigms: ['Greedy'],
    key_insights: ['Answer is max(sum, 2*max) — the longest book forces idle time unless others cover it'],
    approach_name: 'Max vs sum',
    editorial_summary_md: 'Two readers alternate; if one book dominates, total time is twice that book.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-sum-of-three-values',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1641',
    difficulty_rating: 1400,
    paradigms: ['Two Pointers'],
    key_insights: ['Fix one index; two-pointer the rest on a sorted array while tracking original indices'],
    approach_name: 'Fix + two pointers',
    editorial_summary_md: 'Sort with indices; for each left value run two pointers for the complementary pair.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'cses-nearest-smaller-values',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1645',
    difficulty_rating: 1300,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Stack'],
    key_insights: ['Monotonic increasing stack of indices for previous smaller element'],
    approach_name: 'Monotonic stack',
    editorial_summary_md: 'Scan left-to-right, popping larger-or-equal values; top of stack is the answer.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-forest-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1652',
    difficulty_rating: 1300,
    paradigms: ['Prefix Sums'],
    key_insights: ['2D prefix sums on a grid of trees for O(1) rectangle queries'],
    approach_name: '2D prefix sums',
    editorial_summary_md: 'Build pref[i][j] counts; answer rectangles with inclusion-exclusion.',
    target_complexity: 'O(N² + Q)',
  },
  {
    id: 'cses-subarray-divisibility',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1662',
    difficulty_rating: 1400,
    paradigms: ['Prefix Sums'],
    key_insights: ['Count prefix sums with the same residue mod n (careful with negatives)'],
    approach_name: 'Prefix mod frequencies',
    editorial_summary_md: 'Map residue → count; each pair of equal residues forms a divisible subarray.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-missing-coin-sum',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2183',
    difficulty_rating: 1400,
    paradigms: ['Greedy'],
    key_insights: ['After sorting, the smallest unreachable sum grows until a coin > reachable+1'],
    approach_name: 'Reachable mex',
    editorial_summary_md: 'Maintain reachable prefix [1..res]; if next coin > res+1, answer is res+1.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-finding-borders',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1732',
    difficulty_rating: 1500,
    paradigms: ['String Algorithms'],
    algorithms: ['KMP'],
    key_insights: ['Borders of the string are the KMP failure-function chain from n'],
    approach_name: 'KMP borders',
    editorial_summary_md: 'Build pi[]; walk pi[n], pi[pi[n]], … to list all border lengths.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-finding-periods',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1733',
    difficulty_rating: 1600,
    paradigms: ['String Algorithms'],
    algorithms: ['Z-algorithm'],
    key_insights: ['Period p works iff Z[p] covers the suffix starting at p (with wrap via borders)'],
    approach_name: 'Z-algorithm periods',
    editorial_summary_md: 'Compute Z-array; p is a period when the string is covered by repeats of the prefix of length p.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-tree-distances-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1132',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    key_insights: ['Two DFS/BFS from diameter ends give max distance from every node'],
    approach_name: 'Diameter reroot',
    editorial_summary_md: 'Find diameter endpoints A,B; answer[u]=max(dist(u,A),dist(u,B)).',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-tree-distances-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1133',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['DFS'],
    key_insights: ['Rerooting: subtree size + sum of distances; move root along edges'],
    approach_name: 'Rerooting DP',
    editorial_summary_md: 'Compute down-sums, then reroot to get total distance sum for every root.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-company-queries-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1688',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA'],
    data_structures: ['Binary Lifting'],
    key_insights: ['Binary lifting LCA on a rooted company tree'],
    approach_name: 'Binary lifting LCA',
    editorial_summary_md: 'Precompute 2^k parents; lift deeper node then jump together.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-flight-routes-check',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1682',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    key_insights: ['Strong connectivity: reachable from 1 and everyone reaches 1 (or Kosaraju/Tarjan)'],
    approach_name: 'SCC / reachability',
    editorial_summary_md: 'Check the digraph is strongly connected; report a counterexample edge direction if not.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-planets-and-kingdoms',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1683',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    key_insights: ['Kosaraju or Tarjan SCC labeling'],
    approach_name: 'SCC condensation',
    editorial_summary_md: 'Compute strongly connected components and assign kingdom ids.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-road-reparation',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1675',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['DSU'],
    data_structures: ['DSU'],
    key_insights: ['MST total weight; impossible if not connecting all cities'],
    approach_name: 'Kruskal MST',
    editorial_summary_md: 'Sort edges by cost; DSU merge until one component or declare IMPossible.',
    target_complexity: 'O(M log M)',
  },
  {
    id: 'cses-round-trip-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1678',
    difficulty_rating: 1500,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    key_insights: ['Directed cycle via 3-color DFS; reconstruct path from back-edge'],
    approach_name: 'Directed cycle DFS',
    editorial_summary_md: 'Gray-node back edge closes a cycle; walk parents to print it.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-course-schedule-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1757',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['Topological Sort'],
    key_insights: ['Lexicographically smallest topo order with a min-heap Kahn'],
    approach_name: 'Kahn + heap',
    editorial_summary_md: 'Priority queue of indegree-0 nodes yields the smallest valid course order.',
    target_complexity: 'O((N+M) log N)',
  },
  {
    id: 'cses-download-speed',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1694',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Max Flow'],
    key_insights: ['Max flow from 1 to n with Dinic/EK on the given capacities'],
    approach_name: 'Max flow',
    editorial_summary_md: 'Model the network directly; compute max flow with a standard blocking-flow algorithm.',
    target_complexity: 'O(N²M)',
  },
  {
    id: 'cses-school-dance',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1696',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Max Flow'],
    key_insights: ['Bipartite matching via max flow: source→boys→girls→sink'],
    approach_name: 'Bipartite matching',
    editorial_summary_md: 'Build bipartite graph of acceptable pairs; max matching = max flow.',
    target_complexity: 'O(V²E)',
  },
  {
    id: 'cses-counting-divisors',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1713',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory'],
    key_insights: ['Precompute divisor counts with a linear sieve / loop multiples'],
    approach_name: 'Sieve divisor counts',
    editorial_summary_md: 'For i in 1..MAX, add 1 to every multiple; answer queries in O(1).',
    target_complexity: 'O(MAX log MAX + Q)',
  },
  {
    id: 'cses-exponentiation',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1095',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory'],
    key_insights: ['Binary exponentiation modulo 1e9+7'],
    approach_name: 'Modpow',
    editorial_summary_md: 'Compute a^b mod MOD with repeated squaring for each query.',
    target_complexity: 'O(Q log EXP)',
  },
  {
    id: 'cses-exponentiation-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1712',
    difficulty_rating: 1500,
    paradigms: ['Math / Number Theory'],
    key_insights: ['a^(b^c) mod MOD uses Euler φ: reduce exponent mod φ(MOD) when gcd(a,MOD)=1'],
    approach_name: 'Euler totient exp',
    editorial_summary_md: 'Compute b^c mod (MOD-1) then a^that mod MOD (with edge cases for a≡0).',
    target_complexity: 'O(Q log EXP)',
  },
  {
    id: 'cses-chessboard-and-queens',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1624',
    difficulty_rating: 1300,
    paradigms: ['Brute Force'],
    key_insights: ['Backtrack row by row; mask columns and diagonals; skip reserved cells'],
    approach_name: 'Queen backtracking',
    editorial_summary_md: 'Classic 8-queens with a few blocked squares on the board.',
    target_complexity: 'O(N!)',
  },
  {
    id: 'cses-meet-in-the-middle',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1628',
    difficulty_rating: 1700,
    paradigms: ['Brute Force'],
    key_insights: ['Split n≤40 into two halves; sort one half and binary-search complements'],
    approach_name: 'Meet in the middle',
    editorial_summary_md: 'Enumerate subset sums of each half; count pairs that sum to x.',
    target_complexity: 'O(2^{n/2} n)',
  },
  {
    id: 'cses-movie-festival-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1632',
    difficulty_rating: 1600,
    paradigms: ['Greedy'],
    data_structures: ['Multiset'],
    key_insights: ['k viewers: always assign a movie to the freest person who finished early enough'],
    approach_name: 'Multiset of end times',
    editorial_summary_md: 'Sort by ending time; multiset stores current free times for k people.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-factory-machines',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1620',
    difficulty_rating: 1400,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Binary Search'],
    key_insights: ['Monotonic: mid minutes produce sum floor(mid/t_i) products'],
    approach_name: 'Binary search time',
    editorial_summary_md: 'Search minimum T such that machines produce ≥ t items in T minutes.',
    target_complexity: 'O(N log T)',
  },

  // —— AtCoder Educational DP ——
  {
    id: 'atc-dp-vacation',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_c?lang=en',
    titleHint: 'Vacation',
    difficulty_rating: 1200,
    paradigms: ['Dynamic Programming'],
    key_insights: ['dp[day][activity] with no two consecutive same activities'],
    approach_name: 'Daily activity DP',
    editorial_summary_md: 'Maximize happiness with the constraint that the same activity is never chosen two days in a row.',
    target_complexity: 'O(N)',
  },
  {
    id: 'atc-dp-knapsack2',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_e?lang=en',
    titleHint: 'Knapsack2',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    key_insights: ['When W is huge but values are small, DP on value and minimize weight'],
    approach_name: 'Value-dimension knapsack',
    editorial_summary_md: 'Invert the usual knapsack: minimize weight to achieve each total value.',
    target_complexity: 'O(N * ΣV)',
  },
  {
    id: 'atc-dp-lcs',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_f?lang=en',
    titleHint: 'LCS',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming', 'String Algorithms'],
    key_insights: ['Classic LCS DP; reconstruct by walking the table'],
    approach_name: 'LCS',
    editorial_summary_md: 'dp[i][j] from prefixes; recover one LCS by tracing equal characters backward.',
    target_complexity: 'O(|S||T|)',
  },
  {
    id: 'atc-dp-longest-path',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_g?lang=en',
    titleHint: 'Longest Path',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming', 'Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    key_insights: ['DAG longest path via memoized DFS / topo DP'],
    approach_name: 'DAG DP',
    editorial_summary_md: 'On a DAG, dp[v]=1+max over outgoing edges; memoize or process in topo order.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'atc-dp-grid1',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_h?lang=en',
    titleHint: 'Grid 1',
    difficulty_rating: 1200,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Grid path counts with blocked cells'],
    approach_name: 'Grid path DP',
    editorial_summary_md: 'dp[i][j] = ways from top-left; zero out walls.',
    target_complexity: 'O(HW)',
  },
  {
    id: 'atc-dp-coins',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_i?lang=en',
    titleHint: 'Coins',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Probability DP of heads count; answer P(more heads than tails)'],
    approach_name: 'Probability DP',
    editorial_summary_md: 'dp[i][h] after i coins; sum probabilities where heads > n/2.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'atc-dp-stones',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_k?lang=en',
    titleHint: 'Stones',
    difficulty_rating: 1400,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Nim-like: a pile is winning if some move leaves a losing pile'],
    approach_name: 'Game DP',
    editorial_summary_md: 'win[x] if exists a in A with x≥a and !win[x-a].',
    target_complexity: 'O(N * |A|)',
  },
  {
    id: 'atc-dp-deque',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_l?lang=en',
    titleHint: 'Deque',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Interval DP for X-Y under optimal alternating ends'],
    approach_name: 'Interval game DP',
    editorial_summary_md: 'Similar to Removal Game: maximize score difference on subarrays.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'atc-dp-slimes',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_n?lang=en',
    titleHint: 'Slimes',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Cost to merge range = sum + best split; prefix sums'],
    approach_name: 'Interval merge DP',
    editorial_summary_md: 'Classic matrix-chain style DP on adjacent slime merges.',
    target_complexity: 'O(N³)',
  },
  {
    id: 'atc-dp-matching',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_o?lang=en',
    titleHint: 'Matching',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Bitmask DP over matched women for successive men'],
    approach_name: 'Bitmask matching DP',
    editorial_summary_md: 'dp[mask] = ways to match first popcount(mask) men to the set mask.',
    target_complexity: 'O(N² 2^N)',
  },
  {
    id: 'atc-dp-independent-set',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_p?lang=en',
    titleHint: 'Independent Set',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming', 'Graph Algorithms'],
    key_insights: ['Tree DP: black/white vertex colors with independence constraint'],
    approach_name: 'Tree coloring DP',
    editorial_summary_md: 'For each subtree count ways root is black vs white; multiply child contributions.',
    target_complexity: 'O(N)',
  },
  {
    id: 'atc-dp-flowers',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_q?lang=en',
    titleHint: 'Flowers',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    data_structures: ['Segment Tree', 'Fenwick'],
    key_insights: ['LIS-like max beauty with heights as keys; fenwick/segtree for max prefix'],
    approach_name: 'Fenwick LIS DP',
    editorial_summary_md: 'dp[h]=beauty + max dp[h\'<h]; maintain with a BIT on heights.',
    target_complexity: 'O(N log N)',
  },

  // —— Codeforces classics (band stretch + BSA/DP) ——
  {
    id: 'cf-1201c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1201/C',
    difficulty_rating: 1400,
    paradigms: ['Binary Search on Answer', 'Greedy'],
    algorithms: ['Binary Search'],
    key_insights: ['Binary search the median; cost is raising the upper half to mid'],
    approach_name: 'Binary search median',
    editorial_summary_md: 'Sort; search max median M affordable with ≤k increments on a[mid..].',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-1201c'],
  },
  {
    id: 'cf-189a',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/189/A',
    difficulty_rating: 1300,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Unbounded knapsack: max pieces cutting ribbon into a,b,c lengths'],
    approach_name: 'Unbounded cut DP',
    editorial_summary_md: 'dp[x]=max pieces to make length x; try subtracting a,b,c.',
    target_complexity: 'O(N)',
    offline: CF_OFFLINE['cf-189a'],
  },
  {
    id: 'cf-455a',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/455/A',
    difficulty_rating: 1500,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Points equal value*count; taking v forbids v-1 and v+1'],
    approach_name: 'House-robber on values',
    editorial_summary_md: 'Compress to frequency array; dp like house robber on consecutive integers.',
    target_complexity: 'O(N · X)',
    offline: CF_OFFLINE['cf-455a'],
  },
  {
    id: 'cf-489c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/489/C',
    difficulty_rating: 1400,
    paradigms: ['Greedy'],
    key_insights: ['Build min and max digit strings with length m and digit sum s'],
    approach_name: 'Digit greedy',
    editorial_summary_md: 'Greedy place digits from left/right with remaining sum bounds; handle leading zeros.',
    target_complexity: 'O(N)',
    offline: CF_OFFLINE['cf-489c'],
  },
  {
    id: 'cf-545c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/545/C',
    difficulty_rating: 1500,
    paradigms: ['Greedy'],
    key_insights: ['Cut trees left if possible else right if it does not block the next'],
    approach_name: 'Left-prefer cuts',
    editorial_summary_md: 'Scan left-to-right; fall left into free space, otherwise try falling right.',
    target_complexity: 'O(N)',
    offline: CF_OFFLINE['cf-545c'],
  },
  {
    id: 'cf-580b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/580/B',
    difficulty_rating: 1400,
    paradigms: ['Two Pointers'],
    key_insights: ['Sort friends by money; sliding window max friendship with money span <d'],
    approach_name: 'Sliding window',
    editorial_summary_md: 'Two pointers on sorted wealth; maintain friendship sum of the window.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-580b'],
  },
  {
    id: 'cf-702c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/702/C',
    difficulty_rating: 1500,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Binary Search'],
    key_insights: ['Binary search tower radius; each city must be covered by some tower'],
    approach_name: 'Binary search coverage',
    editorial_summary_md: 'For mid r, two-pointer check every city has a tower within r.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-702c'],
  },
  {
    id: 'cf-550b',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/550/B',
    difficulty_rating: 1300,
    paradigms: ['Brute Force'],
    key_insights: ['n≤15: enumerate subsets; check sum, max-min, size≥2'],
    approach_name: 'Subset enumeration',
    editorial_summary_md: 'Try all 2^n subsets of problems for the olympiad constraints.',
    target_complexity: 'O(2^N)',
    offline: CF_OFFLINE['cf-550b'],
  },
  {
    id: 'cf-327a',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/327/A',
    difficulty_rating: 1200,
    paradigms: ['Dynamic Programming', 'Brute Force'],
    key_insights: ['Flip one subarray of bits; maximize number of 1s = total1s + max gain'],
    approach_name: 'Kadane on flip gain',
    editorial_summary_md: 'Map 0→+1 and 1→-1; Kadane finds best flip segment.',
    target_complexity: 'O(N)',
    offline: CF_OFFLINE['cf-327a'],
  },
  {
    id: 'cf-1352c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1352/C',
    difficulty_rating: 1200,
    paradigms: ['Math / Number Theory'],
    key_insights: ['k-th positive not divisible by n is k + floor((k-1)/(n-1))'],
    approach_name: 'Closed form',
    editorial_summary_md: 'Skip every multiple of n in the positive integers with an O(1) formula.',
    target_complexity: 'O(1)',
    offline: CF_OFFLINE['cf-1352c'],
  },
  {
    id: 'cf-1873e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1873/E',
    difficulty_rating: 1300,
    paradigms: ['Binary Search on Answer'],
    algorithms: ['Binary Search'],
    key_insights: ['Binary search water height; cost is sum max(0, h-a_i)'],
    approach_name: 'Binary search height',
    editorial_summary_md: 'Monotonic cost vs height; find max h with cost ≤ x.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-1873e'],
  },
  {
    id: 'cf-1690d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1690/D',
    difficulty_rating: 1200,
    paradigms: ['Two Pointers', 'Prefix Sums'],
    key_insights: ['Min recolors for a black segment of length k = whites in a window of k'],
    approach_name: 'Sliding window',
    editorial_summary_md: 'Count whites in each length-k window; take the minimum.',
    target_complexity: 'O(N)',
    offline: CF_OFFLINE['cf-1690d'],
  },
  {
    id: 'cf-1324d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1324/D',
    difficulty_rating: 1500,
    paradigms: ['Two Pointers'],
    algorithms: ['Binary Search'],
    key_insights: ['Rewrite a_i+a_j > b_i+b_j as (a-b)_i + (a-b)_j > 0; sort and two-pointer'],
    approach_name: 'Transform + two pointers',
    editorial_summary_md: 'Work with c_i=a_i-b_i; count ordered pairs with c_i+c_j>0.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-1324d'],
  },
  {
    id: 'cf-1005c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1005/C',
    difficulty_rating: 1300,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Map'],
    key_insights: ['A value stays if some other makes a power-of-two sum; check ≤30 powers'],
    approach_name: 'Power-of-two pairs',
    editorial_summary_md: 'Frequency map; for each a check whether 2^k-a exists with enough multiplicity.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-1005c'],
  },
  {
    id: 'cf-1472d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1472/D',
    difficulty_rating: 1200,
    paradigms: ['Greedy'],
    key_insights: ['Sort descending; Alice takes even values as score, Bob odd'],
    approach_name: 'Alternating greedy',
    editorial_summary_md: 'Optimal play picks the globally largest remaining integer each turn.',
    target_complexity: 'O(N log N)',
    offline: CF_OFFLINE['cf-1472d'],
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
    .replace(/&#39;/g, "'")
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥');
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
      .replace(/<span class="tex-font-style-bf">([\s\S]*?)<\/span>/gi, '**$1**')
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
  const m = html.match(/<div class="md">([\s\S]*?)<\/div>\s*(?:<div class="navsidebar"|<script)/);
  const md = m?.[1] || html.match(/<div class="md">([\s\S]*?)<\/div>/)?.[1] || '';
  return { title, body: stripTags(md) };
}

function parseAtcoder(html: string): { title: string; body: string } {
  const title =
    html.match(/<span class="h2">\s*([^<]+?)\s*</)?.[1]?.replace(/^[A-Z]\s*-\s*/, '').trim() ||
    html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s*-\s*AtCoder.*/, '').trim() ||
    'AtCoder Problem';
  const en =
    html.match(/<span class="lang-en">([\s\S]*?)<\/span>\s*<span class="lang-/)?.[1] ||
    html.match(/<span class="lang-en">([\s\S]*?)<\/span>/)?.[1] ||
    '';
  // Drop score line noise
  const cleaned = en.replace(/Score\s*:\s*\d+\s*points/i, '').trim();
  return { title, body: stripTags(cleaned) };
}

function parseCodeforces(html: string): { title: string; body: string } {
  if (/Just a moment/i.test(html)) throw new Error('Cloudflare challenge');
  const title =
    html.match(/<div class="title">([^<]+)<\/div>/)?.[1]?.replace(/^[A-Z0-9]+\.\s*/, '').trim() ||
    'Codeforces Problem';
  const m = html.match(/<div class="problem-statement">([\s\S]*?)(?:<div class="roundbox|<div id="footer"|$)/);
  if (!m) throw new Error('no problem-statement');
  let blob = m[1];
  // Drop header time/memory
  blob = blob.replace(/<div class="header">[\s\S]*?<\/div>\s*(?=<div)/, '');
  // CF latex images → $tex$
  blob = blob.replace(
    /<span class="tex-span">([\s\S]*?)<\/span>/gi,
    (_m, inner) => `$${stripTags(inner)}$`,
  );
  blob = blob.replace(/\$\$\$/g, '$'); // CF sometimes uses $$$
  return { title, body: stripTags(blob) };
}

function sectionFromBody(body: string, label: RegExp): string {
  const m = body.match(
    new RegExp(
      `(?:^|\\n)#*\\s*${label.source}\\s*\\n([\\s\\S]*?)(?=\\n#*\\s*(?:Input|Output|Constraints?|Sample|Examples?|Note|Interaction)\\b|$)`,
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
  // CSES / generic
  const re =
    /Sample Input\s*([\s\S]*?)\s*Sample Output\s*([\s\S]*?)(?=\s*Sample Input\b|\s*Note\b|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) && samples.length < 3) {
    samples.push({ input: m[1].trim(), output: m[2].trim().split(/\n\n/)[0].trim() });
  }
  if (samples.length) return samples;

  // CF: Input / Output under Examples
  const blocks = body.split(/\n(?=Input\b)/i);
  for (const block of blocks) {
    const mm = block.match(/Input\s*([\s\S]*?)\s*Output\s*([\s\S]*?)(?=\nInput\b|$)/i);
    if (mm) {
      samples.push({
        input: mm[1].trim(),
        output: mm[2].trim().split(/\n\n/)[0].trim(),
      });
    }
  }
  if (samples.length) return samples.slice(0, 3);

  // AtCoder Sample Input 1
  const atc =
    /Sample Input\s*\d+\s*([\s\S]*?)\s*Sample Output\s*\d+\s*([\s\S]*?)(?=Sample Input\s*\d+|$)/gi;
  while ((m = atc.exec(body)) && samples.length < 3) {
    samples.push({ input: m[1].trim(), output: m[2].trim().split(/\n\n/)[0].trim() });
  }
  return samples;
}

function statementOnly(body: string): string {
  // Prefer prose before Input section for statement_md, but keep full body if short.
  const m = body.split(/\n(?=#*\s*Input\b)/i);
  if (m.length > 1 && m[0].trim().length > 40) {
    // Keep full body — Encounter shows separate I/O cards
    return body.trim();
  }
  return body.trim();
}

function defaultComplexity(spec: Spec): string {
  const raw = spec.target_complexity;
  if ((COMPLEXITY_OPTIONS as readonly string[]).includes(raw)) return raw;
  if (/N!/i.test(raw)) return 'O(N!)';
  if (/2\^N/i.test(raw)) return 'O(2^N)';
  if (/N³|N\^3/i.test(raw)) return 'O(N³)';
  if (/N²|N\^2|N\s*\*\s*M|A²|HW/i.test(raw)) return 'O(N²)';
  if (/N\s*\*\s*SUM|N\s*\*\s*M|ΣV|MAX/i.test(raw)) return 'O(N · X)';
  if (/N\s*\+\s*M/i.test(raw)) return 'O(N + M)';
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

async function buildDraft(spec: Spec): Promise<ProblemDraft> {
  if (spec.offline) {
    const o = spec.offline;
    return {
      id: spec.id,
      title: o.title,
      source: spec.source,
      url: spec.url.replace(/\?lang=en$/, ''),
      difficulty_rating: spec.difficulty_rating,
      statement_md: o.statement_md,
      input_format_md: o.input_format_md,
      output_format_md: o.output_format_md,
      constraints_text: o.constraints_text,
      sample_io: o.sample_io,
      target_complexity: defaultComplexity(spec),
      approaches: [approachFor(spec)],
    };
  }

  const html = await fetchText(spec.url);
  let parsed: { title: string; body: string };
  if (spec.source === 'CSES') parsed = parseCses(html);
  else if (spec.source === 'AtCoder') parsed = parseAtcoder(html);
  else parsed = parseCodeforces(html);

  if (!parsed.body || parsed.body.length < 40) {
    throw new Error(`empty body for ${spec.id}`);
  }

  const title = (spec.titleHint || parsed.title).trim();
  const body = parsed.body;
  const input =
    sectionFromBody(body, /Input/) ||
    sectionFromBody(body, /Input Format/) ||
    'See statement.';
  const output =
    sectionFromBody(body, /Output/) ||
    sectionFromBody(body, /Output Format/) ||
    'See statement.';

  return {
    id: spec.id,
    title,
    source: spec.source,
    url: spec.url.replace(/\?lang=en$/, ''),
    difficulty_rating: spec.difficulty_rating,
    statement_md: statementOnly(body),
    input_format_md: input,
    output_format_md: output,
    constraints_text: extractConstraints(body),
    sample_io: extractSamples(body),
    target_complexity: defaultComplexity(spec),
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
  const todo = SPECS.filter((s) => !have.has(s.id));
  console.log(`Curated expansion: ${todo.length}/${SPECS.length} not yet in catalog`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as ProblemDraft[];

  let added = 0;
  let failed = 0;

  const results = await mapPool(todo, 3, async (spec, i) => {
    try {
      await sleep(120 * i); // mild stagger
      const draft = await buildDraft(spec);
      if ((i + 1) % 8 === 0 || i === todo.length - 1) {
        console.log(`  ${i + 1}/${todo.length} ok ${spec.id} (${draft.title})`);
      }
      return { ok: true as const, draft };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`  fail ${spec.id}: ${msg}`);
      return { ok: false as const, id: spec.id };
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
  console.log(`Added ${added} problems (${failed} failed)`);
  console.log('Next: npm run generate:seed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
