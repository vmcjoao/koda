import type { LearnLesson } from '@/types/learn';
import { LESSONS_MORE } from '@/data/learn/lessons-more';
import { LESSONS_EXTRA } from '@/data/learn/lessons-extra';
import { LESSONS_VARIANTS } from '@/data/learn/lessons-variants';

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

const LESSONS_CORE: LearnLesson[] = [
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
      notes_md: 'Adjacency list (directed or undirected). `dist[v] < 0` doubles as visited — mark when **enqueueing**.',
    },
  },
  {
    id: 'dfs',
    tagLabel: 'DFS',
    title: 'DFS',
    family: 'graphs',
    summary: 'Go deep first — components, cycles, recursion on graphs/trees.',
    usage_md:
      'DFS is the default “walk the graph” tool: connected components, cycle detection, topological order (via finish times), flood fill, tree DP.\n\n**Pitfall:** recursion depth on large $N$ — prefer an explicit stack, or raise the stack limit carefully on judges that allow it.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N)',
      notes_md: 'Visited/color array; recursion stack can be $O(N)$ on a line graph.',
    },
    visualization: { kind: 'graph-dfs', demo: DEMO_GRAPH },
    implementation: {
      language: 'cpp',
      code: `void dfs(int u, vector<vector<int>>& g, vector<int>& vis) {
  vis[u] = 1;
  for (int v : g[u]) if (!vis[v]) dfs(v, g, vis);
}

int components(int n, vector<vector<int>>& g) {
  vector<int> vis(n);
  int c = 0;
  for (int i = 0; i < n; i++) if (!vis[i]) {
    dfs(i, g, vis);
    c++;
  }
  return c;
}`,
      notes_md: 'For directed cycle detection use 3-colors (white/gray/black), not a single visited bit.',
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
    if (d != dist[u]) continue; // stale heap entry
    for (auto [v, w] : g[u]) if (dist[v] > d + w) {
      dist[v] = d + w;
      pq.push({dist[v], v});
    }
  }
  return dist;
}`,
      notes_md: 'No decrease-key: push a new pair and skip outdated ones with `d != dist[u]`.',
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
      notes_md: 'Kahn (indegree + queue) and DFS-finish order are both fine; Kahn makes cycles obvious.',
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
      notes_md: 'Empty return means a cycle — not a valid topological order.',
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
    title: 'Binary Search (exact)',
    family: 'search',
    summary: 'Find whether a value exists in a sorted array — the classic half-interval loop.',
    usage_md:
      'Membership on a sorted vector, “is there an index with `a[i] == x`?”, and any search where the predicate flips once from false→true on a discrete range.\n\nPick **one** loop invariant and stick to it. Contest default: `lo` is the first candidate, `hi` is exclusive, mid never overflows.\n\nFor the **first** `≥ x` or `> x` index, use the dedicated lower/upper-bound lessons — don’t overload this template.\n\n**Pitfall:** mixing inclusive `hi` with exclusive updates; using `(lo+hi)/2` on large ints; returning `mid` when the loop exited without a hit.',
    complexity: {
      time: 'O(log N)',
      extraMemory: 'O(1)',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [2, 4, 5, 7, 9, 12, 15, 18], target: 9 },
    },
    relatedIds: ['lower-bound', 'upper-bound', 'binary-search-answer'],
    implementation: {
      language: 'cpp',
      code: `// return any index with a[i] == x, or -1
int find_exact(const vector<int>& a, int x) {
  int lo = 0, hi = (int)a.size(); // [lo, hi)
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == x) return mid;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return -1;
}

// STL: binary_search(a.begin(), a.end(), x) → bool
`,
      notes_md: 'When duplicates matter (first / last occurrence), switch to lower_bound / upper_bound.',
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
    summary: 'Precompute running sums for O(1) range queries — 1D, 2D, and difference arrays.',
    usage_md:
      '**1D:** `pref[0]=0`, `pref[i+1]=pref[i]+a[i]`, then `sum[l..r) = pref[r]-pref[l]`.\n\n**2D:** inclusion-exclusion on a pref grid for sub-rectangle sums.\n\n**Difference array:** to add $+v$ on `[l,r)`, do `d[l]+=v`, `d[r]-=v`, then prefix to materialize. Batch many range updates, one rebuild.\n\nRelated: fenwick/segtree when you need **point updates** mixed with range sums.\n\n**Pitfall:** inclusive vs exclusive bounds; `int` overflow — use `long long`; building pref 0-based vs 1-based inconsistently.',
    complexity: {
      time: 'O(N) build, O(1) query',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [3, 1, 4, 1, 5, 9, 2] },
    },
    relatedIds: ['difference-array', 'fenwick', 'two-pointers'],
    implementation: {
      language: 'cpp',
      code: `// pref[i] = sum of a[0..i)
