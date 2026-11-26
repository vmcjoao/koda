import type { LearnExercise } from '@/types/learn';

/** Extra beats merged into LESSON_EXERCISES for thin lessons. */
export const LESSON_EXERCISES_DEEPEN: Record<string, LearnExercise[]> = {
  greedy: [
    {
      id: 'greedy-proof',
      kind: 'mcq',
      prompt: 'Best way to validate a greedy before trusting it?',
      choices: [
        'Only check the sample',
        'Exchange argument / counterexample stress vs brute',
        'Always use DP instead',
        'Skip sorting',
      ],
      answer: 1,
      explain_md: 'Samples lie — prove or fuzz against a slow correct solution.',
    },
    {
      id: 'greedy-trace',
      kind: 'trace',
      title: 'Interval scheduling',
      context_md: 'Intervals `[1,4], [2,3], [3,5], [0,2]`. Max non-overlapping, sort by end.',
      steps: [
        {
          prompt: 'After sorting by end time, first taken interval?',
          choices: ['[1,4]', '[2,3]', '[0,2]', '[3,5]'],
          answer: 2,
          explain_md: 'Ends: 2,3,4,5 → earliest finish is **[0,2]**.',
        },
        {
          prompt: 'How many intervals in the optimal set?',
          choices: ['1', '2', '3', '4'],
          answer: 1,
          explain_md: 'e.g. `[0,2]` then `[2,3]` or `[3,5]` → **2**.',
        },
      ],
    },
  ],

  'binary-search-answer': [
    {
      id: 'bsa-trace',
      kind: 'trace',
      title: 'Min feasible',
      context_md:
        'ok(x)=true for all x≥5, false below. Search min feasible on integers with `hi=mid` when ok.',
      steps: [
        {
          prompt: 'First mid with lo=0, hi=10?',
          choices: ['4', '5', '6', '10'],
          answer: 1,
          explain_md: '`mid = 0+(10-0)/2 = 5`.',
        },
        {
          prompt: 'ok(5) true → next action?',
          choices: ['lo = mid+1', 'hi = mid', 'lo = mid', 'return 10'],
          answer: 1,
          explain_md: 'Min template: feasible → shrink **hi = mid**.',
        },
      ],
    },
  ],

  'divide-conquer': [
    {
      id: 'dnc-trace',
      kind: 'trace',
      title: 'Inversion merge',
      context_md:
        'Merge-count: left `[4,6]` and right offers `2` (left already consumed values ≤2). Taking from right adds “how many left remain”.',
      steps: [
        {
          prompt: 'Inversions added when taking 2?',
          choices: ['0', '1', '2', '3'],
          answer: 2,
          explain_md: 'Both 4 and 6 remain in left and are > 2 → **2**.',
        },
      ],
    },
    {
      id: 'dnc-opt',
      kind: 'mcq',
      prompt: 'Divide-and-conquer DP needs…',
      choices: [
        'Arbitrary opt[i][j]',
        'Monotone optimal split points',
        'Negative cycles',
        'Only offline Mo order',
      ],
      answer: 1,
      explain_md: 'Quadrangle / monotone inequality lets you recurse on opt ranges.',
    },
  ],

  'dynamic-programming': [
    {
      id: 'dp-trace',
      kind: 'trace',
      title: 'Fibonacci as DP',
      context_md: '`dp[i]=dp[i-1]+dp[i-2]`, dp[0]=0, dp[1]=1.',
      steps: [
        {
          prompt: 'dp[5]?',
          choices: ['3', '5', '8', '13'],
          answer: 1,
          explain_md: '0,1,1,2,3,**5**.',
        },
        {
          prompt: 'What makes this DP not “just recursion”?',
          choices: [
            'Using floats',
            'Storing/reusing subproblem answers',
            'Sorting first',
            'A segment tree',
          ],
          answer: 1,
          explain_md: 'Memo / bottom-up table = overlapping subproblems.',
        },
      ],
    },
  ],

  'bitmask-dp': [
    {
      id: 'mask-trace',
      kind: 'trace',
      title: 'Subset bit',
      context_md: 'N=3 elements. Masks from 0 to 7.',
      steps: [
        {
          prompt: 'Mask with only element 1 set?',
          choices: ['1', '2', '3', '4'],
          answer: 1,
          explain_md: '`1<<1 = 2`.',
        },
        {
          prompt: 'Iterate submasks of mask — classic inner loop uses…',
          choices: [
            's = (s-1) & mask',
            'BFS only',
            'Binary search',
            's += mask',
          ],
          answer: 0,
          explain_md: 'SOS / submask enumeration: `for (int s=mask; s; s=(s-1)&mask)`.',
        },
      ],
    },
  ],

  knapsack: [
    {
      id: 'ks-trace',
      kind: 'trace',
      title: '0/1 fill',
      context_md: 'Items (w,v)=(2,3),(3,4). W=5. 1D DP high→low.',
      steps: [
        {
          prompt: 'After item (2,3), dp[5]?',
          choices: ['0', '3', '4', '7'],
          answer: 1,
          explain_md: 'Can take one copy of weight 2 → value **3**.',
        },
        {
          prompt: 'After both items, best for W=5?',
          choices: ['3', '4', '7', '8'],
          answer: 2,
          explain_md: '2+3 weights → 3+4 values = **7**.',
        },
      ],
    },
  ],

  lis: [
    {
      id: 'lis-trace',
      kind: 'trace',
      title: 'Patience LIS',
      context_md: '`a = [3, 1, 2, 4]`.',
      steps: [
        {
          prompt: 'LIS length?',
          choices: ['2', '3', '4', '1'],
          answer: 1,
          explain_md: '`1,2,4` → **3**.',
        },
        {
          prompt: 'O(N log N) LIS maintains…',
          choices: [
            'A fenwick of edges',
            'Tails of increasing subsequences (binary search)',
            'Only a queue',
            'Floyd matrix',
          ],
          answer: 1,
          explain_md: 'Patience sorting / `lower_bound` on tails.',
        },
      ],
    },
  ],

  'bellman-ford': [
    {
      id: 'bf-trace',
      kind: 'trace',
      title: 'Relax rounds',
      context_md: 'Edges 0→1:5, 1→2:−2, 0→2:6. Source 0. Detect neg cycle if N-th relax works.',
      steps: [
        {
          prompt: 'After enough relaxations, dist[2]?',
          choices: ['6', '3', '5', '∞'],
          answer: 1,
          explain_md: '0→1→2 = 5−2 = **3** beats direct 6.',
        },
        {
          prompt: 'If a relax still updates on iteration N, then…',
          choices: [
            'Graph is a tree',
            'A negative cycle is reachable',
            'Dijkstra was fine',
            'All dist are zero',
          ],
          answer: 1,
          explain_md: 'N−1 rounds suffice on a simple path; one more update ⇒ cycle.',
        },
      ],
    },
    {
      id: 'bf-passes',
      kind: 'mcq',
      prompt: 'On N nodes, how many full edge-relax passes before the neg-cycle check?',
      choices: ['1', 'N−1', 'N', 'M'],
      answer: 1,
      explain_md: 'Shortest simple paths use ≤ N−1 edges.',
    },
  ],

  'floyd-warshall': [
    {
      id: 'fw-trace',
      kind: 'mcq',
      prompt: 'Inner triple loop order for Floyd is over…',
      choices: [
        'edges only',
        'k (mid), then i, j',
        'i, j, then random k',
        'DFS discovery',
      ],
      answer: 1,
      explain_md: 'Fix intermediate k outermost so DP uses finalized k.',
    },
    {
      id: 'fw-diag',
      kind: 'mcq',
      prompt: 'After Floyd, dist[i][i] < 0 means…',
      choices: [
        'Normal',
        'Negative cycle involving i',
        'i is unreachable',
        'Need BFS',
      ],
      answer: 1,
      explain_md: 'Negative self-distance ⇒ cycle through i.',
    },
    {
      id: 'fw-order',
      kind: 'mcq',
      prompt: 'In Floyd, the outer loop variable k is…',
      choices: [
        'Source',
        'Allowed intermediate node',
        'Edge weight',
        'BFS layer',
      ],
      answer: 1,
      explain_md: 'DP over “paths may use nodes 0…k as intermediates”.',
    },
  ],

  fenwick: [
    {
      id: 'fenwick-trace',
      kind: 'trace',
      title: 'Prefix via BIT',
      context_md: '1-indexed fenwick. `i += i&-i` moves to parent for updates.',
      steps: [
        {
          prompt: 'For i=6 (110₂), i&-i equals?',
          choices: ['1', '2', '4', '6'],
          answer: 1,
          explain_md: 'Lowest set bit of 6 is **2**.',
        },
        {
          prompt: 'Range sum (L..R] via prefixes is…',
          choices: [
            'pref(R) only',
            'pref(R) − pref(L−1)',
            'pref(L)+pref(R)',
            'Never possible',
          ],
          answer: 1,
          explain_md: 'Classic fenwick identity.',
        },
      ],
    },
  ],

  'segment-tree': [
    {
      id: 'segt-trace',
      kind: 'trace',
      title: 'Range cover',
      context_md: 'Iterative segment tree idea: a range decomposes into O(log N) nodes.',
      steps: [
        {
          prompt: 'Point update touches how many nodes asymptotically?',
          choices: ['O(1)', 'O(log N)', 'O(N)', 'O(√N)'],
          answer: 1,
          explain_md: 'Leaf to root path — **O(log N)**.',
        },
        {
          prompt: 'Associative ops OK for segtree combine; which fails without care?',
          choices: ['sum', 'min', 'non-associative mode-without-extra-info', 'gcd'],
          answer: 2,
          explain_md: 'Combine must be correctly defined on node merges.',
        },
      ],
    },
  ],

  'monotonic-stack': [
    {
      id: 'mono-trace',
      kind: 'trace',
      title: 'Next greater',
      context_md: '`a = [2, 1, 2, 4, 3]`. Next greater to the right (−1 if none).',
      steps: [
        {
          prompt: 'Next greater of a[1]=1?',
          choices: ['2', '4', '3', '−1'],
          answer: 0,
          explain_md: 'Immediate right `2` at index 2 is greater.',
        },
        {
          prompt: 'Next greater of a[0]=2?',
          choices: ['1', '2', '4', '−1'],
          answer: 2,
          explain_md: 'First greater to the right is **4**.',
        },
      ],
    },
  ],

  'sparse-table': [
    {
      id: 'st-trace',
      kind: 'mcq',
      prompt: 'RMQ with sparse table after O(N log N) build is…',
      choices: ['O(log N) per query', 'O(1) per query', 'O(N)', 'Needs updates'],
      answer: 1,
      explain_md: 'Idempotent overlap of two 2^k blocks → O(1).',
    },
    {
      id: 'st-sum',
      kind: 'mcq',
      prompt: 'Why not sparse table for range sum?',
      choices: [
        'Too slow build',
        'Overlaps double-count (sum not idempotent)',
        'Integers only',
        'Needs DFS',
      ],
      answer: 1,
      explain_md: 'Use prefix/fenwick/segtree for sums.',
    },
  ],

  mst: [
    {
      id: 'mst-trace',
      kind: 'trace',
      title: 'Kruskal pick',
      context_md: 'Edges (w,u,v): (1,0,1), (2,1,2), (2,0,2), (5,2,3). n=4.',
      steps: [
        {
          prompt: 'First edge Kruskal adds?',
          choices: ['0-1', '1-2', '0-2', '2-3'],
          answer: 0,
          explain_md: 'Lightest unique is weight **1**: 0-1.',
        },
        {
          prompt: 'After adding 0-1 and 1-2, does Kruskal add 0-2 (w=2)?',
          choices: ['Yes', 'No — same component', 'Only if directed', 'Replaces 1-2'],
          answer: 1,
          explain_md: '0 and 2 already connected via 1 — DSU rejects.',
        },
      ],
    },
  ],

  scc: [
    {
      id: 'scc-trace',
      kind: 'mcq',
      prompt: 'Condensation of SCCs is always…',
      choices: ['A cycle', 'A DAG', 'Bipartite', 'A tree only'],
      answer: 1,
      explain_md: 'No edges back between components — topo order exists.',
    },
    {
      id: 'scc-algo',
      kind: 'mcq',
      prompt: 'Tarjan finds SCCs with…',
      choices: [
        'Only BFS layers',
        'One DFS + lowlink stack',
        'Kruskal sorting',
        'Bellman-Ford',
      ],
      answer: 1,
      explain_md: 'dfn/low and a stack of the active path.',
    },
  ],

  bridges: [
    {
      id: 'br-trace',
      kind: 'mcq',
      prompt: 'In DFS tree terms, edge u–v is a bridge if…',
      choices: [
        'v is a leaf always',
        'no back-edge from v’s subtree reaches above u',
        'It has max weight',
        'u is root only',
      ],
      answer: 1,
      explain_md: '`low[v] > dfn[u]` (undirected care with parent).',
    },
    {
      id: 'br-vs',
      kind: 'mcq',
      prompt: 'Articulation points vs bridges:',
      choices: [
        'Same thing',
        'Vertex vs edge whose removal increases components',
        'Only for DAGs',
        'Only weighted',
      ],
      answer: 1,
      explain_md: 'Cut vertices vs bridge edges.',
    },
  ],

  'max-flow': [
    {
      id: 'flow-trace',
      kind: 'trace',
      title: 'Augment',
      context_md: 'Source s→a cap 3, a→t cap 2. Max flow s-t?',
      steps: [
        {
          prompt: 'Max flow value?',
          choices: ['2', '3', '5', '0'],
          answer: 0,
          explain_md: 'Bottleneck a→t → **2**.',
        },
        {
          prompt: 'After pushing 2, residual s→a is?',
          choices: ['0', '1', '2', '3'],
          answer: 1,
          explain_md: '3−2 = **1** residual forward.',
        },
      ],
    },
  ],

  'bipartite-matching': [
    {
      id: 'bpm-trace',
      kind: 'mcq',
      prompt: 'Maximum matching size equals minimum…',
      choices: [
        'Spanning tree weight',
        'Vertex cover size (König) in bipartite graphs',
        'SCC count',
        'Diameter',
      ],
      answer: 1,
      explain_md: 'König’s theorem — bipartite only.',
    },
    {
      id: 'bpm-hopcroft',
      kind: 'mcq',
      prompt: 'Hopcroft–Karp improves bipartite matching via…',
      choices: [
        'Sorting edges',
        'BFS layering + multiple DFS augments',
        'Floyd–Warshall',
        'Mo’s algorithm',
      ],
      answer: 1,
      explain_md: 'Phases find many shortest augmenting paths.',
    },
  ],

  kmp: [
    {
      id: 'kmp-trace',
      kind: 'trace',
      title: 'Prefix function',
      context_md: 'Pattern `aaba`. π[0]=0.',
      steps: [
        {
          prompt: 'π[1] for `aa…`?',
          choices: ['0', '1', '2', '3'],
          answer: 1,
          explain_md: 'Prefix `a` matches suffix `a` → **1**.',
        },
        {
          prompt: 'KMP matching uses π to…',
          choices: [
            'Sort the text',
            'Shift the pattern without full reset on mismatch',
            'Build an MST',
            'Hash only',
          ],
          answer: 1,
          explain_md: 'Fall back using longest border — O(N+M).',
        },
      ],
    },
  ],

  'z-algorithm': [
    {
      id: 'z-trace',
      kind: 'trace',
      title: 'Z-boxes',
      context_md: '`s = aabcaab`. Z[i] = LCP(s[i..], s[0..]).',
      steps: [
        {
          prompt: 'Z[1] (s[1..]=`abcaab` vs `aabcaab`)?',
          choices: ['0', '1', '2', '3'],
          answer: 1,
          explain_md: 'First char matches (`a`), second `b`≠`a` → **1**.',
        },
        {
          prompt: 'Z[4] (s[4..]=`aab` vs prefix)?',
          choices: ['0', '1', '2', '3'],
          answer: 3,
          explain_md: '`aab` matches prefix `aab` → **3**.',
        },
      ],
    },
  ],

  'string-hashing': [
    {
      id: 'hash-trace',
      kind: 'mcq',
      prompt: 'Polynomial rolling hash of "ab" with base B typically…',
      choices: [
        'a + b',
        'a*B + b (mod M)',
        'a XOR b',
        'len only',
      ],
      answer: 1,
      explain_md: 'Horner form — enables O(1) substring hashes with powers.',
    },
    {
      id: 'hash-col',
      kind: 'mcq',
      prompt: 'Safest contest hashing practice?',
      choices: [
        'One 1e9+7 mod always',
        'Two mods or 64-bit natural overflow + careful tests',
        'No mod ever',
        'Hash = string length',
      ],
      answer: 1,
      explain_md: 'Anti-hash hacks exist — double hash or __int128 / splitmix.',
    },
  ],

  trie: [
    {
      id: 'trie-trace',
      kind: 'trace',
      title: 'Insert',
      context_md: 'Insert "to", then "tea" into an empty trie (lowercase).',
      steps: [
        {
          prompt: 'Nodes created roughly share prefix…',
          choices: ['t only', 'te', 'nothing', 'toa'],
          answer: 0,
          explain_md: 'Both share **t**; then branch o vs e.',
        },
        {
          prompt: 'XOR-maximization tries usually insert…',
          choices: [
            'Characters a-z only',
            'Bit strings MSB→LSB',
            'Suffix arrays',
            'Edges of an MST',
          ],
          answer: 1,
          explain_md: 'Binary trie on bits for max XOR pair queries.',
        },
      ],
    },
  ],

  'brute-force': [
    {
      id: 'bf-trace',
      kind: 'trace',
      title: 'Perm count',
      context_md: 'n=4 distinct items. next_permutation style enumeration.',
      steps: [
        {
          prompt: 'How many permutations?',
          choices: ['16', '24', '12', '8'],
          answer: 1,
          explain_md: '4! = **24**.',
        },
      ],
    },
  ],

  // off-path deepen
  lca: [
    {
      id: 'lca-trace',
      kind: 'mcq',
      prompt: 'To lift u up to depth of v you use…',
      choices: [
        'Only BFS parents once',
        'Binary lifting jumps by 2^k',
        'Kruskal',
        'Z-algorithm',
      ],
      answer: 1,
      explain_md: 'Then jump both until parents meet.',
    },
  ],
  'mo-algorithm': [
    {
      id: 'mo-add',
      kind: 'mcq',
      prompt: 'Mo requires you can…',
      choices: [
        'Only query online',
        'Add/remove an index updating the answer',
        'Use negative weights',
        'Skip sorting',
      ],
      answer: 1,
      explain_md: 'Expand/shrink the current [L,R] between sorted queries.',
    },
  ],
  'matrix-expo': [
    {
      id: 'mat-fib',
      kind: 'mcq',
      prompt: 'Fibonacci via [[1,1],[1,0]]^n gives…',
      choices: [
        'Only F_n in O(n)',
        'F_{n+1}, F_n in O(log n) matrix muls',
        'All primes',
        'An MST',
      ],
      answer: 1,
      explain_md: 'Classic linear recurrence companion matrix.',
    },
  ],
  'bfs-01': [
    {
      id: 'bfs01-trace',
      kind: 'mcq',
      prompt: 'If you push a 0-edge to the back by mistake…',
      choices: [
        'Still correct always',
        'Distances can be wrong (not monotone deque)',
        'Only slower by log',
        'Becomes DFS',
      ],
      answer: 1,
      explain_md: '0-cost must stay at the front to keep nondecreasing order.',
    },
  ],
  'difference-array': [
    {
      id: 'diff-trace',
      kind: 'trace',
      title: 'Range add',
      context_md: 'n=5 zeros. Add +3 on [1,4).',
      steps: [
        {
          prompt: 'd[1] and d[4] after the update?',
          choices: ['+3 and −3', '−3 and +3', '+3 and 0', '0 and +3'],
          answer: 0,
          explain_md: '`d[l]+=v`, `d[r]-=v` → **+3, −3**.',
        },
      ],
    },
  ],
  'math-number-theory': [
    {
      id: 'nt-gcd',
      kind: 'mcq',
      prompt: 'gcd(30,12) via Euclid?',
      choices: ['2', '3', '6', '12'],
      answer: 2,
      explain_md: '30=2·12+6; 12=2·6+0 → **6**.',
    },
  ],
  'priority-queue': [
    {
      id: 'pq-dij',
      kind: 'mcq',
      prompt: 'Dijkstra’s PQ stores…',
      choices: [
        'Only visited nodes',
        '(dist, node) candidates, ignoring stale pops',
        'DFS colors',
        'SCC ids',
      ],
      answer: 1,
      explain_md: 'Multiple entries OK — skip if `d != dist[u]`.',
    },
  ],
  'deque-window': [
    {
      id: 'dq-trace',
      kind: 'mcq',
      prompt: 'Window size K max: when index i arrives, pop back while…',
      choices: [
        'deque empty',
        'a[deque.back()] ≤ a[i] (for maximum)',
        'i is even',
        'sum exceeds K',
      ],
      answer: 1,
      explain_md: 'Maintain decreasing values in the deque.',
    },
    {
      id: 'dq-expire',
      kind: 'mcq',
      prompt: 'Window of length K ends at i. When is the front index expired?',
      choices: [
        'front > i',
        'front ≤ i − K',
        'front == i',
        'Never',
      ],
      answer: 1,
      explain_md: 'Indices ≤ i−K fall outside the window → pop front.',
    },
  ],
  sorting: [
    {
      id: 'sort-stable',
      kind: 'mcq',
      prompt: 'Need equal keys to keep input order. Prefer…',
      choices: ['std::sort', 'std::stable_sort', 'nth_element', 'partial_sort'],
      answer: 1,
      explain_md: '`stable_sort` preserves relative order of equals.',
    },
  ],
  mergesort: [
    {
      id: 'merge-stable',
      kind: 'mcq',
      prompt: 'Merging equals from left vs right — keep stable with…',
      choices: ['Always take right first', 'Take left when a[i] ≤ a[j]', 'Random', 'Skip equals'],
      answer: 1,
      explain_md: '`≤` prefers the left half so equals keep original order.',
    },
  ],
  quicksort: [
    {
      id: 'qs-partition',
      kind: 'trace',
      title: 'Lomuto partition',
      context_md: '`a = [4, 7, 2, 9, 1]`, pivot = last (`1`).',
      steps: [
        {
          prompt: 'After partition, pivot index?',
          choices: ['0', '1', '2', '4'],
          answer: 0,
          explain_md: 'Only values ≤ 1 stay left; `1` ends at index **0**.',
        },
        {
          prompt: 'Recurse next on…',
          choices: ['Empty left + right [7,2,9,4]', 'Full array again', 'Only odds', 'Nothing'],
          answer: 0,
          explain_md: 'Left of pivot empty; sort the right side.',
        },
      ],
    },
  ],
  'counting-sort': [
    {
      id: 'count-stable',
      kind: 'mcq',
      prompt: 'Stable counting sort fills the output by scanning input…',
      choices: ['Left→right', 'Right→left', 'Random', 'By hash'],
      answer: 1,
      explain_md: 'Walk **right→left** so earlier equals land at lower slots first.',
    },
  ],
  'coordinate-compression': [
    {
      id: 'cc-rank',
      kind: 'mcq',
      prompt: 'After unique sort `b`, rank of x is…',
      choices: [
        'upper_bound(b,x)−begin',
        'lower_bound(b,x)−begin',
        'x % b.size()',
        'find(b,x) always fails',
      ],
      answer: 1,
      explain_md: '`lower_bound` gives the dense 0-based rank.',
    },
  ],
  'two-pointers': [
    {
      id: 'tp-shrink',
      kind: 'trace',
      title: 'Shortest window sum ≥ S',
      context_md: '`a = [2, 1, 3, 2]`, S = 5. Expand right, shrink left.',
      steps: [
        {
          prompt: 'First time sum ≥ 5, window is…',
          choices: ['[2]', '[2,1]', '[2,1,3]', '[1,3,2]'],
          answer: 2,
          explain_md: '2+1+3 = 6 ≥ 5 → window `[2,1,3]`.',
        },
        {
          prompt: 'After processing the whole array, shortest valid length?',
          choices: ['1', '2', '3', '4'],
          answer: 1,
          explain_md: 'Later window `[3,2]` sums to 5 → best length **2**.',
        },
      ],
    },
  ],
  'stack-ds': [
    {
      id: 'st-paren',
      kind: 'mcq',
      prompt: 'Valid parentheses with a stack: on `)` you…',
      choices: [
        'Push )',
        'Pop a matching ( or fail',
        'Clear the stack',
        'Ignore',
      ],
      answer: 1,
      explain_md: 'Need a pending `(` on top; else invalid.',
    },
    {
      id: 'st-trace',
      kind: 'trace',
      title: 'Next greater',
      context_md: '`a = [2, 1, 3]`. Monotonic decreasing stack of indices.',
      steps: [
        {
          prompt: 'When 3 arrives, who gets next-greater = 3?',
          choices: ['Only 2', '1 then 2', 'Nobody', 'Only 1'],
          answer: 1,
          explain_md: 'Pop 1 then 2 (both < 3).',
        },
      ],
    },
  ],
  'queue-ds': [
    {
      id: 'q-bfs',
      kind: 'mcq',
      prompt: 'BFS uses a queue because…',
      choices: [
        'LIFO explores layers',
        'FIFO expands nodes in discovery order (layers)',
        'Random pops',
        'Stacks are illegal',
      ],
      answer: 1,
      explain_md: 'FIFO = level order = shortest unweighted paths.',
    },
  ],
  'hash-map': [
    {
      id: 'hm-freq',
      kind: 'mcq',
      prompt: 'Two-sum with a hash map stores…',
      choices: [
        'Only sorted pairs',
        'Value → index seen so far',
        'All prefixes',
        'DFS colors',
      ],
      answer: 1,
      explain_md: 'For each x look up `target−x`, then insert x.',
    },
  ],
  'ordered-set': [
    {
      id: 'os-order',
      kind: 'mcq',
      prompt: '`order_of_key(x)` typically returns…',
      choices: [
        'x itself',
        'Count of elements strictly < x',
        'Max element',
        'Tree height',
      ],
      answer: 1,
      explain_md: 'Policy-based / fenwick rank = how many keys < x.',
    },
  ],
  'segment-tree-lazy': [
    {
      id: 'lazy-push',
      kind: 'mcq',
      prompt: 'Before reading children you must…',
      choices: [
        'Rebuild the tree',
        'Push pending lazy tags down',
        'Clear the root',
        'Sort indices',
      ],
      answer: 1,
      explain_md: 'Stale tags on a node lie to child queries until `push`.',
    },
  ],
  'mst-prim': [
    {
      id: 'prim-pick',
      kind: 'mcq',
      prompt: 'Prim grows the tree by repeatedly…',
      choices: [
        'Adding any edge',
        'Adding the lightest edge out of the cut',
        'Running DFS',
        'Sorting all edges once only (that’s Kruskal)',
      ],
      answer: 1,
      explain_md: 'Like Dijkstra on the cut — PQ of fringe edges.',
    },
  ],
  'ad-hoc': [
    {
      id: 'adhoc-read',
      kind: 'mcq',
      prompt: 'Best first move on a weird statement?',
      choices: [
        'Copy a random template',
        'Hand-simulate tiny samples and invent invariants',
        'Assume it’s always DP',
        'Skip the input format',
      ],
      answer: 1,
      explain_md: 'Ad-hoc = find the hidden structure by playing with examples.',
    },
  ],
  'geometry-basics': [
    {
      id: 'geo-cross',
      kind: 'mcq',
      prompt: 'Cross product (B−A)×(C−A) > 0 means C is…',
      choices: [
        'Collinear',
        'Left of directed line AB (CCW)',
        'Right of AB',
        'Closer to A',
      ],
      answer: 1,
      explain_md: 'Sign of the 2D cross = orientation / turn direction.',
    },
  ],
  interactive: [
    {
      id: 'inter-limit',
      kind: 'mcq',
      prompt: 'Interactive binary search on [1,N] needs about… queries',
      choices: ['N', 'log₂ N', 'N²', '1'],
      answer: 1,
      explain_md: 'Halve the range each ask — classic interactive pattern.',
    },
  ],
  'flows-matching': [
    {
      id: 'fm-cut',
      kind: 'mcq',
      prompt: 'Max flow equals…',
      choices: [
        'Number of nodes',
        'Min cut capacity',
        'MST weight',
        'Chromatic number',
      ],
      answer: 1,
      explain_md: 'Max-flow min-cut theorem.',
    },
  ],
  'convex-hull': [
    {
      id: 'ch-turn',
      kind: 'mcq',
      prompt: 'Andrew’s monotone chain pops while the turn is not…',
      choices: ['A left turn (CCW)', 'A right turn', 'Collinear only', 'Ascending x'],
      answer: 0,
      explain_md: 'Keep the lower/upper hull convex — pop non-left turns.',
    },
  ],
  'sweep-line': [
    {
      id: 'sweep-events',
      kind: 'mcq',
      prompt: 'Typical sweep processes events sorted by…',
      choices: [
        'Random hash',
        'X-coordinate (then type tie-break)',
        'DFS order',
        'Edge weight only',
      ],
      answer: 1,
      explain_md: 'Vertical line moves left→right over sorted event x.',
    },
  ],
};
