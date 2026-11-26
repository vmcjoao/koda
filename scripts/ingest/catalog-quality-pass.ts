/**
 * Curated catalog quality pass: replace VJudge stub approaches and expand thin statements.
 * Usage: npx tsx scripts/ingest/catalog-quality-pass.ts && npm run generate:seed
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

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

type Problem = {
  id: string;
  title: string;
  statement_md: string;
  constraints_text: string;
  target_complexity: string;
  approaches: Approach[];
  [key: string]: unknown;
};

type Patch = {
  approach_name: string;
  paradigms: string[];
  algorithms?: string[];
  data_structures?: string[];
  key_insights: string[];
  editorial_summary_md: string;
  target_complexity?: string;
  statement_md?: string;
  constraints_text?: string;
};

const PATCHES: Record<string, Patch> = {
  'uva-10305': {
    approach_name: 'Topological sort',
    paradigms: ['Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Stack', '1D Array'],
    key_insights: [
      'Edge u→v means u before v in any valid order',
      'Kahn indegree queue or DFS finish-time reverse both work',
    ],
    editorial_summary_md:
      'Build the DAG of prerequisites. Emit a topological order (Kahn or DFS). Any valid topo order is accepted.',
    target_complexity: 'O(N + M)',
  },
  'uva-200': {
    approach_name: 'Letter graph topo',
    paradigms: ['Graph Algorithms'],
    algorithms: ['Topological Sort', 'DFS'],
    data_structures: ['Stack'],
    key_insights: [
      'Compare consecutive words; first mismatch gives a precedence edge',
      'Topo-order the implied alphabet',
    ],
    editorial_summary_md:
      'From consecutive sorted words, the first differing characters yield directed edges (earlier letter → later). Topologically sort the letters that appear.',
    target_complexity: 'O(L)',
    statement_md:
      'You are given a list of words sorted in an unknown alphabet order (one word per line, ending with `#`). Infer a total order of the letters consistent with the sorted list.\n\nCompare each pair of consecutive words: the first position where they differ gives a precedence constraint between two letters. Output one valid alphabet order.',
  },
  'uva-543': {
    approach_name: 'Goldbach via sieve',
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    data_structures: ['1D Array'],
    key_insights: [
      'Sieve primes up to n',
      'For even n find smallest prime p with n−p prime',
    ],
    editorial_summary_md:
      'Sieve odds up to the maximum n. For each even n print `n = p + q` with the smallest odd prime p such that n−p is prime (Goldbach verification).',
    target_complexity: 'O(N log log N)',
  },
  'uva-10140': {
    approach_name: 'Segmented prime gaps',
    paradigms: ['Math / Number Theory'],
    algorithms: ['Sieve'],
    data_structures: ['1D Array'],
    key_insights: [
      'Segment-sieve [L,U]',
      'Track consecutive primes for closest / most distant pairs',
    ],
    editorial_summary_md:
      'Segment-sieve the inclusive range. Scan consecutive primes to report the closest and most distant adjacent pairs (or “no primes” cases).',
    target_complexity: 'O((U−L+1) log log U)',
  },
  'uva-10079': {
    approach_name: 'Pizza cut formula',
    paradigms: ['Math / Number Theory', 'Ad-Hoc'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Maximum pieces with n cuts is 1 + n(n+1)/2',
      'Each new cut crosses all previous cuts',
    ],
    editorial_summary_md:
      'The maximum number of pieces with $n$ cuts is $1 + n(n+1)/2$. Answer each query with 64-bit integers; stop at $n<0$.',
    target_complexity: 'O(1)',
  },
  'uva-1225': {
    approach_name: 'Digit frequency scan',
    paradigms: ['Ad-Hoc', 'Math / Number Theory'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: [
      'Write all numbers 1..n concatenated',
      'Count digit occurrences 0–9',
    ],
    editorial_summary_md:
      'For each n, count how often digits 0–9 appear when writing 1,2,…,n in decimal. Brute force is fine under the limits.',
    target_complexity: 'O(N log N)',
  },
  'uva-10035': {
    approach_name: 'Count carries',
    paradigms: ['Ad-Hoc', 'Math / Number Theory'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Add digit-wise from the right',
      'Carry when sum ≥ 10',
    ],
    editorial_summary_md:
      'Simulate schoolbook addition from least significant digit. Count how many times a carry is generated.',
    target_complexity: 'O(D)',
  },
  'uva-10018': {
    approach_name: 'Reverse and add',
    paradigms: ['Ad-Hoc'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Reverse decimal digits and add until palindrome',
      'Count iterations (guaranteed small here)',
    ],
    editorial_summary_md:
      'While the number is not a palindrome, reverse its digits and add. Print iteration count and the resulting palindrome.',
    target_complexity: 'O(I · D)',
  },
  'uva-11988': {
    approach_name: 'Home/End with list',
    paradigms: ['Ad-Hoc'],
    algorithms: [],
    data_structures: ['Deque', 'Linked List'],
    key_insights: [
      '`[` moves cursor to front; `]` to back',
      'Maintain a list of chunks or a linked list of characters',
    ],
    editorial_summary_md:
      'Treat `[` / `]` as Home / End. Insert typed characters at the current cursor. A deque of strings (or a linked list) models the broken keyboard efficiently.',
    target_complexity: 'O(N)',
  },
  'uva-10336': {
    approach_name: 'Flood-fill languages',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'BFS'],
    data_structures: ['2D Array'],
    key_insights: [
      'Each connected component of equal letters is one world',
      'Rank languages by world count, then name',
    ],
    editorial_summary_md:
      'Flood-fill / DFS each unvisited cell; same letters 4-adjacent form a world. Aggregate per language and sort by frequency descending, name ascending.',
    target_complexity: 'O(HW)',
  },
  'uva-784': {
    approach_name: 'Maze flood fill',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS', 'BFS'],
    data_structures: ['2D Array'],
    key_insights: [
      'Start from the marked room cell',
      'Paint reachable empty spaces',
    ],
    editorial_summary_md:
      'Find the starting marker and flood-fill all reachable empty cells inside walls. Print the painted maze for each case.',
    target_complexity: 'O(HW)',
  },
  'uva-10600': {
    approach_name: 'MST + second-best MST',
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['MST (Kruskal)', 'DSU'],
    data_structures: ['Union-Find'],
    key_insights: [
      'Kruskal gives the minimum spanning cost',
      'Second-best: for each MST edge, force-exclude it and rebuild',
    ],
    editorial_summary_md:
      'Compute the MST cost with Kruskal. For the second-best network, try excluding each MST edge in turn and take the minimum alternative spanning cost.',
    target_complexity: 'O(M log M · N)',
  },
  'uva-264': {
    approach_name: 'Cantor diagonal index',
    paradigms: ['Math / Number Theory', 'Ad-Hoc'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Find diagonal d with triangular numbers',
      'Position on the diagonal gives numerator/denominator',
    ],
    editorial_summary_md:
      'Locate the diagonal containing term n via triangular numbers, then walk the zig-zag to recover the fraction a/b.',
    target_complexity: 'O(√N)',
  },
  'uva-10105': {
    approach_name: 'Multinomial coefficient',
    paradigms: ['Math / Number Theory'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Coefficient is n! / (n1! n2! … nk!)',
      'Compute with 64-bit factorials under limits',
    ],
    editorial_summary_md:
      'The multinomial coefficient $n!/(n_1!\\cdots n_k!)$ is the answer. Precompute factorials or multiply carefully with 64-bit ints.',
    target_complexity: 'O(N)',
  },
  'uva-10346': {
    approach_name: 'Cigarette butts loop',
    paradigms: ['Ad-Hoc', 'Math / Number Theory'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Smoke n, keep stubs; every k stubs → +1 cigarette',
      'Iterate until stubs < k',
    ],
    editorial_summary_md:
      'Simulate: while stubs ≥ k, trade k stubs for one more smoke (+1 stub left over). Total smoked is the answer.',
    target_complexity: 'O(N/k)',
  },
  'spoj-stpar': {
    approach_name: 'Stack side street',
    paradigms: ['Ad-Hoc'],
    algorithms: [],
    data_structures: ['Stack'],
    key_insights: [
      'Want cars in order 1,2,3,…',
      'Side street is a stack; pop when top is next needed',
    ],
    editorial_summary_md:
      'Greedily send the next required love mobile straight through, otherwise push onto the side-street stack. Feasible iff you can empty into sorted order.',
    target_complexity: 'O(N)',
  },
  'spoj-anarc09a': {
    approach_name: 'Bracket fix count',
    paradigms: ['Ad-Hoc'],
    algorithms: [],
    data_structures: ['Stack'],
    key_insights: [
      'Balance scan with a counter / stack',
      'Each mismatch flip costs 1',
    ],
    editorial_summary_md:
      'Scan braces maintaining balance. Every time balance would go negative, flip a `}` → `{` (cost 1). Leftover opens need half flips. Classic minimum flips to valid sequence.',
    target_complexity: 'O(N)',
  },
  'spoj-tubos': {
    approach_name: 'Bridge check',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['1D Array'],
    key_insights: [
      'Critical tube = bridge',
      'tin/low DFS; bridge when low[v] > tin[u]',
    ],
    editorial_summary_md:
      'The network fails a single cut iff the undirected graph has a bridge. Run discovery/low DFS and test the bridge condition.',
    target_complexity: 'O(N + M)',
  },
  'usaco-531': {
    approach_name: 'Maximum spanning tree',
    paradigms: ['Graph Algorithms', 'Greedy'],
    algorithms: ['MST (Kruskal)', 'DSU'],
    data_structures: ['Union-Find'],
    key_insights: [
      'Game score between i,j is |s_i−s_j|',
      'Maximum total is the MST of the complete graph with those weights (max spanning)',
    ],
    editorial_summary_md:
      'Model teams as complete-graph edges weighted by score differences. The maximum tournament sum is the maximum spanning tree (Kruskal on edges sorted descending).',
    target_complexity: 'O(N² log N)',
  },
  'usaco-620': {
    approach_name: 'Unbounded knapsack milk',
    paradigms: ['Dynamic Programming'],
    algorithms: ['Knapsack'],
    data_structures: ['1D Array'],
    key_insights: [
      'dp[x] = min cost to make exactly x units',
      'Each package type usable any number of times',
    ],
    editorial_summary_md:
      'Classic unbounded knapsack: `dp[x]` = minimum cost to obtain exactly x units of milk. Transition by each package. Answer `dp[M]` (or impossible).',
    target_complexity: 'O(N · M)',
  },
  'cf-158a': {
    approach_name: 'Threshold k-th place',
    paradigms: ['Ad-Hoc'],
    algorithms: ['Sorting'],
    data_structures: ['1D Array'],
    key_insights: [
      'Advance if score ≥ score of k-th and score > 0',
    ],
    editorial_summary_md:
      'Let $t$ be the score of the $k$-th contestant. Count how many have score $\\ge t$ and $>0$.',
    target_complexity: 'O(N)',
  },
  'cf-617a': {
    approach_name: 'Ceil divide by 5',
    paradigms: ['Math / Number Theory', 'Greedy'],
    algorithms: [],
    data_structures: [],
    key_insights: ['Always take steps of size 5', 'Answer is ceil(x/5)'],
    editorial_summary_md: 'The elephant should always jump 5 when possible. Minimum steps = $\\lceil x/5 \\rceil$.',
    target_complexity: 'O(1)',
  },
  'cf-1427a': {
    approach_name: 'Avoid prefix-zero sum',
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: ['Sorting'],
    data_structures: ['1D Array'],
    key_insights: [
      'If total sum is 0 → NO',
      'Otherwise put positives first or negatives first so no prefix is 0',
    ],
    editorial_summary_md:
      'If the array sums to 0, impossible. Else sort ascending or descending so that no prefix sum hits 0 (put the side with larger absolute mass first).',
    target_complexity: 'O(N log N)',
  },
  'cf-847m': {
    approach_name: 'Arithmetic progression check',
    paradigms: ['Ad-Hoc', 'Math / Number Theory'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Check common difference of the sequence',
      'Next day continues the AP if valid',
    ],
    editorial_summary_md:
      'Verify the temperature list is an arithmetic progression. If yes, forecast the next term $a_n + d$; otherwise output $a_n$.',
    target_complexity: 'O(N)',
  },
  'cf-1265b': {
    approach_name: 'Permutation segments',
    paradigms: ['Ad-Hoc'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: [
      'Track positions of 1..n',
      'm is good iff values 1..m occupy a contiguous segment',
    ],
    editorial_summary_md:
      'Record the index of each value. For each m check that $\\max pos[1..m] - \\min pos[1..m] + 1 = m$.',
    target_complexity: 'O(N)',
  },
  'cf-981a': {
    approach_name: 'Longest non-palindrome substring',
    paradigms: ['Ad-Hoc', 'String Algorithms'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'If s not palindrome → answer |s|',
      'Else if all chars equal → 0, else |s|-1',
    ],
    editorial_summary_md:
      'Any string that is not a palindrome is already optimal. If it is a palindrome but not unary, drop one character; if unary, answer 0.',
    target_complexity: 'O(N)',
  },
  'cf-408a': {
    approach_name: 'Min cashier time',
    paradigms: ['Ad-Hoc', 'Greedy'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Each cashier time = 15s · items + 5s · people ahead? (per statement)',
      'Take minimum over cashiers',
    ],
    editorial_summary_md:
      'For each queue compute total service time from the given formula and report the minimum across cashiers.',
    target_complexity: 'O(N)',
  },
  'cf-810a': {
    approach_name: 'Add exams to raise average',
    paradigms: ['Math / Number Theory', 'Greedy'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Always add grade k to pull average up',
      'Binary search / closed form how many needed',
    ],
    editorial_summary_md:
      'Let S be the current sum. Adding x exams of grade k yields average $(S+kx)/(n+x) \\ge k-0.5$. Solve for minimal x (ceil formula).',
    target_complexity: 'O(1)',
  },
  'cf-863b': {
    approach_name: 'Remove two then pair adjacent',
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: ['Sorting'],
    data_structures: [],
    key_insights: [
      'Try every pair of people to exclude',
      'Sort remaining and sum |a[2i]-a[2i+1]|',
    ],
    editorial_summary_md:
      'Brute-force which two people sit out. Sort the rest and pair neighbors; instability is the sum of absolute differences. Take the minimum.',
    target_complexity: 'O(N³)',
  },
  'cf-1399a': {
    approach_name: 'Sort and check gaps',
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: ['Sorting'],
    data_structures: [],
    key_insights: [
      'After sorting, adjacent values must differ by ≤ 1 repeatedly',
      'Equivalent: max−min checks via chain of deletes',
    ],
    editorial_summary_md:
      'Sort the array. You can reduce to one element iff every adjacent pair differs by at most 1 (otherwise a gap blocks deletions).',
    target_complexity: 'O(N log N)',
  },
  'cses-1623': {
    approach_name: 'Meet-in-the-middle subset sums',
    paradigms: ['Brute Force', 'Meet in the Middle'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Partition into two halves of ≤20',
      'Enumerate subset sums; minimize |2S − total|',
    ],
    editorial_summary_md:
      'Split the n≤40 weights into two halves, enumerate all subset sums, and for each sum on the left binary-search the right to minimize the partition difference.',
    target_complexity: 'O(2^{n/2} · n)',
  },
  'cses-1622': {
    approach_name: 'Distinct permutations',
    paradigms: ['Brute Force', 'String Algorithms'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Generate next_permutation after sorting',
      'Duplicates skipped automatically by std::next_permutation',
    ],
    editorial_summary_md:
      'Sort the characters and emit every distinct `next_permutation`. Print the count then each string.',
    target_complexity: 'O(N! · N)',
  },
  'cf-474d': {
    approach_name: 'Flower DP prefix sums',
    paradigms: ['Dynamic Programming'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: [
      'dp[i] = ways to eat i flowers with no k consecutive reds constraint variant',
      'Prefix sums answer ranges',
    ],
    editorial_summary_md:
      'Let $dp[i]$ be ways to build a sequence of length i under the k-white rule. Recurrence mixes ending with red vs k whites. Prefix-sum $dp$ for range queries mod $10^9+7$.',
    target_complexity: 'O(MAX + Q)',
  },
  'cf-510b': {
    approach_name: 'Cycle in color grid',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['2D Array'],
    key_insights: [
      'DFS with parent skip',
      'Same-color 4-adjacent edge; cycle length ≥4 → Yes',
    ],
    editorial_summary_md:
      'Treat equal-colored 4-neighbors as edges. DFS detects a back-edge to a non-parent → cycle of length ≥ 4.',
    target_complexity: 'O(NM)',
  },
  'cf-149d': {
    approach_name: 'Bracket DP coloring',
    paradigms: ['Dynamic Programming', 'String Algorithms'],
    algorithms: [],
    data_structures: ['Stack'],
    key_insights: [
      'Match brackets with a stack',
      'Interval DP over matched pairs with color constraints',
    ],
    editorial_summary_md:
      'Parse matching pairs, then interval-DP the number of valid 3-colorings of brackets with adjacency constraints. Classic CF bracket DP.',
    target_complexity: 'O(N³)',
  },
  'cf-702a': {
    approach_name: 'Longest increasing run',
    paradigms: ['Ad-Hoc', 'Greedy'],
    algorithms: [],
    data_structures: [],
    key_insights: ['Scan left→right; reset streak when not strictly increasing'],
    editorial_summary_md:
      'Single pass: maintain the current strictly-increasing streak length and the maximum.',
    target_complexity: 'O(N)',
  },
  'cf-435a': {
    approach_name: 'Bus packing greedy',
    paradigms: ['Greedy', 'Ad-Hoc'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Fill groups into capacity m without splitting a group',
      'Start a new bus when the next group does not fit',
    ],
    editorial_summary_md:
      'Scan groups in order; keep a remaining capacity. Open a new bus whenever the next group exceeds the remainder.',
    target_complexity: 'O(N)',
  },
  'cf-300a': {
    approach_name: 'Partition into three sets',
    paradigms: ['Ad-Hoc', 'Math / Number Theory'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Need one negative set, one positive set, rest product positive',
      'Careful placement of zeros and leftover negatives',
    ],
    editorial_summary_md:
      'Construct three nonempty subsets with product negative / positive / positive as required by moving a few negatives and zeros deliberately.',
    target_complexity: 'O(N)',
  },
  'cf-1023b': {
    approach_name: 'Pair count to sum',
    paradigms: ['Math / Number Theory', 'Ad-Hoc'],
    algorithms: [],
    data_structures: [],
    key_insights: [
      'Count pairs 1≤a<b≤n with a+b=k',
      'Closed form from intersection of ranges',
    ],
    editorial_summary_md:
      'Pairs $(a,k-a)$ with $1\\le a<k-a\\le n$. Derive the count with a short closed form on $k$ vs $n$.',
    target_complexity: 'O(1)',
  },
  'cf-1728c': {
    approach_name: 'Priority queue digit length',
    paradigms: ['Greedy'],
    algorithms: [],
    data_structures: ['Priority Queue'],
    key_insights: [
      'Replace a number by digit-count until multisets match',
      'Always operate on current maximum',
    ],
    editorial_summary_md:
      'Use two heaps of the arrays. While tops differ, replace the larger top by its number of digits (one operation). Count operations.',
    target_complexity: 'O(N log N log A)',
  },
  // short-statement expansions
  'cf-665e': {
    approach_name: 'XOR trie subarrays',
    paradigms: ['String Algorithms', 'Data Structures'],
    algorithms: ['Trie'],
    data_structures: ['Trie'],
    key_insights: [
      'Prefix XOR; count pairs with xor ≥ k via binary trie',
    ],
    editorial_summary_md:
      'Maintain prefix XORs in a binary trie. For each prefix, query how many previous prefixes give XOR ≥ k, then insert.',
    target_complexity: 'O(N · 30)',
    statement_md:
      'You are given an array $a_1,\\ldots,a_n$ and an integer $k$. Count the number of subarrays whose XOR is at least $k$.\n\nConstraints typically allow $n \\le 10^6$, so an $O(n\\log A)$ binary-trie solution on prefix XORs is expected.',
  },
  'cf-160d': {
    approach_name: 'MST edge classification',
    paradigms: ['Graph Algorithms'],
    algorithms: ['MST (Kruskal)', 'DSU', 'DFS'],
    data_structures: ['Union-Find'],
    key_insights: [
      'Sort edges; process equal weights together',
      'Bridge in the contracted candidate graph ⇒ any MST; non-bridge ⇒ some; disconnected ⇒ none',
    ],
    editorial_summary_md:
      'Kruskal by weight. For each weight class, build the graph on DSU components and classify edges as bridges (any), non-bridges (some), or useless (none).',
    target_complexity: 'O(M log M)',
    statement_md:
      'Given a weighted undirected connected graph, for every edge decide whether it appears in **every** MST, in **some** but not all MSTs, or in **no** MST.',
  },
  'cf-86d': {
    approach_name: "Mo's algorithm frequency powers",
    paradigms: ['Ad-Hoc'],
    algorithms: ["Mo's Algorithm"],
    data_structures: ['1D Array'],
    key_insights: [
      'Answer = Σ freq[x]² · x',
      'Add/remove index updates freq and answer in O(1)',
    ],
    editorial_summary_md:
      "Offline Mo's algorithm on the array. Maintain frequencies and the running Σ freq²·value while expanding/shrinking the window.",
    target_complexity: 'O((N+Q)√N)',
    statement_md:
      'You are given an array $a$ and $q$ range queries. For each query $[l,r]$ compute $\\sum_x \\mathrm{freq}(x)^2 \\cdot x$ where frequencies are taken inside the range.',
  },
  'spoj-pt07z': {
    approach_name: 'Tree diameter two BFS',
    paradigms: ['Graph Algorithms'],
    algorithms: ['BFS', 'DFS'],
    data_structures: ['Queue'],
    key_insights: [
      'Diameter = longest simple path',
      'BFS from any node to farthest, BFS again',
    ],
    editorial_summary_md:
      'On a tree the diameter is found by two BFS/DFS: from an arbitrary node find the farthest u, then from u find the farthest v. Distance u–v is the answer.',
    target_complexity: 'O(N)',
    statement_md:
      'Given a tree with $n$ nodes (n−1 edges), find the number of edges on a longest simple path (the diameter).',
  },
  'koda-b9-br-01': {
    approach_name: 'Bridge-finding DFS',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['1D Array'],
    key_insights: ['low[v] > tin[u] marks bridge (u,v)'],
    editorial_summary_md:
      'Run the standard discovery/low-link DFS and collect edges satisfying `low[v] > tin[u]`.',
    target_complexity: 'O(N + M)',
    statement_md:
      'Given an undirected graph, list every bridge — an edge whose removal increases the number of connected components.',
  },
  'koda-b9-br-02': {
    approach_name: 'Articulation points',
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['1D Array'],
    key_insights: [
      'Root is articulation if ≥2 DFS children',
      'Non-root if some child has low[child] ≥ tin[u]',
    ],
    editorial_summary_md:
      'Same tin/low DFS as bridges. Count vertices that satisfy the articulation-point criteria.',
    target_complexity: 'O(N + M)',
    statement_md:
      'Given a connected undirected graph, count how many articulation points it has (vertices whose removal disconnects the graph).',
  },
};

function applyPatch(p: Problem, patch: Patch): void {
  const a = p.approaches[0] ?? {
    id: `${p.id}-a1`,
    problem_id: p.id,
    approach_name: '',
    paradigms: [],
    algorithms: [],
    data_structures: [],
    key_insights: [],
    editorial_summary_md: '',
  };
  a.approach_name = patch.approach_name;
  a.paradigms = patch.paradigms;
  a.algorithms = patch.algorithms ?? [];
  a.data_structures = patch.data_structures ?? [];
  a.key_insights = patch.key_insights;
  a.editorial_summary_md = patch.editorial_summary_md;
  a.problem_id = p.id;
  if (!a.id) a.id = `${p.id}-a1`;
  p.approaches = [a, ...p.approaches.slice(1)];
  if (patch.target_complexity) p.target_complexity = patch.target_complexity;
  if (patch.statement_md) p.statement_md = patch.statement_md;
  if (patch.constraints_text) p.constraints_text = patch.constraints_text;
}

function main() {
  const path = resolve('data/extra-problems.json');
  const problems = JSON.parse(readFileSync(path, 'utf8')) as Problem[];
  let applied = 0;
  let missing = 0;
  for (const [id, patch] of Object.entries(PATCHES)) {
    const p = problems.find((x) => x.id === id);
    if (!p) {
      missing += 1;
      console.warn('missing id', id);
      continue;
    }
    applyPatch(p, patch);
    applied += 1;
  }
  writeFileSync(path, JSON.stringify(problems, null, 2) + '\n');
  console.log(`Applied ${applied} patches (${missing} ids not found).`);
}

main();
