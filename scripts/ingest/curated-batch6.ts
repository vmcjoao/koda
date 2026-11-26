/**
 * Batch 6 — grow catalog to ≥550 using unused CSES tasks (+ a few CF offline).
 * Usage: npm run ingest:curated-batch6
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { SEED_PROBLEMS } from '../../data/seed-problems';
import extraJson from '../../data/extra-problems.json';
import { COMPLEXITY_OPTIONS } from '../../constants/tags';

type Approach = {
  id: string;
  problem_id: string;
  approach_name: string;
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  key_insights: string[];
  editorial_summary_md: string;
};

type Draft = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  difficulty_rating: number;
  statement_md: string;
  input_format_md: string;
  output_format_md: string;
  constraints_text: string;
  sample_io: { input: string; output: string }[];
  target_complexity: string;
  approaches: Approach[];
};

type Spec = {
  id: string;
  source: 'CSES' | 'Codeforces';
  url: string;
  difficulty_rating: number;
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  key_insights: string[];
  approach_name: string;
  editorial_summary_md: string;
  target_complexity: string;
  offline?: {
    title: string;
    statement_md: string;
    input_format_md: string;
    output_format_md: string;
    constraints_text: string;
    sample_io: { input: string; output: string }[];
  };
};

const TARGET_NEW = 70; // buffer past 550

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function existingIds(): Set<string> {
  const ids = new Set<string>();
  for (const p of SEED_PROBLEMS) ids.add(p.id);
  for (const p of Array.isArray(extraJson) ? extraJson : []) {
    if (p && typeof p === 'object' && typeof (p as { id?: string }).id === 'string') {
      ids.add((p as { id: string }).id);
    }
  }
  return ids;
}

function existingTasks(): Set<string> {
  const tasks = new Set<string>();
  const all = [...SEED_PROBLEMS, ...(Array.isArray(extraJson) ? extraJson : [])] as Array<{
    url?: string | null;
  }>;
  for (const p of all) {
    const m = p.url?.match(/cses\.fi\/problemset\/task\/(\d+)/);
    if (m) tasks.add(m[1]);
  }
  return tasks;
}

function tagsFor(section: string, title: string): {
  paradigms: string[];
  algorithms: string[];
  data_structures: string[];
  difficulty: number;
  complexity: string;
} {
  const t = `${section} ${title}`.toLowerCase();
  const paradigms: string[] = [];
  const algorithms: string[] = [];
  const data_structures: string[] = [];
  let difficulty = 1500;
  let complexity = 'O(N log N)';

  if (/interactive/.test(t)) {
    paradigms.push('Interactive');
    algorithms.push('Binary Search');
    difficulty = 1600;
  } else if (/geometry|manhattan|hull|segment|lattice|rectangle|robot path|line /.test(t)) {
    paradigms.push('Geometry');
    if (/hull/.test(t)) algorithms.push('Sorting');
    if (/intersect|sweep/.test(t)) {
      algorithms.push('Sorting', 'Segment Tree');
      data_structures.push('Fenwick Tree');
    }
    difficulty = 1600;
  } else if (/string|palindrome|suffix|substring|pattern|rotation|border|period|aho|z-array/.test(t)) {
    paradigms.push('String Algorithms');
    if (/hash|palindrome|substring|pattern/.test(t)) algorithms.push('String Hashing');
    if (/border|period|kmp|matching|z /.test(t)) algorithms.push('KMP');
    if (/trie|dictionary|word/.test(t)) data_structures.push('Trie');
    difficulty = 1600;
  } else if (/flow|matching|assignment|delivery|dance|routes ii|puzzle/.test(t) && /graph|advanced|additional|counting|grid puzzle/.test(t)) {
    paradigms.push('Flows / Matching', 'Graph Algorithms');
    algorithms.push('BFS', 'DFS');
    difficulty = 1800;
    complexity = 'O(N²)';
  } else if (/graph|tree|flight|road|planet|cycle|bridge|city|centroid|path|component|course|knight|euler|mst|network|office|forbidden|critical|bus|coloring|prüfer|prufer|traversal/.test(t)) {
    paradigms.push('Graph Algorithms');
    if (/shortest|dijkstra|discount|ticket|boss/.test(t)) {
      algorithms.push('Dijkstra');
      data_structures.push('Priority Queue');
    }
    if (/bfs|labyrinth|monster|room|message|girth|nearest/.test(t)) {
      algorithms.push('BFS');
      data_structures.push('Queue');
    }
    if (/dfs|bridge|articulation|scc|kosaraju|component|cycle/.test(t)) algorithms.push('DFS');
    if (/mst|reparation|construction|edge cost|edge check|edge set/.test(t)) {
      algorithms.push('MST', 'DSU', 'Sorting');
    }
    if (/dsu|union|breakdown|offline|construction/.test(t)) algorithms.push('DSU');
    if (/topo|course|game routes|longest flight/.test(t)) algorithms.push('Topological Sort');
    if (/lca|company|distance queries/.test(t)) algorithms.push('LCA');
    if (/floyd|routes ii|all.pairs/.test(t)) algorithms.push('Floyd-Warshall');
    if (/bellman|high score|negative/.test(t)) algorithms.push('Bellman-Ford');
    if (/centroid|fixed-length/.test(t)) paradigms.push('Divide & Conquer');
    if (/matching/.test(t)) paradigms.push('Dynamic Programming');
    difficulty = 1600;
    complexity = 'O(N + M)';
  } else if (/range|fenwick|segment|query|prefix sum queries|pizzeria|hotel|salary|list removal|distinct values|forest queries|polynomial|copies|xor queries|update/.test(t)) {
    paradigms.push('Ad-Hoc');
    algorithms.push('Segment Tree');
    if (/static.*minimum|rmq|sparse/.test(t)) data_structures.push('Sparse Table');
    if (/fenwick|salary|list|distinct values|forest/.test(t)) data_structures.push('Fenwick Tree');
    if (/xor/.test(t)) algorithms.push('Prefix Sums');
    difficulty = 1600;
  } else if (/sliding window/.test(t)) {
    paradigms.push('Two Pointers');
    data_structures.push('Deque');
    if (/median|cost|mode|mex|distinct/.test(t)) {
      data_structures.push('Ordered Set', 'Priority Queue');
      complexity = 'O(N log N)';
    } else {
      complexity = 'O(N)';
    }
    difficulty = 1400;
  } else if (/dynamic programming|dp|knapsack|tiling|elevator|edit distance|money|removal game|projects|increasing subsequence|digit|counting towers|lcs|mountain|minimal grid/.test(t)) {
    paradigms.push('Dynamic Programming');
    if (/bitmask|elevator|tiling|sos|subset/.test(t)) paradigms.push('Bitmask / Bit DP');
    if (/knapsack|book shop|money/.test(t)) algorithms.push('Knapsack');
    if (/lis|increasing subsequence/.test(t)) algorithms.push('LIS', 'Binary Search');
    if (/d.?c|knuth|squares|houses and schools|monster game/.test(t)) {
      paradigms.push('Divide & Conquer');
      data_structures.push('Deque');
    }
    difficulty = 1600;
    complexity = 'O(N²)';
  } else if (/math|prime|divisor|binomial|fibonacci|nim|grundy|probability|modular|exponent|necklace|grid counting|permutation|christmas|apple|bracket|throwing|stair|game|xor|bit |subset xor|pyramid/.test(t)) {
    paradigms.push('Math / Number Theory');
    if (/prime|divisor|sieve|coprime|mobius/.test(t)) algorithms.push('Sieve');
    if (/bit|xor|sos/.test(t)) paradigms.push('Bitmask / Bit DP');
    if (/nim|grundy|game/.test(t) && !/graph/.test(t)) {
      /* combinatorial game */
    }
    if (/fft|banana|apple|convolution|signal|bit positions/.test(t)) complexity = 'O(N log N)';
    difficulty = 1500;
    complexity = complexity === 'O(N log N)' ? complexity : 'O(N)';
  } else if (/sorting|search|pointer|subarray|playlist|tower|traffic|room|factory|deadline|reading|sum of|nearest smaller|apartments|ferris|movie|collecting|missing coin|nested|josephus|array division/.test(t)) {
    paradigms.push('Greedy');
    if (/binary|factory|array division|multiplication table/.test(t)) {
      paradigms.push('Binary Search on Answer');
      algorithms.push('Binary Search');
    }
    if (/two|sum of two|sum of three|pointer|playlist|subarray sum/.test(t)) paradigms.push('Two Pointers');
    if (/nearest smaller|advertisement|building|histogram/.test(t)) {
      data_structures.push('Monotonic Stack', 'Stack');
    }
    if (/concert|ticket|tower|traffic|room alloc|multiset/.test(t)) {
      data_structures.push('Ordered Set', 'Priority Queue');
    }
    algorithms.push('Sorting');
    difficulty = 1300;
    complexity = 'O(N log N)';
  } else if (/bitwise|xor|bit /.test(t)) {
    paradigms.push('Bitmask / Bit DP', 'Math / Number Theory');
    if (/trie|maximum xor/.test(t)) data_structures.push('Trie');
    difficulty = 1600;
  } else if (/construction|permutation|grid color|tromino|tournament|beautiful/.test(t)) {
    paradigms.push('Ad-Hoc', 'Greedy');
    difficulty = 1500;
  } else if (/counting problems|count /.test(t)) {
    paradigms.push('Dynamic Programming', 'Math / Number Theory');
    difficulty = 1800;
    complexity = 'O(N²)';
  } else if (/advanced techniques|meet in the middle/.test(t)) {
    paradigms.push('Divide & Conquer', 'Brute Force');
    if (/meet/.test(t)) algorithms.push('Meet in the Middle', 'Sorting', 'Binary Search');
    if (/cht|monster|li chao|convex/.test(t)) data_structures.push('Deque');
    if (/treap|cut and paste|reversal/.test(t)) data_structures.push('Deque', 'Stack');
    if (/connectivity|rollback/.test(t)) algorithms.push('DSU');
    difficulty = 1800;
  } else if (/introductory/.test(t)) {
    paradigms.push('Ad-Hoc', 'Brute Force');
    difficulty = 1000;
    complexity = 'O(N)';
  } else {
    paradigms.push('Ad-Hoc');
    difficulty = 1500;
  }

  if (!paradigms.length) paradigms.push('Ad-Hoc');
  return {
    paradigms: [...new Set(paradigms)],
    algorithms: [...new Set(algorithms)],
    data_structures: [...new Set(data_structures)],
    difficulty,
    complexity,
  };
}