vector<long long> build_pref(const vector<int>& a) {
  int n = (int)a.size();
  vector<long long> pref(n + 1);
  for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + a[i];
  return pref;
}
long long range_sum(const vector<long long>& pref, int l, int r) {
  return pref[r] - pref[l]; // a[l..r)
}

// difference array: batch range adds, then prefix to materialize
vector<long long> apply_range_adds(int n, const vector<array<int,3>>& updates) {
  vector<long long> d(n + 1);
  for (auto [l, r, v] : updates) { // add v on [l, r)
    d[l] += v;
    d[r] -= v;
  }
  for (int i = 1; i < n; i++) d[i] += d[i - 1];
  d.pop_back();
  return d; // length n
}
`,
      notes_md: 'Half-open $[l,r)$. For inclusive $[L,R]$ use `pref[R+1] - pref[L]`.',
    },
  },
  {
    id: 'knapsack',
    tagLabel: 'Knapsack',
    title: '0/1 Knapsack',
    family: 'dp',
    summary: 'Pick or skip each item under a capacity — the classic DP template.',
    usage_md:
      'Each item at most once; maximize value under weight $W$. Same skeleton covers **subset sum** (`v[i]=w[i]` or boolean DP), **count ways**, and (with a ascending capacity loop) **unbounded** knapsack.\n\n1D rolling: iterate capacity **high→low** so each item is used ≤ once. 2D `dp[i][cap]` is clearer when you need reconstruction.\n\n**Pitfall:** ascending capacity loop for 0/1 (turns into unbounded); `int` overflow on value sums; $W$ too large — then meet-in-the-middle or bitset DP.',
    complexity: {
      time: 'O(N · W)',
      extraMemory: 'O(W)',
      notes_md: 'N items, capacity W. Meet-in-the-middle if W is huge but N≤40.',
    },
    visualization: {
      kind: 'dp-knapsack',
      demo: { weights: [2, 3, 4, 5], values: [3, 4, 5, 6], capacity: 8 },
    },
    relatedIds: ['dynamic-programming', 'bitmask-dp', 'meet-in-middle'],
    implementation: {
      language: 'cpp',
      code: `int knapsack01(const vector<int>& w, const vector<int>& v, int W) {
  vector<int> dp(W + 1, 0);
  for (int i = 0; i < (int)w.size(); i++) {
    for (int cap = W; cap >= w[i]; cap--) // high → low: 0/1
      dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
  }
  return dp[W];
}

// unbounded: each item reusable — flip the inner loop direction
int knapsack_unbounded(const vector<int>& w, const vector<int>& v, int W) {
  vector<int> dp(W + 1, 0);
  for (int i = 0; i < (int)w.size(); i++) {
    for (int cap = w[i]; cap <= W; cap++) // low → high: unbounded
      dp[cap] = max(dp[cap], dp[cap - w[i]] + v[i]);
  }
  return dp[W];
}
`,
      notes_md: 'Direction of the capacity loop is the whole 0/1 vs unbounded distinction in 1D.',
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
      code: `// Kosaraju — pass G and its transpose GT
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
  return cid; // number of components; comp[u] in [0, cid)
}`,
      notes_md: 'Build `gt[v].push_back(u)` for each edge $u\\to v$. Condensation DAG: edge between different `comp` ids.',
    },
  },
  {
    id: 'bridges',
    tagLabel: 'Bridges / Articulation',
    title: 'Bridges & Articulation Points',
    family: 'graphs',
    summary: 'Edges/vertices whose removal increases connected components.',
    usage_md:
      'Critical roads/cities, bridge-tree (2-edge-CC condensation), cactus graphs.\n\nDFS with discovery time `tin` and `low`:\n- **bridge** $(u,v)$ when `low[v] > tin[u]`\n- **articulation** $u$ when root has $\\ge 2$ DFS children, or a non-root has a child with `low[child] \\ge tin[u]`\n\n**Pitfall:** parallel edges — store edge ids and ignore the parent *edge*, not just the parent vertex, or a double edge looks like a bridge.',
    complexity: {
      time: 'O(N + M)',
      extraMemory: 'O(N + M)',
    },
    implementation: {
      language: 'cpp',
      code: `int timer;
