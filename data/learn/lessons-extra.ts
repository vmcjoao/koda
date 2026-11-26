import type { LearnLesson } from '@/types/learn';

/** More paradigms / structures that still lacked dedicated lessons. */
export const LESSONS_EXTRA: LearnLesson[] = [
  {
    id: 'ad-hoc',
    tagLabel: 'Ad-Hoc',
    tagKind: 'paradigm',
    title: 'Ad-Hoc / Constructive',
    family: 'techniques',
    summary: 'No named algorithm — observe the pattern and build the answer.',
    usage_md:
      'Implementation-heavy or constructive problems: simulate carefully, find an invariant, or explicitly construct a sequence/graph that meets the constraints.\n\nStart from small cases, guess the form of the answer, then prove it.\n\n**Pitfall:** over-engineering into DP/graphs when a direct construction exists; off-by-one in simulations.',
    complexity: {
      time: 'Problem-dependent',
      extraMemory: 'O(N) typical',
      notes_md: 'Often $O(N)$ or $O(N \\log N)$ after the right observation.',
    },
    implementation: {
      language: 'cpp',
      code: `// constructive sketch: build a permutation with given constraints
vector<int> build_perm(int n) {
  vector<int> p(n);
  iota(p.begin(), p.end(), 1);
  // adjust p using the observation from the statement…
  return p;
}

// simulation sketch: process events in order
long long simulate(vector<int>& a) {
  long long ans = 0;
  for (int x : a) {
    // update state; accumulate ans
    ans += x;
  }
  return ans;
}`,
      notes_md: 'Keep a brute force for $N \\le 8$ to validate constructions while you iterate.',
    },
  },
  {
    id: 'math-number-theory',
    tagLabel: 'Math / Number Theory',
    tagKind: 'paradigm',
    title: 'Modular Arithmetic & GCD',
    family: 'math',
    summary: 'GCD/LCM, modular inverse, fast pow — the math toolkit.',
    usage_md:
      'Contest math: $\\gcd$, $\\mathrm{lcm}=ab/\\gcd$, binary exponentiation, modular inverse under prime MOD via Fermat ($a^{MOD-2}$), CRT for coprime moduli.\n\n**Pitfall:** using `%` on negatives in C++; multiplying before reducing mod (overflow) — cast to `__int128` or use careful `mulmod`.',
    complexity: {
      time: 'O(log N) gcd / pow',
      extraMemory: 'O(1)',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15], target: 6 },
    },
    relatedIds: ['sieve', 'matrix-expo', 'binary-search'],
    implementation: {
      language: 'cpp',
      code: `using ll = long long;
const ll MOD = 1e9 + 7;

ll mod_pow(ll a, ll e, ll mod = MOD) {
  ll r = 1 % mod;
  a %= mod;
  while (e > 0) {
    if (e & 1) r = r * a % mod;
    a = a * a % mod;
    e >>= 1;
  }
  return r;
}
ll mod_inv(ll a, ll mod = MOD) { // mod prime
  return mod_pow(a, mod - 2, mod);
}
ll gcdll(ll a, ll b) { return b ? gcdll(b, a % b) : a; }
ll lcmll(ll a, ll b) { return a / gcdll(a, b) * b; }`,
      notes_md: 'C++17 also has `std::gcd` / `std::lcm` in `<numeric>`.',
    },
  },
  {
    id: 'geometry-basics',
    tagLabel: 'Geometry',
    tagKind: 'paradigm',
    title: 'Geometry Basics',
    family: 'geometry',
    summary: 'Points, cross product, orientation — foundation for hulls and sweeps.',
    usage_md:
      'Represent points as pairs; use cross product for left/right turns and segment orientation. Prefer integer cross products to avoid floats.\n\n**Pitfall:** overflow on cross with large coordinates — use 64-bit; equality with floats without eps.',
    complexity: {
      time: 'O(1) primitives',
      extraMemory: 'O(1)',
    },
    visualization: {
      kind: 'geo-orient',
      demo: {
        points: [
          { x: 50, y: 140, label: 'A' },
          { x: 150, y: 40, label: 'B' },
          { x: 230, y: 130, label: 'C' },
        ],
      },
    },
    relatedIds: ['convex-hull', 'sweep-line', 'divide-conquer'],
    implementation: {
      language: 'cpp',
      code: `struct Pt { long long x, y; };
Pt operator-(Pt a, Pt b) { return {a.x - b.x, a.y - b.y}; }
long long cross(Pt a, Pt b) { return a.x * b.y - a.y * b.x; }
long long dot(Pt a, Pt b) { return a.x * b.x + a.y * b.y; }
long long cross(Pt o, Pt a, Pt b) { return cross(a - o, b - o); }

// +1 left turn, -1 right, 0 colinear
int orient(Pt o, Pt a, Pt b) {
  long long v = cross(o, a, b);
  return (v > 0) - (v < 0);
}`,
      notes_md: 'See also the Convex Hull and Sweep Line lessons for full algorithms.',
    },
  },
  {
    id: 'interactive',
    tagLabel: 'Interactive',
    tagKind: 'paradigm',
    title: 'Interactive Problems',
    family: 'techniques',
    summary: 'Query the judge, flush output, binary-search the hidden answer.',
    usage_md:
      'Print a query, **flush**, read the response. Typical: binary search a hidden value, graph exploration with limited queries.\n\nAlways flush (`cout << flush` or `endl`). Stay within the query limit.\n\n**Pitfall:** forgetting flush (deadlock); printing debug to stdout; off-by-one in binary-search interactive protocols.',
    complexity: {
      time: 'O(Q · work)',
      extraMemory: 'O(1)',
      notes_md: '$Q$ is the query budget from the statement.',
    },
    implementation: {
      language: 'cpp',
      code: `int ask(int x) {
  cout << "? " << x << endl; // endl flushes
  int ans;
  if (!(cin >> ans)) exit(0); // judge terminated
  return ans;
}

void answer(int x) {
  cout << "! " << x << endl;
}

// binary search interactive sketch
int find_hidden(int lo, int hi) {
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ask(mid) == 1) hi = mid; // protocol-dependent
    else lo = mid + 1;
  }
  return lo;
}`,
      notes_md: 'Some judges want `cout.flush()` explicitly after `\\n`. Never leave unread output buffered.',
    },
  },
  {
    id: 'flows-matching',
    tagLabel: 'Flows / Matching',
    tagKind: 'paradigm',
    title: 'Flows & Matching Mindset',
    family: 'graphs',
    summary: 'Model assignment and cut problems as flow networks.',
    usage_md:
      'When you hear “assign”, “disjoint paths”, “minimum cut of roles”, draw a network: source → left side → right side → sink with capacity 1, or more general capacities.\n\nSee **Max Flow** and **Bipartite Matching** lessons for implementations.\n\n**Pitfall:** wrong capacities (should be 1 vs ∞); forgetting residual edges.',
    complexity: {
      time: 'See Dinic / Kuhn',
      extraMemory: 'O(N + M)',
    },
    implementation: {
      language: 'cpp',
      code: `// modeling checklist (not a full solver):
// 1) nodes for every entity
// 2) source → left with cap 1 (or supply)
// 3) left → right with cap 1 if compatible
// 4) right → sink with cap 1 (or demand)
// 5) run max flow; matching size = flow value
//
// For min-cut selection: positive profit edges from source,
// costs to sink; answer = sum positives - maxflow.`,
      notes_md: 'Implement with the Max Flow (Dinic) or Bipartite Matching lessons.',
    },
  },
  {
    id: 'hash-map',
    tagLabel: 'Hash Map',
    tagKind: 'data_structure',
    title: 'Hash Map',
    family: 'structures',
    summary: 'Average O(1) key → value — frequency maps and memoization.',
    usage_md:
      '`unordered_map` for counts, coordinate compression helpers, meet-in-the-middle maps. Prefer `map` when you need order or anti-hash safety.\n\n**Pitfall:** adversarial hashes on `unordered_map` with `int`/`long long` keys on some CF rounds — custom hash or switch to `map`.',
    complexity: {
      time: 'Avg O(1); worst O(N)',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-prefix',
      demo: { values: [1, 2, 1, 3, 2, 1] },
    },
    relatedIds: ['string-hashing', 'sorting', 'coordinate-compression'],
    implementation: {
      language: 'cpp',
      code: `unordered_map<long long, int> freq;
for (long long x : a) freq[x]++;

// safe-ish custom hash for anti-hash tests
struct CustomHash {
  static uint64_t splitmix(uint64_t x) {
    x += 0x9e3779b97f4a7c15ULL;
    x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
    x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
    return x ^ (x >> 31);
  }
  size_t operator()(long long x) const {
    static const uint64_t FIXED = chrono::steady_clock::now().time_since_epoch().count();
    return splitmix(x + FIXED);
  }
};
unordered_map<long long, int, CustomHash> safe;`,
      notes_md: 'For ordered keys or small $N$, `map` is simpler and $O(\\log N)$.',
    },
  },
  {
    id: 'stack-ds',
    tagLabel: 'Stack',
    tagKind: 'data_structure',
    title: 'Stack',
    family: 'structures',
    summary: 'LIFO — parentheses, monotonic stacks, undo.',
    usage_md:
      'Bracket matching, evaluating expressions, DFS explicit stack, building monotone envelopes.\n\n**Pitfall:** peeking `top()` on an empty stack; confusing stack order when reconstructing paths.',
    complexity: {
      time: 'O(1) push/pop',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-stack',
      demo: { values: [3, 1, 4, 1, 5] },
    },
    relatedIds: ['monotonic-stack', 'dfs', 'queue-ds'],
    implementation: {
      language: 'cpp',
      code: `bool valid_brackets(const string& s) {
  stack<char> st;
  for (char c : s) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
      if (st.empty()) return false;
      char o = st.top(); st.pop();
      if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{'))
        return false;
    }
  }
  return st.empty();
}`,
      notes_md: 'See Monotonic Stack for next-greater patterns built on the same structure.',
    },
  },
  {
    id: 'queue-ds',
    tagLabel: 'Queue',
    tagKind: 'data_structure',
    title: 'Queue',
    family: 'structures',
    summary: 'FIFO — BFS layers and Kahn topo order.',
    usage_md:
      'BFS, sliding processing of events in arrival order, Kahn’s algorithm. Use `deque` when you also need the front for 0-1 BFS.\n\n**Pitfall:** using a queue where a deque/stack was required; infinite loops if you enqueue without a visited mark.',
    complexity: {
      time: 'O(1) push/pop',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-queue',
      demo: { values: [2, 7, 1, 8, 3] },
    },
    relatedIds: ['bfs', 'stack-ds', 'topo-sort'],
    implementation: {
      language: 'cpp',
      code: `vector<int> bfs_order(int n, vector<vector<int>>& g, int s) {
  vector<int> dist(n, -1), order;
  queue<int> q;
  dist[s] = 0;
  q.push(s);
  while (!q.empty()) {
    int u = q.front(); q.pop();
    order.push_back(u);
    for (int v : g[u]) if (dist[v] < 0) {
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return order;
}`,
      notes_md: 'Pair with the BFS lesson for the algorithm view.',
    },
  },
];