const CF_FILLERS: Spec[] = [
  {
    id: 'cf-558c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/558/C',
    difficulty_rating: 1800,
    paradigms: ['Greedy', 'Math / Number Theory'],
    algorithms: ['BFS'],
    data_structures: ['Queue'],
    key_insights: ['All values can be reduced to a common core by /2 and *2; BFS costs on the number line'],
    approach_name: 'Number BFS',
    editorial_summary_md: 'Try each possible final value reachable by shifts; sum min ops from each a_i.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Amr and Chemistry',
      statement_md:
        'You have $n$ positive integers. In one move pick an element and replace it by $\\lfloor x/2 \\rfloor$ or $2x$. Minimize total moves so all elements become equal.',
      input_format_md:
        'First line $n$ ($1 \\le n \\le 10^5$).\n\nSecond line $n$ integers $a_i$ ($1 \\le a_i \\le 10^5$).',
      output_format_md: 'Print the minimum number of moves.',
      constraints_text: '$1 \\le n \\le 10^5$',
      sample_io: [{ input: '3\n4 8 2', output: '2' }],
    },
  },
  {
    id: 'cf-1132f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1132/F',
    difficulty_rating: 1900,
    paradigms: ['Dynamic Programming'],
    algorithms: [],
    data_structures: ['1D Array'],
    key_insights: ['Interval DP: delete a segment of equal letters in one move after clearing insides'],
    approach_name: 'Interval deletion DP',
    editorial_summary_md: 'dp[l][r] min moves to clear s[l..r]; try matching equal endpoints.',
    target_complexity: 'O(N²)',
    offline: {
      title: 'Clear the String',
      statement_md:
        'You have a string. In one move delete a contiguous substring of identical characters. What is the minimum number of moves to delete the whole string?',
      input_format_md: 'First line $n$. Second line the string ($1 \\le n \\le 500$).',
      output_format_md: 'Print the minimum moves.',
      constraints_text: '$1 \\le n \\le 500$',
      sample_io: [{ input: '4\nabba', output: '2' }],
    },
  },
  {
    id: 'cf-321e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/321/E',
    difficulty_rating: 2300,
    paradigms: ['Dynamic Programming', 'Divide & Conquer'],
    algorithms: [],
    data_structures: ['Deque'],
    key_insights: ['D&C DP optimization on grouping people into k contiguous teams'],
    approach_name: 'D&C DP',
    editorial_summary_md: 'dp[k][j]=min i dp[k-1][i]+cost(i+1,j) with monotone opt.',
    target_complexity: 'O(KN log N)',
    offline: {
      title: 'Ciel and Gondolas',
      statement_md:
        'Partition $n$ people in a line into $k$ contiguous gondola groups minimizing the sum of pairwise familiarity costs inside groups.',
      input_format_md: 'First line $n,k$. Then an $n\\times n$ familiarity matrix.',
      output_format_md: 'Print the minimum total cost.',
      constraints_text: '$1 \\le k \\le \\min(n,800)$, $1 \\le n \\le 4000$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1117c',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1117/C',
    difficulty_rating: 1800,
    paradigms: ['Binary Search on Answer', 'Geometry'],
    algorithms: ['Binary Search'],
    data_structures: [],
    key_insights: ['Binary search days; wind prefix must leave a Manhattan remainder ≤ days'],
    approach_name: 'Binary search time',
    editorial_summary_md: 'After t days of cyclic wind, check if remaining distance is achievable.',
    target_complexity: 'O(N log T)',
    offline: {
      title: 'Magic Ship',
      statement_md:
        'A ship starts at $(x1,y1)$ and must reach $(x2,y2)$. Each day wind blows U/D/L/R in a cycle of length $n$, then you may also move one step or stay. Find minimum days or $-1$.',
      input_format_md: 'Coordinates, then $n$ and the wind string.',
      output_format_md: 'Print the minimum days or $-1$.',
      constraints_text: '$1 \\le n \\le 10^5$',
      sample_io: [{ input: '0 0\n4 6\n3\nUUU', output: '5' }],
    },
  },
  {
    id: 'cf-1251d',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1251/D',
    difficulty_rating: 1700,
    paradigms: ['Binary Search on Answer', 'Greedy'],
    algorithms: ['Binary Search', 'Sorting'],
    data_structures: [],
    key_insights: ['Binary search median salary; greedily assign highest possible under budget'],
    approach_name: 'Binary search median',
    editorial_summary_md: 'Check whether a median ≥ x is affordable by forcing enough workers ≥ x.',
    target_complexity: 'O(N log A)',
    offline: {
      title: 'Salary Changing',
      statement_md:
        'You have $n$ (odd) employees with salary ranges $[l_i,r_i]$ and budget $s$. Maximize the median salary.',
      input_format_md: 'Multiple tests with $n,s$ and ranges.',
      output_format_md: 'For each test print the max median.',
      constraints_text: '$1 \\le \\sum n \\le 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-873f',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/873/F',
    difficulty_rating: 2400,
    paradigms: ['String Algorithms'],
    algorithms: ['String Hashing'],
    data_structures: ['Trie'],
    key_insights: ['Suffix automaton / SA counts forbidden-letter substrings maximizing length*occ'],
    approach_name: 'Suffix automaton',
    editorial_summary_md: 'Build SAM on the string with banned positions; maximize len * endpos size.',
    target_complexity: 'O(N)',
    offline: {
      title: 'Forbidden Indices',
      statement_md:
        'Given a string and a binary mask of forbidden starting indices, maximize (substring length) × (number of occurrences that start at allowed indices).',
      input_format_md: 'n, string s, binary string of length n.',
      output_format_md: 'Print the maximum value.',
      constraints_text: '$1 \\le n \\le 2\\cdot 10^5$',
      sample_io: [],
    },
  },
  {
    id: 'cf-1709e',
    source: 'Codeforces',
    url: 'https://codeforces.com/problemset/problem/1709/E',
    difficulty_rating: 2300,
    paradigms: ['Graph Algorithms'],
    algorithms: ['DFS'],
    data_structures: ['Hash Map', 'Ordered Set'],
    key_insights: ['Small-to-large on XOR path hashes to minimize cuts making all path XORs unique'],
    approach_name: 'DSU on tree XOR',
    editorial_summary_md: 'Keep sets of path-XOR from subtree roots; cut when collisions appear.',
    target_complexity: 'O(N log N)',
    offline: {
      title: 'XOR Tree',
      statement_md:
        'A tree with edge XOR weights. You may change any number of edge values. Minimize changes so every simple path has a distinct XOR.',
      input_format_md: 'Tree with n vertices and edge XOR values.',
      output_format_md: 'Print the minimum number of edge changes.',
      constraints_text: '$1 \\le n \\le 10^5$',
      sample_io: [],
    },
  },
];

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function unescapeHtml(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(html: string): string {
  return unescapeHtml(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<span class="math math-inline">([\s\S]*?)<\/span>/gi, (_m, tex) => `$${tex.trim()}$`)
      .replace(/<span class="math math-display">([\s\S]*?)<\/span>/gi, (_m, tex) => `$$${tex.trim()}$$`)
      .replace(/<[^>]+>/g, '')
      .replace(/\r/g, '')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url: string, attempts = 3): Promise<string> {
  let last = '';
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'text/html', 'User-Agent': UA },
        redirect: 'follow',
      });
      if (res.status === 429 || res.status === 403) {
        last = `HTTP ${res.status}`;
        await sleep(800 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    } catch (e) {
      last = e instanceof Error ? e.message : String(e);
      await sleep(600 * (i + 1));
    }
  }
  throw new Error(last || 'fetch failed');
}

