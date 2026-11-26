import type { LearnLesson } from '@/types/learn';

/** Specific algorithm variants split out from generic Sorting / Binary Search hubs. */
export const LESSONS_VARIANTS: LearnLesson[] = [
  // ── Sorting family ──
  {
    id: 'mergesort',
    tagLabel: 'Sorting',
    title: 'Mergesort',
    family: 'search',
    summary: 'Stable divide-and-conquer sort — and the merge step behind inversion counting.',
    usage_md:
      'When you need a **stable** $O(N \\log N)$ sort you control, or when the **merge** itself carries information (inversions, “how many left of mid are > this right element?”).\n\nTemplate: sort `[l,m)` and `[m,r)`, then merge into a temp buffer. Contests rarely hand-roll mergesort for plain sorting (`std::stable_sort` exists) — they hand-roll it for **offline merge tricks**.\n\n**Pitfall:** copying the merge buffer wrong; using `<` vs `<=` and accidentally breaking stability or double-counting equals.',
    complexity: {
      time: 'O(N log N)',
      extraMemory: 'O(N)',
      notes_md: 'Always Θ(N log N) — no quadratic worst case.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [5, 2, 8, 1, 9, 3] },
    },
    relatedIds: ['sorting', 'quicksort', 'divide-conquer', 'counting-sort'],
    implementation: {
      language: 'cpp',
      code: `void merge_sort(vector<int>& a, int l, int r, vector<int>& tmp) {
  if (r - l <= 1) return;
  int m = (l + r) / 2;
  merge_sort(a, l, m, tmp);
  merge_sort(a, m, r, tmp);
  int i = l, j = m, k = l;
  while (i < m || j < r) {
    if (j == r || (i < m && a[i] <= a[j])) tmp[k++] = a[i++]; // <= keeps stable
    else tmp[k++] = a[j++];
  }
  for (int t = l; t < r; t++) a[t] = tmp[t];
}

void sort_all(vector<int>& a) {
  vector<int> tmp(a.size());
  merge_sort(a, 0, (int)a.size(), tmp);
}
`,
      notes_md: 'Swap the merge comparison for inversion counting — see Divide & Conquer.',
    },
  },
  {
    id: 'quicksort',
    tagLabel: 'Sorting',
    title: 'Quicksort',
    family: 'search',
    summary: 'Partition around a pivot — the intuition behind nth_element and many in-place tricks.',
    usage_md:
      'Classic quicksort is average $O(N \\log N)$ but $O(N^2)$ on adversarial pivots. Contests use the **partition idea** more than hand-rolled quicksort: `nth_element`, Dutch-national-flag three-way splits, “move all ≤ x to the left”.\n\n`std::sort` is introsort (quick + heap + insertion) so you get worst-case $O(N \\log N)$ without thinking about pivots.\n\n**Pitfall:** fixed pivot = first/last element on sorted input → quadratic; unstable partition if you need equal-key order.',
    complexity: {
      time: 'Avg O(N log N), worst O(N²)',
      extraMemory: 'O(log N) stack',
      notes_md: 'Random pivot or median-of-three reduces pathological cases. Prefer std::sort in contests.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [4, 7, 2, 9, 1, 5] },
    },
    relatedIds: ['sorting', 'mergesort', 'counting-sort'],
    implementation: {
      language: 'cpp',
      code: `// Lomuto partition: returns final index of pivot
int partition(vector<int>& a, int l, int r) { // sorts a[l..r]
  int pivot = a[r], i = l;
  for (int j = l; j < r; j++) if (a[j] <= pivot) swap(a[i++], a[j]);
  swap(a[i], a[r]);
  return i;
}

void quicksort(vector<int>& a, int l, int r) {
  if (l >= r) return;
  // random pivot helps against sorted / adversarial arrays
  int p = l + rand() % (r - l + 1);
  swap(a[p], a[r]);
  int m = partition(a, l, r);
  quicksort(a, l, m - 1);
  quicksort(a, m + 1, r);
}

// selection: k-th smallest (0-based) — library version
int kth(vector<int> a, int k) {
  nth_element(a.begin(), a.begin() + k, a.end());
  return a[k];
}
`,
      notes_md: '`nth_element` is the contest-ready partition primitive — don’t reinvent unless the problem asks for it.',
    },
  },
  {
    id: 'counting-sort',
    tagLabel: 'Sorting',
    title: 'Counting & radix sort',
    family: 'search',
    summary: 'Linear-time sorts when keys live in a small integer universe.',
    usage_md:
      '**Counting sort:** values in $[0, K]$ with $K = O(N)$ (or small enough for an array). Stable counting sort is the digit pass inside **radix sort**.\n\nUse when comparison sort’s $N \\log N$ is too tight, or when you sort by a byte/digit of a 64-bit key / string.\n\n**Pitfall:** $K$ too large → MLE/TLE; forgetting stability when radixing multiple digits; negative keys without an offset.',
    complexity: {
      time: 'O(N + K) / O(D · (N + B))',
      extraMemory: 'O(N + K)',
      notes_md: 'D = digits, B = digit base (often 256). Comparison sort still wins for generic comparable keys.',
    },
    visualization: {
      kind: 'array-sort',
      demo: { values: [3, 1, 2, 0, 3, 1] },
    },
    relatedIds: ['sorting', 'mergesort', 'coordinate-compression'],
    implementation: {
      language: 'cpp',
      code: `// stable counting sort for values in [0, K]
vector<int> counting_sort(const vector<int>& a, int K) {
  vector<int> cnt(K + 1), out(a.size());
  for (int x : a) cnt[x]++;
  for (int i = 1; i <= K; i++) cnt[i] += cnt[i - 1];
  for (int i = (int)a.size() - 1; i >= 0; i--) // reverse → stable
    out[--cnt[a[i]]] = a[i];
  return out;
}

// one LSD radix pass on the lowest 8 bits (extend for full 32/64-bit)
vector<int> radix_pass(const vector<int>& a) {
  const int B = 256;
  vector<int> cnt(B), out(a.size());
  for (int x : a) cnt[x & 255]++;
  for (int i = 1; i < B; i++) cnt[i] += cnt[i - 1];
  for (int i = (int)a.size() - 1; i >= 0; i--)
    out[--cnt[a[i] & 255]] = a[i];
  return out;
}
`,
    },
  },
  {
    id: 'coordinate-compression',
    tagLabel: 'Sorting',
    title: 'Coordinate compression',
    family: 'search',
    summary: 'Map huge values to ranks 0…U−1 so fenwick/segtree/arrays fit in memory.',
    usage_md:
      'You only care about **relative order** of up to $N$ values from a huge domain ($10^9$). Sort unique values, then replace each $x$ by its rank via `lower_bound`.\n\nClassic: point coordinates for 2D fenwick, offline queries, “distinct values ≤ N” indexing.\n\n**Pitfall:** compressing after mutating the array; using `upper_bound` when you meant rank of exact value; forgetting duplicates when you need dense ranks vs multiset ranks.',
    complexity: {
      time: 'O(N log N) build, O(log N) per rank',
      extraMemory: 'O(N)',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [10, 20, 30, 40, 50], target: 30 },
    },
    relatedIds: ['sorting', 'lower-bound', 'fenwick', 'segment-tree'],
    implementation: {
      language: 'cpp',
      code: `// returns ranks in [0, U); builds the sorted unique table
vector<int> compress(vector<int> a) {
  vector<int> b = a;
  sort(b.begin(), b.end());
  b.erase(unique(b.begin(), b.end()), b.end());
  for (int& x : a)
    x = (int)(lower_bound(b.begin(), b.end(), x) - b.begin());
  return a;
}

// keep the table if you need value ↔ rank both ways
struct Compressor {
  vector<int> xs;
  void add(int x) { xs.push_back(x); }
  void build() {
    sort(xs.begin(), xs.end());
    xs.erase(unique(xs.begin(), xs.end()), xs.end());
  }
  int rank(int x) const { // assumes x was added
    return (int)(lower_bound(xs.begin(), xs.end(), x) - xs.begin());
  }
  int value(int r) const { return xs[r]; }
  int size() const { return (int)xs.size(); }
};
`,
    },
  },

  // ── Binary search family ──
  {
    id: 'lower-bound',
    tagLabel: 'Binary Search',
    title: 'Lower bound',
    family: 'search',
    summary: 'First position with a[i] ≥ x — the workhorse binary-search template.',
    usage_md:
      'On a sorted ascending range, **lower_bound** is the first index where `a[i] >= x` (or `n` if none). Use it for: insertion point, first occurrence of `x`, “smallest value ≥ x”, counting how many are `< x` (= the returned index).\n\nInvariant: answer ∈ `[lo, hi]` with `hi` exclusive; while `lo < hi`, mid goes right if `a[mid] < x`, else shrink `hi`.\n\n**Pitfall:** using `<` vs `<=` (that’s upper_bound); assuming the value exists; applying to an unsorted array.',
    complexity: {
      time: 'O(log N)',
      extraMemory: 'O(1)',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [1, 3, 3, 3, 5, 7, 9], target: 3 },
    },
    relatedIds: ['binary-search', 'upper-bound', 'coordinate-compression', 'binary-search-answer'],
    implementation: {
      language: 'cpp',
      code: `// first index i with a[i] >= x  (n if all a[i] < x)
int lower_bound_idx(const vector<int>& a, int x) {
  int lo = 0, hi = (int)a.size(); // answer in [lo, hi]
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// first occurrence of x, or -1
int first_equal(const vector<int>& a, int x) {
  int i = lower_bound_idx(a, x);
  return (i < (int)a.size() && a[i] == x) ? i : -1;
}

// STL: lower_bound(a.begin(), a.end(), x) - a.begin()
`,
      notes_md: 'Count of elements `< x` is exactly `lower_bound_idx(a, x)`.',
    },
  },
  {
    id: 'upper-bound',
    tagLabel: 'Binary Search',
    title: 'Upper bound',
    family: 'search',
    summary: 'First position with a[i] > x — pair with lower_bound to count equals.',
    usage_md:
      '**Upper bound** is the first index where `a[i] > x` (or `n`). Together with lower_bound:\n\n- count of `x` = `upper - lower`\n- last occurrence of `x` = `upper - 1` (if that index holds `x`)\n- count of elements `≤ x` = `upper`\n\nSame loop as lower_bound, but move `lo` when `a[mid] <= x`.\n\n**Pitfall:** swapping the `<=` branch with lower_bound’s `<`; off-by-one when taking `upper - 1` on an empty match.',
    complexity: {
      time: 'O(log N)',
      extraMemory: 'O(1)',
    },
    visualization: {
      kind: 'array-binary-search',
      demo: { values: [1, 3, 3, 3, 5, 7, 9], target: 3 },
    },
    relatedIds: ['lower-bound', 'binary-search', 'binary-search-answer'],
    implementation: {
      language: 'cpp',
      code: `// first index i with a[i] > x  (n if all a[i] <= x)
int upper_bound_idx(const vector<int>& a, int x) {
  int lo = 0, hi = (int)a.size();
  while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// frequency of x in sorted a (pair with lower_bound)
int count_equal(const vector<int>& a, int x) {
  auto lo = lower_bound(a.begin(), a.end(), x);
  auto hi = upper_bound(a.begin(), a.end(), x);
  return (int)(hi - lo);
}

// last index with a[i] == x, or -1
int last_equal(const vector<int>& a, int x) {
  int i = upper_bound_idx(a, x) - 1;
  return (i >= 0 && a[i] == x) ? i : -1;
}
`,
      notes_md: 'STL: `upper_bound(a.begin(), a.end(), x) - a.begin()`.',
    },
  },
];
