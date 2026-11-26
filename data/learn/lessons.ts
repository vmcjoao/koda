import type { LearnLesson } from '@/types/learn';

const DEMO_GRAPH = {
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
};

export const LESSONS: LearnLesson[] = [
  {
    id: 'bfs',
    tagLabel: 'BFS',
    title: 'BFS',
    family: 'graphs',
    summary: 'Layer-by-layer exploration — shortest path in unweighted graphs.',
    usage_md:
      'Use BFS when edges have equal cost (or no weights) and you need the fewest edges from a source. Classic jobs: shortest path in a grid, bipartite check, multi-source flood fill.\n\n**Pitfall:** forgetting the visited mark when enqueueing → exponential blow-up.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N)',
      notes_md: 'Queue + visited (or dist[]) over N nodes and M edges.',
    },
    visualization: { kind: 'graph-bfs', demo: DEMO_GRAPH },
    implementation: {
      language: 'cpp',
      code: `vector<int> bfs(int n, vector<vector<int>>& g, int s) {
  vector<int> dist(n, -1);
  queue<int> q;
  dist[s] = 0;
  q.push(s);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) if (dist[v] < 0) {
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}`,
      notes_md: 'Adjacency list undirected/directed. `dist[v] < 0` doubles as visited.',
    },
  },
  {
    id: 'dfs',
    tagLabel: 'DFS',
    title: 'DFS',
    family: 'graphs',
    summary: 'Go deep first — components, cycles, recursion on graphs/trees.',
    usage_md:
      'DFS is the default “walk the graph” tool: connected components, cycle detection, topological order (via finish times), flood fill, tree DP.\n\n**Pitfall:** recursion depth on large N — prefer explicit stack or raise limits carefully.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N)',
      notes_md: 'Color/visited array; recursion stack can be O(N).',
    },
    visualization: { kind: 'graph-dfs', demo: DEMO_GRAPH },
    implementation: {
      language: 'cpp',
      code: `void dfs(int u, vector<vector<int>>& g, vector<int>& vis) {
  vis[u] = 1;
  for (int v : g[u]) if (!vis[v]) dfs(v, g, vis);
}

// components
int components(int n, vector<vector<int>>& g) {
  vector<int> vis(n);
  int c = 0;
  for (int i = 0; i < n; i++) if (!vis[i]) {
    dfs(i, g, vis);
    c++;
  }
  return c;
}`,
    },
  },
  {
    id: 'dijkstra',
    tagLabel: 'Dijkstra',
    title: 'Dijkstra',
    family: 'graphs',
    summary: 'Shortest paths with non-negative edge weights.',
    usage_md:
      'Need minimum cost from a source when every edge weight is ≥ 0. Grids with move costs, weighted maps, “state graphs” (node = position + extras).\n\n**Pitfall:** negative weights → use Bellman-Ford / SPFA-aware approaches instead. Dense graphs may prefer a simple O(N²) scan.',
    complexity: {
      time: 'O((N + M) log N)',
      extraMemory: 'O(N)',
      notes_md: 'Binary heap Dijkstra. Fibonacci heaps are rare in contests.',
    },
    visualization: { kind: 'graph-dijkstra', demo: DEMO_GRAPH },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll INF = 4e18;

vector<ll> dijkstra(int n, vector<vector<pair<int,ll>>>& g, int s) {
  vector<ll> dist(n, INF);
  priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq;
  dist[s] = 0;
  pq.push({0, s});
  while (!pq.empty()) {
    auto [d, u] = pq.top(); pq.pop();
    if (d != dist[u]) continue;
    for (auto [v, w] : g[u]) if (dist[v] > d + w) {
      dist[v] = d + w;
      pq.push({dist[v], v});
    }
  }
  return dist;
}`,
    },
  },
  {
    id: 'topo-sort',
    tagLabel: 'Topological Sort',
    title: 'Topological Sort',
    family: 'graphs',
    summary: 'Order nodes of a DAG so every edge goes forward.',
    usage_md:
      'Prerequisites, build order, DP on DAGs (“process nodes in topo order”). Kahn’s algorithm (indegrees + queue) also detects cycles when it cannot place all nodes.\n\n**Pitfall:** applying topo sort on a graph that is not a DAG.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'graph-topo',
      demo: {
        nodes: [
          { id: '0', x: 40, y: 110, label: 'A' },
          { id: '1', x: 140, y: 50, label: 'B' },
          { id: '2', x: 140, y: 170, label: 'C' },
          { id: '3', x: 240, y: 110, label: 'D' },
          { id: '4', x: 340, y: 110, label: 'E' },
        ],
        edges: [
          { from: '0', to: '1' },
          { from: '0', to: '2' },
          { from: '1', to: '3' },
          { from: '2', to: '3' },
          { from: '3', to: '4' },
        ],
        start: '0',
      },
    },
    implementation: {
      language: 'cpp',
      code: `vector<int> kahn(int n, vector<vector<int>>& g) {
  vector<int> indeg(n);
  for (int u = 0; u < n; u++) for (int v : g[u]) indeg[v]++;
  queue<int> q;
  for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
  vector<int> order;
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : g[u]) if (--indeg[v] == 0) q.push(v);
  }
  if ((int)order.size() != n) return {}; // cycle
  return order;
}`,
    },
  },
  {
    id: 'mst',
    tagLabel: 'MST',
    title: 'MST (Kruskal)',
    family: 'graphs',
    summary: 'Minimum spanning tree via sorted edges + DSU.',
    usage_md:
      'Connect all vertices with minimum total undirected edge weight (or detect impossibility). Kruskal: sort edges ascending, add if endpoints are in different components.\n\n**Pitfall:** directed graphs / “Steiner” variants are different problems.',
    complexity: {
      time: 'O(M log M)',
      extraMemory: 'O(N)',
      notes_md: 'Sorting dominates; DSU is nearly O(M).',
    },
    visualization: { kind: 'graph-mst', demo: DEMO_GRAPH },
    implementation: {
      language: 'cpp',
      code: `struct DSU {
  vector<int> p, r;
  DSU(int n): p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
  int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
  bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (r[a] < r[b]) swap(a, b);
    p[b] = a;
    if (r[a] == r[b]) r[a]++;
    return true;
  }
};