function parseCses(html: string): { title: string; body: string } {
  const title = html.match(/<h1>([^<]+)<\/h1>/)?.[1]?.trim() || 'CSES Problem';
  const md = html.match(/<div class="md">([\s\S]*?)<\/div>/)?.[1] || '';
  return { title, body: stripTags(md) };
}

function sectionFromBody(body: string, label: RegExp): string {
  const m = body.match(
    new RegExp(
      `(?:^|\\n)#*\\s*${label.source}\\s*\\n([\\s\\S]*?)(?=\\n#*\\s*(?:Input|Output|Constraints?|Sample|Examples?|Note)\\b|$)`,
      'i',
    ),
  );
  return m?.[1]?.trim().slice(0, 1200) || '';
}

function extractConstraints(body: string): string {
  const c = sectionFromBody(body, /Constraints?/);
  if (c) return c.slice(0, 500);
  const ranges = body.match(/\([^)]{0,50}\d[^)]{0,50}\)/g);
  if (ranges?.length) return ranges.slice(0, 8).join(' ');
  return 'See statement.';
}

function extractSamples(body: string): { input: string; output: string }[] {
  const samples: { input: string; output: string }[] = [];
  const re =
    /Sample Input\s*([\s\S]*?)\s*Sample Output\s*([\s\S]*?)(?=\s*Sample Input\b|\s*Note\b|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) && samples.length < 3) {
    samples.push({ input: m[1].trim(), output: m[2].trim().split(/\n\n/)[0].trim() });
  }
  return samples;
}