vector<int> tin, low;
vector<pair<int,int>> bridges;
vector<char> is_art;

void dfs(int u, int p, vector<vector<int>>& g) {
  tin[u] = low[u] = ++timer;
  int children = 0;
  for (int v : g[u]) {
    if (v == p) continue;
    if (tin[v]) low[u] = min(low[u], tin[v]);
    else {
      dfs(v, u, g);
      low[u] = min(low[u], low[v]);
      if (low[v] > tin[u]) bridges.push_back({u, v});
      if (p != -1 && low[v] >= tin[u]) is_art[u] = 1;
      children++;
    }
  }
  if (p == -1 && children > 1) is_art[u] = 1;
}

void find_bridges_arts(int n, vector<vector<int>>& g) {
  timer = 0;
  tin.assign(n, 0); low.assign(n, 0);
  is_art.assign(n, 0);
  bridges.clear();
  for (int i = 0; i < n; i++) if (!tin[i]) dfs(i, -1, g);
}`,
      notes_md: 'For multigraphs, build `g` as edge-id adjacency and skip the parent edge id instead of `v == p`.',
    },
  },
  {
    id: 'max-flow',
    tagLabel: 'Max Flow',
    title: 'Max Flow (Dinic)',
    family: 'graphs',
    summary: 'Maximum s–t flow equals minimum cut — Dinic with level graph + DFS.',
    usage_md:
      'Assignment with capacities, edge-disjoint paths, project selection (min-cut), bipartite matching via unit network.\n\nDinic: BFS builds a level graph, then DFS pushes a blocking flow. Solid default for contest max-flow.\n\n**Pitfall:** forgetting residual reverse edges (`cap` on the reverse edge); using `int` when capacities sum past $2^{31}$.',
    complexity: {
      time: 'O(N² · M)',
      extraMemory: 'O(N + M)',
      notes_md: 'Worst-case bound; unit-capacity / bipartite matching instances are much faster in practice.',
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
      'Jobs↔workers, rows↔columns covers (König), gophers↔holes. Kuhn DFS augmenting paths is short; Hopcroft–Karp / Dinic for large sparse graphs.\n\n**Pitfall:** building the wrong bipartition; reusing a stale `vis` mark across left nodes in the same round (use a timer or clear each attempt).',
    complexity: {
      time: 'O(V · E) Kuhn; O(E √V) Hopcroft',
      extraMemory: 'O(V + E)',
      notes_md: 'For huge sparse graphs prefer Hopcroft–Karp or Dinic on a unit network.',
    },
    implementation: {
      language: 'cpp',
      code: `// Kuhn: left 0..nL-1, right 0..nR-1; g[u] = right neighbors
vector<int> matchR, vis;
int timer;
vector<vector<int>>* adj;

bool try_aug(int u) {
  if (vis[u] == timer) return false;
  vis[u] = timer;
  for (int v : (*adj)[u]) {
    if (matchR[v] < 0 || try_aug(matchR[v])) {
      matchR[v] = u;
      return true;
    }
  }
  return false;
}

