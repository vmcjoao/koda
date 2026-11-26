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
};