function defaultComplexity(raw: string): string {
  if ((COMPLEXITY_OPTIONS as readonly string[]).includes(raw)) return raw;
  if (/2\^N/i.test(raw)) return 'O(2^N)';
  if (/N³/i.test(raw)) return 'O(N³)';
  if (/N²|KN log/i.test(raw)) return 'O(N²)';
  if (/N \+ M/i.test(raw)) return 'O(N + M)';
  if (/log/i.test(raw)) return 'O(N log N)';
  return 'O(N)';
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, i: number) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return out;
}

async function loadCsesCandidates(have: Set<string>, haveTasks: Set<string>): Promise<Spec[]> {
  const html = await fetchText('https://cses.fi/problemset/');
  let section = 'General';
  const re = /<h2>([^<]+)<\/h2>|href="\/problemset\/task\/(\d+)"[^>]*>\s*([^<]+)/g;
  const out: Spec[] = [];
  let m: RegExpExecArray | null;
  const sectionPriority = [
    'Interactive Problems',
    'Geometry',
    'Advanced Techniques',
    'Bitwise Operations',
    'String Algorithms',
    'Advanced Graph Problems',
    'Mathematics',
    'Sliding Window Problems',
    'Range Queries',
    'Dynamic Programming',
    'Graph Algorithms',
    'Counting Problems',
    'Additional Problems I',
    'Additional Problems II',
    'Construction Problems',
    'Tree Algorithms',
    'Sorting and Searching',
    'Introductory Problems',
  ];
  const buckets = new Map<string, Spec[]>();

  while ((m = re.exec(html))) {
    if (m[1]) {
      section = m[1].trim();
      continue;
    }
    const task = m[2]!;
    const title = m[3]!.trim();
    if (haveTasks.has(task)) continue;
    const id = `cses-${slug(title)}`;
    if (have.has(id)) continue;
    const tags = tagsFor(section, title);
    const spec: Spec = {
      id,
      source: 'CSES',
      url: `https://cses.fi/problemset/task/${task}`,
      difficulty_rating: tags.difficulty,
      paradigms: tags.paradigms,
      algorithms: tags.algorithms,
      data_structures: tags.data_structures,
      key_insights: [`CSES ${section}: apply standard techniques for “${title}”.`],
      approach_name: 'Standard approach',
      editorial_summary_md: `Auto-tagged from CSES section “${section}”. Review tags after solving.`,
      target_complexity: tags.complexity,
    };
    const list = buckets.get(section) || [];
    list.push(spec);
    buckets.set(section, list);
  }

  // Round-robin across sections for diversity
  const queues = sectionPriority.map((s) => buckets.get(s) || []).filter((q) => q.length);
  let i = 0;
  while (out.length < TARGET_NEW - CF_FILLERS.length && queues.some((q) => q.length)) {
    const q = queues[i % queues.length]!;
    if (q.length) out.push(q.shift()!);
    i += 1;
    // drop empty
    for (let j = queues.length - 1; j >= 0; j--) if (!queues[j]!.length) queues.splice(j, 1);
  }
  return out;
}