int bpm(int nL, int nR, vector<vector<int>>& g) {
  adj = &g;
  matchR.assign(nR, -1);
  vis.assign(nL, 0);
  timer = 0;
  int ans = 0;
  for (int u = 0; u < nL; u++) {
    timer++;
    if (try_aug(u)) ans++;
  }
  return ans;
}`,
      notes_md: '`matchR[v]` = left node matched to right $v$, or $-1$. Read the matching from `matchR` after `bpm`.',
    },
  },
  {
    id: 'bellman-ford',
    tagLabel: 'Bellman-Ford',
    title: 'Bellman-Ford',
    family: 'graphs',
    summary: 'Shortest paths with negative weights; detect negative cycles.',
    usage_md:
      'When Dijkstra is illegal (negative edges). Also currency exchange / wormhole “can I go back in time?” via negative-cycle detection.\n\nRelax all edges $|V|-1$ times; one more pass marks edges that still relax. Flood along outgoing edges so every node reachable from a negative cycle is flagged.\n\n**Pitfall:** reporting a negative cycle that is not reachable from the source when the statement only cares about paths from $s$.',
    complexity: {
      time: 'O(N · M)',
      extraMemory: 'O(N)',
      notes_md: 'SPFA is a queue optimization — still $O(NM)$ worst case; fine for many contests, risky against anti-SPFA tests.',
    },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll INF = 4e18;

// dist from s; neg[v]=true if v can be made arbitrarily small via a neg cycle
vector<ll> bellman(int n, vector<array<ll,3>>& edges, int s, vector<char>& neg) {
  vector<ll> dist(n, INF);
  dist[s] = 0;
  for (int i = 0; i < n - 1; i++)
    for (auto [u, v, w] : edges)
      if (dist[u] < INF) dist[v] = min(dist[v], dist[u] + w);

  neg.assign(n, 0);
  queue<int> q;
  for (auto [u, v, w] : edges)
    if (dist[u] < INF && dist[v] > dist[u] + w && !neg[v]) {
      neg[v] = 1;
      q.push(v);
    }
  vector<vector<int>> g(n);
  for (auto [u, v, w] : edges) g[u].push_back(v);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) if (!neg[v]) {
      neg[v] = 1;
      q.push(v);
    }
  }
  return dist;
}`,
      notes_md: 'Edges are `{u, v, w}` directed. After the flood, treat `neg[v]` queries as −∞ / unreachable per statement.',
    },
  },
  {
    id: 'floyd-warshall',
    tagLabel: 'Floyd-Warshall',
    title: 'Floyd-Warshall',
    family: 'graphs',
    summary: 'All-pairs shortest paths via DP on intermediate nodes.',
    usage_md:
      'Dense graphs with $N \\lesssim 400$–$500$, all-pairs distances, transitive closure (swap `min`+`+` for `or`+`and`). Tiny code, hard constraints.\n\nInitialize `d[i][i] = 0`, missing edges to `INF`, then run the triple loop.\n\n**Pitfall:** $N^3$ time / $N^2$ memory — too slow for $N \\ge 1000$. After Floyd, `d[i][i] < 0` means a negative cycle touches $i$.',
    complexity: {
      time: 'O(N³)',
      extraMemory: 'O(N²)',
    },
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll INF = 4e18;

// Fill d with INF, set d[i][i]=0 and d[u][v]=w for each edge (keep min on multis).
void floyd(vector<vector<ll>>& d) {
  int n = d.size();
  for (int k = 0; k < n; k++)
    for (int i = 0; i < n; i++) if (d[i][k] < INF)
      for (int j = 0; j < n; j++) if (d[k][j] < INF)
        d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
}

bool has_neg_cycle(vector<vector<ll>>& d) {
  int n = d.size();
  for (int i = 0; i < n; i++) if (d[i][i] < 0) return true;
  return false;
}`,
      notes_md: 'Guard `d[i][k] + d[k][j]` against overflow if you use a smaller INF, or keep the `< INF` checks as above.',
    },
  },
  {
    id: 'lca',
    tagLabel: 'LCA',
    title: 'Lowest Common Ancestor',
    family: 'graphs',
    summary: 'Deepest node that is ancestor of both u and v — binary lifting.',
    usage_md:
      'Tree path queries ($\\mathrm{dist}(u,v) = \\mathrm{depth}[u]+\\mathrm{depth}[v]-2\\cdot\\mathrm{depth}[\\mathrm{lca}]$), subtree checks, virtual trees.\n\nBinary lifting: `up[k][v]` = $2^k$-th parent. Alternative: Euler tour + RMQ/sparse table.\n\n**Pitfall:** calling `lca` before `dfs`; using 1-based nodes with a `MAXN` array sized too small (`LOG` must satisfy $2^{\\mathrm{LOG}} \\ge N$).',
    complexity: {
      time: 'O(N log N) build, O(log N) query',
      extraMemory: 'O(N log N)',
    },
    implementation: {
      language: 'cpp',
      code: `const int LOG = 20;
int up[LOG][200001], depth[200001];
vector<int> g[200001];

void dfs(int u, int p) {
  up[0][u] = p;
  for (int k = 1; k < LOG; k++) up[k][u] = up[k - 1][up[k - 1][u]];
  for (int v : g[u]) if (v != p) {
    depth[v] = depth[u] + 1;
    dfs(v, u);
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
      notes_md: '0-based nodes; call `dfs(root, root)` (or `dfs(root, 0)` with a dummy parent). Size `up`/`g` for your $N$.',
    },
  },

  // ── Search ──
  {
    id: 'sorting',
    tagLabel: 'Sorting',
    title: 'Sorting (STL & comparators)',
    family: 'search',
    summary: 'Contest sorting in practice — std::sort, stable_sort, and safe custom keys.',
    usage_md:
      '`std::sort` (introsort) is the default: $O(N \\log N)$ worst-case. Use `stable_sort` when equal keys must keep input order (ties, multi-key sorts done in passes).\n\n**Custom comparator** must be a **strict weak ordering**: `cmp(a,a)` false, and never both `cmp(a,b)` and `cmp(b,a)`. Prefer sorting **indices** or a key array over moving huge structs.\n\nSee also: mergesort (inversions / stable merge), quicksort (partition intuition), counting sort (tiny domains), coordinate compression (map big values → ranks).\n\n**Pitfall:** `<=` in a comparator (not strict) → UB / crash; sorting by a float key with NaNs.',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(log N) typical',
      notes_md: 'stable_sort uses more memory (merge-based). Counting/radix when the domain is tiny — see those lessons.',
    },
    relatedIds: [
      'mergesort',
      'quicksort',
      'counting-sort',
      'coordinate-compression',
    ],
    implementation: {
      language: 'cpp',
      code: `// sort indices by a[i] (keeps the original array intact)
vector<int> argsort(const vector<int>& a) {
  int n = (int)a.size();
  vector<int> idx(n);
  iota(idx.begin(), idx.end(), 0);
  sort(idx.begin(), idx.end(), [&](int i, int j) {
    return a[i] < a[j]; // strict <
  });
  return idx;
}

// multi-key: sort by height asc, then id asc
struct Person { int h, id; };
void sort_people(vector<Person>& p) {
  sort(p.begin(), p.end(), [](const Person& A, const Person& B) {
    if (A.h != B.h) return A.h < B.h;
    return A.id < B.id;
  });
}
`,
      notes_md: 'For “sort by A, break ties by B” you can also stable_sort by B then stable_sort by A.',
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
      'Subset sum / knapsack when $N \\le 40$ but $2^N$ is too big: split into halves of size $\\approx N/2$, enumerate all $2^{N/2}$ subset sums on each side, sort one side, and probe with `equal_range` / hash map.\n\nSame idea works for XOR, weighted pairs, and some knapsack reconstructions.\n\n**Pitfall:** overflow when summing into `int`; off-by-one on half sizes when $N$ is odd.',
    complexity: {
      time: 'O(2^{N/2} · N)',
      extraMemory: 'O(2^{N/2})',
      notes_md: 'C++17 structured bindings in the snippet; otherwise use `equal_range` iterators.',
    },
    implementation: {
      language: 'cpp',
      code: `// count subsets with sum == target (includes empty subset once)
long long meet_in_middle(vector<int>& a, long long target) {
  int n = (int)a.size(), mid = n / 2;
  vector<long long> L, R;
  for (int m = 0; m < (1 << mid); m++) {
    long long s = 0;
    for (int i = 0; i < mid; i++) if (m >> i & 1) s += a[i];
    L.push_back(s);
  }
  int rlen = n - mid;
  for (int m = 0; m < (1 << rlen); m++) {
    long long s = 0;
    for (int i = 0; i < rlen; i++) if (m >> i & 1) s += a[mid + i];
    R.push_back(s);
  }
  sort(R.begin(), R.end());
  long long ans = 0;
  for (long long s : L) {
    auto range = equal_range(R.begin(), R.end(), target - s);
    ans += range.second - range.first;
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
    summary: 'Range queries with point updates in O(log N) — extend with lazy for range updates.',
    usage_md:
      'Range sum / min / gcd with point updates. Prefer a Fenwick tree when you only need invertible prefix ops; use a segtree for non-invertible combines or when you will add **lazy** range updates.\n\nThe snippet below is the classic point-update range-sum tree (inclusive indices).\n\n**Pitfall:** wrong `push`/`pull` order once you add lazy tags; mixing inclusive and half-open index conventions.',
    complexity: {
      time: 'O(N) build, O(log N) op',
      extraMemory: 'O(N)',
      notes_md: 'Allocate `4N` nodes. Lazy range-add is the usual next upgrade.',
    },
    implementation: {
      language: 'cpp',
      code: `struct SegTree {
  int n; vector<long long> t;
  SegTree(int n): n(n), t(4 * n) {}
  void build(vector<long long>& a, int v, int tl, int tr) {
    if (tl == tr) { t[v] = a[tl]; return; }
    int tm = (tl + tr) / 2;
    build(a, 2 * v, tl, tm);
    build(a, 2 * v + 1, tm + 1, tr);
    t[v] = t[2 * v] + t[2 * v + 1];
  }
  void upd(int v, int tl, int tr, int pos, long long val) {
    if (tl == tr) { t[v] = val; return; }
    int tm = (tl + tr) / 2;
    if (pos <= tm) upd(2 * v, tl, tm, pos, val);
    else upd(2 * v + 1, tm + 1, tr, pos, val);
    t[v] = t[2 * v] + t[2 * v + 1];
  }
  long long qry(int v, int tl, int tr, int l, int r) {
    if (l > r) return 0;
    if (l == tl && r == tr) return t[v];
    int tm = (tl + tr) / 2;
    return qry(2 * v, tl, tm, l, min(r, tm))
         + qry(2 * v + 1, tm + 1, tr, max(l, tm + 1), r);
  }
};`,
      notes_md: 'Call `build(a, 1, 0, n-1)`, `upd(1, 0, n-1, i, x)`, `qry(1, 0, n-1, l, r)` on $0..n-1$.',
    },
  },
  {
    id: 'mo-algorithm',
    tagLabel: "Mo's Algorithm",
    title: "Mo's Algorithm",
    family: 'structures',
    summary: 'Offline range queries by sorting into √N blocks.',
    usage_md:
      'Distinct count, frequency powers, xor-pair counts — anything where you can `add`/`remove` an index and update the answer in $O(1)$ or $O(\\log N)$.\n\nSort queries by `(block(l), r)` (odd blocks reverse $r$ for fewer moves). Start from an empty window `[1,0]` and expand/shrink to each query.\n\n**Pitfall:** add/remove order when both ends move; assuming online queries (Mo is offline). Hilbert-order is an optional micro-opt.',
    complexity: {
      time: 'O((N + Q) · √N · F)',
      extraMemory: 'O(N + Q)',
      notes_md: '$F$ = cost of one add/remove. Example below uses 0-based inclusive $[l,r]$.',
    },
    implementation: {
      language: 'cpp',
      code: `struct Query { int l, r, idx; }; // inclusive

vector<int> mo_distinct(vector<int> a, vector<Query> qs) {
  int n = a.size(), B = max(1, (int)sqrt(n));
  // compress values
  vector<int> vals = a;
  sort(vals.begin(), vals.end());
  vals.erase(unique(vals.begin(), vals.end()), vals.end());
  for (int& x : a) x = lower_bound(vals.begin(), vals.end(), x) - vals.begin();

  sort(qs.begin(), qs.end(), [&](auto& A, auto& B) {
    int ba = A.l / B, bb = B.l / B;
    if (ba != bb) return ba < bb;
    return (ba & 1) ? A.r > B.r : A.r < B.r;
  });

  vector<int> freq(vals.size()), ans(qs.size());
  int cl = 0, cr = -1, cur = 0;
  auto add = [&](int i) {
    if (freq[a[i]]++ == 0) cur++;
  };
  auto del = [&](int i) {
    if (--freq[a[i]] == 0) cur--;
  };
  for (auto& q : qs) {
    while (cl > q.l) add(--cl);
    while (cr < q.r) add(++cr);
    while (cl < q.l) del(cl++);
    while (cr > q.r) del(cr--);
    ans[q.idx] = cur;
  }
  return ans;
}`,
      notes_md: 'Swap the `add`/`del` bodies for other aggregates (e.g. $\\sum \\mathrm{freq}[x]^2 \\cdot x$).',
    },
  },

  // ── DP ──
  {
    id: 'lis',
    tagLabel: 'LIS',
    title: 'Longest Increasing Subsequence',
    family: 'dp',
    summary: 'Patience sorting — LIS length in O(N log N).',
    usage_md:
      'Classic DP warm-up; Dilworth / chain covers; many problems reduce to LIS after coordinate tricks.\n\nMaintain `tails[len] =` the smallest tail value among all increasing subsequences of that length. The length of `tails` is the LIS length (the array itself is **not** the LIS).\n\nTo reconstruct one LIS, also store `prev` indices while updating.\n\n**Pitfall:** strict vs non-decreasing — use `lower_bound` for strict, `upper_bound` for non-decreasing.',
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
  return (int)tails.size();
}`,
      notes_md: '`tails` is an auxiliary structure — do not print it as the subsequence.',
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
      code: `vector<int> z_function(const string& s) {
  int n = (int)s.size();
  vector<int> z(n);
  for (int i = 1, l = 0, r = 0; i < n; i++) {
    if (i < r) z[i] = min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
    if (i + z[i] > r) l = i, r = i + z[i];
  }
  z[0] = n; // conventional; some codes leave z[0]=0
  return z;
}`,
      notes_md: 'Pattern match: build Z on `pat + "#" + text`; hits when `z[i] == |pat|`.',
    },
  },
  {
    id: 'string-hashing',
    tagLabel: 'String Hashing',
    title: 'Polynomial String Hashing',
    family: 'strings',
    summary: 'Rolling hashes for O(1) substring equality checks.',
    usage_md:
      'Compare substrings, find repeats, binary-search LCP, keep a set of seen strings. The snippet uses natural overflow mod $2^{64}$ via `unsigned long long` (fast, usually fine). For adversarial tests, use **two** moduli or a stronger 64-bit mix.\n\n**Pitfall:** a single small prime modulus is easy to anti-hash; mixing signed overflow UB with `long long` multiplies.',
    complexity: {
      time: 'O(N) build, O(1) get',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `using ull = unsigned long long;
struct Hasher {
  vector<ull> p, h;
  ull BASE = 911382323ULL;
  Hasher(const string& s) {
    int n = (int)s.size();
    p.resize(n + 1); h.resize(n + 1);
    p[0] = 1;
    for (int i = 0; i < n; i++) {
      p[i + 1] = p[i] * BASE;
      h[i + 1] = h[i] * BASE + ull(s[i] + 1);
    }
  }
  ull get(int l, int r) { // half-open [l, r)
    return h[r] - h[l] * p[r - l];
  }
};`,
      notes_md: 'Compare `get(l1,r1) == get(l2,r2)` only when lengths match. Collision probability is small but nonzero.',
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
      'Farthest pair (rotating calipers), diameter, onion peeling, “is B inside hull(A)?”.\n\nAndrew monotone chain: sort by $(x,y)$, build lower then upper hull; pop while the turn is not strictly left (`cross <= 0` drops colinear points).\n\n**Pitfall:** forgetting to dedupe identical points; using `int` cross products that overflow — prefer 64-bit coordinates/cross.',
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
  return lo; // CCW, no repeated start vertex
}`,
      notes_md: 'Use `< 0` instead of `<= 0` if the statement wants colinear boundary points kept.',
    },
  },
  {
    id: 'sweep-line',
    tagLabel: 'Sweep Line',
    title: 'Sweep Line',
    family: 'geometry',
    summary: 'Process events left→right — segments, coverage, closest pair.',
    usage_md:
      'Coverage histograms on the number line, rectangle unions, closest pair of points, segment intersections with an active $y$-set.\n\nSort events; maintain an active structure (counter, fenwick, or ordered set). The snippet accumulates how many integer points are covered by exactly $k$ segments.\n\n**Pitfall:** event ties at the same $x$ — using half-open $[l, r+1)$ avoids “start vs end” ordering bugs; prefer integers over floats when you can.',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(N)',
    },
    implementation: {
      language: 'cpp',
      code: `// ans[k] = # integer points covered by exactly k segments (inclusive [l,r])
vector<long long> coverage_by_k(vector<pair<long long,long long>>& segs) {
  vector<pair<long long,int>> ev;
  for (auto [l, r] : segs) {
    ev.push_back({l, +1});
    ev.push_back({r + 1, -1});
  }
  sort(ev.begin(), ev.end());
  vector<long long> ans(segs.size() + 1);
  long long cur = 0;
  long long prevx = ev.empty() ? 0 : ev[0].first;
  for (int i = 0; i < (int)ev.size(); ) {
    long long x = ev[i].first;
    if (x > prevx && cur >= 0 && cur < (int)ans.size()) ans[cur] += x - prevx;
    while (i < (int)ev.size() && ev[i].first == x) cur += ev[i++].second;
    prevx = x;
  }
  return ans;
}`,
      notes_md: '`ans[0]` is usually unused (points with coverage 0 outside all segments are not counted here).',
    },
  },
];

export const LESSONS: LearnLesson[] = [
  ...LESSONS_CORE,
  ...LESSONS_MORE,
  ...LESSONS_EXTRA,
  ...LESSONS_VARIANTS,
];
