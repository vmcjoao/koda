import type { LearnLesson } from '@/types/learn';

/** Paradigm, data-structure, and advanced-variant lessons. */
export const LESSONS_MORE: LearnLesson[] = [
  // ── Techniques (paradigms) ──
  {
    id: 'greedy',
    tagLabel: 'Greedy',
    tagKind: 'paradigm',
    title: 'Greedy',
    family: 'techniques',
    summary: 'Commit to the locally best choice when the problem structure allows it.',
    usage_md:
      'Interval scheduling, Huffman-style merges, sorting then scanning, “always take the cheapest edge that still works”. Prove an exchange argument or matroid-like structure when you can.\n\n**Pitfall:** a greedy that “looks right” on samples but fails without a proof — keep a brute force to stress-test.',
    complexity: {
      time: 'Often O(N log N)',
      extraMemory: 'O(N)',
      notes_md: 'Sorting usually dominates. Exact bound depends on the selection step.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [4, 1, 3, 2, 5] },
    },
    relatedIds: ['sorting', 'mst', 'binary-search-answer'],
    implementation: {
      language: 'cpp',
      code: `// classic: max number of non-overlapping intervals
int max_intervals(vector<pair<int,int>> a) {
  sort(a.begin(), a.end(), [](auto& A, auto& B) {
    return A.second < B.second; // by end time
  });
  int ans = 0, end = INT_MIN;
  for (auto [l, r] : a) if (l >= end) {
    ans++;
    end = r;
  }
  return ans;
}`,
      notes_md: 'Sort key is the proof: earliest finish leaves the most room for the rest.',
    },
  },
  {
    id: 'brute-force',
    tagLabel: 'Brute Force',
    tagKind: 'paradigm',
    title: 'Complete Search',
    family: 'techniques',
    summary: 'Enumerate the search space — prune hard, generate carefully.',
    usage_md:
      'Backtracking, bitmasks over $N \\le 20$, next_permutation, recursive builders. Always estimate $O(\\textit{states} \\times \\textit{transition})$ before coding.\n\n**Pitfall:** exploring symmetric states repeatedly — add canonicalization or visited marks early.',
    complexity: {
      time: 'O(states · work)',
      extraMemory: 'O(depth)',
      notes_md: 'Typical contest limits: $2^{20}$, $9!$, or heavily pruned DFS.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [3, 1, 4, 1, 5] },
    },
    relatedIds: ['bitmask-dp', 'meet-in-middle', 'divide-conquer'],
    implementation: {
      language: 'cpp',
      code: `// enumerate all subsets (n <= 20); body sees mask + subset sum
void for_each_subset(vector<int>& a, auto body) {
  int n = (int)a.size();
  for (int mask = 0; mask < (1 << n); mask++) {
    long long sum = 0;
    for (int i = 0; i < n; i++) if (mask >> i & 1) sum += a[i];
    body(mask, sum);
  }
}`,
      notes_md: 'Switch to recursive backtracking when you need pruning mid-build (e.g. stop when sum already exceeds a bound).',
    },
  },
  {
    id: 'divide-conquer',
    tagLabel: 'Divide & Conquer',
    tagKind: 'paradigm',
    title: 'Divide & Conquer',
    family: 'techniques',
    summary: 'Split the problem, solve parts, merge — including DnC DP optimization.',
    usage_md:
      'Mergesort-style counting, closest pair, FFT mindset, and **divide-and-conquer DP** when $opt[i][j]$ is monotone.\n\n**Pitfall:** merging incorrectly (off-by-one mid) or applying DnC optimization without the quadrangle / monotone inequality.',
    complexity: {
      time: 'T(N) = 2T(N/2) + merge',
      extraMemory: 'O(N)',
      notes_md: 'Mergesort is the template: $O(N \\log N)$ when merge is linear.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [4, 1, 3, 2, 5] },
    },
    relatedIds: ['mergesort', 'binary-search', 'dynamic-programming'],
    implementation: {
      language: 'cpp',
      code: `// count inversions while sorting a[l..r)
long long merge_count(vector<int>& a, int l, int r, vector<int>& tmp) {
  if (r - l <= 1) return 0;
  int m = (l + r) / 2;
  long long inv = merge_count(a, l, m, tmp) + merge_count(a, m, r, tmp);
  int i = l, j = m, k = l;
  while (i < m || j < r) {
    if (j == r || (i < m && a[i] <= a[j])) tmp[k++] = a[i++];
    else { tmp[k++] = a[j++]; inv += m - i; }
  }
  for (int t = l; t < r; t++) a[t] = tmp[t];
  return inv;
}`,
      notes_md: 'Same skeleton as mergesort; the `inv += m - i` line is the merge insight.',
    },
  },
  {
    id: 'two-pointers',
    tagLabel: 'Two Pointers',
    tagKind: 'paradigm',
    title: 'Two Pointers / Sliding Window',
    family: 'search',
    summary: 'Advance indices monotonically over a sorted array or a growing/shrinking window.',
    usage_md:
      'Two flavors:\n\n1. **Opposite ends** on a sorted array — two-sum, pair with difference $K$, container-with-most-water style.\n2. **Sliding window** — `l` and `r` move only forward; maintain a window invariant (sum ≤ budget, ≤ K distinct, all equal, …).\n\nTotal movement is $O(N)$ when each index enters/leaves at most once. Needs a **monotone** condition: expanding $r$ only makes the predicate “worse”, shrinking $l` only makes it “better”.\n\n**Pitfall:** resetting frequency maps wrong when shrinking; using the pattern on non-monotone predicates (then you need sets/multisets or sparse tables).',
    complexity: {
      time: 'O(N)',
      extraMemory: 'O(1) or O(Σ)',
      notes_md: 'Alphabet/frequency maps add $O(\\Sigma)$ memory for sliding windows.',
    },
    relatedIds: ['sorting', 'binary-search', 'prefix-sums', 'deque-window'],
    visualization: {
      kind: 'array-two-pointers',
      demo: { values: [2, 1, 3, 2, 1, 4, 2], target: 5 },
    },
    implementation: {
      language: 'cpp',
      code: `// longest subarray with sum <= budget (non-negative a[i])
int longest_sum_at_most(const vector<int>& a, long long budget) {
  int n = (int)a.size(), best = 0, l = 0;
  long long sum = 0;
  for (int r = 0; r < n; r++) {
    sum += a[r];
    while (sum > budget) sum -= a[l++];
    best = max(best, r - l + 1);
  }
  return best;
}

// two-sum count on sorted a: pairs i<j with a[i]+a[j]==x
long long count_pair_sum(vector<int> a, long long x) {
  sort(a.begin(), a.end());
  int l = 0, r = (int)a.size() - 1;
  long long ans = 0;
  while (l < r) {
    long long s = a[l] + (long long)a[r];
    if (s == x) { ans++; l++; r--; } // extend for duplicates if needed
    else if (s < x) l++;
    else r--;
  }
  return ans;
}
`,
      notes_md: 'Non-negative elements (or a monotone window metric) make the shrink loop valid.',
    },
  },
  {
    id: 'binary-search-answer',
    tagLabel: 'Binary Search on Answer',
    tagKind: 'paradigm',
    title: 'Binary Search on Answer',
    family: 'search',
    summary: 'Search the numeric answer when “is x feasible?” flips once.',
    usage_md:
      'Pattern: the answer is some integer/real $x$, and `ok(x)` is monotone (false…false,true…true or the reverse). Binary search $x$; each probe runs a greedy/DP/graph check in $O(f(N))$.\n\nClassics: minimize the maximum load, maximize the minimum distance (aggressive cows), smallest capacity to finish in $T$ days.\n\nOn **reals**, run a fixed ~80–100 iterations instead of an epsilon exit.\n\nArray lower/upper bound are different tools — see those lessons. This one searches the **answer**, not an index in `a[]`.\n\n**Pitfall:** `ok` that isn’t monotone; wrong min vs max template (`mid` bias); `(lo+hi)/2` overflow on 64-bit ranges.',
    complexity: {
      time: 'O(f(N) log R)',
      extraMemory: 'O(1)',
      notes_md: '$R$ = size of the answer range; $f(N)$ = cost of one feasibility check.',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], target: 5 },
    },
    relatedIds: ['binary-search', 'lower-bound', 'upper-bound', 'ternary-search'],
    implementation: {
      language: 'cpp',
      code: `// minimize x such that ok(x) is true (ok monotone false→true)
int min_feasible(int lo, int hi, auto ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// maximize x such that ok(x) is true (ok monotone true→false)
int max_feasible(int lo, int hi, auto ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo + 1) / 2; // bias up so lo can advance
    if (ok(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// reals: fixed iterations
double min_feasible_real(double lo, double hi, auto ok) {
  for (int it = 0; it < 80; it++) {
    double mid = (lo + hi) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
}
`,
      notes_md: 'Pick min vs max from whether larger $x$ makes the predicate easier (min) or harder (max).',
    },
  },

  // ── DP ──
  {
    id: 'dynamic-programming',
    tagLabel: 'Dynamic Programming',
    tagKind: 'paradigm',
    title: 'Dynamic Programming',
    family: 'dp',
    summary: 'Define states and transitions — reuse overlapping subproblems.',
    usage_md:
      'Start from a recurrence: what is the last choice? Typical shapes: linear DP, knapsack, digit DP, tree DP, interval DP, bitmask DP.\n\nWrite state → transition → base → order of computation (or memoized recursion).\n\n**Pitfall:** wrong transition order (using a state before it is ready); off-by-one on inclusive ranges; exploding state space.',
    complexity: {
      time: 'O(states · transitions)',
      extraMemory: 'O(states)',
    },
    visualization: {
      kind: 'dp-knapsack',
      demo: { weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 },
    },
    relatedIds: ['knapsack', 'bitmask-dp', 'lis'],
    implementation: {
      language: 'cpp',
      code: `// coin change: min coins to make sum S (unbounded)
int min_coins(vector<int>& coins, int S) {
  const int INF = 1e9;
  vector<int> dp(S + 1, INF);
  dp[0] = 0;
  for (int x = 1; x <= S; x++)
    for (int c : coins) if (c <= x) dp[x] = min(dp[x], dp[x - c] + 1);
  return dp[S] >= INF ? -1 : dp[S];
}`,
      notes_md: 'This is the unbounded knapsack pattern. For 0/1, iterate items outer and capacity descending.',
    },
  },
  {
    id: 'bitmask-dp',
    tagLabel: 'Bitmask / Bit DP',
    tagKind: 'paradigm',
    title: 'Bitmask DP',
    family: 'dp',
    summary: 'DP over subsets — N≤20 assignment and TSP-style problems.',
    usage_md:
      'State is a subset mask (and maybe a current vertex). Transitions set/clear bits. Classic: TSP, homework assignment, Digits with used flags.\n\n**Pitfall:** $N > 20$ without extra structure; iterating submasks $O(3^N)$ when you only needed $O(2^N \\cdot N)$.',
    complexity: {
      time: 'O(2^N · N²) typical TSP',
      extraMemory: 'O(2^N · N)',
      notes_md: 'Submask enumeration is $O(3^N)$ — use when combining two halves of a mask.',
    },
    visualization: {
      kind: 'dp-knapsack',
      demo: { weights: [2, 3, 4], values: [3, 4, 5], capacity: 5 },
    },
    relatedIds: ['brute-force', 'meet-in-middle', 'dynamic-programming'],
    implementation: {
      language: 'cpp',
      code: `// assignment: min cost matching n jobs to n workers; cost[i][j]
long long assign_min(vector<vector<int>>& cost) {
  int n = (int)cost.size();
  const long long INF = 4e18;
  vector<long long> dp(1 << n, INF);
  dp[0] = 0;
  for (int mask = 0; mask < (1 << n); mask++) if (dp[mask] < INF) {
    int i = __builtin_popcount(mask); // next person
    if (i == n) continue;
    for (int j = 0; j < n; j++) if (!(mask >> j & 1))
      dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[i][j]);
  }
  return dp[(1 << n) - 1];
}`,
      notes_md: 'Person index = popcount(mask) assumes people are assigned in order $0..n-1$.',
    },
  },

  // ── Structures ──
  {
    id: 'fenwick',
    tagLabel: 'Fenwick Tree',
    tagKind: 'data_structure',
    title: 'Fenwick Tree (BIT)',
    family: 'structures',
    summary: 'Prefix sums with point updates in O(log N) — tiny code.',
    usage_md:
      'Frequency tables, inversion counts, order-statistic via binary lifting on the tree. Prefer over a segment tree when you only need invertible prefix ops.\n\n**Pitfall:** 1-based indexing discipline; forgetting to size the tree to $N+1$.',
    complexity: {
      time: 'O(log N) per op',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [1, 2, 3, 4, 5, 6] },
    },
    relatedIds: ['prefix-sums', 'segment-tree', 'difference-array'],
    implementation: {
      language: 'cpp',
      code: `struct Fenwick {
  int n; vector<long long> bit;
  Fenwick(int n): n(n), bit(n + 1, 0) {}
  void add(int i, long long v) { // 1-based
    for (; i <= n; i += i & -i) bit[i] += v;
  }
  long long sumPrefix(int i) {
    long long s = 0;
    for (; i > 0; i -= i & -i) s += bit[i];
    return s;
  }
  long long rangeSum(int l, int r) { // inclusive
    return sumPrefix(r) - sumPrefix(l - 1);
  }
};`,
      notes_md: 'Convert 0-based index $i$ with `add(i+1, v)`.',
    },
  },
  {
    id: 'sparse-table',
    tagLabel: 'Sparse Table',
    tagKind: 'data_structure',
    title: 'Sparse Table (RMQ)',
    family: 'structures',
    summary: 'Static range idempotent queries in O(1) after O(N log N) build.',
    usage_md:
      'Range minimum / gcd / and / or on a static array. Overlapping blocks are OK because the op is idempotent.\n\n**Pitfall:** using it for range **sum** (not idempotent) — overlaps double-count. For sums use prefix/fenwick/segtree.',
    complexity: {
      time: 'O(N log N) build, O(1) query',
      extraMemory: 'O(N log N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [4, 2, 3, 7, 1, 5] },
    },
    relatedIds: ['segment-tree', 'fenwick', 'prefix-sums'],
    implementation: {
      language: 'cpp',
      code: `struct SparseMin {
  int n; vector<int> lg; vector<vector<int>> st;
  SparseMin(vector<int>& a) {
    n = (int)a.size();
    lg.assign(n + 1, 0);
    for (int i = 2; i <= n; i++) lg[i] = lg[i / 2] + 1;
    int L = lg[n] + 1;
    st.assign(L, vector<int>(n));
    st[0] = a;
    for (int k = 1; k < L; k++)
      for (int i = 0; i + (1 << k) <= n; i++)
        st[k][i] = min(st[k - 1][i], st[k - 1][i + (1 << (k - 1))]);
  }
  int qry(int l, int r) { // inclusive
    int k = lg[r - l + 1];
    return min(st[k][l], st[k][r - (1 << k) + 1]);
  }
};`,
    },
  },
  {
    id: 'trie',
    tagLabel: 'Trie',
    tagKind: 'data_structure',
    title: 'Trie (Prefix Tree)',
    family: 'structures',
    summary: 'Store strings by characters — prefix queries and XOR tries.',
    usage_md:
      'Autocomplete / prefix counts, dictionary matching, binary trie for maximum XOR pair.\n\n**Pitfall:** memory blow-up if you allocate 26 children eagerly on huge alphabets without care; forgetting to mark word ends.',
    complexity: {
      time: 'O(L) per insert/query',
      extraMemory: 'O(total characters)',
    },
    visualization: {
      kind: 'string-z',
      demo: { text: 'abaabc' },
    },
    relatedIds: ['kmp', 'string-hashing', 'z-algorithm'],
    implementation: {
      language: 'cpp',
      code: `struct Trie {
  struct Node { int next[26]; int cnt = 0; bool end = false; Node() { memset(next, -1, sizeof next); } };
  vector<Node> t;
  Trie() { t.push_back(Node()); }
  void insert(const string& s) {
    int u = 0;
    for (char ch : s) {
      int c = ch - 'a';
      if (t[u].next[c] < 0) { t[u].next[c] = (int)t.size(); t.push_back(Node()); }
      u = t[u].next[c];
      t[u].cnt++;
    }
    t[u].end = true;
  }
  int prefixCount(const string& s) {
    int u = 0;
    for (char ch : s) {
      int c = ch - 'a';
      if (t[u].next[c] < 0) return 0;
      u = t[u].next[c];
    }
    return t[u].cnt;
  }
};`,
      notes_md: 'For XOR tries use bit nodes (2 children) from MSB to LSB.',
    },
  },
  {
    id: 'monotonic-stack',
    tagLabel: 'Monotonic Stack',
    tagKind: 'data_structure',
    title: 'Monotonic Stack',
    family: 'structures',
    summary: 'Next greater / smaller element in O(N) with a stack.',
    usage_md:
      'Next greater element, histogram largest rectangle, contribution of minima over subarrays.\n\nMaintain indices with decreasing (or increasing) values; pop when the monotone property breaks.\n\n**Pitfall:** storing values instead of indices when you need spans; off-by-one on empty-stack sentinels.',
    complexity: {
      time: 'O(N)',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'mono-stack',
      demo: { values: [2, 1, 5, 6, 2, 3] },
    },
    implementation: {
      language: 'cpp',
      code: `// next greater element to the right; -1 if none
vector<int> next_greater(vector<int>& a) {
  int n = (int)a.size();
  vector<int> ng(n, -1);
  stack<int> st;
  for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.top()] < a[i]) {
      ng[st.top()] = i;
      st.pop();
    }
    st.push(i);
  }
  return ng;
}`,
      notes_md: 'Flip the comparison for next smaller. Scan right→left for nearest on the left.',
    },
  },
  {
    id: 'priority-queue',
    tagLabel: 'Priority Queue',
    tagKind: 'data_structure',
    title: 'Priority Queue (Heap)',
    family: 'structures',
    summary: 'Repeatedly extract min/max in O(log N) — Dijkstra, merging.',
    usage_md:
      'Dijkstra, Huffman merges, “process next event”, keeping top-$K$. C++ `priority_queue` is a max-heap by default.\n\n**Pitfall:** using a max-heap when you needed min (wrap with `greater<>`); assuming decrease-key exists — Dijkstra usually pushes duplicates instead.',
    complexity: {
      time: 'O(log N) push/pop',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [5, 1, 8, 3, 2] },
    },
    relatedIds: ['dijkstra', 'sorting', 'greedy'],
    implementation: {
      language: 'cpp',
      code: `// min-heap of pairs (priority, id)
priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
pq.push({0, start});
while (!pq.empty()) {
  auto [d, u] = pq.top(); pq.pop();
  // if (d != dist[u]) continue; // Dijkstra stale check
  // relax neighbors → pq.push({nd, v});
}`,
      notes_md: '`std::greater<>` turns the default max-heap into a min-heap.',
    },
  },
  {
    id: 'ordered-set',
    tagLabel: 'Ordered Set',
    tagKind: 'data_structure',
    title: 'Ordered Set / Policy Set',
    family: 'structures',
    summary: 'Balanced BST — order statistics, predecessor, dynamic sorted data.',
    usage_md:
      '`std::set` / `map` for predecessor queries; GNU `ordered_set` for find_by_order / order_of_key. Sweep lines and online medians.\n\n**Pitfall:** relying on `order_of_key` without policy_set (not portable); iterator invalidation after erase.',
    complexity: {
      time: 'O(log N) per op',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `// predecessor / successor with std::set
set<int> s;
s.insert(2); s.insert(5); s.insert(9);

auto it = s.lower_bound(6);      // first >= 6 → 9
int succ = (it == s.end() ? -1 : *it);
int pred = (it == s.begin() ? -1 : *prev(it)); // first < 6 → 5

// order statistics (portable): compress + Fenwick
// add(rank[x], +1);  howManyLeq = fenwick.sumPrefix(rank[x]);`,
      notes_md: 'GCC policy `indexed_set` gives `find_by_order` / `order_of_key` in $O(\\log N)$. On portable C++, pair compression with a Fenwick tree.',
    },
  },
  {
    id: 'deque-window',
    tagLabel: 'Deque',
    tagKind: 'data_structure',
    title: 'Deque & Sliding Window Extremum',
    family: 'structures',
    summary: 'Monotonic deque for window minimum/maximum in O(N).',
    usage_md:
      'Sliding window maximum, 0-1 BFS queue (push front/back), DP optimizations that need both ends.\n\n**Pitfall:** forgetting to pop expired indices from the front when the window moves.',
    complexity: {
      time: 'O(N)',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'mono-stack',
      demo: { values: [1, 3, 2, 5, 4, 6] },
    },
    relatedIds: ['monotonic-stack', 'two-pointers', 'queue-ds'],
    implementation: {
      language: 'cpp',
      code: `// sliding window maximum over windows of length k; returns n-k+1 answers
vector<int> window_max(vector<int>& a, int k) {
  deque<int> dq; // indices, a[dq] decreasing
  vector<int> ans;
  for (int i = 0; i < (int)a.size(); i++) {
    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
    dq.push_back(i);
    if (dq.front() <= i - k) dq.pop_front();
    if (i >= k - 1) ans.push_back(a[dq.front()]);
  }
  return ans;
}`,
    },
  },

  // ── Advanced algorithm variants ──
  {
    id: 'segment-tree-lazy',
    tagLabel: 'Segment Tree',
    title: 'Segment Tree with Lazy Propagation',
    family: 'structures',
    summary: 'Range add + range sum/min with lazy tags.',
    usage_md:
      'When updates touch a whole segment, push a pending tag down only when you recurse into children.\n\n**Pitfall:** forgetting `push` before reading children; applying the tag to `t[v]` incorrectly (sum needs length $\\times$ add).',
    complexity: {
      time: 'O(log N) per op',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'segtree-sum',
      demo: { values: [2, 1, 4, 3, 5, 6] },
    },
    relatedIds: ['segment-tree', 'fenwick', 'sparse-table'],
    implementation: {
      language: 'cpp',
      code: `struct LazySeg {
  int n; vector<long long> t, lz;
  LazySeg(int n): n(n), t(4 * n), lz(4 * n) {}
  void apply(int v, int tl, int tr, long long add) {
    t[v] += add * (tr - tl + 1);
    lz[v] += add;
  }
  void push(int v, int tl, int tr) {
    if (!lz[v] || tl == tr) return;
    int tm = (tl + tr) / 2;
    apply(2 * v, tl, tm, lz[v]);
    apply(2 * v + 1, tm + 1, tr, lz[v]);
    lz[v] = 0;
  }
  void rangeAdd(int v, int tl, int tr, int l, int r, long long add) {
    if (l > r) return;
    if (l == tl && r == tr) { apply(v, tl, tr, add); return; }
    push(v, tl, tr);
    int tm = (tl + tr) / 2;
    rangeAdd(2 * v, tl, tm, l, min(r, tm), add);
    rangeAdd(2 * v + 1, tm + 1, tr, max(l, tm + 1), r, add);
    t[v] = t[2 * v] + t[2 * v + 1];
  }
  long long rangeSum(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return t[v];
    push(v, tl, tr);
    int tm = (tl + tr) / 2;
    return rangeSum(2 * v, tl, tm, l, min(r, tm))
         + rangeSum(2 * v + 1, tm + 1, tr, max(l, tm + 1), r);
  }
};`,
      notes_md: 'Same practice pool as Segment Tree. Start from the point-update lesson first.',
    },
  },
  {
    id: 'difference-array',
    tagLabel: 'Prefix Sums',
    title: 'Difference Array',
    family: 'structures',
    summary: 'Range updates in O(1), then prefix to materialize.',
    usage_md:
      'Many range-add queries on a static array, then answer point/range queries after one prefix pass.\n\nOn $[L,R]$ add $v$: `d[L]+=v`, `d[R+1]-=v`, then `a[i] = a[i-1] + d[i]`.\n\n**Pitfall:** forgetting the `R+1` decrement; mixing 0-based / 1-based ends.',
    complexity: {
      time: 'O(1) update, O(N) build',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [2, -1, 3, 0, -2, 1] },
    },
    relatedIds: ['prefix-sums', 'fenwick', 'segment-tree'],
    implementation: {
      language: 'cpp',
      code: `// apply range adds, then build final array
vector<long long> apply_range_adds(int n, vector<array<long long,3>>& ops) {
  vector<long long> d(n + 1);
  for (auto [l, r, v] : ops) { // inclusive l..r, 0-based
    d[l] += v;
    if (r + 1 < n) d[r + 1] -= v;
  }
  vector<long long> a(n);
  long long cur = 0;
  for (int i = 0; i < n; i++) {
    cur += d[i];
    a[i] = cur;
  }
  return a;
}`,
      notes_md: 'Shares Prefix Sums practice picks — look for range-update statements.',
    },
  },
  {
    id: 'bfs-01',
    tagLabel: 'BFS',
    title: '0-1 BFS',
    family: 'graphs',
    summary: 'Shortest paths when every edge weight is 0 or 1 — deque BFS.',
    usage_md:
      'Grids where some moves are free, graphs with two costs. Push weight-0 edges to the **front** of a deque and weight-1 to the back.\n\n**Pitfall:** using a normal queue (wrong) or Dijkstra (correct but slower to write); not handling multiple pushes with a settled check.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'graph-bfs',
      demo: {
        nodes: [
          { id: '0', x: 40, y: 110, label: '0' },
          { id: '1', x: 140, y: 50, label: '1' },
          { id: '2', x: 140, y: 170, label: '2' },
          { id: '3', x: 260, y: 110, label: '3' },
        ],
        edges: [
          { from: '0', to: '1', w: 0 },
          { from: '0', to: '2', w: 1 },
          { from: '1', to: '3', w: 1 },
          { from: '2', to: '3', w: 0 },
        ],
        start: '0',
      },
    },
    relatedIds: ['bfs', 'dijkstra'],
    implementation: {
      language: 'cpp',
      code: `vector<int> bfs01(int n, vector<vector<pair<int,int>>>& g, int s) {
  const int INF = 1e9;
  vector<int> dist(n, INF);
  deque<int> dq;
  dist[s] = 0;
  dq.push_back(s);
  while (!dq.empty()) {
    int u = dq.front(); dq.pop_front();
    for (auto [v, w] : g[u]) { // w is 0 or 1
      if (dist[v] > dist[u] + w) {
        dist[v] = dist[u] + w;
        if (w == 0) dq.push_front(v);
        else dq.push_back(v);
      }
    }
  }
  return dist;
}`,
      notes_md: 'Same BFS practice pool. Prefer this over Dijkstra when weights are only 0/1.',
    },
  },
  {
    id: 'mst-prim',
    tagLabel: 'MST',
    title: 'MST (Prim)',
    family: 'graphs',
    summary: 'Grow the MST from a source with a priority queue.',
    usage_md:
      'Dense graphs sometimes prefer Prim $O(N^2)$. Sparse graphs: binary-heap Prim like Dijkstra.\n\n**Pitfall:** forgetting the `used` check (same stale-heap issue as Dijkstra).',
    complexity: {
      time: 'O(M log N)',
      extraMemory: 'O(N)',
      notes_md: 'Kruskal is usually simpler with a DSU; Prim fits “grow a component” thinking.',
    },
    visualization: { kind: 'graph-mst', demo: {
      nodes: [
        { id: '0', x: 40, y: 110, label: '0' },
        { id: '1', x: 120, y: 40, label: '1' },
        { id: '2', x: 120, y: 180, label: '2' },
        { id: '3', x: 200, y: 110, label: '3' },
        { id: '4', x: 280, y: 40, label: '4' },
        { id: '5', x: 280, y: 180, label: '5' },
      ],
      edges: [
        { from: '0', to: '1', w: 2 },
        { from: '0', to: '2', w: 4 },
        { from: '1', to: '3', w: 3 },
        { from: '2', to: '3', w: 1 },
        { from: '3', to: '4', w: 2 },
        { from: '3', to: '5', w: 5 },
        { from: '1', to: '4', w: 7 },
      ],
      start: '0',
    } },
    relatedIds: ['mst', 'dijkstra', 'dsu'],
    implementation: {
      language: 'cpp',
      code: `long long prim(int n, vector<vector<pair<int,int>>>& g) {
  const long long INF = 4e18;
  vector<long long> key(n, INF);
  vector<char> used(n, 0);
  priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
  key[0] = 0;
  pq.push({0, 0});
  long long ans = 0;
  int taken = 0;
  while (!pq.empty() && taken < n) {
    auto [d, u] = pq.top(); pq.pop();
    if (used[u]) continue;
    used[u] = 1;
    ans += d;
    taken++;
    for (auto [v, w] : g[u]) if (!used[v] && w < key[v]) {
      key[v] = w;
      pq.push({key[v], v});
    }
  }
  return taken == n ? ans : -1;
}`,
    },
  },
];