async function buildDraft(spec: Spec): Promise<Draft> {
  if (spec.offline) {
    const o = spec.offline;
    return {
      id: spec.id,
      title: o.title,
      source: spec.source,
      url: spec.url,
      difficulty_rating: spec.difficulty_rating,
      statement_md: o.statement_md,
      input_format_md: o.input_format_md,
      output_format_md: o.output_format_md,
      constraints_text: o.constraints_text,
      sample_io: o.sample_io,
      target_complexity: defaultComplexity(spec.target_complexity),
      approaches: [
        {
          id: `${spec.id}-a1`,
          problem_id: spec.id,
          approach_name: spec.approach_name,
          paradigms: spec.paradigms,
          algorithms: spec.algorithms,
          data_structures: spec.data_structures,
          key_insights: spec.key_insights,
          editorial_summary_md: spec.editorial_summary_md,
        },
      ],
    };
  }
  const html = await fetchText(spec.url);
  const parsed = parseCses(html);
  if (!parsed.body || parsed.body.length < 40) throw new Error('empty body');
  const body = parsed.body;
  return {
    id: spec.id,
    title: parsed.title.trim(),
    source: spec.source,
    url: spec.url,
    difficulty_rating: spec.difficulty_rating,
    statement_md: body,
    input_format_md: sectionFromBody(body, /Input/) || 'See statement.',
    output_format_md: sectionFromBody(body, /Output/) || 'See statement.',
    constraints_text: extractConstraints(body),
    sample_io: extractSamples(body),
    target_complexity: defaultComplexity(spec.target_complexity),
    approaches: [
      {
        id: `${spec.id}-a1`,
        problem_id: spec.id,
        approach_name: spec.approach_name,
        paradigms: spec.paradigms,
        algorithms: spec.algorithms,
        data_structures: spec.data_structures,
        key_insights: spec.key_insights,
        editorial_summary_md: spec.editorial_summary_md,
      },
    ],
  };
}

