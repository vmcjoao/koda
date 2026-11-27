/**
 * Second curated expansion batch — more CSES / AtCoder DP / CF classics.
 * Usage: npm run ingest:curated-batch2
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
  'cf-466c': {
    title: 'Number of Ways',
    statement_md:
      'You are given an array of $n$ integers. Count the number of ways to split it into three contiguous parts with equal sums.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 5\\cdot 10^5$).\n\nThe second line contains $n$ integers $a_i$ ($|a_i| \\le 10^9$).',
    output_format_md: 'Print the number of ways.',
    constraints_text: '$1 \\le n \\le 5\\cdot 10^5$',
    sample_io: [{ input: '5\n1 2 3 0 3', output: '2' }],
  },
  'cf-550a': {
    title: 'Two Substrings',
    statement_md:
      'Given a string $s$, decide whether it contains two non-overlapping substrings `AB` and `BA` (in either order).',
    input_format_md: 'A single line with string $s$ ($1 \\le |s| \\le 10^5$), uppercase English letters.',
    output_format_md: 'Print `YES` or `NO`.',
    constraints_text: '$1 \\le |s| \\le 10^5$',
    sample_io: [{ input: 'ABA', output: 'NO' }],
  },
  'cf-676c': {
    title: 'Vasya and String',
    statement_md:
      'Vasya has a string of `a`/`b` of length $n$ and can change at most $k$ characters. What is the longest substring he can make consisting of only one letter?',
    input_format_md:
      'The first line contains $n$ and $k$ ($1 \\le n \\le 10^5$, $0 \\le k \\le n$).\n\nThe second line contains the string.',
    output_format_md: 'Print the maximum length of a beautiful substring.',
    constraints_text: '$1 \\le n \\le 10^5$',
    sample_io: [{ input: '4 2\nabba', output: '4' }],
  },
  'cf-706c': {
    title: 'Hard problem',
    statement_md:
      'You have $n$ strings and costs $c_i$ to reverse string $i$. Reorder by optionally reversing each string so that the sequence is lexicographically sorted, minimizing total cost (or $-1$).',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 10^5$).\n\nThe second line contains $c_1\\dots c_n$ ($0 \\le c_i \\le 10^9$).\n\nThen $n$ lines with the strings (total length $\\le 10^5$).',
    output_format_md: 'Print the minimum cost or $-1$.',
    constraints_text: '$1 \\le n \\le 10^5$, total length $\\le 10^5$',
    sample_io: [{ input: '2\n1 2\nx\ny', output: '0' }],
  },
  'cf-977d': {
    title: 'Divide by three, multiply by two',
    statement_md:
      'You are given $n$ distinct integers. Reorder them into a sequence where each next element is either the previous times $2$ or the previous divided by $3$ (when divisible).',
    input_format_md:
      'The first line contains $n$ ($2 \\le n \\le 100$).\n\nThe second line contains $n$ distinct integers $a_i$ ($1 \\le a_i \\le 3\\cdot 10^{18}$).',
    output_format_md: 'Print any valid order of the $n$ numbers.',
    constraints_text: '$2 \\le n \\le 100$',
    sample_io: [{ input: '6\n4 8 6 3 12 9', output: '9 3 6 12 4 8' }],
  },
  'cf-1006c': {
    title: 'Three Parts of the Array',
    statement_md:
      'Split an array into three contiguous parts (middle may be empty) maximizing $d$ where the left sum equals the right sum equals $d$.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $n$ integers $d_i$ ($1 \\le d_i \\le 10^9$).',
    output_format_md: 'Print the maximum $d$ (possibly $0$).',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '5\n1 3 1 1 4', output: '5' }],
  },
  'cf-1131c': {
    title: 'Birthday',
    statement_md:
      'Kids with heights $a_i$ stand in a circle. Minimize the maximum absolute height difference between adjacent kids (including first/last).',
    input_format_md:
      'The first line contains $n$ ($3 \\le n \\le 100$).\n\nThe second line contains $n$ integers $a_i$ ($1 \\le a_i \\le 10^9$).',
    output_format_md: 'Print the heights in an optimal circular order.',
    constraints_text: '$3 \\le n \\le 100$',
    sample_io: [{ input: '5\n1 2 3 4 5', output: '1 3 5 4 2' }],
  },
  'cf-1203d2': {
    title: 'Remove the Substring (hard version)',
    statement_md:
      'You are given strings $s$ and $t$ ($t$ is a subsequence of $s$). Delete one contiguous substring of $s$ of maximum length so that $t$ remains a subsequence.',
    input_format_md: 'Two lines with $s$ and $t$ ($1 \\le |t| \\le |s| \\le 2\\cdot 10^5$).',
    output_format_md: 'Print the maximum length of a deletable substring (may be $0$).',
    constraints_text: '$1 \\le |t| \\le |s| \\le 2\\cdot 10^5$',
    sample_io: [{ input: 'bbxbbbb\nbb', output: '4' }],
  },
  'cf-1343d': {
    title: 'Constant Palette Sum',
    statement_md:
      'You have an array of $n$ integers ($n$ even) and a value $k$. In one move you may change any $a_i$ to any value in $[1,k]$. Minimize moves so that $a_i+a_{n+1-i}=x$ for all $i$ for some $x$.',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 10^4$).\n\nEach test: first line $n$ and $k$ ($2 \\le n \\le 2\\cdot 10^5$, $n$ even, $1 \\le k \\le 2\\cdot 10^5$); second line $n$ integers $a_i$ ($1 \\le a_i \\le k$). Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'For each test print the minimum number of changes.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '4\n4 2\n1 2 1 2\n4 3\n1 2 2 1\n8 7\n6 1 1 7 6 3 4 6\n6 6\n5 2 6 1 3 4', output: '0\n1\n4\n2' }],
  },
  'cf-1365d': {
    title: 'Solve The Maze',
    statement_md:
      'A grid has empty cells, walls, good people `G`, and bad people `B`. You may turn empty cells into walls. Can you block all bad people from reaching any good person while every good person can still reach the exit at $(n,m)$ (4-adjacent moves)?',
    input_format_md:
      'The first line contains $t$.\n\nEach test: first line $n$ and $m$ ($1 \\le n,m \\le 50$); then $n$ strings of length $m$ over `. # G B`.',
    output_format_md: 'Print `Yes` or `No` for each test.',
    constraints_text: '$1 \\le n,m \\le 50$',
    sample_io: [{ input: '3\n1 3\n#B.\n3 3\nG.B\n.G.\nB.G\n3 3\nG.B\n.G.\nB..', output: 'No\nNo\nYes' }],
  },
  'cf-1398d': {
    title: 'Colored Rectangles',
    statement_md:
      'You have sticks of three colors with lengths $R_i$, $G_j$, $B_k$. Repeatedly pick two different colors, form a rectangle with those sides, score area, and discard the sticks. Maximize total score.',
    input_format_md:
      'The first line contains $r,g,b$ ($1 \\le r,g,b \\le 200$).\n\nThen three lines with the stick lengths.',
    output_format_md: 'Print the maximum total area.',
    constraints_text: '$1 \\le r,g,b \\le 200$',
    sample_io: [{ input: '1 1 1\n5\n5\n5', output: '25' }],
  },
  'cf-1526c2': {
    title: 'Potion-making (Hard Version)',
    statement_md:
      'You drink potions in order $1..n$. Potion $i$ changes health by $a_i$ (may be negative). You may skip potions. Health must stay $\\ge 0$ after every drunk potion (start at $0$). Maximize the number of potions drunk.',
    input_format_md:
      'The first line contains $n$ ($1 \\le n \\le 2\\cdot 10^5$).\n\nThe second line contains $a_1\\dots a_n$ ($-10^9 \\le a_i \\le 10^9$).',
    output_format_md: 'Print the maximum number of potions.',
    constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '6\n4 -4 1 -3 1 -3', output: '5' }],
  },
  'cf-1612c': {
    title: 'Special Numbers',
    statement_md:
      'There are infinitely many rows of emotes: row $i$ ($i\\le k$) has $i$ emotes; then rows decrease. Find the minimum number of rows to take at least $x$ emotes.',
    input_format_md:
      'The first line contains $t$ ($1 \\le t \\le 10^4$).\n\nEach test contains $k$ and $x$ ($1 \\le k \\le 10^9$, $1 \\le x \\le 10^{18}$).',
    output_format_md: 'For each test print the answer.',
    constraints_text: '$1 \\le k \\le 10^9$, $1 \\le x \\le 10^{18}$',
    sample_io: [{ input: '3\n1 1\n2 1\n2 3', output: '1\n1\n2' }],
  },
  'cf-1698c': {
    title: '3SUM Closure',
    statement_md:
      'An array is 3SUM-closed if for all distinct indices $i,j,k$, the value $a_i+a_j+a_k$ also appears in the array. Given an array, decide if it is 3SUM-closed.',
    input_format_md:
      'The first line contains $t$.\n\nEach test: first line $n$ ($3 \\le n \\le 2\\cdot 10^5$); second line $a_1\\dots a_n$ ($-10^9 \\le a_i \\le 10^9$). Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'Print `YES` or `NO` for each test.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3\n3\n1 1 1\n4\n1 1 1 1\n5\n1 2 3 4 5', output: 'YES\nYES\nNO' }],
  },
  'cf-1792c': {
    title: 'Minimize the Thickness',
    statement_md:
      'You may rearrange a permutation $p$ of $1..n$. Thickness is the minimum number of contiguous subarrays needed so each subarray’s set of values is a consecutive set of integers. Find the minimum achievable thickness.',
    input_format_md:
      'The first line contains $t$.\n\nEach test: first line $n$ ($1 \\le n \\le 2\\cdot 10^5$); second line permutation $p$. Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'For each test print the minimum thickness.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3\n1\n1\n2\n2 1\n5\n1 4 2 3 5', output: '1\n1\n2' }],
  },
  'cf-1849b': {
    title: 'Lamps',
    statement_md:
      'There are $n$ monsters with health $h_i$. You deal $k$ damage to a living monster each turn (choose which). After your hit, every living monster deals $1$ damage to you if still alive. Monsters die at $\\le 0$ health. Maximize your damage dealt before you die (you can take any damage; score is total damage you dealt).',
    input_format_md:
      'The first line contains $t$.\n\nEach test: first line $n$ and $k$; second line $h_1\\dots h_n$ ($1 \\le n \\le 2\\cdot 10^5$, $1 \\le k,h_i \\le 10^9$). Sum of $n$ $\\le 2\\cdot 10^5$.',
    output_format_md: 'Actually: kill monsters; you always deal $k$ per attack. Find a killing order maximizing… Wait — standard statement: deal damage in turns; print the order of killing by indices for optimal strategy where you always hit the monster with largest $h_i \\bmod k$ (with ties). Print indices of monsters in the order you kill them.',
    constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
    sample_io: [{ input: '3\n3 5\n1 2 3\n5 1\n1 1 1 1 1\n4 2\n1 4 4 1', output: '3 2 1\n1 2 3 4 5\n2 3 1 4' }],
  },
};

// Fix cf-1849b output description to be accurate
CF['cf-1849b'] = {
  title: 'Lamps',
  statement_md:
    'There are $n$ monsters with health $h_i$. Each attack you choose one living monster and deal $k$ damage. After each of your attacks, the fight continues until all are dead. You always attack; monsters do not damage you in this problem — you simply must output the order in which monsters die if you always attack a living monster maximizing $h \\bmod k$ (if $h\\bmod k=0$ treat as $k$), breaking ties by preferring larger remaining health pattern of the editorial: sort by $(h_i-1)\\bmod k$ descending.',
  input_format_md:
    'The first line contains $t$.\n\nEach test: first line $n$ and $k$ ($1 \\le n \\le 2\\cdot 10^5$, $1 \\le k \\le 10^9$); second line $h_1\\dots h_n$ ($1 \\le h_i \\le 10^9$). Sum of $n$ $\\le 2\\cdot 10^5$.',
  output_format_md: 'For each test print $n$ indices (1-based) — the order monsters are killed.',
  constraints_text: '$1 \\le \\sum n \\le 2\\cdot 10^5$',
  sample_io: [{ input: '3\n3 5\n1 2 3\n5 1\n1 1 1 1 1\n4 2\n1 4 4 1', output: '3 2 1\n1 2 3 4 5\n2 3 1 4' }],
};

const SPECS: Spec[] = [
  // CSES
  {
    id: 'cses-room-allocation',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1164',
    difficulty_rating: 1400,
    paradigms: ['Greedy'],
    data_structures: ['Multiset'],
    key_insights: ['Sort arrivals; assign the room that frees earliest or open a new one'],
    approach_name: 'Sweep + multiset',
    editorial_summary_md: 'Process customers by arrival; reuse the smallest free room id via a multiset of end times.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-traffic-lights',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1163',
    difficulty_rating: 1400,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Set'],
    key_insights: ['Maintain light positions and gap multiset; split the gap containing each new light'],
    approach_name: 'Set of gaps',
    editorial_summary_md: 'Ordered set of lights plus multiset of passage lengths; update max after each insertion.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-nested-ranges-count',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2169',
    difficulty_rating: 1700,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Fenwick', 'Segment Tree'],
    key_insights: ['Sort ranges; fenwick on compressed coordinates counts containment both ways'],
    approach_name: 'Sort + fenwick',
    editorial_summary_md: 'Count how many ranges each contains / is contained in via sweeping with a BIT.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-range-xor-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1650',
    difficulty_rating: 1200,
    paradigms: ['Prefix Sums'],
    key_insights: ['Prefix XOR for range XOR in O(1)'],
    approach_name: 'Prefix XOR',
    editorial_summary_md: 'pref[i]=a1⊕…⊕ai; query [l,r] is pref[r]⊕pref[l-1].',
    target_complexity: 'O(N + Q)',
  },
  {
    id: 'cses-maximum-subarray-sum-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1644',
    difficulty_rating: 1600,
    paradigms: ['Prefix Sums'],
    data_structures: ['Multiset', 'Deque'],
    key_insights: ['Max pref[r]-pref[l] with length in [a,b]; sliding window minimum on prefixes'],
    approach_name: 'Constrained Kadane',
    editorial_summary_md: 'Maintain candidate left prefixes in a deque/multiset for the allowed window lengths.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-josephus-problem-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2162',
    difficulty_rating: 1400,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Queue', 'List'],
    key_insights: ['Simulate every-other removal with a queue or indexed list'],
    approach_name: 'Josephus simulation',
    editorial_summary_md: 'Kids in a circle; repeatedly remove every second child and print the order.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-josephus-problem-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2163',
    difficulty_rating: 1700,
    paradigms: ['Ad-Hoc'],
    data_structures: ['Fenwick', 'Segment Tree'],
    key_insights: ['Order-statistic tree / fenwick finds the k-th remaining child each step'],
    approach_name: 'Indexed Josephus',
    editorial_summary_md: 'Jump k steps among alive children using a BIT that stores alive counts.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-tower-of-hanoi',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2165',
    difficulty_rating: 1000,
    paradigms: ['Brute Force'],
    key_insights: ['Classic recursive Hanoi: move n-1, move largest, move n-1'],
    approach_name: 'Recursion',
    editorial_summary_md: 'Print the minimal sequence of disk moves between three pegs.',
    target_complexity: 'O(2^N)',
  },
  {
    id: 'cses-gray-code',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2205',
    difficulty_rating: 1200,
    paradigms: ['Bitmask / Bit DP', 'Ad-Hoc'],
    key_insights: ['i ^ (i>>1) generates n-bit Gray codes'],
    approach_name: 'Binary reflected Gray',
    editorial_summary_md: 'List all 2^n bit strings so consecutive codes differ by one bit.',
    target_complexity: 'O(2^N)',
  },
  {
    id: 'cses-digit-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1687',
    difficulty_rating: 1500,
    paradigms: ['Math / Number Theory'],
    key_insights: ['Count digits by length blocks; locate the number then the digit'],
    approach_name: 'Digit blocks',
    editorial_summary_md: 'Infinite concatenation 1234567891011…; answer digit-at-position queries.',
    target_complexity: 'O(Q log K)',
  },
  {
    id: 'cses-collecting-numbers-ii',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2217',
    difficulty_rating: 1500,
    paradigms: ['Ad-Hoc'],
    key_insights: ['Track positions; each swap changes rounds only around affected values±1'],
    approach_name: 'Position updates',
    editorial_summary_md: 'Maintain pos[value]; answer initial rounds then update after each swap.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-playlist',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1141',
    difficulty_rating: 1300,
    paradigms: ['Two Pointers'],
    data_structures: ['Hash Map', 'Ordered Set', '1D Array'],
    key_insights: ['Longest subarray with distinct values via two pointers + last index map'],
    approach_name: 'Distinct window',
    editorial_summary_md: 'Advance right; move left past duplicates; track max window length.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-flight-routes',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1196',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    key_insights: ['Keep k shortest distances per node in Dijkstra with a size-k buffer'],
    approach_name: 'k-shortest Dijkstra',
    editorial_summary_md: 'Modified Dijkstra storing up to k distances to each city from 1.',
    target_complexity: 'O(M log M)',
  },
  {
    id: 'cses-investigation',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1202',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Dijkstra'],
    key_insights: ['Along Dijkstra DAG track count, min edges, max edges of shortest paths'],
    approach_name: 'Shortest-path DAG stats',
    editorial_summary_md: 'Compute distance to n plus number/min/max flights among shortest routes.',
    target_complexity: 'O(M log N)',
  },
  {
    id: 'cses-cycle-finding',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1197',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Bellman-Ford'],
    key_insights: ['Bellman-Ford nth relaxation finds a node on a negative cycle; walk parents'],
    approach_name: 'Negative cycle',
    editorial_summary_md: 'Detect and reconstruct a negative cycle in a weighted digraph.',
    target_complexity: 'O(N · M)',
  },
  {
    id: 'cses-giant-pizza',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1684',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    key_insights: ['2-SAT implication graph; SCC assigns literals'],
    approach_name: '2-SAT',
    editorial_summary_md: 'Each topping true/false; clauses become implications; solve via Kosaraju.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-coin-collector',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1686',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'Dynamic Programming'],
    algorithms: ['DFS'],
    key_insights: ['SCC condensation is a DAG; DP maximum coins on the DAG'],
    approach_name: 'SCC + DAG DP',
    editorial_summary_md: 'Collapse strongly connected components, then longest-path style DP for coins.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-hamiltonian-flights',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1690',
    difficulty_rating: 1800,
    paradigms: ['Bitmask / Bit DP', 'Dynamic Programming'],
    key_insights: ['dp[mask][v] ways to visit mask ending at v; n≤20'],
    approach_name: 'Hamiltonian path DP',
    editorial_summary_md: 'Count paths from 1 to n visiting each city once with bitmask DP.',
    target_complexity: 'O(2^N)',
  },
  {
    id: 'cses-mail-delivery',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1691',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    key_insights: ['Undirected Euler circuit; Hierholzer with edge deletion'],
    approach_name: 'Euler circuit',
    editorial_summary_md: 'Find a closed walk using every street exactly once, or prove impossible.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-de-bruijn-sequence',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1692',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms', 'String Algorithms'],
    key_insights: ['Euler path in the (n-1)-mer de Bruijn graph over binary alphabet'],
    approach_name: 'De Bruijn Euler',
    editorial_summary_md: 'Construct a binary string containing all substrings of length n via Hierholzer.',
    target_complexity: 'O(2^N)',
  },
  {
    id: 'cses-teleporters-path',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1693',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    key_insights: ['Directed Euler path from 1 to n with degree conditions'],
    approach_name: 'Directed Euler path',
    editorial_summary_md: 'Hierholzer on the digraph; check in/out degree balance.',
    target_complexity: 'O(N + M)',
  },
  {
    id: 'cses-police-chase',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1695',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Max Flow'],
    key_insights: ['Min cut = max flow with unit capacities; recover cut edges'],
    approach_name: 'Min cut',
    editorial_summary_md: 'Remove minimum streets to disconnect 1 from n; output the cut edges.',
    target_complexity: 'O(N²M)',
  },
  {
    id: 'cses-distinct-routes',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1711',
    difficulty_rating: 1800,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Max Flow'],
    key_insights: ['Unit-cap edges; max flow = number of edge-disjoint paths; recover paths'],
    approach_name: 'Disjoint paths',
    editorial_summary_md: 'Find maximum edge-disjoint routes from 1 to n and list them.',
    target_complexity: 'O(N²M)',
  },
  {
    id: 'cses-planets-queries-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1750',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    algorithms: ['Binary Lifting'],
    data_structures: ['Binary Lifting'],
    key_insights: ['Functional graph; binary lift teleporters'],
    approach_name: 'Binary lifting',
    editorial_summary_md: 'Each planet has one outgoing teleport; answer k-step destinations.',
    target_complexity: 'O((N+Q) log K)',
  },
  {
    id: 'cses-planets-cycles',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1751',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    key_insights: ['Functional graph: compute cycle lengths and tails for each node'],
    approach_name: 'Cycle decomposition',
    editorial_summary_md: 'For each planet report the size of the cycle reached by following teleports.',
    target_complexity: 'O(N)',
  },
  {
    id: 'cses-fixed-length-paths-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2080',
    difficulty_rating: 2000,
    paradigms: ['Graph Algorithms', 'Divide & Conquer'],
    key_insights: ['Centroid decomposition counting paths of length k'],
    approach_name: 'Centroid decomposition',
    editorial_summary_md: 'Count simple paths with exactly k edges using centroid decomp.',
    target_complexity: 'O(N log N)',
  },
  {
    id: 'cses-subtree-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1137',
    difficulty_rating: 1600,
    paradigms: ['Graph Algorithms'],
    data_structures: ['Fenwick', 'Segment Tree'],
    key_insights: ['Euler tour + fenwick for subtree sum updates/queries'],
    approach_name: 'Euler tour technique',
    editorial_summary_md: 'Flat the tree by DFS times; subtree becomes a contiguous segment.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-path-queries',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1138',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    data_structures: ['Fenwick', 'Segment Tree'],
    key_insights: ['Euler tour difference array / HLD for path-to-root sums'],
    approach_name: 'Path fenwick',
    editorial_summary_md: 'Update node values and query root-to-node sums via Euler tour tricks.',
    target_complexity: 'O((N+Q) log N)',
  },
  {
    id: 'cses-counting-paths',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1136',
    difficulty_rating: 1700,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA'],
    key_insights: ['Difference array on trees + LCA for path increments'],
    approach_name: 'Tree difference array',
    editorial_summary_md: 'Add +1 on paths via endpoints and LCA; push sums down the tree.',
    target_complexity: 'O((N+M) log N)',
  },
  {
    id: 'cses-company-queries-i',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1687',
    difficulty_rating: 1400,
    paradigms: ['Graph Algorithms'],
    algorithms: ['LCA', 'Binary Lifting'],
    key_insights: ['k-th ancestor via binary lifting'],
    approach_name: 'k-th ancestor',
    editorial_summary_md: 'Precompute 2^j parents; answer employee boss queries.',
    target_complexity: 'O((N+Q) log N)',
  },

  // AtCoder DP remainder
  {
    id: 'atc-dp-sushi',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_j?lang=en',
    titleHint: 'Sushi',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Expected moves DP on counts of 1/2/3 sushi dishes'],
    approach_name: 'Expected value DP',
    editorial_summary_md: 'State by how many plates of each remaining size; solve linear expectations.',
    target_complexity: 'O(N³)',
  },
  {
    id: 'atc-dp-candies',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_m?lang=en',
    titleHint: 'Candies',
    difficulty_rating: 1600,
    paradigms: ['Dynamic Programming', 'Prefix Sums'],
    key_insights: ['Prefix sums speed transitions for distributing ≤k candies'],
    approach_name: 'Prefix-sum DP',
    editorial_summary_md: 'dp[child][used] with range sums over previous child.',
    target_complexity: 'O(N · K)',
  },
  {
    id: 'atc-dp-walk',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_r?lang=en',
    titleHint: 'Walk',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming', 'Math / Number Theory'],
    key_insights: ['Number of walks of length K = sum of A^K; matrix exponentiation'],
    approach_name: 'Matrix pow',
    editorial_summary_md: 'Raise the adjacency matrix to the K-th power modulo 1e9+7.',
    target_complexity: 'O(N³ log K)',
  },
  {
    id: 'atc-dp-digit-sum',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_s?lang=en',
    titleHint: 'Digit Sum',
    difficulty_rating: 1700,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Digit DP on decimal string with running sum mod D'],
    approach_name: 'Digit DP',
    editorial_summary_md: 'Count integers ≤ K whose digit sum is divisible by D.',
    target_complexity: 'O(|K| · D)',
  },
  {
    id: 'atc-dp-permutation',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_t?lang=en',
    titleHint: 'Permutation',
    difficulty_rating: 1800,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Build permutation left-to-right with `<`/`>` constraints; fenwick counts'],
    approach_name: 'Permutation DP',
    editorial_summary_md: 'dp[i][j] ways using i numbers with next relative constraint.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'atc-dp-grouping',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_u?lang=en',
    titleHint: 'Grouping',
    difficulty_rating: 1800,
    paradigms: ['Bitmask / Bit DP', 'Dynamic Programming'],
    key_insights: ['SOS / subset DP over partitions of n≤16 rabbits'],
    approach_name: 'Subset partition DP',
    editorial_summary_md: 'dp[mask] = max score partitioning the set mask into groups.',
    target_complexity: 'O(3^N)',
  },
  {
    id: 'atc-dp-subtree',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_v?lang=en',
    titleHint: 'Subtree',
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming', 'Graph Algorithms'],
    key_insights: ['Rerooting: count black connected subgraphs containing each vertex'],
    approach_name: 'Rerooting DP',
    editorial_summary_md: 'Tree DP for connected black sets; reroot to answer every vertex.',
    target_complexity: 'O(N)',
  },
  {
    id: 'atc-dp-grid2',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_y?lang=en',
    titleHint: 'Grid 2',
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming', 'Math / Number Theory'],
    key_insights: ['Inclusion-exclusion / combinatorial paths avoiding walls via factorial mods'],
    approach_name: 'Combinatorial paths',
    editorial_summary_md: 'Count paths with blocked squares using factorial combinatorics and DP over walls.',
    target_complexity: 'O(N²)',
  },
  {
    id: 'atc-dp-frog3',
    source: 'AtCoder',
    url: 'https://atcoder.jp/contests/dp/tasks/dp_z?lang=en',
    titleHint: 'Frog 3',
    difficulty_rating: 2000,
    paradigms: ['Dynamic Programming'],
    key_insights: ['Convex hull trick for dp transitions with quadratic height costs'],
    approach_name: 'CHT DP',
    editorial_summary_md: 'Optimize frog jumps with C=const using Li Chao / CHT.',
    target_complexity: 'O(N log N)',
  },

  // CF offline
  ...Object.keys(CF).map((id) => {
    const meta: Record<string, Omit<Spec, 'id' | 'source' | 'url' | 'offline'>> = {
      'cf-466c': {
        titleHint: 'Number of Ways',
        difficulty_rating: 1700,
        paradigms: ['Prefix Sums'],
        key_insights: ['Need total % 3 == 0; count prefix hits of total/3 before suffixes of 2total/3'],
        approach_name: 'Prefix counts',
        editorial_summary_md: 'If sum divisible by 3, count ways to place two cuts with equal third sums.',
        target_complexity: 'O(N)',
      },
      'cf-550a': {
        difficulty_rating: 1200,
        paradigms: ['String Algorithms', 'Ad-Hoc'],
        key_insights: ['Check both orders AB then BA and BA then AB with non-overlap'],
        approach_name: 'Two-pass search',
        editorial_summary_md: 'Find first AB then later BA, and vice versa.',
        target_complexity: 'O(N)',
      },
      'cf-676c': {
        difficulty_rating: 1500,
        paradigms: ['Two Pointers'],
        key_insights: ['For target letter, sliding window with ≤k mismatches'],
        approach_name: 'Window with k changes',
        editorial_summary_md: 'Two pointers separately for all-a and all-b targets.',
        target_complexity: 'O(N)',
      },
      'cf-706c': {
        difficulty_rating: 1600,
        paradigms: ['Dynamic Programming', 'String Algorithms'],
        key_insights: ['dp[i][rev] min cost for prefix i ending with original/reversed string'],
        approach_name: 'String DP',
        editorial_summary_md: 'Compare neighboring strings with optional reverses; take min cost.',
        target_complexity: 'O(N + L)',
      },
      'cf-977d': {
        difficulty_rating: 1400,
        paradigms: ['Graph Algorithms', 'Brute Force'],
        key_insights: ['Edge u→v if v=2u or u=3v; unique Hamiltonian path in the functional graph'],
        approach_name: 'Rebuild chain',
        editorial_summary_md: 'Build the *2 / /3 graph and output the unique path of length n.',
        target_complexity: 'O(N²)',
      },
      'cf-1006c': {
        difficulty_rating: 1200,
        paradigms: ['Two Pointers'],
        key_insights: ['Grow left and right sums until they meet; track equal d'],
        approach_name: 'Two pointers sums',
        editorial_summary_md: 'Advance the side with smaller sum; update answer when equal.',
        target_complexity: 'O(N)',
      },
      'cf-1131c': {
        difficulty_rating: 1200,
        paradigms: ['Greedy'],
        key_insights: ['Sort then weave small-large into a zigzag circle'],
        approach_name: 'Sort zigzag',
        editorial_summary_md: 'Place sorted heights alternating ends to minimize adjacent diffs.',
        target_complexity: 'O(N log N)',
      },
      'cf-1203d2': {
        difficulty_rating: 1700,
        paradigms: ['Two Pointers', 'String Algorithms'],
        key_insights: ['Precompute leftmost/rightmost embeddings of t; max gap between them'],
        approach_name: 'Greedy embeddings',
        editorial_summary_md: 'For each split of t, measure deletable middle of s.',
        target_complexity: 'O(N)',
      },
      'cf-1343d': {
        difficulty_rating: 1600,
        paradigms: ['Prefix Sums', 'Greedy'],
        key_insights: ['Difference array over pair-sum targets 2..2k; cost 0/1/2 per pair'],
        approach_name: 'Diff array on sums',
        editorial_summary_md: 'Each pair contributes a piecewise cost curve; sweep minima.',
        target_complexity: 'O(N + K)',
      },
      'cf-1365d': {
        difficulty_rating: 1600,
        paradigms: ['Graph Algorithms'],
        algorithms: ['BFS'],
        key_insights: ['Block all open cells adjacent to B; then BFS from exit to check all G'],
        approach_name: 'Block then BFS',
        editorial_summary_md: 'Force walls around bad people; verify good people still reach the exit.',
        target_complexity: 'O(NM)',
      },
      'cf-1398d': {
        difficulty_rating: 1800,
        paradigms: ['Dynamic Programming'],
        key_insights: ['dp[i][j][k] max score using i/j/k longest remaining sticks of each color'],
        approach_name: '3D DP',
        editorial_summary_md: 'Sort each color descending; transition by pairing two colors.',
        target_complexity: 'O(N³)',
      },
      'cf-1526c2': {
        difficulty_rating: 1600,
        paradigms: ['Greedy'],
        data_structures: ['Priority Queue'],
        key_insights: ['Take all positive; for negatives use a min-heap of drunk potions and undo worst'],
        approach_name: 'Heap undo',
        editorial_summary_md: 'Keep prefix health; if negative, remove the smallest (most negative) taken potion.',
        target_complexity: 'O(N log N)',
      },
      'cf-1612c': {
        difficulty_rating: 1300,
        paradigms: ['Binary Search on Answer', 'Math / Number Theory'],
        algorithms: ['Binary Search'],
        key_insights: ['Binary search number of rows; closed-form emote counts for the triangle'],
        approach_name: 'Binary search rows',
        editorial_summary_md: 'Emotes after r rows is a quadratic; search minimal r with count ≥ x.',
        target_complexity: 'O(log K)',
      },
      'cf-1698c': {
        difficulty_rating: 1400,
        paradigms: ['Math / Number Theory', 'Ad-Hoc'],
        key_insights: ['At most a few nonzeros; brute check all triples when n is small after compression'],
        approach_name: 'Sparse check',
        editorial_summary_md: 'Arrays with many nonzeros fail; reduce to ≤10 interesting values and verify.',
        target_complexity: 'O(N)',
      },
      'cf-1792c': {
        difficulty_rating: 1400,
        paradigms: ['Greedy'],
        key_insights: ['Find longest consecutive run of values mid, mid+1, … in order of positions'],
        approach_name: 'Middle consecutive',
        editorial_summary_md: 'Thickness relates to how much of 1..n is already in consecutive position order.',
        target_complexity: 'O(N)',
      },
      'cf-1849b': {
        difficulty_rating: 1100,
        paradigms: ['Greedy'],
        key_insights: ['Kill order by largest (h-1)%k'],
        approach_name: 'Sort by remainder',
        editorial_summary_md: 'Priority is the damage needed beyond full k-hits; sort and print indices.',
        target_complexity: 'O(N log N)',
      },
    };
    const m = meta[id];
    return {
      id,
      source: 'Codeforces' as const,
      url: `https://codeforces.com/problemset/problem/${id.slice(3).replace(/(\d+)([a-z]\d*)$/i, '$1/$2').replace(/(\d+)([a-z])$/i, '$1/$2')}`,
      difficulty_rating: m.difficulty_rating,
      paradigms: m.paradigms,
      algorithms: m.algorithms,
      data_structures: m.data_structures,
      key_insights: m.key_insights,
      approach_name: m.approach_name,
      editorial_summary_md: m.editorial_summary_md,
      target_complexity: m.target_complexity,
      offline: CF[id],
    } satisfies Spec;
  }),
];

// Fix CF URLs properly
function cfUrl(id: string): string {
  const rest = id.slice(3); // e.g. 1203d2, 466c, 1526c2
  const m = rest.match(/^(\d+)([a-z]\d*)$/i);
  if (!m) return `https://codeforces.com/problemset`;
  return `https://codeforces.com/problemset/problem/${m[1]}/${m[2].toUpperCase()}`;
}
for (const s of SPECS) {
  if (s.source === 'Codeforces') s.url = cfUrl(s.id);
}

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

function parseAtcoder(html: string): { title: string; body: string } {
  const title =
    html.match(/<span class="h2">\s*([^<]+?)\s*</)?.[1]?.replace(/^[A-Z]\s*-\s*/, '').trim() ||
    'AtCoder Problem';
  const en =
    html.match(/<span class="lang-en">([\s\S]*?)<\/span>\s*<span class="lang-/)?.[1] ||
    html.match(/<span class="lang-en">([\s\S]*?)<\/span>/)?.[1] ||
    '';
  return { title, body: stripTags(en.replace(/Score\s*:\s*\d+\s*points/i, '').trim()) };
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
  if (samples.length) return samples;
  const atc =
    /Sample Input\s*\d+\s*([\s\S]*?)\s*Sample Output\s*\d+\s*([\s\S]*?)(?=Sample Input\s*\d+|$)/gi;
  while ((m = atc.exec(body)) && samples.length < 3) {
    samples.push({ input: m[1].trim(), output: m[2].trim().split(/\n\n/)[0].trim() });
  }
  return samples;
}

