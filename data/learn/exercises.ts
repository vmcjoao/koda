import type { LearnExercise } from '@/types/learn';

/** Interactive drills keyed by lesson id. */
export const LESSON_EXERCISES: Record<string, LearnExercise[]> = {
  bfs: [
    {
      id: 'bfs-trace',
      kind: 'trace',
      title: 'BFS trace',
      context_md:
        'Undirected graph, start at **0**.\n\nEdges: `0-1`, `0-2`, `1-3`, `1-4`, `2-3`, `3-4`, `3-5`.\nNeighbors are scanned in **ascending** id order. Mark visited when **enqueueing**.',
      steps: [
        {
          prompt: 'After starting at 0, which nodes are in the queue (frontier)?',
          choices: ['1 only', '1 then 2', '2 then 1', '1, 2, 3'],
          answer: 1,
          explain_md: 'From 0 the unused neighbors are 1 then 2 → queue = `[1, 2]`.',
        },
        {
          prompt: 'BFS visit order (first time dequeued). What comes after 0, 1, 2?',
          choices: ['4', '5', '3', '1 again'],
          answer: 2,
          explain_md:
            'After visiting 1 we enqueue 3 and 4; after visiting 2, 3 is already marked. Next dequeue is **3**.',
        },
        {
          prompt: 'Distance (edges) from 0 to 5?',
          choices: ['1', '2', '3', '4'],
          answer: 2,
          explain_md: 'Path `0 → 1 → 3 → 5` (or `0 → 2 → 3 → 5`) has length **3**.',
        },
      ],
    },
    {
      id: 'bfs-mcq',
      kind: 'mcq',
      prompt: 'BFS finds shortest paths when…',
      choices: [
        'Edges may have any real weights',
        'All edges have equal cost (unweighted / unit weight)',
        'The graph is a DAG',
        'You need a minimum spanning tree',
      ],
      answer: 1,
      explain_md: 'Layer = equal edge count. Weighted shortest paths need Dijkstra / BF.',
    },
  ],

  dfs: [
    {
      id: 'dfs-trace',
      kind: 'trace',
      title: 'DFS recursion',
      context_md:
        'Undirected graph, start DFS at **0**. Adjacency lists sorted ascending. Recurse on the first unused neighbor before the next.',
      steps: [
        {
          prompt: 'First neighbor of 0 that DFS enters?',
          choices: ['2', '1', '3', '4'],
          answer: 1,
          explain_md: 'Sorted neighbors of 0 are 1, 2 — DFS goes deep into **1** first.',
        },
        {
          prompt: 'From 1 (neighbors 0,3,4), which node is visited next?',
          choices: ['0', '4', '3', '2'],
          answer: 2,
          explain_md: '0 is already visited; next unused is **3**.',
        },
      ],
    },
    {
      id: 'dfs-mcq',
      kind: 'mcq',
      prompt: 'Best default use of DFS among these?',
      choices: [
        'Fewest edges from source in an unweighted graph',
        'Connected components / cycle checks / tree DP',
        'Global minimum spanning tree',
        'Shortest path with positive weights',
      ],
      answer: 1,
      explain_md: 'BFS wins unweighted shortest paths; DFS shines at structure / recursion.',
    },
  ],

  dijkstra: [
    {
      id: 'dij-trace',
      kind: 'trace',
      title: 'Dijkstra distances',
      context_md:
        'Undirected weighted graph, source **0**.\n\n`0-1:2`, `0-2:4`, `1-3:3`, `1-4:7`, `2-3:1`, `3-4:2`, `3-5:5`.',
      steps: [
        {
          prompt: 'After relaxing neighbors of 0, what is dist[1] and dist[2]?',
          choices: ['1=2, 2=4', '1=4, 2=2', '1=2, 2=2', '1=∞, 2=4'],
          answer: 0,
          explain_md: 'Direct edges from 0: to 1 weight 2, to 2 weight 4.',
        },
        {
          prompt: 'Final shortest distance 0 → 4?',
          choices: ['9', '7', '6', '5'],
          answer: 1,
          explain_md: '`0-1-3-4` = 2+3+2 = **7** (beats `0-1-4` = 9).',
        },
        {
          prompt: 'When is Dijkstra unsafe?',
          choices: [
            'Dense graphs',
            'Negative edge weights exist',
            'Multiple edges between a pair',
            'The graph is undirected',
          ],
          answer: 1,
          explain_md: 'Non-negative weights are required; negatives → Bellman-Ford.',
        },
      ],
    },
  ],

  'topo-sort': [
    {
      id: 'topo-mcq',
      kind: 'mcq',
      prompt: 'DAG: A→B, A→C, B→D, C→D, D→E. Which is a valid topo order?',
      context_md: 'Nodes A..E with those directed edges only.',
      choices: ['B, A, C, D, E', 'A, B, C, D, E', 'A, D, B, C, E', 'E, D, C, B, A'],
      answer: 1,
      explain_md: 'A before B and C; B and C before D; D before E. `A,B,C,D,E` works (`A,C,B,D,E` too).',
    },
    {
      id: 'topo-kahn',
      kind: 'mcq',
      prompt: 'Kahn’s algorithm returns fewer than N nodes. What happened?',
      choices: [
        'The graph has a cycle',
        'All edges have weight 0',
        'The source was chosen wrong',
        'BFS should be used instead',
      ],
      answer: 0,
      explain_md: 'Leftover positive indegrees ⇒ cycle; not a DAG.',
    },
  ],

  'lower-bound': [
    {
      id: 'lb-trace',
      kind: 'trace',
      title: 'Lower bound',
      context_md: '`a = [1, 3, 3, 3, 5, 7, 9]`. lower_bound = first index with `a[i] ≥ x`.',
      steps: [
        {
          prompt: 'lower_bound for x = 3?',
          choices: ['0', '1', '2', '4'],
          answer: 1,
          explain_md: 'First `≥ 3` sits at index **1**.',
        },
        {
          prompt: 'lower_bound for x = 4?',
          choices: ['1', '3', '4', '5'],
          answer: 2,
          explain_md: 'No 4; first `≥ 4` is **5** at index 4.',
        },
        {
          prompt: 'How many elements are strictly < 3?',
          choices: ['0', '1', '2', '3'],
          answer: 1,
          explain_md: 'Exactly the lower_bound index → **1** element (`1`).',
        },
      ],
    },
  ],

  'upper-bound': [
    {
      id: 'ub-mcq',
      kind: 'mcq',
      prompt: '`a = [1, 3, 3, 3, 5]`. Count of value 3?',
      context_md: 'count = upper_bound(3) − lower_bound(3).',
      choices: ['1', '2', '3', '4'],
      answer: 2,
      explain_md: 'lower=1, upper=4 → `4-1 = 3`.',
    },
  ],

  'prefix-sums': [
    {
      id: 'pref-mcq',
      kind: 'trace',
      title: 'Range sums',
      context_md: '`a = [3, 1, 4, 1, 5]`, `pref[0]=0`, `pref[i+1]=pref[i]+a[i]`.',
      steps: [
        {
          prompt: 'What is pref[3]?',
          choices: ['3', '4', '8', '9'],
          answer: 2,
          explain_md: '`3+1+4 = 8`.',
        },
        {
          prompt: 'sum of a[1..4) = pref[4]-pref[1]?',
          choices: ['5', '6', '10', '11'],
          answer: 1,
          explain_md: '`pref[4]=9`, `pref[1]=3` → `9-3=6` (`1+4+1`).',
        },
      ],
    },
  ],

  knapsack: [
    {
      id: 'ks-mcq',
      kind: 'mcq',
      prompt:
        'Items (w,v): (2,3), (3,4), (4,5), (5,6). Capacity 8. Best 0/1 value?',
      choices: ['9', '10', '11', '12'],
      answer: 1,
      explain_md: 'Take (3,4)+(5,6) → weight 8 value **10** (or 2+3+ something worse).',
    },
    {
      id: 'ks-dir',
      kind: 'mcq',
      prompt: '1D 0/1 knapsack: capacity loop must go…',
      choices: [
        'Low → high (0..W)',
        'High → low (W..w[i])',
        'Either direction is fine',
        'Only over item indices',
      ],
      answer: 1,
      explain_md: 'Descending prevents reusing the same item (which would be unbounded).',
    },
  ],

  'two-pointers': [
    {
      id: 'tp-mcq',
      kind: 'mcq',
      prompt:
        'Non-negative `a=[2,1,3,2,1]`, budget 5. Longest subarray with sum ≤ 5?',
      choices: ['2', '3', '4', '5'],
      answer: 2,
      explain_md: 'e.g. `[1,3,2]` or `[3,2,1]` length **3**; length 4 always exceeds 5.',
    },
  ],

  sorting: [
    {
      id: 'sort-cmp',
      kind: 'mcq',
      prompt: 'Which comparator is unsafe for std::sort?',
      choices: [
        'return a.x < b.x;',
        'return a.x <= b.x;',
        'return a.x != b.x ? a.x < b.x : a.id < b.id;',
        'return tie(a.x, a.id) < tie(b.x, b.id);',
      ],
      answer: 1,
      explain_md: '`<=` is not a strict weak ordering — can crash / infinite loop.',
    },
  ],

  mergesort: [
    {
      id: 'merge-inv',
      kind: 'mcq',
      prompt: 'While merging, left has [2,5] and right offers 3. Inversions added?',
      context_md: 'Classic merge-count: when taking from right, add “how many left remain”.',
      choices: ['0', '1', '2', '3'],
      answer: 2,
      explain_md: 'Both 2 and 5 are still in left and are > 3 → **2** inversions.',
    },
  ],

  'coordinate-compression': [
    {
      id: 'cc-mcq',
      kind: 'mcq',
      prompt: 'Compress `[100, 5, 100, 7]` (dense ranks). Result?',
      choices: ['[3,0,3,1]', '[2,0,2,1]', '[3,1,3,2]', '[2,1,2,0]'],
      answer: 1,
      explain_md: 'Unique sorted: 5,7,100 → ranks 0,1,2 → `[2,0,2,1]`.',
    },
  ],

  dsu: [
    {
      id: 'dsu-mcq',
      kind: 'mcq',
      prompt: 'After unite(0,1), unite(1,2), unite(3,4): same(0,2)? same(0,3)?',
      choices: ['true, true', 'true, false', 'false, true', 'false, false'],
      answer: 1,
      explain_md: '{0,1,2} one component; {3,4} another.',
    },
  ],

  'binary-search-answer': [
    {
      id: 'bsa-mcq',
      kind: 'mcq',
      prompt: 'Minimize capacity C so ok(C) is true (false→true monotone). Template?',
      choices: [
        'if (ok(mid)) lo = mid; else hi = mid - 1;  (bias up)',
        'if (ok(mid)) hi = mid; else lo = mid + 1;',
        'Always return mid without a loop',
        'Use ternary search on ok',
      ],
      answer: 1,
      explain_md: 'Min feasible uses `hi = mid` when ok — see the min_feasible template.',
    },
  ],

  greedy: [
    {
      id: 'greedy-interval',
      kind: 'mcq',
      prompt: 'Max non-overlapping intervals: sort by…',
      choices: [
        'Start time ascending',
        'End time ascending',
        'Length descending',
        'Random order',
      ],
      answer: 1,
      explain_md: 'Earliest finish leaves the most room for the rest.',
    },
  ],

  lis: [
    {
      id: 'lis-mcq',
      kind: 'mcq',
      prompt: 'LIS length of `[3, 1, 2, 4]`?',
      choices: ['1', '2', '3', '4'],
      answer: 2,
      explain_md: '`1,2,4` length **3**.',
    },
  ],

  kmp: [
    {
      id: 'kmp-mcq',
      kind: 'mcq',
      prompt: 'LPS (prefix function) of pattern `abab` — π[3]?',
      context_md: 'π[i] = longest proper prefix that is also suffix of `p[0..i]`.',
      choices: ['0', '1', '2', '3'],
      answer: 2,
      explain_md: '`abab` — prefix `ab` equals suffix `ab` → **2**.',
    },
  ],

  mst: [
    {
      id: 'mst-mcq',
      kind: 'mcq',
      prompt: 'Kruskal processes edges in which order?',
      choices: [
        'DFS discovery order',
        'Ascending weight',
        'Descending weight',
        'BFS layer order',
      ],
      answer: 1,
      explain_md: 'Sort light→heavy; add if endpoints are in different DSU components.',
    },
  ],

  fenwick: [
    {
      id: 'fenwick-mcq',
      kind: 'mcq',
      prompt: 'Fenwick prefix(k) answers…',
      choices: [
        'Sum on [k, n)',
        'Sum on [1, k] (or [0, k) depending on indexing)',
        'Minimum on [1, k]',
        'GCD on the whole array',
      ],
      answer: 1,
      explain_md: 'Point add + prefix sum; range sum = pref(r) − pref(l−1).',
    },
  ],

  'monotonic-stack': [
    {
      id: 'mono-mcq',
      kind: 'mcq',
      prompt: 'Next greater element: stack stores indices with values…',
      choices: [
        'Strictly increasing toward the top',
        'Strictly decreasing toward the top',
        'In input order only',
        'Sorted by index descending',
      ],
      answer: 1,
      explain_md: 'Pop while `a[stack.top()] < a[i]` — those positions’ next greater is i.',
    },
  ],

  'segment-tree': [
    {
      id: 'segtree-mcq',
      kind: 'mcq',
      prompt: 'Point update + range sum: segment tree query complexity?',
      choices: ['O(1)', 'O(log N)', 'O(√N)', 'O(N)'],
      answer: 1,
      explain_md: 'O(log N) nodes cover any range; same for a point update.',
    },
  ],

  'binary-search': [
    {
      id: 'bs-trace',
      kind: 'trace',
      title: 'Exact search',
      context_md:
        'Sorted `a = [2, 4, 5, 7, 9, 12, 15, 18]`. Find **9** with half-open `[lo, hi)`.',
      steps: [
        {
          prompt: 'Initial lo=0, hi=8. First mid?',
          choices: ['3 (a[3]=7)', '4 (a[4]=9)', '2 (a[2]=5)', '5 (a[5]=12)'],
          answer: 1,
          explain_md: '`mid = 0 + (8-0)/2 = 4` → hits **9** immediately.',
        },
        {
          prompt: 'If the target were 8 (missing), what should find_exact return?',
          choices: ['3', '4', '-1', '0'],
          answer: 2,
          explain_md: 'Exact search returns **-1** when the value never equals `a[mid]`.',
        },
      ],
    },
    {
      id: 'bs-when',
      kind: 'mcq',
      prompt: 'Prefer lower_bound over exact find when you need…',
      choices: [
        'Any index of a known present key',
        'The first position where a[i] ≥ x (insertion point)',
        'Shortest path in a graph',
        'A random element',
      ],
      answer: 1,
      explain_md: 'lower_bound is the insertion / first-≥ template.',
    },
  ],


  quicksort: [
    {
      id: 'qs-mcq',
      kind: 'mcq',
      prompt: 'Worst-case time of naive quicksort (bad pivots)?',
      choices: ['O(N log N)', 'O(N)', 'O(N²)', 'O(log N)'],
      answer: 2,
      explain_md: 'Sorted input + fixed end pivot → unbalanced partitions → **O(N²)**.',
    },
  ],

  'counting-sort': [
    {
      id: 'count-mcq',
      kind: 'mcq',
      prompt: 'Counting sort is ideal when…',
      choices: [
        'Keys are arbitrary strings',
        'Keys are integers in a small range [0, K]',
        'You need comparison-based stability only',
        'N ≤ 10',
      ],
      answer: 1,
      explain_md: 'Time O(N+K) — needs a compact integer universe.',
    },
  ],

  'bellman-ford': [
    {
      id: 'bf-mcq',
      kind: 'mcq',
      prompt: 'Bellman-Ford is preferred over Dijkstra when…',
      choices: [
        'The graph is undirected only',
        'Edge weights may be negative',
        'You need an MST',
        'N is huge and M = N−1',
      ],
      answer: 1,
      explain_md: 'Handles negative weights (and can detect negative cycles).',
    },
  ],

  'floyd-warshall': [
    {
      id: 'fw-mcq',
      kind: 'mcq',
      prompt: 'Floyd–Warshall computes…',
      choices: [
        'Single-source shortest paths only',
        'All-pairs shortest paths',
        'A minimum spanning tree',
        'Strongly connected components',
      ],
      answer: 1,
      explain_md: 'DP over intermediate vertices → all pairs in O(N³).',
    },
  ],

  scc: [
    {
      id: 'scc-mcq',
      kind: 'mcq',
      prompt: 'Kosaraju’s second DFS runs on…',
      choices: [
        'The original graph in discovery order',
        'The transpose graph in decreasing finish time',
        'A BFS tree only',
        'Undirected edges sorted by weight',
      ],
      answer: 1,
      explain_md: 'Finish-time order on G, then DFS on Gᵀ yields SCCs.',
    },
  ],

  bridges: [
    {
      id: 'bridges-mcq',
      kind: 'mcq',
      prompt: 'A bridge is an edge whose removal…',
      choices: [
        'Increases the number of connected components',
        'Creates a negative cycle',
        'Always disconnects a leaf',
        'Is required for bipartiteness',
      ],
      answer: 0,
      explain_md: 'Bridge = critical edge for connectivity.',
    },
  ],

  'max-flow': [
    {
      id: 'flow-mcq',
      kind: 'mcq',
      prompt: 'In a residual graph, a reverse edge appears when…',
      choices: [
        'The original graph was undirected',
        'We pushed flow on the forward edge',
        'Capacity was zero initially',
        'The cut is saturated',
      ],
      answer: 1,
      explain_md: 'Residual reverse capacity lets algorithms “undo” flow.',
    },
  ],

  'bitmask-dp': [
    {
      id: 'mask-mcq',
      kind: 'mcq',
      prompt: 'Typical bitmask DP size for N ≤ 20?',
      choices: ['O(N)', 'O(N²)', 'O(2ᴺ · poly(N))', 'O(N!)'],
      answer: 2,
      explain_md: 'One state per subset — 2ᴺ times transition work.',
    },
  ],

  trie: [
    {
      id: 'trie-mcq',
      kind: 'mcq',
      prompt: 'A trie shines when you need…',
      choices: [
        'Prefix queries / dictionary of strings',
        'Shortest paths with weights',
        'Range minimum on an array',
        'Sorting integers in O(N)',
      ],
      answer: 0,
      explain_md: 'Shared prefixes → fast starts-with / xor tricks.',
    },
  ],

  'z-algorithm': [
    {
      id: 'z-mcq',
      kind: 'mcq',
      prompt: 'Z-box Z[i] is the longest substring from i that…',
      choices: [
        'Is a palindrome',
        'Matches a prefix of the string',
        'Is strictly increasing',
        'Has all unique characters',
      ],
      answer: 1,
      explain_md: 'Z[i] = LCP(s[i..], s[0..]).',
    },
  ],

  'string-hashing': [
    {
      id: 'hash-mcq',
      kind: 'mcq',
      prompt: 'Rolling hash substring equality is…',
      choices: [
        'Always correct with one 32-bit mod',
        'Fast but probabilistic (use double hash / 64-bit)',
        'Slower than KMP for every query',
        'Only for lowercase letters',
      ],
      answer: 1,
      explain_md: 'Collisions exist — mitigate with two mods or unsigned overflow 64-bit.',
    },
  ],

  'dynamic-programming': [
    {
      id: 'dp-mcq',
      kind: 'mcq',
      prompt: 'A DP state needs…',
      choices: [
        'Only the answer size',
        'Enough info to compute transitions without re-deriving history',
        'A greedy choice property',
        'Negative edge weights',
      ],
      answer: 1,
      explain_md: 'State = minimal memory of the past so transitions are well-defined.',
    },
  ],

  'divide-conquer': [
    {
      id: 'dnc-mcq',
      kind: 'mcq',
      prompt: 'Mergesort recurrence when merge is O(N)?',
      choices: ['T=N', 'T=2T(N/2)+O(N) → O(N log N)', 'T=T(N−1)+O(1)', 'T=O(N²) always'],
      answer: 1,
      explain_md: 'Master theorem / tree of merges → **O(N log N)**.',
    },
  ],

  'difference-array': [
    {
      id: 'diff-mcq',
      kind: 'mcq',
      prompt: 'Range add +v on [l,r) via difference array?',
      choices: [
        'd[l]+=v; d[r]-=v; then prefix',
        'd[l]-=v; d[r]+=v only',
        'Sort then binary search',
        'Fenwick required',
      ],
      answer: 0,
      explain_md: 'Difference encodes starts/ends; prefix rebuilds the array.',
    },
  ],

  'sparse-table': [
    {
      id: 'st-mcq',
      kind: 'mcq',
      prompt: 'Sparse table is great for…',
      choices: [
        'Point updates + range sum',
        'Static idempotent range queries (RMQ / gcd)',
        'Online edge insertions',
        'Negative-cycle detection',
      ],
      answer: 1,
      explain_md: 'O(1) idempotent queries after O(N log N) build; no updates.',
    },
  ],

  'brute-force': [
    {
      id: 'bf-mcq',
      kind: 'mcq',
      prompt: 'Before coding complete search, first estimate…',
      choices: [
        'Only asymptotic big-O of sort',
        'States × work per transition vs time limit',
        'MST weight',
        'Segment tree height',
      ],
      answer: 1,
      explain_md: 'If $2^{20}$ or $9!$ already blows the limit, prune or change approach.',
    },
    {
      id: 'bf-sym',
      kind: 'mcq',
      prompt: 'Common blow-up in backtracking?',
      choices: [
        'Exploring symmetric states repeatedly',
        'Using long long',
        'Sorting the input once',
        'Marking visited when enqueueing in BFS',
      ],
      answer: 0,
      explain_md: 'Canonicalize / mark visited early to cut duplicates.',
    },
  ],

  'bipartite-matching': [
    {
      id: 'bpm-mcq',
      kind: 'mcq',
      prompt: 'Kuhn / DFS matching grows the matching by finding…',
      choices: [
        'A negative cycle',
        'An augmenting path',
        'An MST edge',
        'A topological order',
      ],
      answer: 1,
      explain_md: 'Augmenting paths flip free↔matched edges and increase size by 1.',
    },
  ],

  sieve: [
    {
      id: 'sieve-trace',
      kind: 'trace',
      title: 'Eratosthenes',
      context_md: 'Linear sieve / classic sieve marking multiples. Consider $n = 10$.',
      steps: [
        {
          prompt: 'How many primes ≤ 10?',
          choices: ['3', '4', '5', '6'],
          answer: 1,
          explain_md: '2,3,5,7 → **4**.',
        },
        {
          prompt: 'First composite marked when p=2?',
          choices: ['3', '4', '9', '1'],
          answer: 1,
          explain_md: 'Start marking from $p^2$ or $2p$ — **4** is the first even composite.',
        },
      ],
    },
  ],

  lca: [
    {
      id: 'lca-mcq',
      kind: 'mcq',
      prompt: 'Binary lifting LCA preprocess typically…',
      choices: [
        'O(1) memory',
        'O(N log N) parents up[k][v]',
        'O(N²) Floyd table only',
        'No DFS needed',
      ],
      answer: 1,
      explain_md: 'DFS depths + $2^k$ ancestors → O(log N) queries.',
    },
  ],

  'ternary-search': [
    {
      id: 'ter-mcq',
      kind: 'mcq',
      prompt: 'Ternary search needs the objective to be…',
      choices: [
        'Arbitrary multimodal',
        'Unimodal / convex-like',
        'Only integer XOR',
        'A DAG',
      ],
      answer: 1,
      explain_md: 'Without unimodality the trim is wrong.',
    },
  ],

  'meet-in-middle': [
    {
      id: 'mitm-mcq',
      kind: 'mcq',
      prompt: 'Classic MITM for subset-sum with N≈40 splits into…',
      choices: [
        'N and 1',
        'Two halves ≈N/2, enumerate 2^{N/2}',
        '√N blocks like Mo',
        'Only even indices',
      ],
      answer: 1,
      explain_md: 'Meet sums of both halves — ~$2^{20}$ instead of $2^{40}$.',
    },
  ],

  'mo-algorithm': [
    {
      id: 'mo-mcq',
      kind: 'mcq',
      prompt: 'Mo’s algorithm is typically…',
      choices: [
        'Online with arbitrary updates',
        'Offline: sort queries into √N blocks',
        'Only for trees',
        'A max-flow method',
      ],
      answer: 1,
      explain_md: 'Reorder queries to move L/R cheaply; need add/remove.',
    },
  ],

  'matrix-expo': [
    {
      id: 'mat-mcq',
      kind: 'mcq',
      prompt: 'Matrix expo computes linear recurrences in…',
      choices: [
        'O(N)',
        'O(K³ log N) for K×K transition',
        'O(2ᴺ)',
        'O(1) always',
      ],
      answer: 1,
      explain_md: 'Raise the companion matrix to the N-th power.',
    },
  ],

  'game-theory': [
    {
      id: 'gt-mcq',
      kind: 'mcq',
      prompt: 'Nim heaps [3,4,5]. XOR of sizes?',
      choices: ['0', '2', '6', '7'],
      answer: 1,
      explain_md: '3⊕4⊕5 = 3⊕4=7, 7⊕5=**2** ≠ 0 → first wins.',
    },
    {
      id: 'gt-zero',
      kind: 'mcq',
      prompt: 'Position is losing (normal play) when grundy/XOR is…',
      choices: ['Positive', 'Zero', 'Odd only', 'Equal to heap count'],
      answer: 1,
      explain_md: 'XOR 0 → whatever you do, opponent can mirror to 0.',
    },
  ],

  'convex-hull': [
    {
      id: 'hull-mcq',
      kind: 'mcq',
      prompt: 'Andrew / monotone chain builds hull in…',
      choices: ['O(N)', 'O(N log N) dominated by sort', 'O(N²) always', 'O(log N)'],
      answer: 1,
      explain_md: 'Sort by x then lower/upper chain with cross products.',
    },
  ],

  'sweep-line': [
    {
      id: 'sweep-mcq',
      kind: 'mcq',
      prompt: 'Sweep-line events are usually processed…',
      choices: [
        'In random order',
        'Sorted by coordinate (then type)',
        'Only with DFS',
        'Using max-flow',
      ],
      answer: 1,
      explain_md: 'Sort events; maintain active set as the sweep moves.',
    },
  ],

  'priority-queue': [
    {
      id: 'pq-mcq',
      kind: 'mcq',
      prompt: 'Binary heap priority_queue top/pop are…',
      choices: ['O(1) / O(1)', 'O(1) / O(log N)', 'O(N) / O(N)', 'O(log N) / O(1)'],
      answer: 1,
      explain_md: 'Peek O(1), extract-min O(log N).',
    },
  ],

  'ordered-set': [
    {
      id: 'os-mcq',
      kind: 'mcq',
      prompt: 'Policy-based / tree order statistics give…',
      choices: [
        'Only hash lookups',
        'Find-by-order / order-of-key in O(log N)',
        'O(1) updates always',
        'No duplicates ever possible',
      ],
      answer: 1,
      explain_md: 'Rank and k-th element on a balanced BST.',
    },
  ],

  'deque-window': [
    {
      id: 'dq-mcq',
      kind: 'mcq',
      prompt: 'Monotone deque for sliding-window maximum keeps…',
      choices: [
        'All indices in input order only',
        'Candidates decreasing (or increasing) by value',
        'A full segment tree',
        'Only the window sum',
      ],
      answer: 1,
      explain_md: 'Pop back while beaten; pop front when out of window → O(N).',
    },
  ],

  'segment-tree-lazy': [
    {
      id: 'lazy-mcq',
      kind: 'mcq',
      prompt: 'Lazy propagation exists to…',
      choices: [
        'Avoid storing the tree',
        'Push pending range updates only when needed',
        'Sort queries offline',
        'Replace DSU',
      ],
      answer: 1,
      explain_md: 'Tag nodes; push to children on descend — range add/update in O(log N).',
    },
  ],

  'bfs-01': [
    {
      id: 'bfs01-mcq',
      kind: 'mcq',
      prompt: '0-1 BFS uses a deque because…',
      choices: [
        'All edges weight 1',
        'Weight-0 edges push front, weight-1 push back',
        'It needs a binary heap',
        'Negative edges appear',
      ],
      answer: 1,
      explain_md: 'Maintains increasing dist like Dial/deque Dijkstra for {0,1}.',
    },
  ],

  'mst-prim': [
    {
      id: 'prim-mcq',
      kind: 'mcq',
      prompt: 'Prim grows the MST by…',
      choices: [
        'Sorting all edges globally first (Kruskal)',
        'Repeatedly adding the lightest edge out of the tree',
        'Running Bellman-Ford',
        'Finding SCCs',
      ],
      answer: 1,
      explain_md: 'Like Dijkstra on “distance to tree”; heap Prim is O(M log N).',
    },
  ],

  'ad-hoc': [
    {
      id: 'adhoc-mcq',
      kind: 'mcq',
      prompt: 'Ad-hoc problems usually reward…',
      choices: [
        'Only copying a named algorithm',
        'Careful casework, invariants, and construction',
        'Always max-flow',
        'Ignoring samples',
      ],
      answer: 1,
      explain_md: 'No single template — prove structure, then implement carefully.',
    },
  ],

  'math-number-theory': [
    {
      id: 'nt-mcq',
      kind: 'mcq',
      prompt: 'Modular inverse of a mod m (m prime) via Fermat is…',
      choices: ['a^{m}', 'a^{m-2} mod m', 'a/2', 'gcd only'],
      answer: 1,
      explain_md: '$a^{p-2} \\equiv a^{-1} \\pmod p$ when p∤a.',
    },
  ],

  'geometry-basics': [
    {
      id: 'geo-mcq',
      kind: 'mcq',
      prompt: 'Cross product (B−A)×(C−A) sign tells…',
      choices: [
        'Distance only',
        'Left/right turn / orientation',
        'Whether AB is an MST edge',
        'Hash of the points',
      ],
      answer: 1,
      explain_md: 'Orientation test — core of hulls and segment intersection.',
    },
  ],

  interactive: [
    {
      id: 'inter-mcq',
      kind: 'mcq',
      prompt: 'After printing a query you must usually…',
      choices: [
        'Sleep 1 second',
        'Flush stdout',
        'Close stdin',
        'Recompile',
      ],
      answer: 1,
      explain_md: 'Without flush the judge never sees the query → TLE/idleness.',
    },
  ],

  'flows-matching': [
    {
      id: 'fm-mcq',
      kind: 'mcq',
      prompt: 'Unit-capacity bipartite matching via flow sets each edge cap to…',
      choices: ['∞', '1', 'N', '0'],
      answer: 1,
      explain_md: 'Cap 1 + source/sink edges model assignment.',
    },
  ],

  'hash-map': [
    {
      id: 'hm-mcq',
      kind: 'mcq',
      prompt: 'Unordered map average lookup is…',
      choices: ['O(log N)', 'O(1) expected', 'O(N) always', 'O(N log N)'],
      answer: 1,
      explain_md: 'Expected O(1); worst-case adversarial — custom hash if needed.',
    },
  ],

  'stack-ds': [
    {
      id: 'stack-trace',
      kind: 'trace',
      title: 'Stack ops',
      context_md: 'Empty stack. Ops: push 2, push 5, pop, push 3.',
      steps: [
        {
          prompt: 'After these ops, top is?',
          choices: ['2', '5', '3', 'empty'],
          answer: 2,
          explain_md: 'push2, push5, pop→2 left, push3 → top **3**.',
        },
      ],
    },
  ],

  'queue-ds': [
    {
      id: 'queue-trace',
      kind: 'trace',
      title: 'Queue ops',
      context_md: 'Empty queue. Ops: push 1, push 4, pop, push 7.',
      steps: [
        {
          prompt: 'Front after these ops?',
          choices: ['1', '4', '7', 'empty'],
          answer: 1,
          explain_md: 'FIFO: pop removes 1; front is **4**.',
        },
      ],
    },
  ],
};
