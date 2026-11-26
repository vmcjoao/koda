import type { ProblemWithApproaches } from '@/types/database';

/** Curated offline seed — also mirrored in supabase/seed.sql */
export const SEED_PROBLEMS: ProblemWithApproaches[] = [
  {
    id: 'cses-weird-algorithm',
    title: 'Weird Algorithm',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1068',
    difficulty_rating: 800,
    statement_md:
      'Consider an algorithm that takes a positive integer $n$. If $n$ is even, replace it with $n/2$. If $n$ is odd, replace it with $3n+1$. Repeat until $n = 1$.\n\nYour task is to simulate the algorithm and print the values.',
    constraints_text: '$1 \\le n \\le 10^6$',
    sample_io: [{ input: '3', output: '3 10 5 16 8 4 2 1' }],
    target_complexity: 'O(log N)',
    approaches: [
      {
        id: 'cses-weird-algorithm-a1',
        problem_id: 'cses-weird-algorithm',
        approach_name: 'Direct simulation',
        paradigms: ['Ad-Hoc'],
        algorithms: [],
        data_structures: ['1D Array'],
        key_insights: ['Simulate until n becomes 1', 'Watch overflow if using 32-bit ints on larger variants'],
        editorial_summary_md:
          'Simply follow the rules. For the classic Collatz-style loop, simulation is enough under the given constraints.',
      },
    ],
  },
  {
    id: 'cses-missing-number',
    title: 'Missing Number',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1083',
    difficulty_rating: 800,
    statement_md:
      'You are given all numbers between $1$ and $n$ except one. Find the missing number.',
    constraints_text: '$2 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '5\n2 3 1 5', output: '4' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-missing-number-a1',
        problem_id: 'cses-missing-number',
        approach_name: 'XOR or sum formula',
        paradigms: ['Ad-Hoc', 'Math / Number Theory'],
        algorithms: ['Prefix Sums'],
        data_structures: ['1D Array'],
        key_insights: ['Use sum 1..n minus given sum', 'XOR 1..n with all elements to avoid overflow'],
        editorial_summary_md:
          'Expected sum is $n(n+1)/2$. Subtract the sum of the input, or use XOR for a constant-space variant.',
      },
    ],
  },
  {
    id: 'cses-apartments',
    title: 'Apartments',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1084',
    difficulty_rating: 1100,
    statement_md:
      'There are $n$ applicants and $m$ apartments. Each applicant has a desired size $a_i$, and will accept an apartment of size in $[a_i-k, a_i+k]$. Assign apartments to maximize matches.',
    constraints_text: '$1 \\le n,m \\le 2 \\times 10^5$, $0 \\le k \\le 10^9$',
    sample_io: [{ input: '4 3 5\n60 45 80 60\n30 60 75', output: '2' }],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-apartments-a1',
        problem_id: 'cses-apartments',
        approach_name: 'Sort + two pointers',
        paradigms: ['Greedy', 'Two Pointers'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: ['Sort both arrays', 'Greedily assign smallest feasible apartment'],
        editorial_summary_md:
          'Sort applicants and apartments. Walk with two pointers, always assigning the smallest apartment that still fits.',
      },
    ],
  },
  {
    id: 'cses-ferris-wheel',
    title: 'Ferris Wheel',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1090',
    difficulty_rating: 1100,
    statement_md:
      'There are $n$ children with weights $w_i$. A gondola holds at most two children and total weight at most $x$. Minimize the number of gondolas.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$, $1 \\le x \\le 10^9$',
    sample_io: [{ input: '4 10\n7 2 3 9', output: '3' }],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-ferris-wheel-a1',
        problem_id: 'cses-ferris-wheel',
        approach_name: 'Greedy lightest+heaviest',
        paradigms: ['Greedy', 'Two Pointers'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: ['Sort by weight', 'Pair lightest remaining with heaviest if they fit'],
        editorial_summary_md:
          'Sort weights. Use two pointers from both ends: pair if sum $\\le x$, else the heavy child rides alone.',
      },
    ],
  },
  {
    id: 'cses-playlist',
    title: 'Playlist',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1141',
    difficulty_rating: 1400,
    statement_md:
      'You are given a playlist of $n$ songs. Find the longest contiguous segment of songs where each song appears at most once.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '8\n1 2 1 3 2 7 4 2', output: '5' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-playlist-a1',
        problem_id: 'cses-playlist',
        approach_name: 'Sliding window + set',
        paradigms: ['Two Pointers'],
        algorithms: ['Sorting'],
        data_structures: ['Hash Map', 'Ordered Set'],
        key_insights: ['Maintain a window of unique songs', 'Move left pointer when duplicate appears'],
        editorial_summary_md:
          'Two pointers with a map/set of song indices. Expand right; when a duplicate appears, jump left past the previous occurrence.',
      },
    ],
  },
  {
    id: 'cses-shortest-routes-i',
    title: 'Shortest Routes I',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1671',
    difficulty_rating: 1500,
    statement_md:
      'A weighted directed graph with $n$ nodes and $m$ edges. Find the shortest path lengths from node $1$ to every node.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le m \\le 2 \\times 10^5$, weights positive',
    sample_io: [
      {
        input: '3 4\n1 2 6\n1 3 2\n3 2 3\n1 3 4',
        output: '0 5 2',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-shortest-routes-i-a1',
        problem_id: 'cses-shortest-routes-i',
        approach_name: 'Dijkstra from source 1',
        paradigms: ['Graph Algorithms', 'Greedy'],
        algorithms: ['Dijkstra'],
        data_structures: ['Priority Queue', 'Adjacency List'],
        key_insights: ['Non-negative weights → Dijkstra', 'Use 64-bit distances'],
        editorial_summary_md:
          'Run Dijkstra from node 1 with a binary heap. Store distances in 64-bit integers.',
      },
    ],
  },
  {
    id: 'cses-flight-discount',
    title: 'Flight Discount',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1195',
    difficulty_rating: 1700,
    statement_md:
      'Find the cheapest flight from $1$ to $n$ when you may halve the cost of **at most one** edge (rounded down).',
    constraints_text: '$2 \\le n \\le 10^5$, $1 \\le m \\le 2 \\times 10^5$',
    sample_io: [
      {
        input: '3 4\n1 2 3\n2 3 1\n1 3 7\n2 1 5',
        output: '2',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-flight-discount-a1',
        problem_id: 'cses-flight-discount',
        approach_name: 'Dijkstra on layered graph',
        paradigms: ['Graph Algorithms', 'Dynamic Programming'],
        algorithms: ['Dijkstra'],
        data_structures: ['Priority Queue', 'Adjacency List'],
        key_insights: [
          'State is (node, used_discount)',
          'Edge transitions either keep discount unused or apply half cost once',
        ],
        editorial_summary_md:
          'Model a 2-layer graph: whether the discount has been used. Dijkstra on states $(u,0/1)$.',
      },
    ],
  },
  {
    id: 'cses-coin-combinations-i',
    title: 'Coin Combinations I',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1635',
    difficulty_rating: 1500,
    statement_md:
      'Given $n$ coin values and a target sum $x$, count the number of ordered ways to form $x$ modulo $10^9+7$.',
    constraints_text: '$1 \\le n \\le 100$, $1 \\le x \\le 10^6$',
    sample_io: [{ input: '3 9\n2 3 5', output: '8' }],
    target_complexity: 'O(N²)',
    approaches: [
      {
        id: 'cses-coin-combinations-i-a1',
        problem_id: 'cses-coin-combinations-i',
        approach_name: 'Classic DP over sum',
        paradigms: ['Dynamic Programming'],
        algorithms: ['Knapsack'],
        data_structures: ['1D Array'],
        key_insights: ['dp[s] = sum of dp[s-c] over coins', 'Order of loops yields ordered combinations'],
        editorial_summary_md:
          'Let $dp[s]$ be ways to make sum $s$. Iterate sums outer, coins inner for ordered ways.',
      },
    ],
  },
  {
    id: 'cses-edit-distance',
    title: 'Edit Distance',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1639',
    difficulty_rating: 1600,
    statement_md:
      'Compute the minimum number of operations (insert, delete, replace) to transform string $s$ into string $t$.',
    constraints_text: '$1 \\le |s|,|t| \\le 5000$',
    sample_io: [{ input: 'LOVE\nMOVIE', output: '2' }],
    target_complexity: 'O(N²)',
    approaches: [
      {
        id: 'cses-edit-distance-a1',
        problem_id: 'cses-edit-distance',
        approach_name: 'Levenshtein DP',
        paradigms: ['Dynamic Programming'],
        algorithms: ['Knapsack'],
        data_structures: ['2D Array'],
        key_insights: ['State is (i, j) prefixes', 'Transition min of insert/delete/replace'],
        editorial_summary_md:
          'Standard Levenshtein DP: $dp[i][j]$ from first $i$ chars of $s$ to first $j$ of $t$.',
      },
    ],
  },
  {
    id: 'cses-road-construction',
    title: 'Road Construction',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1676',
    difficulty_rating: 1500,
    statement_md:
      'There are $n$ cities and no roads. Roads are added one by one. After each addition, output the number of components and the size of the largest component.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le m \\le 2 \\times 10^5$',
    sample_io: [
      {
        input: '5 3\n1 2\n1 3\n4 5',
        output: '4 2\n3 3\n2 3',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-road-construction-a1',
        problem_id: 'cses-road-construction',
        approach_name: 'DSU with sizes',
        paradigms: ['Graph Algorithms'],
        algorithms: ['DSU'],
        data_structures: ['1D Array'],
        key_insights: ['Track component count and max size on unite', 'Union by size/rank'],
        editorial_summary_md:
          'Process edges with DSU. On successful unite, decrement components and update max size.',
      },
    ],
  },
  {
    id: 'cses-subordinates',
    title: 'Subordinates',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1674',
    difficulty_rating: 1400,
    statement_md:
      'A company hierarchy is a tree rooted at $1$. For each employee, compute how many subordinates they have (direct or indirect).',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '5\n1 1 2 2', output: '4 1 0 0 0' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-subordinates-a1',
        problem_id: 'cses-subordinates',
        approach_name: 'Tree DP / DFS sizes',
        paradigms: ['Dynamic Programming', 'Graph Algorithms'],
        algorithms: ['DFS'],
        data_structures: ['Adjacency List'],
        key_insights: ['Subtree size minus one equals subordinates', 'DFS post-order'],
        editorial_summary_md:
          'Build the tree and DFS: $size[u] = 1 + \\sum size[child]$. Answer for $u$ is $size[u]-1$.',
      },
    ],
  },
  {
    id: 'cses-factory-machines',
    title: 'Factory Machines',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1620',
    difficulty_rating: 1400,
    statement_md:
      'You have $n$ machines; machine $i$ produces one product every $t_i$ time units. What is the minimum time to produce $t$ products?',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$, $1 \\le t \\le 10^9$',
    sample_io: [{ input: '3 7\n3 2 5', output: '8' }],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-factory-machines-a1',
        problem_id: 'cses-factory-machines',
        approach_name: 'Binary search on time',
        paradigms: ['Binary Search on Answer', 'Greedy'],
        algorithms: ['Binary Search'],
        data_structures: ['1D Array'],
        key_insights: ['Monotonic feasibility in time', 'Count products as sum floor(mid / t_i) carefully vs overflow'],
        editorial_summary_md:
          'Binary search the finishing time. A candidate mid is feasible if $\\sum \\lfloor mid / t_i \\rfloor \\ge t$.',
      },
    ],
  },
  {
    id: 'cf-1360c',
    title: 'Similar Pairs',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1360/C',
    difficulty_rating: 1200,
    statement_md:
      'You are given an array of $n$ distinct integers. Pair them into $n/2$ pairs such that each pair consists of two numbers of the same parity, or two numbers differing by $1$.',
    constraints_text: '$2 \\le n \\le 50$, $n$ even; $T$ test cases',
    sample_io: [{ input: '1\n4\n1 5 3 4', output: 'YES' }],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cf-1360c-a1',
        problem_id: 'cf-1360c',
        approach_name: 'Parity counts + adjacent check',
        paradigms: ['Greedy', 'Ad-Hoc', 'Math / Number Theory'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: [
          'Even counts of odd and even → always yes',
          'Otherwise need one pair with difference 1',
        ],
        editorial_summary_md:
          'If both parity counts are even, pair within parity. Else sort and check for a consecutive pair with difference 1.',
      },
    ],
  },
  {
    id: 'cf-580c',
    title: 'Kefa and Park',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/580/C',
    difficulty_rating: 1500,
    statement_md:
      'A tree rooted at $1$. Some vertices have cats. Count leaf restaurants reachable from the root without encountering more than $m$ consecutive cats on the path.',
    constraints_text: '$2 \\le n \\le 10^5$',
    sample_io: [
      {
        input: '4 1\n1 1 0 0\n1 2\n1 3\n1 4',
        output: '2',
      },
    ],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cf-580c-a1',
        problem_id: 'cf-580c',
        approach_name: 'DFS with consecutive cat streak',
        paradigms: ['Graph Algorithms'],
        algorithms: ['DFS'],
        data_structures: ['Adjacency List'],
        key_insights: ['Track consecutive cats along the path', 'Reset streak when a vertex has no cat'],
        editorial_summary_md:
          'DFS/BFS from root carrying current consecutive-cat count. Count leaves where the constraint never failed.',
      },
    ],
  },
  {
    id: 'cf-706b',
    title: 'Interesting drink',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/706/B',
    difficulty_rating: 1100,
    statement_md:
      'Shop prices are $x_i$. For each query budget $m_j$, how many shops can Vasiliy afford?',
    constraints_text: '$1 \\le n,q \\le 10^5$',
    sample_io: [
      {
        input: '5\n3 10 8 6 11\n4\n1\n10\n3\n11',
        output: '0\n4\n1\n5',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cf-706b-a1',
        problem_id: 'cf-706b',
        approach_name: 'Sort + upper_bound',
        paradigms: ['Binary Search on Answer'],
        algorithms: ['Binary Search', 'Sorting'],
        data_structures: ['1D Array'],
        key_insights: ['Sort prices once', 'Each query is upper_bound on budget'],
        editorial_summary_md:
          'Sort the price array. For each query, binary search the first price $> m_j$; the index is the answer.',
      },
    ],
  },
  {
    id: 'cf-489b',
    title: 'BerSU Ball',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/489/B',
    difficulty_rating: 1200,
    statement_md:
      'Pair boys and girls so that skill difference is at most $1$. Maximize the number of pairs.',
    constraints_text: '$1 \\le n,m \\le 100$',
    sample_io: [
      {
        input: '4\n1 4 6 2\n5\n5 1 5 7 9',
        output: '3',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cf-489b-a1',
        problem_id: 'cf-489b',
        approach_name: 'Sort + greedy two pointers',
        paradigms: ['Greedy', 'Two Pointers'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: ['Sort both skill arrays', 'Greedily match closest feasible partners'],
        editorial_summary_md:
          'Sort both arrays and scan with two pointers, pairing when $|a-b|\\le 1$.',
      },
    ],
  },
  {
    id: 'cses-nested-ranges-check',
    title: 'Nested Ranges Check',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2168',
    difficulty_rating: 1700,
    statement_md:
      'You are given $n$ ranges. For each range, determine whether it contains another range, and whether it is contained in another range.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [
      {
        input: '4\n1 6\n2 4\n3 6\n5 7',
        output: '1 1 0 0\n0 1 1 1',
      },
    ],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-nested-ranges-check-a1',
        problem_id: 'cses-nested-ranges-check',
        approach_name: 'Sort + sweep with fenwick/set',
        paradigms: ['Greedy', 'Graph Algorithms'],
        algorithms: ['Sorting', 'Segment Tree'],
        data_structures: ['Fenwick Tree', 'Ordered Set'],
        key_insights: [
          'Sort by left ascending, right descending',
          'Sweep tracking max/min right endpoints seen',
        ],
        editorial_summary_md:
          'Sort ranges carefully, then sweep while maintaining ordered rights (set/BIT) to detect containment both ways.',
      },
    ],
  },
  {
    id: 'cses-course-schedule',
    title: 'Course Schedule',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1679',
    difficulty_rating: 1500,
    statement_md:
      'You want to complete $n$ courses. Requirements give directed edges $a \\rightarrow b$ meaning $a$ before $b$. Find a valid order or determine impossibility.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le m \\le 2 \\times 10^5$',
    sample_io: [
      {
        input: '5 3\n1 2\n3 1\n4 5',
        output: '3 4 1 5 2',
      },
    ],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-course-schedule-a1',
        problem_id: 'cses-course-schedule',
        approach_name: 'Topological sort (Kahn/DFS)',
        paradigms: ['Graph Algorithms'],
        algorithms: ['Topological Sort', 'BFS', 'DFS'],
        data_structures: ['Queue', 'Adjacency List'],
        key_insights: ['Cycle ⇒ impossible', 'Kahn BFS using indegrees'],
        editorial_summary_md:
          'Build the dependency graph and run topological sort. If fewer than $n$ nodes are ordered, a cycle exists.',
      },
    ],
  },
  {
    id: 'cses-collecting-numbers',
    title: 'Collecting Numbers',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/2216',
    difficulty_rating: 1300,
    statement_md:
      'You have an array that is a permutation of $1..n$. In one round you collect numbers in increasing order from left to right. How many rounds to collect all?',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '5\n4 2 1 5 3', output: '3' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-collecting-numbers-a1',
        problem_id: 'cses-collecting-numbers',
        approach_name: 'Position array + inversions of consecutive values',
        paradigms: ['Ad-Hoc', 'Greedy'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: [
          'Map each value to its index',
          'Each time pos[x] > pos[x+1] starts a new round',
        ],
        editorial_summary_md:
          'Store positions of each number. Count how often $pos[i] > pos[i+1]$; rounds $= 1 +$ that count.',
      },
    ],
  },
  {
    id: 'cses-sum-of-two-values',
    title: 'Sum of Two Values',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1640',
    difficulty_rating: 1100,
    statement_md:
      'Given $n$ numbers and target $x$, find two distinct indices whose values sum to $x$.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '4 8\n2 7 5 1', output: '2 4' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-sum-of-two-values-a1',
        problem_id: 'cses-sum-of-two-values',
        approach_name: 'Hash map of complements',
        paradigms: ['Ad-Hoc'],
        algorithms: ['Sorting'],
        data_structures: ['Hash Map'],
        key_insights: ['Store value → index while scanning', 'Look up x - a_i'],
        editorial_summary_md:
          'One pass with a hash map from value to index. For each $a_i$, check if $x-a_i$ was seen.',
      },
      {
        id: 'cses-sum-of-two-values-a2',
        problem_id: 'cses-sum-of-two-values',
        approach_name: 'Sort + two pointers',
        paradigms: ['Two Pointers'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: ['Keep original indices when sorting', 'Move left/right based on sum vs x'],
        editorial_summary_md:
          'Sort pairs $(value, index)$ and use two pointers to find a pair summing to $x$.',
      },
    ],
  },
  {
    id: 'cses-maximum-subarray-sum',
    title: 'Maximum Subarray Sum',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1643',
    difficulty_rating: 1200,
    statement_md:
      'Given an array of $n$ integers, find a contiguous subarray with the maximum possible sum.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '8\n-1 3 -2 5 3 -5 2 2', output: '9' }],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-maximum-subarray-sum-a1',
        problem_id: 'cses-maximum-subarray-sum',
        approach_name: 'Kadane',
        paradigms: ['Dynamic Programming', 'Greedy'],
        algorithms: ['Prefix Sums'],
        data_structures: ['1D Array'],
        key_insights: [
          'Track best ending here vs restart',
          'Handle all-negative arrays carefully',
        ],
        editorial_summary_md:
          'Kadane: maintain current sum, reset when negative (or keep running max for the all-negative case).',
      },
    ],
  },
  {
    id: 'cses-building-teams',
    title: 'Building Teams',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1668',
    difficulty_rating: 1400,
    statement_md:
      'There are $n$ pupils and $m$ friendships. Assign each pupil to team 1 or 2 so that friends are always on different teams, or report impossibility.',
    constraints_text: '$1 \\le n \\le 10^5$, $1 \\le m \\le 2 \\times 10^5$',
    sample_io: [
      {
        input: '5 3\n1 2\n1 3\n4 5',
        output: '1 2 2 1 2',
      },
    ],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cses-building-teams-a1',
        problem_id: 'cses-building-teams',
        approach_name: 'Bipartite coloring BFS/DFS',
        paradigms: ['Graph Algorithms'],
        algorithms: ['BFS', 'DFS'],
        data_structures: ['Adjacency List', 'Queue'],
        key_insights: [
          'Color connected components with 2 colors',
          'Odd cycle ⇒ impossible',
        ],
        editorial_summary_md:
          'Check bipartiteness of the friendship graph; assign teams by the two color classes.',
      },
    ],
  },
  {
    id: 'cses-stick-lengths',
    title: 'Stick Lengths',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1074',
    difficulty_rating: 1200,
    statement_md:
      'You have $n$ sticks with lengths $p_i$. Change any stick to any positive length; cost is the absolute difference. Minimize total cost to make all sticks equal.',
    constraints_text: '$1 \\le n \\le 2 \\times 10^5$',
    sample_io: [{ input: '5\n2 3 1 5 2', output: '5' }],
    target_complexity: 'O(N log N)',
    approaches: [
      {
        id: 'cses-stick-lengths-a1',
        problem_id: 'cses-stick-lengths',
        approach_name: 'Median target',
        paradigms: ['Greedy', 'Math / Number Theory'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: [
          'Optimal equal length is the median',
          'Mean is wrong for L1 absolute cost',
        ],
        editorial_summary_md:
          'Sort and set every stick to the median length; sum absolute deviations.',
      },
    ],
  },
  {
    id: 'cf-550a',
    title: 'Two Substrings',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/550/A',
    difficulty_rating: 1300,
    statement_md:
      'You are given a string $s$. Check whether it contains two non-overlapping substrings "AB" and "BA" (in either order).',
    constraints_text: '$1 \\le |s| \\le 10^5$',
    sample_io: [
      { input: 'ABA', output: 'NO' },
      { input: 'BACFAB', output: 'YES' },
    ],
    target_complexity: 'O(N)',
    approaches: [
      {
        id: 'cf-550a-a1',
        problem_id: 'cf-550a',
        approach_name: 'First AB then BA (and swap)',
        paradigms: ['String Algorithms', 'Greedy'],
        algorithms: ['Sorting'],
        data_structures: ['1D Array'],
        key_insights: [
          'Find first AB then search BA after it',
          'Also try first BA then AB — overlap traps like ABA',
        ],
        editorial_summary_md:
          'Scan for AB then BA after that index; repeat with roles reversed. Overlaps like ABA fail both orders.',
      },
    ],
  },
  {
    id: 'cses-counting-rooms',
    title: 'Counting Rooms',
    source: 'CSES',
    url: 'https://cses.fi/problemset/task/1192',
    difficulty_rating: 1300,
    statement_md:
      'You are given an $n \\times m$ map of floor (`.`) and wall (`#`). Count the number of rooms (4-connected floor components).',
    constraints_text: '$1 \\le n,m \\le 1000$',
    sample_io: [
      {
        input: '5 8\n########\n#..#...#\n####.#.#\n#..#...#\n########',
        output: '3',
      },
    ],
    target_complexity: 'O(N²)',
    approaches: [
      {
        id: 'cses-counting-rooms-a1',
        problem_id: 'cses-counting-rooms',
        approach_name: 'Grid flood fill',
        paradigms: ['Graph Algorithms'],
        algorithms: ['DFS', 'BFS'],
        data_structures: ['2D Array', 'Queue'],
        key_insights: [
          'Each unvisited floor cell starts a new room',
          'Flood fill marks the whole component',
        ],
        editorial_summary_md:
          'Iterate cells; on each unmarked `.`, increment the answer and DFS/BFS the component.',
      },
    ],
  },
];

export function getSeedProblem(id: string): ProblemWithApproaches | undefined {
  return SEED_PROBLEMS.find((p) => p.id === id);
}