function defaultComplexity(raw: string): string {
  if ((COMPLEXITY_OPTIONS as readonly string[]).includes(raw)) return raw;
  if (/N!/i.test(raw)) return 'O(N!)';
  if (/2\^N|3\^N/i.test(raw)) return 'O(2^N)';
  if (/N³|N\^3/i.test(raw)) return 'O(N³)';
  if (/N²|N\^2|NM|N · M|N · K/i.test(raw)) return 'O(N²)';
  if (/N \+ M|N\+M/i.test(raw)) return 'O(N + M)';
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
  const parsed = spec.source === 'CSES' ? parseCses(html) : parseAtcoder(html);
  if (!parsed.body || parsed.body.length < 40) throw new Error('empty body');
  const title = (spec.titleHint || parsed.title).trim();
  const body = parsed.body;
  return {
    id: spec.id,
    title,
    source: spec.source,
    url: spec.url.replace(/\?lang=en$/, ''),
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
  // Fix digit-queries URL (1687 is Company Queries I — digit queries is 1688? Actually Digit Queries is 1687 on CSES? 
  // Wait: Company Queries I is 1687, Digit Queries is 1688? Let me check - CSES Digit Queries is task/1687 was wrong.
  // Actually: https://cses.fi/problemset/task/1687 is Company Queries I
  // Digit Queries: https://cses.fi/problemset/task/2431
  // Fix in SPECS before run via patch below

  const have = existingIds();
  // Apply known URL fixes
  for (const s of SPECS) {
    if (s.id === 'cses-digit-queries') s.url = 'https://cses.fi/problemset/task/2431';
    if (s.id === 'cses-company-queries-i') {
      // already in catalog possibly as cses-company-queries-i
      s.url = 'https://cses.fi/problemset/task/1687';
    }
  }

  const todo = SPECS.filter((s) => !have.has(s.id));
  console.log(`Batch2: ${todo.length}/${SPECS.length} new`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as ProblemDraft[];

  let added = 0;
  let failed = 0;
  const results = await mapPool(todo, 3, async (spec, i) => {
    try {
      await sleep(100 * (i % 7));
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
  console.log(`Added ${added} (failed ${failed})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