async function main() {
  const have = existingIds();
  const haveTasks = existingTasks();
  const current = have.size;
  const need = Math.max(0, 550 - current);
  console.log(`Catalog ids=${current}; need ${need} more to reach 550`);

  const cses = await loadCsesCandidates(have, haveTasks);
  const cf = CF_FILLERS.filter((s) => !have.has(s.id));
  const todo = [...cf, ...cses].slice(0, Math.max(need + 5, TARGET_NEW));
  console.log(`Fetching ${todo.length} problems…`);

  const extrasPath = resolve('data/extra-problems.json');
  const extras = (
    Array.isArray(extraJson) ? JSON.parse(JSON.stringify(extraJson)) : []
  ) as Draft[];

  let added = 0;
  let failed = 0;
  const results = await mapPool(todo, 4, async (spec, i) => {
    try {
      await sleep(60 * (i % 8));
      const draft = await buildDraft(spec);
      if ((i + 1) % 15 === 0 || i === todo.length - 1) {
        console.log(`  ${i + 1}/${todo.length} ok ${spec.id}`);
      }
      return { ok: true as const, draft };
    } catch (e) {
      console.warn(`  fail ${spec.id}: ${e instanceof Error ? e.message : e}`);
      return { ok: false as const };
    }
  });

  for (const r of results) {
    if (!r.ok) {
      failed += 1;
      continue;
    }
    if (have.has(r.draft.id)) continue;
    extras.push(r.draft);
    have.add(r.draft.id);
    added += 1;
  }

  writeFileSync(extrasPath, `${JSON.stringify(extras, null, 2)}\n`);
  console.log(`Added ${added}, failed ${failed}, catalog extras now ${extras.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
