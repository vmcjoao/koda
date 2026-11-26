import { LESSONS } from '@/data/learn/lessons';
import { TAG_CATALOG } from '@/constants/tags';
import type { LearnLesson, LearnTagKind } from '@/types/learn';
import type { ProblemWithApproaches } from '@/types/database';
import { todayIso } from '@/lib/habit';

export function listLessons(): LearnLesson[] {
  return LESSONS;
}

export function getLesson(id: string): LearnLesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

/** Other lessons sharing the same catalog tag (e.g. BFS + 0-1 BFS). */
export function relatedLessons(lesson: LearnLesson, limit = 4): LearnLesson[] {
  const kind = lesson.tagKind ?? 'algorithm';
  return LESSONS.filter(
    (l) =>
      l.id !== lesson.id &&
      (l.tagKind ?? 'algorithm') === kind &&
      l.tagLabel === lesson.tagLabel,
  ).slice(0, limit);
}

export function filterLessons(query: string): LearnLesson[] {
  const q = query.trim().toLowerCase();
  if (!q) return LESSONS;
  return LESSONS.filter((l) => {
    const hay = [
      l.title,
      l.tagLabel,
      l.summary,
      l.family,
      l.tagKind ?? 'algorithm',
      l.complexity.time,
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export type LearnUnit = {
  id: string;
  title: string;
  blurb: string;
  lessonIds: string[];
};

/** Duolingo-style curriculum units (sequential unlock). */
export const LEARN_UNITS: LearnUnit[] = [
  {
    id: 'foundations',
    title: 'Unit 1 · Foundations',
    blurb: 'Sort, search, and scan like a contestant.',
    lessonIds: ['sorting', 'binary-search', 'two-pointers', 'prefix-sums'],
  },
  {
    id: 'graph-basics',
    title: 'Unit 2 · Graph basics',
    blurb: 'Walk the graph — BFS, DFS, components.',
    lessonIds: ['bfs', 'dfs', 'dsu', 'topo-sort'],
  },
  {
    id: 'techniques',
    title: 'Unit 3 · Techniques',
    blurb: 'Greedy moves and answer-space search.',
    lessonIds: ['greedy', 'brute-force', 'binary-search-answer', 'divide-conquer'],
  },
  {
    id: 'dp-core',
    title: 'Unit 4 · Dynamic programming',
    blurb: 'States, transitions, and classic patterns.',
    lessonIds: ['dynamic-programming', 'knapsack', 'lis', 'bitmask-dp'],
  },
  {
    id: 'weighted',
    title: 'Unit 5 · Weighted graphs',
    blurb: 'Shortest paths and spanning trees.',
    lessonIds: ['dijkstra', 'bellman-ford', 'mst', 'floyd-warshall'],
  },
  {
    id: 'structures',
    title: 'Unit 6 · Power structures',
    blurb: 'Fenwick, segtree, and monotone tricks.',
    lessonIds: ['fenwick', 'segment-tree', 'monotonic-stack', 'sparse-table'],
  },
  {
    id: 'advanced-graphs',
    title: 'Unit 7 · Advanced graphs',
    blurb: 'Components, cuts, and flows.',
    lessonIds: ['scc', 'bridges', 'max-flow', 'bipartite-matching'],
  },
  {
    id: 'strings',
    title: 'Unit 8 · Strings',
    blurb: 'Prefixes, Z-boxes, and hashing.',
    lessonIds: ['kmp', 'z-algorithm', 'string-hashing', 'trie'],
  },
];

/** Flattened path order used for locks + continue. */
export const STUDY_PATH_IDS: string[] = LEARN_UNITS.flatMap((u) => u.lessonIds);

export function studyPathLessons(): LearnLesson[] {
  return STUDY_PATH_IDS.map((id) => getLesson(id)).filter((l): l is LearnLesson => !!l);
}

/** Next unstudied lesson on the study path (undefined if path cleared). */
export function nextStudyPathLesson(studied: Set<string>): LearnLesson | undefined {
  return studyPathLessons().find((l) => !studied.has(l.id));
}

export function pathIndexOf(lessonId: string): number {
  return STUDY_PATH_IDS.indexOf(lessonId);
}

/** A path node is unlocked if it is the first lesson or the previous path lesson is studied. */
export function isPathLessonUnlocked(lessonId: string, studied: Set<string>): boolean {
  const idx = pathIndexOf(lessonId);
  if (idx < 0) return true; // library lessons always open
  if (idx === 0) return true;
  return studied.has(STUDY_PATH_IDS[idx - 1]!);
}

export function unitProgress(unit: LearnUnit, studied: Set<string>): {
  done: number;
  total: number;
  complete: boolean;
} {
  const total = unit.lessonIds.length;
  const done = unit.lessonIds.filter((id) => studied.has(id)).length;
  return { done, total, complete: done >= total && total > 0 };
}

export function nextPathLessonAfter(lessonId: string): LearnLesson | undefined {
  const idx = pathIndexOf(lessonId);
  if (idx < 0 || idx + 1 >= STUDY_PATH_IDS.length) return undefined;
  return getLesson(STUDY_PATH_IDS[idx + 1]!);
}

/** Primary lesson for a catalog tag label (prefers canonical / first match). */
export function findLessonForTag(
  label: string,
  kind?: LearnTagKind,
): LearnLesson | undefined {
  const needle = label.toLowerCase();
  const pool = kind
    ? LESSONS.filter((l) => (l.tagKind ?? 'algorithm') === kind)
    : LESSONS;
  return (
    pool.find((l) => l.tagLabel.toLowerCase() === needle) ??
    pool.find((l) => {
      const k = l.tagKind ?? 'algorithm';
      return tagAliases(l.tagLabel, k).includes(needle);
    })
  );
}

export type LessonTagLink = {
  label: string;
  kind: LearnTagKind;
  lesson: LearnLesson;
};

/** Map approach tags to lessons for deep-links (deduped by lesson id). */
export function lessonLinksForTags(input: {
  paradigms?: string[];
  algorithms?: string[];
  data_structures?: string[];
}): LessonTagLink[] {
  const out: LessonTagLink[] = [];
  const seen = new Set<string>();
  const push = (label: string, kind: LearnTagKind) => {
    const lesson = findLessonForTag(label, kind);
    if (!lesson || seen.has(lesson.id)) return;
    seen.add(lesson.id);
    out.push({ label, kind, lesson });
  };
  for (const x of input.paradigms ?? []) push(x, 'paradigm');
  for (const x of input.algorithms ?? []) push(x, 'algorithm');
  for (const x of input.data_structures ?? []) push(x, 'data_structure');
  return out;
}

function tagAliases(tagLabel: string, kind: LearnTagKind): string[] {
  const entry = TAG_CATALOG.find((t) => t.kind === kind && t.label === tagLabel);
  const aliases = entry?.aliases ?? [];
  return [tagLabel, ...aliases].map((s) => s.toLowerCase());
}

function problemMatchesLesson(p: ProblemWithApproaches, lesson: LearnLesson): boolean {
  const kind: LearnTagKind = lesson.tagKind ?? 'algorithm';
  const keys = new Set(tagAliases(lesson.tagLabel, kind));
  return p.approaches.some((a) => {
    const field =
      kind === 'paradigm'
        ? a.paradigms
        : kind === 'data_structure'
          ? a.data_structures
          : a.algorithms;
    return (field ?? []).some((x) => keys.has(String(x).toLowerCase()));
  });
}

/** Simple seeded RNG (mulberry32). */
function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleInPlace<T>(arr: T[], rand: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Up to `limit` easier catalog problems for a lesson.
 * Picks randomly among the easiest pool; stable for `dayKey` (default today).
 */
export function pickPracticeProblems(
  lesson: LearnLesson,
  catalog: ProblemWithApproaches[],
  opts?: { limit?: number; dayKey?: string },
): ProblemWithApproaches[] {
  const limit = opts?.limit ?? 3;
  const dayKey = opts?.dayKey ?? todayIso();

  if (lesson.practiceProblemIds?.length) {
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return lesson.practiceProblemIds
      .map((id) => byId.get(id))
      .filter((p): p is ProblemWithApproaches => !!p)
      .slice(0, limit);
  }

  const matched = catalog
    .filter((p) => problemMatchesLesson(p, lesson))
    .sort((a, b) => a.difficulty_rating - b.difficulty_rating);

  if (!matched.length) return [];

  const poolSize = Math.max(6, limit * 3);
  const pool = matched.slice(0, Math.min(poolSize, matched.length));
  const rand = mulberry32(hashSeed(`${lesson.id}:${dayKey}`));
  const copy = [...pool];
  shuffleInPlace(copy, rand);
  return copy.slice(0, Math.min(limit, copy.length));
}