long long kruskal(int n, vector<array<int,3>>& edges) {
  sort(edges.begin(), edges.end()); // w, u, v
  DSU dsu(n);
  long long ans = 0; int used = 0;
  for (auto [w, u, v] : edges) if (dsu.unite(u, v)) {
    ans += w; used++;
  }
  return used == n - 1 ? ans : -1;
}`,
    },
  },
  {
    id: 'binary-search',
    tagLabel: 'Binary Search',
    title: 'Binary Search',
    family: 'search',
    summary: 'Halve a monotonic search space — on arrays or on the answer.',
    usage_md:
      'Sorted array lookup, lower_bound/upper_bound, and **binary search on the answer** when “can we achieve X?” is monotonic.\n\n**Pitfall:** off-by-one in `lo/hi` updates; overflow in `(lo+hi)/2` — prefer `lo + (hi-lo)/2`.',
    complexity: {
      time: 'O(log N)',
      extraMemory: 'O(1)',
      notes_md: 'On-the-answer variants multiply by the cost of the feasibility check.',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [2, 4, 5, 7, 9, 12, 15, 18], target: 9 },
    },
    implementation: {
      language: 'cpp',
      code: `// first index with a[i] >= x (lower_bound)
int lower_bound_idx(vector<int>& a, int x) {
  int lo = 0, hi = (int)a.size();
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// binary search on answer: max t with ok(t)
int max_feasible(int lo, int hi, auto ok) {
  while (lo < hi) {
    int mid = lo + (hi - lo + 1) / 2;
    if (ok(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
    },
  },
  {
    id: 'dsu',
    tagLabel: 'DSU',
    title: 'DSU (Union-Find)',
    family: 'structures',
    summary: 'Maintain disjoint sets — merge components, query same-set.',
    usage_md:
      'Kruskal MST, connectivity online, “painting offline” tricks, equivalence classes. Path compression + union by rank make it blazing fast in practice.\n\n**Pitfall:** forgetting to `find` before comparing parents.',
    complexity: {
      time: '≈ O(α(N)) per op',
      extraMemory: 'O(N)',
      notes_md: 'α is inverse Ackermann — effectively constant.',
    },
    visualization: {
      kind: 'dsu-merge',
      demo: {
        nodes: [
          { id: '0', x: 50, y: 80, label: '0' },
          { id: '1', x: 130, y: 80, label: '1' },
          { id: '2', x: 210, y: 80, label: '2' },
          { id: '3', x: 290, y: 80, label: '3' },
          { id: '4', x: 170, y: 180, label: '4' },
        ],
        edges: [],
        start: '0',
      },
    },
    implementation: {
      language: 'cpp',
      code: `struct DSU {
  vector<int> p, r;
  DSU(int n): p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }
  int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
  bool same(int a, int b) { return find(a) == find(b); }
  bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (r[a] < r[b]) swap(a, b);
    p[b] = a;
    if (r[a] == r[b]) r[a]++;
    return true;
  }
};`,
    },
  },
  {
    id: 'prefix-sums',
    tagLabel: 'Prefix Sums',
    title: 'Prefix Sums',
    family: 'structures',
    summary: 'Precompute running sums for O(1) range queries.',
    usage_md:
      'Range sum on a static array, 2D grids (inclusion-exclusion), difference arrays for range updates then prefix to materialize.\n\n**Pitfall:** off-by-one on inclusive/exclusive bounds; overflow — use 64-bit.',
    complexity: {
      time: 'O(N) build, O(1) query',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [3, 1, 4, 1, 5, 9, 2] },
    },
    implementation: {
      language: 'cpp',
      code: `// pref[i] = sum of a[0..i)
vector<long long> build_pref(vector<int>& a) {
  int n = a.size();
  vector<long long> pref(n + 1);
  for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + a[i];
  return pref;
}
// sum a[l..r) 
long long range_sum(vector<long long>& pref, int l, int r) {
  return pref[r] - pref[l];
}`,
    },
  },
  {
    id: 'knapsack',
    tagLabel: 'Knapsack',
    title: '0/1 Knapsack',
    family: 'dp',
    summary: 'Pick or skip items under a capacity — classic DP.',
    usage_md:
      'Each item usable at most once; maximize value under weight capacity W. Pattern generalizes to “subset sum”, “count ways”, bounded knapsack.\n\n**Pitfall:** iterating the capacity loop the wrong direction (must go high→low for 0/1 in 1D).',
    complexity: {
      time: 'O(N · W)',
      extraMemory: 'O(W)',
      notes_md: 'N items, capacity W. Meet-in-the-middle if W is huge but N≤40.',
    },
    implementation: {
      language: 'cpp',
      code: `int knapsack(vector<int>& w, vector<int>& v, int W) {
  vector<int> dp(W + 1, 0);
  int n = w.size();
  for (int i = 0; i < n; i++) {
    for (int cap = W; cap >= w[i]; cap--)
      dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
  }
  return dp[W];
}`,
      notes_md: 'Inner loop descends so each item is used at most once.',
    },
  },
  {
    id: 'sieve',
    tagLabel: 'Sieve',
    title: 'Sieve of Eratosthenes',
    family: 'math',
    summary: 'Mark composites to list primes up to N.',
    usage_md:
      'Precompute primes, smallest prime factor (SPF) for fast factorization, Euler’s totient batch, prime sums.\n\n**Pitfall:** starting the inner loop at $i$ instead of $i^2$; 0/1 indexing mistakes on SPF arrays.',
    complexity: {
      time: 'O(N log log N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `vector<int> sieve_primes(int n) {
  vector<bool> is_prime(n + 1, true);
  is_prime[0] = is_prime[1] = false;
  for (int i = 2; 1LL * i * i <= n; i++) if (is_prime[i])
    for (int j = i * i; j <= n; j += i) is_prime[j] = false;
  vector<int> primes;
  for (int i = 2; i <= n; i++) if (is_prime[i]) primes.push_back(i);
  return primes;
}

// SPF for factorization
vector<int> build_spf(int n) {
  vector<int> spf(n + 1);
  iota(spf.begin(), spf.end(), 0);
  for (int i = 2; 1LL * i * i <= n; i++) if (spf[i] == i)
    for (int j = i * i; j <= n; j += i) if (spf[j] == j) spf[j] = i;
  return spf;
}`,
    },
  },
];
