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

  // ── Graphs (continued) ──
  {
    id: 'scc',
    tagLabel: 'SCC',
    title: 'Strongly Connected Components',
    family: 'graphs',
    summary: 'Maximal sets where every node reaches every other — Tarjan / Kosaraju.',
    usage_md:
      'Condensation DAG, 2-SAT, “can A reach B and B reach A?”, counting kingdoms / checkposts.\n\nKosaraju: DFS finish order on G, then DFS on Gᵀ. Tarjan: one DFS with `tin`/`low` stack.\n\n**Pitfall:** treating weak connectivity like strong; forgetting the condensation is a DAG.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N + M)',
    },
    implementation: {
      language: 'cpp',
      code: `// Kosaraju
void dfs1(int u, vector<vector<int>>& g, vector<int>& vis, vector<int>& order) {
  vis[u] = 1;
  for (int v : g[u]) if (!vis[v]) dfs1(v, g, vis, order);
  order.push_back(u);
}
void dfs2(int u, vector<vector<int>>& gt, vector<int>& comp, int cid) {
  comp[u] = cid;
  for (int v : gt[u]) if (comp[v] < 0) dfs2(v, gt, comp, cid);
}
int scc(int n, vector<vector<int>>& g, vector<vector<int>>& gt, vector<int>& comp) {
  vector<int> vis(n), order;
  for (int i = 0; i < n; i++) if (!vis[i]) dfs1(i, g, vis, order);
  comp.assign(n, -1);
  int cid = 0;
  for (int i = n - 1; i >= 0; i--) if (comp[order[i]] < 0)
    dfs2(order[i], gt, comp, cid++);
  return cid;
}`,
    },
  },
  {
    id: 'bridges',
    tagLabel: 'Bridges / Articulation',
    title: 'Bridges & Articulation Points',
    family: 'graphs',
    summary: 'Edges/vertices whose removal increases connected components.',
    usage_md:
      'Critical roads/cities, bridge-tree (2-edge-CC condensation), cactus graphs.\n\nDFS with discovery time `tin` and `low`: bridge when `low[v] > tin[u]`; articulation when root has ≥2 children or `low[child] ≥ tin[u]`.\n\n**Pitfall:** multiple edges — handle edge ids so a parallel edge is not a bridge.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N + M)',
    },
    implementation: {
      language: 'cpp',
      code: `int timer;
vector<int> tin, low;
vector<pair<int,int>> bridges;

void dfs(int u, int p, vector<vector<int>>& g) {
  tin[u] = low[u] = ++timer;
  for (int v : g[u]) {
    if (v == p) continue;
    if (tin[v]) low[u] = min(low[u], tin[v]);
    else {
      dfs(v, u, g);
      low[u] = min(low[u], low[v]);
      if (low[v] > tin[u]) bridges.push_back({u, v});
    }
  }
}

void find_bridges(int n, vector<vector<int>>& g) {
  timer = 0;
  tin.assign(n, 0); low.assign(n, 0);
  bridges.clear();
  for (int i = 0; i < n; i++) if (!tin[i]) dfs(i, -1, g);
}`,
    },
  },
  {
    id: 'max-flow',
    tagLabel: 'Max Flow',
    title: 'Max Flow (Dinic)',
    family: 'graphs',
    summary: 'Maximum s–t flow equals minimum cut — Dinic with level graph + DFS.',
    usage_md:
      'Assignment with capacities, edge-disjoint paths, project selection (min-cut), bipartite matching via unit network.\n\nDinic: BFS levels, then blocking flow via DFS. Great default for contest graphs.\n\n**Pitfall:** forgetting residual reverse edges; overflow on long long capacities.',
    complexity: {
      time: 'O(N² · M) worst; faster in practice',
      extraMemory: 'O(N + M)',
      notes_md: 'Unit networks / bipartite matching are much faster.',
    },
    implementation: {
      language: 'cpp',
      code: `struct Dinic {
  struct E { int to, rev; long long cap; };
  int n; vector<vector<E>> g; vector<int> level, it;
  Dinic(int n): n(n), g(n) {}
  void add(int u, int v, long long c) {
    g[u].push_back({v, (int)g[v].size(), c});
    g[v].push_back({u, (int)g[u].size() - 1, 0});
  }
  bool bfs(int s, int t) {
    level.assign(n, -1); queue<int> q; level[s] = 0; q.push(s);
    while (!q.empty()) {
      int u = q.front(); q.pop();
      for (auto& e : g[u]) if (e.cap > 0 && level[e.to] < 0) {
        level[e.to] = level[u] + 1; q.push(e.to);
      }
    }
    return level[t] >= 0;
  }
  long long dfs(int u, int t, long long f) {
    if (u == t) return f;
    for (int& i = it[u]; i < (int)g[u].size(); i++) {
      auto& e = g[u][i];
      if (e.cap <= 0 || level[e.to] != level[u] + 1) continue;
      long long got = dfs(e.to, t, min(f, e.cap));
      if (!got) continue;
      e.cap -= got; g[e.to][e.rev].cap += got; return got;
    }
    return 0;
  }
  long long maxflow(int s, int t) {
    long long flow = 0, inf = 4e18;
    while (bfs(s, t)) {
      it.assign(n, 0);
      while (long long f = dfs(s, t, inf)) flow += f;
    }
    return flow;
  }
};`,
    },
  },
  {
    id: 'bipartite-matching',
    tagLabel: 'Bipartite Matching',
    title: 'Bipartite Matching',
    family: 'graphs',
    summary: 'Maximum pairs in a bipartite graph — Kuhn or flow.',
    usage_md:
      'Jobs↔workers, rows↔columns covers (König), gophers↔holes. Kuhn DFS augmenting paths is short; Hopcroft–Karp / Dinic for large sparse graphs.\n\n**Pitfall:** building the wrong bipartition; forgetting unmatched left nodes still need tries each round.',
    complexity: {
      time: 'O(V · E) Kuhn; O(E √V) Hopcroft',
      extraMemory: 'O(V + E)',
    },
    implementation: {
      language: 'cpp',
      code: `// Kuhn: left 0..nL-1, right 0..nR-1
vector<vector<int>> g; // left → right
vector<int> matchR, vis;
int timer;

bool try_aug(int u) {
  if (vis[u] == timer) return false;
  vis[u] = timer;
  for (int v : g[u]) {
    if (matchR[v] < 0 || try_aug(matchR[v])) {
      matchR[v] = u; return true;
    }
  }
  return false;
}

int bpm(int nL, int nR) {
  matchR.assign(nR, -1);
  vis.assign(nL, 0); timer = 0;
  int ans = 0;
  for (int u = 0; u < nL; u++) {
    timer++;
    if (try_aug(u)) ans++;
  }
  return ans;
}`,
    },
  },
  {
    id: 'bellman-ford',
    tagLabel: 'Bellman-Ford',
    title: 'Bellman-Ford',
    family: 'graphs',
    summary: 'Shortest paths with negative weights; detect negative cycles.',
    usage_md:
      'When Dijkstra is illegal (negative edges). Also currency exchange / wormhole “can I go back in time?” via negative-cycle detection.\n\nRelax all edges |V|−1 times; one more pass finds nodes affected by a negative cycle.\n\n**Pitfall:** only reporting a cycle that is reachable from the source when the statement requires it.',
    complexity: {
      time: 'O(N · M)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll INF = 4e18;

// returns dist; neg_cycle[v]=true if v reachable from a neg cycle
vector<ll> bellman(int n, vector<array<ll,3>>& edges, int s, vector<char>& neg) {
  vector<ll> dist(n, INF); dist[s] = 0;
  for (int i = 0; i < n - 1; i++)
    for (auto [u, v, w] : edges) if (dist[u] < INF)
      dist[v] = min(dist[v], dist[u] + w);
  neg.assign(n, 0);
  for (auto [u, v, w] : edges) if (dist[u] < INF && dist[v] > dist[u] + w) {
    dist[v] = dist[u] + w; neg[v] = 1;
  }
  // flood neg marks along edges if needed
  return dist;
}`,
    },
  },
  {
    id: 'floyd-warshall',
    tagLabel: 'Floyd-Warshall',
    title: 'Floyd-Warshall',
    family: 'graphs',
    summary: 'All-pairs shortest paths via DP on intermediate nodes.',
    usage_md:
      'Dense graphs with N ≲ 400–500, APSP, closure / reachability with min/or. Easy to implement.\n\n**Pitfall:** N³ time and N² memory — too slow for N≥1000; negative cycles on diagonal.',
    complexity: {
      time: 'O(N³)',
      extraMemory: 'O(N²)',
    },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll INF = 4e18;

void floyd(vector<vector<ll>>& d) {
  int n = d.size();
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++) if (d[i][k] < INF)
      for (int j = 0; j < n; j++) if (d[k][j] < INF)
        d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
}`,
    },
  },
  {
    id: 'lca',
    tagLabel: 'LCA',
    title: 'Lowest Common Ancestor',
    family: 'graphs',
    summary: 'Deepest node that is ancestor of both u and v — binary lifting.',
    usage_md:
      'Tree path queries (dist = depth[u]+depth[v]−2·depth[lca]), subtree checks, virtual trees.\n\nBinary lifting: `up[k][v]` = 2ᵏ-th parent. Also Euler tour + RMQ.\n\n**Pitfall:** rooting the tree wrong; querying before `dfs` init.',
    complexity: {
      time: 'O(N log N) build, O(log N) query',
      extraMemory: 'O(N log N)',
    },
    implementation: {
      language: 'cpp',
      code: `const int LOG = 20;
int n, up[LOG][200001], depth[200001];
vector<int> g[200001];

void dfs(int u, int p) {
  up[0][u] = p;
  for (int k = 1; k < LOG; k++) up[k][u] = up[k-1][up[k-1][u]];
  for (int v : g[u]) if (v != p) {
    depth[v] = depth[u] + 1; dfs(v, u);
  }
}
int lca(int a, int b) {
  if (depth[a] < depth[b]) swap(a, b);
  int diff = depth[a] - depth[b];
  for (int k = 0; k < LOG; k++) if (diff >> k & 1) a = up[k][a];
  if (a == b) return a;
  for (int k = LOG - 1; k >= 0; k--) if (up[k][a] != up[k][b])
    a = up[k][a], b = up[k][b];
  return up[0][a];
}`,
    },
  },

  // ── Search ──
  {
    id: 'sorting',
    tagLabel: 'Sorting',
    title: 'Sorting',
    family: 'search',
    summary: 'Order data — the gateway to greedy, two pointers, and binary search.',
    usage_md:
      'Almost every constructive / greedy problem starts with `sort`. Custom comparators, stable sort for ties, sorting indices instead of values.\n\n**Pitfall:** comparator that is not a strict weak ordering → UB; sorting huge structs by value when indices suffice.',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(log N) typical',
      notes_md: 'Counting / radix sort when the domain is tiny.',
    },
    implementation: {
      language: 'cpp',
      code: `// sort indices by a[i]
vector<int> argsort(vector<int>& a) {
  int n = a.size();
  vector<int> idx(n);
  iota(idx.begin(), idx.end(), 0);
  sort(idx.begin(), idx.end(), [&](int i, int j) {
    return a[i] < a[j];
  });
  return idx;
}

// coordinate compression
vector<int> compress(vector<int> a) {
  vector<int> b = a;
  sort(b.begin(), b.end());
  b.erase(unique(b.begin(), b.end()), b.end());
  for (int& x : a) x = lower_bound(b.begin(), b.end(), x) - b.begin();
  return a;
}`,
    },
  },
  {
    id: 'ternary-search',
    tagLabel: 'Ternary Search',
    title: 'Ternary Search',
    family: 'search',
    summary: 'Optimize a unimodal function by trimming thirds.',
    usage_md:
      'Convex/unimodal `f` on reals or integers — e.g. meeting point on a line, bitonic arrays.\n\nOn integers prefer careful `while (hi - lo > 2)` or binary search on differences.\n\n**Pitfall:** applying ternary search to non-unimodal `f` silently returns garbage.',
    complexity: {
      time: 'O(log range) evaluations',
      extraMemory: 'O(1)',
    },
    implementation: {
      language: 'cpp',
      code: `// real unimodal minimum
double ternary(double lo, double hi, auto f) {
  for (int it = 0; it < 80; it++) {
    double m1 = lo + (hi - lo) / 3;
    double m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) hi = m2; else lo = m1;
  }
  return f(lo);
}

// integer unimodal minimum
int ternary_int(int lo, int hi, auto f) {
  while (hi - lo > 2) {
    int m1 = lo + (hi - lo) / 3;
    int m2 = hi - (hi - lo) / 3;
    if (f(m1) < f(m2)) hi = m2; else lo = m1;
  }
  int best = lo;
  for (int x = lo; x <= hi; x++) if (f(x) < f(best)) best = x;
  return best;
}`,
    },
  },
  {
    id: 'meet-in-middle',
    tagLabel: 'Meet in the Middle',
    title: 'Meet in the Middle',
    family: 'search',
    summary: 'Split N≈40 into two halves — enumerate and match.',
    usage_md:
      'Subset sum / knapsack when N≤40 but 2ⁿ is too big: enumerate 2^{n/2} on each half, sort/hash one side, probe the other.\n\n**Pitfall:** double-counting the empty subset; overflow when summing.',
    complexity: {
      time: 'O(2^{N/2} · N)',
      extraMemory: 'O(2^{N/2})',
    },
    implementation: {
      language: 'cpp',
      code: `// count subsets with sum == target
long long meet_in_middle(vector<int>& a, long long target) {
  int n = a.size(), mid = n / 2;
  vector<long long> L, R;
  for (int m = 0; m < (1 << mid); m++) {
    long long s = 0;
    for (int i = 0; i < mid; i++) if (m >> i & 1) s += a[i];
    L.push_back(s);
  }
  int r = n - mid;
  for (int m = 0; m < (1 << r); m++) {
    long long s = 0;
    for (int i = 0; i < r; i++) if (m >> i & 1) s += a[mid + i];
    R.push_back(s);
  }
  sort(R.begin(), R.end());
  long long ans = 0;
  for (long long s : L) {
    auto [lo, hi] = equal_range(R.begin(), R.end(), target - s);
    ans += hi - lo;
  }
  return ans;
}`,
    },
  },

  // ── Structures ──
  {
    id: 'segment-tree',
    tagLabel: 'Segment Tree',
    title: 'Segment Tree',
    family: 'structures',
    summary: 'Range queries + point/range updates in O(log N).',
    usage_md:
      'Range sum/min/gcd, lazy range add + range min, offline offline tricks. Default when Fenwick is not enough (non-invertible ops, lazy).\n\n**Pitfall:** wrong `push`/`pull` order with lazy; off-by-one on half-open intervals.',
    complexity: {
      time: 'O(N) build, O(log N) op',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `struct SegTree {
  int n; vector<long long> t;
  SegTree(int n): n(n), t(4 * n) {}
  void build(vector<long long>& a, int v, int tl, int tr) {
    if (tl == tr) { t[v] = a[tl]; return; }
    int tm = (tl + tr) / 2;
    build(a, 2*v, tl, tm); build(a, 2*v+1, tm+1, tr);
    t[v] = t[2*v] + t[2*v+1];
  }
  void upd(int v, int tl, int tr, int pos, long long val) {
    if (tl == tr) { t[v] = val; return; }
    int tm = (tl + tr) / 2;
    if (pos <= tm) upd(2*v, tl, tm, pos, val);
    else upd(2*v+1, tm+1, tr, pos, val);
    t[v] = t[2*v] + t[2*v+1];
  }
  long long qry(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return t[v];
    int tm = (tl + tr) / 2;
    return qry(2*v, tl, tm, l, min(r, tm))
         + qry(2*v+1, tm+1, tr, max(l, tm+1), r);
  }
};`,
    },
  },
  {
    id: 'mo-algorithm',
    tagLabel: "Mo's Algorithm",
    title: "Mo's Algorithm",
    family: 'structures',
    summary: 'Offline range queries by sorting into √N blocks.',
    usage_md:
      'Distinct count, frequency powers, xor-pair counts — anything with add/remove that updates an answer in O(1) or O(log N).\n\nSort queries by `(block(l), r)`; move `[cl,cr]` to each query.\n\n**Pitfall:** add/remove order when expanding/shrinking; Hilbert-order optional micro-opt.',
    complexity: {
      time: 'O((N + Q) · √N · F)',
      extraMemory: 'O(N + Q)',
      notes_md: 'F = cost of add/remove.',
    },
    implementation: {
      language: 'cpp',
      code: `struct Query { int l, r, idx; };
int BLOCK;

long long run_mo(vector<int>& a, vector<Query> qs) {
  int n = a.size(); BLOCK = max(1, (int)sqrt(n));
  sort(qs.begin(), qs.end(), [](auto& A, auto& B) {
    int ba = A.l / BLOCK, bb = B.l / BLOCK;
    if (ba != bb) return ba < bb;
    return (ba & 1) ? A.r > B.r : A.r < B.r;
  });
  vector<int> freq(/* domain */ 0);
  long long cur = 0; // maintain answer
  auto add = [&](int i) { /* freq[a[i]]++; update cur */ };
  auto del = [&](int i) { /* update cur; freq[a[i]]--; */ };
  int cl = 0, cr = -1;
  vector<long long> ans(qs.size());
  for (auto& q : qs) {
    while (cl > q.l) add(--cl);
    while (cr < q.r) add(++cr);
    while (cl < q.l) del(cl++);
    while (cr > q.r) del(cr--);
    ans[q.idx] = cur;
  }
  return ans.empty() ? 0 : ans[0];
}`,
    },
  },

  // ── DP ──
  {
    id: 'lis',
    tagLabel: 'LIS',
    title: 'Longest Increasing Subsequence',
    family: 'dp',
    summary: 'Patience sorting — length in O(N log N), recover sequence with parents.',
    usage_md:
      'Classic DP warm-up; dilworth / chains; reduce other problems to LIS via compression.\n\nMaintain `tails[len] =` smallest tail of all increasing subsequences with that length.\n\n**Pitfall:** strictly vs non-decreasing (`lower_bound` vs `upper_bound`).',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `int lis_length(vector<int>& a) {
  vector<int> tails;
  for (int x : a) {
    auto it = lower_bound(tails.begin(), tails.end(), x); // strict
    if (it == tails.end()) tails.push_back(x);
    else *it = x;
  }
  return tails.size();
}`,
    },
  },

  // ── Math ──
  {
    id: 'matrix-expo',
    tagLabel: 'Matrix Exponentiation',
    title: 'Matrix Exponentiation',
    family: 'math',
    summary: 'Jump a linear recurrence ahead in O(K³ log N).',
    usage_md:
      'Fibonacci-like sequences, counting walks (`adj^K`), digit DP transitions, tiling recurrences.\n\nBuild companion / transition matrix; binary exponentiate.\n\n**Pitfall:** modular multiply overflow; off-by-one on the power for “n steps”.',
    complexity: {
      time: 'O(K³ log N)',
      extraMemory: 'O(K²)',
    },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
using Mat = vector<vector<ll>>;
const ll MOD = 1e9 + 7;

Mat mul(const Mat& A, const Mat& B) {
  int n = A.size(), m = B[0].size(), p = B.size();
  Mat C(n, vector<ll>(m));
  for (int i = 0; i < n; i++) for (int k = 0; k < p; k++)
    for (int j = 0; j < m; j++)
      C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
  return C;
}
Mat mpow(Mat base, ll e) {
  int n = base.size();
  Mat res(n, vector<ll>(n));
  for (int i = 0; i < n; i++) res[i][i] = 1;
  while (e) {
    if (e & 1) res = mul(res, base);
    base = mul(base, base); e >>= 1;
  }
  return res;
}

// F(n) with F(0)=0,F(1)=1
ll fib(ll n) {
  if (n == 0) return 0;
  Mat T = {{1, 1}, {1, 0}};
  return mpow(T, n - 1)[0][0];
}`,
    },
  },
  {
    id: 'game-theory',
    tagLabel: 'Game Theory',
    title: 'Impartial Games (Nim / Grundy)',
    family: 'math',
    summary: 'XOR of grundy numbers — Sprague–Grundy for sums of games.',
    usage_md:
      'Nim piles, subtraction games, graph games split into independent components. `grundy = mex of successors`; overall XOR ≠ 0 ⇒ first wins.\n\n**Pitfall:** misidentifying whether games are independent; wrong mex set.',
    complexity: {
      time: 'O(states · transitions)',
      extraMemory: 'O(states)',
    },
    implementation: {
      language: 'cpp',
      code: `int mex(vector<int> s) {
  sort(s.begin(), s.end());
  s.erase(unique(s.begin(), s.end()), s.end());
  int m = 0;
  for (int x : s) if (x == m) m++; else if (x > m) break;
  return m;
}

// subtraction game piles; moves remove a in A
vector<int> grundy_subtraction(int n, vector<int>& A) {
  vector<int> g(n + 1);
  for (int x = 1; x <= n; x++) {
    vector<int> reach;
    for (int a : A) if (x >= a) reach.push_back(g[x - a]);
    g[x] = mex(reach);
  }
  return g;
}

bool first_wins(vector<int>& piles, vector<int>& g) {
  int x = 0; for (int p : piles) x ^= g[p];
  return x != 0;
}`,
    },
  },

  // ── Strings ──
  {
    id: 'kmp',
    tagLabel: 'KMP',
    title: 'KMP (Prefix Function)',
    family: 'strings',
    summary: 'π-function — borders for matching and period tricks.',
    usage_md:
      'Pattern matching in O(N+M), counting occurrences, longest border, periods (`n % (n-π[n-1]) == 0`), string compression.\n\nBuild `π` on `pattern + # + text` or run the automaton online.\n\n**Pitfall:** off-by-one on `π` while-loop; forgetting the separator when concatenating.',
    complexity: {
      time: 'O(N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `vector<int> prefix_function(string& s) {
  int n = s.size();
  vector<int> pi(n);
  for (int i = 1; i < n; i++) {
    int j = pi[i - 1];
    while (j > 0 && s[i] != s[j]) j = pi[j - 1];
    if (s[i] == s[j]) j++;
    pi[i] = j;
  }
  return pi;
}

vector<int> kmp_match(string& text, string& pat) {
  string s = pat + "#" + text;
  auto pi = prefix_function(s);
  vector<int> occ;
  int m = pat.size();
  for (int i = m + 1; i < (int)s.size(); i++)
    if (pi[i] == m) occ.push_back(i - 2 * m);
  return occ;
}`,
    },
  },
  {
    id: 'z-algorithm',
    tagLabel: 'Z-Algorithm',
    title: 'Z-Algorithm',
    family: 'strings',
    summary: 'Z-box: longest substring from i that matches the prefix.',
    usage_md:
      'Same jobs as KMP from another angle — pattern match via `pat + # + text`, password/border problems, periods.\n\nMaintain `[l,r]` matched window; copy or extend.\n\n**Pitfall:** initializing `z[0]`; window updates when `i < r`.',
    complexity: {
      time: 'O(N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `vector<int> z_function(string& s) {
  int n = s.size();
  vector<int> z(n);
  for (int i = 1, l = 0, r = 0; i < n; i++) {
    if (i < r) z[i] = min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
    if (i + z[i] > r) l = i, r = i + z[i];
  }
  z[0] = n;
  return z;
}`,
    },
  },
  {
    id: 'string-hashing',
    tagLabel: 'String Hashing',
    title: 'Polynomial String Hashing',
    family: 'strings',
    summary: 'Rolling hashes for O(1) substring equality (mod primes).',
    usage_md:
      'Compare substrings, find repeats, binary-search LCP, dictionary of seen strings. Prefer two mods or 64-bit splitmix-style to cut collisions.\n\n**Pitfall:** single small mod → anti-hash hacks; mixing `unsigned`/`long long` overflow rules.',
    complexity: {
      time: 'O(N) build, O(1) get',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `using ull = unsigned long long;
struct Hasher {
  vector<ull> p, h; ull BASE = 911382323;
  Hasher(string& s) {
    int n = s.size();
    p.resize(n + 1); h.resize(n + 1);
    p[0] = 1;
    for (int i = 0; i < n; i++) {
      p[i + 1] = p[i] * BASE;
      h[i + 1] = h[i] * BASE + (ull)(s[i] + 1);
    }
  }
  ull get(int l, int r) { // [l, r)
    return h[r] - h[l] * p[r - l];
  }
};`,
    },
  },

  // ── Geometry ──
  {
    id: 'convex-hull',
    tagLabel: 'Convex Hull',
    title: 'Convex Hull',
    family: 'geometry',
    summary: 'Smallest convex polygon covering all points — monotone chain.',
    usage_md:
      'Farthest pair (rotating calipers), diameter, onion peeling, “is B inside hull(A)?”.\n\nAndrew monotone chain: sort by (x,y), build lower then upper with cross ≤ 0 pops.\n\n**Pitfall:** duplicate points; collinear edges — decide whether to keep or drop.',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `struct Pt { long long x, y; };
long long cross(Pt a, Pt b, Pt c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

vector<Pt> convex_hull(vector<Pt> a) {
  sort(a.begin(), a.end(), [](Pt A, Pt B) {
    return A.x < B.x || (A.x == B.x && A.y < B.y);
  });
  a.erase(unique(a.begin(), a.end(), [](Pt A, Pt B) {
    return A.x == B.x && A.y == B.y;
  }), a.end());
  if (a.size() <= 1) return a;
  vector<Pt> lo, hi;
  for (Pt p : a) {
    while (lo.size() >= 2 && cross(lo[lo.size()-2], lo.back(), p) <= 0) lo.pop_back();
    lo.push_back(p);
  }
  for (int i = (int)a.size() - 1; i >= 0; i--) {
    Pt p = a[i];
    while (hi.size() >= 2 && cross(hi[hi.size()-2], hi.back(), p) <= 0) hi.pop_back();
    hi.push_back(p);
  }
  lo.pop_back(); hi.pop_back();
  lo.insert(lo.end(), hi.begin(), hi.end());
  return lo;
}`,
    },
  },
  {
    id: 'sweep-line',
    tagLabel: 'Sweep Line',
    title: 'Sweep Line',
    family: 'geometry',
    summary: 'Process events left→right — segments, coverage, closest pair.',
    usage_md:
      'Coverage histogram on the line, rectangle unions, closest pair of points, intersection counting with a balanced set of active segments.\n\nSort events; maintain active set ordered by y (or a fenwick of counts).\n\n**Pitfall:** event order ties (start before end at same x); floating precision — prefer integers.',
    complexity: {
      time: 'O(N log N) typical',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `// coverage lengths: how many points covered by exactly k segments
vector<long long> coverage_by_k(vector<pair<long long,long long>>& segs) {
  vector<pair<long long,int>> ev;
  for (auto [l, r] : segs) {
    ev.push_back({l, +1});
    ev.push_back({r + 1, -1}); // inclusive r
  }
  sort(ev.begin(), ev.end());
  vector<long long> ans(segs.size() + 1);
  long long cur = 0, prev = ev.empty() ? 0 : ev[0].first;
  int i = 0, n = ev.size();
  while (i < n) {
    long long x = ev[i].first;
    if (cur >= 0 && cur < (int)ans.size()) ans[cur] += x - prev;
    while (i < n && ev[i].first == x) cur += ev[i++].second;
    prev = x;
  }
  return ans;
}`,
    },
  },
];
