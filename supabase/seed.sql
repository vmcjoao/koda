-- Auto-generated from seed + extras + io-formats overlay
truncate public.solution_approaches, public.problems, public.tag_catalog cascade;

insert into public.tag_catalog (id, kind, label, aliases) values ('p-dp', 'paradigm', 'Dynamic Programming', ARRAY['dp','memoization']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-greedy', 'paradigm', 'Greedy', ARRAY['greedy algorithm']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-dnc', 'paradigm', 'Divide & Conquer', ARRAY['divide and conquer']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-adhoc', 'paradigm', 'Ad-Hoc', ARRAY['implementation','constructive']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-bf', 'paradigm', 'Brute Force', ARRAY['complete search','enumeration']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-two-pointers', 'paradigm', 'Two Pointers', ARRAY['two pointers','sliding window']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-bsa', 'paradigm', 'Binary Search on Answer', ARRAY['bs on answer','binary search']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-graph', 'paradigm', 'Graph Algorithms', ARRAY['graphs']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-math', 'paradigm', 'Math / Number Theory', ARRAY['math','number theory']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-string', 'paradigm', 'String Algorithms', ARRAY['strings']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-geo', 'paradigm', 'Geometry', ARRAY['computational geometry']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-bitmask', 'paradigm', 'Bitmask / Bit DP', ARRAY['bitmask','bit dp']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-interactive', 'paradigm', 'Interactive', ARRAY[]::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('p-flows', 'paradigm', 'Flows / Matching', ARRAY['max flow','matching']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-dijkstra', 'algorithm', 'Dijkstra', ARRAY['shortest path']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-bfs', 'algorithm', 'BFS', ARRAY['breadth-first search']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-dfs', 'algorithm', 'DFS', ARRAY['depth-first search']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-segtree', 'algorithm', 'Segment Tree', ARRAY['seg tree']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-dsu', 'algorithm', 'DSU', ARRAY['union find','disjoint set']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-kmp', 'algorithm', 'KMP', ARRAY['knuth morris pratt']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-sieve', 'algorithm', 'Sieve', ARRAY['eratosthenes']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-topo', 'algorithm', 'Topological Sort', ARRAY['topo sort']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-knapsack', 'algorithm', 'Knapsack', ARRAY['0/1 knapsack']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-binary-search', 'algorithm', 'Binary Search', ARRAY['lower bound']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-sorting', 'algorithm', 'Sorting', ARRAY['sort']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-prefix', 'algorithm', 'Prefix Sums', ARRAY['prefix sum','difference array']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-lca', 'algorithm', 'LCA', ARRAY['lowest common ancestor']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-mst', 'algorithm', 'MST', ARRAY['kruskal','prim']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-floyd', 'algorithm', 'Floyd-Warshall', ARRAY['all pairs shortest path']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-bellman', 'algorithm', 'Bellman-Ford', ARRAY[]::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-hashing', 'algorithm', 'String Hashing', ARRAY['rolling hash']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-lis', 'algorithm', 'LIS', ARRAY['longest increasing subsequence']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-meet', 'algorithm', 'Meet in the Middle', ARRAY[]::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('a-ternary', 'algorithm', 'Ternary Search', ARRAY[]::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-pq', 'data_structure', 'Priority Queue', ARRAY['heap']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-hashmap', 'data_structure', 'Hash Map', ARRAY['unordered map','dictionary']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-mono-stack', 'data_structure', 'Monotonic Stack', ARRAY['mono stack']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-fenwick', 'data_structure', 'Fenwick Tree', ARRAY['bit','binary indexed tree']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-sparse', 'data_structure', 'Sparse Table', ARRAY['rmq']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-array', 'data_structure', '1D Array', ARRAY['array']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-2d', 'data_structure', '2D Array', ARRAY['matrix']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-set', 'data_structure', 'Ordered Set', ARRAY['set','tree set']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-deque', 'data_structure', 'Deque', ARRAY['double ended queue']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-graph', 'data_structure', 'Adjacency List', ARRAY['graph']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-trie', 'data_structure', 'Trie', ARRAY['prefix tree']::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-stack', 'data_structure', 'Stack', ARRAY[]::text[]);
insert into public.tag_catalog (id, kind, label, aliases) values ('d-queue', 'data_structure', 'Queue', ARRAY[]::text[]);

insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-weird-algorithm', 'Weird Algorithm', 'CSES', 'https://cses.fi/problemset/task/1068', 800, 'Consider an algorithm that takes a positive integer $n$. If $n$ is even, replace it with $n/2$. If $n$ is odd, replace it with $3n+1$. Repeat until $n = 1$.

Your task is to simulate the algorithm and print the values.', 'The only input line contains an integer $n$.', 'Print the sequence of values generated by the algorithm, separated by spaces, ending when the value becomes $1$.', '$1 \le n \le 10^6$', '[{"input":"3","output":"3 10 5 16 8 4 2 1"}]'::jsonb, 'O(log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-weird-algorithm-a1', 'cses-weird-algorithm', 'Direct simulation', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['Simulate until n becomes 1','Watch overflow if using 32-bit ints on larger variants']::text[], 'Simply follow the rules. For the classic Collatz-style loop, simulation is enough under the given constraints.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-missing-number', 'Missing Number', 'CSES', 'https://cses.fi/problemset/task/1083', 800, 'You are given all numbers between $1$ and $n$ except one. Find the missing number.', 'The first line contains an integer $n$.

The second line contains $n-1$ distinct integers in the range $1\dots n$.', 'Print the missing integer.', '$2 \le n \le 2 \times 10^5$', '[{"input":"5\n2 3 1 5","output":"4"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-missing-number-a1', 'cses-missing-number', 'XOR or sum formula', ARRAY['Ad-Hoc','Math / Number Theory']::text[], ARRAY['Prefix Sums']::text[], ARRAY['1D Array']::text[], ARRAY['Use sum 1..n minus given sum','XOR 1..n with all elements to avoid overflow']::text[], 'Expected sum is $n(n+1)/2$. Subtract the sum of the input, or use XOR for a constant-space variant.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-repetitions', 'Repetitions', 'CSES', 'https://cses.fi/problemset/task/1069', 800, 'You are given a DNA string of characters A, C, G, and T. Find the longest repetition — the maximum length of a contiguous substring consisting of a single character.', 'The only input line contains a DNA string of length $n$ consisting of characters `A`, `C`, `G`, and `T`.', 'Print one integer: the maximum repetition length.', '$1 \le |s| \le 10^6$', '[{"input":"ATTCGGGA","output":"3"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-repetitions-a1', 'cses-repetitions', 'Linear scan', ARRAY['Ad-Hoc','String Algorithms']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['Track current run length while scanning','Reset when the character changes']::text[], 'Walk the string once, maintaining the streak of equal characters. Update the answer whenever the streak grows.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-increasing-array', 'Increasing Array', 'CSES', 'https://cses.fi/problemset/task/1094', 800, 'You are given an array of $n$ integers. In one move you may increase any element by one. What is the minimum number of moves to make the array non-decreasing?', 'The first line contains an integer $n$.

The second line contains $n$ integers $a_1,a_2,\dots,a_n$.', 'Print the minimum number of moves.', '$1 \le n \le 2 \times 10^5$, $1 \le a_i \le 10^9$', '[{"input":"5\n3 2 5 1 7","output":"5"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-increasing-array-a1', 'cses-increasing-array', 'Greedy prefix max', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['Never decrease earlier elements','Each $a_i$ must become at least $\max(a_1..a_{i-1})$']::text[], 'Scan left to right. Keep the running maximum so far. If $a_i$ is smaller, add $\textit{max}-a_i$ moves and leave the max unchanged; otherwise update the max.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-bit-strings', 'Bit Strings', 'CSES', 'https://cses.fi/problemset/task/1617', 800, 'Your task is to calculate the number of bit strings of length $n$. Since the answer can be very large, print it modulo $10^9+7$.', 'The only input line contains an integer $n$.', 'Print the number of bit strings of length $n$, modulo $10^9+7$.', '$1 \le n \le 10^6$', '[{"input":"3","output":"8"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-bit-strings-a1', 'cses-bit-strings', 'Modular exponentiation of 2', ARRAY['Math / Number Theory']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Answer is $2^n \bmod (10^9+7)$','Use iterative multiply or binary exponentiation']::text[], 'There are $2^n$ binary strings. Compute the power modulo $10^9+7$ with a loop or fast pow.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-4a', 'Watermelon', 'Codeforces', 'https://codeforces.com/problemset/problem/4/A', 800, 'Pete and Billy want to divide a watermelon of weight $w$ into two parts with even positive weights. Print YES or NO.', 'The only input line contains an integer $w$ ($1 \le w \le 100$).', 'Print `YES` if the watermelon can be divided into two positive even parts, otherwise `NO`.', '$1 \le w \le 100$', '[{"input":"8","output":"YES"}]'::jsonb, 'O(1)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-4a-a1', 'cf-4a', 'Parity check', ARRAY['Math / Number Theory','Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Need $w \ge 4$ and $w$ even','2 cannot be split into two positive even parts']::text[], 'Any even $w \ge 4$ works (e.g. $2+(w-2)$). Odd weights and $w=2$ fail.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-fence-painting', 'Fence Painting', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=567', 800, 'Farmer John paints the interval $[a,b)$ on a fence; Bessie paints $[c,d)$. How many units of fence are painted at least once?', 'The first line contains two integers $a$ and $b$.

The second line contains two integers $c$ and $d$.', 'Print the number of units of fence painted at least once.', '$0 \le a,b,c,d \le 100$', '[{"input":"7 10\n4 8","output":"6"}]'::jsonb, 'O(1)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-fence-painting-a1', 'usaco-fence-painting', 'Interval union length', ARRAY['Math / Number Theory','Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Length $= (b-a)+(d-c) - \text{overlap}$','Overlap is $\max(0, \min(b,d)-\max(a,c))$']::text[], 'Compute each painter''s length and subtract the intersection of the two half-open intervals.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-distinct-numbers', 'Distinct Numbers', 'CSES', 'https://cses.fi/problemset/task/1621', 900, 'You are given a list of $n$ integers. Your task is to calculate the number of distinct values in the list.', 'The first line contains an integer $n$.

The second line contains $n$ integers $x_1,x_2,\dots,x_n$.', 'Print the number of distinct values.', '$1 \le n \le 2 \times 10^5$, $1 \le x_i \le 10^9$', '[{"input":"5\n2 3 2 2 3","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-distinct-numbers-a1', 'cses-distinct-numbers', 'Sort and unique', ARRAY['Ad-Hoc']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array','Ordered Set']::text[], ARRAY['Sort then count runs of equal values','A set / unordered set also works']::text[], 'Sort the array and count how many times consecutive values differ, or insert into a set and take its size.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('atc-dp-frog1', 'Frog 1', 'AtCoder', 'https://atcoder.jp/contests/dp/tasks/dp_a', 900, 'There are $N$ stones in a row. The height of stone $i$ is $h_i$. A frog starts on stone $1$ and wants stone $N$. From stone $i$ it may jump to $i+1$ or $i+2$, paying $|h_i - h_j|$. Find the minimum total cost.', 'The first line contains an integer $N$.

The second line contains $N$ integers $h_1,\dots,h_N$.', 'Print the minimum total cost to reach stone $N$.', '$2 \le N \le 10^5$', '[{"input":"4\n10 30 40 20","output":"30"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('atc-dp-frog1-a1', 'atc-dp-frog1', 'Linear DP', ARRAY['Dynamic Programming']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['$dp[i] = \min(dp[i-1]+|h_i-h_{i-1}|, dp[i-2]+|h_i-h_{i-2}|)$','Classic intro DP transition']::text[], 'Define $dp[i]$ as min cost to reach stone $i$. Transition from the previous one or two stones.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-range-sum-queries-i', 'Range Sum Queries I', 'CSES', 'https://cses.fi/problemset/task/1646', 900, 'Given an array of $n$ integers, process $q$ queries. Each query asks for the sum of values in range $[a,b]$ (1-indexed).', 'The first line contains two integers $n$ and $q$.

The second line contains $n$ integers $a_1,\dots,a_n$.

Then $q$ lines follow with queries $a\ b$ (1-indexed inclusive range).', 'For each query print the sum of values in range $[a,b]$.', '$1 \le n,q \le 2 \times 10^5$', '[{"input":"8 4\n3 2 4 5 1 1 5 3\n2 4\n5 6\n1 8\n3 3","output":"11\n2\n24\n4"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-range-sum-queries-i-a1', 'cses-range-sum-queries-i', 'Prefix sums', ARRAY['Ad-Hoc']::text[], ARRAY['Prefix Sums']::text[], ARRAY['1D Array']::text[], ARRAY['Static range sum ⇒ prefix array','Answer is $\textit{pref}[b]-\textit{pref}[a-1]$']::text[], 'Build prefix sums once in $O(n)$, then each query is $O(1)$. No Fenwick/segment tree needed because there are no updates.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1a', 'Theatre Square', 'Codeforces', 'https://codeforces.com/problemset/problem/1/A', 1000, 'Theatre Square is an $n \times m$ rectangle. Flagstones are $a \times a$. How many flagstones are needed to pave the square? Flagstones may extend past the border and cannot be broken.', 'The only input line contains three integers $n$, $m$, and $a$.', 'Print the minimum number of flagstones needed.', '$1 \le n,m,a \le 10^9$', '[{"input":"6 6 4","output":"4"}]'::jsonb, 'O(1)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1a-a1', 'cf-1a', 'Ceiling division', ARRAY['Math / Number Theory']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Answer is $\lceil n/a \rceil \cdot \lceil m/a \rceil$','Use 64-bit integers for large products']::text[], 'Tiles along each side use ceiling division. Multiply the two counts with 64-bit arithmetic.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('atc-dp-frog2', 'Frog 2', 'AtCoder', 'https://atcoder.jp/contests/dp/tasks/dp_b', 1000, 'Same as Frog 1, but from stone $i$ the frog may jump to any of $i+1,\dots,i+K$ (within bounds), paying $|h_i-h_j|$. Minimize cost to reach stone $N$.', 'The first line contains two integers $N$ and $K$.

The second line contains $N$ integers $h_1,\dots,h_N$.', 'Print the minimum total cost to reach stone $N$.', '$2 \le N \le 10^5$, $1 \le K \le 100$', '[{"input":"5 3\n10 30 40 50 20","output":"30"}]'::jsonb, 'O(N · X)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('atc-dp-frog2-a1', 'atc-dp-frog2', 'DP with K previous states', ARRAY['Dynamic Programming']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['$dp[i] = \min_{1 \le j \le K} dp[i-j] + |h_i-h_{i-j}|$','Generalizes Frog 1 ($K=2$)']::text[], 'For each stone, try all jumps of length $1..K$ from earlier stones. $O(NK)$ is fine under the constraints.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-apartments', 'Apartments', 'CSES', 'https://cses.fi/problemset/task/1084', 1100, 'There are $n$ applicants and $m$ apartments. Each applicant has a desired size $a_i$, and will accept an apartment of size in $[a_i-k, a_i+k]$. Assign apartments to maximize matches.', 'The first line contains three integers $n$, $m$, and $k$.

The second line contains $n$ integers $a_1,\dots,a_n$ (desired sizes).

The third line contains $m$ integers $b_1,\dots,b_m$ (apartment sizes).', 'Print one integer: the maximum number of applicants who get an apartment.', '$1 \le n,m \le 2 \times 10^5$, $0 \le k \le 10^9$', '[{"input":"4 3 5\n60 45 80 60\n30 60 75","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-apartments-a1', 'cses-apartments', 'Sort + two pointers', ARRAY['Greedy','Two Pointers']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Sort both arrays','Greedily assign smallest feasible apartment']::text[], 'Sort applicants and apartments. Walk with two pointers, always assigning the smallest apartment that still fits.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-ferris-wheel', 'Ferris Wheel', 'CSES', 'https://cses.fi/problemset/task/1090', 1100, 'There are $n$ children with weights $w_i$. A gondola holds at most two children and total weight at most $x$. Minimize the number of gondolas.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ integers $w_1,\dots,w_n$.', 'Print the minimum number of gondolas.', '$1 \le n \le 2 \times 10^5$, $1 \le x \le 10^9$', '[{"input":"4 10\n7 2 3 9","output":"3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-ferris-wheel-a1', 'cses-ferris-wheel', 'Greedy lightest+heaviest', ARRAY['Greedy','Two Pointers']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Sort by weight','Pair lightest remaining with heaviest if they fit']::text[], 'Sort weights. Use two pointers from both ends: pair if sum $\le x$, else the heavy child rides alone.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-706b', 'Interesting drink', 'Codeforces', 'https://codeforces.com/problemset/problem/706/B', 1100, 'Shop prices are $x_i$. For each query budget $m_j$, how many shops can Vasiliy afford?', 'The first line contains an integer $n$.

The second line contains $n$ integers: shop prices.

The third line contains an integer $q$.

Then $q$ lines follow with Vasiliy''s money on each day.', 'For each day print how many shops he can afford.', '$1 \le n,q \le 10^5$', '[{"input":"5\n3 10 8 6 11\n4\n1\n10\n3\n11","output":"0\n4\n1\n5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-706b-a1', 'cf-706b', 'Sort + upper_bound', ARRAY['Binary Search on Answer']::text[], ARRAY['Binary Search','Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Sort prices once','Each query is upper_bound on budget']::text[], 'Sort the price array. For each query, binary search the first price $> m_j$; the index is the answer.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-sum-of-two-values', 'Sum of Two Values', 'CSES', 'https://cses.fi/problemset/task/1640', 1100, 'Given $n$ numbers and target $x$, find two distinct indices whose values sum to $x$.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ integers $a_1,\dots,a_n$.', 'Print any two positions whose values sum to $x$, or `IMPOSSIBLE`.', '$1 \le n \le 2 \times 10^5$', '[{"input":"4 8\n2 7 5 1","output":"2 4"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-sum-of-two-values-a1', 'cses-sum-of-two-values', 'Hash map of complements', ARRAY['Ad-Hoc']::text[], ARRAY['Sorting']::text[], ARRAY['Hash Map']::text[], ARRAY['Store value → index while scanning','Look up x - a_i']::text[], 'One pass with a hash map from value to index. For each $a_i$, check if $x-a_i$ was seen.');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-sum-of-two-values-a2', 'cses-sum-of-two-values', 'Sort + two pointers', ARRAY['Two Pointers']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Keep original indices when sorting','Move left/right based on sum vs x']::text[], 'Sort pairs $(value, index)$ and use two pointers to find a pair summing to $x$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-movie-festival', 'Movie Festival', 'CSES', 'https://cses.fi/problemset/task/1629', 1100, 'In a movie festival, $n$ movies will be shown. You know the starting and ending time of each movie. What is the maximum number of movies you can watch entirely? You can watch a movie only if its start is $\ge$ the previous movie''s end.', 'The first line contains an integer $n$.

Then $n$ lines follow, each with two integers $a$ and $b$: the start and end time of a movie.', 'Print the maximum number of movies you can watch entirely.', '$1 \le n \le 2 \times 10^5$', '[{"input":"3\n3 5\n4 9\n5 8","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-movie-festival-a1', 'cses-movie-festival', 'Sort by ending time', ARRAY['Greedy']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Sort by end time instead of start time','Always take the next movie that finishes earliest among feasible ones']::text[], 'Classic activity selection: sort intervals by ending time and greedily pick the next compatible movie.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-restaurant-customers', 'Restaurant Customers', 'CSES', 'https://cses.fi/problemset/task/1619', 1100, 'You are given the arrival and leaving times of $n$ customers in a restaurant. What was the maximum number of customers simultaneously present?', 'The first line contains an integer $n$.

Then $n$ lines follow, each with two integers $a$ and $b$: arrival and leaving times.', 'Print the maximum number of customers present at the same time.', '$1 \le n \le 2 \times 10^5$', '[{"input":"3\n5 8\n2 4\n3 9","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-restaurant-customers-a1', 'cses-restaurant-customers', 'Sweep line events', ARRAY['Greedy','Ad-Hoc']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Turn each customer into +1 at arrival and -1 at departure','Process events in time order; track running sum']::text[], 'Create $2n$ events (arrive / leave), sort by time (leave before arrive on ties if needed), and scan while maintaining the current occupancy.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-dice-combinations', 'Dice Combinations', 'CSES', 'https://cses.fi/problemset/task/1633', 1100, 'Your task is to count the number of ways to construct sum $n$ by throwing a dice one or more times. Each throw gives an integer between $1$ and $6$. Order matters. Print the answer modulo $10^9+7$.', 'The only input line contains an integer $n$.', 'Print the number of ways to construct sum $n$, modulo $10^9+7$.', '$1 \le n \le 10^6$', '[{"input":"3","output":"4"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-dice-combinations-a1', 'cses-dice-combinations', '1D DP recurrence', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['$dp[x] = \sum_{f=1}^{6} dp[x-f]$','Order of throws matters so this is permutations, not combinations']::text[], 'Let $dp[x]$ be ways to form sum $x$. Transition by the last face. Base $dp[0]=1$. Compute up to $n$ modulo $10^9+7$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-removing-digits', 'Removing Digits', 'CSES', 'https://cses.fi/problemset/task/1637', 1100, 'You are given an integer $n$. On each step you may subtract one of the digits of the current number. How many steps are needed to go from $n$ down to $0$?', 'The only input line contains an integer $n$.', 'Print the minimum number of steps to reach $0$.', '$1 \le n \le 10^6$', '[{"input":"27","output":"5"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-removing-digits-a1', 'cses-removing-digits', 'DP over values', ARRAY['Dynamic Programming']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['$dp[x] = 1 + \min_{\text{digit } d \text{ of } x} dp[x-d]$','Greedy always subtract largest digit is not always optimal to prove casually — DP is safe']::text[], 'Compute $dp[0..n]$ bottom-up. For each $x$, try subtracting each digit appearing in the decimal representation of $x$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1360c', 'Similar Pairs', 'Codeforces', 'https://codeforces.com/problemset/problem/1360/C', 1200, 'You are given an array of $n$ distinct integers. Pair them into $n/2$ pairs such that each pair consists of two numbers of the same parity, or two numbers differing by $1$.', 'The first line contains an integer $t$ (test cases).

Each test case: an integer $n$, then a line with $n$ integers.', 'For each test case print `YES` or `NO`.', '$2 \le n \le 50$, $n$ even; $T$ test cases', '[{"input":"1\n4\n1 5 3 4","output":"YES"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1360c-a1', 'cf-1360c', 'Parity counts + adjacent check', ARRAY['Greedy','Ad-Hoc','Math / Number Theory']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Even counts of odd and even → always yes','Otherwise need one pair with difference 1']::text[], 'If both parity counts are even, pair within parity. Else sort and check for a consecutive pair with difference 1.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-489b', 'BerSU Ball', 'Codeforces', 'https://codeforces.com/problemset/problem/489/B', 1200, 'Pair boys and girls so that skill difference is at most $1$. Maximize the number of pairs.', 'The first line contains $n$, then a line with $n$ boy skills.

Then $m$, then a line with $m$ girl skills.', 'Print the maximum number of pairs.', '$1 \le n,m \le 100$', '[{"input":"4\n1 4 6 2\n5\n5 1 5 7 9","output":"3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-489b-a1', 'cf-489b', 'Sort + greedy two pointers', ARRAY['Greedy','Two Pointers']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Sort both skill arrays','Greedily match closest feasible partners']::text[], 'Sort both arrays and scan with two pointers, pairing when $|a-b|\le 1$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-maximum-subarray-sum', 'Maximum Subarray Sum', 'CSES', 'https://cses.fi/problemset/task/1643', 1200, 'Given an array of $n$ integers, find a contiguous subarray with the maximum possible sum.', 'The first line contains an integer $n$.

The second line contains $n$ integers $a_1,\dots,a_n$.', 'Print the maximum subarray sum.', '$1 \le n \le 2 \times 10^5$', '[{"input":"8\n-1 3 -2 5 3 -5 2 2","output":"9"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-maximum-subarray-sum-a1', 'cses-maximum-subarray-sum', 'Kadane', ARRAY['Dynamic Programming','Greedy']::text[], ARRAY['Prefix Sums']::text[], ARRAY['1D Array']::text[], ARRAY['Track best ending here vs restart','Handle all-negative arrays carefully']::text[], 'Kadane: maintain current sum, reset when negative (or keep running max for the all-negative case).');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-stick-lengths', 'Stick Lengths', 'CSES', 'https://cses.fi/problemset/task/1074', 1200, 'You have $n$ sticks with lengths $p_i$. Change any stick to any positive length; cost is the absolute difference. Minimize total cost to make all sticks equal.', 'The first line contains an integer $n$.

The second line contains $n$ integers $p_1,\dots,p_n$.', 'Print the minimum total cost to make all sticks equal.', '$1 \le n \le 2 \times 10^5$', '[{"input":"5\n2 3 1 5 2","output":"5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-stick-lengths-a1', 'cses-stick-lengths', 'Median target', ARRAY['Greedy','Math / Number Theory']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Optimal equal length is the median','Mean is wrong for L1 absolute cost']::text[], 'Sort and set every stick to the median length; sum absolute deviations.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-message-route', 'Message Route', 'CSES', 'https://cses.fi/problemset/task/1667', 1200, 'Syrjälä''s network has $n$ computers and $m$ connections. What is the minimum number of computers on a route from computer $1$ to computer $n$? Also reconstruct one such route.', 'The first line contains two integers $n$ and $m$: the number of computers and connections.

Then $m$ lines follow, each with two integers $a$ and $b$: an undirected connection.', 'If a route exists, print two lines: the number of computers on the shortest route, then the computers on one such route from $1$ to $n$. Otherwise print `IMPOSSIBLE`.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"5 5\n1 2\n1 3\n1 4\n2 3\n5 4","output":"3\n1 4 5"}]'::jsonb, 'O(N + M)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-message-route-a1', 'cses-message-route', 'BFS + parent pointers', ARRAY['Graph Algorithms']::text[], ARRAY['BFS']::text[], ARRAY['Queue','Adjacency List']::text[], ARRAY['Unweighted shortest path → BFS','Store parent[v] to reconstruct the path']::text[], 'Run BFS from $1$. If $n$ is reached, walk parents back to $1$ and reverse the path. Otherwise print IMPOSSIBLE.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('atc-dp-knapsack1', 'Knapsack 1', 'AtCoder', 'https://atcoder.jp/contests/dp/tasks/dp_d', 1200, 'There are $N$ items with weight $w_i$ and value $v_i$. Choose a subset with total weight $\le W$ maximizing total value. Each item at most once.', 'The first line contains two integers $N$ and $W$.

Then $N$ lines follow with $w_i$ and $v_i$.', 'Print the maximum total value with weight at most $W$.', '$1 \le N \le 100$, $1 \le W \le 10^5$', '[{"input":"3 8\n3 30\n4 50\n5 60","output":"90"}]'::jsonb, 'O(N · W)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('atc-dp-knapsack1-a1', 'atc-dp-knapsack1', '0/1 knapsack DP', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['State is (item index, remaining capacity) or rolling 1D weight','Iterate weights backwards to save space']::text[], 'Standard 0/1 knapsack. $dp[w] = \max(dp[w], dp[w-w_i]+v_i)$ processed per item from high $w$ to low.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-towers', 'Towers', 'CSES', 'https://cses.fi/problemset/task/1073', 1200, 'You are given $n$ cubes in order. Process them one by one: place each cube on top of a tower so that it sits on a strictly larger cube, or start a new tower. What is the minimum number of towers?', 'The first line contains an integer $n$.

The second line contains $n$ integers: the cube sizes in processing order.', 'Print the minimum number of towers.', '$1 \le n \le 2 \times 10^5$', '[{"input":"5\n3 8 2 1 5","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-towers-a1', 'cses-towers', 'Multiset of tops / patience sorting', ARRAY['Greedy']::text[], ARRAY['Binary Search','LIS']::text[], ARRAY['Ordered Set']::text[], ARRAY['Always place on the tower with the smallest top that is still $> cube$','Equivalent to length of longest non-decreasing subsequence intuition']::text[], 'Maintain the sorted tops of towers in a multiset. For each cube, upper_bound the first top strictly greater and replace it; else create a new tower.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-subarray-sums-i', 'Subarray Sums I', 'CSES', 'https://cses.fi/problemset/task/1660', 1200, 'Given an array of $n$ positive integers, count the number of contiguous subarrays whose sum equals $x$.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ positive integers $a_1,\dots,a_n$.', 'Print the number of contiguous subarrays whose sum equals $x$.', '$1 \le n \le 2 \times 10^5$, $1 \le x \le 10^{18}$', '[{"input":"5 7\n2 4 1 2 7","output":"3"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-subarray-sums-i-a1', 'cses-subarray-sums-i', 'Two pointers on positive array', ARRAY['Two Pointers']::text[], ARRAY['Prefix Sums']::text[], ARRAY['1D Array']::text[], ARRAY['All $a_i > 0$ ⇒ window sum is monotone as right advances','Advance left while sum $> x$']::text[], 'Maintain a sliding window. Expand right; shrink left while the sum exceeds $x$; count when sum equals $x$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-collecting-numbers', 'Collecting Numbers', 'CSES', 'https://cses.fi/problemset/task/2216', 1300, 'You have an array that is a permutation of $1..n$. In one round you collect numbers in increasing order from left to right. How many rounds to collect all?', 'The first line contains an integer $n$.

The second line contains a permutation of $1\dots n$.', 'Print the number of rounds needed to collect the numbers in order.', '$1 \le n \le 2 \times 10^5$', '[{"input":"5\n4 2 1 5 3","output":"3"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-collecting-numbers-a1', 'cses-collecting-numbers', 'Position array + inversions of consecutive values', ARRAY['Ad-Hoc','Greedy']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Map each value to its index','Each time pos[x] > pos[x+1] starts a new round']::text[], 'Store positions of each number. Count how often $pos[i] > pos[i+1]$; rounds $= 1 +$ that count.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-550a', 'Two Substrings', 'Codeforces', 'https://codeforces.com/problemset/problem/550/A', 1300, 'You are given a string $s$. Check whether it contains two non-overlapping substrings "AB" and "BA" (in either order).', 'The only input line contains a string $s$ consisting of uppercase letters.', 'Print `YES` if $s$ contains non-overlapping `AB` and `BA` as substrings (in either order), otherwise `NO`.', '$1 \le |s| \le 10^5$', '[{"input":"ABA","output":"NO"},{"input":"BACFAB","output":"YES"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-550a-a1', 'cf-550a', 'First AB then BA (and swap)', ARRAY['String Algorithms','Greedy']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Find first AB then search BA after it','Also try first BA then AB — overlap traps like ABA']::text[], 'Scan for AB then BA after that index; repeat with roles reversed. Overlaps like ABA fail both orders.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-counting-rooms', 'Counting Rooms', 'CSES', 'https://cses.fi/problemset/task/1192', 1300, 'You are given an $n \times m$ map of floor (`.`) and wall (`#`). Count the number of rooms (4-connected floor components).', 'The first line contains two integers $n$ and $m$.

Then $n$ lines follow with the map (`#` wall, `.` floor).', 'Print the number of rooms.', '$1 \le n,m \le 1000$', '[{"input":"5 8\n########\n#..#...#\n####.#.#\n#..#...#\n########","output":"3"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-counting-rooms-a1', 'cses-counting-rooms', 'Grid flood fill', ARRAY['Graph Algorithms']::text[], ARRAY['DFS','BFS']::text[], ARRAY['2D Array','Queue']::text[], ARRAY['Each unvisited floor cell starts a new room','Flood fill marks the whole component']::text[], 'Iterate cells; on each unmarked `.`, increment the answer and DFS/BFS the component.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-minimizing-coins', 'Minimizing Coins', 'CSES', 'https://cses.fi/problemset/task/1634', 1300, 'Consider a money system with $n$ coins of values $c_1,\dots,c_n$. You want to form sum $x$ using as few coins as possible. Print the minimum number of coins, or $-1$ if impossible.', 'The first line contains two integers $n$ and $x$: the number of coins and the target sum.

The second line contains $n$ distinct coin values $c_1,\dots,c_n$.', 'Print the minimum number of coins, or $-1$ if it is impossible.', '$1 \le n \le 100$, $1 \le x \le 10^6$', '[{"input":"3 11\n1 5 7","output":"3"}]'::jsonb, 'O(N · X)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-minimizing-coins-a1', 'cses-minimizing-coins', 'Unbounded knapsack DP', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['$dp[s] = \min_c (dp[s-c]+1)$','Initialize unreachable states with a large sentinel']::text[], 'Classic unbounded knapsack for coin change (min coins). Fill a 1D array of size $x+1$ updating with each coin value.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-grid-paths-dp', 'Grid Paths', 'CSES', 'https://cses.fi/problemset/task/1638', 1300, 'Consider an $n \times n$ grid with some trapped squares `*`. Count paths from the top-left to the bottom-right moving only right or down, avoiding traps. Print modulo $10^9+7$.', 'The first line contains an integer $n$.

Then $n$ lines follow, each with $n$ characters: `.` is free and `*` is trapped.', 'Print the number of paths from the top-left to the bottom-right, modulo $10^9+7$.', '$1 \le n \le 1000$', '[{"input":"4\n....\n.*..\n...*\n*...","output":"3"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-grid-paths-dp-a1', 'cses-grid-paths-dp', 'Grid DP', ARRAY['Dynamic Programming']::text[], ARRAY[]::text[], ARRAY['2D Array']::text[], ARRAY['$dp[i][j] = dp[i-1][j] + dp[i][j-1]$ if free','Trapped cells contribute $0$']::text[], 'Standard path-counting DP on a grid with blocked cells. Initialize start to $1$ if free.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-labyrinth', 'Labyrinth', 'CSES', 'https://cses.fi/problemset/task/1193', 1300, 'You are given a map of a labyrinth with walls `#`, floor `.`, start `A`, and end `B`. Find the shortest path from A to B moving up/down/left/right, and print the sequence of moves.', 'The first line contains two integers $n$ and $m$.

Then $n$ lines follow describing the map: `#` wall, `.` floor, `A` start, `B` end.', 'If a path exists, print `YES`, then the length, then a string of moves using `U`,`D`,`L`,`R`. Otherwise print `NO`.', '$1 \le n,m \le 1000$', '[{"input":"5 8\n########\n#.A#...#\n#.##.#B#\n#......#\n########","output":"YES\n9\nLDDRRRRDD"}]'::jsonb, 'O(N · M)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-labyrinth-a1', 'cses-labyrinth', 'Grid BFS', ARRAY['Graph Algorithms']::text[], ARRAY['BFS']::text[], ARRAY['Queue','2D Array']::text[], ARRAY['Treat the grid as an unweighted graph','Store previous move / parent cell for reconstruction']::text[], 'BFS from A on the grid graph. Keep a parent direction for each cell and reconstruct the path when B is found.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-tasks-and-deadlines', 'Tasks and Deadlines', 'CSES', 'https://cses.fi/problemset/task/1630', 1300, 'You have $n$ tasks. Task $i$ takes $a_i$ time units and has deadline $d_i$. You start at time $0$ and do tasks sequentially. Reward for finishing a task at time $f$ is $d_i - f$. Maximize the total reward.', 'The first line contains an integer $n$.

Then $n$ lines follow, each with two integers $a_i$ and $d_i$: duration and deadline.', 'Print the maximum total reward.', '$1 \le n \le 2 \times 10^5$', '[{"input":"3\n6 10\n8 15\n5 12","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-tasks-and-deadlines-a1', 'cses-tasks-and-deadlines', 'Sort by duration', ARRAY['Greedy']::text[], ARRAY['Sorting']::text[], ARRAY['1D Array']::text[], ARRAY['Optimal order is increasing duration $a_i$ (independent of deadlines)','Total reward $= \sum d_i - \sum$ finish times under that order']::text[], 'Sort tasks by increasing processing time and simulate. Deadlines only affect the constant $\sum d_i$; finish times are minimized by shortest-job-first.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-playlist', 'Playlist', 'CSES', 'https://cses.fi/problemset/task/1141', 1400, 'You are given a playlist of $n$ songs. Find the longest contiguous segment of songs where each song appears at most once.', 'The first line contains an integer $n$.

The second line contains $n$ integers: the song ids.', 'Print the maximum length of a contiguous segment with distinct songs.', '$1 \le n \le 2 \times 10^5$', '[{"input":"8\n1 2 1 3 2 7 4 2","output":"5"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-playlist-a1', 'cses-playlist', 'Sliding window + set', ARRAY['Two Pointers']::text[], ARRAY['Sorting']::text[], ARRAY['Hash Map','Ordered Set']::text[], ARRAY['Maintain a window of unique songs','Move left pointer when duplicate appears']::text[], 'Two pointers with a map/set of song indices. Expand right; when a duplicate appears, jump left past the previous occurrence.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-subordinates', 'Subordinates', 'CSES', 'https://cses.fi/problemset/task/1674', 1400, 'A company hierarchy is a tree rooted at $1$. For each employee, compute how many subordinates they have (direct or indirect).', 'The first line contains an integer $n$.

The second line contains $n-1$ integers: the boss of each employee $2\dots n$.', 'Print $n$ integers: for each employee, the number of subordinates.', '$1 \le n \le 2 \times 10^5$', '[{"input":"5\n1 1 2 2","output":"4 1 0 0 0"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-subordinates-a1', 'cses-subordinates', 'Tree DP / DFS sizes', ARRAY['Dynamic Programming','Graph Algorithms']::text[], ARRAY['DFS']::text[], ARRAY['Adjacency List']::text[], ARRAY['Subtree size minus one equals subordinates','DFS post-order']::text[], 'Build the tree and DFS: $size[u] = 1 + \sum size[child]$. Answer for $u$ is $size[u]-1$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-factory-machines', 'Factory Machines', 'CSES', 'https://cses.fi/problemset/task/1620', 1400, 'You have $n$ machines; machine $i$ produces one product every $t_i$ time units. What is the minimum time to produce $t$ products?', 'The first line contains two integers $n$ and $t$.

The second line contains $n$ integers: machine times.', 'Print the minimum time to produce $t$ products.', '$1 \le n \le 2 \times 10^5$, $1 \le t \le 10^9$', '[{"input":"3 7\n3 2 5","output":"8"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-factory-machines-a1', 'cses-factory-machines', 'Binary search on time', ARRAY['Binary Search on Answer','Greedy']::text[], ARRAY['Binary Search']::text[], ARRAY['1D Array']::text[], ARRAY['Monotonic feasibility in time','Count products as sum floor(mid / t_i) carefully vs overflow']::text[], 'Binary search the finishing time. A candidate mid is feasible if $\sum \lfloor mid / t_i \rfloor \ge t$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-building-teams', 'Building Teams', 'CSES', 'https://cses.fi/problemset/task/1668', 1400, 'There are $n$ pupils and $m$ friendships. Assign each pupil to team 1 or 2 so that friends are always on different teams, or report impossibility.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with friendships.', 'Print a valid team assignment of $n$ integers (`1` or `2`), or `IMPOSSIBLE`.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"5 3\n1 2\n1 3\n4 5","output":"1 2 2 1 2"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-building-teams-a1', 'cses-building-teams', 'Bipartite coloring BFS/DFS', ARRAY['Graph Algorithms']::text[], ARRAY['BFS','DFS']::text[], ARRAY['Adjacency List','Queue']::text[], ARRAY['Color connected components with 2 colors','Odd cycle ⇒ impossible']::text[], 'Check bipartiteness of the friendship graph; assign teams by the two color classes.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-coin-combinations-ii', 'Coin Combinations II', 'CSES', 'https://cses.fi/problemset/task/1636', 1400, 'Consider a money system with $n$ coins. Count the number of ordered-by-coin-type combinations that produce sum $x$ (order of coins does not create new combinations). Print modulo $10^9+7$.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ coin values $c_1,\dots,c_n$.', 'Print the number of ordered combinations (by coin type) that sum to $x$, modulo $10^9+7$.', '$1 \le n \le 100$, $1 \le x \le 10^6$', '[{"input":"3 9\n2 3 5","output":"3"}]'::jsonb, 'O(N · X)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-coin-combinations-ii-a1', 'cses-coin-combinations-ii', 'Outer loop over coins', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['Loop coins outside sums to count combinations (not permutations)','Contrast with Coin Combinations I where order matters']::text[], 'Use unbounded knapsack with the coin loop outside the sum loop so each multiset is counted once.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-book-shop', 'Book Shop', 'CSES', 'https://cses.fi/problemset/task/1158', 1400, 'You have $n$ books. The $i$-th book costs $h_i$ and has $s_i$ pages. You can buy each book at most once and have budget $x$. Maximize the total number of pages.', 'The first line contains two integers $n$ and $x$: the number of books and the maximum total price.

The second line contains $n$ integers $h_1,\dots,h_n$ (prices).

The third line contains $n$ integers $s_1,\dots,s_n$ (pages).', 'Print the maximum number of pages you can buy.', '$1 \le n \le 1000$, $1 \le x \le 10^5$', '[{"input":"4 10\n4 8 5 3\n5 12 8 1","output":"13"}]'::jsonb, 'O(N · X)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-book-shop-a1', 'cses-book-shop', '0/1 knapsack', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['Each book is taken at most once → 0/1 knapsack','Iterate weights backwards to save space']::text[], 'Standard 0/1 knapsack with capacity $x$, value = pages, weight = price. Use a rolling 1D DP updating from high capacity to low.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-round-trip', 'Round Trip', 'CSES', 'https://cses.fi/problemset/task/1669', 1400, 'Given an undirected graph, find any cycle of length at least $4$ (a path that starts and ends at the same city and visits at least two other cities). Print the cycle or IMPOSSIBLE.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow, each with two integers $a$ and $b$: an undirected road.', 'If a cycle of length at least $3$ exists, print its length, then the cities on the cycle (starting and ending at the same city). Otherwise print `IMPOSSIBLE`.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"5 6\n1 3\n1 2\n5 3\n1 5\n2 4\n4 5","output":"4\n3 5 1 3"}]'::jsonb, 'O(N + M)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-round-trip-a1', 'cses-round-trip', 'DFS cycle detection', ARRAY['Graph Algorithms']::text[], ARRAY['DFS']::text[], ARRAY['Adjacency List','1D Array']::text[], ARRAY['On finding a back edge to a non-parent ancestor, a cycle exists','Reconstruct using the recursion stack / parent array']::text[], 'DFS the undirected graph. When you see an edge to an already-visited non-parent node, recover the cycle along parents.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-tree-diameter', 'Tree Diameter', 'CSES', 'https://cses.fi/problemset/task/1131', 1400, 'You are given a tree of $n$ nodes. Find the diameter: the maximum number of edges on any path.', 'The first line contains an integer $n$.

Then $n-1$ lines follow describing the tree edges.', 'Print the diameter (maximum number of edges on any path).', '$1 \le n \le 2 \times 10^5$', '[{"input":"5\n1 2\n1 3\n3 4\n3 5","output":"3"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-tree-diameter-a1', 'cses-tree-diameter', 'Two BFS / DFS sweeps', ARRAY['Graph Algorithms']::text[], ARRAY['BFS','DFS']::text[], ARRAY['Adjacency List']::text[], ARRAY['Diameter endpoints: farthest from an arbitrary node, then farthest from that','Works specifically because the graph is a tree']::text[], 'From any node find the farthest node $u$. From $u$ find the farthest node $v$. Distance $u$–$v$ is the diameter.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-279b', 'Books', 'Codeforces', 'https://codeforces.com/problemset/problem/279/B', 1400, 'You have $n$ books in a row; book $i$ takes $a_i$ minutes. You have $t$ free minutes and must read a contiguous segment. What is the maximum number of books you can finish?', 'The first line contains two integers $n$ and $t$.

The second line contains $n$ integers $a_i$ (minutes per book).', 'Print the maximum number of books in a contiguous segment readable in at most $t$ minutes.', '$1 \le n \le 10^5$, $1 \le t \le 10^9$', '[{"input":"4 5\n3 1 2 1","output":"3"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-279b-a1', 'cf-279b', 'Two pointers / sliding window', ARRAY['Two Pointers']::text[], ARRAY['Prefix Sums']::text[], ARRAY['1D Array']::text[], ARRAY['Maintain a window with sum $\le t$','Expand right, shrink left when sum exceeds $t$']::text[], 'Sliding window over the contiguous segment. Advance the right endpoint and move left until the sum fits in $t$; track max length.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-string-matching', 'String Matching', 'CSES', 'https://cses.fi/problemset/task/1753', 1400, 'Given a string $s$ and a pattern $p$, count how many times $p$ occurs in $s$ as a contiguous substring.', 'The first line contains the string $s$.

The second line contains the pattern $p$.', 'Print the number of occurrences of $p$ in $s$.', '$1 \le |s|,|p| \le 10^6$', '[{"input":"saippuakauppias\npp","output":"2"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-string-matching-a1', 'cses-string-matching', 'KMP / Z-algorithm', ARRAY['String Algorithms']::text[], ARRAY['KMP']::text[], ARRAY['1D Array']::text[], ARRAY['Build the prefix-function (pi) of $p + \# + s$','Count positions where $\pi[i] = |p|$']::text[], 'Use KMP: concatenate pattern, separator, and text; every place the prefix function equals $|p|$ is an occurrence. Z-algorithm works similarly.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('demo-maja', 'Maja', 'Other', null, 1400, 'Bees live on a hexagonal hive. **Maja** uses axial coordinates $(x,y)$. **Willi** numbers cells in a clockwise spiral starting at $1$ in the center.

![Hex hive coordinate systems](asset:hex-hive)

For each Willi number ($< 10^5$), print Maja''s coordinates.

Sample: $1 \mapsto (0,0)$, $2 \mapsto (0,1)$, $3 \mapsto (-1,1)$, $4 \mapsto (-1,0)$, $5 \mapsto (0,-1)$.', 'Input contains one or more integers (Willi''s honeycomb numbers), each on its own line.', 'For each number print the corresponding Maja coordinates $x\ y$ on its own line.', 'Each query $< 10^5$', '[{"input":"1\n2\n3\n4\n5","output":"0 0\n0 1\n-1 1\n-1 0\n0 -1"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('demo-maja-a1', 'demo-maja', 'Hex spiral walk', ARRAY['Math / Number Theory','Ad-Hoc']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['Hex grid has 6 directions; ring $r$ has $6r$ cells','Simulate spiral from center or closed-form ring + offset','Match the sample orientation carefully (clockwise vs CCW)']::text[], 'Find which ring contains Willi''s id, then walk the six sides of that hex ring to recover axial $(x,y)$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1194', 'D', 'CSES', 'https://cses.fi/problemset/task/1194', 1400, 'You and some monsters are in a labyrinth. When taking a step to some direction in the labyrinth, each monster may simultaneously take one as well. Your goal is to reach one of the boundary squares without ever sharing a square with a monster.

Your task is to find out if your goal is possible, and if it is, print a path that you can follow. Your plan has to work in any situation; even if the monsters know your path beforehand.

Input

The first input line has two integers $ n $ and $ m $: the height and width of the map.

After this there are $ n $ lines of $ m $ characters describing the map. Each character is . (floor), # (wall), A (start), or M (monster). There is exactly one A in the input.

Output

First print "YES" if your goal is possible, and "NO" otherwise.

If your goal is possible, also print an example of a valid path (the length of the path and its description using characters D, U, L, and R). You can print any path, as long as its length is at most $ n \cdot m $ steps.

Constraints

- $ 1 \le n,m \le 1000 $

Example

    Input
    Output

    5 8
########
#M..A..#
#.#.M#.#
#M#..#..
#.######

    YES
5
RRDDR', 'See statement.', 'See statement.', '- $ 1 \le n,m \le 1000 $', '[{"input":"The first input line has two integers $ n $ and $ m $: the height and width of the map.\n\nAfter this there are $ n $ lines of $ m $ characters describing the map. Each character is . (floor), # (wall), A (start), or M (monster). There is exactly one A in the input.","output":"First print \"YES\" if your goal is possible, and \"NO\" otherwise."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1194-a1', 'cses-1194', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1194']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1681', 'E', 'CSES', 'https://cses.fi/problemset/task/1681', 1400, 'A game has $ n $ levels, connected by $ m $ teleporters, and your task is to get from level $ 1 $ to level $ n $. The game has been designed so that there are no directed cycles in the underlying graph. In how many ways can you complete the game?

Input

The first input line has two integers $ n $ and $ m $: the number of levels and teleporters. The levels are numbered $ 1,2,\dots,n $.

After this, there are $ m $ lines describing the teleporters. Each line has two integers $ a $ and $ b $: there is a teleporter from level $ a $ to level $ b $.

Output

Print one integer: the number of ways you can complete the game. Since the result may be large, print it modulo $ 10^9+7 $.

Constraints

- $ 1 \le n \le 10^5 $

- $ 1 \le m \le 2 \cdot 10^5 $

- $ 1 \le a,b \le n $

Example

    Input
    Output

    4 5
1 2
2 4
1 3
3 4
1 4

    3', 'See statement.', 'See statement.', '- $ 1 \le n \le 10^5 $', '[{"input":"The first input line has two integers $ n $ and $ m $: the number of levels and teleporters. The levels are numbered $ 1,2,\\dots,n $.\n\nAfter this, there are $ m $ lines describing the teleporters. Each line has two integers $ a $ and $ b $: there is a teleporter from level $ a $ to level $ b $.","output":"Print one integer: the number of ways you can complete the game. Since the result may be large, print it modulo $ 10^9+7 $."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1681-a1', 'cses-1681', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1681']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1666', 'Trilhas de capivara', 'CSES', 'https://cses.fi/problemset/task/1666', 1400, 'Byteland has $ n $ cities, and $ m $ roads between them. The goal is to construct new roads so that there is a route between any two cities.

Your task is to find out the minimum number of roads required, and also determine which roads should be built.

Input

The first input line has two integers $ n $ and $ m $: the number of cities and roads. The cities are numbered $ 1,2,\dots,n $.

After that, there are $ m $ lines describing the roads. Each line has two integers $ a $ and $ b $: there is a road between those cities.

A road always connects two different cities, and there is at most one road between any two cities.

Output

First print an integer $ k $: the number of required roads.

Then, print $ k $ lines that describe the new roads. You can print any valid solution.

Constraints

- $ 1 \le n \le 10^5 $

- $ 1 \le m \le 2 \cdot 10^5 $

- $ 1 \le a,b \le n $

Example

    Input
    Output

    4 2
1 2
3 4

    1
2 3', 'See statement.', 'See statement.', '- $ 1 \le n \le 10^5 $', '[{"input":"The first input line has two integers $ n $ and $ m $: the number of cities and roads. The cities are numbered $ 1,2,\\dots,n $.\n\nAfter that, there are $ m $ lines describing the roads. Each line has two integers $ a $ and $ b $: there is a road between those cities.\n\nA road always connects two different cities, and there is at most one road between any two cities.","output":"First print an integer $ k $: the number of required roads."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1666-a1', 'cses-1666', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1666']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1623', 'Apple Division', 'CSES', 'https://cses.fi/problemset/task/1623', 1400, 'There are $ n $ apples with known weights. Your task is to divide the apples into two groups so that the difference between the weights of the groups is minimal.

Input

The first input line has an integer $ n $: the number of apples.

The next line has $ n $ integers $ p_1,p_2,\dots,p_n $: the weight of each apple.

Output

Print one integer: the minimum difference between the weights of the groups.

Constraints

- $ 1 \le n \le 20 $

- $ 1 \le p_i \le 10^9 $

Example

    Input
    Output

    5
3 2 7 4 1

    1

Explanation: Group 1 has weights 2, 3 and 4 (total weight 9), and group 2 has weights 1 and 7 (total weight 8).', 'See statement.', 'See statement.', '- $ 1 \le n \le 20 $', '[{"input":"The first input line has an integer $ n $: the number of apples.\n\nThe next line has $ n $ integers $ p_1,p_2,\\dots,p_n $: the weight of each apple.","output":"Print one integer: the minimum difference between the weights of the groups."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1623-a1', 'cses-1623', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1623']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1622', 'Creating Strings', 'CSES', 'https://cses.fi/problemset/task/1622', 1400, 'Given a string, your task is to generate all different strings that can be created using its characters.

Input

The only input line has a string of length $ n $. Each character is between a–z.

Output

First print an integer $ k $: the number of strings. Then print $ k $ lines: the strings in alphabetical order.

Constraints

- $ 1 \le n \le 8 $

Example

    Input
    Output

    aabac

    20
aaabc
aaacb
aabac
aabca
aacab
aacba
abaac
abaca
abcaa
acaab
acaba
acbaa
baaac
baaca
bacaa
bcaaa
caaab
caaba
cabaa
cbaaa', 'See statement.', 'See statement.', '- $ 1 \le n \le 8 $', '[{"input":"The only input line has a string of length $ n $. Each character is between a–z.","output":"First print an integer $ k $: the number of strings. Then print $ k $ lines: the strings in alphabetical order."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1622-a1', 'cses-1622', 'Pending editorial review', ARRAY['String Algorithms','Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1622']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-1680', 'Cidades e mais cidades', 'CSES', 'https://cses.fi/problemset/task/1680', 1400, 'Uolevi has won a contest, and the prize is a free flight trip that can consist of one or more flights through cities. Of course, Uolevi wants to choose a trip that has as many cities as possible.

Uolevi wants to fly from Syrjälä to Lehmälä so that he visits the maximum number of cities. You are given the list of possible flights, and you know that there are no directed cycles in the flight network.

Input

The first input line has two integers $ n $ and $ m $: the number of cities and flights. The cities are numbered $ 1,2,\dots,n $. City $ 1 $ is Syrjälä, and city $ n $ is Lehmälä.

After this, there are $ m $ lines describing the flights. Each line has two integers $ a $ and $ b $: there is a flight from city $ a $ to city $ b $. Each flight is a one-way flight.

Output

First print the maximum number of cities on the route. After this, print the cities in the order they will be visited. You can print any valid solution.

If there are no solutions, print "IMPOSSIBLE".

Constraints

- $ 2 \le n \le 10^5 $

- $ 1 \le m \le 2 \cdot 10^5 $

- $ 1 \le a,b \le n $

Example

    Input
    Output

    5 5
1 2
2 5
1 3
3 4
4 5

    4
1 3 4 5', 'See statement.', 'See statement.', '- $ 2 \le n \le 10^5 $', '[{"input":"The first input line has two integers $ n $ and $ m $: the number of cities and flights. The cities are numbered $ 1,2,\\dots,n $. City $ 1 $ is Syrjälä, and city $ n $ is Lehmälä.\n\nAfter this, there are $ m $ lines describing the flights. Each line has two integers $ a $ and $ b $: there is a flight from city $ a $ to city $ b $. Each flight is a one-way flight.","output":"First print the maximum number of cities on the route. After this, print the cities in the order they will be visited. You can print any valid solution."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-1680-a1', 'cses-1680', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CSES-1680']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-shortest-routes-i', 'Shortest Routes I', 'CSES', 'https://cses.fi/problemset/task/1671', 1500, 'A weighted directed graph with $n$ nodes and $m$ edges. Find the shortest path lengths from node $1$ to every node.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with directed flights $a\ b\ c$.', 'Print $n$ integers: distances from city $1$ to cities $1\dots n$.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$, weights positive', '[{"input":"3 4\n1 2 6\n1 3 2\n3 2 3\n1 3 4","output":"0 5 2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-shortest-routes-i-a1', 'cses-shortest-routes-i', 'Dijkstra from source 1', ARRAY['Graph Algorithms','Greedy']::text[], ARRAY['Dijkstra']::text[], ARRAY['Priority Queue','Adjacency List']::text[], ARRAY['Non-negative weights → Dijkstra','Use 64-bit distances']::text[], 'Run Dijkstra from node 1 with a binary heap. Store distances in 64-bit integers.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-coin-combinations-i', 'Coin Combinations I', 'CSES', 'https://cses.fi/problemset/task/1635', 1500, 'Given $n$ coin values and a target sum $x$, count the number of ordered ways to form $x$ modulo $10^9+7$.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ coin values.', 'Print the number of ordered ways to form sum $x$, modulo $10^9+7$.', '$1 \le n \le 100$, $1 \le x \le 10^6$', '[{"input":"3 9\n2 3 5","output":"8"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-coin-combinations-i-a1', 'cses-coin-combinations-i', 'Classic DP over sum', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['1D Array']::text[], ARRAY['dp[s] = sum of dp[s-c] over coins','Order of loops yields ordered combinations']::text[], 'Let $dp[s]$ be ways to make sum $s$. Iterate sums outer, coins inner for ordered ways.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-road-construction', 'Road Construction', 'CSES', 'https://cses.fi/problemset/task/1676', 1500, 'There are $n$ cities and no roads. Roads are added one by one. After each addition, output the number of components and the size of the largest component.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with roads added one by one.', 'After each road print two integers: the number of components and the size of the largest component.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"5 3\n1 2\n1 3\n4 5","output":"4 2\n3 3\n2 3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-road-construction-a1', 'cses-road-construction', 'DSU with sizes', ARRAY['Graph Algorithms']::text[], ARRAY['DSU']::text[], ARRAY['1D Array']::text[], ARRAY['Track component count and max size on unite','Union by size/rank']::text[], 'Process edges with DSU. On successful unite, decrement components and update max size.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-580c', 'Kefa and Park', 'Codeforces', 'https://codeforces.com/problemset/problem/580/C', 1500, 'A tree rooted at $1$. Some vertices have cats. Count leaf restaurants reachable from the root without encountering more than $m$ consecutive cats on the path.', 'The first line contains two integers $n$ and $m$.

The second line contains $n$ integers $0/1$ (cats).

Then $n-1$ edges of the tree follow.', 'Print the number of restaurants (leaves) reachable without more than $m$ consecutive cats.', '$2 \le n \le 10^5$', '[{"input":"4 1\n1 1 0 0\n1 2\n1 3\n1 4","output":"2"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-580c-a1', 'cf-580c', 'DFS with consecutive cat streak', ARRAY['Graph Algorithms']::text[], ARRAY['DFS']::text[], ARRAY['Adjacency List']::text[], ARRAY['Track consecutive cats along the path','Reset streak when a vertex has no cat']::text[], 'DFS/BFS from root carrying current consecutive-cat count. Count leaves where the constraint never failed.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-course-schedule', 'Course Schedule', 'CSES', 'https://cses.fi/problemset/task/1679', 1500, 'You want to complete $n$ courses. Requirements give directed edges $a \rightarrow b$ meaning $a$ before $b$. Find a valid order or determine impossibility.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with requirements $a\ b$ ($a$ before $b$).', 'Print a valid course order, or `IMPOSSIBLE`.', '$1 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"5 3\n1 2\n3 1\n4 5","output":"3 4 1 5 2"}]'::jsonb, 'O(N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-course-schedule-a1', 'cses-course-schedule', 'Topological sort (Kahn/DFS)', ARRAY['Graph Algorithms']::text[], ARRAY['Topological Sort','BFS','DFS']::text[], ARRAY['Queue','Adjacency List']::text[], ARRAY['Cycle ⇒ impossible','Kahn BFS using indegrees']::text[], 'Build the dependency graph and run topological sort. If fewer than $n$ nodes are ordered, a cycle exists.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-shortest-routes-ii', 'Shortest Routes II', 'CSES', 'https://cses.fi/problemset/task/1672', 1500, 'There are $n$ cities and $m$ flights with lengths. Process $q$ queries asking for the shortest distance between two cities (or $-1$ if unreachable).', 'The first line contains three integers $n$, $m$, and $q$.

Then $m$ lines follow with flight descriptions $a\ b\ c$ (from, to, length).

Then $q$ lines follow with queries $a\ b$.', 'For each query print the shortest distance, or $-1$ if unreachable.', '$1 \le n \le 500$, $1 \le m,q \le 10^5$', '[{"input":"4 3 3\n1 2 5\n1 3 9\n2 3 3\n1 2\n2 1\n1 4","output":"5\n5\n-1"}]'::jsonb, 'O(N³)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-shortest-routes-ii-a1', 'cses-shortest-routes-ii', 'Floyd-Warshall', ARRAY['Graph Algorithms']::text[], ARRAY['Floyd-Warshall']::text[], ARRAY['2D Array']::text[], ARRAY['n ≤ 500 ⇒ all-pairs Floyd fits','Take min over parallel edges before FW']::text[], 'Build an adjacency matrix with edge minima, run Floyd-Warshall, then answer each query in $O(1)$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-array-division', 'Array Division', 'CSES', 'https://cses.fi/problemset/task/1085', 1500, 'You are given an array of $n$ positive integers. Divide it into $k$ contiguous subarrays so that the maximum subarray sum is minimized. What is that minimum possible maximum?', 'The first line contains two integers $n$ and $k$.

The second line contains $n$ integers $x_1,\dots,x_n$.', 'Print the minimum possible maximum subarray sum.', '$1 \le n \le 2 \times 10^5$, $1 \le k \le n$', '[{"input":"5 3\n2 4 7 3 5","output":"8"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-array-division-a1', 'cses-array-division', 'Binary search on answer', ARRAY['Binary Search on Answer','Greedy']::text[], ARRAY['Binary Search']::text[], ARRAY['1D Array']::text[], ARRAY['Monotone predicate: can we split into $\le k$ parts with max sum $\le mid$?','Greedy scan adds a new part whenever sum would exceed mid']::text[], 'Binary search the maximum allowed sum. Feasibility is a left-to-right greedy that opens a new subarray whenever adding the next element would exceed the candidate.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-subarray-sums-ii', 'Subarray Sums II', 'CSES', 'https://cses.fi/problemset/task/1661', 1500, 'Given an array of $n$ integers (possibly negative), count contiguous subarrays whose sum equals $x$.', 'The first line contains two integers $n$ and $x$.

The second line contains $n$ integers $a_1,\dots,a_n$ (may be negative).', 'Print the number of contiguous subarrays whose sum equals $x$.', '$1 \le n \le 2 \times 10^5$', '[{"input":"5 7\n2 -1 3 5 -2","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-subarray-sums-ii-a1', 'cses-subarray-sums-ii', 'Prefix sums + hash map', ARRAY['Ad-Hoc']::text[], ARRAY['Prefix Sums']::text[], ARRAY['Hash Map']::text[], ARRAY['Subarray $(l,r]$ has sum $x$ iff $\textit{pref}[r]-\textit{pref}[l]=x$','Count previous prefixes equal to $\textit{pref}[r]-x$']::text[], 'Scan prefix sums left to right. Before adding the current prefix, query how many earlier prefixes equal $\textit{pref}-x$, then insert $\textit{pref}$ into the map (include $0$ initially).');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-range-update-queries', 'Range Update Queries', 'CSES', 'https://cses.fi/problemset/task/1651', 1500, 'You have an array of $n$ integers and $q$ operations: either increase every value in range $[a,b]$ by $u$, or print the value at position $k$.', 'The first line contains two integers $n$ and $q$.

The second line contains $n$ integers $a_1,\dots,a_n$.

Then $q$ lines follow. Type `1 a b u` adds $u$ to range $[a,b]$. Type `2 k` asks for the value at position $k$.', 'For each type-$2$ query print the value at position $k$.', '$1 \le n,q \le 2 \times 10^5$', '[{"input":"8 3\n3 2 4 5 1 1 5 3\n2 4\n1 2 5 1\n2 4","output":"5\n6"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-range-update-queries-a1', 'cses-range-update-queries', 'Fenwick / difference array', ARRAY['Ad-Hoc']::text[], ARRAY['Prefix Sums']::text[], ARRAY['Fenwick Tree']::text[], ARRAY['Range add + point query ⇒ Fenwick on a difference array','Add $+u$ at $a$, $-u$ at $b+1$; query is prefix sum to $k$']::text[], 'Maintain a Fenwick tree of difference values. Range updates become two point updates; a point query is a prefix sum.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('demo-euclidiana', 'Euclidiana', 'Other', null, 1500, 'A strange map numbers cells in a **counter-clockwise spiral** starting at $0$ in the center (Cartesian origin). Cell centers are at integer coordinates with unit spacing.

[[figure:spiral-grid]]

You may also think of the same pattern as a monospace matrix:

```grid
.  .  . 15  .  .  .
.  . 14  6 16  .  .
. 13  5  1  7 17  .
24 12  4  0  2  8 18
. 23 11  3  9 19  .
.  . 22 10 20  .  .
.  .  . 21  .  .  .
```

Given many pairs of cell ids $A,B$ ($0 \le A,B \le 10^9$), print the Euclidean distance between their centers. Terminate on $-1\ -1$.', 'Each test case is a line with two integers $A$ and $B$ (cell ids). Input ends with a line containing $-1\ -1$.', 'For each test case print the Euclidean distance between the cell centers (typically with fixed precision).', '$0 \le A,B \le 10^9$', '[{"input":"0 1\n2 3\n-1 -1","output":"1.000\n1.414"}]'::jsonb, 'O(1)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('demo-euclidiana-a1', 'demo-euclidiana', 'Map id → (x,y) then distance', ARRAY['Math / Number Theory','Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Find the ring $r$ containing id $k$ from ring lengths $8r$','Walk the ring perimeter to recover $(x,y)$','Answer $\sqrt{(x_1-x_2)^2+(y_1-y_2)^2}$']::text[], 'Invert the spiral: locate the ring of each id, then the offset along that ring, yielding integer coordinates. Output Euclidean distance (typically printed with fixed precision).');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-200', 'C', 'UVA', 'https://vjudge.net/problem/UVA-200', 1500, 'src="CDN_BASE_URL/d084ba87c5723c4c0499ffa47fe4b0a2?v=1677164122#view=FitH" style="width:100%; height:1400px;" frameborder="0">', 'See statement.', 'See statement.', 'See statement.', '[]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-200-a1', 'uva-200', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-200']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10600', 'ACM Contest and Blackout', 'UVA', 'https://vjudge.net/problem/UVA-10600', 1500, 'Danny is preparing the “First National Coding Camp” for students across the city. Since the event will depend heavily on live scoreboards, online submissions, and dramatic last-minute debugging, Danny wants to make sure every school has a reliable network connection.

To do this, the main server hub “Future” and one school must be connected; in addition, some schools must be connected as well. You may assume that a school has a reliable connection if it is connected directly to “Future”, or to any other school that already has a reliable connection.

Danny is given the cost of building connections between some pairs of schools. Since he likes having backup plans almost as much as he likes clean code, Danny has decided to find the costs of the two cheapest connection plans. The cost of a connection plan is equal to the sum of the costs of the selected connections between schools. Your task is to help Danny find the cost of the two cheapest connection plans.

Input

The Input starts with the number of test cases, T (1 < T < 15) on a line. Then T test cases follow. The first line of every test case contains two numbers, which are separated by a space, N (3 < N < 100) the number of schools in the city, and M the number of possible connections among them. Next M lines contain three numbers Ai, Bi, Ci, where Ci is the cost of the connection (1 < Ci < 300) between schools Ai and Bi. The schools are numbered with integers in the range 1 to N.

Output

For every test case print only one line of output. This line should contain two numbers separated by a single space - the cost of the two cheapest connection plans. Let S1 be the cheapest cost and S2 the next cheapest cost. It is important that S1 = S2 if and only if there are two cheapest plans, otherwise S1 < S2. You can assume that it is always possible to find the costs S1 and S2.

    Input
    Output

    2
5 8
1 3 75
3 4 51
2 4 19
3 2 95
2 5 42
5 4 31
1 2 9
3 5 66
9 14
1 2 4
1 8 8
2 8 11
3 2 8
8 9 7
8 7 1
7 9 6
9 3 2
3 4 7
3 6 4
7 6 2
4 6 14
4 5 9
5 6 10
    110 121
37 37', 'See statement.', 'See statement.', '(1 < T < 15) (3 < N < 100) (1 < Ci < 300)', '[{"input":"The Input starts with the number of test cases, T (1 < T < 15) on a line. Then T test cases follow. The first line of every test case contains two numbers, which are separated by a space, N (3 < N < 100) the number of schools in the city, and M the number of possible connections among them. Next M lines contain three numbers Ai, Bi, Ci, where Ci is the cost of the connection (1 < Ci < 300) between schools Ai and Bi. The schools are numbered with integers in the range 1 to N.","output":"For every test case print only one line of output. This line should contain two numbers separated by a single space - the cost of the two cheapest connection plans. Let S1 be the cheapest cost and S2 the next cheapest cost. It is important that S1 = S2 if and only if there are two cheapest plans, otherwise S1 < S2. You can assume that it is always possible to find the costs S1 and S2."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10600-a1', 'uva-10600', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10600']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-27d', 'Trem de Minas', 'Codeforces', 'https://codeforces.com/problemset/problem/27/D', 1500, 'It is well known that Berland has n cities, which form the Silver ring — cities i and i + 1 (1 ≤ i < n) are connected by a road, as well as the cities n and 1. The goverment have decided to build m new roads. The list of the roads to build was prepared. Each road will connect two cities. Each road should be a curve which lies inside or outside the ring. New roads will have no common points with the ring (except the endpoints of the road).

Now the designers of the constructing plan wonder if it is possible to build the roads in such a way that no two roads intersect (note that the roads may intersect at their endpoints). If it is possible to do, which roads should be inside the ring, and which should be outside?

## Input

The first line contains two integers n and m (4 ≤ n ≤ 100, 1 ≤ m ≤ 100). Each of the following m lines contains two integers ai and bi (1 ≤ ai, bi ≤ n, ai ≠ bi). No two cities will be connected by more than one road in the list. The list will not contain the roads which exist in the Silver ring.

## Output

If it is impossible to build the roads in such a way that no two roads intersect, output Impossible. Otherwise print m characters. i-th character should be i, if the road should be inside the ring, and o if the road should be outside the ring. If there are several solutions, output any of them.

## Examples

Input
    Output

    4 2
1 3
2 4

    io

Input
    Output

    6 3
1 3
3 5
5 1

    ooo', 'The first line contains two integers n and m (4 ≤ n ≤ 100, 1 ≤ m ≤ 100). Each of the following m lines contains two integers ai and bi (1 ≤ ai, bi ≤ n, ai ≠ bi). No two cities will be connected by more than one road in the list. The list will not contain the roads which exist in the Silver ring.', 'If it is impossible to build the roads in such a way that no two roads intersect, output Impossible. Otherwise print m characters. i-th character should be i, if the road should be inside the ring, and o if the road should be outside the ring. If there are several solutions, output any of them.', '(1 ≤ i < n) (4 ≤ n ≤ 100, 1 ≤ m ≤ 100) (1 ≤ ai, bi ≤ n, ai ≠ bi)', '[{"input":"","output":"4 2\n1 3\n2 4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-27d-a1', 'cf-27d', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-27D']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10336', 'Rank the Languages', 'UVA', 'https://vjudge.net/problem/UVA-10336', 1500, 'The Ministry of Culture and Languages has hired you to help them rank all languages according to the number of cities where they are spoken.

They provide you with a map that shows the cities and the languages they speak in each city. For instance:

qqaaqqee

qqaaqqee

aaqqaaee

aaqqaaee

Where every letter stands for a language (q – Quechua, a – Aymara, e – Español) and cities are defined as connected areas with the same letter. Two letters are supposed to be “connected” if one is at left, right, above or below the other one. Thus, in that map, there are three cities where Aymara is spoken, three where Quechua is spoken and one where people speak Español.

The task here is determine the number of cities for each language and print the results in a determined order.

Input

The first line contains the number of test cases C, each one of these consists of a line with two numbers X and Y which are the height and the width of the map respectively.  The follow X lines of size Y symbolize the map. Those letters are always in lowercase from ''a'' to ''z''.

Output

For each test case print ''World #n'', being n the number of the test case. Then print a line for each language that appears in the test case followed by the number of cities where that language is spoken, in the format:

Language: NumberOfStates

These lines must be in decreasing order by the number of cities. If two languages are spoken in the same number of cities, they must appear in alphabetical order, which, for instance, means language ‘a’ comes before language ‘z’.

## Sample Input

2

4 8

ttuuttdd

ttuuttdd

uuttuudd

uuttuudd

9 9

bbbbbbbbb

aaaaaaaab

bbbbbbbab

baaaaacab

bacccccab

bacbbbcab

bacccccab

baaaaaaab

bbbbbbbbb

## Sample Output

World #1

t: 3

u: 3

d: 1

World #2

b: 2

a: 1

c: 1', 'See statement.', 'See statement.', 'See statement.', '[{"input":"The first line contains the number of test cases C, each one of these consists of a line with two numbers X and Y which are the height and the width of the map respectively.  The follow X lines of size Y symbolize the map. Those letters are always in lowercase from ''a'' to ''z''.","output":"For each test case print ''World #n'', being n the number of the test case. Then print a line for each language that appears in the test case followed by the number of cities where that language is spoken, in the format:"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10336-a1', 'uva-10336', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10336']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-784', 'Maze Exploration', 'UVA', 'https://vjudge.net/problem/UVA-784', 1500, 'A maze of rectangular rooms is represented on a two dimensional grid as illustrated in figure 1a. Each point of the grid is represented by a character. The points of room walls are marked by the same character which can be any printable character different than `*'', `_'' and space. In figure 1 this character is `X''. All the other points of the grid are marked by spaces.

XXXXXXXXXXXXXXXXXXXXX             XXXXXXXXXXXXXXXXXXXXX
X   X   X   X   X   X             X###X###X###X   X   X
X           X   X   X             X###########X   X   X
X   X   X   X   X   X             X###X###X###X   X   X
XXXXXX XXX XXXXXXXXXX             XXXXXX#XXX#XXXXXXXXXX
X   X   X   X   X   X             X   X###X###X###X###X
X   X     *         X             X   X###############X
X   X   X   X   X   X             X   X###X###X###X###X
XXXXXXXXXXXXXXXXXXXXX             XXXXXXXXXXXXXXXXXXXXX

	a) Initial maze                    b) Painted maze

		Figure 1. Mazes of rectangular rooms

	All rooms of the maze are equal sized with all walls 3 points wide and 1 point thick as illustrated in figure 2. In addition, a wall is shared on its full length by the separated rooms. The rooms can communicate through doors, which are positioned in the middle of walls. There are no outdoor doors.

door
                       |
                     XX XX
                     X . X   measured from within the room
               door - ...--  walls are 3 points wide
                     X . X__
                     XXXXX  |
                       |___  walls are one point thick

	Figure 2. A room with 3 doors

	Your problem is to paint all rooms of a maze which can be visited starting from a given room, called the `start room'' which is marked by a star (`*'') positioned in the middle of the room. A room can be visited from another room if there is a door on the wall which separates the rooms. By convention, a room is painted if its entire surface, including the doors, is marked by the character `#'' as shown in figure 1b.

## Input

The program input is a text file structured as follows:

		1.

		The first line contains a positive integer which shows the number of mazes to be painted.

		2.

		The rest of the file contains the mazes.

	The lines of the input file can be of different length. The text which represents a maze is terminated by a separation line full of underscores (`_''). There are at most 30 lines and at most 80 characters in a line for each maze

	The program reads the mazes from the input file, paints them and writes the painted mazes on the standard output.

## Output

The output text of a painted maze has the same format as that which has been read for that maze, including the separation lines. The example below illustrates a simple input which contains a single maze and the corresponding output.

## Sample Input

2
XXXXXXXXX
X   X   X
X *     X
X   X   X
XXXXXXXXX
X   X
X   X
X   X
XXXXX
_____
XXXXX
X   X
X * X
X   X
XXXXX
_____

## Sample Output

XXXXXXXXX
X###X###X
X#######X
X###X###X
XXXXXXXXX
X   X
X   X
X   X
XXXXX
_____
XXXXX
X###X
X###X
X###X
XXXXX
_____', 'The program input is a text file structured as follows:



	
		1.
	
		The first line contains a positive integer which shows the number of mazes to be painted.
	
		2.
	
		The rest of the file contains the mazes.


	The lines of the input file can be of different length. The text which represents a maze is terminated by a separation line full of underscores (`_&#39;). There are at most 30 lines and at most 80 characters in a line for each maze



	The program reads the mazes from the input file, paints them and writes the painted mazes on the standard output.', 'The output text of a painted maze has the same format as that which has been read for that maze, including the separation lines. The example below illustrates a simple input which contains a single maze and the corresponding output.', 'See statement.', '[{"input":"The program input is a text file structured as follows:\n\n\t\t1.\n\n\t\tThe first line contains a positive integer which shows the number of mazes to be painted.\n\n\t\t2.\n\n\t\tThe rest of the file contains the mazes.\n\n\tThe lines of the input file can be of different length. The text which represents a maze is terminated by a separation line full of underscores (`_''). There are at most 30 lines and at most 80 characters in a line for each maze\n\n\tThe program reads the mazes from the input file, paints them and writes the painted mazes on the standard","output":"."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-784-a1', 'uva-784', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-784']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('spoj-tubos', 'Série de Tubos', 'SPOJ', 'https://www.spoj.com/problems/TUBOS/', 1500, 'O ano é 2010. O espetacular resultado de um projeto ultra-secreto, iniciado três anos antes
por um grupo de pesquisadores da SBC (Soluções Brasileiras em Cabeamento) está prestes
a ser divulgado: a SBC conseguiu a proeza de transportar matéria através de cabos de fibra
ótica! A pesquisa contraria a famosa e polêmica frase do ex-senador e atual presidente dos
EUA, que na época do início da pesquisa, há três anos, afirmara que "a internet não é como
um caminhão de carga, em que você despeja o que quiser; a internet na verdade é uma série de
tubos". Com isso, a SBC, que atualmente aluga a sua rede de cabos para uma operadora de
TV paga, pensa em mudar de negócio e iniciar-se na atividade de transporte de carga -- apesar
de a tecnologia desenvolvida servir também para o transporte de seres vivos, há dificuldades
políticas na homologação desse meio de transporte para seres humanos.

A rede de fibra ótica da SBC cobre todas as capitais do país. A rede é composta por ramos
de fibra ótica e concentradores. Há um concentrador em cada capital, e um ramo de fibra
ótica conecta diretamente um par de concentradores. Nem todo concentrador está conectado
diretamente por um ramo de fibra a todos os outros concentradores, mas a rede é conexa. Ou
seja, a partir de um dado concentrador existe uma seqüência de ramos e concentradores que
permite que uma informação gerada em qualquer um dos concentradores pode ser enviada a
qualquer outro concentrador da rede.

Para comunicação de dados, é normal que um ramo de fibra ótica possa ser utilizado para
enviar mensagens nos dois sentidos. A tecnologia desenvolvida, no entanto, tem uma peculiari-
dade: depois que um ramo de fibra ótica é utilizado para transportar matéria em uma direção,
a fibra ótica guarda uma memória desse fato, e a partir de então esse ramo somente pode ser
utilizado para transportar matéria naquela direção. Concentradores não são afetados por essa
memória de direção.

O grupo de pesquisa da SBC é muito bom em física, mas muito fraco em computação. Por
isso, você foi contratado para determinar se a rede de fibra ótica existente poderá ser utilizada
pela SBC para transportar carga entre qualquer par de capitais, mesmo considerando a restrição
de memória de sentido dos ramos de fibra ótica.

Entrada

A primeira linha de cada caso de teste contém dois inteiros N e M separados por um espaço
em branco, que representam, respectivamente, a quantidade de capitais (2 ≤ N ≤ 1.000) e a
quantidade de ramos de fibra ótica existentes (1 ≤ M ≤ 50.000). As capitais são numeradas
de 1 a N. Cada uma das M linhas seguintes de um caso de teste contém dois inteiros A e B
(1 ≤ A, B ≤ N, A ≠ B) separados por um espaço em branco, indicando que existe um ramo
de fibra ligando a capital A à capital B. Note que para comunicação de dados o ramo descrito
pode ser utilizado para enviar mensagens tanto de A para B quanto de B para A, mas para
transferência de matéria ele poderá ser utilizado em apenas uma direção. Há no máximo um
único ramo de fibra ligando um par de capitais. O final da entrada é indicado por N = M = 0.

A entrada deve ser lida da entrada padrão.

Saída

Para cada caso de teste da entrada seu programa deve imprimir uma única linha, contendo a
letra `S'' caso seja possível utilizar a rede existente conforme especificado, ou a letra `N'' caso
contrário.

A saída deve ser escrita na saída padrão.

Exemplo

Entrada:
4 3
1 2
2 3
3 4
5 6
1 2
1 3
2 3
2 4
4 5
5 3
6 6
1 2
2 3
3 4
4 5
5 6
1 3
0 0

Saída:
N
S
N', 'See statement.', 'See statement.', '(2 ≤ N ≤ 1.000) (1 ≤ M ≤ 50.000) (1 ≤ A, B ≤ N, A ≠ B)', '[]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('spoj-tubos-a1', 'spoj-tubos', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: SPOJ-TUBOS']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10305', 'Ordering Tasks', 'UVA', 'https://vjudge.net/problem/UVA-10305', 1500, '## Statement

Task Topological Sorting Problem

            John has n tasks to do. Unfortunately, the tasks are not independent and the execution of one task is only possible if other tasks have already been executed.

        Input

            The input will consist of several instances of the problem. Each instance begins with a line containing two integers, 1 ≤ n ≤ 100 and m. n is the number of tasks (numbered from 1 to n) and m is the number of direct precedence relations between tasks. After this, there will be m lines with two integers i and j, representing the fact that task i must be executed before task j.

            An instance with n = m = 0 will finish the input.

        Output

            For each instance, print a line with n integers representing the tasks in a possible order of execution.

## Input

5 4

1 2

2 3

1 3

1 5

0 0

## Output

1 4 2 5 3', '5 4

1 2

2 3

1 3

1 5

0 0', '1 4 2 5 3', '(numbered from 1 to n)', '[{"input":"The input will consist of several instances of the problem. Each instance begins with a line containing two integers, 1 ≤ n ≤ 100 and m. n is the number of tasks (numbered from 1 to n) and m is the number of direct precedence relations between tasks. After this, there will be m lines with two integers i and j, representing the fact that task i must be executed before task j.\n\n            An instance with n = m = 0 will finish the input.","output":"For each instance, print a line with n integers representing the tasks in a possible order of execution."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10305-a1', 'uva-10305', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10305']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10079', 'Dividindo a pizza', 'UVA', 'https://vjudge.net/problem/UVA-10079', 1500, 'When someone calls Ivan lazy, he claims that it is his intelligence that helps him to be so. If his intelligence allows him to do something at less physical effort, why should he exert more? He also claims that he always uses his brain and tries to do some work at less effort; this is not his laziness, rather this is his intellectual smartness.

	Once Ivan was asked to cut a pizza into seven pieces to distribute it among his friends. (Size of the pieces may not be the same. In fact, his piece will be larger than the others.) He thought a bit, and came to the conclusion that he can cut it into seven pieces by only three straight cuts through the pizza with a pizza knife. Accordingly, he cut the pizza in the following way (guess which one is Ivan''s piece):

		 One of his friends, who never believed in Ivan&rsquo;s smartness, was startled at this intelligence. He thought, if Ivan can do it, why can&rsquo;t my computer? So he tried to do a similar (but not exactly as Ivan''s, for Ivan will criticize him for stealing his idea) job with his computer. He wrote a program that took the number of straight cuts one makes through the pizza, and output a number representing the maximum number of pizza pieces it will produce.

		Your job here is to write a similar program. It is ensured that Ivan&rsquo;s friend won&rsquo;t criticize you for doing the same job he did.

## Input

The input file will contain a single integer N (0 <= N <= 210000000)  in each line representing the number of straight line cuts one makes through the pizza. A negative number terminates the input.

## Output

Output the maximum number of pizza pieces the given number of cuts can produce. Each line should contain only one output integer without any leading or trailing space.

## Sample Input

5
	10
	-100

## Sample Output

16
	56', 'The input file will contain a single integer N (0 <= N <= 210000000)  in each line representing the number of straight line cuts one makes through the pizza. A negative number terminates the input.', 'Output the maximum number of pizza pieces the given number of cuts can produce. Each line should contain only one output integer without any leading or trailing space.', '(0 <= N <= 210000000)', '[{"input":"The input file will contain a single integer N (0 <= N <= 210000000)  in each line representing the number of straight line cuts one makes through the pizza. A negative number terminates the input.\n\n##","output":"Output the maximum number of pizza pieces the given number of cuts can produce. Each line should contain only one output integer without any leading or trailing space."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10079-a1', 'uva-10079', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10079']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10140', 'Closest primes', 'UVA', 'https://vjudge.net/problem/UVA-10140', 1500, 'The CCE Department delves into the fascinating world of number theory, exploring the properties of numbers. A timeless question that has captivated mathematicians is the concept of primality.

A prime number, as you know, is a number with no proper divisors (evenly divisible only by 1 and itself). The initial primes are 2, 3, 5, and 7, but their distribution becomes less frequent as numbers grow larger. A compelling area of inquiry is understanding prime number density within specific ranges.

Adjacent primes are defined as two prime numbers where no other prime numbers exist between them. For instance, 2 and 3 are the only adjacent primes that are also consecutive numbers.

Your task, as a CCE programmer, is to analyze prime numbers within given bounds. You are provided with two integers: L and U (1 ≤ L
  -   The two adjacent primes C1 and C2 (L ≤ C1 D1 and D2 (L ≤ D1

Input

Each input line contains two positive integers, L and U, where L Output

For each input pair (L, U), the output should be one of the following:

  -   If there are fewer than two prime numbers within the range [L, U], print: "There are no adjacent primes."

  -   Otherwise, print a line specifying the closest and most distant adjacent prime pairs in the format: "C1,C2 are closest, D1,D2 are most distant."

Example

    Input
    Output

    2 17
14 17
    2,3 are closest, 7,11 are most distant.
There are no adjacent primes.

Hints for the:

  Considering the large upper bound (U) but the small range difference (U-L &le; 1,000,000), a standard Sieve of Eratosthenes up to U will be too slow. However, a **Segmented Sieve** or **Sieve in a Range** is your friend here! First, sieve primes up to the square root of U. Then, use these smaller primes to efficiently mark composites within your [L, U] range. Remember, 2 is the only even prime.

  Once you have all primes in the [L, U] range, iterate through them to find adjacent pairs and track the minimum and maximum differences. Pay close attention to edge cases: what if L is very small, or what if there are very few primes in the range?', 'See statement.', 'See statement.', '(evenly divisible only by 1 and itself) (U-L &le; 1,000,000)', '[{"input":"Each input line contains two positive integers, L and U, where L","output":"For each input pair (L, U), the output should be one of the following:"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10140-a1', 'uva-10140', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10140']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-543', 'Conjectura de Goldbach', 'UVA', 'https://vjudge.net/problem/UVA-543', 1500, 'In 1742, Christian Goldbach, a German amateur mathematician, sent a letter to Leonhard Euler in
    which he made the following conjecture:

    Every number greater than 2 can be written as the sum of three prime numbers.

    Goldbach was considering 1 as a prime number, a convention that is no longer followed. Later on,
    Euler re-expressed the conjecture as:

    Every even number greater than or equal to 4 can be expressed as the sum of two prime
    numbers.

  For example:

    - 8 = 3 + 5. Both 3 and 5 are odd prime numbers.

    - 20 = 3 + 17 = 7 + 13.

    - 42 = 5 + 37 = 11 + 31 = 13 + 29 = 19 + 23.

    Today it is still unproven whether the conjecture is right. (Oh wait, I have the proof of course, but
    it is too long to write it on the margin of this page.)

    Anyway, your task is now to verify Goldbach’s conjecture as expressed by Euler for all even numbers
    less than a million.

  Input

    The input file will contain one or more test cases.

    Each test case consists of one even integer n with 6 ≤ n < 1000000.

    Input will be terminated by a value of 0 for n.

  Output

    For each test case, print one line of the form n = a + b, where a and b are odd primes. Numbers and
    operators should be separated by exactly one blank like in the sample output below. If there is more
    than one pair of odd primes adding up to n, choose the pair where the difference b − a is maximized.

    If there is no such pair, print a line saying ‘Goldbach''s conjecture is wrong.’

  Sample Input

8
20
42
0

  Sample Output

8 = 3 + 5
20 = 3 + 17
42 = 5 + 37', 'See statement.', 'See statement.', 'See statement.', '[{"input":"The input file will contain one or more test cases.\n\n    Each test case consists of one even integer n with 6 ≤ n < 1000000.\n\n    Input will be terminated by a value of 0 for n.","output":"For each test case, print one line of the form n = a + b, where a and b are odd primes. Numbers and\n    operators should be separated by exactly one blank like in the sample output below. If there is more\n    than one pair of odd primes adding up to n, choose the pair where the difference b − a is maximized."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-543-a1', 'uva-543', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-543']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10105', 'Coeficiente', 'UVA', 'https://vjudge.net/problem/UVA-10105', 1500, 'The problem is to calculate the coefficients in expansion of polynomial $(x_1 + x_2 + . . . + x_k)^n$.
Input
The input will consist of a set of pairs of lines. The rst line of the pair consists of two integers n and
$k$ separated with space$ (0 < K, N < 13)$. This integers de ne the power of the polynomial and the
amount of the variables. The second line in each pair consists of k non-negative integers $n_1, . . . , n_k$,where $n_1 + . . . + n_k = n$.
Output
For each input pair of lines the output line should consist one integer, the coefficient by the monomial
${x_1}^{n_1} {x_2}^{n_2} . . . {x_k}^{n_k}$ in expansion of the polynomial $(x_1 + x_2 + . . . + x_k)^n$.
Sample Input
2 2
1 1
2 12
1 0 0 0 0 0 0 0 0 0 1 0
Sample Output
2
2', 'See statement.', 'See statement.', '(x_1 + x_2 + . . . + x_k) (0 < K, N < 13) (x_1 + x_2 + . . . + x_k)', '[{"input":"The input will consist of a set of pairs of lines. The rst line of the pair consists of two integers n and\n$k$ separated with space$ (0 < K, N < 13)$. This integers de ne the power of the polynomial and the\namount of the variables. The second line in each pair consists of k non-negative integers $n_1, . . . , n_k$,where $n_1 + . . . + n_k = n$.","output":"For each input pair of lines the output line should consist one integer, the coefficient by the monomial\n${x_1}^{n_1} {x_2}^{n_2} . . . {x_k}^{n_k}$ in expansion of the polynomial $(x_1 + x_2 + . . . + x_k)^n$.\nSample Input\n2 2\n1 1\n2 12\n1 0 0 0 0 0 0 0 0 0 1 0\nSample Output\n2\n2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10105-a1', 'uva-10105', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10105']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10346', 'Conte os cigarros', 'UVA', 'https://vjudge.net/problem/UVA-10346', 1500, '<b>Latent Soft</b> is a software development company in Bangladesh. They also provide IT professional training on <u>Web Development, Mobile application development, CCNA</u> etc. These courses are conducted by skilled and experienced trainers who are working on national and international marketplace. After a successful course completion, they also provide internship facilities where students can work on real life projects in corporate culture to be fully skilled on specific field.
To save financial cost of students they always offer various kind of discounts. Recently they added another offer for students. After completing any course, they provide a Course Card to each student. Collecting K Course Cards, a student can do another course for totally free. Course Card will also be provided after that free course.
Consider that Latent Soft already served N Course Cards to previous N students and will not run any more paid batch of any course. You have to say, how many students Latent Soft will have in total of both paid and free.

## Input

In each line of input, you will be given N and K > 1.

## Output

For each line of input, you have to output how students Latent Soft will have if no more paid course is running.

## Sample Input

<pre>
4 3
10 3
100 5</pre>

## Sample Output

<pre>
5
14
124</pre>', 'In each line of input, you will be given N and K > 1.', 'For each line of input, you have to output how students Latent Soft will have if no more paid course is running.', 'See statement.', '[{"input":"In each line of input, you will be given N and K > 1.\n\n##","output":"For each line of input, you have to output how students Latent Soft will have if no more paid course is running."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10346-a1', 'uva-10346', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10346']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-264', 'Cantor', 'UVA', 'https://vjudge.net/problem/UVA-264', 1500, '## Description

One of the famous proofs of modern mathematics is Georg Cantor’s demonstration that the set of
rational numbers is enumerable. The proof works by using an explicit enumeration of rational numbers as shown below.

1/1 &nbsp&nbsp 1/2 &nbsp&nbsp 1/3 &nbsp&nbsp 1/4 &nbsp&nbsp 1/5 . . .

2/1 &nbsp&nbsp 2/2 &nbsp&nbsp 2/3 &nbsp&nbsp 2/4

3/1 &nbsp&nbsp 3/2 &nbsp&nbsp 3/3

4/1 &nbsp&nbsp 4/2

5/1

In the above diagram, the first term is 1/1, the second term is 1/2, the third term is 2/1, the fourth
term is 3/1, the fifth term is 2/2, and so on.

## Input

You are to write a program that will read a list of numbers in the range from 1 to 107.

The input list contains a single number per line and will be terminated by end-of-file

## Output

Print each number the corresponding term in Cantor’s enumeration as given below. No blank line should after the last number.

## Sample Input

3

14

7

16

## Sample Output

TERM 3 IS 2/1

TERM 14 IS 2/4

TERM 7 IS 1/4

TERM 16 IS 1/6

Keep Calm. Find Pattern.', 'You are to write a program that will read a list of numbers in the range from 1 to 107.

The input list contains a single number per line and will be terminated by end-of-file', 'Print each number the corresponding term in Cantor’s enumeration as given below. No blank line should after the last number.', 'See statement.', '[{"input":"You are to write a program that will read a list of numbers in the range from 1 to 107.\n\nThe input list contains a single number per line and will be terminated by end-of-file\n\n##","output":"Print each number the corresponding term in Cantor’s enumeration as given below. No blank line should after the last number."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-264-a1', 'uva-264', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-264']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-1225', 'Digits', 'UVA', 'https://vjudge.net/problem/UVA-1225', 1500, 'Fahim likes to solve mathematical problems. But sometimes it becomes challenging for him to solve all the mathematical problems. So sometimes he gets angry to solve mathematical puzzles. He takes a piece of chalk and starts writing a sequence of consecutive integers starting with 1 to N (1 12345678910111213

The sequence is interesting, right! In this sequence, zero(0) appears once, one(1) appears 6 times, two(2) appears 2 times, three(3) appears 3 times, and each digit from four(4) to nine(9) appears once. After playing for a while, Fahim gets bored again. He now wants to write a program to do this for him. Your task is to help him with writing this program.

Input

Look at the input file carefully. It consists of several data sets. The first line of the input file contains the number of data sets which is a positive integer and is not bigger than 20. The following lines describe the data sets. For each test case, there is one single line containing the number N.

Output

Now for each individual test case, write sequentially in one line the number of digit 0, 1, . . . 9 separated by a space.

Sample Input

2

3

13

Sample Output

0 1 1 1 0 0 0 0 0 0

1 6 2 2 1 1 1 1 1 1

Note

You can submit your solution using C/C++/Java. If you want to submit your solution using JavaScript then ask volunteers.', 'See statement.', 'See statement.', '(0) (1) (2) (3) (4) (9)', '[{"input":"Look at the input file carefully. It consists of several data sets. The first line of the input file contains the number of data sets which is a positive integer and is not bigger than 20. The following lines describe the data sets. For each test case, there is one single line containing the number N.","output":"Now for each individual test case, write sequentially in one line the number of digit 0, 1, . . . 9 separated by a space."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-1225-a1', 'uva-1225', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-1225']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10035', 'Quantos vai-um', 'UVA', 'https://vjudge.net/problem/UVA-10035', 1500, 'When we were first introduced to early mathematics in school, we were doing addition, subtraction, multiplication, division by hand. How beautiful the days were!

	Suppose, you are Bob. Bob were taught to add multi-digit numbers from right-to-left one digit at a time. Many find the "carry" operation - in which a 1 is carried from one digit position to be added to the next - to be a significant challenge. Your job is to count the number of carry operations for each of a set of addition problems so that educators may assess their difficulty.

## Input

Each line of input contains two unsigned integers less than 10 digits. The last line of input contains 0 0.

## Output

For each line of input except the last you should compute and print the number of carry operations that would result from adding the two numbers, in the format shown below.

## Sample Input

123 456
555 555
123 594
0 0

## Sample Output

No carry operation.
3 carry operations.
1 carry operation.', 'Each line of input contains two unsigned integers less than 10 digits. The last line of input contains 0 0.', 'For each line of input except the last you should compute and print the number of carry operations that would result from adding the two numbers, in the format shown below.', 'See statement.', '[{"input":"Each line of input contains two unsigned integers less than 10 digits. The last line of input contains 0 0.\n\n##","output":"For each line of input except the last you should compute and print the number of carry operations that would result from adding the two numbers, in the format shown below."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10035-a1', 'uva-10035', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10035']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10018', 'Reverse', 'UVA', 'https://vjudge.net/problem/UVA-10018', 1500, 'The “reverse and add” method is simple: choose a number, reverse its digits and add it to the original. If the sum is not a palindrome (which means, it is not the same number from left to right and right to left), repeat this procedure.

     195   Initial number

     591

     ---

     786

     687

     ---

     1473  (For example)

     3741

     ----

     5214

     4125

     ----

     9339    (Resulting Palindrome)

In this particular case the palindrome ‘9339’ appeared after the 4th addition. This method leads to palindromes in a few steps for almost all of the integers. But there are interesting exceptions. 196 is the first number for which no palindrome has been found. It is not proven though, that there is no such a palindrome.

You must write a program that give the resulting palindrome and the number of iterations (addi tions) to compute the palindrome.

You might assume that all tests data on this problem:

   • will have an answer ,

   • will be computable with less than 1000 iterations (additions),

   • will yield a palindrome that is not greater than 4,294,967,295.

## Input

The first line will have a number N (0 < N ≤ 100) with the number of test cases, the next N lines will have a number P to compute its palindrome.

## Output

For each of the N tests, you will have to write a line with the following data: minimum number of iterations and the resulting palindrome itself separated by one space.

## Sample Input

3

195

265

750

## Sample Output

4 9339

5 45254

3 6666', 'The first line will have a number N (0 < N ≤ 100) with the number of test cases, the next N lines will have a number P to compute its palindrome.', 'For each of the N tests, you will have to write a line with the following data: minimum number of iterations and the resulting palindrome itself separated by one space.', '(0 < N ≤ 100)', '[{"input":"The first line will have a number N (0 < N ≤ 100) with the number of test cases, the next N lines will have a number P to compute its palindrome.\n\n##","output":"For each of the N tests, you will have to write a line with the following data: minimum number of iterations and the resulting palindrome itself separated by one space."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10018-a1', 'uva-10018', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10018']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1427a', 'Bom apetite', 'Codeforces', 'https://codeforces.com/problemset/problem/1427/A', 1500, 'You are given an array of $$$n$$$ integers $$$a_1,a_2,\dots,a_n$$$.

You have to create an array of $$$n$$$ integers $$$b_1,b_2,\dots,b_n$$$ such that:

 -  The array $$$b$$$ is a rearrangement of the array $$$a$$$, that is, it contains the same values and each value appears the same number of times in the two arrays. In other words, the multisets $$$\{a_1,a_2,\dots,a_n\}$$$ and $$$\{b_1,b_2,\dots,b_n\}$$$ are equal.For example, if $$$a=[1,-1,0,1]$$$, then $$$b=[-1,1,1,0]$$$ and $$$b=[0,1,-1,1]$$$ are rearrangements of $$$a$$$, but $$$b=[1,-1,-1,0]$$$ and $$$b=[1,0,2,-3]$$$ are not rearrangements of $$$a$$$.

-  For all $$$k=1,2,\dots,n$$$ the sum of the first $$$k$$$ elements of $$$b$$$ is nonzero. Formally, for all $$$k=1,2,\dots,n$$$, it must hold $$$$$$b_1+b_2+\cdots+b_k\not=0\,.$$$$$$
If an array $$$b_1,b_2,\dots, b_n$$$ with the required properties does not exist, you have to print NO.

## Input

Each test contains multiple test cases. The first line contains an integer $$$t$$$ ($$$1\le t \le 1000$$$) — the number of test cases. The description of the test cases follows.

The first line of each testcase contains one integer $$$n$$$ ($$$1\le n\le 50$$$)  — the length of the array $$$a$$$.

The second line of each testcase contains $$$n$$$ integers $$$a_1,a_2,\dots, a_n$$$ ($$$-50\le a_i\le 50$$$)  — the elements of $$$a$$$.

## Output

For each testcase, if there is not an array $$$b_1,b_2,\dots,b_n$$$ with the required properties, print a single line with the word NO.

Otherwise print a line with the word YES, followed by a line with the $$$n$$$ integers $$$b_1,b_2,\dots,b_n$$$.

If there is more than one array $$$b_1,b_2,\dots,b_n$$$ satisfying the required properties, you can print any of them.

## Examples

Input
    Output

    4
4
1 -2 3 -4
3
0 0 0
5
1 -1 1 -1 1
6
40 -31 -9 0 13 -40

    YES
1 -2 3 -4
NO
YES
1 1 -1 1 -1
YES
-40 13 40 0 -9 -31

## Note

Explanation of the first testcase: An array with the desired properties is $$$b=[1,-2,3,-4]$$$. For this array, it holds:

 -  The first element of $$$b$$$ is $$$1$$$.
-  The sum of the first two elements of $$$b$$$ is $$$-1$$$.
-  The sum of the first three elements of $$$b$$$ is $$$2$$$.
-  The sum of the first four elements of $$$b$$$ is $$$-2$$$.
Explanation of the second testcase: Since all values in $$$a$$$ are $$$0$$$, any rearrangement $$$b$$$ of $$$a$$$ will have all elements equal to $$$0$$$ and therefore it clearly cannot satisfy the second property described in the statement (for example because $$$b_1=0$$$). Hence in this case the answer is NO.

Explanation of the third testcase: An array with the desired properties is $$$b=[1, 1, -1, 1, -1]$$$. For this array, it holds:

 -  The first element of $$$b$$$ is $$$1$$$.
-  The sum of the first two elements of $$$b$$$ is $$$2$$$.
-  The sum of the first three elements of $$$b$$$ is $$$1$$$.
-  The sum of the first four elements of $$$b$$$ is $$$2$$$.
-  The sum of the first five elements of $$$b$$$ is $$$1$$$.
Explanation of the fourth testcase: An array with the desired properties is $$$b=[-40,13,40,0,-9,-31]$$$. For this array, it holds:

 -  The first element of $$$b$$$ is $$$-40$$$.
-  The sum of the first two elements of $$$b$$$ is $$$-27$$$.
-  The sum of the first three elements of $$$b$$$ is $$$13$$$.
-  The sum of the first four elements of $$$b$$$ is $$$13$$$.
-  The sum of the first five elements of $$$b$$$ is $$$4$$$.
-  The sum of the first six elements of $$$b$$$ is $$$-27$$$.', 'Each test contains multiple test cases. The first line contains an integer $$$t$$$ ($$$1\le t \le 1000$$$) — the number of test cases. The description of the test cases follows.

The first line of each testcase contains one integer $$$n$$$ ($$$1\le n\le 50$$$)  — the length of the array $$$a$$$.

The second line of each testcase contains $$$n$$$ integers $$$a_1,a_2,\dots, a_n$$$ ($$$-50\le a_i\le 50$$$)  — the elements of $$$a$$$.', 'For each testcase, if there is not an array $$$b_1,b_2,\dots,b_n$$$ with the required properties, print a single line with the word NO.

Otherwise print a line with the word YES, followed by a line with the $$$n$$$ integers $$$b_1,b_2,\dots,b_n$$$. 

If there is more than one array $$$b_1,b_2,\dots,b_n$$$ satisfying the required properties, you can print any of them.', '($$$1\le t \le 1000$$$) ($$$1\le n\le 50$$$) ($$$-50\le a_i\le 50$$$) (for example because $$$b_1=0$$$)', '[{"input":"","output":"4\n4\n1 -2 3 -4\n3\n0 0 0\n5\n1 -1 1 -1 1\n6\n40 -31 -9 0 13 -40"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1427a-a1', 'cf-1427a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1427A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-847m', 'A população de capivaras', 'Codeforces', 'https://codeforces.com/problemset/problem/847/M', 1500, 'Vasya came up with his own weather forecasting method. He knows the information about the average air temperature for each of the last n days. Assume that the average air temperature for each day is integral.

Vasya believes that if the average temperatures over the last n days form an arithmetic progression, where the first term equals to the average temperature on the first day, the second term equals to the average temperature on the second day and so on, then the average temperature of the next (n + 1)-th day will be equal to the next term of the arithmetic progression. Otherwise, according to Vasya''s method, the temperature of the (n + 1)-th day will be equal to the temperature of the n-th day.

Your task is to help Vasya predict the average temperature for tomorrow, i. e. for the (n + 1)-th day.

## Input

The first line contains a single integer n (2 ≤ n ≤ 100) — the number of days for which the average air temperature is known.

The second line contains a sequence of integers t1, t2, ..., tn ( - 1000 ≤ ti ≤ 1000) — where ti is the average temperature in the i-th day.

## Output

Print the average air temperature in the (n + 1)-th day, which Vasya predicts according to his method. Note that the absolute value of the predicted temperature can exceed 1000.

## Examples

Input
    Output

    5
10 5 0 -5 -10

    -15

Input
    Output

    4
1 1 1 1

    1

Input
    Output

    3
5 1 -5

    -5

Input
    Output

    2
900 1000

    1100

## Note

In the first example the sequence of the average temperatures is an arithmetic progression where the first term is 10 and each following terms decreases by 5. So the predicted average temperature for the sixth day is  - 10 - 5 =  - 15.

In the second example the sequence of the average temperatures is an arithmetic progression where the first term is 1 and each following terms equals to the previous one. So the predicted average temperature in the fifth day is 1.

In the third example the average temperatures do not form an arithmetic progression, so the average temperature of the fourth day equals to the temperature of the third day and equals to  - 5.

In the fourth example the sequence of the average temperatures is an arithmetic progression where the first term is 900 and each the following terms increase by 100. So predicted average temperature in the third day is 1000 + 100 = 1100.', 'The first line contains a single integer n (2 ≤ n ≤ 100) — the number of days for which the average air temperature is known.

The second line contains a sequence of integers t1, t2, ..., tn ( - 1000 ≤ ti ≤ 1000) — where ti is the average temperature in the i-th day.', 'Print the average air temperature in the (n + 1)-th day, which Vasya predicts according to his method. Note that the absolute value of the predicted temperature can exceed 1000.', '(n + 1) (n + 1) (n + 1) (2 ≤ n ≤ 100) ( - 1000 ≤ ti ≤ 1000) (n + 1)', '[{"input":"","output":"5\n10 5 0 -5 -10"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-847m-a1', 'cf-847m', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-847M']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('spoj-anarc09a', 'Chaves', 'SPOJ', 'https://www.spoj.com/problems/ANARC09A/', 1500, 'I’m out of stories. For years I’ve been writing stories, some rather silly, just to make simple problems look difficult and complex problems look easy. But, alas, not for this one.

You’re given a non empty string made in its entirety from opening and closing braces. Your task is to find the minimum number of “operations” needed to make the string stable. The definition for being stable is as follows:

- An empty string is stable.

- If S is stable, then {S} is also stable.

- If S and T are both stable, then ST (the concatenation of the two) is also stable.

All of these strings are stable: {}, {}{}, and {{}{}}; But none of these: }{, {{}{, nor {}{.
The only operation allowed on the string is to replace an opening brace with a closing brace, or vice-versa.

Input

Your program will be tested on one or more data sets. Each data set is described on a single line. The line is a non-empty string of opening and closing braces and nothing else. No string has more than 2000 braces. All sequences are of even length.

The last line of the input is made of one or more ’-’ (minus signs.)

Output

For each test case, print the following line:

k. N

Where k is the test case number (starting at one,) and N is the minimum number of operations needed to convert the given string into a balanced one.

Example

    Input
    Output

    }{
{}{}{}
{{{}
---

    1. 2
2. 0
3. 1', 'See statement.', 'See statement.', 'See statement.', '[{"input":"Your program will be tested on one or more data sets. Each data set is described on a single line. The line is a non-empty string of opening and closing braces and nothing else. No string has more than 2000 braces. All sequences are of even length.\n\nThe last line of the input is made of one or more ’-’ (minus signs.)","output":"For each test case, print the following line:"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('spoj-anarc09a-a1', 'spoj-anarc09a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: SPOJ-ANARC09A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('spoj-stpar', 'Desfile do CA', 'SPOJ', 'https://www.spoj.com/problems/STPAR/', 1500, 'For sure, the love mobiles will roll again on this summer''s street parade. Each year, the organisers decide on a fixed order for the decorated trucks. Experience taught them to keep free a side street to be able to bring the trucks into order.

The side street is so narrow that no two cars can pass each other. Thus, the love mobile that enters the side street last must necessarily leave the side street first. Because the trucks and the ravers move up closely, a truck cannot drive back and re-enter the side street or the approach street.

You are given the order in which the love mobiles arrive. Write a program that decides if the love mobiles can be brought into the order that the organisers want them to be.

Input

There are several test cases.
The first line of each test case contains a single number n, the number of love mobiles.
The second line contains the numbers 1 to n in an arbitrary order. All the numbers are separated by single spaces. These numbers indicate the order in which the trucks arrive in the approach street.
No more than 1000 love mobiles participate in the street parade. Input ends with number 0.

Output

For each test case your program has to output a line containing a single word "yes" if the love mobiles can be re-ordered with the help of the side street, and a single word "no" in the opposite case.

Example

    Input
    Output

    5
5 1 2 4 3
0

    yes

Illustration

The sample input reflects the following situation:

The five trucks can be re-ordered in the following way:', 'See statement.', 'See statement.', 'See statement.', '[{"input":"There are several test cases.\nThe first line of each test case contains a single number n, the number of love mobiles.\nThe second line contains the numbers 1 to n in an arbitrary order. All the numbers are separated by single spaces. These numbers indicate the order in which the trucks arrive in the approach street.\nNo more than 1000 love mobiles participate in the street parade. Input ends with number 0.","output":"For each test case your program has to output a line containing a single word \"yes\" if the love mobiles can be re-ordered with the help of the side street, and a single word \"no\" in the opposite case."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('spoj-stpar-a1', 'spoj-stpar', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: SPOJ-STPAR']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-11988', 'Eu odeio o teclado do PVB', 'UVA', 'https://vjudge.net/problem/UVA-11988', 1500, 'You''re typing a long text with a broken keyboard. Well it''s not so badly broken. The only problem with the keyboard is that sometimes the "home" key or the "end" key gets automatically pressed (internally).

	You''re not aware of this issue, since you''re focusing on the text and did not even turn on the monitor! After you finished typing, you can see a text on the screen (if you turn on the monitor).

## Input

There are several test cases. Each test case is a single line containing at least one and at most 100,000 letters, underscores and two special characters ''['' and '']''. ''['' means the "Home" key is pressed internally, and '']'' means the "End" key is pressed internally. The input is terminated by end-of-file (EOF). The size of input file does not exceed 5MB.

## Output

For each case, print the resultant text on the screen.

## Sample Input

This_is_a_[Buggy]_text
[[]][][]Sonargaon_University_Programming_Club

## Sample Output

BuggyThis_is_a__text
Sonargaon_University_Programming_Club', 'There are several test cases. Each test case is a single line containing at least one and at most 100,000 letters, underscores and two special characters &#39;[&#39; and &#39;]&#39;. &#39;[&#39; means the "Home" key is pressed internally, and &#39;]&#39; means the "End" key is pressed internally. The input is terminated by end-of-file (EOF). The size of input file does not exceed 5MB.', 'For each case, print the resultant text on the screen.', 'See statement.', '[{"input":"There are several test cases. Each test case is a single line containing at least one and at most 100,000 letters, underscores and two special characters ''['' and '']''. ''['' means the \"Home\" key is pressed internally, and '']'' means the \"End\" key is pressed internally. The input is terminated by end-of-file (EOF). The size of input file does not exceed 5MB.\n\n##","output":"For each case, print the resultant text on the screen."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-11988-a1', 'uva-11988', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-11988']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1265b', 'Fila do RU', 'Codeforces', 'https://codeforces.com/problemset/problem/1265/B', 1500, 'You are given a permutation $$$p=[p_1, p_2, \ldots, p_n]$$$ of integers from $$$1$$$ to $$$n$$$. Let''s call the number $$$m$$$ ($$$1 \le m \le n$$$) beautiful, if there exists two indices $$$l, r$$$ ($$$1 \le l \le r \le n$$$), such that the numbers $$$[p_l, p_{l+1}, \ldots, p_r]$$$ is a permutation of numbers $$$1, 2, \ldots, m$$$.

For example, let $$$p = [4, 5, 1, 3, 2, 6]$$$. In this case, the numbers $$$1, 3, 5, 6$$$ are beautiful and $$$2, 4$$$ are not. It is because:

 -  if $$$l = 3$$$ and $$$r = 3$$$ we will have a permutation $$$[1]$$$ for $$$m = 1$$$;
-  if $$$l = 3$$$ and $$$r = 5$$$ we will have a permutation $$$[1, 3, 2]$$$ for $$$m = 3$$$;
-  if $$$l = 1$$$ and $$$r = 5$$$ we will have a permutation $$$[4, 5, 1, 3, 2]$$$ for $$$m = 5$$$;
-  if $$$l = 1$$$ and $$$r = 6$$$ we will have a permutation $$$[4, 5, 1, 3, 2, 6]$$$ for $$$m = 6$$$;
-  it is impossible to take some $$$l$$$ and $$$r$$$, such that $$$[p_l, p_{l+1}, \ldots, p_r]$$$ is a permutation of numbers $$$1, 2, \ldots, m$$$ for $$$m = 2$$$ and for $$$m = 4$$$.
You are given a permutation $$$p=[p_1, p_2, \ldots, p_n]$$$. For all $$$m$$$ ($$$1 \le m \le n$$$) determine if it is a beautiful number or not.

## Input

The first line contains the only integer $$$t$$$ ($$$1 \le t \le 1000$$$)  — the number of test cases in the input. The next lines contain the description of test cases.

The first line of a test case contains a number $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the length of the given permutation $$$p$$$. The next line contains $$$n$$$ integers $$$p_1, p_2, \ldots, p_n$$$ ($$$1 \le p_i \le n$$$, all $$$p_i$$$ are different) — the given permutation $$$p$$$.

It is guaranteed, that the sum of $$$n$$$ from all test cases in the input doesn''t exceed $$$2 \cdot 10^5$$$.

## Output

Print $$$t$$$ lines — the answers to test cases in the order they are given in the input.

The answer to a test case is the string of length $$$n$$$, there the $$$i$$$-th character is equal to $$$1$$$ if $$$i$$$ is a beautiful number and is equal to $$$0$$$ if $$$i$$$ is not a beautiful number.

## Examples

Input
    Output

    3
6
4 5 1 3 2 6
5
5 3 1 2 4
4
1 4 3 2

    101011
11111
1001

## Note

The first test case is described in the problem statement.

In the second test case all numbers from $$$1$$$ to $$$5$$$ are beautiful:

 -  if $$$l = 3$$$ and $$$r = 3$$$ we will have a permutation $$$[1]$$$ for $$$m = 1$$$;
-  if $$$l = 3$$$ and $$$r = 4$$$ we will have a permutation $$$[1, 2]$$$ for $$$m = 2$$$;
-  if $$$l = 2$$$ and $$$r = 4$$$ we will have a permutation $$$[3, 1, 2]$$$ for $$$m = 3$$$;
-  if $$$l = 2$$$ and $$$r = 5$$$ we will have a permutation $$$[3, 1, 2, 4]$$$ for $$$m = 4$$$;
-  if $$$l = 1$$$ and $$$r = 5$$$ we will have a permutation $$$[5, 3, 1, 2, 4]$$$ for $$$m = 5$$$.', 'The first line contains the only integer $$$t$$$ ($$$1 \le t \le 1000$$$)  — the number of test cases in the input. The next lines contain the description of test cases.

The first line of a test case contains a number $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the length of the given permutation $$$p$$$. The next line contains $$$n$$$ integers $$$p_1, p_2, \ldots, p_n$$$ ($$$1 \le p_i \le n$$$, all $$$p_i$$$ are different) — the given permutation $$$p$$$.

It is guaranteed, that the sum of $$$n$$$ from all test cases in the input doesn''t exceed $$$2 \cdot 10^5$$$.', 'Print $$$t$$$ lines — the answers to test cases in the order they are given in the input. 

The answer to a test case is the string of length $$$n$$$, there the $$$i$$$-th character is equal to $$$1$$$ if $$$i$$$ is a beautiful number and is equal to $$$0$$$ if $$$i$$$ is not a beautiful number.', '($$$1 \le m \le n$$$) ($$$1 \le l \le r \le n$$$) ($$$1 \le m \le n$$$) ($$$1 \le t \le 1000$$$) ($$$1 \le n \le 2 \cdot 10^5$$$)', '[{"input":"","output":"3\n6\n4 5 1 3 2 6\n5\n5 3 1 2 4\n4\n1 4 3 2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1265b-a1', 'cf-1265b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1265B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('hdu-3282', 'Running Median', 'HDU', 'https://vjudge.net/problem/HDU-3282', 1500, 'For this problem, you will write a program that reads in a sequence of 32-bit signed integers. After each odd-indexed value is read, output the median (middle value) of the elements received so far.

## Input

The first line of input contains a single integer P, (1 ≤ P ≤ 1000), which is the number of data sets that follow. The first line of each data set contains the data set number, followed by a space, followed by an odd decimal integer M, (1 ≤ M ≤ 9999), giving the total number of signed integers to be processed.
The remaining line(s) in the dataset consists of the values, 10 per line, separated by a single space.
The last line in the dataset may contain less than 10 values.

## Output

For each data set the first line of output contains the data set number, a single space and the number of medians output (which should be one-half the number of input values plus one). The output medians will be on the following lines, 10 per line separated by a single space. The last line may have less than 10 elements, but at least 1 element. There should be no blank lines in the output.

## Sample

Input
    Output

    3
1 9
1 2 3 4 5 6 7 8 9
2 9
9 8 7 6 5 4 3 2 1
3 23
23 41 13 22 -3 24 -31 -11 -8 -7
3 5 103 211 -311 -45 -67 -73 -81 -99
-33 24 56
    1 5
1 2 3 4 5
2 5
9 8 7 6 5
3 12
23 23 22 22 13 3 5 5 3 -3
-7 -3', 'The first line of input contains a single integer P, (1 ≤ P ≤ 1000), which is the number of data sets that follow. The first line of each data set contains the data set number, followed by a space, followed by an odd decimal integer M, (1 ≤ M ≤ 9999), giving the total number of signed integers to be processed.
The remaining line(s) in the dataset consists of the values, 10 per line, separated by a single space.
The last line in the dataset may contain less than 10 values.', 'For each data set the first line of output contains the data set number, a single space and the number of medians output (which should be one-half the number of input values plus one). The output medians will be on the following lines, 10 per line separated by a single space. The last line may have less than 10 elements, but at least 1 element. There should be no blank lines in the output.', '(1 ≤ P ≤ 1000) (1 ≤ M ≤ 9999)', '[{"input":"The first line of input contains a single integer P, (1 ≤ P ≤ 1000), which is the number of data sets that follow. The first line of each data set contains the data set number, followed by a space, followed by an odd decimal integer M, (1 ≤ M ≤ 9999), giving the total number of signed integers to be processed.\nThe remaining line(s) in the dataset consists of the values, 10 per line, separated by a single space.\nThe last line in the dataset may contain less than 10 values.\n\n##","output":"For each data set the first line of output contains the data set number, a single space and the number of medians output (which should be one-half the number of input values plus one). The output medians will be on the following lines, 10 per line separated by a single space. The last line may have less than 10 elements, but at least 1 element. There should be no blank lines in the output."},{"input":"","output":"3\n1 9\n1 2 3 4 5 6 7 8 9\n2 9\n9 8 7 6 5 4 3 2 1\n3 23\n23 41 13 22 -3 24 -31 -11 -8 -7\n3 5 103 211 -311 -45 -67 -73 -81 -99\n-33 24 56\n    1 5\n1 2 3 4 5\n2 5\n9 8 7 6 5\n3 12\n23 23 22 22 13 3 5 5 3 -3\n-7 -3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('hdu-3282-a1', 'hdu-3282', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: HDU-3282']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('poj-1250', 'Tanning Salon', 'POJ', 'http://poj.org/problem?id=1250', 1500, 'Tan Your Hide, Inc., owns several coin-operated tanning salons. Research has shown that if a customer arrives and there are no beds available, the customer will turn around and leave, thus costing the company a sale. Your task is to write a program that tells the company how many customers left without tanning.

## Input

The input consists of data for one or more salons, followed by a line containing the number 0 that signals the end of the input. Data for each salon is a single line containing a positive integer, representing the number of tanning beds in the salon, followed by a space, followed by a sequence of uppercase letters. Letters in the sequence occur in pairs. The first occurrence indicates the arrival of a customer, the second indicates the departure of that same customer. No letter will occur in more than one pair. Customers who leave without tanning always depart before customers who are currently tanning. There are at most 20 beds per salon.

## Output

For each salon, output a sentence telling how many customers, if any, walked away. Use the exact format shown below.

## Sample

Input
    Output

    2 ABBAJJKZKZ
3 GACCBDDBAGEE
3 GACCBGDDBAEE
1 ABCBCA
0
    All customers tanned successfully.
1 customer(s) walked away.
All customers tanned successfully.
2 customer(s) walked away.', 'The input consists of data for one or more salons, followed by a line containing the number 0 that signals the end of the input. Data for each salon is a single line containing a positive integer, representing the number of tanning beds in the salon, followed by a space, followed by a sequence of uppercase letters. Letters in the sequence occur in pairs. The first occurrence indicates the arrival of a customer, the second indicates the departure of that same customer. No letter will occur in more than one pair. Customers who leave without tanning always depart before customers who are currently tanning. There are at most 20 beds per salon.', 'For each salon, output a sentence telling how many customers, if any, walked away. Use the exact format shown below.', 'See statement.', '[{"input":"The input consists of data for one or more salons, followed by a line containing the number 0 that signals the end of the input. Data for each salon is a single line containing a positive integer, representing the number of tanning beds in the salon, followed by a space, followed by a sequence of uppercase letters. Letters in the sequence occur in pairs. The first occurrence indicates the arrival of a customer, the second indicates the departure of that same customer. No letter will occur in more than one pair. Customers who leave without tanning always depart before customers who are currently tanning. There are at most 20 beds per salon.\n\n##","output":"For each salon, output a sentence telling how many customers, if any, walked away. Use the exact format shown below."},{"input":"","output":"2 ABBAJJKZKZ\n3 GACCBDDBAGEE\n3 GACCBGDDBAEE\n1 ABCBCA\n0\n    All customers tanned successfully.\n1 customer(s) walked away.\nAll customers tanned successfully.\n2 customer(s) walked away."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('poj-1250-a1', 'poj-1250', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: POJ-1250']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('spoj-onp', 'Transform the Expression', 'SPOJ', 'https://www.spoj.com/problems/ONP/', 1500, 'Transform the algebraic expression with brackets into RPN form (Reverse Polish Notation). Two-argument operators: +, -, *, /, ^ (priority from the lowest to the highest), brackets ( ). Operands: only letters: a, b ... z. Assume that there is only one RPN form (no expressions like a*b*c).

Input

t [the number of expressions <= 100]
expression [length <= 400]
[other expressions]

Text grouped in [ ] does not appear in the input file.

Output

The expressions in RPN form, one per line.

Example

Input:
3
(a+(b*c))
((a+b)*(z+x))
((a+t)*((b+(a+c))^(c+d)))

Output:
abc*+
ab+zx+*
at+bac++cd+^*', 'See statement.', 'See statement.', 'See statement.', '[{"input":"t [the number of expressions <= 100]\nexpression [length <= 400]\n[other expressions]\n\nText grouped in [ ] does not appear in the input file.","output":"The expressions in RPN form, one per line."},{"input":":\n3\n(a+(b*c))\n((a+b)*(z+x))\n((a+t)*((b+(a+c))^(c+d)))","output":":\nabc*+\nab+zx+*\nat+bac++cd+^*"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('spoj-onp-a1', 'spoj-onp', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: SPOJ-ONP']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('spoj-jnext', 'Just Next !!!', 'SPOJ', 'https://www.spoj.com/problems/JNEXT/', 1500, 'DevG likes too much fun to do with numbers.
Once his friend Arya came and gave him a challenge,
he gave DevG an array of digits which is forming a number currently (will be called as given number).
DevG was challenged to find the just next greater number which can be formed using digits of given number.
Now DevG needs your help to find that just next greater number and win the challenge.

Input

The first line have t number of test cases (1 ≤ t ≤ 100).
In next 2×t lines for each test case first there is number n (1 ≤ n ≤ 1000000)
which denotes the number of digits in given number and
next line contains n digits of given number separated by space.

Output

Print the just next greater number if possible else print -1 in one line for each test case.

Note : There will be no test case which contains zero in starting digits of any given number.

Example

    Input
    Output

    2
5
1 5 4 8 3
10
1 4 7 4 5 8 4 1 2 6

    15834
1474584162', 'See statement.', 'See statement.', '(1 ≤ t ≤ 100) (1 ≤ n ≤ 1000000)', '[{"input":"The first line have t number of test cases (1 ≤ t ≤ 100).\nIn next 2×t lines for each test case first there is number n (1 ≤ n ≤ 1000000)\nwhich denotes the number of digits in given number and\nnext line contains n digits of given number separated by space.","output":"Print the just next greater number if possible else print -1 in one line for each test case."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('spoj-jnext-a1', 'spoj-jnext', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: SPOJ-JNEXT']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1728c', 'Digital Logarithm', 'Codeforces', 'https://codeforces.com/problemset/problem/1728/C', 1500, 'Let''s define $$$f(x)$$$ for a positive integer $$$x$$$ as the length of the base-10 representation of $$$x$$$ without leading zeros. I like to call it a digital logarithm. Similar to a digital root, if you are familiar with that.

You are given two arrays $$$a$$$ and $$$b$$$, each containing $$$n$$$ positive integers. In one operation, you do the following:

 -  pick some integer $$$i$$$ from $$$1$$$ to $$$n$$$;
-  assign either $$$f(a_i)$$$ to $$$a_i$$$ or $$$f(b_i)$$$ to $$$b_i$$$.
Two arrays are considered similar to each other if you can rearrange the elements in both of them, so that they are equal (e. g. $$$a_i = b_i$$$ for all $$$i$$$ from $$$1$$$ to $$$n$$$).

What''s the smallest number of operations required to make $$$a$$$ and $$$b$$$ similar to each other?

## Input

The first line contains a single integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of testcases.

The first line of the testcase contains a single integer $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the number of elements in each of the arrays.

The second line contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i < 10^9$$$).

The third line contains $$$n$$$ integers $$$b_1, b_2, \dots, b_n$$$ ($$$1 \le b_j < 10^9$$$).

The sum of $$$n$$$ over all testcases doesn''t exceed $$$2 \cdot 10^5$$$.

## Output

For each testcase, print the smallest number of operations required to make $$$a$$$ and $$$b$$$ similar to each other.

## Examples

Input
    Output

    4
1
1
1000
4
1 2 3 4
3 1 4 2
3
2 9 3
1 100 9
10
75019 709259 5 611271314 9024533 81871864 9 3 6 4865
9503 2 371245467 6 7 37376159 8 364036498 52295554 169

    2
0
2
18

## Note

In the first testcase, you can apply the digital logarithm to $$$b_1$$$ twice.

In the second testcase, the arrays are already similar to each other.

In the third testcase, you can first apply the digital logarithm to $$$a_1$$$, then to $$$b_2$$$.', 'The first line contains a single integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of testcases.

The first line of the testcase contains a single integer $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the number of elements in each of the arrays.

The second line contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i < 10^9$$$).

The third line contains $$$n$$$ integers $$$b_1, b_2, \dots, b_n$$$ ($$$1 \le b_j < 10^9$$$).

The sum of $$$n$$$ over all testcases doesn''t exceed $$$2 \cdot 10^5$$$.', 'For each testcase, print the smallest number of operations required to make $$$a$$$ and $$$b$$$ similar to each other.', '($$$1 \le t \le 10^4$$$) ($$$1 \le n \le 2 \cdot 10^5$$$) ($$$1 \le a_i < 10^9$$$) ($$$1 \le b_j < 10^9$$$)', '[{"input":"","output":"4\n1\n1\n1000\n4\n1 2 3 4\n3 1 4 2\n3\n2 9 3\n1 100 9\n10\n75019 709259 5 611271314 9024533 81871864 9 3 6 4865\n9503 2 371245467 6 7 37376159 8 364036498 52295554 169"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1728c-a1', 'cf-1728c', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1728C']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10041', 'Vito''s Family', 'UVA', 'https://vjudge.net/problem/UVA-10041', 1500, 'Tommy Shelby, the well-known member of the famous street gang The Peaky Blinders is moving to Birmingham. His family lives there in Adderly Street. They are a very close family and have regular meetings to plan their next move. Tommy wants to find a house close to them so he can visit them regularly.

Tommy has zero idea about how to minimize the total distance to all his family members’ houses and has hired you to help him solve this problem using your programming skills.

Input

You will receive several test cases. The first line will contain the number of test cases you need to address. For each test case you will have the number of family members m which is an integer number between 0 and 500 exclusive, the street numbers where they live n1, n2, …, ni, …, nr; where ni is an integer number between 0 and 30000 exclusive. It is important to note that several family members could live in the same street number.

Output

For each test case your program must write the minimal sum of distances from the optimal Tommy’s house to each one of his relatives. The distance between two street numbers ni and nj is dij = |ni - nj|

Sample Input

2

2 2 4

3 2 4 6

Sample Output

2

4', 'See statement.', 'See statement.', 'See statement.', '[{"input":"You will receive several test cases. The first line will contain the number of test cases you need to address. For each test case you will have the number of family members m which is an integer number between 0 and 500 exclusive, the street numbers where they live n1, n2, …, ni, …, nr; where ni is an integer number between 0 and 30000 exclusive. It is important to note that several family members could live in the same street number.","output":"For each test case your program must write the minimal sum of distances from the optimal Tommy’s house to each one of his relatives. The distance between two street numbers ni and nj is dij = |ni - nj|"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10041-a1', 'uva-10041', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10041']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10191', 'Longest Nap', 'UVA', 'https://vjudge.net/problem/UVA-10191', 1500, '## Description

Helen Chufe is a good programmer who works for a big tech company, but she is somehow lazy and loves to take a nap during the day; however, she has a very busy schedule with lot of meetings, scrum ceremonies, code reviews and pair programming sessions so she does not have a lot of chances of taking her so precious nap.

She wants to take only a nap per day, and it should be the longest one possible given her schedule. She is very busy and does not want to waste the opportunity to take that nap, so she asks you to help her writing a program to find that longest slot of free time so she can sleep as an angel.

## Input

The input will contain several numbers of test cases representing one day of Helen’s schedule.

The first line of each test case will contain an integer e between 1 and 100 representing the number of events all along their day. The next e lines contains those events in the format:

StartTime EndTime EventName

Where:

  - StartTime: is the time where the event starts

  - EndTime: is the time where the event ends

  - EventName: is the event name

All times will have the hh:mm format and StartTime is always less than EndTime. Both will be separated by a single space and all times will be longer than 10.00 and less or equal to 18.00 (10 hh mm

The EventName is a string no longer than 255 characters.

You CAN’T assume, however, that the input will be in any specific order. You must read the input until you reach the end of file.

## Output

For each test case, you must print the following line:

Day #d: the longest nap starts at hh : mm and will last for [H hours and] M minutes.

Where d stands for the number of the test case (starting from 1) and hh : mm is the time when the nap can start.

Notice that you don’t have to worry with concordance (i.e. you must print ''1 minutes'' or ''1 hours'' if it’s the case).

If there is more than one longest nap with the same duration, print the earliest one. You may safely assume that there will be at least one possible nap.

## Sample Input

4

10:00 12:00 Pair Programming

12:00 13:00 Lunch time

13:00 15:00 Retrospective Meeting

15:30 17:45 Planning

4

10:00 12:00 Pair Programming

12:00 13:00 Lunch time

13:00 15:00 Code Reviews

16:45 17:45 Pair Programming

4

10:00 12:00 Pair Programming

12:00 13:00 Lunch time
13:00 15:00 Code Reviews

15:30 17:15 One on One with Jeffrey

1

12:00 13:00 Lunch time

## Sample Output

Day #1: the longest nap starts at 15:00 and will last for 30 minutes.

Day #2: the longest nap starts at 15:00 and will last for 1 hours and 45 minutes.

Day #3: the longest nap starts at 17:15 and will last for 45 minutes.

Day #4: the longest nap starts at 13:00 and will last for 5 hours and 0 minutes.', 'The input will contain several numbers of test cases representing one day of Helen’s schedule.

The first line of each test case will contain an integer e between 1 and 100 representing the number of events all along their day. The next e lines contains those events in the format: 

StartTime EndTime EventName

Where:

  - StartTime: is the time where the event starts

  - EndTime: is the time where the event ends

  - EventName: is the event name

All times will have the hh:mm format and StartTime is always less than EndTime. Both will be separated by a single space and all times will be longer than 10.00 and less or equal to 18.00 (10 hh mm 

The EventName is a string no longer than 255 characters. 

You CAN’T assume, however, that the input will be in any specific order. You must read the input until you reach the end of file.', 'For each test case, you must print the following line:

Day #d: the longest nap starts at hh : mm and will last for [H hours and] M minutes.

Where d stands for the number of the test case (starting from 1) and hh : mm is the time when the nap can start.

Notice that you don’t have to worry with concordance (i.e. you must print ''1 minutes'' or ''1 hours'' if it’s the case).

If there is more than one longest nap with the same duration, print the earliest one. You may safely assume that there will be at least one possible nap.', '(starting from 1) (i.e. you must print ''1 minutes'' or ''1 hours'' if it’s the case)', '[{"input":"The input will contain several numbers of test cases representing one day of Helen’s schedule.\n\nThe first line of each test case will contain an integer e between 1 and 100 representing the number of events all along their day. The next e lines contains those events in the format:\n\nStartTime EndTime EventName\n\nWhere:\n\n  - StartTime: is the time where the event starts\n\n  - EndTime: is the time where the event ends\n\n  - EventName: is the event name\n\nAll times will have the hh:mm format and StartTime is always less than EndTime. Both will be separated by a single space and all times will be longer than 10.00 and less or equal to 18.00 (10 hh mm\n\nThe EventName is a string no longer than 255 characters.\n\nYou CAN’T assume, however, that the input will be in any specific order. You must read the input until you reach the end of file.\n\n##","output":"For each test case, you must print the following line:"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10191-a1', 'uva-10191', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10191']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-299', 'Train Swapping', 'UVA', 'https://vjudge.net/problem/UVA-299', 1500, 'At an old railway station, you may still encounter one of the last remaining ``train swappers''''. A train swapper is an employee of the railroad, whose sole job it is to rearrange the carriages of trains.

	Once the carriages are arranged in the optimal order, all the train driver has to do, is drop the carriages off, one by one, at the stations for which the load is meant.

	The title ``train swapper'''' stems from the first person who performed this task, at a station close to a railway bridge. Instead of opening up vertically, the bridge rotated around a pillar in the center of the river. After rotating the bridge 90 degrees, boats could pass left or right.

	The first train swapper had discovered that the bridge could be operated with at most two carriages on it. By rotating the bridge 180 degrees, the carriages switched place, allowing him to rearrange the carriages (as a side effect, the carriages then faced the opposite direction, but train carriages can move either way, so who cares).

	Now that almost all train swappers have died out, the railway company would like to automate their operation. Part of the program to be developed, is a routine which decides for a given train the least number of swaps of two adjacent carriages necessary to order the train. Your assignment is to create that routine.

## Input

The input contains on the first line the number of test cases (N). Each test case consists of two input lines. The first line of a test case contains an integer L, determining the length of the train (0 ≤ L ≤ 50). The second line of a test case contains a permutation of the numbers 1 through L, indicating the current order of the carriages. The carriages should be ordered such that carriage 1 comes first, then 2, etc. with carriage L coming last.

## Output

For each test case output the sentence: ''Optimal train swapping takes S swaps.'' where S is an integer.

## Sample Input

3
3
1 3 2
4
4 3 2 1
2
2 1

## Sample Output

Optimal train swapping takes 1 swaps.
Optimal train swapping takes 6 swaps.
Optimal train swapping takes 1 swaps.', 'The input contains on the first line the number of test cases (N). Each test case consists of two input lines. The first line of a test case contains an integer L, determining the length of the train (0 ≤ L ≤ 50). The second line of a test case contains a permutation of the numbers 1 through L, indicating the current order of the carriages. The carriages should be ordered such that carriage 1 comes first, then 2, etc. with carriage L coming last.', 'For each test case output the sentence: &#39;Optimal train swapping takes S swaps.&#39; where S is an integer.', '(0 ≤ L ≤ 50)', '[{"input":"The input contains on the first line the number of test cases (N). Each test case consists of two input lines. The first line of a test case contains an integer L, determining the length of the train (0 ≤ L ≤ 50). The second line of a test case contains a permutation of the numbers 1 through L, indicating the current order of the carriages. The carriages should be ordered such that carriage 1 comes first, then 2, etc. with carriage L coming last.\n\n##","output":"For each test case output the sentence: ''Optimal train swapping takes S swaps.'' where S is an integer."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-299-a1', 'uva-299', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-299']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-981a', 'Antipalindrome', 'Codeforces', 'https://codeforces.com/problemset/problem/981/A', 1500, 'A string is a palindrome if it reads the same from the left to the right and from the right to the left. For example, the strings "kek", "abacaba", "r" and "papicipap" are palindromes, while the strings "abb" and "iq" are not.

A substring $$$s[l \ldots r]$$$ ($$$1 \leq l \leq r \leq |s|$$$) of a string $$$s = s_{1}s_{2} \ldots s_{|s|}$$$ is the string $$$s_{l}s_{l + 1} \ldots s_{r}$$$.

Anna does not like palindromes, so she makes her friends call her Ann. She also changes all the words she reads in a similar way. Namely, each word $$$s$$$ is changed into its longest substring that is not a palindrome. If all the substrings of $$$s$$$ are palindromes, she skips the word at all.

Some time ago Ann read the word $$$s$$$. What is the word she changed it into?

## Input

The first line contains a non-empty string $$$s$$$ with length at most $$$50$$$ characters, containing lowercase English letters only.

## Output

If there is such a substring in $$$s$$$ that is not a palindrome, print the maximum length of such a substring. Otherwise print $$$0$$$.

Note that there can be multiple longest substrings that are not palindromes, but their length is unique.

## Examples

Input
    Output

    mew

    3

Input
    Output

    wuffuw

    5

Input
    Output

    qqqqqqqq

    0

## Note

"mew" is not a palindrome, so the longest substring of it that is not a palindrome, is the string "mew" itself. Thus, the answer for the first example is $$$3$$$.

The string "uffuw" is one of the longest non-palindrome substrings (of length $$$5$$$) of the string "wuffuw", so the answer for the second example is $$$5$$$.

All substrings of the string "qqqqqqqq" consist of equal characters so they are palindromes. This way, there are no non-palindrome substrings. Thus, the answer for the third example is $$$0$$$.', 'The first line contains a non-empty string $$$s$$$ with length at most $$$50$$$ characters, containing lowercase English letters only.', 'If there is such a substring in $$$s$$$ that is not a palindrome, print the maximum length of such a substring. Otherwise print $$$0$$$.

Note that there can be multiple longest substrings that are not palindromes, but their length is unique.', '($$$1 \leq l \leq r \leq |s|$$$) (of length $$$5$$$)', '[{"input":"","output":"mew"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-981a-a1', 'cf-981a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-981A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10137', 'The Trip', 'UVA', 'https://vjudge.net/problem/UVA-10137', 1500, 'A number of students are members of a club that travels annually to exotic locations. Their destinations in the past have included Indianapolis, Phoenix, Nashville, Philadelphia, San Jose, and Atlanta. This spring they are planning a trip to Eindhoven.

	The group agrees in advance to share expenses equally, but it is not practical to have them share every expense as it occurs. So individuals in the group pay for particular things, like meals, hotels, taxi rides, plane tickets, etc. After the trip, each student''s expenses are tallied and money is exchanged so that the net cost to each is the same, to within one cent. In the past, this money exchange has been tedious and time consuming. Your job is to compute, from a list of expenses, the minimum amount of money that must change hands in order to equalize (within a cent) all the students'' costs.

## Input

Standard input will contain the information for several trips. The information for each trip consists of a line containing a positive integer, n, the number of students on the trip, followed by n lines of input, each containing the amount, in dollars and cents, spent by a student. There are no more than 1000 students and no student spent more than $10,000.00. A single line containing 0 follows the information for the last trip.

## Output

For each trip, output a line stating the total amount of money, in dollars and cents, that must be exchanged to equalize the students'' costs.

## Sample Input

3
10.00
20.00
30.00
4
15.00
15.01
3.00
3.01
0

## Sample Output

$10.00
$11.99', 'Standard input will contain the information for several trips. The information for each trip consists of a line containing a positive integer, n, the number of students on the trip, followed by n lines of input, each containing the amount, in dollars and cents, spent by a student. There are no more than 1000 students and no student spent more than $10,000.00. A single line containing 0 follows the information for the last trip.', 'For each trip, output a line stating the total amount of money, in dollars and cents, that must be exchanged to equalize the students&#39; costs.', 'See statement.', '[{"input":"Standard input will contain the information for several trips. The information for each trip consists of a line containing a positive integer, n, the number of students on the trip, followed by n lines of input, each containing the amount, in dollars and cents, spent by a student. There are no more than 1000 students and no student spent more than $10,000.00. A single line containing 0 follows the information for the last trip.\n\n##","output":"For each trip, output a line stating the total amount of money, in dollars and cents, that must be exchanged to equalize the students'' costs."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10137-a1', 'uva-10137', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10137']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-408a', 'Line to Cashier', 'Codeforces', 'https://codeforces.com/problemset/problem/408/A', 1500, 'Little Vasya went to the supermarket to get some groceries. He walked about the supermarket for a long time and got a basket full of products. Now he needs to choose the cashier to pay for the products.

There are n cashiers at the exit from the supermarket. At the moment the queue for the i-th cashier already has ki people. The j-th person standing in the queue to the i-th cashier has mi, j items in the basket. Vasya knows that:

 -  the cashier needs 5 seconds to scan one item;
-  after the cashier scans each item of some customer, he needs 15 seconds to take the customer''s money and give him the change.
Of course, Vasya wants to select a queue so that he can leave the supermarket as soon as possible. Help him write a program that displays the minimum number of seconds after which Vasya can get to one of the cashiers.

## Input

The first line contains integer n (1 ≤ n ≤ 100) — the number of cashes in the shop. The second line contains n space-separated integers: k1, k2, ..., kn (1 ≤ ki ≤ 100), where ki is the number of people in the queue to the i-th cashier.

The i-th of the next n lines contains ki space-separated integers: mi, 1, mi, 2, ..., mi, ki (1 ≤ mi, j ≤ 100) — the number of products the j-th person in the queue for the i-th cash has.

## Output

Print a single integer — the minimum number of seconds Vasya needs to get to the cashier.

## Examples

Input
    Output

    1
1
1

    20

Input
    Output

    4
1 4 3 2
100
1 2 2 3
1 9 1
7 8

    100

## Note

In the second test sample, if Vasya goes to the first queue, he gets to the cashier in 100·5 + 15 = 515 seconds. But if he chooses the second queue, he will need 1·5 + 2·5 + 2·5 + 3·5 + 4·15 = 100 seconds. He will need 1·5 + 9·5 + 1·5 + 3·15 = 100 seconds for the third one and 7·5 + 8·5 + 2·15 = 105 seconds for the fourth one. Thus, Vasya gets to the cashier quicker if he chooses the second or the third queue.', 'The first line contains integer n (1 ≤ n ≤ 100) — the number of cashes in the shop. The second line contains n space-separated integers: k1, k2, ..., kn (1 ≤ ki ≤ 100), where ki is the number of people in the queue to the i-th cashier.

The i-th of the next n lines contains ki space-separated integers: mi, 1, mi, 2, ..., mi, ki (1 ≤ mi, j ≤ 100) — the number of products the j-th person in the queue for the i-th cash has.', 'Print a single integer — the minimum number of seconds Vasya needs to get to the cashier.', '(1 ≤ n ≤ 100) (1 ≤ ki ≤ 100) (1 ≤ mi, j ≤ 100)', '[{"input":"","output":"1\n1\n1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-408a-a1', 'cf-408a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-408A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-810a', 'Straight <<A>>', 'Codeforces', 'https://codeforces.com/problemset/problem/810/A', 1500, 'Noora is a student of one famous high school. It''s her final year in school — she is going to study in university next year. However, she has to get an «A» graduation certificate in order to apply to a prestigious one.

In school, where Noora is studying, teachers are putting down marks to the online class register, which are integers from 1 to k. The worst mark is 1, the best is k. Mark that is going to the certificate, is calculated as an average of all the marks, rounded to the closest integer. If several answers are possible, rounding up is produced. For example, 7.3 is rounded to 7, but 7.5 and 7.8784 — to 8.

For instance, if Noora has marks [8, 9], then the mark to the certificate is 9, because the average is equal to 8.5 and rounded to 9, but if the marks are [8, 8, 9], Noora will have graduation certificate with 8.

To graduate with «A» certificate, Noora has to have mark k.

Noora got n marks in register this year. However, she is afraid that her marks are not enough to get final mark k. Noora decided to ask for help in the internet, where hacker Leha immediately responded to her request. He is ready to hack class register for Noora and to add Noora any number of additional marks from 1 to k. At the same time, Leha want his hack be unseen to everyone, so he decided to add as less as possible additional marks. Please help Leha to calculate the minimal number of marks he has to add, so that final Noora''s mark will become equal to k.

## Input

The first line contains two integers n and k (1 ≤ n ≤ 100, 1 ≤ k ≤ 100) denoting the number of marks, received by Noora and the value of highest possible mark.

The second line contains n integers a1, a2, ..., an (1 ≤ ai ≤ k) denoting marks received by Noora before Leha''s hack.

## Output

Print a single integer — minimal number of additional marks, that Leha has to add in order to change Noora''s final mark to k.

## Examples

Input
    Output

    2 10
8 9

    4

Input
    Output

    3 5
4 4 4

    3

## Note

Consider the first example testcase.

Maximal mark is 10, Noora received two marks — 8 and 9, so current final mark is 9. To fix it, Leha can add marks [10, 10, 10, 10] (4 marks in total) to the registry, achieving Noora having average mark equal to . Consequently, new final mark is 10. Less number of marks won''t fix the situation.

In the second example Leha can add [5, 5, 5] to the registry, so that making average mark equal to 4.5, which is enough to have 5 in the certificate.', 'The first line contains two integers n and k (1 ≤ n ≤ 100, 1 ≤ k ≤ 100) denoting the number of marks, received by Noora and the value of highest possible mark.

The second line contains n integers a1, a2, ..., an (1 ≤ ai ≤ k) denoting marks received by Noora before Leha''s hack.', 'Print a single integer — minimal number of additional marks, that Leha has to add in order to change Noora''s final mark to k.', '(1 ≤ n ≤ 100, 1 ≤ k ≤ 100) (1 ≤ ai ≤ k) (4 marks in total)', '[{"input":"","output":"2 10\n8 9"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-810a-a1', 'cf-810a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-810A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-10038', 'Jolly Jumpers', 'UVA', 'https://vjudge.net/problem/UVA-10038', 1500, 'Jumping is healthy. But excess of anything is bad. So, You want to jump in a perfect discipline. You become healthy if the absolute values of the difference between every consecutive pair of integers are all numbers from 1 through n-1, where n is the size of the sequence. For example,

4 2 1 -2

is such a sequence that can make you healthy. Because the absolute differences are 2, 1 and 3 respectively. Now can you help yourself to become healthy?

## Input

The input consists of multiple lines, each containing an integer n which does not exceed 3000 followed by n integers which represent the sequence.

## Output

For each line of input, generate a line of output saying "Jolly" or "Not jolly".

## Sample Input

4 1 4 2 3
5 1 4 2 -1 6

## Sample Output

Jolly
Not jolly', 'The input consists of multiple lines, each containing an integer n which does not exceed 3000 followed by n integers which represent the sequence.', 'For each line of input, generate a line of output saying "Jolly" or "Not jolly".', 'See statement.', '[{"input":"The input consists of multiple lines, each containing an integer n which does not exceed 3000 followed by n integers which represent the sequence.\n\n##","output":"For each line of input, generate a line of output saying \"Jolly\" or \"Not jolly\"."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-10038-a1', 'uva-10038', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-10038']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-673', 'Parentheses Balance', 'UVA', 'https://vjudge.net/problem/UVA-673', 1500, 'You are given a string consisting of parentheses () and []. A string of this type is said to be correct:

(a) if it is the empty string

(b) if A and B are correct, AB is correct,

(c) if A is correct, (A) and [A] is correct.

Write a program that takes a sequence of strings of this type and check their correctness. Your
program can assume that the maximum string length is 128. Note that the input may contain several arbitary whitespaces (that should not be processed) and may be empty.

Input

A positive integer \(N\) followed by \(N\) strings in separate lines.

Output

Print Yes is the string is correct, otherwise print No.

Sample input

3

([])

(([()])))

([()[]()])()

Sample output

Yes

No

Yes', 'See statement.', 'See statement.', 'See statement.', '[{"input":"A positive integer \\(N\\) followed by \\(N\\) strings in separate lines.","output":"Print Yes is the string is correct, otherwise print No."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-673-a1', 'uva-673', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-673']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-514', 'Rails', 'UVA', 'https://vjudge.net/problem/UVA-514', 1500, 'ZigZagville

    In the city of ZigZagville, there stands a renowned railway hub. This country boasts
incredibly rugged terrain. Erected during the previous century, the railway station
faced severe budget constraints. Consequently, only a ground-level track could be
established. Additionally, due to space limitations, the station could only function as a
terminal station (see illustration). Regrettably, the available area could accommodate
just a single track.

A unique local custom dictates that every incoming train from direction A must be
reconfigured before proceeding in direction B. When a train arrives from direction A,
it comprises N ≤ 1000 coaches numbered in ascending order from 1 to N . The train
reconfiguration manager must ascertain the feasibility of rearranging the coaches for
their onward journey in direction B, adhering to the order a1, a2, . . . , aN. Your task
is to design a program that determines whether such a rearrangement is achievable.
It’s important to note that individual coaches can be detached from the train prior
to entering the station. These coaches are capable of self-propulsion until they reach
the track in direction B. Furthermore, it’s assumed that any number of coaches can
be stationed at the station simultaneously. However, once a coach enters the station,
it cannot return to the track in direction A. Similarly, once a coach departs from the
station in direction B, it cannot return.

Input

    The input file consists of blocks of lines. Each block except the last describes one
train and possibly more requirements for its reorganization. In the first line of the
block there is the integer N described above. In each of the next lines of the block
there is a permutation of 1, 2, . . . , N . The last line of the block contains just ‘0’.

    The last block consists of just one line containing ‘0’.

Output

    The output file contains the lines corresponding to the lines with permutations in
the input file. A line of the output file contains ‘Yes’ if it is possible to marshal the
coaches in the order required on the corresponding line of the input file. Otherwise,
it contains ‘No’. In addition, there is one empty line after the lines corresponding to one block of the input file. There is no line in the output file corresponding to the
last “null” block of the input file.

Input
    Output

    5
1 2 3 4 5
5 4 1 2 3
0
6
6 5 4 3 2 1
0
0

    Yes
No

Yes', 'See statement.', 'See statement.', 'See statement.', '[{"input":"The input file consists of blocks of lines. Each block except the last describes one\ntrain and possibly more requirements for its reorganization. In the first line of the\nblock there is the integer N described above. In each of the next lines of the block\nthere is a permutation of 1, 2, . . . , N . The last line of the block contains just ‘0’.\n\n    The last block consists of just one line containing ‘0’.","output":"The output file contains the lines corresponding to the lines with permutations in\nthe input file. A line of the output file contains ‘Yes’ if it is possible to marshal the\ncoaches in the order required on the corresponding line of the input file. Otherwise,\nit contains ‘No’. In addition, there is one empty line after the lines corresponding to one block of the input file. There is no line in the output file corresponding to the\nlast “null” block of the input file."},{"input":"","output":"5\n1 2 3 4 5\n5 4 1 2 3\n0\n6\n6 5 4 3 2 1\n0\n0"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-514-a1', 'uva-514', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-514']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('kattis-busassignment', 'Bus Capivarão', 'Kattis', 'https://open.kattis.com/problems/busassignment', 1500, 'The Institution for Carrying People Carefully is responsible
    for managing the famous Line Bus in Line Town. The Line Bus
    goes through $n$ stops
    conveniently numbered from $1$ to $n$. At stop $i$, $a_i$ people first get off the bus.
    Then, $b_i$ people get on
    the bus. The bus starts out empty at stop $1$ and then goes through the stops in
    numerically increasing order, eventually stopping at stop
    $n$ where the bus
    empties.

    When someone rides the Line Bus, they must be seated. A bus
    with capacity $c$ has
    exactly $c$ seats for
    passengers. Each rider of the Line Bus occupies exactly one
    seat. The driver of the Line Bus is not counted. The
    Institution for Carrying People Carefully wants to know what is
    the minimum capacity bus needed to run the Line Bus.

    Input

    The first line contains a single integer, $n$ $(2
    \le n \le 2 \cdot 10^5)$.

    Each of the next $n$
    lines contains two integers, $a_i$ and $b_i$ $(0 \le a_i, b_i \le 10^9)$. It is
    guaranteed that at least one person boards the bus, at most
    $10^9$ people board the
    bus over all stops, and that the bus will empty at stop
    $n$.

    Output

    Output a single integer, the minimum capacity bus needed to
    run the Line Bus.

    Sample 1

    Input
    Output

    4
0 3
1 2
2 1
3 0

    4', 'See statement.', 'See statement.', '(2
    \le n \le 2 \cdot 10^5) (0 \le a_i, b_i \le 10^9)', '[{"input":"The first line contains a single integer, $n$ $(2\n    \\le n \\le 2 \\cdot 10^5)$.\n\n    Each of the next $n$\n    lines contains two integers, $a_i$ and $b_i$ $(0 \\le a_i, b_i \\le 10^9)$. It is\n    guaranteed that at least one person boards the bus, at most\n    $10^9$ people board the\n    bus over all stops, and that the bus will empty at stop\n    $n$.","output":"Output a single integer, the minimum capacity bus needed to\n    run the Line Bus."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('kattis-busassignment-a1', 'kattis-busassignment', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Kattis-busassignment']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('poj-1576', 'Cartas Coloridas', 'POJ', 'http://poj.org/problem?id=1576', 1500, 'A simple matching game for children uses a board that is a sequence of colored squares. Each player has a game piece. Players alternate turns, drawing cards containing either one colored square or two colored squares of the same color. Players move their pieces forward on the board to the next square that matches the single color on the card, or forward to the second matching square if the card contains two colored squares, or forward to the last square on the board if there is no square matching the description above. A player wins if his piece lands on the last square of the board. It is possible for all the cards to be drawn and still not have a winner.

This problem represents colors with capital letters from A-Z. Below is a diagram of a sample board.

Consider the deck of cards: R, B, GG, Y, P, B, P, RR

For 3 players, the game proceeds as follows:

Player 1 draws R, moves to 1st square
Player 2 draws B, moves to 5th square
Player 3 draws GG, moves to 8th square
Player 1 draws Y, moves to 2nd square
Player 2 draws P, moves to 11th square
Player 3 draws B, moves to 9th square
Player 1 draws P, moves to 4th square
Player 2 draws RR, Wins! (no Rs in front of piece so it goes to last square)

Using the same board and the same deck of cards, but with 2 players, Player 1 wins after 7 cards. With 4 players, no one wins after exhausting the deck of 8 cards.

## Input

Input consists of information for one or more games. Each game starts with one line containing the number of players (1-4), the number of squares on the board (1-79), and the number of cards in the deck (1-200). This is followed by a single line of characters representing the colored squares on the board. Following this are the cards in the deck, one card per line. Cards can have only a single character, or two of the same character. The end of the input is signalled by a line with 0 for the number of players - the other two values will be present but indeterminate.

## Output

For each game, the output is either the winning player and the total number of cards drawn, or the number of cards in the deck, as shown in the sample output. Always use the plural "cards".

## Sample

Input
    Output

    2 13 8
RYGPBRYGBRPOP
R
B
GG
Y
P
B
P
RR
2 6 5
RYGRYB
R
YY
G
G
B
3 9 6
QQQQQQQQQ
Q
QQ
Q
Q
QQ
Q
0 6 0
    Player 1 won after 7 cards.
Player 2 won after 4 cards.
No player won after 6 cards.', 'Input consists of information for one or more games. Each game starts with one line containing the number of players (1-4), the number of squares on the board (1-79), and the number of cards in the deck (1-200). This is followed by a single line of characters representing the colored squares on the board. Following this are the cards in the deck, one card per line. Cards can have only a single character, or two of the same character. The end of the input is signalled by a line with 0 for the number of players - the other two values will be present but indeterminate.', 'For each game, the output is either the winning player and the total number of cards drawn, or the number of cards in the deck, as shown in the sample output. Always use the plural "cards".', '(1-4) (1-79) (1-200)', '[{"input":"consists of information for one or more games. Each game starts with one line containing the number of players (1-4), the number of squares on the board (1-79), and the number of cards in the deck (1-200). This is followed by a single line of characters representing the colored squares on the board. Following this are the cards in the deck, one card per line. Cards can have only a single character, or two of the same character. The end of the input is signalled by a line with 0 for the number of players - the other two values will be present but indeterminate.\n\n##","output":"For each game, the output is either the winning player and the total number of cards drawn, or the number of cards in the deck, as shown in the sample output. Always use the plural \"cards\"."},{"input":"","output":"2 13 8\nRYGPBRYGBRPOP\nR\nB\nGG\nY\nP\nB\nP\nRR\n2 6 5\nRYGRYB\nR\nYY\nG\nG\nB\n3 9 6\nQQQQQQQQQ\nQ\nQQ\nQ\nQ\nQQ\nQ\n0 6 0\n    Player 1 won after 7 cards.\nPlayer 2 won after 4 cards.\nNo player won after 6 cards."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('poj-1576-a1', 'poj-1576', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: POJ-1576']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('hackerrank-two-strings', 'Deixando strings iguais', 'HackerRank', 'https://vjudge.net/problem/HackerRank-two-strings', 1500, 'Given two strings, determine if they share a common substring.  A substring may be as small as one character.

Example

These share the common substring .

These do not share a substring.

Function Description

Complete the function twoStrings in the editor below.

twoStrings has the following parameter(s):

- string s1:  a string

- string s2:  another string

Returns

- string: either YES or NO

Input Format

The first line contains a single integer , the number of test cases.

The following  pairs of lines are as follows:

- The first line contains string .

- The second line contains string .

Constraints

-  and  consist of characters in the range ascii[a-z].

-

-

Output Format

For each pair of strings, return YES or NO.

    Input
    Output

    2
hello
world
hi
world

    YES
NO

Explanation

We have  pairs to check:

- , . The substrings  and  are common to both strings.

- , .  and  share no common substrings.', 'See statement.', 'See statement.', '-  and  consist of characters in the range ascii[a-z].', '[{"input":"Format\n\nThe first line contains a single integer , the number of test cases.\n\nThe following  pairs of lines are as follows:\n\n- The first line contains string .\n\n- The second line contains string .\n\nConstraints\n\n-  and  consist of characters in the range ascii[a-z].\n\n-\n\n-","output":"Format"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('hackerrank-two-strings-a1', 'hackerrank-two-strings', 'Pending editorial review', ARRAY['String Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: HackerRank-two-strings']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('eolymp-1812', 'Eleição', 'EOlymp', 'https://vjudge.net/problem/EOlymp-1812', 1500, 'A committee clerk is good at recording votes, but not so good at counting and determining the outcome correctly. As a roll call vote proceeds, the clerk records votes as a sequence of letters, with one letter for every member of the committee:

- Y means a yes vote

- N means a no vote

- P means present, but choosing not to vote

- A indicates a member who was absent from the meeting

Your job is to take this recorded list of votes and determine the outcome.

Rules: There must be a quorum. If at least half of the members were absent, respond "need quorum". Otherwise, votes are counted. If there are more yes than no votes, respond "yes". If there are more no than yes votes, respond "no". If the number of yes and no votes is the same, respond "tie".

## Input

The input contains a series of votes, one per line, followed by a single line with the # character. Each vote consists entirely of the uppercase letters discussed above. Each vote will contain at least two letters and no more than $70$ letters.

## Output

For each vote, the output is one line with the correct choice: "need quorum", "yes", "no" or "tie".

## Examples

Input
    Output

    YNNAPYYNY
YAYAYAYA
PYPPNNYA
YNNAA
NYAAA
#

    yes
need quorum
tie
no
need quorum', 'The input contains a series of votes, one per line, followed by a single line with the # character. Each vote consists entirely of the uppercase letters discussed above. Each vote will contain at least two letters and no more than $70$ letters.', 'For each vote, the output is one line with the correct choice: "need quorum", "yes", "no" or "tie".', 'See statement.', '[{"input":"","output":"YNNAPYYNY\nYAYAYAYA\nPYPPNNYA\nYNNAA\nNYAAA\n#"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('eolymp-1812-a1', 'eolymp-1812', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: EOlymp-1812']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-863b', 'Kayak', 'Codeforces', 'https://codeforces.com/problemset/problem/863/B', 1500, 'Vadim is really keen on travelling. Recently he heard about kayaking activity near his town and became very excited about it, so he joined a party of kayakers.

Now the party is ready to start its journey, but firstly they have to choose kayaks. There are 2·n people in the group (including Vadim), and they have exactly n - 1 tandem kayaks (each of which, obviously, can carry two people) and 2 single kayaks. i-th person''s weight is wi, and weight is an important matter in kayaking — if the difference between the weights of two people that sit in the same tandem kayak is too large, then it can crash. And, of course, people want to distribute their seats in kayaks in order to minimize the chances that kayaks will crash.

Formally, the instability of a single kayak is always 0, and the instability of a tandem kayak is the absolute difference between weights of the people that are in this kayak. Instability of the whole journey is the total instability of all kayaks.

Help the party to determine minimum possible total instability!

## Input

The first line contains one number n (2 ≤ n ≤ 50).

The second line contains 2·n integer numbers w1, w2, ..., w2n, where wi is weight of person i (1 ≤ wi ≤ 1000).

## Output

Print minimum possible total instability.

## Examples

Input
    Output

    2
1 2 3 4

    1

Input
    Output

    4
1 3 4 6 3 4 100 200

    5', 'The first line contains one number n (2 ≤ n ≤ 50).

The second line contains 2·n integer numbers w1, w2, ..., w2n, where wi is weight of person i (1 ≤ wi ≤ 1000).', 'Print minimum possible total instability.', '(2 ≤ n ≤ 50) (1 ≤ wi ≤ 1000)', '[{"input":"","output":"2\n1 2 3 4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-863b-a1', 'cf-863b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-863B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('gym-102951a', 'Maximum Distance', 'Codeforces', 'https://codeforces.com/gym/102951/problem/A', 1500, 'You are given $$$N$$$ $$$(3 \leq N \leq 5000)$$$ integer points on the coordinate plane. Find the square of the maximum Euclidean distance (aka length of the straight line) between any two of the points.

## Input

The first line contains an integer $$$N$$$. The second line contains $$$N$$$ integers, the $$$x$$$-coordinates of the points: $$$x_1, x_2, \dots, x_N$$$ ($$$-1000 \leq x_i \leq 1000$$$). The third line contains $$$N$$$ integers, the $$$y$$$-coordinates of the points: $$$y_1, y_2, \dots, y_N$$$ ($$$-1000 \leq y_i \leq 1000$$$).

## Output

Print one integer, the square of the maximum Euclidean distance between any two of the points.

## Examples

Input
    Output

    3
321 -15 -525
404 373 990

    1059112', 'The first line contains an integer $$$N$$$. The second line contains $$$N$$$ integers, the $$$x$$$-coordinates of the points: $$$x_1, x_2, \dots, x_N$$$ ($$$-1000 \leq x_i \leq 1000$$$). The third line contains $$$N$$$ integers, the $$$y$$$-coordinates of the points: $$$y_1, y_2, \dots, y_N$$$ ($$$-1000 \leq y_i \leq 1000$$$).', 'Print one integer, the square of the maximum Euclidean distance between any two of the points.', '(3 \leq N \leq 5000) ($$$-1000 \leq x_i \leq 1000$$$) ($$$-1000 \leq y_i \leq 1000$$$)', '[{"input":"","output":"3\n321 -15 -525\n404 373 990"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('gym-102951a-a1', 'gym-102951a', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Gym-102951A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('kattis-basketballoneonone', 'Basketball One-on-One', 'Kattis', 'https://open.kattis.com/problems/basketballoneonone', 1500, 'Alice and Barbara played some friendly games of one-on-one
    basketball after work, and you agreed to help them keep score.
    The rules of the game were simple:

      -
        Each successful shot by a player earns them either one
        or two points;

      -
        The first player to eleven points wins, with one
        exception;

      -
        If the score is tied $10$–$10$, the previous rule is
        replaced by a “win by 2” rule: the first player to lead the
        other by at least two points wins.

    So for example, $11$–$7$, $9$–$11$, and $14$–$12$ are possible final scores (but
    not $14$–$13$).

    Whenever Alice or Barbara scored points, you jotted down an
    A or B
    (indicating a score by Alice or by Barbara) followed by a
    1 or 2 (the
    number of points scored). You have some records of the games
    Alice and Barbara played in this format, but do not remember
    who won each game. Can you reconstruct the winner from the game
    record?

    Input

    The input consists of a single line with no more than
    $200$ characters: the
    record of one game. The record consists of single letters
    (either A or B) alternating with single numbers (either
    1 or 2),
    and includes no spaces or other extraneous characters. Each
    record will be a correct scoring history of a single completed
    game, played under the rules described above.

    Output

    Print a single character, either A
    or B: the winner of the recorded
    game.

    Sample 1

    Input
    Output

    A2B1A2B2A1A2A2A2

    A

    Sample 2

    Input
    Output

    A2B2A1B2A2B1A2B2A1B2A1A1B1A1A2

    A', 'See statement.', 'See statement.', '(but
    not $14$–$13$) (either
    1 or 2)', '[{"input":"The input consists of a single line with no more than\n    $200$ characters: the\n    record of one game. The record consists of single letters\n    (either A or B) alternating with single numbers (either\n    1 or 2),\n    and includes no spaces or other extraneous characters. Each\n    record will be a correct scoring history of a single completed\n    game, played under the rules described above.","output":"Print a single character, either A\n    or B: the winner of the recorded\n    game."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('kattis-basketballoneonone-a1', 'kattis-basketballoneonone', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Kattis-basketballoneonone']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('lightoj-1238', 'Correndo pra casa', 'LightOJ', 'https://vjudge.net/problem/LightOJ-1238', 1500, '![Powerpuff Girls][1]

The city of Townsville! This nice city is the home for the power puff girls - Blossom, Bubbles, and Buttercup. To introduce their personality we can sing a song:

<p class="centerme">Blossom, commander and the leader;<br>Bubbles, she is the joy and the laughter;<br>Buttercup, she is the toughest fighter.</p>

These super girls defend Townsville from monsters and supervillains using their superpowers, intelligence. They live in a home in Townsville with the professor who is like their father.

The girls are young now and they don''t like to fight the monsters anymore. So, if they are outside their home, they are found shopping. And when they get back home, they simply watch TV shows. It''s such a horrible fact that the super-intelligent girls are wasting their time watching TV serials that consist of the rivalries between Wives and their Mother in Laws. And when they use computers they are usually found using the face note (a dangerous<sup>1</sup> social networking site).

So, such wonderful girls just became lazy and useless. Often they are seen fighting each other, the comments that can be heard, are like, ''Tulsi is the best.'', ''Gopi is better than Rashee.'' The professor is quite upset with the girls, and he can''t even watch any science show or sports because of these irritating serials.

So, the professor made a plan and asked the girls to go shopping such that he can watch an important science show on the TV. The girls became very excited and they went out shopping. But soon they realize that one of their favorite serials will start soon, and they need to get back home for that serial.

To be more specific let''s consider the city as a 2D grid. In the grid there are some symbols, the meaning of them are:

* `.` means an empty place.
* `a` denotes the position of Blossom.
* `b` denotes the position of Bubbles.
* `c` denotes the position of Buttercup.
* `m` denotes that there is a monster.
* `h` denotes their home.
* `#` denotes a wall and the girls cannot pass through it.

The three girls move simultaneously. And in each minute, from their current cells, they can move to any four adjacent cells (North, East, West, South) if the destination cell is neither a wall nor the cell contains a monster. Because they want to get home as soon as possible, they want to avoid the monsters. You can assume that they can move to a common cell if necessary.

Now you are given the information about the city and their positions. You have to find the minimum time when they all are at home.

[1]: https://static.lightoj.com/images/problem-1238/powerpuff-1605692804974.jpg?style=rightme,haveborder

## Input

Input starts with an integer **T (&le; 100)**, denoting the number of test cases.

Each case starts with a line containing two integers: **m** and **n (4 &le; m, n &le; 20)**, **m** denotes the number of rows and **n** denotes the number of columns of the modeled grid. Each of the next **m** lines contains **n** characters representing the city.

You can assume that `a`, `b`, `c`, `h` will occur exactly once in the grid. The outer boundaries will always be marked by `#`.

## Output

For each case, print the case number and the minimum time needed when they all are in their home. You can assume that a solution will always exist.

## Sample

Input
    Output

    2
6 8
########
#...c..#
#......#
#.a.h.b#
#......#
########
5 9
#########
#mmm...c#
#ma.h####
#m....b.#
#########

    Case 1: 2
Case 2: 4', 'Input starts with an integer **T (&le; 100)**, denoting the number of test cases.

Each case starts with a line containing two integers: **m** and **n (4 &le; m, n &le; 20)**, **m** denotes the number of rows and **n** denotes the number of columns of the modeled grid. Each of the next **m** lines contains **n** characters representing the city.

You can assume that `a`, `b`, `c`, `h` will occur exactly once in the grid. The outer boundaries will always be marked by `#`.', 'For each case, print the case number and the minimum time needed when they all are in their home. You can assume that a solution will always exist.', '(a dangerous<sup>1</sup> social networking site) (&le; 100) (4 &le; m, n &le; 20)', '[{"input":"starts with an integer **T (&le; 100)**, denoting the number of test cases.\n\nEach case starts with a line containing two integers: **m** and **n (4 &le; m, n &le; 20)**, **m** denotes the number of rows and **n** denotes the number of columns of the modeled grid. Each of the next **m** lines contains **n** characters representing the city.\n\nYou can assume that `a`, `b`, `c`, `h` will occur exactly once in the grid. The outer boundaries will always be marked by `#`.\n\n##","output":"For each case, print the case number and the minimum time needed when they all are in their home. You can assume that a solution will always exist."},{"input":"","output":"2\n6 8\n########\n#...c..#\n#......#\n#.a.h.b#\n#......#\n########\n5 9\n#########\n#mmm...c#\n#ma.h####\n#m....b.#\n#########"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('lightoj-1238-a1', 'lightoj-1238', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: LightOJ-1238']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('lightoj-1049', 'Contramão', 'LightOJ', 'https://vjudge.net/problem/LightOJ-1049', 1500, 'Now-a-days the one-way traffic is introduced all over the world in order to improve driving safety and reduce traffic jams. The government of Dhaka Division decided to keep up with new trends. Formerly all **n** cities of Dhaka were connected by **n** two-way roads in the ring, i.e. each city was connected directly to exactly two other cities, and from each city it was possible to get to any other city. Government of Dhaka introduced one-way traffic on all **n** roads, but it soon became clear that it''s impossible to get from some of the cities to some others. Now for each road is known in which direction the traffic is directed at it, and the cost of redirecting the traffic. What is the smallest amount of money the government should spend on the redirecting of roads so that from every city you can get to any other?

## Input

Input starts with an integer **T (&le; 200)**, denoting the number of test cases.

Each case starts with a blank line and an integer **n (3 &le; n &le; 100)** denoting the number of cities (and roads). Next **n** lines contain description of roads. Each road is described by three integers **a<sub>i</sub>, b<sub>i</sub>, c<sub>i</sub> (1 &le; a<sub>i</sub>, b<sub>i</sub> &le; n, a<sub>i</sub> &ne; b<sub>i</sub>, 1 &le; c<sub>i</sub> &le; 100)** - road is directed from city **a<sub>i</sub>** to city **b<sub>i</sub>**, redirecting the traffic costs **c<sub>i</sub>**.

## Output

For each case of input you have to print the case number and the smallest amount of money the government should spend on the redirecting of roads so that from every city you can get to any other.

## Sample

Input
    Output

    4

3
1 3 1
1 2 1
3 2 1

3
1 3 1
1 2 5
3 2 1

6
1 5 4
5 3 8
2 4 15
1 6 16
2 3 23
4 6 42

4
1 2 9
2 3 8
3 4 7
4 1 5

    Case 1: 1
Case 2: 2
Case 3: 39
Case 4: 0', 'Input starts with an integer **T (&le; 200)**, denoting the number of test cases.

Each case starts with a blank line and an integer **n (3 &le; n &le; 100)** denoting the number of cities (and roads). Next **n** lines contain description of roads. Each road is described by three integers **a<sub>i</sub>, b<sub>i</sub>, c<sub>i</sub> (1 &le; a<sub>i</sub>, b<sub>i</sub> &le; n, a<sub>i</sub> &ne; b<sub>i</sub>, 1 &le; c<sub>i</sub> &le; 100)** - road is directed from city **a<sub>i</sub>** to city **b<sub>i</sub>**, redirecting the traffic costs **c<sub>i</sub>**.', 'For each case of input you have to print the case number and the smallest amount of money the government should spend on the redirecting of roads so that from every city you can get to any other.', '(&le; 200) (3 &le; n &le; 100)', '[{"input":"starts with an integer **T (&le; 200)**, denoting the number of test cases.\n\nEach case starts with a blank line and an integer **n (3 &le; n &le; 100)** denoting the number of cities (and roads). Next **n** lines contain description of roads. Each road is described by three integers **a<sub>i</sub>, b<sub>i</sub>, c<sub>i</sub> (1 &le; a<sub>i</sub>, b<sub>i</sub> &le; n, a<sub>i</sub> &ne; b<sub>i</sub>, 1 &le; c<sub>i</sub> &le; 100)** - road is directed from city **a<sub>i</sub>** to city **b<sub>i</sub>**, redirecting the traffic costs **c<sub>i</sub>**.\n\n##","output":"For each case of input you have to print the case number and the smallest amount of money the government should spend on the redirecting of roads so that from every city you can get to any other."},{"input":"","output":"4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('lightoj-1049-a1', 'lightoj-1049', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: LightOJ-1049']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('gym-104344c', 'Andando na reta', 'Codeforces', 'https://codeforces.com/gym/104344/problem/C', 1500, 'Eren Yeager starts at zero on the number line. His goal? To reach the coordinate X.

 There''s a wall standing stubbornly at coordinate Y, which Eren can''t get past at first.

 Luckily, after grabbing a hammer at coordinate Z, he can smash through the wall and continue on.

 Your mission: figure out if Eren can reach his goal. If yes, find the shortest distance he needs to travel to get there.

## Input

The input consists of a single line with 3 integers X, Y, Z, satisfying:

 -   - 1000 ≤ X, Y, Z ≤ 1000,

-  X, Y, and Z are all distinct and none of them is 0.

## Output

If Eren can reach his goal, print the minimum distance he must travel. Otherwise, print  - 1.

## Examples

Input
    Output

    10 -10 1

    10

Input
    Output

    20 10 -10

    40

Input
    Output

    100 1 1000

    -1

Input
    Output

    -678 -666 -518

    678

Input
    Output

    -22 55 -163

    22', 'The input consists of a single line with 3 integers X, Y, Z, satisfying:

 -   - 1000 ≤ X, Y, Z ≤ 1000, 

-  X, Y, and Z are all distinct and none of them is 0.', 'If Eren can reach his goal, print the minimum distance he must travel. Otherwise, print  - 1.', 'See statement.', '[{"input":"","output":"10 -10 1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('gym-104344c-a1', 'gym-104344c', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Gym-104344C']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1399a', 'Banindo elementos', 'Codeforces', 'https://codeforces.com/problemset/problem/1399/A', 1500, 'You are given the array $$$a$$$ consisting of $$$n$$$ positive (greater than zero) integers.

In one move, you can choose two indices $$$i$$$ and $$$j$$$ ($$$i \ne j$$$) such that the absolute difference between $$$a_i$$$ and $$$a_j$$$ is no more than one ($$$|a_i - a_j| \le 1$$$) and remove the smallest of these two elements. If two elements are equal, you can remove any of them (but exactly one).

Your task is to find if it is possible to obtain the array consisting of only one element using several (possibly, zero) such moves or not.

You have to answer $$$t$$$ independent test cases.

## Input

The first line of the input contains one integer $$$t$$$ ($$$1 \le t \le 1000$$$) — the number of test cases. Then $$$t$$$ test cases follow.

The first line of the test case contains one integer $$$n$$$ ($$$1 \le n \le 50$$$) — the length of $$$a$$$. The second line of the test case contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i \le 100$$$), where $$$a_i$$$ is the $$$i$$$-th element of $$$a$$$.

## Output

For each test case, print the answer: "YES" if it is possible to obtain the array consisting of only one element using several (possibly, zero) moves described in the problem statement, or "NO" otherwise.

## Examples

Input
    Output

    5
3
1 2 2
4
5 5 5 5
3
1 2 4
4
1 3 4 4
1
100

    YES
YES
NO
NO
YES

## Note

In the first test case of the example, we can perform the following sequence of moves:

 -  choose $$$i=1$$$ and $$$j=3$$$ and remove $$$a_i$$$ (so $$$a$$$ becomes $$$[2; 2]$$$);
-  choose $$$i=1$$$ and $$$j=2$$$ and remove $$$a_j$$$ (so $$$a$$$ becomes $$$[2]$$$).
In the second test case of the example, we can choose any possible $$$i$$$ and $$$j$$$ any move and it doesn''t matter which element we remove.

In the third test case of the example, there is no way to get rid of $$$2$$$ and $$$4$$$.', 'The first line of the input contains one integer $$$t$$$ ($$$1 \le t \le 1000$$$) — the number of test cases. Then $$$t$$$ test cases follow.

The first line of the test case contains one integer $$$n$$$ ($$$1 \le n \le 50$$$) — the length of $$$a$$$. The second line of the test case contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i \le 100$$$), where $$$a_i$$$ is the $$$i$$$-th element of $$$a$$$.', 'For each test case, print the answer: "YES" if it is possible to obtain the array consisting of only one element using several (possibly, zero) moves described in the problem statement, or "NO" otherwise.', '($$$|a_i - a_j| \le 1$$$) ($$$1 \le t \le 1000$$$) ($$$1 \le n \le 50$$$) ($$$1 \le a_i \le 100$$$) (so $$$a$$$ becomes $$$[2; 2]$$$) (so $$$a$$$ becomes $$$[2]$$$)', '[{"input":"","output":"5\n3\n1 2 2\n4\n5 5 5 5\n3\n1 2 4\n4\n1 3 4 4\n1\n100"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1399a-a1', 'cf-1399a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1399A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-579', 'Clock *ptr[2];', 'UVA', 'https://vjudge.net/problem/UVA-579', 1500, 'The medieval interest in mechanical contrivances is well illustrated by the development of the mechanical clock, the oldest of which is driven by weights and controlled by a verge, an oscillating arm engaging with a gear wheel. It dates back to 1386.

	Clocks driven by springs had appeared by the mid-15th century, making it possible to con- struct more compact mechanisms and preparing the way for the portable clock.

	English spring-driven pendulum clocks were first commonly kept on a small wall bracket and later on a shelf. Many bracket clocks contained a drawer to hold the winding key. The earliest bracket clocks, made for a period after 1660, were of architectural design, with pillars at the sides and a pediment on top.

	In 17th- and 18th-century France, the table clock became an object of monumental design, the best examples of which are minor works of sculpture.

	The longcase clocks (also called grandfather clocks) are tall pendulum clock enclosed in a wooden case that stands upon the floor and is typically from 6 to 7.5 feet (1.8 to 2.3 m) in height. Later, the name ``grandfather clock'''' became popular after the popular song "My Grandfather''s Clock," written in 1876 by Henry Clay Work.

	One of the first atomic clocks was an ammonia-controlled clock. It was built in 1949 at the National Bureau of Standards, Washington, D.C.; in this clock the frequency did not vary by more than one part in 108

	Nuclear clocks are built using two clocks. The aggregate of atoms that emit the gamma radiation of precise frequency may be called the emitter clock; the group of atoms that absorb this radiation is the absorber clock. One pair of these nuclear clocks can detect energy changes of one part in 1014 , being about 1,000 times more sensitive than the best atomic clock.

	The cesium clock is the most accurate type of clock yet developed. This device makes use of transitions between the spin states of the cesium nucleus and produces a frequency which is so regular that it has been adopted for establishing the time standard.

	The history of clocks is fascinating, but unrelated to this problem. In this problem, you are asked to find the angle between the minute hand and the hour hand on a regular analog clock. Assume that the second hand, if there were one, would be pointing straight up at the 12. Give all angles as the smallest positive angles. For example 9:00 is 90 degrees; not -90 or 270 degrees.

## Input

The input is a list of times in the form H:M, each on their own line, with  and . The input is terminated with the time 0:00. Note that H may be represented with 1 or 2 digits (for 1-9 or 10-12, respectively); M is always represented with 2 digits (The input times are what you typically see on a digital clock).

## Output

The output displays the smallest positive angle in degrees between the hands for each time. The answer should between 0 degrees and 180 degrees for all input times. Display each angle on a line by itself in the same order as the input. The output should be rounded to the nearest 1/1000, i.e., three places after the decimal point should be printed.

## Sample Input

12:00
9:00
8:10
0:00

## Sample Output

0.000
90.000
175.000', 'The input is a list of times in the form H:M, each on their own line, with  and . The input is terminated with the time 0:00. Note that H may be represented with 1 or 2 digits (for 1-9 or 10-12, respectively); M is always represented with 2 digits (The input times are what you typically see on a digital clock).', 'The output displays the smallest positive angle in degrees between the hands for each time. The answer should between 0 degrees and 180 degrees for all input times. Display each angle on a line by itself in the same order as the input. The output should be rounded to the nearest 1/1000, i.e., three places after the decimal point should be printed.', '(1.8 to 2.3 m) (for 1-9 or 10-12, respectively)', '[{"input":"The input is a list of times in the form H:M, each on their own line, with  and . The input is terminated with the time 0:00. Note that H may be represented with 1 or 2 digits (for 1-9 or 10-12, respectively); M is always represented with 2 digits (The input times are what you typically see on a digital clock).\n\n##","output":"The output displays the smallest positive angle in degrees between the hands for each time. The answer should between 0 degrees and 180 degrees for all input times. Display each angle on a line by itself in the same order as the input. The output should be rounded to the nearest 1/1000, i.e., three places after the decimal point should be printed."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-579-a1', 'uva-579', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: UVA-579']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('gym-104344a', 'Distribuindo ovos', 'Codeforces', 'https://codeforces.com/gym/104344/problem/A', 1500, 'It''s Halloween, and you have K candies to hand out to N kids. You know a kid will be bummed if they get strictly fewer than L candies. Plus, you care about their health and don''t want to give any kid more than R candies, or else you''d feel sad and guilty yourself. Is there a way to share all your K candies without making anyone unhappy—not the kids, nor you?

## Input

The input is a single line with 4 integers N, K, L, R. It''s guaranteed that 1 ≤ N ≤ 103, 1 ≤ K ≤ 106, and 0 ≤ L ≤ R ≤ 105. Additionally, N·R ≤ 108.

## Output

Print a single character ''S'' if it''s possible to distribute all the candies under these rules, or ''N'' if not. Don''t print the quotes around ''N'' or ''S''.

## Examples

Input
    Output

    1 2 2 4

    S

Input
    Output

    2 1 6 10

    N

Input
    Output

    3 9 3 3

    S

Input
    Output

    3 10 3 3

    N', 'The input is a single line with 4 integers N, K, L, R. It''s guaranteed that 1 ≤ N ≤ 103, 1 ≤ K ≤ 106, and 0 ≤ L ≤ R ≤ 105. Additionally, N·R ≤ 108.', 'Print a single character ''S'' if it''s possible to distribute all the candies under these rules, or ''N'' if not. Don''t print the quotes around ''N'' or ''S''.', 'See statement.', '[{"input":"","output":"1 2 2 4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('gym-104344a-a1', 'gym-104344a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Gym-104344A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-2093a', 'Excelente gerador', 'Codeforces', 'https://codeforces.com/problemset/problem/2093/A', 1500, 'We call an array $$$a$$$, consisting of $$$k$$$ positive integers, palindromic if $$$[a_1, a_2, \dots, a_k] = [a_k, a_{k-1}, \dots, a_1]$$$. For example, the arrays $$$[1, 2, 1]$$$ and $$$[5, 1, 1, 5]$$$ are palindromic, while the arrays $$$[1, 2, 3]$$$ and $$$[21, 12]$$$ are not.

We call a number $$$k$$$ an ideal generator if any integer $$$n$$$ ($$$n \ge k$$$) can be represented as the sum of the elements of a palindromic array of length exactly $$$k$$$. Each element of the array must be greater than $$$0$$$.

For example, the number $$$1$$$ is an ideal generator because any natural number $$$n$$$ can be generated using the array $$$[n]$$$. However, the number $$$2$$$ is not an ideal generator — there is no palindromic array of length $$$2$$$ that sums to $$$3$$$.

Determine whether the given number $$$k$$$ is an ideal generator.

## Input

The first line of the input contains one integer $$$t$$$ ($$$1 \le t \le 1000$$$) — the number of test cases.

The first and only line of each test case contains one integer $$$k$$$ ($$$1 \le k \le 1000$$$).

## Output

For each number $$$k$$$, you need to output the word "YES" if it is an ideal generator, or "NO" otherwise.

You may output "Yes" and "No" in any case (for example, the strings "yES", "yes", and "Yes" will be recognized as a positive answer).

## Examples

Input
    Output

    5
1
2
3
73
1000

    YES
NO
YES
YES
NO', 'The first line of the input contains one integer $$$t$$$ ($$$1 \le t \le 1000$$$) — the number of test cases.

The first and only line of each test case contains one integer $$$k$$$ ($$$1 \le k \le 1000$$$).', 'For each number $$$k$$$, you need to output the word "YES" if it is an ideal generator, or "NO" otherwise.

You may output "Yes" and "No" in any case (for example, the strings "yES", "yes", and "Yes" will be recognized as a positive answer).', '($$$1 \le t \le 1000$$$) ($$$1 \le k \le 1000$$$)', '[{"input":"","output":"5\n1\n2\n3\n73\n1000"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-2093a-a1', 'cf-2093a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-2093A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-2092b', 'Fileira de doces', 'Codeforces', 'https://codeforces.com/problemset/problem/2092/B', 1500, 'As soon as Dasha Purova crossed the border of France, the villain Markaron kidnapped her and placed her in a prison under his large castle. Fortunately, the wonderful Lady Bug, upon hearing the news about Dasha, immediately ran to save her in Markaron''s castle. However, to get there, she needs to crack a complex password.

The password consists of two bit strings $$$a$$$ and $$$b$$$, each of which has a length of $$$n$$$. In one operation, Lady Bug can choose any index $$$2 \le i \le n$$$ and perform one of the following actions:

 -  swap($$$a_i$$$, $$$b_{i-1}$$$) (swap the values of $$$a_i$$$ and $$$b_{i-1}$$$), or
-  swap($$$b_i$$$, $$$a_{i-1}$$$) (swap the values of $$$b_i$$$ and $$$a_{i-1}$$$).
Lady Bug can perform any number of operations. The password is considered cracked if she can ensure that the first string consists only of zeros. Help her understand whether or not she will be able to save the unfortunate Dasha.

## Input

Each test consists of several test cases. The first line of the input data contains one integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of test cases. The description of the test cases follows.

The first line of each test case contains one integer $$$n$$$ ($$$2 \leq n \leq 2 \cdot 10^5$$$) — the length of the bit strings of the password.

The next two lines contain the bit strings of length $$$n$$$, $$$a$$$ and $$$b$$$, which represent the password. Each of the strings contains only the characters 0 and ''1''.

It is guaranteed that the sum of $$$n$$$ across all test cases does not exceed $$$2 \cdot 10^5$$$.

## Output

For each test case, output "YES" if Lady Bug can crack the password after any number of operations; otherwise, output "NO".

You can output each letter in any case (lowercase or uppercase). For example, the strings "yEs", "yes", "Yes", and "YES" will be accepted as a positive answer.

## Examples

Input
    Output

    4
3
000
000
6
010001
010111
5
10000
01010
2
11
00

    YES
YES
NO
YES

## Note

In the first test case, the string $$$a$$$ immediately consists only of zeros.

In the second test case, a possible sequence of operations is:

 - swap$$$(a_2, \ b_{1})$$$

$$$\mathtt{0{\textcolor{red}{1}}0001}$$$

$$$\mathtt{{\textcolor{red}{0}}10111}$$$

- swap$$$(b_5, \ a_{4})$$$

$$$\mathtt{000{\textcolor{red}{0}}01}$$$

$$$\mathtt{1101{\textcolor{red}{1}}1}$$$

- swap$$$(a_4, \ b_{3})$$$

$$$\mathtt{000{\textcolor{red}{1}}01}$$$

$$$\mathtt{11{\textcolor{red}{0}}101}$$$

- swap$$$(a_5, \ b_{4})$$$

$$$\mathtt{00000{\textcolor{red}{1}}}$$$

$$$\mathtt{1111{\textcolor{red}{0}}1}$$$', 'Each test consists of several test cases. The first line of the input data contains one integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of test cases. The description of the test cases follows.

The first line of each test case contains one integer $$$n$$$ ($$$2 \leq n \leq 2 \cdot 10^5$$$) — the length of the bit strings of the password. 

The next two lines contain the bit strings of length $$$n$$$, $$$a$$$ and $$$b$$$, which represent the password. Each of the strings contains only the characters 0 and ''1''. 

It is guaranteed that the sum of $$$n$$$ across all test cases does not exceed $$$2 \cdot 10^5$$$.', 'For each test case, output "YES" if Lady Bug can crack the password after any number of operations; otherwise, output "NO".

You can output each letter in any case (lowercase or uppercase). For example, the strings "yEs", "yes", "Yes", and "YES" will be accepted as a positive answer.', '($$$a_i$$$, $$$b_{i-1}$$$) ($$$b_i$$$, $$$a_{i-1}$$$) ($$$1 \le t \le 10^4$$$) ($$$2 \leq n \leq 2 \cdot 10^5$$$) (a_2, \ b_{1}) (b_5, \ a_{4})', '[{"input":"","output":"4\n3\n000\n000\n6\n010001\n010111\n5\n10000\n01010\n2\n11\n00"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-2092b-a1', 'cf-2092b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-2092B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1948c', 'Ganhando na Amarelinha', 'Codeforces', 'https://codeforces.com/problemset/problem/1948/C', 1500, 'There is a grid, consisting of $$$2$$$ rows and $$$n$$$ columns. The rows are numbered from $$$1$$$ to $$$2$$$ from top to bottom. The columns are numbered from $$$1$$$ to $$$n$$$ from left to right. Each cell of the grid contains an arrow pointing either to the left or to the right. No arrow points outside the grid.

There is a robot that starts in a cell $$$(1, 1)$$$. Every second, the following two actions happen one after another:

 -  Firstly, the robot moves left, right, down or up (it can''t try to go outside the grid, and can''t skip a move);
-  then it moves along the arrow that is placed in the current cell (the cell it ends up after its move).
Your task is to determine whether the robot can reach the cell $$$(2, n)$$$.

## Input

The first line contains a single integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of test cases.

The first line of each test case contains a single integer ($$$2 \le n \le 2 \cdot 10^5$$$).

The second line contains a string consisting of exactly $$$n$$$ characters < and/or > — the first row of the grid.

The third line contains a string consisting of exactly $$$n$$$ characters < and/or > — the second row of the grid.

Additional constraints on the input:

 -  $$$n$$$ is even;
-  there are no arrows pointing outside the grid;
-  the sum of $$$n$$$ over all test cases doesn''t exceed $$$2 \cdot 10^5$$$.

## Output

For each test case, print YES if the robot can reach the cell $$$(2, n)$$$; otherwise, print NO.

You can print each letter in any case. For example, yes, Yes, YeS will all be recognized as positive answer.

## Examples

Input
    Output

    4
4
>><<
>>><
2
><
><
4
>>><
>><<
6
>><<><
><>>><

    YES
YES
NO
YES

## Note

In the first example, one of the possible paths looks as follows: $$$(1, 1) \rightarrow (1, 2) \rightarrow (1, 3) \rightarrow (2, 3) \rightarrow (2, 4)$$$.

In the second example, one of the possible paths looks as follows: $$$(1, 1) \rightarrow (2, 1) \rightarrow (2, 2)$$$.

In the third example, there is no way to reach the cell $$$(2, 4)$$$.

In the fourth example, one of the possible paths looks as follows: $$$(1, 1) \rightarrow (2, 1) \rightarrow (2, 2) \rightarrow (1, 2) \rightarrow (1, 3) \rightarrow (2, 3) \rightarrow (2, 4) \rightarrow (2, 5) \rightarrow (2, 6)$$$.', 'The first line contains a single integer $$$t$$$ ($$$1 \le t \le 10^4$$$) — the number of test cases.

The first line of each test case contains a single integer ($$$2 \le n \le 2 \cdot 10^5$$$).

The second line contains a string consisting of exactly $$$n$$$ characters < and/or > — the first row of the grid.

The third line contains a string consisting of exactly $$$n$$$ characters < and/or > — the second row of the grid.

Additional constraints on the input: 

 -  $$$n$$$ is even; 
-  there are no arrows pointing outside the grid; 
-  the sum of $$$n$$$ over all test cases doesn''t exceed $$$2 \cdot 10^5$$$.', 'For each test case, print YES if the robot can reach the cell $$$(2, n)$$$; otherwise, print NO.

You can print each letter in any case. For example, yes, Yes, YeS will all be recognized as positive answer.', '(1, 1) (2, n) ($$$1 \le t \le 10^4$$$) ($$$2 \le n \le 2 \cdot 10^5$$$) (2, n) (1, 1)', '[{"input":"","output":"4\n4\n>><<\n>>><\n2\n><\n><\n4\n>>><\n>><<\n6\n>><<><\n><>>><"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1948c-a1', 'cf-1948c', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1948C']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1842c', 'Molas Mágicas', 'Codeforces', 'https://codeforces.com/problemset/problem/1842/C', 1500, 'Enjoy erasing Tenzing, identified as Accepted!

Tenzing has $$$n$$$ balls arranged in a line. The color of the $$$i$$$-th ball from the left is $$$a_i$$$.

Tenzing can do the following operation any number of times:

 -  select $$$i$$$ and $$$j$$$ such that $$$1\leq i  \lt  j \leq |a|$$$ and $$$a_i=a_j$$$,
-  remove $$$a_i,a_{i+1},\ldots,a_j$$$ from the array (and decrease the indices of all elements to the right of $$$a_j$$$ by $$$j-i+1$$$).
Tenzing wants to know the maximum number of balls he can remove.

## Input

Each test contains multiple test cases. The first line of input contains a single integer $$$t$$$ ($$$1\leq t\leq 10^3$$$) — the number of test cases. The description of test cases follows.

The first line contains a single integer $$$n$$$ ($$$1\leq n\leq 2\cdot 10^5$$$) — the number of balls.

The second line contains $$$n$$$ integers $$$a_1,a_2,\ldots,a_n$$$ ($$$1\leq a_i \leq n$$$) — the color of the balls.

It is guaranteed that sum of $$$n$$$ of all test cases will not exceed $$$2\cdot 10^5$$$.

## Output

For each test case, output the maximum number of balls Tenzing can remove.

## Examples

Input
    Output

    2
5
1 2 2 3 3
4
1 2 1 2

    4
3

## Note

In the first example, Tenzing will choose $$$i=2$$$ and $$$j=3$$$ in the first operation so that $$$a=[1,3,3]$$$. Then Tenzing will choose $$$i=2$$$ and $$$j=3$$$ again in the second operation so that $$$a=[1]$$$. So Tenzing can remove $$$4$$$ balls in total.

In the second example, Tenzing will choose $$$i=1$$$ and $$$j=3$$$ in the first and only operation so that $$$a=[2]$$$. So Tenzing can remove $$$3$$$ balls in total.', 'Each test contains multiple test cases. The first line of input contains a single integer $$$t$$$ ($$$1\leq t\leq 10^3$$$) — the number of test cases. The description of test cases follows.

The first line contains a single integer $$$n$$$ ($$$1\leq n\leq 2\cdot 10^5$$$) — the number of balls.

The second line contains $$$n$$$ integers $$$a_1,a_2,\ldots,a_n$$$ ($$$1\leq a_i \leq n$$$) — the color of the balls.

It is guaranteed that sum of $$$n$$$ of all test cases will not exceed $$$2\cdot 10^5$$$.', 'For each test case, output the maximum number of balls Tenzing can remove.', '($$$1\leq t\leq 10^3$$$) ($$$1\leq n\leq 2\cdot 10^5$$$) ($$$1\leq a_i \leq n$$$)', '[{"input":"","output":"2\n5\n1 2 2 3 3\n4\n1 2 1 2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1842c-a1', 'cf-1842c', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1842C']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('gym-104339b', 'Gym', 'Codeforces', 'https://codeforces.com/gym/104339/problem/B', 1500, 'You have four kettlebells weighing respectively $$$p_1, p_2, p_3, p_4$$$. Is it possible to place all these weights on a balance scale so that the pans of these scales are in a state of equilibrium?

## Input

Enter four integers $$$p_1, p_2, p_3, p_4$$$ ($$$1 \le p_i \le 10000$$$)

## Output

Print ''YES'' or ''NO'' depending on whether the weights can be placed properly.

## Examples

Input
    Output

    7 3 5 5

    YES

Input
    Output

    7 3 5 6

    NO', 'Enter four integers $$$p_1, p_2, p_3, p_4$$$ ($$$1 \le p_i \le 10000$$$)', 'Print ''YES'' or ''NO'' depending on whether the weights can be placed properly.', '($$$1 \le p_i \le 10000$$$)', '[{"input":"","output":"7 3 5 5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('gym-104339b-a1', 'gym-104339b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: Gym-104339B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-617a', 'Aquela visita indesejável', 'Codeforces', 'https://codeforces.com/problemset/problem/617/A', 1500, 'An elephant decided to visit his friend. It turned out that the elephant''s house is located at point 0 and his friend''s house is located at point x(x > 0) of the coordinate line. In one step the elephant can move 1, 2, 3, 4 or 5 positions forward. Determine, what is the minimum number of steps he need to make in order to get to his friend''s house.

## Input

The first line of the input contains an integer x (1 ≤ x ≤ 1 000 000) — The coordinate of the friend''s house.

## Output

Print the minimum number of steps that elephant needs to make to get from point 0 to point x.

## Examples

Input
    Output

    5

    1

Input
    Output

    12

    3

## Note

In the first sample the elephant needs to make one step of length 5 to reach the point x.

In the second sample the elephant can get to point x if he moves by 3, 5 and 4. There are other ways to get the optimal answer but the elephant cannot reach x in less than three moves.', 'The first line of the input contains an integer x (1 ≤ x ≤ 1 000 000) — The coordinate of the friend''s house.', 'Print the minimum number of steps that elephant needs to make to get from point 0 to point x.', '(x > 0) (1 ≤ x ≤ 1 000 000)', '[{"input":"","output":"5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-617a-a1', 'cf-617a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-617A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-149d', 'Brincando de colorir', 'Codeforces', 'https://codeforces.com/problemset/problem/149/D', 1500, 'Once Petya read a problem about a bracket sequence. He gave it much thought but didn''t find a solution. Today you will face it.

You are given string s. It represents a correct bracket sequence. A correct bracket sequence is the sequence of opening ("(") and closing (")") brackets, such that it is possible to obtain a correct mathematical expression from it, inserting numbers and operators between the brackets. For example, such sequences as "(())()" and "()" are correct bracket sequences and such sequences as ")()" and "(()" are not.

In a correct bracket sequence each bracket corresponds to the matching bracket (an opening bracket corresponds to the matching closing bracket and vice versa). For example, in a bracket sequence shown of the figure below, the third bracket corresponds to the matching sixth one and the fifth bracket corresponds to the fourth one.

   You are allowed to color some brackets in the bracket sequence so as all three conditions are fulfilled:

 -  Each bracket is either not colored any color, or is colored red, or is colored blue.
-  For any pair of matching brackets exactly one of them is colored. In other words, for any bracket the following is true: either it or the matching bracket that corresponds to it is colored.
-  No two neighboring colored brackets have the same color.
Find the number of different ways to color the bracket sequence. The ways should meet the above-given conditions. Two ways of coloring are considered different if they differ in the color of at least one bracket. As the result can be quite large, print it modulo 1000000007 (109 + 7).

## Input

The first line contains the single string s (2 ≤ |s| ≤ 700) which represents a correct bracket sequence.

## Output

Print the only number — the number of ways to color the bracket sequence that meet the above given conditions modulo 1000000007 (109 + 7).

## Examples

Input
    Output

    (())

    12

Input
    Output

    (()())

    40

Input
    Output

    ()

    4

## Note

Let''s consider the first sample test. The bracket sequence from the sample can be colored, for example, as is shown on two figures below.

    The two ways of coloring shown below are incorrect.', 'The first line contains the single string s (2 ≤ |s| ≤ 700) which represents a correct bracket sequence.', 'Print the only number — the number of ways to color the bracket sequence that meet the above given conditions modulo 1000000007 (109 + 7).', '(109 + 7) (2 ≤ |s| ≤ 700) (109 + 7)', '[{"input":"","output":"(())"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-149d-a1', 'cf-149d', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-149D']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1020b', 'Caiu o servidor', 'Codeforces', 'https://codeforces.com/problemset/problem/1020/B', 1500, 'In Summer Informatics School, if a student doesn''t behave well, teachers make a hole in his badge. And today one of the teachers caught a group of $$$n$$$ students doing yet another trick.

Let''s assume that all these students are numbered from $$$1$$$ to $$$n$$$. The teacher came to student $$$a$$$ and put a hole in his badge. The student, however, claimed that the main culprit is some other student $$$p_a$$$.

After that, the teacher came to student $$$p_a$$$ and made a hole in his badge as well. The student in reply said that the main culprit was student $$$p_{p_a}$$$.

This process went on for a while, but, since the number of students was finite, eventually the teacher came to the student, who already had a hole in his badge.

After that, the teacher put a second hole in the student''s badge and decided that he is done with this process, and went to the sauna.

You don''t know the first student who was caught by the teacher. However, you know all the numbers $$$p_i$$$. Your task is to find out for every student $$$a$$$, who would be the student with two holes in the badge if the first caught student was $$$a$$$.

## Input

The first line of the input contains the only integer $$$n$$$ ($$$1 \le n \le 1000$$$) — the number of the naughty students.

The second line contains $$$n$$$ integers $$$p_1$$$, ..., $$$p_n$$$ ($$$1 \le p_i \le n$$$), where $$$p_i$$$ indicates the student who was reported to the teacher by student $$$i$$$.

## Output

For every student $$$a$$$ from $$$1$$$ to $$$n$$$ print which student would receive two holes in the badge, if $$$a$$$ was the first student caught by the teacher.

## Examples

Input
    Output

    3
2 3 2

    2 2 3

Input
    Output

    3
1 2 3

    1 2 3

## Note

The picture corresponds to the first example test case.

  When $$$a = 1$$$, the teacher comes to students $$$1$$$, $$$2$$$, $$$3$$$, $$$2$$$, in this order, and the student $$$2$$$ is the one who receives a second hole in his badge.

When $$$a = 2$$$, the teacher comes to students $$$2$$$, $$$3$$$, $$$2$$$, and the student $$$2$$$ gets a second hole in his badge. When $$$a = 3$$$, the teacher will visit students $$$3$$$, $$$2$$$, $$$3$$$ with student $$$3$$$ getting a second hole in his badge.

For the second example test case it''s clear that no matter with whom the teacher starts, that student would be the one who gets the second hole in his badge.', 'The first line of the input contains the only integer $$$n$$$ ($$$1 \le n \le 1000$$$) — the number of the naughty students.

The second line contains $$$n$$$ integers $$$p_1$$$, ..., $$$p_n$$$ ($$$1 \le p_i \le n$$$), where $$$p_i$$$ indicates the student who was reported to the teacher by student $$$i$$$.', 'For every student $$$a$$$ from $$$1$$$ to $$$n$$$ print which student would receive two holes in the badge, if $$$a$$$ was the first student caught by the teacher.', '($$$1 \le n \le 1000$$$) ($$$1 \le p_i \le n$$$)', '[{"input":"","output":"3\n2 3 2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1020b-a1', 'cf-1020b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1020B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1536b', 'DNA alienígena', 'Codeforces', 'https://codeforces.com/problemset/problem/1536/B', 1500, 'I, Fischl, Prinzessin der Verurteilung, descend upon this land by the call of fate an — Oh, you are also a traveler from another world? Very well, I grant you permission to travel with me.

It is no surprise Fischl speaks with a strange choice of words. However, this time, not even Oz, her raven friend, can interpret her expressions! Maybe you can help us understand what this young princess is saying?

You are given a string of $$$n$$$ lowercase Latin letters, the word that Fischl just spoke. You think that the MEX of this string may help you find the meaning behind this message. The MEX of the string is defined as the shortest string that doesn''t appear as a contiguous substring in the input. If multiple strings exist, the lexicographically smallest one is considered the MEX. Note that the empty substring does NOT count as a valid MEX.

A string $$$a$$$ is lexicographically smaller than a string $$$b$$$ if and only if one of the following holds:

 -  $$$a$$$ is a prefix of $$$b$$$, but $$$a \ne b$$$;
-  in the first position where $$$a$$$ and $$$b$$$ differ, the string $$$a$$$ has a letter that appears earlier in the alphabet than the corresponding letter in $$$b$$$.
A string $$$a$$$ is a substring of a string $$$b$$$ if $$$a$$$ can be obtained from $$$b$$$ by deletion of several (possibly, zero or all) characters from the beginning and several (possibly, zero or all) characters from the end.

Find out what the MEX of the string is!

## Input

Each test contains multiple test cases. The first line contains the number of test cases $$$t$$$ ($$$1 \leq t \leq 1000$$$). Description of the test cases follows.

The first line of each test case contains an integer $$$n$$$ ($$$1 \leq n \leq 1000$$$) — the length of the word. The second line for each test case contains a single string of $$$n$$$ lowercase Latin letters.

The sum of $$$n$$$ over all test cases will not exceed $$$1000$$$.

## Output

For each test case, output the MEX of the string on a new line.

## Examples

Input
    Output

    3
28
qaabzwsxedcrfvtgbyhnujmiklop
13
cleanairactbd
10
aannttoonn

    ac
f
b', 'Each test contains multiple test cases. The first line contains the number of test cases $$$t$$$ ($$$1 \leq t \leq 1000$$$). Description of the test cases follows.

The first line of each test case contains an integer $$$n$$$ ($$$1 \leq n \leq 1000$$$) — the length of the word. The second line for each test case contains a single string of $$$n$$$ lowercase Latin letters.

The sum of $$$n$$$ over all test cases will not exceed $$$1000$$$.', 'For each test case, output the MEX of the string on a new line.', '($$$1 \leq t \leq 1000$$$) ($$$1 \leq n \leq 1000$$$)', '[{"input":"","output":"3\n28\nqaabzwsxedcrfvtgbyhnujmiklop\n13\ncleanairactbd\n10\naannttoonn"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1536b-a1', 'cf-1536b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1536B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-402a', 'Engenharia Chiqueirial', 'Codeforces', 'https://codeforces.com/problemset/problem/402/A', 1500, 'You have a nuts and lots of boxes. The boxes have a wonderful feature: if you put x (x ≥ 0) divisors (the spacial bars that can divide a box) to it, you get a box, divided into x + 1 sections.

You are minimalist. Therefore, on the one hand, you are against dividing some box into more than k sections. On the other hand, you are against putting more than v nuts into some section of the box. What is the minimum number of boxes you have to use if you want to put all the nuts in boxes, and you have b divisors?

Please note that you need to minimize the number of used boxes, not sections. You do not have to minimize the number of used divisors.

## Input

The first line contains four space-separated integers k, a, b, v (2 ≤ k ≤ 1000; 1 ≤ a, b, v ≤ 1000) — the maximum number of sections in the box, the number of nuts, the number of divisors and the capacity of each section of the box.

## Output

Print a single integer — the answer to the problem.

## Examples

Input
    Output

    3 10 3 3

    2

Input
    Output

    3 10 1 3

    3

Input
    Output

    100 100 1 1000

    1

## Note

In the first sample you can act like this:

 -  Put two divisors to the first box. Now the first box has three sections and we can put three nuts into each section. Overall, the first box will have nine nuts.
-  Do not put any divisors into the second box. Thus, the second box has one section for the last nut.
In the end we''ve put all the ten nuts into boxes.

The second sample is different as we have exactly one divisor and we put it to the first box. The next two boxes will have one section each.', 'The first line contains four space-separated integers k, a, b, v (2 ≤ k ≤ 1000; 1 ≤ a, b, v ≤ 1000) — the maximum number of sections in the box, the number of nuts, the number of divisors and the capacity of each section of the box.', 'Print a single integer — the answer to the problem.', '(x ≥ 0) (2 ≤ k ≤ 1000; 1 ≤ a, b, v ≤ 1000)', '[{"input":"","output":"3 10 3 3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-402a-a1', 'cf-402a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-402A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1681c', 'Fila de capivaras no PVB', 'Codeforces', 'https://codeforces.com/problemset/problem/1681/C', 1500, 'You are given two arrays $$$a$$$ and $$$b$$$, both consisting of $$$n$$$ integers.

In one move, you can choose two indices $$$i$$$ and $$$j$$$ ($$$1 \le i, j \le n$$$; $$$i \neq j$$$) and swap $$$a_i$$$ with $$$a_j$$$ and $$$b_i$$$ with $$$b_j$$$. You have to perform the swap in both arrays.

You are allowed to perform at most $$$10^4$$$ moves (possibly, zero). Can you make both arrays sorted in a non-decreasing order at the end? If you can, print any sequence of moves that makes both arrays sorted.

## Input

The first line contains a single integer $$$t$$$ ($$$1 \le t \le 100$$$) — the number of testcases.

The first line of each testcase contains a single integer $$$n$$$ ($$$2 \le n \le 100$$$) — the number of elements in both arrays.

The second line contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i \le n$$$) — the first array.

The third line contains $$$n$$$ integers $$$b_1, b_2, \dots, b_n$$$ ($$$1 \le b_i \le n$$$) — the second array.

## Output

For each testcase, print the answer. If it''s impossible to make both arrays sorted in a non-decreasing order in at most $$$10^4$$$ moves, print -1. Otherwise, first, print the number of moves $$$k$$$ $$$(0 \le k \le 10^4)$$$. Then print $$$i$$$ and $$$j$$$ for each move $$$(1 \le i, j \le n$$$; $$$i \neq j)$$$.

If there are multiple answers, then print any of them. You don''t have to minimize the number of moves.

## Examples

Input
    Output

    3
2
1 2
1 2
2
2 1
1 2
4
2 3 1 2
2 3 2 3

    0
-1
3
3 1
3 2
4 3', 'The first line contains a single integer $$$t$$$ ($$$1 \le t \le 100$$$) — the number of testcases.

The first line of each testcase contains a single integer $$$n$$$ ($$$2 \le n \le 100$$$) — the number of elements in both arrays.

The second line contains $$$n$$$ integers $$$a_1, a_2, \dots, a_n$$$ ($$$1 \le a_i \le n$$$) — the first array.

The third line contains $$$n$$$ integers $$$b_1, b_2, \dots, b_n$$$ ($$$1 \le b_i \le n$$$) — the second array.', 'For each testcase, print the answer. If it''s impossible to make both arrays sorted in a non-decreasing order in at most $$$10^4$$$ moves, print -1. Otherwise, first, print the number of moves $$$k$$$ $$$(0 \le k \le 10^4)$$$. Then print $$$i$$$ and $$$j$$$ for each move $$$(1 \le i, j \le n$$$; $$$i \neq j)$$$.

If there are multiple answers, then print any of them. You don''t have to minimize the number of moves.', '($$$1 \le i, j \le n$$$; $$$i \neq j$$$) ($$$1 \le t \le 100$$$) ($$$2 \le n \le 100$$$) ($$$1 \le a_i \le n$$$) ($$$1 \le b_i \le n$$$) (0 \le k \le 10^4)', '[{"input":"","output":"3\n2\n1 2\n1 2\n2\n2 1\n1 2\n4\n2 3 1 2\n2 3 2 3"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1681c-a1', 'cf-1681c', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1681C']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('poj-1556', 'Gulosa essa capivara', 'POJ', 'http://poj.org/problem?id=1556', 1500, 'You are to find the length of the shortest path through a chamber containing obstructing walls. The chamber will always have sides at x = 0, x = 10, y = 0, and y = 10. The initial and final points of the path are always (0, 5) and (10, 5). There will also be from 0 to 18 vertical walls inside the chamber, each with two doorways. The figure below illustrates such a chamber and also shows the path of minimal length.

## Input

The input data for the illustrated chamber would appear as follows.

2
4 2 7 8 9
7 3 4.5 6 7

The first line contains the number of interior walls. Then there is a line for each such wall, containing five real numbers. The first number is the x coordinate of the wall (0 < x < 10), and the remaining four are the y coordinates of the ends of the doorways in that wall. The x coordinates of the walls are in increasing order, and within each line the y coordinates are in increasing order. The input file will contain at least one such set of data. The end of the data comes when the number of walls is -1.

## Output

The output should contain one line of output for each chamber. The line should contain the minimal path length rounded to two decimal places past the decimal point, and always showing the two decimal places past the decimal point. The line should contain no blanks.

## Sample

Input
    Output

    1
5 4 6 7 8
2
4 2 7 8 9
7 3 4.5 6 7
-1
    10.00
10.06', 'The input data for the illustrated chamber would appear as follows.

2 
4 2 7 8 9 
7 3 4.5 6 7

The first line contains the number of interior walls. Then there is a line for each such wall, containing five real numbers. The first number is the x coordinate of the wall (0 < x < 10), and the remaining four are the y coordinates of the ends of the doorways in that wall. The x coordinates of the walls are in increasing order, and within each line the y coordinates are in increasing order. The input file will contain at least one such set of data. The end of the data comes when the number of walls is -1.', 'The output should contain one line of output for each chamber. The line should contain the minimal path length rounded to two decimal places past the decimal point, and always showing the two decimal places past the decimal point. The line should contain no blanks.', '(0, 5) (10, 5) (0 < x < 10)', '[{"input":"The input data for the illustrated chamber would appear as follows.\n\n2\n4 2 7 8 9\n7 3 4.5 6 7\n\nThe first line contains the number of interior walls. Then there is a line for each such wall, containing five real numbers. The first number is the x coordinate of the wall (0 < x < 10), and the remaining four are the y coordinates of the ends of the doorways in that wall. The x coordinates of the walls are in increasing order, and within each line the y coordinates are in increasing order. The input file will contain at least one such set of data. The end of the data comes when the number of walls is -1.\n\n##","output":"The output should contain one line of output for each chamber. The line should contain the minimal path length rounded to two decimal places past the decimal point, and always showing the two decimal places past the decimal point. The line should contain no blanks."},{"input":"","output":"1\n5 4 6 7 8\n2\n4 2 7 8 9\n7 3 4.5 6 7\n-1\n    10.00\n10.06"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('poj-1556-a1', 'poj-1556', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: POJ-1556']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-158a', 'Classificados', 'Codeforces', 'https://codeforces.com/problemset/problem/158/A', 1500, '"Contestant who earns a score equal to or greater than the k-th place finisher''s score will advance to the next round, as long as the contestant earns a positive score..." — an excerpt from contest rules.

A total of n participants took part in the contest (n ≥ k), and you already know their scores. Calculate how many participants will advance to the next round.

## Input

The first line of the input contains two integers n and k (1 ≤ k ≤ n ≤ 50) separated by a single space.

The second line contains n space-separated integers a1, a2, ..., an (0 ≤ ai ≤ 100), where ai is the score earned by the participant who got the i-th place. The given sequence is non-increasing (that is, for all i from 1 to n - 1 the following condition is fulfilled: ai ≥ ai + 1).

## Output

Output the number of participants who advance to the next round.

## Examples

Input
    Output

    8 5
10 9 8 7 7 7 5 5

    6

Input
    Output

    4 2
0 0 0 0

    0

## Note

In the first example the participant on the 5th place earned 7 points. As the participant on the 6th place also earned 7 points, there are 6 advancers.

In the second example nobody got a positive score.', 'The first line of the input contains two integers n and k (1 ≤ k ≤ n ≤ 50) separated by a single space.

The second line contains n space-separated integers a1, a2, ..., an (0 ≤ ai ≤ 100), where ai is the score earned by the participant who got the i-th place. The given sequence is non-increasing (that is, for all i from 1 to n - 1 the following condition is fulfilled: ai ≥ ai + 1).', 'Output the number of participants who advance to the next round.', '(1 ≤ k ≤ n ≤ 50) (0 ≤ ai ≤ 100)', '[{"input":"","output":"8 5\n10 9 8 7 7 7 5 5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-158a-a1', 'cf-158a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-158A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-510b', 'Jogo', 'Codeforces', 'https://codeforces.com/problemset/problem/510/B', 1500, 'Fox Ciel is playing a mobile puzzle game called "Two Dots". The basic levels are played on a board of size n × m cells, like this:

Each cell contains a dot that has some color. We will use different uppercase Latin characters to express different colors.

The key of this game is to find a cycle that contain dots of same color. Consider 4 blue dots on the picture forming a circle as an example. Formally, we call a sequence of dots d1, d2, ..., dk a cycle if and only if it meets the following condition:

 -  These k dots are different: if i ≠ j then di is different from dj.
-  k is at least 4.
-  All dots belong to the same color.
-  For all 1 ≤ i ≤ k - 1: di and di + 1 are adjacent. Also, dk and d1 should also be adjacent. Cells x and y are called adjacent if they share an edge.
Determine if there exists a cycle on the field.

## Input

The first line contains two integers n and m (2 ≤ n, m ≤ 50): the number of rows and columns of the board.

Then n lines follow, each line contains a string consisting of m characters, expressing colors of dots in each line. Each character is an uppercase Latin letter.

## Output

Output "Yes" if there exists a cycle, and "No" otherwise.

## Examples

Input
    Output

    3 4
AAAA
ABCA
AAAA

    Yes

Input
    Output

    3 4
AAAA
ABCA
AADA

    No

Input
    Output

    4 4
YYYR
BYBY
BBBY
BBBY

    Yes

Input
    Output

    7 6
AAAAAB
ABBBAB
ABAAAB
ABABBB
ABAAAB
ABBBAB
AAAAAB

    Yes

Input
    Output

    2 13
ABCDEFGHIJKLM
NOPQRSTUVWXYZ

    No

## Note

In first sample test all ''A'' form a cycle.

In second sample there is no such cycle.

The third sample is displayed on the picture above (''Y'' = Yellow, ''B'' = Blue, ''R'' = Red).', 'The first line contains two integers n and m (2 ≤ n, m ≤ 50): the number of rows and columns of the board.

Then n lines follow, each line contains a string consisting of m characters, expressing colors of dots in each line. Each character is an uppercase Latin letter.', 'Output "Yes" if there exists a cycle, and "No" otherwise.', '(2 ≤ n, m ≤ 50)', '[{"input":"","output":"3 4\nAAAA\nABCA\nAAAA"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-510b-a1', 'cf-510b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-510B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-474d', 'Flores', 'Codeforces', 'https://codeforces.com/problemset/problem/474/D', 1500, 'We saw the little game Marmot made for Mole''s lunch. Now it''s Marmot''s dinner time and, as we all know, Marmot eats flowers. At every dinner he eats some red and white flowers. Therefore a dinner can be represented as a sequence of several flowers, some of them white and some of them red.

But, for a dinner to be tasty, there is a rule: Marmot wants to eat white flowers only in groups of size k.

Now Marmot wonders in how many ways he can eat between a and b flowers. As the number of ways could be very large, print it modulo 1000000007 (109 + 7).

## Input

Input contains several test cases.

The first line contains two integers t and k (1 ≤ t, k ≤ 105), where t represents the number of test cases.

The next t lines contain two integers ai and bi (1 ≤ ai ≤ bi ≤ 105), describing the i-th test.

## Output

Print t lines to the standard output. The i-th line should contain the number of ways in which Marmot can eat between ai and bi flowers at dinner modulo 1000000007 (109 + 7).

## Examples

Input
    Output

    3 2
1 3
2 3
4 4

    6
5
5

## Note

-  For K = 2 and length 1 Marmot can eat (R).
-  For K = 2 and length 2 Marmot can eat (RR) and (WW).
-  For K = 2 and length 3 Marmot can eat (RRR), (RWW) and (WWR).
-  For K = 2 and length 4 Marmot can eat, for example, (WWWW) or (RWWR), but for example he can''t eat (WWWR).', 'Input contains several test cases.

The first line contains two integers t and k (1 ≤ t, k ≤ 105), where t represents the number of test cases.

The next t lines contain two integers ai and bi (1 ≤ ai ≤ bi ≤ 105), describing the i-th test.', 'Print t lines to the standard output. The i-th line should contain the number of ways in which Marmot can eat between ai and bi flowers at dinner modulo 1000000007 (109 + 7).', '(109 + 7) (1 ≤ t, k ≤ 105) (1 ≤ ai ≤ bi ≤ 105) (109 + 7)', '[{"input":"","output":"3 2\n1 3\n2 3\n4 4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-474d-a1', 'cf-474d', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-474D']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-435a', 'Capivarão', 'Codeforces', 'https://codeforces.com/problemset/problem/435/A', 1500, 'It''s that time of the year when the Russians flood their countryside summer cottages (dachas) and the bus stop has a lot of people. People rarely go to the dacha on their own, it''s usually a group, so the people stand in queue by groups.

The bus stop queue has n groups of people. The i-th group from the beginning has ai people. Every 30 minutes an empty bus arrives at the bus stop, it can carry at most m people. Naturally, the people from the first group enter the bus first. Then go the people from the second group and so on. Note that the order of groups in the queue never changes. Moreover, if some group cannot fit all of its members into the current bus, it waits for the next bus together with other groups standing after it in the queue.

Your task is to determine how many buses is needed to transport all n groups to the dacha countryside.

## Input

The first line contains two integers n and m (1 ≤ n, m ≤ 100). The next line contains n integers: a1, a2, ..., an (1 ≤ ai ≤ m).

## Output

Print a single integer — the number of buses that is needed to transport all n groups to the dacha countryside.

## Examples

Input
    Output

    4 3
2 3 2 1

    3

Input
    Output

    3 4
1 2 1

    1', 'The first line contains two integers n and m (1 ≤ n, m ≤ 100). The next line contains n integers: a1, a2, ..., an (1 ≤ ai ≤ m).', 'Print a single integer — the number of buses that is needed to transport all n groups to the dacha countryside.', '(1 ≤ n, m ≤ 100) (1 ≤ ai ≤ m)', '[{"input":"","output":"4 3\n2 3 2 1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-435a-a1', 'cf-435a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-435A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1023b', 'Enviando capivaras para a UFMS', 'Codeforces', 'https://codeforces.com/problemset/problem/1023/B', 1500, 'Tanechka is shopping in the toy shop. There are exactly $$$n$$$ toys in the shop for sale, the cost of the $$$i$$$-th toy is $$$i$$$ burles. She wants to choose two toys in such a way that their total cost is $$$k$$$ burles. How many ways to do that does she have?

Each toy appears in the shop exactly once. Pairs $$$(a, b)$$$ and $$$(b, a)$$$ are considered equal. Pairs $$$(a, b)$$$, where $$$a=b$$$, are not allowed.

## Input

The first line of the input contains two integers $$$n$$$, $$$k$$$ ($$$1 \le n, k \le 10^{14}$$$) — the number of toys and the expected total cost of the pair of toys.

## Output

Print the number of ways to choose the pair of toys satisfying the condition above. Print 0, if Tanechka can choose no pair of toys in such a way that their total cost is $$$k$$$ burles.

## Examples

Input
    Output

    8 5

    2

Input
    Output

    8 15

    1

Input
    Output

    7 20

    0

Input
    Output

    1000000000000 1000000000001

    500000000000

## Note

In the first example Tanechka can choose the pair of toys ($$$1, 4$$$) or the pair of toys ($$$2, 3$$$).

In the second example Tanechka can choose only the pair of toys ($$$7, 8$$$).

In the third example choosing any pair of toys will lead to the total cost less than $$$20$$$. So the answer is 0.

In the fourth example she can choose the following pairs: $$$(1, 1000000000000)$$$, $$$(2, 999999999999)$$$, $$$(3, 999999999998)$$$, ..., $$$(500000000000, 500000000001)$$$. The number of such pairs is exactly $$$500000000000$$$.', 'The first line of the input contains two integers $$$n$$$, $$$k$$$ ($$$1 \le n, k \le 10^{14}$$$) — the number of toys and the expected total cost of the pair of toys.', 'Print the number of ways to choose the pair of toys satisfying the condition above. Print 0, if Tanechka can choose no pair of toys in such a way that their total cost is $$$k$$$ burles.', '($$$1 \le n, k \le 10^{14}$$$) ($$$1, 4$$$) ($$$2, 3$$$) ($$$7, 8$$$) (1, 1000000000000) (2, 999999999999)', '[{"input":"","output":"8 5"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1023b-a1', 'cf-1023b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1023B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-702a', 'Calouros atrapalhando a dieta das capivaras', 'Codeforces', 'https://codeforces.com/problemset/problem/702/A', 1500, 'You are given array consisting of n integers. Your task is to find the maximum length of an increasing subarray of the given array.

A subarray is the sequence of consecutive elements of the array. Subarray is called increasing if each element of this subarray strictly greater than previous.

## Input

The first line contains single positive integer n (1 ≤ n ≤ 105) — the number of integers.

The second line contains n positive integers a1, a2, ..., an (1 ≤ ai ≤ 109).

## Output

Print the maximum length of an increasing subarray of the given array.

## Examples

Input
    Output

    5
1 7 2 11 15

    3

Input
    Output

    6
100 100 100 100 100 100

    1

Input
    Output

    3
1 2 3

    3', 'The first line contains single positive integer n (1 ≤ n ≤ 105) — the number of integers.

The second line contains n positive integers a1, a2, ..., an (1 ≤ ai ≤ 109).', 'Print the maximum length of an increasing subarray of the given array.', '(1 ≤ n ≤ 105) (1 ≤ ai ≤ 109)', '[{"input":"","output":"5\n1 7 2 11 15"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-702a-a1', 'cf-702a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-702A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-474e', 'Pulando nas 24 pilastras da UFMS', 'Codeforces', 'https://codeforces.com/problemset/problem/474/E', 1500, 'Marmot found a row with n pillars. The i-th pillar has the height of hi meters. Starting from one pillar i1, Marmot wants to jump on the pillars i2, ..., ik. (1 ≤ i1 < i2 < ... < ik ≤ n). From a pillar i Marmot can jump on a pillar j only if i < j and |hi - hj| ≥ d, where |x| is the absolute value of the number x.

Now Marmot is asking you find out a jump sequence with maximal length and print it.

## Input

The first line contains two integers n and d (1 ≤ n ≤ 105, 0 ≤ d ≤ 109).

The second line contains n numbers h1, h2, ..., hn (1 ≤ hi ≤ 1015).

## Output

The first line should contain one integer k, the maximal length of a jump sequence.

The second line should contain k integers i1, i2, ..., ik (1 ≤ i1 < i2 < ... < ik ≤ n), representing the pillars'' indices from the maximal length jump sequence.

If there is more than one maximal length jump sequence, print any.

## Examples

Input
    Output

    5 2
1 3 6 7 4

    4
1 2 3 5

Input
    Output

    10 3
2 1 3 6 9 11 7 3 20 18

    6
1 4 6 7 8 9

## Note

In the first example Marmot chooses the pillars 1, 2, 3, 5 with the heights 1, 3, 6, 4. Another jump sequence of length 4 is 1, 2, 4, 5.', 'The first line contains two integers n and d (1 ≤ n ≤ 105, 0 ≤ d ≤ 109).

The second line contains n numbers h1, h2, ..., hn (1 ≤ hi ≤ 1015).', 'The first line should contain one integer k, the maximal length of a jump sequence.

The second line should contain k integers i1, i2, ..., ik (1 ≤ i1 < i2 < ... < ik ≤ n), representing the pillars'' indices from the maximal length jump sequence.

If there is more than one maximal length jump sequence, print any.', '(1 ≤ i1 < i2 < ... < ik ≤ n) (1 ≤ n ≤ 105, 0 ≤ d ≤ 109) (1 ≤ hi ≤ 1015) (1 ≤ i1 < i2 < ... < ik ≤ n)', '[{"input":"","output":"5 2\n1 3 6 7 4"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-474e-a1', 'cf-474e', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-474E']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-514b', 'Laser Contador de Capivaras', 'Codeforces', 'https://codeforces.com/problemset/problem/514/B', 1500, 'There are n Imperial stormtroopers on the field. The battle field is a plane with Cartesian coordinate system. Each stormtrooper is associated with his coordinates (x, y) on this plane.

Han Solo has the newest duplex lazer gun to fight these stormtroopers. It is situated at the point (x0, y0). In one shot it can can destroy all the stormtroopers, situated on some line that crosses point (x0, y0).

Your task is to determine what minimum number of shots Han Solo needs to defeat all the stormtroopers.

The gun is the newest invention, it shoots very quickly and even after a very large number of shots the stormtroopers don''t have enough time to realize what''s happening and change their location.

## Input

The first line contains three integers n, x0 и y0 (1 ≤ n ≤ 1000,  - 104 ≤ x0, y0 ≤ 104) — the number of stormtroopers on the battle field and the coordinates of your gun.

Next n lines contain two integers each xi, yi ( - 104 ≤ xi, yi ≤ 104) — the coordinates of the stormtroopers on the battlefield. It is guaranteed that no stormtrooper stands at the same point with the gun. Multiple stormtroopers can stand at the same point.

## Output

Print a single integer — the minimum number of shots Han Solo needs to destroy all the stormtroopers.

## Examples

Input
    Output

    4 0 0
1 1
2 2
2 0
-1 -1

    2

Input
    Output

    2 1 2
1 1
1 0

    1

## Note

Explanation to the first and second samples from the statement, respectively:', 'The first line contains three integers n, x0 и y0 (1 ≤ n ≤ 1000,  - 104 ≤ x0, y0 ≤ 104) — the number of stormtroopers on the battle field and the coordinates of your gun.

Next n lines contain two integers each xi, yi ( - 104 ≤ xi, yi ≤ 104) — the coordinates of the stormtroopers on the battlefield. It is guaranteed that no stormtrooper stands at the same point with the gun. Multiple stormtroopers can stand at the same point.', 'Print a single integer — the minimum number of shots Han Solo needs to destroy all the stormtroopers.', '(x0, y0) (x0, y0) (1 ≤ n ≤ 1000,  - 104 ≤ x0, y0 ≤ 104) ( - 104 ≤ xi, yi ≤ 104)', '[{"input":"","output":"4 0 0\n1 1\n2 2\n2 0\n-1 -1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-514b-a1', 'cf-514b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-514B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1320a', 'PCV - O Problema da Capivara Viajante', 'Codeforces', 'https://codeforces.com/problemset/problem/1320/A', 1500, 'Tanya wants to go on a journey across the cities of Berland. There are $$$n$$$ cities situated along the main railroad line of Berland, and these cities are numbered from $$$1$$$ to $$$n$$$.

Tanya plans her journey as follows. First of all, she will choose some city $$$c_1$$$ to start her journey. She will visit it, and after that go to some other city $$$c_2 > c_1$$$, then to some other city $$$c_3 > c_2$$$, and so on, until she chooses to end her journey in some city $$$c_k > c_{k - 1}$$$. So, the sequence of visited cities $$$[c_1, c_2, \dots, c_k]$$$ should be strictly increasing.

There are some additional constraints on the sequence of cities Tanya visits. Each city $$$i$$$ has a beauty value $$$b_i$$$ associated with it. If there is only one city in Tanya''s journey, these beauty values imply no additional constraints. But if there are multiple cities in the sequence, then for any pair of adjacent cities $$$c_i$$$ and $$$c_{i + 1}$$$, the condition $$$c_{i + 1} - c_i = b_{c_{i + 1}} - b_{c_i}$$$ must hold.

For example, if $$$n = 8$$$ and $$$b = [3, 4, 4, 6, 6, 7, 8, 9]$$$, there are several three possible ways to plan a journey:

 -  $$$c = [1, 2, 4]$$$;
-  $$$c = [3, 5, 6, 8]$$$;
-  $$$c = [7]$$$ (a journey consisting of one city is also valid).
There are some additional ways to plan a journey that are not listed above.

Tanya wants her journey to be as beautiful as possible. The beauty value of the whole journey is the sum of beauty values over all visited cities. Can you help her to choose the optimal plan, that is, to maximize the beauty value of the journey?

## Input

The first line contains one integer $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the number of cities in Berland.

The second line contains $$$n$$$ integers $$$b_1$$$, $$$b_2$$$, ..., $$$b_n$$$ ($$$1 \le b_i \le 4 \cdot 10^5$$$), where $$$b_i$$$ is the beauty value of the $$$i$$$-th city.

## Output

Print one integer — the maximum beauty of a journey Tanya can choose.

## Examples

Input
    Output

    6
10 7 1 9 10 15

    26

Input
    Output

    1
400000

    400000

Input
    Output

    7
8 9 26 11 12 29 14

    55

## Note

The optimal journey plan in the first example is $$$c = [2, 4, 5]$$$.

The optimal journey plan in the second example is $$$c = [1]$$$.

The optimal journey plan in the third example is $$$c = [3, 6]$$$.', 'The first line contains one integer $$$n$$$ ($$$1 \le n \le 2 \cdot 10^5$$$) — the number of cities in Berland.

The second line contains $$$n$$$ integers $$$b_1$$$, $$$b_2$$$, ..., $$$b_n$$$ ($$$1 \le b_i \le 4 \cdot 10^5$$$), where $$$b_i$$$ is the beauty value of the $$$i$$$-th city.', 'Print one integer — the maximum beauty of a journey Tanya can choose.', '($$$1 \le n \le 2 \cdot 10^5$$$) ($$$1 \le b_i \le 4 \cdot 10^5$$$)', '[{"input":"","output":"6\n10 7 1 9 10 15"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1320a-a1', 'cf-1320a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-1320A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-300a', 'Multiplicação Capivária', 'Codeforces', 'https://codeforces.com/problemset/problem/300/A', 1500, 'Vitaly has an array of n distinct integers. Vitaly wants to divide this array into three non-empty sets so as the following conditions hold:

 -  The product of all numbers in the first set is less than zero ( < 0).
-  The product of all numbers in the second set is greater than zero ( > 0).
-  The product of all numbers in the third set is equal to zero.
-  Each number from the initial array must occur in exactly one set.
Help Vitaly. Divide the given array.

## Input

The first line of the input contains integer n (3 ≤ n ≤ 100). The second line contains n space-separated distinct integers a1, a2, ..., an (|ai| ≤ 103) — the array elements.

## Output

In the first line print integer n1 (n1 > 0) — the number of elements in the first set. Then print n1 numbers — the elements that got to the first set.

In the next line print integer n2 (n2 > 0) — the number of elements in the second set. Then print n2 numbers — the elements that got to the second set.

In the next line print integer n3 (n3 > 0) — the number of elements in the third set. Then print n3 numbers — the elements that got to the third set.

The printed sets must meet the described conditions. It is guaranteed that the solution exists. If there are several solutions, you are allowed to print any of them.

## Examples

Input
    Output

    3
-1 2 0

    1 -1
1 2
1 0

Input
    Output

    4
-1 -2 -3 0

    1 -1
2 -3 -2
1 0', 'The first line of the input contains integer n (3 ≤ n ≤ 100). The second line contains n space-separated distinct integers a1, a2, ..., an (|ai| ≤ 103) — the array elements.', 'In the first line print integer n1 (n1 > 0) — the number of elements in the first set. Then print n1 numbers — the elements that got to the first set.

In the next line print integer n2 (n2 > 0) — the number of elements in the second set. Then print n2 numbers — the elements that got to the second set.

In the next line print integer n3 (n3 > 0) — the number of elements in the third set. Then print n3 numbers — the elements that got to the third set.

The printed sets must meet the described conditions. It is guaranteed that the solution exists. If there are several solutions, you are allowed to print any of them.', '( < 0) ( > 0) (3 ≤ n ≤ 100) (|ai| ≤ 103) (n1 > 0) (n2 > 0)', '[{"input":"","output":"3\n-1 2 0"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-300a-a1', 'cf-300a', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-300A']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-300b', 'Formando times para a mineira (TODO: colocar capivara)', 'Codeforces', 'https://codeforces.com/problemset/problem/300/B', 1500, 'A programming coach has n students to teach. We know that n is divisible by 3. Let''s assume that all students are numbered from 1 to n, inclusive.

Before the university programming championship the coach wants to split all students into groups of three. For some pairs of students we know that they want to be on the same team. Besides, if the i-th student wants to be on the same team with the j-th one, then the j-th student wants to be on the same team with the i-th one. The coach wants the teams to show good results, so he wants the following condition to hold: if the i-th student wants to be on the same team with the j-th, then the i-th and the j-th students must be on the same team. Also, it is obvious that each student must be on exactly one team.

Help the coach and divide the teams the way he wants.

## Input

The first line of the input contains integers n and m (3 ≤ n ≤ 48, . Then follow m lines, each contains a pair of integers ai, bi (1 ≤ ai < bi ≤ n) — the pair ai, bi means that students with numbers ai and bi want to be on the same team.

It is guaranteed that n is divisible by 3. It is guaranteed that each pair ai, bi occurs in the input at most once.

## Output

If the required division into teams doesn''t exist, print number -1. Otherwise, print  lines. In each line print three integers xi, yi, zi (1 ≤ xi, yi, zi ≤ n) — the i-th team.

If there are multiple answers, you are allowed to print any of them.

## Examples

Input
    Output

    3 0

    3 2 1

Input
    Output

    6 4
1 2
2 3
3 4
5 6

    -1

Input
    Output

    3 3
1 2
2 3
1 3

    3 2 1', 'The first line of the input contains integers n and m (3 ≤ n ≤ 48, . Then follow m lines, each contains a pair of integers ai, bi (1 ≤ ai < bi ≤ n) — the pair ai, bi means that students with numbers ai and bi want to be on the same team.

It is guaranteed that n is divisible by 3. It is guaranteed that each pair ai, bi occurs in the input at most once.', 'If the required division into teams doesn''t exist, print number -1. Otherwise, print  lines. In each line print three integers xi, yi, zi (1 ≤ xi, yi, zi ≤ n) — the i-th team. 

If there are multiple answers, you are allowed to print any of them.', '(1 ≤ ai < bi ≤ n) (1 ≤ xi, yi, zi ≤ n)', '[{"input":"","output":"3 0"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-300b-a1', 'cf-300b', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: CodeForces-300B']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-edit-distance', 'Edit Distance', 'CSES', 'https://cses.fi/problemset/task/1639', 1600, 'Compute the minimum number of operations (insert, delete, replace) to transform string $s$ into string $t$.', 'The first line contains string $s$.

The second line contains string $t$.', 'Print the edit distance between $s$ and $t$.', '$1 \le |s|,|t| \le 5000$', '[{"input":"LOVE\nMOVIE","output":"2"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-edit-distance-a1', 'cses-edit-distance', 'Levenshtein DP', ARRAY['Dynamic Programming']::text[], ARRAY['Knapsack']::text[], ARRAY['2D Array']::text[], ARRAY['State is (i, j) prefixes','Transition min of insert/delete/replace']::text[], 'Standard Levenshtein DP: $dp[i][j]$ from first $i$ chars of $s$ to first $j$ of $t$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-company-queries-i', 'Company Queries I', 'CSES', 'https://cses.fi/problemset/task/1687', 1600, 'A company has a tree hierarchy rooted at employee $1$. You process $q$ queries: given employee $x$ and integer $k$, who is the $k$-th boss above $x$? Print $-1$ if none.', 'The first line contains two integers $n$ and $q$.

The second line contains $n-1$ integers: the boss of each employee $2\dots n$.

Then $q$ lines follow with queries $x\ k$.', 'For each query print the $k$-th boss of $x$, or $-1$ if none.', '$1 \le n,q \le 2 \times 10^5$', '[{"input":"5 3\n1 1 3 3\n4 1\n4 2\n4 3","output":"3\n1\n-1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-company-queries-i-a1', 'cses-company-queries-i', 'Binary lifting', ARRAY['Graph Algorithms']::text[], ARRAY['LCA']::text[], ARRAY['2D Array','Adjacency List']::text[], ARRAY['Precompute $up[v][j]$ = $2^j$-th ancestor of $v$','Answer each query by walking bits of $k$']::text[], 'Build the parent tree, then binary-lifting table. For query $(x,k)$, jump according to set bits of $k$; if you fall off the root, answer $-1$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-distance-queries', 'Distance Queries', 'CSES', 'https://cses.fi/problemset/task/1135', 1600, 'You are given a tree of $n$ nodes. Process $q$ queries asking for the distance (number of edges) between two nodes.', 'The first line contains two integers $n$ and $q$.

Then $n-1$ lines follow with tree edges.

Then $q$ lines follow with queries $a\ b$.', 'For each query print the distance between $a$ and $b$.', '$1 \le n,q \le 2 \times 10^5$', '[{"input":"5 3\n1 2\n1 3\n3 4\n3 5\n2 5\n1 4\n4 5","output":"3\n2\n1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-distance-queries-a1', 'cses-distance-queries', 'LCA + depths', ARRAY['Graph Algorithms']::text[], ARRAY['LCA']::text[], ARRAY['2D Array','Adjacency List']::text[], ARRAY['$\mathrm{dist}(a,b) = \mathrm{depth}[a]+\mathrm{depth}[b]-2\cdot\mathrm{depth}[\mathrm{lca}(a,b)]$','Binary lifting answers LCA in $O(\log N)$']::text[], 'Root the tree, store depths, preprocess LCA with binary lifting, then answer each distance query with the depth formula.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('uva-how-many-trees', 'How Many Trees?', 'Other', null, 1600, 'Count the number of different **labeled** binary trees that can be built using exactly $n$ distinct elements.

With one element $A$, there is one tree. With two elements $A$ and $B$, there are four trees:

[[figure:binary-trees]]

Given several $n$ ($1 \le n \le 300$), print the count for each. Input ends with $0$.

```text
Sample input:
1
2
10
0

Sample output:
1
4
60949324800
```', 'Input consists of several integers $n$ ($1 \le n \le 300$), one per line. A line with $0$ ends the input and is not processed.', 'For each $n$ print the number of labeled binary trees on $n$ nodes, followed by a newline.', '$1 \le n \le 300$', '[{"input":"1\n2\n10\n0","output":"1\n4\n60949324800"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('uva-how-many-trees-a1', 'uva-how-many-trees', 'Catalan × n!', ARRAY['Dynamic Programming','Math / Number Theory']::text[], ARRAY[]::text[], ARRAY['1D Array']::text[], ARRAY['Unlabeled binary tree shapes are Catalan numbers $C_{n}$','Labeled count is $C_n \cdot n!$ (assign labels to nodes)','Need big integers for $n$ up to 300']::text[], 'The number of labeled binary trees on $n$ nodes is $n! \cdot C_n$ where $C_n$ is the $n$-th Catalan number. Precompute with big-integer DP.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-531', 'Competição na SI', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=531', 1600, 'Bessie and her friends are playing hoofball in the annual Superbull championship, and Farmer John is in charge of making the tournament as exciting as possible.  A total of N (1 <= N <= 2000) teams are playing in the Superbull. Each team is assigned a distinct integer team ID in the range 1...2^30-1 to distinguish it from the other teams. The Superbull is an elimination tournament -- after every game, Farmer John chooses which team to eliminate from the Superbull, and the eliminated team can no longer play in any more games. The Superbull ends when only one team remains.

Farmer John notices a very unusual property about the scores in matches! In any game, the combined score of the two teams always ends up being the bitwise exclusive OR (XOR) of the two team IDs. For example, if teams 12 and 20 were to play, then 24 points would be scored in that game, since 01100 XOR 10100 = 11000.

Farmer John believes that the more points are scored in a game, the more exciting the game is. Because of this, he wants to choose a series of games to be played such that the total number of points scored in the Superbull is maximized. Please help Farmer John organize the matches.

INPUT FORMAT: (file superbull.in)

The first line contains the single integer N.  The following N lines contain the N team IDs.

OUTPUT FORMAT: (file superbull.out)

Output the maximum possible number of points that can be scored in the Superbull.

    Input
    Output

    4
3
6
9
10

    37

OUTPUT DETAILS: One way to achieve 37 is as follows: FJ matches teams 3 and 9, and decides that 9 wins, so teams 6, 9, and 10 are left in the tournament. He then matches teams 6 and 9, and lets team 6 win. Teams 6 and 10 are then left in the tournament. Finally, teams 6 and 10 face off, and team 10 wins. The total number of points scored is (3 XOR 9) + (6 XOR 9) + (6 XOR 10) = 10 + 15 + 12 = 37.

NOTE: The bitwise exclusive OR operation, commonly denoted by the ^ symbol, is a bitwise operation that performs the logical exclusive OR operation on each position in two binary integers. The result in each position is 1 if only the first bit is 1 or only the second bit is 1, but is 0 if both bits are 0 or both are 1. For example: 10100 (decimal 20) XOR 01100 (decimal 12) = 11000 (decimal 24)

[Problem credits: Alex Yang, 2015]', 'See statement.', 'See statement.', '(1 <= N <= 2000) (3 XOR 9) (6 XOR 9) (6 XOR 10) (decimal 20) (decimal 12)', '[{"input":"FORMAT: (file superbull.in)\n\nThe first line contains the single integer N.  The following N lines contain the N team IDs.","output":"FORMAT: (file superbull.out)"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-531-a1', 'usaco-531', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-531']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-620', 'Doce para a SI', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=620', 1600, 'Farmer John has received an order for exactly $M$ units of milk
($1 \leq M \leq 200$) that he needs to fill right away.  Unfortunately, his
fancy milking machine has just become broken, and all he has are two milk pails
of integer sizes $X$ and $Y$ ($1 \leq X, Y \leq 100$) with which he can measure
milk.  Both pails are initially empty.  Using these two pails, he can perform up
to $K$ of the following types of operations ($1 \leq K \leq 100$):

- He can fill either pail completely to the top.

- He can empty either pail.

- He can pour the contents of one pail into the other, stopping when the former
becomes empty or the latter becomes full (whichever of these happens first).

Although FJ realizes he may not be able to end up with exactly $M$ total units
of milk in the two pails, please help him compute the minimum amount of error
between $M$ and the total amount of milk in the two pails.  That is, please
compute the minimum value of $|M-M''|$ such that FJ can construct $M''$ units of
milk collectively between the two  pails.

INPUT FORMAT (file pails.in):

The first, and only line of input, contains $X$, $Y$, $K$, and $M$.

OUTPUT FORMAT (file pails.out):

Output the smallest distance from $M$ to an amount of milk FJ can produce.

    Input
    Output

    14 50 2 32

    18

In two steps FJ can be left with the following quanities in his pails

(0, 0) = 0 units
(14, 0) = 14 units
(0, 50) = 50 units
(0, 14) = 14 units
(14, 36) = 50 units
(14, 50) = 64 units

The closest we can come to 32 units is 14 for a difference of 18.  Note that it
would require an extra step to pour out the first pail to end up with (0, 36).

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq M \leq 200$) ($1 \leq X, Y \leq 100$) ($1 \leq K \leq 100$) (0, 0) (14, 0) (0, 50)', '[{"input":"FORMAT (file pails.in):\n\nThe first, and only line of input, contains $X$, $Y$, $K$, and $M$.","output":"FORMAT (file pails.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-620-a1', 'usaco-620', 'Pending editorial review', ARRAY['Graph Algorithms']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-620']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-964', 'Onde', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=964', 1600, 'Farmer John has gone out for a walk down the road and thinks he may now be lost!

Along the road there are $N$ farms ($1 \leq N \leq 100$) in a row.  Farms unfortunately
do not have house numbers, making it hard for Farmer John to figure out his location
along the road.  However, each farm does have a colorful mailbox along the side of the
road, so Farmer John hopes that if he looks at the colors of the mailboxes
nearest to him, he can uniquely determine where he is.

Each mailbox color is specified by a letter in the range A..Z, so the sequence of $N$
mailboxes down the road can be represented by a string of length $N$ containing
letters in the range A..Z.  Some mailboxes may have the same colors as other mailboxes.
Farmer John wants to know what is the smallest value of $K$ such that if he looks at
any sequence of $K$ consecutive mailboxes, he can uniquely determine the location
of that sequence along the road.

For example, suppose the sequence of mailboxes along the road is ''ABCDABC''.  Farmer
John cannot set $K=3$, since if he sees ''ABC'', there are two possible locations along
the road where this consecutive set of colors might be.  The smallest value of $K$
that works is $K=4$, since if he looks at any consecutive set of 4 mailboxes,
this sequence of colors uniquely determines his position along the road.

INPUT FORMAT (file whereami.in):

The first line of input contains $N$, and the second line contains a string of $N$ characters, each in the range A..Z.

OUTPUT FORMAT (file whereami.out):

Print a line containing a single integer, specifying the smallest value of $K$ that
solves Farmer John''s problem.

    Input
    Output

    7
ABCDABC

    4

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file whereami.in):\n\nThe first line of input contains $N$, and the second line contains a string of $N$ characters, each in the range A..Z.","output":"FORMAT (file whereami.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-964-a1', 'usaco-964', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-964']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-831', 'Velha', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=831', 1600, 'Farmer John owns 26 cows, which by happenstance all have names starting with
different letters of the alphabet, so Farmer John typically refers to each cow
using her first initial -- a character in the range $A \ldots Z$.

The cows have recently become fascinated by the game of tic-tac-toe, but since
they don''t like the fact that only two cows can play at a time, they have
invented a variant where multiple cows can play at once!  Just like with regular
tic-tac-toe, the game is played on a $3 \times 3$ board, only instead of just Xs
and Os, each square is marked with a single  character in the range $A \ldots Z$
to indicate the initial of the cow who  claims that square.

An example of a gameboard might be:

COW
XXO
ABC

The cows fill in each of the nine squares before they become confused about how
to figure out who has won the game.  Clearly, just like with regular
tic-tac-toe, if any single cow has claimed an entire row, column, or diagonal,
that cow could claim victory by herself.  However, since the cows think this
might not be likely given the larger number of players, they decide to allow
cows to form teams of  two, where a team of two cows can claim victory if any
row, column, or diagonal consists only of characters belonging to the two cows
on the team, and moreover if characters from both cows (not just one) are used
in this row, column, or diagonal.

Please help the cows figure out how many individuals or two-cow teams can claim
victory.  Note that the same square on the game board might possibly be usable
in several different claims to victory.

INPUT FORMAT (file tttt.in):

The input consists of three lines, each of which is three characters in the
range $A \ldots Z$.

OUTPUT FORMAT (file tttt.out):

Output should consist of two lines.  On the first line, output the number of
individual cows who can claim victory.  On the second line, output the number
of two-cow teams that could claim victory.

    Input
    Output

    COW
XXO
ABC

    0
2

In this example, no single cow can claim victory.  However, if cows C and X team
up, they can win via the C-X-C diagonal.  Also, if cows X and O team up, they
can win via the middle row.

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT (file tttt.in):\n\nThe input consists of three lines, each of which is three characters in the\nrange $A \\ldots Z$.","output":"FORMAT (file tttt.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-831-a1', 'usaco-831', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-831']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1107', 'Ano', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1107', 1600, 'Farmer John''s cows are excited to learn that Chinese New Year was recently
celebrated, ushering in the year of the Ox, always a bovine favorite.

As we know, the zodiac animals for Chinese calendar years follow a 12-year
cycle: Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig,
Rat, and then Ox again.

Bessie the cow is proud to say she was born in a year of the Ox, many years ago.
Her friend Elsie wants to know how many years apart from Bessie she was born,
and hopes you can help her deduce this by looking at relationships between the
birth years of several cows on the farm.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains an integer $N$ ($1 \leq N \leq 100$).  Each of
the next $N$ lines contains an 8-word phrase specifying the relationship between
the birth years of two cows.  It is of the form

"Mildred born in previous Dragon year from Bessie",

or

"Mildred born in next Dragon year from Bessie"

The last word is the name of a cow on the farm, which is either "Bessie" or a
cow that has already been mentioned in a previous line of input.

The first word is the name of a cow on the farm who is not "Bessie" and who  has
not yet been mentioned  in the input.  All cow names have at most 10 characters
that are in the range a..z or A..Z.

The 5th word is one of the 12 zodiac animals above.

The 4th word is either "previous" or "next".  For example, if the phrase is
"Mildred born in previous Dragon year from Bessie", then Mildred''s year of
birth was the Dragon year closest to and strictly before (not equal to)
Bessie''s birth year.

OUTPUT FORMAT (print output to the terminal / stdout):

Please output the number of years by which Bessie and Elsie''s birth years differ.
It is guaranteed that this number can be determined by the input given.

    Input
    Output

    4
Mildred born in previous Dragon year from Bessie
Gretta born in previous Monkey year from Mildred
Elsie born in next Ox year from Gretta
Paulina born in next Dog year from Bessie

    12

In the input above,

- Elsie was born 12 years before Bessie.
- Mildred was born 9 years
before Bessie.
- Gretta was born 17 years before Bessie.
- Paulina
was born 9 years after Bessie.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains an integer $N$ ($1 \\leq N \\leq 100$).  Each of\nthe next $N$ lines contains an 8-word phrase specifying the relationship between\nthe birth years of two cows.  It is of the form\n\n\"Mildred born in previous Dragon year from Bessie\",\n\nor\n\n\"Mildred born in next Dragon year from Bessie\"\n\nThe last word is the name of a cow on the farm, which is either \"Bessie\" or a\ncow that has already been mentioned in a previous line of input.\n\nThe first word is the name of a cow on the farm who is not \"Bessie\" and who  has\nnot yet been mentioned  in the input.  All cow names have at most 10 characters\nthat are in the range a..z or A..Z.\n\nThe 5th word is one of the 12 zodiac animals above.\n\nThe 4th word is either \"previous\" or \"next\".  For example, if the phrase is\n\"Mildred born in previous Dragon year from Bessie\", then Mildred''s year of\nbirth was the Dragon year closest to and strictly before (not equal to)\nBessie''s birth year.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1107-a1', 'usaco-1107', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1107']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-687', 'Último', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=687', 1600, 'Farmer John owns 7 dairy cows: Bessie, Elsie, Daisy, Gertie, Annabelle, Maggie,
and Henrietta. He milks them every day and keeps detailed records on the amount
of milk provided by each cow during each milking session.  Not surprisingly,
Farmer John highly prizes cows that provide large amounts of milk.

Cows, being lazy creatures, don''t necessarily want to be responsible for
producing too much milk.  If it were up to them, they would each be perfectly
content to be the lowest-producing cow in the entire herd.  However, they keep
hearing Farmer John mentioning the phrase "farm to table" with his human
friends, and while they don''t quite understand what this means, they have a
suspicion that it actually may not be the best idea to be the cow producing the
least amount of milk.  Instead, they figure it''s safer to be in the position of
producing the second-smallest amount of milk in the herd.  Please help the cows
figure out which of them currently occupies this desirable position.

INPUT FORMAT (file notlast.in):

The input file for this task starts with a line containing the integer $N$
($1 \leq N \leq 100$), giving the number of entries in Farmer John''s milking
log.

Each of the $N$ following lines contains the name of a cow (one of the seven
above) followed by a positive integer (at most 100), indicating the amount of
milk produced by the cow during one of its milking sessions.

Any cow that does not appear in the log at all is assumed to have produced no
milk.

OUTPUT FORMAT (file notlast.out):

On a single line of output, please print the name of the cow that produces the
second-smallest amount of milk.  More precisely, if $M$ is the minimum total
amount of milk produced by any cow, please output the name of the cow whose
total production is minimal among all cows that produce more than $M$ units of
milk.  If several cows tie for this designation, or if no cow has this
designation (i.e., if all cows have production equal to $M$), please output the
word "Tie". Don''t forget to add a newline character at the end of your line of
output. Note that $M=0$ if one of the seven cows is completely absent from the
milking log, since this cow would have produced no milk.

    Input
    Output

    10
Bessie 1
Maggie 13
Elsie 3
Elsie 4
Henrietta 4
Gertie 12
Daisy 7
Annabelle 10
Bessie 6
Henrietta 5

    Henrietta

In this example, Bessie, Elsie, and Daisy all tie for the minimum by each
producing 7 units of milk.  The next-largest production, 9 units, is due to
Henrietta.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$) (at most 100)', '[{"input":"FORMAT (file notlast.in):\n\nThe input file for this task starts with a line containing the integer $N$\n($1 \\leq N \\leq 100$), giving the number of entries in Farmer John''s milking\nlog.\n\nEach of the $N$ following lines contains the name of a cow (one of the seven\nabove) followed by a positive integer (at most 100), indicating the amount of\nmilk produced by the cow during one of its milking sessions.\n\nAny cow that does not appear in the log at all is assumed to have produced no\nmilk.","output":"FORMAT (file notlast.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-687-a1', 'usaco-687', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-687']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1468', 'Mês', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1468', 1600, 'Farmer John is trying to describe his favorite USACO contest to Elsie, but she
is having trouble understanding why he likes it so much. He says "My favorite
part of the contest was when Bessie said ''It''s Mooin'' Time'' and mooed all over
the contest."

Elsie still doesn''t understand, so Farmer John downloads the contest as a text
file and tries to explain what he means. The contest is defined as an array of
$N$ ($1\le N\le 10^6$) integers $a_1, a_2, \dots, a_N$ ($1\le a_i\le N$). Farmer
John defines a moo as an array of three integers  where the second integer
equals the third but not the first. A moo is said to occur in the contest if it
is possible to remove integers from the array until only the moo remains.

As Bessie allegedly "mooed all over the contest", help Elsie count the number of
distinct moos that occur in the contest! Two moos are distinct if they do not consist of the same integers in the same
order.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains $N$.

The second line contains $N$ space-separated integers $a_1,a_2,\dots,a_N$.

OUTPUT FORMAT (print output to the terminal / stdout):

Output the number of distinct moos that occur in the contest.

**Note that the large size of integers involved in this problem may require
the use of 64-bit integer data types (e.g., a "long" in Java, a "long long" in
C/C++).**

    Input
    Output

    6
1 2 3 4 4 4

    3

This contest has three distinct moos: "1 4 4", "2 4 4", and "3 4 4".

SCORING:

- Inputs 2-4: $N\le 10^2$
- Inputs 5-7: $N\le 10^4$
- Inputs 8-11: No additional constraints.

Problem credits: Benjamin Qi', 'See statement.', 'See statement.', '($1\le N\le 10^6$) ($1\le a_i\le N$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains $N$.\n\nThe second line contains $N$ space-separated integers $a_1,a_2,\\dots,a_N$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1468-a1', 'usaco-1468', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1468']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1012', 'Cientista louco', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1012', 1600, 'Farmer John''s cousin Ben happens to be a mad scientist.  Normally, this creates
a good bit of friction at family gatherings, but it can occasionally be helpful,
especially when Farmer John finds himself facing unique and unusual problems
with his cows.

Farmer John is currently facing a unique and unusual problem with his cows. He
recently ordered $N$ cows ($1 \leq N \leq 1000$) consisting of two different
breeds: Holsteins and Guernseys.  He specified the cows in his order in terms of
a string of $N$ characters, each either H (for Holstein) or G (for Guernsey).
Unfortunately, when the cows arrived at his farm and he lined them up, their
breeds formed a different string from this original string.

Let us call these two strings $A$ and $B$, where $A$ is the string of breed
identifiers Farmer John originally wanted, and $B$ is the string he sees when
his cows arrive.  Rather than simply check if re-arranging the cows  in $B$ is
sufficient to obtain $A$, Farmer John asks his cousin Ben to help him solve the
problem with his scientific ingenuity.

After several months of work, Ben creates a remarkable machine, the
multi-cow-breed-flipinator 3000, that is capable of taking any
substring of cows and toggling their breeds: all Hs become Gs and all
Gs become Hs in the substring.  Farmer John wants to figure out the
minimum number of times he needs to apply this machine to transform
his current ordering $B$ into his original desired ordering $A$.
Sadly, Ben''s mad scientist skills don''t extend beyond creating
ingenious devices, so you need to help Farmer John solve this
computational conundrum.

INPUT FORMAT (file breedflip.in):

The first line of input contains $N$, and the next two lines contain the
strings $A$ and $B$.  Each string has $N$ characters that are either H or G.

OUTPUT FORMAT (file breedflip.out):

Print the minimum number of times the machine needs to be applied to transform
$B$ into $A$.

    Input
    Output

    7
GHHHGHH
HHGGGHH

    2

First, FJ can transform the substring that corresponds to the first character
alone,  transforming $B$ into GHGGGHH.  Next, he can transform the substring
consisting  of the third and fourth characters, giving $A$.  Of course, there
are other combinations of two applications of the machine that also work.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 1000$)', '[{"input":"FORMAT (file breedflip.in):\n\nThe first line of input contains $N$, and the next two lines contain the\nstrings $A$ and $B$.  Each string has $N$ characters that are either H or G.","output":"FORMAT (file breedflip.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1012-a1', 'usaco-1012', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1012']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1301', 'Mooloo', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1301', 1600, 'Bessie likes to watch shows on Mooloo. Because Bessie is a busy cow, she has
planned a schedule for the next $N$ ($1 \leq N \leq 10^5$) days that she will
watch Mooloo. Because Mooloo is a paid subscription service, she now needs to
decide how to minimize the amount of money she needs to pay.

Mooloo has an interesting subscription system: it costs $d + K$
($1\le K\le 10^9$) moonies to subscribe to Mooloo for $d$ consecutive days. You
can start a subscription at any time, and you can start a new subscription as
many times as you desire if your current subscription expires. Given this,
figure out the minimum amount of moonies Bessie needs to pay to fulfill her
schedule.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains integers $N$ and $K$.

The second line contains $N$ integers describing the days Bessie will watch
Mooloo:
$1\le d_1<d_2<\dots<d_N\le 10^{14}$.

OUTPUT FORMAT (print output to the terminal / stdout):

Note that the large size of integers involved in this problem may require the
use of 64-bit integer data types (e.g., a "long long" in C/C++).

    Input
    Output

    2 4
7 9

    7

Bessie buys a three-day subscription on day 7, spending $d+K = 3 + 4 = 7$
moonies.

    Input
    Output

    2 3
1 10

    8

Bessie first buys a one-day subscription on day 1, spending $d+K = 1+3 = 4$
moonies.  Bessie also buys a one-day subscription on day 10, spending
$d+K = 1+3 = 4$ moonies. In total, Bessie spends 8 moonies.

SCORING:

- Inputs 3-5: $N \le 10$
- Inputs 6-12: No additional constraints.

Problem credits: Danny Mittal', 'See statement.', 'See statement.', '($1 \leq N \leq 10^5$) ($1\le K\le 10^9$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains integers $N$ and $K$.\n\nThe second line contains $N$ integers describing the days Bessie will watch\nMooloo:\n$1\\le d_1<d_2<\\dots<d_N\\le 10^{14}$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1301-a1', 'usaco-1301', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1301']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-689', 'Tombada', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=689', 1600, 'Farmer John occasionally has trouble with bored teenagers who visit his farm at
night and tip over his cows.  One morning, he wakes up to find it has happened
again -- his $N^2$ cows  began the night grazing in a perfect $N \times N$
square grid arrangement ($1 \leq N \leq 10$), but he finds that some of them are
now tipped over.

Fortunately, Farmer John has used parts from his tractor and forklift to build a
glorious machine, the Cow-Untipperator 3000, that can flip over large groups of
cows all at once, helping him put all his cows back on their feet as quickly as
possible.  He can apply the machine to any "upper-left rectangle" in his grid of
cows -- a rectangular sub-grid that contains the upper-left cow.  When he does
so, the machine flips over every cow in this rectangle,  placing tipped cows
back on their feet, but unfortunately also tipping over cows that were already
on their feet!  In other words, the machine "toggles" the state of each cow in
the rectangle.

Farmer John figures that by applying his machine sufficiently many times to the
appropriate collection of rectangles, he can eventually restore all the cows to
their rightful, un-tipped states.  Please help him determine the minimum number
of applications of his machine needed to do this.

Note that applying the machine to the same rectangle twice would be pointless,
since this would have no net impact on the cows in the rectangle.  Therefore,
you should only consider applying the machine to each upper-left rectangle
possibly only once.

INPUT FORMAT (file cowtip.in):

The first line of the input is the integer $N$.

Each of the $N$ subsequent lines contains a string of $N$ characters, each
either 0 (representing an up-tipped cow) or 1 (representing a tipped cow).

OUTPUT FORMAT (file cowtip.out):

Please output the minimum number of times Farmer John needs to apply the
Cow-Untipperator 3000 to restore all his cows to their feet.

    Input
    Output

    3
001
111
111

    2

In this example, if FJ applies his machine to the entire herd of cows (which is
a valid upper-left rectangle), he will
toggle their state to the following:

110
000
000

All that remains is to apply the machine to the upper-left rectangle containing
the two 1s, and he is finished.  In total, this is just 2 applications.

Problem credits: Nathan Pinsker', 'See statement.', 'See statement.', '($1 \leq N \leq 10$)', '[{"input":"FORMAT (file cowtip.in):\n\nThe first line of the input is the integer $N$.\n\nEach of the $N$ subsequent lines contains a string of $N$ characters, each\neither 0 (representing an up-tipped cow) or 1 (representing a tipped cow).","output":"FORMAT (file cowtip.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-689-a1', 'usaco-689', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-689']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1084', 'Foto', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1084', 1600, 'Farmer John is yet again trying to take a photograph of his $N$ cows
($2 \leq N \leq 1000$).

Each cow has an integer "breed ID" number in the range $1 \ldots 100$.  Farmer
John has a very peculiar idea in mind for his photo: he wants to partition all
the cows into disjoint groups (in other words, place each cow in exactly one group) and then
line up the groups so the sum of the breed IDs of  the cows in the first group
is even, the sum of the IDs in the second group is odd, and so on, alternating
between even and odd.

What is the maximum possible number of groups Farmer John can form?

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains $N$.  The next line contains $N$
space-separated integers giving the breed IDs of the $N$ cows.

OUTPUT FORMAT (print output to the terminal / stdout):

The maximum possible number of groups in Farmer John''s photo. It can be shown
that at least one feasible grouping exists.

    Input
    Output

    7
1 3 5 7 9 11 13

    3

In this example, one way to form the maximum number of three groups is as
follows. Place 1 and 3 in the first group, 5, 7, and 9 in the second group, and
11 and 13 in the third group.

    Input
    Output

    7
11 2 17 13 1 15 3

    5

In this example, one way to form the maximum number of five groups is as
follows. Place 2 in the first group, 11 in the second group, 13 and 1 in the
third group, 15 in the fourth group, and 17 and 3 in the fifth group.

Problem credits: Nick Wu', 'See statement.', 'See statement.', '($2 \leq N \leq 1000$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains $N$.  The next line contains $N$\nspace-separated integers giving the breed IDs of the $N$ cows.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1084-a1', 'usaco-1084', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1084']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-785', 'Fora do lugar', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=785', 1600, 'Feeling ambitious, Farmer John plans to attempt something that never seems to go
quite right: he wants to take a photograph of his entire herd of cows.

To make the photograph look nice, he wants the cows to line up in a single row
from shortest to tallest. Unfortunately, right after he has the cows line up
this way, Bessie the cow, always the troublemaker, steps out of line and
re-inserts herself at some other location in the lineup!

Farmer John would like to swap pairs of cows so the entire herd is again lined
up properly. Please help him determine the minimum number of swaps he needs to
make between pairs of cows in order to achieve this goal.

INPUT FORMAT (file outofplace.in):

The first line of input contains $N$ ($2 \leq N \leq 100$).  The next $N$ lines
describe the heights of the cows as they are lined up after Bessie makes her
move. Each cow height is an integer in the range $1 \ldots 1,000,000$.  Cows may
have the same height.

OUTPUT FORMAT (file outofplace.out):

Please output the minimum number of times Farmer John needs to swap pairs of
cows in order to achieve a proper ordering.  Swaps do not necessarily need to
involve adjacent cows in the ordering.

    Input
    Output

    6
2
4
7
7
9
3

    3

In this example, Bessie is clearly the cow of height 3. FJ return the cows to sorted order
using three swaps as described below:

2 4 7 7 9 3 - Original Lineup
2 4 7 7 3 9 - Swap the last two cows
2 4 3 7 7 9 - Swap the first 7 and 3
2 3 4 7 7 9 - Swap 4 and 3

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($2 \leq N \leq 100$)', '[{"input":"FORMAT (file outofplace.in):\n\nThe first line of input contains $N$ ($2 \\leq N \\leq 100$).  The next $N$ lines\ndescribe the heights of the cows as they are lined up after Bessie makes her\nmove. Each cow height is an integer in the range $1 \\ldots 1,000,000$.  Cows may\nhave the same height.","output":"FORMAT (file outofplace.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-785-a1', 'usaco-785', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-785']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-832', 'Ordenha', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=832', 1600, 'Farmer John''s $N$ cows ($2 \leq N \leq 100$), conveniently numbered $1 \ldots N$
as always, happen to have too much time on their hooves.  As a result, they have
worked out a complex social structure related to the order in which Farmer John
milks them every morning.  After weeks of study, Farmer John has discovered that
this structure is based on two key properties.

First, due to the cows'' social hierarchy, some cows insist on being milked
before other cows, based on the social status level of each cow.  For example,
if cow 3 has the highest status, cow 2 has average status, and cow 5 has low
status, then cow 3 would need to be milked earliest, followed later by cow 2 and
finally  by cow 5.

Second, some cows only allow themselves to be milked at a certain position
within the ordering.  For example, cow 4 might insist on being milked second
among all the cows.

Luckily, Farmer John will always be able to milk his cows in an order satisfying
all of these conditions.

Unfortunately, cow 1 has recently fallen ill, so Farmer John wants to milk this
cow as early in the order as possible so that she can return to the barn and get
some much-needed rest.  Please help Farmer John determine the earliest position
cow 1 can appear in the milking order.

INPUT FORMAT (file milkorder.in):

The first line contains $N$, $M$ ($1 \leq M < N$), and $K$ ($1 \leq K < N$),
indicating that Farmer John has $N$ cows, $M$ of his cows have arranged
themselves into a social hierarchy, and $K$ of his cows demand that they be
milked in a specific position in the order.  The next line contains $M$ distinct
integers $m_i$ ($1 \leq m_i \leq N$). The cows present on this line must be
milked in the same order in which they appear in this line.  The next $K$ lines
contain two integers $c_i$ ($1 \leq c_i \leq N$) and $p_i$
($1 \leq p_i \leq N$), indicating that cow $c_i$ must be milked in position
$p_i$.

It is guaranteed that under these constraints, Farmer John will be able to
construct a valid milking order.

OUTPUT FORMAT (file milkorder.out):

Please output the earliest position cow 1 can take in the milking order.

    Input
    Output

    6 3 2
4 5 6
5 3
3 1

    4

In this example, Farmer John has six cows, with cow 1 being sick.  He needs  to
milk cow 4 before cow 5 and cow 5 before cow 6.  Moreover, Farmer John has to
milk cow 3 first and cow 5 third.

FJ has to milk cow 3 first, and since cow 4 has to come before cow 5, cow 4 must
be milked second, and cow 5 third.  Thus, cow 1 can be fourth at earliest in the
order.

Problem credits: Jay Leeds', 'See statement.', 'See statement.', '($2 \leq N \leq 100$) ($1 \leq M < N$) ($1 \leq K < N$) ($1 \leq m_i \leq N$) ($1 \leq c_i \leq N$) ($1 \leq p_i \leq N$)', '[{"input":"FORMAT (file milkorder.in):\n\nThe first line contains $N$, $M$ ($1 \\leq M < N$), and $K$ ($1 \\leq K < N$),\nindicating that Farmer John has $N$ cows, $M$ of his cows have arranged\nthemselves into a social hierarchy, and $K$ of his cows demand that they be\nmilked in a specific position in the order.  The next line contains $M$ distinct\nintegers $m_i$ ($1 \\leq m_i \\leq N$). The cows present on this line must be\nmilked in the same order in which they appear in this line.  The next $K$ lines\ncontain two integers $c_i$ ($1 \\leq c_i \\leq N$) and $p_i$\n($1 \\leq p_i \\leq N$), indicating that cow $c_i$ must be milked in position\n$p_i$.\n\nIt is guaranteed that under these constraints, Farmer John will be able to\nconstruct a valid milking order.","output":"FORMAT (file milkorder.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-832-a1', 'usaco-832', 'Pending editorial review', ARRAY['Greedy','Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-832']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1227', 'Foto de novo', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1227', 1600, 'Farmer John, desperate to win the award for best cow photographer at the county
fair, is trying to take the perfect photograph of his $N$ cows
($2 \leq N \leq 2\cdot 10^5$, $N$ even).

Farmer John owns cows of two potential breeds: Guernseys and Holsteins.
To make his photo as aesthetic as possible, he wants to line up his
cows so that as many Guernseys are in even-numbered positions in the line
as possible (the first position in the line is an odd position, the next is
an even position, and so on). Due to his lack of strong
communication with his cows, the only way he can achieve his goal is by asking
even length "prefixes" of his cows to reverse themselves (a prefix
consists of the range of cows from the first cow up to the $j$th cow
for some position $j$).

Please count the minimum number of reversals required for Farmer John to achieve
his goal.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains the value of $N$.

The second line contains a string of length $N,$ specifying the initial ordering
of the cows from left to right. Each ''H'' represents a Holstein, while each ''G''
represents a Guernsey.

OUTPUT FORMAT (print output to the terminal / stdout):

Output the minimum number of reversals needed on a single line.

    Input
    Output

    14
GGGHGHHGHHHGHG

    1

In this example, it suffices to reverse the prefix consisting of the first six
cows.

   GGGHGHHGHHHGHG (Before)
-> HGHGGGHGHHHGHG (After)

Before the reversal, four Guernseys were at even positions. After the reversal,
six Guernseys are at even positions. It is impossible for there to be more than
six Guernseys at even positions.

SCORING:

- Test cases 2-6 satisfy $N\le 1000$.
- Test cases 7-11 satisfy no additional constraints.

Problem credits: Aryansh Shrivastava', 'See statement.', 'See statement.', '($2 \leq N \leq 2\cdot 10^5$, $N$ even)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains the value of $N$.\n\nThe second line contains a string of length $N,$ specifying the initial ordering\nof the cows from left to right. Each ''H'' represents a Holstein, while each ''G''\nrepresents a Guernsey.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1227-a1', 'usaco-1227', 'Pending editorial review', ARRAY['Greedy']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1227']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1276', 'Air Cownditioning II', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1276', 1600, 'With the hottest recorded summer ever at Farmer John''s farm, he needs a way to
cool down his cows. Thus, he decides to invest in some air conditioners.

Farmer John''s $N$ cows ($1 \leq N \leq 20$) live in a barn that contains a
sequence of stalls in a row, numbered $1 \ldots 100$.  Cow $i$ occupies a range
of  these stalls, starting from stall $s_i$ and ending with stall $t_i$.  The
ranges of stalls occupied by different cows are all disjoint from each-other.
Cows have different cooling requirements.  Cow $i$ must be cooled by an amount
$c_i$, meaning every stall occupied by cow $i$ must have its temperature reduced
by at least $c_i$ units.

The barn contains $M$ air conditioners, labeled $1 \ldots M$
($1 \leq M \leq 10$). The $i$th air conditioner costs $m_i$ units of money to
operate ($1 \leq m_i \leq 1000$) and cools the range of stalls starting from
stall $a_i$ and ending with stall $b_i$.  If running, the $i$th air conditioner
reduces the temperature of all the stalls in this range by $p_i$
($1 \leq p_i \leq 10^6$).  Ranges of stalls covered by air conditioners may
potentially overlap.

Running a farm is no easy business, so FJ has a tight budget. Please determine
the minimum amount of money he needs to spend to keep all of his cows
comfortable. It is guaranteed that if FJ uses all of his conditioners, then all
cows will be comfortable.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains $N$ and $M$.

The next $N$ lines describe cows.  The $i$th of these lines contains $s_i$,
$t_i$, and $c_i$.

The next $M$ lines describe air conditioners.  The $i$th of these lines contains
$a_i$, $b_i$, $p_i$, and $m_i$.

For every input other than the sample, you can assume that $M = 10$.

OUTPUT FORMAT (print output to the terminal / stdout):

Output a single integer telling the minimum amount of money FJ needs to spend to
operate enough air conditioners to satisfy all his cows (with the conditions
listed above).

    Input
    Output

    2 4
1 5 2
7 9 3
2 9 2 3
1 6 2 8
1 2 4 2
6 9 1 5

    10

One possible solution that results in the least amount of money spent is to
select those that cool the intervals $[2, 9]$, $[1, 2]$, and $[6, 9]$, for a
cost of $3 + 2 + 5 = 10$.

Problem credits: Aryansh Shrivastava and Eric Hsu', 'See statement.', 'See statement.', '($1 \leq N \leq 20$) ($1 \leq M \leq 10$) ($1 \leq m_i \leq 1000$) ($1 \leq p_i \leq 10^6$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains $N$ and $M$.\n\nThe next $N$ lines describe cows.  The $i$th of these lines contains $s_i$,\n$t_i$, and $c_i$.\n\nThe next $M$ lines describe air conditioners.  The $i$th of these lines contains\n$a_i$, $b_i$, $p_i$, and $m_i$.\n\nFor every input other than the sample, you can assume that $M = 10$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1276-a1', 'usaco-1276', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1276']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-965', 'Livestock Lineup', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=965', 1600, 'Every day, Farmer John milks his 8 dairy cows, named Bessie, Buttercup, Belinda,
Beatrice, Bella, Blue, Betsy, and Sue.

The cows are rather picky, unfortunately, and require that Farmer John milks
them in an order that respects $N$ constraints ($1 \leq N \leq 7$).  Each
constraint is of the form "$X$ must be milked beside $Y$", stipulating that cow
$X$ must appear in the milking order either directly after cow $Y$ or directly
before cow $Y$.

Please help Farmer John determine an ordering of his cows that satisfies all of
these required constraints.  It is guaranteed that an ordering is always
possible.  If several orderings work, then please output the one that is
alphabetically first.  That is, the first cow should have the alphabetically
lowest name of all possible cows that could appear first in any valid ordering.
Among all orderings starting with this same alphabetically-first cow, the second
cow should be alphabetically lowest among all possible valid orderings, and so
on.

INPUT FORMAT (file lineup.in):

The first line of input contains $N$.  The next $N$ lines each contain a
sentence describing a constraint in the form "$X$ must be milked beside $Y$",
where $X$ and $Y$ are names of some of Farmer John''s cows (the eight possible
names are listed above).

OUTPUT FORMAT (file lineup.out):

Please output, using 8 lines, an ordering of cows, one cow per line, satisfying all constraints.
If multiple orderings work, output the one that is alphabetically earliest.

    Input
    Output

    3
Buttercup must be milked beside Bella
Blue must be milked beside Bella
Sue must be milked beside Beatrice

    Beatrice
Sue
Belinda
Bessie
Betsy
Blue
Bella
Buttercup

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 7$)', '[{"input":"FORMAT (file lineup.in):\n\nThe first line of input contains $N$.  The next $N$ lines each contain a\nsentence describing a constraint in the form \"$X$ must be milked beside $Y$\",\nwhere $X$ and $Y$ are names of some of Farmer John''s cows (the eight possible\nnames are listed above).","output":"FORMAT (file lineup.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-965-a1', 'usaco-965', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-965']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-857', 'Back and Forth', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=857', 1600, 'Farmer John has two milking barns, each of which has a large milk tank as well
as  a storage closet containing $10$ buckets of various sizes.  He likes to carry
milk back and forth between the two barns as a means of exercise.

On Monday, Farmer John measures exactly $1000$ gallons of milk in the tank of the
first barn, and exactly $1000$ gallons of milk in the tank of the second barn.

On Tuesday, he takes a bucket from the first barn, fills it, and carries the
milk to the second barn, where he pours it into the storage tank.  He leaves the
bucket at the second barn.

On Wednesday, he takes a bucket from the second barn (possibly the one he left
on Tuesday), fills it, and carries the milk to the first barn, where he pours it
into the storage tank.  He leaves the bucket at the first barn.

On Thursday, he takes a bucket from the first barn (possibly the one he left on
Wednesday), fills it, and carries the milk to the second barn, where he pours it
into the tank. He leaves the bucket at the second barn.

On Friday, he takes a bucket from the second barn (possibly the one he left on
Tuesday or Thursday), fills it, and carries the milk to the first barn, where
he pours it into the tank. He leaves the bucket at the first barn.

Farmer John then measures the milk in the tank of the first barn.  How many
possible different readings could he see?

INPUT FORMAT (file backforth.in):

The first line of input contains $10$ integers, giving the sizes of the buckets
initially at the first barn.  The second line of input contains $10$ more
integers, giving the sizes of the buckets initially at the second barn.  All
bucket sizes are in the range $1 \dots 100$.

OUTPUT FORMAT (file backforth.out):

Please print the number of possible readings Farmer John could get from
measuring the milk in the tank of the first barn after Friday.

    Input
    Output

    1 1 1 1 1 1 1 1 1 2
5 5 5 5 5 5 5 5 5 5

    5

In this example, there are $5$ possible results for the final amount of milk in
the first barn''s tank:

- $1000$: FJ could carry the same bucket back and forth in each trip, leaving
the total amount in the first barn''s tank unchanged.
- $1003$: FJ could carry $2$ units on Tuesday, then $5$ units on Wednesday, then $1$
unit on Thursday, and $1$ unit on Friday.
- $1004$: FJ could carry $1$ unit on Tuesday, then $5$ units on Wednesday, then $1$
unit on Thursday, and $1$ unit on Friday.
- $1007$: FJ could carry $1$ unit on Tuesday, then $5$ units on Wednesday, then $2$
units on Thursday, and $5$ units on Friday.
- $1008$: FJ could carry $1$ unit on Tuesday, then $5$ units on Wednesday, then $1$
unit on Thursday, and $5$ units on Friday.

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT (file backforth.in):\n\nThe first line of input contains $10$ integers, giving the sizes of the buckets\ninitially at the first barn.  The second line of input contains $10$ more\nintegers, giving the sizes of the buckets initially at the second barn.  All\nbucket sizes are in the range $1 \\dots 100$.","output":"FORMAT (file backforth.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-857-a1', 'usaco-857', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-857']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1251', 'Mensalidade', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1251', 1600, 'Farmer John is planning to open a new university for cows!

There are $N$ ($1 \le N \le 10^5$) cows who could potentially attend this
university. Each cow is willing to pay a maximum tuition of $c_i$
($1 \le c_i \le 10^6$). Farmer John can set the tuition that all cows must pay
to enroll. If this tuition is greater than the maximum a cow is
willing to pay, then the cow will not attend the university. Farmer John wants
to make the most possible money so he can pay his instructors a fair wage.
Please  determine how much money he can make, and how much tuition he should
charge.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains $N$. The second line contains $N$ integers
$c_1, c_2, \dots, c_N$, where $c_i$ is the maximum tuition cow $i$ is willing to
pay.

OUTPUT FORMAT (print output to the terminal / stdout):

Please output the maximum amount of money Farmer John can make and the optimal
tuition he should charge. If there are multiple solutions, output the solution
with the smallest optimal tuition.

Note that the large size of integers involved in this problem may require the
use  of 64-bit integer data types (e.g., a "long" in Java, a "long long" in
C/C++).

    Input
    Output

    4
1 6 4 6

    12 4

If Farmer John charges $4$, then $3$ cows will attend, allowing him to make
$3 \cdot 4 = 12$.

SCORING:

-  Test cases 2 through 4 have $c_i \le 1{,}000$.
-  Test cases 5 through 8 have $N \le 5{,}000$.
-  Test cases 9 through 12 have no additional constraints.

Problem credits: Freddie Tang', 'See statement.', 'See statement.', '($1 \le N \le 10^5$) ($1 \le c_i \le 10^6$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains $N$. The second line contains $N$ integers\n$c_1, c_2, \\dots, c_N$, where $c_i$ is the maximum tuition cow $i$ is willing to\npay.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1251-a1', 'usaco-1251', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1251']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-592', 'AngryCows', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=592', 1600, 'Bessie the cow has designed what she thinks will be the next big hit video game:
"Angry Cows".  The premise, which she believes is completely original, is that
the player shoots a cow with a slingshot  into a one-dimensional scene
consisting of a set of hay bales located at various points on a number line; the
cow lands on a hay bale with sufficient force to cause the bale to explode,
which in turn might set of a chain reaction that causes  additional nearby hay
bales to explode.  The goal is to use a single cow to start a chain reaction
that detonates as many hay bales as possible.

There are $N$ hay bales located at distinct integer positions
$x_1, x_2, \ldots, x_N$ on the number line.  If a cow is launched onto a hay
bale at position $x$, this hay bale explodes with a "blast radius" of 1, meaning
that any other hay bales within 1 unit of distance are also engulfed by the
explosion. These neighboring bales then themselves explode (all simultaneously),
each with a blast radius of 2, so these explosions may engulf additional
yet-unexploded bales up to 2 units of distance away.  In the next time step,
these bales also  explode (all simultaneously) with blast radius 3.  In general,
at time $t$ a  set of hay bales will explode, each with blast radius $t$.  Bales
engulfed by these explosions will themselves explode at time $t+1$ with blast
radius $t+1$, and so on.

Please determine the maximum number of hay bales that can explode if a single
cow is launched onto the best possible hay bale to start a chain reaction.

INPUT FORMAT (file angry.in):

The first line of input contains $N$ ($1 \leq N \leq 100$).  The remaining $N$
lines all  contain integers $x_1 \ldots x_N$ (each in the range
$0 \ldots 1,000,000,000$).

OUTPUT FORMAT (file angry.out):

Please output the maximum number of hay bales that a single cow can cause to
explode.

    Input
    Output

    6
8
5
6
13
3
4

    5

In this example, launching a cow onto the hay bale at position 5 will cause the
bales at positions 4 and 6 to explode, each with blast radius 2.  These
explosions in turn cause the bales at positions 3 and 8 to explode, each with
blast radius 3.   However, these final explosions are not strong enough to reach
the bale at position 13.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$) (each in the range
$0 \ldots 1,000,000,000$)', '[{"input":"FORMAT (file angry.in):\n\nThe first line of input contains $N$ ($1 \\leq N \\leq 100$).  The remaining $N$\nlines all  contain integers $x_1 \\ldots x_N$ (each in the range\n$0 \\ldots 1,000,000,000$).","output":"FORMAT (file angry.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-592-a1', 'usaco-592', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-592']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-617', 'Load Balancing', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=617', 1600, 'Farmer John''s $N$ cows are each standing at distinct locations
$(x_1, y_1) \ldots (x_n, y_n)$ on his two-dimensional farm ($1 \leq N \leq 100$,
and the $x_i$''s and $y_i$''s are positive odd integers of size at most $B$).  FJ
wants to partition his field by building a  long (effectively infinite-length)
north-south fence with equation $x=a$ ($a$ will be an even integer, thus
ensuring that he does not build the fence through the position of any cow). He
also wants to build a long (effectively infinite-length) east-west fence with
equation $y=b$, where $b$ is an even integer.  These two fences cross at the
point $(a,b)$, and together they partition his field into four regions.

FJ wants to choose $a$ and $b$ so that the cows appearing in the four resulting
regions are reasonably "balanced", with no region containing too many cows.
Letting $M$ be the maximum number of cows appearing in one of the four regions,
FJ wants to make $M$ as small as possible.  Please help him determine this
smallest possible value for $M$.

For the first five test cases, $B$ is guaranteed to be at most 100.  In all test
cases, $B$ is guaranteed to be at most 1,000,000.

INPUT FORMAT (file balancing.in):

The first line of the input contains two integers, $N$ and $B$. The next $n$
lines each contain the location of a single cow, specifying its $x$ and $y$
coordinates.

OUTPUT FORMAT (file balancing.out):

You should output the smallest possible value of $M$ that FJ can achieve by
positioning his fences optimally.

    Input
    Output

    7 10
7 3
5 5
9 7
3 1
7 7
5 3
9 1

    2

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(x_1, y_1)', '[{"input":"FORMAT (file balancing.in):\n\nThe first line of the input contains two integers, $N$ and $B$. The next $n$\nlines each contain the location of a single cow, specifying its $x$ and $y$\ncoordinates.","output":"FORMAT (file balancing.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-617-a1', 'usaco-617', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-617']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-739', 'Bovine Genomics', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=739', 1600, 'Farmer John owns $N$ cows with spots and $N$ cows without spots.  Having just
completed a course in bovine genetics, he is convinced that the spots on his
cows are caused by mutations in the bovine genome.

At great expense, Farmer John sequences the genomes of his cows.  Each genome is
a  string of length $M$ built from the four characters A, C, G, and T.  When he
lines up the genomes of his cows, he gets a table like the following, shown here
for $N=3$:

Positions:    1 2 3 4 5 6 7 ... M

Spotty Cow 1: A A T C C C A ... T
Spotty Cow 2: G A T T G C A ... A
Spotty Cow 3: G G T C G C A ... A

Plain Cow 1:  A C T C C C A ... G
Plain Cow 2:  A G T T G C A ... T
Plain Cow 3:  A G T T C C A ... T

Looking carefully at this table, he surmises that positions 2 and 4 are
sufficient to explain spottiness.  That is, by looking at the characters in just
these two positions, Farmer John can predict which of his cows are spotty and
which are not (for example, if he sees G and C, the cow must be spotty).

Farmer John is convinced that spottiness can be explained not by just one or two
positions in the genome, but by looking at a set of three distinct positions.
Please help him count the number of sets of three distinct positions that can
each explain spottiness.

INPUT FORMAT (file cownomics.in):

The first line of input contains $N$ ($1 \leq N \leq 500$) and $M$
($3 \leq M \leq 50$). The next $N$ lines each contain a string of $M$
characters; these describe the genomes of the spotty cows.  The final $N$ lines
describe the genomes of the plain cows.

OUTPUT FORMAT (file cownomics.out):

Please count the number of sets of three distinct positions that can explain
spottiness.  A set of three positions explains spottiness if the spottiness
trait can be predicted with perfect accuracy among Farmer John''s population of
cows by looking at just those three locations in the genome.

    Input
    Output

    3 8
AATCCCAT
GATTGCAA
GGTCGCAA
ACTCCCAG
ACTCGCAT
ACTTCCAT

    22

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 500$) ($3 \leq M \leq 50$)', '[{"input":"FORMAT (file cownomics.in):\n\nThe first line of input contains $N$ ($1 \\leq N \\leq 500$) and $M$\n($3 \\leq M \\leq 50$). The next $N$ lines each contain a string of $M$\ncharacters; these describe the genomes of the spotty cows.  The final $N$ lines\ndescribe the genomes of the plain cows.","output":"FORMAT (file cownomics.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-739-a1', 'usaco-739', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-739']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1469', 'Cow Checkups', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1469', 1600, '**Note: We suggest using a language other than Python to earn full credit on this problem.**

Farmer John''s $N$ ($1 \leq N \leq 7500$) cows are standing in a line, with cow
$1$ at the front of the line and cow $N$ at the back of the line. FJ''s cows also
come in many different species. He denotes each species with an integer from $1$
to $N$. The $i$''th cow from the front of the line is of species $a_i$
($1 \leq a_i \leq N$).

FJ is taking his cows to a checkup at a local bovine hospital. However, the
bovine veterinarian is very picky and wants to perform a checkup on the $i$''th
cow in the line, only if it is of species $b_i$ ($1 \leq b_i \leq N$).

FJ is lazy and does not want to completely reorder his cows.  He will perform
the following operation exactly once.

-  Select two integers $l$ and $r$ such that $1 \leq l \le r \leq N$. Reverse
the order of the cows that are between the $l$-th cow and the $r$-th cow in the
line, inclusive.

FJ wants to measure how effective this approach is. For each $c=0 \ldots N$,
help FJ find the number of distinct operations ($l,r$) that result in exactly
$c$ cows being checked. Two operations ($l_1,r_1$) and ($l_2,r_2$) are different
if $l_1 \neq l_2$ or $r_1 \neq r_2$.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains an integer $N$.

The second line contains $a_1, a_2, \ldots, a_N$.

The third line contains $b_1, b_2, \ldots, b_N$.

OUTPUT FORMAT (print output to the terminal / stdout):

Output $N+1$ lines with the $i$-th line containing the number of distinct
operations ($l,r$) that result in $i-1$ cows being checked.

    Input
    Output

    3
1 3 2
3 2 1

    3
3
0
0

If FJ chooses ($l=1,r=1$), ($l=2,r=2$), or ($l=3,r=3$) then no cows will be
checked. Note that those operations do not modify any of the cows'' locations.

The following operations result in one cow being checked.

- $l=1,r=2$: FJ reverses the order of the first and second cows so the species
of each cow in the new lineup will be $[3,1,2]$. The first cow will be checked.

- $l=2,r=3$: FJ reverses the order of the second and third cows so the species
of each cow in the new lineup will be $[1,2,3]$. The second cow will be checked.

- $l=1,r=3$: FJ reverses the order of the first, second, and third cows so the
species of each cow in the new lineup will be $[2,3,1]$. The third cow will be
checked.

    Input
    Output

    3
1 2 3
1 2 3

    0
3
0
3

The three possible operations that cause $3$ cows to be checked are ($l=1,r=1$),
($l=2,r=2$), and ($l=3,r=3$).

    Input
    Output

    7
1 3 2 2 1 3 2
3 2 2 1 2 3 1

    0
6
14
6
2
0
0
0

The two possible operations that cause $4$ cows to be checked are ($l=4,r=5$)
and ($l=5,r=7$).
SCORING:

- Inputs 4-6: $N\le 100$
- Inputs 7-13: No additional constraints

Problem credits: Chongtian Ma and Haokai Ma', 'See statement.', 'See statement.', 'Problem credits: Chongtian Ma and Haokai Ma', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains an integer $N$.\n\nThe second line contains $a_1, a_2, \\ldots, a_N$.\n\nThe third line contains $b_1, b_2, \\ldots, b_N$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1469-a1', 'usaco-1469', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1469']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1037', 'Cowntact Tracing', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1037', 1600, 'Farmer John is worried for the health of his cows (conveniently numbered
$1 \ldots N$ as always) after an outbreak of the  highly contagious bovine
disease COWVID-19.

Recently, Farmer John tested all of his cows and found some of them to be
positive for the disease.  Using video footage from inside his barn, he is able
to review recent interactions between pairs of cows --- it turns out that when
cows greet each-other, they shake hooves, a gesture that can unfortunately
spread the infection from one cow to another.  Farmer John assembles a
time-stamped list of interacting pairs of cows, with entries of the form
$(t, x, y)$, meaning that at time $t$, cow $x$ shook hooves with cow $y$.
Farmer John also knows the following:

(i) Exactly one cow on his farm could have started out carrying the disease
(we''ll call this cow "patient zero").

(ii) Once a cow is infected, she passes the infection along with her next $K$
hoof shakes (possibly including the same partner cow several times).  After
shaking hooves $K$ times, she no longer passes the infection along with
subsequent hoof shakes (since at this point she realizes she is spreading the
infection and washes her hooves carefully).

(iii) Once a cow is infected, she stays infected.

Unfortunately, Farmer John doesn''t know which of his $N$ cows is patient zero,
nor does he know the value of $K$!  Please help him narrow down the
possibilities for these unknowns based on his data. It is guaranteed that at
least one possibility is valid.

INPUT FORMAT (file tracing.in):

The first line of the input file contains $N$ ($2 \leq N \leq 100$) and $T$
($1 \leq T \leq 250$).  The next line contains a string of length $N$ whose
entries are 0s and 1s,  describing the current state of Farmer John''s $N$ cows
--- 0 represents a healthy cow and 1 represents a cow presently with the
disease.  Each of the next $T$ lines describes a record in Farmer John''s list of
interactions and consists of three integers $t$, $x$, and $y$, where $t$ is a
positive integer time of the interaction ($t \leq 250$) and $x$ and $y$ are
distinct integers in the range $1 \ldots N$, indicating which cows shook hands
at time $t$. At most one interaction happens at each point in time.

OUTPUT FORMAT (file tracing.out):

Print a single line with three integers $x$, $y$, and $z$, where $x$ is the
number of possible cows who could have been patient zero, $y$ is the smallest
possible value of $K$ consistent with the data, and $z$ is the largest possible
value of $K$ consistent with the data (if there is no upper bound on $K$ that
can be deduced from the data, print "Infinity" for $z$). Note that it might be
possible to have $K=0$.

    Input
    Output

    4 3
1100
7 1 2
5 2 3
6 2 4

    1 1 Infinity

The only candidate for patient zero is cow 1. For all $K>0$, cow 1 infects cow 2
at time 7, while cows 3 and 4 remain uninfected.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(conveniently numbered
$1 \ldots N$ as always) ($2 \leq N \leq 100$) ($1 \leq T \leq 250$) ($t \leq 250$)', '[{"input":"FORMAT (file tracing.in):\n\nThe first line of the input file contains $N$ ($2 \\leq N \\leq 100$) and $T$\n($1 \\leq T \\leq 250$).  The next line contains a string of length $N$ whose\nentries are 0s and 1s,  describing the current state of Farmer John''s $N$ cows\n--- 0 represents a healthy cow and 1 represents a cow presently with the\ndisease.  Each of the next $T$ lines describes a record in Farmer John''s list of\ninteractions and consists of three integers $t$, $x$, and $y$, where $t$ is a\npositive integer time of the interaction ($t \\leq 250$) and $x$ and $y$ are\ndistinct integers in the range $1 \\ldots N$, indicating which cows shook hands\nat time $t$. At most one interaction happens at each point in time.","output":"FORMAT (file tracing.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1037-a1', 'usaco-1037', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1037']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-569', 'Contaminated Milk', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=569', 1600, 'Farmer John, known far and wide for the quality of the milk produced on his farm, is hosting
a milk-tasting party for $N$ of his best friends ($1 \leq N \leq 50$).
Unfortunately, of  the $M$ types of milk featured at the party
($1 \leq M \leq 50$), exactly one of them has gone bad, but Farmer John does not
know which one!  Anyone who drinks the bad milk will later become sick, either
during the remainder of the party or afterward.

You are given a transcript of the party -- who drinks what when,
and also who gets sick when.  Based on this information, you can
deduce which of the milks could possibly be the bad one.  Using this
knowledge, help Farmer John determine the minimum number of doses of
medicine he will need to obtain in order to guarantee that he can cure
all of the individuals who become sick, either during or after the
party.

INPUT FORMAT (file badmilk.in):

The first line of the input contains integers $N$, $M$, $D$, and $S$.

The next $D$ lines ($1 \leq D \leq 1000$) each contain three
integers $p, m, t$, indicating that person $p$ drank milk $m$ at time
$t$. The value of $p$ is in the range $1 \ldots N$, $m$ is in the
range $1 \ldots M$, and $t$ is in the range $1 \ldots 100$.  A person
may drink the same milk several times, and may also drink several
types of milk at the same point in time.

The next $S$ lines ($1 \leq S \leq N$) each contain two integers
$p, t$, indicating that person $p$ gets sick at time $t$. The value of
$p$ is in the range $1 \ldots N$, and $t$ is in the range $1 \ldots
100$.  Each person gets sick at most once, and they only get sick
because they drank the bad milk at some strictly earlier point in
time.

OUTPUT FORMAT (file
badmilk.out):

A single integer, specifying the minimum number of doses of medicine
Farmer John needs to obtain so that he can guarantee that he will have
sufficiently many doses to treat all the people who become sick, both
during and after the party.

    Input
    Output

    3 4 7 2
1 1 1
1 4 1
1 3 4
1 2 2
3 1 3
2 1 5
2 2 7
1 3
2 8

    3

There are 3 people and 4 milk types.  Person 1 gets sick at time 3
and person 2 gets sick at time 8.  Person 3 does not get sick at the
party, although we may still need to consider the possibility that
he could become sick later, after the party ends.  Let''s consider
the milk types one by one to see which ones could be contaminated; we
know a milk type is potentially bad if everyone who became sick drank
that milk type before becoming sick.

Milk 1: Both of the sick people (1 and 2) drank this milk before
getting sick, so this could be the bad milk.  If so, person 3 also
drank it, so it would cause a total of 3 people to get sick (person 3
would become sick after the party).

Milk 2: Both of the sick people drank this milk before getting
sick, so this could also be the bad milk.  Nobody else drank this
milk, so at worst 2 total people could be sick if this is the bad
milk.

Milk 3: This cannot be the bad milk because person 1 did not drink
it before getting sick -- person 1 drank it at time 4, and got sick at
time 3.  For milk 3 to be implicated in person 1 getting sick, person
1 would have needed to drink this milk by time 2 at the latest.

Milk 4: This cannot be the bad milk because person 2 did not drink
it, and yet person 2 became sick.

The answer is therefore that Farmer John must obtain 3 doses of
medicine, since if milk 1 is bad, then a total of 3 people will need
to be cured.

Problem credits: Austin Anderson and Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 50$) ($1 \leq M \leq 50$) ($1 \leq D \leq 1000$) ($1 \leq S \leq N$) (1 and 2) (person 3
would become sick after the party)', '[{"input":"FORMAT (file badmilk.in):\n\nThe first line of the input contains integers $N$, $M$, $D$, and $S$.\n\nThe next $D$ lines ($1 \\leq D \\leq 1000$) each contain three\nintegers $p, m, t$, indicating that person $p$ drank milk $m$ at time\n$t$. The value of $p$ is in the range $1 \\ldots N$, $m$ is in the\nrange $1 \\ldots M$, and $t$ is in the range $1 \\ldots 100$.  A person\nmay drink the same milk several times, and may also drink several\ntypes of milk at the same point in time.\n\nThe next $S$ lines ($1 \\leq S \\leq N$) each contain two integers\n$p, t$, indicating that person $p$ gets sick at time $t$. The value of\n$p$ is in the range $1 \\ldots N$, and $t$ is in the range $1 \\ldots\n100$.  Each person gets sick at most once, and they only get sick\nbecause they drank the bad milk at some strictly earlier point in\ntime.","output":"FORMAT (file\nbadmilk.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-569-a1', 'usaco-569', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-569']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-615', 'Milk Pails', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=615', 1600, 'Farmer John has received an order for exactly $M$ units of milk
($1 \leq M \leq 1,000$) that he needs to fill right away.  Unfortunately, his
fancy milking machine has just become broken, and all he has are three milk
pails of integer sizes $X$, $Y$, and $M$ ($1 \leq X < Y < M$). All three pails
are initially empty.  Using these three pails, he can perform any number of the
following two types of operations:

- He can fill the smallest pail (of size $X$) completely to the top with $X$
units of milk and pour it into the size-$M$ pail, as long as this will not cause
the size-$M$ pail to overflow.

- He can fill the medium-sized pail (of size $Y$) completely to the top with $Y$
units of milk and pour it into the size-$M$ pail, as long as this will not cause
the size-$M$ pail to overflow.

Although FJ realizes he may not be able to completely fill the size-$M$ pail,
please help him determine the maximum amount of milk he can possibly add to this
pail.

INPUT FORMAT (file pails.in):

The first, and only line of input, contains $X$, $Y$, and $M$, separated by spaces.

OUTPUT FORMAT (file pails.out):

Output the maximum amount of milk FJ can possibly add to the size-$M$ pail.

    Input
    Output

    17 25 77

    76

In this example, FJ fills the pail of size 17 three times and the pail of size
25 once, accumulating a total of 76 units of milk.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq M \leq 1,000$) ($1 \leq X < Y < M$)', '[{"input":"FORMAT (file pails.in):\n\nThe first, and only line of input, contains $X$, $Y$, and $M$, separated by spaces.","output":"FORMAT (file pails.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-615-a1', 'usaco-615', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-615']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-639', 'Diamond Collector', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=639', 1600, 'Bessie the cow, always a fan of shiny objects, has taken up a hobby of mining
diamonds in her spare time!  She has collected $N$ diamonds ($N \leq 1000$) of
varying sizes, and she wants to arrange some of them in a display case in the
barn.

Since Bessie wants the diamonds in the case to be relatively similar in size,
she decides that she will not include two diamonds in the case if their sizes
differ by more than $K$ (two diamonds can be displayed together in the case
if their sizes differ by exactly $K$).  Given $K$, please help Bessie determine
the maximum number of diamonds she can display in the case.

INPUT FORMAT (file diamond.in):

The first line of the input file contains $N$ and $K$ ($0 \leq K \leq 10,000$).
The next $N$ lines each contain an integer giving the size of one of the
diamonds.  All sizes will be positive and will not exceed $10,000$.

OUTPUT FORMAT (file diamond.out):

Output a single positive integer, telling the maximum number of diamonds that
Bessie can showcase.

    Input
    Output

    5 3
1
6
4
3
1

    4

Problem credits: Nick Wu', 'See statement.', 'See statement.', '($N \leq 1000$) ($0 \leq K \leq 10,000$)', '[{"input":"FORMAT (file diamond.in):\n\nThe first line of the input file contains $N$ and $K$ ($0 \\leq K \\leq 10,000$).\nThe next $N$ lines each contain an integer giving the size of one of the\ndiamonds.  All sizes will be positive and will not exceed $10,000$.","output":"FORMAT (file diamond.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-639-a1', 'usaco-639', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-639']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1060', 'Daisy Chains', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1060', 1600, 'Every day, as part of her walk around the farm, Bessie the cow visits  her
favorite pasture, which has $N$ flowers (all colorful daisies)  labeled
$1\ldots N$ lined up in a row $(1\le N \le 100)$. Flower $i$ has $p_i$ petals
$(1 \le p_i \le 1000)$.

As a budding photographer, Bessie decides to take several photos of these
flowers. In particular, for every pair of flowers $(i,j)$ satisfying
$1\le i\le j\le N$, Bessie takes a photo of all flowers from flower $i$ to
flower $j$ (including $i$ and $j$).

Bessie later looks at these photos and notices that some of these photos have an
"average flower" -- a flower that has $P$ petals, where $P$ is the exact average
number of petals among all flowers in the photo.

How many of Bessie''s photos have an average flower?

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains $N$.  The second line contains  $N$
space-separated integers $p_1 \dots p_N$.

OUTPUT FORMAT (print output to the terminal / stdout):

Please print out the number of photos that have an average flower.

    Input
    Output

    4
1 1 2 3

    6

Every picture containing just a single flower contributes to the count (there are
four of these in the example).  Also, the $(i,j)$ ranges $(1,2)$ and $(2,4)$ in
this example correspond to pictures that have an average flower.

Problem credits: Nick Wu', 'See statement.', 'See statement.', '(1\le N \le 100) (1 \le p_i \le 1000) (1,2) (2,4)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains $N$.  The second line contains  $N$\nspace-separated integers $p_1 \\dots p_N$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1060-a1', 'usaco-1060', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1060']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1228', 'Counting Liars', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1228', 1600, 'Bessie the cow is hiding somewhere along the number line. Each of Farmer John''s
$N$ other cows ($1\le N\le 1000$) have a piece of information to share: the
$i$-th cow either says that Bessie is hiding at some location less than or equal
to $p_i$, or that Bessie is hiding at some location greater than or equal to
$p_i$
($0\le p_i\le 10^9$).

Unfortunately, it is possible that no hiding location is consistent with the
answers of all of the cows, meaning that not all of the cows are telling the
truth.  Count the minimum number of cows that must be lying.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains $N$.

The next $N$ lines each contain either L or G, followed by an integer $p_i$. L
means that the $i$-th cow says that Bessie''s hiding location is less than  or
equal to $p_i$, and G means that $i$-th cow says that Bessie''s hiding location
is greater than or equal to $p_i$.

OUTPUT FORMAT (print output to the terminal / stdout):

The minimum number of cows that must be lying.

    Input
    Output

    2
G 3
L 5

    0

It is possible that no cow is lying.

    Input
    Output

    2
G 3
L 2

    1

At least one of the cows must be lying.

Problem credits: Jesse Choe', 'See statement.', 'See statement.', '($1\le N\le 1000$) ($0\le p_i\le 10^9$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains $N$.\n\nThe next $N$ lines each contain either L or G, followed by an integer $p_i$. L\nmeans that the $i$-th cow says that Bessie''s hiding location is less than  or\nequal to $p_i$, and G means that $i$-th cow says that Bessie''s hiding location\nis greater than or equal to $p_i$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1228-a1', 'usaco-1228', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1228']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-963', 'Cow Gymnastics', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=963', 1600, 'In order to improve their physical fitness, the cows have taken up gymnastics!
Farmer John designates his favorite cow Bessie to coach the $N$ other cows and
to assess their progress as they learn various gymnastic skills.

In each of $K$ practice sessions ($1 \leq K \leq 10$), Bessie ranks the $N$ cows according to their
performance ($1 \leq N \leq 20$).  Afterward, she is curious about the consistency in these rankings.
A pair of two distinct cows is consistent if one cow did better than the
other one in every practice session.

Help Bessie compute the total number of consistent pairs.

INPUT FORMAT (file gymnastics.in):

The first line of the input file contains two positive integers $K$ and $N$. The next $K$ lines will each contain the
integers $1 \ldots N$ in some order, indicating the rankings of the cows (cows
are identified by the numbers $1 \ldots N$). If $A$ appears before $B$ in one of
these lines, that means cow $A$ did better than cow $B$.

OUTPUT FORMAT (file gymnastics.out):

Output, on a single line, the number of consistent pairs.

    Input
    Output

    3 4
4 1 2 3
4 1 3 2
4 2 1 3

    4

The consistent pairs of cows are $(1,4)$, $(2,4)$, $(3,4)$, and $(1,3)$.

Problem credits: Nick Wu', 'See statement.', 'See statement.', '($1 \leq K \leq 10$) ($1 \leq N \leq 20$) (cows
are identified by the numbers $1 \ldots N$) (1,4) (2,4) (3,4)', '[{"input":"FORMAT (file gymnastics.in):\n\nThe first line of the input file contains two positive integers $K$ and $N$. The next $K$ lines will each contain the\nintegers $1 \\ldots N$ in some order, indicating the rankings of the cows (cows\nare identified by the numbers $1 \\ldots N$). If $A$ appears before $B$ in one of\nthese lines, that means cow $A$ did better than cow $B$.","output":"FORMAT (file gymnastics.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-963-a1', 'usaco-963', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-963']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-736', 'Bovine Genomics', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=736', 1600, 'Farmer John owns $N$ cows with spots and $N$ cows without spots.  Having just
completed a course in bovine genetics, he is convinced that the spots on his
cows are caused by mutations at a single location in the bovine genome.

At great expense, Farmer John sequences the genomes of his cows.  Each genome is
a  string of length $M$ built from the four characters A, C, G, and T.  When he
lines up the genomes of his cows, he gets a table like the following, shown here
for $N=3$:

Positions:    1 2 3 4 5 6 7 ... M

Spotty Cow 1: A A T C C C A ... T
Spotty Cow 2: G A T T G C A ... A
Spotty Cow 3: G G T C G C A ... A

Plain Cow 1:  A C T C C C A ... G
Plain Cow 2:  A C T C G C A ... T
Plain Cow 3:  A C T T C C A ... T

Looking carefully at this table, he surmises that position 2 is a potential
location in the genome that could explain spottiness.  That is, by looking at
the character in just this position, Farmer John can predict which of his cows
are spotty and which are not (here, A or G means spotty and C means plain; T is
irrelevant since it does not appear in any of Farmer John''s cows at position 2).
Position 1 is not sufficient by itself to explain spottiness, since an A in this
position might indicate a spotty cow or a plain cow.

Given the genomes of Farmer John''s cows, please count the number of locations
that could potentially, by themselves, explain spottiness.

INPUT FORMAT (file cownomics.in):

The first line of input contains $N$ and $M$, both positive integers of size at
most 100. The next $N$ lines each contain a string of $M$ characters; these
describe the genomes of the spotty cows.  The final $N$ lines describe the
genomes of the plain cows.

OUTPUT FORMAT (file cownomics.out):

Please count the number of positions (an integer in the range $0 \ldots M$) in
the genome that could potentially explain spottiness.  A location potentially
explains spottiness if the spottiness trait can be predicted with perfect
accuracy among Farmer John''s population of cows by looking at just this one
location in the genome.

    Input
    Output

    3 8
AATCCCAT
GATTGCAA
GGTCGCAA
ACTCCCAG
ACTCGCAT
ACTTCCAT

    1

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(an integer in the range $0 \ldots M$)', '[{"input":"FORMAT (file cownomics.in):\n\nThe first line of input contains $N$ and $M$, both positive integers of size at\nmost 100. The next $N$ lines each contain a string of $M$ characters; these\ndescribe the genomes of the spotty cows.  The final $N$ lines describe the\ngenomes of the plain cows.","output":"FORMAT (file cownomics.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-736-a1', 'usaco-736', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-736']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1011', 'Triangles', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1011', 1600, 'Farmer John would like to create a triangular pasture for his cows.

There are $N$ fence posts ($3\le N\le 100$) at distinct points
$(X_1, Y_1) \ldots (X_N, Y_N)$ on the 2D map of his farm.  He can choose three
of them to form the vertices of the triangular pasture as long as one of the
sides of the triangle is parallel to the $x$-axis and another side is
parallel to the
$y$-axis.

What is the maximum area of a pasture that Farmer John can form? It is
guaranteed that at least one valid triangular pasture exists.

INPUT FORMAT (file triangles.in):

The first line of the input contains the integer $N$.  Each of the next $N$
lines contains two integers $X_i$ and $Y_i$, each in the range
$-10^4 \ldots 10^4$ inclusive, describing the location of a fence post.

OUTPUT FORMAT (file triangles.out):

As the area itself is not necessarily an integer, output two times the
maximum area of a valid triangle formed by the fence posts.

    Input
    Output

    4
0 0
0 1
1 0
1 2

    2

Posts at $(0,0)$, $(1,0)$, and $(1,2)$ form a triangle of area $1$. Thus, the
answer is $2\cdot 1=2$. There is only one other triangle, with area $0.5$.

Problem credits: Travis Hance', 'See statement.', 'See statement.', '($3\le N\le 100$) (X_1, Y_1) (0,0) (1,0) (1,2)', '[{"input":"FORMAT (file triangles.in):\n\nThe first line of the input contains the integer $N$.  Each of the next $N$\nlines contains two integers $X_i$ and $Y_i$, each in the range\n$-10^4 \\ldots 10^4$ inclusive, describing the location of a fence post.","output":"FORMAT (file triangles.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1011-a1', 'usaco-1011', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1011']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-784', 'Lifeguards', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=784', 1600, 'Farmer John has opened a swimming pool for his cows, figuring it will help them
relax and produce more milk.

To ensure safety, he hires $N$ cows as lifeguards, each of which has a shift
that covers some contiguous interval of time during the day.  For simplicity,
the pool is open from time $t=0$ until time $t=1000$ on a daily basis, so each shift can
be described by two integers, giving the time at which a cow starts and ends her
shift.  For example, a lifeguard starting at time $t = 4$ and ending at  time
$t = 7$ covers three units of time (note that the endpoints are "points" in
time).

Unfortunately, Farmer John hired 1 more lifeguard than he has the funds to
support.  Given that he must fire exactly one lifeguard, what is the maximum
amount of time that can still be covered by the shifts of the remaining
lifeguards?  An interval of time is covered if at least one lifeguard is
present.

INPUT FORMAT (file lifeguards.in):

The first line of input contains $N$ ($1 \leq N \leq 100$). Each of the next $N$ lines describes a lifeguard in
terms of two integers in the  range $0 \ldots 1000$, giving the starting and ending
point of a lifeguard''s shift. All such endpoints are distinct.  Shifts of
different lifeguards might overlap.

OUTPUT FORMAT (file lifeguards.out):

Please write a single number, giving the maximum amount of time that can still
be covered if Farmer John fires 1 lifeguard.

    Input
    Output

    3
5 9
1 4
3 7

    7

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file lifeguards.in):\n\nThe first line of input contains $N$ ($1 \\leq N \\leq 100$). Each of the next $N$ lines describes a lifeguard in\nterms of two integers in the  range $0 \\ldots 1000$, giving the starting and ending\npoint of a lifeguard''s shift. All such endpoints are distinct.  Shifts of\ndifferent lifeguards might overlap.","output":"FORMAT (file lifeguards.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-784-a1', 'usaco-784', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-784']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-712', 'Why Did the Cow Cross the Road II', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=712', 1600, 'The layout of Farmer John''s farm is quite peculiar, with a large circular road
running around the perimeter of the main field on which his cows graze during
the day. Every morning, the cows cross this road on their way towards the field,
and every evening they all cross again as they leave the field and return to the
barn.

As we know, cows are creatures of habit, and they each cross the road the same
way every day.  Each cow crosses into the field at a different point from where
she crosses out of the field, and all of these crossing points are distinct from
each-other. Farmer John owns exactly 26 cows, which he has lazily named A
through Z (he is not sure what he will do if he ever acquires a  27th cow...),
so there are precisely 52 crossing points around the road.  Farmer John records
these crossing points concisely by scanning around the circle clockwise, writing
down the name of the cow for each crossing point, ultimately forming a string
with 52 characters in which each letter of the alphabet appears exactly twice.
He does not record which crossing points are entry points and which are
exit points.

Looking at his map of crossing points, Farmer John is curious how many times
various pairs of cows might cross paths during the day.  He calls a pair of cows
$(a,b)$ a "crossing" pair if cow $a$''s path from entry to exit must cross cow
$b$''s path from entry to exit.  Please help Farmer John count the total number
of crossing pairs.

INPUT FORMAT (file circlecross.in):

The input consists of a single line containing a string of 52 upper-case
characters.  Each letter of the alphabet appears exactly twice.

OUTPUT FORMAT (file circlecross.out):

Please print the total number of crossing pairs.

    Input
    Output

    ABCCABDDEEFFGGHHIIJJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ

    1

In this example, only cows A and B are a crossing pair.

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT (file circlecross.in):\n\nThe input consists of a single line containing a string of 52 upper-case\ncharacters.  Each letter of the alphabet appears exactly twice.","output":"FORMAT (file circlecross.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-712-a1', 'usaco-712', 'Pending editorial review', ARRAY['Brute Force']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-712']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-917', 'Measuring Traffic', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=917', 1600, 'The highway adjacent to Farmer John''s farm has recently seen a dramatic increase
in traffic, or at least so it seems to Farmer John.  To be sure, he wants to
measure the traffic flow on the highway with a set of  sensors, each capable of
measuring the rate of flow of traffic on a  segment of road.

Unfortunately, while walking through the barn one day, Farmer John trips and
drops his box of sensors into a large vat of milk, after which they no longer
work as well.  Instead of producing a single exact reading of traffic flow rate,
each sensor now outputs a range of possible values. For example, a sensor might
output the range $[7, 13]$, indicating that the rate of traffic flow on a
segment of road is no less than 7, and no greater than 13.

The highway runs for $N$ miles next to the farm, and traffic on the highway only
flows in one direction, from mile 1 towards mile $N$.  Farmer John wants to
install $N$ sensors -- one for each 1-mile segment of the highway. In some of
these segments, there are on-ramps that allow traffic to enter the highway; in each of
these cases, Farmer John will install his sensor on the on-ramp to measure
(approximately) the amount of incoming traffic.  In some segments there are
off-ramps that allows traffic to exit the highway; in each of these cases, Farmer John will
install his sensor on the off-ramp.  Each segment contains at most one ramp.
If there is no on-ramp or off-ramp in a segment of highway, Farmer John installs
a sensor on the main highway itself.

Given the readings from Farmer John''s $N$ sensors, please determine the most
specific possible ranges that describe the rate of traffic flow initially on
the highway prior to mile 1 and for traffic continuing on the highway past mile
$N$.  These ranges should be consistent with all $N$ sensor readings.

INPUT FORMAT (file traffic.in):

The first line of input contains $N$ ($1 \leq N \leq 100$).  Each of the
remaining $N$ lines describes a 1-mile segment of the road, in order from mile
$1$ to mile $N$.  Each line contains a string that is either "on" (if there is
an on-ramp on this segment), "off" (if there is an off-ramp), or "none" (if
there is no ramp), followed by two integers  in the range $0 \ldots 1000$,
indicating the lower and upper endpoints of the sensor range from this segment.
If the segment contains a ramp, the sensor reading is from the ramp.  Otherwise,
it is from the main highway.  At least one of the highway segments will be
designated as "none".

OUTPUT FORMAT (file traffic.out):

The first line of output should contain two integers giving the most specific
range possible for the rate of traffic flow prior to mile 1.  The second line of
output should contain two integers giving the most specific range possible for
the rate of traffic flow after mile $N$.  A valid solution is always guaranteed
to exist.

    Input
    Output

    4
on 1 1
none 10 14
none 11 15
off 2 3

    10 13
8 12

In this example, the combination of readings from segments 2 and 3 tell us that
the flow rate through these segments is somewhere in the range $[11, 14]$, since
only this range is consistent with both the readings $[10,14]$ and $[11,15]$. In
mile 1, exactly 1 unit of flow enters on an on-ramp, so prior to mile 1, the
flow rate must be in the range $[10, 13]$.  In mile 4, between 2 and 3 units
exits on an off-ramp, so the range of possible flow rates after this is
$[8,12]$.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file traffic.in):\n\nThe first line of input contains $N$ ($1 \\leq N \\leq 100$).  Each of the\nremaining $N$ lines describes a 1-mile segment of the road, in order from mile\n$1$ to mile $N$.  Each line contains a string that is either \"on\" (if there is\nan on-ramp on this segment), \"off\" (if there is an off-ramp), or \"none\" (if\nthere is no ramp), followed by two integers  in the range $0 \\ldots 1000$,\nindicating the lower and upper endpoints of the sensor range from this segment.\nIf the segment contains a ramp, the sensor reading is from the ramp.  Otherwise,\nit is from the main highway.  At least one of the highway segments will be\ndesignated as \"none\".","output":"FORMAT (file traffic.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-917-a1', 'usaco-917', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-917']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-664', 'Block Game', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=664', 1600, 'Farmer John is trying to teach his cows to read by giving them a set of $N$
spelling boards typically used with preschoolers ($1 \leq N \leq 100$). Each
board has a word and an image on each side.  For example, one side might have
the word ''cat'' along with a picture of a cat, and the other side might have the
word ''dog'' along with a picture of a dog.  When the boards are lying on the
ground, $N$ words are therefore shown.  By flipping over some of the boards, a
different set of $N$ words can be exposed.

To help the cows with their spelling, Farmer John wants to fashion a number of
wooden blocks, each embossed with a single letter of the alphabet. He wants to
make sufficiently many blocks of each letter so that no matter which set of $N$
words is exposed on the upward-facing boards, the cows will be able to spell all
of these words using the blocks.  For example, if $N=3$ and the words ''box'',
''cat'', and ''car'' were facing upward, the cows would need at least one ''b'' block,
one ''o'' block, one ''x'' block, two ''c'' blocks, two ''a'' blocks, one ''t'' block, and
one ''r'' block.

Please help the Farmer John determine the minimum number of blocks for each
letter of the alphabet that he needs to provide, so that irrespective of which
face of each board is showing, the cows can spell all $N$ visible words.

INPUT FORMAT (file blocks.in):

Line 1 contains the integer $N$.

The next $N$ lines each contain 2 words separated by a space, giving the two
words on opposite sides of a board.  Each word is a string of at most 10
lowercase letters.

OUTPUT FORMAT (file blocks.out):

Please output 26 lines. The first output line should contain a number specifying
the number of copies of ''a'' blocks needed.  The next line should specify the
number of ''b'' blocks needed, and so on.

    Input
    Output

    3
fox box
dog cat
car bus

    2
2
2
1
0
1
1
0
0
0
0
0
0
0
2
0
0
1
1
1
1
0
0
1
0
0

In this example, there are $N = 3$ boards, giving $2^3 = 8$ possibilities for
the set of upward-facing words:

fox dog car
fox dog bus
fox cat car
fox cat bus
box dog car
box dog bus
box cat car
box cat bus

We need enough blocks for each letter of the alphabet so that we can spell all
three words, irrespective of which of these eight scenarios occurs.

Problem credits: Viktoriia Schwartz', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file blocks.in):\n\nLine 1 contains the integer $N$.\n\nThe next $N$ lines each contain 2 words separated by a space, giving the two\nwords on opposite sides of a board.  Each word is a string of at most 10\nlowercase letters.","output":"FORMAT (file blocks.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-664-a1', 'usaco-664', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-664']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1491', 'Reflection', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1491', 1600, 'Farmer John has a square canvas represented by an $N$ by $N$ grid of cells
($2 \leq N \leq 2000$, $N$ is even). He paints the canvas according to the
following steps:

- First, he divides the canvas into four equal quadrants, separated by
horizontal and vertical lines through the center of the canvas.
- Next, he paints a lovely painting in the top-right quadrant of the canvas.
Each cell of the top-right quadrant will either be painted (represented by ''#'')
or unpainted (represented by ''.'').
- Finally, since he is so proud of his painting, he reflects it across the
previously mentioned horizontal and vertical lines into the other quadrants of
the canvas.

For example, suppose $N=8$ and FJ painted the following painting in the
top-right quadrant in step 2:

.#..
.#..
.##.
....

Then after reflecting across the horizontal and vertical lines into the other
quadrants in step 3,  the canvas would look as follows:

..#..#..
..#..#..
.##..##.
........
........
.##..##.
..#..#..
..#..#..

However, while FJ was sleeping, Bessie broke into his barn and stole his
precious canvas. She totally vandalized the canvas—removing some painted cells
and adding more painted cells! Before FJ woke up, she returned the canvas to FJ.

FJ would like to modify his canvas so that it once again satisfies the
reflective condition: that is, it is the result of reflecting the top-right
quadrant into each of the other quadrants.  Since he only has a limited number
of resources, he would like to achieve this in as  few operations as possible,
where a single operation consists of either painting a cell or removing paint
from a cell.

You are given the canvas after Bessie''s vandalism, as well as a sequence of $U$
($0\le U \leq 10^5$)  updates to the canvas, each toggling a single cell to ''.''
if it is ''#'', or vice versa. Before any updates, and after each update, output
the minimum number of operations $x$ FJ needs to perform so that the reflective
condition is satisfied.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line contains integers $N$ and $U$.

The next $N$ lines each contain $N$ characters representing the canvas after
Bessie''s vandalism. Every character is either ''#'' or ''.''.

The following $U$ lines each contain integers $r$ and $c$, where
$1 \leq r, c \leq N$, representing an update to the cell in the $r$th row from
the top and $c$th column from the left of the canvas.

OUTPUT FORMAT (print output to the terminal / stdout):

Output $U+1$ lines representing $x$ before any updates and after each update.

    Input
    Output

    4 5
..#.
##.#
####
..##
1 3
2 3
4 3
4 4
4 4

    4
3
2
1
0
1

The following canvas satisfies the reflective condition and differs from the
original canvas by 4 operations:

....
####
####
....

It is impossible to make the original canvas satisfy the reflective condition
using fewer than 4 operations.

After updating $(1, 3)$, the canvas looks like this:

....
##.#
####
..##

It now takes 3 operations to make the canvas satisfy the reflective condition.

After updating $(2, 3)$, the canvas looks like this:

....
####
####
..##

It now takes 2 operations to make the canvas satisfy the reflective condition.

SCORING:

- Inputs 2-3: $N \le 4$
- Inputs 4-6: $U \le 10$
- Inputs
7-16: No additional constraints.

Problem credits: Chongtian Ma', 'See statement.', 'See statement.', '($2 \leq N \leq 2000$, $N$ is even) ($0\le U \leq 10^5$) (1, 3) (2, 3)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line contains integers $N$ and $U$.\n\nThe next $N$ lines each contain $N$ characters representing the canvas after\nBessie''s vandalism. Every character is either ''#'' or ''.''.\n\nThe following $U$ lines each contain integers $r$ and $c$, where\n$1 \\leq r, c \\leq N$, representing an update to the cell in the $r$th row from\nthe top and $c$th column from the left of the canvas.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1491-a1', 'usaco-1491', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1491']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-526', 'Censoring (Bronze)', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=526', 1600, 'Farmer John has purchased a subscription to Good Hooveskeeping
magazine for his cows, so they have plenty of material to read while
waiting around in the barn during milking sessions.  Unfortunately,
the latest issue contains a rather inappropriate article on how to
cook the perfect steak, which FJ would rather his cows not see
(clearly, the magazine is in need of better editorial oversight).

FJ has taken all of the text from the magazine to create the string S
of length at most 10^6 characters.  From this, he would like to remove
occurrences of a substring T of length <= 100 characters to censor
the inappropriate content.  To do this, Farmer John finds the _first_
occurrence of T in S and deletes it.  He then repeats the process
again, deleting the first occurrence of T again, continuing until
there are no more occurrences of T in S.  Note that the deletion of
one occurrence might create a new occurrence of T that didn''t
exist before.

Please help FJ determine the final contents of S after censoring is
complete.

INPUT FORMAT: (file censor.in)

The first line will contain S.  The second line will contain T.  The
length of T will be at most that of S, and all characters of S and T
will be lower-case alphabet characters (in the range a..z).

OUTPUT FORMAT: (file censor.out)

The string S after all deletions are complete.  It is guaranteed that
S will not become empty during the deletion process.

    Input
    Output

    whatthemomooofun
moo

    whatthefun

[Problem credits: Mark Gordon, 2015]', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT: (file censor.in)\n\nThe first line will contain S.  The second line will contain T.  The\nlength of T will be at most that of S, and all characters of S and T\nwill be lower-case alphabet characters (in the range a..z).","output":"FORMAT: (file censor.out)"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-526-a1', 'usaco-526', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-526']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1061', 'Stuck in a Rut', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1061', 1600, 'Farmer John has recently expanded the size of his farm, so from the perspective
of his cows it is effectively now infinite in size!  The cows think of the
grazing area of the farm as an infinite 2D grid of square "cells", each filled
with  delicious grass (think of each cell as a square in an infinite
chessboard).   Each of Farmer John''s $N$ cows ($1\le N\le 50$) starts out in a
different cell; some  start facing north, and some start facing east.

Every hour, every cow either

- Stops if the grass in her current cell was already eaten by another
cow.
- Eats all the grass in her current cell and moves one cell forward according
to the direction she faces.

Over time, each cow therefore leaves a barren "rut" of empty cells behind her.

If two cows move onto the same grassy cell in the same move, they share the cell
and continue moving in their respective directions in the next hour.

Please determine the amount of grass eaten by each cow.  Some cows never stop,
and therefore eat an infinite amount of grass.

INPUT FORMAT (input arrives from the terminal / stdin):

The first line of input contains $N$.  Each of the next $N$ lines describes the
starting location of a cow, in terms of a character that is either N (for
north-facing) or E (for east-facing) and two nonnegative integers $x$ and $y$
($0\le x\le 10^9$, $0\le y\le 10^9$) giving the coordinates of a cell.  All
$x$-coordinates are distinct from each-other, and similarly for the
$y$-coordinates.

To be as clear as possible regarding directions and coordinates, if a cow is in cell $(x,y)$ and moves north,
she ends up in cell $(x,y+1)$.  If she instead had moved east, she would end up
in cell $(x+1, y)$.

OUTPUT FORMAT (print output to the terminal / stdout):

Print $N$ lines of output.  Line $i$ in the output should describe the number of
cells worth of grass that the $i$th cow in the input eats.  If a cow eats an
infinite amount of grass, output "Infinity" for that cow.

    Input
    Output

    6
E 3 5
N 5 3
E 4 6
E 10 4
N 11 2
N 8 1

    5
3
Infinity
Infinity
2
5

SCORING:

- In test cases 2-5, all coordinates are at most $100$.
- In test cases 6-10, there are no additional constraints.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1\le N\le 50$) ($0\le x\le 10^9$, $0\le y\le 10^9$) (x,y+1) (x+1, y)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nThe first line of input contains $N$.  Each of the next $N$ lines describes the\nstarting location of a cow, in terms of a character that is either N (for\nnorth-facing) or E (for east-facing) and two nonnegative integers $x$ and $y$\n($0\\le x\\le 10^9$, $0\\le y\\le 10^9$) giving the coordinates of a cell.  All\n$x$-coordinates are distinct from each-other, and similarly for the\n$y$-coordinates.\n\nTo be as clear as possible regarding directions and coordinates, if a cow is in cell $(x,y)$ and moves north,\nshe ends up in cell $(x,y+1)$.  If she instead had moved east, she would end up\nin cell $(x+1, y)$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1061-a1', 'usaco-1061', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1061']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-761', 'Milk Measurement', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=761', 1600, 'Farmer John purchases three cows: Bessie, Elsie, and Mildred, each of whom
initially produces 7 gallons of milk per day.  Since the milk output of a cow is
known to potentially change over time, Farmer John takes periodic measurements
over the next 100 days and scribbles them down in a log book.  Entries in his
log look like this:

35 Bessie -2
14 Mildred +3

The first entry indicates that on day 35, Bessie''s milk output was 2 gallons
lower than it was when last measured.  The next entry indicates that on day 14,
Mildred''s  milk output increased by 3 gallons from when it was last measured.
Farmer John has only enough time to make at most one measurement on any given
day.  Unfortunately, he is a bit disorganized, and doesn''t necessarily write
down his measurements in chronological order.

To keep his cows motivated, Farmer John proudly displays on the wall of his barn
the picture of whichever cow currently has the highest milk output (if several
cows tie for the highest milk output, he displays all of their pictures).
Please determine the number of days on which Farmer John would have needed to
change this display.

INPUT FORMAT (file measurement.in):

The first line of input contains $N$, the number of measurements Farmer John
makes. Each of the next $N$ lines contains one measurement, in the format above,
specifying  a day (an integer in the range 1..100), the name of a cow, and the
change in her  milk output since it was last measured (a nonzero integer).  Each
cow''s milk output will always be in the  range 0..1000.

OUTPUT FORMAT (file measurement.out):

Please output the number of days (an integer in the range 0..100) on which
Farmer John needs to adjust his motivational display.

    Input
    Output

    4
7 Mildred +3
4 Elsie -1
9 Mildred -1
1 Bessie +2

    3

Initially, all cows have milk output 7.  On day 1, Bessie''s milk output
increases to 9, making her the unique cow with highest milk output and causing
Farmer John to change his display.  On day 4, Elsie''s milk output decreases to
6, but this does not change the fact that Bessie is the sole cow in the lead.
On day 7, Mildred jumps into the  lead, changing the display, and on day 9,
Mildred drops in production to be tied with Bessie, again changing the display.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(an integer in the range 1..100) (an integer in the range 0..100)', '[{"input":"FORMAT (file measurement.in):\n\nThe first line of input contains $N$, the number of measurements Farmer John\nmakes. Each of the next $N$ lines contains one measurement, in the format above,\nspecifying  a day (an integer in the range 1..100), the name of a cow, and the\nchange in her  milk","output":"since it was last measured (a nonzero integer).  Each\ncow''s milk output will always be in the  range 0..1000."}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-761-a1', 'usaco-761', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-761']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-735', 'The Lost Cow', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=735', 1600, 'Farmer John has lost his prize cow Bessie, and he needs to find her!

Fortunately, there is only one long path running across the farm, and Farmer
John knows that Bessie has to be at some location on this path.  If we think of
the path as a number line, then Farmer John is currently at position $x$ and
Bessie is currently at position $y$ (unknown to Farmer John).  If Farmer John
only knew where Bessie was located, he could walk directly to her, traveling a
distance of $|x - y|$.  Unfortunately, it is dark outside and Farmer John can''t
see anything.  The only way he can find Bessie is to walk back and forth until
he eventually reaches her position.

Trying to figure out the best strategy for walking back and forth in his search,
Farmer John consults the computer science research literature and is
somewhat amused to find that this exact problem has not only been studied by
computer scientists in the past, but that it is actually called the "Lost Cow
Problem" (this is actually true!).

The recommended solution for Farmer John to find Bessie is to move to position
$x+1$, then reverse direction and move to position $x-2$, then to position
$x+4$, and so on, in a  "zig zag" pattern, each step moving twice as far from
his initial starting position as before.  As he has read during his study of algorithms
for solving the lost cow problem, this approach guarantees that he will at worst
travel 9 times the direct distance $|x-y|$ between himself and Bessie before he
finds her (this is also true, and the factor of 9 is actually the smallest such
worst case guarantee any strategy can achieve).

Farmer John is curious to verify this result.  Given $x$ and $y$, please compute
the  total distance he will travel according to the zig-zag search strategy above
until he finds Bessie.

INPUT FORMAT (file lostcow.in):

The single line of input contains two distinct space-separated integers $x$ and
$y$.  Both are in the range $0 \ldots 1,000$.

OUTPUT FORMAT (file lostcow.out):

Print one line of output, containing the distance Farmer John will travel to
reach Bessie.

    Input
    Output

    3 6

    9

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT (file lostcow.in):\n\nThe single line of input contains two distinct space-separated integers $x$ and\n$y$.  Both are in the range $0 \\ldots 1,000$.","output":"FORMAT (file lostcow.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-735-a1', 'usaco-735', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-735']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-713', 'Why Did the Cow Cross the Road III', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=713', 1600, 'Farmer John, in his old age, has unfortunately become increasingly grumpy and
paranoid.  Forgetting the extent to which bovine diversity helped his farm truly
flourish over the years, he has recently decided to build a huge fence around
the farm, discouraging cows from neighboring farms from visiting, and completely
prohibiting entry from  a handful of neighboring farms.  The cows are quite
upset by this state of affairs, not only since they can no longer visit with
their friends, but since it has caused them to cancel participation in the
International Milking Olympiad, an event to which they look forward all year.

Neighboring cows that still have the ability to enter Farmer John''s property
find the process has become more arduous, as they can enter only through a
single gate where each cow is subject to intense questioning, often causing the
cows to queue up in a long line.

For each of the $N$ cows visiting the farm, you are told the time she arrives
at the gate and the duration of time required for her to answer her entry
questions. Only one cow can be undergoing questioning at any given time, so if
many cows arrive near the same time, they will likely need to wait in line to be
processed one by one.  For example, if a cow arrives at time 5 and answers
questions for 7 units of time, another cow arriving at time 8 would need to wait
until time 12 to start answering questions herself.

Please determine the earliest possible time by which all cows are able to enter
the farm.

INPUT FORMAT (file cowqueue.in):

The first line of input contains $N$, a positive integer at most 100. Each of
the next $N$ lines describes one cow, giving the time it arrives and the time it
requires for questioning; each of these numbers are positive integers at most
1,000,000.

OUTPUT FORMAT (file cowqueue.out):

Please determine the minimum possible time at which all the cows could have
completed processing.

    Input
    Output

    3
2 1
8 3
5 7

    15

Here, first cow arrives at time 2 and is quickly processed.  The gate remains
briefly idle until the third cow arrives at time 5, and begins processing.  The
second cow then arrives at time 8 and waits until time 5+7=12 to start answering
questions, finishing at time 12+3 = 15.

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"FORMAT (file cowqueue.in):\n\nThe first line of input contains $N$, a positive integer at most 100. Each of\nthe next $N$ lines describes one cow, giving the time it arrives and the time it\nrequires for questioning; each of these numbers are positive integers at most\n1,000,000.","output":"FORMAT (file cowqueue.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-713-a1', 'usaco-713', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-713']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-593', 'Mowing the Field', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=593', 1600, 'Farmer John is quite reliable in all aspects of managing his farm, except one:
he is terrible at mowing the grass in a timely or logical fashion.

The farm is a large 2D grid of square unit cells.  FJ starts in one of these
cells at time $t = 0$, mowing the grass in this cell so that it is initially the
only cell in which the grass is cut.  FJ''s remaining mowing pattern is
described by a sequence of $N$ statements.  For example, if the first  statement
is "W 10", then for times $t = 1$ through $t = 10$ (i.e., the next 10 units of
time), FJ will step one cell to his west, mowing the  grass along the way.
After completing this sequence of steps, he will end up 10 cells to his west at
time $t = 10$, having mowed the grass in every cell along the way.

So slow is FJ''s progress that some of the grass he mows might grow back before
he is finished with all his mowing. Any section of grass that is cut at time $t$
will reappear at time $t + x$.

FJ''s mowing pattern might have him re-visit the same cell multiple times, but he
remarks that he never encounters a cell in which the grass is already cut.  That
is, every time he visits a cell, his most recent visit to that same cell must
have been at least $x$ units of time earlier, in order for the grass to have
grown back.

Please determine the maximum possible value of $x$ so that FJ''s observation
remains valid.

INPUT FORMAT (file mowing.in):

The first line of input contains $N$ ($1 \leq N \leq 100$). Each of the
remaining $N$ lines contains a single statement and is of the form ''D S'', where
D is a character describing a direction (N=north, E=east, S=south, W=west) and S
is the number of steps taken in that direction ($1 \leq S \leq 10$).

OUTPUT FORMAT (file mowing.out):

Please determine the maximum value of $x$ such that FJ never steps on a cell
with cut grass.  If FJ never visits any cell more than once, please
output -1.

    Input
    Output

    6
N 10
E 2
S 3
W 4
S 5
E 8

    10

In this example, FJ steps on a cell at time 17 that he stepped on earlier at
time 7; therefore, $x$ must be at most 10 or else the grass from his first visit
would not yet have grown back.  He also steps on a cell at time 26 that he also
visited at time 2; hence $x$ must also be at most 24.  Since the first of these
two constraints is tighter, we see that $x$ can be at most 10.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(i.e., the next 10 units of
time) ($1 \leq N \leq 100$) ($1 \leq S \leq 10$)', '[{"input":"FORMAT (file mowing.in):\n\nThe first line of input contains $N$ ($1 \\leq N \\leq 100$). Each of the\nremaining $N$ lines contains a single statement and is of the form ''D S'', where\nD is a character describing a direction (N=north, E=east, S=south, W=west) and S\nis the number of steps taken in that direction ($1 \\leq S \\leq 10$).","output":"FORMAT (file mowing.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-593-a1', 'usaco-593', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-593']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-760', 'The Bovine Shuffle', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=760', 1600, 'Convinced that happy cows generate more milk, Farmer John has installed a giant
disco ball in his barn and plans to teach his cows to dance!

Looking up popular cow dances, Farmer John decides to teach his cows the "Bovine
Shuffle". The Bovine Shuffle consists of his $N$ cows ($1 \leq N \leq 100$)
lining up in a row in some order, then  performing three "shuffles" in a row,
after which they will be lined up in some possibly different order.  To make it
easier for his cows to locate themselves, Farmer  John marks the locations for
his line of cows with positions $1 \ldots N$, so the  first cow in the lineup
will be in position 1, the next in position 2, and so on, up to position $N$.

A shuffle is described with N numbers, $a_1 \ldots a_N$, where the cow in
position $i$ moves to position $a_i$ during the shuffle (and so, each $a_i$ is
in the range $1 \ldots N$).  Every cow moves to its new location during the
shuffle.  Fortunately, all the $a_i$''s are distinct, so no  two cows try to move
to the same position during a shuffle.

Farmer John''s cows are each assigned distinct 7-digit integer ID numbers. If you
are given the ordering of the cows after three shuffles, please determine their
initial order.

INPUT FORMAT (file shuffle.in):

The first line of input contains $N$, the number of cows.  The next line
contains  the $N$ integers $a_1 \ldots a_N$.  The final line contains the order
of the $N$ cows after three shuffles, with each cow specified by its ID number.

OUTPUT FORMAT (file shuffle.out):

You should write $N$ lines of output, with a single cow ID per line, specifying
the  order of the cows before the three shuffles.

    Input
    Output

    5
1 3 4 5 2
1234567 2222222 3333333 4444444 5555555

    1234567
5555555
2222222
3333333
4444444

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$) (and so, each $a_i$ is
in the range $1 \ldots N$)', '[{"input":"FORMAT (file shuffle.in):\n\nThe first line of input contains $N$, the number of cows.  The next line\ncontains  the $N$ integers $a_1 \\ldots a_N$.  The final line contains the order\nof the $N$ cows after three shuffles, with each cow specified by its ID number.","output":"FORMAT (file shuffle.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-760-a1', 'usaco-760', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-760']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-616', 'Circular Barn', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=616', 1600, 'Being a fan of contemporary architecture, Farmer John has built a new barn in
the shape of a perfect circle.  Inside, the barn consists of a ring of $n$
rooms,  numbered clockwise from $1 \ldots n$ around the perimeter of the barn
($3 \leq n \leq 1,000$).  Each room  has doors to its two neighboring rooms, and
also a door opening to the exterior of the barn.

Farmer John wants exactly $r_i$ cows to end up in each room $i$
($1 \leq r_i \leq 100$). To herd the cows into the barn in an orderly fashion,
he plans to unlock the exterior door of a single room, allowing the cows to
enter through that door. Each cow then walks clockwise through the rooms until
she reaches a suitable destination.  Farmer John wants to unlock the exterior
door that will cause his cows to collectively walk a minimum total amount of
distance.  Please determine the minimum total distance his cows will need to
walk, if he chooses the best such door to unlock.  The distance walked by a
single cow is the number of interior doors through which she passes.

INPUT FORMAT (file cbarn.in):

The first line of input contains $n$.  Each of the remaining $n$ lines contain
$r_1 \ldots r_n$.

OUTPUT FORMAT (file cbarn.out):

Please write out the minimum total amount of distance the cows collectively need
to travel.

    Input
    Output

    5
4
7
8
6
4

    48

In this example, the best solution is to let the cows enter through the
door of the room that requires 7 cows.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($3 \leq n \leq 1,000$) ($1 \leq r_i \leq 100$)', '[{"input":"FORMAT (file cbarn.in):\n\nThe first line of input contains $n$.  Each of the remaining $n$ lines contain\n$r_1 \\ldots r_n$.","output":"FORMAT (file cbarn.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-616-a1', 'usaco-616', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-616']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-891', 'Shell Game', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=891', 1600, 'To pass the time, Bessie the cow and her friend Elsie like to play a version of
a game they saw at the county fair.

To start, Bessie puts three inverted shells on a table and places a small round
pebble under one of them (at least she hopes it is a pebble -- she found it on
the ground in one of the  pastures).  Bessie then proceeds to swap pairs of
shells,  while Elsie tries to guess the location of the pebble.

The standard version of the game the cows saw being played at the county fair
allowed the player to see the initial location of the pebble, and then required
guessing its final location after all the swaps were complete.

However, the cows like to play a version where Elsie does not know the initial
location of the pebble, and where she can guess the pebble location after every
swap.  Bessie, knowing the right answer, gives Elsie a score at the end equal to
the number of correct guesses she made.

Given the swaps and the guesses, but not the initial pebble location, please
determine the highest possible score Elsie could have earned.

INPUT FORMAT (file shell.in):

The first line of the input file contains an integer $N$ giving the number of
swaps ($1 \leq N \leq 100$).  Each of the next $N$ lines describes a step of the
game and contains three integers $a$, $b$, and $g$, indicating that shells $a$
and $b$ were swapped by Bessie, and then Elsie guessed shell $g$ after the swap
was made.  All three of these integers are either 1, 2, or 3, and $a \neq b$.

OUTPUT FORMAT (file shell.out):

Please output the maximum number of points Elsie could have earned.

    Input
    Output

    3
1 2 1
3 2 1
1 3 1

    2

In this example, Elsie could have earned at most 2 points.  If the pebble
started under shell 1, then she guesses right exactly once (her final guess). If
the pebble started under shell 2, then she guesses right twice (the first two
guesses).  If the pebble started under shell 3, then she doesn''t make any
correct guesses.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file shell.in):\n\nThe first line of the input file contains an integer $N$ giving the number of\nswaps ($1 \\leq N \\leq 100$).  Each of the next $N$ lines describes a step of the\ngame and contains three integers $a$, $b$, and $g$, indicating that shells $a$\nand $b$ were swapped by Bessie, and then Elsie guessed shell $g$ after the swap\nwas made.  All three of these integers are either 1, 2, or 3, and $a \\neq b$.","output":"FORMAT (file shell.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-891-a1', 'usaco-891', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-891']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-665', 'The Cow-Signal', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=665', 1600, 'Bessie and her cow friends are playing as their favorite cow superheroes.  Of
course, everyone knows that any self-respecting superhero needs a signal to call
them to action. Bessie has drawn a special signal on a sheet of $M \times N$
paper ($1 \leq M \leq 10, 1 \leq N \leq 10$), but this is too small, much too
small! Bessie wants to amplify the signal so it is exactly $K$ times bigger
($1 \leq K \leq 10$) in each direction.

The signal will consist only of the ''.'' and ''X'' characters.

INPUT FORMAT (file cowsignal.in):

The first line of input contains $M$, $N$, and $K$, separated by spaces.

The next $M$ lines each contain a length-$N$ string, collectively describing the
picture of the signal.

OUTPUT FORMAT (file cowsignal.out):

You should output $KM$ lines, each with $KN$ characters, giving a picture of the
enlarged signal.

    Input
    Output

    5 4 2
XXX.
X..X
XXX.
X..X
XXX.

    XXXXXX..
XXXXXX..
XX....XX
XX....XX
XXXXXX..
XXXXXX..
XX....XX
XX....XX
XXXXXX..
XXXXXX..

Problem credits: Nathan Pinsker', 'See statement.', 'See statement.', '($1 \leq M \leq 10, 1 \leq N \leq 10$) ($1 \leq K \leq 10$)', '[{"input":"FORMAT (file cowsignal.in):\n\nThe first line of input contains $M$, $N$, and $K$, separated by spaces.\n\nThe next $M$ lines each contain a length-$N$ string, collectively describing the\npicture of the signal.","output":"FORMAT (file cowsignal.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-665-a1', 'usaco-665', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-665']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-568', 'Speeding Ticket', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=568', 1600, 'Always the troublemaker, Bessie the cow has stolen Farmer John''s tractor and
taken off down the road!

The road is exactly 100 miles long, and Bessie drives the entire
length of the road before ultimately being pulled over by a police
officer, who gives Bessie a ticket for exceeding the speed limit, for
having an expired license, and for operating a motor vehicle while
being a cow.  While Bessie concedes that the last two tickets are
probably valid, she questions whether the police officer was correct
in issuing the speeding ticket, and she wants to determine for herself
if she has indeed driven faster than the speed limit for part of her
journey.

The road is divided into $N$ segments, each described by a positive
integer length in miles, as well as an integer speed limit in the
range $1 \ldots 100$ miles per hour.  As the road is 100 miles long,
the lengths of all $N$ segments add up to 100.  For example, the road
might start with a segment of length 45 miles, with speed limit 70,
and then it might end with a segment of length 55 miles, with speed
limit 60.

Bessie''s journey can also be described by a series of segments, $M$
of them.  During each segment, she travels for a certain positive
integer number of miles, at a certain integer speed.  For example, she
might begin by traveling 50 miles at a speed of 65, then another 50
miles at a speed of 55.  The lengths of all $M$ segments add to 100
total miles.  Farmer John''s tractor can drive 100 miles per hour at
its fastest.

Given the information above, please determine the maximum amount
over the speed limit that Bessie travels during any part of her
journey.

INPUT FORMAT (file speeding.in):

The first line of the input contains $N$ and $M$, separated by a space.

The next $N$ lines each contain two integers describing a road segment, giving
its length and speed limit.

The next $M$ lines each contain two integers describing a segment
in Bessie''s journey, giving the length and also the speed at which
Bessie was driving.

OUTPUT FORMAT (file speeding.out):

Please output a single line containing the maximum amount over the speed limit
Bessie drove during any part of her journey.  If she never exceeds the speed
limit, please output 0.

    Input
    Output

    3 3
40 75
50 35
10 45
40 76
20 30
40 40

    5

In this example, the road contains three segments (40 miles at 75
miles per hour, followed by 50 miles at 35 miles per hour, then 10
miles at 45 miles per hour).  Bessie drives for three segments (40
miles at 76 miles per hour, 20 miles at 30 miles per hour, and 40
miles at 40 miles per hour).  During her first segment, she is
slightly over the speed limit, but her last segment is the worst
infraction, during part of which she is 5 miles per hour over the
speed limit.  The correct answer is therefore 5.

Problem credits: Austin Bannister and Brian Dean', 'See statement.', 'See statement.', 'Bessie drove during any part of her journey.  If she never exceeds the speed
limit, please output 0.', '[{"input":"FORMAT (file speeding.in):\n\nThe first line of the input contains $N$ and $M$, separated by a space.\n\nThe next $N$ lines each contain two integers describing a road segment, giving\nits length and speed limit.\n\nThe next $M$ lines each contain two integers describing a segment\nin Bessie''s journey, giving the length and also the speed at which\nBessie was driving.","output":"FORMAT (file speeding.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-568-a1', 'usaco-568', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-568']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-856', 'The Bucket List', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=856', 1600, 'Farmer John is considering a change in how he allocates buckets for milking his
cows. He thinks this will ultimately allow him to use a small number of total
buckets, but he is not sure how many exactly.  Please help him out!

Farmer John has $N$ cows ($1 \leq N \leq 100$), conveniently numbered $1 \ldots N$.  The
$i$th cow needs to be milked from time $s_i$ to time $t_i$, and requires $b_i$
buckets to be used during the milking process.  Several cows might end up being
milked at the same time; if so, they cannot use the same buckets.  That is, a
bucket assigned to cow $i$''s milking cannot be used for any other cow''s milking
between time $s_i$ and time $t_i$.  The bucket can be used for other cows
outside this window of time, of course.  To simplify his job, FJ has made sure
that at any given moment in time, there is at most one cow whose milking is
starting or ending (that is, the $s_i$''s and $t_i$''s are all distinct).

FJ has a storage room containing buckets that are sequentially numbered with
labels 1, 2, 3, and so on.  In his current milking strategy, whenever some cow (say, cow $i$)
starts milking (at time $s_i$), FJ runs to the storage room and collects the
$b_i$ buckets with the smallest available labels and allocates these for milking cow $i$.

Please determine how many total buckets FJ would need to keep in his
storage room in order to milk all the cows successfully.

INPUT FORMAT (file blist.in):

The first line of input contains $N$.  The next $N$ lines each describe one cow,
containing the numbers $s_i$, $t_i$, and $b_i$, separated by spaces.  Both $s_i$
and $t_i$ are integers in the range $1 \ldots 1000$, and $b_i$ is an  integer in
the range $1 \ldots 10$.

OUTPUT FORMAT (file blist.out):

Output a single integer telling how many total buckets FJ needs.

    Input
    Output

    3
4 10 1
8 13 3
2 6 2

    4

In this example, FJ needs 4 buckets: He uses buckets 1
and 2 for milking cow 3 (starting at time 2).  He uses bucket 3 for milking cow
1 (starting at time 4).  When cow 2 arrives at time 8, buckets 1 and 2 are now
available, but not bucket 3, so he uses buckets 1, 2, and 4.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($1 \leq N \leq 100$) (starting at time 2) (starting at time 4)', '[{"input":"FORMAT (file blist.in):\n\nThe first line of input contains $N$.  The next $N$ lines each describe one cow,\ncontaining the numbers $s_i$, $t_i$, and $b_i$, separated by spaces.  Both $s_i$\nand $t_i$ are integers in the range $1 \\ldots 1000$, and $b_i$ is an  integer in\nthe range $1 \\ldots 10$.","output":"FORMAT (file blist.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-856-a1', 'usaco-856', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-856']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-591', 'Promoção', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=591', 1600, 'Bessie the cow is helping Farmer John run the USA Cow Olympiad (USACO), an
on-line contest where participants answer challenging questions to demonstrate
their mastery of bovine trivia.

In response to a wider range of participant backgrounds, Farmer John recently
expanded the contest to include four divisions of difficulty: bronze, silver,
gold, and platinum.  All new participants start in the bronze division, and any
time they score perfectly on a contest they are promoted to the next-higher
division.  It is even possible for a participant to be promoted several times
within the same contest. Farmer John keeps track of a list of all contest
participants and their current divisions, so that he can start everyone out at
the right level any time he holds a contest.

When publishing the results from his most recent contest, Farmer John wants to
include information on the number of participants who were promoted from bronze
to silver, from silver to gold, and from gold to platinum.  However, he
neglected to count promotions as they occurred during the contest.  Bessie,
being the clever bovine she is, realizes however that Farmer John can deduce the
number of promotions that occurred solely from the number of participants at
each level before and after the contest.  Please help her perform this
computation!

INPUT FORMAT (file promote.in):

Input consists of four lines, each containing two integers in the range
0..1,000,000. The first line specifies the number of bronze participants
registered before and after the contest. The second line specifies the number of
silver participants before and after the contest. The third line specifies the
number of gold participants before and after the contest. The last line
specifies the number of platinum participants before and after the contest.

OUTPUT FORMAT (file promote.out):

Please output three lines, each containing a single integer. The first line
should contain the number of participants who were promoted from bronze to
silver. The second line should contain the number of participants who were
promoted from silver to gold. The last line should contain the number of
participants who were promoted from gold to platinum.

    Input
    Output

    1 2
1 1
1 1
1 2

    1
1
1

In this example, 1 participant was registered in each division prior to the
contest.  At the end of the contest, 2 participants were registered in bronze
and platinum.  One way this could have happened is that 2 new participants
joined during the contest; one was promoted all the way to platinum, and the
other stayed in bronze.

Problem credits: Brian Dean', 'See statement.', 'See statement.', 'See statement.', '[{"input":"consists of four lines, each containing two integers in the range\n0..1,000,000. The first line specifies the number of bronze participants\nregistered before and after the contest. The second line specifies the number of\nsilver participants before and after the contest. The third line specifies the\nnumber of gold participants before and after the contest. The last line\nspecifies the number of platinum participants before and after the contest.","output":"FORMAT (file promote.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-591-a1', 'usaco-591', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-591']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-892', 'Ordem adormecida', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=892', 1600, 'Farmer John is attempting to sort his $N$ cows ($1 \leq N \leq 100$),
conveniently numbered $1 \dots N$, before they head out to the pastures for
breakfast.

Currently, the cows are standing in a line in the order
$p_1, p_2, p_3,
\dots, p_N$, and Farmer John is standing in front of cow $p_1$.
He wants to reorder the cows so that they are in the order $1, 2, 3, \dots, N$,
with cow $1$ next to Farmer John.

The cows are a bit sleepy today, so at any point in time the only cow who is
paying attention to Farmer John''s instructions is the cow directly facing Farmer
John. In one time step, he can instruct this cow to move $k$ paces down the
line, for any $k$ in the range $1 \ldots N-1$. The $k$ cows whom she passes will
amble forward, making room for her to insert herself in the line after them.

For example, suppose that $N=4$ and the cows start off in the following order:

 FJ: 4, 3, 2, 1

The only cow paying attention to FJ is cow $4$. If he instructs her to move $2$
paces down the line, the order will subsequently look like this:

 FJ: 3, 2, 4, 1

Now the only cow paying attention to FJ is cow $3$, so in the second time step
he may give cow $3$ an instruction, and so forth until the cows are sorted.

Farmer John is eager to complete the sorting, so he can go back to the farmhouse
for his own breakfast. Help him find the minimum number of time steps required
to sort the cows.

INPUT FORMAT (file sleepy.in):

The first line of input contains $N$.

The second line contains $N$ space-separated integers,
$p_1, p_2, p_3, \dots, p_N$, indicating the starting order of the cows.

OUTPUT FORMAT (file sleepy.out):

A single integer: the number of time steps before the $N$ cows are in sorted
order, if Farmer John acts optimally.

    Input
    Output

    4
1 2 4 3

    3

Problem credits: Dhruv Rohatgi', 'See statement.', 'See statement.', '($1 \leq N \leq 100$)', '[{"input":"FORMAT (file sleepy.in):\n\nThe first line of input contains $N$.\n\nThe second line contains $N$ space-separated integers,\n$p_1, p_2, p_3, \\dots, p_N$, indicating the starting order of the cows.","output":"FORMAT (file sleepy.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-892-a1', 'usaco-892', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-892']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-809', 'Surto', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=809', 1600, 'Early in the morning, Farmer John woke up to the sound of splintering wood. It
was the cows, and they were breaking out of the barn again!

Farmer John was sick and tired of the cows'' morning breakouts, and he decided
enough was enough: it was time to get tough. He nailed to the barn wall a
counter tracking the number of days since the last breakout. So if a breakout
occurred in the morning, the counter would be $0$ that day; if the most recent
breakout was $3$ days ago, the counter would read $3$. Farmer John meticulously
logged the counter every day.

The end of the year has come, and Farmer John is ready to do some accounting.
The cows will pay, he says! But lo and behold, some entries of his log are
missing!

Farmer John is confident that the he started his log on the day of a breakout.
Please help him determine, out of all sequences of events consistent with the
log entries that remain, the minimum and maximum number of breakouts that may
have take place over the course of the logged time.

INPUT FORMAT (file taming.in):

The first line contains a single integer $N$ ($1 \leq N \leq 100$), denoting the
number of days since Farmer John started logging the cow breakout counter.

The second line contains $N$ space-separated integers. The $i$th integer is
either $-1$, indicating that the log entry for day $i$ is missing, or a
non-negative integer $a_i$ (at most $100$), indicating that on day $i$ the counter
was at
$a_i$.

OUTPUT FORMAT (file taming.out):

If there is no sequence of events consistent with Farmer John''s partial log and
his knowledge that the cows definitely broke out of the barn on the morning of
day $1$, output a single integer $-1$.  Otherwise, output two space-separated
integers $m$ followed by $M$, where $m$ is the minimum number of breakouts of
any consistent sequence of events, and $M$ is the maximum.

    Input
    Output

    4
-1 -1 -1 1

    2 3

In this example, we can deduce that a breakout had to occur on day 3.  Knowing
that  a breakout also occurred on day 1, the only remaining bit of uncertainty
is whether a breakout occurred on day 2.  Hence, there were between 2 and 3
breakouts in total.

Problem credits: Dhruv Rohatgi', 'See statement.', 'See statement.', '($1 \leq N \leq 100$) (at most $100$)', '[{"input":"FORMAT (file taming.in):\n\nThe first line contains a single integer $N$ ($1 \\leq N \\leq 100$), denoting the\nnumber of days since Farmer John started logging the cow breakout counter.\n\nThe second line contains $N$ space-separated integers. The $i$th integer is\neither $-1$, indicating that the log entry for day $i$ is missing, or a\nnon-negative integer $a_i$ (at most $100$), indicating that on day $i$ the counter\nwas at\n$a_i$.","output":"FORMAT (file taming.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-809-a1', 'usaco-809', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-809']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-737', 'Quadro', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=737', 1600, 'Art critics worldwide have only recently begun to recognize the creative genius
behind the  great bovine painter, Picowso.

Picowso paints in a very particular way.  She starts with an $N \times N$ blank
canvas, represented by an $N \times N$ grid of zeros, where a zero indicates an
empty cell of the canvas.  She then draws 9 rectangles on the canvas, one in
each of 9 colors (conveniently numbered $1 \ldots 9$).  For example, she might
start by painting a rectangle in color 2, giving this intermediate canvas:

2220
2220
2220
0000

She might then paint a rectangle in color 7:

2220
2777
2777
0000

And then she might paint a small rectangle in color 3:

2230
2737
2777
0000

Each rectangle has sides parallel to the edges of the canvas, and a rectangle
could be as large as the entire canvas or as small as a single cell.  Each color
from $1 \ldots 9$ is used exactly once, although later colors might completely
cover up some of the earlier colors.

Given the final state of the canvas, please count how many of the colors still
visible on the canvas could have possibly been the first to be painted.

INPUT FORMAT (file art.in):

The first line of input contains $N$, the size of the canvas
($1 \leq N \leq 10$).  The next $N$ lines describe the final picture of the
canvas, each containing $N$ numbers that are in the range $0 \ldots 9$.  The
input is guaranteed to have been drawn as described above, by painting
successive rectangles in different colors.

OUTPUT FORMAT (file art.out):

Please output a count of the number of colors that could have been drawn first,
from among all colors visible in the final canvas.

    Input
    Output

    4
2230
2737
2777
0000

    1

In this example, only color 2 could have been the first to be painted.  Color 3 clearly had to have been painted after color 7, and
color 7 clearly had to have been painted after color 2.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(conveniently numbered $1 \ldots 9$) ($1 \leq N \leq 10$)', '[{"input":"is guaranteed to have been drawn as described above, by painting\nsuccessive rectangles in different colors.","output":"FORMAT (file art.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-737-a1', 'usaco-737', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-737']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-855', 'Misturar', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=855', 1600, 'Farming is competitive business -- particularly milk production.  Farmer John
figures that if he doesn''t innovate in his milk production methods, his dairy
business could get creamed!

Fortunately, Farmer John has a good idea.  His three prize dairy cows Bessie,
Elsie, and Mildred each produce milk with a slightly different taste, and he
plans to mix these together to get the perfect blend of flavors.

To mix the three different milks, he takes three buckets containing milk from
the three cows.  The buckets may have different sizes, and may not be completely
full.  He then pours bucket 1 into bucket 2, then bucket 2 into bucket 3, then
bucket 3  into bucket 1, then bucket 1 into bucket 2, and so on in a cyclic
fashion, for a total of 100 pour operations (so the 100th pour would be from
bucket 1 into bucket 2).  When Farmer John pours from bucket $a$ into bucket
$b$, he pours as much milk as possible until either bucket $a$ becomes empty or
bucket $b$ becomes full.

Please tell Farmer John how much milk will be in each bucket after he finishes
all 100 pours.

INPUT FORMAT (file mixmilk.in):

The first line of the input file contains two space-separated integers: the
capacity $c_1$ of the first bucket, and the amount of milk $m_1$ in the first
bucket. Both $c_1$ and $m_1$ are positive and at most 1 billion, with
$c_1 \geq m_1$. The second and third lines are similar, containing capacities
and milk amounts for the  second and third buckets.

OUTPUT FORMAT (file mixmilk.out):

Please print three lines of output, giving the final amount of milk in each
bucket, after  100 pour operations.

    Input
    Output

    10 3
11 4
12 5

    0
10
2

In this example, the milk in each bucket is as follows during the sequence of
pours:

Initial State: 3  4  5
1. Pour 1->2:  0  7  5
2. Pour 2->3:  0  0  12
3. Pour 3->1:  10 0  2
4. Pour 1->2:  0  10 2
5. Pour 2->3:  0  0  12
(The last three states then repeat in a cycle ...)

Problem credits: Brian Dean', 'See statement.', 'See statement.', '(so the 100th pour would be from
bucket 1 into bucket 2)', '[{"input":"FORMAT (file mixmilk.in):\n\nThe first line of the input file contains two space-separated integers: the\ncapacity $c_1$ of the first bucket, and the amount of milk $m_1$ in the first\nbucket. Both $c_1$ and $m_1$ are positive and at most 1 billion, with\n$c_1 \\geq m_1$. The second and third lines are similar, containing capacities\nand milk amounts for the  second and third buckets.","output":"FORMAT (file mixmilk.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-855-a1', 'usaco-855', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-855']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-1203', 'Dormir', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=1203', 1600, 'Bessie the cow was excited to recently return to in-person learning!
Unfortunately, her instructor, Farmer John, is a very boring lecturer, and so
she ends up falling asleep in class often.

Farmer John has noticed that Bessie has not been paying attention in class. He
has asked another student in class, Elsie, to keep track of the number of times
Bessie falls asleep in a given class. There are $N$ class periods
($1\le N\le 10^5$), and Elsie logs that Bessie fell asleep $a_i$ times
($0\le a_i\le 10^6$) in the $i$-th class period. The total number of times Bessie fell
asleep across all class periods is at most $10^6$.

Elsie, feeling very competitive with Bessie, wants to make Farmer John feel like
Bessie is consistently falling asleep the same number of times in every class --
making it appear that the issue is entirely Bessie''s fault, with no dependence
on Farmer John''s sometimes-boring lectures. The only way Elsie may modify the
log is by combining two adjacent class periods.  For example, if
$a=[1,2,3,4,5],$ then if Elsie combines the second and third class periods the
log will become $[1,5,4,5]$.

Help Elsie compute the minimum number of modifications to the log that she needs
to make so that she can make all the numbers in the log equal.

INPUT FORMAT (input arrives from the terminal / stdin):

Each input will contain $T$ ($1\le T\le 10$) test cases that should be solved
independently.

The first line contains $T$, the number of test cases to be solved. The $T$ test
cases follow, each described by a pair of lines. The first line of each pair
contains $N$, and the second contains $a_1,a_2,\ldots,a_N$.

It is guaranteed that within each test case, the sum of all values in $a$ is at
most $10^6$. It is also guaranteed that the sum of $N$ over all test cases is at
most
$10^5$.

OUTPUT FORMAT (print output to the terminal / stdout):

Please write $T$ lines of output, giving the minimum number of modifications
Elsie could perform to make all the log entries equal for each case.

    Input
    Output

    3
6
1 2 3 1 1 1
3
2 2 3
5
0 0 0 0 0

    3
2
0

For the first test case in this example, Elsie can change her log to consist
solely of 3s with 3 modifications.

   1 2 3 1 1 1
-> 3 3 1 1 1
-> 3 3 2 1
-> 3 3 3

For the second test case, Elsie can change her log to 7 with 2 modifications.

   2 2 3
-> 2 5
-> 7

For the last test case, Elsie doesn’t need to perform any operations; the log
already consists of equal entries.

Problem credits: Jesse Choe', 'See statement.', 'See statement.', '($1\le N\le 10^5$) ($0\le a_i\le 10^6$) ($1\le T\le 10$)', '[{"input":"FORMAT (input arrives from the terminal / stdin):\n\nEach input will contain $T$ ($1\\le T\\le 10$) test cases that should be solved\nindependently.\n\nThe first line contains $T$, the number of test cases to be solved. The $T$ test\ncases follow, each described by a pair of lines. The first line of each pair\ncontains $N$, and the second contains $a_1,a_2,\\ldots,a_N$.\n\nIt is guaranteed that within each test case, the sum of all values in $a$ is at\nmost $10^6$. It is also guaranteed that the sum of $N$ over all test cases is at\nmost\n$10^5$.","output":"FORMAT (print output to the terminal / stdout):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-1203-a1', 'usaco-1203', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-1203']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('usaco-893', 'Adivinhar', 'USACO', 'http://www.usaco.org/index.php?page=viewproblem2&cpid=893', 1600, 'When bored of playing their usual shell game, Bessie the cow and her friend
Elsie like to play another common game called "guess the animal".

Initially, Bessie thinks of some animal (most of the time, this animal is a cow,
making the game rather boring, but occasionally Bessie is  creative and thinks
of something else).  Then Elsie proceeds to ask a series of questions to figure
out what animal Bessie has selected.  Each question asks whether the animal has
some specific characteristic, and Bessie answers each question with "yes" or
"no". For example:

Elsie: "Does the animal fly?"
Bessie: "No"
Elsie: "Does the animal eat grass?"
Bessie: "Yes"
Elsie: "Does the animal make milk?"
Bessie: "Yes"
Elsie: "Does the animal go moo?"
Bessie: "Yes"
Elsie: "In that case I think the animal is a cow."
Bessie: "Correct!"

If we call the "feasible set" the set of all animals with characteristics
consistent with Elsie''s questions so far, then Elsie keeps asking questions
until the feasible set contains only one animal, after which she announces this
animal as her answer.  In each question, Elsie picks a characteristic of some
animal in the feasible set to ask about (even if this characteristic might not
help her narrow down the feasible set any further).  She never asks about the
same  characteristic twice.

Given all of the animals that Bessie and Elsie know as well as their
characteristics, please determine the maximum number of "yes" answers  Elsie
could possibly receive before she knows the right animal.

INPUT FORMAT (file guess.in):

The first line of input contains the number of animals, $N$
($2 \leq N \leq 100$).   Each of the next $N$ lines describes an animal.  The
line starts with the animal name,  then an integer $K$ ($1 \leq K \leq 100$),
then $K$ characteristics of that animal. Animal names and characteristics are
strings of up to 20 lowercase characters (a..z).  No two animals have  exactly
the same characteristics.

OUTPUT FORMAT (file guess.out):

Please output the maximum number of "yes" answers Elsie could receive before the
game ends.

    Input
    Output

    4
bird 2 flies eatsworms
cow 4 eatsgrass isawesome makesmilk goesmoo
sheep 1 eatsgrass
goat 2 makesmilk eatsgrass

    3

In this example, it is possible for Elsie to generate a transcript with  3 "yes"
answers (the one above), and it is not possible to generate a transcript with
more than 3 "yes" answers.

Problem credits: Brian Dean', 'See statement.', 'See statement.', '($2 \leq N \leq 100$) ($1 \leq K \leq 100$)', '[{"input":"FORMAT (file guess.in):\n\nThe first line of input contains the number of animals, $N$\n($2 \\leq N \\leq 100$).   Each of the next $N$ lines describes an animal.  The\nline starts with the animal name,  then an integer $K$ ($1 \\leq K \\leq 100$),\nthen $K$ characteristics of that animal. Animal names and characteristics are\nstrings of up to 20 lowercase characters (a..z).  No two animals have  exactly\nthe same characteristics.","output":"FORMAT (file guess.out):"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('usaco-893-a1', 'usaco-893', 'Pending editorial review', ARRAY['Ad-Hoc']::text[], ARRAY[]::text[], ARRAY[]::text[], ARRAY['Auto-imported from VJudge — replace this approach after you solve / read an editorial','Origin: USACO-893']::text[], 'Stub approach from bulk VJudge import. Statement is present; tags and complexity are heuristics. Review before relying on scoring.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-flight-discount', 'Flight Discount', 'CSES', 'https://cses.fi/problemset/task/1195', 1700, 'Find the cheapest flight from $1$ to $n$ when you may halve the cost of **at most one** edge (rounded down).', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with flights $a\ b\ c$.', 'Print the minimum price from $1$ to $n$ when you may halve the cost of at most one flight.', '$2 \le n \le 10^5$, $1 \le m \le 2 \times 10^5$', '[{"input":"3 4\n1 2 3\n2 3 1\n1 3 7\n2 1 5","output":"2"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-flight-discount-a1', 'cses-flight-discount', 'Dijkstra on layered graph', ARRAY['Graph Algorithms','Dynamic Programming']::text[], ARRAY['Dijkstra']::text[], ARRAY['Priority Queue','Adjacency List']::text[], ARRAY['State is (node, used_discount)','Edge transitions either keep discount unused or apply half cost once']::text[], 'Model a 2-layer graph: whether the discount has been used. Dijkstra on states $(u,0/1)$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-nested-ranges-check', 'Nested Ranges Check', 'CSES', 'https://cses.fi/problemset/task/2168', 1700, 'You are given $n$ ranges. For each range, determine whether it contains another range, and whether it is contained in another range.', 'The first line contains an integer $n$.

Then $n$ lines follow with ranges $x\ y$.', 'Print two lines of $n$ bits each: whether each range contains another, and whether each is contained in another.', '$1 \le n \le 2 \times 10^5$', '[{"input":"4\n1 6\n2 4\n3 6\n5 7","output":"1 1 0 0\n0 1 1 1"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-nested-ranges-check-a1', 'cses-nested-ranges-check', 'Sort + sweep with fenwick/set', ARRAY['Greedy','Graph Algorithms']::text[], ARRAY['Sorting','Segment Tree']::text[], ARRAY['Fenwick Tree','Ordered Set']::text[], ARRAY['Sort by left ascending, right descending','Sweep tracking max/min right endpoints seen']::text[], 'Sort ranges carefully, then sweep while maintaining ordered rights (set/BIT) to detect containment both ways.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-word-combinations', 'Word Combinations', 'CSES', 'https://cses.fi/problemset/task/1731', 1700, 'You are given a string $s$ of length $n$ and a dictionary of $k$ words. Count the number of ways to form $s$ by concatenating dictionary words. Print modulo $10^9+7$.', 'The first line contains the string $s$.

The second line contains an integer $k$.

Then $k$ lines follow with the dictionary words.', 'Print the number of ways to form $s$, modulo $10^9+7$.', '$1 \le n \le 5000$, $1 \le k \le 10^5$, total dictionary length $\le 10^6$', '[{"input":"ababc\n4\nab\nabc\nba\na","output":"2"}]'::jsonb, 'O(N²)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-word-combinations-a1', 'cses-word-combinations', 'DP + Trie', ARRAY['Dynamic Programming','String Algorithms']::text[], ARRAY[]::text[], ARRAY['Trie','1D Array']::text[], ARRAY['$dp[i]$ = ways to form prefix $s[0..i)$','From each $i$, walk a trie of dictionary words over $s[i..]$']::text[], 'Insert all dictionary words into a trie. Let $dp[0]=1$. For each position, traverse the trie along the suffix and add $dp[i]$ into reachable ends.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cses-high-score', 'High Score', 'CSES', 'https://cses.fi/problemset/task/1673', 1800, 'A game has $n$ rooms and $m$ tunnels. Each tunnel gives a score. Starting in room $1$, what is the maximum score you can achieve when reaching room $n$? If the score can be arbitrarily large, print $-1$.', 'The first line contains two integers $n$ and $m$.

Then $m$ lines follow with tunnels $a\ b\ x$ (from, to, score).', 'Print the maximum score when going from $1$ to $n$, or $-1$ if the score can be arbitrarily large.', '$1 \le n \le 2500$, $1 \le m \le 5000$', '[{"input":"4 5\n1 2 3\n2 4 -1\n1 3 1\n3 4 1\n1 4 2","output":"2"}]'::jsonb, 'O(N · M)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cses-high-score-a1', 'cses-high-score', 'Bellman-Ford + positive cycle check', ARRAY['Graph Algorithms']::text[], ARRAY['Bellman-Ford']::text[], ARRAY['Adjacency List']::text[], ARRAY['Negate scores and find shortest path, or run BF for longest path','A positive cycle reachable from 1 that can reach n ⇒ answer -1']::text[], 'Use Bellman-Ford for longest paths (or negate edges for shortest). After $n-1$ relaxations, one more pass detects improving cycles; check reachability into $n$.');
insert into public.problems (id, title, source, url, difficulty_rating, statement_md, input_format_md, output_format_md, constraints_text, sample_io, target_complexity) values ('cf-1201d', 'Treasure Hunting', 'Codeforces', 'https://codeforces.com/problemset/problem/1201/D', 2000, 'You are on an $n \times m$ grid. Some cells contain treasures. You may only move right, left, or up, and you can only change rows using special safe columns. Collect all treasures with minimum moves (starting at $(1,1)$).', 'The first line contains four integers $n$, $m$, $k$, $q$.

Then $k$ lines with treasure coordinates.

Then $q$ integers: the safe columns.', 'Print the minimum number of moves to collect all treasures.', '$1 \le n,m \le 2 \times 10^5$ (with sparse treasures)', '[{"input":"3 3 4 2\n1 1\n1 3\n3 1\n3 3\n2 3","output":"8"}]'::jsonb, 'O(N log N)');
insert into public.solution_approaches (id, problem_id, approach_name, paradigms, algorithms, data_structures, key_insights, editorial_summary_md) values ('cf-1201d-a1', 'cf-1201d', 'Row DP with safe columns', ARRAY['Dynamic Programming','Greedy']::text[], ARRAY['Binary Search']::text[], ARRAY['1D Array','Ordered Set']::text[], ARRAY['Process treasure rows bottom-up / top-down keeping only leftmost and rightmost per row','Transitions jump via nearest safe columns when changing rows']::text[], 'Compress to rows that contain treasures. DP states track ending at the leftmost or rightmost treasure of the current row; moving to the next treasure row uses the closest safe columns for vertical travel.');
